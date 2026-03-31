import {
  motion, useInView, useScroll, useTransform,
  useSpring, useMotionValue, useVelocity,
} from "framer-motion";
import { Link } from "react-router-dom";
import { FileText, CheckCircle, ChevronRight, Shield, Scale } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

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
   REVEAL
══════════════════════════════════════════════ */
function Reveal({ children, className = "", delay = 0, from = "bottom" }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: false, margin: "-50px" });
  const dir = useScrollDir();
  const V = {
    bottom: { hidden: { y: 55, opacity: 0, scale: .97, filter: "blur(5px)" }, visible: { y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }, exit: { y: -38, opacity: 0, scale: .98, filter: "blur(3px)" } },
    top:    { hidden: { y: -55, opacity: 0, scale: .97 }, visible: { y: 0, opacity: 1, scale: 1 }, exit: { y: 38, opacity: 0 } },
    left:   { hidden: { x: -65, opacity: 0, filter: "blur(5px)" }, visible: { x: 0, opacity: 1, filter: "blur(0px)" }, exit: { x: 48, opacity: 0 } },
    scale:  { hidden: { scale: .8, opacity: 0, filter: "blur(6px)" }, visible: { scale: 1, opacity: 1, filter: "blur(0px)" }, exit: { scale: .88, opacity: 0 } },
  };
  const { hidden, visible, exit } = V[from] || V.bottom;
  return (
    <motion.div ref={ref} className={className}
      initial="hidden"
      animate={inV ? "visible" : dir === "up" ? "exit" : "hidden"}
      variants={{ hidden, visible, exit }}
      transition={{ duration: 0.7, delay, ease: EASE_EXPO }}>
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   STAGGER CONTAINER
══════════════════════════════════════════════ */
function StaggerContainer({ children, className = "", stagger = 0.08 }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: false, margin: "-50px" });
  const dir = useScrollDir();
  const item = {
    hidden: { y: 45, opacity: 0, scale: .96, filter: "blur(4px)" },
    visible: { y: 0, opacity: 1, scale: 1, filter: "blur(0px)" },
    exit:    { y: -30, opacity: 0, scale: .97, filter: "blur(3px)" },
  };
  return (
    <motion.div ref={ref} className={className}
      initial="hidden"
      animate={inV ? "visible" : dir === "up" ? "exit" : "hidden"}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger } }, exit: { transition: { staggerChildren: stagger / 2, staggerDirection: -1 } } }}>
      {Array.isArray(children)
        ? children.map((c, i) => <motion.div key={i} variants={item} transition={{ duration: .65, ease: EASE_EXPO }}>{c}</motion.div>)
        : <motion.div variants={item} transition={{ duration: .65, ease: EASE_EXPO }}>{children}</motion.div>}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   FLOAT
══════════════════════════════════════════════ */
function Float({ children, className = "", duration = 4, yRange = 12, delay = 0 }) {
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
      initial={{ opacity: 0, y: 35, scale: .97 }}
      animate={inV ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 35, scale: .97 }}
      transition={{ duration: .7, ease: EASE_EXPO }}>
      <div className="absolute pointer-events-none rounded-2xl z-0"
        style={{ inset: -1, background: `radial-gradient(280px circle at ${pos.x}px ${pos.y}px,${accent}25,transparent 60%)` }} />
      <motion.div className="absolute inset-0 rounded-2xl pointer-events-none z-0"
        animate={inV ? { opacity: [.2, .45, .2] } : { opacity: 0 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ boxShadow: `inset 0 0 0 1px ${accent}30` }} />
      <div className="relative z-10">{children}</div>
    </motion.div>
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
   NOISE CANVAS
══════════════════════════════════════════════ */
function NoiseCanvas({ color1 = "#FFD5B8", color2 = "#FFF4ED", opacity = 0.24 }) {
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
function ParticleCanvas({ count = 16, color = "rgba(230,107,38,0.07)" }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let w = c.width = c.offsetWidth, h = c.height = c.offsetHeight;
    const pts = Array.from({ length: count }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .34, vy: (Math.random() - .5) * .34, r: Math.random() * 1.6 + .6 }));
    let id;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      pts.forEach(p => { p.x += p.vx; p.y += p.vy; if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); });
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y); if (d < 88) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = color.replace(/[\d.]+\)$/, `${(1 - d / 88) * .055})`); ctx.stroke(); } }
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
function Spotlight({ color = "rgba(212,175,55,0.06)", size = 520 }) {
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
   TERMS DATA
══════════════════════════════════════════════ */
const SECTIONS = [
  { num: "01", title: "Introduction", icon: FileText, content: "Welcome to Stackenzo. These Terms and Conditions (\"Terms\") govern your use of our website, services, workshops, and internship programs. By accessing or using our services, you agree to be bound by these Terms. If you do not agree with any part of these Terms, please do not use our services.", items: [] },
  { num: "02", title: "Definitions", icon: Scale, content: "Key terms used throughout this document:", items: ["\"Company,\" \"we,\" \"us,\" or \"our\" refers to Stackenzo Technologies", "\"User,\" \"you,\" or \"your\" refers to individuals accessing our services", "\"Services\" includes all workshops, internships, training programs, and digital content", "\"Platform\" refers to our website and associated digital infrastructure"] },
  { num: "03", title: "Eligibility", icon: CheckCircle, content: "To use our services, you must:", items: ["Be at least 18 years old or have parental/guardian consent", "Provide accurate and complete registration information", "Maintain the security of your account credentials", "Comply with all applicable laws and regulations"] },
  { num: "04", title: "Registration and Enrollment", icon: FileText, content: "When enrolling in our programs:", items: ["You must provide accurate personal and educational information", "Registration is subject to availability and eligibility criteria", "We reserve the right to reject applications that don't meet requirements", "You are responsible for maintaining your account security"] },
  { num: "05", title: "Payment Terms", icon: Scale, content: "Regarding fees and payments:", items: ["All fees are listed in Indian Rupees (INR) unless otherwise stated", "Payment must be completed before program commencement", "Fees are non-refundable except as specified in our refund policy", "We reserve the right to modify fees with prior notice", "Payment plans may be available for certain programs"] },
  { num: "06", title: "Refund Policy", icon: Shield, content: "Our refund policy:", items: ["Full refund if cancellation is made 7 days before program start", "50% refund if cancellation is made 3–7 days before program start", "No refund for cancellations made less than 3 days before start", "Refunds are processed within 14 business days", "Program cancellation by Stackenzo results in full refund"] },
  { num: "07", title: "User Responsibilities", icon: CheckCircle, content: "As a user, you agree to:", items: ["Attend sessions regularly and complete assignments on time", "Respect instructors, mentors, and fellow participants", "Not share course materials without authorization", "Use provided resources only for educational purposes", "Report any technical issues or concerns promptly"] },
  { num: "08", title: "Intellectual Property", icon: Shield, content: "All content, materials, and resources provided by Stackenzo are protected by intellectual property rights. You may not:", items: ["Reproduce, distribute, or sell our course materials", "Remove copyright or proprietary notices", "Use our brand name or logo without permission", "Create derivative works from our content"] },
  { num: "09", title: "Code of Conduct", icon: Scale, content: "Users must maintain professional conduct. Prohibited activities include:", items: ["Harassment, discrimination, or abusive behavior", "Cheating, plagiarism, or academic dishonesty", "Disrupting classes or interfering with others' learning", "Sharing inappropriate or offensive content", "Violating any applicable laws or regulations"] },
  { num: "10", title: "Certificates and Credentials", icon: CheckCircle, content: "Regarding certificates:", items: ["Certificates are issued upon successful program completion", "Minimum attendance and performance criteria must be met", "Certificates are digital and verifiable", "Misrepresentation of credentials may result in revocation"] },
  { num: "11", title: "Limitation of Liability", icon: Shield, content: "Stackenzo shall not be liable for:", items: ["Indirect, incidental, or consequential damages", "Loss of data, profits, or business opportunities", "Technical issues beyond our reasonable control", "Actions of third-party service providers", "Employment outcomes or career advancement"] },
  { num: "12", title: "Termination", icon: Scale, content: "We reserve the right to terminate or suspend access to our services:", items: ["For violation of these Terms", "For fraudulent or illegal activities", "For non-payment of fees", "At our discretion with or without notice"] },
  { num: "13", title: "Changes to Terms", icon: FileText, content: "We may update these Terms periodically. Continued use of our services after changes constitutes acceptance of the modified Terms. We will notify users of significant changes via email or platform notifications.", items: [] },
  { num: "14", title: "Governing Law", icon: Scale, content: "These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Nellore, Andhra Pradesh.", items: [] },
  { num: "15", title: "Contact Information", icon: FileText, content: "For questions about these Terms, please contact us:", items: ["Email: legal@stackenzo.com", "Phone: +91-XXXXXXXXXX", "Address: Nellore, Andhra Pradesh, India"] },
];

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
function Terms() {
  /* hero parallax */
  const heroRef = useRef(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], [0, -80]);
  const heroO = useTransform(heroP, [0, .6], [1, 0.9]);
  const heroS = useTransform(heroP, [0, 1], [1, .88]);
  const bigY  = useTransform(heroP, [0, 1], [0, 140]);

  const mx = useMotionValue(0), my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 35, damping: 18 });
  const smy = useSpring(my, { stiffness: 35, damping: 18 });
  const b1x = useTransform(smx, [-1, 1], [-22, 22]);
  const b1y = useTransform(smy, [-1, 1], [-12, 12]);
  useEffect(() => {
    const fn = e => { mx.set((e.clientX / window.innerWidth - .5) * 2); my.set((e.clientY / window.innerHeight - .5) * 2); };
    window.addEventListener("mousemove", fn); return () => window.removeEventListener("mousemove", fn);
  }, []);

  return (
    <div className="bg-white text-[#1A1A1A] min-h-screen overflow-x-hidden">
      <CustomCursor />
      <ScrollProgressBar />
      <Navbar />

      {/* ══ HERO ══ */}
      <section ref={heroRef} className="relative min-h-[55vh] flex items-center pt-28 pb-16 px-4 sm:px-6 overflow-hidden">
        <NoiseCanvas color1="#FFD5B8" color2="#FFF0E6" opacity={0.3} />
        <div className="absolute inset-0 z-[1]"><ParticleCanvas count={16} /></div>

        {/* animated gradient */}
        <motion.div className="absolute inset-0 z-[2] opacity-18"
          animate={{ background: ["radial-gradient(circle at 25% 40%,rgba(230,107,38,0.22) 0%,transparent 45%)","radial-gradient(circle at 75% 60%,rgba(230,107,38,0.22) 0%,transparent 45%)","radial-gradient(circle at 25% 40%,rgba(230,107,38,0.22) 0%,transparent 45%)"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />

        {/* blob */}
        <motion.div style={{ x: b1x, y: b1y }} className="absolute top-10 left-[6%] w-72 h-72 pointer-events-none z-[2]">
          <div className="w-full h-full rounded-full blur-[100px] opacity-[.28]" style={{ background: "radial-gradient(circle,#FFD5B8,transparent)" }} />
        </motion.div>
        <div className="absolute bottom-10 right-[6%] w-80 h-80 pointer-events-none z-[2]">
          <div className="w-full h-full rounded-full blur-[110px] opacity-[.16]" style={{ background: "radial-gradient(circle,#D4AF37,transparent)" }} />
        </div>

        {/* floating orbs */}
        <Float className="absolute top-1/4 left-[8%] w-3 h-3 rounded-full bg-[#D4AF37]/28 z-[2]" duration={5} delay={0} />
        <Float className="absolute top-1/3 right-[10%] w-2 h-2 rounded-full bg-[#E66B26]/22 z-[2]" duration={4} delay={1} />
        <Float className="absolute bottom-1/3 left-[14%] w-3.5 h-3.5 rounded-full bg-[#C5531A]/18 z-[2]" duration={6} delay={2} />

        {/* dot grid */}
        <div className="absolute inset-0 z-[2] opacity-[.03]"
          style={{ backgroundImage: "radial-gradient(circle,#E66B26 1px,transparent 1px)", backgroundSize: "30px 30px" }} />

        {/* kinetic bg text */}
        <motion.div style={{ y: bigY }} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-[2]">
          <span className="text-[16vw] font-black leading-none tracking-tighter uppercase whitespace-nowrap"
            style={{ color: "rgba(230,107,38,0.018)" }}>TERMS</span>
        </motion.div>

        <motion.div style={{ y: heroY, opacity: heroO, scale: heroS }} className="max-w-4xl mx-auto text-center relative z-10 w-full">

          {/* badge */}
          <motion.div initial={{ scale: .75, opacity: 0, y: 18 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ duration: .6, ease: EASE_BACK }}
            className="inline-flex items-center gap-2 bg-white/88 backdrop-blur-sm border border-gray-200 rounded-full px-5 py-2.5 mb-7 shadow-sm">
            <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              <Scale className="w-4 h-4 text-[#D4AF37]" />
            </motion.div>
            <span className="text-sm font-semibold text-[#E66B26]">Legal Document</span>
          </motion.div>

          {/* icon */}
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: .2, duration: .6, ease: EASE_BACK }}
            className="flex justify-center mb-5">
            <Float duration={4} yRange={10}>
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl"
                style={{ background: "linear-gradient(135deg,#E66B26,#C5531A)" }}>
                <FileText className="w-10 h-10 text-white" />
              </div>
            </Float>
          </motion.div>

          {/* H1 */}
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .32, duration: .72, ease: EASE_EXPO }}
            className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 leading-[1.06]">
            <span className="text-[#1A1A1A]">Terms &</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]">Conditions</span>
          </motion.h1>

          {/* gold bar */}
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: .5, duration: .55, ease: EASE_EXPO }}
            className="mx-auto mb-5 rounded-full origin-center" style={{ width: 56, height: 3, background: "#D4AF37" }} />

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .48, ease: EASE_EXPO }}
            className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-6 leading-relaxed">
            Please read these terms carefully before using our services. By accessing Stackenzo you agree to be bound by these conditions.
          </motion.p>

          {/* last updated */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .65 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border"
            style={{ background: "#FFF4ED", borderColor: "rgba(212,175,55,0.35)", color: "#E66B26" }}>
            <motion.span animate={{ opacity: [.6, 1, .6] }} transition={{ duration: 2, repeat: Infinity }}>●</motion.span>
            Last Updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </motion.div>
        </motion.div>
      </section>

      {/* ══ CONTENT ══ */}
      <WaveDivider color="#D4AF37" toBg="#FFF4ED" />
      <section className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background: "#FFF4ED" }}>
        <NoiseCanvas color1="#FFD5B8" color2="#FFCBA4" opacity={0.18} />
        <Spotlight color="rgba(230,107,38,0.04)" />

        {/* quick nav */}
        <div className="max-w-4xl mx-auto mb-12 relative z-10">
          <Reveal from="bottom">
            <GlowCard accent="#D4AF37">
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <p className="text-xs font-black text-[#E66B26] uppercase tracking-widest mb-4">Quick Navigation</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SECTIONS.slice(0, 6).map((s, i) => (
                    <motion.a key={i} href={`#term-${s.num}`} whileHover={{ x: 4 }}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#E66B26] transition-colors">
                      <span className="text-[#D4AF37] font-bold">{s.num}.</span>
                      {s.title}
                    </motion.a>
                  ))}
                </div>
              </div>
            </GlowCard>
          </Reveal>
        </div>

        {/* sections */}
        <div className="max-w-4xl mx-auto relative z-10 space-y-5">
          {SECTIONS.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <Reveal key={idx} from="bottom" delay={Math.min(idx * .04, .25)}>
                <GlowCard accent={idx % 2 === 0 ? "#D4AF37" : "#E66B26"} id={`term-${sec.num}`}>
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:border-[#D4AF37] transition-all group">
                    {/* section header */}
                    <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100"
                      style={{ background: "linear-gradient(to right,#FFF4ED,#fff)" }}>
                      <Float duration={4 + idx * .2} yRange={6} delay={idx * .15}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
                          style={{ background: "linear-gradient(135deg,#E66B26,#C5531A)" }}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                      </Float>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-[#D4AF37] bg-[#FFF4ED] px-2.5 py-1 rounded-full border border-[#D4AF37]/30">
                          {sec.num}
                        </span>
                        <h2 className="text-base sm:text-lg font-black text-[#1A1A1A] group-hover:text-[#E66B26] transition-colors">
                          {sec.title}
                        </h2>
                      </div>
                    </div>

                    {/* section body */}
                    <div className="px-6 py-5">
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">{sec.content}</p>
                      {sec.items.length > 0 && (
                        <StaggerContainer className="space-y-2" stagger={0.05}>
                          {sec.items.map((item, j) => (
                            <div key={j} className="flex items-start gap-2.5">
                              <motion.div animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 2.2, repeat: Infinity, delay: j * .2 }}>
                                <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                              </motion.div>
                              <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
                            </div>
                          ))}
                        </StaggerContainer>
                      )}
                    </div>

                    {/* hover accent */}
                    <motion.div className="h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#C5531A]"
                      initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} style={{ transformOrigin: "left" }} transition={{ duration: .3 }} />
                  </div>
                </GlowCard>
              </Reveal>
            );
          })}
        </div>
      </section>
      <WaveDivider color="#D4AF37" flip toBg="#fff" />

      {/* ══ CTA STRIP ══ */}
      <section className="py-14 px-4 sm:px-6 bg-white relative overflow-hidden">
        <Spotlight color="rgba(230,107,38,0.04)" />
        <div className="max-w-4xl mx-auto relative z-10">
          <Reveal from="bottom">
            <GlowCard accent="#D4AF37">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,#E66B26,#C5531A)" }} />
                <div className="absolute inset-0 opacity-[.06]"
                  style={{ backgroundImage: "radial-gradient(circle at 2px 2px,rgba(255,255,255,0.3) 1px,transparent 0)", backgroundSize: "30px 30px" }} />
                <ParticleCanvas count={10} color="rgba(212,175,55,0.1)" />
                <div className="relative z-10 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white mb-2">Questions about our Terms?</h3>
                    <p className="text-white/80 text-sm sm:text-base">Our team is here to help clarify anything you need.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                    <Link to="/Contact">
                      <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: .95 }}
                        className="px-6 py-3 bg-white text-[#E66B26] rounded-xl font-black text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                        Contact Us
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </Link>
                    <Link to="/Privacy">
                      <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: .95 }}
                        className="px-6 py-3 border-2 border-white text-white rounded-xl font-black text-sm hover:bg-white hover:text-[#E66B26] transition-all flex items-center gap-2">
                        Privacy Policy
                        <Shield className="w-4 h-4" />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </div>
            </GlowCard>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Terms;