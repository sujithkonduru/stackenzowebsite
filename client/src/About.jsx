import {
  motion, AnimatePresence, useInView, useScroll, useTransform,
  useSpring, useMotionValue, useVelocity,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  Target, Users, Award, Zap, Heart, Globe, BookOpen,
  Briefcase, Code, TrendingUp, Rocket, Star, ArrowRight,UserPlus,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

/* ══════════════════════════════════════════════
   EASING
══════════════════════════════════════════════ */
const EASE_EXPO = [0.16, 1, 0.3, 1];
const EASE_BACK = [0.34, 1.56, 0.64, 1];

/* ══════════════════════════════════════════════
   DATA
══════════════════════════════════════════════ */
const NAV_SECTIONS = ["about-hero", "about-story", "about-mission", "about-values", "about-stats"];
const NAV_LABELS   = ["Hero", "Story", "Mission", "Values", "Stats"];

const PILLARS = [
  { icon: <Code className="w-6 h-6" />,       title: "IT Services",         desc: "Scalable, secure digital solutions and enterprise systems engineered to power modern businesses and accelerate sustainable growth.",                         color: "from-blue-500 to-cyan-500"     },
  { icon: <Rocket className="w-6 h-6" />,    title: "R&D Innovation",      desc: "Advancing cutting-edge research in AI/ML, IoT, robotics, and emerging technologies to drive real-world innovation.",                           color: "from-purple-500 to-pink-500"   },
  { icon: <BookOpen className="w-6 h-6" />,   title: "EdTech Excellence",   desc: "Immersive learning platforms and industry-aligned programs designed to empower the next generation of learners.",     color: "from-green-500 to-yellow-500" },
  { icon: <TrendingUp className="w-6 h-6" />, title: "Marketing Solutions", desc: "Data-driven strategies and creative solutions designed to build strong digital presence and drive measurable growth.",                     color: "from-blue-500 to-red-500"    },
];

const MISSION_ITEMS = [
  "Build scalable, secure, and future-ready digital solutions",
  "Bridge academic knowledge with real-world implementation",
  "Empower startups, institutions, and enterprises through innovation",
  "Automate complex processes to enhance productivity",
  "Strengthen research-driven engineering culture",
  "Promote continuous learning and technological excellence",
];

const VALUES = [
  { icon: <Heart className="w-10 h-10" />,  title: "Integrity",      desc: "We maintain the highest standards of integrity and transparency in all our operations.",                         color: "from-red-400 to-pink-400"       },

  { icon: <Award className="w-10 h-10" />,  title: "Excellence",     desc: "We strive for excellence in everything we do, from curriculum design to learner success and support.",            color: "from-yellow-400 to-orange-400"  },

  { icon: <Zap className="w-10 h-10" />,    title: "Innovation",     desc: "We continuously innovate our teaching methods and programs to stay ahead of industry trends.",                   color: "from-[#E66B26] to-[#C5531A]"   },

  { icon: <Users className="w-10 h-10" />,  title: "Collaboration",  desc: "We believe in strong collaboration between students, educators, and industry to drive innovation.",                color: "from-blue-400 to-purple-400"    },

  { icon: <Globe className="w-10 h-10" />,  title: "Accessibility",  desc: "We make quality education accessible to students from all backgrounds and locations.",                            color: "from-orange-400 to-red-400"     },

  { icon: <Target className="w-10 h-10" />, title: "Impact",         desc: "We focus on creating meaningful impact in the lives of our students and the community.",                          color: "from-purple-400 to-indigo-400"  },
];
const STATS = [
  { number: "1200+", label: "Students Empowered", icon: Users    },
  { number: "150+",  label: "Projects Delivered", icon: Briefcase },
  { number: "25+",   label: "Expert Mentors",     icon: Award    },
  { number: "20+",   label: "Satisfied Clients",  icon: Users    },
];

const IMAGE_STATS = [
  { icon: Rocket,    value: "15+",  label: "R&D Projects",      pos: "bottom-6 left-6",   anim: { opacity:0, x:-20 } },
  { icon: Code,      value: "50+",  label: "IT Solutions",      pos: "top-20 right-6",    anim: { opacity:0, y:20  } },
  { icon: BookOpen,  value: "500+", label: "Students Trained",  pos: "top-6 left-6",      anim: { opacity:0, x:20  } },
  { icon: TrendingUp,value: "100+", label: "Campaigns Run",     pos: "top-32 left-12",    anim: { opacity:0, y:-20 } },
  { icon: Briefcase, value: "25+",  label: "Industry Partners", pos: "bottom-6 right-6",  anim: { opacity:0, y:-20 } },
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
    left:   { hidden:{ x:-55,opacity:0 }, visible:{ x:0, opacity:1 }, exit:{ x:38,  opacity:0 } },
    right:  { hidden:{ x:55, opacity:0 }, visible:{ x:0, opacity:1 }, exit:{ x:-38, opacity:0 } },
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
function Float({ children, className = "", duration = 4, yRange = 14, delay = 0 }) {
  return (
    <motion.div className={className}
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
    return () => { document.removeEventListener("mousemove", mv); document.removeEventListener("mousedown", md); document.removeEventListener("mouseup", mu); ob.disconnect(); cancelAnimationFrame(id); };
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
            <motion.div layoutId="about-nav-pulse" className="absolute inset-0 rounded-full"
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
function SLabel({ text, light=false }) {
  return (
    <Reveal from="top" className="flex items-center gap-3 justify-center mb-3">
      <motion.div initial={{scaleX:0}} whileInView={{scaleX:1}} viewport={{once:false}} transition={{duration:.55}} className="h-px w-8 bg-[#D4AF37] origin-left" />
      <span className={`font-bold tracking-[.2em] text-[11px] uppercase text-[#D4AF37]`}>{text}</span>
      <motion.div initial={{scaleX:0}} whileInView={{scaleX:1}} viewport={{once:false}} transition={{duration:.55}} className="h-px w-8 bg-[#D4AF37] origin-right" />
    </Reveal>
  );
}

/* ══════════════════════════════════════════════
   WORD-BY-WORD HEADING (bidirectional)
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
function HeroSection() {
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
    <section id="about-hero" ref={secRef} className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden min-h-screen flex items-center">
      {/* Parallax BG image */}
      <motion.div className="absolute inset-0 z-0" style={{ scale:imgS }}>
        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Team" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#E66B26]/40 via-transparent to-[#E66B26]/40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(255,255,255,0.7)_100%)]" />
      </motion.div>

      {/* Particle layer */}
      <div className="absolute inset-0 z-[1]"><ParticleCanvas count={22} color="rgba(230,107,38,0.08)" /></div>

      {/* Noise canvas */}
      <NoiseCanvas color1="#FFD5B8" color2="#FFF0E6" opacity={0.28} />

      {/* Kinetic bg text */}
      <motion.div style={{ y:bigY }} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-[2]">
        <span className="text-[22vw] font-black leading-none tracking-tighter uppercase whitespace-nowrap"
          style={{ color:"rgba(230,107,38,0.018)" }}>ABOUT</span>
      </motion.div>

      {/* Parallax blobs */}
      <motion.div style={{x:b1x,y:b1y}} className="absolute top-10 left-[4%] w-[380px] h-[380px] pointer-events-none z-[2]">
        <div className="w-full h-full rounded-full blur-[110px] opacity-[.35]" style={{ background:"radial-gradient(circle,#FFD5B8,transparent)" }} />
      </motion.div>
      <motion.div style={{x:b2x,y:b2y}} className="absolute bottom-10 right-[4%] w-[460px] h-[460px] pointer-events-none z-[2]">
        <div className="w-full h-full rounded-full blur-[120px] opacity-[.2]" style={{ background:"radial-gradient(circle,#D4AF37,transparent)" }} />
      </motion.div>

      {/* Floating decorative orbs */}
      <Float className="absolute top-1/4 left-[8%] w-3 h-3 rounded-full bg-[#D4AF37]/30 z-[2]" duration={5} delay={0} />
      <Float className="absolute top-1/3 right-[10%] w-2 h-2 rounded-full bg-[#E66B26]/25 z-[2]" duration={4} delay={1} />
      <Float className="absolute bottom-1/4 left-[15%] w-4 h-4 rounded-full bg-[#C5531A]/20 z-[2]" duration={6} delay={2} />
      <Float className="absolute bottom-1/3 right-[18%] w-2.5 h-2.5 rounded-full bg-[#D4AF37]/25 z-[2]" duration={5.5} delay={.5} />

      {/* Animated bg gradient */}
      <motion.div className="absolute inset-0 z-[2] opacity-30"
        animate={{ background:["radial-gradient(circle at 20% 30%,rgba(230,107,38,0.15) 0%,transparent 40%)","radial-gradient(circle at 80% 70%,rgba(230,107,38,0.15) 0%,transparent 40%)","radial-gradient(circle at 20% 30%,rgba(230,107,38,0.15) 0%,transparent 40%)"] }}
        transition={{ duration:10, repeat:Infinity, ease:"linear" }} />

      {/* Main content */}
      <motion.div style={{y:hY,opacity:hO,scale:hS}} className="max-w-6xl mx-auto text-center relative z-10">

        {/* Badge */}
        <motion.div initial={{scale:.7,opacity:0,y:20}} animate={{scale:1,opacity:1,y:0}} transition={{duration:.65,ease:EASE_BACK}}
          className="inline-block mb-8">
          <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E66B26]/20 to-[#C5531A]/20 text-[#E66B26] rounded-full text-sm font-semibold border border-[#E66B26]/30 backdrop-blur-sm shadow-lg shadow-[#E66B26]/10">
            <motion.span animate={{opacity:[.7,1,.7]}} transition={{duration:2,repeat:Infinity}} className="text-[#D4AF37]">✦</motion.span>
            Empowering the Next Generation of Innovators — Established 2025
            <motion.span animate={{opacity:[.7,1,.7]}} transition={{duration:2,repeat:Infinity}} className="text-[#D4AF37]">✦</motion.span>
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1 initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:.3,duration:.75,ease:EASE_EXPO}}
          className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
          <span className="text-[#1A1A1A]">About</span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] via-[#C5531A] to-[#E66B26]">Stackenzo</span>
        </motion.h1>

        {/* Sub */}
        <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.5,ease:EASE_EXPO}}
          className="text-xl sm:text-2xl text-[#1A1A1A] max-w-4xl mx-auto leading-relaxed backdrop-blur-sm bg-white/20 p-6 rounded-2xl border border-gray-200 mb-10">
          Where IT services, R&D, and EdTech unite to transform ideas into scalable, real-world digital solutions.
        </motion.p>

        {/* Stat pills */}
        <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{delay:.7,ease:EASE_EXPO}}
          className="flex flex-wrap justify-center gap-6 mt-4">
          {[{label:"Students Empowered",value:"1200+",icon:"🎓"},{label:"Projects Delivered",value:"150+",icon:"🚀"},{label:"Expert Mentors",value:"25+",icon:"👨‍🏫"}].map((s,i)=>(
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

        {/* Scroll cue */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.8}}
          className="flex justify-center mt-12 cursor-pointer"
          onClick={()=>document.getElementById("about-story")?.scrollIntoView({behavior:"smooth"})}>
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
   OUR STORY SECTION
══════════════════════════════════════════════ */
function StorySection() {
  return (
    <>
      <WaveDivider color="#D4AF37" toBg="#FFF4ED" />
      <section id="about-story" className="py-24 px-4 sm:px-6 relative overflow-hidden" style={{background:"#FFF4ED"}}>
        <NoiseCanvas color1="#FFD5B8" color2="#FFCBA4" opacity={0.25} />
        {/* Floating bg circles */}
        {[{l:"5%",t:"10%",s:120},{l:"85%",t:"60%",s:90},{l:"50%",t:"80%",s:70}].map((o,i)=>(
          <Float key={i} duration={6+i} yRange={18} delay={i} className="absolute pointer-events-none"
            style={{left:o.l,top:o.t}}>
            <div className="rounded-full bg-[#E66B26]/[0.04]" style={{width:o.s,height:o.s}} />
          </Float>
        ))}

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <SLabel text="Our Story" />
            <AHeading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
              How We Started
            </AHeading>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left */}
            <div className="space-y-8">
              <Reveal from="left">
                <p className="text-lg text-[#1A1A1A] leading-relaxed">
                  Founded with a vision to bridge the gap between academic learning and industry excellence
                  <span className="text-[#E66B26] font-semibold mx-1">Stackenzo</span>
                  is a technology-driven organization focused on three core pillars: advanced IT services, innovative R&D, and transformative EdTech solutions.
                </p>
              </Reveal>

              <Reveal from="left" delay={.1}>
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#D4AF37] rounded-full" />
                  Our Comprehensive Offerings
                </h3>
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4" stagger={0.1} from="bottom">
                  {PILLARS.map((item, i) => (
                    <GlowCard key={i} accent="#E66B26">
                      <TiltCard>
                        <motion.div whileHover={{y:-5,scale:1.02,boxShadow:"0 20px 50px rgba(0,0,0,0.08)"}}
                          className="group relative bg-white p-6 rounded-xl border border-orange-200 overflow-hidden h-full">
                          <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                          <div className="relative z-10">
                            <Float duration={4+i*.5} delay={i*.3}>
                              <div className="text-[#E66B26] mb-3">{item.icon}</div>
                            </Float>
                            <h3 className="text-lg font-bold text-[#1A1A1A] mb-2 group-hover:text-[#E66B26] transition-colors">{item.title}</h3>
                            <p className="text-sm text-[#1A1A1A]">{item.desc}</p>
                          </div>
                        </motion.div>
                      </TiltCard>
                    </GlowCard>
                  ))}
                </StaggerContainer>
              </Reveal>

             

          
            </div>

            {/* Right — Image */}
            <Reveal from="right" delay={.1} className="relative lg:sticky lg:top-24">
              <TiltCard intensity={8}>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <motion.img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                    alt="Team collaboration" className="w-full h-auto object-cover"
                    whileHover={{scale:1.04}} transition={{duration:.65}} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#E66B26] via-transparent to-transparent" />

                  {IMAGE_STATS.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <motion.div key={i}
                        initial={s.anim} whileInView={{opacity:1,x:0,y:0}}
                        transition={{delay:.3+i*.12}} viewport={{once:false}}
                        className={`absolute ${s.pos} bg-[#E66B26]/90 backdrop-blur-sm p-4 rounded-xl border border-[#D4AF37]/30`}>
                        <Float duration={4+i*.6} yRange={6} delay={i*.4}>
                          <div className="flex items-center gap-3">
                            <Icon className="w-8 h-8 text-[#D4AF37]" />
                            <div>
                              <div className="text-2xl font-bold text-[#D4AF37]">{s.value}</div>
                              <div className="text-xs text-[#FFF4ED]">{s.label}</div>
                            </div>
                          </div>
                        </Float>
                      </motion.div>
                    );
                  })}
                </div>
              </TiltCard>
            </Reveal>
          </div>
          {/* FULL WIDTH PARAGRAPH */}
<Reveal from="bottom" delay={.2}>
  <div className="mt-12 max-w-5xl mx-auto border-l-4 border-[#D4AF37] pl-6">
    <p className="text-[#1A1A1A] leading-relaxed italic text-center">
      "Today, Stackenzo stands as a unified technology powerhouse where research drives IT solutions, those solutions power EdTech experiences, and strategic marketing amplifies their impact—creating a continuous cycle of innovation and growth."
    </p>
  </div>
</Reveal>
        </div>
      </section>
      <WaveDivider color="#D4AF37" flip toBg="#fff" />
    </>
  );
}

/* ══════════════════════════════════════════════
   MISSION & VISION
══════════════════════════════════════════════ */
function MissionSection() {
  return (
    <section id="about-mission" className="py-24 px-4 sm:px-6 bg-white relative overflow-hidden">
      <Spotlight color="rgba(230,107,38,0.05)" size={550} />
      <div className="absolute inset-0 opacity-[.03]" style={{backgroundImage:"radial-gradient(circle,#E66B26 1px,transparent 1px)",backgroundSize:"28px 28px"}} />
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#E66B26] rounded-full filter blur-3xl opacity-[.06]" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#C5531A] rounded-full filter blur-3xl opacity-[.06]" />

      {/* Kinetic bg text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.span className="text-[16vw] font-black leading-none tracking-tighter uppercase text-[#E66B26]/[0.018]"
          animate={{y:[0,-10,0]}} transition={{duration:9,repeat:Infinity,ease:"easeInOut"}}>
          MISSION
        </motion.span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SLabel text="Mission & Vision" />
          <AHeading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
            Our Mission & Vision
          </AHeading>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Mission */}
          <Reveal from="left">
            <GlowCard accent="#E66B26" className="h-full">
              <TiltCard intensity={8}>
                <motion.div whileHover={{y:-6,boxShadow:"0 30px 70px rgba(0,0,0,0.10)"}}
                  className="group relative bg-gradient-to-br from-[#FFF4ED] to-white p-8 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 h-full">
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-[#E66B26]/10 to-[#C5531A]/10"
                    animate={{opacity:[.3,.6,.3]}} transition={{duration:3,repeat:Infinity,ease:"easeInOut"}} />
                  <div className="relative z-10">
                    <Float duration={4} yRange={8}>
                      <Target className="w-14 h-14 text-[#D4AF37] mb-6 group-hover:scale-110 transition-transform" />
                    </Float>
                    <h3 className="text-3xl font-bold mb-5 text-[#1A1A1A]">Our Mission</h3>
                    <p className="text-[#1A1A1A] leading-relaxed text-lg mb-6">
                     Our mission is to design, develop, and deliver intelligent technology solutions that solve real-world challenges with precision, scalability, and long-term impact—across IT services, R&D, and EdTech.
                    </p>
                    <StaggerContainer className="space-y-3" stagger={0.08} from="left">
                      {MISSION_ITEMS.map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <motion.div animate={{scale:[1,1.4,1]}} transition={{duration:2.2,repeat:Infinity,delay:i*.22}}>
                            <Star className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-1" />
                          </motion.div>
                          <span className="text-[#1A1A1A]">{item}</span>
                        </div>
                      ))}
                    </StaggerContainer>
                  </div>
                </motion.div>
              </TiltCard>
            </GlowCard>
          </Reveal>

          {/* Vision */}
          <Reveal from="right" delay={.1}>
            <GlowCard accent="#D4AF37" className="h-full">
              <TiltCard intensity={8}>
                <motion.div whileHover={{y:-6,boxShadow:"0 30px 70px rgba(0,0,0,0.10)"}}
                  className="group relative bg-gradient-to-br from-[#FFF4ED] to-white p-8 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 h-full">
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-[#E66B26]/10 to-[#C5531A]/10"
                    animate={{opacity:[.3,.6,.3]}} transition={{duration:3,repeat:Infinity,ease:"easeInOut",delay:1.5}} />
                  <div className="relative z-10">
                    <Float duration={4.5} yRange={8}>
                      <Globe className="w-14 h-14 text-[#D4AF37] mb-3 group-hover:scale-110 transition-transform" />
                    </Float>
                    <h3 className="text-3xl font-bold mb-6 text-[#1A1A1A]">Our Vision</h3>
                    <p className="text-[#1A1A1A] leading-relaxed text-lg mb-3">
                      To become a leading innovation-driven technology ecosystem where IT services, R&D, and EdTech converge to create meaningful impact. We aim to advance applied research, transform breakthrough ideas into scalable digital solutions, and deliver intelligent systems that empower businesses and learners alike. By integrating technological excellence with innovation and education, we strive to shape a smarter, more connected future."</p>
                    <Reveal from="bottom" delay={.35}>
                      <div className="relative overflow-hidden rounded-2xl p-5" style={{ background:"linear-gradient(135deg,#FFF4ED,#FFF4ED)" }}>
                        <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl bg-[#D4AF37]" />
                        <p className="text-sm text-[#1A1A1A] italic leading-relaxed pl-3">"Through this innovation backbone, we strive to redefine education by integrating practical learning, industry exposure, and technology-enabled experiences — empowering the next generation to learn, build and inspire."</p>
                      </div>
                    </Reveal>
                  </div>
                </motion.div>
              </TiltCard>
            </GlowCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   CORE VALUES
══════════════════════════════════════════════ */
function ValuesSection() {
  return (
    <>
      <WaveDivider color="#D4AF37" toBg="#FFF4ED" />
      <section id="about-values" className="py-24 px-4 sm:px-6 relative overflow-hidden" style={{background:"#FFF4ED"}}>
        <NoiseCanvas color1="#FFD5B8" color2="#FFCBA4" opacity={0.22} />
        {/* Big floating bg text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <motion.span className="text-[15vw] font-black leading-none tracking-tighter uppercase text-[#E66B26]/[0.02]"
            animate={{y:[0,-12,0]}} transition={{duration:10,repeat:Infinity,ease:"easeInOut"}}>VALUES</motion.span>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <SLabel text="Core Values" />
            <AHeading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
              Our Core Values
            </AHeading>
            <Reveal from="bottom" delay={.25}>
              <p className="text-xl text-[#1A1A1A] max-w-3xl mx-auto mt-4">The principles that guide everything we do at Stackenzo</p>
            </Reveal>
          </div>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" stagger={0.1} from="bottom">
            {VALUES.map((v, i) => (
              <GlowCard key={i} accent="#D4AF37">
                <TiltCard>
                  <motion.div whileHover={{y:-10,scale:1.02,boxShadow:"0 28px 65px rgba(0,0,0,0.10)",transition:{type:"spring",stiffness:300}}}
                    className="group relative bg-white p-8 rounded-2xl border border-gray-200 text-center overflow-hidden h-full">
                    <div className={`absolute inset-0 bg-gradient-to-br ${v.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    <Float duration={4+i*.4} delay={i*.3}>
                      <motion.div whileHover={{rotate:360,scale:1.2}} transition={{duration:.5}} className="text-[#D4AF37] mb-4 inline-block">
                        {v.icon}
                      </motion.div>
                    </Float>
                    <h3 className="text-2xl font-bold mb-3 text-[#1A1A1A] group-hover:text-[#E66B26] transition-colors">{v.title}</h3>
                    <p className="text-[#1A1A1A]">{v.desc}</p>
                    <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] to-[#D4AF37]"
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
   STATS
══════════════════════════════════════════════ */
function StatsSection() {
  return (
    <section id="about-stats" className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
      <Spotlight color="rgba(230,107,38,0.045)" size={500} />
      <motion.div className="absolute inset-0 opacity-[.07]"
        animate={{ background:["radial-gradient(circle at 20% 30%,rgba(197,83,26,0.1) 0%,transparent 30%)","radial-gradient(circle at 80% 70%,rgba(197,83,26,0.1) 0%,transparent 30%)","radial-gradient(circle at 20% 30%,rgba(197,83,26,0.1) 0%,transparent 30%)"] }}
        transition={{ duration:8, repeat:Infinity, ease:"linear" }} />
      {/* Floating orbs */}
      {[{x:"8%",y:"20%",s:70},{x:"88%",y:"70%",s:50},{x:"50%",y:"85%",s:60}].map((o,i)=>(
        <Float key={i} duration={5+i} yRange={18} delay={i} className="absolute pointer-events-none" style={{left:o.x,top:o.y}}>
          <div className="rounded-full bg-[#D4AF37]/[0.05]" style={{width:o.s,height:o.s}} />
        </Float>
      ))}

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <SLabel text="Our Impact" />
          <AHeading className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
            Our Impact in Numbers
          </AHeading>
        </div>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6" stagger={0.12} from="bottom">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <GlowCard key={i} accent="#D4AF37">
                <TiltCard>
                  <motion.div whileHover={{y:-8,boxShadow:"0 24px 55px rgba(0,0,0,0.10)"}}
                    className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 hover:border-[#D4AF37] transition-all duration-300 text-center h-full">
                    <Float duration={4+i*.5} delay={i*.3}>
                      <motion.div whileHover={{rotate:18,scale:1.18}} className="inline-flex justify-center mb-3">
                        <div className="bg-[#E66B26] p-3 rounded-xl shadow-lg shadow-[#E66B26]/20">
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                      </motion.div>
                    </Float>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-black text-[#E66B26] mb-1">
                      <Counter value={s.number} />
                    </div>
                    <div className="text-xs sm:text-sm text-[#1A1A1A] font-medium">{s.label}</div>
                  </motion.div>
                </TiltCard>
              </GlowCard>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   CTA SECTION
══════════════════════════════════════════════ */
function CTASection() {
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
        {/* Floating rings */}
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
              <span className="text-sm text-[#D4AF37] font-bold">Build Your Future with Stackenzo</span>
            </div>
          </Reveal>

          <Reveal from="bottom" delay={.1}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Where Your Growth Begins</h2>
          </Reveal>

          <Reveal from="bottom" delay={.2}>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Be part of a growing network of learners and innovators. Let’s shape the future of technology together.
            </p>
          </Reveal>

          <Reveal from="bottom" delay={.35}>
            <div className="flex flex-col sm:flex-row gap-2 justify-center flex-wrap">
              {[
                { to:"/Contact",          label:"Get in Touch",      Icon:Rocket   },
                { to:"/StackenzoPrograms",label:"Explore Programs",  Icon:BookOpen },
                { to:"/Services",         label:"Explore Services",  Icon:Target   },
                { to:"/Community",         label:"Explore Community",  Icon:UserPlus   },
              ].map(({to,label,Icon},i) => (
                <Link key={i} to={to}>
                  <motion.button whileHover={{scale:1.06,backgroundColor:"rgba(255,255,255,0.14)"}} whileTap={{scale:.96}}
                    className="group px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2">
                    <span>{label}</span>
                    <motion.div animate={{x:[0,4,0]}} transition={{duration:1.5,repeat:Infinity}}>
                      <Icon className="w-5 h-5" />
                    </motion.div>
                  </motion.button>
                </Link>
              ))}
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
function About() {
  return (
    <div className="bg-white text-[#1A1A1A] min-h-screen overflow-x-hidden">
      <CustomCursor />
      <ScrollProgressBar />
      <SectionNavDots />
      <Navbar />

      <HeroSection />
      <StorySection />
      <MissionSection />
      <ValuesSection />
      <StatsSection />
      <CTASection />

      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default About;