import {
  motion, AnimatePresence, useInView, useScroll, useTransform,
  useSpring, useMotionValue, useVelocity,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search, Lightbulb, Users, Award, ChevronDown, Target, Zap, BookOpen,
  Microscope, Atom, Beaker, FlaskConical, Cpu, Globe2, Network,
  Sparkles, CheckCircle, Rocket, TrendingUp, Clock, HeadphonesIcon,
  FileText, GraduationCap, Building2, Briefcase, Share2, BookMarked,
  Layers, Code, Database, Cloud, Shield, Bot, Brain, FolderOpen,
  ChevronRight, ArrowLeft,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import rndData from "./data/rndData.json";

/* ══════════════════════════════════════════════
   BRAND  (white-bg orange system — matches all other pages)
══════════════════════════════════════════════ */
const C = {
  dark:     "#F04A06",
  mid:      "#C5531A",
  gold:     "#D4AF37",
  light:    "#FFF4ED",
  tint:     "#FFD5B8",
  tint2:    "#FFCBA4",
  warmBg:   "#FFF0E6",
  veryDark: "#3D1A0A",
  text:     "#1A1A1A",
  border:   "#E5E7EB",
  p:  (a) => `rgba(230,107,38,${a})`,
  pd: (a) => `rgba(197,83,26,${a})`,
};

const EASE_EXPO = [0.16, 1, 0.3, 1];
const EASE_BACK = [0.34, 1.56, 0.64, 1];

const NAV_SECTIONS = ["rp-hero", "rp-projects"];
const NAV_LABELS   = ["Top", "Projects"];

/* ══ SCROLL DIR ══ */
function useScrollDir() {
  const { scrollY } = useScroll();
  const vel = useVelocity(scrollY);
  const [dir, setDir] = useState("down");
  useEffect(() => vel.on("change", v => setDir(v > 0 ? "down" : "up")), [vel]);
  return dir;
}

/* ══ REVEAL ══ */
function Reveal({ children, className = "", delay = 0, from = "bottom" }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: false, margin: "-55px" });
  const dir = useScrollDir();
  const V = {
    bottom: { hidden: { y: 65, opacity: 0, scale: .96, filter: "blur(6px)" }, visible: { y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }, exit: { y: -48, opacity: 0, scale: .97, filter: "blur(4px)" } },
    top:    { hidden: { y: -65, opacity: 0, scale: .96, filter: "blur(6px)" }, visible: { y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }, exit: { y: 48, opacity: 0 } },
    left:   { hidden: { x: -75, opacity: 0, scale: .96, filter: "blur(6px)" }, visible: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)" }, exit: { x: 55, opacity: 0 } },
    right:  { hidden: { x: 75, opacity: 0, scale: .96, filter: "blur(6px)" }, visible: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)" }, exit: { x: -55, opacity: 0 } },
    scale:  { hidden: { scale: .75, opacity: 0, filter: "blur(8px)" }, visible: { scale: 1, opacity: 1, filter: "blur(0px)" }, exit: { scale: .85, opacity: 0 } },
  };
  const { hidden, visible, exit } = V[from] || V.bottom;
  return (
    <motion.div ref={ref} className={className}
      initial="hidden"
      animate={inV ? "visible" : dir === "up" ? "exit" : "hidden"}
      variants={{ hidden, visible, exit }}
      transition={{ duration: 0.75, delay, ease: EASE_EXPO }}>
      {children}
    </motion.div>
  );
}

/* ══ STAGGER ══ */
function StaggerContainer({ children, className = "", stagger = 0.1, from = "bottom" }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: false, margin: "-55px" });
  const dir = useScrollDir();
  const base = {
    bottom: { hidden: { y: 55, opacity: 0, scale: .95, filter: "blur(5px)" }, visible: { y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }, exit: { y: -38, opacity: 0, scale: .97 } },
    left:   { hidden: { x: -55, opacity: 0 }, visible: { x: 0, opacity: 1 }, exit: { x: 38, opacity: 0 } },
    scale:  { hidden: { scale: .75, opacity: 0 }, visible: { scale: 1, opacity: 1 }, exit: { scale: .85, opacity: 0 } },
  };
  const { hidden, visible, exit } = base[from] || base.bottom;
  return (
    <motion.div ref={ref} className={className}
      initial="hidden"
      animate={inV ? "visible" : dir === "up" ? "exit" : "hidden"}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger } }, exit: { transition: { staggerChildren: stagger / 2, staggerDirection: -1 } } }}>
      {Array.isArray(children)
        ? children.map((child, i) => <motion.div key={i} variants={{ hidden, visible, exit }} transition={{ duration: 0.7, ease: EASE_EXPO }}>{child}</motion.div>)
        : <motion.div variants={{ hidden, visible, exit }} transition={{ duration: 0.7, ease: EASE_EXPO }}>{children}</motion.div>}
    </motion.div>
  );
}

/* ══ FLOAT ══ */
function Float({ children, className = "", duration = 4, yRange = 14, delay = 0, style }) {
  return (
    <motion.div className={className} style={style}
      animate={{ y: [-yRange / 2, yRange / 2, -yRange / 2] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}>
      {children}
    </motion.div>
  );
}

/* ══ GLOW CARD ══ */
function GlowCard({ children, className = "", accent = C.gold }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: false, margin: "-40px" });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <motion.div ref={ref} className={`relative rounded-2xl overflow-hidden ${className}`}
      onMouseMove={e => { const r = ref.current?.getBoundingClientRect(); if (r) setPos({ x: e.clientX - r.left, y: e.clientY - r.top }); }}
      initial={{ opacity: 0, y: 40, scale: .96 }}
      animate={inV ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: .96 }}
      transition={{ duration: 0.75, ease: EASE_EXPO }}>
      <div className="absolute pointer-events-none rounded-2xl z-0"
        style={{ inset: -1, background: `radial-gradient(280px circle at ${pos.x}px ${pos.y}px,${accent}28,transparent 58%)` }} />
      <motion.div className="absolute inset-0 rounded-2xl pointer-events-none z-0"
        animate={inV ? { opacity: [.22, .5, .22] } : { opacity: 0 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ boxShadow: `inset 0 0 0 1px ${accent}30` }} />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

/* ══ TILT CARD ══ */
function TiltCard({ children, className = "", intensity = 8 }) {
  const ref = useRef(null);
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 22 });
  const sry = useSpring(ry, { stiffness: 200, damping: 22 });
  return (
    <motion.div ref={ref}
      onMouseMove={e => { const r = ref.current.getBoundingClientRect(); rx.set(-((e.clientY - r.top) / r.height - .5) * intensity); ry.set(((e.clientX - r.left) / r.width - .5) * intensity); }}
      onMouseLeave={() => { rx.set(0); ry.set(0); }}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }} className={className}>
      {children}
    </motion.div>
  );
}



/* ══ SCROLL PROGRESS BAR ══ */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 right-0 w-[4px] h-full origin-top z-[9997]"
      style={{
        scaleY,
        background: "linear-gradient(to bottom,#0d1f0d,#1E301E,#D4AF37,#2E7D32,#D4AF37)"
      }}
    />
  );
}

/* ══ SECTION NAV DOTS ══ */
function SectionNavDots() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { const i = NAV_SECTIONS.indexOf(e.target.id); if (i !== -1) setActive(i); } }),
      { threshold: 0.35 }
    );
    NAV_SECTIONS.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);
  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-[900] flex-col gap-4 hidden md:flex">
      {NAV_SECTIONS.map((id, i) => (
        <motion.button key={i} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
          className="relative flex items-center gap-2" title={NAV_LABELS[i]}>
          <motion.span initial={{ opacity: 0, x: 8 }} animate={{ opacity: active === i ? 1 : 0, x: active === i ? 0 : 8 }}
            className="absolute right-6 text-[11px] font-bold bg-[#0f0f0f]/80 backdrop-blur-sm px-2 py-1 rounded-md whitespace-nowrap pointer-events-none"
            style={{ color: C.gold }}></motion.span>
          <motion.div animate={{ scale: active === i ? 1.4 : 1, background: active === i ? C.gold : C.p(.4) }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }} className="w-2.5 h-2.5 rounded-full" />
          {active === i && (
            <motion.div layoutId="rp-nav-pulse" className="absolute inset-0 rounded-full"
              style={{ scale: 2, border: `1.5px solid ${C.gold}`, opacity: .5 }}
              animate={{ scale: [2, 2.8, 2], opacity: [.5, 0, .5] }} transition={{ duration: 1.8, repeat: Infinity }} />
          )}
        </motion.button>
      ))}
    </div>
  );
}

/* ══ NOISE CANVAS — warm orange tints on white bg ══ */
function NoiseCanvas({ color1 = C.tint, color2 = C.warmBg, opacity = 0.28 }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); let t = 0, id;
    const draw = () => {
      const w = c.width = c.offsetWidth, h = c.height = c.offsetHeight;
      const g = ctx.createRadialGradient(w * (.3 + .22 * Math.sin(t * .38)), h * (.3 + .16 * Math.cos(t * .28)), 0, w * .5, h * .5, Math.max(w, h) * .88);
      g.addColorStop(0, color1 + "cc"); g.addColorStop(.5, color2 + "88"); g.addColorStop(1, "transparent");
      ctx.clearRect(0, 0, w, h); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); t += .007; id = requestAnimationFrame(draw);
    };
    draw(); return () => cancelAnimationFrame(id);
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }} />;
}

/* ══ PARTICLE CANVAS ══ */
function ParticleCanvas({ count = 18, color = C.p(.08) }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let w = c.width = c.offsetWidth, h = c.height = c.offsetHeight;
    const pts = Array.from({ length: count }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.5 + .7 }));
    let id;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      pts.forEach(p => { p.x += p.vx; p.y += p.vy; if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); });
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 88) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = color.replace(/[\d.]+\)$/, `${(1 - d / 88) * .055})`); ctx.stroke(); }
      }
      id = requestAnimationFrame(draw);
    };
    draw();
    const rz = () => { w = c.width = c.offsetWidth; h = c.height = c.offsetHeight; };
    window.addEventListener("resize", rz);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", rz); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ══ SPOTLIGHT ══ */
function Spotlight({ color = C.p(.06), size = 560 }) {
  const ref = useRef(null);
  useEffect(() => {
    const fn = e => { if (!ref.current) return; const r = ref.current.getBoundingClientRect(); ref.current.style.background = `radial-gradient(${size}px circle at ${e.clientX - r.left}px ${e.clientY - r.top}px,${color},transparent 70%)`; };
    window.addEventListener("mousemove", fn); return () => window.removeEventListener("mousemove", fn);
  }, []);
  return <div ref={ref} className="absolute inset-0 pointer-events-none z-[1]" />;
}

/* ══ WAVE DIVIDER — now uses white bg colors ══ */
function WaveDivider({ color = C.gold, flip = false, toBg = "#fff" }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: true, margin: "-10px" });
  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${flip ? "rotate-180" : ""}`} style={{ height: 56 }}>
      <svg viewBox="0 0 1440 56" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <motion.path d="M0,28 C240,0 480,56 720,28 C960,0 1200,56 1440,28 L1440,56 L0,56 Z"
          fill={toBg} initial={{ pathLength: 0 }} animate={inV ? { pathLength: 1 } : {}} transition={{ duration: 1.2, ease: EASE_EXPO }} />
        <motion.path d="M0,28 C240,0 480,56 720,28 C960,0 1200,56 1440,28"
          stroke={color} strokeWidth="1.5" fill="none"
          initial={{ pathLength: 0, opacity: 0 }} animate={inV ? { pathLength: 1, opacity: 1 } : {}} transition={{ duration: 1.4, ease: EASE_EXPO, delay: .15 }} />
        <motion.path d="M0,36 C240,8 480,64 720,36 C960,8 1200,64 1440,36"
          stroke={color} strokeWidth=".6" fill="none" opacity=".4"
          initial={{ pathLength: 0 }} animate={inV ? { pathLength: 1 } : {}} transition={{ duration: 1.4, ease: EASE_EXPO, delay: .3 }} />
      </svg>
    </div>
  );
}

/* ══ SECTION LABEL ══ */
function SLabel({ text }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: false, margin: "-40px" });
  return (
    <motion.div ref={ref} className="flex items-center gap-3 justify-center mb-3"
      initial={{ opacity: 0, y: -20 }} animate={inV ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: .6, ease: EASE_EXPO }}>
      <motion.div initial={{ scaleX: 0 }} animate={inV ? { scaleX: 1 } : { scaleX: 0 }} transition={{ duration: .5 }}
        className="h-px w-8 origin-left" style={{ background: C.gold }} />
      <span style={{ color: C.gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>{text}</span>
      <motion.div initial={{ scaleX: 0 }} animate={inV ? { scaleX: 1 } : { scaleX: 0 }} transition={{ duration: .5 }}
        className="h-px w-8 origin-right" style={{ background: C.gold }} />
    </motion.div>
  );
}

/* ══ WORD-BY-WORD HEADING ══ */
function AHeading({ children, className = "", delay = 0, tag = "h1" }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: false, margin: "-50px" });
  const dir = useScrollDir();
  const words = typeof children === "string" ? children.split(" ") : [children];
  const Tag = tag;
  return (
    <Tag ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[.28em]">
          <motion.span className="inline-block"
            initial={{ y: "110%", opacity: 0, skewY: 5 }}
            animate={inV ? { y: 0, opacity: 1, skewY: 0 } : dir === "up" ? { y: "-110%", opacity: 0, skewY: -5 } : { y: "110%", opacity: 0, skewY: 5 }}
            transition={{ duration: .72, delay: delay + i * .075, ease: EASE_EXPO }}>
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
function ResearchProjects() {
  const [expandedGroups, setExpandedGroups] = useState({});

  const projects = rndData.projects;
 
  const projectGroups = {
    "GSIN": {
      title: "GSIN - Global Student Industry Network",
      desc: "Large-scale virtual learning ecosystem connecting students with industry",
      projects: projects.filter(p => p.id === "gsin-global-student-industry-network"),
    },
    "Virtual Projects": {
      title: "Virtual Projects",
      desc: "2D digital twins and virtual collaboration platforms",
      projects: projects.filter(p => ["virtual-office","virtual-industry","virtual-campus"].includes(p.id)),
    },
    "Stackenzo Eye Vision": {
      title: "Stackenzo Eye Vision",
      desc: "AI-powered surveillance and computer vision solutions",
      projects: projects.filter(p => ["ai-attendance-monitoring","ai-class-lab-assistance","stackenzo-retro-tracking","stackenzo-person-tracking-alert"].includes(p.id)),
    },
  };

  const toggleGroup = (groupKey) =>
    setExpandedGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));

  /* hero parallax */
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], [0, -80]);
  const heroO = useTransform(heroScroll, [0, .6], [1, 0.9]);
  const heroS = useTransform(heroScroll, [0, 1], [1, .88]);
  const bigY  = useTransform(heroScroll, [0, 1], [0, 140]);

  const mx = useMotionValue(0), my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 35, damping: 18 });
  const smy = useSpring(my, { stiffness: 35, damping: 18 });
  const b1x = useTransform(smx, [-1, 1], [-20, 20]);
  const b1y = useTransform(smy, [-1, 1], [-12, 12]);
  const b2x = useTransform(smx, [-1, 1], [14, -14]);
  const b2y = useTransform(smy, [-1, 1], [10, -10]);
  useEffect(() => {
    const fn = e => { mx.set((e.clientX / window.innerWidth - .5) * 2); my.set((e.clientY / window.innerHeight - .5) * 2); };
    window.addEventListener("mousemove", fn); return () => window.removeEventListener("mousemove", fn);
  }, []);

  return (
    /* ✅ WHITE background — was "#0a0605" dark */
    <div className="min-h-screen overflow-x-hidden bg-white" style={{ color: C.text }}>
     
      <ScrollProgressBar />
      <SectionNavDots />
      <Navbar />

      {/* ══ HERO — white/light bg ══ */}
      <section id="rp-hero" ref={heroRef}
        className="relative pt-24 pb-16 sm:pb-20 px-4 sm:px-6 min-h-[65vh] flex items-center overflow-hidden"
        style={{ background: C.light }}>  {/* ✅ was "#0a0605" */}

        {/* noise: warm orange tints (visible on light bg) */}
        <NoiseCanvas color1={C.tint} color2={C.warmBg} opacity={0.28} />
        <div className="absolute inset-0 z-1"><ParticleCanvas count={18} /></div>

        {/* animated gradient pulse */}
        <motion.div className="absolute inset-0 z-[2] opacity-22"
          animate={{ background: [
            `radial-gradient(circle at 20% 30%,${C.pd(.16)} 0%,transparent 40%)`,
            `radial-gradient(circle at 80% 70%,${C.pd(.16)} 0%,transparent 40%)`,
            `radial-gradient(circle at 20% 30%,${C.pd(.16)} 0%,transparent 40%)`,
          ]}}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />

        {/* mouse blobs */}
        <motion.div style={{ x: b1x, y: b1y }} className="absolute top-10 left-[4%] w-[300px] h-[300px] pointer-events-none z-[2]">
          <div className="w-full h-full rounded-full" style={{ filter: "blur(90px)", opacity: .32, background: `radial-gradient(circle,${C.tint},transparent)` }} />
        </motion.div>
        <motion.div style={{ x: b2x, y: b2y }} className="absolute bottom-10 right-[4%] w-[350px] h-[350px] pointer-events-none z-[2]">
          <div className="w-full h-full rounded-full" style={{ filter: "blur(100px)", opacity: .2, background: `radial-gradient(circle,${C.gold},transparent)` }} />
        </motion.div>

        {/* floating orbs */}
        {[
          { t: "20%", l: "7%",  d: 10, c: `${C.gold}44` },
          { t: "40%", r: "8%",  d: 7,  c: C.p(.35)      },
          { b: "25%", l: "12%", d: 12, c: C.pd(.22)     },
          { b: "35%", r: "14%", d: 8,  c: `${C.gold}33` },
        ].map((o, i) => (
          <Float key={i} duration={4 + i * .6} delay={i * .4}
            className="absolute z-[2] rounded-full pointer-events-none"
            style={{ top: o.t, bottom: o.b, left: o.l, right: o.r, width: o.d, height: o.d, background: o.c }} />
        ))}

        {/* floating emojis */}
        <Float className="absolute top-[20%] left-[5%] hidden lg:block z-2" duration={5} yRange={18} delay={0}>
          <motion.div animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 5, repeat: Infinity }}
            className="text-5xl" style={{ opacity: .22, filter: `drop-shadow(0 6px 18px ${C.p(.3)})` }}>🔬</motion.div>
        </Float>
        <Float className="absolute top-[30%] right-[7%] hidden lg:block z-2" duration={4} yRange={16} delay={1}>
          <motion.div animate={{ scale: [1, 1.15, 1], rotate: [0, -6, 6, 0] }} transition={{ duration: 4, repeat: Infinity }}
            className="text-4xl" style={{ opacity: .2, filter: `drop-shadow(0 6px 18px ${C.p(.3)})` }}>⚗️</motion.div>
        </Float>
        <Float className="absolute bottom-[25%] left-[10%] hidden lg:block z-2" duration={6} yRange={14} delay={2}>
          <span className="text-4xl" style={{ opacity: .14 }}>🤖</span>
        </Float>

        {/* kinetic bg text — orange on light bg */}
        <motion.div style={{ y: bigY }} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-[2]">
          <span className="font-black leading-none tracking-tighter uppercase whitespace-nowrap"
            style={{ fontSize: "17vw", color: C.p(.04) }}>RESEARCH</span>  {/* ✅ was 0.022 on dark */}
        </motion.div>

        {/* dot grid — uses veryDark orange-brown on light bg */}
        <div className="absolute inset-0 z-[2] opacity-[.04] pointer-events-none"
          style={{ backgroundImage: `radial-gradient(circle,${C.veryDark} 1px,transparent 1px)`, backgroundSize: "28px 28px" }} />

        <motion.div style={{ y: heroY, opacity: heroO, scale: heroS }}
          className="max-w-6xl mx-auto w-full relative z-10">

          {/* Back button */}
          <Reveal from="left" className="mb-8">
            <Link to="/R_AND_D">
              <motion.div whileHover={{ x: -4, boxShadow: `0 4px 18px ${C.p(.22)}` }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ background: C.p(.1), border: `1px solid ${C.p(.28)}`, color: C.dark }}>
                <motion.div animate={{ x: [0, -3, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
                  <ArrowLeft className="w-4 h-4" />
                </motion.div>
                <span>Back to R&D Division</span>
              </motion.div>
            </Link>
          </Reveal>

          {/* Badge */}
          <motion.div initial={{ scale: .7, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: .65, ease: EASE_BACK }} className="inline-flex mb-6">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold backdrop-blur-sm shadow-lg"
              style={{ background: C.p(.12), border: `1px solid ${C.p(.28)}`, color: C.mid }}>
              <Float duration={3.5} yRange={5}>
                <Microscope className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: C.gold }} />
              </Float>
              <motion.span animate={{ opacity: [.7, 1, .7] }} transition={{ duration: 2, repeat: Infinity }}>✦</motion.span>
              Research &amp; Development Division
              <motion.span animate={{ opacity: [.7, 1, .7] }} transition={{ duration: 2, repeat: Infinity, delay: .5 }}>
                <Sparkles className="w-3 h-3" style={{ color: `${C.gold}88` }} />
              </motion.span>
            </span>
          </motion.div>

          {/* Heading — orange gradient, visible on light bg */}
          <AHeading tag="h1" delay={.05}
            className="font-bold mb-5 leading-tight bg-clip-text"
            style={{ fontSize: "clamp(2rem,6vw,4rem)", backgroundImage: `linear-gradient(135deg,${C.dark})` }}>
            Research Projects
          </AHeading>

          {/* Gold bar */}
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: .55, duration: .6, ease: EASE_EXPO }}
            className="mb-6 rounded-full origin-left" style={{ width: 56, height: 3, background: C.gold }} />

          {/* Sub — dark text on light bg */}
          <Reveal from="bottom" delay={.15}>
            <p className="text-base sm:text-lg max-w-2xl leading-relaxed px-4 sm:px-6 py-4 rounded-2xl border backdrop-blur-sm"
              style={{ color: "rgba(26,26,26,0.68)", borderColor: "rgba(229,231,235,0.8)", background: "rgba(255,255,255,0.5)" }}>
              Innovative research initiatives transforming real-world challenges into intelligent solutions
            </p>
          </Reveal>
        </motion.div>
      </section>

      {/* ══ PROJECTS — light bg section ══ */}
      <WaveDivider color={C.gold} toBg="#fff" />  {/* ✅ was toBg="#110805" dark */}
      <section id="rp-projects" className="py-10 sm:py-14 px-4 sm:px-6 relative overflow-hidden bg-white">
        <Spotlight color={C.p(.05)} />

        {/* dot grid — visible on white */}
        <div className="absolute inset-0 opacity-[.03] pointer-events-none"
          style={{ backgroundImage: `radial-gradient(circle,${C.veryDark} 1px,transparent 1px)`, backgroundSize: "28px 28px" }} />

        {/* kinetic bg text — orange, more opaque on white */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <motion.span className="font-black leading-none tracking-tighter uppercase"
            style={{ fontSize: "15vw", color: C.p(.038) }}  // ✅ was 0.028 on dark
            animate={{ y: [0, -10, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>
            PROJECTS
          </motion.span>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">

          <div className="text-center mb-12">
            <SLabel text="Research Groups" />
            <AHeading tag="h2" delay={.05}
              className="text-3xl md:text-4xl font-bold bg-clip-text"
              style={{ backgroundImage: `linear-gradient(135deg,${C.dark})` }}>
              Explore Our Projects
            </AHeading>
          </div>

          {Object.entries(projectGroups).map(([groupKey, group], groupIndex) => {
            const isExpanded = expandedGroups[groupKey];
            return (
              <Reveal key={groupKey} from="bottom" delay={groupIndex * .08} className="mb-6 last:mb-0">

                {/* ── GROUP HEADER CARD — white bg card ── */}
                <GlowCard accent={isExpanded ? C.gold : C.dark}>
                  <TiltCard intensity={5}>
                    <motion.div
                      onClick={() => toggleGroup(groupKey)}
                      whileHover={{ boxShadow: `0 12px 38px ${C.p(.14)}` }}
                      className="relative p-5 sm:p-7 rounded-2xl overflow-hidden transition-all cursor-pointer select-none bg-white"
                      style={{
                        border: `1px solid ${isExpanded ? C.dark : C.border}`,
                        boxShadow: isExpanded ? `0 4px 20px ${C.p(.1)}` : "0 1px 4px rgba(0,0,0,0.06)",
                      }}>

                      {/* hover tint overlay */}
                      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                        style={{ background: `linear-gradient(135deg,${C.p(.04)},${C.pd(.02)})` }} />

                      {/* active bg tint when expanded */}
                      {isExpanded && (
                        <div className="absolute inset-0 rounded-2xl pointer-events-none"
                          style={{ background: `linear-gradient(135deg,${C.p(.06)},${C.pd(.04)})` }} />
                      )}

                      <div className="flex items-start gap-4 sm:gap-6 relative z-10">
                        {/* Number badge */}
                        <Float duration={4 + groupIndex * .5} delay={groupIndex * .25} yRange={8}>
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                            style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
                            <span className="font-bold text-white text-lg sm:text-xl">
                              {(groupIndex + 1).toString().padStart(2, "0")}
                            </span>
                          </div>
                        </Float>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-4">
                            {/* Title — dark text on white */}
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight transition-colors"
                              style={{ color: isExpanded ? C.dark : C.text }}>
                              {group.title}
                            </h3>
                            {/* Chevron */}
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: .35, ease: EASE_EXPO }}
                              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                              style={{
                                background: isExpanded ? C.p(.15) : C.light,
                                border: `1px solid ${isExpanded ? C.p(.35) : C.border}`,
                              }}>
                              <ChevronDown className="w-4 h-4" style={{ color: isExpanded ? C.dark : C.gold }} />
                            </motion.div>
                          </div>

                          {/* Desc — muted on white bg */}
                          <p className="text-sm mt-2 transition-colors"
                            style={{ color: isExpanded ? C.pd(.85) : "rgba(26,26,26,0.55)" }}>
                            {group.desc}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 mt-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                              style={{ background: C.p(.1), border: `1px solid ${C.p(.25)}`, color: C.dark }}>
                              <FolderOpen className="w-3 h-3" />
                              {group.projects.length} {group.projects.length === 1 ? "Project" : "Projects"}
                            </span>
                            <span className="text-xs" style={{ color: "rgba(26,26,26,0.38)" }}>
                              Click to {isExpanded ? "collapse" : "expand"} section
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </TiltCard>
                </GlowCard>

                {/* ── EXPANDABLE SUBPROJECTS ── */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: .45, ease: EASE_EXPO }}
                      className="overflow-hidden">

                      {/* Left border — orange */}
                      <div className="mt-5 pl-4 sm:pl-8 border-l-2" style={{ borderColor: C.p(.28) }}>
                        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5" stagger={0.08} from="bottom">
                          {group.projects.map((project, i) => (
                            <GlowCard key={project.id} accent={C.gold}>
                              <TiltCard intensity={7}>
                                <Link to={`/R_AND_D/${project.id}`}>
                                  <motion.div
                                    whileHover={{ y: -6, boxShadow: `0 18px 44px ${C.p(.14)}` }}
                                    className="relative rounded-xl overflow-hidden h-full bg-white transition-all"
                                    style={{ border: `1px solid ${C.border}` }}>  {/* ✅ white card, gray border */}

                                    {/* hover tint */}
                                    <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                                      style={{ background: `linear-gradient(135deg,${C.p(.04)},${C.pd(.02)})` }} />

                                    {/* top color bar */}
                                    <div className="h-1" style={{ background: `linear-gradient(90deg,${C.dark},${C.gold})` }} />

                                    <div className="relative p-4 sm:p-5">
                                      {/* Header badges */}
                                      <div className="flex items-start justify-between mb-3">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                                          style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#3b82f6" }}>
                                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                          {project.domain}
                                        </span>
                                        <span className="text-xs px-2 py-1 rounded-full"
                                          style={{ background: C.light, border: `1px solid ${C.border}`, color: "rgba(26,26,26,0.5)" }}>
                                          {project.timeline}
                                        </span>
                                      </div>

                                      {/* Title — dark text on white */}
                                      <h4 className="text-sm sm:text-base font-bold mb-2 leading-snug line-clamp-2"
                                        style={{ color: C.text }}>
                                        {project.title}
                                      </h4>

                                      {/* Desc */}
                                      <p className="text-xs sm:text-sm mb-3 line-clamp-2"
                                        style={{ color: "rgba(26,26,26,0.55)" }}>
                                        {project.desc}
                                      </p>

                                      {/* Impact card — orange tint on white */}
                                      <div className="p-3 rounded-lg mb-3"
                                        style={{ background: C.p(.07), border: `1px solid ${C.p(.18)}` }}>
                                        <p className="text-[10px] sm:text-xs font-semibold mb-1 flex items-center gap-1" style={{ color: C.dark }}>
                                          <Rocket className="w-3 h-3" />
                                          Impact
                                        </p>
                                        <p className="text-[10px] sm:text-xs line-clamp-2" style={{ color: "rgba(26,26,26,0.68)" }}>
                                          {project.impact}
                                        </p>
                                      </div>

                                      {/* Footer */}
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] sm:text-xs" style={{ color: "rgba(26,26,26,0.42)" }}>
                                          <Users className="w-3 h-3" />
                                          <span>{project.teamSize}</span>
                                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                                          <span className="truncate max-w-[100px]">
                                            {project.technologies?.slice(0, 2).join(", ")}
                                            {project.technologies?.length > 2 ? "…" : ""}
                                          </span>
                                        </div>
                                        <motion.span
                                          className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold"
                                          style={{ color: C.dark }}
                                          animate={{ x: [0, 3, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                                          View Details
                                          <ChevronRight className="w-3 h-3" />
                                        </motion.span>
                                      </div>
                                    </div>
                                  </motion.div>
                                </Link>
                              </TiltCard>
                            </GlowCard>
                          ))}
                        </StaggerContainer>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </Reveal>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ResearchProjects;