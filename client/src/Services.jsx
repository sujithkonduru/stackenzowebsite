import {
  motion, AnimatePresence, useInView, useScroll, useTransform,
  useSpring, useMotionValue, useVelocity,
} from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  Code, TrendingUp, Rocket, Target, Zap, Globe,
  ChevronRight, Star, Sparkles, ArrowRight,
  Cpu, Smartphone, Database, Cloud, Shield, BarChart3,
  Users, Award, Clock, CheckCircle, ExternalLink,
  Layers, Gauge, Palette, Briefcase, Lightbulb,
} from "lucide-react";
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
const NAV_SECTIONS = ["svc-hero", "svc-services", "svc-why", "svc-process", "svc-cta"];
const NAV_LABELS   = ["Hero", "Services", "Why Us", "Process", "Contact"];

/* ══════════════════════════════════════════════
   DATA
══════════════════════════════════════════════ */
const SERVICES_DATA = [
  {
    id: "rnd", title: "R&D", subtitle: "Innovation & Research",
    description: "Cutting-edge research and development in AI/ML, IoT, robotics, and emerging technologies to drive future-ready solutions.",
    icon: Rocket,
    features: ["Artificial Intelligence & Machine Learning","Internet of Things (IoT)","Robotics & Automation","Blockchain & Web3","Data Science & Analytics","Computer Vision","Natural Language Processing"],
    technologies: ["TensorFlow","PyTorch","OpenCV","ROS","Solidity","Spark"],
    link: "/R_AND_D", accent: "#C5531A",
    stats: { patents:"15+", publications:"50+", innovations:"25+" },
  },
  {
    id: "it-services", title: "IT Services", subtitle: "Custom Software Solutions",
    description: "End-to-end web development, mobile apps, enterprise solutions, and system integrations tailored to your business needs.",
    icon: Code,
    features: ["Web Application Development","Mobile App Development","API Development & Integration","Database Design & Management","Cloud Solutions & DevOps","Enterprise Software Solutions","UI/UX Design & Prototyping"],
    technologies: ["React","Node.js","Python","AWS","Docker","Kubernetes"],
    link: "/WebServices", accent: "#F04A06",
    stats: { projects:"150+", clients:"50+", satisfaction:"98%" },
  },
  {
    id: "digital-marketing", title: "Digital Marketing", subtitle: "Strategic Online Presence",
    description: "Comprehensive digital marketing strategies including SEO, social media management, content creation, and analytics-driven campaigns.",
    icon: TrendingUp,
    features: ["Search Engine Optimization (SEO)","Social Media Marketing","Content Marketing & Creation","PPC Advertising & Analytics","Brand Strategy & Positioning","Email Marketing Automation","Influencer Marketing"],
    technologies: ["Google Analytics","SEMrush","HubSpot","Meta Ads","Mailchimp"],
    link: "/DigitalMarketing", accent: "#D4AF37",
    stats: { reach:"2M+", campaigns:"200+", growth:"300%" },
  },
];

const BENEFITS = [
  { icon: Award,    title: "Industry Recognition",  desc: "Award-winning solutions recognized by leading tech publications" },
  { icon: Users,    title: "Expert Team",            desc: "Senior developers, designers, and strategists with 10+ years experience" },
  { icon: Clock,    title: "Timely Delivery",        desc: "On-time project completion with efficient agile methodology" },
  { icon: Shield,   title: "Quality Assurance",      desc: "Rigorous testing and quality control processes" },
  { icon: Zap,      title: "Fast Performance",       desc: "Optimized solutions with cutting-edge technology" },
  { icon: BarChart3,title: "Measurable Results",     desc: "Data-driven approach with clear KPIs and metrics" },
  { icon: Globe,    title: "Global Standards",       desc: "International best practices and industry standards" },
  { icon: Cpu,      title: "Latest Technology",      desc: "Future-ready applications with modern tech stack" },
  { icon: Star,     title: "Dedicated Support",      desc: "24/7 technical support and maintenance services" },
];

const PROCESS_STEPS = [
  { step:"01", title:"Discovery",    desc:"Understanding your business goals and requirements",   icon: Target    },
  { step:"02", title:"Strategy",     desc:"Developing a comprehensive strategic action plan",     icon: Lightbulb },
  { step:"03", title:"Execution",    desc:"Implementing solutions with agile methodology",        icon: Rocket    },
  { step:"04", title:"Optimization", desc:"Continuous improvement and dedicated support",         icon: Gauge     },
];

const HERO_STATS = [
  { value:"10+",  label:"Years Experience",   icon: Users,    color:"#F04A06" },
  { value:"500+", label:"Happy Clients",      icon: Briefcase,color:"#C5531A" },
  { value:"98%",  label:"Client Retention",   icon: Star,     color:"#D4AF37" },
  { value:"24/7", label:"Support Available",  icon: Clock,    color:"#F04A06" },
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
    bottom: { hidden:{ y:65,  opacity:0, scale:.96, filter:"blur(6px)" }, visible:{ y:0, opacity:1, scale:1, filter:"blur(0px)" }, exit:{ y:-48, opacity:0, scale:.97, filter:"blur(4px)" } },
    top:    { hidden:{ y:-65, opacity:0, scale:.96, filter:"blur(6px)" }, visible:{ y:0, opacity:1, scale:1, filter:"blur(0px)" }, exit:{ y:48,  opacity:0, scale:.97, filter:"blur(4px)" } },
    left:   { hidden:{ x:-75, opacity:0, scale:.96, filter:"blur(6px)" }, visible:{ x:0, opacity:1, scale:1, filter:"blur(0px)" }, exit:{ x:55,  opacity:0, scale:.97, filter:"blur(4px)" } },
    right:  { hidden:{ x:75,  opacity:0, scale:.96, filter:"blur(6px)" }, visible:{ x:0, opacity:1, scale:1, filter:"blur(0px)" }, exit:{ x:-55, opacity:0, scale:.97, filter:"blur(4px)" } },
    scale:  { hidden:{ scale:.75, opacity:0, filter:"blur(8px)" }, visible:{ scale:1, opacity:1, filter:"blur(0px)" }, exit:{ scale:.85, opacity:0, filter:"blur(6px)" } },
  };
  const { hidden, visible, exit } = V[from] || V.bottom;
  return (
    <motion.div ref={ref} className={className}
      initial="hidden"
      animate={inV ? "visible" : once ? "hidden" : dir === "up" ? "exit" : "hidden"}
      variants={{ hidden, visible, exit }}
      transition={{ duration:.75, delay, ease:EASE_EXPO }}>
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   STAGGER CONTAINER
══════════════════════════════════════════════ */
function StaggerContainer({ children, className = "", stagger = 0.1, from = "bottom" }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once:false, margin:"-55px" });
  const dir = useScrollDir();
  const B = {
    bottom: { hidden:{ y:55,  opacity:0, scale:.95, filter:"blur(5px)" }, visible:{ y:0, opacity:1, scale:1, filter:"blur(0px)" }, exit:{ y:-38, opacity:0, scale:.97, filter:"blur(3px)" } },
    left:   { hidden:{ x:-55, opacity:0 }, visible:{ x:0, opacity:1 }, exit:{ x:38, opacity:0 } },
    scale:  { hidden:{ scale:.8, opacity:0 }, visible:{ scale:1, opacity:1 }, exit:{ scale:.88, opacity:0 } },
  };
  const { hidden, visible, exit } = B[from] || B.bottom;
  return (
    <motion.div ref={ref} className={className}
      initial="hidden"
      animate={inV ? "visible" : dir === "up" ? "exit" : "hidden"}
      variants={{ hidden:{}, visible:{ transition:{ staggerChildren:stagger }}, exit:{ transition:{ staggerChildren:stagger/2, staggerDirection:-1 }}}}>
      {Array.isArray(children)
        ? children.map((c,i) => <motion.div key={i} variants={{ hidden, visible, exit }} transition={{ duration:.7, ease:EASE_EXPO }}>{c}</motion.div>)
        : <motion.div variants={{ hidden, visible, exit }} transition={{ duration:.7, ease:EASE_EXPO }}>{children}</motion.div>}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   FLOAT
══════════════════════════════════════════════ */
function Float({ children, className = "", duration = 4, yRange = 14, delay = 0 }) {
  return (
    <motion.div className={className}
      animate={{ y:[-yRange/2, yRange/2, -yRange/2] }}
      transition={{ duration, repeat:Infinity, ease:"easeInOut", delay }}>
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   GLOW CARD
══════════════════════════════════════════════ */
function GlowCard({ children, className = "", accent = "#D4AF37" }) {
  const ref  = useRef(null);
  const inV  = useInView(ref, { once:false, margin:"-40px" });
  const [pos, setPos] = useState({ x:0, y:0 });
  const mv = e => { const r=ref.current?.getBoundingClientRect(); if(r) setPos({x:e.clientX-r.left,y:e.clientY-r.top}); };
  return (
    <motion.div ref={ref} className={`relative rounded-2xl overflow-hidden ${className}`} onMouseMove={mv}
      initial={{ opacity:0, y:40, scale:.96 }}
      animate={inV ? { opacity:1, y:0, scale:1 } : { opacity:0, y:40, scale:.96 }}
      transition={{ duration:.72, ease:EASE_EXPO }}>
      <div className="absolute pointer-events-none rounded-2xl z-0"
        style={{ inset:-1, background:`radial-gradient(300px circle at ${pos.x}px ${pos.y}px,${accent}28,transparent 60%)`, opacity:inV?1:0, transition:"opacity .3s" }}/>
      <motion.div className="absolute inset-0 rounded-2xl pointer-events-none z-0"
        animate={inV ? { opacity:[.22,.5,.22] } : { opacity:0 }}
        transition={{ duration:2.5, repeat:Infinity, ease:"easeInOut" }}
        style={{ boxShadow:`inset 0 0 0 1px ${accent}32` }}/>
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
  const srx = useSpring(rx,{stiffness:200,damping:22}), sry = useSpring(ry,{stiffness:200,damping:22});
  const mm = e => { const r=ref.current.getBoundingClientRect(); rx.set(-((e.clientY-r.top)/r.height-.5)*intensity); ry.set(((e.clientX-r.left)/r.width-.5)*intensity); };
  const ml = () => { rx.set(0); ry.set(0); };
  return (
    <motion.div ref={ref} onMouseMove={mm} onMouseLeave={ml}
      style={{ rotateX:srx, rotateY:sry, transformPerspective:900 }} className={className}>
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
  const sx = useSpring(x,{stiffness:250,damping:16}), sy = useSpring(y,{stiffness:250,damping:16});
  const mm = e => { const r=ref.current.getBoundingClientRect(); x.set((e.clientX-r.left-r.width/2)*.36); y.set((e.clientY-r.top-r.height/2)*.36); };
  const ml = () => { x.set(0); y.set(0); };
  return (
    <motion.button ref={ref} style={{x:sx,y:sy}} onMouseMove={mm} onMouseLeave={ml}
      whileTap={{scale:.94}} onClick={onClick} className={className}>
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

 
</motion.button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   NOISE CANVAS
══════════════════════════════════════════════ */
function NoiseCanvas({ color1="#FFD5B8", color2="#FFF4ED", opacity=0.38 }) {
  const ref=useRef(null);
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const ctx=c.getContext("2d"); let t=0,id;
    const draw=()=>{
      const w=c.width=c.offsetWidth, h=c.height=c.offsetHeight;
      const g=ctx.createRadialGradient(w*(.3+.22*Math.sin(t*.38)),h*(.3+.16*Math.cos(t*.28)),0,w*.5,h*.5,Math.max(w,h)*.88);
      g.addColorStop(0,color1+"cc"); g.addColorStop(.5,color2+"88"); g.addColorStop(1,"transparent");
      ctx.clearRect(0,0,w,h); ctx.fillStyle=g; ctx.fillRect(0,0,w,h); t+=.007; id=requestAnimationFrame(draw);
    };
    draw(); return()=>cancelAnimationFrame(id);
  },[color1,color2]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{opacity}}/>;
}

/* ══════════════════════════════════════════════
   PARTICLE CANVAS
══════════════════════════════════════════════ */
function ParticleCanvas({ count=22, color="rgba(230,107,38,0.09)" }) {
  const ref=useRef(null);
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const ctx=c.getContext("2d");
    let w=c.width=c.offsetWidth, h=c.height=c.offsetHeight;
    const pts=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.36,vy:(Math.random()-.5)*.36,r:Math.random()*1.7+.7}));
    let id;
    const draw=()=>{
      ctx.clearRect(0,0,w,h);
      pts.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; if(p.x<0)p.x=w; if(p.x>w)p.x=0; if(p.y<0)p.y=h; if(p.y>h)p.y=0; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=color; ctx.fill(); });
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
        const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);
        if(d<88){ ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.strokeStyle=color.replace(/[\d.]+\)$/,`${(1-d/88)*.06})`); ctx.stroke(); }
      }
      id=requestAnimationFrame(draw);
    };
    draw();
    const rz=()=>{w=c.width=c.offsetWidth;h=c.height=c.offsetHeight;};
    window.addEventListener("resize",rz);
    return()=>{ cancelAnimationFrame(id); window.removeEventListener("resize",rz); };
  },[count,color]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none"/>;
}

/* ══════════════════════════════════════════════
   SPOTLIGHT
══════════════════════════════════════════════ */
function Spotlight({ color="rgba(212,175,55,0.06)", size=580 }) {
  const ref=useRef(null);
  useEffect(()=>{
    const fn=e=>{ if(!ref.current) return; const r=ref.current.getBoundingClientRect(); ref.current.style.background=`radial-gradient(${size}px circle at ${e.clientX-r.left}px ${e.clientY-r.top}px,${color},transparent 70%)`; };
    window.addEventListener("mousemove",fn); return()=>window.removeEventListener("mousemove",fn);
  },[color,size]);
  return <div ref={ref} className="absolute inset-0 pointer-events-none z-[1]"/>;
}

/* ══════════════════════════════════════════════
   WAVE DIVIDER
══════════════════════════════════════════════ */
function WaveDivider({ color="#D4AF37", flip=false, toBg="#fff" }) {
  const ref=useRef(null);
  const inV=useInView(ref,{once:true,margin:"-10px"});
  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${flip?"rotate-180":""}`} style={{height:56}}>
      <svg viewBox="0 0 1440 56" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <motion.path d="M0,28 C240,0 480,56 720,28 C960,0 1200,56 1440,28 L1440,56 L0,56 Z"
          fill={toBg} initial={{pathLength:0}} animate={inV?{pathLength:1}:{}} transition={{duration:1.2,ease:EASE_EXPO}}/>
        <motion.path d="M0,28 C240,0 480,56 720,28 C960,0 1200,56 1440,28"
          stroke={color} strokeWidth="1.5" fill="none"
          initial={{pathLength:0,opacity:0}} animate={inV?{pathLength:1,opacity:1}:{}} transition={{duration:1.4,ease:EASE_EXPO,delay:.15}}/>
        <motion.path d="M0,36 C240,8 480,64 720,36 C960,8 1200,64 1440,36"
          stroke={color} strokeWidth=".6" fill="none" opacity=".4"
          initial={{pathLength:0}} animate={inV?{pathLength:1}:{}} transition={{duration:1.4,ease:EASE_EXPO,delay:.3}}/>
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
      <motion.div initial={{scaleX:0}} whileInView={{scaleX:1}} viewport={{once:false}} transition={{duration:.55}} className="h-px w-8 bg-[#D4AF37] origin-left"/>
      <span className="text-[#D4AF37] font-bold tracking-[.2em] text-[11px] uppercase">{text}</span>
      <motion.div initial={{scaleX:0}} whileInView={{scaleX:1}} viewport={{once:false}} transition={{duration:.55}} className="h-px w-8 bg-[#D4AF37] origin-right"/>
    </Reveal>
  );
}

/* ══════════════════════════════════════════════
   ANIMATED HEADING
══════════════════════════════════════════════ */
function AHeading({ children, className = "", delay = 0 }) {
  const ref=useRef(null);
  const inV=useInView(ref,{once:false,margin:"-50px"});
  const dir=useScrollDir();
  const words=typeof children==="string"?children.split(" "):[children];
  return (
    <h2 ref={ref} className={className}>
      {words.map((w,i)=>(
        <span key={i} className="inline-block overflow-hidden mr-[.28em]">
          <motion.span className="inline-block"
            initial={{y:"110%",opacity:0,skewY:5}}
            animate={inV?{y:0,opacity:1,skewY:0}:dir==="up"?{y:"-110%",opacity:0,skewY:-5}:{y:"110%",opacity:0,skewY:5}}
            transition={{duration:.72,delay:delay+i*.075,ease:EASE_EXPO}}>
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
const MARQUEE_ITEMS=["R&D Innovation","IT Services","Digital Marketing","AI & Machine Learning","Cloud Solutions","Robotics","Web Development","SEO & Growth","Data Science","IoT Integration"];
function MarqueeStrip({ dark=false, reverse=false }) {
  const [paused,setPaused]=useState(false);
  const items=[...MARQUEE_ITEMS,...MARQUEE_ITEMS];
  return (
    <div className={`py-4 overflow-hidden border-y ${dark?"border-white/8 bg-white/[0.03]":"border-black/5 bg-[#F7F4EF]"}`}
      onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}>
      <motion.div className="flex gap-10 whitespace-nowrap"
        animate={paused?{}:{x:reverse?["-50%","0%"]:["0%","-50%"]}}
        transition={{repeat:Infinity,duration:28,ease:"linear"}}>
        {items.map((item,i)=>(
          <span key={i} className={`flex items-center gap-3 text-sm font-semibold select-none ${dark?"text-white/45":"text-[#1A1A1A]/40"}`}>
            <motion.span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0"
              animate={{scale:[1,1.4,1]}} transition={{duration:2,repeat:Infinity,delay:i*.1}}/>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   HERO SECTION
══════════════════════════════════════════════ */
function HeroSection() {
  const secRef=useRef(null);
  const {scrollYProgress}=useScroll({target:secRef,offset:["start start","end start"]});
  const { scrollY } = useScroll();
const scrollOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  const hY  =useTransform(scrollYProgress,[0,1],[0,-110]);
  const hO  =useTransform(scrollYProgress,[0,.6],[1,0.9]);
  const hS  =useTransform(scrollYProgress,[0,1],[1,.84]);
  const bigY=useTransform(scrollYProgress,[0,1],[0,180]);

  const mx=useMotionValue(0), my=useMotionValue(0);
  const smx=useSpring(mx,{stiffness:35,damping:18}), smy=useSpring(my,{stiffness:35,damping:18});
  const b1x=useTransform(smx,[-1,1],[-28,28]), b1y=useTransform(smy,[-1,1],[-16,16]);
  const b2x=useTransform(smx,[-1,1],[22,-22]), b2y=useTransform(smy,[-1,1],[14,-14]);
  useEffect(()=>{
    const fn=e=>{mx.set((e.clientX/window.innerWidth-.5)*2); my.set((e.clientY/window.innerHeight-.5)*2);};
    window.addEventListener("mousemove",fn); return()=>window.removeEventListener("mousemove",fn);
  },[]);

  return (
    <section id="svc-hero" ref={secRef} className="relative pt-32 pb-24 px-4 sm:px-6 overflow-hidden min-h-screen flex items-center bg-white">
      <NoiseCanvas color1="#FFD5B8" color2="#FFF0E6" opacity={0.28}/>
      <div className="absolute inset-0 z-[1]"><ParticleCanvas count={20} color="rgba(230,107,38,0.07)"/></div>

      {/* Kinetic bg text */}
      <motion.div style={{y:bigY}} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-[2]">
        <span className="text-[20vw] font-black leading-none tracking-tighter uppercase whitespace-nowrap"
          style={{color:"rgba(230,107,38,0.018)"}}>SERVICES</span>
      </motion.div>

      {/* Dot grid */}
      <div className="absolute inset-0 z-[2] opacity-[.03]"
        style={{backgroundImage:"radial-gradient(circle,#F04A06 1px,transparent 1px)",backgroundSize:"32px 32px"}}/>

      {/* Blobs */}
      <motion.div style={{x:b1x,y:b1y}} className="absolute top-10 left-[4%] w-[380px] h-[380px] pointer-events-none z-[2]">
        <div className="w-full h-full rounded-full blur-[110px] opacity-[.3]" style={{background:"radial-gradient(circle,#FFD5B8,transparent)"}}/>
      </motion.div>
      <motion.div style={{x:b2x,y:b2y}} className="absolute bottom-10 right-[4%] w-[460px] h-[460px] pointer-events-none z-[2]">
        <div className="w-full h-full rounded-full blur-[120px] opacity-[.16]" style={{background:"radial-gradient(circle,#D4AF37,transparent)"}}/>
      </motion.div>

      {/* Floating orbs */}
      <Float className="absolute top-1/4 left-[7%] w-3 h-3 rounded-full bg-[#D4AF37]/28 z-[2]" duration={5} delay={0}/>
      <Float className="absolute top-1/3 right-[9%] w-2 h-2 rounded-full bg-[#F04A06]/22 z-[2]" duration={4} delay={1}/>
      <Float className="absolute bottom-1/3 left-[12%] w-4 h-4 rounded-full bg-[#C5531A]/18 z-[2]" duration={6} delay={2}/>
      <Float className="absolute bottom-1/4 right-[15%] w-2.5 h-2.5 rounded-full bg-[#D4AF37]/20 z-[2]" duration={5.5} delay={.5}/>

      <motion.div style={{y:hY,opacity:hO,scale:hS}} className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <Reveal from="left">
            {/* Badge */}
            <motion.div initial={{scale:.7,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:.65,ease:EASE_BACK}}
              className="inline-flex items-center gap-2 bg-white/88 backdrop-blur-sm border border-gray-200 rounded-full px-5 py-2.5 mb-7 shadow-sm">
              <motion.div animate={{rotate:[0,20,-20,0]}} transition={{duration:2.8,repeat:Infinity,ease:"easeInOut"}}>
                <Sparkles className="w-4 h-4 text-[#D4AF37]"/>
              </motion.div>
              <span className="text-sm font-semibold text-[#F04A06]">Premium Services</span>
            </motion.div>

            {/* H1 */}
            <motion.h1 initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:.25,duration:.75,ease:EASE_EXPO}}
              className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-[1.05]">
              <span className="text-[#1A1A1A]">Transform Your</span>
              <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] via-[#C5531A] to-[#F04A06]">Business With Us</span>
            </motion.h1>

            <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.45,ease:EASE_EXPO}}
              className="text-lg text-gray-500 mb-8 max-w-lg leading-relaxed">
              Comprehensive technology solutions and innovative strategies designed to accelerate your growth and digital transformation journey.
            </motion.p>

            {/* CTAs */}
            <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.6,ease:EASE_EXPO}}
              className="flex flex-wrap gap-4 mb-8">
              <Link to="/Contact">
                <MagBtn className="group relative px-8 py-4 bg-[#F04A06] text-white rounded-xl font-bold overflow-hidden shadow-xl shadow-[#F04A06]/25">
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started
                    <motion.span animate={{x:[0,4,0]}} transition={{duration:1.5,repeat:Infinity}}><ArrowRight className="w-5 h-5"/></motion.span>
                  </span>
                  <motion.div className="absolute inset-0 bg-[#C5531A] origin-left" initial={{scaleX:0}} whileHover={{scaleX:1}} transition={{duration:.4}}/>
                </MagBtn>
              </Link>
              <Link to="/About">
                <button className="px-8 py-4 border-2 border-[#F04A06]/20 text-[#1A1A1A] rounded-xl font-bold hover:border-[#F04A06] hover:text-[#F04A06] transition-all flex items-center gap-2 bg-white shadow-sm">
                  <Briefcase className="w-5 h-5"/>
                  Learn More
                </button>
              </Link>
            </motion.div>

            {/* Trust */}
            <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.78,ease:EASE_EXPO}}
              className="flex items-center gap-6">
              
              <div>
                <div className="flex items-center gap-0.5 mb-0.5">
                  {[1,2,3,4,5].map(i=>(<Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]"/>))}
                </div>
                <p className="text-sm text-gray-500">Trusted by 500+ businesses</p>
              </div>
            </motion.div>
          </Reveal>

          {/* RIGHT — stats grid */}
          <StaggerContainer className="grid grid-cols-2 gap-4" stagger={0.1} from="scale">
            {HERO_STATS.map((s,i)=>{const Icon=s.icon; return (
              <GlowCard key={i} accent={s.color}>
                <TiltCard>
                  <motion.div whileHover={{scale:1.05,y:-5,boxShadow:`0 20px 50px ${s.color}18`}}
                    className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#D4AF37] transition-all shadow-sm h-full">
                    <Float duration={4+i*.5} delay={i*.3} yRange={8}>
                      <Icon className="w-8 h-8 mb-3" style={{color:s.color}}/>
                    </Float>
                    <div className="text-3xl font-black text-[#1A1A1A] mb-1"><Counter value={s.value}/></div>
                    <div className="text-sm text-gray-500">{s.label}</div>
                  </motion.div>
                </TiltCard>
              </GlowCard>
            );})}
          </StaggerContainer>
        </div>

        {/* Scroll cue */}
        <motion.div
  style={{ opacity: scrollOpacity }}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 2.2 }}
          className="flex justify-center mt-16 cursor-pointer"
          onClick={()=>document.getElementById("svc-services")?.scrollIntoView({behavior:"smooth"})}>
          <Float duration={2} yRange={10}>
            <div className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-[#F04A06] transition-colors">
              <span className="text-xs font-medium">Scroll to explore</span>
              <div className="w-7 h-12 border-2 border-[#F04A06]/25 rounded-full flex justify-center">
                 <motion.div
    className="w-1.5 h-3 bg-[#D4AF37] rounded-full mt-3"
    animate={{ y: [0, 14, 0], opacity: [1, 0.4, 1] }}
    transition={{ duration: 1.8, repeat: Infinity }}
  />
</div>

            </div>
          </Float>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   SERVICES SECTION
══════════════════════════════════════════════ */
function ServicesShowcase() {
  return (
    <>
      
      <WaveDivider color="#D4AF37" toBg="#FFF4ED"/>
      <section id="svc-services" className="py-24 px-4 sm:px-6 relative overflow-hidden" style={{background:"#FFF4ED"}}>
        <NoiseCanvas color1="#FFD5B8" color2="#FFCBA4" opacity={0.22}/>
        <Spotlight color="rgba(230,107,38,0.04)" size={520}/>

        {/* Kinetic bg */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <motion.span className="text-[15vw] font-black leading-none tracking-tighter uppercase text-[#F04A06]/[0.018]"
            animate={{y:[0,-10,0]}} transition={{duration:9,repeat:Infinity,ease:"easeInOut"}}>SOLUTIONS</motion.span>
        </div>

        {/* Floating bg orbs */}
        {[{l:"5%",t:"15%",s:80},{l:"88%",t:"60%",s:60},{l:"45%",t:"80%",s:70}].map((o,i)=>(
          <Float key={i} duration={6+i} yRange={18} delay={i} className="absolute pointer-events-none rounded-full bg-[#F04A06]/[0.03]" style={{left:o.l,top:o.t,width:o.s,height:o.s}}/>
        ))}

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <SLabel text="Our Services"/>
            <AHeading className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A] mt-1" delay={.05}>
              Our Services
            </AHeading>
            <Reveal from="bottom" delay={.25}>
              <div className="w-16 h-[3px] bg-[#D4AF37] mx-auto mt-4 rounded"/>
              <p className="text-gray-500 max-w-2xl mx-auto mt-4">Comprehensive solutions tailored to your business needs, delivered with excellence</p>
            </Reveal>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {SERVICES_DATA.map((svc,idx)=>{
              const Icon=svc.icon;
              return (
                <Reveal key={svc.id} from={idx===0?"left":idx===2?"right":"bottom"} delay={idx*.1}>
                  <GlowCard accent={svc.accent} className="h-full">
                    <TiltCard intensity={8} className="h-full">
                      <Link to={svc.link}>
                        <motion.div whileHover={{y:-8,boxShadow:`0 32px 70px ${svc.accent}20`}}
                          className="group relative bg-white rounded-3xl border border-gray-200 hover:border-[#F04A06] transition-all duration-500 overflow-hidden h-full shadow-sm">

                          {/* Top gradient accent */}
                          <div className="h-1.5 w-full bg-gradient-to-r from-[#F04A06] to-[#C5531A] opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>

                          <div className="p-8">
                            {/* Icon */}
                            <Float duration={4+idx*.5} delay={idx*.3} yRange={8}>
                              <motion.div whileHover={{rotate:360,scale:1.1}} transition={{duration:.6}}
                                className="w-20 h-20 rounded-2xl bg-gradient-to-r from-[#F04A06] to-[#C5531A] p-0.5 mb-6">
                                <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                                  <Icon className="w-8 h-8 text-[#F04A06]"/>
                                </div>
                              </motion.div>
                            </Float>

                            <h3 className="text-2xl font-black text-[#1A1A1A] mb-1 group-hover:text-[#F04A06] transition-colors">{svc.title}</h3>
                            <p className="text-[#F04A06] font-semibold mb-4 text-sm">{svc.subtitle}</p>
                            <p className="text-gray-500 mb-6 leading-relaxed text-sm">{svc.description}</p>

                            {/* Features */}
                            <StaggerContainer className="space-y-2.5 mb-6" stagger={0.06} from="left">
                              {svc.features.slice(0,4).map((f,i)=>(
                                <div key={i} className="flex items-center gap-2">
                                  <motion.div animate={{scale:[1,1.3,1]}} transition={{duration:2.2,repeat:Infinity,delay:i*.22}}>
                                    <CheckCircle className="w-4 h-4 text-[#D4AF37] flex-shrink-0"/>
                                  </motion.div>
                                  <span className="text-sm text-[#1A1A1A]">{f}</span>
                                </div>
                              ))}
                            </StaggerContainer>

                            {/* Tech tags */}
                            <StaggerContainer className="flex flex-wrap gap-2 mb-6" stagger={0.07} from="scale">
                              {svc.technologies.slice(0,3).map((t,i)=>(
                                <motion.span key={i} whileHover={{scale:1.08}}
                                  className="text-xs px-2.5 py-1 rounded-full bg-[#FFF4ED] text-[#F04A06] border border-[#D4AF37]/28 font-medium cursor-default">
                                  {t}
                                </motion.span>
                              ))}
                              {svc.technologies.length>3&&(
                                <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                                  +{svc.technologies.length-3}
                                </span>
                              )}
                            </StaggerContainer>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-2 mb-6 p-4 bg-[#FFF4ED] rounded-xl border border-gray-200">
                              {Object.entries(svc.stats).map(([k,v])=>(
                                <div key={k} className="text-center">
                                  <div className="text-base font-black text-[#1A1A1A]">{v}</div>
                                  <div className="text-xs text-gray-400 capitalize">{k.replace(/([A-Z])/g," $1").trim()}</div>
                                </div>
                              ))}
                            </div>

                            {/* CTA row */}
                            <div className="flex items-center justify-between">
                              <span className="text-[#F04A06] font-bold text-sm group-hover:text-[#C5531A] transition-colors">Explore Service</span>
                              <motion.div animate={{x:[0,4,0]}} transition={{duration:1.5,repeat:Infinity}}
                                className="w-8 h-8 rounded-full bg-[#FFF4ED] flex items-center justify-center border border-[#D4AF37]/28">
                                <ExternalLink className="w-4 h-4 text-[#F04A06]"/>
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    </TiltCard>
                  </GlowCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
      <WaveDivider color="#D4AF37" flip toBg="#fff"/>
    </>
  );
}

/* ══════════════════════════════════════════════
   WHY CHOOSE US
══════════════════════════════════════════════ */
function WhySection() {
  const BOTTOM_STATS=[
    { value:"10+",  label:"Years of Excellence", icon:Award  },
    { value:"500+", label:"Happy Clients",        icon:Users  },
    { value:"98%",  label:"Client Retention",     icon:Star   },
    { value:"24/7", label:"Support Available",    icon:Clock  },
  ];

  return (
    <section id="svc-why" className="py-24 px-4 sm:px-6 bg-white relative overflow-hidden">
      <Spotlight color="rgba(230,107,38,0.04)" size={500}/>
      <div className="absolute inset-0 opacity-[.028]"
        style={{backgroundImage:"radial-gradient(circle,#F04A06 1px,transparent 1px)",backgroundSize:"28px 28px"}}/>

      {/* Kinetic bg */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.span className="text-[14vw] font-black leading-none tracking-tighter uppercase text-[#F04A06]/[0.018]"
          animate={{y:[0,-10,0]}} transition={{duration:10,repeat:Infinity,ease:"easeInOut"}}>ADVANTAGE</motion.span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SLabel text="Why Choose Us"/>
          <AHeading className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]" delay={.05}>
            The Stackenzo Advantage
          </AHeading>
          <Reveal from="bottom" delay={.25}>
            <div className="w-16 h-[3px] bg-[#D4AF37] mx-auto mt-4 rounded"/>
            <p className="text-gray-500 max-w-2xl mx-auto mt-4">We combine technical excellence with business acumen to deliver exceptional results</p>
          </Reveal>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.09} from="bottom">
          {BENEFITS.map((b,i)=>{const Icon=b.icon; return (
            <GlowCard key={i} accent="#D4AF37">
              <TiltCard>
                <motion.div whileHover={{scale:1.04,y:-8,boxShadow:"0 28px 60px rgba(0,0,0,0.09)"}}
                  className="group relative bg-white p-6 rounded-2xl border border-gray-200 hover:border-[#D4AF37] transition-all shadow-sm h-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#F04A06] to-[#C5531A] rounded-2xl opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300"/>
                  <Float duration={4+i*.35} delay={i*.2} yRange={7}>
                    <div className="text-[#D4AF37] mb-4 p-3 bg-[#FFF4ED] rounded-xl inline-block border border-[#D4AF37]/28">
                      <Icon className="w-6 h-6"/>
                    </div>
                  </Float>
                  <h3 className="text-lg font-black text-[#1A1A1A] mb-2 group-hover:text-[#F04A06] transition-colors">{b.title}</h3>
                  <p className="text-sm text-gray-500">{b.desc}</p>
                  {/* Hover bottom bar */}
                  <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#F04A06] rounded-b-2xl"
                    initial={{scaleX:0}} whileHover={{scaleX:1}} transition={{duration:.35}}/>
                </motion.div>
              </TiltCard>
            </GlowCard>
          );})}
        </StaggerContainer>

        {/* Bottom stats */}
        <StaggerContainer className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6" stagger={0.12} from="bottom">
          {BOTTOM_STATS.map((s,i)=>{const Icon=s.icon; return (
            <GlowCard key={i} accent="#D4AF37">
              <TiltCard>
                <motion.div whileHover={{scale:1.06,y:-6,boxShadow:"0 20px 50px rgba(212,175,55,0.14)"}}
                  className="text-center p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-[#D4AF37] transition-all">
                  <Float duration={4+i*.5} delay={i*.3} yRange={7}>
                    <Icon className="w-8 h-8 text-[#D4AF37] mx-auto mb-3"/>
                  </Float>
                  <div className="text-3xl font-black text-[#1A1A1A] mb-1"><Counter value={s.value}/></div>
                  <div className="text-sm text-gray-500">{s.label}</div>
                </motion.div>
              </TiltCard>
            </GlowCard>
          );})}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   PROCESS SECTION
══════════════════════════════════════════════ */
function ProcessSection() {
  return (
    <>
      <WaveDivider color="#D4AF37" toBg="#FFF4ED"/>
      <section id="svc-process" className="py-24 px-4 sm:px-6 relative overflow-hidden" style={{background:"#FFF4ED"}}>
        <NoiseCanvas color1="#FFD5B8" color2="#FFCBA4" opacity={0.2}/>

        {/* Kinetic bg */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <motion.span className="text-[14vw] font-black leading-none tracking-tighter uppercase text-[#F04A06]/[0.018]"
            animate={{y:[0,-10,0]}} transition={{duration:8,repeat:Infinity,ease:"easeInOut"}}>PROCESS</motion.span>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <SLabel text="How We Work"/>
            <AHeading className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]" delay={.05}>
              Our Process
            </AHeading>
            <Reveal from="bottom" delay={.25}>
              <div className="w-16 h-[3px] bg-[#D4AF37] mx-auto mt-4 rounded"/>
              <p className="text-gray-500 max-w-2xl mx-auto mt-4">A systematic approach to deliver exceptional results</p>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div className="absolute top-[3.25rem] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#D4AF37]/20 via-[#F04A06]/20 to-[#D4AF37]/20 hidden md:block"/>

            {PROCESS_STEPS.map((item,i)=>{
              const Icon=item.icon;
              return (
                <Reveal key={i} from="bottom" delay={i*.1}>
                  <GlowCard accent="#D4AF37" className="h-full">
                    <TiltCard>
                      <motion.div whileHover={{y:-10,boxShadow:"0 28px 60px rgba(212,175,55,0.14)"}}
                        className="relative z-10 bg-white p-6 rounded-2xl border border-gray-200 text-center shadow-sm hover:border-[#D4AF37] transition-all h-full">
                        {/* Step number */}
                        <Float duration={4+i*.5} delay={i*.4} yRange={8}>
                          <div className="w-12 h-12 rounded-full bg-[#FFF4ED] flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/28 shadow-sm">
                            <span className="text-xl font-black text-[#F04A06]">{item.step}</span>
                          </div>
                        </Float>
                        <motion.div whileHover={{rotate:16,scale:1.18}} className="inline-block mb-4">
                          <Icon className="w-8 h-8 text-[#D4AF37]"/>
                        </motion.div>
                        <h3 className="text-lg font-black text-[#1A1A1A] mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                        {/* Animated bottom accent */}
                        <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#F04A06] rounded-b-2xl"
                          initial={{scaleX:0}} whileHover={{scaleX:1}} transition={{duration:.35}}/>
                      </motion.div>
                    </TiltCard>
                  </GlowCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
      <WaveDivider color="#D4AF37" flip toBg="#fff"/>
    </>
  );
}

/* ══════════════════════════════════════════════
   CTA SECTION
══════════════════════════════════════════════ */
function CTASection() {
  const ref=useRef(null);
  const {scrollYProgress}=useScroll({target:ref,offset:["start end","end start"]});
  const bgY=useTransform(scrollYProgress,[0,1],[-40,40]);

  return (
    <section id="svc-cta" ref={ref} className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
      <Spotlight color="rgba(230,107,38,0.03)" size={480}/>
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal from="bottom">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            {/* BG */}
            <motion.div className="absolute inset-0" style={{y:bgY}}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFF4ED] via-[#FFF0E6] to-[#FFF4ED]"/>
            </motion.div>
            <div className="absolute inset-0 opacity-[.08]"
              style={{backgroundImage:"radial-gradient(circle at 2px 2px,rgba(230,107,38,0.08) 1px,transparent 0)",backgroundSize:"40px 40px"}}/>
            <ParticleCanvas count={14} color="rgba(230,107,38,0.5)"/>
            <Spotlight color="rgba(212,175,55,0.06)" size={380}/>

            {/* Floating rings */}
            {[80,140,210].map((s,i)=>(
              <Float key={i} duration={6+i*2} yRange={12} delay={i}
                className="absolute right-16 top-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/12 pointer-events-none"
                style={{width:s,height:s}}/>
            ))}

            <div className="relative z-10 border border-gray-200 rounded-3xl p-12 md:p-16 text-center">
              <Reveal from="top">
                <div className="inline-flex items-center gap-2 border border-[#D4AF37]/38 rounded-full px-5 py-2 mb-8 bg-[#D4AF37]/10 backdrop-blur-sm">
                  <motion.div animate={{rotate:[0,20,-20,0]}} transition={{duration:2.8,repeat:Infinity}}>
                    <Sparkles className="w-4 h-4 text-[#D4AF37]"/>
                  </motion.div>
                  <span className="text-sm text-[#F04A06] font-bold">Free Consultation Available</span>
                </div>
              </Reveal>

              <Reveal from="bottom" delay={.1}>
                <h2 className="text-4xl md:text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
                  Ready to Transform Your Business?
                </h2>
              </Reveal>

              <Reveal from="bottom" delay={.2}>
                <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
                  Let's discuss how our services can help you achieve your goals. Get a free consultation today.
                </p>
              </Reveal>

              <Reveal from="bottom" delay={.32}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
                  <Link to="/Contact">
                    <MagBtn className="group relative px-8 py-4 bg-[#F04A06] text-white rounded-xl font-black overflow-hidden shadow-xl shadow-[#F04A06]/20">
                      <span className="relative z-10 flex items-center gap-2">
                        Get Free Consultation
                        <motion.span animate={{x:[0,4,0]}} transition={{duration:1.5,repeat:Infinity}}><ArrowRight className="w-5 h-5"/></motion.span>
                      </span>
                      <motion.div className="absolute inset-0 bg-[#C5531A] origin-left" initial={{scaleX:0}} whileHover={{scaleX:1}} transition={{duration:.4}}/>
                    </MagBtn>
                  </Link>
                  <Link to="/portfolio">
                    <motion.button whileHover={{scale:1.04,borderColor:"#F04A06",color:"#F04A06"}} whileTap={{scale:.96}}
                      className="px-8 py-4 border-2 border-gray-200 bg-white text-[#1A1A1A] rounded-xl font-black hover:border-[#F04A06] hover:text-[#F04A06] transition-all flex items-center justify-center gap-2 shadow-sm">
                      <Layers className="w-5 h-5"/>
                      View Our Work
                    </motion.button>
                  </Link>
                </div>
              </Reveal>

              <Reveal from="bottom" delay={.44} className="mt-5">
                <StaggerContainer className="flex flex-wrap justify-center gap-6" stagger={0.1} from="bottom">
                  {[{icon:Shield,text:"ISO Certified"},{icon:Award,text:"Award Winning"},{icon:Users,text:"Expert Team"}].map((b,i)=>(
                    <motion.div key={i} whileHover={{scale:1.08,y:-3}} className="flex items-center gap-2 text-gray-500 cursor-default">
                      <Float duration={4+i} delay={i*.5} yRange={5}>
                        <b.icon className="w-4 h-4 text-[#D4AF37]"/>
                      </Float>
                      <span className="text-sm font-medium">{b.text}</span>
                    </motion.div>
                  ))}
                </StaggerContainer>
              </Reveal>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════ */
function Services() {
  return (
    <div className="bg-white text-[#1A1A1A] min-h-screen overflow-x-hidden">
     
      <ScrollProgressBar/>
      <SectionNavDots/>
      <Navbar/>

      <HeroSection/>
      <ServicesShowcase/>
      <WhySection/>
      <ProcessSection/>
      <CTASection/>

      <Footer/>
      <ScrollToTop/>
    </div>
  );
}

export default Services;