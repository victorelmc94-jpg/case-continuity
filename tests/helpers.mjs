import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { copy, newRun, validateSource } from '../src/domain.mjs';

export const fixture=JSON.parse(await fs.readFile(new URL('../fixtures/main.json',import.meta.url),'utf8'));
export async function temporary(t){
  const parent=path.resolve(os.tmpdir()),dir=await fs.mkdtemp(path.join(parent,'novelty-slice1-'));
  t.after(()=>{
    if(path.dirname(path.resolve(dir))!==parent||!path.basename(dir).startsWith('novelty-slice1-'))throw Error('Unsafe test cleanup path');
    return fs.rm(dir,{recursive:true,force:true});
  });
  return dir;
}
// Explicit simulation for storage/approval tests. Never evidence of model interpretation.
export function simulatedOutput(){
  const ref=quote=>[{source_id:fixture.novelty.id,quote}];
  const value=(number=null,text=null,offer_id=null)=>({number,text,document_source_id:null,offer_id,offer:null});
  return {
    interpretation:{authorization:'explicitly_not_authorized',explanation:'Simulación: no contrates todavía.',source_refs:ref('pero no contrates todavía.')},
    proposals:[
      {kind:'fiber_correction',summary:'Rectificar a 300 Mb',target:'current_fiber_mbps',value:value(300),conditions:[],uncertainties:[],source_refs:ref('Corrijo lo de la fibra: tengo 300 Mb.')},
      {kind:'conditional_budget',summary:'Conservar disposición condicionada hasta 50',target:'budget_conditions',value:value(50,'Podría estudiar hasta 50 euros'),conditions:['Incluye las dos líneas','El precio no sube durante doce meses'],uncertainties:['Falta comprobar ambas condiciones de la oferta'],source_refs:ref('Podría estudiar hasta 50 euros si incluye las dos líneas y el precio no sube durante doce meses.')},
      {kind:'offer_interest',summary:'Interés sin autorización',target:'offer_interest',value:value(null,'Interés en A, sin contratar','A'),conditions:[],uncertainties:[],source_refs:ref('La oferta A me interesa, pero no contrates todavía.')}
    ],no_change_reason:null
  };
}
export function scenario(){
  const run=newRun(fixture),novelty=validateSource(fixture.novelty);
  const workspace={schemaVersion:1,storageRevision:1,activeRunId:run.id,runs:{[run.id]:run},actions:{}};
  const draft={id:randomUUID(),runId:run.id,baseStorageRevision:1,novelty,sources:[...run.sources,novelty],...simulatedOutput(),consumed:false};
  draft.proposals=draft.proposals.map(p=>({...p,id:randomUUID()}));
  const command={draftId:draft.id,baseStorageRevision:1,actionId:randomUUID(),mode:'finalize',confirmCompleted:true,decisions:draft.proposals.map(p=>({proposalId:p.id,status:'accepted'}))};
  return {workspace,draft,command,run,copy};
}
