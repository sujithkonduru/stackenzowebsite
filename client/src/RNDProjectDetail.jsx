import { useParams, Link } from "react-router-dom";
import {
  motion, AnimatePresence, useInView, useScroll, useTransform,
  useSpring, useMotionValue, useVelocity,
} from "framer-motion";
import {
  ArrowLeft, CheckCircle, Clock, Users, Target, Lightbulb, Award,
  Sparkles, ArrowRight, ChevronDown, Microscope, Brain, Code,
  Beaker, FileText, Rocket, Globe2, Layers,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";
import rndData from "./data/rndData.json";
import RNDApplicationModal from "./RNDApplicationModal";

/* ══════════════════════════════════════════════
   EASING
══════════════════════════════════════════════ */
const EASE_EXPO = [0.16, 1, 0.3, 1];
const EASE_BACK = [0.34, 1.56, 0.64, 1];

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
    bottom: { hidden: { y: 65, opacity: 0, scale: .96, filter: "blur(6px)" }, visible: { y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }, exit: { y: -48, opacity: 0, scale: .97, filter: "blur(4px)" } },
    top:    { hidden: { y: -65, opacity: 0, scale: .96, filter: "blur(6px)" }, visible: { y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }, exit: { y: 48, opacity: 0, scale: .97, filter: "blur(4px)" } },
    left:   { hidden: { x: -75, opacity: 0, scale: .96, filter: "blur(6px)" }, visible: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)" }, exit: { x: 55, opacity: 0, scale: .97, filter: "blur(4px)" } },
    right:  { hidden: { x: 75, opacity: 0, scale: .96, filter: "blur(6px)" }, visible: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)" }, exit: { x: -55, opacity: 0, scale: .97, filter: "blur(4px)" } },
    scale:  { hidden: { scale: .75, opacity: 0, filter: "blur(8px)" }, visible: { scale: 1, opacity: 1, filter: "blur(0px)" }, exit: { scale: .85, opacity: 0, filter: "blur(6px)" } },
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
function StaggerContainer({ children, className = "", stagger = 0.09, from = "bottom" }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: false, margin: "-55px" });
  const dir = useScrollDir();
  const B = {
    bottom: { hidden: { y: 55, opacity: 0, scale: .95, filter: "blur(5px)" }, visible: { y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }, exit: { y: -38, opacity: 0, scale: .97, filter: "blur(3px)" } },
    left:   { hidden: { x: -55, opacity: 0 }, visible: { x: 0, opacity: 1 }, exit: { x: 38, opacity: 0 } },
    scale:  { hidden: { scale: .8, opacity: 0 }, visible: { scale: 1, opacity: 1 }, exit: { scale: .88, opacity: 0 } },
  };
  const { hidden, visible, exit } = B[from] || B.bottom;
  return (
    <motion.div ref={ref} className={className}
      initial="hidden"
      animate={inV ? "visible" : dir === "up" ? "exit" : "hidden"}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger } }, exit: { transition: { staggerChildren: stagger / 2, staggerDirection: -1 } } }}>
      {Array.isArray(children)
        ? children.map((c, i) => <motion.div key={i} variants={{ hidden, visible, exit }} transition={{ duration: .7, ease: EASE_EXPO }}>{c}</motion.div>)
        : <motion.div variants={{ hidden, visible, exit }} transition={{ duration: .7, ease: EASE_EXPO }}>{children}</motion.div>}
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
  const ref = useRef(null);
  const inV = useInView(ref, { once: false, margin: "-40px" });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const mv = e => { const r = ref.current?.getBoundingClientRect(); if (r) setPos({ x: e.clientX - r.left, y: e.clientY - r.top }); };
  return (
    <motion.div ref={ref} className={`relative rounded-2xl overflow-hidden ${className}`} onMouseMove={mv}
      initial={{ opacity: 0, y: 40, scale: .96 }}
      animate={inV ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: .96 }}
      transition={{ duration: .72, ease: EASE_EXPO }}>
      <div className="absolute pointer-events-none rounded-2xl z-0"
        style={{ inset: -1, background: `radial-gradient(280px circle at ${pos.x}px ${pos.y}px,${accent}28,transparent 60%)`, opacity: inV ? 1 : 0, transition: "opacity .3s" }} />
      <motion.div className="absolute inset-0 rounded-2xl pointer-events-none z-0"
        animate={inV ? { opacity: [.22, .5, .22] } : { opacity: 0 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ boxShadow: `inset 0 0 0 1px ${accent}32` }} />
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
  const srx = useSpring(rx, { stiffness: 200, damping: 22 }), sry = useSpring(ry, { stiffness: 200, damping: 22 });
  const mm = e => { const r = ref.current.getBoundingClientRect(); rx.set(-((e.clientY - r.top) / r.height - .5) * intensity); ry.set(((e.clientX - r.left) / r.width - .5) * intensity); };
  const ml = () => { rx.set(0); ry.set(0); };
  return (
    <motion.div ref={ref} onMouseMove={mm} onMouseLeave={ml}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }} className={className}>
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
  const sx = useSpring(x, { stiffness: 250, damping: 16 }), sy = useSpring(y, { stiffness: 250, damping: 16 });
  const mm = e => { const r = ref.current.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * .35); y.set((e.clientY - r.top - r.height / 2) * .35); };
  const ml = () => { x.set(0); y.set(0); };
  return (
    <motion.button ref={ref} style={{ x: sx, y: sy }} onMouseMove={mm} onMouseLeave={ml}
      whileTap={{ scale: .94 }} onClick={onClick} className={className}>
      {children}
    </motion.button>
  );
}

/* ══════════════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════════════ */
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
      if (dot.current) dot.current.style.transform = `translate(${pos.current.x - 3}px,${pos.current.y - 3}px) scale(${clk ? 1.9 : 1})`;
      if (trail.current) trail.current.style.transform = `translate(${sm.current.x - 30}px,${sm.current.y - 30}px) scale(${hov ? 1.6 : .5})`;
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => { document.removeEventListener("mousemove", mv); document.removeEventListener("mousedown", md); document.removeEventListener("mouseup", mu); ob.disconnect(); cancelAnimationFrame(id); };
  }, [hov, clk]);
  return (
    <>
      <div ref={outer} className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9998] transition-[border-color,background] duration-150"
        style={{ border: hov ? "1.5px solid #D4AF37" : "1.5px solid rgba(230,107,38,0.45)", background: hov ? "rgba(212,175,55,0.07)" : "transparent", willChange: "transform" }} />
      <div ref={dot} className="fixed top-0 left-0 w-[6px] h-[6px] rounded-full pointer-events-none z-[9999] transition-colors duration-100"
        style={{ background: hov ? "#D4AF37" : "#E66B26", willChange: "transform" }} />
      <div ref={trail} className="fixed top-0 left-0 w-[60px] h-[60px] rounded-full pointer-events-none z-[9996] opacity-[.09]"
        style={{ background: "radial-gradient(circle,#D4AF37,transparent)", willChange: "transform" }} />
    </>
  );
}

/* ══════════════════════════════════════════════
   SCROLL PROGRESS BAR
══════════════════════════════════════════════ */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[9997]"
      style={{ scaleX, background: "linear-gradient(90deg,#3D1A0A,#E66B26,#D4AF37,#C5531A,#D4AF37)" }} />
  );
}

/* ══════════════════════════════════════════════
   NOISE CANVAS
══════════════════════════════════════════════ */
function NoiseCanvas({ color1 = "#FFD5B8", color2 = "#FFF4ED", opacity = 0.32 }) {
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
  }, [color1, color2]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }} />;
}

/* ══════════════════════════════════════════════
   PARTICLE CANVAS
══════════════════════════════════════════════ */
function ParticleCanvas({ count = 20, color = "rgba(230,107,38,0.08)" }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let w = c.width = c.offsetWidth, h = c.height = c.offsetHeight;
    const pts = Array.from({ length: count }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .36, vy: (Math.random() - .5) * .36, r: Math.random() * 1.7 + .7 }));
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
  }, [count, color]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ══════════════════════════════════════════════
   SPOTLIGHT
══════════════════════════════════════════════ */
function Spotlight({ color = "rgba(212,175,55,0.06)", size = 580 }) {
  const ref = useRef(null);
  useEffect(() => {
    const fn = e => { if (!ref.current) return; const r = ref.current.getBoundingClientRect(); ref.current.style.background = `radial-gradient(${size}px circle at ${e.clientX - r.left}px ${e.clientY - r.top}px,${color},transparent 70%)`; };
    window.addEventListener("mousemove", fn); return () => window.removeEventListener("mousemove", fn);
  }, [color, size]);
  return <div ref={ref} className="absolute inset-0 pointer-events-none z-[1]" />;
}

/* ══════════════════════════════════════════════
   WAVE DIVIDER
══════════════════════════════════════════════ */
function WaveDivider({ color = "#D4AF37", flip = false, toBg = "#fff" }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: true, margin: "-10px" });
  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${flip ? "rotate-180" : ""}`} style={{ height: 52 }}>
      <svg viewBox="0 0 1440 52" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <motion.path d="M0,26 C240,0 480,52 720,26 C960,0 1200,52 1440,26 L1440,52 L0,52 Z"
          fill={toBg} initial={{ pathLength: 0 }} animate={inV ? { pathLength: 1 } : {}} transition={{ duration: 1.2, ease: EASE_EXPO }} />
        <motion.path d="M0,26 C240,0 480,52 720,26 C960,0 1200,52 1440,26"
          stroke={color} strokeWidth="1.5" fill="none"
          initial={{ pathLength: 0, opacity: 0 }} animate={inV ? { pathLength: 1, opacity: 1 } : {}} transition={{ duration: 1.4, ease: EASE_EXPO, delay: .15 }} />
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
      <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: false }} transition={{ duration: .55 }} className="h-px w-8 bg-[#D4AF37] origin-left" />
      <span className="text-[#D4AF37] font-bold tracking-[.2em] text-[11px] uppercase">{text}</span>
      <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: false }} transition={{ duration: .55 }} className="h-px w-8 bg-[#D4AF37] origin-right" />
    </Reveal>
  );
}

/* ══════════════════════════════════════════════
   ANIMATED HEADING
══════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════
   MARQUEE STRIP
══════════════════════════════════════════════ */
const MARQUEE_ITEMS = ["AI & Machine Learning", "IoT", "Robotics & Automation", "Cybersecurity", "Quantum Computing", "Blockchain", "Healthcare Tech", "Sustainable Technology", "Computer Vision", "Edge AI"];
function MarqueeStrip({ dark = false }) {
  const [paused, setPaused] = useState(false);
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className={`py-4 overflow-hidden border-y ${dark ? "border-white/8 bg-white/[0.03]" : "border-black/5 bg-[#F7F4EF]"}`}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <motion.div className="flex gap-10 whitespace-nowrap"
        animate={paused ? {} : { x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 28, ease: "linear" }}>
        {items.map((item, i) => (
          <span key={i} className={`flex items-center gap-3 text-sm font-semibold select-none ${dark ? "text-white/45" : "text-[#1A1A1A]/40"}`}>
            <motion.span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0"
              animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * .1 }} />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   STAT BADGE
══════════════════════════════════════════════ */
function StatBadge({ icon: Icon, label, value, color = "from-blue-600 to-cyan-600" }) {
  return (
    <GlowCard accent="#D4AF37">
      <TiltCard intensity={6}>
        <motion.div whileHover={{ y: -5, boxShadow: "0 18px 45px rgba(212,175,55,0.12)" }}
          className="bg-white p-4 sm:p-5 rounded-xl border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all group shadow-sm flex items-center gap-3">
          <Float duration={4} yRange={7}>
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          </Float>
          <div>
            <div className="text-lg font-black text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        </motion.div>
      </TiltCard>
    </GlowCard>
  );
}

/* ══════════════════════════════════════════════
   ROOT COMPONENT
══════════════════════════════════════════════ */
function RNDProjectDetail() {
  const { projectId } = useParams();
  const project = rndData.projects.find(p => p.id === projectId);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  /* Hero parallax */
  const heroRef = useRef(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], [0, -110]);
  const heroO = useTransform(heroP, [0, .6], [1, 0]);
  const heroS = useTransform(heroP, [0, 1], [1, .84]);
  const bigY  = useTransform(heroP, [0, 1], [0, 180]);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 35, damping: 18 }), smy = useSpring(my, { stiffness: 35, damping: 18 });
  const b1x = useTransform(smx, [-1, 1], [-26, 26]), b1y = useTransform(smy, [-1, 1], [-14, 14]);
  const b2x = useTransform(smx, [-1, 1], [20, -20]), b2y = useTransform(smy, [-1, 1], [12, -12]);
  useEffect(() => {
    const fn = e => { mx.set((e.clientX / window.innerWidth - .5) * 2); my.set((e.clientY / window.innerHeight - .5) * 2); };
    window.addEventListener("mousemove", fn); return () => window.removeEventListener("mousemove", fn);
  }, []);

  /* ── Not found ── */
  if (!project) {
    return (
      <div className="bg-white text-gray-900 min-h-screen flex items-center justify-center">
        <CustomCursor />
        <ScrollProgressBar />
        <Navbar />
        <div className="text-center mt-24">
          <motion.div initial={{ scale: .7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: .6, ease: EASE_BACK }}>
            <div className="text-6xl mb-6">🔬</div>
            <h1 className="text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]">Project Not Found</h1>
            <p className="text-gray-500 mb-8">The research project you're looking for doesn't exist.</p>
            <Link to="/R_AND_D"
              className="px-7 py-3 bg-[#E66B26] text-white rounded-full font-black hover:bg-[#C5531A] transition-all inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to R&D
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-900 min-h-screen overflow-x-hidden">
      <CustomCursor />
      <ScrollProgressBar />
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section ref={heroRef}
        className="relative min-h-[70vh] flex items-center justify-center px-4 sm:px-6 overflow-hidden pt-20">
        <NoiseCanvas color1="#FFD5B8" color2="#FFF0E6" opacity={0.28} />
        <div className="absolute inset-0 z-[1]"><ParticleCanvas count={18} color="rgba(230,107,38,0.07)" /></div>

        {/* Kinetic bg text */}
        <motion.div style={{ y: bigY }} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-[2]">
          <span className="text-[14vw] font-black leading-none tracking-tighter uppercase whitespace-nowrap"
            style={{ color: "rgba(230,107,38,0.018)" }}>RESEARCH</span>
        </motion.div>

        {/* Dot grid */}
        <div className="absolute inset-0 z-[2] opacity-[.03]"
          style={{ backgroundImage: "radial-gradient(circle,#E66B26 1px,transparent 1px)", backgroundSize: "32px 32px" }} />

        {/* Parallax blobs */}
        <motion.div style={{ x: b1x, y: b1y }} className="absolute top-16 left-[5%] w-80 h-80 pointer-events-none z-[2]">
          <div className="w-full h-full rounded-full blur-[100px] opacity-[.3]" style={{ background: "radial-gradient(circle,#FFD5B8,transparent)" }} />
        </motion.div>
        <motion.div style={{ x: b2x, y: b2y }} className="absolute bottom-16 right-[5%] w-[420px] h-[420px] pointer-events-none z-[2]">
          <div className="w-full h-full rounded-full blur-[110px] opacity-[.16]" style={{ background: "radial-gradient(circle,#D4AF37,transparent)" }} />
        </motion.div>

        {/* Floating orbs */}
        <Float className="absolute top-1/4 left-[7%] w-3 h-3 rounded-full bg-[#D4AF37]/25 z-[2]" duration={5} delay={0} />
        <Float className="absolute top-1/3 right-[9%] w-2 h-2 rounded-full bg-[#E66B26]/20 z-[2]" duration={4} delay={1} />
        <Float className="absolute bottom-1/3 left-[12%] w-3.5 h-3.5 rounded-full bg-[#C5531A]/18 z-[2]" duration={6} delay={2} />

        {/* Floating science emojis */}
        <Float className="absolute top-28 left-10 hidden lg:block z-[3] text-5xl opacity-40" duration={7} yRange={20} delay={0}>🧬</Float>
        <Float className="absolute top-36 right-16 hidden lg:block z-[3] text-4xl opacity-40" duration={4} yRange={15} delay={.8}>🔬</Float>
        <Float className="absolute bottom-24 right-24 hidden lg:block z-[3] text-5xl opacity-40" duration={6} yRange={20} delay={.4}>🧠</Float>

        <motion.div style={{ y: heroY, opacity: heroO, scale: heroS }} className="max-w-5xl mx-auto text-center relative z-10 py-16">
          {/* Back link */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .55, ease: EASE_EXPO }}>
            <Link to="/R_AND_D"
              className="inline-flex items-center gap-2 text-[#E66B26] hover:text-[#C5531A] font-bold text-sm mb-8 group transition-colors">
              <motion.span animate={{ x: [0, -3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ArrowLeft className="w-4 h-4" />
              </motion.span>
              Back to R&D Programs
            </Link>
          </motion.div>

          {/* Domain badge */}
          <motion.div initial={{ scale: .7, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ duration: .65, ease: EASE_BACK, delay: .1 }}
            className="inline-flex items-center gap-2 bg-white/88 backdrop-blur-sm border border-gray-200 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 shadow-sm">
            <motion.div animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}>
              <Microscope className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
            </motion.div>
            <span className="text-sm sm:text-base text-[#E66B26] font-semibold">{project.domain}</span>
            <motion.div animate={{ opacity: [.5, 1, .5] }} transition={{ duration: 2, repeat: Infinity }}>
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]/70" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25, duration: .75, ease: EASE_EXPO }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-5 leading-[1.06]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] via-[#C5531A] to-[#E66B26]">{project.title}</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4, ease: EASE_EXPO }}
            className="text-sm sm:text-base md:text-lg text-gray-500 max-w-3xl mx-auto mb-9 px-4 leading-relaxed">
            {project.desc}
          </motion.p>

          {/* Meta badges */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .56, ease: EASE_EXPO }}
            className="flex flex-wrap gap-3 justify-center mb-10">
            
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-[#D4AF37]/40 rounded-full px-4 py-2 shadow-sm">
              <Users className="w-4 h-4 text-[#E66B26]" />
              <span className="text-sm font-semibold text-gray-700">{project.teamSize}</span>
            </div>
          </motion.div>

          {/* Scroll cue */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="flex justify-center">
            <Float duration={2} yRange={10}>
              <div className="flex flex-col items-center gap-1.5 text-gray-400">
                <span className="text-[10px] font-medium">Scroll to explore</span>
                <div className="w-5 h-8 border-2 border-[#E66B26]/22 rounded-full flex justify-center">
                  <motion.div className="w-1 h-2 bg-[#D4AF37] rounded-full mt-1.5"
                    animate={{ y: [0, 10, 0], opacity: [1, .4, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
                </div>
              </div>
            </Float>
          </motion.div>
        </motion.div>
      </section>

      <MarqueeStrip />

      {/* ═══ OVERVIEW ═══ */}
      <WaveDivider color="#D4AF37" toBg="#f9fafb" />
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50 relative overflow-hidden">
        <Spotlight color="rgba(230,107,38,0.04)" size={480} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <SLabel text="Overview" />
            <AHeading className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
              Project Overview
            </AHeading>
            <Reveal from="bottom" delay={.2}>
              <div className="w-16 h-[3px] bg-[#D4AF37] mx-auto mt-4 rounded" />
            </Reveal>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <Reveal from="left">
              <GlowCard accent="#D4AF37">
                <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#D4AF37]/30 shadow-sm">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{project.fullDescription}</p>
                </div>
              </GlowCard>
            </Reveal>

            <Reveal from="right" delay={.1}>
              <GlowCard accent="#E66B26">
                <TiltCard intensity={6}>
                  <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E66B26]/30 shadow-sm">
                    <div className="flex items-start gap-4">
                      <Float duration={4} yRange={8}>
                        <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#E66B26] rounded-xl flex items-center justify-center shadow-md shrink-0">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                      </Float>
                      <div>
                        <h3 className="text-base font-black text-[#E66B26] mb-3">Impact Achieved</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{project.impact}</p>
                      </div>
                    </div>
                    <motion.div className="mt-6 grid grid-cols-2 gap-3">
                      <StatBadge icon={Clock} label="Timeline" value={project.timeline} color="from-blue-600 to-cyan-600" />
                      <StatBadge icon={Users} label="Team Size" value={project.teamSize} color="from-emerald-600 to-teal-600" />
                    </motion.div>
                  </div>
                </TiltCard>
              </GlowCard>
            </Reveal>
          </div>
        </div>
      </section>
      <WaveDivider color="#D4AF37" flip toBg="#FFF4ED" />

      {/* ═══ OBJECTIVES ═══ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background: "#FFF4ED" }}>
        <NoiseCanvas color1="#FFD5B8" color2="#FFCBA4" opacity={0.18} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <motion.span className="text-[13vw] font-black leading-none tracking-tighter uppercase text-[#E66B26]/[0.018]"
            animate={{ y: [0, -10, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}>GOALS</motion.span>
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <SLabel text="Research Goals" />
            <AHeading className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
              Research Objectives
            </AHeading>
            <Reveal from="bottom" delay={.2}>
              <div className="w-16 h-[3px] bg-[#D4AF37] mx-auto mt-4 rounded" />
              <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto mt-4">Core goals driving this research initiative</p>
            </Reveal>
          </div>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5" stagger={0.08} from="bottom">
            {project.objectives.map((objective, i) => (
              <GlowCard key={i} accent="#D4AF37">
                <TiltCard intensity={7}>
                  <motion.div whileHover={{ y: -6, boxShadow: "0 20px 50px rgba(212,175,55,0.12)" }}
                    className="group bg-white p-5 sm:p-6 rounded-xl border border-gray-200 hover:border-[#D4AF37] relative overflow-hidden shadow-sm transition-all h-full">
                    <div className="flex items-start gap-3">
                      <Float duration={4 + i * .4} yRange={7} delay={i * .2}>
                        <div className="w-9 h-9 bg-gradient-to-br from-[#E66B26] to-[#C5531A] rounded-lg flex items-center justify-center text-white font-black text-sm shadow-md shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </div>
                      </Float>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2.2, repeat: Infinity, delay: i * .25 }}>
                            <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                          </motion.div>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{objective}</p>
                      </div>
                    </div>
                    <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#E66B26] rounded-b-xl"
                      initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: .35 }} />
                  </motion.div>
                </TiltCard>
              </GlowCard>
            ))}
          </StaggerContainer>
        </div>
      </section>
      <WaveDivider color="#D4AF37" toBg="#f9fafb" />

      {/* ═══ OUTCOMES ═══ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50 relative overflow-hidden">
        <Spotlight color="rgba(230,107,38,0.04)" size={500} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <SLabel text="Deliverables" />
            <AHeading className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
              Expected Outcomes
            </AHeading>
            <Reveal from="bottom" delay={.2}>
              <div className="w-16 h-[3px] bg-[#D4AF37] mx-auto mt-4 rounded" />
              <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto mt-4">Tangible results and deliverables from this research</p>
            </Reveal>
          </div>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5" stagger={0.08} from="bottom">
            {project.outcomes.map((outcome, i) => (
              <GlowCard key={i} accent="#D4AF37">
                <TiltCard intensity={7}>
                  <motion.div whileHover={{ y: -6, boxShadow: "0 20px 50px rgba(212,175,55,0.12)" }}
                    className="group bg-white p-5 sm:p-6 rounded-xl border border-gray-200 hover:border-[#D4AF37] relative overflow-hidden shadow-sm transition-all h-full">
                    <div className="flex items-start gap-3">
                      <Float duration={4 + i * .4} yRange={7} delay={i * .25}>
                        <div className="w-9 h-9 bg-[#FFF0D0] border border-[#D4AF37]/40 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#D4AF37]/20 transition-colors">
                          <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                      </Float>
                      <p className="text-sm text-gray-600 leading-relaxed pt-1">{outcome}</p>
                    </div>
                    <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#E66B26] rounded-b-xl"
                      initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: .35 }} />
                  </motion.div>
                </TiltCard>
              </GlowCard>
            ))}
          </StaggerContainer>
        </div>
      </section>
      <WaveDivider color="#D4AF37" flip toBg="#FFF4ED" />

      {/* ═══ TECHNOLOGIES ═══ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background: "#FFF4ED" }}>
        <NoiseCanvas color1="#FFD5B8" color2="#FFCBA4" opacity={0.18} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <motion.span className="text-[13vw] font-black leading-none tracking-tighter uppercase text-[#E66B26]/[0.018]"
            animate={{ y: [0, -10, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>TOOLS</motion.span>
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <SLabel text="Tech Stack" />
            <AHeading className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
              Technologies & Tools
            </AHeading>
            <Reveal from="bottom" delay={.2}>
              <div className="w-16 h-[3px] bg-[#D4AF37] mx-auto mt-4 rounded" />
              <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto mt-4">Cutting-edge tools powering this research</p>
            </Reveal>
          </div>

          <StaggerContainer className="flex flex-wrap gap-3 justify-center" stagger={0.05} from="scale">
            {project.technologies.map((tech, i) => (
              <GlowCard key={i} accent="#D4AF37">
                <TiltCard intensity={5}>
                  <motion.div whileHover={{ y: -5, boxShadow: "0 14px 35px rgba(212,175,55,0.14)" }}
                    className="bg-white px-4 py-2.5 rounded-full border border-gray-200 hover:border-[#D4AF37] transition-all shadow-sm group">
                    <div className="flex items-center gap-2">
                      <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2.2, repeat: Infinity, delay: i * .18 }}>
                        <span className="w-2 h-2 rounded-full bg-[#D4AF37] inline-block" />
                      </motion.div>
                      <span className="text-sm font-bold text-gray-700 group-hover:text-[#E66B26] transition-colors">{tech}</span>
                    </div>
                  </motion.div>
                </TiltCard>
              </GlowCard>
            ))}
          </StaggerContainer>
        </div>
      </section>
      <WaveDivider color="#D4AF37" toBg="#f9fafb" />

      
      <WaveDivider color="#D4AF37" flip toBg="#FFF4ED" />

      

     

      <RNDApplicationModal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        projectId={project.id}
        projectTitle={project.title}
      />
    </div>
  );
}

export default RNDProjectDetail;