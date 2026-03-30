import {
  motion, AnimatePresence, useInView, useScroll, useTransform,
  useSpring, useMotionValue, useVelocity,
} from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Bot, Heart, Sparkles, Users, Clock, Target, ChevronDown,
  Brain, Rocket, Trophy, Star, BookOpen, Zap, Award,
  Smile, Lightbulb, Compass, GraduationCap, Gamepad2,
  MessageCircle, ChevronRight, CheckCircle, X,
  School, UsersRound, HandHeart, Shield, TrendingUp,
  Calendar, BookMarked,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import Footer from "./Footer";
import RoboticsEnrollmentModal from "./RoboticsEnrollmentModal";

/* ══════════════════════════════════════════════
   BRAND COLOR MAP  (green → orange)
   ─────────────────────────────────────────────
   #1E301E       →  #E66B26   dark/primary
   #2E7D32       →  #C5531A   mid/primary-dark
   #E8F5E9       →  #FFF4ED   light
   #C8E6C9       →  #FFD5B8   tint (noise/blobs)
   #B2DFDB       →  #FFCBA4   tint2
   #F0EBE0       →  #FFF0E6   warmBg
   rgba(30,48,30)→  rgba(230,107,38)
   rgba(46,125,50)→ rgba(197,83,26)
   #1a2e1a/#0d1f0d → #3D1A0A  veryDark
   #D4AF37       →  #D4AF37   gold (unchanged)
══════════════════════════════════════════════ */
const C = {
  dark:     "#E66B26",
  mid:      "#C5531A",
  gold:     "#D4AF37",
  light:    "#FFF4ED",
  text:     "#1A1A1A",
  tint:     "#FFD5B8",
  tint2:    "#FFCBA4",
  warmBg:   "#FFF0E6",
  veryDark: "#3D1A0A",
  p:  (a) => `rgba(230,107,38,${a})`,
  pd: (a) => `rgba(197,83,26,${a})`,
};

const EASE_EXPO = [0.16, 1, 0.3, 1];
const EASE_BACK = [0.34, 1.56, 0.64, 1];

const NAV_SECTIONS = ["rb-hero", "rb-intro", "rb-why", "rb-journey", "rb-faq"];
const NAV_LABELS   = ["Top", "Intro", "Why Us", "Journey", "FAQ"];

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
    right:  { hidden: { x: 55, opacity: 0 }, visible: { x: 0, opacity: 1 }, exit: { x: -38, opacity: 0 } },
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
        style={{ inset: -1, background: `radial-gradient(320px circle at ${pos.x}px ${pos.y}px,${accent}30,transparent 60%)` }} />
      <motion.div className="absolute inset-0 rounded-2xl pointer-events-none z-0"
        animate={inV ? { opacity: [.28, .6, .28] } : { opacity: 0 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ boxShadow: `inset 0 0 0 1px ${accent}38` }} />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

/* ══ TILT CARD ══ */
function TiltCard({ children, className = "", intensity = 10 }) {
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

/* ══ MAG BTN ══ */
function MagBtn({ children, className = "", onClick, type = "button", style = {} }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 16 });
  const sy = useSpring(y, { stiffness: 250, damping: 16 });
  return (
    <motion.button ref={ref} type={type} style={{ x: sx, y: sy, ...style }}
      onMouseMove={e => { const r = ref.current.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * .38); y.set((e.clientY - r.top - r.height / 2) * .38); }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileTap={{ scale: .94 }} onClick={onClick} className={className}>
      {children}
    </motion.button>
  );
}

/* ══ CUSTOM CURSOR — orange ══ */
function CustomCursor() {
  const outer = useRef(null), dot = useRef(null), trail = useRef(null);
  const pos = useRef({ x: -300, y: -300 }), sm = useRef({ x: -300, y: -300 });
  const [hov, setHov] = useState(false), [clk, setClk] = useState(false);
  useEffect(() => {
    const mv = e => { pos.current = { x: e.clientX, y: e.clientY }; };
    const md = () => setClk(true), mu = () => setClk(false);
    document.addEventListener("mousemove", mv); document.addEventListener("mousedown", md); document.addEventListener("mouseup", mu);
    const att = () => { document.querySelectorAll("a,button,[data-hover]").forEach(el => { el.addEventListener("mouseenter", () => setHov(true)); el.addEventListener("mouseleave", () => setHov(false)); }); };
    att(); const ob = new MutationObserver(att); ob.observe(document.body, { childList: true, subtree: true });
    let id;
    const loop = () => {
      sm.current.x += (pos.current.x - sm.current.x) * .09; sm.current.y += (pos.current.y - sm.current.y) * .09;
      const s = clk ? .65 : hov ? 2.1 : 1;
      if (outer.current) outer.current.style.transform = `translate(${sm.current.x - 20}px,${sm.current.y - 20}px) scale(${s})`;
      if (dot.current)   dot.current.style.transform   = `translate(${pos.current.x - 3}px,${pos.current.y - 3}px) scale(${clk ? 1.9 : 1})`;
      if (trail.current) trail.current.style.transform = `translate(${sm.current.x - 30}px,${sm.current.y - 30}px) scale(${hov ? 1.6 : .5})`;
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => { document.removeEventListener("mousemove", mv); document.removeEventListener("mousedown", md); document.removeEventListener("mouseup", mu); ob.disconnect(); cancelAnimationFrame(id); };
  }, [hov, clk]);
  return (
    <>
      {/* border: was rgba(30,48,30,0.45) → rgba(230,107,38,0.45) */}
      <div ref={outer} className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9998]"
        style={{ border: hov ? `1.5px solid ${C.gold}` : `1.5px solid ${C.p(.45)}`, background: hov ? `${C.p(.07)}` : "transparent", willChange: "transform", transition: "border-color .15s, background .15s" }} />
      {/* dot: was #1E301E → #E66B26 */}
      <div ref={dot} className="fixed top-0 left-0 w-[6px] h-[6px] rounded-full pointer-events-none z-[9999]"
        style={{ background: hov ? C.gold : C.dark, willChange: "transform", transition: "background .1s" }} />
      <div ref={trail} className="fixed top-0 left-0 w-[60px] h-[60px] rounded-full pointer-events-none z-[9996] opacity-[.09]"
        style={{ background: "radial-gradient(circle,#D4AF37,transparent)", willChange: "transform" }} />
    </>
  );
}

/* ══ SCROLL PROGRESS BAR — orange gradient ══ */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    /* was: #0d1f0d,#1E301E,#D4AF37,#2E7D32,#D4AF37 */
    <motion.div className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[9997]"
      style={{ scaleX, background: `linear-gradient(90deg,${C.veryDark},${C.mid},${C.gold},${C.dark},${C.gold})` }} />
  );
}

/* ══ SECTION NAV DOTS — orange active ══ */
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
          className="relative flex items-center gap-2 group" title={NAV_LABELS[i]}>
          <motion.span initial={{ opacity: 0, x: 8 }} animate={{ opacity: active === i ? 1 : 0, x: active === i ? 0 : 8 }}
            className="absolute right-6 text-[11px] font-bold bg-[#0f0f0f]/80 backdrop-blur-sm px-2 py-1 rounded-md whitespace-nowrap pointer-events-none"
            style={{ color: C.gold }}></motion.span>
          {/* inactive: was rgba(30,48,30,0.4) → rgba(230,107,38,0.4) */}
          <motion.div animate={{ scale: active === i ? 1.4 : 1, background: active === i ? C.gold : C.p(.4) }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }} className="w-2.5 h-2.5 rounded-full" />
          {active === i && (
            <motion.div layoutId="rb-nav-pulse" className="absolute inset-0 rounded-full"
              style={{ scale: 2, border: `1.5px solid ${C.gold}`, opacity: .5 }}
              animate={{ scale: [2, 2.8, 2], opacity: [.5, 0, .5] }} transition={{ duration: 1.8, repeat: Infinity }} />
          )}
        </motion.button>
      ))}
    </div>
  );
}

/* ══ NOISE CANVAS — warm orange tints ══ */
function NoiseCanvas({ color1 = C.tint, color2 = C.tint2, opacity = 0.26 }) {
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

/* ══ PARTICLE CANVAS — orange particles ══ */
function ParticleCanvas({ count = 22, color = C.p(.08) }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let w = c.width = c.offsetWidth, h = c.height = c.offsetHeight;
    const pts = Array.from({ length: count }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .38, vy: (Math.random() - .5) * .38, r: Math.random() * 1.8 + .8 }));
    let id;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      pts.forEach(p => { p.x += p.vx; p.y += p.vy; if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); });
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 90) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = color.replace(/[\d.]+\)$/, `${(1 - d / 90) * .065})`); ctx.stroke(); }
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
function Spotlight({ color = C.p(.07), size = 600 }) {
  const ref = useRef(null);
  useEffect(() => {
    const fn = e => { if (!ref.current) return; const r = ref.current.getBoundingClientRect(); ref.current.style.background = `radial-gradient(${size}px circle at ${e.clientX - r.left}px ${e.clientY - r.top}px,${color},transparent 70%)`; };
    window.addEventListener("mousemove", fn); return () => window.removeEventListener("mousemove", fn);
  }, []);
  return <div ref={ref} className="absolute inset-0 pointer-events-none z-[1]" />;
}

/* ══ WAVE DIVIDER ══ */
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

/* ══ SECTION LABEL — orange ══ */
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
function AHeading({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: false, margin: "-50px" });
  const dir = useScrollDir();
  const words = typeof children === "string" ? children.split(" ") : [children];
  return (
    <h2 ref={ref} className={className}>
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
    </h2>
  );
}

/* ══ COUNTER ══ */
function Counter({ value }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: false });
  const raw = value.replace(/[^0-9]/g, "");
  const num = parseInt(raw, 10) || 0;
  const sfx = value.replace(/[0-9]/g, "");
  const mv  = useMotionValue(0);
  const sp  = useSpring(mv, { stiffness: 55, damping: 14 });
  const [d, setD] = useState(0);
  useEffect(() => { mv.set(inV ? num : 0); }, [inV]);
  useEffect(() => sp.on("change", v => setD(Math.round(v))), [sp]);
  return <span ref={ref}>{raw ? d : value}{raw ? sfx : ""}</span>;
}

/* ══ DATA ══ */
const classProgression = [
  { level: "Foundation Level", title: "Explore & Play",   icon: "🎮", points: ["Introduction to robotics through games", "Free exploration and curiosity-based learning", "Touch, build, and experiment"], benefit: "Students discover the joy of building and creating" },
  { level: "Intermediate Level", title: "Think & Control", icon: "🧠", points: ["Simple logic and control", "Understanding how ideas become actions", "Fun challenges and teamwork"], benefit: "Students develop logical thinking skills" },
  { level: "Advanced Level", title: "Solve & Create",     icon: "⚙️", points: ["Small real-life problem-solving projects", "Structured thinking", "Team-based activities"], benefit: "Students learn to solve real problems confidently" },
  { level: "Master Level", title: "Design & Innovate",    icon: "🚀", points: ["Designing solutions", "Creative thinking", "Confidence and presentation skills"], benefit: "Students become confident creators and innovators" },
];

const faqs = [
  { q: "Why start robotics from Class 6?", a: "Class 6 is the perfect age where curiosity is at its peak, independent thinking begins, and students love exploring. Starting early helps them grow with technology naturally instead of learning it later with fear." },
  { q: "How many hours per week?", a: "Only 1-3 hours per week. We believe learning doesn't need long hours—it needs the right experience. This ensures no academic burden and high excitement for every session." },
  { q: "Are there exams or marks?", a: "No exams. No fear of marks. Only curiosity, exploration, and confidence building. Robotics here is a play-and-learn experience where mistakes are allowed and encouraged as learning opportunities." },
  { q: "What will students learn?", a: "Students will develop problem-solving ability, logical and creative thinking, teamwork, communication, and confidence to express ideas—skills that stay with them for life." },
];

const benefits = [
  { icon: Brain,   title: "Sharper Thinking",     desc: "Watch them figure out challenges on their own" },
  { icon: Rocket,  title: "Confidence to Create", desc: "From 'I can't' to 'I built this!'.with confidence and pride" },
  { icon: Trophy,  title: "Learning Together",    desc: "Collaboration skills that last a lifetime" },
  { icon: Star,    title: "Future-Ready Skills",  desc: "Early exposure to tomorrow's technology" },
];

const stats = [
  { icon: Users,  value: "500+",    label: "Students Enrolled" },
  { icon: Clock,  value: "1-3 hrs", label: "Per Week" },
  { icon: Trophy, value: "50+",     label: "Projects Built" },
  { icon: Smile,  value: "98%",     label: "Happy Students" },
];

const whyChoose = [
  { icon: HandHeart,  title: "Stress-Free Learning",   desc: "Just pure joy of discovery, without pressure." },
  { icon: TrendingUp, title: "Future-Ready Skills",    desc: "Prepare students for tomorrow's world" },
  { icon: Shield,     title: "Safe Environment",       desc: "Guided learning in a supportive atmosphere" },
  { icon: BookMarked, title: "Structured Curriculum",  desc: "Ready-to-use program that fits any schedule" },
];

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
function Robotics() {
  const [openFaq,       setOpenFaq]       = useState(null);
  const [isModalOpen,   setIsModalOpen]   = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  /* hero parallax */
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], [0, -100]);
  const heroO = useTransform(heroScroll, [0, .6], [1, 0]);
  const heroS = useTransform(heroScroll, [0, 1], [1, .85]);
  const bigY  = useTransform(heroScroll, [0, 1], [0, 160]);

  /* mouse parallax */
  const mx = useMotionValue(0), my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 35, damping: 18 });
  const smy = useSpring(my, { stiffness: 35, damping: 18 });
  const b1x = useTransform(smx, [-1, 1], [-22, 22]);
  const b1y = useTransform(smy, [-1, 1], [-14, 14]);
  const b2x = useTransform(smx, [-1, 1], [16, -16]);
  const b2y = useTransform(smy, [-1, 1], [12, -12]);
  useEffect(() => {
    const fn = e => { mx.set((e.clientX / window.innerWidth - .5) * 2); my.set((e.clientY / window.innerHeight - .5) * 2); };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  return (
    <div className="bg-white text-[#1A1A1A] min-h-screen overflow-x-hidden">
      <Toaster position="top-center" />
      <CustomCursor />
      <ScrollProgressBar />
      <SectionNavDots />
      <Navbar />

      {/* ══ HERO ══ */}
      <section id="rb-hero" ref={heroRef} className="relative pt-28 sm:pt-36 pb-20 px-4 sm:px-6 overflow-hidden min-h-screen flex items-center">
        {/* noise: warm tints (was #C8E6C9/#F0EBE0) */}
        <NoiseCanvas color1={C.tint} color2={C.warmBg} opacity={0.24} />
        <div className="absolute inset-0 z-[1]"><ParticleCanvas count={20} /></div>

        {/* animated gradient — orange (was rgba(46,125,50,0.18)) */}
        <motion.div className="absolute inset-0 z-[2] opacity-25"
          animate={{ background: [
            `radial-gradient(circle at 20% 30%,${C.pd(.18)} 0%,transparent 40%)`,
            `radial-gradient(circle at 80% 70%,${C.pd(.18)} 0%,transparent 40%)`,
            `radial-gradient(circle at 20% 30%,${C.pd(.18)} 0%,transparent 40%)`,
          ]}}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />

        {/* mouse-parallax blobs — warm tint (was #C8E6C9) */}
        <motion.div style={{ x: b1x, y: b1y }} className="absolute top-12 left-[4%] w-[340px] h-[340px] pointer-events-none z-[2]">
          <div className="w-full h-full rounded-full" style={{ filter: "blur(100px)", opacity: .32, background: `radial-gradient(circle,${C.tint},transparent)` }} />
        </motion.div>
        <motion.div style={{ x: b2x, y: b2y }} className="absolute bottom-12 right-[4%] w-[400px] h-[400px] pointer-events-none z-[2]">
          <div className="w-full h-full rounded-full" style={{ filter: "blur(110px)", opacity: .2, background: `radial-gradient(circle,${C.gold},transparent)` }} />
        </motion.div>

        {/* floating orbs — orange tints (was C.dark/#1E301E and C.mid/#2E7D32) */}
        {[
          { t: "22%", l: "7%",  d: 12, c: `${C.gold}44` },
          { t: "35%", r: "9%",  d: 8,  c: C.p(.32)      },
          { b: "25%", l: "13%", d: 14, c: C.pd(.22)     },
          { b: "35%", r: "16%", d: 10, c: `${C.gold}33` },
        ].map((o, i) => (
          <Float key={i} duration={4 + i * .6} delay={i * .4}
            className="absolute z-[2] rounded-full pointer-events-none"
            style={{ top: o.t, bottom: o.b, left: o.l, right: o.r, width: o.d, height: o.d, background: o.c }} />
        ))}

        {/* robot emojis — drop-shadow orange tint */}
        <Float className="absolute top-[18%] right-[8%] hidden lg:block z-[2]" duration={4} yRange={22} delay={0}>
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}
            className="text-7xl" style={{ opacity: .18, filter: `drop-shadow(0 8px 24px ${C.p(.3)})` }}>🤖</motion.div>
        </Float>
        <Float className="absolute bottom-[22%] left-[6%] hidden lg:block z-[2]" duration={5} yRange={20} delay={1.2}>
          <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 5, repeat: Infinity }}
            className="text-7xl" style={{ opacity: .16, filter: `drop-shadow(0 8px 24px ${C.p(.3)})` }}>🦾</motion.div>
        </Float>
        <Float className="absolute top-[55%] right-[5%] hidden lg:block z-[2]" duration={6} yRange={16} delay={2}>
          <span className="text-5xl" style={{ opacity: .12 }}>⚙️</span>
        </Float>

        {/* kinetic bg text — orange (was rgba(30,48,30,0.018)) */}
        <motion.div style={{ y: bigY }} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-[2]">
          <span className="font-black leading-none tracking-tighter uppercase whitespace-nowrap"
            style={{ fontSize: "20vw", color: C.p(.022) }}>ROBOTICS</span>
        </motion.div>

        {/* dot grid — dark orange-brown (was #1E301E) */}
        <div className="absolute inset-0 z-[2] opacity-[.03] pointer-events-none"
          style={{ backgroundImage: `radial-gradient(circle,${C.veryDark} 1px,transparent 1px)`, backgroundSize: "28px 28px" }} />

        <motion.div style={{ y: heroY, opacity: heroO, scale: heroS }} className="max-w-6xl mx-auto text-center relative z-10 w-full">

          {/* badge — orange bg/border (was rgba(30,48,30,0.12/0.28)) */}
          <motion.div initial={{ scale: .7, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ duration: .65, ease: EASE_BACK }} className="inline-block mb-8">
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold backdrop-blur-sm shadow-lg"
              style={{ background: C.p(.12), border: `1px solid ${C.p(.28)}`, color: C.mid }}>
              <motion.span animate={{ opacity: [.7, 1, .7] }} transition={{ duration: 2, repeat: Infinity }} className="text-[#D4AF37]">✦</motion.span>
              School Robotics Program — Classes 6 to 9
              <motion.span animate={{ opacity: [.7, 1, .7] }} transition={{ duration: 2, repeat: Infinity }} className="text-[#D4AF37]">✦</motion.span>
            </span>
          </motion.div>

          {/* heading gradient — orange (was from-[#1E301E] to-[#2E7D32]) */}
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3, duration: .75, ease: EASE_EXPO }}
            className="font-bold mb-6 leading-tight"
            style={{ fontSize: "clamp(2.4rem,7vw,4.6rem)" }}>
            <span style={{ color: C.text }}>Where Young Minds</span><br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
              Build the Future
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .5, ease: EASE_EXPO }}
            className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-10 px-4 rounded-2xl border backdrop-blur-sm p-6"
            style={{ color: C.text, borderColor: "rgba(229,231,235,0.8)", background: "rgba(255,255,255,0.35)" }}>
            Where Learning Feels Like Play and Ideas Come Alive
          </motion.p>

          {/* stat pills */}
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .7, ease: EASE_EXPO }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto mb-10 px-2">
            {stats.map((s, i) => (
              <Float key={i} duration={4 + i * .5} delay={i * .3}>
                <GlowCard accent={C.gold}>
                  <motion.div whileHover={{ y: -5, boxShadow: `0 14px 32px ${C.p(.1)}` }}
                    className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 text-center cursor-default">
                    {/* icon: gold unchanged */}
                    <s.icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2" style={{ color: C.gold }} />
                    <div className="text-lg sm:text-2xl font-black" style={{ color: C.text }}>
                      <Counter value={s.value} />
                    </div>
                    <div className="text-xs sm:text-sm" style={{ color: "rgba(26,26,26,0.6)" }}>{s.label}</div>
                  </motion.div>
                </GlowCard>
              </Float>
            ))}
          </motion.div>

          {/* CTA — orange gradient (was from-[#1E301E] to-[#2E7D32]) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .85, ease: EASE_EXPO }}>
            <MagBtn onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-8 sm:px-10 py-3 sm:py-4 text-white rounded-full font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-shadow"
              style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})`, boxShadow: `0 8px 28px ${C.p(.3)}` }}>
              <span>Enroll Now</span>
              <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ChevronRight className="w-5 h-5" />
              </motion.div>
            </MagBtn>
          </motion.div>

          {/* scroll cue — border: orange (was rgba(30,48,30,0.25)) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
            className="flex justify-center mt-12 cursor-pointer"
            onClick={() => document.getElementById("rb-intro")?.scrollIntoView({ behavior: "smooth" })}>
            <Float duration={2} yRange={10}>
              <div className="w-5 h-8 rounded-full flex justify-center" style={{ border: `2px solid ${C.p(.28)}` }}>
                <motion.div className="w-1 h-2 rounded-full mt-2" style={{ background: C.gold }}
                  animate={{ y: [0, 10, 0], opacity: [1, .4, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
              </div>
            </Float>
          </motion.div>
        </motion.div>
      </section>

      {/* ══ INTRO ══ */}
      <section id="rb-intro" className="scroll-mt-20 py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        {/* spotlight: orange (was rgba(30,48,30,0.04)) */}
        <Spotlight color={C.p(.04)} />
        {/* dot grid: dark orange-brown (was #1E301E) */}
        <div className="absolute inset-0 opacity-[.025]" style={{ backgroundImage: `radial-gradient(circle,${C.veryDark} 1px,transparent 1px)`, backgroundSize: "28px 28px" }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <SLabel text="Our Program" />
          {/* gradient: orange (was from-[#1E301E] to-[#2E7D32]) */}
          <AHeading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]"
           delay={.05}>
            Robotics the Way It Should Be
          </AHeading>
          <Reveal from="bottom" delay={.1}>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed mb-8" style={{ color: C.text }}>
              We introduce robotics at the school level to help students learn technology in the most enjoyable way possible.
              Our program is specially designed for <span className="font-semibold" style={{ color: C.dark }}>Classes 6 to 9</span>, where learning happens naturally through fun, games, and hands-on activities.
            </p>
          </Reveal>
          <Reveal from="scale" delay={.2}>
            <GlowCard accent={C.gold} className="inline-block">
              <TiltCard intensity={5}>
                {/* bg: light orange (was C.light=#E8F5E9); border: gold unchanged */}
                <motion.div whileHover={{ boxShadow: `0 20px 50px ${C.gold}2e` }}
                  className="rounded-2xl p-6 sm:p-8 border-2"
                  style={{ background: C.light, borderColor: C.gold }}>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold" style={{ color: C.dark }}>
                    Students look forward to every session — not as a subject, but as an adventure.
                  </p>
                </motion.div>
              </TiltCard>
            </GlowCard>
          </Reveal>
        </div>
      </section>

      {/* ══ WHY CHOOSE ══ */}
      <WaveDivider color={C.gold} toBg={C.light} />
      {/* bg: light orange (was #E8F5E9) */}
      <section id="rb-why" className="py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background: C.light }}>
        <NoiseCanvas opacity={0.2} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          {/* kinetic text: orange (was text-[#1E301E]/[0.022]) */}
          <motion.span className="font-black leading-none tracking-tighter uppercase"
            style={{ fontSize: "15vw", color: C.p(.048) }}
            animate={{ y: [0, -12, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}>
            WHY US
          </motion.span>
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <SLabel text="Why Stackenzo" />
            <AHeading className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]"
              delay={.05}>
              Why Choose Our Robotics Program
            </AHeading>
          </div>
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" stagger={0.1} from="bottom">
            {whyChoose.map((item, i) => (
              <GlowCard key={i} accent={C.gold}>
                <TiltCard intensity={8}>
                  <motion.div whileHover={{ y: -8, boxShadow: `0 24px 55px ${C.p(.1)}` }}
                    className="group bg-white p-6 rounded-xl border border-gray-200 transition-all shadow-sm h-full overflow-hidden"
                    style={{ borderColor: "rgb(229,231,235)" }}>
                    {/* hover gradient: orange (was from-[#1E301E]/5 to-[#2E7D32]/5) */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(135deg,${C.p(.05)},${C.pd(.05)})` }} />
                    <Float duration={4 + i * .4} delay={i * .25}>
                      <motion.div whileHover={{ rotate: 360, scale: 1.2 }} transition={{ duration: .5 }}>
                        <item.icon className="w-10 h-10 sm:w-12 sm:h-12 mb-4" style={{ color: C.gold }} />
                      </motion.div>
                    </Float>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 transition-colors" style={{ color: C.text }}>{item.title}</h3>
                    <p className="text-sm sm:text-base" style={{ color: "rgba(26,26,26,0.68)" }}>{item.desc}</p>
                    {/* bottom bar: gold → mid (was C.gold → C.mid) */}
                    <motion.div className="absolute bottom-0 left-0 right-0 h-1"
                      style={{ background: `linear-gradient(90deg,${C.gold},${C.mid})`, transformOrigin: "left", scaleX: 0 }}
                      whileHover={{ scaleX: 1 }} transition={{ duration: .3 }} />
                  </motion.div>
                </TiltCard>
              </GlowCard>
            ))}
          </StaggerContainer>
        </div>
      </section>
      <WaveDivider color={C.gold} flip toBg="#fff" />

      {/* ══ STUDENT GAINS ══ */}
      <section className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        <Spotlight color={C.p(.04)} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <SLabel text="Student Outcomes" />
            <AHeading className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]"
            delay={.05}>
              What Students Gain
            </AHeading>
          </div>
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" stagger={0.1} from="bottom">
            {benefits.map((b, i) => (
              <GlowCard key={i} accent={C.gold}>
                <TiltCard>
                  <motion.div whileHover={{ y: -8, boxShadow: `0 24px 55px ${C.p(.1)}` }}
                    className="group p-6 rounded-xl border border-gray-200 transition-all shadow-sm h-full"
                    style={{ background: C.light }}>
                    <Float duration={4 + i * .4} delay={i * .25}>
                      <motion.div whileHover={{ rotate: 360, scale: 1.15 }} transition={{ duration: .5 }}>
                        <b.icon className="w-10 h-10 sm:w-12 sm:h-12 mb-4" style={{ color: C.gold }} />
                      </motion.div>
                    </Float>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 transition-colors" style={{ color: C.text }}>{b.title}</h3>
                    <p className="text-sm sm:text-base" style={{ color: "rgba(26,26,26,0.68)" }}>{b.desc}</p>
                  </motion.div>
                </TiltCard>
              </GlowCard>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ══ HANDS-ON GIF ══ */}
      <WaveDivider color={C.gold} toBg={C.light} />
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background: C.light }}>
        <NoiseCanvas opacity={0.18} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-14">
            <div className="lg:w-1/2">
              <SLabel text="Hands-On Learning" />
              <AHeading className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]"
              delay={.05}>
                Experience Hands-On Robotics
              </AHeading>
              <Reveal from="left" delay={.1}>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed mb-6" style={{ color: C.text }}>
                  Watch students bring robots to life! From basic movements to complex autonomous behaviors, our robotics education program transforms theoretical knowledge into practical skills.
                </p>
              </Reveal>
              <StaggerContainer className="space-y-3" stagger={0.09} from="left">
                {["Interactive robot programming", "Real-time sensor integration", "Autonomous navigation systems", "Team-based challenges"].map((item, i) => (
                  <GlowCard key={i} accent={C.gold}>
                    <motion.div whileHover={{ x: 4 }}
                      className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 transition-all shadow-sm"
                      style={{ borderColor: "rgb(229,231,235)" }}>
                      <Float duration={3.5 + i * .3} delay={i * .2}>
                        {/* checkmark: gold unchanged */}
                        <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: C.gold }} />
                      </Float>
                      <span className="text-sm sm:text-base font-medium" style={{ color: C.text }}>{item}</span>
                    </motion.div>
                  </GlowCard>
                ))}
              </StaggerContainer>
            </div>

            <Reveal from="right" delay={.1} className="lg:w-1/2">
              <GlowCard accent={C.gold}>
                <TiltCard intensity={6}>
                  <motion.div whileHover={{ boxShadow: "0 32px 80px rgba(0,0,0,0.14)" }}
                    className="relative group bg-white p-3 sm:p-4 rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                    <img src="https://media.giphy.com/media/5k5vZwRFZR5aZeniqb/giphy.gif"
                      alt="Robot in action" className="w-full h-auto rounded-lg" loading="lazy"
                      onError={e => { e.target.onerror = null; e.target.src = "https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif"; }} />
                    {/* shimmer: gold unchanged */}
                    <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
                      animate={{ opacity: [0, .08, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      style={{ background: `linear-gradient(135deg,${C.gold},transparent)` }} />
                    <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.8),transparent)" }}>
                      <p className="font-semibold text-sm sm:text-base" style={{ color: C.gold }}>Live Robot Demo</p>
                      <p className="text-gray-300 text-xs">See robotics in action</p>
                    </div>
                  </motion.div>
                </TiltCard>
              </GlowCard>
            </Reveal>
          </div>
        </div>
      </section>
      <WaveDivider color={C.gold} flip toBg="#fff" />

      {/* ══ WHY START EARLY ══ */}
      <section className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        <Spotlight color={C.p(.04)} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <SLabel text="Early Advantage" />
            <AHeading className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]"
            delay={.05}>
              Where Curiosity Builds Robots
            </AHeading>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <Reveal from="left" delay={.05}>
                <p className="text-lg sm:text-xl mb-6" style={{ color: C.text }}>This is the moment curiosity takes flight:</p>
              </Reveal>
              <StaggerContainer className="space-y-3" stagger={0.09} from="left">
                {[
                  { icon: Lightbulb, text: "Curiosity is at its peak" },
                  { icon: Brain,     text: "Independent thinking begins" },
                  { icon: Compass,   text: "Students love exploring and experimenting" },
                  { icon: Gamepad2,  text: "Learning through play works best" },
                ].map((item, i) => (
                  <GlowCard key={i} accent={C.gold}>
                    <motion.div whileHover={{ x: 4, boxShadow: `0 8px 24px ${C.p(.07)}` }}
                      className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 transition-all"
                      style={{ background: C.light }}>
                      <Float duration={3.5 + i * .3} delay={i * .2}>
                        <item.icon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" style={{ color: C.gold }} />
                      </Float>
                      <span className="text-sm sm:text-base" style={{ color: C.text }}>{item.text}</span>
                    </motion.div>
                  </GlowCard>
                ))}
              </StaggerContainer>
            </div>
            <Reveal from="right" delay={.1}>
              <GlowCard accent={C.gold} className="h-full">
                <TiltCard intensity={6}>
                  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm h-full">
                    {/* "students will" label: orange mid (was C.dark=#1E301E) */}
                    <h3 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: C.dark }}>Students will:</h3>
                    <div className="space-y-4">
                      {["Think logically and creatively", "Understand how things work", "Build confidence early", "Grow comfortably with technology"].map((item, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }} transition={{ delay: i * .08 }}
                          className="flex items-start gap-3">
                          {/* bullet circle: light orange (was C.light), border: gold */}
                          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border"
                            style={{ background: C.light, borderColor: `${C.gold}55` }}>
                            <CheckCircle className="w-3.5 h-3.5" style={{ color: C.gold }} />
                          </div>
                          <span className="text-sm sm:text-base" style={{ color: C.text }}>{item}</span>
                        </motion.div>
                      ))}
                    </div>
                    <Reveal from="bottom" delay={.3}>
                      {/* text: orange mid (was C.dark) */}
                      <p className="text-base sm:text-lg font-semibold mt-6" style={{ color: C.dark }}>
                        Instead of learning technology later with fear, students grow with it naturally.
                      </p>
                    </Reveal>
                  </div>
                </TiltCard>
              </GlowCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ WEEKLY HOURS ══ */}
      <WaveDivider color={C.gold} toBg={C.light} />
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background: C.light }}>
        <NoiseCanvas opacity={0.18} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Reveal from="scale">
            <Float duration={4} yRange={10}>
              {/* icon box: orange gradient (was from-[#1E301E] to-[#2E7D32]) */}
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
                <Clock className="w-8 h-8 text-white" />
              </div>
            </Float>
          </Reveal>
          <SLabel text="Time Commitment" />
          <AHeading className="text-2xl sm:text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]"
          delay={.05}>
            Where learning feels like joy ✨
          </AHeading>
          <StaggerContainer className="grid sm:grid-cols-2 gap-4 mb-8" stagger={0.09} from="scale">
            {["Learning without pressure", "No stress or overload", "High excitement for every session", "Better focus and interest"].map((item, i) => (
              <GlowCard key={i} accent={C.gold}>
                <TiltCard intensity={6}>
                  <motion.div whileHover={{ y: -5, boxShadow: `0 14px 32px ${C.p(.08)}` }}
                    className="bg-white p-4 rounded-lg border border-gray-200 transition-all shadow-sm text-center">
                    <p className="text-sm sm:text-base font-medium" style={{ color: C.text }}>{item}</p>
                  </motion.div>
                </TiltCard>
              </GlowCard>
            ))}
          </StaggerContainer>
          <Reveal from="scale" delay={.2}>
            <GlowCard accent={C.gold} className="inline-block">
              {/* border: gold unchanged */}
              <motion.div whileHover={{ boxShadow: `0 20px 50px ${C.gold}33` }}
                className="bg-white p-6 rounded-xl border-2"
                style={{ borderColor: C.gold }}>
                <p className="text-lg sm:text-xl font-bold" style={{ color: C.dark }}>
                  Students wait for robotics class — they never feel forced to attend it.
                </p>
              </motion.div>
            </GlowCard>
          </Reveal>
        </div>
      </section>
      {/* toBg: very dark orange-brown (was #1a2e1a) */}
      <WaveDivider color={C.gold} flip toBg={C.veryDark} />

      {/* ══ FUN SECTION — orange gradient bg (was #1E301E→#2E7D32) ══ */}
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
        <Spotlight color={`${C.gold}09`} />
        <div className="absolute inset-0"><ParticleCanvas count={14} color={`${C.gold}11`} /></div>
        {[100, 180, 260].map((s, i) => (
          <Float key={i} duration={6 + i * 2} yRange={12} delay={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
            style={{ width: s, height: s, border: `1px solid ${C.gold}18` }} />
        ))}
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <Reveal from="top">
              <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-6"
                style={{ border: `1px solid ${C.gold}38`, background: `${C.gold}14` }}>
                <motion.div animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 2.8, repeat: Infinity }}>
                  <Star className="w-4 h-4" style={{ color: C.gold }} />
                </motion.div>
                <span className="text-sm font-bold" style={{ color: C.gold }}>Engagement</span>
              </div>
            </Reveal>
            <Reveal from="bottom" delay={.1}>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">More Fun Than a Game Period</h2>
            </Reveal>
          </div>
          <StaggerContainer className="grid sm:grid-cols-3 gap-4 sm:gap-6" stagger={0.1} from="bottom">
            {[
              { icon: "🎮", text: "More exciting than a game period" },
              { icon: "🤝", text: "More interactive than a normal class" },
              { icon: "🎯", text: "More engaging than theory-based learning" },
            ].map((item, i) => (
              <motion.div key={i} whileHover={{ scale: 1.06, boxShadow: `0 8px 28px ${C.gold}22` }}
                className="p-6 rounded-xl text-center transition-all backdrop-blur-sm"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <Float duration={4 + i * .5} delay={i * .3}>
                  <div className="text-4xl sm:text-5xl mb-3">{item.icon}</div>
                </Float>
                <p className="text-sm sm:text-base font-medium text-white">{item.text}</p>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ══ JOURNEY / CLASS PROGRESSION ══ */}
      <WaveDivider color={C.gold} toBg="#fff" />
      <section id="rb-journey" className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        <Spotlight color={C.p(.04)} />
        <div className="absolute inset-0 opacity-[.025]"
          style={{ backgroundImage: `radial-gradient(circle,${C.veryDark} 1px,transparent 1px)`, backgroundSize: "28px 28px" }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-4">
            <SLabel text="Learning Journey" />
            <AHeading className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]"
            delay={.05}>
              4 Levels of Progression
            </AHeading>
          </div>
          <Reveal from="bottom" delay={.15} className="text-center mb-12">
            <p style={{ color: C.text }}>A progressive 4-level program designed to build skills step by step</p>
          </Reveal>
          <StaggerContainer className="grid sm:grid-cols-2 gap-4 sm:gap-6" stagger={0.09} from="bottom">
            {classProgression.map((item, i) => (
              <GlowCard key={i} accent={selectedClass === i ? C.gold : C.dark}>
                <TiltCard intensity={6}>
                  <motion.div whileHover={{ y: -6 }}
                    onClick={() => setSelectedClass(selectedClass === i ? null : i)}
                    className="bg-white p-6 rounded-2xl cursor-pointer shadow-sm transition-all"
                    style={{ border: `2px solid ${selectedClass === i ? C.gold : "#e5e7eb"}`, boxShadow: selectedClass === i ? `0 8px 28px ${C.gold}38` : undefined }}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Float duration={4 + i * .4} delay={i * .2}>
                          <div className="text-2xl sm:text-3xl mb-2">{item.icon}</div>
                        </Float>
                        {/* level label: orange dark (was C.dark=#1E301E) */}
                        <h3 className="text-base sm:text-lg font-semibold" style={{ color: C.dark }}>{item.level}</h3>
                      </div>
                      <motion.div animate={{ rotate: selectedClass === i ? 180 : 0 }} transition={{ duration: .3 }}>
                        <ChevronDown className="w-5 h-5" style={{ color: C.gold }} />
                      </motion.div>
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold mb-2" style={{ color: C.text }}>{item.title}</h4>
                    {selectedClass !== i && (
                      <p className="text-xs sm:text-sm italic" style={{ color: "rgba(26,26,26,0.6)" }}>{item.benefit}</p>
                    )}
                    <AnimatePresence>
                      {selectedClass === i && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden mt-3 space-y-3">
                          <div className="space-y-2">
                            {item.points.map((point, j) => (
                              <motion.div key={j} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: j * .06 }}
                                className="flex items-start gap-2 text-sm" style={{ color: C.text }}>
                                <span className="mt-1 flex-shrink-0" style={{ color: C.gold }}>•</span>
                                <span>{point}</span>
                              </motion.div>
                            ))}
                          </div>
                          <div className="pt-3 border-t border-gray-200">
                            <p className="text-sm font-medium" style={{ color: C.dark }}>{item.benefit}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {selectedClass !== i && (
                      <p className="text-xs mt-2" style={{ color: "rgba(26,26,26,0.4)" }}>Click to expand</p>
                    )}
                  </motion.div>
                </TiltCard>
              </GlowCard>
            ))}
          </StaggerContainer>
          <Reveal from="bottom" delay={.2} className="text-center mt-10">
            <p className="text-lg sm:text-xl font-bold" style={{ color: C.dark }}>
              Each level adds skills and confidence, not pressure.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <WaveDivider color={C.gold} toBg={C.light} />
      <section id="rb-faq" className="py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background: C.light }}>
        <NoiseCanvas opacity={0.18} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          {/* kinetic text: orange (was text-[#1E301E]/[0.022]) */}
          <motion.span className="font-black leading-none tracking-tighter uppercase"
            style={{ fontSize: "16vw", color: C.p(.048) }}
            animate={{ y: [0, -12, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>
            FAQ
          </motion.span>
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <SLabel text="Common Questions" />
            <AHeading className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]"
              delay={.05}>
              Frequently Asked Questions
            </AHeading>
          </div>
          <StaggerContainer className="space-y-3" stagger={0.08} from="bottom">
            {faqs.map((faq, i) => (
              <GlowCard key={i} accent={openFaq === i ? C.gold : C.dark}>
                <motion.div className="bg-white rounded-xl border overflow-hidden transition-all"
                  style={{ borderColor: openFaq === i ? C.gold : "#e5e7eb", boxShadow: openFaq === i ? `0 6px 24px ${C.gold}28` : undefined }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-4 sm:p-5 text-left flex justify-between items-center gap-3 transition-all"
                    style={{ background: openFaq === i ? C.light : "#fff" }}>
                    <h3 className="font-semibold text-sm sm:text-base md:text-lg pr-2" style={{ color: C.text }}>{faq.q}</h3>
                    <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: .3 }}>
                      <ChevronDown className="w-5 h-5 flex-shrink-0" style={{ color: C.gold }} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden">
                        <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-gray-200">
                          <p className="text-xs sm:text-sm md:text-base pt-3" style={{ color: "rgba(26,26,26,0.72)" }}>{faq.a}</p>
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
      {/* toBg: very dark orange-brown (was #1a2e1a) */}
      <WaveDivider color={C.gold} flip toBg={C.veryDark} />

      {/* ══ PHILOSOPHY BANNER — orange gradient (was #1E301E→#2E7D32) ══ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
        <Spotlight color={`${C.gold}09`} />
        <div className="absolute inset-0"><ParticleCanvas count={12} color={`${C.gold}11`} /></div>
        {[80, 150, 230].map((s, i) => (
          <Float key={i} duration={5 + i * 2} yRange={10} delay={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
            style={{ width: s, height: s, border: `1px solid ${C.gold}18` }} />
        ))}
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Reveal from="top">
            <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-6"
              style={{ border: `1px solid ${C.gold}38`, background: `${C.gold}14` }}>
              <motion.div animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 2.8, repeat: Infinity }}>
                <Star className="w-4 h-4" style={{ color: C.gold }} />
              </motion.div>
              <span className="text-sm font-bold" style={{ color: C.gold }}>Our Philosophy</span>
            </div>
          </Reveal>
          <Reveal from="bottom" delay={.1}>
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-white">Our Philosophy</h2>
          </Reveal>
          <StaggerContainer className="grid grid-cols-5 gap-2 mb-6" stagger={0.08} from="scale">
            {[{ icon: "🌱", text: "Start early" }, { icon: "🪶", text: "Keep light" }, { icon: "🎉", text: "Make fun" }, { icon: "⏰", text: "Limit hours" }, { icon: "🔍", text: "Curiosity" }].map((item, i) => (
              <motion.div key={i} whileHover={{ scale: 1.1, boxShadow: `0 8px 24px ${C.gold}22` }}
                className="p-2 rounded-lg transition-all backdrop-blur-sm"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <Float duration={4 + i * .4} yRange={6} delay={i * .2}>
                  <div className="text-2xl sm:text-3xl mb-1">{item.icon}</div>
                </Float>
                <p className="text-[10px] sm:text-xs font-medium text-white">{item.text}</p>
              </motion.div>
            ))}
          </StaggerContainer>
          <Reveal from="bottom" delay={.2}>
            <motion.div whileHover={{ scale: 1.02, boxShadow: `0 12px 40px ${C.gold}22` }}
              className="rounded-lg p-4 backdrop-blur-sm"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.28)" }}>
              <p className="text-sm sm:text-base font-semibold text-white">
                When learning feels like play, students don't just learn — they thrive.
              </p>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ══ FINAL CTA — gold bg (unchanged) ══ */}
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background: C.gold }}>
        {/* particles: orange (was rgba(30,48,30,0.1)) */}
        <div className="absolute inset-0 z-[1]"><ParticleCanvas count={14} color={C.pd(.12)} /></div>
        {[100, 180].map((s, i) => (
          <Float key={i} duration={5 + i * 2} yRange={10} delay={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
            style={{ width: s, height: s, border: `1px solid ${C.pd(.18)}` }} />
        ))}
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Reveal from="bottom">
            {/* headline: very dark orange (was C.dark=#1E301E) */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4" style={{ color: C.veryDark }}>
              Give Your Child the Gift of Joyful Learning
            </h2>
          </Reveal>
          <Reveal from="bottom" delay={.1}>
            {/* sub: orange transparent (was rgba(30,48,30,0.75)) */}
            <p className="text-base sm:text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ color: C.pd(.75) }}>
              Join our robotics program for Classes 6–9 where learning feels like play and curiosity leads the way.
            </p>
          </Reveal>
          <Reveal from="bottom" delay={.2}>
            {/* CTA button: orange gradient (was from-[#1E301E] to-[#2E7D32]) */}
            <MagBtn onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-8 sm:px-10 py-3 sm:py-4 text-white rounded-full font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-shadow"
              style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})`, boxShadow: `0 8px 28px ${C.pd(.35)}` }}>
              <span>Enroll Your Child Now</span>
              <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ChevronRight className="w-5 h-5" />
              </motion.div>
            </MagBtn>
          </Reveal>
        </div>
      </section>

      <RoboticsEnrollmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Footer />
    </div>
  );
}

export default Robotics;