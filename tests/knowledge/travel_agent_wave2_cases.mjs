// Shared pure cases: runnable in Node and an isolated JavaScript runtime.
export function runContractCases(api, input, fixture) {
  const results = [];
  const copy = v => JSON.parse(JSON.stringify(v));
  const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  function check(name, fn) {
    if (fn() !== true) throw new Error('FAILED: ' + name);
    results.push(name);
  }
  function rejects(fn) { try { fn(); return false; } catch { return true; } }
  const query = fixture.query;
  const answer = api.reconstruct(query, input, fixture);
  const accept = a => api.validateAnswer(a, query, input, fixture);
  check('01 entity resolution including inferred intermediate', () =>
    ['puerto-yungay', 'rio-bravo', 'villa-ohiggins'].every(id => answer.resolved_entity_ids.includes(id)));
  check('02 ordered corridor through real relationships', () =>
    equal(answer.route_context, ['carretera-austral','puerto-yungay','rio-bravo','villa-ohiggins'])
    && equal(answer.relations_traversed.map(r => r.id), ['b05w2-rel-01','b05w2-rel-02','b05w2-rel-04']));
  check('03 exact stable claims', () =>
    equal(answer.stable_claim_ids, ['b05w2-001','b05w2-002','b05w2-003','b05w2-005']));
  check('04 conflicted claim diagnostic only', () =>
    equal(answer.conflicted_claim_ids, ['b05w2-006'])
    && answer.conflict_diagnostics.channel === 'offline_guard_only'
    && !answer.stable_evidence.some(c => c.id === 'b05w2-006'));
  check('05 no selected_value in output conflicts', () =>
    !JSON.stringify(answer.conflict_diagnostics).includes('"selected_value"'));
  const conflicts = answer.conflict_diagnostics.conflicts;
  check('06 distance alternatives retained together', () =>
    equal(conflicts[0].observations.map(o => o.value), [90,100]));
  check('07 crossing alternatives retained together', () =>
    equal(conflicts[1].observations.map(o => o.value), [45,50]));
  check('08 live answers unavailable', () =>
    answer.live.every(l => l.status === 'unavailable_from_static_rag' && !('value' in l)));
  check('09 live verification mandatory', () => answer.requires_live_verification === true);
  check('10 complete live topics', () =>
    equal(answer.live_required_topics, ['ferry_schedule','fare','operator','service_frequency',
      'suspension','road_condition','weather']));
  check('11 geometry not read', () => {
    const d=copy(input); d.graph.nodes.forEach(n => Object.defineProperty(n,'geometry',{
      get(){throw new Error('Geometry accessed');}
    }));
    return equal(api.reconstruct(query,d,fixture), answer);
  });
  check('15 no Wave 3', () => answer.capabilities.wave_3_started === false);
  check('16 no embeddings or ingestion', () =>
    answer.capabilities.vector_ingestion === false && answer.capabilities.embeddings_generated === false);
  check('17 no runtime, LLM or live provider', () =>
    ['runtime_consumers_connected','llm_connected','live_api_connected']
      .every(k => answer.capabilities[k] === false));
  check('deterministic repeated composition and immutable inputs', () => {
    const d=copy(input),before=JSON.stringify(d);
    return equal(api.reconstruct(query,d,fixture),answer) && JSON.stringify(d)===before && accept(answer);
  });
  check('typographic query variant', () =>
    equal(api.reconstruct(query.replace('O’Higgins',"O'Higgins"),input,fixture),answer));
  check('unsupported intent rejected', () => rejects(() =>
    api.reconstruct('¿Cuánto cuesta la barcaza hoy?',input,fixture)));
  check('missing ferry edge rejects rather than hardcodes corridor', () => {
    const d=copy(input);d.graph.relations=d.graph.relations.filter(r=>r.id!=='b05w2-rel-02');
    return rejects(()=>api.reconstruct(query,d,fixture));
  });
  check('missing stable claim rejects', () => {
    const d=copy(input);d.packages.forEach(p=>p.claims=p.claims.filter(c=>c.id!=='b05w2-005'));
    return rejects(()=>api.reconstruct(query,d,fixture));
  });
  check('dynamic reclassification rejects', () => {
    const d=copy(input);d.packages.forEach(p=>p.claims.filter(c=>c.id==='b05w2-001')
      .forEach(c=>{c.requires_current_verification=true;c.fact_class='dynamic_operational_fact';}));
    return rejects(()=>api.reconstruct(query,d,fixture));
  });
  check('inconsistent duplicate claim rejects', () => {
    const d=copy(input);d.packages[0].claims[0].claim='Altered';
    return rejects(()=>api.reconstruct(query,d,fixture));
  });
  for (const index of [1,2]) {
    check('selected source conflict rejected '+index,()=>{
      const d=copy(input);d.verification.conflicts[index].selected_value=90;
      return rejects(()=>api.reconstruct(query,d,fixture));
    });
    check('removed alternative rejected '+index,()=>{
      const d=copy(input);d.verification.conflicts[index].observations.pop();
      return rejects(()=>api.reconstruct(query,d,fixture));
    });
  }
  for (const [key,value] of Object.entries({
    selected_value:90,distance_km:90,duration_min:45,current_schedule:'09:00',
    service_frequency:'daily',fare:0,operator:'example',current_availability:true
  })) check('answer injection rejected: '+key,()=>{
    const bad=copy(answer);bad[key]=value;
    return rejects(()=>accept(bad));
  });
  check('live answer value injection rejected',()=>{
    const bad=copy(answer);bad.live[0].value='09:00';return rejects(()=>accept(bad));
  });
  check('single distance in prose rejected',()=>{
    const bad=copy(answer);bad.parts.B='La distancia es 90 km.';return rejects(()=>accept(bad));
  });
  check('single duration in prose rejected',()=>{
    const bad=copy(answer);bad.parts.B='El cruce dura 45 minutos.';return rejects(()=>accept(bad));
  });
  check('invented availability in prose rejected',()=>{
    const bad=copy(answer);bad.parts.C='La barcaza opera hoy.';return rejects(()=>accept(bad));
  });
  check('live topic omission rejected',()=>{
    const bad=copy(answer);bad.live_required_topics.pop();return rejects(()=>accept(bad));
  });
  return { count:results.length, passed:results, demonstration:answer };
}
