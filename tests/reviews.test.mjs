import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {commitReview,copy,openReviews,reviewKey} from '../src/domain.mjs';
import {scenario} from './helpers.mjs';

function partial(command,decision){return {...copy(command),actionId:randomUUID(),mode:'partial',confirmCompleted:false,decisions:[decision]};}
function advance(draft,workspace,actionId){const a=workspace.actions[actionId];draft.baseStorageRevision=a.storageRevision;draft.savedProposalIds=[...(draft.savedProposalIds??[]),...a.savedProposalIds];}
test('partial saves only accepted changes, not final review; own draft continues and finalization includes earlier receipts',()=>{
  const {workspace,draft,command}=scenario();
  const p=partial(command,command.decisions[0]),first=commitReview(workspace,draft,p),run=first.runs[draft.runId];
  assert.equal(run.caseData.current_fiber_mbps,300);assert.deepEqual(run.caseData.budget_conditions,[]);assert.deepEqual(run.caseData.offer_interest,[]);
  assert.equal(run.reviewEvents.length,0);assert.equal(openReviews(run).length,1);assert.equal(run.dataVersion,2);
  advance(draft,first,p.actionId);command.baseStorageRevision=first.storageRevision;command.decisions[0].status='saved';
  const done=commitReview(first,draft,command).runs[draft.runId];
  assert.equal(done.reviewEvents[0].acceptedCount,3);assert.equal(done.incorporationReceipts.length,3);assert.equal(openReviews(done).length,0);
  assert.equal(done.reviewEvents[0].conclusion,'Revisado, con incorporaciones');assert.equal(done.dataVersion,3);
});
test('finalization after partial with all others rejected does not claim no changes or create an empty version',()=>{
  const {workspace,draft,command}=scenario(),p=partial(command,command.decisions[0]);
  const first=commitReview(workspace,draft,p);advance(draft,first,p.actionId);
  command.baseStorageRevision=first.storageRevision;command.decisions[0].status='saved';command.decisions[1].status=command.decisions[2].status='rejected';
  const run=commitReview(first,draft,command).runs[draft.runId];
  assert.equal(run.dataVersion,2);assert.equal(run.reviewEvents[0].acceptedCount,1);assert.equal(run.reviewEvents[0].conclusion,'Revisado, con incorporaciones');
});
test('partial cannot save pending/rejected entries, claim completion or forge saved decisions',()=>{
  for(const status of ['pending','rejected','saved']){
    const {workspace,draft,command}=scenario();assert.throws(()=>commitReview(workspace,draft,partial(command,{...command.decisions[0],status})));
  }
  const {workspace,draft,command}=scenario(),p=partial(command,command.decisions[0]);p.confirmCompleted=true;assert.throws(()=>commitReview(workspace,draft,p));
  command.decisions[0].status='saved';assert.throws(()=>commitReview(workspace,draft,command));
});
test('unchanged review records only upon explicit completion, deduplicates reasons and preserves first date',()=>{
  const {workspace,draft,command}=scenario();draft.proposals=[];command.decisions=[];
  command.confirmCompleted=false;assert.throws(()=>commitReview(workspace,draft,command));command.confirmCompleted=true;
  let w=commitReview(workspace,draft,command);const original=copy(w.runs[draft.runId].reviewEvents[0]);
  assert.equal(w.runs[draft.runId].dataVersion,1);assert.deepEqual(w.runs[draft.runId].caseData,workspace.runs[draft.runId].caseData);
  for(const reason of ['', 'Comprobadas las condiciones pendientes', ' COMPROBADAS   LAS CONDICIONES PENDIENTES ', '']){
    draft.baseStorageRevision=w.storageRevision;command.baseStorageRevision=w.storageRevision;command.actionId=randomUUID();command.reason=reason;w=commitReview(w,draft,command);
  }
  const run=w.runs[draft.runId];assert.equal(run.reviewEvents.length,2);assert.deepEqual(run.reviewEvents[0],original);assert.equal(run.dataVersion,1);
  assert.equal(run.caseData.operational_state,'Requiere acción propia');assert.equal(run.caseData.next_movement,'Aclarar las condiciones de la oferta A');
});
test('fresh draft after partial recognizes receipts by effect, independent of wording, and can complete without duplicating',()=>{
  const {workspace,draft,command}=scenario(),p=partial(command,command.decisions[1]);const first=commitReview(workspace,draft,p);
  const fresh=copy(draft);fresh.id=randomUUID();fresh.baseStorageRevision=first.storageRevision;fresh.proposals.forEach(p=>{p.id=randomUUID();p.summary='Paráfrasis sin cambio';});
  const final={...command,draftId:fresh.id,actionId:randomUUID(),baseStorageRevision:first.storageRevision,decisions:fresh.proposals.map((p,i)=>({proposalId:p.id,status:i===1?'accepted':'rejected'}))};
  const run=commitReview(first,fresh,final).runs[draft.runId];assert.equal(run.caseData.budget_conditions.length,1);assert.equal(run.dataVersion,2);assert.equal(run.incorporationReceipts.length,1);assert.equal(run.reviewEvents[0].acceptedCount,1);
  assert.equal(run.incorporationReceipts[0].reviewKey,reviewKey(draft.novelty));
});
test('same source and amount with differing conditions is a conflict, never a duplicate or silent merge',()=>{
  const {workspace,draft,command}=scenario(),p=partial(command,command.decisions[1]);const first=commitReview(workspace,draft,p);
  draft.baseStorageRevision=first.storageRevision;draft.proposals[1].conditions=['Incluye las dos líneas'];
  const again={...p,actionId:randomUUID(),baseStorageRevision:first.storageRevision};
  assert.throws(()=>commitReview(first,draft,again),/condiciones distintas/);
  assert.equal(first.runs[draft.runId].caseData.budget_conditions[0].conditions.length,2);
});
