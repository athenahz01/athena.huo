'use client';
import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight,Maximize2,Pause,Play} from 'lucide-react';
import {Dialog,DialogTrigger,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';

export type Preview = {image:string;recording?:string;title:string;caption:string;alt:string;url:string};
export const projectPreviews:Record<string,Preview>={
 'athena-ai':{image:'tennis.jpg',title:'Athena Tennis',caption:'Related forecasting project · captured interface',alt:'Athena Tennis forecasting homepage with a three-dimensional tennis court and match summary.',url:'https://athena-tennis.vercel.app'},
 whetstone:{image:'whetstone.png',recording:'whetstone',title:'Whetstone',caption:'Public demo · fictional student data',alt:'Whetstone admissions portal demo with student navigation and planning tools.',url:'https://whetstone-portal-demo.vercel.app'},
 admira:{image:'admira.jpg',title:'Admira',caption:'Public prototype · illustrative sample read',alt:'Admira admissions interface showing a chance range and the limits of its estimates.',url:'https://admira-phi.vercel.app'},
};
const explorations:Preview[]=[
 {image:'cornell.jpg',title:'The Hill',caption:'An explorable miniature of Cornell',alt:'The Cornell 3D campus at dusk, with McGraw Tower and paths across the quad.',url:'https://cornell3d.vercel.app'},
 {image:'hype.png',recording:'hype',title:'NYC Hype Index',caption:'Archive demo · prototype figures',alt:'The NYC Hype Index editorial restaurant-discovery interface.',url:'https://github.com/athenahz01/nyc-hype-index'},
 {image:'tripmuse.png',recording:'tripmuse',title:'TripMuse',caption:'Archive demo · travel discovery',alt:'TripMuse travel-discovery homepage with a large scenic image and an explore action.',url:'https://github.com/athenahz01/TripMuse-5151'},
];

export function ProjectPreview({preview:p}:{preview:Preview}){
 const [playing,setPlaying]=useState(false);
 const [motionAllowed,setMotionAllowed]=useState(false);
 const host=useRef<HTMLElement>(null);
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const sync=()=>{const allowed=!media.matches&&document.documentElement.dataset.motion!=='off';setMotionAllowed(allowed);if(!allowed)setPlaying(false);};
  const visibility=()=>{if(document.hidden)setPlaying(false);};
  const observer=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)setPlaying(false);});
  if(host.current)observer.observe(host.current);
  sync();media.addEventListener('change',sync);addEventListener('portfolio-motion',sync);document.addEventListener('visibilitychange',visibility);
  return()=>{observer.disconnect();media.removeEventListener('change',sync);removeEventListener('portfolio-motion',sync);document.removeEventListener('visibilitychange',visibility);};
 },[]);
 return <figure className="project-preview" ref={host}>
  <div className="preview-depth"><div className="preview-frame">
   <div className="preview-chrome" aria-hidden="true"><span className="window-dots"><i/><i/><i/></span><span>{p.title}</span><span>↗</span></div>
   <Dialog><DialogTrigger className="preview-open" aria-label={`Enlarge ${p.title} preview`}>
    <img src={`/previews/${playing&&motionAllowed&&p.recording?p.recording+'.gif':p.image}`} alt={p.alt} width={1280} height={720} loading="lazy" decoding="async"/>
    <span className="preview-enlarge"><Maximize2 size={15}/> Take a closer look</span>
   </DialogTrigger><DialogContent className="preview-dialog"><DialogTitle>{p.title}</DialogTitle><DialogDescription>{p.caption}</DialogDescription><img src={`/previews/${p.image}`} alt={p.alt} width={1280} height={720}/><a href={p.url} target="_blank" rel="noreferrer">Explore the project <ArrowUpRight size={16}/></a></DialogContent></Dialog>
  </div></div>
  <figcaption><span>{p.caption}</span>{p.recording&&<button className="preview-play" disabled={!motionAllowed} aria-pressed={playing} onClick={()=>setPlaying(!playing)}>{playing?<Pause size={14}/>:<Play size={14}/>} {playing?'Pause':motionAllowed?'Play demo':'Still preview'}</button>}</figcaption>
 </figure>;
}

export function PreviewGallery(){return <section className="peek-gallery" aria-labelledby="peek-title"><div className="peek-heading"><span className="eyebrow">A FEW MORE WINDOWS INTO MY WORLD</span><h3 id="peek-title">Go on.<em> Peek inside.</em></h3><p>Places to wander, things to question, ideas to try.</p></div><div className="peek-track">{explorations.map((p,i)=><article className="peek-item" key={p.image}><div className="peek-label"><span>0{i+1} / {p.title}</span><a href={p.url} target="_blank" rel="noreferrer" aria-label={`Explore ${p.title}`}><ArrowUpRight size={21}/></a></div><ProjectPreview preview={p}/></article>)}</div></section>}
