// Run from any directory: node tests/knowledge/test_travel_agent_wave2_contract.mjs
// --demo prints the structured deterministic result. No npm install is required.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import * as api from './travel_agent_wave2_contract.mjs';
import { runContractCases } from './travel_agent_wave2_cases.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const read = path => readFileSync(resolve(root,path));
const json = path => JSON.parse(read(path).toString('utf8'));
const fixture = json('data/knowledge/travel-agent-wave2-query-contract.json');
const git = (...args) => execFileSync('git',args,{cwd:root,encoding:'utf8'});
const input = {
  graph:json(fixture.inputs.graph),
  packages:fixture.inputs.claim_packages.map(json),
  verification:json(fixture.inputs.verification),
  policy:json(fixture.inputs.policy)
};
const result = runContractCases(api,input,fixture);
console.log(result.count+' pure contract cases passed');

// Independent Git-object checks: compare bytes, not JSON semantics or flags.
const baseline = new Map(git('ls-tree','-r','-z',fixture.base_commit).split('\0')
  .filter(Boolean).map(entry=>{
    const [header,path]=entry.split('\t');
    const [mode,type,sha]=header.split(' ');
    return [path,{mode,type,sha}];
  }));
function unchanged(paths) {
  assert.ok(paths.length>0,'Empty frozen scope');
  for(const path of paths) {
    const entry=baseline.get(path);assert.ok(entry,'Missing baseline: '+path);
    const bytes=read(path);
    const sha=createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0'))
      .update(bytes).digest('hex');
    assert.equal(sha,entry.sha,'Changed bytes: '+path);
  }
}
const closure=json('data/knowledge/batch-05-authority-closure-manifest.json');
unchanged([...closure.created_files,...closure.modified_files]);
console.log('12 Authority Closure byte-identical');
for(const [id,label] of [
  ['monte-fitz-roy-chalten','13 Fitz Roy'],
  ['campo-de-hielo-sur','14 Campo de Hielo Sur']
]) {
  const prefix='knowledge-base/entities/geography/'+id;
  unchanged([...baseline.keys()].filter(p=>p.startsWith(prefix+'/')||p===prefix+'.mdx'));
  console.log(label+' byte-identical');
}
const wave=json('data/knowledge/batch-05-wave-2-manifest.json');
for(const folder of Object.values(wave.canonical_packages))
  unchanged([...baseline.keys()].filter(p=>p.startsWith(folder+'/')));
console.log('18 All five original Wave 2 packages byte-identical');
unchanged([...baseline.keys()].filter(p=>baseline.get(p).type==='blob'));
console.log('All pre-existing repository blobs byte-identical');
const changed=git('diff','--name-only',fixture.base_commit).trim().split('\n').filter(Boolean);
const untracked=git('ls-files','--others','--exclude-standard').trim().split('\n').filter(Boolean);
assert.deepEqual([...new Set([...changed,...untracked])].sort(),[...fixture.created_files].sort());
console.log('Only five authorized new test/fixture/documentation files');
assert.equal(git('diff','--check',fixture.base_commit),'');
assert.equal(read('data/knowledge/travel-agent-wave2-query-contract.json').toString('utf8'),
  JSON.stringify(fixture,null,2)+'\n');
console.log('JSON format and git diff --check passed');
if(process.argv.includes('--demo'))console.log(JSON.stringify(result.demonstration,null,2));
