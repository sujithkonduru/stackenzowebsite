import {
  motion, AnimatePresence, useInView, useScroll, useTransform,
  useSpring, useMotionValue, useVelocity,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  ExternalLink, Code, Globe, Database, Shield,
  ChevronRight, Sparkles, Target, Award, Users,
  TrendingUp, Zap, Star, MessageSquare, CheckCircle,
  ArrowRight, Briefcase, Rocket, BarChart3,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
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
const NAV_SECTIONS = ["pf-hero", "pf-projects", "pf-testimonials", "pf-cta"];
const NAV_LABELS   = ["Hero", "Projects", "Reviews", "Contact"];

/* ══════════════════════════════════════════════
   DATA
══════════════════════════════════════════════ */
const PROJECTS = [
  {
    id: 1,
    title: "E-Commerce Platform",
    category: "Web Development",
    description: "A full-stack e-commerce solution with React, Node.js, and MongoDB featuring real-time inventory management and payment integration.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
    features: ["Real-time inventory", "Secure payments", "Admin dashboard", "Mobile responsive"],
    metrics: { users: "50K+", revenue: "$2M+", satisfaction: "98%" },
    gradient: "from-blue-600 to-cyan-600",
    status: "Live",
  },
  {
    id: 2,
    title: "Healthcare Management System",
    category: "Enterprise Software",
    description: "Comprehensive healthcare management platform for clinics and hospitals with patient records, appointment scheduling, and telemedicine features.",
    technologies: ["React", "Python", "PostgreSQL", "Docker", "Kubernetes"],
    features: ["Patient management", "Telemedicine", "Analytics dashboard", "HIPAA compliant"],
    metrics: { clinics: "200+", patients: "100K+", uptime: "99.9%" },
    gradient: "from-[#E66B26] to-[#C5531A]",
    status: "Live",
  },
  {
    id: 3,
    title: "AI-Powered Analytics Dashboard",
    category: "Data Science",
    description: "Advanced analytics platform using machine learning for predictive insights, automated reporting, and business intelligence.",
    technologies: ["Python", "TensorFlow", "React", "PostgreSQL", "AWS"],
    features: ["Predictive analytics", "Auto ML", "Custom dashboards", "API integration"],
    metrics: { accuracy: "95%", queries: "1M+", clients: "50+" },
    gradient: "from-amber-500 to-orange-600",
    status: "Live",
  },
  {
    id: 4,
    title: "IoT Smart Home System",
    category: "IoT & Robotics",
    description: "Connected smart home ecosystem with voice control, energy monitoring, and automated security features.",
    technologies: ["Arduino", "Raspberry Pi", "MQTT", "React", "Node.js"],
    features: ["Voice control", "Energy monitoring", "Security automation", "Mobile app"],
    metrics: { devices: "10K+", savings: "30%", satisfaction: "96%" },
    gradient: "from-indigo-600 to-blue-600",
    status: "Live",
  },
  {
    id: 5,
    title: "Educational Learning Platform",
    category: "EdTech",
    description: "Interactive learning management system with video streaming, assessments, and progress tracking for educational institutions.",
    technologies: ["React", "Django", "PostgreSQL", "AWS", "WebRTC"],
    features: ["Video streaming", "Assessment tools", "Progress tracking", "Multi-tenant"],
    metrics: { students: "25K+", courses: "500+", institutions: "100+" },
    gradient: "from-teal-600 to-cyan-600",
    status: "Live",
  },
  {
    id: 6,
    title: "FinTech Mobile App",
    category: "Mobile Development",
    description: "Secure mobile banking application with biometric authentication, real-time transactions, and investment tracking.",
    technologies: ["React Native", "Firebase", "Node.js", "MongoDB"],
    features: ["Biometric auth", "Real-time transactions", "Investment tracking", "Push notifications"],
    metrics: { downloads: "100K+", rating: "4.8", transactions: "$50M+" },
    gradient: "from-purple-600 to-pink-600",
    status: "Live",
  },
];

const TESTIMONIALS = [
  { name: "Sarah Johnson",   role: "CEO, TechStart Inc.",  content: "Stackenzo transformed our business with their innovative solutions. The team's expertise and dedication are unmatched.", rating: 5, initials: "SJ" },
  { name: "Michael Chen",   role: "CTO, HealthFirst",     content: "The healthcare management system exceeded our expectations. Reliable, secure, and user-friendly.", rating: 5, initials: "MC" },
  { name: "Emily Rodriguez",role: "Founder, EduLearn",    content: "Their educational platform revolutionized how we deliver learning content. Outstanding results!", rating: 5, initials: "ER" },
];

const STATS = [
  { icon: Code,       value: "150+", label: "Projects Completed" },
  { icon: Users,      value: "500+", label: "Happy Clients"      },
  { icon: Award,      value: "25+",  label: "Awards Won"         },
  { icon: TrendingUp, value: "300%", label: "Client Growth"      },
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
    scale:  { hidden: { scale: .8, opacity: 0 }, visible: { scale: 1, opacity: 1 }, exit: { scale: .88, opacity: 0 } },
  };
  const { hidden, visible, exit } = base[from] || base.bottom;
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
  return (
    <motion.div ref={ref} className={`relative rounded-2xl overflow-hidden ${className}`}
      onMouseMove={e => { const r = ref.current?.getBoundingClientRect(); if (r) setPos({ x: e.clientX - r.left, y: e.clientY - r.top }); }}
      initial={{ opacity: 0, y: 40, scale: .96 }}
      animate={inV ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: .96 }}
      transition={{ duration: .72, ease: EASE_EXPO }}>
      <div className="absolute pointer-events-none rounded-2xl z-0"
        style={{ inset: -1, background: `radial-gradient(300px circle at ${pos.x}px ${pos.y}px,${accent}28,transparent 60%)`, transition: "opacity .3s" }} />
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
function MagBtn({ children, className = "", onClick }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 16 });
  const sy = useSpring(y, { stiffness: 250, damping: 16 });
  return (
    <motion.button ref={ref} style={{ x: sx, y: sy }}
      onMouseMove={e => { const r = ref.current.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * .36); y.set((e.clientY - r.top - r.height / 2) * .36); }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileTap={{ scale: .94 }} onClick={onClick} className={className}>
      {children}
    </motion.button>
  );
}

/* ══════════════════════════════════════════════
   COUNTER
══════════════════════════════════════════════ */
function Counter({ value }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: false });
  const raw = String(value).replace(/[^0-9.]/g, "");
  const num = parseFloat(raw) || 0;
  const sfx = String(value).replace(/[0-9.]/g, "");
  const mv = useMotionValue(0);
  const sp = useSpring(mv, { stiffness: 55, damping: 14 });
  const [d, setD] = useState(0);
  useEffect(() => { mv.set(inV ? num : 0); }, [inV]);
  useEffect(() => sp.on("change", v => setD(Math.round(v))), [sp]);
  return <span ref={ref}>{d}{sfx}</span>;
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

/* ══════════════════════════════════════════════
   PARTICLE CANVAS
══════════════════════════════════════════════ */
function ParticleCanvas({ count = 18, color = "rgba(230,107,38,0.08)" }) {
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
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y); if (d < 88) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = color.replace(/[\d.]+\)$/, `${(1 - d / 88) * .06})`); ctx.stroke(); } }
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
function Spotlight({ color = "rgba(212,175,55,0.07)", size = 560 }) {
  const ref = useRef(null);
  useEffect(() => {
    const fn = e => { if (!ref.current) return; const r = ref.current.getBoundingClientRect(); ref.current.style.background = `radial-gradient(${size}px circle at ${e.clientX - r.left}px ${e.clientY - r.top}px,${color},transparent 70%)`; };
    window.addEventListener("mousemove", fn); return () => window.removeEventListener("mousemove", fn);
  }, []);
  return <div ref={ref} className="absolute inset-0 pointer-events-none z-[1]" />;
}

/* ══════════════════════════════════════════════
   WAVE DIVIDER
══════════════════════════════════════════════ */
function WaveDivider({ color = "#D4AF37", flip = false, toBg = "#fff" }) {
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
      <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: false }} transition={{ duration: .55 }} className="h-px w-8 bg-[#D4AF37] origin-left" />
      <span className="text-[#D4AF37] font-bold tracking-[.2em] text-[11px] uppercase">{text}</span>
      <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: false }} transition={{ duration: .55 }} className="h-px w-8 bg-[#D4AF37] origin-right" />
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
   MARQUEE STRIP
══════════════════════════════════════════════ */
const MARQUEE_ITEMS = ["Web Development", "Mobile Apps", "Enterprise Software", "Data Science", "IoT & Robotics", "EdTech", "Cloud Solutions", "AI & ML", "UI/UX Design", "API Integration"];
function MarqueeStrip() {
  const [paused, setPaused] = useState(false);
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="py-4 overflow-hidden border-y border-black/5 bg-[#FFF4ED]"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <motion.div className="flex gap-10 whitespace-nowrap"
        animate={paused ? {} : { x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 28, ease: "linear" }}>
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-3 text-sm font-semibold select-none text-[#1A1A1A]/40">
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
   MAIN COMPONENT
══════════════════════════════════════════════ */
function Portfolio() {
  /* Hero parallax */
  const heroRef = useRef(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], [0, -110]);
  const heroO = useTransform(heroP, [0, .6], [1, 0.9]);
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

  return (
    <div className="bg-white text-[#1A1A1A] min-h-screen overflow-x-hidden">
      <CustomCursor />
      <ScrollProgressBar />
      <SectionNavDots />
      <Navbar />

      {/* ══ HERO ══ */}
      <section id="pf-hero" ref={heroRef}
        className="relative min-h-screen flex items-center pt-28 sm:pt-36 pb-20 px-4 sm:px-6 overflow-hidden">
        <NoiseCanvas color1="#FFD5B8" color2="#FFF0E6" opacity={0.28} />
        <div className="absolute inset-0 z-[1]"><ParticleCanvas count={18} /></div>

        {/* animated bg gradient */}
        <motion.div className="absolute inset-0 z-[2] opacity-20"
          animate={{ background: ["radial-gradient(circle at 20% 30%,rgba(230,107,38,0.2) 0%,transparent 40%)","radial-gradient(circle at 80% 70%,rgba(230,107,38,0.2) 0%,transparent 40%)","radial-gradient(circle at 20% 30%,rgba(230,107,38,0.2) 0%,transparent 40%)"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />

        {/* blobs */}
        <motion.div style={{ x: b1x, y: b1y }} className="absolute top-16 left-[5%] w-80 h-80 pointer-events-none z-[2]">
          <div className="w-full h-full rounded-full blur-[110px] opacity-[.3]" style={{ background: "radial-gradient(circle,#FFD5B8,transparent)" }} />
        </motion.div>
        <motion.div style={{ x: b2x, y: b2y }} className="absolute bottom-16 right-[5%] w-[420px] h-[420px] pointer-events-none z-[2]">
          <div className="w-full h-full rounded-full blur-[120px] opacity-[.18]" style={{ background: "radial-gradient(circle,#D4AF37,transparent)" }} />
        </motion.div>

        {/* floating orbs */}
        <Float className="absolute top-1/4 left-[7%] w-3 h-3 rounded-full bg-[#D4AF37]/28 z-[2]" duration={5} delay={0} />
        <Float className="absolute top-1/3 right-[9%] w-2 h-2 rounded-full bg-[#E66B26]/22 z-[2]" duration={4} delay={1} />
        <Float className="absolute bottom-1/3 left-[12%] w-4 h-4 rounded-full bg-[#C5531A]/18 z-[2]" duration={6} delay={2} />
        <Float className="absolute bottom-1/4 right-[15%] w-2.5 h-2.5 rounded-full bg-[#D4AF37]/20 z-[2]" duration={5.5} delay={.5} />

        {/* kinetic bg text */}
        <motion.div style={{ y: bigY }} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-[2]">
          <span className="text-[18vw] font-black leading-none tracking-tighter uppercase whitespace-nowrap"
            style={{ color: "rgba(230,107,38,0.018)" }}>PORTFOLIO</span>
        </motion.div>

        {/* dot grid */}
        <div className="absolute inset-0 z-[2] opacity-[.03]"
          style={{ backgroundImage: "radial-gradient(circle,#E66B26 1px,transparent 1px)", backgroundSize: "32px 32px" }} />

        <motion.div style={{ y: heroY, opacity: heroO, scale: heroS }}
          className="max-w-6xl mx-auto text-center relative z-10 w-full">

          {/* badge */}
          <motion.div initial={{ scale: .7, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ duration: .65, ease: EASE_BACK }}
            className="inline-flex items-center gap-2 bg-white/88 backdrop-blur-sm border border-gray-200 rounded-full px-5 py-2.5 mb-8 shadow-sm">
            <motion.div animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}>
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            </motion.div>
            <span className="text-sm font-semibold text-[#E66B26]">Our Portfolio</span>
          </motion.div>

          {/* H1 */}
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .28, duration: .75, ease: EASE_EXPO }}
            className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-[1.05]">
            <span className="text-[#1A1A1A]">Showcasing</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]">Excellence</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .46, ease: EASE_EXPO }}
            className="text-lg sm:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed mb-10 px-4">
            Discover our portfolio of successful projects and innovative solutions that have transformed businesses across industries.
          </motion.p>

          {/* stat pills */}
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .65, ease: EASE_EXPO }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto px-2 mb-10">
            {STATS.map((s, i) => (
              <Float key={i} duration={4 + i * .5} delay={i * .3}>
                <GlowCard accent="#D4AF37">
                  <TiltCard>
                    <motion.div whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(0,0,0,0.08)" }}
                      className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 text-center hover:border-[#D4AF37] transition-all shadow-sm cursor-default">
                      <s.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#E66B26] mx-auto mb-1.5" />
                      <div className="text-lg sm:text-2xl font-black text-[#1A1A1A]"><Counter value={s.value} /></div>
                      <div className="text-[10px] sm:text-xs text-gray-400">{s.label}</div>
                    </motion.div>
                  </TiltCard>
                </GlowCard>
              </Float>
            ))}
          </motion.div>

          {/* scroll cue */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
            className="flex justify-center cursor-pointer"
            onClick={() => document.getElementById("pf-projects")?.scrollIntoView({ behavior: "smooth" })}>
            <Float duration={2} yRange={10}>
              <div className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-[#E66B26] transition-colors">
                <span className="text-xs font-medium">View Projects</span>
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

      {/* ══ PROJECTS ══ */}
      <WaveDivider color="#D4AF37" toBg="#FFF4ED" />
      <section id="pf-projects" className="py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background: "#FFF4ED" }}>
        <NoiseCanvas color1="#FFD5B8" color2="#FFCBA4" opacity={0.2} />
        <Spotlight color="rgba(230,107,38,0.04)" />

        {/* kinetic bg */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <motion.span className="text-[14vw] font-black leading-none tracking-tighter uppercase text-[#E66B26]/[0.018]"
            animate={{ y: [0, -10, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}>PROJECTS</motion.span>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <SLabel text="Our Work" />
            <AHeading className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A] mt-1" delay={.05}>
              Featured Projects
            </AHeading>
            <Reveal from="bottom" delay={.2}>
              <div className="w-16 h-[3px] bg-[#D4AF37] mx-auto mt-4 rounded" />
              <p className="text-gray-500 max-w-2xl mx-auto mt-4">Explore our successful projects that showcase innovation, quality, and results</p>
            </Reveal>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {PROJECTS.map((project, idx) => (
              <Reveal key={project.id} from={idx % 2 === 0 ? "left" : "right"} delay={idx * .07}>
                <GlowCard accent="#D4AF37" className="h-full">
                  <TiltCard intensity={6} className="h-full">
                    <motion.div whileHover={{ y: -8, boxShadow: "0 28px 65px rgba(0,0,0,0.10)" }}
                      className="group relative bg-white rounded-2xl sm:rounded-3xl border border-gray-200 hover:border-[#D4AF37] transition-all overflow-hidden shadow-sm h-full">

                      {/* gradient header */}
                      <div className={`h-48 sm:h-56 bg-gradient-to-br ${project.gradient} relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/20" />
                        {/* animated shine */}
                        <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                          animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }} />
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#E66B26] text-xs rounded-full border border-[#D4AF37]/50 font-semibold shadow-sm">
                            {project.status}
                          </span>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <span className="inline-block px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[#E66B26] text-xs rounded-full border border-[#D4AF37]/50 mb-2 font-medium">
                            {project.category}
                          </span>
                          <h3 className="text-lg sm:text-xl font-black text-white drop-shadow-lg">{project.title}</h3>
                        </div>
                      </div>

                      {/* content */}
                      <div className="p-6 sm:p-7">
                        <p className="text-sm sm:text-base text-gray-500 mb-5 leading-relaxed">{project.description}</p>

                        {/* technologies */}
                        <div className="mb-5">
                          <h4 className="text-xs font-black text-[#E66B26] mb-2.5 uppercase tracking-wider">Technologies</h4>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, i) => (
                              <motion.span key={i} whileHover={{ scale: 1.07 }}
                                className="px-2.5 py-1 bg-[#FFF4ED] text-[#E66B26] text-xs rounded-full border border-[#D4AF37]/30 font-medium cursor-default">
                                {tech}
                              </motion.span>
                            ))}
                          </div>
                        </div>

                        {/* features */}
                        <div className="mb-5">
                          <h4 className="text-xs font-black text-[#E66B26] mb-2.5 uppercase tracking-wider">Key Features</h4>
                          <div className="grid grid-cols-2 gap-1.5">
                            {project.features.map((feature, i) => (
                              <div key={i} className="flex items-center gap-1.5">
                                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2.2, repeat: Infinity, delay: i * .22 }}>
                                  <CheckCircle className="w-3 h-3 text-[#D4AF37] shrink-0" />
                                </motion.div>
                                <span className="text-xs text-gray-600">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* metrics */}
                        <div className="grid grid-cols-3 gap-3 p-4 bg-[#FFF4ED] rounded-xl border border-gray-200">
                          {Object.entries(project.metrics).map(([key, value]) => (
                            <div key={key} className="text-center">
                              <div className="text-base sm:text-lg font-black text-[#1A1A1A]">{value}</div>
                              <div className="text-[10px] text-gray-400 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</div>
                            </div>
                          ))}
                        </div>

                        {/* hover bottom accent */}
                        <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#C5531A]"
                          initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} style={{ transformOrigin: "left" }} transition={{ duration: .3 }} />
                      </div>
                    </motion.div>
                  </TiltCard>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <WaveDivider color="#D4AF37" flip toBg="#fff" />

      {/* ══ TESTIMONIALS ══ */}
      <section id="pf-testimonials" className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        <Spotlight color="rgba(230,107,38,0.04)" />
        <div className="absolute inset-0 opacity-[.028]"
          style={{ backgroundImage: "radial-gradient(circle,#E66B26 1px,transparent 1px)", backgroundSize: "28px 28px" }} />

        {/* kinetic bg */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <motion.span className="text-[13vw] font-black leading-none tracking-tighter uppercase text-[#E66B26]/[0.018]"
            animate={{ y: [0, -10, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>REVIEWS</motion.span>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <SLabel text="Client Stories" />
            <AHeading className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
              Client Testimonials
            </AHeading>
            <Reveal from="bottom" delay={.2}>
              <div className="w-16 h-[3px] bg-[#D4AF37] mx-auto mt-4 rounded" />
              <p className="text-gray-500 max-w-2xl mx-auto mt-4">What our clients say about working with us</p>
            </Reveal>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8" stagger={0.1} from="bottom">
            {TESTIMONIALS.map((t, i) => (
              <GlowCard key={i} accent="#D4AF37">
                <TiltCard intensity={7}>
                  <motion.div whileHover={{ y: -8, boxShadow: "0 24px 55px rgba(212,175,55,0.12)" }}
                    className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-[#D4AF37] transition-all shadow-sm h-full flex flex-col">
                    <div className="flex gap-1 mb-4">
                      {[...Array(t.rating)].map((_, j) => (
                        <motion.div key={j} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: j * .15 }}>
                          <Star className="w-4 h-4 text-[#D4AF37] fill-current" />
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mb-5 italic leading-relaxed flex-1">"{t.content}"</p>
                    <div className="flex items-center gap-3 mt-auto">
                      <Float duration={4 + i * .4} yRange={5}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shadow-md"
                          style={{ background: `linear-gradient(135deg,#E66B26,#C5531A)` }}>
                          {t.initials}
                        </div>
                      </Float>
                      <div>
                        <div className="text-sm font-black text-[#1A1A1A]">{t.name}</div>
                        <div className="text-xs text-gray-400">{t.role}</div>
                      </div>
                    </div>
                    <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#C5531A] rounded-b-2xl"
                      initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: .35 }} />
                  </motion.div>
                </TiltCard>
              </GlowCard>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <WaveDivider color="#D4AF37" toBg="#FFF4ED" />
      <section id="pf-cta" className="py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background: "#FFF4ED" }}>
        <NoiseCanvas opacity={0.18} />
        <div className="max-w-4xl mx-auto relative z-10">
          <Reveal from="bottom">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              {/* BG */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#E66B26] to-[#C5531A]" />
              <div className="absolute inset-0 opacity-[.06]"
                style={{ backgroundImage: "radial-gradient(circle at 2px 2px,rgba(255,255,255,0.3) 1px,transparent 0)", backgroundSize: "38px 38px" }} />
              <ParticleCanvas count={12} color="rgba(212,175,55,0.09)" />
              <Spotlight color="rgba(212,175,55,0.07)" size={360} />

              {/* Floating rings */}
              {[80, 140, 210].map((s, i) => (
                <Float key={i} duration={6 + i * 2} yRange={12} delay={i}
                  className="absolute right-12 top-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/20 pointer-events-none"
                  style={{ width: s, height: s }} />
              ))}

              <div className="relative z-10 p-10 sm:p-14 text-center">
                <Reveal from="top">
                  <div className="inline-flex items-center gap-2 border border-[#D4AF37]/38 rounded-full px-5 py-2 mb-8 bg-[#D4AF37]/10 backdrop-blur-sm">
                    <motion.div animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 2.8, repeat: Infinity }}>
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    </motion.div>
                    <span className="text-sm text-[#D4AF37] font-bold">Start Your Project</span>
                  </div>
                </Reveal>

                <Reveal from="bottom" delay={.1}>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
                    Ready to Start Your Project?
                  </h2>
                </Reveal>

                <Reveal from="bottom" delay={.2}>
                  <p className="text-lg text-white/85 mb-10 max-w-2xl mx-auto">
                    Let's discuss how we can help bring your vision to life with our expertise and innovative solutions.
                  </p>
                </Reveal>

                <Reveal from="bottom" delay={.32}>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
                    <Link to="/Contact">
                      <MagBtn className="group relative px-8 py-4 bg-white text-[#E66B26] rounded-xl font-black overflow-hidden shadow-xl">
                        <span className="relative z-10 flex items-center gap-2">
                          Start Your Project
                          <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}><ArrowRight className="w-5 h-5" /></motion.span>
                        </span>
                        <motion.div className="absolute inset-0 bg-[#FFF4ED] origin-left" initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: .4 }} />
                      </MagBtn>
                    </Link>
                    <Link to="/Services">
                      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: .96 }}
                        className="px-8 py-4 border-2 border-white text-white rounded-xl font-black hover:bg-white hover:text-[#E66B26] transition-all flex items-center justify-center gap-2 shadow-sm">
                        <Target className="w-5 h-5" />
                        Explore Services
                      </motion.button>
                    </Link>
                  </div>
                </Reveal>

                {/* trust badges */}
                <Reveal from="bottom" delay={.45}>
                  <div className="flex flex-wrap justify-center gap-6 mt-10">
                    {[{ icon: Shield, text: "ISO Certified" }, { icon: Award, text: "Award Winning" }, { icon: Users, text: "500+ Clients" }].map((b, i) => (
                      <motion.div key={i} whileHover={{ scale: 1.08, y: -3 }} className="flex items-center gap-2 text-white/70 cursor-default">
                        <Float duration={4 + i} delay={i * .5} yRange={5}>
                          <b.icon className="w-4 h-4 text-[#D4AF37]" />
                        </Float>
                        <span className="text-sm font-medium">{b.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default Portfolio;