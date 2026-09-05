'use client';

import {useEffect,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,Pause,Play,Sun,Moon} from 'lucide-react';

type Shape='gather'|'orbit'|'disperse';
type Point={x:number;y:number;z:number;a:number};
const COUNT=680;
const shapes:Shape[]=['gather','orbit','disperse'];
const labels={gather:'Gather',orbit:'Orbit',disperse:'Disperse'};
// Deterministic geometry keeps server/client output and repeat interactions stable.
function target(i:number,shape:Shape):Point {
 const u=(i+.5)/COUNT, golden=Math.PI*(3-Math.sqrt(5)), angle=i*golden;
 if(shape==='gather'){const y=1-2*u,r=Math.sqrt(1-y*y);return{x:Math.cos(angle)*r,y,z:Math.sin(angle)*r,a:1};}
 if(shape==='orbit'){const v=(i%29)/29*Math.PI*2,R=.86+.22*Math.cos(v);return{x:R*Math.cos(angle),y:.22*Math.sin(v),z:R*Math.sin(angle),a:1};}
 const r=1.8+(i%17)/17*1.8;return{x:Math.cos(angle)*r,y:(u-.5)*5,z:Math.sin(angle)*r,a:i%9===0?.28:0};
}

export default function ParticleStudio(){
 const canvas=useRef<HTMLCanvasElement>(null);
 const api=useRef<{shape:(s:Shape,instant:boolean)=>void;rotate:(v:number)=>void;pause:(v:boolean)=>void;theme:(v:boolean)=>void}|undefined>(undefined);
 const [shape,setShape]=useState<Shape>('gather');
 const [paused,setPaused]=useState(false);
 const [dusk,setDusk]=useState(false);
 const [reduced,setReduced]=useState(false);
 useEffect(()=>{
  const el=canvas.current;if(!el)return;const ctx=el.getContext('2d');if(!ctx)return;
  const mq=matchMedia('(prefers-reduced-motion: reduce)');let reduce=mq.matches;setReduced(reduce);
  let points=Array.from({length:COUNT},(_,i)=>target(i,reduce?'gather':'disperse'));
  let from=points.map(p=>({...p})),to=Array.from({length:COUNT},(_,i)=>target(i,'gather'));
  let width=0,height=0,raf=0,last=0,elapsed=0,duration=1600,morph=!reduce,stopped=false,visible=false,night=false,disposed=false;
  let yaw=.3,pitch=-.35,aimYaw=yaw,aimPitch=pitch,vy=0,vp=0,dragging=false,px=0,py=0;
  const paint=()=>{
   if(!width||!height)return;
   ctx.clearRect(0,0,width,height);
   const glow=ctx.createRadialGradient(width*.55,height*.5,0,width*.5,height*.5,width*.55);
   glow.addColorStop(0,night?'rgba(245,170,124,.2)':'rgba(255,255,255,.85)');glow.addColorStop(1,'rgba(255,255,255,0)');
   ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
   const cy=Math.cos(yaw),sy=Math.sin(yaw),cx=Math.cos(pitch),sx=Math.sin(pitch),scale=Math.min(width,height)*.31;
   const projected=points.map((p,i)=>{const x=p.x*cy-p.z*sy,z0=p.x*sy+p.z*cy,y=p.y*cx-z0*sx,z=p.y*sx+z0*cx,depth=3.7/(3.7+z);return{x:width/2+x*scale*depth,y:height/2+y*scale*depth,z,r:(i%7===0?2.3:1.25)*depth,a:p.a*(.4+.6*(1-z/4)),i};}).sort((a,b)=>b.z-a.z);
   for(const p of projected){if(p.a<.015)continue;ctx.globalAlpha=Math.min(1,p.a);ctx.fillStyle=p.i%7===0?(night?'#ffd391':'#b29636'):(night?'#e6e7ff':'#243b9b');ctx.beginPath();ctx.arc(p.x,p.y,Math.max(.3,p.r),0,Math.PI*2);ctx.fill();}
   ctx.globalAlpha=1;
  };
  const frame=(now:number)=>{
   raf=0;if(disposed||stopped||!visible||document.hidden)return;
   const dt=last?Math.min((now-last)/1000,.032):.016;last=now;
   if(morph){elapsed+=dt*1000;const t=Math.min(1,elapsed/duration);/* Smooth on-screen geometric morph; finite, interruptible. */let lo=0,hi=1;for(let k=0;k<14;k++){const m=(lo+hi)/2,x=3*(1-m)*(1-m)*m*.77+3*(1-m)*m*m*.175+m*m*m;if(x<t)lo=m;else hi=m;}const b=(lo+hi)/2,e=t===1?1:3*(1-b)*b*b+b*b*b;points=from.map((p,i)=>({x:p.x+(to[i].x-p.x)*e,y:p.y+(to[i].y-p.y)*e,z:p.z+(to[i].z-p.z)*e,a:p.a+(to[i].a-p.a)*e}));if(t===1)morph=false;}
   if(!reduce){vy+=(100*(aimYaw-yaw)-10*vy)*dt;vp+=(100*(aimPitch-pitch)-10*vp)*dt;yaw+=vy*dt;pitch+=vp*dt;}
   paint();if(morph||Math.abs(aimYaw-yaw)+Math.abs(aimPitch-pitch)+Math.abs(vy)+Math.abs(vp)>.001)raf=requestAnimationFrame(frame);
  };
  const wake=()=>{if(!raf&&!disposed&&!stopped&&visible&&!document.hidden){last=0;raf=requestAnimationFrame(frame);}};
  const snap=()=>{points=to.map(p=>({...p}));morph=false;elapsed=duration;yaw=aimYaw;pitch=aimPitch;vy=vp=0;paint();};
  api.current={shape:(s,instant)=>{from=points.map(p=>({...p}));to=Array.from({length:COUNT},(_,i)=>target(i,s));elapsed=0;duration=s==='disperse'?1200:1600;morph=true;if(reduce||instant||stopped)snap();else wake();},rotate:v=>{aimYaw+=v;yaw=aimYaw;vy=0;paint();},pause:v=>{stopped=v;if(v){cancelAnimationFrame(raf);raf=0;}else wake();},theme:v=>{night=v;paint();}};
  const resize=new ResizeObserver(entries=>{const r=entries[0].contentRect;width=r.width;height=r.height;const dpr=Math.min(devicePixelRatio||1,2);el.width=Math.round(width*dpr);el.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);paint();});resize.observe(el);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)wake();else{cancelAnimationFrame(raf);raf=0;last=0;}},{threshold:.1});observer.observe(el);
  const visibility=()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else wake();};
  const preference=()=>{reduce=mq.matches;setReduced(reduce);if(reduce){cancelAnimationFrame(raf);raf=0;snap();}};
  const down=(e:PointerEvent)=>{if(stopped||reduce)return;dragging=true;px=e.clientX;py=e.clientY;el.setPointerCapture(e.pointerId);};
  const move=(e:PointerEvent)=>{if(!dragging||stopped||reduce)return;aimYaw+=(e.clientX-px)*.008;aimPitch=Math.max(-1.1,Math.min(1.1,aimPitch+(e.clientY-py)*.006));px=e.clientX;py=e.clientY;wake();};
  const up=()=>{dragging=false;};
  el.addEventListener('pointerdown',down);el.addEventListener('pointermove',move);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);el.addEventListener('lostpointercapture',up);mq.addEventListener('change',preference);document.addEventListener('visibilitychange',visibility);
  return()=>{disposed=true;cancelAnimationFrame(raf);resize.disconnect();observer.disconnect();el.removeEventListener('pointerdown',down);el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',up);el.removeEventListener('lostpointercapture',up);mq.removeEventListener('change',preference);document.removeEventListener('visibilitychange',visibility);api.current=undefined;};
 },[]);
 return <div className={`particle-studio ${dusk?'is-dusk':''}`}><div className="studio-heading"><span className="eyebrow">A LITTLE ROOM TO PLAY</span><button className="studio-icon" aria-label={dusk?'Switch to daylight':'Switch to dusk'} aria-pressed={dusk} onClick={()=>{api.current?.theme(!dusk);setDusk(!dusk);}}>{dusk?<Sun size={18}/>:<Moon size={18}/>}</button></div><h3>A thought,<br/><em>taking shape.</em></h3><canvas ref={canvas} role="img" aria-label={`Interactive 3D particles: ${shape==='gather'?'sphere':shape==='orbit'?'orbital ring':'dispersed points'}. Use the controls below to change the shape.`}>A particle sculpture. Choose Gather, Orbit, or Disperse below.</canvas><div className="studio-toolbar"><div className="studio-shapes" aria-label="Particle shapes">{shapes.map(s=><button key={s} aria-pressed={s===shape} onClick={e=>{setShape(s);api.current?.shape(s,e.detail===0);}}>{labels[s]}</button>)}</div><button className="studio-icon" aria-label={paused?'Resume animation':'Pause animation'} aria-pressed={paused} onClick={()=>{api.current?.pause(!paused);setPaused(!paused);}}>{paused?<Play size={17}/>:<Pause size={17}/>}</button></div><div className="studio-caption"><span>{reduced?'Reduced motion · shapes change instantly':paused?'Motion paused':'Drag to turn. Give an idea a different shape.'}</span><div><button className="studio-icon" aria-label="Rotate sculpture left" onClick={()=>api.current?.rotate(-Math.PI/6)}><ArrowLeft size={16}/></button><button className="studio-icon" aria-label="Rotate sculpture right" onClick={()=>api.current?.rotate(Math.PI/6)}><ArrowRight size={16}/></button></div></div></div>;
}

