import fs from 'node:fs/promises';
import {copy} from './domain.mjs';
const base=JSON.parse(await fs.readFile(new URL('../fixtures/main.json',import.meta.url),'utf8'));
const cases=JSON.parse(await fs.readFile(new URL('../fixtures/cases.json',import.meta.url),'utf8'));
export const caseList=cases.map(({id,label})=>({id,label}));
export function getFixture(id='MAIN'){
  const item=cases.find(c=>c.id===id);
  if(!item)return null;
  return {...copy(base),id:item.id,label:item.label,novelty:item.source?{...copy(base.novelty),...copy(item.source)}:copy(base.novelty),documents:copy(item.documents??[])};
}
