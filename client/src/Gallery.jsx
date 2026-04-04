import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Grid,
  Layers,
  Play,
  Pause,
  X,
} from "lucide-react";
import image1 from "/images/website1.png";
import image2 from "/images/robotics workshop.jpg";

/* ─────────────────────────────────────────────
   CSS VARIABLE MAP
   :root {
     --primary:       #F04A06;
     --primary-dark:  #C5531A;
     --primary-light: #FFF4ED;
     --accent:        #D4AF37;
     --text:          #1A1A1A;
     --border:        #E5E7EB;
   }
───────────────────────────────────────────── */
const P = {
  primary:      "#F04A06",
  primaryDark:  "#C5531A",
  primaryLight: "#FFF4ED",
  accent:       "#D4AF37",
  text:         "#1A1A1A",
  border:       "#E5E7EB",
};

/* ─────────────────────────────────────────────
   EASING
───────────────────────────────────────────── */
const EASE_EXPO = [0.16, 1, 0.3, 1];

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const IMAGES = [
  {
    src: image1,
    alt: "App Development",
    title: "IT Services & Platform Development",
    category: "Software Solutions",
    tag: "Engineering",
    year: "2024",
  },
  {
    src: image2,
    alt: "Stackenzo Robotics Workshop",
    title: "Robotics Pilot Workshop",
    category: "Education & Innovation",
    tag: "EdTech",
    year: "2024",
  },
];

/* ─────────────────────────────────────────────
   REVEAL
───────────────────────────────────────────── */
function Reveal({ children, className = "", delay = 0, from = "bottom" }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: false, margin: "-40px" });

  const offsets = {
    bottom: { hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1 } },
    top:    { hidden: { y: -50, opacity: 0 }, visible: { y: 0, opacity: 1 } },
    left:   { hidden: { x: -60, opacity: 0 }, visible: { x: 0, opacity: 1 } },
    right:  { hidden: { x: 60, opacity: 0 }, visible: { x: 0, opacity: 1 } },
    scale:  { hidden: { scale: 0.8, opacity: 0 }, visible: { scale: 1, opacity: 1 } },
  };
  const { hidden, visible } = offsets[from] || offsets.bottom;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inV ? "visible" : "hidden"}
      variants={{ hidden, visible }}
      transition={{ duration: 0.65, delay, ease: EASE_EXPO }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   STAGGER
───────────────────────────────────────────── */
function Stagger({ children, className = "", stagger = 0.1, gridStyle }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: false, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={gridStyle}
      initial="hidden"
      animate={inV ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { y: 40, opacity: 0, scale: 0.96 },
                visible: { y: 0, opacity: 1, scale: 1 },
              }}
              transition={{ duration: 0.6, ease: EASE_EXPO }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   FLOAT
───────────────────────────────────────────── */
function Float({ children, duration = 4, yRange = 10, delay = 0, style = {} }) {
  return (
    <motion.div
      style={style}
      animate={{ y: [-yRange / 2, yRange / 2, -yRange / 2] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   GLOW CARD  — uses --primary orange glow
───────────────────────────────────────────── */
function GlowCard({ children, accent = P.primary, style = {} }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: false, margin: "-30px" });
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      style={{ position: "relative", borderRadius: 20, overflow: "hidden", ...style }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (r) setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={inV ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.65, ease: EASE_EXPO }}
    >
      {/* Mouse-follow radial glow */}
      <div
        style={{
          position: "absolute", inset: -1,
          background: `radial-gradient(280px circle at ${pos.x}px ${pos.y}px, ${accent}28, transparent 55%)`,
          borderRadius: 20, pointerEvents: "none", zIndex: 0,
          opacity: inV ? 1 : 0, transition: "opacity 0.3s",
        }}
      />
      {/* Pulse border */}
      <motion.div
        style={{
          position: "absolute", inset: 0, borderRadius: 20,
          pointerEvents: "none", zIndex: 0,
          boxShadow: `inset 0 0 0 1px ${accent}30`,
        }}
        animate={inV ? { opacity: [0.2, 0.55, 0.2] } : { opacity: 0 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   TILT CARD
───────────────────────────────────────────── */
function TiltCard({ children, intensity = 10 }) {
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 22 });
  const sry = useSpring(ry, { stiffness: 200, damping: 22 });

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * intensity);
        ry.set(((e.clientX - r.left) / r.width - 0.5) * intensity);
      }}
      onMouseLeave={() => { rx.set(0); ry.set(0); }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   SECTION LABEL  — uses --primary orange
───────────────────────────────────────────── */
function SLabel({ text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginBottom: 12 }}>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5 }}
        style={{ height: 1, width: 32, background: P.primary, transformOrigin: "left" }}
      />
      <span style={{
        fontWeight: 700, letterSpacing: "0.2em", fontSize: 11,
        textTransform: "uppercase", color: P.primary,
      }}>
        {text}
      </span>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5 }}
        style={{ height: 1, width: 32, background: P.primary, transformOrigin: "right" }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   LIGHTBOX
───────────────────────────────────────────── */
function Lightbox({ image, current, total, onClose, onPrev, onNext }) {
  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose, onPrev, onNext]);

  const navBtn = {
    width: 44, height: 44, borderRadius: "50%",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.22)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "white", cursor: "pointer", zIndex: 10,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.93)", backdropFilter: "blur(14px)", padding: 16,
      }}
      onClick={onClose}
    >
      {/* Close */}
      <motion.button
        initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
        onClick={onClose}
        style={{ ...navBtn, position: "absolute", top: 20, right: 20, width: 40, height: 40 }}
      >
        <X size={18} />
      </motion.button>

      {/* Prev */}
      <motion.button
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        whileHover={{ background: `${P.primary}45` }}
        style={{ ...navBtn, position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }}
      >
        <ChevronLeft size={22} />
      </motion.button>

      {/* Next */}
      <motion.button
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        whileHover={{ background: `${P.primary}45` }}
        style={{ ...navBtn, position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)" }}
      >
        <ChevronRight size={22} />
      </motion.button>

      {/* Image */}
      <motion.div
        key={current}
        initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.4, ease: EASE_EXPO }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative", maxWidth: 900, width: "100%",
          borderRadius: 18, overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <img
          src={image.src} alt={image.alt}
          style={{ width: "100%", maxHeight: "80vh", objectFit: "contain", background: "#000", display: "block" }}
        />
        {/* Info overlay */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.82), transparent)",
          padding: "24px 24px 20px",
        }}>
          <span style={{ color: P.accent, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            {image.category}
          </span>
          <h3 style={{ color: "white", fontSize: 20, fontWeight: 700, marginTop: 6, marginBottom: 0 }}>
            {image.title}
          </h3>
        </div>
      </motion.div>

      {/* Dot counter — uses --primary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, alignItems: "center" }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            borderRadius: 9999, transition: "all 0.3s",
            background: i === current ? P.primary : "rgba(255,255,255,0.3)",
            width: i === current ? 24 : 8, height: 8,
          }} />
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MAIN GALLERY
───────────────────────────────────────────── */
function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying]       = useState(true);
  const [lightboxIdx, setLightboxIdx]   = useState(null);
  const [viewMode, setViewMode]         = useState("featured");
  const intervalRef = useRef(null);

  const startInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((p) => (p + 1) % IMAGES.length);
    }, 4000);
  }, []);

  useEffect(() => {
    if (isPlaying) startInterval();
    else clearInterval(intervalRef.current);
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, startInterval]);

  const goTo   = (i) => { setCurrentIndex(i); if (isPlaying) startInterval(); };
  const goPrev = ()  => goTo((currentIndex - 1 + IMAGES.length) % IMAGES.length);
  const goNext = ()  => goTo((currentIndex + 1) % IMAGES.length);

  return (
    <>
      <section style={{ position: "relative", padding: "96px 24px", background: "#ffffff", overflow: "hidden" }}>

        {/* ── BACKGROUND DECORATIONS ── */}

        {/* Orange blob top-left  (was green) */}
        <div style={{
          position: "absolute", top: 0, left: 0, pointerEvents: "none",
          width: 320, height: 320, borderRadius: "50%",
          background: `radial-gradient(circle, ${P.primaryLight}, transparent)`,
          filter: "blur(90px)", opacity: 0.55,
        }} />

        {/* Accent gold blob bottom-right */}
        <div style={{
          position: "absolute", bottom: 0, right: 0, pointerEvents: "none",
          width: 280, height: 280, borderRadius: "50%",
          background: `radial-gradient(circle, ${P.accent}, transparent)`,
          filter: "blur(80px)", opacity: 0.18,
        }} />

        {/* Subtle orange mid-right blob */}
        <div style={{
          position: "absolute", top: "40%", right: "5%", pointerEvents: "none",
          width: 180, height: 180, borderRadius: "50%",
          background: `radial-gradient(circle, ${P.primary}, transparent)`,
          filter: "blur(70px)", opacity: 0.1,
        }} />

        {/* Dot grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none",
          backgroundImage: `radial-gradient(circle, ${P.primaryDark} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }} />

        {/* Kinetic "GALLERY" background word */}
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            userSelect: "none", overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <span style={{
            fontSize: "min(20vw, 200px)", fontWeight: 900, lineHeight: 1,
            letterSpacing: "-0.04em", textTransform: "uppercase",
            color: `${P.primary}12`, whiteSpace: "nowrap",
          }}>
            GALLERY
          </span>
        </motion.div>

        {/* Floating orbs — orange tint */}
        <Float duration={5} delay={0} yRange={12}
          style={{ position: "absolute", top: "18%", left: "6%", width: 12, height: 12, borderRadius: "50%", background: `${P.primary}44`, pointerEvents: "none" }}
        ><div /></Float>

        <Float duration={4} delay={1.2} yRange={10}
          style={{ position: "absolute", top: "38%", right: "7%", width: 8, height: 8, borderRadius: "50%", background: `${P.accent}44`, pointerEvents: "none" }}
        ><div /></Float>

        <Float duration={6} delay={2} yRange={14}
          style={{ position: "absolute", bottom: "22%", left: "14%", width: 16, height: 16, borderRadius: "50%", background: `${P.primaryDark}22`, pointerEvents: "none" }}
        ><div /></Float>

        <Float duration={5.5} delay={0.7} yRange={11}
          style={{ position: "absolute", bottom: "35%", right: "15%", width: 10, height: 10, borderRadius: "50%", background: `${P.primary}33`, pointerEvents: "none" }}
        ><div /></Float>

        {/* ── CONTENT ── */}
        <div style={{ maxWidth: 1152, margin: "0 auto", position: "relative", zIndex: 10 }}>

          {/* HEADER */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <SLabel text="Company Gallery" />

            <Reveal from="bottom" delay={0.05}>
              <h2 style={{
                fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800,
                /* --primary to --primary-dark gradient */
                background: `linear-gradient(135deg, ${P.primary} 0%, ${P.primaryDark} 100%)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text", margin: "0 0 12px", lineHeight: 1.15,
              }}>
                Our Work & Pilot Programs
              </h2>
            </Reveal>

            <Reveal from="bottom" delay={0.15}>
              <p style={{ color: `${P.text}99`, fontSize: 17, maxWidth: 560, margin: "0 auto 28px", lineHeight: 1.7 }}>
                A curated look at the projects, workshops, and innovations that define who we are.
              </p>
            </Reveal>

            {/* View mode toggle */}
            <Reveal from="bottom" delay={0.2}>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                {[
                  { mode: "featured", Icon: Layers, label: "Featured" },
                  { mode: "grid",     Icon: Grid,   label: "Grid"     },
                ].map(({ mode, Icon, label }) => (
                  <motion.button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "10px 22px", borderRadius: 9999,
                      fontSize: 13, fontWeight: 600, cursor: "pointer",
                      transition: "all 0.25s",
                      /* active: --primary bg; inactive: white with --border */
                      background: viewMode === mode
                        ? `linear-gradient(135deg, ${P.primary}, ${P.primaryDark})`
                        : "#ffffff",
                      color:  viewMode === mode ? "#ffffff" : P.text,
                      border: viewMode === mode
                        ? `1.5px solid ${P.primary}`
                        : `1.5px solid ${P.border}`,
                      boxShadow: viewMode === mode
                        ? `0 4px 18px ${P.primary}40`
                        : "none",
                    }}
                  >
                    <Icon size={15} />
                    {label}
                  </motion.button>
                ))}
              </div>
            </Reveal>
          </div>

          {/* ── VIEWS ── */}
          <AnimatePresence mode="wait">

            {/* FEATURED */}
            {viewMode === "featured" && (
              <motion.div
                key="featured"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: EASE_EXPO }}
              >
                {/* Main image card */}
                <div style={{
                  position: "relative", borderRadius: 20, overflow: "hidden",
                  border: `1px solid ${P.border}`,
                  boxShadow: `0 20px 60px ${P.primary}18`,
                }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.6, ease: EASE_EXPO }}
                      style={{ position: "relative" }}
                    >
                      <img
                        src={IMAGES[currentIndex].src}
                        alt={IMAGES[currentIndex].alt}
                        style={{
                          width: "100%",
                          height: "clamp(280px, 50vw, 520px)",
                          objectFit: "cover", display: "block",
                        }}
                      />

                      {/* Dark gradient overlay */}
                      <div style={{
                        position: "absolute", inset: 0,
                        background: `linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.08) 50%, transparent 100%)`,
                      }} />

                      {/* Slide info */}
                      <motion.div
                        key={`info-${currentIndex}`}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.2, ease: EASE_EXPO }}
                        style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 32px" }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                          {/* tag badge: --primary bg */}
                          <span style={{
                            padding: "4px 13px", borderRadius: 9999,
                            background: `${P.primary}ee`,
                            color: "#fff", fontSize: 11, fontWeight: 700,
                            letterSpacing: "0.12em", textTransform: "uppercase",
                          }}>
                            {IMAGES[currentIndex].tag}
                          </span>
                          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                            {IMAGES[currentIndex].year}
                          </span>
                        </div>
                        <h3 style={{
                          color: "#fff", fontWeight: 700, margin: 0,
                          fontSize: "clamp(18px, 2.5vw, 28px)", lineHeight: 1.25,
                        }}>
                          {IMAGES[currentIndex].title}
                        </h3>
                        <p style={{ color: "rgba(255,255,255,0.58)", fontSize: 13, marginTop: 4 }}>
                          {IMAGES[currentIndex].category}
                        </p>
                      </motion.div>

                      {/* Zoom button */}
                      <motion.button
                        onClick={() => setLightboxIdx(currentIndex)}
                        whileHover={{ scale: 1.12, background: `${P.primary}55` }}
                        style={{
                          position: "absolute", top: 16, right: 16,
                          width: 40, height: 40, borderRadius: "50%",
                          background: "rgba(255,255,255,0.13)",
                          backdropFilter: "blur(8px)",
                          border: "1px solid rgba(255,255,255,0.24)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "white", cursor: "pointer",
                        }}
                      >
                        <ZoomIn size={16} />
                      </motion.button>

                      {/* Prev arrow */}
                      <motion.button
                        onClick={goPrev}
                        whileHover={{ background: `${P.primary}40`, borderColor: `${P.primary}80` }}
                        style={{
                          position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
                          width: 44, height: 44, borderRadius: "50%",
                          background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
                          border: "1px solid rgba(255,255,255,0.22)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "white", cursor: "pointer",
                        }}
                      >
                        <ChevronLeft size={20} />
                      </motion.button>

                      {/* Next arrow */}
                      <motion.button
                        onClick={goNext}
                        whileHover={{ background: `${P.primary}40`, borderColor: `${P.primary}80` }}
                        style={{
                          position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
                          width: 44, height: 44, borderRadius: "50%",
                          background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
                          border: "1px solid rgba(255,255,255,0.22)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "white", cursor: "pointer",
                        }}
                      >
                        <ChevronRight size={20} />
                      </motion.button>
                    </motion.div>
                  </AnimatePresence>

                  {/* Auto-play progress bar — --primary */}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    height: 3, background: "rgba(255,255,255,0.12)",
                  }}>
                    {isPlaying && (
                      <motion.div
                        key={`prog-${currentIndex}`}
                        style={{ height: "100%", background: P.primary, transformOrigin: "left" }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 4, ease: "linear" }}
                      />
                    )}
                  </div>
                </div>

                {/* Controls row */}
                <div style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 20, flexWrap: "wrap", gap: 12,
                }}>
                  {/* Thumbnails */}
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {IMAGES.map((img, i) => (
                      <TiltCard key={i} intensity={7}>
                        <motion.button
                          onClick={() => goTo(i)}
                          whileHover={{ scale: 1.07, y: -4 }}
                          whileTap={{ scale: 0.96 }}
                          style={{
                            position: "relative",
                            width: 88, height: 88, borderRadius: 12,
                            overflow: "hidden", cursor: "pointer",
                            border: i === currentIndex
                              ? `2.5px solid ${P.primary}`
                              : `2px solid ${P.border}`,
                            boxShadow: i === currentIndex
                              ? `0 6px 22px ${P.primary}40`
                              : "none",
                            transition: "border 0.25s, box-shadow 0.25s",
                          }}
                        >
                          <img src={img.src} alt={img.alt}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                          {i === currentIndex && (
                            <>
                              <div style={{ position: "absolute", inset: 0, background: `${P.primary}18` }} />
                              {/* active indicator bar: --primary */}
                              <motion.div
                                layoutId="gallery-thumb-bar"
                                style={{
                                  position: "absolute", bottom: 0, left: 0, right: 0,
                                  height: 3, background: P.primary,
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                              />
                            </>
                          )}
                        </motion.button>
                      </TiltCard>
                    ))}
                  </div>

                  {/* Play/pause + counter */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 13, color: `${P.text}55`, fontFamily: "monospace" }}>
                      {String(currentIndex + 1).padStart(2, "0")} / {String(IMAGES.length).padStart(2, "0")}
                    </span>
                    <motion.button
                      onClick={() => setIsPlaying((p) => !p)}
                      whileHover={{ scale: 1.1, borderColor: P.primary, color: P.primary }}
                      whileTap={{ scale: 0.94 }}
                      style={{
                        width: 36, height: 36, borderRadius: "50%",
                        border: `1.5px solid ${P.border}`,
                        background: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color: P.primaryDark,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        transition: "border-color 0.2s, color 0.2s",
                      }}
                    >
                      {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* GRID VIEW */}
            {viewMode === "grid" && (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: EASE_EXPO }}
              >
                <Stagger
                  stagger={0.1}
                  gridStyle={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: 24,
                  }}
                >
                  {IMAGES.map((img, i) => (
                    /* GlowCard uses --primary orange glow */
                    <GlowCard key={i} accent={P.primary}>
                      <TiltCard intensity={8}>
                        <motion.div
                          whileHover={{ y: -8, boxShadow: `0 24px 55px ${P.primary}22` }}
                          onClick={() => setLightboxIdx(i)}
                          style={{
                            background: "#fff", borderRadius: 16,
                            border: `1.5px solid ${P.border}`,
                            overflow: "hidden", cursor: "pointer",
                          }}
                        >
                          {/* Image */}
                          <div style={{ position: "relative", overflow: "hidden", height: 220 }}>
                            <motion.img
                              src={img.src} alt={img.alt}
                              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                              whileHover={{ scale: 1.06 }}
                              transition={{ duration: 0.55 }}
                            />
                            {/* Zoom overlay */}
                            <motion.div
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                              style={{
                                position: "absolute", inset: 0,
                                background: `${P.primaryDark}99`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                              }}
                            >
                              <div style={{
                                width: 48, height: 48, borderRadius: "50%",
                                background: "rgba(255,255,255,0.18)",
                                backdropFilter: "blur(6px)",
                                border: "1px solid rgba(255,255,255,0.3)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "white",
                              }}>
                                <ZoomIn size={20} />
                              </div>
                            </motion.div>
                          </div>

                          {/* Card body */}
                          <div style={{ padding: "18px 20px 14px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                              {/* tag badge: --primary-light bg + --primary-dark text */}
                              <span style={{
                                padding: "3px 10px", borderRadius: 9999,
                                background: P.primaryLight, color: P.primaryDark,
                                fontSize: 11, fontWeight: 700,
                                border: `1px solid ${P.primary}44`,
                              }}>
                                {img.tag}
                              </span>
                              <span style={{ fontSize: 11, color: `${P.text}55` }}>{img.year}</span>
                            </div>
                            <h3 style={{ fontWeight: 700, fontSize: 15, color: P.text, margin: "0 0 4px", lineHeight: 1.35 }}>
                              {img.title}
                            </h3>
                            <p style={{ fontSize: 13, color: `${P.text}77`, margin: 0 }}>
                              {img.category}
                            </p>
                          </div>

                          {/* Bottom bar: --primary to --accent gradient */}
                          <motion.div
                            style={{
                              height: 3,
                              background: `linear-gradient(90deg, ${P.primary}, ${P.accent})`,
                              transformOrigin: "left",
                            }}
                            initial={{ scaleX: 0 }}
                            whileHover={{ scaleX: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        </motion.div>
                      </TiltCard>
                    </GlowCard>
                  ))}
                </Stagger>
              </motion.div>
            )}
          </AnimatePresence>

          {/* STATS STRIP */}
          <Reveal from="bottom" delay={0.1}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16, marginTop: 56,
            }}>
              {[
                { value: `${IMAGES.length}`, label: "Gallery Items" },
                { value: "2024",             label: "Active Since"  },
                { value: "100%",             label: "Real Projects" },
              ].map((s, i) => (
                <Float key={i} duration={4 + i * 0.5} delay={i * 0.3}>
                  <motion.div
                    whileHover={{
                      y: -4,
                      boxShadow: `0 10px 28px ${P.primary}22`,
                      borderColor: P.primary,
                    }}
                    style={{
                      background: "#fff",
                      border: `1.5px solid ${P.border}`,
                      borderRadius: 14, padding: "20px 12px",
                      textAlign: "center", cursor: "default",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                  >
                    {/* value: --primary */}
                    <div style={{ fontSize: 26, fontWeight: 900, color: P.primary }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: `${P.text}77`, fontWeight: 500, marginTop: 4 }}>
                      {s.label}
                    </div>
                  </motion.div>
                </Float>
              ))}
            </div>
          </Reveal>

        </div>
      </section>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox
            image={IMAGES[lightboxIdx]}
            current={lightboxIdx}
            total={IMAGES.length}
            onClose={() => setLightboxIdx(null)}
            onPrev={() => setLightboxIdx((i) => (i - 1 + IMAGES.length) % IMAGES.length)}
            onNext={() => setLightboxIdx((i) => (i + 1) % IMAGES.length)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Gallery;