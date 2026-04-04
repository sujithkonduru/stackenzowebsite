import {
  motion, useInView, useScroll, useTransform,
  useSpring, useMotionValue, useVelocity,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield, CheckCircle, Lock, Eye, Database,
  Globe, ChevronRight, FileText, UserCheck,
} from "lucide-react";
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
    top:    { hidden: { y: -55, opacity: 0 }, visible: { y: 0, opacity: 1 }, exit: { y: 38, opacity: 0 } },
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
function StaggerContainer({ children, className = "", stagger = 0.07 }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: false, margin: "-50px" });
  const dir = useScrollDir();
  const item = {
    hidden:  { y: 40, opacity: 0, scale: .96, filter: "blur(4px)" },
    visible: { y: 0,  opacity: 1, scale: 1,   filter: "blur(0px)" },
    exit:    { y: -28, opacity: 0, scale: .97, filter: "blur(3px)" },
  };
  return (
    <motion.div ref={ref} className={className}
      initial="hidden"
      animate={inV ? "visible" : dir === "up" ? "exit" : "hidden"}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger } }, exit: { transition: { staggerChildren: stagger / 2, staggerDirection: -1 } } }}>
      {Array.isArray(children)
        ? children.map((c, i) => <motion.div key={i} variants={item} transition={{ duration: .62, ease: EASE_EXPO }}>{c}</motion.div>)
        : <motion.div variants={item} transition={{ duration: .62, ease: EASE_EXPO }}>{children}</motion.div>}
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
   PRIVACY DATA
══════════════════════════════════════════════ */
const SECTIONS = [
  {
    num: "01", title: "Introduction", icon: Shield,
    content: "At Stackenzo, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our services. By using our platform, you consent to the data practices described in this policy.",
    items: [], subsections: [],
  },
  {
    num: "02", title: "Information We Collect", icon: Database,
    content: "We collect the following categories of information:",
    items: [],
    subsections: [
      { title: "2.1 Personal Information", intro: "We collect information you provide directly:", items: ["Name, email address, and phone number", "Educational background and qualifications", "Date of birth and gender", "Address and location information", "Payment and billing information", "Resume and portfolio materials"] },
      { title: "2.2 Automatically Collected Information", intro: "Collected when you use our platform:", items: ["IP address and device information", "Browser type and operating system", "Pages visited and time spent on platform", "Referring website and search terms", "Cookies and similar tracking technologies"] },
      { title: "2.3 Usage Data", intro: "Relating to your activity on our platform:", items: ["Course enrollment and completion data", "Assignment submissions and grades", "Attendance records and participation", "Communication with instructors and support"] },
    ],
  },
  {
    num: "03", title: "How We Use Your Information", icon: Eye,
    content: "We use collected information for:",
    items: ["Providing and improving our educational services", "Processing registrations and payments", "Communicating about programs, updates, and opportunities", "Issuing certificates and credentials", "Analyzing platform usage and performance", "Personalizing your learning experience", "Ensuring platform security and preventing fraud", "Complying with legal obligations", "Marketing and promotional activities (with consent)"],
    subsections: [],
  },
  {
    num: "04", title: "Information Sharing and Disclosure", icon: Globe,
    content: "We may share your information in these circumstances:",
    items: [],
    subsections: [
      { title: "4.1 Service Providers", intro: "Third-party vendors who assist with:", items: ["Payment processing and email delivery", "Hosting, analytics, and customer support"] },
      { title: "4.2 Industry Partners", intro: "With your consent:", items: ["We may share your profile with potential employers and internship providers for placement opportunities"] },
      { title: "4.3 Legal Requirements", intro: "When required by:", items: ["Law, court order, or government regulation", "To protect our rights and safety"] },
      { title: "4.4 Business Transfers", intro: "In connection with:", items: ["Mergers, acquisitions, or sale of assets — your information may be transferred to the acquiring entity"] },
    ],
  },
  {
    num: "05", title: "Data Security", icon: Lock,
    content: "We implement appropriate technical and organizational measures to protect your data:",
    items: ["Encryption of data in transit and at rest", "Secure server infrastructure and firewalls", "Regular security audits and updates", "Access controls and authentication", "Employee training on data protection", "Incident response and breach notification procedures"],
    subsections: [],
    note: "No method of transmission over the internet is 100% secure. We cannot guarantee absolute security of your data.",
  },
  {
    num: "06", title: "Data Retention", icon: Database,
    content: "We retain your personal information for as long as necessary to:",
    items: ["Provide our services and maintain your account", "Comply with legal and regulatory requirements", "Resolve disputes and enforce agreements", "Maintain certificates and academic records"],
    subsections: [],
    note: "You may request deletion of your data, subject to legal retention requirements.",
  },
  {
    num: "07", title: "Your Rights and Choices", icon: UserCheck,
    content: "You have the right to:",
    items: ["Access your personal information", "Correct inaccurate or incomplete data", "Request deletion of your data", "Object to processing of your information", "Withdraw consent for marketing communications", "Request data portability", "Lodge complaints with data protection authorities"],
    subsections: [],
    note: "To exercise these rights, contact us at privacy@stackenzo.com",
  },
  {
    num: "08", title: "Cookies and Tracking Technologies", icon: Eye,
    content: "We use cookies and similar technologies to:",
    items: ["Remember your preferences and settings", "Analyze platform usage and performance", "Provide personalized content and recommendations", "Enable social media features", "Deliver targeted advertising"],
    subsections: [],
    note: "You can control cookies through your browser settings. Disabling cookies may affect platform functionality.",
  },
  {
    num: "09", title: "Third-Party Links and Services", icon: Globe,
    content: "Our platform may contain links to third-party websites and services. We are not responsible for their privacy practices. We encourage you to review their privacy policies before providing any personal information.",
    items: [], subsections: [],
  },
  {
    num: "10", title: "Children's Privacy", icon: Shield,
    content: "Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.",
    items: [], subsections: [],
  },
  {
    num: "11", title: "International Data Transfers", icon: Globe,
    content: "Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.",
    items: [], subsections: [],
  },
  {
    num: "12", title: "Changes to This Privacy Policy", icon: FileText,
    content: "We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or platform notification. Continued use of our services after changes constitutes acceptance of the updated policy.",
    items: [], subsections: [],
  },
  {
    num: "13", title: "Contact Us", icon: Shield,
    content: "For questions or concerns about this Privacy Policy or our data practices:",
    items: ["Email: privacy@stackenzo.com", "Data Protection Officer: dpo@stackenzo.com", "Phone: +91-XXXXXXXXXX", "Address: Stackenzo PVT LTD, Nellore, Andhra Pradesh, India"],
    subsections: [],
  },
];

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
function Privacy() {
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
      
      <ScrollProgressBar />
      <Navbar />

      {/* ══ HERO ══ */}
      <section ref={heroRef} className="relative min-h-[55vh] flex items-center pt-28 pb-16 px-4 sm:px-6 overflow-hidden">
        <NoiseCanvas color1="#FFD5B8" color2="#FFF0E6" opacity={0.3} />
        <div className="absolute inset-0 z-[1]"><ParticleCanvas count={16} /></div>

        {/* animated gradient */}
        <motion.div className="absolute inset-0 z-[2] opacity-18"
          animate={{ background: ["radial-gradient(circle at 30% 35%,rgba(230,107,38,0.22) 0%,transparent 45%)","radial-gradient(circle at 70% 65%,rgba(230,107,38,0.22) 0%,transparent 45%)","radial-gradient(circle at 30% 35%,rgba(230,107,38,0.22) 0%,transparent 45%)"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />

        {/* blobs */}
        <motion.div style={{ x: b1x, y: b1y }} className="absolute top-10 left-[6%] w-72 h-72 pointer-events-none z-[2]">
          <div className="w-full h-full rounded-full blur-[100px] opacity-[.28]" style={{ background: "radial-gradient(circle,#FFD5B8,transparent)" }} />
        </motion.div>
        <div className="absolute bottom-10 right-[6%] w-80 h-80 pointer-events-none z-[2]">
          <div className="w-full h-full rounded-full blur-[110px] opacity-[.16]" style={{ background: "radial-gradient(circle,#D4AF37,transparent)" }} />
        </div>

        {/* floating orbs */}
        <Float className="absolute top-1/4 left-[8%] w-3 h-3 rounded-full bg-[#D4AF37]/28 z-[2]" duration={5} delay={0} />
        <Float className="absolute top-1/3 right-[10%] w-2 h-2 rounded-full bg-[#F04A06]/22 z-[2]" duration={4} delay={1} />
        <Float className="absolute bottom-1/3 left-[14%] w-3.5 h-3.5 rounded-full bg-[#C5531A]/18 z-[2]" duration={6} delay={2} />

        {/* dot grid */}
        <div className="absolute inset-0 z-[2] opacity-[.03]"
          style={{ backgroundImage: "radial-gradient(circle,#F04A06 1px,transparent 1px)", backgroundSize: "30px 30px" }} />

        {/* kinetic bg text */}
        <motion.div style={{ y: bigY }} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-[2]">
          <span className="text-[14vw] font-black leading-none tracking-tighter uppercase whitespace-nowrap"
            style={{ color: "rgba(230,107,38,0.018)" }}>PRIVACY POLICY</span>
        </motion.div>

        <motion.div style={{ y: heroY, opacity: heroO, scale: heroS }} className="max-w-4xl mx-auto text-center relative z-10 w-full">

          {/* badge */}
          <motion.div initial={{ scale: .75, opacity: 0, y: 18 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ duration: .6, ease: EASE_BACK }}
            className="inline-flex items-center gap-2 bg-white/88 backdrop-blur-sm border border-gray-200 rounded-full px-5 py-2.5 mb-7 shadow-sm">
            <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              <Lock className="w-4 h-4 text-[#D4AF37]" />
            </motion.div>
            <span className="text-sm font-semibold text-[#F04A06]">Legal Document</span>
          </motion.div>

          {/* icon */}
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: .2, duration: .6, ease: EASE_BACK }}
            className="flex justify-center mb-5">
            <Float duration={4} yRange={10}>
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl"
                style={{ background: "linear-gradient(135deg,#F04A06,#C5531A)" }}>
                <Shield className="w-10 h-10 text-white" />
              </div>
            </Float>
          </motion.div>

          {/* H1 */}
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .32, duration: .72, ease: EASE_EXPO }}
            className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 leading-[1.06]">
            <span className="text-[#1A1A1A]">Privacy</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">Policy</span>
          </motion.h1>

          {/* gold bar */}
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: .5, duration: .55, ease: EASE_EXPO }}
            className="mx-auto mb-5 rounded-full origin-center" style={{ width: 56, height: 3, background: "#D4AF37" }} />

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .48, ease: EASE_EXPO }}
            className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-6 leading-relaxed">
            Your privacy matters to us. Learn how we collect, use, and protect your personal information when you use Stackenzo services.
          </motion.p>

          {/* last updated badge */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .65 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border"
            style={{ background: "#FFF4ED", borderColor: "rgba(212,175,55,0.35)", color: "#F04A06" }}>
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
                <p className="text-xs font-black text-[#F04A06] uppercase tracking-widest mb-4">Quick Navigation</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SECTIONS.slice(0, 6).map((s, i) => (
                    <motion.a key={i} href={`#priv-${s.num}`} whileHover={{ x: 4 }}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#F04A06] transition-colors">
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
              <Reveal key={idx} from="bottom" delay={Math.min(idx * .04, .22)} id={`priv-${sec.num}`}>
                <GlowCard accent={idx % 2 === 0 ? "#D4AF37" : "#F04A06"}>
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:border-[#D4AF37] transition-all group">

                    {/* section header */}
                    <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100"
                      style={{ background: "linear-gradient(to right,#FFF4ED,#fff)" }}>
                      <Float duration={4 + idx * .2} yRange={6} delay={idx * .15}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
                          style={{ background: "linear-gradient(135deg,#F04A06,#C5531A)" }}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                      </Float>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-[#D4AF37] bg-[#FFF4ED] px-2.5 py-1 rounded-full border border-[#D4AF37]/30">
                          {sec.num}
                        </span>
                        <h2 className="text-base sm:text-lg font-black text-[#1A1A1A] group-hover:text-[#F04A06] transition-colors">
                          {sec.title}
                        </h2>
                      </div>
                    </div>

                    {/* section body */}
                    <div className="px-6 py-5 space-y-4">
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{sec.content}</p>

                      {/* flat items */}
                      {sec.items.length > 0 && (
                        <StaggerContainer className="space-y-2">
                          {sec.items.map((item, j) => (
                            <div key={j} className="flex items-start gap-2.5">
                              <motion.div animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 2.2, repeat: Infinity, delay: j * .18 }}>
                                <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                              </motion.div>
                              <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
                            </div>
                          ))}
                        </StaggerContainer>
                      )}

                      {/* subsections */}
                      {sec.subsections && sec.subsections.length > 0 && (
                        <div className="space-y-4 pt-1">
                          {sec.subsections.map((sub, si) => (
                            <Reveal key={si} from="left" delay={si * .06}>
                              <div className="pl-4 border-l-2 border-[#D4AF37]/40">
                                <h3 className="text-sm font-black text-[#F04A06] mb-2">{sub.title}</h3>
                                <p className="text-xs text-gray-500 mb-2">{sub.intro}</p>
                                <StaggerContainer className="space-y-1.5" stagger={0.05}>
                                  {sub.items.map((item, k) => (
                                    <div key={k} className="flex items-start gap-2">
                                      <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                                      <span className="text-xs sm:text-sm text-gray-600 leading-relaxed">{item}</span>
                                    </div>
                                  ))}
                                </StaggerContainer>
                              </div>
                            </Reveal>
                          ))}
                        </div>
                      )}

                      {/* note */}
                      {sec.note && (
                        <motion.div className="flex items-start gap-2.5 p-3 rounded-xl border border-[#D4AF37]/30"
                          style={{ background: "#FFF4ED" }}>
                          <Shield className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                          <p className="text-xs sm:text-sm text-gray-600 italic">{sec.note}</p>
                        </motion.div>
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

          {/* Consent banner */}
          <Reveal from="scale" delay={.1}>
            <GlowCard accent="#D4AF37">
              <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-sm">
                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,rgba(230,107,38,0.08),rgba(212,175,55,0.08))" }} />
                <div className="relative z-10 p-6 flex items-start gap-4">
                  <Float duration={4} yRange={8}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                      style={{ background: "linear-gradient(135deg,#F04A06,#C5531A)" }}>
                      <UserCheck className="w-5 h-5 text-white" />
                    </div>
                  </Float>
                  <div>
                    <h3 className="text-base font-black text-[#F04A06] mb-2">Your Consent</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      By using our platform and services, you acknowledge that you have read and understood this
                      Privacy Policy and consent to the collection, use, and disclosure of your personal
                      information as described herein.
                    </p>
                  </div>
                </div>
              </div>
            </GlowCard>
          </Reveal>
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
                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,#F04A06,#C5531A)" }} />
                <div className="absolute inset-0 opacity-[.06]"
                  style={{ backgroundImage: "radial-gradient(circle at 2px 2px,rgba(255,255,255,0.3) 1px,transparent 0)", backgroundSize: "30px 30px" }} />
                <ParticleCanvas count={10} color="rgba(212,175,55,0.1)" />
                <div className="relative z-10 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white mb-2">Questions about your Privacy?</h3>
                    <p className="text-white/80 text-sm sm:text-base">Our team is here to help with any privacy concerns.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
                    <Link to="/Contact">
                      <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: .95 }}
                        className="px-6 py-3 bg-white text-[#F04A06] rounded-xl font-black text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                        Contact Us
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </Link>
                    <Link to="/Terms">
                      <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: .95 }}
                        className="px-6 py-3 border-2 border-white text-white rounded-xl font-black text-sm hover:bg-white hover:text-[#F04A06] transition-all flex items-center gap-2">
                        Terms & Conditions
                        <FileText className="w-4 h-4" />
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

export default Privacy;