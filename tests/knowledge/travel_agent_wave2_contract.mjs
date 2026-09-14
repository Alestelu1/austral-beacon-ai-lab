// Offline contract harness. No I/O, providers, embeddings or production imports.
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const clone = value => JSON.parse(JSON.stringify(value));
function requireThat(condition, message) {
  if (!condition) throw new Error(message);
}
function normalize(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '');
}
function indexClaims(packages) {
  const index = new Map();
  for (const pack of packages) for (const c of pack.claims) {
    requireThat(!index.has(c.id) || same(index.get(c.id), c), 'Divergent duplicate claim');
    index.set(c.id, c);
  }
  return index;
}
function stable(c) {
  return c && c.fact_class === 'stable_fact' && c.verification_status === 'verified'
    && c.status === 'verified' && c.requires_current_verification === false
    && c.general_embedding_allowed === true && c.embedding_eligible === true
    && c.operational_status === 'not_asserted' && c.sovereignty_implication === false
    && !c.blocked_consumers.includes('travel-agent') && c.source_ids.length > 0
    && c.provenance.length > 0 && c.provenance.every(p => c.source_ids.includes(p.source_id));
}
export function reconstruct(query, input, fixture) {
  requireThat(normalize(query) === normalize(fixture.query), 'Unsupported query intent');
  requireThat(Object.values(fixture.capabilities).every(v => v === false), 'Capability forbidden');
  const { graph, packages, verification, policy } = input;
  const nodes = new Map(graph.nodes.map(n => [n.id, n]));
  // Resolve named canonical nodes from the query; intermediate nodes come from traversal.
  const named = graph.nodes.filter(n => n.status === 'canonical'
    && [n.canonical_name, n.id].some(label => normalize(query).includes(normalize(label))));
  requireThat(named.length === 2, 'Expected two unambiguous named endpoints');
  const origin = named.find(n => n.entity_type === 'transport_locality');
  const destination = named.find(n => n.entity_type === 'settlement');
  requireThat(origin && destination, 'Wrong endpoint identities');
  const claims = indexClaims(packages);
  const validEdge = r => r.status === 'documented'
    && r.operational_status === 'not_asserted' && r.sovereignty_implication === false
    && r.claim_ids.length > 0 && r.claim_ids.every(id => stable(claims.get(id)))
    && r.provenance.length > 0
    && r.claim_ids.every(id => {
      const c = claims.get(id);
      return c.entity_ids.includes(r.source) && c.entity_ids.includes(r.target)
        && r.source_ids.every(s => c.source_ids.includes(s));
    });
  const corridor = graph.relations.filter(r => r.target === origin.id
    && r.predicate === 'connects_with' && validEdge(r)
    && nodes.get(r.source)?.entity_type === 'road_corridor');
  requireThat(corridor.length === 1, 'Missing or ambiguous corridor');
  const allowed = new Set(['connects_by_ferry', 'road_access_context']);
  const queue = [{ node: origin.id, edges: [], visited: [origin.id] }];
  const paths = [];
  while (queue.length) {
    const path = queue.shift();
    if (path.node === destination.id) { paths.push(path.edges); continue; }
    for (const r of graph.relations) {
      if (r.source === path.node && allowed.has(r.predicate) && validEdge(r)
          && !path.visited.includes(r.target)) {
        queue.push({ node: r.target, edges: [...path.edges, r],
          visited: [...path.visited, r.target] });
      }
    }
  }
  requireThat(paths.length === 1, 'Missing or ambiguous documented path');
  const edges = [...corridor, ...paths[0]];
  const route = [edges[0].source, ...edges.map(r => r.target)];
  requireThat(edges.length === 3
    && same(edges.map(r => r.predicate), ['connects_with', 'connects_by_ferry', 'road_access_context']),
  'Unexpected corridor semantics');
  const identity = [...claims.values()].filter(c => stable(c)
    && c.chunk_category === 'identity' && c.entity_ids.includes(origin.id)
    && c.entity_ids.some(id => nodes.get(id)?.entity_type === 'ferry_endpoint'));
  requireThat(identity.length === 1, 'Ferry endpoint identity missing');
  const stableIds = [...new Set([...edges.flatMap(r => r.claim_ids), identity[0].id])].sort();
  const conflictClaims = [...claims.values()].filter(c => c.fact_class === 'conflicted_fact'
    && c.entity_ids.includes(origin.id) && c.entity_ids.includes(destination.id));
  requireThat(conflictClaims.length === 1, 'Expected corridor conflict');
  const conflictClaim = conflictClaims[0];
  requireThat(conflictClaim.selected_value === null && conflictClaim.requires_current_verification
    && conflictClaim.embedding_eligible === false && conflictClaim.general_embedding_allowed === false,
  'Conflict guard weakened');
  // Diagnostic channel only: the source claim remains blocked for production retrieval.
  const conflicts = conflictClaim.conflict_ids.map(id => {
    const c = verification.conflicts.find(x => x.id === id);
    requireThat(c && c.resolution === 'unresolved' && c.selected_value === null
      && c.general_embedding_allowed === false && c.embedding_eligible === false,
    'Conflict resolved or missing');
    requireThat(c.observations.length >= 2
      && new Set(c.observations.map(o => o.value)).size >= 2, 'Alternatives lost');
    requireThat(c.observations.every(o => o.source_ids.length && o.provenance.length),
      'Conflict provenance missing');
    return { id, unit: c.unit, resolution: c.resolution, observations: clone(c.observations) };
  });
  const distance = conflicts.find(c => c.id === 'rio-bravo-villa-ohiggins-distance');
  const duration = conflicts.find(c => c.id === 'mitchell-crossing-duration');
  requireThat(distance && duration && distance.unit === 'km' && duration.unit === 'minute',
    'Wrong conflict quantities');
  requireThat(same(distance.observations.map(o => o.value), [90, 100])
    && same(duration.observations.map(o => o.value), [45, 50]), 'Audited alternatives changed');
  const topics = ['ferry_schedule', 'fare', 'operator', 'service_frequency',
    'suspension', 'road_condition', 'weather'];
  requireThat(topics.every(t => policy.live_required_topics.includes(t))
    && policy.live_tools_connected === false, 'Live fallback incomplete');
  const result = {
    query_type: fixture.query_type, stable_answer_available: true,
    route_context: route, stable_claim_ids: stableIds,
    conflicted_claim_ids: [conflictClaim.id], requires_live_verification: true,
    live_required_topics: topics, must_not_select_conflicted_value: true,
    named_entity_ids: named.map(n => n.id).sort(),
    resolved_entity_ids: route,
    relations_traversed: edges.map(r => ({ id: r.id, source: r.source,
      predicate: r.predicate, target: r.target, claim_ids: clone(r.claim_ids),
      source_ids: clone(r.source_ids), provenance: clone(r.provenance) })),
    stable_evidence: stableIds.map(id => clone(claims.get(id))),
    conflict_diagnostics: { channel: 'offline_guard_only', claim_id: conflictClaim.id,
      source_ids: clone(conflictClaim.source_ids), provenance: clone(conflictClaim.provenance), conflicts },
    live: topics.map(topic => ({ topic, status: 'unavailable_from_static_rag' })),
    capabilities: clone(fixture.capabilities)
  };
  for (const [key, expected] of Object.entries(fixture.expected))
    requireThat(same(result[key], expected), 'Contract mismatch: ' + key);
  const names = route.map(id => nodes.get(id).canonical_name.split(' — ')[0]);
  result.parts = {
    A: names[1] + ' forma parte del corredor de la ' + names[0] + ' hacia ' + names[3]
      + '. Las fuentes documentan conexión por embarcación con ' + names[2]
      + ', extremo del cruce, y acceso terrestre hacia ' + names[3] + '.',
    B: 'Las fuentes conservan discrepancias de '
      + distance.observations.map(o => o.value).join('/') + ' km y '
      + duration.observations.map(o => o.value).join('/')
      + ' minutos para el cruce. No hay valor canónico seleccionado.',
    C: 'Horarios, tarifas, operador actual, frecuencia, suspensiones, estado del camino y clima '
      + 'no están disponibles desde RAG estático y requieren verificación actual antes de viajar.'
  };
  return result;
}
export function validateAnswer(answer, query, input, fixture) {
  // Closed output contract: reject extra keys, selected values, free text and invented live data.
  requireThat(same(answer, reconstruct(query, input, fixture)), 'Unsafe or divergent answer');
  return true;
}
