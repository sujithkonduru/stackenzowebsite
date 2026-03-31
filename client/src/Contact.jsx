import {
  motion, AnimatePresence, useInView, useScroll, useTransform,
  useSpring, useMotionValue, useVelocity,
} from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Toast from "./Toast";
import {
  Mail, Phone, MapPin, Send, MessageSquare,
  Clock, Linkedin, Twitter, Instagram, Facebook, Youtube,
  Sparkles, ChevronRight, CheckCircle, Headphones, Rocket,
  Shield, Plus, Minus, Star,ArrowRight,
} from "lucide-react";
import { href } from "react-router-dom";

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
const NAV_SECTIONS = ["ct-hero", "ct-form", "ct-map", "ct-faq"];
const NAV_LABELS   = ["Top", "Contact", "Location", "FAQ"];

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
   REVEAL
══════════════════════════════════════════════ */
function Reveal({ children, className = "", delay = 0, from = "bottom" }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: false, margin: "-55px" });
  const dir = useScrollDir();
  const V = {
    bottom: { hidden: { y: 65, opacity: 0, scale: .96, filter: "blur(6px)" }, visible: { y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }, exit: { y: -48, opacity: 0, scale: .97 } },
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

/* ══════════════════════════════════════════════
   STAGGER CONTAINER
══════════════════════════════════════════════ */
function StaggerContainer({ children, className = "", stagger = 0.1, from = "bottom" }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: false, margin: "-55px" });
  const dir = useScrollDir();
  const base = {
    bottom: { hidden: { y: 55, opacity: 0, scale: .95, filter: "blur(5px)" }, visible: { y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }, exit: { y: -38, opacity: 0 } },
    left:   { hidden: { x: -55, opacity: 0 }, visible: { x: 0, opacity: 1 }, exit: { x: 38, opacity: 0 } },
    right:  { hidden: { x: 55, opacity: 0 }, visible: { x: 0, opacity: 1 }, exit: { x: -38, opacity: 0 } },
    scale:  { hidden: { scale: .75, opacity: 0 }, visible: { scale: 1, opacity: 1 }, exit: { scale: .85, opacity: 0 } },
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
        style={{ inset: -1, background: `radial-gradient(320px circle at ${pos.x}px ${pos.y}px,${accent}30,transparent 60%)` }} />
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

/* ══════════════════════════════════════════════
   MAGNETIC BUTTON
══════════════════════════════════════════════ */
function MagBtn({ children, className = "", onClick, type = "button", disabled = false }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 16 });
  const sy = useSpring(y, { stiffness: 250, damping: 16 });
  return (
    <motion.button ref={ref} type={type} disabled={disabled}
      style={{ x: sx, y: sy }}
      onMouseMove={e => { if (!disabled) { const r = ref.current.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * .38); y.set((e.clientY - r.top - r.height / 2) * .38); } }}
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
    const att = () => { document.querySelectorAll("a,button,[data-hover]").forEach(el => { el.addEventListener("mouseenter", () => setHov(true)); el.addEventListener("mouseleave", () => setHov(false)); }); };
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
      <div ref={outer} className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9998]"
        style={{ border: hov ? `1.5px solid ${C.gold}` : "1.5px solid rgba(230,107,38,0.45)", background: hov ? "rgba(212,175,55,0.07)" : "transparent", willChange: "transform", transition: "border-color .15s,background .15s" }} />
      <div ref={dot} className="fixed top-0 left-0 w-[6px] h-[6px] rounded-full pointer-events-none z-[9999]"
        style={{ background: hov ? C.gold : C.dark, willChange: "transform", transition: "background .1s" }} />
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
function NoiseCanvas({ color1 = "#FFD5B8", color2 = "#FFF4ED", opacity = 0.24 }) {
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
   DATA
══════════════════════════════════════════════ */
const contactInfo = [
  { icon: Mail,    title: "Email Us",       details: "hello@stackenzo.com",              link: "mailto:hello@stackenzo.com" },
  { icon: Phone,   title: "Call Us",        details: "+91 9247577907",                 link: "tel:+919247577907" },
  { icon: MapPin,  title: "Visit Us",       details: "Nellore, Andhra Pradesh, India",   link: "https://www.google.com/maps" },
  { icon: Clock,   title: "Working Hours",  details: "Mon - Sat: 9:00 AM - 6:00 PM",     link: "#" },
];

const socialLinks = [
  { icon: Linkedin,  name: "LinkedIn"  },
  { icon: Twitter,   name: "Twitter"   },
  { icon: Instagram, name: "Instagram", href: "https://www.instagram.com/stackenzo" },
  { icon: Facebook,  name: "Facebook",  href: "https://www.facebook.com/stackenzo" },
  { icon: Youtube,   name: "YouTube"   },
];

const stats = [
  { icon: Headphones, label: "24/7 Support",  },
  { icon: Rocket,     label: "Fast Response", },
  { icon: Shield,     label: "Secure",},
];

const faqs = [
  { q: "What are your response times?",             a: "We typically respond to all inquiries within 24 hours during business days, often much faster!" },
  { q: "Do you offer free consultations?",           a: "Yes! We offer free initial consultations to discuss your project requirements and provide expert advice." },
  { q: "Can I schedule a call?",                     a: "Absolutely! You can schedule a call by mentioning your preferred time in the contact form, and we'll send you a calendar invite." },
  { q: "Do you work with international clients?",    a: "Yes, we work with clients globally and can accommodate different time zones with flexible scheduling." },
];

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [focusedField, setFocusedField] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (data.success) { setToast({ show: true, message: "Thank you! We'll contact you within 24 hours." }); setFormData({ name: "", email: "", phone: "", subject: "", message: "" }); }
      else { const msg = data.errors ? data.errors.map(e => e.msg || e.message).join(", ") : data.message; setToast({ show: true, message: msg || "Failed to submit. Please try again." }); }
    } catch { setToast({ show: true, message: "Error submitting. Please try again." }); }
    finally { setIsSubmitting(false); }
  };

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

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
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  return (
    <div className="bg-white text-[#1A1A1A] min-h-screen overflow-x-hidden">
      <Toast message={toast.message} isVisible={toast.show} onClose={() => setToast({ show: false, message: "" })} />
      <CustomCursor />
      <ScrollProgressBar />
      <SectionNavDots />
      <Navbar />

      {/* ══ HERO ══ */}
      <section id="ct-hero" ref={heroRef} className="relative min-h-screen pt-28 sm:pt-36 pb-20 px-4 sm:px-6 overflow-hidden flex items-center">
        <NoiseCanvas color1="#FFD5B8" color2="#FFF0E6" opacity={0.24} />
        <div className="absolute inset-0 z-[1]"><ParticleCanvas count={20} /></div>

        {/* animated gradient pulse */}
        <motion.div className="absolute inset-0 z-[2] opacity-22"
          animate={{ background: ["radial-gradient(circle at 20% 30%,rgba(230,107,38,0.18) 0%,transparent 40%)","radial-gradient(circle at 80% 70%,rgba(230,107,38,0.18) 0%,transparent 40%)","radial-gradient(circle at 20% 30%,rgba(230,107,38,0.18) 0%,transparent 40%)"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />

        {/* mouse blobs */}
        <motion.div style={{ x: b1x, y: b1y }} className="absolute top-12 left-[4%] w-[340px] h-[340px] pointer-events-none z-[2]">
          <div className="w-full h-full rounded-full" style={{ filter: "blur(100px)", opacity: .3, background: "radial-gradient(circle,#FFD5B8,transparent)" }} />
        </motion.div>
        <motion.div style={{ x: b2x, y: b2y }} className="absolute bottom-12 right-[4%] w-[400px] h-[400px] pointer-events-none z-[2]">
          <div className="w-full h-full rounded-full" style={{ filter: "blur(110px)", opacity: .18, background: `radial-gradient(circle,${C.gold},transparent)` }} />
        </motion.div>

        {/* floating orbs */}
        {[{ t: "22%", l: "7%", d: 12, c: `${C.gold}44` }, { t: "35%", r: "9%", d: 8, c: `${C.dark}33` }, { b: "28%", l: "13%", d: 14, c: `${C.mid}2a` }, { b: "38%", r: "16%", d: 10, c: `${C.gold}33` }].map((o, i) => (
          <Float key={i} duration={4 + i * .6} delay={i * .4}
            className="absolute z-[2] rounded-full pointer-events-none"
            style={{ top: o.t, bottom: o.b, left: o.l, right: o.r, width: o.d, height: o.d, background: o.c }} />
        ))}

        {/* floating emojis */}
        <Float className="absolute top-[18%] left-[7%] hidden sm:block z-[2]" duration={5} yRange={22} delay={0}>
          <motion.div animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="text-6xl" style={{ opacity: .22, filter: "drop-shadow(0 8px 24px rgba(212,175,55,0.3))" }}>✨</motion.div>
        </Float>
        <Float className="absolute bottom-[22%] right-[7%] hidden sm:block z-[2]" duration={4} yRange={20} delay={1}>
          <motion.div animate={{ y: [0, 20, 0], rotate: [0, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="text-6xl" style={{ opacity: .2, filter: "drop-shadow(0 8px 24px rgba(212,175,55,0.3))" }}>💬</motion.div>
        </Float>
        <Float className="absolute top-[55%] left-[5%] hidden lg:block z-[2]" duration={6} yRange={14} delay={2}>
          <span className="text-4xl" style={{ opacity: .14 }}>📧</span>
        </Float>

        {/* kinetic bg text */}
        <motion.div style={{ y: bigY }} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-[2]">
          <span className="font-black leading-none tracking-tighter uppercase whitespace-nowrap"
            style={{ fontSize: "18vw", color: "rgba(230,107,38,0.018)" }}>CONTACT</span>
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
              Let's Connect
              <motion.span animate={{ opacity: [.7, 1, .7] }} transition={{ duration: 2, repeat: Infinity }} className="text-[#D4AF37]">✦</motion.span>
            </span>
          </motion.div>

          {/* heading */}
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3, duration: .75, ease: EASE_EXPO }}
            className="font-bold mb-4 leading-tight"
            style={{ fontSize: "clamp(3rem,8vw,5rem)", color: C.dark }}>
            Get In Touch
          </motion.h1>

          {/* gold bar */}
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: .55, duration: .6, ease: EASE_EXPO }}
            className="mx-auto mb-6 rounded-full origin-center" style={{ width: 64, height: 3, background: C.gold }} />

          {/* sub */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .5, ease: EASE_EXPO }}
            className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-12 px-4 rounded-2xl border backdrop-blur-sm p-6"
            style={{ color: C.text, borderColor: "rgba(229,231,235,0.8)", background: "rgba(255,255,255,0.35)" }}>
            Have a question or want to work together? We'd love to hear from you.
            Send us a message and we'll respond as soon as possible.
          </motion.p>

          {/* stat pills */}
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .7, ease: EASE_EXPO }}
            className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {stats.map((s, i) => (
              <Float key={i} duration={4 + i * .5} delay={i * .3}>
                <GlowCard accent={C.gold}>
                  <motion.div whileHover={{ scale: 1.06, y: -4, boxShadow: "0 14px 32px rgba(0,0,0,0.08)" }}
                    className="flex items-center gap-2 sm:gap-3 bg-white shadow-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-gray-200 cursor-default">
                    <s.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: C.gold }} />
                    <div>
                      <p className="text-xs sm:text-sm" style={{ color: "rgba(26,26,26,0.6)" }}>{s.label}</p>
                      <p className="text-sm sm:text-base font-semibold" style={{ color: C.text }}>{s.value}</p>
                    </div>
                  </motion.div>
                </GlowCard>
              </Float>
            ))}
          </motion.div>

          {/* scroll cue */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
            className="flex justify-center mt-14 cursor-pointer"
            onClick={() => document.getElementById("ct-form")?.scrollIntoView({ behavior: "smooth" })}>
            <Float duration={2} yRange={10}>
              <div className="w-5 h-8 rounded-full flex justify-center" style={{ border: "2px solid rgba(230,107,38,0.25)" }}>
                <motion.div className="w-1 h-2 rounded-full mt-2" style={{ background: C.gold }}
                  animate={{ y: [0, 10, 0], opacity: [1, .4, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
              </div>
            </Float>
          </motion.div>
        </motion.div>
      </section>

      {/* ══ FORM + INFO ══ */}
      <WaveDivider color={C.gold} toBg="#fff" />
      <section id="ct-form" className="py-16 sm:py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        <Spotlight color="rgba(230,107,38,0.04)" />
        <div className="absolute inset-0 opacity-[.025]" style={{ backgroundImage: "radial-gradient(circle,#E66B26 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-10">

            {/* ── Contact Form ── */}
            <Reveal from="left" delay={.05}>
              <GlowCard accent={C.gold} className="h-full">
                <TiltCard intensity={4}>
                  <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-xl h-full">
                    <SLabel text="Send a Message" />
                    <AHeading className="text-2xl sm:text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
                      Send Us a Message
                    </AHeading>
                    <Reveal from="bottom" delay={.1}>
                      <p className="text-sm sm:text-base mb-6 sm:mb-8" style={{ color: "rgba(26,26,26,0.65)" }}>
                        Fill out the form and we'll get back to you within 24 hours
                      </p>
                    </Reveal>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                      {[
                        { name: "name",    label: "Your Name",       type: "text",  placeholder: "John Doe",              required: true  },
                        { name: "email",   label: "Email Address",   type: "email", placeholder: "john@example.com",       required: true  },
                        { name: "phone",   label: "Phone Number",    type: "tel",   placeholder: "+91 XXXXX XXXXX",        required: false },
                        { name: "subject", label: "Subject",         type: "text",  placeholder: "How can we help you?",   required: true  },
                      ].map((field, fi) => (
                        <motion.div key={field.name} className="relative"
                          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: false }} transition={{ delay: fi * .07, ease: EASE_EXPO }}>
                          <label className="block text-xs sm:text-sm font-medium mb-1.5" style={{ color: C.text }}>
                            {field.label} {field.required && <span style={{ color: C.gold }}>*</span>}
                          </label>
                          <input type={field.type} name={field.name} value={formData[field.name]} onChange={handleChange}
                            onFocus={() => setFocusedField(field.name)} onBlur={() => setFocusedField(null)}
                            required={field.required} placeholder={field.placeholder}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-sm sm:text-base outline-none transition-all duration-300"
                            style={{
                              background: C.light, borderColor: focusedField === field.name ? C.dark : "#e5e7eb",
                              color: C.text, boxShadow: focusedField === field.name ? `0 0 0 3px rgba(230,107,38,0.12)` : undefined,
                            }} />
                          {focusedField === field.name && (
                            <motion.div layoutId="field-focus"
                              className="absolute inset-0 rounded-xl pointer-events-none"
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                              style={{ boxShadow: `0 0 0 2px rgba(212,175,55,0.45)`, borderRadius: 12 }} />
                          )}
                        </motion.div>
                      ))}

                      {/* message */}
                      <motion.div className="relative"
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }} transition={{ delay: .28, ease: EASE_EXPO }}>
                        <label className="block text-xs sm:text-sm font-medium mb-1.5" style={{ color: C.text }}>
                          Message <span style={{ color: C.gold }}>*</span>
                        </label>
                        <textarea name="message" value={formData.message} onChange={handleChange}
                          onFocus={() => setFocusedField("message")} onBlur={() => setFocusedField(null)}
                          required rows="5" placeholder="Tell us more about your inquiry…"
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-sm sm:text-base outline-none transition-all duration-300 resize-none"
                          style={{
                            background: C.light, borderColor: focusedField === "message" ? C.dark : "#e5e7eb",
                            color: C.text, boxShadow: focusedField === "message" ? `0 0 0 3px rgba(230,107,38,0.12)` : undefined,
                          }} />
                        {focusedField === "message" && (
                          <motion.div layoutId="field-focus"
                            className="absolute inset-0 rounded-xl pointer-events-none"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ boxShadow: `0 0 0 2px rgba(212,175,55,0.45)`, borderRadius: 12 }} />
                        )}
                      </motion.div>

                      <MagBtn type="submit" disabled={isSubmitting}
                        className="w-full text-black py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md hover:shadow-lg overflow-hidden relative group"
                        style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
                        <span className="relative z-10 flex items-center gap-2">
                          {isSubmitting ? (
                            <>
                              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                              Sending…
                            </>
                          ) : (
                            <>
                              Send Message
                              <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                              </motion.div>
                            </>
                          )}
                        </span>
                        <motion.div className="absolute inset-0" initial={{ x: "100%" }} whileHover={{ x: 0 }} transition={{ duration: .3 }}
                          style={{ background: `linear-gradient(135deg,${C.mid},#8B3A0F)` }} />
                      </MagBtn>
                    </form>
                  </div>
                </TiltCard>
              </GlowCard>
            </Reveal>

            {/* ── Contact Info ── */}
            <div className="space-y-6">
              <Reveal from="right" delay={.05}>
                <GlowCard accent={C.dark}>
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
                    <SLabel text="Reach Out" />
                    <AHeading className="text-2xl sm:text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
                      Contact Information
                    </AHeading>
                    <Reveal from="bottom" delay={.1}>
                      <p className="text-sm sm:text-base" style={{ color: "rgba(26,26,26,0.65)" }}>
                        Feel free to reach out through any of the following channels.
                      </p>
                    </Reveal>
                  </div>
                </GlowCard>
              </Reveal>

              {/* contact items */}
              <StaggerContainer className="space-y-3" stagger={0.09} from="right">
                {contactInfo.map((info, i) => (
                  <GlowCard key={i} accent={C.gold}>
                    <TiltCard intensity={5}>
                      <motion.a href={info.link} whileHover={{ x: 5 }}
                        className="group flex items-center gap-4 p-4 rounded-xl border border-transparent hover:border-gray-200 transition-all duration-300"
                        style={{ background: "#fff" }}
                        target={info.link !== "#" ? "_blank" : "_self"}
                        rel={info.link !== "#" ? "noopener noreferrer" : ""}>
                        <Float duration={4 + i * .4} delay={i * .2}>
                          <div className="w-12 h-12 rounded-xl p-0.5 flex-shrink-0 shadow-sm"
                            style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
                            <div className="w-full h-full rounded-xl bg-white flex items-center justify-center">
                              <info.icon className="w-6 h-6" style={{ color: C.dark }} />
                            </div>
                          </div>
                        </Float>
                        <div className="flex-1">
                          <h3 className="font-semibold text-base mb-0.5" style={{ color: C.text }}>{info.title}</h3>
                          <p className="text-sm transition-colors group-hover:text-[#E66B26]" style={{ color: "rgba(26,26,26,0.65)" }}>{info.details}</p>
                        </div>
                        <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * .3 }}>
                          <ChevronRight className="w-5 h-5 flex-shrink-0 transition-colors group-hover:text-[#E66B26]" style={{ color: C.gold }} />
                        </motion.div>
                      </motion.a>
                    </TiltCard>
                  </GlowCard>
                ))}
              </StaggerContainer>

              {/* social + trust */}
              <Reveal from="right" delay={.15}>
                <GlowCard accent={C.gold}>
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                    {/* social */}
                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2" style={{ color: C.text }}>
                        <span className="w-1 h-5 rounded-full" style={{ background: C.gold }} />
                        Connect With Us
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {socialLinks.map((social, i) => (
                          <Float key={i} duration={4 + i * .3} delay={i * .2}>
                            <motion.a href="#" whileHover={{ y: -4, scale: 1.1 }} whileTap={{ scale: .95 }}
                              className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center border border-gray-200 transition-all duration-300 group/icon"
                              style={{ background: C.light }} aria-label={social.name} target="_blank" rel="noopener noreferrer">
                              <social.icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: C.dark }} />
                              <motion.div className="absolute inset-0 rounded-xl opacity-0 group-hover/icon:opacity-100 transition-opacity"
                                style={{ background: `${C.gold}22` }} />
                              <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-white text-xs py-1 px-2 rounded opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden sm:block z-10 border"
                                style={{ background: C.dark, borderColor: C.mid }}>
                                {social.name}
                              </span>
                            </motion.a>
                          </Float>
                        ))}
                      </div>
                    </div>

                    {/* trust badge */}
                    <motion.div whileHover={{ x: 4 }}
                      className="flex items-center gap-4 p-4 rounded-xl border border-transparent hover:border-gray-200 transition-all duration-300"
                      style={{ background: C.light }}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${C.gold}22` }}>
                        <CheckCircle className="w-6 h-6" style={{ color: C.gold }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-base" style={{ color: C.dark }}>100% Response Rate</p>
                        <p className="text-sm" style={{ color: "rgba(26,26,26,0.65)" }}>We typically respond within 2 hours</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map(j => (
                              <div key={j} className="w-6 h-6 rounded-full border-2 border-white" style={{ background: `linear-gradient(135deg,${C.light},${C.light})` }} />
                            ))}
                          </div>
                          <p className="text-xs" style={{ color: "rgba(26,26,26,0.55)" }}>Trusted by 1000+ clients</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </GlowCard>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MAP ══ */}
      <WaveDivider color={C.gold} toBg={C.light} />
      <section id="ct-map" className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background: C.light }}>
        <NoiseCanvas opacity={0.18} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <motion.span className="font-black leading-none tracking-tighter uppercase text-[#E66B26]/[0.022]"
            style={{ fontSize: "16vw" }}
            animate={{ y: [0, -10, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}>
            LOCATION
          </motion.span>
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <SLabel text="Find Us" />
            <AHeading className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
              Find Us Here
            </AHeading>
            <Reveal from="bottom" delay={.15}>
              <p className="text-sm sm:text-base" style={{ color: "rgba(26,26,26,0.62)" }}>Visit our office or schedule a meeting</p>
            </Reveal>
          </div>
          <Reveal from="scale" delay={.1}>
            <GlowCard accent={C.gold}>
              <TiltCard intensity={3}>
                <motion.div whileHover={{ boxShadow: "0 32px 80px rgba(0,0,0,0.14)" }}
                  className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-gray-200 shadow-xl"
                  style={{ height: "clamp(260px,40vw,420px)" }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15350.123456789012!2d79.986456!3d14.442599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4cf00abcdef123:0xabcdef123456789!2sNellore,+Andhra+Pradesh,+India!5e0!3m2!1sen!2sin!4v0000000000000!5m2!1sen!2sin"
                    width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade" title="Stackenzo Location" />
                  <motion.div className="absolute inset-0 pointer-events-none rounded-2xl"
                    animate={{ opacity: [0, .06, 0] }} transition={{ duration: 3, repeat: Infinity }}
                    style={{ background: `linear-gradient(135deg,${C.gold},transparent)` }} />
                </motion.div>
              </TiltCard>
            </GlowCard>
          </Reveal>
        </div>
      </section>
      <WaveDivider color={C.gold} flip toBg="#fff" />

      {/* ══ FAQ ══ */}
      <section id="ct-faq" className="py-16 sm:py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        <Spotlight color="rgba(230,107,38,0.04)" />
        <div className="absolute inset-0 opacity-[.025]" style={{ backgroundImage: "radial-gradient(circle,#E66B26 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <SLabel text="Common Questions" />
            <AHeading className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
              Frequently Asked Questions
            </AHeading>
            <Reveal from="bottom" delay={.15}>
              <p className="text-sm sm:text-base" style={{ color: "rgba(26,26,26,0.62)" }}>Got questions? We've got answers</p>
            </Reveal>
          </div>

          <StaggerContainer className="space-y-3 sm:space-y-4" stagger={0.08} from="bottom">
            {faqs.map((faq, i) => (
              <GlowCard key={i} accent={openFaq === i ? C.gold : C.dark}>
                <motion.div
                  className="bg-white rounded-xl overflow-hidden transition-all cursor-pointer shadow-sm"
                  style={{ border: `1px solid ${openFaq === i ? C.gold : "#e5e7eb"}`, boxShadow: openFaq === i ? `0 6px 24px rgba(212,175,55,0.16)` : undefined }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <div className="p-4 sm:p-6 flex items-center justify-between gap-4"
                    style={{ background: openFaq === i ? C.light : "#fff" }}>
                    <h3 className="font-semibold text-sm sm:text-base md:text-lg pr-4 sm:pr-8 transition-colors"
                      style={{ color: openFaq === i ? C.dark : C.text }}>
                      {faq.q}
                    </h3>
                    <motion.div animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: .3 }}
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                      style={{ background: openFaq === i ? `${C.gold}22` : C.light }}>
                      {openFaq === i
                        ? <Minus className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: C.gold }} />
                        : <Plus  className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: C.gold }} />}
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden">
                        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                          <div className="pt-3 sm:pt-4 border-t border-gray-100">
                            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "rgba(26,26,26,0.72)" }}>{faq.a}</p>
                            {i === 1 && (
                              <div className="mt-3">
                                <span className="text-xs px-3 py-1 rounded-full border" style={{ background: C.light, color: C.dark, borderColor: `${C.gold}55` }}>
                                  Free 30-min consultation
                                </span>
                              </div>
                            )}
                            {i === 2 && (
                              <div className="mt-3">
                                <motion.a href="#" whileHover={{ x: 4 }} className="inline-flex items-center gap-1 text-xs sm:text-sm transition-colors"
                                  style={{ color: C.dark }}>
                                  Schedule a call now
                                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                </motion.a>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </GlowCard>
            ))}
          </StaggerContainer>

          {/* help CTA */}
          <Reveal from="bottom" delay={.2} className="mt-10 sm:mt-14 text-center">
            <p className="text-sm sm:text-base mb-4" style={{ color: C.gold }}>Still have questions?</p>
            <MagBtn onClick={() => document.querySelector("form")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 text-black px-6 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all shadow-md hover:shadow-lg"
              style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              Contact Support
            </MagBtn>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Contact;