import {
  motion, AnimatePresence, useInView, useScroll, useTransform,
  useSpring, useMotionValue, useVelocity,
} from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  BookOpen, Briefcase, Rocket, ChevronRight,
  Users, Award, TrendingUp, Target, Sparkles,
  Code, Cpu, CircuitBoard, Bot, GraduationCap,
  Microscope, Zap, Globe, Clock, Star, ArrowRight,
  CheckCircle, Layers, Palette, Lightbulb,
  School, Presentation, Shield,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

/* ══════════════════════════════════════════════
   EASING
══════════════════════════════════════════════ */
const EASE_EXPO = [0.16, 1, 0.3, 1];
const EASE_BACK = [0.34, 1.56, 0.64, 1];

/* ══════════════════════════════════════════════
   NAV
══════════════════════════════════════════════ */
const NAV_SECTIONS = ["prog-hero", "prog-tabs", "prog-cta"];
const NAV_LABELS   = ["Hero", "Programs", "Join Us"];

/* ══════════════════════════════════════════════
   DATA
══════════════════════════════════════════════ */
const PROGRAMS = {
  college: {
    workshops: {
      title: "Advanced Workshops",
      icon: Presentation,
      accent: "#C5531A",
      gradient: "from-[#E66B26] to-[#C5531A]",
      description: "Deep-dive technical workshops led by industry experts, covering cutting-edge technologies and real-world applications.",
      features: [
        "Hands-on coding sessions with real projects",
        "Industry-aligned curriculum updated quarterly",
        "Expert mentorship from working professionals",
        "Certificate of completion with project portfolio",
      ],
      topics: [
        { name: "Full-Stack Development", icon: Code   },
        { name: "Artificial Intelligence", icon: Bot   },
        { name: "Cloud Architecture",      icon: Globe  },
        { name: "Cybersecurity",           icon: Shield },
      ],
      stats: { duration: "4-8 weeks", projects: "3+", students: "500+" },
      link: "/WorkShops",
    },
    internships: {
      title: "Industry Internships",
      icon: Briefcase,
      accent: "#E66B26",
      gradient: "from-[#E66B26] to-[#C5531A]",
      description: "Structured internship programs with partner companies, offering real-world experience and professional mentorship.",
      features: [
        "Paid internship opportunities with top companies",
        "One-on-one mentorship from industry veterans",
        "Real project contributions to production code",
        "Potential for full-time job offers post-internship",
      ],
      topics: [
        { name: "Software Engineering",  icon: Code      },
        { name: "Product Management",    icon: Target    },
        { name: "UX Design",             icon: Palette   },
        { name: "Data Science",          icon: TrendingUp},
      ],
      stats: { partners: "25+", placement: "85%", stipend: "Competitive" },
      link: "/workshops",
    },
  },
  school: {
    robotics: {
      title: "Robotics Education",
      icon: School,
      accent: "#D4AF37",
      gradient: "from-[#D4AF37] to-[#D4AF37]",
      description: "Hands-on robotics programs that introduce students to programming, electronics, and engineering through fun projects.",
      features: [
        "Age-appropriate curriculum for grades 6 – 9",
        "Build and program real robots",
        "Participate in robotics competitions",
        "Develop problem-solving and teamwork skills",
      ],
      topics: [
        { name: "Arduino Programming", icon: Cpu          },
        { name: "Circuit Design",      icon: CircuitBoard },
        { name: "Sensor Integration",  icon: Zap          },
        { name: "Mechanical Design",   icon: Layers       },
      ],
      levels: [
        { name: "Junior (Class 6)",                   emoji: "🤖" },
        { name: "Intermediate (Class 6 – Class 8)",   emoji: "⚙️" },
        { name: "Advanced (Class 9)",                 emoji: "🚀" },
      ],
      stats: { students: "700+", projects: "1000+", comps: "15+" },
      link: "/Robotics",
    },
  },
};

const HERO_STATS = [
  { icon: GraduationCap, value: "1200+", label: "Students",    color: "text-[#E66B26]" },
  { icon: BookOpen,      value: "15+",   label: "Programs",    color: "text-[#C5531A]" },
  { icon: Award,         value: "95%",   label: "Success Rate",color: "text-[#E66B26]" },
  { icon: Star,          value: "4.9/5", label: "Rating",      color: "text-[#D4AF37]" },
];

/* ══════════════════════════════════════════════
   HOOK — scroll direction
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
    scale:  { hidden:{ scale:.75, opacity:0, filter:"blur(8px)" },         visible:{ scale:1, opacity:1, filter:"blur(0px)" },       exit:{ scale:.85, opacity:0, filter:"blur(6px)" } },
  };
  const { hidden, visible, exit } = V[from] || V.bottom;

  return (
    <motion.div ref={ref} className={className}
      initial="hidden"
      animate={inV ? "visible" : once ? "hidden" : dir === "up" ? "exit" : "hidden"}
      variants={{ hidden, visible, exit }}
      transition={{ duration: .75, delay, ease: EASE_EXPO }}>
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   STAGGER CONTAINER
══════════════════════════════════════════════ */
function StaggerContainer({ children, className = "", stagger = 0.1, from = "bottom" }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: false, margin: "-55px" });
  const dir = useScrollDir();
  const B = {
    bottom: { hidden:{ y:55,  opacity:0, scale:.95, filter:"blur(5px)" }, visible:{ y:0, opacity:1, scale:1, filter:"blur(0px)" }, exit:{ y:-38, opacity:0, scale:.97, filter:"blur(3px)" } },
    left:   { hidden:{ x:-55, opacity:0 }, visible:{ x:0, opacity:1 }, exit:{ x:38, opacity:0 } },
    right:  { hidden:{ x:55,  opacity:0 }, visible:{ x:0, opacity:1 }, exit:{ x:-38,opacity:0 } },
    scale:  { hidden:{ scale:.8, opacity:0 }, visible:{ scale:1, opacity:1 }, exit:{ scale:.85, opacity:0 } },
  };
  const { hidden, visible, exit } = B[from] || B.bottom;
  return (
    <motion.div ref={ref} className={className}
      initial="hidden"
      animate={inV ? "visible" : dir === "up" ? "exit" : "hidden"}
      variants={{ hidden:{}, visible:{ transition:{ staggerChildren:stagger }}, exit:{ transition:{ staggerChildren:stagger/2, staggerDirection:-1 }}}}>
      {Array.isArray(children)
        ? children.map((c, i) => <motion.div key={i} variants={{ hidden, visible, exit }} transition={{ duration:.7, ease:EASE_EXPO }}>{c}</motion.div>)
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
      animate={{ y: [-yRange/2, yRange/2, -yRange/2] }}
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
      transition={{ duration:.75, ease:EASE_EXPO }}>
      <div className="absolute pointer-events-none rounded-2xl z-0"
        style={{ inset:-1, background:`radial-gradient(320px circle at ${pos.x}px ${pos.y}px,${accent}30,transparent 60%)`, opacity:inV?1:0, transition:"opacity .3s" }} />
      <motion.div className="absolute inset-0 rounded-2xl pointer-events-none z-0"
        animate={inV ? { opacity:[.28,.6,.28] } : { opacity:0 }}
        transition={{ duration:2.5, repeat:Infinity, ease:"easeInOut" }}
        style={{ boxShadow:`inset 0 0 0 1px ${accent}38` }} />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   3-D TILT CARD
══════════════════════════════════════════════ */
function TiltCard({ children, className = "", intensity = 10 }) {
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
function MagBtn({ children, className = "", onClick }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x,{stiffness:250,damping:16}), sy = useSpring(y,{stiffness:250,damping:16});
  const mm = e => { const r=ref.current.getBoundingClientRect(); x.set((e.clientX-r.left-r.width/2)*.38); y.set((e.clientY-r.top-r.height/2)*.38); };
  const ml = () => { x.set(0); y.set(0); };
  return (
    <motion.button ref={ref} style={{x:sx,y:sy}} onMouseMove={mm} onMouseLeave={ml} whileTap={{scale:.94}} onClick={onClick} className={className}>
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
  const raw = value.replace(/[^0-9.]/g,"");
  const num = parseFloat(raw);
  const sfx = value.replace(/[0-9.]/g,"");
  const isFloat = raw.includes(".");
  const mv = useMotionValue(0);
  const sp = useSpring(mv,{stiffness:55,damping:14});
  const [d, setD] = useState(0);
  useEffect(() => { mv.set(inV ? num : 0); }, [inV]);
  useEffect(() => sp.on("change", v => setD(isFloat ? parseFloat(v.toFixed(1)) : Math.round(v))), [sp]);
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
  const [active, setActive] = useState(0);
  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){const i=NAV_SECTIONS.indexOf(e.target.id);if(i!==-1)setActive(i);}}),{threshold:.4});
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
            <motion.div layoutId="prog-nav-pulse" className="absolute inset-0 rounded-full"
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
function NoiseCanvas({ color1="#FFD5B8", color2="#FFF4ED", opacity=0.38 }) {
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
function ParticleCanvas({ count=26, color="rgba(230,107,38,0.10)" }) {
  const ref=useRef(null);
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const ctx=c.getContext("2d");
    let w=c.width=c.offsetWidth, h=c.height=c.offsetHeight;
    const pts=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.38,vy:(Math.random()-.5)*.38,r:Math.random()*1.8+.8}));
    let id;
    const draw=()=>{
      ctx.clearRect(0,0,w,h);
      pts.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=w; if(p.x>w)p.x=0; if(p.y<0)p.y=h; if(p.y>h)p.y=0;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=color; ctx.fill();
      });
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
        const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);
        if(d<90){ ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.strokeStyle=color.replace(/[\d.]+\)$/,`${(1-d/90)*.065})`); ctx.stroke(); }
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
function Spotlight({ color="rgba(212,175,55,0.07)", size=600 }) {
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
      <motion.div initial={{scaleX:0}} whileInView={{scaleX:1}} viewport={{once:false}} transition={{duration:.55}} className="h-px w-8 bg-[#D4AF37] origin-left"/>
      <span className="text-[#D4AF37] font-bold tracking-[.2em] text-[11px] uppercase">{text}</span>
      <motion.div initial={{scaleX:0}} whileInView={{scaleX:1}} viewport={{once:false}} transition={{duration:.55}} className="h-px w-8 bg-[#D4AF37] origin-right"/>
    </Reveal>
  );
}

/* ══════════════════════════════════════════════
   WORD-BY-WORD HEADING (bidirectional)
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
const MARQUEE_ITEMS = ["Advanced Workshops","Industry Internships","Robotics Education","Arduino Programming","Full-Stack Dev","AI & ML","Cloud Architecture","Cybersecurity","Circuit Design","Sensor Integration"];
function MarqueeStrip({ dark=false, reverse=false }) {
  const [paused, setPaused] = useState(false);
  const items = [...MARQUEE_ITEMS,...MARQUEE_ITEMS];
  return (
    <div className={`py-4 overflow-hidden border-y ${dark?"border-white/8 bg-white/[0.03]":"border-black/5 bg-[#F7F4EF]"}`}
      onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}>
      <motion.div className="flex gap-10 whitespace-nowrap"
        animate={paused?{}:{x:reverse?["-50%","0%"]:["0%","-50%"]}}
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
   HERO SECTION
══════════════════════════════════════════════ */
function HeroSection() {
  const secRef=useRef(null);
  const {scrollYProgress}=useScroll({target:secRef,offset:["start start","end start"]});
  const hY  =useTransform(scrollYProgress,[0,1],[0,-110]);
  const hO  =useTransform(scrollYProgress,[0,.6],[1,0]);
  const hS  =useTransform(scrollYProgress,[0,1],[1,.84]);
  const bigY=useTransform(scrollYProgress,[0,1],[0,180]);
  const imgS=useTransform(scrollYProgress,[0,1],[1,1.13]);

  const mx=useMotionValue(0), my=useMotionValue(0);
  const smx=useSpring(mx,{stiffness:35,damping:18}), smy=useSpring(my,{stiffness:35,damping:18});
  const b1x=useTransform(smx,[-1,1],[-28,28]), b1y=useTransform(smy,[-1,1],[-16,16]);
  const b2x=useTransform(smx,[-1,1],[20,-20]), b2y=useTransform(smy,[-1,1],[14,-14]);
  useEffect(()=>{
    const fn=e=>{mx.set((e.clientX/window.innerWidth-.5)*2); my.set((e.clientY/window.innerHeight-.5)*2);};
    window.addEventListener("mousemove",fn); return()=>window.removeEventListener("mousemove",fn);
  },[]);

  return (
    <section id="prog-hero" ref={secRef} className="relative pt-32 pb-20 px-4 sm:px-6 min-h-screen flex items-center overflow-hidden">
      {/* Parallax BG */}
      <motion.div className="absolute inset-0 z-0" style={{scale:imgS}}>
        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Students learning" className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/75 to-white"/>
        <div className="absolute inset-0 bg-gradient-to-r from-[#E66B26]/30 via-transparent to-[#E66B26]/30 mix-blend-overlay"/>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(255,255,255,0.65)_100%)]"/>
      </motion.div>

      {/* Particles + noise */}
      <div className="absolute inset-0 z-[1]"><ParticleCanvas count={22} color="rgba(230,107,38,0.08)"/></div>
      <NoiseCanvas color1="#FFD5B8" color2="#FFF0E6" opacity={0.3}/>

      {/* Kinetic bg text */}
      <motion.div style={{y:bigY}} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-[2]">
        <span className="text-[20vw] font-black leading-none tracking-tighter uppercase whitespace-nowrap"
          style={{color:"rgba(230,107,38,0.018)"}}>PROGRAMS</span>
      </motion.div>

      {/* Dot grid */}
      <div className="absolute inset-0 z-[2] opacity-[.028]"
        style={{backgroundImage:"radial-gradient(circle,#E66B26 1px,transparent 1px)",backgroundSize:"30px 30px"}}/>

      {/* Parallax blobs */}
      <motion.div style={{x:b1x,y:b1y}} className="absolute top-10 left-[4%] w-[380px] h-[380px] pointer-events-none z-[2]">
        <div className="w-full h-full rounded-full blur-[110px] opacity-[.32]" style={{background:"radial-gradient(circle,#FFD5B8,transparent)"}}/>
      </motion.div>
      <motion.div style={{x:b2x,y:b2y}} className="absolute bottom-10 right-[4%] w-[450px] h-[450px] pointer-events-none z-[2]">
        <div className="w-full h-full rounded-full blur-[120px] opacity-[.18]" style={{background:"radial-gradient(circle,#D4AF37,transparent)"}}/>
      </motion.div>

      {/* Floating orbs */}
      <Float className="absolute top-1/4 left-[8%] w-3 h-3 rounded-full bg-[#D4AF37]/30 z-[2]" duration={5} delay={0}/>
      <Float className="absolute top-1/3 right-[10%] w-2 h-2 rounded-full bg-[#E66B26]/25 z-[2]" duration={4} delay={1}/>
      <Float className="absolute bottom-1/3 left-[14%] w-4 h-4 rounded-full bg-[#C5531A]/20 z-[2]" duration={6} delay={2}/>
      <Float className="absolute bottom-1/4 right-[16%] w-2.5 h-2.5 rounded-full bg-[#D4AF37]/22 z-[2]" duration={5.5} delay={.5}/>

      {/* Main content */}
      <motion.div style={{y:hY,opacity:hO,scale:hS}} className="max-w-6xl mx-auto text-center relative z-10 w-full">

        {/* Badge */}
        <motion.div initial={{scale:.7,opacity:0,y:20}} animate={{scale:1,opacity:1,y:0}} transition={{duration:.65,ease:EASE_BACK}}
          className="inline-flex items-center gap-2 bg-white/85 border border-gray-200 rounded-full px-6 py-3 mb-8 shadow-sm backdrop-blur-sm">
          <motion.div animate={{rotate:[0,20,-20,0]}} transition={{duration:2.8,repeat:Infinity,ease:"easeInOut"}}>
            <Sparkles className="w-5 h-5 text-[#D4AF37]"/>
          </motion.div>
          <span className="text-sm font-semibold text-[#E66B26]">Future-Ready Learning</span>
        </motion.div>

        {/* Heading */}
        <motion.h1 initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:.3,duration:.75,ease:EASE_EXPO}}
          className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
          <span className="text-[#1A1A1A]">Stackenzo</span>
          <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] via-[#C5531A] to-[#E66B26]">Programs</span>
        </motion.h1>

        {/* Sub */}
        <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.5,ease:EASE_EXPO}}
          className="text-lg sm:text-xl text-[#1A1A1A] max-w-3xl mx-auto leading-relaxed mb-12">
          Where young minds transform into innovators through hands-on learning and real-world experience
        </motion.p>

        {/* Stat cards */}
        <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{delay:.7,ease:EASE_EXPO}}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {HERO_STATS.map((s,i)=>(
            <Float key={i} duration={4+i*.5} delay={i*.3}>
              <TiltCard>
                <motion.div whileHover={{y:-6,boxShadow:"0 18px 44px rgba(0,0,0,0.10)"}}
                  className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-sm hover:border-[#D4AF37] transition-all text-center cursor-default">
                  <s.icon className={`w-6 h-6 mx-auto mb-2 ${s.color}`}/>
                  <div className="text-xl font-black text-[#1A1A1A]"><Counter value={s.value}/></div>
                  <div className="text-sm text-gray-500">{s.label}</div>
                </motion.div>
              </TiltCard>
            </Float>
          ))}
        </motion.div>

        {/* Scroll cue */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.8}}
          className="flex justify-center mt-12 cursor-pointer"
          onClick={()=>document.getElementById("prog-tabs")?.scrollIntoView({behavior:"smooth"})}>
          <Float duration={2} yRange={10}>
            <div className="w-5 h-8 border-2 border-[#E66B26]/28 rounded-full flex justify-center">
              <motion.div className="w-1 h-2 bg-[#D4AF37] rounded-full mt-2"
                animate={{y:[0,10,0],opacity:[1,.4,1]}} transition={{duration:1.8,repeat:Infinity}}/>
            </div>
          </Float>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   PROGRAMS TABS SECTION
══════════════════════════════════════════════ */
function ProgramsSection() {
  const [activeTab, setActiveTab] = useState("college");

  return (
    <>
      <WaveDivider color="#D4AF37" toBg="#FFF4ED"/>
      <section id="prog-tabs" className="py-16 px-4 sm:px-6 relative overflow-hidden" style={{background:"#FFF4ED"}}>
        <NoiseCanvas color1="#FFD5B8" color2="#FFCBA4" opacity={0.22}/>
        <Spotlight color="rgba(230,107,38,0.045)" size={500}/>

        {/* Big kinetic bg text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <motion.span className="text-[16vw] font-black leading-none tracking-tighter uppercase text-[#E66B26]/[0.018]"
            animate={{y:[0,-10,0]}} transition={{duration:9,repeat:Infinity,ease:"easeInOut"}}>
            {activeTab === "college" ? "COLLEGE" : "SCHOOL"}
          </motion.span>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section header */}
          <div className="text-center mb-10">
            <SLabel text="Explore Programs"/>
            <AHeading className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
              Choose Your Path
            </AHeading>
          </div>

          {/* Tab toggle */}
          <Reveal from="top" delay={.1} className="mb-12">
            <div className="flex justify-center">
              <div className="flex gap-2 p-1.5 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
                {[
                  { id:"college", label:"College Programs", icon:GraduationCap },
                  { id:"school",  label:"School Programs",  icon:School        },
                ].map(tab => (
                  <MagBtn key={tab.id} onClick={()=>setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-300 ${
                      activeTab===tab.id ? "bg-[#E66B26] text-white shadow-md" : "text-[#1A1A1A] hover:text-[#E66B26] hover:bg-white"
                    }`}>
                    <tab.icon className="w-5 h-5"/>
                    {tab.label}
                  </MagBtn>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {activeTab === "college" && (
              <motion.div key="college"
                initial={{opacity:0,y:40,filter:"blur(8px)"}}
                animate={{opacity:1,y:0,filter:"blur(0px)"}}
                exit={{opacity:0,y:-30,filter:"blur(8px)"}}
                transition={{duration:.55,ease:EASE_EXPO}}>
                <div className="grid lg:grid-cols-2 gap-8">
                  {Object.entries(PROGRAMS.college).map(([key,prog],idx)=>{
                    const Icon=prog.icon;
                    return (
                      <Reveal key={key} from={idx===0?"left":"right"} delay={idx*.1}>
                        <GlowCard accent={prog.accent} className="h-full">
                          <TiltCard intensity={7} className="h-full">
                            <motion.div whileHover={{y:-8,boxShadow:`0 32px 70px ${prog.accent}20`}}
                              className="bg-white border border-gray-200 rounded-2xl overflow-hidden h-full hover:border-[#D4AF37] transition-colors shadow-sm">
                              <div className="p-8 h-full flex flex-col">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-6">
                                  <Float duration={4+idx} delay={idx*.4}>
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${prog.gradient} flex items-center justify-center shadow-md`}>
                                      <Icon className="w-7 h-7 text-white"/>
                                    </div>
                                  </Float>
                                  <div className="flex gap-2 flex-wrap justify-end">
                                    {prog.topics.slice(0,2).map((t,i)=>{
                                      const TIcon=t.icon;
                                      return (
                                        <motion.span key={i} whileHover={{scale:1.08}}
                                          className="px-2 py-1 bg-[#FFF4ED] rounded-lg text-xs flex items-center gap-1 text-[#1A1A1A] border border-gray-200">
                                          <TIcon className="w-3 h-3"/>{t.name}
                                        </motion.span>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-bold mb-3 text-[#E66B26]">{prog.title}</h3>
                                <p className="text-[#1A1A1A] mb-6 leading-relaxed">{prog.description}</p>

                                {/* Features */}
                                <StaggerContainer className="space-y-2 mb-6" stagger={0.07} from="left">
                                  {prog.features.map((f,i)=>(
                                    <div key={i} className="flex items-start gap-2">
                                      <motion.div animate={{scale:[1,1.3,1]}} transition={{duration:2.2,repeat:Infinity,delay:i*.25}}>
                                        <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0"/>
                                      </motion.div>
                                      <span className="text-sm text-[#1A1A1A]">{f}</span>
                                    </div>
                                  ))}
                                </StaggerContainer>

                                {/* All topics */}
                                <StaggerContainer className="grid grid-cols-2 gap-2 mb-6" stagger={0.08} from="scale">
                                  {prog.topics.map((t,i)=>{
                                    const TIcon=t.icon;
                                    return (
                                      <motion.div key={i} whileHover={{scale:1.05,boxShadow:"0 6px 20px rgba(0,0,0,0.07)"}}
                                        className="flex items-center gap-2 bg-[#FFF4ED] px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium text-[#1A1A1A]">
                                        <TIcon className="w-3.5 h-3.5 text-[#E66B26] shrink-0"/>{t.name}
                                      </motion.div>
                                    );
                                  })}
                                </StaggerContainer>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-[#FFF4ED] rounded-xl border border-gray-200">
                                  {Object.entries(prog.stats).map(([k,v])=>(
                                    <div key={k} className="text-center">
                                      <div className="text-base font-black text-[#E66B26]">{v}</div>
                                      <div className="text-xs text-gray-500 capitalize">{k}</div>
                                    </div>
                                  ))}
                                </div>

                                {/* CTA */}
                                <div className="mt-auto">
                                  <Link to={prog.link}>
                                    <MagBtn className="group w-full py-3.5 bg-[#E66B26] text-white rounded-xl font-semibold hover:bg-[#C5531A] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-xl overflow-hidden relative">
                                      <span className="relative z-10">Explore Program</span>
                                      <motion.span className="relative z-10" animate={{x:[0,4,0]}} transition={{duration:1.5,repeat:Infinity}}>
                                        <ArrowRight className="w-4 h-4"/>
                                      </motion.span>
                                      <motion.div className="absolute inset-0 bg-[#C5531A] origin-left" initial={{scaleX:0}} whileHover={{scaleX:1}} transition={{duration:.4}}/>
                                    </MagBtn>
                                  </Link>
                                </div>
                              </div>
                            </motion.div>
                          </TiltCard>
                        </GlowCard>
                      </Reveal>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === "school" && (
              <motion.div key="school"
                initial={{opacity:0,y:40,filter:"blur(8px)"}}
                animate={{opacity:1,y:0,filter:"blur(0px)"}}
                exit={{opacity:0,y:-30,filter:"blur(8px)"}}
                transition={{duration:.55,ease:EASE_EXPO}}>
                <div className="max-w-5xl mx-auto">
                  <Reveal from="bottom">
                    <GlowCard accent="#D4AF37">
                      <TiltCard intensity={5}>
                        <motion.div whileHover={{boxShadow:"0 28px 65px rgba(212,175,55,0.12)"}}
                          className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#D4AF37] transition-colors shadow-sm">
                          <div className="p-8">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                              <Float duration={4.5} yRange={10}>
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#D4AF37] flex items-center justify-center shadow-md">
                                  <School className="w-8 h-8 text-white"/>
                                </div>
                              </Float>
                              <div>
                                <h3 className="text-3xl font-bold mb-2 text-[#E66B26]">{PROGRAMS.school.robotics.title}</h3>
                                <p className="text-[#1A1A1A] leading-relaxed">{PROGRAMS.school.robotics.description}</p>
                              </div>
                            </div>

                            {/* Features & Topics */}
                            <div className="grid lg:grid-cols-2 gap-8 mb-8">
                              <div>
                                <Reveal from="left">
                                  <h4 className="text-lg font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
                                    <motion.div animate={{rotate:[0,20,-20,0]}} transition={{duration:2.8,repeat:Infinity}}>
                                      <Sparkles className="w-5 h-5 text-[#D4AF37]"/>
                                    </motion.div>
                                    Program Features
                                  </h4>
                                </Reveal>
                                <StaggerContainer className="space-y-4" stagger={0.08} from="left">
                                  {PROGRAMS.school.robotics.features.map((f,i)=>(
                                    <div key={i} className="flex items-start gap-3">
                                      <motion.div animate={{scale:[1,1.35,1]}} transition={{duration:2.2,repeat:Infinity,delay:i*.25}}>
                                        <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0"/>
                                      </motion.div>
                                      <span className="text-[#1A1A1A]">{f}</span>
                                    </div>
                                  ))}
                                </StaggerContainer>
                              </div>

                              <div>
                                <Reveal from="right">
                                  <h4 className="text-lg font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
                                    <motion.div animate={{y:[-2,2,-2]}} transition={{duration:2,repeat:Infinity}}>
                                      <Lightbulb className="w-5 h-5 text-[#D4AF37]"/>
                                    </motion.div>
                                    What You'll Learn
                                  </h4>
                                </Reveal>
                                <StaggerContainer className="grid grid-cols-2 gap-3" stagger={0.1} from="scale">
                                  {PROGRAMS.school.robotics.topics.map((t,i)=>{
                                    const TIcon=t.icon;
                                    return (
                                      <motion.div key={i} whileHover={{scale:1.06,boxShadow:"0 8px 24px rgba(212,175,55,0.15)"}}
                                        className="bg-[#FFF4ED] p-3 rounded-lg border border-gray-200 hover:border-[#D4AF37] transition-all">
                                        <Float duration={4+i*.5} delay={i*.3} yRange={5}>
                                          <div className="text-[#E66B26] mb-1"><TIcon className="w-5 h-5"/></div>
                                        </Float>
                                        <div className="text-xs text-[#1A1A1A] font-medium">{t.name}</div>
                                      </motion.div>
                                    );
                                  })}
                                </StaggerContainer>
                              </div>
                            </div>

                            {/* Age Groups */}
                            <Reveal from="bottom" delay={.1}>
                              <h4 className="text-lg font-semibold text-[#1A1A1A] mb-4">Age Groups</h4>
                            </Reveal>
                            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8" stagger={0.1} from="bottom">
                              {PROGRAMS.school.robotics.levels.map((lv,i)=>(
                                <motion.div key={i} whileHover={{y:-6,scale:1.04,boxShadow:"0 14px 36px rgba(212,175,55,0.14)"}}
                                  className="bg-[#FFF4ED] p-4 rounded-lg border border-gray-200 text-center hover:border-[#D4AF37] transition-all cursor-default">
                                  <Float duration={4+i*.5} delay={i*.4} yRange={8}>
                                    <div className="text-3xl mb-2">{lv.emoji}</div>
                                  </Float>
                                  <div className="text-sm font-semibold text-[#1A1A1A]">{lv.name}</div>
                                </motion.div>
                              ))}
                            </StaggerContainer>

                            {/* Stats + CTA */}
                            <Reveal from="bottom" delay={.15}>
                              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-[#FFF4ED] rounded-xl border border-gray-200">
                                <StaggerContainer className="flex gap-6" stagger={0.1} from="left">
                                  {Object.entries(PROGRAMS.school.robotics.stats).map(([k,v])=>(
                                    <div key={k} className="text-center">
                                      <div className="text-xl font-black text-[#D4AF37]">{v}</div>
                                      <div className="text-xs text-[#1A1A1A] capitalize">{k}</div>
                                    </div>
                                  ))}
                                </StaggerContainer>
                                <Link to={PROGRAMS.school.robotics.link}>
                                  <MagBtn className="group relative px-7 py-3.5 bg-gradient-to-r from-[#E66B26] to-[#C5531A] text-white rounded-xl font-semibold flex items-center gap-2 shadow-md overflow-hidden">
                                    <span className="relative z-10">Explore Robotics</span>
                                    <motion.span className="relative z-10" animate={{x:[0,4,0]}} transition={{duration:1.5,repeat:Infinity}}>
                                      <ArrowRight className="w-4 h-4"/>
                                    </motion.span>
                                    <motion.div className="absolute inset-0 bg-[#C5531A] origin-left" initial={{scaleX:0}} whileHover={{scaleX:1}} transition={{duration:.4}}/>
                                  </MagBtn>
                                </Link>
                              </div>
                            </Reveal>
                          </div>
                        </motion.div>
                      </TiltCard>
                    </GlowCard>
                  </Reveal>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      <WaveDivider color="#D4AF37" flip toBg="#fff"/>
    </>
  );
}

/* ══════════════════════════════════════════════
   CTA SECTION
══════════════════════════════════════════════ */
function CTASection() {
  const ref=useRef(null);
  const {scrollYProgress}=useScroll({target:ref,offset:["start end","end start"]});
  const bgY=useTransform(scrollYProgress,[0,1],[-40,40]);

  return (
    <>
      <MarqueeStrip/>
      <section id="prog-cta" ref={ref} className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        <Spotlight color="rgba(230,107,38,0.035)" size={500}/>
        <div className="max-w-6xl mx-auto relative z-10">
          <Reveal from="bottom">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              {/* Parallax BG */}
              <motion.div className="absolute inset-0" style={{y:bgY}}>
                <div className="absolute inset-0 bg-gradient-to-r from-[#E66B26] to-[#C5531A]"/>
              </motion.div>
              <div className="absolute inset-0"><ParticleCanvas count={18} color="rgba(212,175,55,0.09)"/></div>
              <Spotlight color="rgba(212,175,55,0.07)" size={450}/>

              {/* Floating rings */}
              {[80,140,210].map((s,i)=>(
                <Float key={i} duration={6+i*2} yRange={12} delay={i}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full border border-[#D4AF37]/12"
                  style={{width:s,height:s}}/>
              ))}

              <div className="relative z-10 px-8 py-16 text-center">
                <Reveal from="top">
                  <Float duration={4} yRange={10}>
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
                      <GraduationCap className="w-8 h-8 text-white"/>
                    </div>
                  </Float>
                </Reveal>

                <Reveal from="bottom" delay={.1}>
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Begin Your Journey?</h2>
                </Reveal>

                <Reveal from="bottom" delay={.2}>
                  <p className="text-lg text-white/85 mb-10 max-w-2xl mx-auto">
                    Join hundreds of students who have transformed their careers through our programs
                  </p>
                </Reveal>

                <Reveal from="bottom" delay={.32}>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                    <Link to="/Contact">
                      <MagBtn className="group relative px-8 py-3.5 bg-white text-[#E66B26] rounded-xl font-black hover:bg-gray-50 transition-colors shadow-xl overflow-hidden">
                        <span className="relative z-10 flex items-center gap-2">
                          Get Started Today
                          <motion.span animate={{x:[0,4,0]}} transition={{duration:1.5,repeat:Infinity}}><ArrowRight className="w-4 h-4"/></motion.span>
                        </span>
                        <motion.div className="absolute inset-0 bg-[#FFF4ED] origin-left" initial={{scaleX:0}} whileHover={{scaleX:1}} transition={{duration:.4}}/>
                      </MagBtn>
                    </Link>
                    <Link to="/Contact">
                      <motion.button whileHover={{scale:1.04,backgroundColor:"rgba(255,255,255,0.12)"}} whileTap={{scale:.96}}
                        className="px-8 py-3.5 border-2 border-white text-white rounded-xl font-black hover:bg-white hover:text-[#E66B26] transition-colors flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4"/>
                        Schedule a Call
                      </motion.button>
                    </Link>
                  </div>
                </Reveal>

                {/* Trust badges */}
                <Reveal from="bottom" delay={.44}>
                  <StaggerContainer className="flex flex-wrap justify-center gap-6" stagger={0.1} from="bottom">
                    {[{icon:Award,text:"Certified Programs"},{icon:Users,text:"Expert Mentors"},{icon:Star,text:"4.9/5 Rating"}].map((b,i)=>(
                      <motion.div key={i} whileHover={{scale:1.08,y:-3}} className="flex items-center gap-2 text-white/75 cursor-default">
                        <Float duration={4+i} delay={i*.5} yRange={5}>
                          <b.icon className="w-4 h-4"/>
                        </Float>
                        <span className="text-sm font-medium">{b.text}</span>
                      </motion.div>
                    ))}
                  </StaggerContainer>
                </Reveal>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ══════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════ */
function StackenzoPrograms() {
  return (
    <div className="bg-white text-[#1A1A1A] min-h-screen overflow-x-hidden">
      <CustomCursor/>
      <ScrollProgressBar/>
      <SectionNavDots/>
      <Navbar/>

      <HeroSection/>
      <MarqueeStrip/>
      <ProgramsSection/>
      <CTASection/>

      <Footer/>
      <ScrollToTop/>
    </div>
  );
}

export default StackenzoPrograms;