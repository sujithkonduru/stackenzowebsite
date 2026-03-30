import {
  motion, AnimatePresence, useInView, useScroll, useTransform,
  useSpring, useMotionValue, useVelocity,
} from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Code, Cloud, Shield, Database, Cpu, Globe,
  Smartphone, Lock, TrendingUp, Zap, Users, ChevronRight,
  CheckCircle, ArrowRight, Star, ChevronDown, X, ExternalLink,
  Sparkles, Rocket, Award, Clock, HeadphonesIcon, Layers,
  Palette, Gauge, Server, GitBranch, Box,
  Cpu as CpuIcon,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Toast from "./Toast";
import servicesData from "./data/servicesData.json";

/* ══════════════════════════════════════════════
   EASING
══════════════════════════════════════════════ */
const EASE_EXPO = [0.16, 1, 0.3, 1];
const EASE_BACK = [0.34, 1.56, 0.64, 1];

/* ══════════════════════════════════════════════
   NAV
══════════════════════════════════════════════ */
const NAV_SECTIONS = ["ws-hero", "ws-services", "ws-approach", "ws-why", "ws-testimonials", "ws-faq"];
const NAV_LABELS   = ["Hero", "Services", "Process", "Why Us", "Reviews", "FAQ"];

/* ══════════════════════════════════════════════
   DATA
══════════════════════════════════════════════ */
const BENEFITS = [
  { icon: "🚀", title: "Accelerated Innovation",  desc: "Leverage cutting-edge technologies to stay ahead of competition" },
  { icon: "💰", title: "Cost Optimization",        desc: "Reduce operational costs through automation and efficient solutions" },
  { icon: "📈", title: "Scalable Solutions",       desc: "Grow seamlessly with flexible and scalable infrastructure" },
  { icon: "🔒", title: "Enhanced Security",        desc: "Enterprise-grade protection for your critical assets" },
  { icon: "⚡", title: "Faster Deployment",        desc: "Accelerate time-to-market with agile methodologies" },
  { icon: "🎯", title: "Business Agility",         desc: "Adapt to market changes with flexible solutions" },
];

const TESTIMONIALS = [
  { name:"Rajesh Kumar",   initials:"RK", role:"Business Owner",     rating:5, text:"Stackenzo transformed our business with their innovative IT solutions. The team understood our requirements perfectly and delivered beyond expectations." },
  { name:"Priya Sharma",   initials:"PS", role:"Startup Founder",    rating:5, text:"Working with Stackenzo has been a game-changer for our startup. Their technical expertise and dedication to quality are truly remarkable." },
  { name:"Amit Patel",     initials:"AP", role:"Product Manager",    rating:5, text:"The level of professionalism and technical skill at Stackenzo is outstanding. They helped us launch our product ahead of schedule." },
  { name:"Sneha Reddy",    initials:"SR", role:"Tech Lead",          rating:4, text:"Great experience collaborating with the Stackenzo team. They brought valuable insights to our project and delivered high-quality work." },
  { name:"Vikram Singh",   initials:"VS", role:"Entrepreneur",       rating:5, text:"Stackenzo's team went above and beyond to ensure our project's success. Their attention to detail and problem-solving skills are impressive." },
  { name:"Ananya Desai",   initials:"AD", role:"Marketing Director", rating:5, text:"The digital marketing strategies implemented by Stackenzo significantly improved our online presence. Highly recommended!" },
];

const FAQS = [
  { q:"What industries do you serve?",          a:"We serve diverse industries including Finance, Healthcare, Retail, Manufacturing, Education, and Technology with tailored solutions for each sector." },
  { q:"How do you ensure project success?",     a:"We follow agile methodologies, maintain transparent communication, conduct regular reviews, and use proven frameworks to ensure successful delivery." },
  { q:"Do you provide post-deployment support?",a:"Yes, we offer comprehensive support including 24/7 monitoring, maintenance, and dedicated support teams to ensure smooth operations." },
  { q:"What is your approach to security?",     a:"Security is integrated into every phase of development, following ISO 27001, SOC 2, and GDPR standards for maximum protection." },
  { q:"Can you work with our existing stack?",  a:"Absolutely! We seamlessly integrate with your existing systems or recommend optimal solutions based on your requirements." },
];

const APPROACH_STEPS = [
  { step:"01", title:"Discover & Plan",      desc:"Understanding your business needs, goals, and technical requirements",   icon:"🔍" },
  { step:"02", title:"Design & Structure",     desc:"Creating scalable system architecture and user-centric designs",         icon:"🎨" },
  { step:"03", title:"Develop & Test",     desc:"Agile development with continuous testing and quality assurance",        icon:"⚡" },
  { step:"04", title:"Deploy & Support",      desc:"Seamless deployment with ongoing maintenance and 24/7 support",          icon:"🚀" },
];

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
   BIDIRECTIONAL REVEAL
══════════════════════════════════════════════ */
function Reveal({ children, className = "", delay = 0, from = "bottom", once = false }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once, margin: "-55px" });
  const dir = useScrollDir();
  const V = {
    bottom: { hidden:{ y:65,  opacity:0, scale:.96, filter:"blur(6px)" }, visible:{ y:0, opacity:1, scale:1, filter:"blur(0px)" }, exit:{ y:-48, opacity:0, scale:.97, filter:"blur(4px)" } },
    top:    { hidden:{ y:-65, opacity:0, scale:.96, filter:"blur(6px)" }, visible:{ y:0, opacity:1, scale:1, filter:"blur(0px)" }, exit:{ y:48,  opacity:0, scale:.97, filter:"blur(4px)" } },
    left:   { hidden:{ x:-75, opacity:0, scale:.96, filter:"blur(6px)" }, visible:{ x:0, opacity:1, scale:1, filter:"blur(0px)" }, exit:{ x:55,  opacity:0, scale:.97, filter:"blur(4px)" } },
    right:  { hidden:{ x:75,  opacity:0, scale:.96, filter:"blur(6px)" }, visible:{ x:0, opacity:1, scale:1, filter:"blur(0px)" }, exit:{ x:-55, opacity:0, scale:.97, filter:"blur(4px)" } },
    scale:  { hidden:{ scale:.75, opacity:0, filter:"blur(8px)" }, visible:{ scale:1, opacity:1, filter:"blur(0px)" }, exit:{ scale:.85, opacity:0, filter:"blur(6px)" } },
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
  const B = {
    bottom: { hidden:{ y:55,  opacity:0, scale:.95, filter:"blur(5px)" }, visible:{ y:0, opacity:1, scale:1, filter:"blur(0px)" }, exit:{ y:-38, opacity:0, scale:.97, filter:"blur(3px)" } },
    left:   { hidden:{ x:-55, opacity:0 }, visible:{ x:0, opacity:1 }, exit:{ x:38, opacity:0 } },
    scale:  { hidden:{ scale:.8, opacity:0 }, visible:{ scale:1, opacity:1 }, exit:{ scale:.88, opacity:0 } },
  };
  const { hidden, visible, exit } = B[from] || B.bottom;
  return (
    <motion.div ref={ref} className={className}
      initial="hidden"
      animate={inV ? "visible" : dir === "up" ? "exit" : "hidden"}
      variants={{ hidden:{}, visible:{ transition:{ staggerChildren:stagger }}, exit:{ transition:{ staggerChildren:stagger/2, staggerDirection:-1 }}}}>
      {Array.isArray(children)
        ? children.map((c,i) => <motion.div key={i} variants={{ hidden, visible, exit }} transition={{ duration:.7, ease:EASE_EXPO }}>{c}</motion.div>)
        : <motion.div variants={{ hidden, visible, exit }} transition={{ duration:.7, ease:EASE_EXPO }}>{children}</motion.div>}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   FLOAT
══════════════════════════════════════════════ */
function Float({ children, className = "", duration = 4, yRange = 14, delay = 0 }) {
  return (
    <motion.div className={className}
      animate={{ y:[-yRange/2, yRange/2, -yRange/2] }}
      transition={{ duration, repeat:Infinity, ease:"easeInOut", delay }}>
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   GLOW CARD
══════════════════════════════════════════════ */
function GlowCard({ children, className = "", accent = "#D4AF37" }) {
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
        style={{ inset:-1, background:`radial-gradient(280px circle at ${pos.x}px ${pos.y}px,${accent}28,transparent 60%)`, opacity:inV?1:0, transition:"opacity .3s" }}/>
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
function MagBtn({ children, className = "", onClick, type = "button" }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x,{stiffness:250,damping:16}), sy = useSpring(y,{stiffness:250,damping:16});
  const mm = e => { const r=ref.current.getBoundingClientRect(); x.set((e.clientX-r.left-r.width/2)*.35); y.set((e.clientY-r.top-r.height/2)*.35); };
  const ml = () => { x.set(0); y.set(0); };
  return (
    <motion.button ref={ref} type={type} style={{x:sx,y:sy}} onMouseMove={mm} onMouseLeave={ml}
      whileTap={{scale:.94}} onClick={onClick} className={className}>
      {children}
    </motion.button>
  );
}

/* ══════════════════════════════════════════════
   COUNTER
══════════════════════════════════════════════ */
function Counter({ value }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once:false });
  const raw = String(value).replace(/[^0-9.]/g,"");
  const num = parseFloat(raw)||0;
  const sfx = String(value).replace(/[0-9.]/g,"");
  const mv  = useMotionValue(0);
  const sp  = useSpring(mv,{stiffness:55,damping:14});
  const [d,setD] = useState(0);
  useEffect(()=>{ mv.set(inV?num:0); },[inV]);
  useEffect(()=> sp.on("change",v=>setD(Math.round(v))),[sp]);
  return <span ref={ref}>{d}{sfx}</span>;
}

/* ══════════════════════════════════════════════
   CUSTOM CURSOR
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
      <div ref={outer} className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9998] transition-[border-color,background] duration-150"
        style={{border:hov?"1.5px solid #D4AF37":"1.5px solid rgba(230,107,38,0.45)",background:hov?"rgba(212,175,55,0.07)":"transparent",willChange:"transform"}}/>
      <div ref={dot} className="fixed top-0 left-0 w-[6px] h-[6px] rounded-full pointer-events-none z-[9999] transition-colors duration-100"
        style={{background:hov?"#D4AF37":"#E66B26",willChange:"transform"}}/>
      <div ref={trail} className="fixed top-0 left-0 w-[60px] h-[60px] rounded-full pointer-events-none z-[9996] opacity-[.09]"
        style={{background:"radial-gradient(circle,#D4AF37,transparent)",willChange:"transform"}}/>
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
      style={{scaleX, background:"linear-gradient(90deg,#3D1A0A,#E66B26,#D4AF37,#C5531A,#D4AF37)"}}/>
  );
}

/* ══════════════════════════════════════════════
   SECTION NAV DOTS
══════════════════════════════════════════════ */
function SectionNavDots() {
  const [active,setActive] = useState(0);
  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){const i=NAV_SECTIONS.indexOf(e.target.id);if(i!==-1)setActive(i);}}),{threshold:.3});
    NAV_SECTIONS.forEach(id=>{const el=document.getElementById(id);if(el)obs.observe(el);});
    return()=>obs.disconnect();
  },[]);
  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-[900] flex-col gap-4 hidden md:flex">
      {NAV_SECTIONS.map((id,i)=>(
        <motion.button key={i} onClick={()=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"})}
          className="relative flex items-center gap-2" title={NAV_LABELS[i]}>
          <motion.span initial={{opacity:0,x:8}} animate={{opacity:active===i?1:0,x:active===i?0:8}}
            className="absolute right-6 text-[11px] font-bold text-[#D4AF37] bg-[#0f0f0f]/80 backdrop-blur-sm px-2 py-1 rounded-md whitespace-nowrap pointer-events-none">
          
          </motion.span>
          <motion.div animate={{scale:active===i?1.4:1,background:active===i?"#D4AF37":"rgba(230,107,38,0.4)"}}
            transition={{type:"spring",stiffness:300,damping:22}} className="w-2.5 h-2.5 rounded-full"/>
          {active===i&&(
            <motion.div layoutId="ws-nav-pulse" className="absolute inset-0 rounded-full"
              style={{scale:2,border:"1.5px solid #D4AF37",opacity:.5}}
              animate={{scale:[2,2.8,2],opacity:[.5,0,.5]}} transition={{duration:1.8,repeat:Infinity}}/>
          )}
        </motion.button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   NOISE CANVAS
══════════════════════════════════════════════ */
function NoiseCanvas({ color1="#FFD5B8", color2="#FFF4ED", opacity=0.35 }) {
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
   PARTICLE CANVAS
══════════════════════════════════════════════ */
function ParticleCanvas({ count=20, color="rgba(230,107,38,0.08)" }) {
  const ref=useRef(null);
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const ctx=c.getContext("2d");
    let w=c.width=c.offsetWidth, h=c.height=c.offsetHeight;
    const pts=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*1.6+.7}));
    let id;
    const draw=()=>{
      ctx.clearRect(0,0,w,h);
      pts.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; if(p.x<0)p.x=w; if(p.x>w)p.x=0; if(p.y<0)p.y=h; if(p.y>h)p.y=0; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=color; ctx.fill(); });
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
        const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);
        if(d<88){ ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.strokeStyle=color.replace(/[\d.]+\)$/,`${(1-d/88)*.055})`); ctx.stroke(); }
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
function Spotlight({ color="rgba(212,175,55,0.06)", size=580 }) {
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
function WaveDivider({ color="#D4AF37", flip=false, toBg="#fff" }) {
  const ref=useRef(null);
  const inV=useInView(ref,{once:true,margin:"-10px"});
  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${flip?"rotate-180":""}`} style={{height:52}}>
      <svg viewBox="0 0 1440 52" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <motion.path d="M0,26 C240,0 480,52 720,26 C960,0 1200,52 1440,26 L1440,52 L0,52 Z"
          fill={toBg} initial={{pathLength:0}} animate={inV?{pathLength:1}:{}} transition={{duration:1.2,ease:EASE_EXPO}}/>
        <motion.path d="M0,26 C240,0 480,52 720,26 C960,0 1200,52 1440,26"
          stroke={color} strokeWidth="1.5" fill="none"
          initial={{pathLength:0,opacity:0}} animate={inV?{pathLength:1,opacity:1}:{}} transition={{duration:1.4,ease:EASE_EXPO,delay:.15}}/>
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
      <motion.div initial={{scaleX:0}} whileInView={{scaleX:1}} viewport={{once:false}} transition={{duration:.55}} className="h-px w-8 bg-[#D4AF37] origin-left"/>
      <span className="text-[#D4AF37] font-bold tracking-[.2em] text-[11px] uppercase">{text}</span>
      <motion.div initial={{scaleX:0}} whileInView={{scaleX:1}} viewport={{once:false}} transition={{duration:.55}} className="h-px w-8 bg-[#D4AF37] origin-right"/>
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
const MARQUEE_ITEMS=["Core IT Services","Web & Digital","Cloud & Infrastructure","Data & AI","Custom Development","API Integration","Mobile Apps","DevOps","Cybersecurity","Enterprise Solutions"];
function MarqueeStrip({ dark=false }) {
  const [paused,setPaused]=useState(false);
  const items=[...MARQUEE_ITEMS,...MARQUEE_ITEMS];
  return (
    <div className={`py-4 overflow-hidden border-y ${dark?"border-white/8 bg-white/[0.03]":"border-black/5 bg-[#F7F4EF]"}`}
      onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}>
      <motion.div className="flex gap-10 whitespace-nowrap"
        animate={paused?{}:{x:["0%","-50%"]}}
        transition={{repeat:Infinity,duration:28,ease:"linear"}}>
        {items.map((item,i)=>(
          <span key={i} className={`flex items-center gap-3 text-sm font-semibold select-none ${dark?"text-white/45":"text-[#1A1A1A]/40"}`}>
            <motion.span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0"
              animate={{scale:[1,1.4,1]}} transition={{duration:2,repeat:Infinity,delay:i*.1}}/>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SERVICE CARD (enhanced)
══════════════════════════════════════════════ */
function ServiceCard({ service, index, onOpen }) {
  return (
    <GlowCard accent="#E66B26" className="h-full">
      <TiltCard intensity={7} className="h-full">
        <motion.div
          whileHover={{ y:-7, boxShadow:"0 28px 60px rgba(230,107,38,0.12)" }}
          onClick={() => onOpen(service)}
          className="group relative bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200 hover:border-[#D4AF37] transition-all duration-300 cursor-pointer h-full flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E66B26] to-[#C5531A] opacity-0 group-hover:opacity-[0.04] rounded-xl sm:rounded-2xl transition-opacity duration-300"/>

          {/* Icon + title */}
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Float duration={4+index*.3} delay={index*.2} yRange={6}>
              <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#E66B26] to-[#C5531A] shadow-md">
                <div className="text-white">{service.icon}</div>
              </div>
            </Float>
            <h3 className="text-sm sm:text-base font-black text-[#1A1A1A] group-hover:text-[#E66B26] transition-all line-clamp-2">{service.title}</h3>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 leading-relaxed line-clamp-2 flex-1">{service.desc}</p>

          {/* Features */}
          <ul className="space-y-1.5 sm:space-y-2 mb-3">
            {service.features.slice(0,3).map((f,j)=>(
              <li key={j} className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-[#1A1A1A] group-hover:text-[#E66B26] transition-colors">
                <motion.div animate={{scale:[1,1.3,1]}} transition={{duration:2.2,repeat:Infinity,delay:j*.22}}>
                  <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#D4AF37] flex-shrink-0"/>
                </motion.div>
                <span className="line-clamp-1">{f}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2 sm:pt-3 border-t border-gray-100 mt-auto">
            <motion.button
              whileHover={{x:3}}
              onClick={e=>{e.stopPropagation(); onOpen(service);}}
              className="text-xs sm:text-sm text-[#1A1A1A] hover:text-[#E66B26] flex items-center gap-1 font-semibold">
              Learn More
              <motion.span animate={{x:[0,3,0]}} transition={{duration:1.4,repeat:Infinity}}>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4"/>
              </motion.span>
            </motion.button>
          </div>
          {/* bottom accent */}
          <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#E66B26] rounded-b-xl sm:rounded-b-2xl"
            initial={{scaleX:0}} whileHover={{scaleX:1}} transition={{duration:.35}}/>
        </motion.div>
      </TiltCard>
    </GlowCard>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
function WebServices() {
  const navigate = useNavigate();
  const [openFaq,               setOpenFaq]               = useState(null);
  const [isQuoteModalOpen,      setIsQuoteModalOpen]       = useState(false);
  const [quoteFormData,         setQuoteFormData]          = useState({ name:"", email:"", phone:"", company:"", service:"", message:"" });
  const [isSubmitting,          setIsSubmitting]           = useState(false);
  const [toast,                 setToast]                  = useState({ show:false, message:"" });
  const [activeService,         setActiveService]          = useState("all");
  const [selectedServiceDetail, setSelectedServiceDetail]  = useState(null);

  /* ── build categories from JSON ── */
  const buildCat = (key, TitleStr, Ico, iconMap) => ({
    title: TitleStr,
    icon:  <Ico className="w-5 h-5 sm:w-6 sm:h-6 text-white"/>,
    services: (servicesData[key]||[]).map((svc,i)=>{
      const IconC = iconMap[i] || Code;
      return {
        icon: <IconC className="w-6 h-6 sm:w-8 sm:h-8 text-white"/>,
        title: svc.title,
        desc:  svc.detailedDesc?.substring(0,80)+"...",
        detailedDesc: svc.detailedDesc,
        benefits: svc.benefits,
        technologies: svc.technologies,
        deliverables: svc.deliverables,
        timeline: svc.timeline,
        features: svc.benefits?.slice(0,4)||[],
      };
    }),
  });

  const serviceCategories = {
    core:  buildCat("core",  "Core IT Services",       Code,   [Code,Smartphone,Database,Cpu]),
    web:   buildCat("web",   "Web & Digital",          Globe,  [Globe,Palette,Code]),
    cloud: buildCat("cloud", "Cloud & Infrastructure", Cloud,  [Cloud,Server,Gauge,Database]),
    data:  buildCat("data",  "Data & AI",              CpuIcon,[CpuIcon,TrendingUp,Database]),
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault(); setIsSubmitting(true);
    try {
      const res  = await fetch("http://localhost:5000/api/quotes",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(quoteFormData) });
      const data = await res.json();
      if(data.success){
        setToast({show:true,message:"Quote request submitted! We'll contact you within 24 hours."});
        setTimeout(()=>{ setIsQuoteModalOpen(false); setQuoteFormData({name:"",email:"",phone:"",company:"",service:"",message:""}); },1500);
      } else {
        const msg = data.errors ? data.errors.map(e=>e.msg||e.message).join(", ") : data.message;
        setToast({show:true,message:msg||"Failed to submit. Please try again."});
      }
    } catch { setToast({show:true,message:"Error submitting request. Please try again."}); }
    finally { setIsSubmitting(false); }
  };

  /* ── hero parallax ── */
  const heroRef=useRef(null);
  const {scrollYProgress:heroP}=useScroll({target:heroRef,offset:["start start","end start"]});
  const heroY=useTransform(heroP,[0,1],[0,-110]);
  const heroO=useTransform(heroP,[0,.6],[1,0]);
  const heroS=useTransform(heroP,[0,1],[1,.84]);
  const bigY =useTransform(heroP,[0,1],[0,180]);
  const mx=useMotionValue(0), my=useMotionValue(0);
  const smx=useSpring(mx,{stiffness:35,damping:18}), smy=useSpring(my,{stiffness:35,damping:18});
  const b1x=useTransform(smx,[-1,1],[-26,26]), b1y=useTransform(smy,[-1,1],[-14,14]);
  const b2x=useTransform(smx,[-1,1],[20,-20]), b2y=useTransform(smy,[-1,1],[12,-12]);
  useEffect(()=>{
    const fn=e=>{mx.set((e.clientX/window.innerWidth-.5)*2); my.set((e.clientY/window.innerHeight-.5)*2);};
    window.addEventListener("mousemove",fn); return()=>window.removeEventListener("mousemove",fn);
  },[]);

  const HERO_STATS=[
    {icon:Rocket, value:"1000+",label:"Projects",   color:"#E66B26"},
    {icon:Users,  value:"500+", label:"Clients",    color:"#C5531A"},
    {icon:Zap,    value:"120+", label:"Solutions",  color:"#E66B26"},
    {icon:Award,  value:"98%",  label:"Satisfaction",color:"#D4AF37"},
  ];

  return (
    <div className="bg-white text-[#1A1A1A] min-h-screen overflow-x-hidden">
      <Toast message={toast.message} isVisible={toast.show} onClose={()=>setToast({show:false,message:""})}/>
      <CustomCursor/>
      <ScrollProgressBar/>
      <SectionNavDots/>
      <Navbar/>

      {/* ═══ HERO ═══ */}
      <section id="ws-hero" ref={heroRef}
        className="relative min-h-screen flex items-center pt-20 sm:pt-24 lg:pt-32 pb-16 overflow-hidden">
        <NoiseCanvas color1="#FFD5B8" color2="#FFF0E6" opacity={0.28}/>
        <div className="absolute inset-0 z-[1]"><ParticleCanvas count={18} color="rgba(230,107,38,0.08)"/></div>

        {/* Kinetic bg */}
        <motion.div style={{y:bigY}} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-[2]">
          <span className="text-[18vw] font-black leading-none tracking-tighter uppercase whitespace-nowrap"
            style={{color:"rgba(230,107,38,0.018)"}}>IT SOLUTIONS</span>
        </motion.div>

        {/* Dot grid */}
        <div className="absolute inset-0 z-[2] opacity-[.03]"
          style={{backgroundImage:"radial-gradient(circle,#E66B26 1px,transparent 1px)",backgroundSize:"32px 32px"}}/>

        {/* Blobs */}
        <motion.div style={{x:b1x,y:b1y}} className="absolute top-16 left-[5%] w-80 h-80 pointer-events-none z-[2]">
          <div className="w-full h-full rounded-full blur-[100px] opacity-[.28]" style={{background:"radial-gradient(circle,#FFD5B8,transparent)"}}/>
        </motion.div>
        <motion.div style={{x:b2x,y:b2y}} className="absolute bottom-16 right-[5%] w-[420px] h-[420px] pointer-events-none z-[2]">
          <div className="w-full h-full rounded-full blur-[110px] opacity-[.16]" style={{background:"radial-gradient(circle,#D4AF37,transparent)"}}/>
        </motion.div>

        {/* Floating orbs */}
        <Float className="absolute top-1/4 left-[7%] w-3 h-3 rounded-full bg-[#D4AF37]/25 z-[2]" duration={5} delay={0}/>
        <Float className="absolute top-1/3 right-[9%] w-2 h-2 rounded-full bg-[#E66B26]/20 z-[2]" duration={4} delay={1}/>
        <Float className="absolute bottom-1/3 left-[12%] w-3.5 h-3.5 rounded-full bg-[#C5531A]/18 z-[2]" duration={6} delay={2}/>
        <Float className="absolute bottom-1/4 right-[14%] w-2 h-2 rounded-full bg-[#D4AF37]/18 z-[2]" duration={5.5} delay={.5}/>

        <motion.div style={{y:heroY,opacity:heroO,scale:heroS}} className="max-w-6xl mx-auto text-center relative z-10 px-4 sm:px-6 w-full">
          {/* Badge */}
          <motion.div initial={{scale:.7,opacity:0,y:20}} animate={{scale:1,opacity:1,y:0}} transition={{duration:.65,ease:EASE_BACK}}
            className="inline-flex items-center gap-2 bg-white/88 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2.5 mb-7 shadow-sm">
            <motion.div animate={{rotate:[0,20,-20,0]}} transition={{duration:2.8,repeat:Infinity,ease:"easeInOut"}}>
              <Sparkles className="w-4 h-4 text-[#D4AF37]"/>
            </motion.div>
            <span className="text-sm font-semibold text-[#E66B26]">Enterprise IT Solutions</span>
          </motion.div>

          {/* H1 */}
          <motion.h1 initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:.3,duration:.75,ease:EASE_EXPO}}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-5 leading-[1.06]">
            <span className="text-[#1A1A1A]">Scalable IT Solutions</span>
            <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] via-[#C5531A] to-[#E66B26]">for Modern Businesses</span>
          </motion.h1>

          <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.5,ease:EASE_EXPO}}
            className="text-base sm:text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed mb-9">
            We deliver end-to-end IT solutions that transform businesses, drive innovation, and accelerate growth—from concept to scalable digital deployment.
          </motion.p>

          {/* Stats */}
          <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{delay:.7,ease:EASE_EXPO}}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto mb-8 px-2">
            {HERO_STATS.map((s,i)=>{const Icon=s.icon; return (
              <Float key={i} duration={4+i*.5} delay={i*.3}>
                <TiltCard>
                  <motion.div whileHover={{y:-6,boxShadow:`0 16px 40px ${s.color}18`}}
                    className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-3 sm:p-4 hover:border-[#D4AF37] transition-all shadow-sm text-center cursor-default">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1.5" style={{color:s.color}}/>
                    <div className="text-sm sm:text-lg font-black text-[#1A1A1A]"><Counter value={s.value}/></div>
                    <div className="text-[10px] sm:text-xs text-gray-400">{s.label}</div>
                  </motion.div>
                </TiltCard>
              </Float>
            );})}
          </motion.div>

          {/* CTAs */}
          <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.88,ease:EASE_EXPO}}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center px-2">
            <MagBtn onClick={()=>navigate("/contact")}
              className="group relative w-full sm:w-auto px-6 py-3 bg-[#E66B26] text-white rounded-full text-sm font-bold overflow-hidden shadow-xl shadow-[#E66B26]/22">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Start Your Project
                <motion.span animate={{x:[0,4,0]}} transition={{duration:1.5,repeat:Infinity}}><ArrowRight className="w-4 h-4"/></motion.span>
              </span>
              <motion.div className="absolute inset-0 bg-[#C5531A] origin-left" initial={{scaleX:0}} whileHover={{scaleX:1}} transition={{duration:.4}}/>
            </MagBtn>
            <MagBtn onClick={()=>setIsQuoteModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 border-2 border-[#E66B26] text-[#E66B26] rounded-full text-sm font-bold hover:bg-[#E66B26] hover:text-white transition-all">
              Get Free Consultation
            </MagBtn>
          </motion.div>

          {/* Scroll cue */}
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.8}}
            className="flex justify-center mt-10 cursor-pointer"
            onClick={()=>document.getElementById("ws-services")?.scrollIntoView({behavior:"smooth"})}>
            <Float duration={2} yRange={10}>
              <div className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-[#E66B26] transition-colors">
                <span className="text-xs font-medium">Scroll to explore</span>
                <div className="w-5 h-8 border-2 border-[#E66B26]/22 rounded-full flex justify-center">
                  <motion.div className="w-1 h-2 bg-[#D4AF37] rounded-full mt-1.5"
                    animate={{y:[0,10,0],opacity:[1,.4,1]}} transition={{duration:1.8,repeat:Infinity}}/>
                </div>
              </div>
            </Float>
          </motion.div>
        </motion.div>
      </section>

      <MarqueeStrip/>

      {/* ═══ STICKY CATEGORY NAV ═══ */}
      <div className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-y border-gray-200 py-2 sm:py-3 px-3 sm:px-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <MagBtn onClick={()=>setActiveService("all")}
              className={`shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${activeService==="all"?"bg-[#E66B26] text-white shadow-md":"text-[#1A1A1A] bg-[#FFF4ED] hover:bg-[#D4AF37]/20 hover:text-[#E66B26] border border-gray-200"}`}>
              All Services
            </MagBtn>
            {Object.entries(serviceCategories).map(([key,cat])=>(
              <MagBtn key={key} onClick={()=>setActiveService(key)}
                className={`shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${activeService===key?"bg-[#E66B26] text-white shadow-md":"text-[#1A1A1A] bg-[#FFF4ED] hover:bg-[#D4AF37]/20 hover:text-[#E66B26] border border-gray-200"}`}>
                <span className={activeService===key?"text-white":"text-[#E66B26]"}>{cat.icon}</span>
                <span className="hidden sm:inline">{cat.title}</span>
                <span className="sm:hidden">{cat.title.split(" ")[0]}</span>
              </MagBtn>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ SERVICES GRID ═══ */}
      <WaveDivider color="#D4AF37" toBg="#FFF4ED"/>
      <section id="ws-services" className="py-12 sm:py-16 px-3 sm:px-4 relative overflow-hidden" style={{background:"#FFF4ED"}}>
        <NoiseCanvas color1="#FFD5B8" color2="#FFCBA4" opacity={0.2}/>
        <Spotlight color="rgba(230,107,38,0.04)" size={500}/>

        {/* Kinetic bg */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <motion.span className="text-[14vw] font-black leading-none tracking-tighter uppercase text-[#E66B26]/[0.018]"
            animate={{y:[0,-10,0]}} transition={{duration:9,repeat:Infinity,ease:"easeInOut"}}>
            {activeService==="all"?"SERVICES":activeService.toUpperCase()}
          </motion.span>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <AnimatePresence mode="wait">
            {activeService==="all" ? (
              <motion.div key="all" initial={{opacity:0,filter:"blur(6px)"}} animate={{opacity:1,filter:"blur(0px)"}} exit={{opacity:0,filter:"blur(6px)"}}
                className="space-y-14">
                {Object.entries(serviceCategories).map(([key,cat])=>(
                  <div key={key}>
                    <Reveal from="left">
                      <div className="flex items-center gap-3 mb-5 px-1">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-[#E66B26] to-[#C5531A] shadow-md">
                          {cat.icon}
                        </div>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-black text-[#1A1A1A]">{cat.title}</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#D4AF37] to-transparent ml-2"/>
                      </div>
                    </Reveal>
                    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4" stagger={0.07} from="bottom">
                      {cat.services.map((svc,idx)=>(
                        <ServiceCard key={idx} service={svc} index={idx} onOpen={setSelectedServiceDetail}/>
                      ))}
                    </StaggerContainer>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div key={activeService} initial={{opacity:0,y:30,filter:"blur(8px)"}} animate={{opacity:1,y:0,filter:"blur(0px)"}} exit={{opacity:0,y:-20,filter:"blur(6px)"}}
                transition={{duration:.5,ease:EASE_EXPO}}>
                <Reveal from="left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-7 px-1">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#E66B26] to-[#C5531A] shadow-md">
                        {serviceCategories[activeService].icon}
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-black text-[#1A1A1A]">{serviceCategories[activeService].title}</h2>
                        <p className="text-xs sm:text-sm text-gray-400">{serviceCategories[activeService].services.length} specialized services</p>
                      </div>
                    </div>
                    <motion.button whileHover={{x:3}} onClick={()=>setActiveService("all")}
                      className="text-xs sm:text-sm text-gray-400 hover:text-[#E66B26] flex items-center gap-1 font-medium">
                      View All Categories <ChevronRight className="w-3.5 h-3.5"/>
                    </motion.button>
                  </div>
                </Reveal>
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4" stagger={0.08} from="bottom">
                  {serviceCategories[activeService].services.map((svc,idx)=>(
                    <ServiceCard key={idx} service={svc} index={idx} onOpen={setSelectedServiceDetail}/>
                  ))}
                </StaggerContainer>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      <WaveDivider color="#D4AF37" flip toBg="#fff"/>

      {/* ═══ APPROACH ═══ */}
      <section id="ws-approach" className="py-12 sm:py-16 px-3 sm:px-4 bg-white relative overflow-hidden">
        <Spotlight color="rgba(230,107,38,0.04)" size={480}/>
        <div className="absolute inset-0 opacity-[.028]"
          style={{backgroundImage:"radial-gradient(circle,#E66B26 1px,transparent 1px)",backgroundSize:"28px 28px"}}/>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <SLabel text="How We Work"/>
            <AHeading className="text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
              Our Development Approach
            </AHeading>
            <Reveal from="bottom" delay={.2}>
              <div className="w-16 h-[3px] bg-[#D4AF37] mx-auto mt-4 rounded"/>
              <p className="text-xs sm:text-sm md:text-base text-gray-500 max-w-2xl mx-auto mt-4">
                We follow industry best practices and proven methodologies to deliver exceptional results
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative">
            {/* Connector line desktop */}
            <div className="absolute top-[3rem] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#D4AF37]/20 via-[#E66B26]/20 to-[#D4AF37]/20 hidden lg:block"/>
            {APPROACH_STEPS.map((s,i)=>(
              <Reveal key={i} from="bottom" delay={i*.1}>
                <GlowCard accent="#D4AF37">
                  <TiltCard>
                    <motion.div whileHover={{y:-9,boxShadow:"0 26px 55px rgba(212,175,55,0.13)"}}
                      className="relative bg-white p-4 sm:p-5 rounded-xl border border-gray-200 hover:border-[#D4AF37] group transition-all shadow-sm h-full text-center">
                      <Float duration={4+i*.5} delay={i*.4} yRange={8}>
                        <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{s.icon}</div>
                      </Float>
                      <div className="text-xs font-black mb-1 bg-gradient-to-r from-[#E66B26] to-[#C5531A] bg-clip-text text-transparent">{s.step}</div>
                      <h3 className="text-sm sm:text-base font-black text-[#1A1A1A] mb-2">{s.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                      <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#E66B26] rounded-b-xl"
                        initial={{scaleX:0}} whileHover={{scaleX:1}} transition={{duration:.35}}/>
                    </motion.div>
                  </TiltCard>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY US ═══ */}
      <WaveDivider color="#D4AF37" toBg="#FFF4ED"/>
      <section id="ws-why" className="py-12 sm:py-16 px-3 sm:px-4 relative overflow-hidden" style={{background:"#FFF4ED"}}>
        <NoiseCanvas color1="#FFD5B8" color2="#FFCBA4" opacity={0.18}/>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <motion.span className="text-[14vw] font-black leading-none tracking-tighter uppercase text-[#E66B26]/[0.018]"
            animate={{y:[0,-10,0]}} transition={{duration:10,repeat:Infinity,ease:"easeInOut"}}>WHY US</motion.span>
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <SLabel text="Why Stackenzo"/>
            <AHeading className="text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
              Why Stackenzo?
            </AHeading>
            <Reveal from="bottom" delay={.2}>
              <div className="w-16 h-[3px] bg-[#D4AF37] mx-auto mt-4 rounded"/>
              <p className="text-xs sm:text-sm md:text-base text-gray-500 max-w-2xl mx-auto mt-4">
                We combine technical expertise with business acumen to deliver exceptional value
              </p>
            </Reveal>
          </div>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4" stagger={0.09} from="bottom">
            {BENEFITS.map((b,i)=>(
              <GlowCard key={i} accent="#D4AF37">
                <TiltCard>
                  <motion.div whileHover={{y:-8,boxShadow:"0 26px 55px rgba(212,175,55,0.12)"}}
                    className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 hover:border-[#D4AF37] transition-all shadow-sm h-full">
                    <Float duration={4+i*.35} delay={i*.2} yRange={7}>
                      <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{b.icon}</div>
                    </Float>
                    <h3 className="text-sm sm:text-base font-black text-[#1A1A1A] mb-1.5">{b.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500">{b.desc}</p>
                    <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#E66B26] rounded-b-xl"
                      initial={{scaleX:0}} whileHover={{scaleX:1}} transition={{duration:.35}}/>
                  </motion.div>
                </TiltCard>
              </GlowCard>
            ))}
          </StaggerContainer>
        </div>
      </section>
      <WaveDivider color="#D4AF37" flip toBg="#fff"/>

      {/* ═══ TESTIMONIALS ═══ */}
      <section id="ws-testimonials" className="py-12 sm:py-16 px-3 sm:px-4 bg-white relative overflow-hidden">
        <Spotlight color="rgba(230,107,38,0.035)" size={480}/>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <SLabel text="Client Stories"/>
            <AHeading className="text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
              Client Success Stories
            </AHeading>
            <Reveal from="bottom" delay={.2}>
              <div className="w-16 h-[3px] bg-[#D4AF37] mx-auto mt-4 rounded"/>
              <p className="text-xs sm:text-sm md:text-base text-gray-500 max-w-2xl mx-auto mt-4">
                Hear what our clients say about their experience working with us
              </p>
            </Reveal>
          </div>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4" stagger={0.09} from="bottom">
            {TESTIMONIALS.map((t,i)=>(
              <GlowCard key={i} accent="#D4AF37">
                <TiltCard intensity={7}>
                  <motion.div whileHover={{y:-7,boxShadow:"0 24px 55px rgba(212,175,55,0.11)"}}
                    className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 hover:border-[#D4AF37] transition-all shadow-sm h-full flex flex-col">
                    <div className="flex gap-1 mb-2 sm:mb-3">
                      {[...Array(t.rating)].map((_,j)=>(<Star key={j} className="w-3 h-3 sm:w-4 sm:h-4 text-[#D4AF37] fill-current"/>))}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 italic leading-relaxed flex-1">"{t.text}"</p>
                    <div className="flex items-center gap-2 sm:gap-3 mt-auto">
                      <Float duration={4+i*.4} yRange={5}>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-[#E66B26] to-[#C5531A] flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-md">
                          {t.initials}
                        </div>
                      </Float>
                      <div>
                        <div className="text-xs sm:text-sm font-black text-[#1A1A1A]">{t.name}</div>
                        <div className="text-[10px] sm:text-xs text-gray-400">{t.role}</div>
                      </div>
                    </div>
                  </motion.div>
                </TiltCard>
              </GlowCard>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <WaveDivider color="#D4AF37" toBg="#FFF4ED"/>
      <section id="ws-faq" className="py-12 sm:py-16 px-3 sm:px-4 relative overflow-hidden" style={{background:"#FFF4ED"}}>
        <NoiseCanvas color1="#FFD5B8" color2="#FFCBA4" opacity={0.18}/>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <SLabel text="FAQ"/>
            <AHeading className="text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
              Frequently Asked Questions
            </AHeading>
            <Reveal from="bottom" delay={.2}>
              <div className="w-16 h-[3px] bg-[#D4AF37] mx-auto mt-4 rounded"/>
              <p className="text-xs sm:text-sm text-gray-500 mt-3">Got questions? We've got answers.</p>
            </Reveal>
          </div>
          <StaggerContainer className="space-y-2 sm:space-y-3" stagger={0.07} from="bottom">
            {FAQS.map((faq,i)=>(
              <GlowCard key={i} accent="#D4AF37">
                <motion.div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-[#D4AF37] transition-all shadow-sm">
                  <motion.button
                    whileHover={{backgroundColor:"rgba(232,245,233,0.7)"}}
                    onClick={()=>setOpenFaq(openFaq===i?null:i)}
                    className="w-full p-3 sm:p-4 text-left flex justify-between items-center transition-all gap-2">
                    <h3 className="text-xs sm:text-sm font-black text-[#1A1A1A] pr-2">{faq.q}</h3>
                    <motion.div animate={{rotate:openFaq===i?180:0}} transition={{duration:.3}}>
                      <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] shrink-0"/>
                    </motion.div>
                  </motion.button>
                  <AnimatePresence>
                    {openFaq===i&&(
                      <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.35,ease:EASE_EXPO}}
                        className="overflow-hidden">
                        <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-gray-100">
                          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed pt-2">{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </GlowCard>
            ))}
          </StaggerContainer>
        </div>
      </section>
      <WaveDivider color="#D4AF37" flip toBg="#fff"/>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-12 sm:py-16 px-3 sm:px-4 bg-white relative overflow-hidden">
        <Spotlight color="rgba(230,107,38,0.03)" size={460}/>
        <div className="max-w-4xl mx-auto relative z-10">
          <Reveal from="bottom">
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-[#E66B26] to-[#C5531A]"/>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2072')] bg-cover bg-center mix-blend-overlay opacity-20"/>
              <div className="absolute inset-0"><ParticleCanvas count={12} color="rgba(212,175,55,0.09)"/></div>
              <Spotlight color="rgba(212,175,55,0.07)" size={360}/>
              {/* Floating rings */}
              {[70,120,180].map((s,i)=>(
                <Float key={i} duration={6+i*2} yRange={10} delay={i}
                  className="absolute right-10 top-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/12 pointer-events-none"
                  style={{width:s,height:s}}/>
              ))}
              <div className="relative z-10 p-6 sm:p-8 md:p-10 text-center">
                <Reveal from="top">
                  <div className="inline-flex items-center gap-2 border border-[#D4AF37]/38 rounded-full px-4 py-2 mb-6 bg-[#D4AF37]/10 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]"/>
                    <span className="text-sm text-[#D4AF37] font-bold">Start Your Transformation</span>
                  </div>
                </Reveal>
                <Reveal from="bottom" delay={.1}>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white mb-2 sm:mb-3">Start Your Digital Transformation Today</h2>
                </Reveal>
                <Reveal from="bottom" delay={.2}>
                  <p className="text-xs sm:text-sm md:text-base text-white/85 mb-6 sm:mb-8 max-w-2xl mx-auto">
                    Collaborate with our experts to create technology that performs and evolves.
                  </p>
                </Reveal>
                <Reveal from="bottom" delay={.32}>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <MagBtn onClick={()=>navigate("/contact")}
                      className="group relative w-full sm:w-auto px-6 py-3 bg-white text-[#E66B26] rounded-full font-black text-sm overflow-hidden shadow-xl">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Contact Us Today
                        <motion.span animate={{x:[0,4,0]}} transition={{duration:1.5,repeat:Infinity}}><ArrowRight className="w-4 h-4"/></motion.span>
                      </span>
                      <motion.div className="absolute inset-0 bg-[#FFF4ED] origin-left" initial={{scaleX:0}} whileHover={{scaleX:1}} transition={{duration:.4}}/>
                    </MagBtn>
                    <MagBtn onClick={()=>setIsQuoteModalOpen(true)}
                      className="w-full sm:w-auto px-6 py-3 border-2 border-white text-white rounded-full font-black text-sm hover:bg-white hover:text-[#E66B26] transition-all">
                      Get Free Consultation
                    </MagBtn>
                  </div>
                </Reveal>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ SERVICE DETAIL MODAL ═══ */}
      <AnimatePresence>
        {selectedServiceDetail&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm"
            onClick={()=>setSelectedServiceDetail(null)}>
            <motion.div initial={{opacity:0,scale:.88,y:30}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.88,y:30}}
              transition={{type:"spring",stiffness:280,damping:24}}
              onClick={e=>e.stopPropagation()}
              className="bg-white rounded-xl sm:rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 shadow-2xl">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-[#E66B26] to-[#C5531A] p-3 sm:p-4 flex items-center justify-between z-10 rounded-t-xl sm:rounded-t-2xl">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg text-white">{selectedServiceDetail.icon}</div>
                  <h2 className="text-sm sm:text-base md:text-lg font-black text-white line-clamp-1">{selectedServiceDetail.title}</h2>
                </div>
                <motion.button whileHover={{rotate:90,scale:1.1}} transition={{duration:.2}}
                  onClick={()=>setSelectedServiceDetail(null)} className="text-white hover:text-gray-200 p-1 hover:bg-white/20 rounded-lg transition-all">
                  <X className="w-4 h-4 sm:w-5 sm:h-5"/>
                </motion.button>
              </div>
              {/* Body */}
              <div className="p-3 sm:p-5 space-y-4">
                <div className="bg-[#FFF4ED] p-3 sm:p-4 rounded-xl border border-gray-200">
                  <h3 className="text-xs sm:text-sm font-black text-[#E66B26] mb-2">Service Overview</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{selectedServiceDetail.detailedDesc||selectedServiceDetail.desc}</p>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-[#E66B26] mb-2">Key Features</h3>
                  <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-2" stagger={0.06} from="bottom">
                    {selectedServiceDetail.features.map((f,i)=>(
                      <div key={i} className="flex items-start gap-2 bg-[#FFF4ED] p-2.5 rounded-lg border border-gray-200">
                        <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] shrink-0 mt-0.5"/>
                        <span className="text-xs sm:text-sm text-[#1A1A1A]">{f}</span>
                      </div>
                    ))}
                  </StaggerContainer>
                </div>
                {selectedServiceDetail.benefits&&(
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-[#E66B26] mb-2">Benefits</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {selectedServiceDetail.benefits.map((b,i)=>(
                        <div key={i} className="flex items-start gap-1.5 text-gray-600">
                          <span className="text-[#D4AF37] font-bold">✓</span>
                          <span className="text-xs sm:text-sm">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedServiceDetail.technologies&&(
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-[#E66B26] mb-2">Technologies</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedServiceDetail.technologies.map((t,i)=>(
                        <motion.span key={i} whileHover={{scale:1.07}}
                          className="px-2.5 py-1 bg-[#FFF4ED] text-[#1A1A1A] text-xs rounded-full border border-gray-200 cursor-default">{t}</motion.span>
                      ))}
                    </div>
                  </div>
                )}
                {selectedServiceDetail.timeline&&(
                  <div className="bg-[#FFF4ED] p-3 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-[#1A1A1A]">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]"/>
                      <span className="font-black text-[#E66B26]">Timeline:</span>
                      <span className="text-gray-600">{selectedServiceDetail.timeline}</span>
                    </div>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-100">
                  <MagBtn
                    onClick={()=>{ setQuoteFormData({...quoteFormData,service:selectedServiceDetail.title}); setSelectedServiceDetail(null); setIsQuoteModalOpen(true); }}
                    className="w-full px-4 py-2.5 bg-[#E66B26] text-white rounded-xl text-xs sm:text-sm font-black hover:bg-[#C5531A] transition-all flex items-center justify-center gap-2 shadow-md">
                    <span>Get Quote for {selectedServiceDetail.title}</span>
                    <motion.span animate={{x:[0,3,0]}} transition={{duration:1.4,repeat:Infinity}}><ChevronRight className="w-3.5 h-3.5"/></motion.span>
                  </MagBtn>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ QUOTE MODAL ═══ */}
      <AnimatePresence>
        {isQuoteModalOpen&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm"
            onClick={()=>setIsQuoteModalOpen(false)}>
            <motion.div initial={{opacity:0,scale:.88,y:30}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.88,y:30}}
              transition={{type:"spring",stiffness:280,damping:24}}
              onClick={e=>e.stopPropagation()}
              className="bg-white rounded-xl sm:rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-100 shadow-2xl">
              <div className="sticky top-0 bg-gradient-to-r from-[#E66B26] to-[#C5531A] p-3 sm:p-4 flex justify-between items-center rounded-t-xl sm:rounded-t-2xl">
                <h2 className="text-sm sm:text-base font-black text-white">Get a Quote</h2>
                <motion.button whileHover={{rotate:90,scale:1.1}} transition={{duration:.2}}
                  onClick={()=>setIsQuoteModalOpen(false)} className="text-white hover:text-gray-200 p-1 hover:bg-white/20 rounded-lg transition-all">
                  <X className="w-4 h-4 sm:w-5 sm:h-5"/>
                </motion.button>
              </div>
              <form onSubmit={handleQuoteSubmit} className="p-3 sm:p-5 space-y-3">
                {[
                  {l:"Full Name *",     k:"name",    t:"text",  ph:"John Doe"},
                  {l:"Email *",         k:"email",   t:"email", ph:"john@company.com"},
                  {l:"Phone *",         k:"phone",   t:"tel",   ph:"+91 9876543210"},
                  {l:"Company *",       k:"company", t:"text",  ph:"Your Company"},
                ].map(({l,k,t,ph})=>(
                  <div key={k}>
                    <label className="block text-xs sm:text-sm font-black text-[#1A1A1A] mb-1">{l}</label>
                    <motion.input type={t} required placeholder={ph}
                      value={quoteFormData[k]} onChange={e=>setQuoteFormData({...quoteFormData,[k]:e.target.value})}
                      whileFocus={{boxShadow:"0 0 0 2px rgba(230,107,38,0.18)"}}
                      className="w-full p-2 sm:p-2.5 rounded-lg bg-white border border-gray-200 text-[#1A1A1A] text-xs sm:text-sm focus:border-[#D4AF37] outline-none transition-all"/>
                  </div>
                ))}
                <div>
                  <label className="block text-xs sm:text-sm font-black text-[#1A1A1A] mb-1">Service *</label>
                  <select required value={quoteFormData.service}
                    onChange={e=>setQuoteFormData({...quoteFormData,service:e.target.value})}
                    className="w-full p-2 sm:p-2.5 rounded-lg bg-white border border-gray-200 text-[#1A1A1A] text-xs sm:text-sm focus:border-[#D4AF37] outline-none">
                    <option value="">Select a service</option>
                    {Object.values(serviceCategories).map(cat=>(
                      <optgroup key={cat.title} label={cat.title}>
                        {cat.services.map(s=>(<option key={s.title} value={s.title}>{s.title}</option>))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-black text-[#1A1A1A] mb-1">Message</label>
                  <motion.textarea rows="3" placeholder="Tell us about your project…"
                    value={quoteFormData.message} onChange={e=>setQuoteFormData({...quoteFormData,message:e.target.value})}
                    whileFocus={{boxShadow:"0 0 0 2px rgba(230,107,38,0.18)"}}
                    className="w-full p-2 sm:p-2.5 rounded-lg bg-white border border-gray-200 text-[#1A1A1A] text-xs sm:text-sm focus:border-[#D4AF37] outline-none resize-none"/>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <MagBtn type="button" onClick={()=>setIsQuoteModalOpen(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 bg-white text-[#1A1A1A] rounded-xl text-xs sm:text-sm font-black hover:bg-[#FFF4ED] transition-all">
                    Cancel
                  </MagBtn>
                  <MagBtn type="submit"
                    className="flex-1 px-4 py-2.5 bg-[#E66B26] text-white rounded-xl text-xs sm:text-sm font-black hover:bg-[#C5531A] disabled:opacity-50 transition-all shadow-md">
                    {isSubmitting ? "Submitting…" : "Submit Request"}
                  </MagBtn>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer/>
    </div>
  );
}

export default WebServices;