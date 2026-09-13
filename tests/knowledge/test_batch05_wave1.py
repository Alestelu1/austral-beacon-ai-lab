"""Batch 05 Wave 1 data-contract checks; no network or model provider required.

Run from any directory: python -m unittest discover -s tests/knowledge -p 'test_batch05_wave1.py' -v
"""
import json
from pathlib import Path
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = 'data/knowledge/batch-05-wave-1-manifest.json'


def load(path):
    return json.loads((ROOT / path).read_text())


def permitted_chunk(chunk, claims, sources):
    """Independent safety contract for data marked ready, including source authority."""
    if chunk.get('sensitivity') != 'public_core' or not chunk.get('provenance'):
        return False
    if not chunk.get('claim_ids') or not chunk.get('source_ids') or not chunk.get('qa_review'):
        return False
    for cid in chunk['claim_ids']:
        claim = claims.get(cid)
        if not claim or not claim.get('embedding_eligible') or claim.get('requires_current_verification'):
            return False
        if claim.get('sensitivity') != 'public_core' or claim.get('conflict_ids'):
            return False
        if not set(claim['source_ids']).issubset(chunk['source_ids']):
            return False
    for sid in chunk['source_ids']:
        source = sources.get(sid)
        if not source or source['source_class'] in {'secondary_chilean_specialist_source', 'primary_chilean_legal'}:
            return False
    return not chunk.get('geometry_use_allowed', True)


class Batch05Wave1(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.manifest = load(MANIFEST)
        cls.paths = cls.manifest['canonical_packages']
        cls.claims = {c['id']: c for c in load(cls.manifest['evidence_register'])['claims']}
        cls.sources = {sid: load(p) for sid, p in cls.manifest['source_records'].items()}
        cls.graph = load('data/knowledge/campo-hielo-sur-local-graph.json')

    def test_exact_wave_scope_and_package_completeness(self):
        expected = {'villa-ohiggins', 'campo-de-hielo-sur', 'monte-fitz-roy-chalten', 'lago-ohiggins',
                    'candelario-mansilla', 'glaciar-ohiggins', 'ruta-patrimonial-6'}
        self.assertEqual(set(self.manifest['new_package_ids']), expected)
        self.assertEqual(set(self.paths), expected | {'carretera-austral'})
        for eid in expected:
            p = self.paths[eid]
            for name in ('metadata', 'sources', 'claims', 'relationships', 'chunks'):
                self.assertIsInstance(load(p + '/' + name + '.json'), dict)
            md = load(p + '/metadata.json')
            self.assertEqual(md['id'], eid)
            self.assertEqual(md['status'], 'canonical')
            self.assertIsNone(md['geometry'])
            mdx = ROOT / str(Path(p).parent / (eid + '.mdx'))
            self.assertTrue(mdx.exists())
            text = mdx.read_text()
            self.assertTrue(text.startswith('---\n'))
            self.assertIn('embedding_eligible: false', text.split('---')[1])
        for eid in self.manifest['deferred_node_ids']:
            self.assertFalse(list((ROOT / 'knowledge-base/entities').glob('*/' + eid + '/metadata.json')))

    def test_source_provenance_and_no_duplicate_history_source(self):
        hashes = []
        for sid, source in self.sources.items():
            self.assertEqual(source['source_id'], sid)
            self.assertTrue(source['retrieved_at'])
            if source['drive_file_id']:
                self.assertEqual(len(source['provenance']['sha256']), 64)
                hashes.append(source['provenance']['sha256'])
                self.assertIn(source['drive_file_id'], source['url'])
        self.assertEqual(len(hashes), 6)
        self.assertEqual(len(set(hashes)), 6)
        for eid, path in self.paths.items():
            ss = load(path + '/sources.json')['sources']
            ids = [s['id'] for s in ss]
            self.assertEqual(len(ids), len(set(ids)))
            for c in load(path + '/claims.json')['claims']:
                if not c['id'].startswith('b05-'):
                    continue  # Untouched legacy assertions retain their original shape.
                self.assertIsInstance(c['source_ids'], list)
                self.assertTrue(set(c['source_ids']).issubset(ids))
                self.assertTrue(c['provenance'])
                self.assertEqual(c, self.claims[c['id']])
                for pr in c['provenance']:
                    if 'pdf_pages' in pr:
                        total = self.sources[pr['source_id']]['provenance']['pdf_pages']
                        self.assertTrue(all(1 <= n <= total for n in pr['pdf_pages']))
        sources = load(self.paths['carretera-austral'] + '/sources.json')['sources']
        history = [s for s in sources if s.get('drive_file_id') == '1XQStYiAa-NLw93PjOKJagt-nDObacq-C']
        self.assertEqual(len(history), 1)
        self.assertEqual(history[0]['id'], 'drive-carretera-austral-pdf')
        self.assertEqual(history[0]['published_at'], '2012')
        self.assertEqual(sum(s['id'] == 'sernatur-carretera-austral-aysen' for s in sources), 1)

    def test_embedding_gate_and_rejection_cases(self):
        seen = set()
        for eid, path in self.paths.items():
            for ch in load(path + '/chunks.json')['chunks']:
                if not ch.get('claim_ids') or not any(c.startswith('b05-') for c in ch['claim_ids']):
                    continue
                self.assertTrue(permitted_chunk(ch, self.claims, self.sources), ch['id'])
                self.assertTrue(ch['embedding_ready'])
                self.assertEqual(ch['vector_ingestion_status'], 'not_performed')
                self.assertTrue((ROOT / ch['qa_review']).exists())
                self.assertNotIn(ch['id'], seen)
                seen.add(ch['id'])
                if ch['class'] == 'dated_context':
                    self.assertTrue(ch['source_date'])
                    self.assertTrue(ch['temporal_label'])
        self.assertGreater(len(seen), 0)
        # A forged ready flag must not make operational, legal or secondary evidence eligible.
        for cid in ('b05-011', 'b05-017', 'b05-002', 'b05-legal-01', 'b05-a02', 'b05-007'):
            c = self.claims[cid]
            forged = dict(id='unsafe', sensitivity='public_core', embedding_ready=True,
                          claim_ids=[cid], source_ids=c['source_ids'], provenance=c['provenance'],
                          qa_review=__file__, geometry_use_allowed=False)
            self.assertFalse(permitted_chunk(forged, self.claims, self.sources), cid)
            self.assertFalse(c['embedding_eligible'])
        self.assertEqual(self.manifest['vector_ingestion_status'], 'not_performed')

    def test_conflicting_measurements_remain_unresolved(self):
        conflicts = load('data/verification/campo-hielo-sur-chilean-authority-validation.json')['conflicts']
        expected = {'rp6-length': [79.1, 79.3], 'rio-bravo-villa-ohiggins-distance': [90, 100],
                    'mitchell-crossing-duration': [45, 50]}
        self.assertEqual({c['id'] for c in conflicts}, set(expected))
        for conflict in conflicts:
            self.assertEqual([v['value'] for v in conflict['observations']], expected[conflict['id']])
            self.assertIsNone(conflict['selected_value'])
            self.assertEqual(conflict['resolution'], 'unresolved')
            self.assertEqual(conflict['verification_status'], 'pending')
            self.assertFalse(conflict['general_embedding_allowed'])
            self.assertTrue(conflict['primary_authority_needed'])
            for observation in conflict['observations']:
                self.assertTrue(observation['provenance'])
                self.assertTrue(set(observation['source_ids']).issubset(self.sources))
        computed = next(c for c in conflicts if c['id'] == 'rp6-length')['observations'][1]
        self.assertAlmostEqual(sum(computed['inputs']), computed['value'])
        self.assertIn('not_official', computed['method'])

    def test_territorial_guards_and_no_comparative_gateway(self):
        fitz = load(self.paths['monte-fitz-roy-chalten'] + '/metadata.json')
        guard = fitz['territorial_classification_guard']
        self.assertFalse(guard['automatic_country_assignment_allowed'])
        self.assertFalse(guard['external_dataset_country_inheritance_allowed'])
        self.assertIsNone(fitz['country'])
        self.assertTrue(guard['observation']['observable_from_chilean_route'])
        self.assertFalse(guard['observation']['sovereignty_implication'])
        for source in ('Google Maps', 'OpenStreetMap', 'Wikipedia'):
            self.assertIn(source, guard['prohibited_status_sources'])
        ice = load(self.paths['campo-de-hielo-sur'] + '/metadata.json')['boundary_context']
        self.assertEqual(ice['boundary_status'], 'requires_authoritative_review')
        self.assertFalse(ice['current_bilateral_execution_verified'])
        self.assertIsNone(ice['canonical_boundary_geometry'])
        self.assertFalse(ice['general_embedding_allowed'])
        villa = load(self.paths['villa-ohiggins'] + '/metadata.json')
        self.assertEqual({r['role'] for r in villa['roles']},
                         {'documented_expedition_support_context', 'campo_de_hielo_sur_access_context'})
        self.assertIsNone(villa['comparative_access_ranking'])
        geo = load('data/geospatial/campo-hielo-sur-authoritative-geospatial-plan.json')
        self.assertEqual(geo['verified_geometries'], [])
        self.assertFalse(geo['canonical_boundary_generation_authorized'])

    def test_graph_candidates_and_traceable_edges(self):
        nodes = {n['id']: n for n in self.graph['nodes']}
        self.assertEqual(len(nodes), 16)
        for eid in self.manifest['deferred_node_ids']:
            self.assertEqual(nodes[eid]['status'], 'candidate')
            self.assertIsNone(nodes[eid]['canonical_ref'])
            self.assertFalse(nodes[eid]['public_retrieval_allowed'])
        for r in self.graph['relations']:
            self.assertIn(r['source'], nodes)
            self.assertIn(r['target'], nodes)
            self.assertTrue(set(r['claim_ids']).issubset(self.claims))
            self.assertTrue(set(r['source_ids']).issubset(self.sources))
            self.assertTrue(r['provenance'])
        self.assertEqual(nodes['rio-bravo']['entity_type'], 'unresolved_toponym')

    def test_existing_carretera_content_preserved(self):
        base = self.manifest['base_commit']
        root = self.paths['carretera-austral']
        def old(path):
            return subprocess.check_output(['git', 'show', base + ':' + path], cwd=ROOT, text=True)
        for kind in ('claims', 'chunks'):
            before = json.loads(old(root + '/' + kind + '.json'))[kind]
            after = load(root + '/' + kind + '.json')[kind]
            self.assertEqual(after[:len(before)], before)
        self.assertTrue((ROOT / root / 'carretera-austral.mdx').read_text().startswith(old(root + '/carretera-austral.mdx')))
        before = json.loads(old(root + '/relationships.json'))['relationships']
        after = load(root + '/relationships.json')['relationships']
        self.assertEqual(len(before), len(after))
        for original, current in zip(before, after):
            self.assertTrue(all(current[k] == v for k, v in original.items()))
        self.assertEqual(sum(r['target'] == 'villa-ohiggins' for r in after), 1)


if __name__ == '__main__':
    unittest.main()
