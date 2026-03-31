import {
  motion, AnimatePresence, useInView, useScroll, useTransform,
  useSpring, useMotionValue, useVelocity,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  TrendingUp, Search, Share2, Mail, BarChart3, ChevronDown,
  Target, Users, Zap, X, CheckCircle, Rocket, Briefcase,
  Building2, GraduationCap, Sparkles, Award, Clock, HeadphonesIcon,
  PieChart, Radio, Megaphone, Globe, Smartphone, Eye, ChevronRight,
  Star,ArrowRight,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import StrategyButton from "./StrategyButton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

/* ══════════════════════════════════════════════
   BRAND COLOR MAP  (green → orange)
   ─────────────────────────────────────────────
   #1E301E       →  #E66B26   dark/primary
   #2E7D32       →  #C5531A   mid/primary-dark
   #E8F5E9       →  #FFF4ED   light
   #C8E6C9       →  #FFD5B8   tint
   #F0EBE0       →  #FFF0E6   warmBg
   rgba(30,48,30)→  rgba(230,107,38)
   rgba(46,125,50)→ rgba(197,83,26)
   #1a2e1a       →  #3D1A0A   veryDark
   #D4AF37       →  #D4AF37   gold (unchanged)
══════════════════════════════════════════════ */
const C = {
  dark:     "#E66B26",
  mid:      "#C5531A",
  gold:     "#D4AF37",
  light:    "#FFF4ED",
  text:     "#1A1A1A",
  tint:     "#FFD5B8",
  warmBg:   "#FFF0E6",
  veryDark: "#3D1A0A",
  p:  (a) => `rgba(230,107,38,${a})`,
  pd: (a) => `rgba(197,83,26,${a})`,
};

const EASE_EXPO = [0.16, 1, 0.3, 1];
const EASE_BACK = [0.34, 1.56, 0.64, 1];

const NAV_SECTIONS = ["dm-hero", "dm-stats", "dm-services", "dm-why", "dm-faq"];
const NAV_LABELS   = ["Top", "Stats", "Services", "Why Us", "FAQ"];

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
function MagBtn({ children, className = "", onClick, type = "button", disabled = false, style = {} }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 16 });
  const sy = useSpring(y, { stiffness: 250, damping: 16 });
  return (
    <motion.button ref={ref} type={type} disabled={disabled} style={{ x: sx, y: sy, ...style }}
      onMouseMove={e => { if (!disabled) { const r = ref.current.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * .38); y.set((e.clientY - r.top - r.height / 2) * .38); } }}
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
      <div ref={outer} className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9998]"
        style={{ border: hov ? `1.5px solid ${C.gold}` : `1.5px solid ${C.p(.45)}`, background: hov ? `${C.p(.07)}` : "transparent", willChange: "transform", transition: "border-color .15s,background .15s" }} />
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

/* ══ SECTION NAV DOTS — orange active ══ */
function SectionNavDots() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries =>
        entries.forEach(e => {
          if (e.isIntersecting) {
            const i = NAV_SECTIONS.indexOf(e.target.id);
            if (i !== -1) setActive(i);
          }
        }),
      { threshold: 0.3 }
    );

    NAV_SECTIONS.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });

    return () => obs.disconnect();
  }, []);

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-[900] flex-col gap-4 hidden md:flex">
      {NAV_SECTIONS.map((id, i) => (
        <motion.button
  key={i}
  onClick={() =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }
  className="relative flex items-center justify-center"
  title={NAV_LABELS[i]}
>
  {/* 🔹 DOT */}
  <motion.div
    animate={{
      scale: active === i ? 1.4 : 1,
      background: active === i ? "#D4AF37" : "rgba(230,107,38,0.4)"
    }}
    transition={{ type: "spring", stiffness: 300, damping: 22 }}
    className="w-2.5 h-2.5 rounded-full"
  />

  {/* 🔥 RING */}
  {active === i && (
    <motion.div
      layoutId="pf-nav-pulse"
      className="absolute inset-0 rounded-full"
      style={{ border: "1.5px solid #D4AF37" }}
      animate={{ scale: [1.5, 2.2, 1.5], opacity: [0.6, 0, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  )}

  {/* 🔥 ARROW (OUTSIDE LEFT) */}
  {active === i && (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute right-6" 
    >
      <ArrowRight className="w-4 h-4 text-black" />
    </motion.div>
  )}
</motion.button>
      ))}
    </div>
  );
}

/* ══ NOISE CANVAS — warm orange tints ══ */
function NoiseCanvas({ color1 = C.tint, color2 = C.warmBg, opacity = 0.24 }) {
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
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y); if (d < 90) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = color.replace(/[\d.]+\)$/, `${(1 - d / 90) * .065})`); ctx.stroke(); } }
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

  // Extract ONLY first number (not all numbers)
  const match = String(value).match(/\d+/);
  const num = match ? parseInt(match[0]) : 0;

  // Keep original format
  const original = String(value);

  const mv = useMotionValue(0);
  const sp = useSpring(mv, { stiffness: 55, damping: 14 });
  const [display, setDisplay] = useState(num);

  useEffect(() => {
    mv.set(inV ? num : 0);
  }, [inV]);

  useEffect(() => {
    sp.on("change", v => {
      const rounded = Math.round(v);

      // Replace only first number in original string
      const updated = original.replace(/\d+/, rounded);

      setDisplay(updated);
    });
  }, [sp, original]);

  return <span ref={ref}>{display}</span>;
}

/* ══════════════════════════════════════════════
   DATA
══════════════════════════════════════════════ */
const services = [
  { icon: <Search className="w-8 h-8" />, title: "Search Engine Optimization", desc: "Improve your website's visibility and ranking on search engines for increased organic traffic", features: ["Keyword Research", "On-Page SEO", "Technical SEO", "Link Building", "Local SEO", "SEO Audits"] },
  { icon: <Share2 className="w-8 h-8" />, title: "Social Media Marketing", desc: "Build brand awareness and engage with your audience across all major social platforms", features: ["Content Creation", "Community Management", "Social Advertising", "Influencer Marketing", "Analytics", "Strategy Planning"] },
  { icon: <Target className="w-8 h-8" />, title: "Paid Advertising", desc: "Drive targeted traffic and conversions through strategic paid advertising campaigns", features: ["Google Ads", "Facebook Ads", "LinkedIn Ads", "Display Advertising", "Retargeting", "Campaign Optimization"] },
  { icon: <TrendingUp className="w-8 h-8" />, title: "Content Marketing", desc: "Create valuable content that attracts, engages, and converts your target audience", features: ["Content Strategy", "Blog Writing", "Video Content", "Infographics", "E-books", "Content Distribution"] },
  { icon: <Mail className="w-8 h-8" />, title: "Email & WhatsApp Marketing", desc: "Nurture leads and maintain customer relationships through personalized messaging", features: ["Email Campaigns", "WhatsApp Business", "Automation", "Segmentation", "A/B Testing", "Performance Tracking"] },
  { icon: <BarChart3 className="w-8 h-8" />, title: "Analytics & Reporting", desc: "Track, measure, and optimize your marketing performance with detailed insights", features: ["Google Analytics", "Conversion Tracking", "ROI Analysis", "Custom Dashboards", "Monthly Reports", "Data Visualization"] },
];

const targetAudience = [
  { title: "Startups & Scale-ups", desc: "Accelerate growth and establish market presence in competitive landscapes", icon: Rocket, segment: "Company Size: 1-50 employees", solutions: ["Growth hacking strategies", "Viral marketing campaigns", "Influencer partnerships", "Data-driven optimization"] },
  { title: "Small & Medium Businesses", desc: "Scale operations and dominate markets with digital presence", icon: Briefcase, segment: "Company Size: 50-500 employees", solutions: ["Local SEO dominance", "Omnichannel marketing", "Customer experience optimization", "Automation implementation"] },
  { title: "Enterprise Corporations", desc: "Drive enterprise-wide digital transformation and maintain market leadership", icon: Building2, segment: "Company Size: 500+ employees", solutions: ["Enterprise marketing automation", "Global campaign orchestration", "Advanced analytics platforms", "Cross-channel attribution"] },
  { title: "E-commerce & DTC Brands", desc: "Maximize online revenue and optimize customer lifetime value", icon: Globe, segment: "Business Model: Direct-to-consumer", solutions: ["Performance marketing mastery", "Conversion rate optimization", "Customer data platforms", "Personalized shopping experiences"] },
];

const achievements = [
  { icon: TrendingUp, value: "150%", label: "Average Revenue Growth", desc: "Within 12 months of partnership" },
  { icon: Users,      value: "300%", label: "Lead Generation",        desc: "Improvement in qualified leads" },
  { icon: Eye,        value: "200%", label: "Brand Visibility",       desc: "Increase in online presence" },
  { icon: Award,      value: "4:1",  label: "ROI",                    desc: "Average return on investment" },
];

const whyChooseUs = [
  { icon: "📊", title: "Data-Driven Approach",  desc: "Every decision backed by comprehensive analytics and insights" },
  { icon: "🎯", title: "Targeted Strategies",   desc: "Customized campaigns designed for your specific audience and goals" },
  { icon: "💰", title: "ROI Focused",           desc: "Maximize your marketing budget with proven strategies that deliver results" },
  { icon: "🚀", title: "Rapid Growth",          desc: "Accelerate your business growth with scalable marketing solutions" },
  { icon: "🤝", title: "Dedicated Support",     desc: "Personal account manager and 24/7 support for all your needs" },
  { icon: "📈", title: "Proven Results",        desc: "Track record of success across various industries and business sizes" },
];

const faqs = [
  { q: "How long does it take to see results from digital marketing?", a: "Results vary by channel. SEO typically takes 3-6 months, while paid advertising can show results within days. Social media and content marketing usually show significant results within 2-3 months." },
  { q: "What's the minimum budget required for digital marketing?", a: "We work with budgets starting from $1,000/month. The budget depends on your goals, industry competition, and chosen channels. We'll recommend the optimal allocation for maximum ROI." },
  { q: "Do you work with businesses in all industries?", a: "Yes, we have experience across various industries including healthcare, education, e-commerce, technology, real estate, and more. We adapt our strategies to each industry's unique requirements." },
  { q: "How do you measure and report on campaign performance?", a: "We provide detailed monthly reports with key metrics, insights, and recommendations. You'll have access to real-time dashboards and regular strategy calls to discuss performance." },
  { q: "Can you help with both B2B and B2C marketing?", a: "Absolutely! We have specialized teams for both B2B and B2C marketing, each with expertise in the unique strategies and channels that work best for each audience type." },
];

const useCases = [
  { industry: "Healthcare",   icon: "🏥", image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop", challenge: "Build trust and attract patients in a competitive market", solution: "Content marketing, local SEO, and reputation management", results: ["40% increase in appointments","60% improvement in online reviews","200% growth in website traffic"] },
  { industry: "Education",    icon: "🎓", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop", challenge: "Increase student enrollment and brand awareness", solution: "Social media campaigns, targeted advertising, and content marketing", results: ["50% increase in inquiries","30% higher enrollment rate","150% social media growth"] },
  { industry: "Real Estate",  icon: "🏠", image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop", challenge: "Generate quality leads and showcase properties effectively", solution: "Facebook advertising, SEO, and virtual tour marketing", results: ["300% increase in leads","25% faster property sales","80% improvement in lead quality"] },
  { industry: "E-commerce",   icon: "🛒", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop", challenge: "Reduce customer acquisition cost and increase sales", solution: "Google Shopping ads, email automation, and retargeting", results: ["45% reduction in CAC","120% increase in revenue","35% improvement in conversion rate"] },
  { industry: "Technology",   icon: "💻", image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop", challenge: "Establish thought leadership and generate B2B leads", solution: "LinkedIn marketing, content marketing, and webinar campaigns", results: ["200% increase in qualified leads","150% growth in brand mentions","60% improvement in sales cycle"] },
  { industry: "Hospitality",  icon: "🏨", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop", challenge: "Increase bookings and improve online reputation", solution: "Social media marketing, review management, and local SEO", results: ["70% increase in direct bookings","4.8/5 average rating","90% improvement in local visibility"] },
];

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
function DigitalMarketing() {
  const [openFaq, setOpenFaq] = useState(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showExpertPopup, setShowExpertPopup] = useState(false);
  const [auditForm, setAuditForm] = useState({ name: "", email: "", phone: "", company: "", website: "", industry: "", currentMarketing: "", goals: "", budget: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuditSubmit = async (e) => {
    e.preventDefault(); setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/marketing-audit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(auditForm) });
      const data = await res.json();
      if (data.success) { alert("Thank you! We'll contact you within 24 hours with your free marketing audit."); setAuditForm({ name: "", email: "", phone: "", company: "", website: "", industry: "", currentMarketing: "", goals: "", budget: "" }); setShowAuditModal(false); }
      else { const msg = data.errors ? data.errors.map(e => e.msg || e.message).join(", ") : data.message; alert("Error: " + msg); }
    } catch { alert("Error submitting form. Please check if the server is running."); }
    finally { setIsSubmitting(false); }
  };

  /* hero parallax */
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], [0, -100]);
  const heroO = useTransform(heroScroll, [0, .6], [1, 0.9]);
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
    window.addEventListener("mousemove", fn); return () => window.removeEventListener("mousemove", fn);
  }, []);

  return (
    <div className="bg-white text-[#1A1A1A] min-h-screen overflow-x-hidden">
      <CustomCursor />
      <ScrollProgressBar />
      <SectionNavDots />
      <Navbar />

      {/* ══ HERO ══ */}
      <section id="dm-hero" ref={heroRef} className="relative min-h-screen flex items-center px-4 sm:px-6 overflow-hidden">
        {/* noise: warm orange tints (was #C8E6C9, #F0EBE0) */}
        <NoiseCanvas color1={C.tint} color2={C.warmBg} opacity={0.24} />
        <div className="absolute inset-0 z-[1]"><ParticleCanvas count={20} /></div>

        {/* animated gradient — orange (was rgba(46,125,50,0.18)) */}
        <motion.div className="absolute inset-0 z-[2] opacity-22"
          animate={{ background: [
            `radial-gradient(circle at 20% 30%,${C.pd(.18)} 0%,transparent 40%)`,
            `radial-gradient(circle at 80% 70%,${C.pd(.18)} 0%,transparent 40%)`,
            `radial-gradient(circle at 20% 30%,${C.pd(.18)} 0%,transparent 40%)`,
          ]}}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />

        {/* mouse blobs — warm tint (was #C8E6C9) */}
        <motion.div style={{ x: b1x, y: b1y }} className="absolute top-12 left-[4%] w-[340px] h-[340px] pointer-events-none z-[2]">
          <div className="w-full h-full rounded-full" style={{ filter: "blur(100px)", opacity: .3, background: `radial-gradient(circle,${C.tint},transparent)` }} />
        </motion.div>
        <motion.div style={{ x: b2x, y: b2y }} className="absolute bottom-12 right-[4%] w-[400px] h-[400px] pointer-events-none z-[2]">
          <div className="w-full h-full rounded-full" style={{ filter: "blur(110px)", opacity: .18, background: `radial-gradient(circle,${C.gold},transparent)` }} />
        </motion.div>

        {/* floating orbs — orange tints (was C.dark/#1E301E and C.mid/#2E7D32) */}
        {[
          { t: "22%", l: "7%",  d: 12, c: `${C.gold}44` },
          { t: "35%", r: "9%",  d: 8,  c: C.p(.32)      },
          { b: "28%", l: "13%", d: 14, c: C.pd(.22)     },
          { b: "38%", r: "16%", d: 10, c: `${C.gold}33` },
        ].map((o, i) => (
          <Float key={i} duration={4 + i * .6} delay={i * .4}
            className="absolute z-[2] rounded-full pointer-events-none"
            style={{ top: o.t, bottom: o.b, left: o.l, right: o.r, width: o.d, height: o.d, background: o.c }} />
        ))}

        {/* floating marketing emojis — drop-shadow orange (was rgba(212,175,55,0.3)) */}
        <Float className="absolute top-[18%] left-[6%] hidden lg:block z-[2]" duration={4} yRange={22} delay={0}>
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}
            className="text-6xl" style={{ opacity: .22, filter: `drop-shadow(0 8px 24px ${C.p(.3)})` }}>📈</motion.div>
        </Float>
        <Float className="absolute top-[25%] right-[10%] hidden lg:block z-[2]" duration={3} yRange={18} delay={.8}>
          <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}
            className="text-5xl" style={{ opacity: .2, filter: `drop-shadow(0 8px 24px ${C.p(.3)})` }}>📢</motion.div>
        </Float>
        <Float className="absolute bottom-[28%] left-[12%] hidden lg:block z-[2]" duration={5} yRange={16} delay={1.5}>
          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.18, 0.28, 0.18] }} transition={{ duration: 2.5, repeat: Infinity }}
            className="text-4xl">🎯</motion.div>
        </Float>
        <Float className="absolute bottom-[22%] right-[8%] hidden lg:block z-[2]" duration={4.5} yRange={20} delay={.5}>
          <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="text-5xl" style={{ opacity: .2 }}>📱</motion.div>
        </Float>

        {/* kinetic bg text — orange tint (was rgba(30,48,30,0.018)) */}
        <motion.div style={{ y: bigY }} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-[2]">
          <span className="font-black leading-none tracking-tighter uppercase whitespace-nowrap"
            style={{ fontSize: "16vw", color: C.p(.022) }}>MARKETING</span>
        </motion.div>

        {/* dot grid — dark orange-brown (was #1E301E) */}
        <div className="absolute inset-0 z-[2] opacity-[.03] pointer-events-none"
          style={{ backgroundImage: `radial-gradient(circle,${C.veryDark} 1px,transparent 1px)`, backgroundSize: "28px 28px" }} />

        <motion.div style={{ y: heroY, opacity: heroO, scale: heroS }} className="max-w-6xl mx-auto text-center relative z-10 w-full pt-20">

          {/* badge — orange (was rgba(30,48,30,0.12/0.28)) */}
          <motion.div initial={{ scale: .7, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ duration: .65, ease: EASE_BACK }} className="inline-block mb-8">
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold backdrop-blur-sm shadow-lg"
              style={{ background: C.p(.12), border: `1px solid ${C.p(.28)}`, color: C.mid }}>
              <motion.span animate={{ opacity: [.7, 1, .7] }} transition={{ duration: 2, repeat: Infinity }} className="text-[#D4AF37]">✦</motion.span>
              Results-Driven Digital Marketing
              <motion.span animate={{ opacity: [.7, 1, .7] }} transition={{ duration: 2, repeat: Infinity }} className="text-[#D4AF37]">✦</motion.span>
            </span>
          </motion.div>

          {/* heading — orange gradient (was from-[#1E301E] to-[#2E7D32]) */}
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3, duration: .75, ease: EASE_EXPO }}
            className="font-bold mb-6 leading-tight"
            style={{ fontSize: "clamp(2.4rem,7vw,4.6rem)" }}>
            <span style={{ color: C.text }}>Marketing Strategies </span><br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
              That Drives Scalable Growth
            </span>
          </motion.h1>

          {/* sub */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .5, ease: EASE_EXPO }}
            className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10 px-4 rounded-2xl border backdrop-blur-sm p-6"
            style={{ color: C.text, borderColor: "rgba(229,231,235,0.8)", background: "rgba(255,255,255,0.35)" }}>
            We help brands boost visibility, generate quality leads, and grow revenue through strategic, data-driven marketing solutions tailored to their business.
          </motion.p>

          {/* CTAs — orange gradient (was from-[#1E301E] to-[#2E7D32]) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .7, ease: EASE_EXPO }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <MagBtn onClick={() => setShowAuditModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-white rounded-full font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-shadow"
              style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})`, boxShadow: `0 8px 28px ${C.p(.3)}` }}>
              Get Free Marketing Audit
              <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </MagBtn>
            {/* secondary CTA — orange border (was borderColor: C.dark=#1E301E) */}
            <MagBtn onClick={() => setShowExpertPopup(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm sm:text-base transition-all border-2"
              style={{ borderColor: C.dark, color: C.dark, background: "transparent" }}>
              Talk to a Marketing Expert
            </MagBtn>
          </motion.div>

          {/* scroll cue — orange border (was rgba(30,48,30,0.25)) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
            className="flex justify-center cursor-pointer"
            onClick={() => document.getElementById("dm-stats")?.scrollIntoView({ behavior: "smooth" })}>
            <Float duration={2} yRange={10}>
              <div className="w-5 h-8 rounded-full flex justify-center" style={{ border: `2px solid ${C.p(.28)}` }}>
                <motion.div className="w-1 h-2 rounded-full mt-2" style={{ background: C.gold }}
                  animate={{ y: [0, 10, 0], opacity: [1, .4, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
              </div>
            </Float>
          </motion.div>
        </motion.div>
      </section>

      {/* ══ STATS ══ */}
      <WaveDivider color={C.gold} toBg={C.light} />
      <section id="dm-stats" className="py-16 px-4 sm:px-6 relative overflow-hidden" style={{ background: C.light }}>
        <NoiseCanvas opacity={0.18} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          {/* kinetic text — orange (was text-[#1E301E]/[0.022]) */}
          <motion.span className="font-black leading-none tracking-tighter uppercase"
            style={{ fontSize: "18vw", color: C.p(.048) }}
            animate={{ y: [0, -10, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}>
            RESULTS
          </motion.span>
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <SLabel text="Our Impact" />
            <AHeading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]"
              delay={.05}>
              Proven Results That Speak
            </AHeading>
          </div>
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" stagger={0.1} from="bottom">
            {achievements.map((s, i) => (
              <GlowCard key={i} accent={C.gold}>
                <TiltCard>
                  <motion.div whileHover={{ y: -8, boxShadow: "0 24px 55px rgba(0,0,0,0.10)" }}
                    className="bg-white p-6 rounded-xl border border-gray-200 transition-all text-center cursor-default shadow-sm"
                    style={{ borderColor: "rgb(229,231,235)" }}>
                    <Float duration={4 + i * .5} delay={i * .25}>
                      <motion.div whileHover={{ rotate: 360, scale: 1.15 }} transition={{ duration: .5 }}>
                        <s.icon className="w-7 h-7 sm:w-8 sm:h-8 mx-auto mb-3" style={{ color: C.gold }} />
                      </motion.div>
                    </Float>
                    {/* value: orange (was C.dark=#1E301E) */}
                    <div className="text-2xl sm:text-3xl font-black mb-1" style={{ color: C.dark }}>
                      <Counter value={s.value} />
                    </div>
                    <div className="text-xs sm:text-sm font-semibold mb-1" style={{ color: C.dark }}>{s.label}</div>
                    <p className="text-[10px] sm:text-xs" style={{ color: "rgba(26,26,26,0.55)" }}>{s.desc}</p>
                  </motion.div>
                </TiltCard>
              </GlowCard>
            ))}
          </StaggerContainer>
        </div>
      </section>
      <WaveDivider color={C.gold} flip toBg="#fff" />

      {/* ══ WHO WE HELP ══ */}
      <section className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        <Spotlight color={C.p(.04)} />
        {/* dot grid — dark orange-brown (was #1E301E) */}
        <div className="absolute inset-0 opacity-[.025]"
          style={{ backgroundImage: `radial-gradient(circle,${C.veryDark} 1px,transparent 1px)`, backgroundSize: "28px 28px" }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <SLabel text="Who We Help" />
            <AHeading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]"
              style={{ backgroundImage: `linear-gradient(135deg,${C.dark},${C.mid})` }} delay={.05}>
              Tailored for Every Business
            </AHeading>
            <Reveal from="bottom" delay={.15}>
              <p className="text-sm sm:text-base mt-4 max-w-2xl mx-auto" style={{ color: "rgba(26,26,26,0.62)" }}>
                Tailored marketing solutions for businesses at every stage
              </p>
            </Reveal>
          </div>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" stagger={0.1} from="bottom">
            {targetAudience.map((audience, i) => {
              const Icon = audience.icon;
              return (
                <GlowCard key={i} accent={C.gold}>
                  <TiltCard intensity={8}>
                    <motion.div whileHover={{ y: -8, boxShadow: `0 24px 55px ${C.p(.1)}` }}
                      className="group bg-white p-6 rounded-xl border border-gray-200 transition-all shadow-sm h-full overflow-hidden"
                      style={{ borderColor: "rgb(229,231,235)" }}>
                      {/* hover gradient — orange tints (was from-[#1E301E]/5 to-[#2E7D32]/5) */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: `linear-gradient(135deg,${C.p(.05)},${C.pd(.05)})` }} />
                      <Float duration={4 + i * .4} delay={i * .25}>
                        {/* icon box — orange gradient (was from-[#1E301E] to-[#2E7D32]) */}
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md"
                          style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </Float>
                      <h3 className="text-base sm:text-lg font-bold mb-1 transition-colors" style={{ color: C.text }}>{audience.title}</h3>
                      {/* segment label — orange (was C.dark #1E301E + 99) */}
                      <p className="text-[10px] sm:text-xs font-medium mb-2" style={{ color: `${C.dark}99` }}>{audience.segment}</p>
                      <p className="text-xs sm:text-sm mb-4" style={{ color: "rgba(26,26,26,0.65)" }}>{audience.desc}</p>
                      <div>
                        <p className="text-[10px] sm:text-xs font-semibold mb-2" style={{ color: C.dark }}>Strategic Solutions:</p>
                        <ul className="space-y-1.5">
                          {audience.solutions.map((sol, j) => (
                            <li key={j} className="flex items-center gap-2 text-[10px] sm:text-xs transition-colors" style={{ color: C.text }}>
                              <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: C.gold }} />
                              {sol}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* bottom bar — gold → mid (unchanged) */}
                      <motion.div className="absolute bottom-0 left-0 right-0 h-1"
                        style={{ background: `linear-gradient(90deg,${C.gold},${C.mid})`, transformOrigin: "left", scaleX: 0 }}
                        whileHover={{ scaleX: 1 }} transition={{ duration: .3 }} />
                    </motion.div>
                  </TiltCard>
                </GlowCard>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ══ SERVICES ══ */}
      <WaveDivider color={C.gold} toBg={C.light} />
      <section id="dm-services" className="py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background: C.light }}>
        <NoiseCanvas opacity={0.18} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <motion.span className="font-black leading-none tracking-tighter uppercase"
            style={{ fontSize: "14vw", color: C.p(.048) }}
            animate={{ y: [0, -12, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>
            SERVICES
          </motion.span>
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <SLabel text="What We Do" />
            <AHeading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]"
              style={{ backgroundImage: `linear-gradient(135deg,${C.dark},${C.mid})` }} delay={.05}>
              Services We Offer
            </AHeading>
            <Reveal from="bottom" delay={.15}>
              <p className="text-sm sm:text-base mt-4 max-w-2xl mx-auto" style={{ color: "rgba(26,26,26,0.62)" }}>
                Comprehensive marketing solutions to drive your business growth
              </p>
            </Reveal>
          </div>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" stagger={0.09} from="bottom">
            {services.map((service, i) => (
              <GlowCard key={i} accent={C.gold}>
                <TiltCard intensity={8}>
                  <motion.div whileHover={{ y: -8, boxShadow: `0 24px 55px ${C.p(.1)}` }}
                    className="group bg-white p-5 sm:p-6 rounded-xl border border-gray-200 transition-all shadow-sm h-full overflow-hidden"
                    style={{ borderColor: "rgb(229,231,235)" }}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(135deg,${C.p(.05)},${C.pd(.05)})` }} />
                    <Float duration={4 + i * .4} delay={i * .2}>
                      <motion.div whileHover={{rotate:360,scale:1.2}} transition={{duration:.5}} className="text-[#D4AF37] mb-4 inline-block">
                        {service.icon}
                      </motion.div>
                    </Float>
                    <h3 className="text-base sm:text-lg font-bold mb-2 transition-colors" style={{ color: C.text }}>{service.title}</h3>
                    <p className="text-xs sm:text-sm mb-4" style={{ color: "rgba(26,26,26,0.65)" }}>{service.desc}</p>
                    <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                      {service.features.map((feature, j) => (
                        <div key={j} className="flex items-center gap-1.5 text-[10px] sm:text-xs" style={{ color: "rgba(26,26,26,0.7)" }}>
                          <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: C.gold }} />
                          <span className="truncate">{feature}</span>
                        </div>
                      ))}
                    </div>
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

      {/* ══ INDUSTRY USE CASES ══ */}
      <section className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        <Spotlight color={C.p(.04)} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <SLabel text="Case Studies" />
            <AHeading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]"
              style={{ backgroundImage: `linear-gradient(135deg,${C.dark},${C.mid})` }} delay={.05}>
              Industry Success Stories
            </AHeading>
            <Reveal from="bottom" delay={.15}>
              <p className="text-sm sm:text-base mt-4 max-w-2xl mx-auto" style={{ color: "rgba(26,26,26,0.62)" }}>Real results across diverse industries</p>
            </Reveal>
          </div>
          <Reveal from="bottom" delay={.1}>
            <Swiper modules={[Autoplay, Pagination]} spaceBetween={16} slidesPerView={1}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              breakpoints={{ 640: { slidesPerView: 2, spaceBetween: 20 }, 1024: { slidesPerView: 3, spaceBetween: 24 } }}
              className="pb-10">
              {useCases.map((uc, i) => (
                <SwiperSlide key={i}>
                  <GlowCard accent={C.gold} className="h-full">
                    <TiltCard intensity={5}>
                      <motion.div whileHover={{ y: -6, boxShadow: `0 24px 55px ${C.p(.12)}` }}
                        className="bg-white rounded-xl border border-gray-200 transition-all h-full overflow-hidden shadow-sm"
                        style={{ borderColor: "rgb(229,231,235)" }}>
                        <div className="relative h-32 sm:h-40 overflow-hidden">
                          <motion.img src={uc.image} alt={uc.industry} className="w-full h-full object-cover"
                            whileHover={{ scale: 1.06 }} transition={{ duration: .55 }} />
                          {/* overlay — dark orange (was rgba(13,31,13,0.55)) */}
                          <div className="absolute inset-0" style={{ background: `linear-gradient(to top,${C.pd(.55)},transparent 60%)` }} />
                          <div className="absolute top-2 left-2 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs backdrop-blur-sm"
                            style={{ background: "rgba(255,255,255,0.9)", border: "1px solid #e5e7eb", color: C.text }}>
                            {uc.icon} {uc.industry}
                          </div>
                        </div>
                        <div className="p-4 sm:p-5">
                          <p className="text-xs sm:text-sm mb-2" style={{ color: "rgba(26,26,26,0.8)" }}>
                            <span className="font-semibold" style={{ color: C.text }}>Challenge:</span> {uc.challenge}
                          </p>
                          <p className="text-xs sm:text-sm mb-3" style={{ color: "rgba(26,26,26,0.8)" }}>
                            <span className="font-semibold" style={{ color: C.text }}>Solution:</span> {uc.solution}
                          </p>
                          <div className="space-y-1.5">
                            {uc.results.map((r, j) => (
                              <div key={j} className="flex items-center gap-1.5 text-[10px] sm:text-xs" style={{ color: C.dark }}>
                                <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: C.gold }} />
                                {r}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </TiltCard>
                  </GlowCard>
                </SwiperSlide>
              ))}
            </Swiper>
          </Reveal>
        </div>
      </section>

      {/* ══ WHY CHOOSE US ══ */}
      <WaveDivider color={C.gold} toBg={C.light} />
      <section id="dm-why" className="py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background: C.light }}>
        <NoiseCanvas opacity={0.18} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <motion.span className="font-black leading-none tracking-tighter uppercase"
            style={{ fontSize: "14vw", color: C.p(.048) }}
            animate={{ y: [0, -12, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>
            WHY US
          </motion.span>
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <SLabel text="Why Choose Us" />
            <AHeading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]"
              style={{ backgroundImage: `linear-gradient(135deg,${C.dark},${C.mid})` }} delay={.05}>
              What Makes Us Different
            </AHeading>
            <Reveal from="bottom" delay={.15}>
              <p className="text-sm sm:text-base mt-4 max-w-2xl mx-auto" style={{ color: "rgba(26,26,26,0.62)" }}>What sets us apart from other marketing agencies</p>
            </Reveal>
          </div>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" stagger={0.09} from="bottom">
            {whyChooseUs.map((reason, i) => (
              <GlowCard key={i} accent={C.gold}>
                <TiltCard>
                  <motion.div whileHover={{ y: -8, boxShadow: `0 24px 55px ${C.p(.1)}` }}
                    className="group bg-white p-5 sm:p-6 rounded-xl border border-gray-200 transition-all text-center shadow-sm h-full overflow-hidden"
                    style={{ borderColor: "rgb(229,231,235)" }}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(135deg,${C.p(.05)},${C.pd(.05)})` }} />
                    <Float duration={4 + i * .4} delay={i * .25}>
                      <div className="text-3xl sm:text-4xl mb-3">{reason.icon}</div>
                    </Float>
                    <h3 className="text-sm sm:text-base font-bold mb-2 transition-colors" style={{ color: C.text }}>{reason.title}</h3>
                    <p className="text-xs sm:text-sm" style={{ color: "rgba(26,26,26,0.65)" }}>{reason.desc}</p>
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

      {/* ══ FAQ ══ */}
      <section id="dm-faq" className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        <Spotlight color={C.p(.04)} />
        <div className="absolute inset-0 opacity-[.025]"
          style={{ backgroundImage: `radial-gradient(circle,${C.veryDark} 1px,transparent 1px)`, backgroundSize: "28px 28px" }} />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <SLabel text="Common Questions" />
            <AHeading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]"
              style={{ backgroundImage: `linear-gradient(135deg,${C.dark},${C.mid})` }} delay={.05}>
              Frequently Asked Questions
            </AHeading>
            <Reveal from="bottom" delay={.15}>
            </Reveal>
          </div>
          <StaggerContainer className="space-y-3 sm:space-y-4" stagger={0.08} from="bottom">
            {faqs.map((faq, i) => (
              <GlowCard key={i} accent={openFaq === i ? C.gold : C.dark}>
                <motion.div className="bg-white rounded-xl overflow-hidden transition-all"
                  style={{ border: `1px solid ${openFaq === i ? C.gold : "#e5e7eb"}`, boxShadow: openFaq === i ? `0 6px 24px ${C.gold}28` : undefined }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-4 sm:p-5 text-left flex justify-between items-center gap-2 transition-all"
                    style={{ background: openFaq === i ? C.light : "#fff" }}>
                    <h3 className="text-xs sm:text-sm font-semibold pr-2" style={{ color: C.text }}>{faq.q}</h3>
                    <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: .3 }}>
                      <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: C.gold }} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-gray-100">
                          <p className="text-xs sm:text-sm leading-relaxed pt-3" style={{ color: "rgba(26,26,26,0.72)" }}>{faq.a}</p>
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

      {/* ══ FINAL CTA ══ */}
      {/* toBg: very dark orange-brown (was #1a2e1a) */}
      <WaveDivider color={C.gold} toBg={C.veryDark} />
      {/* bg: orange gradient (was linear-gradient(135deg,#1E301E,#2E7D32)) */}
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
        <Spotlight color={`${C.gold}09`} />
        {/* particles: gold (unchanged) */}
        <div className="absolute inset-0"><ParticleCanvas count={14} color={`${C.gold}11`} /></div>
        {[100, 180, 260].map((s, i) => (
          <Float key={i} duration={6 + i * 2} yRange={12} delay={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
            style={{ width: s, height: s, border: `1px solid ${C.gold}18` }} />
        ))}
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Reveal from="top">
            <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8"
              style={{ border: `1px solid ${C.gold}38`, background: `${C.gold}14` }}>
              <motion.div animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 2.8, repeat: Infinity }}>
                <Star className="w-4 h-4" style={{ color: C.gold }} />
              </motion.div>
              <span className="text-sm font-bold" style={{ color: C.gold }}>Ready to Grow?</span>
            </div>
          </Reveal>
          <Reveal from="bottom" delay={.1}>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Accelerate Your Growth?</h2>
          </Reveal>
          <Reveal from="bottom" delay={.2}>
            <p className="text-sm sm:text-base text-white/80 mb-8 max-w-2xl mx-auto">
              Let's create a data-driven marketing strategy that delivers measurable results for your business.
            </p>
          </Reveal>
          <Reveal from="bottom" delay={.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <MagBtn onClick={() => setShowAuditModal(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-white rounded-full font-semibold text-sm sm:text-base border-2 border-white hover:bg-black transition-all">
                Get Free Marketing Audit
                <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              </MagBtn>
              <StrategyButton />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ EXPERT POPUP ══ */}
      <AnimatePresence>
        {showExpertPopup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
            onClick={() => setShowExpertPopup(false)}>
            <motion.div initial={{ opacity: 0, scale: .9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-md w-full border border-gray-200 shadow-2xl overflow-hidden">
              {/* header — orange gradient (was from-[#1E301E] to-[#2E7D32]) */}
              <div className="p-4" style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
                <h2 className="text-base sm:text-lg font-bold text-white">Contact Our Marketing Expert</h2>
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-sm sm:text-base mb-4" style={{ color: "rgba(26,26,26,0.75)" }}>
                  Please contact us. We will guide you with the best marketing strategy and required information.
                </p>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 text-sm" style={{ color: C.text }}>
                    <HeadphonesIcon className="w-4 h-4" style={{ color: C.gold }} />
                    +91 98765 43210
                  </div>
                  <div className="flex items-center gap-3 text-sm" style={{ color: C.text }}>
                    <Mail className="w-4 h-4" style={{ color: C.gold }} />
                    marketing@stackenzo.com
                  </div>
                </div>
                {/* close button — orange gradient */}
                <MagBtn onClick={() => setShowExpertPopup(false)}
                  className="w-full px-4 py-2.5 text-white rounded-xl text-sm font-bold transition-all"
                  style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
                  Close
                </MagBtn>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ AUDIT MODAL ══ */}
      <AnimatePresence>
        {showAuditModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
            onClick={() => setShowAuditModal(false)}>
            <motion.div initial={{ opacity: 0, scale: .9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
              {/* sticky header — orange gradient */}
              <div className="sticky top-0 p-4 flex justify-between items-center z-10 rounded-t-2xl"
                style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
                <h2 className="text-base sm:text-lg font-bold text-white">Free Marketing Audit</h2>
                <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: .9 }}
                  onClick={() => setShowAuditModal(false)} className="text-white p-1 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </div>
              <form onSubmit={handleAuditSubmit} className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                {[
                  [{ type: "text", ph: "Full Name *", field: "name", req: true }, { type: "email", ph: "Email Address *", field: "email", req: true }],
                  [{ type: "tel", ph: "Phone Number *", field: "phone", req: true }, { type: "text", ph: "Company Name *", field: "company", req: true }],
                ].map((row, ri) => (
                  <div key={ri} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {row.map(f => (
                      <input key={f.field} type={f.type} placeholder={f.ph} value={auditForm[f.field]} required={f.req}
                        onChange={e => setAuditForm({ ...auditForm, [f.field]: e.target.value })}
                        className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-xl text-xs sm:text-sm placeholder-gray-400 focus:outline-none transition-colors"
                        style={{ color: C.text, outlineColor: C.dark }}
                        onFocus={e => e.target.style.borderColor = C.dark}
                        onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                    ))}
                  </div>
                ))}
                <input type="url" placeholder="Website URL" value={auditForm.website}
                  onChange={e => setAuditForm({ ...auditForm, website: e.target.value })}
                  className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-xl text-xs sm:text-sm placeholder-gray-400 focus:outline-none transition-colors"
                  style={{ color: C.text }}
                  onFocus={e => e.target.style.borderColor = C.dark}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                <select value={auditForm.industry} required
                  onChange={e => setAuditForm({ ...auditForm, industry: e.target.value })}
                  className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none transition-colors"
                  style={{ color: C.text }}
                  onFocus={e => e.target.style.borderColor = C.dark}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}>
                  <option value="">Select Industry *</option>
                  {["Healthcare","Education","Real Estate","E-commerce","Technology","Hospitality","Other"].map(o => <option key={o}>{o}</option>)}
                </select>
                <textarea placeholder="Current Marketing Efforts" value={auditForm.currentMarketing} rows="2"
                  onChange={e => setAuditForm({ ...auditForm, currentMarketing: e.target.value })}
                  className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-xl text-xs sm:text-sm placeholder-gray-400 focus:outline-none resize-none transition-colors"
                  style={{ color: C.text }}
                  onFocus={e => e.target.style.borderColor = C.dark}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                <textarea placeholder="Marketing Goals *" value={auditForm.goals} rows="2" required
                  onChange={e => setAuditForm({ ...auditForm, goals: e.target.value })}
                  className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-xl text-xs sm:text-sm placeholder-gray-400 focus:outline-none resize-none transition-colors"
                  style={{ color: C.text }}
                  onFocus={e => e.target.style.borderColor = C.dark}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                <select value={auditForm.budget} required
                  onChange={e => setAuditForm({ ...auditForm, budget: e.target.value })}
                  className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none transition-colors"
                  style={{ color: C.text }}
                  onFocus={e => e.target.style.borderColor = C.dark}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}>
                  <option value="">Monthly Marketing Budget *</option>
                  {["Under $1,000","$1,000 - $5,000","$5,000 - $10,000","$10,000 - $25,000","$25,000+"].map(o => <option key={o}>{o}</option>)}
                </select>
                {/* submit button — orange gradient */}
                <MagBtn type="submit" disabled={isSubmitting}
                  className="w-full px-4 py-3 text-white rounded-xl text-sm sm:text-base font-semibold disabled:opacity-50 transition-all shadow-sm hover:shadow-md"
                  style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
                  {isSubmitting ? "Submitting…" : "Get My Free Audit"}
                </MagBtn>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default DigitalMarketing;