import {
  motion, AnimatePresence, useInView, useScroll, useTransform,
  useSpring, useMotionValue, useVelocity,
} from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  BookOpen, Clock, Users, Target, X, CheckCircle, Briefcase,
  Code, Zap, Award, Calendar, MapPin, ChevronRight, Star,
  Sparkles, GraduationCap, Brain, Rocket, TrendingUp, Heart,
  Shield, Coffee, Globe, MessageSquare, Share2, Bookmark, BadgeCheck,
  HelpCircle, Mail, Phone, Send, MessageCircle, FileText, User,
  School, CalendarDays, ListChecks,ArrowRight,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WorkshopRegistrationModal from "./WorkshopRegistrationModal";
import InternshipRegistrationModal from "./InternshipRegistrationModal";
import workshopsData from "./data/workshopsData.json";
import internshipsData from "./data/internshipsData.json";

/* ══════════════════════════════════════════════
   EASING
══════════════════════════════════════════════ */
const EASE_EXPO = [0.16, 1, 0.3, 1];
const EASE_BACK = [0.34, 1.56, 0.64, 1];

/* ══════════════════════════════════════════════
   BRAND  — updated to new orange palette
══════════════════════════════════════════════ */
const C = { dark: "#E66B26", mid: "#C5531A", gold: "#D4AF37", light: "#FFF4ED", text: "#1A1A1A" };

/* ══════════════════════════════════════════════
   NAV SECTIONS
══════════════════════════════════════════════ */
const NAV_SECTIONS = ["ws-hero", "ws-intro", "ws-approach", "ws-grid", "ws-query"];
const NAV_LABELS   = ["Top", "Intro", "Approach", "Programs", "Query"];

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
    bottom: { hidden: { y: 55, opacity: 0, scale: .95, filter: "blur(5px)" }, visible: { y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }, exit: { y: -38, opacity: 0, scale: .97, filter: "blur(3px)" } },
    left:   { hidden: { x: -55, opacity: 0 }, visible: { x: 0, opacity: 1 }, exit: { x: 38, opacity: 0 } },
    right:  { hidden: { x: 55, opacity: 0 }, visible: { x: 0, opacity: 1 }, exit: { x: -38, opacity: 0 } },
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
        style={{ inset: -1, background: `radial-gradient(320px circle at ${pos.x}px ${pos.y}px,${accent}30,transparent 60%)`, transition: "opacity .3s" }} />
      <motion.div className="absolute inset-0 rounded-2xl pointer-events-none z-0"
        animate={inV ? { opacity: [.28, .6, .28] } : { opacity: 0 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ boxShadow: `inset 0 0 0 1px ${accent}38` }} />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   TILT CARD
══════════════════════════════════════════════ */
function TiltCard({ children, className = "", intensity = 12 }) {
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

/* ══════════════════════════════════════════════
   MAGNETIC BUTTON
══════════════════════════════════════════════ */
function MagBtn({ children, className = "", onClick, type = "button" }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 16 });
  const sy = useSpring(y, { stiffness: 250, damping: 16 });
  return (
    <motion.button ref={ref} type={type}
      style={{ x: sx, y: sy }}
      onMouseMove={e => { const r = ref.current.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * .38); y.set((e.clientY - r.top - r.height / 2) * .38); }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
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
    ob.observe(document.body, { childList: true, subtree: true });
    let id;
    const loop = () => {
      sm.current.x += (pos.current.x - sm.current.x) * .09;
      sm.current.y += (pos.current.y - sm.current.y) * .09;
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
      <div ref={outer} className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9998] transition-[border-color,background] duration-150"
        style={{ border: hov ? `1.5px solid ${C.gold}` : `1.5px solid rgba(230,107,38,0.45)`, background: hov ? "rgba(212,175,55,0.07)" : "transparent", willChange: "transform" }} />
      <div ref={dot} className="fixed top-0 left-0 w-[6px] h-[6px] rounded-full pointer-events-none z-[9999] transition-colors duration-100"
        style={{ background: hov ? C.gold : C.dark, willChange: "transform" }} />
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

/* ══════════════════════════════════════════════
   SECTION NAV DOTS
══════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════
   NOISE CANVAS
══════════════════════════════════════════════ */
function NoiseCanvas({ color1 = "#FFD5B8", color2 = "#FFF4ED", opacity = 0.28 }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let t = 0, id;
    const draw = () => {
      const w = c.width = c.offsetWidth, h = c.height = c.offsetHeight;
      const g = ctx.createRadialGradient(w * (.3 + .22 * Math.sin(t * .38)), h * (.3 + .16 * Math.cos(t * .28)), 0, w * .5, h * .5, Math.max(w, h) * .88);
      g.addColorStop(0, color1 + "cc"); g.addColorStop(.5, color2 + "88"); g.addColorStop(1, "transparent");
      ctx.clearRect(0, 0, w, h); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      t += .007; id = requestAnimationFrame(draw);
    };
    draw(); return () => cancelAnimationFrame(id);
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }} />;
}

/* ══════════════════════════════════════════════
   PARTICLE CANVAS
══════════════════════════════════════════════ */
function ParticleCanvas({ count = 22, color = "rgba(230,107,38,0.08)" }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let w = c.width = c.offsetWidth, h = c.height = c.offsetHeight;
    const pts = Array.from({ length: count }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .38, vy: (Math.random() - .5) * .38, r: Math.random() * 1.8 + .8 }));
    let id;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
      });
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

/* ══════════════════════════════════════════════
   SPOTLIGHT
══════════════════════════════════════════════ */
function Spotlight({ color = "rgba(212,175,55,0.07)", size = 600 }) {
  const ref = useRef(null);
  useEffect(() => {
    const fn = e => { if (!ref.current) return; const r = ref.current.getBoundingClientRect(); ref.current.style.background = `radial-gradient(${size}px circle at ${e.clientX - r.left}px ${e.clientY - r.top}px,${color},transparent 70%)`; };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  return <div ref={ref} className="absolute inset-0 pointer-events-none z-[1]" />;
}

/* ══════════════════════════════════════════════
   WAVE DIVIDER
══════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════
   SECTION LABEL
══════════════════════════════════════════════ */
function SLabel({ text }) {
  return (
    <Reveal from="top" className="flex items-center gap-3 justify-center mb-3">
      <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: false }} transition={{ duration: .55 }} className="h-px w-8 origin-left" style={{ background: C.gold }} />
      <span style={{ color: C.gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>{text}</span>
      <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: false }} transition={{ duration: .55 }} className="h-px w-8 origin-right" style={{ background: C.gold }} />
    </Reveal>
  );
}

/* ══════════════════════════════════════════════
   WORD-BY-WORD HEADING
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
   ANIMATED COUNTER
══════════════════════════════════════════════ */
function Counter({ value }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: false });
  const num = parseInt(value.replace(/\D/g, ""), 10);
  const sfx = value.replace(/[0-9]/g, "");
  const mv = useMotionValue(0);
  const sp = useSpring(mv, { stiffness: 55, damping: 14 });
  const [d, setD] = useState(0);
  useEffect(() => { mv.set(inV ? num : 0); }, [inV]);
  useEffect(() => sp.on("change", v => setD(Math.round(v))), [sp]);
  return <span ref={ref}>{d}{sfx}</span>;
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
function Workshops() {
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [viewMode, setViewMode] = useState("workshops");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [showWorkshopRegModal, setShowWorkshopRegModal] = useState(false);
  const [showInternshipRegModal, setShowInternshipRegModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showQueryForm, setShowQueryForm] = useState(false);
  const [queryForm, setQueryForm] = useState({ name: "", email: "", phone: "", subject: "", category: "general", message: "", preferredContact: "email", preferredTime: "anytime" });

  const departments = ["All", "ECE", "EEE", "CSE", "AI & ML", "IT", "Mechanical", "MCA"];
  const internshipDepartments = ["All", "Engineering", "Degree"];

  const filteredWorkshops = selectedDepartment === "All" ? workshopsData.workshops : workshopsData.workshops.filter(w => w.suitedFor.includes(selectedDepartment));
  let filteredInternships;
  if (selectedDepartment === "All") filteredInternships = internshipsData.internships;
  else if (selectedDepartment === "Engineering") filteredInternships = internshipsData.internships.filter(i => i.suitedFor.some(b => ["CSE","IT","ECE","EEE","Mechanical"].includes(b)));
  else if (selectedDepartment === "Degree") filteredInternships = internshipsData.internships.filter(i => i.suitedFor.includes("MCA"));
  else filteredInternships = internshipsData.internships;

  const searchFilteredWorkshops = filteredWorkshops.filter(w => searchQuery === "" || w.title.toLowerCase().includes(searchQuery.toLowerCase()) || w.description.toLowerCase().includes(searchQuery.toLowerCase()) || w.suitedFor.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
  const searchFilteredInternships = filteredInternships.filter(i => searchQuery === "" || i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.description.toLowerCase().includes(searchQuery.toLowerCase()) || i.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/queries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: queryForm.name, email: queryForm.email, phone: queryForm.phone, subject: queryForm.subject, category: queryForm.category, message: queryForm.message }) });
      if (response.ok) {
        toast.success("Query submitted! We'll get back to you within 24 hours.", { duration: 5000, icon: "✅" });
        setQueryForm({ name: "", email: "", phone: "", subject: "", category: "general", message: "", preferredContact: "email", preferredTime: "anytime" });
        setShowQueryForm(false);
      } else {
        const err = await response.json();
        toast.error(err.message || "Failed to submit. Please try again.", { duration: 5000, icon: "❌" });
      }
    } catch {
      toast.error("Network error. Please check your connection.", { duration: 5000, icon: "❌" });
    }
  };

  const handleQueryChange = e => setQueryForm({ ...queryForm, [e.target.name]: e.target.value });

  /* hero parallax */
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY  = useTransform(heroScroll, [0, 1], [0, -100]);
  const heroO  = useTransform(heroScroll, [0, .6], [1, 0.9]);
  const heroS  = useTransform(heroScroll, [0, 1], [1, .85]);
  const bigY   = useTransform(heroScroll, [0, 1], [0, 160]);

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

  const heroStats = viewMode === "workshops"
    ? [{ icon: Clock, value: "3-5 Days", label: "Duration" }, { icon: Users, value: "500+", label: "Students Trained" }, { icon: Code, value: "20+", label: "Workshops" }, { icon: Award, value: "100%", label: "Hands-on" }]
    : [{ icon: Briefcase, value: "3-6 Months", label: "Duration" }, { icon: Users, value: "50+", label: "Interns" }, { icon: TrendingUp, value: "20+", label: "Internships" }, { icon: Award, value: "100%", label: "Hands-on" }];

  return (
    <div className="bg-white text-[#1A1A1A] min-h-screen overflow-x-hidden">
      <Toaster position="top-center" />
      <CustomCursor />
      <ScrollProgressBar />
      <SectionNavDots />
      <Navbar />

      {/* ══ HERO ══ */}
      <section id="ws-hero" ref={heroRef} className="relative pt-28 sm:pt-36 pb-20 px-4 sm:px-6 overflow-hidden min-h-screen flex items-center">
        <NoiseCanvas color1="#FFD5B8" color2="#FFF0E6" opacity={0.25} />
        <div className="absolute inset-0 z-[1]"><ParticleCanvas count={20} /></div>

        <motion.div className="absolute inset-0 z-[2] opacity-25"
          animate={{ background: ["radial-gradient(circle at 20% 30%,rgba(230,107,38,0.18) 0%,transparent 40%)","radial-gradient(circle at 80% 70%,rgba(230,107,38,0.18) 0%,transparent 40%)","radial-gradient(circle at 20% 30%,rgba(230,107,38,0.18) 0%,transparent 40%)"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />

        {/* blobs */}
        <motion.div style={{ x: b1x, y: b1y }} className="absolute top-12 left-[4%] w-[340px] h-[340px] pointer-events-none z-[2]">
          <div className="w-full h-full rounded-full" style={{ filter: "blur(100px)", opacity: .32, background: "radial-gradient(circle,#FFD5B8,transparent)" }} />
        </motion.div>
        <motion.div style={{ x: b2x, y: b2y }} className="absolute bottom-12 right-[4%] w-[400px] h-[400px] pointer-events-none z-[2]">
          <div className="w-full h-full rounded-full" style={{ filter: "blur(110px)", opacity: .2, background: `radial-gradient(circle,${C.gold},transparent)` }} />
        </motion.div>

        {/* floating orbs */}
        {[{ t: "22%", l: "7%", d: 12, c: `${C.gold}44` }, { t: "35%", r: "9%", d: 8, c: `${C.dark}33` }, { b: "25%", l: "13%", d: 14, c: `${C.mid}2a` }, { b: "35%", r: "16%", d: 10, c: `${C.gold}33` }].map((o, i) => (
          <Float key={i} duration={4 + i * .6} delay={i * .4}
            className="absolute z-[2] rounded-full pointer-events-none"
            style={{ top: o.t, bottom: o.b, left: o.l, right: o.r, width: o.d, height: o.d, background: o.c }} />
        ))}

        {/* kinetic bg text */}
        <motion.div style={{ y: bigY }} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-[2]">
          <span className="font-black leading-none tracking-tighter uppercase whitespace-nowrap"
            style={{ fontSize: "20vw", color: "rgba(230,107,38,0.018)" }}>
            {viewMode === "workshops" ? "LEARN" : "INTERN"}
          </span>
        </motion.div>

        {/* dot grid */}
        <div className="absolute inset-0 z-[2] opacity-[.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle,#E66B26 1px,transparent 1px)", backgroundSize: "28px 28px" }} />

        {/* content */}
        <motion.div style={{ y: heroY, opacity: heroO, scale: heroS }} className="max-w-6xl mx-auto text-center relative z-10 w-full">

          {/* badge */}
          <motion.div initial={{ scale: .7, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ duration: .65, ease: EASE_BACK }} className="inline-block mb-8">
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold backdrop-blur-sm shadow-lg"
              style={{ background: "rgba(230,107,38,0.12)", border: "1px solid rgba(230,107,38,0.28)", color: C.dark }}>
              <motion.span animate={{ opacity: [.7, 1, .7] }} transition={{ duration: 2, repeat: Infinity }} className="text-[#D4AF37]">✦</motion.span>
              {viewMode === "workshops" ? "Hands-on Technical Workshops" : "Professional Internship Program"}
              <motion.span animate={{ opacity: [.7, 1, .7] }} transition={{ duration: 2, repeat: Infinity }} className="text-[#D4AF37]">✦</motion.span>
            </span>
          </motion.div>

          {/* heading */}
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3, duration: .75, ease: EASE_EXPO }}
            className="font-bold mb-6 leading-tight"
            style={{ fontSize: "clamp(2.2rem,7vw,4.5rem)" }}>
            {viewMode === "workshops" ? (
              <>
                <span style={{ color: C.text }}>Transform Your Future</span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]">with Technology-Driven Workshops</span>
              </>
            ) : (
              <>
                <span style={{ color: C.text }}>Launch Your Career</span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]">with Professional Internships</span>
              </>
            )}
          </motion.h1>

          {/* sub */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .5, ease: EASE_EXPO }}
            className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed px-4 mb-8 rounded-2xl border backdrop-blur-sm p-6"
            style={{ color: C.text, borderColor: "rgba(229,231,235,0.8)", background: "rgba(255,255,255,0.35)" }}>
            {viewMode === "workshops"
              ? "Learn cutting-edge technologies, build real-world projects, and gain the confidence to enter the industry with practical expertise."
              : "Engage in structured learning, hands-on project development, and guided mentorship designed to prepare you for professional excellence."}
          </motion.p>

          {/* mode toggle buttons */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .65, ease: EASE_EXPO }}
            className="flex flex-wrap justify-center gap-4 mb-10">
            {[
              { mode: "workshops",   Icon: BookOpen,  label: "Workshops"   },
              { mode: "internships", Icon: Briefcase, label: "Internships" },
            ].map(({ mode, Icon, label }) => (
              <MagBtn key={mode} onClick={() => setViewMode(mode)}
                className={`flex items-center gap-2 px-7 py-3 rounded-xl font-semibold transition-all duration-300 border shadow-sm ${
                  viewMode === mode ? "text-black scale-105 shadow-md" : "bg-white border-gray-200 hover:border-[#E66B26] hover:bg-white "
                }`}
                style={viewMode === mode ? { background: `linear-gradient(135deg,${C.dark},${C.mid})`, borderColor: C.dark } : { color: C.text }}>
                <Icon className="w-4 h-4" />
                {label}
              </MagBtn>
            ))}
            <MagBtn onClick={() => setShowQueryForm(!showQueryForm)}
              className="flex items-center gap-2 px-7 py-3 rounded-xl font-semibold border bg-white transition-all duration-300 shadow-sm hover:bg-[#FFF4ED]"
              style={{ borderColor: "#e5e7eb", color: C.text }}>
              <HelpCircle className="w-4 h-4" style={{ color: C.gold }} />
              Have a Query?
            </MagBtn>
          </motion.div>

          {/* stat pills */}
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .8, ease: EASE_EXPO }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto px-2">
            {heroStats.map((s, i) => (
              <Float key={i} duration={4 + i * .5} delay={i * .3}>
                <GlowCard accent={C.gold}>
                  <motion.div whileHover={{ y: -5, boxShadow: "0 14px 32px rgba(0,0,0,0.08)" }}
                    className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 text-center cursor-default transition-all">
                    <s.icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2" style={{ color: C.dark }} />
                    <div className="text-lg sm:text-2xl font-black" style={{ color: C.text }}>{s.value}</div>
                    <div className="text-xs sm:text-sm" style={{ color: "rgba(26,26,26,0.6)" }}>{s.label}</div>
                  </motion.div>
                </GlowCard>
              </Float>
            ))}
          </motion.div>

          {/* scroll cue */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
            className="flex justify-center mt-12 cursor-pointer"
            onClick={() => document.getElementById("ws-intro")?.scrollIntoView({ behavior: "smooth" })}>
            <Float duration={2} yRange={10}>
              <div className="w-5 h-8 rounded-full flex justify-center" style={{ border: `2px solid rgba(230,107,38,0.25)` }}>
                <motion.div className="w-1 h-2 rounded-full mt-2" style={{ background: C.gold }}
                  animate={{ y: [0, 10, 0], opacity: [1, .4, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
              </div>
            </Float>
          </motion.div>
        </motion.div>
      </section>

      {/* ══ QUERY FORM DROPDOWN ══ */}
      <AnimatePresence>
        {showQueryForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-y border-gray-200" style={{ background: C.light }}>
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
              <GlowCard accent={C.gold}>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold" style={{ color: C.dark }}>Quick Query</h3>
                    <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: .9 }} onClick={() => setShowQueryForm(false)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <X className="w-5 h-5" style={{ color: C.text }} />
                    </motion.button>
                  </div>
                  <form onSubmit={handleQuerySubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input type="text" name="name" value={queryForm.name} onChange={handleQueryChange} placeholder="Your Name *" required
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#E66B26] focus:outline-none transition-colors" />
                      <input type="email" name="email" value={queryForm.email} onChange={handleQueryChange} placeholder="Your Email *" required
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#E66B26] focus:outline-none transition-colors" />
                    </div>
                    <input type="text" name="phone" value={queryForm.phone} onChange={handleQueryChange} placeholder="Phone Number"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#E66B26] focus:outline-none transition-colors" />
                    <textarea name="message" value={queryForm.message} onChange={handleQueryChange} placeholder="Your Question *" required rows="3"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#E66B26] focus:outline-none resize-none transition-colors" />
                    <div className="flex gap-3">
                      <MagBtn type="submit"
                        className="px-6 py-2.5 text-black rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                        style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
                        Submit Query
                      </MagBtn>
                      <motion.button type="button" onClick={() => setShowQueryForm(false)} whileHover={{ scale: 1.03 }} whileTap={{ scale: .97 }}
                        className="px-6 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: C.text }}>
                        Cancel
                      </motion.button>
                    </div>
                  </form>
                </div>
              </GlowCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ WORKSHOPS / INTERNSHIPS VIEW ══ */}
      <AnimatePresence mode="wait">
        {viewMode === "workshops" ? (
          <motion.div key="workshops" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: .4 }}>

            {/* Intro */}
            <section id="ws-intro" className="py-16 sm:py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
              <Spotlight color="rgba(230,107,38,0.04)" />
              <div className="absolute inset-0 opacity-[.03]" style={{ backgroundImage: "radial-gradient(circle,#E66B26 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
              <div className="max-w-4xl mx-auto text-center relative z-10">
                <SLabel text="About Our Workshops" />
                <AHeading className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
                  Bridging Knowledge & Industry
                </AHeading>
                <Reveal from="bottom" delay={.1}>
                  <p className="text-lg sm:text-xl leading-relaxed mb-8" style={{ color: C.text }}>
                    We conduct short-term, high-impact technical workshops that bridge the gap between academic learning and real-world technology, focusing on hands-on experience, practical exposure, and current industry trends.
                  </p>
                </Reveal>
                <Reveal from="bottom" delay={.2}>
                  <MagBtn onClick={() => { setQueryForm({ ...queryForm, category: "workshop" }); setShowQueryForm(true); }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border font-semibold transition-all shadow-sm hover:shadow-md"
                    style={{ background: "#fff", color: C.dark, borderColor: C.gold }}>
                    <HelpCircle className="w-5 h-5" style={{ color: C.gold }} />
                    Have Workshop Questions? Ask Us
                  </MagBtn>
                </Reveal>
              </div>
            </section>

            {/* Approach */}
            <WaveDivider color={C.gold} toBg={C.light} />
            <section id="ws-approach" className="py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background: C.light }}>
              <NoiseCanvas color1="#FFD5B8" color2="#FFCBA4" opacity={0.22} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <motion.span className="font-black leading-none tracking-tighter uppercase text-[#E66B26]/[0.02]"
                  style={{ fontSize: "15vw" }}
                  animate={{ y: [0, -10, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}>
                  APPROACH
                </motion.span>
              </div>
              <div className="max-w-5xl mx-auto relative z-10">
                <div className="text-center mb-14">
                  <SLabel text="How We Teach" />
                  <AHeading className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
                    Our Workshop Approach
                  </AHeading>
                  <Reveal from="bottom" delay={.15}>
                    <p className="text-lg text-center mt-4 max-w-3xl mx-auto" style={{ color: C.text }}>
                      Our technical workshops follow a hands-on, project-driven approach where participants learn by building real-world solutions.
                    </p>
                  </Reveal>
                </div>
                <StaggerContainer className="grid sm:grid-cols-2 gap-4" stagger={0.09} from="bottom">
                  {["Concept explanation in simple language", "Live demonstrations", "Hands-on practical sessions", "Mini projects", "Real-world use cases", "Interactive discussions"].map((item, i) => (
                    <GlowCard key={i} accent={C.gold}>
                      <TiltCard intensity={7}>
                        <motion.div whileHover={{ y: -5, boxShadow: "0 18px 40px rgba(0,0,0,0.08)" }}
                          className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 hover:border-[#D4AF37] transition-all shadow-sm h-full">
                          <Float duration={3.5 + i * .3} delay={i * .2}>
                            <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: C.gold }} />
                          </Float>
                          <span className="text-sm sm:text-base font-medium" style={{ color: C.text }}>{item}</span>
                        </motion.div>
                      </TiltCard>
                    </GlowCard>
                  ))}
                </StaggerContainer>
                <Reveal from="bottom" delay={.2} className="text-center mt-10">
                  <p className="text-lg font-bold" style={{ color: C.dark }}>
                    Our goal is clarity, confidence, and practical exposure — not just certificates.
                  </p>
                </Reveal>
              </div>
            </section>
            <WaveDivider color={C.gold} flip toBg="#fff" />

            {/* Department filter */}
            <section className="py-10 px-4 sm:px-6 bg-white border-y border-gray-100">
              <div className="max-w-6xl mx-auto">
                <Reveal from="top" className="text-center mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold" style={{ color: C.dark }}>Filter Workshops by Department</h3>
                </Reveal>
                <StaggerContainer className="flex flex-wrap gap-2 sm:gap-3 justify-center" stagger={0.05} from="bottom">
                  {departments.map(dept => (
                    <motion.button key={dept} onClick={() => setSelectedDepartment(dept)}
                      whileHover={{ scale: 1.07, y: -2 }} whileTap={{ scale: .96 }}
                      className="px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition-all shadow-sm"
                      style={selectedDepartment === dept
                        ? { background: `linear-gradient(135deg,${C.dark},${C.mid})`, color: "#fff", boxShadow: "0 6px 18px rgba(230,107,38,0.25)" }
                        : { background: "#fff", color: C.text, border: "1px solid #e5e7eb" }}>
                      {dept}
                    </motion.button>
                  ))}
                </StaggerContainer>
              </div>
            </section>

            {/* Workshops Grid */}
            <section id="ws-grid" className="py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background: C.light }}>
              <NoiseCanvas opacity={0.18} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <motion.span className="font-black leading-none tracking-tighter uppercase text-[#E66B26]/[0.018]"
                  style={{ fontSize: "14vw" }}
                  animate={{ y: [0, -12, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}>
                  WORKSHOPS
                </motion.span>
              </div>
              <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-14">
                  <SLabel text="Our Programs" />
                  <AHeading className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
                    Core Workshop Domains We Offer
                  </AHeading>
                </div>
                {searchFilteredWorkshops.length === 0 ? (
                  <Reveal from="scale" className="text-center py-12">
                    <div className="text-5xl mb-4">🔍</div>
                    <p className="text-xl" style={{ color: C.text }}>No workshops found</p>
                  </Reveal>
                ) : (
                  <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" stagger={0.08} from="bottom">
                    {searchFilteredWorkshops.map((workshop) => (
                      <GlowCard key={workshop.id} accent={C.gold}>
                        <TiltCard intensity={7}>
                          <motion.div whileHover={{ y: -8, boxShadow: "0 24px 55px rgba(0,0,0,0.10)" }}
                            className="group bg-white rounded-xl sm:rounded-2xl border border-gray-200 hover:border-[#E66B26] transition-all overflow-hidden shadow-sm h-full">
                            <div className="p-4 sm:p-6">
                              <h3 className="text-lg sm:text-xl font-bold mb-3 group-hover:text-[#E66B26] transition-colors" style={{ color: C.text }}>
                                {workshop.title}
                              </h3>
                              <p className="text-xs sm:text-sm mb-4 line-clamp-2" style={{ color: "rgba(26,26,26,0.65)" }}>{workshop.description}</p>
                              <div className="flex items-center gap-2 text-xs sm:text-sm mb-4" style={{ color: C.text }}>
                                <Clock className="w-4 h-4 flex-shrink-0" style={{ color: C.gold }} />
                                <span>{workshop.duration}</span>
                              </div>
                              <div className="mb-5">
                                <p className="text-xs mb-2" style={{ color: "rgba(26,26,26,0.55)" }}>Best suited for:</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {workshop.suitedFor.slice(0, 3).map((branch, j) => (
                                    <span key={j} className="px-2 py-0.5 text-xs rounded-full" style={{ background: C.light, color: C.dark, border: `1px solid rgba(212,175,55,0.3)` }}>{branch}</span>
                                  ))}
                                  {workshop.suitedFor.length > 3 && (
                                    <span className="px-2 py-0.5 bg-gray-100 text-xs rounded-full border border-gray-200" style={{ color: C.text }}>+{workshop.suitedFor.length - 3}</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <motion.button onClick={() => setSelectedWorkshop(workshop)} whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }}
                                  className="w-full px-4 py-2.5 sm:py-3 text-white rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 group/btn"
                                  style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
                                  <span>View Details</span>
                                  <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                    <ChevronRight className="w-4 h-4" />
                                  </motion.div>
                                </motion.button>
                                <motion.button
                                  onClick={() => { setQueryForm({ ...queryForm, category: "workshop", subject: workshop.title, message: `I'm interested in the ${workshop.title} workshop.` }); setShowQueryForm(true); }}
                                  whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }}
                                  className="w-full px-4 py-2 bg-white text-sm rounded-lg flex items-center justify-center gap-2 transition-all"
                                  style={{ border: `1px solid ${C.gold}`, color: C.text }}>
                                  <HelpCircle className="w-3 h-3" style={{ color: C.gold }} />
                                  Quick Query
                                </motion.button>
                              </div>
                            </div>
                            <motion.div className="h-1 bg-gradient-to-r from-[#D4AF37] to-[#C5531A]"
                              initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} style={{ transformOrigin: "left" }} transition={{ duration: .3 }} />
                          </motion.div>
                        </TiltCard>
                      </GlowCard>
                    ))}
                  </StaggerContainer>
                )}
              </div>
            </section>

            {/* What Students Gain */}
            <WaveDivider color={C.gold} toBg="#fff" />
            <section className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
              <Spotlight color="rgba(230,107,38,0.04)" />
              <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-14">
                  <SLabel text="Student Outcomes" />
                  <AHeading className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
                    What Students Gain
                  </AHeading>
                </div>
                <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" stagger={0.09} from="bottom">
                  {workshopsData.studentGains.map((gain, i) => (
                    <GlowCard key={i} accent={C.gold}>
                      <TiltCard>
                        <motion.div whileHover={{ y: -8, boxShadow: "0 20px 50px rgba(0,0,0,0.08)" }}
                          className="p-5 sm:p-6 rounded-xl border border-gray-200 hover:border-[#D4AF37] transition-all flex flex-col items-center text-center shadow-sm h-full"
                          style={{ background: C.light }}>
                          <Float duration={4 + i * .4} delay={i * .25}>
                            <motion.div whileHover={{ rotate: 360, scale: 1.2 }} transition={{ duration: .5 }}>
                              <BadgeCheck className="w-8 h-8 mb-3" style={{ color: C.gold }} />
                            </motion.div>
                          </Float>
                          <p className="text-sm sm:text-base" style={{ color: C.text }}>{gain}</p>
                        </motion.div>
                      </TiltCard>
                    </GlowCard>
                  ))}
                </StaggerContainer>
              </div>
            </section>

            {/* Why Choose Us */}
            <WaveDivider color={C.gold} toBg={C.light} />
            <section className="py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background: C.light }}>
              <NoiseCanvas opacity={0.18} />
              <div className="max-w-5xl mx-auto relative z-10">
                <div className="text-center mb-14">
                  <SLabel text="Why Stackenzo" />
                  <AHeading className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
                    Why Choose Our Workshops
                  </AHeading>
                </div>
                <StaggerContainer className="grid sm:grid-cols-2 gap-4" stagger={0.09} from="bottom">
                  {workshopsData.whyChoose.map((reason, i) => (
                    <GlowCard key={i} accent={C.dark}>
                      <TiltCard intensity={7}>
                        <motion.div whileHover={{ y: -5, boxShadow: "0 18px 40px rgba(0,0,0,0.08)" }}
                          className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 hover:border-[#D4AF37] transition-all shadow-sm h-full">
                          <Float duration={3.5 + i * .3} delay={i * .2}>
                            <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: C.gold }} />
                          </Float>
                          <span className="text-sm sm:text-base" style={{ color: C.text }}>{reason}</span>
                        </motion.div>
                      </TiltCard>
                    </GlowCard>
                  ))}
                </StaggerContainer>
              </div>
            </section>
            <WaveDivider color={C.gold} flip toBg="#3D1A0A" />

            {/* Philosophy Banner */}
            <section className="py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#E66B26,#C5531A)" }}>
              <Spotlight color="rgba(212,175,55,0.06)" />
              <div className="absolute inset-0"><ParticleCanvas count={14} color="rgba(212,175,55,0.07)" /></div>
              {[100, 180, 260].map((s, i) => (
                <Float key={i} duration={6 + i * 2} yRange={12} delay={i}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
                  style={{ width: s, height: s, border: "1px solid rgba(212,175,55,0.1)" }} />
              ))}
              <div className="max-w-4xl mx-auto text-center relative z-10">
                <Reveal from="top">
                  <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8" style={{ border: "1px solid rgba(212,175,55,0.35)", background: "rgba(212,175,55,0.1)" }}>
                    <motion.div animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 2.8, repeat: Infinity }}>
                      <Star className="w-4 h-4" style={{ color: C.gold }} />
                    </motion.div>
                    <span className="text-sm font-bold" style={{ color: C.gold }}>Our Philosophy</span>
                  </div>
                </Reveal>
                <Reveal from="bottom" delay={.1}>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Our Workshop Philosophy</h2>
                </Reveal>
                <Reveal from="bottom" delay={.2}>
                  <p className="text-xl sm:text-2xl font-semibold mb-8" style={{ color: "rgba(255,255,255,0.88)" }}>
                    Workshops should not just teach — they should transform thinking.
                  </p>
                </Reveal>
                <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4" stagger={0.09} from="scale">
                  {["Build skills", "Create awareness", "Boost confidence", "Prepare for future"].map((item, i) => (
                    <motion.div key={i} whileHover={{ scale: 1.06, boxShadow: "0 8px 24px rgba(212,175,55,0.18)" }}
                      className="p-3 sm:p-4 rounded-lg backdrop-blur-sm"
                      style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)" }}>
                      <p className="text-sm sm:text-base text-white font-semibold">{item}</p>
                    </motion.div>
                  ))}
                </StaggerContainer>
              </div>
            </section>

          </motion.div>
        ) : (

          /* ══ INTERNSHIPS VIEW ══ */
          <motion.div key="internships" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: .4 }}>

            <section id="ws-intro" className="py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background: `linear-gradient(135deg,${C.light},#fff)` }}>
              <NoiseCanvas opacity={0.18} />
              <Spotlight color="rgba(230,107,38,0.04)" />
              <div className="absolute inset-0 opacity-[.03]" style={{ backgroundImage: "radial-gradient(circle,#E66B26 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
              <div className="max-w-4xl mx-auto text-center relative z-10">
                <Reveal from="scale">
                  <Float duration={4} yRange={10}>
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                      style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
                      <Briefcase className="w-10 h-10 text-white" />
                    </div>
                  </Float>
                </Reveal>
                <SLabel text="Internship Program" />
                <AHeading className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
                  Internship Program at Stackenzo
                </AHeading>
                <Reveal from="bottom" delay={.1}>
                  <p className="text-xl sm:text-2xl font-semibold mb-4" style={{ color: C.dark }}>
                    Learn From the Ground. Grow With Confidence. Enjoy the Work Culture.
                  </p>
                </Reveal>
                <Reveal from="bottom" delay={.2}>
                  <p className="text-lg sm:text-xl leading-relaxed mb-8" style={{ color: C.text }}>
                    At Stackenzo, our internship program is not just about certificates or short-term training.
                    It is about real exposure, real learning, and real motivation.
                  </p>
                </Reveal>
                <Reveal from="bottom" delay={.3}>
                  <MagBtn onClick={() => { setQueryForm({ ...queryForm, category: "internship" }); setShowQueryForm(true); }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border font-semibold transition-all shadow-sm hover:shadow-md"
                    style={{ background: "#fff", color: C.dark, borderColor: C.gold }}>
                    <HelpCircle className="w-5 h-5" style={{ color: C.gold }} />
                    Have Internship Questions? Ask Us
                  </MagBtn>
                </Reveal>
              </div>
            </section>

            {/* Internship dept filter */}
            <section className="py-10 px-4 sm:px-6 bg-white border-y border-gray-100">
              <div className="max-w-6xl mx-auto">
                <Reveal from="top" className="text-center mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold" style={{ color: C.dark }}>Filter Internships by Department</h3>
                </Reveal>
                <StaggerContainer className="flex flex-wrap gap-2 sm:gap-3 justify-center" stagger={0.05} from="bottom">
                  {internshipDepartments.map(dept => (
                    <motion.button key={dept} onClick={() => setSelectedDepartment(dept)}
                      whileHover={{ scale: 1.07, y: -2 }} whileTap={{ scale: .96 }}
                      className="px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition-all shadow-sm"
                      style={selectedDepartment === dept
                        ? { background: `linear-gradient(135deg,${C.dark},${C.mid})`, color: "#fff", boxShadow: "0 6px 18px rgba(230,107,38,0.25)" }
                        : { background: "#fff", color: C.text, border: "1px solid #e5e7eb" }}>
                      {dept}
                    </motion.button>
                  ))}
                </StaggerContainer>
              </div>
            </section>

            {/* Internship grid */}
            <section id="ws-grid" className="py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background: C.light }}>
              <NoiseCanvas opacity={0.18} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <motion.span className="font-black leading-none tracking-tighter uppercase text-[#E66B26]/[0.02]"
                  style={{ fontSize: "14vw" }}
                  animate={{ y: [0, -12, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}>
                  INTERN
                </motion.span>
              </div>
              <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-14">
                  <SLabel text="Available Roles" />
                  <AHeading className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
                    Available Internships
                  </AHeading>
                </div>
                {searchFilteredInternships.length === 0 ? (
                  <Reveal from="scale" className="text-center py-12">
                    <div className="text-5xl mb-4">🔍</div>
                    <p className="text-xl" style={{ color: C.text }}>No internships found</p>
                  </Reveal>
                ) : (
                  <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" stagger={0.08} from="bottom">
                    {searchFilteredInternships.map((internship) => (
                      <GlowCard key={internship.id} accent={C.gold}>
                        <TiltCard intensity={7}>
                          <motion.div whileHover={{ y: -8, boxShadow: "0 24px 55px rgba(0,0,0,0.10)" }}
                            className="group bg-white rounded-xl sm:rounded-2xl border border-gray-200 hover:border-[#E66B26] transition-all overflow-hidden shadow-sm h-full">
                            <div className="p-4 sm:p-6">
                              <div className="flex items-center gap-3 mb-4">
                                <Float duration={4} yRange={6}>
                                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border flex-shrink-0"
                                    style={{ background: C.light, borderColor: `${C.gold}55` }}>
                                    <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: C.gold }} />
                                  </div>
                                </Float>
                                <div>
                                  <h3 className="text-base sm:text-lg font-bold group-hover:text-[#E66B26] transition-colors" style={{ color: C.text }}>
                                    {internship.title}
                                  </h3>
                                  <p className="text-xs sm:text-sm" style={{ color: "rgba(26,26,26,0.55)" }}>{internship.duration} • {internship.type}</p>
                                </div>
                              </div>
                              <p className="text-xs sm:text-sm mb-4 line-clamp-2" style={{ color: "rgba(26,26,26,0.65)" }}>{internship.description}</p>
                              <div className="mb-3">
                                <p className="text-xs mb-2" style={{ color: "rgba(26,26,26,0.5)" }}>Technologies:</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {internship.technologies.slice(0, 3).map((tech, j) => (
                                    <span key={j} className="px-2 py-0.5 text-xs rounded-full" style={{ background: C.light, color: C.dark, border: `1px solid ${C.gold}55` }}>{tech}</span>
                                  ))}
                                  {internship.technologies.length > 3 && <span className="px-2 py-0.5 bg-gray-100 text-xs rounded-full border border-gray-200" style={{ color: C.text }}>+{internship.technologies.length - 3}</span>}
                                </div>
                              </div>
                              <div className="mb-5">
                                <p className="text-xs mb-2" style={{ color: "rgba(26,26,26,0.5)" }}>Suited for:</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {internship.suitedFor.slice(0, 3).map((branch, j) => (
                                    <span key={j} className="px-2 py-0.5 text-xs rounded-full" style={{ background: C.light, color: C.dark, border: `1px solid ${C.gold}55` }}>{branch}</span>
                                  ))}
                                  {internship.suitedFor.length > 3 && <span className="px-2 py-0.5 bg-gray-100 text-xs rounded-full border border-gray-200" style={{ color: C.text }}>+{internship.suitedFor.length - 3}</span>}
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <motion.button onClick={() => { setSelectedInternship(internship); setShowInternshipRegModal(true); }}
                                  whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }}
                                  className="w-full px-4 py-2.5 sm:py-3 text-white rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow flex items-center justify-center gap-2"
                                  style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
                                  <span>Apply Now</span>
                                  <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                    <ChevronRight className="w-4 h-4" />
                                  </motion.div>
                                </motion.button>
                                <motion.button
                                  onClick={() => { setQueryForm({ ...queryForm, category: "internship", subject: internship.title, message: `I'm interested in the ${internship.title} internship.` }); setShowQueryForm(true); }}
                                  whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }}
                                  className="w-full px-4 py-2 bg-white text-sm rounded-lg flex items-center justify-center gap-2 transition-all"
                                  style={{ border: `1px solid ${C.gold}`, color: C.text }}>
                                  <HelpCircle className="w-3 h-3" style={{ color: C.gold }} />
                                  Quick Query
                                </motion.button>
                              </div>
                            </div>
                            <motion.div className="h-1 bg-gradient-to-r from-[#D4AF37] to-[#C5531A]"
                              initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} style={{ transformOrigin: "left" }} transition={{ duration: .3 }} />
                          </motion.div>
                        </TiltCard>
                      </GlowCard>
                    ))}
                  </StaggerContainer>
                )}
              </div>
            </section>

            {/* What Interns Gain */}
            <WaveDivider color={C.gold} toBg="#fff" />
            <section className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
              <Spotlight color="rgba(230,107,38,0.04)" />
              <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-14">
                  <SLabel text="Intern Benefits" />
                  <AHeading className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
                    What Interns Gain at Stackenzo
                  </AHeading>
                </div>
                <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" stagger={0.09} from="bottom">
                  {["Professional Experience", "Industry-Ready Skills", "Portfolio Development", "Industry Connections", "Stipend and Benefits", "Experience Letter"].map((gain, i) => (
                    <GlowCard key={i} accent={C.gold}>
                      <TiltCard>
                        <motion.div whileHover={{ y: -8, boxShadow: "0 20px 50px rgba(0,0,0,0.08)" }}
                          className="p-5 sm:p-6 rounded-xl border border-gray-200 hover:border-[#D4AF37] transition-all flex flex-col items-center text-center shadow-sm h-full"
                          style={{ background: C.light }}>
                          <Float duration={4 + i * .4} delay={i * .25}>
                            <motion.div whileHover={{ rotate: 360, scale: 1.2 }} transition={{ duration: .5 }}>
                              <BadgeCheck className="w-8 h-8 mb-3" style={{ color: C.gold }} />
                            </motion.div>
                          </Float>
                          <p className="text-sm sm:text-base font-semibold" style={{ color: C.text }}>{gain}</p>
                        </motion.div>
                      </TiltCard>
                    </GlowCard>
                  ))}
                </StaggerContainer>
              </div>
            </section>

            {/* Why Choose Stackenzo Internships */}
            <WaveDivider color={C.gold} toBg={C.light} />
            <section className="py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background: C.light }}>
              <NoiseCanvas opacity={0.18} />
              <div className="max-w-5xl mx-auto relative z-10">
                <div className="text-center mb-14">
                  <SLabel text="Why Stackenzo" />
                  <AHeading className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
                    Why Choose Stackenzo Internships
                  </AHeading>
                </div>
                <StaggerContainer className="grid sm:grid-cols-2 gap-4" stagger={0.09} from="bottom">
                  {["Real-world project experience with live deployments", "Guidance from industry experts and mentors", "Flexible working hours and remote options", "Certificate and letter of recommendation", "Opportunity to work on cutting-edge technologies", "Career guidance and placement assistance"].map((reason, i) => (
                    <GlowCard key={i} accent={C.dark}>
                      <TiltCard intensity={7}>
                        <motion.div whileHover={{ y: -5, boxShadow: "0 18px 40px rgba(0,0,0,0.08)" }}
                          className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 hover:border-[#D4AF37] transition-all shadow-sm h-full">
                          <Float duration={3.5 + i * .3} delay={i * .2}>
                            <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: C.gold }} />
                          </Float>
                          <span className="text-sm sm:text-base" style={{ color: C.text }}>{reason}</span>
                        </motion.div>
                      </TiltCard>
                    </GlowCard>
                  ))}
                </StaggerContainer>
              </div>
            </section>
            <WaveDivider color={C.gold} flip toBg="#3D1A0A" />

            {/* Internship Philosophy Banner */}
            <section className="py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#E66B26,#C5531A)" }}>
              <Spotlight color="rgba(212,175,55,0.06)" />
              <div className="absolute inset-0"><ParticleCanvas count={14} color="rgba(212,175,55,0.07)" /></div>
              {[100, 180, 260].map((s, i) => (
                <Float key={i} duration={6 + i * 2} yRange={12} delay={i}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
                  style={{ width: s, height: s, border: "1px solid rgba(212,175,55,0.1)" }} />
              ))}
              <div className="max-w-4xl mx-auto text-center relative z-10">
                <Reveal from="top">
                  <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8" style={{ border: "1px solid rgba(212,175,55,0.35)", background: "rgba(212,175,55,0.1)" }}>
                    <motion.div animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 2.8, repeat: Infinity }}>
                      <Star className="w-4 h-4" style={{ color: C.gold }} />
                    </motion.div>
                    <span className="text-sm font-bold" style={{ color: C.gold }}>Our Philosophy</span>
                  </div>
                </Reveal>
                <Reveal from="bottom" delay={.1}>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Our Internship Philosophy</h2>
                </Reveal>
                <Reveal from="bottom" delay={.2}>
                  <p className="text-xl sm:text-2xl font-semibold mb-8" style={{ color: "rgba(255,255,255,0.88)" }}>
                    Internships should not just train — they should transform careers.
                  </p>
                </Reveal>
                <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4" stagger={0.09} from="scale">
                  {["Build expertise", "Create opportunities", "Boost employability", "Prepare for success"].map((item, i) => (
                    <motion.div key={i} whileHover={{ scale: 1.06, boxShadow: "0 8px 24px rgba(212,175,55,0.18)" }}
                      className="p-3 sm:p-4 rounded-lg backdrop-blur-sm"
                      style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)" }}>
                      <p className="text-sm sm:text-base text-white font-semibold">{item}</p>
                    </motion.div>
                  ))}
                </StaggerContainer>
              </div>
            </section>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ WORKSHOP DETAIL MODAL ══ */}
      <AnimatePresence>
        {selectedWorkshop && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
            onClick={() => setSelectedWorkshop(null)}>
            <motion.div initial={{ opacity: 0, scale: .9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
              <div className="sticky top-0 p-4 sm:p-6 flex items-center justify-between z-10 rounded-t-2xl"
                style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
                <h2 className="text-xl sm:text-2xl font-bold text-white pr-8">{selectedWorkshop.title}</h2>
                <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: .9 }}
                  onClick={() => setSelectedWorkshop(null)} className="text-white p-1 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.button>
              </div>
              <div className="p-4 sm:p-6 space-y-5">
                <div className="p-4 rounded-xl border border-gray-200" style={{ background: C.light }}>
                  <p className="text-sm sm:text-base leading-relaxed" style={{ color: C.text }}>{selectedWorkshop.description}</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-gray-200" style={{ background: C.light }}>
                    <p className="font-semibold mb-2 flex items-center gap-2" style={{ color: C.dark }}>
                      <Clock className="w-4 h-4" style={{ color: C.gold }} /> Duration
                    </p>
                    <p className="text-lg" style={{ color: C.text }}>{selectedWorkshop.duration}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-gray-200" style={{ background: C.light }}>
                    <p className="font-semibold mb-2 flex items-center gap-2" style={{ color: C.dark }}>
                      <Users className="w-4 h-4" style={{ color: C.gold }} /> Best Suited For
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedWorkshop.suitedFor.map((branch, i) => (
                        <span key={i} className="px-3 py-1 text-sm rounded-full" style={{ background: "#fff", color: C.dark, border: `1px solid ${C.gold}55` }}>{branch}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: C.dark }}>
                    <Code className="w-5 h-5" style={{ color: C.gold }} /> Topics Covered
                  </h3>
                  <div className="space-y-2">
                    {selectedWorkshop.topics.map((topic, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .05 }}
                        className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#D4AF37] transition-all"
                        style={{ background: C.light }}>
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: C.gold }} />
                        <span className="text-sm sm:text-base" style={{ color: C.text }}>{topic}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: C.dark }}>
                    <Target className="w-5 h-5" style={{ color: C.gold }} /> Learning Outcomes
                  </h3>
                  <div className="space-y-2">
                    {selectedWorkshop.outcomes.map((outcome, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .05 }}
                        className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#D4AF37] transition-all"
                        style={{ background: C.light }}>
                        <Target className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: C.gold }} />
                        <span className="text-sm sm:text-base" style={{ color: C.text }}>{outcome}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }}
                    onClick={() => setSelectedWorkshop(null)}
                    className="flex-1 px-6 py-3 rounded-xl font-semibold border border-gray-200 hover:bg-gray-100 transition"
                    style={{ background: "#f3f4f6", color: C.text }}>
                    Close
                  </motion.button>
                  <MagBtn onClick={() => setShowWorkshopRegModal(true)}
                    className="flex-1 px-6 py-3 text-black rounded-xl font-semibold transition-all shadow-sm hover:shadow flex items-center justify-center gap-2"
                    style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
                    Register Now <ChevronRight className="w-4 h-4" />
                  </MagBtn>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }}
                    onClick={() => { setSelectedWorkshop(null); setQueryForm({ ...queryForm, category: "workshop", subject: selectedWorkshop.title, message: `I'm interested in the ${selectedWorkshop.title} workshop.` }); setShowQueryForm(true); }}
                    className="flex-1 px-6 py-3 rounded-xl font-semibold border flex items-center justify-center gap-2 transition-all"
                    style={{ background: "#fff", color: C.text, borderColor: C.gold }}>
                    <HelpCircle className="w-4 h-4" style={{ color: C.gold }} /> Ask Question
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Registration Modals */}
      {showWorkshopRegModal && selectedWorkshop && (
        <WorkshopRegistrationModal workshop={selectedWorkshop} onClose={() => { setShowWorkshopRegModal(false); setSelectedWorkshop(null); }} />
      )}
      {showInternshipRegModal && selectedInternship && (
        <InternshipRegistrationModal internship={selectedInternship} onClose={() => { setShowInternshipRegModal(false); setSelectedInternship(null); }} />
      )}

      {/* ══ QUERY FORM SECTION ══ */}
      <WaveDivider color={C.gold} toBg="#fff" />
      <section id="ws-query" className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        <Spotlight color="rgba(230,107,38,0.04)" />
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full" style={{ filter: "blur(80px)", opacity: .06, background: C.dark }} />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full" style={{ filter: "blur(80px)", opacity: .06, background: C.mid }} />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <Reveal from="scale">
              <Float duration={4} yRange={8}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                  style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
                  <HelpCircle className="w-8 h-8" style={{ color: C.gold }} />
                </div>
              </Float>
            </Reveal>
            <SLabel text="Contact Us" />
            <AHeading className="text-3xl sm:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
              Have A Question?
            </AHeading>
            <Reveal from="bottom" delay={.15}>
              <p className="text-lg sm:text-xl" style={{ color: C.text }}>
                We're here to help! Send us your queries and we'll get back to you within 24 hours.
              </p>
            </Reveal>
          </div>

          <Reveal from="bottom" delay={.2}>
            <GlowCard accent={C.gold}>
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl">
                <form onSubmit={handleQuerySubmit} className="space-y-6">
                  <div className="p-4 rounded-xl border border-gray-200" style={{ background: C.light }}>
                    <label className="block text-sm font-medium mb-3" style={{ color: C.text }}>Category *</label>
                    <div className="flex flex-wrap gap-3">
                      {[{ id: "workshop", label: "Workshops", Icon: BookOpen }, { id: "internship", label: "Internships", Icon: Briefcase }, { id: "general", label: "General Inquiry", Icon: MessageCircle }].map(type => (
                        <motion.button key={type.id} type="button" whileHover={{ scale: 1.04 }} whileTap={{ scale: .96 }}
                          onClick={() => setQueryForm({ ...queryForm, category: type.id })}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all font-medium text-sm"
                          style={queryForm.category === type.id
                            ? { background: `linear-gradient(135deg,${C.dark},${C.mid})`, color: "#fff", borderColor: C.dark }
                            : { background: "#fff", color: C.text, borderColor: "#e5e7eb" }}>
                          <type.Icon className="w-4 h-4" style={{ color: queryForm.category === type.id ? C.gold : C.gold }} />
                          {type.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: C.text }}>
                        <User className="w-4 h-4" style={{ color: C.gold }} /> Full Name *
                      </label>
                      <input type="text" name="name" value={queryForm.name} onChange={handleQueryChange} required placeholder="Enter your full name"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:border-[#E66B26] focus:outline-none transition-colors" style={{ color: C.text }} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: C.text }}>
                        <Mail className="w-4 h-4" style={{ color: C.gold }} /> Email Address *
                      </label>
                      <input type="email" name="email" value={queryForm.email} onChange={handleQueryChange} required placeholder="Enter your email"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:border-[#E66B26] focus:outline-none transition-colors" style={{ color: C.text }} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: C.text }}>
                        <Phone className="w-4 h-4" style={{ color: C.gold }} /> Phone Number
                      </label>
                      <input type="tel" name="phone" value={queryForm.phone} onChange={handleQueryChange} placeholder="Enter your phone number"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:border-[#E66B26] focus:outline-none transition-colors" style={{ color: C.text }} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: C.text }}>
                        <FileText className="w-4 h-4" style={{ color: C.gold }} /> Subject *
                      </label>
                      <input type="text" name="subject" value={queryForm.subject} onChange={handleQueryChange} required placeholder="Enter subject"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:border-[#E66B26] focus:outline-none transition-colors" style={{ color: C.text }} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: C.text }}>
                      <MessageCircle className="w-4 h-4" style={{ color: C.gold }} /> Your Question / Message *
                    </label>
                    <textarea name="message" value={queryForm.message} onChange={handleQueryChange} required rows="4" placeholder="Type your question here…"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:border-[#E66B26] focus:outline-none resize-none transition-colors" style={{ color: C.text }} />
                  </div>
                  <div className="p-4 rounded-xl border border-gray-200" style={{ background: C.light }}>
                    <label className="block text-sm font-medium mb-3" style={{ color: C.text }}>Preferred Contact Method</label>
                    <div className="flex flex-wrap gap-4">
                      {[{ val: "email", Icon: Mail, label: "Email" }, { val: "phone", Icon: Phone, label: "Phone" }, { val: "whatsapp", Icon: MessageCircle, label: "WhatsApp" }].map(o => (
                        <label key={o.val} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="preferredContact" value={o.val} checked={queryForm.preferredContact === o.val} onChange={handleQueryChange} className="text-[#E66B26] focus:ring-[#D4AF37]" />
                          <o.Icon className="w-4 h-4" style={{ color: C.gold }} />
                          <span className="text-sm" style={{ color: C.text }}>{o.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <MagBtn type="submit"
                    className="w-full px-6 py-3.5 text-black rounded-xl font-semibold shadow-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
                    <Send className="w-4 h-4" />
                    Submit Query
                  </MagBtn>
                  <p className="text-xs text-center" style={{ color: "rgba(26,26,26,0.45)" }}>
                    We'll get back to you within 24 hours. Your information is safe with us.
                  </p>
                </form>
              </div>
            </GlowCard>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Workshops;