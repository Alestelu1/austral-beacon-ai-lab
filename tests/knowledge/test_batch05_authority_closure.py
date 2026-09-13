"""Authority Closure contract against the audited Wave 1 merge; offline, no ingestion.

python -m unittest discover -s tests/knowledge -p 'test_batch05*.py' -v
"""
import json
from pathlib import Path
import subprocess
import unittest
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[2]
BASE = '01baf78d67431fc8fedc60641fb563d0dd9401c9'
MANIFEST = 'data/knowledge/batch-05-authority-closure-manifest.json'
VERIFICATION = 'data/verification/campo-hielo-sur-chilean-authority-validation.json'
GEOPLAN = 'data/geospatial/campo-hielo-sur-authoritative-geospatial-plan.json'
GRAPH = 'data/knowledge/campo-hielo-sur-local-graph.json'


def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT)


def load(path):
    return json.loads((ROOT / path).read_text())


def before(path):
    return json.loads(git('show', BASE + ':' + path))


def walk(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from walk(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk(child)


class AuthorityClosure(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.manifest = load(MANIFEST)
        cls.wave = load('data/knowledge/batch-05-wave-1-manifest.json')
        cls.sources = {sid: load(p) for sid, p in cls.manifest['source_records'].items()}
        cls.evidence = load(cls.manifest['evidence_register'])
        cls.claims = {c['id']: c for c in cls.evidence['claims']}
        cls.registry = load(cls.manifest['product_registry'])
        cls.verification = load(VERIFICATION)

    def test_change_scope_matches_audited_base(self):
        self.assertEqual(self.manifest['base_commit'], BASE)
        base_paths = set(git('ls-tree', '-r', '--name-only', BASE).decode().splitlines())
        actual = set(git('diff', '--name-only', BASE).decode().splitlines())
        actual.update(git('ls-files', '--others', '--exclude-standard').decode().splitlines())
        expected = set(self.manifest['created_files'] + self.manifest['modified_files'])
        self.assertEqual(actual, expected)
        self.assertEqual(actual & base_paths, set(self.manifest['modified_files']))
        self.assertEqual(actual - base_paths, set(self.manifest['created_files']))
        # The modified set must be within the original 63-file Wave 1 change set.
        wave_paths = set(git('diff', '--name-only', BASE + '^1', BASE).decode().splitlines())
        self.assertTrue(set(self.manifest['modified_files']) <= wave_paths)
        self.assertTrue(all((ROOT / p).is_file() for p in expected))
        self.assertTrue(all(Path(p).suffix in {'.json', '.md', '.py'} for p in expected))

    def test_no_new_geometry_or_acquisition(self):
        for path in self.manifest['created_files'] + self.manifest['modified_files']:
            if not path.endswith('.json'):
                continue
            for obj in walk(load(path)):
                self.assertNotIn(obj.get('type'), {'Feature', 'FeatureCollection', 'Point', 'LineString',
                                                 'Polygon', 'MultiPolygon', 'MultiLineString'})
                self.assertNotIn('coordinates', obj)
                for key in ('geometry', 'canonical_boundary_geometry'):
                    if key in obj and obj not in before(GEOPLAN)['required']:
                        self.assertIsNone(obj[key])
                if 'canonical_geometry_authorized' in obj:
                    self.assertFalse(obj['canonical_geometry_authorized'])
                if 'geometry_acquisition_authorized' in obj:
                    self.assertFalse(obj['geometry_acquisition_authorized'])
        plan = load(GEOPLAN)
        self.assertEqual(plan['verified_geometries'], before(GEOPLAN)['verified_geometries'])
        self.assertEqual(plan['verified_geometries'], [])
        self.assertFalse(plan['canonical_boundary_generation_authorized'])

    def test_authority_and_provenance_are_scoped(self):
        for sid, source in self.sources.items():
            self.assertEqual(source['source_id'], sid)
            self.assertEqual(source['source_class'], 'primary_chilean_institutional')
            self.assertIn(urlparse(source['url']).hostname, {'www.igm.cl', 'www.difrol.cl'})
            self.assertFalse(source['land_boundary_status_determination_allowed'])
            self.assertTrue(source['verification_scope'])
            self.assertTrue(source['provenance']['locator'])
            self.assertEqual(source['provenance']['page_numbering'],
                             'not applicable; HTML section/row locator')
            self.assertTrue(set(source['claim_ids']) <= self.claims.keys())
        for claim in self.claims.values():
            self.assertEqual(claim['source_classification'], 'source_documented')
            self.assertTrue(set(claim['source_ids']) <= self.sources.keys())
            self.assertTrue(claim['provenance'])
            self.assertFalse(claim['sovereignty_implication'])
            for pr in claim['provenance']:
                self.assertIn(pr['source_id'], claim['source_ids'])
                self.assertTrue(pr['locator'])
        hierarchy = self.verification['authority_closure']['authority_hierarchy']
        self.assertEqual([x['rank'] for x in hierarchy], list(range(1, 8)))
        self.assertEqual(hierarchy[0]['authorities'], ['MINREL', 'DIFROL'])
        self.assertEqual(hierarchy[-1]['scope'], 'context_only')
        # The patch cannot close secondary AthenaLab assertions with catalogue evidence.
        self.assertEqual(self.verification['verification'], before(VERIFICATION)['verification'])
        self.assertEqual(self.verification['conflicts'], before(VERIFICATION)['conflicts'])

    def test_joint_execution_stays_unverified(self):
        self.assertEqual(self.verification['current_joint_cartographic_execution_status'],
                         'requires_authoritative_review')
        self.assertFalse(self.verification['current_bilateral_execution_verified'])
        self.assertEqual(self.verification['canonical_boundary_geometry_status'], 'not_authorized')
        ice = load(self.wave['canonical_packages']['campo-de-hielo-sur'] + '/metadata.json')
        context = ice['boundary_context']
        self.assertEqual(context['current_joint_cartographic_execution_status'],
                         'requires_authoritative_review')
        for section in context['sector_context']:
            self.assertEqual(section['current_execution_status'], 'requires_authoritative_review')
        campaign = self.sources['igm-campo-hielo-sur-campaign-2025']
        self.assertFalse(campaign['article_full_text_verified'])
        self.assertEqual(campaign['boundary_results_status'], 'requires_authoritative_review')
        self.assertEqual(len(campaign['claim_ids']), 3)
        # New coarse statuses require evidence and cannot imply full-source verification.
        evidence = self.verification['authority_closure']['status_evidence']
        for key in ('legal_instrument_status', 'official_geodetic_activity_2025',
                    'official_igm_mapping_products_available'):
            self.assertEqual(self.verification[key], 'verified')
            self.assertTrue(evidence[key]['claim_ids'])
            self.assertTrue(evidence[key]['scope'])

    def test_fitz_roy_guards_and_entire_package_unchanged(self):
        root = self.wave['canonical_packages']['monte-fitz-roy-chalten']
        for path in (ROOT / root).glob('*.json'):
            rel = str(path.relative_to(ROOT))
            self.assertEqual(path.read_bytes(), git('show', BASE + ':' + rel))
        mdx = str(Path(root).parent / 'monte-fitz-roy-chalten.mdx')
        self.assertEqual((ROOT / mdx).read_bytes(), git('show', BASE + ':' + mdx))
        fitz = load(root + '/metadata.json')
        self.assertIsNone(fitz['country'])
        guard = fitz['territorial_classification_guard']
        self.assertFalse(guard['automatic_country_assignment_allowed'])
        self.assertFalse(guard['external_dataset_country_inheritance_allowed'])
        self.assertFalse(guard['observation']['sovereignty_implication'])

    def test_five_igm_products_not_acquired_and_no_metadata_inheritance(self):
        products = {p['product_id']: p for p in self.registry['products']}
        self.assertEqual(set(products), {'IGM-CAMPOS-HIELO-SUR-250K', 'J113', 'J134', 'J135', 'J136'})
        for p in products.values():
            self.assertEqual(p['producer'], 'Instituto Geográfico Militar de Chile')
            self.assertEqual(p['acquisition_status'], 'not_acquired')
            self.assertEqual(p['license_status'], 'requires_review')
            self.assertIsNone(p['published_license'])
            self.assertEqual(p['geometry_acquisition_status'],
                             'candidate_pending_acquisition_and_license_review')
            self.assertFalse(p['canonical_geometry_authorized'])
            self.assertTrue(p['availability'])
            self.assertTrue(p['provenance'])
        self.assertEqual(products['IGM-CAMPOS-HIELO-SUR-250K']['format'], ['JPG'])
        for pid in ('J113', 'J135', 'J136'):
            p = products[pid]
            self.assertEqual(p['scale'], '1:50000')
            self.assertEqual(p['format'], [])
            for key in ('projection', 'datum', 'utm_zone'):
                self.assertIsNone(p[key])
            self.assertEqual(p['coverage'], [])
        self.assertEqual(products['J134']['datum'], 'SIRGAS (WGS84)')
        self.assertEqual(products['J134']['utm_zone'], 18)
        self.assertIn('SHP', products['J134']['format'])

    def test_no_wave2_or_candidate_promotion(self):
        self.assertFalse(self.manifest['wave_2_started'])
        self.assertEqual(self.manifest['new_canonical_entities'], [])
        self.assertEqual(self.manifest['promoted_candidate_ids'], [])
        self.assertEqual((ROOT / GRAPH).read_bytes(), git('show', BASE + ':' + GRAPH))
        original = set(git('ls-tree', '-r', '--name-only', BASE, '--', 'knowledge-base/entities').decode().splitlines())
        current = {str(p.relative_to(ROOT)) for p in (ROOT / 'knowledge-base/entities').rglob('*') if p.is_file()}
        self.assertEqual(current, original)
        nodes = {n['id']: n for n in load(GRAPH)['nodes']}
        self.assertEqual(self.manifest['deferred_node_ids'], self.wave['deferred_node_ids'])
        self.assertEqual(len(self.manifest['deferred_node_ids']), 8)
        for eid in self.manifest['deferred_node_ids']:
            self.assertEqual(nodes[eid]['status'], 'candidate')
            self.assertIsNone(nodes[eid]['canonical_ref'])

    def test_no_vector_ingestion_or_new_embedding_inputs(self):
        for obj in [self.manifest, self.evidence, self.registry, *self.sources.values(),
                    *self.claims.values(), *self.registry['products']]:
            self.assertFalse(obj['embedding_eligible'])
            self.assertEqual(obj['vector_ingestion_status'], 'not_performed')
        for path in (ROOT / 'knowledge-base').rglob('chunks.json'):
            rel = str(path.relative_to(ROOT))
            self.assertEqual(path.read_bytes(), git('show', BASE + ':' + rel))
        for folder in self.wave['canonical_packages'].values():
            path = folder + '/claims.json'
            previous = before(path)['claims']
            self.assertEqual(load(path)['claims'][:len(previous)], previous)
        frozen = 'knowledge-base/research/batch-05-wave-1-evidence-register.json'
        self.assertEqual((ROOT / frozen).read_bytes(), git('show', BASE + ':' + frozen))

    def test_villa_activity_context_is_not_territorial_or_new_node(self):
        root = self.wave['canonical_packages']['villa-ohiggins']
        current = load(root + '/metadata.json')
        self.assertEqual(current['roles'], before(root + '/metadata.json')['roles'])
        self.assertIsNone(current['comparative_access_ranking'])
        context = load(root + '/relationships.json')['source_contexts'][0]
        self.assertEqual(context['predicate'], 'official_geodetic_activity_context')
        self.assertEqual(context['target_type'], 'source_record')
        self.assertIn(context['target'], self.sources)
        self.assertTrue(set(context['claim_ids']) <= self.claims.keys())
        self.assertFalse(context['sovereignty_implication'])
        self.assertFalse(context['embedding_eligible'])
        self.assertEqual(load(root + '/relationships.json')['relationships'],
                         before(root + '/relationships.json')['relationships'])

    def test_difrol_dates_and_resolution_verification_limits(self):
        maps = self.sources['difrol-official-maps-2026']
        self.assertEqual(maps['published_at'], '2025-12-30')
        self.assertEqual(maps['resource_version'], '2.0')
        self.assertEqual(maps['announcement_2026_status'], 'requires_authoritative_review')
        aero = self.sources['difrol-villa-ohiggins-aeronautical-chart-2025']
        self.assertEqual(aero['resolution_identity_status'], 'verified_in_official_register')
        self.assertEqual(aero['resolution_full_text_status'], 'requires_authoritative_review')
        self.assertEqual(aero['verification_status'], 'qualified')
        self.assertEqual(aero['resolution_number'], '76')
        self.assertEqual(aero['resolution_date'], '2025-06-24')
        self.assertEqual(aero['chart_scale'], '1:500000')
        self.assertEqual(aero['aeronautical_information_year'], 2024)
        self.assertIsNone(aero['resolution_full_text_url'])
        self.assertFalse(aero['land_boundary_status_determination_allowed'])

    def test_json_format_and_unique_keys(self):
        def unique(pairs):
            result = {}
            for key, value in pairs:
                self.assertNotIn(key, result, 'duplicate JSON key: ' + key)
                result[key] = value
            return result
        for path in self.manifest['created_files'] + self.manifest['modified_files']:
            if path.endswith('.json'):
                raw = (ROOT / path).read_text()
                parsed = json.loads(raw, object_pairs_hook=unique)
                self.assertEqual(raw, json.dumps(parsed, ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    unittest.main()
