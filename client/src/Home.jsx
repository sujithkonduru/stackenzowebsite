import "./App.css";
import {
  motion, AnimatePresence, useInView, useScroll, useTransform,
  useSpring, useMotionValue, useVelocity, useAnimationControls,
} from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import Navbar from "./Navbar";
import Toast from "./Toast";
import ScrollToTop from "./ScrollToTop";
import Footer from "./Footer";
import {
  Bot, Code2, Globe, Users, Briefcase, Zap, TrendingUp, MessageCircle,
  X, ArrowRight, ChevronRight, Sparkles, Target, Eye, Clock, MapPin,
  Calendar, BookOpen, Cpu as CpuIcon, Heart, Star, Package,
} from "lucide-react";

/* ════════════════════════════════════════════════════════════
   EASING CURVES
════════════════════════════════════════════════════════════ */
const EASE_EXPO = [0.16, 1, 0.3, 1];
const EASE_BACK = [0.34, 1.56, 0.64, 1];
const EASE_IN   = [0.4, 0, 1, 1];

/* ════════════════════════════════════════════════════════════
   DATA
════════════════════════════════════════════════════════════ */
const TESTIMONIALS = [
  { name: "Arjun Kumar", role: "Engineering Student", quote: "Stackenzo completely changed how I approach real-world projects. The learning is practical and intense.", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=987&q=80" },
  { name: "Sneha R",     role: "Startup Founder",     quote: "Their IT services helped us launch faster with a solid and scalable platform.",                          img: "https://images.unsplash.com/photo-1494790108777-766d5e5f4c9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=987&q=80" },
  { name: "Rahul M",     role: "Robotics Enthusiast", quote: "The robotics programs are hands-on and far better than typical classroom learning.",                      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=987&q=80" },
];
const STATS = [
  { label: "Students Trained",    value: "1200+", icon: Users,     iconKey: "users",    description: "Empowering future innovators"    },
  { label: "Projects Delivered",  value: "150+",  icon: Package,   iconKey: "package",  description: "Successful implementations"     },
  { label: "Workshops Conducted", value: "80+",   icon: Briefcase, iconKey: "briefcase",description: "Hands-on learning experiences"  },
  { label: "Community Members",   value: "3000+", icon: Globe,     iconKey: "globe",    description: "Growing tech community"         },
];
const SERVICES = [
  {
    id:1,
    title:"Research & Development",
    path:"/R_AND_D",
    shortDesc:"Cutting-edge R&D projects",
    fullDesc:"We drive innovation through cutting-edge research, combining academic rigor with real-world impact to solve complex challenges in AI, robotics, and sustainable technology.",
    icon:CpuIcon,
    accent:"#4CAF50",
    features:["AI & Machine Learning","Sustainable Tech","Prototype Development","Industry Collaboration"]
  },
  {
    id:2,
    title:"IT Services",
    path:"/WebServices",
    shortDesc:"Custom web & mobile dev",
    fullDesc:"We empower businesses with scalable IT solutions—from custom platforms to enterprise cloud systems—tailored to drive growth and efficiency.",
    icon:Code2,
    accent:"#2196F3",
    features:["Digital Platforms","Cloud Solutions","Enterprise Systemss","Scalable Architecture"]
  },
  {
    id:3,
    title:"EdTech",
    path:"/Robotics",
    shortDesc:"Strategic EdTech initiatives",
    fullDesc:"We transform education through innovative EdTech solutions, making learning engaging, accessible, and impactful while empowering future leaders.",
    icon:BookOpen,
    accent:"#FF9800",
    features:["Robotics education with hands-on learning","Coding bootcamps using real tools","Problem-solving focused training","Guidance from experienced mentors"]
  },
  {
    id:4,
    title:"Digital Marketing",
    path:"/DigitalMarketing",
    shortDesc:"SEO, branding & growth",
    fullDesc:"We use data-driven digital marketing to build strong online presence, connect with the right audience, and drive engagement with measurable ROI.",
    icon:TrendingUp,
    accent:"#E91E63",
    features:["SEO Optimization","Content Strategy","Social Media","Analytics & Reporting"]
  },
  {
    id:5,
    title:"GSIN Platform",
    path:"/Community",
    shortDesc:"Gamified tech ecosystem",
    fullDesc:"Our innovative GSIN platform creates an engaging ecosystem where tech enthusiasts collaborate, compete, and grow through challenges, leaderboards, project showcases, and community events that foster innovation.",
    icon:Globe,
    accent:"#00BCD4",
    features:["Coding challenges with rewards","Project collaboration ecosystem","Leaderboards for engagement","Community events with mentorship"]
  },
];
const WHY = [
  { icon: Zap,        title: "Swift Assistance", desc: "Quick turnaround without compromising quality"           },
  { icon: Target,     title: "Expert Team",       desc: "Experienced professionals in tech and education"        },
  { icon: Heart,      title: "24/7 Support",      desc: "Continuous support throughout your entire journey"      },
  { icon: TrendingUp, title: "Proven Results",    desc: "Track record of successful projects & satisfied clients" },
];
const PROGRAMS = [
  { title:"R & D Projects",         desc:"Research-driven engineering projects for real-world challenges.",  img:"https://eu-images.contentstack.com/v3/assets/blt7a82e963f79cc4ec/blte9ba4bb5c8fc7e51/64b54806962d8e60ca1b576d/RD.jpg",                                                      link:"/R_AND_D",          icon:CpuIcon,    accent:"#4CAF50" },
  { title:"IT Services",            desc:"End-to-end software development and scalable digital platforms.",  img:"https://ktla.com/wp-content/uploads/sites/4/2017/08/nasa.jpg",                                                                                                           link:"/WebServices",      icon:Code2,      accent:"#2196F3" },
  { title:"Robotics Education",     desc:"Hands-on robotics programs promoting innovation.",                 img:"https://tse3.mm.bing.net/th/id/OIP.95DU085B5v2VMvLso-nfzAAAAA",                                                                                                          link:"/Robotics",         icon:Bot,        accent:"#9C27B0" },
  { title:"Workshops & Internships",desc:"Industry-oriented programs bridging learning with practice.",      img:"https://st2.depositphotos.com/3591429/8629/i/950/depositphotos_86293450-stock-photo-workshop-training-development-concept.jpg",                                           link:"/WorkShops",        icon:Users,      accent:"#FF9800" },
  { title:"Digital Marketing",      desc:"Comprehensive SEO, branding and performance marketing.",           img:"https://www.simplilearn.com/ice9/free_resources_article_thumb/What_is_digital_marketing.jpg",                                                                              link:"/DigitalMarketing", icon:TrendingUp, accent:"#E91E63" },
  { title:"GSIN Platform",          desc:"Gamified innovation ecosystem for collaboration and growth.",      img:"https://img.freepik.com/free-vector/teamwork-concept-landing-page_52683-20158.jpg",                                                                                        link:"/Community",        icon:Globe,      accent:"#00BCD4" },
];
const MARQUEE_ITEMS = ["Research & Development","IT Solutions","EdTech Innovation","Robotics","Digital Marketing","GSIN Platform","AI & Machine Learning","Cloud Solutions","IoT Integration","Smart Manufacturing"];
const NAV_SECTIONS  = ["hero","services-section","programs","about","testimonials-section"];

/* ════════════════════════════════════════════════════════════
   HOOK — scroll direction
════════════════════════════════════════════════════════════ */
function useScrollDir() {
  const { scrollY } = useScroll();
  const vel = useVelocity(scrollY);
  const [dir, setDir] = useState("down");
  useEffect(() => vel.on("change", v => setDir(v > 0 ? "down" : "up")), [vel]);
  return dir;
}

/* ════════════════════════════════════════════════════════════
   BIDIRECTIONAL REVEAL WRAPPER
   – slides up when scrolling down, slides down when scrolling up
════════════════════════════════════════════════════════════ */
function Reveal({
  children,
  className = "",
  delay     = 0,
  from      = "bottom",   // "bottom" | "top" | "left" | "right" | "scale"
  once      = false,      // if true only animates once (original behaviour)
  threshold = 0.15,
}) {
  const ref   = useRef(null);
  const inV   = useInView(ref, { once, margin: "-60px", amount: threshold });
  const dir   = useScrollDir();

  const offsets = {
    bottom: { hidden: { y: 70,   opacity: 0, scale: 0.96, filter: "blur(6px)" }, visible: { y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }, exit: { y: -50, opacity: 0, scale: 0.97, filter: "blur(4px)" } },
    top:    { hidden: { y: -70,  opacity: 0, scale: 0.96, filter: "blur(6px)" }, visible: { y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }, exit: { y: 50,  opacity: 0, scale: 0.97, filter: "blur(4px)" } },
    left:   { hidden: { x: -80,  opacity: 0, scale: 0.96, filter: "blur(6px)" }, visible: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)" }, exit: { x: 60,  opacity: 0, scale: 0.97, filter: "blur(4px)" } },
    right:  { hidden: { x: 80,   opacity: 0, scale: 0.96, filter: "blur(6px)" }, visible: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)" }, exit: { x: -60, opacity: 0, scale: 0.97, filter: "blur(4px)" } },
    scale:  { hidden: { scale: 0.75, opacity: 0, filter: "blur(8px)" },           visible: { scale: 1, opacity: 1, filter: "blur(0px)" },         exit: { scale: 0.85, opacity: 0, filter: "blur(6px)" } },
  };

  const { hidden, visible, exit } = offsets[from] || offsets.bottom;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inV ? "visible" : once ? "hidden" : dir === "up" ? "exit" : "hidden"}
      variants={{ hidden, visible, exit }}
      transition={{ duration: 0.75, delay, ease: EASE_EXPO }}
    >
      {children}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   STAGGER CONTAINER  (children stagger in/out together)
════════════════════════════════════════════════════════════ */
function StaggerContainer({ children, className = "", stagger = 0.1, from = "bottom" }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: false, margin: "-60px" });
  const dir = useScrollDir();

  const offsets = {
    bottom: { hidden: { y: 60, opacity: 0, scale: 0.95, filter: "blur(5px)" }, visible: { y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }, exit: { y: -40, opacity: 0, scale: 0.97, filter: "blur(3px)" } },
    left:   { hidden: { x: -60, opacity: 0 }, visible: { x: 0, opacity: 1 }, exit: { x: 40, opacity: 0 } },
    right:  { hidden: { x: 60,  opacity: 0 }, visible: { x: 0, opacity: 1 }, exit: { x: -40, opacity: 0 } },
  };
  const { hidden, visible, exit } = offsets[from] || offsets.bottom;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inV ? "visible" : dir === "up" ? "exit" : "hidden"}
      variants={{
        hidden:  {},
        visible: { transition: { staggerChildren: stagger } },
        exit:    { transition: { staggerChildren: stagger / 2, staggerDirection: -1 } },
      }}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={{ hidden, visible, exit }} transition={{ duration: 0.7, ease: EASE_EXPO }}>
              {child}
            </motion.div>
          ))
        : <motion.div variants={{ hidden, visible, exit }} transition={{ duration: 0.7, ease: EASE_EXPO }}>{children}</motion.div>
      }
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   FLOATING ELEMENT  (drifts upward continuously)
════════════════════════════════════════════════════════════ */
function Float({ children, className = "", duration = 3, yRange = 12, delay = 0 }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -yRange, 0] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   GLOWING BORDER CARD
════════════════════════════════════════════════════════════ */
function GlowCard({ children, className = "", accent = "#D4AF37", dark = false }) {
  const ref   = useRef(null);
  const inV   = useInView(ref, { once: false, margin: "-40px" });
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <motion.div
      ref={ref}
      className={`relative rounded-2xl overflow-hidden ${className}`}
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={inV ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.96 }}
      transition={{ duration: 0.75, ease: EASE_EXPO }}
    >
      {/* Glow follow */}
      <div
        className="absolute pointer-events-none rounded-2xl z-0 transition-opacity duration-300"
        style={{
          inset: -1,
          background: `radial-gradient(350px circle at ${pos.x}px ${pos.y}px, ${accent}35, transparent 65%)`,
          opacity: inV ? 1 : 0,
        }}
      />
      {/* Border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-0"
        animate={inV ? { opacity: [0.3, 0.7, 0.3] } : { opacity: 0 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ boxShadow: `inset 0 0 0 1px ${accent}40` }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   PAGE LOADER
════════════════════════════════════════════════════════════ */
function PageLoader({ onDone }) {
  const [prog, setProg] = useState(0);
  const [phase, setPhase] = useState("loading");

  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v += Math.random() * 6 + 2;
      if (v >= 100) {
        v = 100; clearInterval(id);
        setPhase("done");
        setTimeout(onDone, 600);
      }
      setProg(Math.min(v, 100));
    }, 80);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.7, ease: EASE_EXPO } }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#1A0800] overflow-hidden"
    >
      {/* Animated grid bg */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "linear-gradient(#F04A06 1px,transparent 1px),linear-gradient(90deg,#F04A06 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Full-screen radial glow — grows with progress */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, rgba(230,107,38,0.55) 0%, rgba(180,60,10,0.25) 40%, transparent 70%)",
        }}
        animate={{
          scale: 0.3 + (prog / 100) * 2.4,
          opacity: 0.4 + (prog / 100) * 0.6,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      {/* Secondary pulse ring — always animating */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(240,74,6,0.35), transparent 70%)" }}
        animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0.15, 0.5] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Logo */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_BACK }}
        className="flex items-center gap-3 mb-10 relative z-10"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-14 h-14 flex items-center justify-center"
        >
          <img
            src="/images/Stackenzo small Logo.jpeg"
            alt="Stackenzo"
            className="w-10 h-10 object-contain"
          />
        </motion.div>
        <div>
          <span className="text-3xl font-black text-white tracking-tight block">Stackenzo</span>
          <span className="text-xs text-white/50 tracking-[.2em] uppercase">Learn Build Inspire</span>
        </div>
      </motion.div>

      {/* Progress */}
      <div className="relative z-10 w-64">
        <div className="h-[2px] bg-white/8 rounded-full overflow-hidden mb-3">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg,#F04A06,#D4AF37,#F04A06)" }}
            animate={{ width: `${prog}%` }}
            transition={{ duration: 0.18 }}
          />
        </div>
        <div className="flex justify-between items-center">
          <motion.p
            className="text-xs text-white/30 tracking-[.18em] uppercase"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            {phase === "done" ? "Ready" : "Loading"}
          </motion.p>
          <span className="text-xs text-[#D4AF37] font-bold">{Math.round(prog)}%</span>
        </div>
      </div>
    </motion.div>
  );
}



/* ════════════════════════════════════════════════════════════
   SCROLL PROGRESS BAR
════════════════════════════════════════════════════════════ */
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

/* ════════════════════════════════════════════════════════════
   SECTION NAV DOTS  (with labels)
════════════════════════════════════════════════════════════ */
function SectionNavDots() {
  const [active, setActive] = useState(0);
  const labels = ["Home", "Services", "Programs", "About", "Reviews"];

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { const i = NAV_SECTIONS.indexOf(e.target.id); if (i !== -1) setActive(i); } }),
      { threshold: 0.4 }
    );
    NAV_SECTIONS.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
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
  className="relative flex items-center gap-2"
  title={labels[i]}
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

/* ════════════════════════════════════════════════════════════
   ANIMATED NOISE CANVAS
════════════════════════════════════════════════════════════ */
function NoiseCanvas({ color1 = "#FFD5B8", color2 = "#FFF4ED", opacity = 0.4 }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let t = 0, id;
    const draw = () => {
      const w = c.width = c.offsetWidth, h = c.height = c.offsetHeight;
      const grd = ctx.createRadialGradient(
        w * (0.3 + 0.22 * Math.sin(t * 0.38)), h * (0.3 + 0.16 * Math.cos(t * 0.28)), 0,
        w * 0.5, h * 0.5, Math.max(w, h) * 0.88
      );
      grd.addColorStop(0,   color1 + "cc");
      grd.addColorStop(0.5, color2 + "88");
      grd.addColorStop(1,   "transparent");
      ctx.clearRect(0, 0, w, h); ctx.fillStyle = grd; ctx.fillRect(0, 0, w, h);
      t += 0.007; id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [color1, color2]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }} />;
}

/* ════════════════════════════════════════════════════════════
   PARTICLE CANVAS
════════════════════════════════════════════════════════════ */
function ParticleCanvas({ count = 30, color = "rgba(230,107,38,0.11)" }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let w = c.width = c.offsetWidth, h = c.height = c.offsetHeight;
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .38, vy: (Math.random() - .5) * .38,
      r: Math.random() * 1.8 + .8,
    }));
    let id;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) for (let j = i+1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 90) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = color.replace(/[\d.]+\)$/, `${(1 - d/90) * .065})`); ctx.stroke();
        }
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

/* ════════════════════════════════════════════════════════════
   SPOTLIGHT
════════════════════════════════════════════════════════════ */
function Spotlight({ color = "rgba(212,175,55,0.07)", size = 600 }) {
  const ref = useRef(null);
  useEffect(() => {
    const fn = e => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      ref.current.style.background = `radial-gradient(${size}px circle at ${e.clientX - r.left}px ${e.clientY - r.top}px,${color},transparent 70%)`;
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, [color, size]);
  return <div ref={ref} className="absolute inset-0 pointer-events-none z-[1]" />;
}

/* ════════════════════════════════════════════════════════════
   SVG WAVE DIVIDER
════════════════════════════════════════════════════════════ */
function WaveDivider({ color = "#D4AF37", flip = false, fromBg = "#fff", toBg = "#F7F4EF" }) {
  const ref  = useRef(null);
  const inV  = useInView(ref, { once: true, margin: "-10px" });
  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${flip ? "rotate-180" : ""}`} style={{ height: 56 }}>
      <svg viewBox="0 0 1440 56" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <motion.path d="M0,28 C240,0 480,56 720,28 C960,0 1200,56 1440,28 L1440,56 L0,56 Z"
          fill={toBg} initial={{ pathLength: 0 }} animate={inV ? { pathLength: 1 } : {}} transition={{ duration: 1.2, ease: EASE_EXPO }} />
        <motion.path d="M0,28 C240,0 480,56 720,28 C960,0 1200,56 1440,28"
          stroke={color} strokeWidth="1.5" fill="none"
          initial={{ pathLength: 0, opacity: 0 }} animate={inV ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.4, ease: EASE_EXPO, delay: .15 }} />
        <motion.path d="M0,36 C240,8 480,64 720,36 C960,8 1200,64 1440,36"
          stroke={color} strokeWidth=".6" fill="none" opacity=".4"
          initial={{ pathLength: 0 }} animate={inV ? { pathLength: 1 } : {}}
          transition={{ duration: 1.4, ease: EASE_EXPO, delay: .3 }} />
      </svg>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   TEXT SCRAMBLE
════════════════════════════════════════════════════════════ */
function useTextScramble(text, trigger) {
  const [out, setOut] = useState(text);
  const CH = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&";
  useEffect(() => {
    if (!trigger) return;
    let f = 0; const T = 24;
    const go = () => {
      const p = f / T;
      setOut(text.split("").map((ch, i) => ch === " " ? " " : i / text.length < p ? ch : CH[Math.floor(Math.random() * CH.length)]).join(""));
      if (f++ < T) requestAnimationFrame(go); else setOut(text);
    };
    requestAnimationFrame(go);
  }, [trigger]);
  return out;
}

/* ════════════════════════════════════════════════════════════
   MAGNETIC BUTTON
════════════════════════════════════════════════════════════ */
function MagBtn({ children, className = "", onClick }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 16 });
  const sy = useSpring(y, { stiffness: 250, damping: 16 });
  const mm = e => { const r = ref.current.getBoundingClientRect(); x.set((e.clientX - r.left - r.width/2) * .38); y.set((e.clientY - r.top - r.height/2) * .38); };
  const ml = () => { x.set(0); y.set(0); };
  return (
    <motion.button ref={ref} style={{ x: sx, y: sy }} onMouseMove={mm} onMouseLeave={ml} whileTap={{ scale: .94 }} onClick={onClick} className={className}>
      {children}
    </motion.button>
  );
}

/* ════════════════════════════════════════════════════════════
   3-D TILT CARD
════════════════════════════════════════════════════════════ */
function TiltCard({ children, className = "", intensity = 12 }) {
  const ref = useRef(null);
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 22 });
  const sry = useSpring(ry, { stiffness: 200, damping: 22 });
  const mm = e => { const r = ref.current.getBoundingClientRect(); rx.set(-((e.clientY - r.top)/r.height - .5) * intensity); ry.set(((e.clientX - r.left)/r.width - .5) * intensity); };
  const ml = () => { rx.set(0); ry.set(0); };
  return (
    <motion.div ref={ref} onMouseMove={mm} onMouseLeave={ml}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }} className={className}>
      {children}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   ANIMATED COUNTER
════════════════════════════════════════════════════════════ */
function Counter({ value }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: false });
  const num = parseInt(value.replace(/\D/g, ""), 10);
  const sfx = value.replace(/[0-9]/g, "");
  const mv  = useMotionValue(0);
  const sp  = useSpring(mv, { stiffness: 55, damping: 14 });
  const [d, setD] = useState(0);
  useEffect(() => { mv.set(inV ? num : 0); }, [inV]);
  useEffect(() => sp.on("change", v => setD(Math.round(v))), [sp]);
  return <span ref={ref}>{d}{sfx}</span>;
}

/* ════════════════════════════════════════════════════════════
   SECTION LABEL
════════════════════════════════════════════════════════════ */
function SLabel({ text }) {
  return (
    <Reveal from="top" className="flex items-center gap-3 justify-center mb-3">
      <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: false }} transition={{ duration: .55 }} className="h-px w-8 bg-[#D4AF37] origin-left" />
      <span className="text-[#D4AF37] font-bold tracking-[.2em] text-[11px] uppercase">{text}</span>
      <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: false }} transition={{ duration: .55 }} className="h-px w-8 bg-[#D4AF37] origin-right" />
    </Reveal>
  );
}

/* ════════════════════════════════════════════════════════════
   WORD-BY-WORD HEADING  (bidirectional)
════════════════════════════════════════════════════════════ */
function AHeading({ children, className = "", delay = 0 }) {
  const ref  = useRef(null);
  const inV  = useInView(ref, { once: false, margin: "-50px" });
  const dir  = useScrollDir();
  const words = typeof children === "string" ? children.split(" ") : [children];
  return (
    <h2 ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[.28em]">
          <motion.span className="inline-block"
            initial={{ y: "110%", opacity: 0, skewY: 5 }}
            animate={inV
              ? { y: 0, opacity: 1, skewY: 0 }
              : dir === "up"
                ? { y: "-110%", opacity: 0, skewY: -5 }
                : { y: "110%",  opacity: 0, skewY: 5 }}
            transition={{ duration: .72, delay: delay + i * .075, ease: EASE_EXPO }}>
            {w}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}



/* ════════════════════════════════════════════════════════════
   HERO SECTION
════════════════════════════════════════════════════════════ */
function HeroSection({ apiPrograms, loading }) {
  const secRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: secRef, offset: ["start start", "end start"] });
  const { scrollY } = useScroll();
const scrollOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const hY   = useTransform(scrollYProgress, [0,1], [0,-110]);
  const hO   = useTransform(scrollYProgress, [0,.6], [1,0.9]);
  const hS   = useTransform(scrollYProgress, [0,1], [1,.83]);
  const bigY = useTransform(scrollYProgress, [0,1], [0, 200]);

  const headlines = [
    "Empowering the Future Through Research & Smart IT",
    "Transforming Ideas into Scalable Digital Solutions",
    "Building Tomorrow's Tech Leaders, Today",
  ];
  const [hIdx, setHIdx] = useState(0), [trig, setTrig] = useState(false);
  const displayed = useTextScramble(headlines[hIdx], trig);
  useEffect(() => {
    const t = setInterval(() => { setHIdx(p => (p+1) % headlines.length); setTrig(p => !p); }, 4500);
    return () => clearInterval(t);
  }, []);

  const mx = useMotionValue(0), my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 35, damping: 18 });
  const smy = useSpring(my, { stiffness: 35, damping: 18 });
  const b1x = useTransform(smx, [-1,1], [-30,30]), b1y = useTransform(smy, [-1,1], [-18,18]);
  const b2x = useTransform(smx, [-1,1], [22,-22]),  b2y = useTransform(smy, [-1,1], [16,-16]);
  useEffect(() => {
    const fn = e => { mx.set((e.clientX/window.innerWidth-.5)*2); my.set((e.clientY/window.innerHeight-.5)*2); };
    window.addEventListener("mousemove", fn); return () => window.removeEventListener("mousemove", fn);
  }, []);

  return (
    <section id="hero" ref={secRef} data-dots-anchor className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: "#F7F4EF" }}>
      <NoiseCanvas color1="#FFD5B8" color2="#FFF0E6" opacity={0.42} />
      <div className="absolute inset-0"><ParticleCanvas count={26} color="rgba(230,107,38,0.09)" /></div>

      {/* Kinetic bg text */}
      <motion.div style={{ y: bigY }} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[22vw] font-black leading-none tracking-tighter uppercase whitespace-nowrap"
          style={{ color: "rgba(230,107,38,0.022)" }}>STACKENZO</span>
      </motion.div>

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[.03]" style={{ backgroundImage: "radial-gradient(circle,#F04A06 1px,transparent 1px)", backgroundSize: "30px 30px" }} />

      {/* Blobs */}
      <motion.div style={{ x: b1x, y: b1y }} className="absolute top-10 left-[4%] w-[420px] h-[420px] pointer-events-none">
        <div className="w-full h-full rounded-full blur-[110px] opacity-[.38]" style={{ background: "radial-gradient(circle,#FFD5B8,transparent)" }} />
      </motion.div>
      <motion.div style={{ x: b2x, y: b2y }} className="absolute bottom-10 right-[4%] w-[520px] h-[520px] pointer-events-none">
        <div className="w-full h-full rounded-full blur-[120px] opacity-[.22]" style={{ background: "radial-gradient(circle,#D4AF37,transparent)" }} />
      </motion.div>

      {/* Floating decorative orbs */}
      <Float className="absolute top-1/4 left-[8%] w-3 h-3 rounded-full bg-[#D4AF37]/30" duration={5} delay={0} />
      <Float className="absolute top-1/3 right-[10%] w-2 h-2 rounded-full bg-[#F04A06]/25" duration={4} delay={1} />
      <Float className="absolute bottom-1/4 left-[15%] w-4 h-4 rounded-full bg-[#F04A06]/20" duration={6} delay={2} />
      <Float className="absolute bottom-1/3 right-[18%] w-2.5 h-2.5 rounded-full bg-[#D4AF37]/25" duration={5.5} delay={0.5} />

      {/* Ticker */}
      {!loading && apiPrograms.length > 0 && (
        <div className="absolute top-16 left-0 right-0 z-10 overflow-hidden border-y border-black/[.055] bg-white/70 backdrop-blur-md py-2.5">
          <motion.div className="flex gap-14 whitespace-nowrap" animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, duration: 44, ease: "linear" }}>
            {[...apiPrograms.slice(0,6), ...apiPrograms.slice(0,6)].map((p,i) => (
              <Link key={i} to={`/Programs/${p.id}`} className="flex items-center gap-3 text-sm text-[#1A1A1A] hover:text-[#F04A06] transition-colors group">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
                </span>
                <span className="font-semibold group-hover:underline underline-offset-2">{p.title}</span>
                <span className="text-gray-300 text-xs">•</span>
                <span className="text-xs text-gray-400">{new Date(p.date).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span>
              </Link>
            ))}
          </motion.div>
        </div>
      )}

      {/* Main content */}
      <motion.div style={{ y: hY, opacity: hO, scale: hS }} className="relative z-10 text-center px-6 max-w-6xl mx-auto mt-24 pb-24">
        <motion.div initial={{ scale:.7, opacity:0, y:20 }} animate={{ scale:1, opacity:1, y:0 }} transition={{ duration:.65, ease: EASE_BACK }}
          className="inline-flex items-center gap-2 border border-[#F04A06]/14 rounded-full px-5 py-2.5 mb-8 bg-white/80 backdrop-blur-sm shadow-sm">
          <motion.div animate={{ rotate:[0,20,-20,0] }} transition={{ duration:2.8, repeat:Infinity, ease:"easeInOut" }}>
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          </motion.div>
          <span className="text-sm text-[#F04A06] font-bold tracking-wide">Innovation Through Technology</span>
        </motion.div>

        <div className="flex items-center justify-center mb-6" style={{ minHeight: "clamp(110px,18vw,240px)" }}>
          <motion.h1
  key={hIdx}
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -30 }}
  transition={{ duration: 0.6 }}
  className="text-[clamp(2.2rem,5.4vw,4.8rem)] font-black leading-[1.08] tracking-tight text-[#1A1A1A]"
>
  {headlines[hIdx]}
</motion.h1>
        </div>

        <motion.p initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:.8, delay:.45, ease: EASE_EXPO }}
          className="text-base md:text-lg text-[#555] max-w-3xl mx-auto leading-relaxed mb-10">
          A technology-driven organization specializing in IT services, pioneering R&D, and transformative EdTech solutions—shaping the future of innovation.
        </motion.p>

        <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ duration:.72, delay:.62 }}
          className="flex flex-col sm:flex-row gap-4 justify-center">
          <MagBtn onClick={() => document.getElementById("programs")?.scrollIntoView({ behavior:"smooth" })}
            className="group relative px-9 py-4 bg-[#F04A06] text-white rounded-full font-bold text-sm overflow-hidden shadow-xl shadow-[#F04A06]/30">
            <span className="relative z-10 flex items-center justify-center gap-2">
              Get Started
              <motion.span animate={{ x:[0,4,0] }} transition={{ duration:1.6, repeat:Infinity }}><ArrowRight className="w-4 h-4" /></motion.span>
            </span>
            <motion.div className="absolute inset-0 bg-[#F04A06] rounded-full origin-center" initial={{ scale:0 }} whileHover={{ scale:3 }} transition={{ duration:.5 }} />
          </MagBtn>
          <button
  onClick={() => document.getElementById("about")?.scrollIntoView({ behavior:"smooth" })}
  className="px-9 py-4 border-2 border-[#F04A06] text-[#F04A06] rounded-full font-bold text-sm bg-white hover:bg-[#FFF4ED] transition-colors"
>
  Learn More
</button>
        </motion.div>

       
      </motion.div>

      {/* Scroll cue */}
      <motion.div
  style={{ opacity: scrollOpacity }}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 2.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 cursor-pointer"
        onClick={() => document.getElementById("services-section")?.scrollIntoView({ behavior:"smooth" })}>
        <Float duration={2} yRange={10}>
          <div className="w-7 h-12 border-2 border-[#F04A06]/28 rounded-full flex justify-center">
  <motion.div
    className="w-1.5 h-3 bg-[#D4AF37] rounded-full mt-3"
    animate={{ y: [0, 14, 0], opacity: [1, 0.4, 1] }}
    transition={{ duration: 1.8, repeat: Infinity }}
  />
</div>
        </Float>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   OrbitalCard — place ABOVE ServicesSection
════════════════════════════════════════════════════════════ */
function OrbitalCard({ index, total, active, angleRef, svc, Icon, onClick }) {
  const cardRef = useRef(null);
  const RAD_LG  = 184;
  const RAD_SM  = 130;

  useEffect(() => {
    let raf;
    const update = () => {
      if (!cardRef.current) return;
      const rad   = window.innerWidth < 768 ? RAD_SM : RAD_LG;
      const step  = 360 / total;
      const ang   = ((index * step) - angleRef.current) * (Math.PI / 180);
      const x     = Math.sin(ang) * rad;
      const y     = -Math.cos(ang) * rad * 0.72;
      const isA   = index === active;
      const scale = isA ? 1.1 : 0.72;
      cardRef.current.style.transform =
        `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`;
      cardRef.current.style.opacity = isA ? "1" : "0.75";
      cardRef.current.style.zIndex  = isA ? "10" : "1";
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [active, index, total]);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 140,
        cursor: "pointer",
        transition: "opacity 0.5s ease, box-shadow 0.3s ease",
        willChange: "transform",
        borderColor: "rgba(0,0,0,0.08)",
      }}
      className="rounded-2xl p-4 border bg-white"
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.10)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      <div
        className="inline-flex p-2 rounded-xl mb-2"
        style={{ background: `${svc.accent}1e` }}
      >
        <Icon className="w-4 h-4" style={{ color: svc.accent }} />
      </div>
      <h4 className="text-xs font-bold text-[#1A1A1A] mb-1">{svc.title}</h4>
      <p className="text-[10px] text-gray-500">{svc.shortDesc}</p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   ServicesSection
════════════════════════════════════════════════════════════ */
function ServicesSection() {
  const SPEED    = 0.006;
  const INTERVAL = 12000;

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const angleRef  = useRef(0);
  const rafRef    = useRef(null);
  const dwellRef  = useRef(0);
  const lastTRef  = useRef(null);

  useEffect(() => {
    const tick = (timestamp) => {
      if (lastTRef.current === null) lastTRef.current = timestamp;
      const delta = timestamp - lastTRef.current;
      lastTRef.current = timestamp;

      if (!paused) {
        angleRef.current += SPEED * delta;
        if (angleRef.current >= 360) angleRef.current -= 360;

        dwellRef.current += delta;
        if (dwellRef.current >= INTERVAL) {
          dwellRef.current = 0;
          setActive((p) => (p + 1) % SERVICES.length);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused]);

  return (
    <section
      id="services-section"
      data-dots-anchor
      className="py-28 px-4 sm:px-6 overflow-hidden relative bg-gradient-to-b from-white to-[#FFF4ED]"
    >
      {/* LIGHT PARTICLES */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <Float
            key={i}
            duration={5 + i}
            delay={i * 0.8}
            yRange={15}
            className="absolute"
            style={{ left: `${10 + i * 16}%`, top: `${20 + i * 10}%` }}
          >
            <div className="w-1 h-1 rounded-full bg-[#F04A06]/20" />
          </Float>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HEADER */}
        <div className="text-center mb-16">
          <span className="text-lg sm:text-xl font-bold tracking-wide text-[#D4AF37]">
            What We Do
          </span>
          <AHeading
            className="text-[clamp(2.2rem,4.5vw,4rem)] font-black mt-2 text-[#F04A06]"
            delay={0.05}
          >
            Transforming Ideas into Reality
          </AHeading>
        </div>

        <div className="flex flex-col lg:flex-row gap-14 items-center">
          {/* LEFT PANEL */}
          <Reveal from="left" className="w-full lg:w-[42%]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: -45 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 45 }}
                transition={{ duration: 0.55 }}
                className="relative rounded-3xl p-8 border overflow-hidden bg-white"
                style={{ borderColor: "rgba(0,0,0,0.08)" }}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                <TiltCard className="relative">
                  <motion.div
                    className="inline-flex p-4 rounded-2xl mb-6"
                    style={{
                      background: `${SERVICES[active].accent}22`,
                      border: `1px solid ${SERVICES[active].accent}38`,
                    }}
                    whileHover={{ rotate: 8, scale: 1.12 }}
                  >
                    {(() => {
                      const I = SERVICES[active].icon;
                      return (
                        <I
                          className="w-8 h-8"
                          style={{ color: SERVICES[active].accent }}
                        />
                      );
                    })()}
                  </motion.div>

                  <h3 className="text-2xl lg:text-3xl font-black mb-4 text-[#1A1A1A]">
                    {SERVICES[active].title}
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    {SERVICES[active].fullDesc}
                  </p>

                  <StaggerContainer
                    className="space-y-2.5 mb-7"
                    stagger={0.08}
                    from="left"
                  >
                    {SERVICES[active].features.map((f, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: SERVICES[active].accent }}
                        />
                        <span className="text-sm text-gray-600">{f}</span>
                      </div>
                    ))}
                  </StaggerContainer>

                  <Link to={SERVICES[active].path}>
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-2 text-sm font-bold"
                      style={{ color: SERVICES[active].accent }}
                    >
                      Explore Service <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </TiltCard>

                {/* PROGRESS BAR */}
                <div className="mt-6 pt-5 border-t border-gray-200">
                  <div className="h-0.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      key={active}
                      className="h-full rounded-full"
                      style={{ background: SERVICES[active].accent }}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 12, ease: "linear" }}
                    />
                  </div>
                </div>

                {/* DOT NAV */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-gray-400 text-xs">
                    {active + 1} / {SERVICES.length}
                  </span>
                  <div className="flex gap-2">
                    {SERVICES.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setActive(i);
                          dwellRef.current = 0;
                        }}
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: i === active ? 24 : 6,
                          background:
                            i === active
                              ? SERVICES[active].accent
                              : "rgba(0,0,0,0.2)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </Reveal>

          {/* RIGHT ORBITAL */}
          <Reveal from="right" className="w-full lg:w-[58%]">
            <div
              className="relative h-[440px] md:h-[520px] flex items-center justify-center"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {/* Slow rotating rings */}
              {[218, 160, 102].map((r, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: r * 2,
                    height: r * 2,
                    border: `1px solid rgba(0,0,0,${0.05 + i * 0.03})`,
                  }}
                  animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                  transition={{
                    duration: 45 + i * 14,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              ))}

              {/* Orbital cards */}
              {SERVICES.map((svc, i) => {
                const Icon = svc.icon;
                return (
                  <OrbitalCard
                    key={svc.id}
                    index={i}
                    total={SERVICES.length}
                    active={active}
                    angleRef={angleRef}
                    svc={svc}
                    Icon={Icon}
                    onClick={() => {
                      setActive(i);
                      dwellRef.current = 0;
                    }}
                  />
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
/* ════════════════════════════════════════════════════════════
   STATS
════════════════════════════════════════════════════════════ */
function StatsSection() {
  return (
    <>
      <WaveDivider color="#D4AF37" fromBg="#0f0f0f" toBg="#FFF4ED" />
      <section data-dots-anchor className="py-24 px-4 sm:px-6 relative overflow-hidden" style={{ background: "#FFF4ED" }}>
        <NoiseCanvas color1="#FFD5B8" color2="#FFCBA4" opacity={0.28} />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({length:4}).map((_,i)=>(
            <Float key={i} duration={6+i} delay={i*1.2} yRange={24}
              className="absolute" style={{ left:`${15+i*22}%`, bottom:`${10+i*8}%` }}>
              <div className="rounded-full bg-[#F04A06]/[0.04]" style={{ width:80+i*30, height:80+i*30 }} />
            </Float>
          ))}
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <SLabel text="Company Impact" />
            <AHeading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#F04A06]" delay={.05}>
              Our Impact in Numbers
            </AHeading>
          </div>
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-5" stagger={0.12} from="bottom">
            {STATS.map((s,i) => { const Icon = s.icon; return (
              <GlowCard key={i} accent="#D4AF37">
                <TiltCard>
                  <motion.div whileHover={{ y:-10, boxShadow:"0 30px 65px rgba(0,0,0,0.11)" }}
                    className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 text-center hover:border-[#D4AF37] transition-all shadow-sm h-full">
                    <motion.div whileHover={{ rotate:18, scale:1.18 }} className="inline-flex justify-center mb-5">
                      <div
                        data-tbi={s.icon === Users ? "stat-users" : s.icon === Package ? "stat-package" : s.icon === Globe ? "stat-globe" : undefined}
                        className="bg-[#F04A06] p-3 rounded-xl shadow-lg shadow-[#F04A06]/22"><Icon className="w-6 h-6 text-white" /></div>
                    </motion.div>
                    <h3 className="text-3xl md:text-4xl font-black text-[#1A1A1A] mb-1"><Counter value={s.value} /></h3>
                    <p className="text-[#F04A06] uppercase tracking-widest text-[11px] font-bold mb-1">{s.label}</p>
                    <p className="text-xs text-gray-400">{s.description}</p>
                  </motion.div>
                </TiltCard>
              </GlowCard>
            ); })}
          </StaggerContainer>
        </div>
      </section>
      <WaveDivider color="#D4AF37" flip fromBg="#FFF4ED" toBg="#fff" />
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   PROGRAMS  (clip-path staggered wipe)
════════════════════════════════════════════════════════════ */
function ProgramsSection() {
  const dir = useScrollDir();
  return (
    <section id="programs" data-dots-anchor className="py-24 px-4 sm:px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <SLabel text="Our Core Programs" />
          <AHeading
  className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#F04A06] leading-tight pt-1"
  delay={.05}
>
  Programs We Deliver
</AHeading>
          <Reveal from="scale" delay={.3}>
            <div className="w-20 h-0.5 bg-[#D4AF37] mx-auto mt-5" />
          </Reveal>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROGRAMS.map((p,i) => {
            const Icon = p.icon;
            // Alternate: even from bottom, odd from scale; left column from left, right from right
            const col = i % 3;
            const fromDir = col === 0 ? "left" : col === 2 ? "right" : "bottom";
            return (
              <Reveal key={i} from={fromDir} delay={i * 0.07}>
                <Link to={p.link}>
                  <TiltCard>
                    <GlowCard accent={p.accent} className="group cursor-pointer" style={{ minHeight: 290 }}>
                      <motion.div whileHover={{ y:-7, boxShadow:`0 32px 65px ${p.accent}20` }}
                        className="relative rounded-2xl overflow-hidden border border-transparent hover:border-[#D4AF37]/28 transition-all" style={{ minHeight:290 }}>
                        <div className="absolute inset-0 overflow-hidden">
                          <motion.img src={p.img} alt={p.title} className="w-full h-full object-cover"
                            whileHover={{ scale:1.07 }} transition={{ duration:.65 }} />
                          <div className="absolute inset-0" style={{ background:"linear-gradient(to top,rgba(0,0,0,.84) 0%,rgba(0,0,0,.3) 55%,transparent 100%)" }} />
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500" style={{ background:p.accent }} />
                        </div>
                        {/* Floating icon */}
                        <Float duration={4} delay={i*0.4} className="absolute top-4 right-4">
                          <motion.div
                           
                            data-tbi={p.icon === CpuIcon ? "prog-cpu" : p.icon === Users ? "prog-users" : p.icon === Globe ? "prog-globe" : undefined}
                            className="p-2.5 rounded-xl border" style={{ background:`${p.accent}20`, borderColor:`${p.accent}3c` }} whileHover={{ rotate:14, scale:1.18 }}>
                            <Icon className="w-5 h-5" style={{ color:p.accent }} />
                          </motion.div>
                        </Float>
                        <div className="relative z-10 p-6 flex flex-col justify-end" style={{ minHeight:290 }}>
                          <motion.div initial={{ y:12, opacity:0 }} whileHover={{ y:0, opacity:1 }} transition={{ duration:.28 }} className="mb-2">
                            <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background:`${p.accent}22`, color:p.accent }}>View Program</span>
                          </motion.div>
                          <h3 className="text-xl font-black text-white mb-1.5">{p.title}</h3>
                          <p className="text-sm text-white/62 leading-relaxed line-clamp-2">{p.desc}</p>
                          <motion.div className="flex items-center gap-1.5 mt-3 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color:p.accent }}>
                            Explore <motion.span animate={{ x:[0,5,0] }} transition={{ duration:1.2, repeat:Infinity }}><ChevronRight className="w-4 h-4" /></motion.span>
                          </motion.div>
                        </div>
                      </motion.div>
                    </GlowCard>
                  </TiltCard>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   WHY US
════════════════════════════════════════════════════════════ */
function WhyUsSection() {
  return (
    <>
      
      <section data-dots-anchor className="py-24 px-4 sm:px-6 relative overflow-hidden" style={{ background:"#F7F4EF" }}>
        <div className="absolute inset-0 opacity-[.03]" style={{ backgroundImage:"radial-gradient(circle,#F04A06 1px,transparent 1px)", backgroundSize:"24px 24px" }} />
        {/* Big floating background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
          <motion.span className="text-[18vw] font-black leading-none tracking-tighter uppercase"
            style={{ color:"rgba(230,107,38,0.018)" }}
            animate={{ y:[0,-10,0] }} transition={{ duration:8, repeat:Infinity, ease:"easeInOut" }}>
            WHY US
          </motion.span>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <SLabel text="Why Stackenzo" />
            <AHeading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#F04A06] leading-tight pt-1" delay={.05}>
              Why Choose Stackenzo
            </AHeading>
          </div>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" stagger={0.12} from="bottom">
            {WHY.map((f,i) => { const Icon = f.icon; return (
              <GlowCard key={i} accent="#D4AF37">
                <TiltCard className="h-full">
                  <motion.div whileHover={{ y:-10, boxShadow:"0 32px 65px rgba(230,107,38,0.12)" }}
                    className="bg-white border border-gray-100 rounded-2xl p-8 text-center hover:border-[#D4AF37] transition-all shadow-sm h-full">
                    <Float duration={4+i*0.5} delay={i*0.4}>
                      <motion.div className="inline-flex justify-center mb-6" whileHover={{ scale:1.22, rotate:12 }}>
                        <div
                          data-tbi={i===0?"why-zap":i===1?"why-target":i===2?"why-heart":undefined}
                          className="p-4 rounded-2xl bg-[#FFF4ED]"><Icon className="w-7 h-7 text-[#F04A06]" /></div>
                      </motion.div>
                    </Float>
                    <h3 className="text-lg font-black text-[#1A1A1A] mb-3">{f.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                  </motion.div>
                </TiltCard>
              </GlowCard>
            ); })}
          </StaggerContainer>
        </div>
      </section>
      
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   ABOUT
════════════════════════════════════════════════════════════ */
function AboutSection() {
  const ITEMS = [
    "Build scalable, secure, and future-ready digital solutions",
    "Bridge academic knowledge with real-world implementation",
    "Empower startups, institutions, and enterprises through innovation",
    "Automate complex processes to enhance productivity",
    "Strengthen research-driven engineering culture",
    "Promote continuous learning and technological excellence",
  ];
  return (
    <section id="about" data-dots-anchor className="py-24 px-4 sm:px-6 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <SLabel text="About Stackenzo" />
          <AHeading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#F04A06]" delay={.05}>
            Our Mission & Vision
          </AHeading>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Reveal from="left">
            <GlowCard accent="#F04A06" className="h-full">
              <TiltCard>
                <motion.div whileHover={{ boxShadow:"0 28px 65px rgba(0,0,0,0.09)" }}
                  className="bg-white border border-gray-100 rounded-2xl p-8 md:p-10 hover:border-[#D4AF37] transition-all shadow-sm h-full">
                  <div className="flex items-center gap-4 mb-7">
                    <Float duration={4} yRange={6}>
                      <motion.div whileHover={{ rotate:16, scale:1.12 }}
                        data-tbi="about-target"
                        className="bg-[#F04A06] p-3 rounded-xl shadow-lg shadow-[#F04A06]/18">
                        <Target className="w-6 h-6 text-white" />
                      </motion.div>
                    </Float>
                    <h3 className="text-2xl font-black text-[#F04A06]">Our Mission</h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-7">Our mission is to design, develop, and deliver intelligent technology solutions that solve real-world challenges with precision, scalability, and long-term impact—across IT services, R&D, and EdTech. We focus on building scalable, secure, and future-ready digital solutions while seamlessly bridging academic knowledge with real-world implementation. By empowering startups, institutions, and enterprises through innovation, we enable sustainable growth and digital transformation. We automate complex processes to enhance productivity and efficiency, foster a strong research-driven engineering culture, and continuously promote learning, skill development, and technological excellence to prepare individuals and organizations for the future.</p>
                  
                </motion.div>
              </TiltCard>
            </GlowCard>
          </Reveal>

          <Reveal from="right" delay={.1}>
            <GlowCard accent="#D4AF37" className="h-full">
              <TiltCard>
                <motion.div whileHover={{ boxShadow:"0 28px 65px rgba(0,0,0,0.09)" }}
                  className="bg-white border border-gray-100 rounded-2xl p-8 md:p-10 hover:border-[#D4AF37] transition-all shadow-sm h-full">
                  <div className="flex items-center gap-4 mb-7">
                    <Float duration={4.5} yRange={6}>
                      <motion.div whileHover={{ rotate:16, scale:1.12 }}
                        data-tbi="about-eye"
                        className="bg-[#F04A06] p-3 rounded-xl shadow-lg shadow-[#F04A06]/18">
                        <Eye className="w-6 h-6 text-white" />
                      </motion.div>
                    </Float>
                    <h3 className="text-2xl font-black text-[#F04A06]">Our Vision</h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-7">To become a leading innovation-driven technology ecosystem where IT services, R&D, and EdTech converge to create meaningful impact. We aim to advance applied research, transform breakthrough ideas into scalable digital solutions, and deliver intelligent systems that empower businesses and learners alike. By integrating technological excellence with innovation and education, we strive to shape a smarter, more connected future.</p>
                  <Reveal from="bottom" delay={.35}>
                    <div className="relative overflow-hidden rounded-2xl p-5" style={{ background:"linear-gradient(135deg,#FFF4ED,#FFF4ED)" }}>
                      <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl bg-[#D4AF37]" />
                      <p className="text-sm text-[#1A1A1A] italic leading-relaxed pl-3">"Through this innovation backbone, we strive to redefine education by integrating practical learning, industry exposure, and technology-enabled experiences — empowering the next generation to learn, build and inspire."</p>
                    </div>
                  </Reveal>
                </motion.div>
              </TiltCard>
            </GlowCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(p => (p + 1) % TESTIMONIALS.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="testimonials-section"
      data-dots-anchor
      className="py-24 px-4 sm:px-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(120deg, #ffffff, #fff5f0, #ffffff)"
      }}
    >
      <Spotlight color="rgba(240,74,6,0.08)" />

      <div className="absolute inset-0">
        <ParticleCanvas count={16} color="rgba(240,74,6,0.08)" />
      </div>

      {/* Floating orbs */}
      {[{ x: "10%", y: "20%", s: 80, d: 5 }, { x: "85%", y: "15%", s: 60, d: 7 }, { x: "70%", y: "75%", s: 100, d: 6 }].map((o, i) => (
        <Float key={i} duration={o.d} yRange={15} className="absolute pointer-events-none" style={{ left: o.x, top: o.y }}>
          <div className="rounded-full bg-[#F04A06]/[0.08]" style={{ width: o.s, height: o.s }} />
        </Float>
      ))}

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Heading */}
        <div className="text-center mb-14">
          <SLabel text="Testimonials" />
          <AHeading
            className="text-[clamp(2rem,4vw,3.5rem)] font-black mt-2 text-gray-900"
            delay={.05}
          >
            What People Say
          </AHeading>
        </div>

        {/* Card */}
        <Reveal from="bottom">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, i) => {
                if (i.offset.x < -55) setIdx(p => (p + 1) % TESTIMONIALS.length);
                if (i.offset.x > 55) setIdx(p => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
              }}
              className="bg-white border border-gray-200 shadow-xl rounded-3xl p-8 md:p-12 cursor-grab active:cursor-grabbing select-none"
            >
              <div className="text-[#F04A06] text-7xl font-black leading-none mb-4 opacity-20">"</div>

              <p className="text-lg md:text-xl text-gray-600 italic leading-relaxed mb-8">
                {TESTIMONIALS[idx].quote}
              </p>

              <div className="flex items-center gap-5">
                <motion.img
                  initial={{ scale: .7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: .38 }}
                  src={TESTIMONIALS[idx].img}
                  alt={TESTIMONIALS[idx].name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#F04A06]"
                />

                <div>
                  <h4 className="text-base font-bold text-gray-900">
                    {TESTIMONIALS[idx].name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {TESTIMONIALS[idx].role}
                  </p>
                </div>

                <div className="ml-auto flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * .06, type: "spring" }}
                    >
                      <Star className="w-4 h-4 fill-[#F04A06] text-[#F04A06]" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </Reveal>

        {/* Dots */}
        <Reveal from="bottom" delay={.2}>
          <div className="flex justify-center gap-2.5 mt-7 items-center">
            {TESTIMONIALS.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setIdx(i)}
                animate={{ scale: i === idx ? 1.3 : 1 }}
                className="rounded-full transition-all"
                style={{
                  width: i === idx ? 28 : 8,
                  height: 8,
                  background: i === idx ? "#F04A06" : "rgba(0,0,0,0.2)"
                }}
              />
            ))}
          </div>

          <p className="text-center text-gray-400 text-xs mt-3">
            Drag or click to navigate
          </p>
        </Reveal>

      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   CTA
════════════════════════════════════════════════════════════ */
function CTASection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target:ref, offset:["start end","end start"] });
  const bgY  = useTransform(scrollYProgress, [0,1], [-55,55]);
  const txtY = useTransform(scrollYProgress, [0,1], [24,-24]);
  const inV  = useInView(ref, { once:true });
  const [trig, setTrig] = useState(false);
  useEffect(()=>{ if(inV) setTrig(true); },[inV]);
  const scr = useTextScramble("Ready to Shape the Future with Us?", trig);

  return (
    <>
      <WaveDivider color="#F04A06" fromBg="#fff" toBg="#3D1A0A" />
      <section ref={ref} className="relative py-16 overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y:bgY }}>
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=100" alt="Team" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background:"linear-gradient(135deg,rgba(230,107,38,0.9) 0%,rgba(197,83,26,0.93) 50%)" }} />
        </motion.div>
        <Spotlight color="rgba(212,175,55,0.06)" />
        <div className="absolute inset-0"><ParticleCanvas count={20} color="rgba(212,175,55,0.09)" /></div>
        {/* Floating rings */}
        {[120,200,300].map((s,i)=>(
          <Float key={i} duration={6+i*2} yRange={12} delay={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full border border-[#D4AF37]/10"
            style={{ width:s, height:s }} />
        ))}

        <motion.div style={{ y:txtY }} className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <Reveal from="top">
            <div className="inline-flex items-center gap-2 border border-[#D4AF37]/38 rounded-full px-5 py-2 mb-8 bg-[#D4AF37]/10 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm text-[#D4AF37] font-bold">Join Thousands of Innovators</span>
            </div>
          </Reveal>

          <Reveal from="bottom" delay={.1}>
            <h2 className="text-[clamp(2rem,5vw,4rem)] font-black text-white mb-6 leading-tight">{scr}</h2>
          </Reveal>

          <Reveal from="bottom" delay={.2}>
            <p className="text-lg text-white/78 mb-10 max-w-2xl mx-auto">
              Start your journey with Stackenzo today
            </p>
          </Reveal>

          <Reveal from="bottom" delay={.35}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagBtn onClick={()=>document.getElementById("programs")?.scrollIntoView({ behavior:"smooth" })}
                className="group relative px-10 py-4 bg-white text-[#F04A06] rounded-full font-black overflow-hidden shadow-2xl shadow-white/18">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Your Journey
                  <motion.span animate={{ x:[0,5,0] }} transition={{ duration:1.5, repeat:Infinity }}><ArrowRight className="w-4 h-4" /></motion.span>
                </span>
                <motion.div className="absolute inset-0 bg-[#FFF4ED] rounded-full origin-center" initial={{ scale:0 }} whileHover={{ scale:3 }} transition={{ duration:.5 }} />
              </MagBtn>
              <Link to="/Contact">
                <motion.button whileHover={{ scale:1.04, backgroundColor:"rgba(255,255,255,.1)" }} whileTap={{ scale:.97 }}
                  className="px-10 py-4 border-2 border-white/58 text-white rounded-full font-black hover:border-white transition-colors">
                  Schedule a Call
                </motion.button>
              </Link>
            </div>
          </Reveal>
        </motion.div>
      </section>
    </>
  );
}


/* ════════════════════════════════════════════════════════════
   HOME ROOT
════════════════════════════════════════════════════════════ */
export default function Home() {
  const [loaded,          setLoaded]          = useState(false);
  const [toast,           setToast]           = useState({ show:false, message:"" });
  const [apiPrograms,     setApiPrograms]     = useState([]);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [showEventsModal, setShowEventsModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch("/api/programs");
        const data = await res.json();
        if (data.success) {
          const sorted = data.programs.sort((a,b)=>new Date(b.date)-new Date(a.date));
          setApiPrograms(sorted);
          const active = sorted.filter(p=>p.status==="registration-open"||p.status==="upcoming");
          if (active.length>0 && !localStorage.getItem("eventsModalShown")) {
            setShowEventsModal(true); localStorage.setItem("eventsModalShown","true");
          }
        }
      } catch { /* silent */ } finally { setProgramsLoading(false); }
    })();
  },[]);

  useEffect(()=>{
    document.body.style.overflow=(showEventsModal||!loaded)?"hidden":"unset";
    return()=>{ document.body.style.overflow="unset"; };
  },[showEventsModal,loaded]);

  return (
    <>
      <AnimatePresence>{!loaded && <PageLoader onDone={()=>setLoaded(true)} />}</AnimatePresence>

      <motion.div className="bg-white text-[#1A1A1A] font-sans overflow-x-hidden relative"
        initial={{ opacity:0 }} animate={{ opacity:loaded?1:0 }} transition={{ duration:.55 }}>

      
        <ScrollProgressBar />
        <SectionNavDots />
        

        <Toast message={toast.message} isVisible={toast.show} onClose={()=>setToast({show:false,message:""})} />
        <Navbar />

        <HeroSection apiPrograms={apiPrograms} loading={programsLoading} />
        
        <ServicesSection />
        <StatsSection />
        <ProgramsSection />
        <WhyUsSection />
        <AboutSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />

        {/* WhatsApp FAB */}
        <motion.div initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }}
          transition={{ type:"spring", stiffness:260, damping:20, delay:1.5 }} className="fixed bottom-6 right-6 z-50">
          <div className="relative group">
            <motion.div className="absolute -inset-2 bg-[#D4AF37] rounded-full opacity-0 group-hover:opacity-35 blur-lg transition-all duration-300"
              animate={{ scale:[1,1.2,1] }} transition={{ duration:2.5, repeat:Infinity }} />
            <motion.a href="https://wa.me/919247577907" target="_blank" rel="noopener noreferrer"
              whileHover={{ scale:1.16, rotate:8 }} whileTap={{ scale:.93 }}
              className="relative flex items-center justify-center w-14 h-14 bg-[#F04A06] text-white rounded-full shadow-2xl border border-[#F04A06]">
              <MessageCircle className="w-6 h-6" />
            </motion.a>
          </div>
        </motion.div>

        <ScrollToTop />

        {/* Events Modal */}
        <AnimatePresence>
          {showEventsModal && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/65 backdrop-blur-md"
              onClick={()=>setShowEventsModal(false)}>
              <motion.div
                initial={{ scale:.8, opacity:0, y:55 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:.8, opacity:0, y:55 }}
                transition={{ type:"spring", stiffness:280, damping:24 }}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden border border-gray-100"
                onClick={e=>e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-[#FFF4ED] to-white">
                  <div>
                    <h2 className="text-2xl font-black flex items-center gap-2 text-[#1A1A1A]">
                      <motion.div animate={{ rotate:[0,20,-20,0] }} transition={{ duration:2, repeat:Infinity, ease:"easeInOut" }}>
                        <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                      </motion.div>
                      <span className="bg-gradient-to-r from-[#F04A06] to-[#F04A06] bg-clip-text text-transparent">Upcoming Events</span>
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">Don't miss out on these exciting opportunities!</p>
                  </div>
                  <motion.button whileHover={{ scale:1.1, rotate:90 }} transition={{ duration:.2 }}
                    onClick={()=>setShowEventsModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <X className="w-5 h-5 text-gray-400" />
                  </motion.button>
                </div>
                <div className="p-6 max-h-96 overflow-y-auto">
                  {programsLoading
                    ? <div className="flex justify-center py-10"><div className="w-10 h-10 border-4 border-gray-100 border-t-[#D4AF37] rounded-full animate-spin" /></div>
                    : (()=>{
                        const active=apiPrograms.filter(p=>p.status==="registration-open"||p.status==="upcoming");
                        if(!active.length) return <p className="text-center py-8 text-gray-400">No upcoming events at the moment.</p>;
                        return (
                          <div className="space-y-4">
                            {active.map(program=>(
                              <Link to={`/Programs/${program.id}`} key={program.id} onClick={()=>setShowEventsModal(false)}>
                                <motion.div whileHover={{ y:-3, boxShadow:"0 12px 40px rgba(0,0,0,0.07)" }}
                                  className="bg-[#FFF4ED] border border-gray-100 rounded-xl p-5 transition-all cursor-pointer">
                                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <h3 className="text-base font-black text-[#1A1A1A] mb-2 hover:text-[#F04A06] transition-colors">{program.title}</h3>
                                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{program.description}</p>
                                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#D4AF37]"/>{new Date(program.date).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#D4AF37]"/>{program.location}</span>
                                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#D4AF37]"/>{program.duration}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                      <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${program.status==="registration-open"?"bg-[#D4AF37] text-[#1A1A1A]":"bg-blue-100 text-blue-700"}`}>
                                        {program.status.replace("-"," ")}
                                      </span>
                                      <motion.div animate={{ x:[0,4,0] }} transition={{ duration:1.5, repeat:Infinity }}>
                                        <ChevronRight className="w-5 h-5 text-gray-300" />
                                      </motion.div>
                                    </div>
                                  </div>
                                </motion.div>
                              </Link>
                            ))}
                          </div>
                        );
                      })()
                  }
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}