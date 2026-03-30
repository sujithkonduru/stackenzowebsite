import {
  motion, AnimatePresence, useInView, useScroll, useTransform,
  useSpring, useMotionValue, useVelocity,
} from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Calendar, MapPin, Clock, Tag, ExternalLink, Filter,
  Bell, TrendingUp, Users, Award, Zap, Target,
  ChevronRight, Star, MessageSquare, Share2, Bookmark,
  Eye, CalendarDays, Building, Rocket, Grid3X3,
  List, Archive, Download, BellRing, Sparkles,
  ChevronDown, X, Search, BookOpen, Briefcase,
  CheckCircle, ArrowRight,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

/* ══════════════════════════════════════════════
   BRAND COLOR MAP  (green → orange swap)
══════════════════════════════════════════════
   Old           →  New
   #1E301E       →  #E66B26   primary
   #2E7D32       →  #C5531A   primary dark
   #E8F5E9       →  #FFF4ED   primary light
   #C8E6C9       →  #FFD5B8   light tint (noise/blobs)
   #B2DFDB       →  #FFCBA4   lighter tint
   #F0EBE0       →  #FFF0E6   warm bg tint
   rgba(30,48,30)→  rgba(230,107,38)   transparent primary
   rgba(46,125,50)→ rgba(197,83,26)    transparent dark
   #1a2e1a/#0d1f0d → #3D1A0A          very dark
   #080e08        →  #1A0800           page-loader dark
   #D4AF37        →  #D4AF37  (unchanged) gold accent
══════════════════════════════════════════════ */
const B = {
  primary:      "#E66B26",
  dark:         "#C5531A",
  light:        "#FFF4ED",
  tint:         "#FFD5B8",
  tint2:        "#FFCBA4",
  warmBg:       "#FFF0E6",
  veryDark:     "#3D1A0A",
  loaderDark:   "#1A0800",
  gold:         "#D4AF37",
  text:         "#1A1A1A",
  border:       "#E5E7EB",
  // rgba helpers
  p:  (a) => `rgba(230,107,38,${a})`,
  pd: (a) => `rgba(197,83,26,${a})`,
};

/* ══════════════════════════════════════════════
   EASING
══════════════════════════════════════════════ */
const EASE_EXPO = [0.16, 1, 0.3, 1];
const EASE_BACK = [0.34, 1.56, 0.64, 1];

/* ══════════════════════════════════════════════
   NAV
══════════════════════════════════════════════ */
const NAV_SECTIONS = ["prog-hero", "updates", "newsletter"];
const NAV_LABELS   = ["Hero", "Updates", "Subscribe"];

/* ══════════════════════════════════════════════
   SCROLL DIR HOOK
══════════════════════════════════════════════ */
function useScrollDir() {
  const { scrollY } = useScroll();
  const vel = useVelocity(scrollY);
  const [dir, setDir] = useState("down");
  useEffect(() => vel.on("change", v => setDir(v > 0 ? "down" : "up")), [vel]);
  return dir;
}

/* ══════════════════════════════════════════════
   REVEAL
══════════════════════════════════════════════ */
function Reveal({ children, className = "", delay = 0, from = "bottom", once = false }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once, margin: "-55px" });
  const dir = useScrollDir();
  const V = {
    bottom: { hidden:{ y:65,  opacity:0, scale:.96, filter:"blur(6px)" }, visible:{ y:0, opacity:1, scale:1, filter:"blur(0px)" }, exit:{ y:-48, opacity:0, scale:.97, filter:"blur(4px)" } },
    top:    { hidden:{ y:-65, opacity:0, scale:.96, filter:"blur(6px)" }, visible:{ y:0, opacity:1, scale:1, filter:"blur(0px)" }, exit:{ y:48,  opacity:0 } },
    left:   { hidden:{ x:-75, opacity:0, scale:.96, filter:"blur(6px)" }, visible:{ x:0, opacity:1, scale:1, filter:"blur(0px)" }, exit:{ x:55,  opacity:0 } },
    right:  { hidden:{ x:75,  opacity:0, scale:.96, filter:"blur(6px)" }, visible:{ x:0, opacity:1, scale:1, filter:"blur(0px)" }, exit:{ x:-55, opacity:0 } },
    scale:  { hidden:{ scale:.75, opacity:0, filter:"blur(8px)" }, visible:{ scale:1, opacity:1, filter:"blur(0px)" }, exit:{ scale:.85, opacity:0 } },
  };
  const { hidden, visible, exit } = V[from] || V.bottom;
  return (
    <motion.div ref={ref} className={className}
      initial="hidden"
      animate={inV ? "visible" : once ? "hidden" : dir === "up" ? "exit" : "hidden"}
      variants={{ hidden, visible, exit }}
      transition={{ duration:.75, delay, ease:EASE_EXPO }}>
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   STAGGER CONTAINER
══════════════════════════════════════════════ */
function StaggerContainer({ children, className = "", stagger = 0.08, from = "bottom" }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once:false, margin:"-55px" });
  const dir = useScrollDir();
  const Bv = {
    bottom: { hidden:{ y:55,  opacity:0, scale:.95, filter:"blur(5px)" }, visible:{ y:0, opacity:1, scale:1, filter:"blur(0px)" }, exit:{ y:-38, opacity:0 } },
    left:   { hidden:{ x:-55, opacity:0 }, visible:{ x:0, opacity:1 }, exit:{ x:38, opacity:0 } },
    scale:  { hidden:{ scale:.8, opacity:0 }, visible:{ scale:1, opacity:1 }, exit:{ scale:.88, opacity:0 } },
  };
  const { hidden, visible, exit } = Bv[from] || Bv.bottom;
  return (
    <motion.div ref={ref} className={className}
      initial="hidden"
      animate={inV ? "visible" : dir === "up" ? "exit" : "hidden"}
      variants={{ hidden:{}, visible:{ transition:{ staggerChildren:stagger }}, exit:{ transition:{ staggerChildren:stagger/2, staggerDirection:-1 }}}}>
      {Array.isArray(children)
        ? children.map((c,i) => <motion.div key={i} variants={{ hidden, visible, exit }} transition={{ duration:.68, ease:EASE_EXPO }}>{c}</motion.div>)
        : <motion.div variants={{ hidden, visible, exit }} transition={{ duration:.68, ease:EASE_EXPO }}>{children}</motion.div>}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   FLOAT
══════════════════════════════════════════════ */
function Float({ children, className = "", style, duration = 4, yRange = 14, delay = 0 }) {
  return (
    <motion.div className={className} style={style}
      animate={{ y:[-yRange/2, yRange/2, -yRange/2] }}
      transition={{ duration, repeat:Infinity, ease:"easeInOut", delay }}>
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   GLOW CARD
══════════════════════════════════════════════ */
function GlowCard({ children, className = "", accent = B.primary }) {
  const ref  = useRef(null);
  const inV  = useInView(ref, { once:false, margin:"-40px" });
  const [pos, setPos] = useState({ x:0, y:0 });
  const mv = e => { const r=ref.current?.getBoundingClientRect(); if(r) setPos({x:e.clientX-r.left,y:e.clientY-r.top}); };
  return (
    <motion.div ref={ref} className={`relative rounded-2xl overflow-hidden ${className}`} onMouseMove={mv}
      initial={{ opacity:0, y:40, scale:.96 }}
      animate={inV ? { opacity:1, y:0, scale:1 } : { opacity:0, y:40, scale:.96 }}
      transition={{ duration:.72, ease:EASE_EXPO }}>
      <div className="absolute pointer-events-none rounded-2xl z-0"
        style={{ inset:-1, background:`radial-gradient(280px circle at ${pos.x}px ${pos.y}px,${accent}28,transparent 58%)`, opacity:inV?1:0, transition:"opacity .3s" }}/>
      <motion.div className="absolute inset-0 rounded-2xl pointer-events-none z-0"
        animate={inV ? { opacity:[.22,.5,.22] } : { opacity:0 }}
        transition={{ duration:2.5, repeat:Infinity, ease:"easeInOut" }}
        style={{ boxShadow:`inset 0 0 0 1px ${accent}32` }}/>
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   TILT CARD
══════════════════════════════════════════════ */
function TiltCard({ children, className = "", intensity = 9 }) {
  const ref = useRef(null);
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const srx = useSpring(rx,{stiffness:200,damping:22}), sry = useSpring(ry,{stiffness:200,damping:22});
  const mm = e => { const r=ref.current.getBoundingClientRect(); rx.set(-((e.clientY-r.top)/r.height-.5)*intensity); ry.set(((e.clientX-r.left)/r.width-.5)*intensity); };
  const ml = () => { rx.set(0); ry.set(0); };
  return (
    <motion.div ref={ref} onMouseMove={mm} onMouseLeave={ml}
      style={{ rotateX:srx, rotateY:sry, transformPerspective:900 }} className={className}>
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   MAGNETIC BUTTON
══════════════════════════════════════════════ */
function MagBtn({ children, className = "", style, onClick, type }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x,{stiffness:250,damping:16}), sy = useSpring(y,{stiffness:250,damping:16});
  const mm = e => { const r=ref.current.getBoundingClientRect(); x.set((e.clientX-r.left-r.width/2)*.35); y.set((e.clientY-r.top-r.height/2)*.35); };
  const ml = () => { x.set(0); y.set(0); };
  return (
    <motion.button ref={ref} type={type} style={{x:sx,y:sy,...style}} onMouseMove={mm} onMouseLeave={ml}
      whileTap={{scale:.94}} onClick={onClick} className={className}>
      {children}
    </motion.button>
  );
}

/* ══════════════════════════════════════════════
   ANIMATED COUNTER
══════════════════════════════════════════════ */
function Counter({ value }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once:false });
  const raw = String(value).replace(/[^0-9.]/g,"");
  const num = parseFloat(raw) || 0;
  const sfx = String(value).replace(/[0-9.]/g,"");
  const mv  = useMotionValue(0);
  const sp  = useSpring(mv,{stiffness:55,damping:14});
  const [d, setD] = useState(0);
  useEffect(()=>{ mv.set(inV ? num : 0); },[inV]);
  useEffect(()=> sp.on("change", v => setD(Math.round(v))),[sp]);
  return <span ref={ref}>{d}{sfx}</span>;
}

/* ══════════════════════════════════════════════
   CUSTOM CURSOR  — orange
══════════════════════════════════════════════ */
function CustomCursor() {
  const outer=useRef(null), dot=useRef(null), trail=useRef(null);
  const pos=useRef({x:-300,y:-300}), sm=useRef({x:-300,y:-300});
  const [hov,setHov]=useState(false), [clk,setClk]=useState(false);
  useEffect(()=>{
    const mv=e=>{pos.current={x:e.clientX,y:e.clientY};};
    const md=()=>setClk(true), mu=()=>setClk(false);
    document.addEventListener("mousemove",mv); document.addEventListener("mousedown",md); document.addEventListener("mouseup",mu);
    const att=()=>{ document.querySelectorAll("a,button,[data-hover]").forEach(el=>{ el.addEventListener("mouseenter",()=>setHov(true)); el.addEventListener("mouseleave",()=>setHov(false)); }); };
    att(); const ob=new MutationObserver(att); ob.observe(document.body,{childList:true,subtree:true});
    let id;
    const loop=()=>{
      sm.current.x+=(pos.current.x-sm.current.x)*.09; sm.current.y+=(pos.current.y-sm.current.y)*.09;
      const s=clk?.65:hov?2.1:1;
      if(outer.current) outer.current.style.transform=`translate(${sm.current.x-20}px,${sm.current.y-20}px) scale(${s})`;
      if(dot.current)   dot.current.style.transform  =`translate(${pos.current.x-3}px,${pos.current.y-3}px) scale(${clk?1.9:1})`;
      if(trail.current) trail.current.style.transform=`translate(${sm.current.x-30}px,${sm.current.y-30}px) scale(${hov?1.6:.5})`;
      id=requestAnimationFrame(loop);
    };
    id=requestAnimationFrame(loop);
    return()=>{ document.removeEventListener("mousemove",mv); document.removeEventListener("mousedown",md); document.removeEventListener("mouseup",mu); ob.disconnect(); cancelAnimationFrame(id); };
  },[hov,clk]);
  return (
    <>
      <div ref={outer} className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9998]"
        style={{ border:`1.5px solid ${hov?B.primary:B.p(.42)}`, background:hov?B.p(.07):"transparent", willChange:"transform", transition:"border-color .15s,background .15s" }}/>
      <div ref={dot} className="fixed top-0 left-0 w-[6px] h-[6px] rounded-full pointer-events-none z-[9999]"
        style={{ background:hov?B.primary:B.dark, willChange:"transform", transition:"background .1s" }}/>
      <div ref={trail} className="fixed top-0 left-0 w-[60px] h-[60px] rounded-full pointer-events-none z-[9996] opacity-[.09]"
        style={{ background:`radial-gradient(circle,${B.primary},transparent)`, willChange:"transform" }}/>
    </>
  );
}

/* ══════════════════════════════════════════════
   SCROLL PROGRESS BAR
══════════════════════════════════════════════ */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress,{stiffness:120,damping:30});
  return (
    <motion.div className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[9997]"
      style={{ scaleX, background:`linear-gradient(90deg,${B.veryDark},${B.dark},${B.gold},${B.primary},${B.gold})` }}/>
  );
}

/* ══════════════════════════════════════════════
   SECTION NAV DOTS
══════════════════════════════════════════════ */
function SectionNavDots() {
  const [active, setActive] = useState(0);
  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){const i=NAV_SECTIONS.indexOf(e.target.id);if(i!==-1)setActive(i);}}),{threshold:.35});
    NAV_SECTIONS.forEach(id=>{const el=document.getElementById(id);if(el)obs.observe(el);});
    return()=>obs.disconnect();
  },[]);
  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-[900] flex-col gap-4 hidden md:flex">
      {NAV_SECTIONS.map((id,i)=>(
        <motion.button key={i} onClick={()=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"})}
          className="relative flex items-center gap-2" title={NAV_LABELS[i]}>
          <motion.span initial={{opacity:0,x:8}} animate={{opacity:active===i?1:0,x:active===i?0:8}}
            className="absolute right-6 text-[11px] font-bold bg-[#0f0f0f]/80 backdrop-blur-sm px-2 py-1 rounded-md whitespace-nowrap pointer-events-none"
            style={{color:B.primary}}></motion.span>
          <motion.div animate={{scale:active===i?1.4:1,background:active===i?B.primary:B.p(.35)}}
            transition={{type:"spring",stiffness:300,damping:22}} className="w-2.5 h-2.5 rounded-full"/>
          {active===i&&(
            <motion.div layoutId="programs-nav-pulse" className="absolute inset-0 rounded-full"
              style={{scale:2,border:`1.5px solid ${B.primary}`,opacity:.5}}
              animate={{scale:[2,2.8,2],opacity:[.5,0,.5]}} transition={{duration:1.8,repeat:Infinity}}/>
          )}
        </motion.button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   NOISE CANVAS  — warm orange tints
══════════════════════════════════════════════ */
function NoiseCanvas({ color1=B.tint, color2=B.tint2, opacity=0.38 }) {
  const ref=useRef(null);
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const ctx=c.getContext("2d"); let t=0,id;
    const draw=()=>{
      const w=c.width=c.offsetWidth, h=c.height=c.offsetHeight;
      const g=ctx.createRadialGradient(w*(.3+.22*Math.sin(t*.38)),h*(.3+.16*Math.cos(t*.28)),0,w*.5,h*.5,Math.max(w,h)*.88);
      g.addColorStop(0,color1+"cc"); g.addColorStop(.5,color2+"88"); g.addColorStop(1,"transparent");
      ctx.clearRect(0,0,w,h); ctx.fillStyle=g; ctx.fillRect(0,0,w,h); t+=.007; id=requestAnimationFrame(draw);
    };
    draw(); return()=>cancelAnimationFrame(id);
  },[color1,color2]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{opacity}}/>;
}

/* ══════════════════════════════════════════════
   PARTICLE CANVAS  — orange particles
══════════════════════════════════════════════ */
function ParticleCanvas({ count=22, color=B.p(.09) }) {
  const ref=useRef(null);
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const ctx=c.getContext("2d");
    let w=c.width=c.offsetWidth, h=c.height=c.offsetHeight;
    const pts=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.36,vy:(Math.random()-.5)*.36,r:Math.random()*1.7+.7}));
    let id;
    const draw=()=>{
      ctx.clearRect(0,0,w,h);
      pts.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; if(p.x<0)p.x=w; if(p.x>w)p.x=0; if(p.y<0)p.y=h; if(p.y>h)p.y=0; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=color; ctx.fill(); });
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
        const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);
        if(d<88){ ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.strokeStyle=color.replace(/[\d.]+\)$/,`${(1-d/88)*.06})`); ctx.stroke(); }
      }
      id=requestAnimationFrame(draw);
    };
    draw();
    const rz=()=>{w=c.width=c.offsetWidth;h=c.height=c.offsetHeight;};
    window.addEventListener("resize",rz);
    return()=>{ cancelAnimationFrame(id); window.removeEventListener("resize",rz); };
  },[count,color]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none"/>;
}

/* ══════════════════════════════════════════════
   SPOTLIGHT
══════════════════════════════════════════════ */
function Spotlight({ color=B.p(.06), size=580 }) {
  const ref=useRef(null);
  useEffect(()=>{
    const fn=e=>{ if(!ref.current) return; const r=ref.current.getBoundingClientRect(); ref.current.style.background=`radial-gradient(${size}px circle at ${e.clientX-r.left}px ${e.clientY-r.top}px,${color},transparent 70%)`; };
    window.addEventListener("mousemove",fn); return()=>window.removeEventListener("mousemove",fn);
  },[color,size]);
  return <div ref={ref} className="absolute inset-0 pointer-events-none z-[1]"/>;
}

/* ══════════════════════════════════════════════
   WAVE DIVIDER
══════════════════════════════════════════════ */
function WaveDivider({ color=B.gold, flip=false, toBg="#fff" }) {
  const ref=useRef(null);
  const inV=useInView(ref,{once:true,margin:"-10px"});
  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${flip?"rotate-180":""}`} style={{height:56}}>
      <svg viewBox="0 0 1440 56" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <motion.path d="M0,28 C240,0 480,56 720,28 C960,0 1200,56 1440,28 L1440,56 L0,56 Z"
          fill={toBg} initial={{pathLength:0}} animate={inV?{pathLength:1}:{}} transition={{duration:1.2,ease:EASE_EXPO}}/>
        <motion.path d="M0,28 C240,0 480,56 720,28 C960,0 1200,56 1440,28"
          stroke={color} strokeWidth="1.5" fill="none"
          initial={{pathLength:0,opacity:0}} animate={inV?{pathLength:1,opacity:1}:{}} transition={{duration:1.4,ease:EASE_EXPO,delay:.15}}/>
        <motion.path d="M0,36 C240,8 480,64 720,36 C960,8 1200,64 1440,36"
          stroke={color} strokeWidth=".6" fill="none" opacity=".4"
          initial={{pathLength:0}} animate={inV?{pathLength:1}:{}} transition={{duration:1.4,ease:EASE_EXPO,delay:.3}}/>
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SECTION LABEL
══════════════════════════════════════════════ */
function SLabel({ text }) {
  return (
    <Reveal from="top" className="flex items-center gap-3 justify-center mb-3">
      <motion.div initial={{scaleX:0}} whileInView={{scaleX:1}} viewport={{once:false}} transition={{duration:.55}}
        className="h-px w-8 origin-left" style={{background:B.primary}}/>
      <span className="font-bold tracking-[.2em] text-[11px] uppercase" style={{color:B.primary}}>{text}</span>
      <motion.div initial={{scaleX:0}} whileInView={{scaleX:1}} viewport={{once:false}} transition={{duration:.55}}
        className="h-px w-8 origin-right" style={{background:B.primary}}/>
    </Reveal>
  );
}

/* ══════════════════════════════════════════════
   WORD-BY-WORD HEADING
══════════════════════════════════════════════ */
function AHeading({ children, className = "", delay = 0 }) {
  const ref=useRef(null);
  const inV=useInView(ref,{once:false,margin:"-50px"});
  const dir=useScrollDir();
  const words=typeof children==="string"?children.split(" "):[children];
  return (
    <h2 ref={ref} className={className}>
      {words.map((w,i)=>(
        <span key={i} className="inline-block overflow-hidden mr-[.28em]">
          <motion.span className="inline-block"
            initial={{y:"110%",opacity:0,skewY:5}}
            animate={inV?{y:0,opacity:1,skewY:0}:dir==="up"?{y:"-110%",opacity:0,skewY:-5}:{y:"110%",opacity:0,skewY:5}}
            transition={{duration:.72,delay:delay+i*.075,ease:EASE_EXPO}}>
            {w}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}

/* ══════════════════════════════════════════════
   MARQUEE STRIP
══════════════════════════════════════════════ */
const MARQUEE_ITEMS=["Workshops","Hackathons","School Programs","Achievements","Announcements","Partnerships","Challenges","Expos","Live Events","Featured Updates"];
function MarqueeStrip({ dark=false }) {
  const [paused,setPaused]=useState(false);
  const items=[...MARQUEE_ITEMS,...MARQUEE_ITEMS];
  return (
    <div className="py-4 overflow-hidden border-y"
      style={{borderColor:dark?"rgba(255,255,255,0.08)":"rgba(230,107,38,0.12)", background:dark?B.p(.03):B.warmBg}}
      onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}>
      <motion.div className="flex gap-10 whitespace-nowrap"
        animate={paused?{}:{x:["0%","-50%"]}}
        transition={{repeat:Infinity,duration:26,ease:"linear"}}>
        {items.map((item,i)=>(
          <span key={i} className="flex items-center gap-3 text-sm font-semibold select-none"
            style={{color:dark?B.p(.42):B.pd(.55)}}>
            <motion.span className="w-1.5 h-1.5 rounded-full shrink-0" style={{background:B.gold}}
              animate={{scale:[1,1.4,1]}} transition={{duration:2,repeat:Infinity,delay:i*.1}}/>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
const TYPES = [
  { value:"all",              label:"All Updates",     icon:"📢" },
  { value:"workshop",         label:"Workshops",       icon:"🎓" },
  { value:"hackathon",        label:"Hackathons",      icon:"💻" },
  { value:"challenge",        label:"Challenges",      icon:"🏆" },
  { value:"school-program",   label:"School Programs", icon:"🏫" },
  { value:"expo",             label:"Expos",           icon:"🎪" },
  { value:"announcement",     label:"Announcements",   icon:"📢" },
  { value:"partnership",      label:"Partnerships",    icon:"🤝" },
  { value:"achievement",      label:"Achievements",    icon:"⭐" },
];
const STATUSES = [
  { value:"all",               label:"All Status",          icon:Eye         },
  { value:"upcoming",          label:"Upcoming",            icon:CalendarDays},
  { value:"ongoing",           label:"Live Now",            icon:Zap         },
  { value:"registration-open", label:"Registration Open",   icon:Users       },
  { value:"featured",          label:"Featured",            icon:Star        },
];

/* Status gradients — all orange-family */
function getStatusGradient(s) {
  const m={
    upcoming:            `linear-gradient(135deg,${B.primary},${B.dark})`,
    ongoing:             `linear-gradient(135deg,${B.dark},${B.veryDark})`,
    "registration-open": `linear-gradient(135deg,${B.primary},${B.gold})`,
    featured:            `linear-gradient(135deg,${B.gold},${B.primary})`,
  };
  return m[s]||`linear-gradient(135deg,#9ca3af,#6b7280)`;
}
function getStatusAccent(s) {
  const m={ upcoming:B.primary, ongoing:B.dark, "registration-open":B.gold, featured:B.gold };
  return m[s]||"#9ca3af";
}
function getTypeIcon(t) { return TYPES.find(x=>x.value===t)?.icon||"📌"; }
function formatDate(ds) {
  const d=new Date(ds), now=new Date();
  const diff=Math.floor(Math.abs(now-d)/(1000*60*60*24));
  if(diff===0) return "Today"; if(diff===1) return "Yesterday"; if(diff<7) return `${diff} days ago`;
  if(diff<30) return `${Math.floor(diff/7)} weeks ago`;
  return d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
}

/* Shared filter pill styles */
const activePill  = { background:B.primary, color:"#fff", borderColor:B.primary, boxShadow:`0 4px 14px ${B.p(.38)}` };
const inactivePill= { background:"#fff",     color:B.text, borderColor:B.border,  boxShadow:"0 1px 3px rgba(0,0,0,0.05)" };

/* ══════════════════════════════════════════════
   HERO
══════════════════════════════════════════════ */
function HeroSection({ totalCount }) {
  const secRef=useRef(null);
  const {scrollYProgress}=useScroll({target:secRef,offset:["start start","end start"]});
  const hY  =useTransform(scrollYProgress,[0,1],[0,-110]);
  const hO  =useTransform(scrollYProgress,[0,.6],[1,0]);
  const hS  =useTransform(scrollYProgress,[0,1],[1,.84]);
  const bigY=useTransform(scrollYProgress,[0,1],[0,180]);
  const imgS=useTransform(scrollYProgress,[0,1],[1,1.12]);

  const mx=useMotionValue(0), my=useMotionValue(0);
  const smx=useSpring(mx,{stiffness:35,damping:18}), smy=useSpring(my,{stiffness:35,damping:18});
  const b1x=useTransform(smx,[-1,1],[-26,26]), b1y=useTransform(smy,[-1,1],[-14,14]);
  const b2x=useTransform(smx,[-1,1],[18,-18]),  b2y=useTransform(smy,[-1,1],[12,-12]);
  useEffect(()=>{
    const fn=e=>{mx.set((e.clientX/window.innerWidth-.5)*2); my.set((e.clientY/window.innerHeight-.5)*2);};
    window.addEventListener("mousemove",fn); return()=>window.removeEventListener("mousemove",fn);
  },[]);

  const STATS=[
    { icon:Bell,     value:`${totalCount}`, label:"Updates"     },
    { icon:Users,    value:"5K+",           label:"Participants" },
    { icon:Building, value:"100+",          label:"Partners"    },
    { icon:Rocket,   value:"50+",           label:"Events"      },
  ];

  return (
    <section id="prog-hero" ref={secRef} className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 min-h-[90vh] flex items-center overflow-hidden">
      {/* BG — warm orange tint (was green tint) */}
      <motion.div className="absolute inset-0 z-0" style={{scale:imgS}}>
        <div className="absolute inset-0" style={{background:`linear-gradient(135deg,${B.light} 0%,#fff 50%,${B.warmBg} 100%)`}}/>
        <div className="absolute inset-0" style={{background:`linear-gradient(135deg,${B.p(.06)} 0%,transparent 50%,${B.pd(.04)} 100%)`}}/>
      </motion.div>

      {/* Canvas layers */}
      <NoiseCanvas color1={B.tint} color2={B.tint2} opacity={0.28}/>
      <div className="absolute inset-0 z-[1]"><ParticleCanvas count={20}/></div>

      {/* Animated bg gradient pulse — orange */}
      <motion.div className="absolute inset-0 z-[2] opacity-20"
        animate={{ background:[`radial-gradient(circle at 20% 30%,${B.p(.18)} 0%,transparent 40%)`,`radial-gradient(circle at 80% 70%,${B.p(.18)} 0%,transparent 40%)`,`radial-gradient(circle at 20% 30%,${B.p(.18)} 0%,transparent 40%)`] }}
        transition={{ duration:10, repeat:Infinity, ease:"linear" }}/>

      {/* Kinetic bg text — orange tint (was green) */}
      <motion.div style={{y:bigY}} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-[2]">
        <span className="text-[19vw] font-black leading-none tracking-tighter uppercase whitespace-nowrap"
          style={{color:B.p(.022)}}>UPDATES</span>
      </motion.div>

      {/* Dot grid — dark orange-brown (was dark green) */}
      <div className="absolute inset-0 z-[2] opacity-[.032]"
        style={{backgroundImage:`radial-gradient(circle,${B.veryDark} 1px,transparent 1px)`,backgroundSize:"32px 32px"}}/>

      {/* Mouse parallax blobs */}
      <motion.div style={{x:b1x,y:b1y}} className="absolute top-16 left-[6%] w-72 h-72 pointer-events-none z-[2]">
        <div className="w-full h-full rounded-full" style={{filter:"blur(100px)",opacity:.32,background:`radial-gradient(circle,${B.tint},transparent)`}}/>
      </motion.div>
      <motion.div style={{x:b2x,y:b2y}} className="absolute bottom-16 right-[6%] w-96 h-96 pointer-events-none z-[2]">
        <div className="w-full h-full rounded-full" style={{filter:"blur(110px)",opacity:.2,background:`radial-gradient(circle,${B.gold},transparent)`}}/>
      </motion.div>
      {/* Extra orange blob */}
      <div className="absolute top-[40%] right-[8%] w-60 h-60 pointer-events-none z-[2]">
        <div className="w-full h-full rounded-full" style={{filter:"blur(80px)",opacity:.14,background:`radial-gradient(circle,${B.primary},transparent)`}}/>
      </div>

      {/* Floating orbs — all orange family */}
      <Float style={{position:"absolute",top:"25%",left:"8%",width:10,height:10,borderRadius:"50%",background:B.p(.32),zIndex:2}} duration={5} delay={0}><div/></Float>
      <Float style={{position:"absolute",top:"33%",right:"10%",width:8,height:8,borderRadius:"50%",background:B.pd(.28),zIndex:2}} duration={4} delay={1}><div/></Float>
      <Float style={{position:"absolute",bottom:"33%",left:"14%",width:14,height:14,borderRadius:"50%",background:B.p(.2),zIndex:2}} duration={6} delay={2}><div/></Float>
      <Float style={{position:"absolute",bottom:"25%",right:"16%",width:8,height:8,borderRadius:"50%",background:`${B.gold}55`,zIndex:2}} duration={5.5} delay={.5}><div/></Float>

      {/* Content */}
      <motion.div style={{y:hY,opacity:hO,scale:hS}} className="max-w-6xl mx-auto text-center relative z-10 w-full">

        {/* Badge */}
        <motion.div initial={{scale:.7,opacity:0,y:20}} animate={{scale:1,opacity:1,y:0}} transition={{duration:.65,ease:EASE_BACK}}
          className="inline-flex items-center gap-2 backdrop-blur-sm border rounded-full px-5 py-2.5 mb-8 shadow-sm"
          style={{background:"rgba(255,255,255,0.88)",borderColor:B.p(.35)}}>
          <motion.div animate={{rotate:[0,18,-18,0]}} transition={{duration:2.8,repeat:Infinity,ease:"easeInOut"}}>
            <BellRing className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]"/>
          </motion.div>
          <span className="text-sm font-semibold" style={{color:B.dark}}>Company Updates &amp; Announcements</span>
          <motion.div animate={{opacity:[.5,1,.5]}} transition={{duration:2,repeat:Infinity}}>
            <Sparkles className="w-3.5 h-3.5" style={{color:`${B.gold}99`}}/>
          </motion.div>
        </motion.div>

        {/* Heading — orange gradient (was green) */}
        <motion.h1 initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:.3,duration:.75,ease:EASE_EXPO}}
          className="text-4xl sm:text-5xl md:text-7xl font-bold mb-5 px-2">
          <span style={{color:B.text}}>Stackenzo</span>
          <br/>
          <span className="text-transparent bg-clip-text"
            style={{backgroundImage:`linear-gradient(135deg,${B.primary},${B.dark})`}}>
            Updates
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.5,ease:EASE_EXPO}}
          className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed px-4 mb-10 rounded-2xl border backdrop-blur-sm p-6"
          style={{color:"rgba(26,26,26,0.68)",borderColor:`${B.border}cc`,background:"rgba(255,255,255,0.38)"}}>
          Stay informed about our latest workshops, hackathons, achievements, partnerships, and announcements.
        </motion.p>

        {/* Stats */}
        <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{delay:.7,ease:EASE_EXPO}}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto px-2">
          {STATS.map((s,i)=>(
            <Float key={i} duration={4+i*.5} delay={i*.3}>
              <TiltCard>
                <motion.div whileHover={{y:-6,boxShadow:`0 18px 44px ${B.p(.18)}`}}
                  className="backdrop-blur-sm border rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm text-center cursor-default transition-all"
                  style={{background:"rgba(255,255,255,0.9)",borderColor:B.border}}>
                  <s.icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1.5" style={{color:B.primary}}/>
                  <div className="text-lg sm:text-2xl font-black" style={{color:B.text}}><Counter value={s.value}/></div>
                  <div className="text-xs sm:text-sm" style={{color:"rgba(26,26,26,0.5)"}}>{s.label}</div>
                </motion.div>
              </TiltCard>
            </Float>
          ))}
        </motion.div>

        {/* Scroll cue */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.8}}
          className="flex justify-center mt-10 cursor-pointer"
          onClick={()=>document.getElementById("updates")?.scrollIntoView({behavior:"smooth"})}>
          <Float duration={2} yRange={10}>
            <div className="flex flex-col items-center gap-1.5" style={{color:B.p(.5)}}>
              <span className="text-xs font-medium">Scroll to explore</span>
              <div className="w-5 h-8 rounded-full flex justify-center" style={{border:`2px solid ${B.p(.28)}`}}>
                <motion.div className="w-1 h-2 rounded-full mt-1.5" style={{background:B.gold}}
                  animate={{y:[0,10,0],opacity:[1,.4,1]}} transition={{duration:1.8,repeat:Infinity}}/>
              </div>
            </div>
          </Float>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   NOTIFICATION CARD
══════════════════════════════════════════════ */
function NotificationCard({ program, index, isPinned, togglePin }) {
  const accent = getStatusAccent(program.status);
  return (
    <GlowCard accent={accent} className="h-full">
      <TiltCard intensity={7} className="h-full">
        <motion.div whileHover={{ y:-7, boxShadow:`0 28px 60px ${B.p(.16)}` }}
          className="group relative bg-white rounded-2xl border transition-all overflow-hidden shadow-sm h-full flex flex-col"
          style={{borderColor:isPinned?B.gold:B.border}}>

          {/* Top bar — orange gradient */}
          <div style={{height:7,background:getStatusGradient(program.status)}}/>

          {isPinned&&(
            <div className="absolute top-3 right-3 z-10">
              <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 fill-current" style={{color:B.gold}}/>
            </div>
          )}

          <div className="p-4 sm:p-5 flex flex-col flex-1">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <Float duration={4+index*.3} delay={index*.2} yRange={6}>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-lg border"
                    style={{background:B.light,borderColor:B.border}}>
                    {getTypeIcon(program.type)}
                  </div>
                </Float>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide" style={{color:B.primary}}>
                    {program.type.replace(/-/g," ")}
                  </div>
                  <div className="text-xs" style={{color:"rgba(26,26,26,0.42)"}}>{formatDate(program.date)}</div>
                </div>
              </div>
              <motion.button whileHover={{scale:1.2}} whileTap={{scale:.9}} onClick={()=>togglePin(program.id)}
                className="p-1.5 rounded-lg transition-colors"
                style={{color:isPinned?B.gold:"rgba(26,26,26,0.2)"}}>
                <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${isPinned?"fill-current":""}`}/>
              </motion.button>
            </div>

            {/* Status badge */}
            <div className="mb-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] sm:text-xs font-bold rounded-full text-white"
                style={{background:getStatusGradient(program.status)}}>
                <motion.span className="w-1.5 h-1.5 rounded-full bg-white/70"
                  animate={{scale:[1,1.5,1]}} transition={{duration:1.5,repeat:Infinity}}/>
                {program.status.replace(/-/g," ")}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-black mb-2 line-clamp-2 leading-snug" style={{color:B.text}}>
              {program.title}
            </h3>
            <p className="text-xs sm:text-sm mb-3 line-clamp-2 sm:line-clamp-3 flex-1 leading-relaxed"
              style={{color:"rgba(26,26,26,0.55)"}}>{program.description}</p>

            <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 text-xs" style={{color:"rgba(26,26,26,0.45)"}}>
              <div className="flex items-center gap-1"><MapPin className="w-3 h-3 shrink-0" style={{color:B.gold}}/><span className="truncate max-w-[90px]">{program.location}</span></div>
              <div className="flex items-center gap-1"><Clock className="w-3 h-3 shrink-0" style={{color:B.gold}}/><span>{program.duration}</span></div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {program.tags.slice(0,3).map((tag,j)=>(
                <motion.span key={j} whileHover={{scale:1.06}}
                  className="px-2 py-0.5 text-xs rounded-full border cursor-default"
                  style={{background:B.light,color:B.dark,borderColor:B.p(.28)}}>
                  {tag}
                </motion.span>
              ))}
              {program.tags.length>3&&(
                <span className="px-2 py-0.5 text-xs rounded-full border"
                  style={{background:B.light,color:B.dark,borderColor:B.p(.28)}}>
                  +{program.tags.length-3}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t mt-auto" style={{borderColor:B.border}}>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs" style={{color:"rgba(26,26,26,0.42)"}}>
                  <Eye className="w-3.5 h-3.5" style={{color:B.gold}}/>
                  {program.views||Math.floor(Math.random()*900)+100}
                </span>
                <span className="flex items-center gap-1 text-xs" style={{color:"rgba(26,26,26,0.42)"}}>
                  <MessageSquare className="w-3.5 h-3.5" style={{color:B.gold}}/>
                  {program.comments||Math.floor(Math.random()*50)}
                </span>
              </div>
              <Link to={`/Programs/${program.id}`}>
                <motion.div whileHover={{x:3,background:B.dark}}
                  className="flex items-center gap-1 px-3 py-1.5 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                  style={{background:B.primary}}>
                  Details <ChevronRight className="w-3 h-3"/>
                </motion.div>
              </Link>
            </div>
          </div>
        </motion.div>
      </TiltCard>
    </GlowCard>
  );
}

/* ══════════════════════════════════════════════
   TIMELINE CARD
══════════════════════════════════════════════ */
function TimelineCard({ program, index, isPinned, togglePin }) {
  const isEven = index % 2 === 0;
  const accent = getStatusAccent(program.status);
  return (
    <motion.div className="relative">
      {/* Mobile */}
      <Reveal from="bottom" delay={index * .04} className="sm:hidden">
        <GlowCard accent={accent}>
          <div className="bg-white rounded-xl p-4 shadow-sm border" style={{borderColor:isPinned?B.gold:B.border}}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3" style={{color:B.gold}}/>
                <span className="text-xs" style={{color:"rgba(26,26,26,0.45)"}}>{formatDate(program.date)}</span>
              </div>
              <motion.button whileTap={{scale:.9}} onClick={()=>togglePin(program.id)}>
                <Bookmark className={`w-3.5 h-3.5 ${isPinned?"fill-current":""}`} style={{color:isPinned?B.gold:"rgba(26,26,26,0.22)"}}/>
              </motion.button>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg w-7 h-7 rounded-lg flex items-center justify-center border"
                style={{background:B.light,borderColor:B.border}}>{getTypeIcon(program.type)}</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full text-white"
                style={{background:getStatusGradient(program.status)}}>{program.status.replace(/-/g," ")}</span>
            </div>
            <h3 className="text-sm font-black mb-1" style={{color:B.text}}>{program.title}</h3>
            <p className="text-xs mb-2 line-clamp-2" style={{color:"rgba(26,26,26,0.55)"}}>{program.description}</p>
            <div className="flex items-center gap-3 mb-2 text-xs" style={{color:"rgba(26,26,26,0.45)"}}>
              <div className="flex items-center gap-1"><MapPin className="w-3 h-3" style={{color:B.gold}}/>{program.location}</div>
              <div className="flex items-center gap-1"><Clock className="w-3 h-3" style={{color:B.gold}}/>{program.duration}</div>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {program.tags.slice(0,2).map((t,j)=>(
                <span key={j} className="px-2 py-0.5 text-xs rounded-full border"
                  style={{background:B.light,color:B.dark,borderColor:B.p(.28)}}>{t}</span>
              ))}
            </div>
            <Link to={`/Programs/${program.id}`} className="inline-flex items-center gap-1 text-xs font-bold"
              style={{color:B.primary}}>
              View Details <ChevronRight className="w-3 h-3"/>
            </Link>
          </div>
        </GlowCard>
      </Reveal>

      {/* Desktop */}
      <div className="hidden sm:flex items-center">
        {/* Timeline dot — orange gradient */}
        <div className="absolute left-1/2 -translate-x-1/2 z-10">
          <motion.div className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
            style={{background:getStatusGradient(program.status)}}
            animate={{scale:[1,1.3,1]}} transition={{duration:2,repeat:Infinity,delay:index*.3}}/>
        </div>

        <Reveal from={isEven?"right":"left"} delay={.05} className={`w-5/12 ${isEven?"ml-auto pl-10":"pr-10"}`}>
          <GlowCard accent={accent} className="h-full">
            <TiltCard intensity={6}>
              <motion.div whileHover={{y:-6,boxShadow:`0 24px 55px ${B.p(.18)}`}}
                className="group bg-white rounded-2xl p-5 sm:p-6 shadow-sm transition-all"
                style={{border:`1px solid ${isPinned?B.gold:B.border}`,position:"relative",overflow:"hidden"}}>
                {/* Top bar */}
                <div style={{position:"absolute",top:0,left:0,right:0,height:4,borderRadius:"12px 12px 0 0",background:getStatusGradient(program.status)}}/>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" style={{color:B.gold}}/>
                    <span className="text-sm" style={{color:"rgba(26,26,26,0.45)"}}>{formatDate(program.date)}</span>
                  </div>
                  <motion.button whileHover={{scale:1.2}} whileTap={{scale:.9}} onClick={()=>togglePin(program.id)}>
                    <Bookmark className={`w-4 h-4 ${isPinned?"fill-current":""}`}
                      style={{color:isPinned?B.gold:"rgba(26,26,26,0.22)"}}/>
                  </motion.button>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Float duration={4} yRange={5} delay={index*.2}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg border"
                      style={{background:B.light,borderColor:B.border}}>{getTypeIcon(program.type)}</div>
                  </Float>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full text-white flex items-center gap-1"
                    style={{background:getStatusGradient(program.status)}}>
                    <motion.span className="w-1.5 h-1.5 rounded-full bg-white/70" animate={{scale:[1,1.5,1]}} transition={{duration:1.5,repeat:Infinity}}/>
                    {program.status.replace(/-/g," ")}
                  </span>
                </div>
                <h3 className="text-base font-black mb-2 transition-colors" style={{color:B.text}}>{program.title}</h3>
                <p className="text-sm mb-3 line-clamp-2 leading-relaxed" style={{color:"rgba(26,26,26,0.55)"}}>{program.description}</p>
                <div className="flex items-center gap-4 mb-3 text-sm" style={{color:"rgba(26,26,26,0.45)"}}>
                  <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" style={{color:B.gold}}/>{program.location}</div>
                  <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" style={{color:B.gold}}/>{program.duration}</div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {program.tags.slice(0,3).map((t,j)=>(
                    <motion.span key={j} whileHover={{scale:1.06}}
                      className="px-2 py-0.5 text-xs rounded-full border"
                      style={{background:B.light,color:B.dark,borderColor:B.p(.28)}}>{t}</motion.span>
                  ))}
                </div>
                <Link to={`/Programs/${program.id}`} className="inline-flex items-center gap-1 text-sm font-bold transition-colors"
                  style={{color:B.primary}}>
                  View Details <motion.span animate={{x:[0,3,0]}} transition={{duration:1.4,repeat:Infinity}}><ChevronRight className="w-4 h-4"/></motion.span>
                </Link>
              </motion.div>
            </TiltCard>
          </GlowCard>
        </Reveal>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════ */
function Programs() {
  const [programs,       setPrograms]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [selectedType,   setSelectedType]   = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode,       setViewMode]       = useState("grid");
  const [pinnedPosts,    setPinnedPosts]    = useState([]);
  const [showArchived,   setShowArchived]   = useState(false);
  const [searchQuery,    setSearchQuery]    = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(()=>{ fetchPrograms(); },[selectedType,selectedStatus,showArchived]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const params=new URLSearchParams();
      if(selectedType!=="all")   params.append("type",selectedType);
      if(selectedStatus!=="all") params.append("status",selectedStatus);
      if(showArchived)           params.append("archived","true");
      const res=await fetch(`http://localhost:5000/api/programs?${params}`);
      const data=await res.json();
      if(data.success) setPrograms(data.programs);
    } catch(e){ console.error(e); } finally { setLoading(false); }
  };

  const togglePin = id => setPinnedPosts(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);

  const filtered = programs.filter(p=>{
    if(!searchQuery) return true;
    const q=searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q)||p.description.toLowerCase().includes(q)||p.tags.some(t=>t.toLowerCase().includes(q));
  }).sort((a,b)=>new Date(b.date)-new Date(a.date));

  const pinned   = filtered.filter(p=>pinnedPosts.includes(p.id));
  const unpinned = filtered.filter(p=>!pinnedPosts.includes(p.id));
  const ordered  = [...pinned,...unpinned];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{background:"#fff",color:B.text}}>
      <CustomCursor/>
      <ScrollProgressBar/>
      <SectionNavDots/>
      <Navbar/>

      <HeroSection totalCount={programs.length}/>
      <MarqueeStrip/>

      {/* ── Updates section ── */}
      <WaveDivider color={B.gold} toBg={B.light}/>
      <section id="updates" className="scroll-mt-20 py-8 sm:py-14 px-3 sm:px-6 relative overflow-hidden"
        style={{background:B.light}}>
        <NoiseCanvas color1={B.tint} color2={B.warmBg} opacity={0.22}/>
        <Spotlight color={B.p(.05)} size={520}/>

        {/* Kinetic bg text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <motion.span className="text-[15vw] font-black leading-none tracking-tighter uppercase"
            style={{color:B.p(.048)}}
            animate={{y:[0,-10,0]}} transition={{duration:9,repeat:Infinity,ease:"easeInOut"}}>
            {selectedType==="all"?"EXPLORE":selectedType.toUpperCase()}
          </motion.span>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <SLabel text="Latest Updates"/>
            <AHeading className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]"
              style={{backgroundImage:`linear-gradient(135deg,${B.primary},${B.dark})`}} delay={.05}>
              Explore All Updates
            </AHeading>
          </div>

          {/* Filter bar */}
          <Reveal from="top" delay={.1} className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{color:"rgba(26,26,26,0.35)"}}/>
                <motion.input type="text" placeholder="Search updates…" value={searchQuery}
                  onChange={e=>setSearchQuery(e.target.value)}
                  whileFocus={{boxShadow:`0 0 0 2px ${B.p(.28)}`}}
                  className="w-full border rounded-xl pl-10 pr-4 py-3 text-sm placeholder-gray-400 focus:outline-none transition-all shadow-sm"
                  style={{background:"#fff",borderColor:B.border,color:B.text}}/>
                {searchQuery&&(
                  <motion.button whileHover={{scale:1.2}} whileTap={{scale:.9}}
                    onClick={()=>setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{color:"rgba(26,26,26,0.3)"}}>
                    <X className="w-4 h-4"/>
                  </motion.button>
                )}
              </div>

              <div className="flex gap-2">
                {/* Mobile filter toggle */}
                <MagBtn onClick={()=>setShowMobileFilters(!showMobileFilters)}
                  className="sm:hidden flex-1 border rounded-xl px-4 py-3 flex items-center justify-center gap-2 shadow-sm text-sm font-medium"
                  style={{background:"#fff",borderColor:B.border,color:B.text}}>
                  <Filter className="w-4 h-4"/>
                  Filters
                  <motion.div animate={{rotate:showMobileFilters?180:0}} transition={{duration:.3}}>
                    <ChevronDown className="w-4 h-4"/>
                  </motion.div>
                </MagBtn>

                {/* View toggle */}
                <div className="hidden sm:flex border rounded-xl p-1 shadow-sm gap-1"
                  style={{background:"#fff",borderColor:B.border}}>
                  {[{m:"grid",I:Grid3X3},{m:"timeline",I:List}].map(({m,I})=>(
                    <MagBtn key={m} onClick={()=>setViewMode(m)}
                      className="p-2 rounded-lg transition-all"
                      style={viewMode===m?{background:B.primary,color:"#fff"}:{color:"rgba(26,26,26,0.35)"}}>
                      <I className="w-5 h-5"/>
                    </MagBtn>
                  ))}
                </div>

                {/* Archive toggle */}
                <MagBtn onClick={()=>setShowArchived(!showArchived)}
                  className="px-4 py-2 rounded-xl border flex items-center gap-2 shadow-sm text-sm font-medium transition-all"
                  style={showArchived?{background:`${B.gold}18`,borderColor:B.gold,color:B.gold}:inactivePill}>
                  <Archive className="w-4 h-4 sm:w-5 sm:h-5"/>
                  <span className="hidden sm:inline">{showArchived?"Hide":"Show"} Archive</span>
                </MagBtn>
              </div>
            </div>

            {/* Desktop filter pills */}
            <div className="hidden sm:block space-y-3">
              <StaggerContainer className="flex flex-wrap gap-2" stagger={0.04} from="left">
                {TYPES.map(t=>(
                  <MagBtn key={t.value} onClick={()=>setSelectedType(t.value)}
                    className="px-3.5 py-2 rounded-xl text-sm font-medium flex items-center gap-2 border shadow-sm transition-all"
                    style={selectedType===t.value?activePill:inactivePill}>
                    <span>{t.icon}</span><span>{t.label}</span>
                  </MagBtn>
                ))}
              </StaggerContainer>
              <StaggerContainer className="flex flex-wrap gap-2" stagger={0.04} from="left">
                {STATUSES.map(s=>{ const SI=s.icon; return (
                  <MagBtn key={s.value} onClick={()=>setSelectedStatus(s.value)}
                    className="px-3.5 py-2 rounded-xl text-sm font-medium flex items-center gap-2 border shadow-sm transition-all"
                    style={selectedStatus===s.value?activePill:inactivePill}>
                    <SI className="w-4 h-4"/><span>{s.label}</span>
                  </MagBtn>
                );})}
              </StaggerContainer>
            </div>

            {/* Mobile filters */}
            <AnimatePresence>
              {showMobileFilters&&(
                <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}
                  className="sm:hidden space-y-3 overflow-hidden">
                  <div className="flex gap-2 p-1 border rounded-xl shadow-sm"
                    style={{background:"#fff",borderColor:B.border}}>
                    {[{m:"grid",I:Grid3X3,l:"Grid"},{m:"timeline",I:List,l:"Timeline"}].map(({m,I,l})=>(
                      <MagBtn key={m} onClick={()=>setViewMode(m)}
                        className="flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all"
                        style={viewMode===m?{background:B.primary,color:"#fff"}:{color:B.text}}>
                        <I className="w-4 h-4"/>{l}
                      </MagBtn>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-bold mb-2 px-1" style={{color:B.text}}>Type</p>
                    <div className="flex flex-wrap gap-2">
                      {TYPES.map(t=>(
                        <button key={t.value} onClick={()=>setSelectedType(t.value)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all"
                          style={selectedType===t.value?activePill:inactivePill}>
                          <span>{t.icon}</span><span>{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold mb-2 px-1" style={{color:B.text}}>Status</p>
                    <div className="flex flex-wrap gap-2">
                      {STATUSES.map(s=>{ const SI=s.icon; return (
                        <button key={s.value} onClick={()=>setSelectedStatus(s.value)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all"
                          style={selectedStatus===s.value?activePill:inactivePill}>
                          <SI className="w-3 h-3"/><span>{s.label}</span>
                        </button>
                      );})}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results row */}
            <Reveal from="left" className="flex items-center justify-between text-xs sm:text-sm px-1" style={{color:"rgba(26,26,26,0.45)"}}>
              <motion.span key={ordered.length} initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
                Showing <span className="font-bold" style={{color:B.primary}}>{ordered.length}</span> updates
              </motion.span>
              {pinnedPosts.length>0&&(
                <span className="flex items-center gap-1">
                  <Bookmark className="w-3.5 h-3.5 fill-current" style={{color:B.gold}}/>
                  {pinnedPosts.length} pinned
                </span>
              )}
            </Reveal>
          </Reveal>

          {/* Content */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                className="flex justify-center items-center py-24">
                <div className="relative">
                  {/* Spinner — orange (was green) */}
                  <div className="w-14 h-14 border-4 rounded-full animate-spin"
                    style={{borderColor:`${B.border} transparent transparent transparent`,borderTopColor:B.primary}}/>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Bell className="w-6 h-6 animate-pulse" style={{color:B.primary}}/>
                  </div>
                </div>
              </motion.div>
            ) : ordered.length===0 ? (
              <motion.div key="empty" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                className="text-center py-20 px-4">
                <Float duration={3} yRange={10}>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 border shadow-sm"
                    style={{background:"#fff",borderColor:B.border}}>
                    <Bell className="w-10 h-10" style={{color:`${B.text}22`}}/>
                  </div>
                </Float>
                <h3 className="text-xl sm:text-2xl font-black mb-2" style={{color:B.text}}>No updates found</h3>
                <p className="text-sm max-w-md mx-auto mb-6" style={{color:"rgba(26,26,26,0.45)"}}>
                  {searchQuery?"Try adjusting your search or filters":"Check back later for new announcements"}
                </p>
                {(searchQuery||selectedType!=="all"||selectedStatus!=="all")&&(
                  <MagBtn onClick={()=>{ setSearchQuery(""); setSelectedType("all"); setSelectedStatus("all"); setShowArchived(false); }}
                    className="px-6 py-2.5 text-white rounded-full text-sm font-bold shadow-md"
                    style={{background:B.primary}}>
                    Clear Filters
                  </MagBtn>
                )}
              </motion.div>
            ) : viewMode==="grid" ? (
              <motion.div key="grid" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,filter:"blur(6px)"}}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {ordered.map((p,i)=>(
                  <NotificationCard key={p.id} program={p} index={i} isPinned={pinnedPosts.includes(p.id)} togglePin={togglePin}/>
                ))}
              </motion.div>
            ) : (
              <motion.div key="timeline" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,filter:"blur(6px)"}}
                className="relative">
                {/* Timeline spine — orange gradient (was green) */}
                <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 w-0.5 h-full"
                  style={{background:`linear-gradient(to bottom,${B.p(.22)},${B.pd(.22)},${B.gold}44)`}}/>
                <div className="space-y-5 sm:space-y-10">
                  {ordered.map((p,i)=>(
                    <TimelineCard key={p.id} program={p} index={i} isPinned={pinnedPosts.includes(p.id)} togglePin={togglePin}/>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      <WaveDivider color={B.gold} flip toBg="#fff"/>

      {/* ── Newsletter ── */}
      <section id="newsletter" className="py-12 sm:py-16 px-3 sm:px-6 bg-white relative overflow-hidden">
        <Spotlight color={B.p(.05)} size={480}/>
        <div className="max-w-4xl mx-auto relative z-10">
          <Reveal from="bottom">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              {/* BG — orange gradient (was green) */}
              <div className="absolute inset-0"
                style={{background:`linear-gradient(135deg,${B.primary},${B.dark})`}}/>
              <div className="absolute inset-0"><ParticleCanvas count={14} color={`${B.gold}14`}/></div>
              <Spotlight color={`${B.gold}09`} size={400}/>
              {/* Floating rings — orange-tinted border */}
              {[60,110,170].map((s,i)=>(
                <Float key={i} duration={5+i*2} yRange={10} delay={i}
                  className="absolute right-10 top-1/2 -translate-y-1/2 rounded-full border pointer-events-none"
                  style={{width:s,height:s,borderColor:`${B.gold}22`}}/>
              ))}
              <div className="relative z-10 p-6 sm:p-8 md:p-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-center md:text-left">
                  <div className="flex items-center gap-4 md:gap-6">
                    <Float duration={4} yRange={8}>
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 border backdrop-blur-sm"
                        style={{background:"rgba(255,255,255,0.18)",borderColor:"rgba(255,255,255,0.22)"}}>
                        <Bell className="w-6 h-6 sm:w-7 sm:h-7 text-white"/>
                      </div>
                    </Float>
                    <div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white mb-1">Never Miss an Update!</h3>
                      <p className="text-xs sm:text-sm" style={{color:"rgba(255,255,255,0.72)"}}>Get notified about new programs and events</p>
                    </div>
                  </div>
                  <Link to="/Contact" className="whitespace-nowrap">
                    <MagBtn className="group relative px-6 py-3 rounded-xl text-sm font-black shadow-lg overflow-hidden"
                      style={{background:"#fff",color:B.dark}}>
                      <span className="relative z-10 flex items-center gap-2">
                        Get In Touch
                        <motion.span animate={{x:[0,4,0]}} transition={{duration:1.5,repeat:Infinity}}>
                          <ArrowRight className="w-4 h-4"/>
                        </motion.span>
                      </span>
                      {/* Hover fill — light orange (was light green) */}
                      <motion.div className="absolute inset-0 origin-left" style={{background:B.light}}
                        initial={{scaleX:0}} whileHover={{scaleX:1}} transition={{duration:.4}}/>
                    </MagBtn>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer/>
      <ScrollToTop/>
    </div>
  );
}

export default Programs;