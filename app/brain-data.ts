import {projects,experiments} from './projects';
export const directions=[
 {id:'product',label:'Product delivery',accent:'#3048b6',description:'Understanding a workflow, making product decisions, and carrying a useful tool through implementation.',x:-240,y:-150},
 {id:'ai',label:'Applied AI',accent:'#9283bd',description:'Using models and language tools inside products, with attention to grounding, recovery, and human review.',x:115,y:-200},
 {id:'data',label:'Data & decisions',accent:'#5678c8',description:'Turning data into evidence people can use, while making uncertainty and limitations visible.',x:310,y:55},
 {id:'story',label:'Story & distribution',accent:'#ad83a1',description:'Explaining ideas, understanding an audience, and building tools around the work of creating.',x:-185,y:190},
 {id:'interaction',label:'Creative interaction',accent:'#789da6',description:'Making ideas explorable through spatial worlds, visual effects, and interaction design.',x:130,y:235},
];
// Memberships describe the work, not job-role filters. One project can bridge themes.
export const memberships=[
 {id:'athena-ai',themes:['product','ai','data','story'],reason:'Forecasting models, a shipped product, and daily stories that reach an audience.'},
 {id:'whetstone',themes:['product','interaction'],reason:'End-to-end delivery around the workflows of students, parents, and counselors.'},
 {id:'spool',themes:['product','ai','story','interaction'],reason:'AI-assisted source retrieval, creator playbooks, and an explorable knowledge map.'},
 {id:'mira',themes:['product','ai','story'],reason:'Brand research and outreach workflows shaped around a creator’s context and voice.'},
 {id:'football-ai',themes:['ai','data','product'],reason:'Natural-language questions connected to structured football data and evidence.'},
 {id:'admira',themes:['ai','data','product'],reason:'An admissions planning interface with public-data priors, model receipts, and visible uncertainty.'},
 {id:'experiment:0',themes:['interaction','story'],reason:'Camera-controlled visual effects designed as one-take video reveals.'},
 {id:'experiment:1',themes:['interaction','story'],reason:'An explorable campus that tells a story through spatial design.'},
 {id:'experiment:2',themes:['interaction','story'],reason:'A World Cup playground expressed as an interactive world.'},
 {id:'experiment:3',themes:['data','story'],reason:'A restaurant-discovery concept comparing social attention and review sentiment.'},
 {id:'experiment:4',themes:['product','ai'],reason:'Agent ingestion, drafting, and review workflows with human approval boundaries.'},
 {id:'experiment:5',themes:['product','ai','data'],reason:'A personal workflow combining browser capture, Gmail classification, and AI fit analysis.'},
 {id:'experiment:6',themes:['product','interaction'],reason:'A reading experience with scheduled reminders and source-text retrieval.'},
 {id:'experiment:7',themes:['product','ai','interaction'],reason:'Swipe-based travel discovery and an AI travel assistant.'},
];
export type BrainDot={id:string;label:string;kind:'direction'|'project'|'experiment';accent:string;themes:string[];project?:number;experiment?:number;reason:string;x:number;y:number;fx?:number;fy?:number;homeX:number;homeY:number};
export type BrainThread={source:string;target:string;association?:boolean;reason:string;accent:string};
const locations=[[-90,-125],[-300,-5],[-65,50],[-190,60],[130,-85],[245,-50],[20,200],[190,135],[280,220],[280,-150],[-65,-240],[30,-45],[-320,120],[65,110]];
export function createBrainGraph(){
 const nodes:BrainDot[]=directions.map(d=>({...d,id:`direction:${d.id}`,kind:'direction',themes:[d.id],reason:d.description,fx:d.x,fy:d.y,homeX:d.x,homeY:d.y}));
 const links:BrainThread[]=[];
 memberships.forEach((m,i)=>{const project=i<projects.length?i:undefined;const experiment=project===undefined?i-projects.length:undefined;const [x,y]=locations[i];const first=directions.find(d=>d.id===m.themes[0])!;nodes.push({id:m.id,label:project!==undefined?projects[project].name:experiments[experiment!].name,kind:project!==undefined?'project':'experiment',project,experiment,themes:m.themes,reason:m.reason,accent:first.accent,x,y,fx:x,fy:y,homeX:x,homeY:y});m.themes.forEach(theme=>links.push({source:`direction:${theme}`,target:m.id,reason:m.reason,accent:directions.find(d=>d.id===theme)!.accent}));});
 for(let i=0;i<directions.length;i++)for(let j=i+1;j<directions.length;j++){const shared=memberships.filter(m=>m.themes.includes(directions[i].id)&&m.themes.includes(directions[j].id));if(shared.length>=2)links.push({source:`direction:${directions[i].id}`,target:`direction:${directions[j].id}`,association:true,reason:`${shared.length} projects connect ${directions[i].label} and ${directions[j].label}.`,accent:'#6479a9'});}
 return {nodes,links};
}
// Direct manipulation stays within an invisible local range and the map's world bounds.
export function boundedPosition(node:Pick<BrainDot,'homeX'|'homeY'|'kind'>,x:number,y:number){const radius=node.kind==='direction'?90:115;const dx=x-node.homeX,dy=y-node.homeY;const length=Math.hypot(dx,dy);const factor=length>radius?radius/length:1;return {x:Math.max(-425,Math.min(425,node.homeX+dx*factor)),y:Math.max(-315,Math.min(315,node.homeY+dy*factor))};}
