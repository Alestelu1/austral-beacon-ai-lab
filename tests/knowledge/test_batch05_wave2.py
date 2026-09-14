"""Wave 2 audit controls, offline: no providers, geometry or ingestion.

Run: python -m unittest discover -s tests/knowledge -p test_batch05_wave2.py -v
Prior-wave scope tests remain historical contracts, run at their audited base.
"""
import json
from pathlib import Path
import subprocess
import unittest
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[2]
BASE = '8ce686831f14bed8f9ebb16e1f586cb37004153a'
MANIFEST = 'data/knowledge/batch-05-wave-2-manifest.json'
EXPECTED = {'puerto-yungay', 'rio-bravo', 'bahia-bahamondes',
            'parque-glaciar-rio-mosco', 'parque-nacional-bernardo-ohiggins'}
DEFERRED = {'cerro-torre', 'lago-chico', 'glaciar-chico'}


def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT)


def load(path):
    return json.loads((ROOT / path).read_text())


def walk(obj):
    if isinstance(obj, dict):
        yield obj
        for value in obj.values():
            yield from walk(value)
    elif isinstance(obj, list):
        for value in obj:
            yield from walk(value)


class Wave2(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.m = load(MANIFEST)
        cls.packages = cls.m['canonical_packages']
        cls.graph = load(cls.m['graph_projection'])
        cls.nodes = {n['id']: n for n in cls.graph['nodes']}
        cls.claims = {}
        cls.chunks = []
        for folder in cls.packages.values():
            for c in load(folder + '/claims.json')['claims']:
                if c['id'] in cls.claims:
                    assert cls.claims[c['id']] == c, 'inconsistent shared claim'
                cls.claims[c['id']] = c
            cls.chunks.extend(load(folder + '/chunks.json')['chunks'])

    def test_01_exact_five_packages_and_scope(self):
        self.assertEqual(self.m['base_commit'], BASE)
        self.assertEqual(set(self.packages), EXPECTED)
        baseline = set(git('ls-tree', '-r', '--name-only', BASE).decode().splitlines())
        changed = set(git('diff', '--name-only', BASE).decode().splitlines())
        changed.update(git('ls-files', '--others', '--exclude-standard').decode().splitlines())
        self.assertEqual(changed, set(self.m['created_files']))
        self.assertFalse(changed & baseline, 'all audited files must remain unchanged')
        self.assertEqual(self.m['modified_files'], [])
        for eid, folder in self.packages.items():
            self.assertEqual({p.name for p in (ROOT / folder).iterdir()},
                             {'metadata.json', 'sources.json', 'claims.json',
                              'relationships.json', 'chunks.json', eid + '.mdx'})
            meta = load(folder + '/metadata.json')
            self.assertEqual((meta['id'], meta['status']), (eid, 'canonical'))
            self.assertEqual(self.nodes[eid]['canonical_ref'], folder)
        actual = {str(p.relative_to(ROOT)) for p in (ROOT / 'knowledge-base/entities').rglob('metadata.json')}
        old = {p for p in baseline if p.startswith('knowledge-base/entities/') and p.endswith('/metadata.json')}
        self.assertEqual(actual - old, {p + '/metadata.json' for p in self.packages.values()})

    def test_02_three_deferred_nodes_remain_candidates(self):
        self.assertEqual(set(self.m['deferred_node_ids']), DEFERRED)
        self.assertEqual({n['id'] for n in self.graph['nodes'] if n['status'] == 'candidate'}, DEFERRED)
        for eid in DEFERRED:
            self.assertIsNone(self.nodes[eid]['canonical_ref'])
            self.assertFalse(self.nodes[eid]['public_retrieval_allowed'])
            self.assertFalse(list((ROOT / 'knowledge-base/entities').glob('*/' + eid + '/metadata.json')))

    def test_03_conflicts_preserved_without_selected_values(self):
        p = 'data/verification/campo-hielo-sur-chilean-authority-validation.json'
        self.assertEqual((ROOT / p).read_bytes(), git('show', BASE + ':' + p))
        conflicts = {c['id']: c for c in load(p)['conflicts']}
        for key, values in [('rp6-length', [79.1, 79.3]),
                            ('rio-bravo-villa-ohiggins-distance', [90, 100]),
                            ('mitchell-crossing-duration', [45, 50])]:
            c = conflicts[key]
            self.assertEqual([o['value'] for o in c['observations']], values)
            self.assertIsNone(c['selected_value'])
            self.assertEqual(c['resolution'], 'unresolved')
            self.assertFalse(c['general_embedding_allowed'])
        self.assertIsNone(self.claims['b05w2-006']['selected_value'])
        self.assertEqual(len(self.claims['b05w2-006']['source_ids']), 2)

    def test_04_fact_classes_and_embedding_exclusions(self):
        policy = load(self.m['retrieval_policy'])
        self.assertEqual(set(policy['fact_classes']), {'stable_fact', 'historical_fact',
                         'dynamic_operational_fact', 'conflicted_fact', 'authority_sensitive_fact'})
        for c in self.claims.values():
            self.assertIn(c['fact_class'], policy['fact_classes'])
            self.assertTrue(c['temporal_scope'])
            if c['fact_class'] != 'stable_fact' or c['requires_current_verification']:
                self.assertFalse(c['embedding_eligible'])
                self.assertFalse(c['general_embedding_allowed'])
                self.assertIn('travel-agent', c['blocked_consumers'])
            if c['fact_class'] == 'stable_fact':
                self.assertFalse(c['requires_current_verification'])
                self.assertEqual(c['verification_status'], 'verified')
        self.assertEqual(self.claims['b05w2-015']['fact_class'], 'dynamic_operational_fact')
        self.assertEqual(self.claims['b05w2-021']['fact_class'], 'dynamic_operational_fact')
        self.assertEqual(self.claims['b05w2-004']['project_context']['lifecycle_at_source_date'],
                         'design_submitted_for_evaluation')

    def test_05_no_invented_live_values_or_unconditional_access(self):
        prohibited = {'current_schedule', 'current_fare', 'current_operator', 'current_frequency',
                      'current_departure', 'open_now', 'current_road_status'}
        for c in self.claims.values():
            self.assertEqual(c['operational_status'], 'not_asserted')
            self.assertFalse(prohibited & c.keys())
        policy = load(self.m['retrieval_policy'])
        self.assertEqual(len(policy['live_required_topics']), 11)
        self.assertFalse(policy['live_tools_connected'])
        self.assertEqual(self.claims['b05w2-020']['operational_conditions_claim_ids'], ['b05w2-021'])
        self.assertTrue(self.claims['b05w2-021']['requires_current_verification'])
        for chunk in self.chunks:
            if 'b05w2-020' in chunk['claim_ids']:
                self.assertEqual(chunk['conditions_claim_ids'], ['b05w2-021'])

    def test_06_no_geometry_added(self):
        for path in self.m['created_files']:
            self.assertIn(Path(path).suffix, {'.json', '.md', '.mdx', '.py'})
            if not path.endswith('.json'):
                continue
            for obj in walk(load(path)):
                self.assertNotIn('coordinates', obj)
                self.assertNotIn(obj.get('type'), {'Feature', 'FeatureCollection', 'Point',
                                                 'LineString', 'MultiLineString', 'Polygon', 'MultiPolygon'})
                for key in ('geometry', 'protected_area_geometry', 'international_boundary_geometry'):
                    if key in obj:
                        self.assertIsNone(obj[key])
                if 'geometry_acquisition_authorized' in obj:
                    self.assertFalse(obj['geometry_acquisition_authorized'])

    def test_07_fitz_and_icefield_guards_unchanged(self):
        for eid in ('monte-fitz-roy-chalten', 'campo-de-hielo-sur'):
            folder = 'knowledge-base/entities/geography/' + eid
            paths = git('ls-tree', '-r', '--name-only', BASE, '--', folder, folder + '.mdx').decode().splitlines()
            for p in paths:
                self.assertEqual((ROOT / p).read_bytes(), git('show', BASE + ':' + p))
        meta = load('knowledge-base/entities/geography/monte-fitz-roy-chalten/metadata.json')
        self.assertIsNone(meta['country'])
        self.assertFalse(meta['territorial_classification_guard']['automatic_country_assignment_allowed'])
        v = load('data/verification/campo-hielo-sur-chilean-authority-validation.json')
        self.assertEqual(v['current_joint_cartographic_execution_status'], 'requires_authoritative_review')

    def test_08_entire_authority_closure_unchanged(self):
        closure = load('data/knowledge/batch-05-authority-closure-manifest.json')
        for p in closure['created_files'] + closure['modified_files']:
            self.assertEqual((ROOT / p).read_bytes(), git('show', BASE + ':' + p), p)

    def test_09_no_vector_ingestion_or_runtime_changes(self):
        self.assertEqual(self.m['vector_ingestion_status'], 'not_performed')
        self.assertFalse(self.m['runtime_consumers_changed'])
        self.assertFalse(self.m['wave_3_started'])
        for chunk in self.chunks:
            self.assertEqual(chunk['vector_ingestion_status'], 'not_performed')
            self.assertFalse(chunk['embedding_ready'])
        self.assertFalse(any(p.startswith(('projects/', 'data/retrieval/')) for p in self.m['created_files']))

    def test_10_igm_products_not_acquired(self):
        p = 'data/geospatial/campo-hielo-sur-igm-product-registry.json'
        self.assertEqual((ROOT / p).read_bytes(), git('show', BASE + ':' + p))
        for product in load(p)['products']:
            self.assertEqual(product['acquisition_status'], 'not_acquired')
            self.assertFalse(product['canonical_geometry_authorized'])

    def test_11_relations_have_consistent_inverses_and_sources(self):
        rels = {r['id']: r for r in self.graph['relations']}
        self.assertEqual(len(rels), 20)
        for r in rels.values():
            self.assertIn(r['source'], self.nodes)
            self.assertIn(r['target'], self.nodes)
            inv = rels[r['inverse_relation_id']]
            self.assertEqual((r['source'], r['target']), (inv['target'], inv['source']))
            self.assertEqual(inv['inverse_relation_id'], r['id'])
            self.assertEqual(r['provenance'], inv['provenance'])
            self.assertTrue(r['claim_ids'])
            self.assertTrue(set(r['claim_ids']) <= self.claims.keys())
            for cid in r['claim_ids']:
                self.assertTrue({r['source'], r['target']} <= set(self.claims[cid]['entity_ids']))
        for eid, folder in self.packages.items():
            expected = [dict(r, target_status='canonical') for r in rels.values() if r['source'] == eid]
            self.assertEqual(load(folder + '/relationships.json')['relationships'], expected)

    def test_12_aliases_are_scoped_not_territorial_merges(self):
        rec = load(self.m['reconciliation_registry'])
        for alias in rec['aliases']:
            self.assertTrue(alias['source_ids'])
            self.assertTrue(alias['provenance'])
            self.assertTrue(alias['scope'])
            self.assertFalse(alias['automatic_identity_merge_allowed'])
            self.assertFalse(alias['territorial_inference_allowed'])
        self.assertEqual(rec['renamed_candidate_ids'][0]['canonical_id'], 'parque-glaciar-rio-mosco')
        self.assertNotIn('parque-glaciar-mosco', self.nodes)
        self.assertEqual(rec['unverified_aliases'][0]['status'], 'requires_source_verification')
        self.assertEqual(load(self.packages['rio-bravo'] + '/metadata.json')['entity_type'], 'ferry_endpoint')

    def test_13_protected_area_and_boundary_layers_separate(self):
        for eid in ('parque-glaciar-rio-mosco', 'parque-nacional-bernardo-ohiggins'):
            meta = load(self.packages[eid] + '/metadata.json')
            self.assertTrue(meta['geometry_layers_must_remain_separate'])
            self.assertIsNone(meta['protected_area_geometry'])
            self.assertIsNone(meta['international_boundary_geometry'])
            self.assertFalse(meta['sovereignty_implication'])
        for obj in load(self.packages['parque-glaciar-rio-mosco'] + '/metadata.json')['related_objects']:
            self.assertFalse(obj['identity_equivalent'])

    def test_14_source_provenance_claims_and_chunks(self):
        for path in self.m['source_records'].values():
            s = load(path)
            self.assertIn(urlparse(s['url']).hostname, {'aysen.mop.gob.cl', 'www.bienesnacionales.cl', 'www.conaf.cl'})
            self.assertEqual(s['source_class'], 'primary_chilean_institutional')
            self.assertFalse(s['land_boundary_status_determination_allowed'])
        for folder in self.packages.values():
            ss = {s['id']: s for s in load(folder + '/sources.json')['sources']}
            for c in load(folder + '/claims.json')['claims']:
                self.assertTrue(set(c['source_ids']) <= ss.keys())
                self.assertFalse(c['sovereignty_implication'])
                for pr in c['provenance']:
                    self.assertIn(pr['source_id'], c['source_ids'])
                    self.assertEqual(pr['source_url'], ss[pr['source_id']]['url'])
                    self.assertTrue(pr.get('locator') or pr.get('pdf_pages'))
                    if 'two printed pages' in pr.get('page_numbering', ''):
                        self.assertEqual(pr['source_id'], 'bienes-nacionales-parque-glaciar-mosco')
        for chunk in self.chunks:
            c = self.claims[chunk['claim_ids'][0]]
            self.assertEqual(chunk['text'], c['claim'])
            self.assertEqual(chunk['embedding_eligible'], c['embedding_eligible'])
            self.assertEqual(chunk['provenance'], c['provenance'])

    def test_15_json_unique_keys_and_format(self):
        def unique(pairs):
            result = {}
            for key, value in pairs:
                self.assertNotIn(key, result)
                result[key] = value
            return result
        for p in self.m['created_files']:
            if p.endswith('.json'):
                raw = (ROOT / p).read_text()
                obj = json.loads(raw, object_pairs_hook=unique)
                self.assertEqual(raw, json.dumps(obj, ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    unittest.main()
