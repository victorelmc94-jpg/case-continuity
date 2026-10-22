import {labels,monthly,budgetStatement,describeValue,contractingInstruction} from './presentation.mjs';
const $=id=>document.getElementById(id);
const counted=(n,one,many)=>n+' '+(n===1?one:many);
const state={view:null,draft:null,decisions:new Map(),token:null,busy:false,dirty:false,retry:null};
const sourceFields=['source-id','source-date','source-author','source-type','source-text','document-id','document-date','document-author','document-text'];
function showDirty(){ $('unsaved-warning').hidden=!state.dirty; }
const authLabels={explicitly_not_authorized:'No existe autorización para contratar',not_established:'No consta autorización en esta novedad',explicit_authorization_reported:'El modelo interpreta autorización expresa: revisa su fundamento',uncertain:'El modelo considera incierta la autorización'};
function node(tag,text,className){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(className)e.className=className;return e;}
function clear(el){el.replaceChildren();}
function message(text,error=false){$('message').textContent=text;$('message').classList.toggle('error',error);}
function date(t){return new Intl.DateTimeFormat('es-ES',{dateStyle:'medium',timeStyle:'short',timeZone:'Europe/Madrid'}).format(new Date(t));}
async function api(route,body){
  const options=body===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json','X-Review-Token':state.token},body:JSON.stringify(body)};
  const response=await fetch('/api/'+route,options);const value=await response.json();if(!response.ok)throw new Error(value.error??'Operación fallida');return value;
}
function syncSourceUI(){for(const id of sourceFields)$(id).disabled=state.busy||Boolean(state.draft);$('edit-novelty').hidden=!state.draft;$('edit-novelty').disabled=state.busy;showDirty();}
function setBusy(b){state.busy=b;$('analyze').disabled=b||!state.view?.run||state.view.budget.remainingAttempts===0||state.view.budget.blocked||state.view.budget.ratesValid===false;$('recorded').disabled=b||!state.view?.run;$('fixture').disabled=b;$('new-run').disabled=b;$('refresh').disabled=b;$('review-reason').disabled=b;document.querySelectorAll('#proposals button,#proposals input,#proposals textarea,#open-reviews button').forEach(e=>e.disabled=b);syncSourceUI();updateSave();}
async function canDiscard(){
  if(!state.dirty)return true;
  const dialog=$('discard-dialog');
  return new Promise(resolve=>{
    const finish=value=>{dialog.close();resolve(value);};
    $('return-review').onclick=()=>finish(false);$('discard-work').onclick=()=>finish(true);
    dialog.oncancel=event=>{event.preventDefault();finish(false);};dialog.showModal();$('return-review').focus();
  });
}
function quote(ref,parent,sources){
  const source=sources.find(s=>s.id===ref.source_id);
  parent.append(node('p',(source?.author??'Fuente')+' · '+ref.source_id+(source?' · '+source.sourceDate:''),'source-title'));
  parent.append(node('blockquote',ref.quote,'quote'));
}
function fact(list,title,value,important=false){
  const row=node('div',undefined,'fact'+(important?' important':''));
  row.append(node('dt',title),node('dd',value));list.append(row);
  return row.lastChild;
}
function renderReceipt(receipt,sources){
  const p=receipt.proposal,box=node('article',undefined,'source-block change-record');
  box.append(node('h3',labels[p.target]??p.target),node('p','Antes: '+describeValue(p.target,receipt.before),'current'),node('p','Después: '+describeValue(p.target,receipt.after)));
  if(p.conditions.length&&p.target!=='budget_conditions')box.append(node('p','Condiciones: '+p.conditions.join('; ')));
  if(p.uncertainties.length)box.append(node('p','Pendiente de aclarar: '+p.uncertainties.join('; ')));
  box.append(node('small',date(receipt.at)+' · '+(receipt.humanEdited?'Edición humana aceptada':'Propuesta aceptada')));
  for(const ref of p.source_refs)quote(ref,box,sources);
  const technical=node('details',undefined,'technical');technical.append(node('summary','Detalles técnicos de la incorporación'),node('pre',JSON.stringify(receipt,null,2)));box.append(technical);
  return box;
}
function renderCase(){
  const view=state.view;const run=view?.run;clear($('case-data'));clear($('sources'));clear($('versions'));clear($('history'));clear($('open-reviews'));
  $('analyze').disabled=!run||state.busy||view.budget.remainingAttempts===0||view.budget.blocked||view.budget.ratesValid===false;
  if(!$('fixture').options.length)for(const item of view.cases??[{id:'MAIN',label:'Principal'}]){const option=node('option',item.label);option.value=item.id;$('fixture').append(option);}
  if(!run){$('version').textContent='Sin iniciar';$('run-label').textContent='';$('case-data').append(node('p','Inicia una prueba ficticia para empezar.'));return;}
  $('version').textContent='Datos · V'+run.dataVersion;
  $('run-label').textContent=run.caseData.client+' · Prueba '+run.id.slice(0,8);
  const d=run.caseData,list=node('dl');
  fact(list,'Necesidad',d.needs);fact(list,'Fibra actual',d.current_fiber_mbps+' Mb',true);fact(list,'Líneas móviles',String(d.mobile_lines));
  fact(list,'Presupuesto de referencia',monthly(d.budget_reference),true);
  const disposition=fact(list,'Disposición condicionada',d.budget_conditions.map(budgetStatement).join('\n')||'Ninguna incorporada',true);
  for(const item of d.budget_conditions){const conditions=node('ul',undefined,'small');item.conditions.forEach(c=>conditions.append(node('li',c)));disposition.append(conditions);}
  fact(list,'Interés',d.offer_interest.map(i=>i.offer_id+': '+i.declaration).join('\n')||'No incorporado');
  const instruction=contractingInstruction(run),contract=fact(list,'Contratación',instruction?.text??d.contract_authorization,Boolean(instruction));
  if(instruction){instruction.refs.forEach(ref=>quote(ref,contract,run.sources));const technical=node('details');technical.append(node('summary','Límite de contratación en V1'),node('p',d.contract_authorization+'. La aplicación no modifica la autorización contractual.'));contract.append(technical);}
  fact(list,'Estado',d.operational_state);fact(list,'Próximo movimiento',d.next_movement);
  fact(list,'Factura',d.documents.length?d.documents.map(x=>x.status).join(', '):'Pendiente de recibir');
  $('case-data').append(list);
  if(d.uncertainties.length)$('case-data').append(node('p','Dudas: '+d.uncertainties.map(u=>u.text).join('; ')));
  for(const s of run.sources){const box=node('div',undefined,'source-block');box.append(node('p',s.id+' · '+s.author+' · '+s.sourceDate,'source-title'),node('p',s.text,'quote'));$('sources').append(box);}
  for(const receipt of run.incorporationReceipts)$('versions').append(renderReceipt(receipt,run.sources));
  for(const review of view.openReviews??[]){
    const box=node('div',undefined,'open-review');box.append(node('strong','Incorporaciones guardadas; revisión sin finalizar'),node('p',review.sourceId+' · '+counted(review.receiptIds.length,'incorporación','incorporaciones')+'. Lo pendiente del borrador no se conserva al cerrar.'));
    const resume=node('button','Volver a revisar '+review.sourceId,'secondary');resume.onclick=async()=>{if(!await canDiscard())return;resetDraft();fillNovelty(run.sources.find(s=>s.id===review.sourceId),run.sources.filter(s=>(review.documentIds??[]).includes(s.id)));state.dirty=true;showDirty();message('Fuente recuperada. Las decisiones pendientes no se han reconstruido. Analiza para continuar y revisa antes de finalizar.');};box.append(resume);$('open-reviews').append(box);
  }
  if(!run.reviewEvents.length)$('history').append(node('p','No hay revisiones confirmadas.','muted'));
  for(const event of [...run.reviewEvents].reverse()){
    const box=node('div',undefined,'history-entry');box.append(node('strong',event.conclusion),node('small',date(event.at)+' · '+event.reviewer+' · '+event.sourceIds.join(', ')),node('p',counted(event.acceptedCount,'incorporación guardada','incorporaciones guardadas')+' · '+counted(event.rejectedCount,'propuesta rechazada','propuestas rechazadas')));
    if(event.reason)box.append(node('p','Motivo: '+event.reason));
    for(const sourceId of event.sourceIds){const s=run.sources.find(s=>s.id===sourceId);if(s)box.append(node('p','Fuente revisada: '+s.id+' · '+s.author+' · '+s.sourceDate));}
    for(const receiptId of event.receiptIds){const receipt=run.incorporationReceipts.find(r=>r.id===receiptId);if(receipt)box.append(renderReceipt(receipt,run.sources));}
    $('history').append(box);
  }
  const b=view.budget;
  $('budget').textContent=(b.model==='SIMULATED'?'Simulación técnica sin inferencia':'GPT-6 Luna')+' · '+b.attempts+'/'+b.maxAttempts+' intentos · límite total '+b.budgetUsd+' USD · reserva '+b.reservedUsd.toFixed(2)+' USD · estimación máxima del uso conocido '+(Math.ceil(b.knownGenerationCostUsd*1e6)/1e6).toFixed(6)+' USD. '+(!b.ratesValid?'Tarifas caducadas: generación bloqueada.':'Entrada ≤ 6.000 · salida ≤ 4.000 tokens.');
}
function resetDraft(){state.draft=null;state.decisions.clear();state.dirty=false;state.retry=null;$('review-reason').value='';$('review-panel').hidden=true;clear($('proposals'));syncSourceUI();updateSave();}
function fillNovelty(n,documents=[]){$('source-id').value=n.id;$('source-date').value=n.sourceDate;$('source-author').value=n.author;$('source-type').value=n.type;$('source-text').value=n.text;const d=documents[0];for(const [field,key]of [['id','id'],['date','sourceDate'],['author','author'],['text','text']])$('document-'+field).value=d?.[key]??'';$('document-details').open=Boolean(d);}
function updateSave(){
  showDirty();
  const all=state.draft?.proposals??[];
  const reviewed=all.filter(p=>state.decisions.has(p.id)).length;
  const accepted=all.filter(p=>state.decisions.get(p.id)?.status.startsWith('accepted')).length;
  const saved=all.filter(p=>state.decisions.get(p.id)?.status==='saved').length;
  $('decision-count').textContent=reviewed+'/'+all.length+' propuestas revisadas · '+accepted+' aceptadas por guardar · '+saved+' ya guardadas';
  $('commit').disabled=!state.draft||state.busy||reviewed!==all.length;
  $('partial').disabled=!state.draft||state.busy||accepted===0;
  clear($('save-preview'));
  const ul=node('ul');
  for(const p of all){const choice=state.decisions.get(p.id);if(choice?.status.startsWith('accepted'))ul.append(node('li',choice.edit?.summary??p.summary));}
  $('save-preview').append(ul,node('p','Fuentes originales que se archivarán al finalizar: '+[state.draft?.novelty.id,...(state.draft?.documents??[]).map(s=>s.id)].filter(Boolean).join(', '),'small'));
}
function renderDraft(){
  syncSourceUI();
  const draft=state.draft;$('review-panel').hidden=false;clear($('interpretation'));clear($('proposals'));
  $('review-origin').textContent=draft.origin==='recorded_model'?'Respuesta registrada · sin nueva llamada':draft.origin==='existing_review'?'Revisión local · sin consulta':draft.origin==='simulated_controls'?'Simulación de controles':'Nueva interpretación del modelo · sin incorporar';
  const interpretation=node('div',undefined,'interpretation');
  $('interpretation-note').hidden=!draft.interpretation;
  if(draft.interpretation){interpretation.append(node('h3',authLabels[draft.interpretation.authorization]),node('p',draft.interpretation.explanation));draft.interpretation.source_refs.forEach(r=>quote(r,interpretation,draft.sources));}
  else interpretation.append(node('h3','Reapertura de una fuente ya revisada'),node('p','Sin nueva llamada al modelo. Esto no es una nueva evidencia de interpretación.'));
  $('interpretation').append(interpretation);
  if(!draft.proposals.length)$('proposals').append(node('p',draft.no_change_reason??'El modelo no propone incorporaciones. Lee la fuente antes de confirmar.','empty'));
  draft.proposals.forEach((p,index)=>{
    const card=node('article',undefined,'proposal');card.dataset.proposalId=p.id;
    card.append(node('h3',(index+1)+'. '+(labels[p.target]??p.target)),node('p',p.summary));
    card.append(node('p','Ahora guardado: '+describeValue(p.target,state.view.run.caseData[p.target]),'current'));
    if(p.value.number!==null)card.append(node('p','Propuesto: '+p.value.number+(p.target==='current_fiber_mbps'?' Mb':p.target.includes('budget')?' EUR':'')));
    if(p.value.text)card.append(node('p',p.value.text));
    if(p.conditions.length){const ul=node('ul',undefined,'conditions');p.conditions.forEach(c=>ul.append(node('li',c)));card.append(node('strong','Condiciones que deben conservarse'),ul);}
    if(p.uncertainties.length)card.append(node('p','Pendiente de aclarar: '+p.uncertainties.join('; ')));
    const details=node('details');details.open=true;details.append(node('summary','Fundamento en la fuente'));p.source_refs.forEach(r=>quote(r,details,draft.sources));card.append(details);
    const existingDecision=state.decisions.get(p.id);
    if(existingDecision?.status==='saved'){card.className='proposal accepted';card.append(node('strong','Incorporación ya guardada. No se volverá a aplicar.'));$('proposals').append(card);return;}
    const actions=node('div',undefined,'decision-actions'),status=node('p','Pendiente de revisar','small muted');
    const editor=node('div',undefined,'editor');editor.hidden=true;
    const fields={};
    function input(label,value,type='text'){const l=node('label',label);const e=node(type==='textarea'?'textarea':'input');if(type!=='textarea')e.type=type;e.value=value??'';l.append(e);editor.append(l);return e;}
    fields.summary=input('Redacción revisada',p.summary,'textarea');
    if(p.value.number!==null)fields.number=input('Valor numérico',p.value.number,'number');
    if(p.value.text!==null)fields.text=input('Declaración o valor de texto',p.value.text,'textarea');
    if(p.conditions.length)fields.conditions=input('Condiciones: una por línea',p.conditions.join('\n'),'textarea');
    const apply=node('button','Aceptar esta edición');apply.type='button';
    function choose(choice){state.decisions.set(p.id,choice);state.dirty=true;card.className='proposal '+(choice.status==='rejected'?'rejected':'accepted');status.textContent=choice.status==='rejected'?'Revisada: rechazada':choice.status==='accepted_edited'?'Revisada: edición aceptada':'Revisada: aceptada';editor.hidden=true;updateSave();}
    apply.onclick=()=>{const value=structuredClone(p.value);if(fields.number)value.number=Number(fields.number.value);if(fields.text)value.text=fields.text.value;choose({proposalId:p.id,status:'accepted_edited',edit:{summary:fields.summary.value,value,conditions:fields.conditions?fields.conditions.value.split('\n').map(s=>s.trim()).filter(Boolean):structuredClone(p.conditions)}});};
    editor.append(apply);
    for(const [text,handler,cls]of [
      ['Aceptar',()=>choose({proposalId:p.id,status:'accepted'}),''],
      ['Editar',()=>{editor.hidden=!editor.hidden;},'secondary'],
      ['Rechazar',()=>choose({proposalId:p.id,status:'rejected'}),'reject']
    ]){const b=node('button',text,cls);b.type='button';b.onclick=handler;actions.append(b);}
    card.append(actions,status,editor);$('proposals').append(card);
    if(existingDecision){status.textContent=existingDecision.status==='rejected'?'Revisada: rechazada':existingDecision.status==='accepted_edited'?'Revisada: edición aceptada':'Revisada: aceptada';card.className='proposal '+(existingDecision.status==='rejected'?'rejected':'accepted');if(existingDecision.edit){fields.summary.value=existingDecision.edit.summary;if(fields.number)fields.number.value=existingDecision.edit.value.number;if(fields.text)fields.text.value=existingDecision.edit.value.text;if(fields.conditions)fields.conditions.value=existingDecision.edit.conditions.join('\n');}}
  });
  updateSave();
}
$('new-run').onclick=async()=>{if(!await canDiscard())return;setBusy(true);try{state.view=await api('run',{fixtureId:$('fixture').value});resetDraft();renderCase();fillNovelty(state.view.novelty,state.view.documents);message('Prueba nueva e independiente. No se han borrado las anteriores.');}catch(e){message(e.message,true);}finally{setBusy(false);}};
$('refresh').onclick=async()=>{if(!await canDiscard())return;setBusy(true);try{state.view=await api('run');resetDraft();renderCase();message('Lectura nueva del almacenamiento local. Lo pendiente no se ha incorporado.');}catch(e){message(e.message,true);}finally{setBusy(false);}};
for(const id of sourceFields)$(id).addEventListener('input',()=>{if(state.draft){resetDraft();message('Entrada modificada: analiza de nuevo antes de revisar.');}state.dirty=true;showDirty();});
$('edit-novelty').onclick=async()=>{if(!await canDiscard())return;resetDraft();state.dirty=true;message('Propuestas descartadas sin incorporar ni finalizar. Puedes modificar el texto y analizarlo de nuevo.');$('source-text').focus();};
$('review-reason').addEventListener('input',()=>{state.dirty=true;showDirty();});
async function analyze(route){
  if(state.busy)return;
  if(state.draft&&!await canDiscard())return;
  const source={id:$('source-id').value,type:$('source-type').value,author:$('source-author').value,sourceDate:$('source-date').value,text:$('source-text').value};
  const hasDocument=['document-id','document-date','document-author','document-text'].some(id=>$(id).value.trim());
  const documents=hasDocument?[{id:$('document-id').value,type:'document',author:$('document-author').value,sourceDate:$('document-date').value,text:$('document-text').value}]:[];
  resetDraft();state.dirty=true;setBusy(true);message('Preparando la revisión. Si requiere modelo, se contará la entrada antes de generar. Nada se incorpora todavía.');
  try{const result=await api(route,{runId:state.view.run.id,baseStorageRevision:state.view.storageRevision,source,documents});state.draft=result.draft;state.decisions.clear();for(const id of state.draft.savedProposalIds)state.decisions.set(id,{proposalId:id,status:'saved'});state.view.budget=result.budget;state.dirty=true;renderCase();renderDraft();message(result.draft.origin==='existing_review'?'Fuente ya revisada: no se ha consumido otro intento. Confirmar sin información nueva no duplica la anotación.':result.draft.origin==='recorded_model'?'Respuesta real registrada · intento '+result.draft.attempt+'. Sin nueva llamada. Revisa antes de guardar.':result.draft.origin==='simulated_controls'?'Simulación técnica para comprobar controles; no acredita comprensión del modelo.':'Propuestas reales recibidas. Revisa el texto y las citas antes de decidir.');}
  catch(e){message(e.message,true);try{const v=await api('run');state.view.budget=v.budget;renderCase();}catch{}}
  finally{setBusy(false);}
}
$('novelty-form').onsubmit=event=>{event.preventDefault();analyze('analyze');};
$('recorded').onclick=()=>analyze('recorded');
async function save(mode){
  if($(mode==='partial'?'partial':'commit').disabled)return;setBusy(true);
  const decisions=[...state.decisions.values()].filter(d=>mode==='finalize'||d.status.startsWith('accepted'));
  const payload={draftId:state.draft.id,baseStorageRevision:state.draft.baseStorageRevision,mode,confirmCompleted:mode==='finalize',decisions,...(mode==='finalize'?{reason:$('review-reason').value}:{} )};
  const signature=JSON.stringify(payload);const actionId=state.retry?.signature===signature?state.retry.actionId:crypto.randomUUID();state.retry={signature,actionId};
  try{const result=await api('commit',{...payload,actionId});state.view=result;state.retry=null;
    if(mode==='partial'){state.draft=result.draft;for(const id of state.draft.savedProposalIds)state.decisions.set(id,{proposalId:id,status:'saved'});state.dirty=true;renderCase();renderDraft();message('Incorporaciones guardadas y releídas desde disco. La revisión sigue sin finalizar.');}
    else{resetDraft();renderCase();message(result.duplicateReview?'La revisión ya estaba registrada. Se mantiene la anotación original, sin duplicar ni crear versión de datos.':'Revisión finalizada y guardada. El expediente mostrado se ha vuelto a leer desde disco.');}}
  catch(e){message(e.message,true);}
  finally{setBusy(false);}
}
$('partial').onclick=()=>save('partial');$('commit').onclick=()=>save('finalize');
window.addEventListener('beforeunload',event=>{if(state.dirty){event.preventDefault();event.returnValue=true;}});
document.addEventListener('keydown',async event=>{
  if(state.dirty&&(event.key==='F5'||((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='r'))){
    event.preventDefault();if($('discard-dialog').open)return;
    if(await canDiscard()){state.dirty=false;window.location.reload();}
  }
});
try{state.token=(await api('session')).token;state.view=await api('run');renderCase();$('fixture').value=state.view.run?.fixtureId??'MAIN';fillNovelty(state.view.novelty,state.view.documents);setBusy(false);}catch(e){message(e.message,true);}
