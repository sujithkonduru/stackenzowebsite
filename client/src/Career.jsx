import {
  motion, AnimatePresence, useInView, useScroll, useTransform,
  useSpring, useMotionValue, useVelocity,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  Briefcase, MapPin, Clock, DollarSign, Users, TrendingUp,
  Award, Heart, Rocket, Target, ChevronRight,
  Zap, Coffee, Gift, BookOpen, Globe, ThumbsUp,
  Calendar, CheckCircle, Play, Star, Download, Mail,
  Phone, MessageSquare, ArrowRight, Filter, Search,
  X, Menu, Layers, Code, Palette, BarChart, Headphones,
  Sparkles,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import ResumeModal from "./ResumeModal";

/* ══════════════════════════════════════════════
   EASING
══════════════════════════════════════════════ */
const EASE_EXPO = [0.16, 1, 0.3, 1];
const EASE_BACK = [0.34, 1.56, 0.64, 1];

/* ══════════════════════════════════════════════
   DATA
══════════════════════════════════════════════ */
const NAV_SECTIONS = ["career-hero", "career-values", "career-benefits", "career-openings", "career-team"];
const NAV_LABELS   = ["Hero", "Values", "Benefits", "Openings", "Team"];

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

  const variants = {
    bottom: { hidden:{ y:65, opacity:0, scale:.96, filter:"blur(6px)" }, visible:{ y:0, opacity:1, scale:1, filter:"blur(0px)" }, exit:{ y:-48, opacity:0, scale:.97, filter:"blur(4px)" } },
    top:    { hidden:{ y:-65,opacity:0, scale:.96, filter:"blur(6px)" }, visible:{ y:0, opacity:1, scale:1, filter:"blur(0px)" }, exit:{ y:48,  opacity:0, scale:.97, filter:"blur(4px)" } },
    left:   { hidden:{ x:-75,opacity:0, scale:.96, filter:"blur(6px)" }, visible:{ x:0, opacity:1, scale:1, filter:"blur(0px)" }, exit:{ x:55,  opacity:0, scale:.97, filter:"blur(4px)" } },
    right:  { hidden:{ x:75, opacity:0, scale:.96, filter:"blur(6px)" }, visible:{ x:0, opacity:1, scale:1, filter:"blur(0px)" }, exit:{ x:-55, opacity:0, scale:.97, filter:"blur(4px)" } },
    scale:  { hidden:{ scale:.75, opacity:0, filter:"blur(8px)" },        visible:{ scale:1, opacity:1, filter:"blur(0px)" },       exit:{ scale:.85, opacity:0, filter:"blur(6px)" } },
  };
  const { hidden, visible, exit } = variants[from] || variants.bottom;

  return (
    <motion.div ref={ref} className={className}
      initial="hidden"
      animate={inV ? "visible" : once ? "hidden" : dir === "up" ? "exit" : "hidden"}
      variants={{ hidden, visible, exit }}
      transition={{ duration: 0.75, delay, ease: EASE_EXPO }}>
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

  const base = {
    bottom: { hidden:{ y:55, opacity:0, scale:.95, filter:"blur(5px)" }, visible:{ y:0, opacity:1, scale:1, filter:"blur(0px)" }, exit:{ y:-38, opacity:0, scale:.97, filter:"blur(3px)" } },
    left:   { hidden:{ x:-55,opacity:0 }, visible:{ x:0, opacity:1 }, exit:{ x:38, opacity:0 } },
    right:  { hidden:{ x:55, opacity:0 }, visible:{ x:0, opacity:1 }, exit:{ x:-38,opacity:0 } },
  };
  const { hidden, visible, exit } = base[from] || base.bottom;

  return (
    <motion.div ref={ref} className={className}
      initial="hidden"
      animate={inV ? "visible" : dir === "up" ? "exit" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
        exit:    { transition: { staggerChildren: stagger / 2, staggerDirection: -1 } },
      }}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={{ hidden, visible, exit }} transition={{ duration: 0.7, ease: EASE_EXPO }}>{child}</motion.div>
          ))
        : <motion.div variants={{ hidden, visible, exit }} transition={{ duration: 0.7, ease: EASE_EXPO }}>{children}</motion.div>
      }
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   FLOAT
══════════════════════════════════════════════ */
function Float({ children, className = "", duration = 4, yRange = 14, delay = 0, style }) {
  return (
    <motion.div className={className} style={style}
      animate={{ y: [-yRange / 2, yRange / 2, -yRange / 2] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}>
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   GLOW CARD
══════════════════════════════════════════════ */
function GlowCard({ children, className = "", accent = "#D4AF37" }) {
  const ref  = useRef(null);
  const inV  = useInView(ref, { once: false, margin: "-40px" });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const onMove = e => {
    const r = ref.current?.getBoundingClientRect();
    if (r) setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };
  return (
    <motion.div ref={ref} className={`relative rounded-2xl overflow-hidden ${className}`} onMouseMove={onMove}
      initial={{ opacity:0, y:40, scale:.96 }}
      animate={inV ? { opacity:1, y:0, scale:1 } : { opacity:0, y:40, scale:.96 }}
      transition={{ duration: 0.75, ease: EASE_EXPO }}>
      <div className="absolute pointer-events-none rounded-2xl z-0"
        style={{ inset:-1, background:`radial-gradient(320px circle at ${pos.x}px ${pos.y}px,${accent}30,transparent 60%)`, opacity: inV ? 1 : 0, transition:"opacity .3s" }} />
      <motion.div className="absolute inset-0 rounded-2xl pointer-events-none z-0"
        animate={inV ? { opacity:[.28,.6,.28] } : { opacity:0 }}
        transition={{ duration:2.5, repeat:Infinity, ease:"easeInOut" }}
        style={{ boxShadow:`inset 0 0 0 1px ${accent}38` }} />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════════════ */
function CustomCursor() {
  const outer = useRef(null), dot = useRef(null), trail = useRef(null);
  const pos = useRef({ x:-300, y:-300 }), sm = useRef({ x:-300, y:-300 });
  const [hov, setHov] = useState(false), [clk, setClk] = useState(false);
  useEffect(() => {
    const mv = e => { pos.current = { x:e.clientX, y:e.clientY }; };
    const md = () => setClk(true), mu = () => setClk(false);
    document.addEventListener("mousemove", mv);
    document.addEventListener("mousedown", md);
    document.addEventListener("mouseup", mu);
    const att = () => {
      document.querySelectorAll("a,button,[data-hover]").forEach(el => {
        el.addEventListener("mouseenter", () => setHov(true));
        el.addEventListener("mouseleave", () => setHov(false));
      });
    };
    att();
    const ob = new MutationObserver(att);
    ob.observe(document.body, { childList:true, subtree:true });
    let id;
    const loop = () => {
      sm.current.x += (pos.current.x - sm.current.x) * .09;
      sm.current.y += (pos.current.y - sm.current.y) * .09;
      const s = clk ? .65 : hov ? 2.1 : 1;
      if (outer.current) outer.current.style.transform = `translate(${sm.current.x-20}px,${sm.current.y-20}px) scale(${s})`;
      if (dot.current)   dot.current.style.transform   = `translate(${pos.current.x-3}px,${pos.current.y-3}px) scale(${clk?1.9:1})`;
      if (trail.current) trail.current.style.transform = `translate(${sm.current.x-30}px,${sm.current.y-30}px) scale(${hov?1.6:.5})`;
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => {
      document.removeEventListener("mousemove", mv);
      document.removeEventListener("mousedown", md);
      document.removeEventListener("mouseup", mu);
      ob.disconnect();
      cancelAnimationFrame(id);
    };
  }, [hov, clk]);
  return (
    <>
      <div ref={outer} className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9998] transition-[border-color,background] duration-150"
        style={{ border: hov?"1.5px solid #D4AF37":"1.5px solid rgba(230,107,38,0.45)", background: hov?"rgba(212,175,55,0.07)":"transparent", willChange:"transform" }} />
      <div ref={dot} className="fixed top-0 left-0 w-[6px] h-[6px] rounded-full pointer-events-none z-[9999] transition-colors duration-100"
        style={{ background: hov?"#D4AF37":"#E66B26", willChange:"transform" }} />
      <div ref={trail} className="fixed top-0 left-0 w-[60px] h-[60px] rounded-full pointer-events-none z-[9996] opacity-[.09]"
        style={{ background:"radial-gradient(circle,#D4AF37,transparent)", willChange:"transform" }} />
    </>
  );
}

/* ══════════════════════════════════════════════
   SCROLL PROGRESS BAR
══════════════════════════════════════════════ */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness:120, damping:30 });
  return (
    <motion.div className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[9997]"
      style={{ scaleX, background:"linear-gradient(90deg,#3D1A0A,#E66B26,#D4AF37,#C5531A,#D4AF37)" }} />
  );
}

/* ══════════════════════════════════════════════
   SECTION NAV DOTS
══════════════════════════════════════════════ */
function SectionNavDots() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { const i = NAV_SECTIONS.indexOf(e.target.id); if (i !== -1) setActive(i); } }),
      { threshold: 0.4 }
    );
    NAV_SECTIONS.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);
  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-[900] flex-col gap-4 hidden md:flex">
      {NAV_SECTIONS.map((id, i) => (
        <motion.button key={i} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" })}
          className="relative flex items-center gap-2 group" title={NAV_LABELS[i]}>
          <motion.span initial={{ opacity:0, x:8 }} animate={{ opacity:active===i?1:0, x:active===i?0:8 }}
            className="absolute right-6 text-[11px] font-bold text-[#D4AF37] bg-[#0f0f0f]/80 backdrop-blur-sm px-2 py-1 rounded-md whitespace-nowrap pointer-events-none">
          </motion.span>
          <motion.div animate={{ scale:active===i?1.4:1, background:active===i?"#D4AF37":"rgba(230,107,38,0.4)" }}
            transition={{ type:"spring", stiffness:300, damping:22 }} className="w-2.5 h-2.5 rounded-full" />
          {active === i && (
            <motion.div layoutId="career-nav-pulse" className="absolute inset-0 rounded-full"
              style={{ scale:2, border:"1.5px solid #D4AF37", opacity:.5 }}
              animate={{ scale:[2,2.8,2], opacity:[.5,0,.5] }} transition={{ duration:1.8, repeat:Infinity }} />
          )}
        </motion.button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   NOISE CANVAS
══════════════════════════════════════════════ */
function NoiseCanvas({ color1="#FFD5B8", color2="#FFF4ED", opacity=0.4 }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let t=0, id;
    const draw = () => {
      const w = c.width = c.offsetWidth, h = c.height = c.offsetHeight;
      const g = ctx.createRadialGradient(w*(.3+.22*Math.sin(t*.38)),h*(.3+.16*Math.cos(t*.28)),0,w*.5,h*.5,Math.max(w,h)*.88);
      g.addColorStop(0, color1+"cc"); g.addColorStop(.5, color2+"88"); g.addColorStop(1,"transparent");
      ctx.clearRect(0,0,w,h); ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
      t+=.007; id=requestAnimationFrame(draw);
    };
    draw(); return () => cancelAnimationFrame(id);
  }, [color1, color2]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }} />;
}

/* ══════════════════════════════════════════════
   PARTICLE CANVAS
══════════════════════════════════════════════ */
function ParticleCanvas({ count=28, color="rgba(230,107,38,0.10)" }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let w=c.width=c.offsetWidth, h=c.height=c.offsetHeight;
    const pts = Array.from({length:count}, ()=>({ x:Math.random()*w, y:Math.random()*h, vx:(Math.random()-.5)*.38, vy:(Math.random()-.5)*.38, r:Math.random()*1.8+.8 }));
    let id;
    const draw = () => {
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
    return ()=>{ cancelAnimationFrame(id); window.removeEventListener("resize",rz); };
  }, [count, color]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ══════════════════════════════════════════════
   SPOTLIGHT
══════════════════════════════════════════════ */
function Spotlight({ color="rgba(212,175,55,0.07)", size=600 }) {
  const ref = useRef(null);
  useEffect(() => {
    const fn = e => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      ref.current.style.background = `radial-gradient(${size}px circle at ${e.clientX-r.left}px ${e.clientY-r.top}px,${color},transparent 70%)`;
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, [color, size]);
  return <div ref={ref} className="absolute inset-0 pointer-events-none z-[1]" />;
}

/* ══════════════════════════════════════════════
   WAVE DIVIDER
══════════════════════════════════════════════ */
function WaveDivider({ color="#D4AF37", flip=false, toBg="#fff" }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once:true, margin:"-10px" });
  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${flip?"rotate-180":""}`} style={{ height:56 }}>
      <svg viewBox="0 0 1440 56" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <motion.path d="M0,28 C240,0 480,56 720,28 C960,0 1200,56 1440,28 L1440,56 L0,56 Z"
          fill={toBg} initial={{ pathLength:0 }} animate={inV?{pathLength:1}:{}} transition={{ duration:1.2, ease:EASE_EXPO }} />
        <motion.path d="M0,28 C240,0 480,56 720,28 C960,0 1200,56 1440,28"
          stroke={color} strokeWidth="1.5" fill="none"
          initial={{ pathLength:0, opacity:0 }} animate={inV?{pathLength:1,opacity:1}:{}} transition={{ duration:1.4, ease:EASE_EXPO, delay:.15 }} />
        <motion.path d="M0,36 C240,8 480,64 720,36 C960,8 1200,64 1440,36"
          stroke={color} strokeWidth=".6" fill="none" opacity=".4"
          initial={{ pathLength:0 }} animate={inV?{pathLength:1}:{}} transition={{ duration:1.4, ease:EASE_EXPO, delay:.3 }} />
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════
   3-D TILT CARD
══════════════════════════════════════════════ */
function TiltCard({ children, className="", intensity=12 }) {
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
function MagBtn({ children, className="", onClick }) {
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
  const num = parseInt(value.replace(/\D/g,""), 10);
  const sfx = value.replace(/[0-9]/g,"");
  const mv  = useMotionValue(0);
  const sp  = useSpring(mv,{stiffness:55,damping:14});
  const [d, setD] = useState(0);
  useEffect(() => { mv.set(inV ? num : 0); }, [inV]);
  useEffect(() => sp.on("change", v => setD(Math.round(v))), [sp]);
  return <span ref={ref}>{d}{sfx}</span>;
}

/* ══════════════════════════════════════════════
   SECTION LABEL
══════════════════════════════════════════════ */
function SLabel({ text }) {
  return (
    <Reveal from="top" className="flex items-center gap-3 justify-center mb-3">
      <motion.div initial={{scaleX:0}} whileInView={{scaleX:1}} viewport={{once:false}} transition={{duration:.55}} className="h-px w-8 bg-[#D4AF37] origin-left" />
      <span className="font-bold tracking-[.2em] text-[11px] uppercase text-[#D4AF37]">{text}</span>
      <motion.div initial={{scaleX:0}} whileInView={{scaleX:1}} viewport={{once:false}} transition={{duration:.55}} className="h-px w-8 bg-[#D4AF37] origin-right" />
    </Reveal>
  );
}

/* ══════════════════════════════════════════════
   WORD-BY-WORD HEADING
══════════════════════════════════════════════ */
function AHeading({ children, className="", delay=0 }) {
  const ref  = useRef(null);
  const inV  = useInView(ref,{once:false,margin:"-50px"});
  const dir  = useScrollDir();
  const words = typeof children === "string" ? children.split(" ") : [children];
  return (
    <h2 ref={ref} className={className}>
      {words.map((w,i) => (
        <span key={i} className="inline-block overflow-hidden mr-[.28em]">
          <motion.span className="inline-block"
            initial={{ y:"110%", opacity:0, skewY:5 }}
            animate={inV ? {y:0,opacity:1,skewY:0} : dir==="up" ? {y:"-110%",opacity:0,skewY:-5} : {y:"110%",opacity:0,skewY:5}}
            transition={{ duration:.72, delay:delay+i*.075, ease:EASE_EXPO }}>
            {w}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}

/* ══════════════════════════════════════════════
   HERO SECTION
══════════════════════════════════════════════ */
function HeroSection({ jobCount, onScrollToOpenings }) {
  const secRef = useRef(null);
  const { scrollYProgress } = useScroll({ target:secRef, offset:["start start","end start"] });
  const hY   = useTransform(scrollYProgress,[0,1],[0,-110]);
  const hO   = useTransform(scrollYProgress,[0,.6],[1,0]);
  const hS   = useTransform(scrollYProgress,[0,1],[1,.84]);
  const bigY = useTransform(scrollYProgress,[0,1],[0,180]);
  const imgS = useTransform(scrollYProgress,[0,1],[1,1.14]);

  const mx=useMotionValue(0), my=useMotionValue(0);
  const smx=useSpring(mx,{stiffness:35,damping:18}), smy=useSpring(my,{stiffness:35,damping:18});
  const b1x=useTransform(smx,[-1,1],[-28,28]), b1y=useTransform(smy,[-1,1],[-16,16]);
  const b2x=useTransform(smx,[-1,1],[20,-20]),  b2y=useTransform(smy,[-1,1],[14,-14]);
  useEffect(()=>{ const fn=e=>{mx.set((e.clientX/window.innerWidth-.5)*2); my.set((e.clientY/window.innerHeight-.5)*2);}; window.addEventListener("mousemove",fn); return()=>window.removeEventListener("mousemove",fn); },[]);

  return (
    <section id="career-hero" ref={secRef} className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden min-h-screen flex items-center">
      <motion.div className="absolute inset-0 z-0" style={{ scale:imgS }}>
        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Team collaboration" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#E66B26]/40 via-transparent to-[#E66B26]/40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(255,255,255,0.7)_100%)]" />
      </motion.div>

      <div className="absolute inset-0 z-[1]"><ParticleCanvas count={22} color="rgba(230,107,38,0.08)" /></div>
      <NoiseCanvas color1="#FFD5B8" color2="#FFF0E6" opacity={0.28} />

      <motion.div style={{ y:bigY }} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-[2]">
        <span className="text-[22vw] font-black leading-none tracking-tighter uppercase whitespace-nowrap"
          style={{ color:"rgba(230,107,38,0.018)" }}>CAREERS</span>
      </motion.div>

      <motion.div style={{x:b1x,y:b1y}} className="absolute top-10 left-[4%] w-[380px] h-[380px] pointer-events-none z-[2]">
        <div className="w-full h-full rounded-full blur-[110px] opacity-[.35]" style={{ background:"radial-gradient(circle,#FFD5B8,transparent)" }} />
      </motion.div>
      <motion.div style={{x:b2x,y:b2y}} className="absolute bottom-10 right-[4%] w-[460px] h-[460px] pointer-events-none z-[2]">
        <div className="w-full h-full rounded-full blur-[120px] opacity-[.2]" style={{ background:"radial-gradient(circle,#D4AF37,transparent)" }} />
      </motion.div>

      <Float className="absolute top-1/4 left-[8%] w-3 h-3 rounded-full bg-[#D4AF37]/30 z-[2]" duration={5} delay={0} />
      <Float className="absolute top-1/3 right-[10%] w-2 h-2 rounded-full bg-[#E66B26]/25 z-[2]" duration={4} delay={1} />
      <Float className="absolute bottom-1/4 left-[15%] w-4 h-4 rounded-full bg-[#C5531A]/20 z-[2]" duration={6} delay={2} />
      <Float className="absolute bottom-1/3 right-[18%] w-2.5 h-2.5 rounded-full bg-[#D4AF37]/25 z-[2]" duration={5.5} delay={.5} />

      <motion.div className="absolute inset-0 z-[2] opacity-30"
        animate={{ background:["radial-gradient(circle at 20% 30%,rgba(230,107,38,0.15) 0%,transparent 40%)","radial-gradient(circle at 80% 70%,rgba(230,107,38,0.15) 0%,transparent 40%)","radial-gradient(circle at 20% 30%,rgba(230,107,38,0.15) 0%,transparent 40%)"] }}
        transition={{ duration:10, repeat:Infinity, ease:"linear" }} />

      <motion.div style={{y:hY,opacity:hO,scale:hS}} className="max-w-6xl mx-auto text-center relative z-10">

        <motion.div initial={{scale:.7,opacity:0,y:20}} animate={{scale:1,opacity:1,y:0}} transition={{duration:.65,ease:EASE_BACK}}
          className="inline-block mb-8">
          <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E66B26]/20 to-[#C5531A]/20 text-[#E66B26] rounded-full text-sm font-semibold border border-[#E66B26]/30 backdrop-blur-sm shadow-lg shadow-[#E66B26]/10">
            <motion.span animate={{opacity:[.7,1,.7]}} transition={{duration:2,repeat:Infinity}} className="text-[#D4AF37]">✦</motion.span>
            Join Our Mission — Shape the Future with Stackenzo
            <motion.span animate={{opacity:[.7,1,.7]}} transition={{duration:2,repeat:Infinity}} className="text-[#D4AF37]">✦</motion.span>
          </span>
        </motion.div>

        <motion.h1 initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:.3,duration:.75,ease:EASE_EXPO}}
          className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] via-[#C5531A] to-[#E66B26]">Shape the Future</span>
          <br />
          <span className="text-[#1A1A1A]">with Stackenzo</span>
        </motion.h1>

        <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.5,ease:EASE_EXPO}}
          className="text-xl sm:text-2xl text-[#1A1A1A] max-w-4xl mx-auto leading-relaxed backdrop-blur-sm bg-white/20 p-6 rounded-2xl border border-gray-200 mb-10">
          Join a team of innovators, builders, and problem-solvers passionate about creating technology that makes a real difference.
        </motion.p>

        <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{delay:.7,ease:EASE_EXPO}}
          className="flex flex-wrap justify-center gap-6 mt-4">
          {[
            {label:"Open Positions", value: jobCount > 0 ? `${jobCount}+` : "0", icon:"💼"},
            {label:"Team Members",   value:"50+",  icon:"👥"},
            {label:"Countries",      value:"5+",   icon:"🌍"},
          ].map((s,i)=>(
            <Float key={i} duration={4+i*.5} delay={i*.3}>
              <motion.div whileHover={{scale:1.07,y:-5,boxShadow:"0 14px 32px rgba(0,0,0,0.08)"}}
                className="bg-white/85 backdrop-blur-md border border-gray-200 rounded-xl px-6 py-4 min-w-[160px] text-center shadow-sm cursor-default">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-2xl font-black text-[#E66B26]">{s.value}</div>
                <div className="text-sm text-[#1A1A1A] font-medium">{s.label}</div>
              </motion.div>
            </Float>
          ))}
        </motion.div>

        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.9,ease:EASE_EXPO}}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <MagBtn onClick={onScrollToOpenings}
            className="group px-8 py-4 bg-gradient-to-r from-[#E66B26] to-[#C5531A] text-white rounded-full font-semibold shadow-lg shadow-[#E66B26]/25 hover:shadow-xl hover:shadow-[#E66B26]/35 transition-shadow flex items-center gap-2">
            View Open Positions
            <motion.div animate={{x:[0,4,0]}} transition={{duration:1.5,repeat:Infinity}}>
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </MagBtn>
          <Link to="/about">
            <motion.button whileHover={{scale:1.05,backgroundColor:"rgba(230,107,38,0.07)"}} whileTap={{scale:.96}}
              className="group px-8 py-4 border-2 border-[#E66B26] text-[#E66B26] rounded-full font-semibold flex items-center gap-2 transition-all">
              <Play className="w-5 h-5" />
              Watch Our Story
            </motion.button>
          </Link>
        </motion.div>

        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.8}}
          className="flex justify-center mt-12 cursor-pointer"
          onClick={()=>document.getElementById("career-values")?.scrollIntoView({behavior:"smooth"})}>
          <Float duration={2} yRange={10}>
            <div className="w-5 h-8 border-2 border-[#E66B26]/28 rounded-full flex justify-center">
              <motion.div className="w-1 h-2 bg-[#D4AF37] rounded-full mt-2"
                animate={{y:[0,10,0],opacity:[1,.4,1]}} transition={{duration:1.8,repeat:Infinity}} />
            </div>
          </Float>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   VALUES SECTION
══════════════════════════════════════════════ */
const VALUES_DATA = [
 { icon: Heart,  title: "Integrity",      desc: "We maintain the highest standards of integrity and transparency in all our operations.",                         color: "from-red-400 to-pink-400"       },
 { icon: Award,  title: "Excellence",     desc: "We strive for excellence in everything we do, from curriculum design to learner success and support.",            color: "from-yellow-400 to-orange-400"  },
 { icon: Zap,    title: "Innovation",     desc: "We continuously innovate our teaching methods and programs to stay ahead of industry trends.",                   color: "from-[#E66B26] to-[#C5531A]"   },
 { icon: Users,  title: "Collaboration",  desc: "We believe in strong collaboration between students, educators, and industry to drive innovation.",                color: "from-blue-400 to-purple-400"    },
 { icon: Globe,  title: "Accessibility",  desc: "We make quality education accessible to students from all backgrounds and locations.",                            color: "from-orange-400 to-red-400"     },
 { icon: Target, title: "Impact",         desc: "We focus on creating meaningful impact in the lives of our students and the community.",                          color: "from-purple-400 to-indigo-400"  },
];

function ValuesSection() {
  return (
    <>
      <WaveDivider color="#D4AF37" toBg="#FFF4ED" />
      <section id="career-values" className="py-24 px-4 sm:px-6 relative overflow-hidden" style={{background:"#FFF4ED"}}>
        <NoiseCanvas color1="#FFD5B8" color2="#FFCBA4" opacity={0.22} />
        {[{l:"5%",t:"10%",s:120},{l:"85%",t:"60%",s:90},{l:"50%",t:"80%",s:70}].map((o,i)=>(
          <Float key={i} duration={6+i} yRange={18} delay={i} className="absolute pointer-events-none"
            style={{left:o.l,top:o.t}}>
            <div className="rounded-full bg-[#E66B26]/[0.04]" style={{width:o.s,height:o.s}} />
          </Float>
        ))}

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <motion.span className="text-[16vw] font-black leading-none tracking-tighter uppercase text-[#E66B26]/[0.02]"
            animate={{y:[0,-12,0]}} transition={{duration:10,repeat:Infinity,ease:"easeInOut"}}>VALUES</motion.span>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <SLabel text="Who We Are" />
            <AHeading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
              Our Values
            </AHeading>
            <Reveal from="bottom" delay={.25}>
              <p className="text-xl text-[#1A1A1A] max-w-3xl mx-auto mt-4">The principles that guide everything we do at Stackenzo</p>
            </Reveal>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.1} from="bottom">
            {VALUES_DATA.map((v, i) => (
              <GlowCard key={i} accent="#D4AF37">
                <TiltCard>
                  <motion.div whileHover={{y:-10,scale:1.02,boxShadow:"0 28px 65px rgba(0,0,0,0.10)"}}
                    className="group relative bg-white p-8 rounded-2xl border border-gray-200 text-center overflow-hidden h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#E66B26]/5 to-[#C5531A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Float duration={4+i*.4} delay={i*.3}>
                      <div className="w-16 h-16 rounded-full bg-[#FFF4ED] border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-4">
                        <v.icon className="w-8 h-8 text-[#E66B26]" />
                      </div>
                    </Float>
                    <h3 className="text-xl font-bold mb-3 text-[#1A1A1A] group-hover:text-[#E66B26] transition-colors">{v.title}</h3>
                    <p className="text-sm text-[#1A1A1A]">{v.desc}</p>
                    <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] to-[#C5531A]"
                      initial={{scaleX:0}} whileHover={{scaleX:1}} transition={{duration:.3}} />
                  </motion.div>
                </TiltCard>
              </GlowCard>
            ))}
          </StaggerContainer>
        </div>
      </section>
      <WaveDivider color="#D4AF37" flip toBg="#fff" />
    </>
  );
}

/* ══════════════════════════════════════════════
   BENEFITS SECTION
══════════════════════════════════════════════ */
const BENEFITS_DATA = [
  { icon: Users,      title: "Great Culture",         desc: "Inclusive environment and memorable team events.",      gradient: "from-blue-500 to-cyan-500"       },

  { icon: Coffee,     title: "Work-Life Balance",     desc: "Flexible hours and remote work options available.",     gradient: "from-amber-500 to-orange-500"    },

  { icon: Heart,      title: "Health & Wellness",     desc: "Comprehensive medical coverage.",                      gradient: "from-rose-500 to-pink-500"       },

  { icon: TrendingUp, title: "Growth & Development",  desc: "Learning stipends and clear career advancement paths.", gradient: "from-emerald-500 to-teal-500"    },

  { icon: Gift,       title: "Perks & Benefits",      desc: "Competitive salary and bonus structure.",              gradient: "from-purple-500 to-indigo-500"   },

  { icon: Zap,        title: "Innovation Time",       desc: "20% time dedicated to passion projects and R&D.",      gradient: "from-[#E66B26] to-[#C5531A]"    },
];

function BenefitsSection() {
  return (
    <section id="career-benefits" className="py-24 px-4 sm:px-6 bg-white relative overflow-hidden">
      <Spotlight color="rgba(230,107,38,0.05)" size={550} />
      <div className="absolute inset-0 opacity-[.03]" style={{backgroundImage:"radial-gradient(circle,#E66B26 1px,transparent 1px)",backgroundSize:"28px 28px"}} />
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#E66B26] rounded-full filter blur-3xl opacity-[.06]" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#C5531A] rounded-full filter blur-3xl opacity-[.06]" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.span className="text-[14vw] font-black leading-none tracking-tighter uppercase text-[#E66B26]/[0.018]"
          animate={{y:[0,-10,0]}} transition={{duration:9,repeat:Infinity,ease:"easeInOut"}}>
          BENEFITS
        </motion.span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SLabel text="Why Join Us" />
          <AHeading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
            Benefits & Perks
          </AHeading>
          <Reveal from="bottom" delay={.25}>
            <p className="text-xl text-[#1A1A1A] max-w-3xl mx-auto mt-4">We take care of our team so they can focus on doing their best work</p>
          </Reveal>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.1} from="bottom">
          {BENEFITS_DATA.map((b, i) => (
            <GlowCard key={i} accent="#E66B26">
              <TiltCard>
                <motion.div whileHover={{y:-8,scale:1.02,boxShadow:"0 24px 55px rgba(0,0,0,0.10)"}}
                  className="group relative bg-white p-6 rounded-2xl border border-gray-200 hover:border-[#D4AF37] transition-all overflow-hidden h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${b.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className="relative z-10 flex items-start gap-4">
                    <Float duration={4+i*.5} delay={i*.3}>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${b.gradient} p-0.5 flex-shrink-0`}>
                        <div className="w-full h-full rounded-xl bg-white flex items-center justify-center">
                          <b.icon className="w-6 h-6 text-[#1A1A1A]" />
                        </div>
                      </div>
                    </Float>
                    <div>
                      <h3 className="text-lg font-bold text-[#1A1A1A] mb-1 group-hover:text-[#E66B26] transition-colors">{b.title}</h3>
                      <p className="text-sm text-[#1A1A1A]">{b.desc}</p>
                    </div>
                  </div>
                  <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] to-[#C5531A]"
                    initial={{scaleX:0}} whileHover={{scaleX:1}} transition={{duration:.3}} />
                </motion.div>
              </TiltCard>
            </GlowCard>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   JOB OPENINGS SECTION
══════════════════════════════════════════════ */
function OpeningsSection({ jobOpenings, loading, onApply }) {
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [searchTerm, setSearchTerm]       = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedType, setSelectedType]   = useState("All");
  const [showFilters, setShowFilters]     = useState(false);

  const departments = ["All", ...new Set(jobOpenings.map(j => j.department))];
  const locations   = ["All", ...new Set(jobOpenings.map(j => j.location))];
  const types       = ["All", ...new Set(jobOpenings.map(j => j.type))];

  const filtered = jobOpenings.filter(job => {
    const okDept = selectedDepartment === "All" || job.department === selectedDepartment;
    const okLoc  = selectedLocation   === "All" || job.location   === selectedLocation;
    const okType = selectedType       === "All" || job.type       === selectedType;
    const okSrch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   job.description.toLowerCase().includes(searchTerm.toLowerCase());
    return okDept && okLoc && okType && okSrch;
  });

  if (!loading && jobOpenings.length === 0) return null;

  return (
    <>
      <WaveDivider color="#D4AF37" toBg="#FFF4ED" />
      <section id="career-openings" className="scroll-mt-20 py-24 px-4 sm:px-6 relative overflow-hidden" style={{background:"#FFF4ED"}}>
        <NoiseCanvas color1="#FFD5B8" color2="#FFCBA4" opacity={0.22} />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <motion.span className="text-[14vw] font-black leading-none tracking-tighter uppercase text-[#E66B26]/[0.02]"
            animate={{y:[0,-12,0]}} transition={{duration:11,repeat:Infinity,ease:"easeInOut"}}>OPENINGS</motion.span>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <SLabel text="Join Us" />
            <AHeading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
              Open Positions
            </AHeading>
            <Reveal from="bottom" delay={.2}>
              <p className="text-xl text-[#1A1A1A] max-w-3xl mx-auto mt-4">Find your perfect role and join us in shaping the future</p>
            </Reveal>
          </div>

          <Reveal from="bottom" delay={.15} className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]" />
                <input type="text" placeholder="Search positions…" value={searchTerm}
                  onChange={e=>setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-[#1A1A1A] placeholder-[#1A1A1A]/60 focus:border-[#E66B26] focus:outline-none shadow-sm transition-colors" />
              </div>
              <button onClick={()=>setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-[#1A1A1A] shadow-sm">
                <Filter className="w-5 h-5" />Filters {showFilters?<X className="w-4 h-4"/>:<Menu className="w-4 h-4"/>}
              </button>
              <div className="hidden lg:flex gap-4">
                {[{label:"Department",val:selectedDepartment,set:setSelectedDepartment,opts:departments},
                  {label:"Location",  val:selectedLocation,  set:setSelectedLocation,  opts:locations},
                  {label:"Type",      val:selectedType,      set:setSelectedType,      opts:types}].map(f=>(
                  <div key={f.label} className="flex flex-col">
                    <label className="text-sm text-[#1A1A1A] mb-1">{f.label}</label>
                    <select value={f.val} onChange={e=>f.set(e.target.value)}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#1A1A1A] focus:border-[#E66B26] focus:outline-none shadow-sm">
                      {f.opts.map(o=><option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
                  className="lg:hidden mt-4 space-y-3">
                  {[{label:"Department",val:selectedDepartment,set:setSelectedDepartment,opts:departments},
                    {label:"Location",  val:selectedLocation,  set:setSelectedLocation,  opts:locations},
                    {label:"Type",      val:selectedType,      set:setSelectedType,      opts:types}].map(f=>(
                    <div key={f.label}>
                      <label className="block text-sm text-[#1A1A1A] mb-1">{f.label}</label>
                      <select value={f.val} onChange={e=>f.set(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#1A1A1A]">
                        {f.opts.map(o=><option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </Reveal>

          <Reveal from="bottom" delay={.1}>
            <p className="mb-6 text-sm text-[#1A1A1A]">
              Showing <span className="font-bold text-[#E66B26]">{filtered.length}</span> {filtered.length===1?"position":"positions"}
            </p>
          </Reveal>

          <StaggerContainer className="grid md:grid-cols-2 gap-6" stagger={0.08} from="bottom">
            {filtered.map((job, i) => (
              <GlowCard key={i} accent="#D4AF37">
                <TiltCard intensity={6}>
                  <motion.div whileHover={{y:-6,boxShadow:"0 24px 55px rgba(0,0,0,0.10)"}}
                    className="group relative bg-white p-6 rounded-2xl border border-gray-200 hover:border-[#D4AF37] transition-all h-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#E66B26]/5 to-[#C5531A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-[#1A1A1A] mb-2 group-hover:text-[#E66B26] transition-colors">{job.title}</h3>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-[#FFF4ED] text-[#E66B26] rounded-full text-xs border border-[#D4AF37]/30">{job.department}</span>
                            <span className="px-3 py-1 bg-[#FFF4ED] text-[#E66B26] rounded-full text-xs border border-[#D4AF37]/30">{job.type}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[#1A1A1A] text-sm mb-4 line-clamp-2">{job.description}</p>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center text-sm text-[#1A1A1A]"><MapPin className="w-4 h-4 mr-2 text-[#D4AF37]" />{job.location}</div>
                        <div className="flex items-center text-sm text-[#1A1A1A]"><Clock className="w-4 h-4 mr-2 text-[#D4AF37]" />{job.experience}</div>
                        <div className="flex items-center text-sm text-[#1A1A1A] col-span-2"><DollarSign className="w-4 h-4 mr-2 text-[#D4AF37]" />{job.salary}</div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.requirements.slice(0,4).map((r,j)=>(
                          <span key={j} className="px-2 py-1 bg-[#FFF4ED] rounded text-xs text-[#1A1A1A] border border-gray-200">{r}</span>
                        ))}
                        {job.requirements.length > 4 && (
                          <span className="px-2 py-1 bg-[#FFF4ED] rounded text-xs text-[#1A1A1A] border border-gray-200">+{job.requirements.length-4}</span>
                        )}
                      </div>
                      <motion.button onClick={()=>onApply(job.title)} whileHover={{scale:1.02}} whileTap={{scale:.98}}
                        className="w-full py-3 bg-gradient-to-r from-[#E66B26] to-[#C5531A] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#E66B26]/25 transition-all flex items-center justify-center gap-2 group/btn">
                        Apply Now
                        <motion.div animate={{x:[0,4,0]}} transition={{duration:1.5,repeat:Infinity}}>
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      </motion.button>
                    </div>
                  </motion.div>
                </TiltCard>
              </GlowCard>
            ))}
          </StaggerContainer>

          {filtered.length === 0 && (
            <Reveal from="scale" className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">No positions found</h3>
              <p className="text-[#1A1A1A]">Try adjusting your filters or check back later</p>
            </Reveal>
          )}
        </div>
      </section>
      <WaveDivider color="#D4AF37" flip toBg="#fff" />
    </>
  );
}

/* ══════════════════════════════════════════════
   NO OPENINGS FALLBACK
══════════════════════════════════════════════ */
function NoOpeningsSection({ onSendResume }) {
  return (
    <>
      <WaveDivider color="#D4AF37" toBg="#FFF4ED" />
      <section id="career-openings" className="py-24 px-4 sm:px-6 relative overflow-hidden" style={{background:"#FFF4ED"}}>
        <NoiseCanvas color1="#FFD5B8" color2="#FFCBA4" opacity={0.22} />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <Reveal from="scale">
            <GlowCard accent="#D4AF37">
              <TiltCard intensity={5}>
                <div className="bg-white p-12 rounded-3xl border border-gray-200 shadow-xl">
                  <motion.div animate={{rotate:[0,10,-10,0],scale:[1,1.1,1]}} transition={{duration:3,repeat:Infinity}}>
                    <Sparkles className="w-16 h-16 text-[#D4AF37] mx-auto mb-6" />
                  </motion.div>
                  <AHeading className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
                    No Openings Available
                  </AHeading>
                  <Reveal from="bottom" delay={.15}>
                    <p className="text-[#1A1A1A] mb-8 max-w-2xl mx-auto">
                      We're not hiring right now, but we're always interested in connecting with talented individuals.
                      Send us your resume and we'll keep you in mind for future opportunities.
                    </p>
                  </Reveal>
                  <Reveal from="bottom" delay={.25}>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <MagBtn onClick={onSendResume}
                        className="px-8 py-3 bg-gradient-to-r from-[#E66B26] to-[#C5531A] text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow">
                        <Download className="w-5 h-5" /> Send Your Resume
                      </MagBtn>
                      <Link to="/contact">
                        <motion.button whileHover={{scale:1.05}} whileTap={{scale:.95}}
                          className="px-8 py-3 border border-gray-300 text-[#1A1A1A] rounded-xl font-semibold hover:border-[#E66B26] hover:text-[#E66B26] transition-all">
                          Contact Us
                        </motion.button>
                      </Link>
                    </div>
                  </Reveal>
                </div>
              </TiltCard>
            </GlowCard>
          </Reveal>
        </div>
      </section>
      <WaveDivider color="#D4AF37" flip toBg="#fff" />
    </>
  );
}

/* ══════════════════════════════════════════════
   TESTIMONIALS SECTION
══════════════════════════════════════════════ */
const TESTIMONIALS = [
  { name:"Sujith Kumar", role:"Senior Developer",  icon:Code,   quote:"Stackenzo has given me the opportunity to work on cutting-edge technology while maintaining great work-life balance." },
  { name:"Harsha",       role:"Marketing Lead",    icon:Target, quote:"The collaborative culture and focus on innovation makes every day exciting and deeply rewarding." },
  { name:"Charan",       role:"AI & ML Engineer",  icon:Palette,quote:"I've grown tremendously here, surrounded by talented people who push me to be better every single day." },
];

function TeamSection() {
  return (
    <section id="career-team" className="py-24 px-4 sm:px-6 bg-white relative overflow-hidden">
      <Spotlight color="rgba(230,107,38,0.045)" size={500} />
      <div className="absolute inset-0 opacity-[.03]" style={{backgroundImage:"radial-gradient(circle,#E66B26 1px,transparent 1px)",backgroundSize:"28px 28px"}} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SLabel text="Our People" />
          <AHeading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
            What Our Team Says
          </AHeading>
          <Reveal from="bottom" delay={.2}>
            <p className="text-xl text-[#1A1A1A] max-w-3xl mx-auto mt-4">Hear from the people who make Stackenzo great</p>
          </Reveal>
        </div>

        <StaggerContainer className="grid md:grid-cols-3 gap-6" stagger={0.1} from="bottom">
          {TESTIMONIALS.map((t, i) => (
            <GlowCard key={i} accent="#D4AF37">
              <TiltCard intensity={8}>
                <motion.div whileHover={{y:-8,boxShadow:"0 24px 55px rgba(0,0,0,0.10)"}}
                  className="group relative bg-white p-6 rounded-2xl border border-gray-200 h-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#E66B26]/5 to-[#C5531A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <Float duration={4+i*.5} delay={i*.3}>
                        <div className="w-12 h-12 rounded-full bg-[#FFF4ED] border border-[#D4AF37]/30 flex items-center justify-center">
                          <t.icon className="w-6 h-6 text-[#E66B26]" />
                        </div>
                      </Float>
                      <div>
                        <h4 className="font-bold text-[#1A1A1A] group-hover:text-[#E66B26] transition-colors">{t.name}</h4>
                        <p className="text-sm text-[#E66B26]">{t.role}</p>
                      </div>
                    </div>
                    <p className="text-[#1A1A1A] text-sm italic">"{t.quote}"</p>
                    <div className="mt-4 flex text-[#D4AF37]">
                      {[...Array(5)].map((_,j)=>(
                        <motion.div key={j} animate={{scale:[1,1.3,1]}} transition={{duration:2,repeat:Infinity,delay:j*.15}}>
                          <Star className="w-4 h-4 fill-[#D4AF37]" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </TiltCard>
            </GlowCard>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   CTA SECTION
══════════════════════════════════════════════ */
function CTASection({ hasOpenings, onBrowse, onSendResume }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target:ref, offset:["start end","end start"] });
  const bgY = useTransform(scrollYProgress,[0,1],[-40,40]);

  return (
    <>
      <WaveDivider color="#C5531A" toBg="#3D1A0A" />
      <section ref={ref} className="py-28 px-4 sm:px-6 relative overflow-hidden">
        <motion.div className="absolute inset-0" style={{y:bgY}}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#E66B26] to-[#C5531A]" />
        </motion.div>
        <Spotlight color="rgba(212,175,55,0.06)" />
        <div className="absolute inset-0"><ParticleCanvas count={18} color="rgba(212,175,55,0.08)" /></div>
        {[100,180,270].map((s,i)=>(
          <Float key={i} duration={6+i*2} yRange={12} delay={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full border border-[#D4AF37]/10"
            style={{width:s,height:s}} />
        ))}

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Reveal from="top">
            <div className="inline-flex items-center gap-2 border border-[#D4AF37]/38 rounded-full px-5 py-2 mb-8 bg-[#D4AF37]/10 backdrop-blur-sm">
              <motion.div animate={{rotate:[0,20,-20,0]}} transition={{duration:2.8,repeat:Infinity,ease:"easeInOut"}}>
                <Star className="w-4 h-4 text-[#D4AF37]" />
              </motion.div>
              <span className="text-sm text-[#D4AF37] font-bold">Ready to Join?</span>
            </div>
          </Reveal>

          <Reveal from="bottom" delay={.1}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Join Us?</h2>
          </Reveal>

          <Reveal from="bottom" delay={.2}>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Take the first step towards an exciting career at Stackenzo — your journey starts here.
            </p>
          </Reveal>

          <Reveal from="bottom" delay={.35}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagBtn onClick={hasOpenings ? onBrowse : onSendResume}
                className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-[#E66B26] transition-all flex items-center justify-center gap-2">
                {hasOpenings ? "Browse Openings" : "Send Resume"}
                <motion.div animate={{x:[0,4,0]}} transition={{duration:1.5,repeat:Infinity}}>
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </MagBtn>
              <Link to="/contact">
                <motion.button whileHover={{scale:1.06,backgroundColor:"rgba(255,255,255,0.14)"}} whileTap={{scale:.96}}
                  className="px-8 py-4 border-2 border-white/60 text-white rounded-full font-semibold hover:border-white transition-all flex items-center justify-center gap-2">
                  Get in Touch
                  <motion.div animate={{x:[0,4,0]}} transition={{duration:1.5,repeat:Infinity,delay:.3}}>
                    <BookOpen className="w-5 h-5" />
                  </motion.div>
                </motion.button>
              </Link>
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
function Career() {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle]   = useState("");
  const [jobOpenings, setJobOpenings]             = useState([]);
  const [loading, setLoading]                     = useState(true);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/jobs/postings");
      const data = await response.json();
      if (data.success) setJobOpenings(data.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick  = title => { setSelectedJobTitle(title); setIsResumeModalOpen(true); };
  const handleCloseModal  = ()    => { setIsResumeModalOpen(false); setSelectedJobTitle(""); };
  const scrollToOpenings  = ()    => document.getElementById("career-openings")?.scrollIntoView({ behavior:"smooth" });

  return (
    <div className="bg-white text-[#1A1A1A] min-h-screen overflow-x-hidden">
      <CustomCursor />
      <ScrollProgressBar />
      <SectionNavDots />
      <Navbar />

      <HeroSection jobCount={jobOpenings.length} onScrollToOpenings={scrollToOpenings} />
      <ValuesSection />
      <BenefitsSection />

      {!loading && jobOpenings.length > 0 && (
        <OpeningsSection jobOpenings={jobOpenings} loading={loading} onApply={handleApplyClick} />
      )}
      {!loading && jobOpenings.length === 0 && (
        <NoOpeningsSection onSendResume={() => setIsResumeModalOpen(true)} />
      )}

      <TeamSection />

      <CTASection
        hasOpenings={jobOpenings.length > 0}
        onBrowse={scrollToOpenings}
        onSendResume={() => setIsResumeModalOpen(true)}
      />

      <Footer />
      <ScrollToTop />
      <ResumeModal isOpen={isResumeModalOpen} onClose={handleCloseModal} jobTitle={selectedJobTitle} />
    </div>
  );
}

export default Career;