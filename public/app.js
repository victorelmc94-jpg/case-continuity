const $=id=>document.getElementById(id);
const state={view:null,draft:null,decisions:new Map(),token:null,busy:false,dirty:false};
const labels={current_fiber_mbps:'Fibra declarada',mobile_lines:'Líneas móviles',needs:'Necesidades',budget_reference:'Presupuesto de referencia',operational_state:'Estado operativo',next_movement:'Próximo movimiento',client_preference:'Preferencia del cliente',budget_conditions:'Presupuesto condicionado',documents:'Documentos',offer_interest:'Interés expresado',uncertainties:'Dudas',antecedents:'Antecedentes',offers:'Ofertas'};
const authLabels={explicitly_not_authorized:'No existe autorización para contratar',not_established:'No consta autorización en esta novedad',explicit_authorization_reported:'El modelo interpreta autorización expresa: revisa su fundamento',uncertain:'El modelo considera incierta la autorización'};
function node(tag,text,className){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(className)e.className=className;return e;}
function clear(el){el.replaceChildren();}
function message(text,error=false){$('message').textContent=text;$('message').classList.toggle('error',error);}
function money(n){return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);}
function date(t){return new Intl.DateTimeFormat('es-ES',{dateStyle:'medium',timeStyle:'short',timeZone:'Europe/Madrid'}).format(new Date(t));}
async function api(route,body){
  const options=body===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json','X-Review-Token':state.token},body:JSON.stringify(body)};
  const response=await fetch('/api/'+route,options);const value=await response.json();if(!response.ok)throw new Error(value.error??'Operación fallida');return value;
}
function syncSourceUI(){for(const id of ['source-id','source-date','source-author','source-text'])$(id).disabled=state.busy||Boolean(state.draft);$('edit-novelty').hidden=!state.draft;$('edit-novelty').disabled=state.busy;}
function setBusy(b){state.busy=b;$('analyze').disabled=b||!state.view?.run;$('new-run').disabled=b;$('refresh').disabled=b;document.querySelectorAll('#proposals button,#proposals input,#proposals textarea').forEach(e=>e.disabled=b);syncSourceUI();updateSave();}
function canDiscard(){return !state.dirty||window.confirm('Hay trabajo revisado o texto sin guardar. Aceptar lo descarta; Cancelar vuelve a la revisión. No se marcará como terminada.');}
function quote(ref,parent,sources){
  const source=sources.find(s=>s.id===ref.source_id);
  parent.append(node('p',(source?.author??'Fuente')+' · '+ref.source_id+(source?' · '+source.sourceDate:''),'source-title'));
  parent.append(node('blockquote',ref.quote,'quote'));
}
function summaryValue(value){if(value==null)return 'Sin dato';if(typeof value==='string')return value;if(Array.isArray(value)&&!value.length)return 'Sin incorporaciones';return JSON.stringify(value);}
function fact(list,title,value,important=false){
  const row=node('div',undefined,'fact'+(important?' important':''));
  row.append(node('dt',title),node('dd',value));list.append(row);
}
function renderCase(){
  const view=state.view;const run=view?.run;clear($('case-data'));clear($('sources'));clear($('versions'));clear($('history'));
  $('analyze').disabled=!run||state.busy;
  if(!run){$('version').textContent='Sin iniciar';$('run-label').textContent='';$('case-data').append(node('p','Inicia una prueba ficticia para empezar.'));return;}
  $('version').textContent='Datos · V'+run.dataVersion;
  $('run-label').textContent=run.caseData.client+' · Prueba '+run.id.slice(0,8);
  const d=run.caseData,list=node('dl');
  fact(list,'Necesidad',d.needs);fact(list,'Fibra actual',d.current_fiber_mbps+' Mb',true);fact(list,'Líneas móviles',String(d.mobile_lines));
  fact(list,'Presupuesto de referencia',money(d.budget_reference)+'/mes',true);
  const cond=d.budget_conditions.map(c=>money(c.amount)+' si '+c.conditions.join(' y '));
  fact(list,'Disposición condicionada',cond.join('\n')||'Ninguna incorporada',true);
  fact(list,'Interés',d.offer_interest.map(i=>i.offer_id+': '+i.declaration).join('\n')||'No incorporado');
  fact(list,'Contratación',d.contract_authorization);
  fact(list,'Estado',d.operational_state);fact(list,'Próximo movimiento',d.next_movement);
  fact(list,'Factura',d.documents.length?d.documents.map(x=>x.status).join(', '):'Pendiente de recibir');
  $('case-data').append(list);
  if(d.uncertainties.length)$('case-data').append(node('p','Dudas: '+d.uncertainties.map(u=>u.text).join('; ')));
  for(const s of run.sources){const box=node('div',undefined,'source-block');box.append(node('p',s.id+' · '+s.author+' · '+s.sourceDate,'source-title'),node('p',s.text,'quote'));$('sources').append(box);}
  for(const receipt of run.incorporationReceipts){const box=node('div',undefined,'source-block');box.append(node('p',(labels[receipt.proposal.target]??receipt.proposal.target)+': '+summaryValue(receipt.before)+' → '+summaryValue(receipt.after)),node('p',receipt.humanEdited?'Redacción editada por la persona':'Propuesta aceptada sin editar','small muted'));if(receipt.proposal.uncertainties.length)box.append(node('p','Pendiente de aclarar: '+receipt.proposal.uncertainties.join('; ')));for(const ref of receipt.proposal.source_refs)quote(ref,box,run.sources);$('versions').append(box);}
  if(!run.reviewEvents.length)$('history').append(node('p','No hay revisiones confirmadas.','muted'));
  for(const event of [...run.reviewEvents].reverse()){const box=node('div',undefined,'history-entry');box.append(node('strong',event.conclusion),node('small',date(event.at)+' · '+event.reviewer+' · '+event.sourceIds.join(', ')),node('p',event.acceptedCount+' incorporaciones aceptadas · '+event.rejectedCount+' rechazadas'));$('history').append(box);}
  const b=view.budget;
  $('budget').textContent='GPT-6 Luna · '+b.attempts+'/12 intentos · reserva '+b.reservedUsd.toFixed(2)+' USD · estimación máxima del uso conocido '+b.knownGenerationCostUsd.toFixed(6)+' USD. '+(!b.ratesValid?'Tarifas caducadas: generación bloqueada.':'Entrada ≤ 6.000 · salida ≤ 4.000 tokens.');
}
function resetDraft(){state.draft=null;state.decisions.clear();state.dirty=false;$('review-panel').hidden=true;clear($('proposals'));syncSourceUI();updateSave();}
function fillNovelty(n){$('source-id').value=n.id;$('source-date').value=n.sourceDate;$('source-author').value=n.author;$('source-text').value=n.text;}
function updateSave(){
  const all=state.draft?.proposals??[];
  const reviewed=all.filter(p=>state.decisions.has(p.id)).length;
  const accepted=all.filter(p=>state.decisions.get(p.id)?.status.startsWith('accepted')).length;
  $('decision-count').textContent=reviewed+'/'+all.length+' propuestas revisadas · '+accepted+' aceptadas';
  $('commit').disabled=!state.draft||state.busy||reviewed!==all.length;
  clear($('save-preview'));
  const ul=node('ul');
  for(const p of all){const choice=state.decisions.get(p.id);if(choice?.status.startsWith('accepted'))ul.append(node('li',choice.edit?.summary??p.summary));}
  $('save-preview').append(ul,node('p','Fuente original que se archivará: '+(state.draft?.novelty.id??'—'),'small'));
}
function renderDraft(){
  syncSourceUI();
  const draft=state.draft;$('review-panel').hidden=false;clear($('interpretation'));clear($('proposals'));
  const interpretation=node('div',undefined,'interpretation');
  interpretation.append(node('h3',authLabels[draft.interpretation.authorization]),node('p',draft.interpretation.explanation));
  draft.interpretation.source_refs.forEach(r=>quote(r,interpretation,draft.sources));$('interpretation').append(interpretation);
  if(!draft.proposals.length)$('proposals').append(node('p',draft.no_change_reason??'El modelo no propone incorporaciones. Lee la fuente antes de confirmar.','empty'));
  draft.proposals.forEach((p,index)=>{
    const card=node('article',undefined,'proposal');card.dataset.proposalId=p.id;
    card.append(node('h3',(index+1)+'. '+(labels[p.target]??p.target)),node('p',p.summary));
    card.append(node('p','Antes: '+summaryValue(state.view.run.caseData[p.target]),'current'));
    if(p.value.number!==null)card.append(node('p','Propuesto: '+p.value.number+(p.target==='current_fiber_mbps'?' Mb':p.target.includes('budget')?' EUR':'')));
    if(p.value.text)card.append(node('p',p.value.text));
    if(p.conditions.length){const ul=node('ul',undefined,'conditions');p.conditions.forEach(c=>ul.append(node('li',c)));card.append(node('strong','Condiciones que deben conservarse'),ul);}
    if(p.uncertainties.length)card.append(node('p','Pendiente de aclarar: '+p.uncertainties.join('; ')));
    const details=node('details');details.open=true;details.append(node('summary','Fundamento en la fuente'));p.source_refs.forEach(r=>quote(r,details,draft.sources));card.append(details);
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
  });
  updateSave();
}
$('new-run').onclick=async()=>{if(!canDiscard())return;setBusy(true);try{state.view=await api('run',{});resetDraft();renderCase();fillNovelty(state.view.novelty);message('Prueba nueva e independiente. No se han borrado las anteriores.');}catch(e){message(e.message,true);}finally{setBusy(false);}};
$('refresh').onclick=async()=>{if(!canDiscard())return;try{state.view=await api('run');resetDraft();renderCase();message('Lectura nueva del almacenamiento local. Lo pendiente no se ha incorporado.');}catch(e){message(e.message,true);}};
for(const id of ['source-id','source-date','source-author','source-text'])$(id).addEventListener('input',()=>{if(state.draft){resetDraft();message('Entrada modificada: analiza de nuevo antes de revisar.');}state.dirty=true;});
$('edit-novelty').onclick=()=>{if(!canDiscard())return;resetDraft();state.dirty=true;message('Propuestas descartadas sin incorporar ni finalizar. Puedes modificar el texto y analizarlo de nuevo.');$('source-text').focus();};
$('novelty-form').onsubmit=async event=>{
  event.preventDefault();if(state.busy)return;
  if(state.draft&&!canDiscard())return;
  const source={id:$('source-id').value,type:'human_note',author:$('source-author').value,sourceDate:$('source-date').value,text:$('source-text').value};
  setBusy(true);message('Contando entrada y consultando el modelo. Todavía no se ha incorporado nada.');
  try{const result=await api('analyze',{runId:state.view.run.id,baseStorageRevision:state.view.storageRevision,source});state.draft=result.draft;state.decisions.clear();state.view.budget=result.budget;state.dirty=true;renderCase();renderDraft();message('Propuestas reales recibidas. Revisa el texto y las citas antes de decidir.');}
  catch(e){message(e.message,true);try{const v=await api('run');state.view.budget=v.budget;renderCase();}catch{}}
  finally{setBusy(false);}
};
$('commit').onclick=async()=>{
  if($('commit').disabled)return;setBusy(true);
  const command={draftId:state.draft.id,baseStorageRevision:state.view.storageRevision,actionId:crypto.randomUUID(),mode:'finalize',confirmCompleted:true,decisions:[...state.decisions.values()]};
  try{state.view=await api('commit',command);resetDraft();renderCase();message('Revisión confirmada y guardada. El expediente mostrado se ha vuelto a leer desde disco.');}
  catch(e){message(e.message,true);}
  finally{setBusy(false);}
};
window.addEventListener('beforeunload',event=>{if(state.dirty){event.preventDefault();event.returnValue='';}});
try{state.token=(await api('session')).token;state.view=await api('run');renderCase();fillNovelty(state.view.novelty);}catch(e){message(e.message,true);}
