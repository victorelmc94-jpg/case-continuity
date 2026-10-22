import { createHash, randomUUID } from 'node:crypto';

export class AppError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}
export const copy = value => structuredClone(value);
export const hash = value => createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
export function requireThat(condition, message, status = 400) {
  if (!condition) throw new AppError(message, status);
}
const object = properties => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });
const string = { type: 'string', maxLength: 2000 };
const nullableString = { type: ['string', 'null'], maxLength: 2000 };
const refs = { type: 'array', minItems: 1, maxItems: 12, items: object({ source_id: string, quote: string }) };
const texts = { type: 'array', maxItems: 20, items: string };
const offer = object({ id: string, description: string, monthly_price: { type: ['number', 'null'] }, conditions: texts, source_refs: refs });
offer.type = ['object', 'null'];
export const targets = ['current_fiber_mbps','mobile_lines','needs','budget_reference','operational_state','next_movement','client_preference','budget_conditions','documents','offer_interest','uncertainties','antecedents','offers'];
export const proposalSchema = object({
  kind: { type: 'string', enum: ['fiber_correction','case_update','conditional_budget','document_receipt','offer_interest','uncertainty','antecedent','offer_record'] },
  summary: string,
  target: { type: 'string', enum: targets },
  value: object({ number: { type: ['number','null'] }, text: nullableString, document_source_id: nullableString, offer_id: nullableString, offer }),
  conditions: texts,
  uncertainties: texts,
  source_refs: refs
});
export const outputSchema = object({
  interpretation: object({
    authorization: { type: 'string', enum: ['explicitly_not_authorized','not_established','explicit_authorization_reported','uncertain'] },
    explanation: string, source_refs: refs
  }),
  proposals: { type: 'array', maxItems: 12, items: proposalSchema },
  no_change_reason: nullableString
});

// Small validator for precisely this closed schema; no executable input or generic patches.
export function validateSchema(value, schema, path = 'respuesta') {
  const types = Array.isArray(schema.type) ? schema.type : [schema.type];
  const type = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
  requireThat(types.includes(type), path + ': tipo no válido');
  if (value === null) return;
  if (schema.enum) requireThat(schema.enum.includes(value), path + ': valor no permitido');
  if (type === 'object') {
    const keys = Object.keys(value);
    requireThat(keys.length === schema.required.length && keys.every(k => Object.hasOwn(schema.properties, k)), path + ': propiedades no permitidas o ausentes');
    for (const k of schema.required) validateSchema(value[k], schema.properties[k], path + '.' + k);
  } else if (type === 'array') {
    requireThat(value.length >= (schema.minItems ?? 0) && value.length <= (schema.maxItems ?? 100), path + ': cantidad no válida');
    value.forEach((item, index) => validateSchema(item, schema.items, path + '[' + index + ']'));
  } else if (type === 'string') {
    requireThat(value.length <= (schema.maxLength ?? 5000), path + ': texto demasiado largo');
  } else if (type === 'number') requireThat(Number.isFinite(value), path + ': número no válido');
}

export function validateSource(source) {
  requireThat(source && ['id','type','author','sourceDate','text'].every(k => typeof source[k] === 'string'), 'Fuente incompleta');
  requireThat(Object.keys(source).every(k => ['id','type','author','sourceDate','text'].includes(k)), 'Propiedades de fuente no permitidas');
  requireThat(/^[A-Za-z0-9_-]{1,80}$/.test(source.id), 'Identificador de fuente no válido');
  requireThat(source.author.trim() && source.type.trim() && /^\d{4}-\d{2}-\d{2}$/.test(source.sourceDate), 'Indica autor, tipo y fecha de fuente');
  requireThat(source.text.trim().length > 0 && Buffer.byteLength(source.text) <= 8000, 'Introduce una novedad de hasta 8.000 bytes');
  return { ...copy(source), contentHash: hash(source.text) };
}

function validateRefs(items, sources) {
  for (const ref of items) {
    const source = sources.find(s => s.id === ref.source_id);
    requireThat(source && ref.quote.trim() && source.text.includes(ref.quote), 'La cita no coincide exactamente con la fuente ' + ref.source_id);
  }
}
export function validateProposal(proposal, sources, caseData) {
  validateSchema(proposal, proposalSchema, 'propuesta');
  validateRefs(proposal.source_refs, sources);
  const fixed = { fiber_correction:'current_fiber_mbps', conditional_budget:'budget_conditions', document_receipt:'documents', offer_interest:'offer_interest', uncertainty:'uncertainties', antecedent:'antecedents', offer_record:'offers' };
  const editable = ['mobile_lines','needs','budget_reference','operational_state','next_movement','client_preference'];
  requireThat(proposal.kind === 'case_update' ? editable.includes(proposal.target) : fixed[proposal.kind] === proposal.target, 'Operación/campo fuera del contrato');
  const v = proposal.value;
  if (['current_fiber_mbps','mobile_lines','budget_reference','budget_conditions'].includes(proposal.target)) {
    requireThat(v.number !== null && v.number > 0 && v.number <= 100000, 'Importe o cantidad no válida');
    if (['mobile_lines','current_fiber_mbps'].includes(proposal.target)) requireThat(Number.isInteger(v.number), 'La cantidad debe ser entera');
  }
  if (['needs','operational_state','next_movement','client_preference','antecedents','uncertainties'].includes(proposal.target)) requireThat(v.text?.trim(), 'Falta el texto de la incorporación');
  if (proposal.kind === 'conditional_budget') requireThat(proposal.conditions.length > 0 && proposal.conditions.every(s => s.trim()), 'Un presupuesto condicionado debe conservar condiciones');
  if (proposal.kind === 'offer_interest') requireThat(caseData.offers.some(o => o.id === v.offer_id) && v.text?.trim(), 'Interés sin oferta o declaración');
  if (proposal.kind === 'document_receipt') requireThat(sources.some(s => s.id === v.document_source_id && s.type === 'document' && s.text.trim()), 'El documento debe estar realmente incluido');
  if (proposal.kind === 'offer_record') {
    requireThat(v.offer && v.offer.id.trim(), 'Oferta incompleta');
    validateRefs(v.offer.source_refs, sources);
  }
}
export function validateOutput(output, sources, caseData) {
  validateSchema(output, outputSchema);
  validateRefs(output.interpretation.source_refs, sources);
  output.proposals.forEach(p => validateProposal(p, sources, caseData));
  return copy(output);
}
export function newRun(fixture) {
  const run = { id: randomUUID(), createdAt: new Date().toISOString(), dataVersion: 1, caseData: copy(fixture.caseData),
    sources: fixture.sources.map(s => ({ ...copy(s), contentHash: hash(s.text) })),
    dataVersions: [], incorporationReceipts: [], reviewEvents: [] };
  run.dataVersions.push({ version:1, at:run.createdAt, caseData:copy(run.caseData), reason:'Base ficticia' });
  return run;
}
function applyProposal(data, p) {
  const v = p.value;
  const provenance = { source_refs:copy(p.source_refs), summary:p.summary, uncertainties:copy(p.uncertainties) };
  if (p.kind === 'fiber_correction' || p.kind === 'case_update') {
    data[p.target] = ['current_fiber_mbps','mobile_lines','budget_reference'].includes(p.target) ? v.number : v.text;
  } else if (p.kind === 'conditional_budget') {
    data.budget_conditions.push({ amount:v.number, declaration:v.text, conditions:copy(p.conditions), ...provenance });
  } else if (p.kind === 'offer_interest') {
    data.offer_interest.push({ offer_id:v.offer_id, declaration:v.text, conditions:copy(p.conditions), ...provenance });
  } else if (p.kind === 'document_receipt') {
    data.documents.push({ source_id:v.document_source_id, status:'Recibido, sin validar', ...provenance });
  } else if (p.kind === 'offer_record') {
    data.offers.push({ ...copy(v.offer), ...provenance });
  } else {
    data[p.target].push({ text:v.text, ...provenance });
  }
}

export const reviewKey = source => hash([source.id,source.contentHash??hash(source.text)]);
const normalize = text => String(text??'').trim().replace(/\s+/g,' ').toLocaleLowerCase('es');
export function effectKey(proposal, source) {
  const p=proposal,v=p.value;
  // Ignore summaries, quote lengths and display wording; preserve operative values and conditions.
  const value=p.kind==='conditional_budget'?v.number:p.kind==='offer_interest'?[v.offer_id,p.conditions.map(normalize).sort()]:p.kind==='document_receipt'?v.document_source_id:p.kind==='offer_record'?v.offer:['current_fiber_mbps','mobile_lines','budget_reference'].includes(p.target)?v.number:normalize(v.text);
  return hash([reviewKey(source),p.kind,p.target,value]);
}
export const sameConditions=(a,b)=>hash(a.map(normalize).sort())===hash(b.map(normalize).sort());
export function openReviews(run) {
  const finished=new Set(run.reviewEvents.flatMap(e=>e.receiptIds));
  const groups=new Map();
  for(const r of run.incorporationReceipts.filter(r=>r.reviewKey&&!finished.has(r.id))){
    if(!groups.has(r.reviewKey))groups.set(r.reviewKey,{sourceId:r.reviewSourceId,receiptIds:[]});
    groups.get(r.reviewKey).receiptIds.push(r.id);
  }
  return [...groups.values()];
}
export function commitReview(workspace, draft, command) {
  requireThat(command && Object.keys(command).every(k => ['draftId','baseStorageRevision','actionId','mode','confirmCompleted','decisions','reason'].includes(k)), 'Orden de guardado no válida');
  const finishing=command.mode==='finalize';
  requireThat(['partial','finalize'].includes(command.mode),'Modo de guardado no válido');
  requireThat(command.confirmCompleted===finishing, finishing?'Falta la confirmación explícita de fin de revisión':'Un guardado parcial no declara revisión terminada');
  requireThat(command.reason===undefined||(typeof command.reason==='string'&&command.reason.length<=1000),'Motivo no válido');
  requireThat(finishing||!command.reason,'El motivo de revisión se confirma al finalizar');
  requireThat(typeof command.actionId === 'string' && /^[a-f0-9-]{36}$/i.test(command.actionId), 'Identificador de guardado no válido');
  requireThat(command.baseStorageRevision === workspace.storageRevision && draft.baseStorageRevision === workspace.storageRevision, 'El expediente ha cambiado: recarga antes de guardar', 409);
  requireThat(draft.id === command.draftId && !draft.consumed, 'La revisión ya no está disponible', 409);
  requireThat(Array.isArray(command.decisions) && (finishing?command.decisions.length===draft.proposals.length:command.decisions.length>0), 'Quedan propuestas sin revisar');
  const seen = new Set();
  const approved = [];
  for (const decision of command.decisions) {
    requireThat(decision && Object.keys(decision).every(k => ['proposalId','status','edit'].includes(k)), 'Decisión no válida');
    const original = draft.proposals.find(p => p.id === decision.proposalId);
    requireThat(original && !seen.has(original.id), 'Propuesta desconocida o duplicada');
    seen.add(original.id);
    const saved=(draft.savedProposalIds??[]).includes(original.id);
    if(saved){requireThat(finishing&&decision.status==='saved'&&!decision.edit,'Esta incorporación ya está guardada');continue;}
    requireThat((finishing?['accepted','accepted_edited','rejected']:['accepted','accepted_edited']).includes(decision.status), 'Queda una propuesta pendiente o no aceptada');
    if (decision.status !== 'accepted_edited') requireThat(!decision.edit, 'Edición no aprobada');
    if (decision.status === 'rejected') continue;
    const { id, ...p } = original;
    let edited = copy(p);
    if (decision.status === 'accepted_edited') {
      requireThat(decision.edit && Object.keys(decision.edit).length === 3 && ['summary','value','conditions'].every(k => Object.hasOwn(decision.edit,k)), 'Edición incompleta');
      edited = { ...edited, ...copy(decision.edit) };
    }
    validateProposal(edited, draft.sources, workspace.runs[draft.runId].caseData);
    approved.push({ id, proposal:edited, humanEdited:decision.status === 'accepted_edited' });
  }
  const next = copy(workspace);
  const run = next.runs[draft.runId];
  requireThat(run && next.activeRunId === run.id, 'La prueba activa ha cambiado', 409);
  const before = copy(run.caseData);
  const at = new Date().toISOString();
  const receipts = [];
  const key=reviewKey(draft.novelty);
  const savedProposalIds=[];
  for (const item of approved) {
    const effect=effectKey(item.proposal,draft.novelty);
    const existing=[...run.incorporationReceipts,...receipts].find(r=>r.effectKey===effect);
    if(existing){
      requireThat(item.proposal.kind!=='conditional_budget'||sameConditions(existing.proposal.conditions,item.proposal.conditions),'La misma fuente ya aportó ese importe con condiciones distintas. No se duplica ni sustituye automáticamente: revisa la incorporación anterior.',409);
      savedProposalIds.push(item.id);continue;
    }
    const previous = copy(run.caseData[item.proposal.target]);
    applyProposal(run.caseData,item.proposal);
    if(hash(previous)===hash(run.caseData[item.proposal.target]))continue;
    receipts.push({ id:randomUUID(), proposalId:item.id, proposal:copy(item.proposal), humanEdited:item.humanEdited, before:previous,
      after:copy(run.caseData[item.proposal.target]), at, reviewer:'Asesor Demo',reviewKey:key,reviewSourceId:draft.novelty.id,effectKey:effect });
    savedProposalIds.push(item.id);
  }
  requireThat(finishing||savedProposalIds.length>0,'No hay incorporaciones nuevas que guardar');
  requireThat(run.caseData.contract_authorization === before.contract_authorization, 'Autorización contractual fuera de V1');
  const changed = JSON.stringify(before) !== JSON.stringify(run.caseData);
  if (changed) {
    run.dataVersion++;
    run.dataVersions.push({ version:run.dataVersion, at, caseData:copy(run.caseData), reason:'Incorporaciones revisadas', actionId:command.actionId });
  }
  const used = new Set([...receipts.flatMap(r => r.proposal.source_refs.map(s => s.source_id)), draft.novelty.id]);
  for (const source of draft.sources.filter(s => used.has(s.id))) {
    const existing = run.sources.find(s => s.id === source.id);
    requireThat(!existing || existing.contentHash === source.contentHash, 'No se puede sustituir una fuente original');
    if (!existing) run.sources.push(copy(source));
  }
  run.incorporationReceipts.push(...receipts);
  let duplicateReview=false;
  if(finishing){
    const completed=new Set(run.reviewEvents.flatMap(e=>e.receiptIds));
    const related=run.incorporationReceipts.filter(r=>r.reviewKey===key&&!completed.has(r.id));
    const reason=command.reason?.trim()??'';
    const prior=run.reviewEvents.filter(e=>e.reviewKey===key||(!e.reviewKey&&e.sourceIds.includes(draft.novelty.id)));
    duplicateReview=Boolean(!related.length&&prior.some(e=>!reason||normalize(reason)===normalize(e.reason)));
    if(!duplicateReview)run.reviewEvents.push({id:randomUUID(),at,reviewer:'Asesor Demo',reviewKey:key,sourceIds:[draft.novelty.id],
      conclusion:related.length?'Revisado, con incorporaciones':'Revisado, sin cambios',reason,
      acceptedCount:related.length,rejectedCount:command.decisions.filter(d=>d.status==='rejected').length,receiptIds:related.map(r=>r.id),dataVersion:run.dataVersion});
  }
  next.storageRevision++;
  next.actions[command.actionId] = { draftId:draft.id, runId:run.id, commandHash:hash(command),mode:command.mode,
    savedProposalIds,storageRevision:next.storageRevision,duplicateReview };
  return next;
}
export function finalize(workspace,draft,command){return commitReview(workspace,draft,command);}
