import { useMemo, useRef, useEffect, useState } from "react";
import {
  motion, AnimatePresence, useInView, useScroll, useTransform,
  useSpring, useMotionValue, useVelocity,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import pic from "./image.png";
import {
  Gamepad2, Star, Users, Trophy, Rocket, CheckCircle2,
  BookOpen, LineChart, Medal, Brain, Cpu, Globe,
  MousePointerClick, ArrowLeft,ArrowRight, Zap, Target, Award,
  ChevronRight, Sparkles,
} from "lucide-react";

/* ══════════════════════════════════════════════
   BRAND — orange + white (company theme)
══════════════════════════════════════════════ */
const C = {
  dark:     "#F04A06",
  mid:      "#C5531A",
  gold:     "#D4AF37",
  light:    "#FFF4ED",
  tint:     "#FFD5B8",
  warmBg:   "#FFF0E6",
  veryDark: "#3D1A0A",
  text:     "#1A1A1A",
  p:  (a) => `rgba(230,107,38,${a})`,
  pd: (a) => `rgba(197,83,26,${a})`,
};

const EASE_EXPO = [0.16, 1, 0.3, 1];
const EASE_BACK = [0.34, 1.56, 0.64, 1];

const NAV_SECTIONS = ["gs-hero","gs-overview","gs-features","gs-impact","gs-roadmap"];
const NAV_LABELS   = ["Top","Overview","Features","Impact","Roadmap"];

function useScrollDir() {
  const { scrollY } = useScroll();
  const vel = useVelocity(scrollY);
  const [dir, setDir] = useState("down");
  useEffect(() => vel.on("change", v => setDir(v > 0 ? "down" : "up")), [vel]);
  return dir;
}

function Reveal({ children, className = "", delay = 0, from = "bottom", once = false }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once, margin: "-55px" });
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
      animate={inV ? "visible" : once ? "hidden" : dir === "up" ? "exit" : "hidden"}
      variants={{ hidden, visible, exit }}
      transition={{ duration: .75, delay, ease: EASE_EXPO }}>
      {children}
    </motion.div>
  );
}

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
        ? children.map((c, i) => <motion.div key={i} variants={{ hidden, visible, exit }} transition={{ duration: .7, ease: EASE_EXPO }}>{c}</motion.div>)
        : <motion.div variants={{ hidden, visible, exit }} transition={{ duration: .7, ease: EASE_EXPO }}>{children}</motion.div>}
    </motion.div>
  );
}

function Float({ children, className = "", style, duration = 4, yRange = 14, delay = 0 }) {
  return (
    <motion.div className={className} style={style}
      animate={{ y: [-yRange / 2, yRange / 2, -yRange / 2] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}>
      {children}
    </motion.div>
  );
}

function GlowCard({ children, className = "", accent = C.gold }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: false, margin: "-40px" });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <motion.div ref={ref} className={`relative rounded-2xl overflow-hidden ${className}`}
      onMouseMove={e => { const r = ref.current?.getBoundingClientRect(); if (r) setPos({ x: e.clientX - r.left, y: e.clientY - r.top }); }}
      initial={{ opacity: 0, y: 40, scale: .96 }}
      animate={inV ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: .96 }}
      transition={{ duration: .75, ease: EASE_EXPO }}>
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

function MagBtn({ children, className = "", onClick, href, style = {}, type = "button" }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 16 });
  const sy = useSpring(y, { stiffness: 250, damping: 16 });
  const Tag = href ? motion.a : motion.button;
  return (
    <Tag ref={ref} href={href} type={href ? undefined : type} style={{ x: sx, y: sy, ...style }}
      onMouseMove={e => { const r = ref.current.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * .35); y.set((e.clientY - r.top - r.height / 2) * .35); }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileTap={{ scale: .93 }} onClick={onClick} className={className}>
      {children}
    </Tag>
  );
}



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

 
</motion.button>
      ))}
    </div>
  );
}

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

function ParticleCanvas({ count = 20, color = C.p(.08) }) {
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

function Spotlight({ color = C.p(.06), size = 580 }) {
  const ref = useRef(null);
  useEffect(() => {
    const fn = e => { if (!ref.current) return; const r = ref.current.getBoundingClientRect(); ref.current.style.background = `radial-gradient(${size}px circle at ${e.clientX - r.left}px ${e.clientY - r.top}px,${color},transparent 70%)`; };
    window.addEventListener("mousemove", fn); return () => window.removeEventListener("mousemove", fn);
  }, []);
  return <div ref={ref} className="absolute inset-0 pointer-events-none z-[1]" />;
}

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

function Counter({ end, suffix = "" }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: false });
  const mv = useMotionValue(0);
  const sp = useSpring(mv, { stiffness: 55, damping: 14 });
  const [d, setD] = useState(0);
  useEffect(() => { mv.set(inV ? end : 0); }, [inV]);
  useEffect(() => sp.on("change", v => setD(Math.round(v))), [sp]);
  return <span ref={ref}>{d}{suffix}</span>;
}

const FEATURES = [
  { icon: Gamepad2,  title: "Gamified Learning",     desc: "Levels, badges, streaks, coins, leaderboards — learning that feels like play.",          accent: C.dark },
  { icon: BookOpen,  title: "Adaptive Modules",      desc: "Quizzes and tasks that adjust to the learner's performance in real-time.",                accent: C.gold },
  { icon: Users,     title: "Collaboration Rooms",   desc: "1:1, small groups, or seminar halls with chat, screen share, and whiteboards.",           accent: C.mid  },
  { icon: LineChart, title: "Analytics for Mentors", desc: "Dashboards to track progress, engagement, and outcomes instantly.",                       accent: C.dark },
  { icon: Trophy,    title: "Rewards Engine",        desc: "Redeem points for gifts, subscriptions, or exclusive access tiers.",                      accent: C.gold },
  { icon: Star,      title: "Ranks & Seasons",       desc: "Gold, Silver, Bronze tiers with seasonal resets to keep it fresh.",                      accent: C.mid  },
];

const TECH = [
  { icon: Cpu,    label: "React.js" },
  { icon: Globe,  label: "Tailwind CSS" },
  { icon: Rocket, label: "Framer Motion" },
  { icon: Brain,  label: "Node/Express (planned)" },
  { icon: Medal,  label: "MongoDB (planned)" },
];

const ROADMAP = [
  { title: "Phase 1 — Core",          accent: C.dark, points: ["Auth, profiles, and presence","Rooms (1/2/10/seminar/mentor)","Chat + whiteboard"] },
  { title: "Phase 2 — Collaboration", accent: C.dark, points: ["Screen share (WebRTC)","Tasks & adaptive quizzes","Leaderboards & ranks"] },
  { title: "Phase 3 — Scale",         accent: C.dark,  points: ["Rewards marketplace","Analytics for mentors","Perf & infra scaling"] },
];

const COUNTERS = [
  { label: "Engagement Increase", end: 95,   suffix: "%" },
  { label: "Challenges Launched", end: 50,   suffix: "+" },
  { label: "Active Learners",     end: 1000, suffix: "+" },
];

function Community() {
  const navigate = useNavigate();

  const heroRef = useRef(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const { scrollY } = useScroll();
const scrollOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  const heroY = useTransform(heroP, [0, 1], [0, -100]);
  const heroO = useTransform(heroP, [0, .6], [1, 0.9]);
  const heroS = useTransform(heroP, [0, 1], [1, .84]);
  const bigY  = useTransform(heroP, [0, 1], [0, 160]);

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
     
      <ScrollProgressBar />
      <SectionNavDots />

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-gray-100"
        style={{ background: "rgba(255,255,255,0.88)" }}>
        <div className="mx-auto max-w-7xl px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button onClick={() => navigate(-1)} whileHover={{ x: -3 }} whileTap={{ scale: .95 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all border"
              style={{ background: C.p(.08), borderColor: C.p(.25), color: C.dark }}>
              <motion.div animate={{ x: [0, -3, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
                <ArrowLeft className="h-4 w-4" />
              </motion.div>
              Back
            </motion.button>
            <div className="flex items-center gap-2">
              <img src="/images/stackenzo logo image.jpeg" alt="Stackenzo" className="h-8 sm:h-10 md:h-12 w-auto hover:opacity-80 transition-opacity" />
              
            </div>
          </div>
          <nav className="hidden md:flex gap-6 text-sm">
            {["gs-overview","gs-features","gs-impact","gs-roadmap"].map(id => (
              <motion.a key={id} href={`#${id}`} whileHover={{ color: C.dark }}
                className="capitalize transition-colors" style={{ color: "rgba(26,26,26,0.55)" }}>
                {id.replace("gs-","")}
              </motion.a>
            ))}
          </nav>
          <MagBtn href="#gs-features"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black text-white shadow-lg"
            style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})`, boxShadow: `0 8px 24px ${C.p(.32)}` }}>
            <MousePointerClick className="h-4 w-4" />
            Explore
          </MagBtn>
        </div>
      </header>

      {/* HERO */}
      <section id="gs-hero" ref={heroRef} className="relative overflow-hidden min-h-screen flex items-center px-4 sm:px-6">
        <NoiseCanvas color1={C.tint} color2={C.warmBg} opacity={0.26} />
        <div className="absolute inset-0 z-[1]"><ParticleCanvas count={20} /></div>
        <motion.div className="absolute inset-0 z-[2] opacity-22"
          animate={{ background: [`radial-gradient(circle at 20% 30%,${C.pd(.18)} 0%,transparent 40%)`,`radial-gradient(circle at 80% 70%,${C.pd(.18)} 0%,transparent 40%)`,`radial-gradient(circle at 20% 30%,${C.pd(.18)} 0%,transparent 40%)`]}}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />
        <motion.div style={{ x: b1x, y: b1y }} className="absolute top-12 left-[4%] w-[340px] h-[340px] pointer-events-none z-[2]">
          <div className="w-full h-full rounded-full" style={{ filter: "blur(100px)", opacity: .3, background: `radial-gradient(circle,${C.tint},transparent)` }} />
        </motion.div>
        <motion.div style={{ x: b2x, y: b2y }} className="absolute bottom-12 right-[4%] w-[400px] h-[400px] pointer-events-none z-[2]">
          <div className="w-full h-full rounded-full" style={{ filter: "blur(110px)", opacity: .18, background: `radial-gradient(circle,${C.gold},transparent)` }} />
        </motion.div>
        {[{ t:"22%",l:"7%",d:12,c:`${C.gold}44` },{ t:"35%",r:"9%",d:8,c:C.p(.32) },{ b:"28%",l:"13%",d:14,c:C.pd(.22) },{ b:"38%",r:"16%",d:10,c:`${C.gold}33` }].map((o,i)=>(
          <Float key={i} duration={4+i*.6} delay={i*.4}
            className="absolute z-[2] rounded-full pointer-events-none"
            style={{ top:o.t,bottom:o.b,left:o.l,right:o.r,width:o.d,height:o.d,background:o.c }} />
        ))}
        <Float className="absolute top-[18%] left-[6%] hidden lg:block z-[2]" duration={4} yRange={22} delay={0}>
          <motion.div animate={{ rotate:[0,10,-10,0] }} transition={{ duration:4,repeat:Infinity }}
            className="text-6xl" style={{ opacity:.2,filter:`drop-shadow(0 8px 24px ${C.p(.3)})` }}>🎓</motion.div>
        </Float>
        <Float className="absolute top-[25%] right-[9%] hidden lg:block z-[2]" duration={3.5} yRange={18} delay={.8}>
          <motion.div animate={{ scale:[1,1.2,1] }} transition={{ duration:3.5,repeat:Infinity }}
            className="text-5xl" style={{ opacity:.18,filter:`drop-shadow(0 8px 24px ${C.p(.3)})` }}>🌐</motion.div>
        </Float>
        <Float className="absolute bottom-[28%] left-[12%] hidden lg:block z-[2]" duration={5} yRange={16} delay={1.5}>
          <span className="text-4xl" style={{ opacity:.14 }}>🏆</span>
        </Float>
        <Float className="absolute bottom-[22%] right-[8%] hidden lg:block z-[2]" duration={4.5} yRange={20} delay={.5}>
          <motion.div animate={{ rotate:[0,360] }} transition={{ duration:10,repeat:Infinity,ease:"linear" }}
            className="text-5xl" style={{ opacity:.18 }}>⭐</motion.div>
        </Float>
        <motion.div style={{ y: bigY }} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-[2]">
          <span className="font-black leading-none tracking-tighter uppercase whitespace-nowrap"
            style={{ fontSize:"16vw",color:C.p(.022) }}>GSIN</span>
        </motion.div>
        <div className="absolute inset-0 z-[2] opacity-[.03] pointer-events-none"
          style={{ backgroundImage:`radial-gradient(circle,${C.veryDark} 1px,transparent 1px)`,backgroundSize:"32px 32px" }} />

        <motion.div style={{ y:heroY,opacity:heroO,scale:heroS }} className="mx-auto max-w-6xl w-full text-center relative z-10 pt-8">
          <motion.div initial={{ scale:.7,opacity:0,y:20 }} animate={{ scale:1,opacity:1,y:0 }} transition={{ duration:.65,ease:EASE_BACK }} className="inline-block mb-8">
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold backdrop-blur-sm shadow-lg"
              style={{ background:C.p(.12),border:`1px solid ${C.p(.28)}`,color:C.mid }}>
              <Float duration={3.5} yRange={6}>
                <motion.div animate={{ rotate:[0,20,-20,0] }} transition={{ duration:2.8,repeat:Infinity }}>
                  <Gamepad2 className="w-4 h-4" style={{ color:C.dark }} />
                </motion.div>
              </Float>
              <motion.span animate={{ opacity:[.7,1,.7] }} transition={{ duration:2,repeat:Infinity }} className="text-[#D4AF37]">✦</motion.span>
              GSIN — Global Student Industry Network
              <motion.span animate={{ opacity:[.7,1,.7] }} transition={{ duration:2,repeat:Infinity }} className="text-[#D4AF37]">✦</motion.span>
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity:0,y:24 }} animate={{ opacity:1,y:0 }} transition={{ delay:.3,duration:.75,ease:EASE_EXPO }}
            className="font-bold mb-6 leading-tight" style={{ fontSize:"clamp(2.4rem,7vw,4.8rem)" }}>
            <span style={{ color:C.text }}>Reimagining Learning</span><br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage:`linear-gradient(135deg,${C.dark},${C.mid})` }}>
              through Gamification
            </span>
          </motion.h1>

          <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:.55,duration:.6,ease:EASE_EXPO }}
            className="mx-auto mb-8 rounded-full origin-center" style={{ width:64,height:3,background:C.gold }} />

          <motion.p initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:.5,ease:EASE_EXPO }}
            className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10 px-4 rounded-2xl border backdrop-blur-sm p-6"
            style={{ color:C.text,borderColor:"rgba(229,231,235,0.8)",background:"rgba(255,255,255,0.35)" }}>
            A virtual campus with rooms, mentors, whiteboards, screen sharing, tasks, and rewards — built to make learning addictive and impactful.
          </motion.p>

          <motion.div initial={{ opacity:0,y:18 }} animate={{ opacity:1,y:0 }} transition={{ delay:.65,ease:EASE_EXPO }}
            className="flex items-center justify-center gap-4 flex-wrap">
            <MagBtn href="#gs-features"
              className="rounded-full px-7 py-3.5 text-sm font-semibold border transition-all"
              style={{ background:"transparent",borderColor:C.p(.35),color:C.dark }}>
              Explore Features
            </MagBtn>
            <MagBtn href="#gs-overview"
              className="rounded-full px-7 py-3.5 text-sm font-black text-white shadow-lg flex items-center gap-2"
              style={{ background:`linear-gradient(135deg,${C.dark},${C.mid})`,boxShadow:`0 8px 28px ${C.p(.35)}` }}>
              See it in Action
              <motion.span animate={{ x:[0,4,0] }} transition={{ duration:1.5,repeat:Infinity }}>
                <ChevronRight className="w-4 h-4" />
              </motion.span>
            </MagBtn>
          </motion.div>

          <motion.div
  style={{ opacity: scrollOpacity }}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 2.2 }}
            className="flex justify-center mt-14 cursor-pointer"
            onClick={() => document.getElementById("gs-overview")?.scrollIntoView({ behavior:"smooth" })}>
            <Float duration={2} yRange={10}>
              <div className="w-7 h-12 rounded-full flex justify-center" style={{ border:`2px solid ${C.p(.28)}` }}>
                <motion.div
    className="w-1.5 h-3 bg-[#D4AF37] rounded-full mt-3"
    animate={{ y: [0, 14, 0], opacity: [1, 0.4, 1] }}
    transition={{ duration: 1.8, repeat: Infinity }}
  />

              </div>
            </Float>
          </motion.div>
        </motion.div>
      </section>

      {/* OVERVIEW */}
      <WaveDivider color={C.gold} toBg={C.light} />
      <section id="gs-overview" className="py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background:C.light }}>
        <NoiseCanvas opacity={0.18} />
        <Spotlight color={C.p(.04)} />
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <Reveal from="left">
              <SLabel text="About the Project" />
              <AHeading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]" delay={.05}>
                About the Project
              </AHeading>
              <p className="mb-6 leading-relaxed" style={{ color:"rgba(26,26,26,0.68)" }}>
                Built by <span className="font-black" style={{ color:C.dark }}>Stackenzo</span>, this platform blends
                real-time collaboration with a rich gamification engine. Students enter rooms (1, 2, 10-seat, seminar, mentor),
                collaborate via chat, whiteboards, and screen share, complete tasks, and redeem points for tangible rewards.
              </p>
              <StaggerContainer className="space-y-3" stagger={0.1} from="left">
                {["Real-time rooms & presence with chat and voice/video (WebRTC-ready)","Collaborative whiteboard in each room (Fabric/Excalidraw compatible)","Tasks → Points → Ranks → Rewards (Gold/Silver/Bronze)"].map((item,i)=>(
                  <GlowCard key={i} accent={C.dark}>
                    <motion.div whileHover={{ x:4 }}
                      className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm transition-all">
                      <Float duration={3.5+i*.3} delay={i*.2}>
                        <motion.div animate={{ scale:[1,1.25,1] }} transition={{ duration:2.2,repeat:Infinity,delay:i*.3 }}>
                          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color:C.dark }} />
                        </motion.div>
                      </Float>
                      <span className="text-sm leading-relaxed" style={{ color:"rgba(26,26,26,0.72)" }}>{item}</span>
                    </motion.div>
                  </GlowCard>
                ))}
              </StaggerContainer>
            </Reveal>
            <Reveal from="right" delay={.1}>
              <GlowCard accent={C.dark}>
                <TiltCard intensity={6}>
                  <motion.div whileHover={{ boxShadow:`0 24px 60px ${C.p(.18)}` }}
                    className="aspect-video rounded-2xl border overflow-hidden shadow-lg"
                    style={{ background:`linear-gradient(135deg,${C.light},#fff)`,borderColor:C.p(.25) }}>
                    <img src={pic} alt="Stackenzo Preview" className="w-full h-full object-contain" />
                  </motion.div>
                </TiltCard>
              </GlowCard>
            </Reveal>
          </div>
        </div>
      </section>
      <WaveDivider color={C.gold} flip toBg="#fff" />

      {/* FEATURES */}
      <section id="gs-features" className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        <Spotlight color={C.p(.04)} />
        <div className="absolute inset-0 opacity-[.025]" style={{ backgroundImage:`radial-gradient(circle,${C.veryDark} 1px,transparent 1px)`,backgroundSize:"28px 28px" }} />
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-14">
            <SLabel text="Key Features" />
            <AHeading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]" delay={.05}>
              Key Features
            </AHeading>
            <Reveal from="bottom" delay={.15}>
              <p className="mt-4 max-w-2xl mx-auto text-sm" style={{ color:"rgba(26,26,26,0.58)" }}>
                Everything students and mentors need, crafted with delightful micro-interactions.
              </p>
            </Reveal>
          </div>
          <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.09} from="bottom">
            {FEATURES.map((f,i)=>(
              <GlowCard key={f.title} accent={f.accent}>
                <TiltCard intensity={8}>
                  <motion.div whileHover={{ y:-8,boxShadow:`0 20px 50px ${f.accent}18` }}
                    className="group bg-white rounded-xl border border-gray-200 p-6 h-full overflow-hidden shadow-sm transition-all relative">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background:`linear-gradient(135deg,${C.p(.05)},${C.pd(.04)})` }} />
                    <Float duration={4+i*.3} delay={i*.2} yRange={7}>
                      <div className="mb-4 inline-flex rounded-xl p-3 border"
                        style={{ background:`${f.accent}18`,borderColor:`${f.accent}28` }}>
                        <f.icon className="h-6 w-6" style={{ color:f.accent }} />
                      </div>
                    </Float>
                    <h3 className="text-base font-bold mb-2" style={{ color:C.text }}>{f.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color:"rgba(26,26,26,0.62)" }}>{f.desc}</p>
                    <motion.div className="absolute bottom-0 left-0 right-0 h-1"
                      style={{ background:`linear-gradient(90deg,${f.accent},${C.gold})`,transformOrigin:"left",scaleX:0 }}
                      whileHover={{ scaleX:1 }} transition={{ duration:.35 }} />
                  </motion.div>
                </TiltCard>
              </GlowCard>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* UX */}
      <WaveDivider color={C.gold} toBg={C.light} />
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background:C.light }}>
        <NoiseCanvas opacity={0.18} />
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-14">
            <SLabel text="Design" />
            <AHeading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]" delay={.05}>
              Engaging UI / UX
            </AHeading>
            <Reveal from="bottom" delay={.15}>
              <p className="mt-4 max-w-2xl mx-auto text-sm" style={{ color:"rgba(26,26,26,0.58)" }}>
                Warm light theme, vibrant progress bars, confetti on level-ups, and buttery-smooth transitions.
              </p>
            </Reveal>
          </div>
          <StaggerContainer className="grid gap-5 md:grid-cols-3" stagger={0.1} from="scale">
            {[{ title:"Warm Light Mode",icon:Zap,desc:"Optimized orange-warm theme that keeps focus high and eyes happy." },{ title:"Achievement Badges",icon:Award,desc:"Visually rewarding badges that celebrate every milestone reached." },{ title:"Micro-interactions",icon:Sparkles,desc:"Thoughtfully designed animations to motivate, celebrate, and guide learners." }].map((item,i)=>(
              <GlowCard key={item.title} accent={C.gold}>
                <TiltCard>
                  <motion.div whileHover={{ y:-6,boxShadow:`0 18px 45px ${C.gold}22` }}
                    className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
                    <Float duration={4+i*.4} delay={i*.3} yRange={8}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 border shadow-sm"
                        style={{ background:`${C.gold}18`,borderColor:`${C.gold}28` }}>
                        <item.icon className="w-6 h-6" style={{ color:C.gold }} />
                      </div>
                    </Float>
                    <h4 className="font-bold mb-2" style={{ color:C.text }}>{item.title}</h4>
                    <p className="text-sm" style={{ color:"rgba(26,26,26,0.62)" }}>{item.desc}</p>
                  </motion.div>
                </TiltCard>
              </GlowCard>
            ))}
          </StaggerContainer>
        </div>
      </section>
      <WaveDivider color={C.gold} flip toBg="#fff" />

      {/* ROADMAP */}
      <section id="gs-roadmap" className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        <Spotlight color={C.p(.04)} />
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-14">
            <SLabel text="What's Next" />
            <AHeading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]" delay={.05}>
              Platform Overview
            </AHeading>
          </div>
          <StaggerContainer className="grid gap-5 md:grid-cols-3" stagger={0.1} from="bottom">
            {ROADMAP.map((col,i)=>(
              <GlowCard key={col.title} accent={col.accent}>
                <TiltCard intensity={8}>
                  <motion.div whileHover={{ y:-8,boxShadow:`0 18px 45px ${col.accent}22` }}
                    className="bg-white rounded-xl border border-gray-200 p-6 h-full shadow-sm overflow-hidden relative">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white shadow-md"
                        style={{ background:[`linear-gradient(135deg,${C.dark},${C.mid})`,`linear-gradient(135deg,${C.dark},${C.mid})`,`linear-gradient(135deg,${C.dark},${C.mid})`][i] }}>
                        {i+1}
                      </div>
                      <h4 className="font-bold" style={{ color:C.text }}>{col.title}</h4>
                    </div>
                    <StaggerContainer className="space-y-2.5" stagger={0.07} from="left">
                      {col.points.map(p=>(
                        <div key={p} className="flex items-start gap-2">
                          <motion.div animate={{ scale:[1,1.2,1] }} transition={{ duration:2,repeat:Infinity,delay:Math.random()*.5 }}>
                            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color:col.accent }} />
                          </motion.div>
                          <span className="text-sm" style={{ color:"rgba(26,26,26,0.68)" }}>{p}</span>
                        </div>
                      ))}
                    </StaggerContainer>
                    <motion.div className="absolute bottom-0 left-0 right-0 h-1"
                      style={{ background:`linear-gradient(90deg,${col.accent},${C.gold})`,transformOrigin:"left",scaleX:0 }}
                      whileHover={{ scaleX:1 }} transition={{ duration:.3 }} />
                  </motion.div>
                </TiltCard>
              </GlowCard>
            ))}
          </StaggerContainer>
        </div>
      </section>

      

      {/* PROBLEM / SOLUTION */}
      <WaveDivider color={C.gold} toBg={C.light} />
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background:C.light }}>
        <NoiseCanvas opacity={0.18} />
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-14">
            <SLabel text="Challenge & Solution" />
            <AHeading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]" delay={.05}>
              Problem & Solution
            </AHeading>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal from="left">
              <GlowCard accent={C.mid}>
                <TiltCard intensity={6}>
                  <div className="bg-white rounded-xl border p-6 h-full shadow-sm" style={{ borderColor:C.pd(.25) }}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
                        style={{ background:`linear-gradient(135deg,${C.mid},${C.mid})` }}>
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-xl font-bold" style={{ color:C.text }}>The Problem</h3>
                    </div>
                    <StaggerContainer className="space-y-3" stagger={0.08} from="left">
                      {["Low engagement in traditional learning formats.","Limited real-time visibility into learner progress.","Weak connection between classroom and industry skills."].map((p,i)=>(
                        <div key={i} className="flex items-start gap-2.5 bg-white p-3 rounded-lg border border-gray-100">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color:C.mid }} />
                          <span className="text-sm" style={{ color:"rgba(26,26,26,0.68)" }}>{p}</span>
                        </div>
                      ))}
                    </StaggerContainer>
                  </div>
                </TiltCard>
              </GlowCard>
            </Reveal>
            <Reveal from="right" delay={.1}>
              <GlowCard accent={C.dark}>
                <TiltCard intensity={6}>
                  <div className="bg-white rounded-xl border p-6 h-full shadow-sm" style={{ borderColor:C.p(.28) }}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
                        style={{ background:`linear-gradient(135deg,${C.dark},${C.mid})` }}>
                        <Rocket className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-xl font-bold" style={{ color:C.text }}>Our Solution</h3>
                    </div>
                    <StaggerContainer className="space-y-3" stagger={0.08} from="right">
                      {["Game loops that reward consistency and mastery.","Mentor analytics, leaderboards, and adaptive challenges.","Rooms for collaboration mirroring real project environments."].map((p,i)=>(
                        <div key={i} className="flex items-start gap-2.5 bg-white p-3 rounded-lg border border-gray-100">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color:C.dark }} />
                          <span className="text-sm" style={{ color:"rgba(26,26,26,0.68)" }}>{p}</span>
                        </div>
                      ))}
                    </StaggerContainer>
                  </div>
                </TiltCard>
              </GlowCard>
            </Reveal>
          </div>
        </div>
      </section>
      <WaveDivider color={C.gold} flip toBg="#fff" />

      {/* IMPACT */}
      <section id="gs-impact" className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        <Spotlight color={C.p(.04)} />
        <div className="absolute inset-0 opacity-[.025]" style={{ backgroundImage:`radial-gradient(circle,${C.veryDark} 1px,transparent 1px)`,backgroundSize:"28px 28px" }} />
        <div className="mx-auto max-w-7xl relative z-10 text-center">
          <SLabel text="Results" />
          <AHeading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]" >
            Impact
          </AHeading>
          <Reveal from="bottom" delay={.15}>
            <p className="mt-4 max-w-2xl mx-auto text-sm mb-10" style={{ color:"rgba(26,26,26,0.58)" }}>
              Early pilots show strong engagement and measurable learning outcomes.
            </p>
          </Reveal>
          <StaggerContainer className="grid gap-5 sm:grid-cols-3" stagger={0.12} from="scale">
            {COUNTERS.map((c,i)=>(
              <GlowCard key={c.label} accent={C.gold}>
                <TiltCard>
                  <motion.div whileHover={{ y:-8,boxShadow:`0 20px 50px ${C.gold}22` }}
                    className="bg-white rounded-xl border border-gray-200 p-7 text-center shadow-sm">
                    <Float duration={4+i*.5} delay={i*.3} yRange={6}>
                      <p className="text-4xl md:text-5xl font-black mb-2" style={{ color:C.dark }}>
                        <Counter end={c.end} suffix={c.suffix} />
                      </p>
                    </Float>
                    <p className="text-sm" style={{ color:"rgba(26,26,26,0.55)" }}>{c.label}</p>
                  </motion.div>
                </TiltCard>
              </GlowCard>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <WaveDivider color={C.gold} toBg={C.veryDark} />
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden"
        style={{ background:`linear-gradient(135deg,${C.dark},${C.mid})` }}>
        <Spotlight color={`${C.gold}09`} />
        <div className="absolute inset-0"><ParticleCanvas count={12} color={`${C.gold}11`} /></div>
        {[80,140,210].map((s,i)=>(
          <Float key={i} duration={6+i*2} yRange={12} delay={i}
            className="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none rounded-full"
            style={{ width:s,height:s,border:`1px solid ${C.gold}18` }} />
        ))}
        <div className="mx-auto max-w-4xl relative z-10 text-center">
          <Reveal from="scale">
            <Float duration={3.5} yRange={10}>
              <motion.div animate={{ rotate:[0,15,-15,0] }} transition={{ duration:3,repeat:Infinity }} className="inline-block mb-6">
                <Gamepad2 className="w-12 h-12 mx-auto" style={{ color:C.gold }} />
              </motion.div>
            </Float>
          </Reveal>
          <Reveal from="bottom" delay={.1}>
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
              Powered by{" "}
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage:`linear-gradient(135deg,${C.gold},#fff)` }}>
                Stackenzo
              </span>
            </h2>
          </Reveal>
          <Reveal from="bottom" delay={.15}>
            <p className="max-w-2xl mx-auto mb-8 text-sm sm:text-base text-white/70">
              Bridging education and industry with playful, data-driven learning experiences.
            </p>
          </Reveal>
          <Reveal from="bottom" delay={.2}>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <MagBtn href="#"
                className="rounded-full px-7 py-3.5 text-sm font-black shadow-xl flex items-center gap-2"
                style={{ background:"#fff",color:C.dark,boxShadow:"0 8px 28px rgba(0,0,0,0.25)" }}>
                Request Demo
                <motion.span animate={{ x:[0,4,0] }} transition={{ duration:1.5,repeat:Infinity }}>
                  <ChevronRight className="w-4 h-4" />
                </motion.span>
              </MagBtn>
              <MagBtn href="#"
                className="rounded-full px-7 py-3.5 text-sm font-bold border-2 border-white/30 text-white hover:bg-white/10 transition-all">
                View Case Study
              </MagBtn>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-10" style={{ borderColor:"rgba(26,26,26,0.08)" }}>
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm"
          style={{ color:"rgba(26,26,26,0.42)" }}>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-md" style={{ background:`linear-gradient(135deg,${C.dark},${C.gold})` }} />
            <span>© {new Date().getFullYear()} Stackenzo. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-5">
            {["Privacy","Terms","Contact"].map(label=>(
              <motion.a key={label} href="#" whileHover={{ color:C.dark }}
                className="transition-colors" style={{ color:"rgba(26,26,26,0.42)" }}>{label}</motion.a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Community;