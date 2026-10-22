// Explicit bounded generation; reuse and verification never call the provider.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
import {Budget,ModelService,buildPayload} from '../src/model.mjs';
import {copy,hash,newRun,validateSource,validateOutput} from '../src/domain.mjs';
import {atomicWrite,readJson} from '../src/store.mjs';
import {getFixture,caseList} from '../src/fixtures.mjs';
import {createApplication} from '../src/server.mjs';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url))),production=path.join(root,'runtime'),runtime=path.join(production,'slice3');
const budget=new Budget(path.join(production,'inference-ledger.json'));
const [phase,id]=process.argv.slice(2);
const capturePath=id=>path.join(runtime,'captures',id+'.json');
const extract=raw=>JSON.parse(raw.output.filter(i=>i.type==='message').flatMap(i=>i.content??[]).filter(c=>c.type==='output_text').map(c=>c.text).join(''));
function context(id){const fixture=getFixture(id);assert.ok(fixture);const run=newRun(fixture),source=validateSource(fixture.novelty),documents=fixture.documents.map(validateSource);return {fixture,run,source,documents,body:buildPayload(run,source,documents)};}
async function capture(id,output,attempt,evidence,extra={}){
  const {run,source,documents,body}=context(id);let contract='PASS',error=null;
  try{validateOutput(output,[...run.sources,source,...documents],run.caseData);}catch(e){contract='FAIL';error=e.message;}
  const value={id,at:new Date().toISOString(),attempt,evidence,requestFingerprint:hash(body),output,contract,error,...extra};
  await atomicWrite(capturePath(id),value);
  console.log(JSON.stringify({id,attempt,contract,error,output},null,2));return value;
}
if(phase==='generate'){
  assert.ok(['C1','C2','C3','C3-P','C4','C5','C1-B','C6-B'].includes(id),'Only one explicitly named pending case');
  // A marker survives failure, preventing an accidental retry from spending another attempt.
  const marker=path.join(runtime,'captures',id+'.started');await fs.mkdir(path.dirname(marker),{recursive:true});
  const handle=await fs.open(marker,'wx');await handle.close();
  const {run,source,documents}=context(id),before=await budget.status();
  assert.ok(before.ratesValid&&before.remainingAttempts>0);
  const model=new ModelService({runtime,apiKey:process.env.OPENAI_API_KEY,budget});
  try{const result=await model.analyze(run,source,documents);await capture(id,result.output,result.attempt,'runtime/slice3/evaluation/'+result.attempt+'.json');}
  catch(e){await atomicWrite(capturePath(id),{id,MODEL:'FAIL',generationError:e.message,at:new Date().toISOString()});console.error(id+': '+e.message);process.exitCode=1;}
  console.log(JSON.stringify({budget:await budget.status()}));
}else if(phase==='reuse'){
  for(const [id,attempt,file,checkpointFile] of [
    ['MAIN','feee5da9-3dae-4a45-a015-ab3d3c6ebac7','runtime/evaluation/feee5da9-3dae-4a45-a015-ab3d3c6ebac7.json','runtime/evaluation/slice1-checkpoint.json'],
    ['C6','bc2e0cc6-5c3a-49cc-a6b9-87b2ad578955','runtime/slice2-c6/evaluation/bc2e0cc6-5c3a-49cc-a6b9-87b2ad578955.json','runtime/slice2-c6/checkpoint.json']]){
    const evidence=await readJson(path.join(root,file)),checkpoint=await readJson(path.join(root,checkpointFile)),{body,source,run}=context(id);
    assert.deepEqual(evidence.novelty,source);assert.deepEqual(checkpoint.run.dataVersions[0].caseData,run.caseData);
    for(const s of run.sources)assert.deepEqual(checkpoint.run.sources.find(x=>x.id===s.id),s);
    for(const key of ['model','instructions','max_output_tokens','service_tier','store','prompt_cache_options'])assert.deepEqual(evidence.raw[key],body[key]);
    assert.deepEqual(evidence.raw.text.format.schema,body.text.format.schema);assert.equal(evidence.raw.reasoning.effort,body.reasoning.effort);assert.equal(evidence.raw.reasoning.mode,body.reasoning.mode);
    await capture(id,extract(evidence.raw),attempt,file,{reused:true,contextVerification:'Original novelty, initial persisted snapshot and baseline sources equal; prompt/schema/model/limits equal. No new inference.'});
  }
}else if(phase==='prepare-recordings'){
  const entries={};for(const {id}of caseList){const c=await readJson(capturePath(id));if(c.contract==='PASS')entries[id]={attempt:c.attempt,requestFingerprint:c.requestFingerprint,output:c.output,evidence:c.evidence};}
  await atomicWrite(path.join(runtime,'recorded-responses.json'),entries);await atomicWrite(path.join(production,'recorded-responses.json'),entries);
  await atomicWrite(path.join(root,'devpost','evidence-model-slice3.json'),{purpose:'Salidas estructuradas originales de pruebas ficticias; no son hechos aprobados ni valoraciones del participante. Sin razonamiento interno ni credenciales.',cases:entries});
  console.log(JSON.stringify({recorded:Object.keys(entries),budget:await budget.status()}));
}else if(phase==='verify'){
  // Isolated HTTP runs use ORIGINAL registered outputs. These are GUARDS tests, not new MODEL evidence.
  const frozen=await budget.status();
  const noInference={budget,analyze:async()=>assert.fail('Verification cannot call a model')};
  const app=await createApplication({runtime,modelService:noInference}),base=await app.listen(4321);
  const token=(await(await fetch(base+'/api/session')).json()).token;
  const request=async(route,data)=>{const r=await fetch(base+'/api/'+route,data===undefined?{}:{method:'POST',headers:{Origin:base,'X-Review-Token':token,'Content-Type':'application/json'},body:JSON.stringify(data)});return {status:r.status,value:await r.json()};};
  const ok=async(route,data)=>{const r=await request(route,data);assert.ok(r.status<300,r.value.error);return r.value;};
  const evidence=[];
  try{
    for(const {id}of caseList){
      const capture=await readJson(capturePath(id));if(capture.contract!=='PASS'){evidence.push({id,GUARDS:'NOT RUN',reason:'Original output unusable'});continue;}
      for(const treatment of ['reject','accept']){
        const f=getFixture(id),initial=await ok('run',{fixtureId:id});
        const d=(await ok('recorded',{runId:initial.run.id,baseStorageRevision:initial.storageRevision,source:f.novelty,documents:f.documents})).draft;
        assert.equal(d.origin,'recorded_model');assert.deepEqual(d.proposals.map(({id,...p})=>p),capture.output.proposals);
        assert.deepEqual((await ok('run')).run,initial.run,'Generating or selecting without save changes nothing');
        const command={draftId:d.id,actionId:randomUUID(),baseStorageRevision:d.baseStorageRevision,mode:'finalize',confirmCompleted:true,
          decisions:d.proposals.map(p=>({proposalId:p.id,status:treatment==='reject'||(['MAIN','C4'].includes(id)&&p.source_refs.every(r=>r.source_id==='S-BASE-01'))?'rejected':'accepted'}))};
        const pending=copy(command);pending.confirmCompleted=false;assert.equal((await request('commit',pending)).status,400);
        if(d.proposals.length){const unresolved=copy(command);unresolved.decisions[0].status='pending';assert.equal((await request('commit',unresolved)).status,400);}
        assert.deepEqual((await ok('run')).run,initial.run);
        const saved=await ok('commit',command),run=saved.run;
        assert.equal(run.caseData.contract_authorization,initial.run.caseData.contract_authorization);
        assert.equal(run.reviewEvents.length,1);assert.deepEqual((await ok('commit',command)).run,run);
        const approved=command.decisions.filter(p=>p.status==='accepted').length;assert.equal(run.incorporationReceipts.length,approved);
        if(treatment==='reject'){assert.deepEqual(run.caseData,initial.run.caseData);assert.equal(run.dataVersion,1);assert.equal(run.reviewEvents[0].conclusion,'Revisado, sin cambios');}
        else{
          if(['MAIN','C2'].includes(id))assert.equal(run.caseData.current_fiber_mbps,300);
          if(['MAIN','C1'].includes(id)){assert.equal(run.caseData.budget_reference,40);assert.equal(run.caseData.budget_conditions[0].amount,50);assert.deepEqual(run.caseData.budget_conditions[0].conditions,capture.output.proposals.find(p=>p.kind==='conditional_budget').conditions);}
          if(id==='C1-B')assert.equal(run.caseData.budget_reference,45);
          if(id==='C6-B'){assert.notEqual(run.caseData.operational_state,initial.run.caseData.operational_state);assert.notEqual(run.caseData.next_movement,initial.run.caseData.next_movement);}
          else{assert.equal(run.caseData.operational_state,initial.run.caseData.operational_state);assert.equal(run.caseData.next_movement,initial.run.caseData.next_movement);}
          if(id==='C3'){assert.equal(run.caseData.documents[0].source_id,'S-DOC03');assert.equal(run.caseData.documents[0].status,'Recibido, sin validar');assert.deepEqual(run.sources.find(s=>s.id==='S-DOC03'),validateSource(f.documents[0]));assert.equal(run.caseData.budget_reference,40);}
          if(id==='C3-P')assert.equal(run.caseData.documents.length,0);
          if(id==='C5'){assert.deepEqual(run.caseData.offers[0],initial.run.caseData.offers[0]);assert.ok(run.caseData.uncertainties.length);}
          if(id==='C6'){assert.deepEqual(run.caseData,initial.run.caseData);assert.equal(run.dataVersion,1);}
          assert.deepEqual(run.dataVersions[0].caseData,initial.run.caseData);
        }
        const repeated=(await ok('recorded',{runId:run.id,baseStorageRevision:saved.storageRevision,source:f.novelty,documents:f.documents})).draft;
        assert.equal(repeated.origin,'existing_review');
        const again=await ok('commit',{...command,draftId:repeated.id,baseStorageRevision:repeated.baseStorageRevision,actionId:randomUUID(),decisions:[]});assert.deepEqual(again.run,run);assert.equal(again.duplicateReview,true);
        evidence.push({id,treatment,GUARDS:'PASS',runId:run.id,runHash:hash(run),version:run.dataVersion,receipts:run.incorporationReceipts.length,reviews:run.reviewEvents.length,run});
      }
    }
    assert.deepEqual(await budget.status(),frozen);
    await atomicWrite(path.join(runtime,'checkpoint.json'),{pid:process.pid,at:new Date().toISOString(),budget:frozen,evidence});
    console.log(JSON.stringify(evidence.map(({run,...item})=>item),null,2));
  }finally{await app.close();}
}else if(phase==='recovery'){
  const checkpoint=await readJson(path.join(runtime,'checkpoint.json'));assert.notEqual(process.pid,checkpoint.pid);
  const app=await createApplication({runtime,modelService:{budget,analyze:async()=>assert.fail('Recovery cannot call model')}}),base=await app.listen(4321);
  try{
    const workspace=await app.store.read(),view=await(await fetch(base+'/api/run')).json();
    for(const item of checkpoint.evidence.filter(e=>e.run)){assert.deepEqual(workspace.runs[item.runId],item.run);assert.equal(hash(workspace.runs[item.runId]),item.runHash);}
    assert.deepEqual(view.run,workspace.runs[workspace.activeRunId]);assert.deepEqual(await budget.status(),checkpoint.budget);
    const evidence={at:new Date().toISOString(),previousPid:checkpoint.pid,currentPid:process.pid,RECOVERY:'PASS',verifiedRuns:checkpoint.evidence.filter(e=>e.run).length,workspaceHash:hash(workspace),budget:await budget.status()};
    await atomicWrite(path.join(runtime,'recovery.json'),evidence);console.log(JSON.stringify(evidence,null,2));
  }finally{await app.close();}
}else throw Error('Choose generate CASE, reuse, prepare-recordings, verify, or recovery');
