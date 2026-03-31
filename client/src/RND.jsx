import {
  motion, AnimatePresence, useInView, useScroll, useTransform,
  useSpring, useMotionValue, useVelocity,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search, Lightbulb, Users, Award, ChevronDown, Target, Zap, BookOpen,
  Microscope, Atom, Beaker, FlaskConical, Cpu, Globe2, Network,
  Sparkles, CheckCircle, Rocket, TrendingUp, Clock, HeadphonesIcon,
  FileText, GraduationCap, Building2, Briefcase, Share2, BookMarked,
  Layers, Code, Database, Cloud, Shield, Bot, Brain, FolderOpen, ChevronRight, ArrowRight,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import rndData from "./data/rndData.json";
import RNDApplicationModal from "./RNDApplicationModal";

/* ══════════════════════════════════════════════
   EASING
══════════════════════════════════════════════ */
const EASE_EXPO = [0.16, 1, 0.3, 1];
const EASE_BACK = [0.34, 1.56, 0.64, 1];

/* ══════════════════════════════════════════════
   NAV
══════════════════════════════════════════════ */
const NAV_SECTIONS = ["rnd-hero", "rnd-stats", "rnd-domains", "rnd-projects", "rnd-eligibility", "rnd-faq"];
const NAV_LABELS   = ["Hero", "Stats", "Domains", "Projects", "Apply", "FAQ"];

/* ══════════════════════════════════════════════
   DATA
══════════════════════════════════════════════ */
const RESEARCH_DOMAINS = [
  { title:"AI & ML", icon:Brain,     color:"from-blue-600 to-cyan-600",    desc:"Advanced AI and intelligent systems for real-world applications",           areas:["Computer Vision","Natural Language Processing","Reinforcement Learning","Neural Networks","Generative AI","Edge AI"] },
  { title:"Internet of Things (IoT)",                   icon:Network,   color:"from-emerald-600 to-teal-600", desc:"Connected devices, smart systems, and edge computing for intelligent infrastructure",                   areas:["Smart Cities","Industrial IoT","Healthcare IoT","Agricultural IoT","Wearable Technology","Vehicle Telematics"] },
  { title:"Robotics & Automation",                      icon:Bot,       color:"from-purple-600 to-pink-600",  desc:"Autonomous systems, robotic control, and intelligent automation for industry 4.0",                     areas:["Autonomous Vehicles","Service Robots","Industrial Automation","Swarm Robotics","Human-Robot Interaction","Soft Robotics"] },
  { title:"Cybersecurity",                              icon:Shield,    color:"from-red-600 to-rose-600",     desc:"Information security, threat detection, and secure systems for digital protection",                      areas:["Blockchain Security","IoT Security","AI-based Threat Detection","Cryptography","Zero Trust Architecture","Cloud Security"] },
  { title:"Sustainable Technology",                     icon:Globe2,    color:"from-teal-600 to-cyan-600",    desc:"Green computing, renewable energy systems, and environmental solutions for sustainability",              areas:["Smart Grid","Energy Optimization","Environmental Monitoring","Waste Management","Carbon Capture Tech","Circular Economy"] },
  { title:"Healthcare Technology",                      icon:Microscope,color:"from-indigo-600 to-purple-600",desc:"Medical devices, health informatics, and telemedicine solutions for better healthcare",                 areas:["Medical Imaging","Wearable Health Devices","Telemedicine","Drug Discovery","Bioinformatics","Digital Therapeutics"] },
  { title:"Quantum Computing",                          icon:Atom,      color:"from-violet-600 to-purple-600",desc:"Quantum algorithms, quantum machine learning, and quantum simulation for breakthrough computing",        areas:["Quantum Algorithms","Quantum Machine Learning","Quantum Simulation","Quantum Cryptography","Quantum Hardware","Error Correction"] },
  { title:"Blockchain Technology",                      icon:Layers,    color:"from-orange-600 to-red-600",   desc:"Distributed ledger technology, smart contracts, and decentralized applications",                         areas:["Smart Contracts","DeFi","NFTs","Supply Chain","Digital Identity","Consensus Mechanisms"] },
];

const METHODOLOGY = [
  { step:"01", title:"Problem Identification",   desc:"Identify real-world problems and research gaps through systematic literature review and industry analysis", icon:Search,   color:"from-blue-600 to-cyan-600",     deliverables:["Literature Review","Gap Analysis","Problem Statement","Research Questions"] },
  { step:"02", title:"Research Planning",        desc:"Develop comprehensive research methodology, timeline, and resource allocation for systematic investigation",   icon:FileText, color:"from-emerald-600 to-teal-600", deliverables:["Methodology Design","Timeline Planning","Resource Allocation","Ethics Approval"] },
  { step:"03", title:"Prototype Development",    desc:"Build proof-of-concept solutions using cutting-edge technologies and frameworks for rapid validation",               icon:Code,     color:"from-purple-600 to-pink-600",   deliverables:["Proof of Concept","Minimum Viable Product","Technical Documentation","Architecture Design"] },
  { step:"04", title:"Testing & Validation",     desc:"Rigorous testing, performance evaluation, and industry-standard validation",           icon:Beaker,   color:"from-orange-600 to-red-600",    deliverables:["Test Reports","Performance Metrics","Benchmark Results","Validation Studies"] },
  { step:"05", title:"Publication & Patent",     desc:"Document findings in research papers, conferences, and patent applications for IP protection",                 icon:FileText, color:"from-indigo-600 to-purple-600",deliverables:["Research Papers","Conference Presentations","Patent Filings","Technical Reports"] },
  { step:"06", title:"Commercialization",        desc:"Transform research outcomes into market-ready products and solutions for real-world impact",                   icon:Rocket,   color:"from-red-600 to-rose-600",      deliverables:["Market Analysis","Business Model","Product Launch","Industry Partnerships"] },
];

const TOOLS = [
  { category:"AI/ML",        icon:Brain,    tools:["TensorFlow","PyTorch","Scikit-learn","OpenCV","Keras","Pandas","Hugging Face","JAX"] },
  { category:"IoT",          icon:Network,  tools:["Arduino","Raspberry Pi","ESP32","Node-RED","ThingSpeak","AWS IoT","MQTT","LoRaWAN"] },
  { category:"Robotics",     icon:Bot,      tools:["ROS","Gazebo","MATLAB/Simulink","V-REP","OpenRAVE","MoveIt","Webots","PyBullet"] },
  { category:"Cloud/DevOps", icon:Cloud,    tools:["AWS","Azure","Google Cloud","Kubernetes","Terraform","Jenkins","Docker","GitHub Actions"] },
  { category:"Data Science", icon:Database, tools:["Python","R","Jupyter","Tableau","Power BI","Apache Spark","Hadoop","SQL"] },
  { category:"Blockchain",   icon:Layers,   tools:["Ethereum","Hyperledger","Solana","Polkadot","Web3.js","Truffle","Hardhat","IPFS"] },
];

const OUTCOMES = [
  { icon:FileText, title:"Research Papers",  count:"50+", desc:"Published in top-tier conferences and journals",       color:"from-blue-600 to-cyan-600"    },
  { icon:Award,    title:"Patents Filed",    count:"25+", desc:"Intellectual property protection for innovations",      color:"from-purple-600 to-pink-600"  },
  { icon:Rocket,   title:"Products Launched",count:"15+", desc:"Commercial products derived from research",             color:"from-orange-600 to-red-600"   },
  { icon:Users,    title:"Industry Partners",count:"30+", desc:"Collaborations with leading companies",                 color:"from-emerald-600 to-teal-600" },
];

const ELIGIBILITY = [
  { category:"Students",     icon:GraduationCap, color:"from-blue-600 to-cyan-600",    requirements:["Passion for learning and growth","Passion for research and innovation","Basic programming knowledge","Research proposal submission"] },
  { category:"Professionals",icon:Briefcase,     color:"from-emerald-600 to-teal-600", requirements:["Relevant technical background","Commitment to research goals","Available for part-time engagement","Industry problem proposal"] },
];

const FAQS = [
  { q:"What is the selection process for R&D programs?",    a:"Selection involves application review, technical interview, and project proposal presentation. We evaluate technical skills, research aptitude, and commitment to the research area." },
  { q:"Do I get paid during the R&D program?",              a:"Yes, we provide competitive stipends for all researchers based on their qualifications and experience. Performance-based incentives are also available for exceptional contributions." },
  { q:"Can I publish research papers from the work?",       a:"Absolutely! We strongly encourage publication and provide full support for conference submissions, journal publications, and presentation opportunities." },
  { q:"What happens to intellectual property rights?",      a:"IP rights are shared between Stackenzo and researchers based on contribution levels, with clear agreements signed upfront. We follow industry-standard IP policies." },
  { q:"Is remote participation possible?",                  a:"Yes, many projects support remote work with virtual collaboration tools. However, some hardware-intensive projects may require occasional on-site presence." },
  { q:"What kind of mentorship will I receive?",            a:"Each researcher is assigned a dedicated mentor (PhD holder or industry expert) who provides weekly one-on-one guidance, technical reviews, and career advice." },
];

const MENTORSHIP_ITEMS = [
  "Daily & weekly one-on-one mentoring sessions","Access to research publications and resources",
  "Networking with industry professionals","Conference presentation opportunities",
  "Co-authorship on research papers","Career guidance",
];

const INNOVATION_ITEMS = [
  "Problem-focused research addressing industry challenges",
  "Rapid prototyping and iterative development",
  "Publication in top-tier conferences and journals",
  "Technology transfer and commercialization",
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
function StaggerContainer({ children, className = "", stagger = 0.09, from = "bottom" }) {
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
        style={{ inset:-1, background:`radial-gradient(280px circle at ${pos.x}px ${pos.y}px,${accent}28,transparent 60%)`, opacity:inV?1:0, transition:"opacity .3s" }}/>
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
function TiltCard({ children, className = "", intensity = 9 }) {
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
  const mm = e => { const r=ref.current.getBoundingClientRect(); x.set((e.clientX-r.left-r.width/2)*.35); y.set((e.clientY-r.top-r.height/2)*.35); };
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
  const inV = useInView(ref, { once:false });
  const raw = String(value).replace(/[^0-9.]/g,"");
  const num = parseFloat(raw)||0;
  const sfx = String(value).replace(/[0-9.]/g,"");
  const mv  = useMotionValue(0);
  const sp  = useSpring(mv,{stiffness:55,damping:14});
  const [d,setD] = useState(0);
  useEffect(()=>{ mv.set(inV?num:0); },[inV]);
  useEffect(()=> sp.on("change",v=>setD(Math.round(v))),[sp]);
  return <span ref={ref}>{d}{sfx}</span>;
}

/* ══════════════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════════════ */
function CustomCursor() {
  const outer=useRef(null), dot=useRef(null), trail=useRef(null);
  const pos=useRef({x:-300,y:-300}), sm=useRef({x:-300,y:-300});
  const [hov,setHov]=useState(false), [clk,setClk]=useState(false);
  useEffect(()=>{
    const mv=e=>{pos.current={x:e.clientX,y:e.clientY};};
    const md=()=>setClk(true), mu=()=>setClk(false);
    document.addEventListener("mousemove",mv); document.addEventListener("mousedown",md); document.addEventListener("mouseup",mu);
    const att=()=>{ document.querySelectorAll("a,button,[data-hover]").forEach(el=>{ el.addEventListener("mouseenter",()=>setHov(true)); el.addEventListener("mouseleave",()=>setHov(false)); }); };
    att(); const ob=new MutationObserver(att); ob.observe(document.body,{childList:true,subtree:true});
    let id;
    const loop=()=>{
      sm.current.x+=(pos.current.x-sm.current.x)*.09; sm.current.y+=(pos.current.y-sm.current.y)*.09;
      const s=clk?.65:hov?2.1:1;
      if(outer.current) outer.current.style.transform=`translate(${sm.current.x-20}px,${sm.current.y-20}px) scale(${s})`;
      if(dot.current)   dot.current.style.transform  =`translate(${pos.current.x-3}px,${pos.current.y-3}px) scale(${clk?1.9:1})`;
      if(trail.current) trail.current.style.transform=`translate(${sm.current.x-30}px,${sm.current.y-30}px) scale(${hov?1.6:.5})`;
      id=requestAnimationFrame(loop);
    };
    id=requestAnimationFrame(loop);
    return()=>{ document.removeEventListener("mousemove",mv); document.removeEventListener("mousedown",md); document.removeEventListener("mouseup",mu); ob.disconnect(); cancelAnimationFrame(id); };
  },[hov,clk]);
  return (
    <>
      <div ref={outer} className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9998] transition-[border-color,background] duration-150"
        style={{border:hov?"1.5px solid #D4AF37":"1.5px solid rgba(230,107,38,0.45)",background:hov?"rgba(212,175,55,0.07)":"transparent",willChange:"transform"}}/>
      <div ref={dot} className="fixed top-0 left-0 w-[6px] h-[6px] rounded-full pointer-events-none z-[9999] transition-colors duration-100"
        style={{background:hov?"#D4AF37":"#E66B26",willChange:"transform"}}/>
      <div ref={trail} className="fixed top-0 left-0 w-[60px] h-[60px] rounded-full pointer-events-none z-[9996] opacity-[.09]"
        style={{background:"radial-gradient(circle,#D4AF37,transparent)",willChange:"transform"}}/>
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
function NoiseCanvas({ color1="#FFD5B8", color2="#FFF4ED", opacity=0.32 }) {
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
function ParticleCanvas({ count=20, color="rgba(230,107,38,0.08)" }) {
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
        if(d<88){ ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.strokeStyle=color.replace(/[\d.]+\)$/,`${(1-d/88)*.055})`); ctx.stroke(); }
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
    <div ref={ref} className={`relative w-full overflow-hidden ${flip?"rotate-180":""}`} style={{height:52}}>
      <svg viewBox="0 0 1440 52" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <motion.path d="M0,26 C240,0 480,52 720,26 C960,0 1200,52 1440,26 L1440,52 L0,52 Z"
          fill={toBg} initial={{pathLength:0}} animate={inV?{pathLength:1}:{}} transition={{duration:1.2,ease:EASE_EXPO}}/>
        <motion.path d="M0,26 C240,0 480,52 720,26 C960,0 1200,52 1440,26"
          stroke={color} strokeWidth="1.5" fill="none"
          initial={{pathLength:0,opacity:0}} animate={inV?{pathLength:1,opacity:1}:{}} transition={{duration:1.4,ease:EASE_EXPO,delay:.15}}/>
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
const MARQUEE_ITEMS=["AI & Machine Learning","IoT","Robotics & Automation","Cybersecurity","Quantum Computing","Blockchain","Healthcare Tech","Sustainable Technology","Computer Vision","Edge AI"];
function MarqueeStrip({ dark=false }) {
  const [paused,setPaused]=useState(false);
  const items=[...MARQUEE_ITEMS,...MARQUEE_ITEMS];
  return (
    <div className={`py-4 overflow-hidden border-y ${dark?"border-white/8 bg-white/[0.03]":"border-black/5 bg-[#F7F4EF]"}`}
      onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}>
      <motion.div className="flex gap-10 whitespace-nowrap"
        animate={paused?{}:{x:["0%","-50%"]}}
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
   ROOT COMPONENT
══════════════════════════════════════════════ */
function RND() {
  const [openFaq,               setOpenFaq]               = useState(null);
  const [showApplicationModal,  setShowApplicationModal]   = useState(false);
  const [expandedGroups,        setExpandedGroups]         = useState({});

  const projects = rndData.projects;
  const projectGroups = {
    "GSIN": { title:"GSIN - Global Student Industry Network", desc:"Large-scale virtual learning ecosystem connecting students with industry", projects:projects.filter(p=>p.id==="gsin-global-student-industry-network") },
    "Virtual Projects": { title:"Virtual Projects", desc:"2D digital twins and virtual collaboration platforms", projects:projects.filter(p=>["virtual-office","virtual-industry","virtual-campus"].includes(p.id)) },
    "Stackenzo Eye Vision": { title:"Stackenzo Eye Vision", desc:"AI-powered surveillance and computer vision solutions", projects:projects.filter(p=>["ai-attendance-monitoring","ai-class-lab-assistance","stackenzo-retro-tracking","stackenzo-person-tracking-alert"].includes(p.id)) },
  };

  /* Hero parallax */
  const heroRef=useRef(null);
  const {scrollYProgress:heroP}=useScroll({target:heroRef,offset:["start start","end start"]});
  const heroY=useTransform(heroP,[0,1],[0,-110]);
  const heroO=useTransform(heroP,[0,.6],[1,0.9]);
  const heroS=useTransform(heroP,[0,1],[1,.84]);
  const bigY =useTransform(heroP,[0,1],[0,180]);
  const mx=useMotionValue(0), my=useMotionValue(0);
  const smx=useSpring(mx,{stiffness:35,damping:18}), smy=useSpring(my,{stiffness:35,damping:18});
  const b1x=useTransform(smx,[-1,1],[-26,26]), b1y=useTransform(smy,[-1,1],[-14,14]);
  const b2x=useTransform(smx,[-1,1],[20,-20]), b2y=useTransform(smy,[-1,1],[12,-12]);
  useEffect(()=>{
    const fn=e=>{mx.set((e.clientX/window.innerWidth-.5)*2); my.set((e.clientY/window.innerHeight-.5)*2);};
    window.addEventListener("mousemove",fn); return()=>window.removeEventListener("mousemove",fn);
  },[]);

  return (
    <div className="bg-white text-gray-900 min-h-screen overflow-x-hidden">
      <CustomCursor/>
      <ScrollProgressBar/>
      <SectionNavDots/>
      <Navbar/>

      {/* ═══ HERO ═══ */}
      <section id="rnd-hero" ref={heroRef}
        className="relative h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden">
        <NoiseCanvas color1="#FFD5B8" color2="#FFF0E6" opacity={0.28}/>
        <div className="absolute inset-0 z-[1]"><ParticleCanvas count={18} color="rgba(230,107,38,0.07)"/></div>

        {/* Kinetic bg */}
        <motion.div style={{y:bigY}} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-[2]">
          <span className="text-[18vw] font-black leading-none tracking-tighter uppercase whitespace-nowrap"
            style={{color:"rgba(230,107,38,0.018)"}}>RESEARCH</span>
        </motion.div>

        {/* Dot grid */}
        <div className="absolute inset-0 z-[2] opacity-[.03]"
          style={{backgroundImage:"radial-gradient(circle,#E66B26 1px,transparent 1px)",backgroundSize:"32px 32px"}}/>

        {/* Blobs */}
        <motion.div style={{x:b1x,y:b1y}} className="absolute top-16 left-[5%] w-80 h-80 pointer-events-none z-[2]">
          <div className="w-full h-full rounded-full blur-[100px] opacity-[.3]" style={{background:"radial-gradient(circle,#FFD5B8,transparent)"}}/>
        </motion.div>
        <motion.div style={{x:b2x,y:b2y}} className="absolute bottom-16 right-[5%] w-[420px] h-[420px] pointer-events-none z-[2]">
          <div className="w-full h-full rounded-full blur-[110px] opacity-[.16]" style={{background:"radial-gradient(circle,#D4AF37,transparent)"}}/>
        </motion.div>

        {/* Floating orbs */}
        <Float className="absolute top-1/4 left-[7%] w-3 h-3 rounded-full bg-[#D4AF37]/25 z-[2]" duration={5} delay={0}/>
        <Float className="absolute top-1/3 right-[9%] w-2 h-2 rounded-full bg-[#E66B26]/20 z-[2]" duration={4} delay={1}/>
        <Float className="absolute bottom-1/3 left-[12%] w-3.5 h-3.5 rounded-full bg-[#C5531A]/18 z-[2]" duration={6} delay={2}/>
        <Float className="absolute bottom-1/4 right-[14%] w-2 h-2 rounded-full bg-[#D4AF37]/18 z-[2]" duration={5.5} delay={.5}/>

        {/* Floating science emojis */}
        <Float className="absolute top-20 left-10 hidden lg:block z-[3] text-5xl opacity-40" duration={7} yRange={20} delay={0}>🧬</Float>
        <Float className="absolute top-32 right-16 hidden lg:block z-[3] text-4xl opacity-40" duration={4} yRange={15} delay={.8}>🔬</Float>
        <Float className="absolute bottom-24 left-20 hidden lg:block z-[3] text-4xl opacity-35" duration={5} yRange={18} delay={1.5}>⚛️</Float>
        <Float className="absolute bottom-20 right-24 hidden lg:block z-[3] text-5xl opacity-40" duration={6} yRange={20} delay={.4}>🧠</Float>

        <motion.div style={{y:heroY,opacity:heroO,scale:heroS}} className="max-w-6xl mx-auto text-center relative z-10">
          {/* Badge */}
          <motion.div initial={{scale:.7,opacity:0,y:20}} animate={{scale:1,opacity:1,y:0}} transition={{duration:.65,ease:EASE_BACK}}
            className="inline-flex items-center gap-2 bg-white/88 backdrop-blur-sm border border-gray-200 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 shadow-sm">
            <motion.div animate={{rotate:[0,20,-20,0]}} transition={{duration:2.8,repeat:Infinity,ease:"easeInOut"}}>
              <Microscope className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]"/>
            </motion.div>
            <span className="text-sm sm:text-base text-[#E66B26] font-semibold">Research & Development Division</span>
            <motion.div animate={{opacity:[.5,1,.5]}} transition={{duration:2,repeat:Infinity}}>
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]/70"/>
            </motion.div>
          </motion.div>

          {/* H1 */}
          <motion.h1 initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:.3,duration:.75,ease:EASE_EXPO}}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-5 leading-[1.06]">
            <span className="text-gray-900">Engineering Innovation</span>
            <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] via-[#C5531A] to-[#E66B26]">Through Applied Research</span>
          </motion.h1>

          <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.5,ease:EASE_EXPO}}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 max-w-3xl mx-auto mb-9 px-4 leading-relaxed">
            We Explore, Experiment and Engineer cutting-edge solutions that transform real-world challenges into scalable technological breakthroughs.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.72,ease:EASE_EXPO}}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-2 mb-12">
            <MagBtn onClick={()=>window.location.href="/Career"}
              className="group relative w-full sm:w-auto px-5 sm:px-7 py-2.5 sm:py-3 bg-[#E66B26] text-white rounded-full text-xs sm:text-sm font-black overflow-hidden shadow-xl shadow-[#E66B26]/22">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Apply for R&amp;D Program
                <motion.span animate={{x:[0,4,0]}} transition={{duration:1.5,repeat:Infinity}}><ArrowRight className="w-4 h-4"/></motion.span>
              </span>
              <motion.div className="absolute inset-0 bg-[#C5531A] origin-left" initial={{scaleX:0}} whileHover={{scaleX:1}} transition={{duration:.4}}/>
            </MagBtn>
            <MagBtn onClick={()=>document.getElementById("rnd-projects")?.scrollIntoView({behavior:"smooth"})}
              className="w-full sm:w-auto px-5 sm:px-7 py-2.5 sm:py-3 border-2 border-[#E66B26] text-[#E66B26] rounded-full text-xs sm:text-sm font-black hover:bg-[#E66B26] hover:text-white transition-all">
              Explore Research Projects
            </MagBtn>
          </motion.div>

          {/* Scroll cue */}
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.8}}
            className="flex justify-center cursor-pointer"
            onClick={()=>document.getElementById("rnd-stats")?.scrollIntoView({behavior:"smooth"})}>
            <Float duration={2} yRange={10}>
              <div className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-[#E66B26] transition-colors">
                <span className="text-[10px] sm:text-xs font-medium">Explore Research</span>
                <div className="w-5 h-8 border-2 border-[#E66B26]/22 rounded-full flex justify-center">
                  <motion.div className="w-1 h-2 bg-[#D4AF37] rounded-full mt-1.5"
                    animate={{y:[0,10,0],opacity:[1,.4,1]}} transition={{duration:1.8,repeat:Infinity}}/>
                </div>
              </div>
            </Float>
          </motion.div>
        </motion.div>
      </section>

      <MarqueeStrip/>

      {/* ═══ STATS ═══ */}
      <WaveDivider color="#D4AF37" toBg="#f9fafb"/>
      <section id="rnd-stats" className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-50 relative overflow-hidden">
        <NoiseCanvas color1="#FFD5B8" color2="#FFF4ED" opacity={0.2}/>
        <Spotlight color="rgba(230,107,38,0.04)" size={480}/>
        <div className="max-w-6xl mx-auto relative z-10">
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" stagger={0.11} from="bottom">
            {OUTCOMES.map((stat,i)=>{const Icon=stat.icon; return (
              <GlowCard key={i} accent="#D4AF37">
                <TiltCard>
                  <motion.div whileHover={{y:-8,boxShadow:"0 24px 55px rgba(212,175,55,0.14)"}}
                    className="bg-white p-4 sm:p-6 rounded-xl border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all text-center group shadow-sm h-full">
                    <Float duration={4+i*.5} delay={i*.3} yRange={7}>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 rounded-lg bg-emerald-50 flex items-center justify-center border border-[#D4AF37]/28 group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]"/>
                      </div>
                    </Float>
                    <div className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mb-1"><Counter value={stat.count}/></div>
                    <div className="text-xs sm:text-sm font-black text-[#E66B26] mb-1">{stat.title}</div>
                    <p className="text-[10px] sm:text-xs text-gray-500">{stat.desc}</p>
                  </motion.div>
                </TiltCard>
              </GlowCard>
            );})}
          </StaggerContainer>
        </div>
      </section>
      <WaveDivider color="#D4AF37" flip toBg="#FFF4ED"/>

      {/* ═══ RESEARCH DOMAINS ═══ */}
      <section id="rnd-domains" className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden" style={{background:"#FFF4ED"}}>
        <NoiseCanvas color1="#FFD5B8" color2="#FFCBA4" opacity={0.2}/>
        <Spotlight color="rgba(230,107,38,0.04)" size={500}/>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <motion.span className="text-[13vw] font-black leading-none tracking-tighter uppercase text-[#E66B26]/[0.018]"
            animate={{y:[0,-10,0]}} transition={{duration:10,repeat:Infinity,ease:"easeInOut"}}>DOMAINS</motion.span>
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <SLabel text="Research Domains"/>
            <AHeading className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
              Research Domains
            </AHeading>
            <Reveal from="bottom" delay={.2}>
              <div className="w-16 h-[3px] bg-[#D4AF37] mx-auto mt-4 rounded"/>
              <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto mt-4">Exploring cutting-edge technologies across multiple disciplines</p>
            </Reveal>
          </div>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5" stagger={0.07} from="bottom">
            {RESEARCH_DOMAINS.map((d,i)=>{const Icon=d.icon; return (
              <GlowCard key={i} accent="#D4AF37">
                <TiltCard intensity={8}>
                  <motion.div whileHover={{y:-8,boxShadow:"0 24px 55px rgba(212,175,55,0.12)"}}
                    className="group bg-white p-5 sm:p-6 rounded-xl border border-gray-200 hover:border-[#D4AF37] relative overflow-hidden shadow-sm transition-all h-full">
                    <div className={`absolute inset-0 bg-gradient-to-br ${d.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300`}/>
                    <Float duration={4+i*.3} delay={i*.2} yRange={7}>
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${d.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white"/>
                      </div>
                    </Float>
                    <h3 className="text-sm sm:text-base font-black text-gray-900 mb-2 group-hover:text-[#E66B26] transition-colors">{d.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 line-clamp-2">{d.desc}</p>
                    <div className="space-y-1">
                      {d.areas.slice(0,4).map((area,j)=>(
                        <div key={j} className="flex items-center gap-1 sm:gap-2">
                          <motion.div animate={{scale:[1,1.3,1]}} transition={{duration:2.2,repeat:Infinity,delay:j*.2}}>
                            <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#D4AF37] shrink-0"/>
                          </motion.div>
                          <span className="text-[10px] sm:text-xs text-gray-500">{area}</span>
                        </div>
                      ))}
                    </div>
                    <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#E66B26] rounded-b-xl"
                      initial={{scaleX:0}} whileHover={{scaleX:1}} transition={{duration:.35}}/>
                  </motion.div>
                </TiltCard>
              </GlowCard>
            );})}
          </StaggerContainer>
        </div>
      </section>
      <WaveDivider color="#D4AF37" flip toBg="#f9fafb"/>

      {/* ═══ INNOVATION SECTION ═══ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50 relative overflow-hidden">
        <Spotlight color="rgba(230,107,38,0.04)" size={480}/>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
            <Reveal from="left" className="lg:w-1/2">
              <AHeading className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A] mb-4" delay={.05}>
                Innovation Through Research
              </AHeading>
              <div className="w-16 h-[3px] bg-[#D4AF37] mb-5 rounded"/>
              <p className="text-sm sm:text-base text-gray-500 mb-6 leading-relaxed">
                Our Research & Development division focuses on cutting-edge technology solutions that address real-world challenges. We combine academic rigor with industry relevance to create impactful innovations that shape the future.
              </p>
              <StaggerContainer className="space-y-3" stagger={0.08} from="left">
                {INNOVATION_ITEMS.map((item,i)=>(
                  <div key={i} className="flex items-start gap-2.5">
                    <motion.div animate={{scale:[1,1.3,1]}} transition={{duration:2.2,repeat:Infinity,delay:i*.25}}>
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] shrink-0 mt-0.5"/>
                    </motion.div>
                    <span className="text-xs sm:text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </StaggerContainer>
            </Reveal>

            <Reveal from="right" delay={.1} className="lg:w-1/2">
              <GlowCard accent="#D4AF37">
                <TiltCard intensity={6}>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl opacity-20 group-hover:opacity-30 blur transition-all"/>
                    <div className="relative bg-white p-3 sm:p-4 rounded-2xl border border-gray-200 shadow-lg">
                      <img src="https://i.pinimg.com/originals/2a/53/65/2a53651a35816f499270d8275fd5318f.gif" alt="Research" className="w-full h-auto rounded-xl"/>
                      <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-t from-black/80 to-transparent p-3 rounded-lg">
                        <p className="text-[#D4AF37] font-black text-sm sm:text-base">Research &amp; Innovation Lab</p>
                        <p className="text-gray-300 text-xs">Pushing the boundaries of technology</p>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </GlowCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ METHODOLOGY ═══ */}
      <WaveDivider color="#D4AF37" toBg="#FFF4ED"/>
      <section className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden" style={{background:"#FFF4ED"}}>
        <NoiseCanvas color1="#FFD5B8" color2="#FFCBA4" opacity={0.18}/>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <motion.span className="text-[13vw] font-black leading-none tracking-tighter uppercase text-[#E66B26]/[0.018]"
            animate={{y:[0,-10,0]}} transition={{duration:9,repeat:Infinity,ease:"easeInOut"}}>METHODOLOGY</motion.span>
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <SLabel text="How We Research"/>
            <AHeading className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
              Research Methodology
            </AHeading>
            <Reveal from="bottom" delay={.2}>
              <div className="w-16 h-[3px] bg-[#D4AF37] mx-auto mt-4 rounded"/>
              <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto mt-4">A systematic approach to research and innovation</p>
            </Reveal>
          </div>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" stagger={0.09} from="bottom">
            {METHODOLOGY.map((s,i)=>{const Icon=s.icon; return (
              <GlowCard key={i} accent="#D4AF37">
                <TiltCard intensity={8}>
                  <motion.div whileHover={{y:-8,boxShadow:"0 24px 55px rgba(212,175,55,0.12)"}}
                    className="group bg-white p-5 sm:p-6 rounded-xl border border-gray-200 hover:border-[#D4AF37] relative overflow-hidden shadow-sm transition-all h-full">
                    <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300`}/>
                    <div className="flex items-center gap-3 mb-3 sm:mb-4">
                      <Float duration={4+i*.4} yRange={7} delay={i*.3}>
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-md`}>
                          {s.step}
                        </div>
                      </Float>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]"/>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-gray-900 mb-2">{s.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-3">{s.desc}</p>
                    <div className="space-y-1">
                      {s.deliverables.map((d,j)=>(
                        <div key={j} className="flex items-center gap-1.5">
                          <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#D4AF37] shrink-0"/>
                          <span className="text-[10px] sm:text-xs text-gray-500">{d}</span>
                        </div>
                      ))}
                    </div>
                    <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#E66B26] rounded-b-xl"
                      initial={{scaleX:0}} whileHover={{scaleX:1}} transition={{duration:.35}}/>
                  </motion.div>
                </TiltCard>
              </GlowCard>
            );})}
          </StaggerContainer>
        </div>
      </section>
      <WaveDivider color="#D4AF37" flip toBg="#f9fafb"/>

      {/* ═══ PROJECTS ACCORDION ═══ */}
      <section id="rnd-projects" className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50 relative overflow-hidden">
        <Spotlight color="rgba(230,107,38,0.04)" size={500}/>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <SLabel text="Our Research"/>
            <AHeading className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
              Research Projects
            </AHeading>
            <Reveal from="bottom" delay={.2}>
              <div className="w-16 h-[3px] bg-[#D4AF37] mx-auto mt-4 rounded"/>
              <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mt-4">Transforming real-world challenges through innovative research</p>
            </Reveal>
          </div>

          <StaggerContainer className="space-y-4" stagger={0.1} from="bottom">
            {Object.entries(projectGroups).map(([groupKey,group],gIdx)=>{
              const isExpanded=expandedGroups[groupKey];
              return (
                <GlowCard key={groupKey} accent="#D4AF37">
                  <motion.div whileHover={{boxShadow:"0 16px 50px rgba(212,175,55,0.10)"}}
                    className="bg-white rounded-2xl border border-[#D4AF37]/30 overflow-hidden shadow-sm hover:border-[#D4AF37] transition-all">
                    {/* Header */}
                    <motion.div className="p-5 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={()=>setExpandedGroups(p=>({...p,[groupKey]:!p[groupKey]}))}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <Float duration={4+gIdx} yRange={7}>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#E66B26] rounded-lg flex items-center justify-center text-white font-black text-sm shadow-md">
                              {gIdx+1}
                            </div>
                          </Float>
                          <div>
                            <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-0.5">{group.title}</h3>
                            <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">{group.desc}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4">
                          <span className="hidden sm:inline text-sm text-gray-400 font-medium">
                            {group.projects.length} {group.projects.length===1?"project":"projects"}
                          </span>
                          <motion.div animate={{rotate:isExpanded?180:0}} transition={{duration:.3}}
                            className="w-8 h-8 rounded-full bg-[#FFF0D0] flex items-center justify-center border border-[#D4AF37]">
                            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#E66B26]"/>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Expandable */}
                    <AnimatePresence>
                      {isExpanded&&(
                        <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}
                          transition={{duration:.4,ease:EASE_EXPO}} className="border-t border-gray-100">
                          <div className="p-5 sm:p-6">
                            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4" stagger={0.06} from="bottom">
                              {group.projects.map((project,pi)=>(
                                <Link key={project.id} to={`/R_AND_D/${project.id}`}>
                                  <GlowCard accent="#E66B26">
                                    <TiltCard intensity={6}>
                                      <motion.div whileHover={{y:-5,boxShadow:"0 18px 45px rgba(230,107,38,0.1)"}}
                                        className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 hover:border-[#E66B26]/40 transition-all group/p shadow-sm h-full">
                                        <div className="flex items-center justify-between mb-3">
                                          <span className="text-xs font-black text-[#E66B26] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">{project.domain}</span>
                                          <span className="text-xs text-gray-400">{project.timeline}</span>
                                        </div>
                                        <h4 className="text-base font-black text-gray-900 mb-2 group-hover/p:text-[#E66B26] transition-colors">{project.title}</h4>
                                        <p className="text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">{project.desc}</p>
                                        <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-100">
                                          <p className="text-xs text-gray-600 line-clamp-1">
                                            <span className="text-[#E66B26] font-black">Impact: </span>{project.impact}
                                          </p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                            <Users className="w-3.5 h-3.5"/><span>{project.teamSize}</span>
                                          </div>
                                          <motion.span animate={{x:[0,3,0]}} transition={{duration:1.4,repeat:Infinity}}
                                            className="text-xs text-[#E66B26] font-bold flex items-center gap-1">
                                            View Details <ChevronRight className="w-3 h-3"/>
                                          </motion.span>
                                        </div>
                                      </motion.div>
                                    </TiltCard>
                                  </GlowCard>
                                </Link>
                              ))}
                            </StaggerContainer>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </GlowCard>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══ ELIGIBILITY ═══ */}
      <WaveDivider color="#D4AF37" toBg="#FFF4ED"/>
      <section id="rnd-eligibility" className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden" style={{background:"#FFF4ED"}}>
        <NoiseCanvas color1="#FFD5B8" color2="#FFCBA4" opacity={0.18}/>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <motion.span className="text-[13vw] font-black leading-none tracking-tighter uppercase text-[#E66B26]/[0.018]"
            animate={{y:[0,-10,0]}} transition={{duration:8,repeat:Infinity,ease:"easeInOut"}}>APPLY</motion.span>
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <SLabel text="Who Can Apply"/>
            <AHeading className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
              Who Can Apply
            </AHeading>
            <Reveal from="bottom" delay={.2}>
              <div className="w-16 h-[3px] bg-[#D4AF37] mx-auto mt-4 rounded"/>
              <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto mt-4">Opportunities for students & professionals.</p>
            </Reveal>
          </div>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6" stagger={0.11} from="bottom">
            {ELIGIBILITY.map((item,i)=>{const Icon=item.icon; return (
              <GlowCard key={i} accent="#D4AF37">
                <TiltCard>
                  <motion.div whileHover={{y:-8,boxShadow:"0 24px 55px rgba(212,175,55,0.12)"}}
                    className="group bg-white p-5 sm:p-6 rounded-xl border border-gray-200 hover:border-[#D4AF37] relative overflow-hidden shadow-sm transition-all h-full">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300`}/>
                    <Float duration={4+i*.5} delay={i*.3} yRange={7}>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#E66B26] flex items-center justify-center mb-4 shadow-md">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white"/>
                      </div>
                    </Float>
                    <h3 className="text-sm sm:text-base font-black text-gray-900 mb-2">{item.category}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500 mb-3">
                    </div>
                    <div className="space-y-1.5">
                      {item.requirements.map((req,j)=>(
                        <div key={j} className="flex items-start gap-1.5">
                          <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#D4AF37] shrink-0 mt-0.5"/>
                          <span className="text-[10px] sm:text-xs text-gray-500">{req}</span>
                        </div>
                      ))}
                    </div>
                    <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#E66B26] rounded-b-xl"
                      initial={{scaleX:0}} whileHover={{scaleX:1}} transition={{duration:.35}}/>
                  </motion.div>
                </TiltCard>
              </GlowCard>
            );})}
          </StaggerContainer>
        </div>
      </section>
      <WaveDivider color="#D4AF37" flip toBg="#f9fafb"/>

      {/* ═══ MENTORSHIP ═══ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50 relative overflow-hidden">
        <Spotlight color="rgba(230,107,38,0.04)" size={480}/>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <SLabel text="Mentorship"/>
            <AHeading className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
              Mentorship & Collaboration
            </AHeading>
            <Reveal from="bottom" delay={.2}>
              <div className="w-16 h-[3px] bg-[#D4AF37] mx-auto mt-4 rounded"/>
              <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto mt-4">Guided by experts, powered by collaboration</p>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <Reveal from="left">
              <StaggerContainer className="space-y-5" stagger={0.1} from="left">
                {[
                  {icon:Users,    color:"bg-blue-50 border-blue-200",   iconCls:"text-blue-600",   title:"Industry Experts",    desc:"Guidance from seasoned professionals with decades of experience"},
                  {icon:Lightbulb,color:"bg-emerald-50 border-emerald-200",iconCls:"text-emerald-600",title:"Academic Advisors",  desc:"PhD holders and research scientists providing academic rigor"},
                  {icon:Award,    color:"bg-purple-50 border-purple-200",iconCls:"text-purple-600",  title:"Peer Learning",       desc:"Collaborative research environment with cross-domain exposure"},
                ].map((m,i)=>{const Icon=m.icon; return (
                  <div key={i} className="flex items-start gap-3 sm:gap-4">
                    <Float duration={4+i*.5} yRange={7} delay={i*.4}>
                      <div className={`w-9 h-9 sm:w-11 sm:h-11 ${m.color} rounded-lg flex items-center justify-center border shrink-0 shadow-sm`}>
                        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${m.iconCls}`}/>
                      </div>
                    </Float>
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-gray-900 mb-1">{m.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">{m.desc}</p>
                    </div>
                  </div>
                );})}
              </StaggerContainer>
            </Reveal>
            <Reveal from="right" delay={.1}>
              <GlowCard accent="#D4AF37">
                <TiltCard intensity={7}>
                  <div className="bg-emerald-50 p-5 sm:p-6 rounded-xl border border-gray-200 hover:border-[#D4AF37] shadow-sm transition-all">
                    <h3 className="text-sm sm:text-base font-black text-[#E66B26] mb-4">Collaboration Benefits</h3>
                    <StaggerContainer className="space-y-2.5" stagger={0.07} from="left">
                      {MENTORSHIP_ITEMS.map((item,i)=>(
                        <div key={i} className="flex items-center gap-2">
                          <motion.div animate={{scale:[1,1.3,1]}} transition={{duration:2.2,repeat:Infinity,delay:i*.25}}>
                            <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37] shrink-0"/>
                          </motion.div>
                          <span className="text-xs sm:text-sm text-gray-700">{item}</span>
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

      {/* ═══ FAQ ═══ */}
      <WaveDivider color="#D4AF37" toBg="#FFF4ED"/>
      <section id="rnd-faq" className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden" style={{background:"#FFF4ED"}}>
        <NoiseCanvas color1="#FFD5B8" color2="#FFCBA4" opacity={0.16}/>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <SLabel text="FAQ"/>
            <AHeading className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E66B26] to-[#C5531A]" delay={.05}>
              Frequently Asked Questions
            </AHeading>
            <Reveal from="bottom" delay={.2}>
              <div className="w-16 h-[3px] bg-[#D4AF37] mx-auto mt-4 rounded"/>
              <p className="text-sm sm:text-base text-gray-500 mt-3">Got questions about our R&amp;D program?</p>
            </Reveal>
          </div>
          <StaggerContainer className="space-y-3 sm:space-y-4" stagger={0.07} from="bottom">
            {FAQS.map((faq,i)=>(
              <GlowCard key={i} accent="#D4AF37">
                <motion.div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-[#D4AF37] transition-all shadow-sm">
                  <motion.button whileHover={{backgroundColor:"rgba(232,245,233,0.7)"}}
                    onClick={()=>setOpenFaq(openFaq===i?null:i)}
                    className="w-full p-4 sm:p-5 text-left flex justify-between items-center transition-all gap-2">
                    <h3 className="text-xs sm:text-sm font-black text-gray-900 pr-2">{faq.q}</h3>
                    <motion.div animate={{rotate:openFaq===i?180:0}} transition={{duration:.3}}>
                      <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] shrink-0"/>
                    </motion.div>
                  </motion.button>
                  <AnimatePresence>
                    {openFaq===i&&(
                      <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}
                        transition={{duration:.38,ease:EASE_EXPO}} className="overflow-hidden">
                        <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-gray-100">
                          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed pt-2">{faq.a}</p>
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
      <WaveDivider color="#D4AF37" flip toBg="#f9fafb"/>

      {/* ═══ CTA ═══ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50 relative overflow-hidden">
        <Spotlight color="rgba(230,107,38,0.03)" size={460}/>
        <div className="max-w-4xl mx-auto relative z-10">
          <Reveal from="bottom">
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[#E66B26]/85"/>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2072')] bg-cover bg-center mix-blend-overlay opacity-70"/>
              <div className="absolute inset-0"><ParticleCanvas count={12} color="rgba(212,175,55,0.09)"/></div>
              <Spotlight color="rgba(212,175,55,0.07)" size={360}/>
              {[70,120,180].map((s,i)=>(
                <Float key={i} duration={6+i*2} yRange={10} delay={i}
                  className="absolute right-10 top-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/12 pointer-events-none"
                  style={{width:s,height:s}}/>
              ))}
              <div className="relative z-10 p-6 sm:p-8 md:p-10 text-center">
                <Reveal from="top">
                  <div className="inline-flex items-center gap-2 border border-[#D4AF37]/38 rounded-full px-4 py-2 mb-6 bg-[#D4AF37]/10 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]"/>
                    <span className="text-sm text-[#D4AF37] font-bold">Collaborate on the Future</span>
                  </div>
                </Reveal>
                <Reveal from="bottom" delay={.1}>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white mb-3">Collaborate on the Future of Innovation</h2>
                </Reveal>
                <Reveal from="bottom" delay={.2}>
                  <p className="text-xs sm:text-sm md:text-base text-white/85 mb-7 max-w-2xl mx-auto">
                    Join our research initiatives and turn visionary ideas into impactful solutions.
                  </p>
                </Reveal>
                <Reveal from="bottom" delay={.32}>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                    <MagBtn onClick={()=>window.location.href="/Career"}
                      className="group relative w-full sm:w-auto px-5 sm:px-7 py-2.5 sm:py-3 bg-[#E66B26] text-white rounded-full text-xs sm:text-sm font-black overflow-hidden shadow-xl">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Apply for R&amp;D Program
                        <motion.span animate={{x:[0,4,0]}} transition={{duration:1.5,repeat:Infinity}}><ArrowRight className="w-4 h-4"/></motion.span>
                      </span>
                      <motion.div className="absolute inset-0 bg-[#C5531A] origin-left" initial={{scaleX:0}} whileHover={{scaleX:1}} transition={{duration:.4}}/>
                    </MagBtn>
                    <MagBtn onClick={()=>window.open("/research-projects","_blank")}
                      className="group w-full sm:w-auto px-5 sm:px-7 py-2.5 sm:py-3 bg-transparent border-2 border-[#D4AF37] text-white rounded-full text-sm sm:text-base font-black hover:bg-white hover:text-[#E66B26] transition-all flex items-center justify-center gap-2">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5"/>
                      Explore Research Projects
                    </MagBtn>
                  </div>
                </Reveal>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <RNDApplicationModal isOpen={showApplicationModal} onClose={()=>setShowApplicationModal(false)}/>
      <Footer/>
    </div>
  );
}

export default RND;