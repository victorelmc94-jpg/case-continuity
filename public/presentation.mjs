export const labels={current_fiber_mbps:'Fibra declarada',mobile_lines:'Líneas móviles',needs:'Necesidades',budget_reference:'Presupuesto de referencia',operational_state:'Estado operativo',next_movement:'Próximo movimiento',client_preference:'Preferencia del cliente',budget_conditions:'Disposición condicionada',documents:'Documentos',offer_interest:'Interés expresado',uncertainties:'Dudas',antecedents:'Antecedentes',offers:'Ofertas'};
const number=n=>new Intl.NumberFormat('es-ES',{maximumFractionDigits:2}).format(n);
export const monthly=n=>number(n)+' €/mes';
export function budgetStatement(item){
  if(item.declaration?.trim())return item.declaration.trim().replace(/(\d+(?:[.,]\d+)?)\s*euros(?: al mes)?/gi,'$1 €/mes');
  return 'Importe condicionado: '+monthly(item.amount)+'. Condiciones: '+item.conditions.join('; ');
}
export function describeValue(target,value){
  if(value==null||value==='')return 'Sin dato incorporado';
  if(Array.isArray(value)){
    if(!value.length)return 'Sin incorporaciones';
    return value.map(item=>{
      if(target==='budget_conditions')return budgetStatement(item)+' Condiciones: '+item.conditions.join('; ');
      if(target==='offer_interest')return 'Oferta '+item.offer_id+': '+item.declaration;
      if(target==='documents')return 'Documento '+item.source_id+': '+item.status;
      if(target==='offers')return item.description+(item.monthly_price==null?'':': '+monthly(item.monthly_price))+' · '+item.conditions.join('; ');
      return item.text??item.summary??'Incorporación revisada';
    }).join('\n');
  }
  if(target==='current_fiber_mbps')return number(value)+' Mb';
  if(target==='budget_reference')return monthly(value);
  return String(value);
}
export function contractingInstruction(run){
  // Only display the specific instruction when an incorporated declaration AND its quoted source support it.
  const explicit=/no (?:contrates|contratar|se contrate) todavía/i;
  for(const interest of [...run.caseData.offer_interest].reverse()){
    if(!explicit.test(interest.declaration??''))continue;
    const refs=interest.source_refs.filter(ref=>explicit.test(ref.quote)&&run.sources.some(s=>s.id===ref.source_id&&s.text.includes(ref.quote)));
    if(refs.length)return {text:'El cliente pide no contratar todavía',refs};
  }
  return null;
}
