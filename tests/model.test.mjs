import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { Budget, LIMITS, ModelService, buildPayload } from '../src/model.mjs';
import { fixture, scenario, simulatedOutput, temporary } from './helpers.mjs';

const verifiedTime=()=>Date.parse('2026-10-22T20:20:00Z');
const response=value=>({ok:true,json:async()=>value});
test('twelve attempts include errors, persist across restart, and the thirteenth is blocked',async t=>{
  const file=path.join(await temporary(t),'ledger.json'),budget=new Budget(file,verifiedTime);
  for(let i=0;i<12;i++){const id=await budget.reserve();await budget.record(id,{error:'simulated connection failure'});}
  const fresh=new Budget(file,verifiedTime);await assert.rejects(fresh.reserve(),/Límite/);
  const s=await fresh.status();assert.equal(s.attempts,12);assert.equal(s.reservedUsd,0.12);assert.equal(s.unknownUsageAttempts,12);
});
test('expired tariffs and unexpected usage block calls',async t=>{
  const dir=await temporary(t);
  await assert.rejects(new Budget(path.join(dir,'expired.json'),()=>Date.parse(LIMITS.rateExpiresAt)+1).reserve(),/caducado/);
  const b=new Budget(path.join(dir,'bad.json'),verifiedTime);const id=await b.reserve();await b.record(id,{outputTokens:4001});
  await assert.rejects(b.reserve(),/Límite/);
});
test('input above 6000, invalid count and count errors never reach generation, without retries',async t=>{
  for(const count of [{object:'response.input_tokens',input_tokens:6001},{input_tokens:20},null]){
    const runtime=await temporary(t);const calls=[];
    const model=new ModelService({runtime,apiKey:'test-only',budget:new Budget(path.join(runtime,'ledger.json'),verifiedTime),fetchImpl:async(url)=>{calls.push(url);if(count===null)throw Error('network');return response(count);}});
    const {run,draft}=scenario();await assert.rejects(model.analyze(run,draft.novelty));
    assert.deepEqual(calls,['https://api.openai.com/v1/responses/input_tokens']);assert.equal((await model.budget.status()).attempts,1);
  }
});
test('bounded payload uses no tools and pre-count shares instructions, context and schema',async t=>{
  const runtime=await temporary(t),calls=[];
  const model=new ModelService({runtime,apiKey:'test-only',budget:new Budget(path.join(runtime,'ledger.json'),verifiedTime),fetchImpl:async(url,options)=>{
    const body=JSON.parse(options.body);calls.push(body);
    return response(url.endsWith('input_tokens')?{object:'response.input_tokens',input_tokens:2100}:{id:'simulation',model:LIMITS.model,service_tier:'default',status:'completed',usage:{input_tokens:2100,output_tokens:900},output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(simulatedOutput())}]}]});
  }});
  const {run,draft}=scenario(),result=await model.analyze(run,draft.novelty);
  assert.deepEqual(calls[0].text,calls[1].text);assert.equal(calls[0].input,calls[1].input);assert.equal(calls[0].instructions,calls[1].instructions);
  assert.equal(calls[1].max_output_tokens,4000);assert.equal(calls[1].tools,undefined);assert.equal(calls[1].store,false);
  assert.equal(result.costUsd,(2100*0.25+900*0.5)/1e6);
  assert.deepEqual(calls[1].prompt_cache_options,{mode:'explicit',ttl:'30m'});
});
test('oversized contexts and missing credentials fail before consuming an attempt',async t=>{
  const runtime=await temporary(t),budget=new Budget(path.join(runtime,'ledger.json'),verifiedTime);
  const model=new ModelService({runtime,budget,fetchImpl:async()=>{assert.fail('must not call API');}});
  const {run}=scenario();await assert.rejects(model.analyze(run,fixture.novelty),/credencial/);
  run.caseData.needs='x'.repeat(25000);assert.throws(()=>buildPayload(run,fixture.novelty),/24 KiB/);
  assert.equal((await budget.status()).attempts,0);
});
