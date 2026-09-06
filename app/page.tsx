'use client';
import { useState, type CSSProperties } from 'react';
import { ArrowUpRight, ArrowDown, MoveHorizontal } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import ScrollMotion from './scroll-motion';
import { PortfolioSections, QuickRead } from './portfolio-sections';
export default function Home() {
 const [lens,setLens]=useState(50);
 return <main id="top"><a className="skip-link" href="#work">Skip to selected work</a>
 <header className="site-header"><a className="wordmark" href="#top" aria-label="Athena Huo home">ah<span>↗</span></a><span className="header-note"><QuickRead/></span><nav aria-label="Main navigation"><a href="#work">Work</a><a href="#about">About</a><a href="mailto:zhengathenahuo@gmail.com">Let’s talk <ArrowUpRight size={16}/></a></nav></header>
 <section className="hero" aria-labelledby="hero-title" style={{'--lens':`${lens}%`} as CSSProperties}>
 <div className="hero-topline"><span>PRODUCT · APPLIED AI · STORIES THAT TRAVEL</span><span>BASED IN NEW YORK ↗</span></div><h1 id="hero-title" className="nameplate">ATHENA<span>HUO</span><sup>↗</sup></h1>
 <div className="hero-composition"><div className="hero-thesis"><span className="eyebrow">THE PERSON BETWEEN THE DISCIPLINES</span><h2>I build things.<br/>Then I get people<br/><em>to care.</em></h2><p>From the model to the product to the story.<br/>I like owning the whole journey.</p><a className="round-link" href="#work"><span className="circle"><ArrowDown size={22}/></span>Explore my work</a></div>
 <div className="portrait-stage"><img className="portrait portrait-base" src="/images/athena-huo.jpg" alt="Athena Huo seated with an open book in a library" width="960" height="1440" fetchPriority="high"/><img className="portrait portrait-color" src="/images/athena-huo.jpg" alt="" width="960" height="1440" aria-hidden="true"/><span className="portrait-label label-build">SYSTEMS THINKER</span><span className="portrait-label label-story">STORYTELLER</span><span className="and-mark" aria-hidden="true">&</span><div className="portrait-caption"><span>ONE PERSON. BOTH SIDES.</span><ArrowUpRight size={21}/></div></div>
 <div className="lens-panel"><div className="lens-labels"><button onClick={()=>setLens(0)}>The builder</button><MoveHorizontal size={18}/><button onClick={()=>setLens(100)}>The storyteller</button></div><Slider aria-label="Explore Athena's builder and storyteller sides" value={[lens]} min={0} max={100} onValueChange={v=>setLens(Array.isArray(v)?v[0]:v)}/><p aria-live="polite">{lens<30?'Models, workflows, and products that hold up in the real world.':lens>70?'An eye for a story. A feel for what makes people stop scrolling.':'Technical depth. Cultural instinct. Better together.'}</p></div></div>
 <div className="credentials"><span>Berkeley<small>Data Science</small></span><span>Cornell<small>Systems Engineering</small></span><span>Athena.ai<small>Founder</small></span><a href="/AthenaHuo.pdf" target="_blank" rel="noreferrer">The résumé<ArrowUpRight size={17}/></a></div></section>
 <PortfolioSections/><ScrollMotion/></main>
}



