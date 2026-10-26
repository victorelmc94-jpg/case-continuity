import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {getFixture} from '../src/fixtures.mjs';
import {newRun,copy,validateSource,validateOutput,commitReview,hash} from '../src/domain.mjs';
import {WorkspaceStore,atomicWrite} from '../src/store.mjs';
import {contractingInstruction} from '../public/presentation.mjs';
import {prepareDemo} from '../scripts/prepare-demo.mjs';
import {recordedResponse} from '../src/recorded.mjs';
import {temporary,simulatedOutput,fixture} from './helpers.mjs';
const evidence=JSON.parse(await fs.readFile(new URL('../devpost/evidence-pending-actions.json',import.meta.url),'utf8'));
test('captured corrected responses preserve or explicitly replace pending action and survive disk read',async t=>{
  const dir=await temporary(t);
  for(const [id,e]of Object.entries(evidence.cases)){
    const run=newRun(getFixture('R47')),source=validateSource(Object.fromEntries(['id','type','author','sourceDate','text'].map(k=>[k,e.source[k]])));
    const output=validateOutput(e.originalOutput,[...run.sources,source],run.caseData);
    const before=hash(run),workspace={schemaVersion:1,storageRevision:1,activeRunId:run.id,runs:{[run.id]:run},actions:{}};
    const draft={id:randomUUID(),runId:run.id,baseStorageRevision:1,novelty:source,sources:[...run.sources,source],...output,proposals:output.proposals.map(p=>({...p,id:randomUUID()})),consumed:false};
    const command={draftId:draft.id,baseStorageRevision:1,actionId:randomUUID(),mode:'finalize',confirmCompleted:true,decisions:draft.proposals.map(p=>({proposalId:p.id,status:'accepted'}))};
    const changed=commitReview(workspace,draft,command),file=path.join(dir,id+'.json');
    assert.equal(hash(run),before,'Proposals/commit construction must not mutate the original');
    await atomicWrite(file,changed);const recovered=(await new WorkspaceStore(file).read()).runs[run.id];
    assert.deepEqual(recovered,changed.runs[run.id]);
    if(id==='REPLACE')assert.doesNotMatch(recovered.caseData.next_movement,/Aclarar las condiciones de la oferta A/);
    else assert.match(recovered.caseData.next_movement,/Aclarar las condiciones de la oferta A/);
    if(id==='R47'){
      const p=output.proposals.find(p=>p.kind==='offer_interest');
      assert.deepEqual(p.conditions,[],'Keep the original extraction limitation visible');
      assert.equal(recovered.caseData.offer_interest[0].declaration,p.value.text);
      assert.match(p.value.text,/primero quiero comentarlo con mi pareja; no contrates nada todavía/);
      assert.deepEqual(recovered.caseData.offer_interest[0].source_refs,p.source_refs);
      assert.ok(contractingInstruction(recovered));
      assert.equal(recovered.caseData.budget_reference,47);assert.equal(recovered.caseData.current_fiber_mbps,600);assert.equal(recovered.caseData.documents.length,0);
      // Rejecting this same original proposal does not incorporate its interest statement.
      const rejected=copy(command);rejected.actionId=randomUUID();rejected.decisions[draft.proposals.findIndex(p=>p.kind==='offer_interest')].status='rejected';
      assert.equal(commitReview(workspace,draft,rejected).runs[run.id].caseData.offer_interest.length,0);
    }
  }
});
test('conditional budget without structured conditions is rejected, even with a conditional text',()=>{
  const output=simulatedOutput(),run=newRun(fixture),source=validateSource(fixture.novelty);
  output.proposals.find(p=>p.kind==='conditional_budget').conditions=[];
  assert.throws(()=>validateOutput(output,[...run.sources,source],run.caseData),/debe conservar condiciones/);
  assert.equal(run.caseData.budget_reference,40);assert.equal(run.caseData.budget_conditions.length,0);
});
test('fresh no-key demo packages an original response without touching workspace or usage',async t=>{
  const dir=await temporary(t),workspace=path.join(dir,'workspace.json'),ledger=path.join(dir,'inference-ledger.json');
  await fs.writeFile(workspace,'existing workspace');await fs.writeFile(ledger,'existing usage');
  await prepareDemo(dir);await prepareDemo(dir);
  assert.equal(await fs.readFile(workspace,'utf8'),'existing workspace');assert.equal(await fs.readFile(ledger,'utf8'),'existing usage');
  const f=getFixture('R47'),run=newRun(f),result=await recordedResponse(dir,run,validateSource(f.novelty));
  assert.equal(result.origin,'recorded_model');assert.deepEqual(result.output,evidence.cases.R47.originalOutput);
});
