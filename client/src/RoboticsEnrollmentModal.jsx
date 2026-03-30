import { useState, useRef, useEffect } from "react";
import {
  motion, AnimatePresence, useMotionValue, useSpring, useInView,
} from "framer-motion";
import {
  X, User, Mail, Phone, School, Calendar, Users, Loader,
  Building, BookOpen, UsersRound, Globe, Award, Clock,
  GraduationCap, UserCheck, Briefcase, MessageSquare,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

/* ══════════════════════════════════════════════
   BRAND  (matches orange swap)
══════════════════════════════════════════════ */
const C = {
  dark:     "#E66B26",
  mid:      "#C5531A",
  gold:     "#D4AF37",
  light:    "#FFF4ED",
  tint:     "#FFD5B8",
  veryDark: "#3D1A0A",
  text:     "#1A1A1A",
  p:  (a) => `rgba(230,107,38,${a})`,
  pd: (a) => `rgba(197,83,26,${a})`,
};

const EASE_EXPO = [0.16, 1, 0.3, 1];
const EASE_BACK = [0.34, 1.56, 0.64, 1];

/* ══════════════════════════════════════════════
   MAGNETIC BUTTON
══════════════════════════════════════════════ */
function MagBtn({ children, className = "", onClick, type = "button", disabled = false, style = {} }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 16 });
  const sy = useSpring(y, { stiffness: 250, damping: 16 });
  return (
    <motion.button ref={ref} type={type} disabled={disabled} style={{ x: sx, y: sy, ...style }}
      onMouseMove={e => { if (!disabled) { const r = ref.current.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * .35); y.set((e.clientY - r.top - r.height / 2) * .35); } }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileTap={{ scale: .94 }} onClick={onClick} className={className}>
      {children}
    </motion.button>
  );
}

/* ══════════════════════════════════════════════
   GLOW CARD
══════════════════════════════════════════════ */
function GlowCard({ children, className = "", accent = C.dark }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div ref={ref} className={`relative rounded-2xl overflow-hidden ${className}`}
      onMouseMove={e => { const r = ref.current?.getBoundingClientRect(); if (r) setPos({ x: e.clientX - r.left, y: e.clientY - r.top }); }}>
      <div className="absolute pointer-events-none rounded-2xl z-0"
        style={{ inset: -1, background: `radial-gradient(280px circle at ${pos.x}px ${pos.y}px,${accent}22,transparent 60%)` }} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   FLOAT
══════════════════════════════════════════════ */
function Float({ children, className = "", duration = 4, yRange = 10, delay = 0 }) {
  return (
    <motion.div className={className}
      animate={{ y: [-yRange / 2, yRange / 2, -yRange / 2] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}>
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   NOISE CANVAS
══════════════════════════════════════════════ */
function NoiseCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); let t = 0, id;
    const draw = () => {
      const w = c.width = c.offsetWidth, h = c.height = c.offsetHeight;
      const g = ctx.createRadialGradient(w * (.3 + .2 * Math.sin(t * .35)), h * (.3 + .15 * Math.cos(t * .25)), 0, w * .5, h * .5, Math.max(w, h) * .85);
      g.addColorStop(0, C.tint + "99"); g.addColorStop(.5, C.light + "66"); g.addColorStop(1, "transparent");
      ctx.clearRect(0, 0, w, h); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); t += .007; id = requestAnimationFrame(draw);
    };
    draw(); return () => cancelAnimationFrame(id);
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: .5 }} />;
}

/* ══════════════════════════════════════════════
   STYLED INPUT
══════════════════════════════════════════════ */
function StyledInput({ icon: Icon, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <motion.div className="relative" animate={{ scale: focused ? 1.01 : 1 }} transition={{ duration: .2 }}>
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none z-10"
        style={{ color: focused ? C.dark : "rgba(255,255,255,0.35)" }} />}
      <motion.input {...props}
        onFocus={e => { setFocused(true); props.onFocus?.(e); }}
        onBlur={e => { setFocused(false); props.onBlur?.(e); }}
        className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all duration-200 bg-white/[0.06] border`}
        style={{
          borderColor: focused ? C.dark : "rgba(255,255,255,0.1)",
          boxShadow: focused ? `0 0 0 3px ${C.p(.2)}` : "none",
          background: focused ? C.p(.08) : "rgba(255,255,255,0.05)",
        }} />
    </motion.div>
  );
}

function StyledTextarea({ ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <motion.textarea {...props}
      onFocus={e => { setFocused(true); props.onFocus?.(e); }}
      onBlur={e => { setFocused(false); props.onBlur?.(e); }}
      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all duration-200 resize-none"
      style={{
        borderColor: focused ? C.dark : "rgba(255,255,255,0.1)",
        border: `1px solid ${focused ? C.dark : "rgba(255,255,255,0.1)"}`,
        boxShadow: focused ? `0 0 0 3px ${C.p(.2)}` : "none",
        background: focused ? C.p(.08) : "rgba(255,255,255,0.05)",
      }} />
  );
}

function StyledSelect({ children, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <motion.select {...props}
      onFocus={e => { setFocused(true); props.onFocus?.(e); }}
      onBlur={e => { setFocused(false); props.onBlur?.(e); }}
      className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all duration-200"
      style={{
        border: `1px solid ${focused ? C.dark : "rgba(255,255,255,0.1)"}`,
        boxShadow: focused ? `0 0 0 3px ${C.p(.2)}` : "none",
        background: focused ? C.p(.12) : "rgba(255,255,255,0.06)",
      }}>
      {children}
    </motion.select>
  );
}

/* ══════════════════════════════════════════════
   LABEL
══════════════════════════════════════════════ */
function FieldLabel({ children, accent = C.gold }) {
  return (
    <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase"
      style={{ color: accent }}>{children}</label>
  );
}

/* ══════════════════════════════════════════════
   STAGGER FIELD
══════════════════════════════════════════════ */
function StaggerField({ children, i = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * .055, ease: EASE_EXPO, duration: .55 }}>
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
function RoboticsEnrollmentModal({ isOpen, onClose }) {
  const [enrollmentType, setEnrollmentType] = useState("student");
  const [loading, setLoading] = useState(false);

  const [studentForm, setStudentForm] = useState({
    studentName: "", parentName: "", email: "", phone: "",
    studentClass: "", school: "", age: "", previousExperience: "no", message: "",
  });

  const [schoolForm, setSchoolForm] = useState({
    schoolName: "", schoolAddress: "", contactPerson: "", designation: "",
    email: "", phone: "", city: "", state: "", pincode: "",
    studentCount: "", preferredStartDate: "", message: "",
  });

  const handleStudentChange = e => setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
  const handleSchoolChange  = e => setSchoolForm({ ...schoolForm, [e.target.name]: e.target.value });

  const handleStudentSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/robotics-enrollments", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...studentForm, type: "student" }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Student enrollment submitted successfully!");
        setStudentForm({ studentName: "", parentName: "", email: "", phone: "", studentClass: "", school: "", age: "", previousExperience: "no", message: "" });
        onClose();
      } else toast.error(data.message || "Enrollment failed");
    } catch { toast.error("Failed to submit enrollment"); }
    finally { setLoading(false); }
  };

  const handleSchoolSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/school-partnerships", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(schoolForm),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("School partnership request submitted successfully!");
        setSchoolForm({ schoolName: "", schoolAddress: "", contactPerson: "", designation: "", email: "", phone: "", city: "", state: "", pincode: "", studentCount: "", preferredStartDate: "", message: "" });
        onClose();
      } else toast.error(data.message || "Request failed");
    } catch { toast.error("Failed to submit request"); }
    finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: .25 }}
          className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto"
          style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(10px)" }}
          onClick={onClose}>

          <motion.div
            initial={{ opacity: 0, scale: .88, y: 40, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: .88, y: 30, filter: "blur(6px)" }}
            transition={{ duration: .45, ease: EASE_BACK }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-2xl my-8 rounded-2xl overflow-hidden shadow-2xl border"
            style={{ border: `1px solid ${C.p(.25)}`, background: `linear-gradient(160deg,#1a0c06,#0f0804)` }}>

            {/* Noise overlay */}
            <div className="absolute inset-0 pointer-events-none z-0"><NoiseCanvas /></div>

            {/* Floating orbs inside modal */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
              <Float duration={6} yRange={18} delay={0} className="absolute -top-10 -right-10 w-40 h-40 rounded-full"
                style={{ background: `radial-gradient(circle,${C.p(.22)},transparent)`, filter: "blur(50px)" }} />
              <Float duration={8} yRange={14} delay={2} className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full"
                style={{ background: `radial-gradient(circle,${C.pd(.18)},transparent)`, filter: "blur(45px)" }} />
              {/* floating particles */}
              {[{ t: "15%", l: "5%", s: 6, c: C.gold }, { t: "60%", r: "4%", s: 5, c: C.dark }, { b: "20%", l: "8%", s: 7, c: C.pd(.6) }].map((o, i) => (
                <Float key={i} duration={4 + i} delay={i * .6}
                  className="absolute rounded-full pointer-events-none"
                  style={{ top: o.t, bottom: o.b, left: o.l, right: o.r, width: o.s, height: o.s, background: o.c, opacity: .45 }} />
              ))}
            </div>

            {/* ── HEADER ── */}
            <div className="relative z-10 p-5 sm:p-6"
              style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})`, borderBottom: `1px solid ${C.p(.3)}` }}>

              {/* kinetic bg text */}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
                <motion.span className="font-black text-[80px] leading-none tracking-tighter uppercase"
                  style={{ color: "rgba(255,255,255,0.045)", whiteSpace: "nowrap" }}
                  animate={{ x: [0, -8, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
                  ROBOTICS
                </motion.span>
              </div>

              <div className="flex items-center justify-between mb-5 relative z-10">
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: .15, ease: EASE_EXPO }}>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <Float duration={3} yRange={6}>
                      <motion.span animate={{ rotate: [0, 12, -12, 0] }} transition={{ duration: 3.5, repeat: Infinity }}>🤖</motion.span>
                    </Float>
                    Robotics Program
                  </h2>
                  <p className="text-white/65 text-xs mt-1">Choose your enrollment type</p>
                </motion.div>

                {/* close button with animated rotate */}
                <motion.button onClick={onClose} whileHover={{ scale: 1.15, rotate: 90 }} whileTap={{ scale: .9 }}
                  className="text-white/80 hover:text-white p-1.5 rounded-full transition-colors"
                  style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </div>

              {/* Enrollment type toggle */}
              <motion.div className="flex gap-2 sm:gap-3 relative z-10 p-1 rounded-xl"
                style={{ background: "rgba(0,0,0,0.25)" }}
                initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .25, ease: EASE_EXPO }}>
                {[
                  { id: "student", label: "Student Enrollment", icon: UserCheck },
                  { id: "school",  label: "School Partnership", icon: Building },
                ].map(({ id, label, icon: Icon }) => (
                  <MagBtn key={id} type="button" onClick={() => setEnrollmentType(id)}
                    className="flex-1 py-2.5 px-3 rounded-lg font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 relative overflow-hidden"
                    style={{
                      background: enrollmentType === id ? "#fff" : "transparent",
                      color: enrollmentType === id ? C.dark : "rgba(255,255,255,0.65)",
                    }}>
                    {enrollmentType === id && (
                      <motion.div layoutId="tab-bg" className="absolute inset-0 rounded-lg"
                        style={{ background: "#fff" }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                    )}
                    <Icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{label}</span>
                  </MagBtn>
                ))}
              </motion.div>
            </div>

            {/* ── FORM BODY ── */}
            <div className="relative z-10 p-5 sm:p-6 max-h-[65vh] overflow-y-auto"
              style={{ scrollbarWidth: "thin", scrollbarColor: `${C.dark} transparent` }}>

              <AnimatePresence mode="wait">
                {enrollmentType === "student" ? (
                  <motion.form key="student"
                    initial={{ opacity: 0, x: -30, filter: "blur(6px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: 30, filter: "blur(6px)" }}
                    transition={{ duration: .38, ease: EASE_EXPO }}
                    onSubmit={handleStudentSubmit} className="space-y-4">

                    {/* info banner */}
                    <StaggerField i={0}>
                      <GlowCard accent={C.dark}>
                        <motion.div className="rounded-xl p-4 flex items-start gap-3"
                          style={{ background: C.p(.12), border: `1px solid ${C.p(.28)}` }}>
                          <Float duration={3.5} yRange={6}>
                            <GraduationCap className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: C.gold }} />
                          </Float>
                          <div>
                            <p className="font-semibold text-sm" style={{ color: C.dark }}>Student Information</p>
                            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                              For Classes 6-9 · 1-3 hours/week · No exams
                            </p>
                          </div>
                        </motion.div>
                      </GlowCard>
                    </StaggerField>

                    {/* Student Name */}
                    <StaggerField i={1}>
                      <FieldLabel>Student's Name *</FieldLabel>
                      <StyledInput icon={User} type="text" name="studentName" value={studentForm.studentName}
                        onChange={handleStudentChange} required placeholder="Enter student's full name" />
                    </StaggerField>

                    {/* Parent Name */}
                    <StaggerField i={2}>
                      <FieldLabel>Parent/Guardian Name *</FieldLabel>
                      <StyledInput icon={Users} type="text" name="parentName" value={studentForm.parentName}
                        onChange={handleStudentChange} required placeholder="Enter parent/guardian name" />
                    </StaggerField>

                    {/* Email & Phone */}
                    <StaggerField i={3}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <FieldLabel>Email Address *</FieldLabel>
                          <StyledInput icon={Mail} type="email" name="email" value={studentForm.email}
                            onChange={handleStudentChange} required placeholder="parent@email.com" />
                        </div>
                        <div>
                          <FieldLabel>Phone Number *</FieldLabel>
                          <StyledInput icon={Phone} type="tel" name="phone" value={studentForm.phone}
                            onChange={handleStudentChange} required placeholder="+91 XXXXX XXXXX" />
                        </div>
                      </div>
                    </StaggerField>

                    {/* Class & Age */}
                    <StaggerField i={4}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <FieldLabel>Current Class *</FieldLabel>
                          <StyledSelect name="studentClass" value={studentForm.studentClass}
                            onChange={handleStudentChange} required>
                            <option value="" style={{ background: "#1a0c06" }}>Select Class</option>
                            {["6","7","8","9"].map(c => <option key={c} value={c} style={{ background: "#1a0c06" }}>Class {c}</option>)}
                          </StyledSelect>
                        </div>
                        <div>
                          <FieldLabel>Student's Age *</FieldLabel>
                          <StyledInput icon={Calendar} type="number" name="age" value={studentForm.age}
                            onChange={handleStudentChange} required min="10" max="16" placeholder="Age (10-16)" />
                        </div>
                      </div>
                    </StaggerField>

                    {/* School */}
                    <StaggerField i={5}>
                      <FieldLabel>School Name *</FieldLabel>
                      <StyledInput icon={School} type="text" name="school" value={studentForm.school}
                        onChange={handleStudentChange} required placeholder="Enter school name" />
                    </StaggerField>

                    {/* Previous Experience */}
                    <StaggerField i={6}>
                      <FieldLabel>Any previous robotics experience?</FieldLabel>
                      <div className="flex gap-5">
                        {["yes","no"].map(v => (
                          <motion.label key={v} className="flex items-center gap-2 cursor-pointer group" whileHover={{ x: 2 }}>
                            <div className="relative w-4 h-4">
                              <input type="radio" name="previousExperience" value={v}
                                checked={studentForm.previousExperience === v}
                                onChange={handleStudentChange}
                                className="w-4 h-4 opacity-0 absolute" />
                              <motion.div className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                                animate={{ borderColor: studentForm.previousExperience === v ? C.dark : "rgba(255,255,255,0.3)", background: studentForm.previousExperience === v ? C.p(.2) : "transparent" }}>
                                {studentForm.previousExperience === v && (
                                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-1.5 h-1.5 rounded-full"
                                    style={{ background: C.dark }} />
                                )}
                              </motion.div>
                            </div>
                            <span className="text-sm text-white/80 capitalize group-hover:text-white transition-colors">{v === "yes" ? "Yes" : "No"}</span>
                          </motion.label>
                        ))}
                      </div>
                    </StaggerField>

                    {/* Message */}
                    <StaggerField i={7}>
                      <FieldLabel>Additional Information (Optional)</FieldLabel>
                      <StyledTextarea name="message" value={studentForm.message}
                        onChange={handleStudentChange} rows="3"
                        placeholder="Any questions or special requirements?" />
                    </StaggerField>

                    {/* Buttons */}
                    <StaggerField i={8}>
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <MagBtn type="button" onClick={onClose}
                          className="flex-1 px-5 py-3 rounded-xl font-semibold text-sm transition-all"
                          style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.72)", border: "1px solid rgba(255,255,255,0.12)" }}>
                          Cancel
                        </MagBtn>
                        <MagBtn type="submit" disabled={loading}
                          className="flex-1 px-5 py-3 text-white rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg relative overflow-hidden"
                          style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})`, boxShadow: `0 6px 22px ${C.p(.32)}` }}>
                          <span className="relative z-10 flex items-center gap-2">
                            {loading ? (
                              <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />Enrolling…</>
                            ) : (
                              <><span>🚀</span><span>Enroll Now</span>
                                <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                  <ChevronRight className="w-4 h-4" />
                                </motion.div></>
                            )}
                          </span>
                          <motion.div className="absolute inset-0" initial={{ x: "100%" }} whileHover={{ x: 0 }} transition={{ duration: .35 }}
                            style={{ background: `linear-gradient(135deg,${C.mid},#9e3f12)` }} />
                        </MagBtn>
                      </div>
                    </StaggerField>
                  </motion.form>
                ) : (
                  /* ── SCHOOL FORM ── */
                  <motion.form key="school"
                    initial={{ opacity: 0, x: 30, filter: "blur(6px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -30, filter: "blur(6px)" }}
                    transition={{ duration: .38, ease: EASE_EXPO }}
                    onSubmit={handleSchoolSubmit} className="space-y-4">

                    {/* info banner */}
                    <StaggerField i={0}>
                      <GlowCard accent={C.gold}>
                        <motion.div className="rounded-xl p-4 flex items-start gap-3"
                          style={{ background: `${C.gold}14`, border: `1px solid ${C.gold}38` }}>
                          <Float duration={3.5} yRange={6}>
                            <Building className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: C.gold }} />
                          </Float>
                          <div>
                            <p className="font-semibold text-sm" style={{ color: C.gold }}>School Partnership Program</p>
                            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                              Structured curriculum · Teacher training · Complete support
                            </p>
                          </div>
                        </motion.div>
                      </GlowCard>
                    </StaggerField>

                    {/* School Name */}
                    <StaggerField i={1}>
                      <FieldLabel accent={C.gold}>School/Institution Name *</FieldLabel>
                      <StyledInput icon={Building} type="text" name="schoolName" value={schoolForm.schoolName}
                        onChange={handleSchoolChange} required placeholder="Enter school name" />
                    </StaggerField>

                    {/* School Address */}
                    <StaggerField i={2}>
                      <FieldLabel accent={C.gold}>School Address *</FieldLabel>
                      <StyledTextarea name="schoolAddress" value={schoolForm.schoolAddress}
                        onChange={handleSchoolChange} required rows="2"
                        placeholder="Complete address with landmark" />
                    </StaggerField>

                    {/* Contact Person & Designation */}
                    <StaggerField i={3}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <FieldLabel accent={C.gold}>Contact Person Name *</FieldLabel>
                          <StyledInput icon={UserCheck} type="text" name="contactPerson" value={schoolForm.contactPerson}
                            onChange={handleSchoolChange} required placeholder="Principal / Coordinator" />
                        </div>
                        <div>
                          <FieldLabel accent={C.gold}>Designation *</FieldLabel>
                          <StyledSelect name="designation" value={schoolForm.designation}
                            onChange={handleSchoolChange} required>
                            <option value="" style={{ background: "#1a0c06" }}>Select</option>
                            {["Principal","Vice Principal","Academic Coordinator","Teacher","Other"].map(o => (
                              <option key={o} value={o} style={{ background: "#1a0c06" }}>{o}</option>
                            ))}
                          </StyledSelect>
                        </div>
                      </div>
                    </StaggerField>

                    {/* Email & Phone */}
                    <StaggerField i={4}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <FieldLabel accent={C.gold}>Email Address *</FieldLabel>
                          <StyledInput icon={Mail} type="email" name="email" value={schoolForm.email}
                            onChange={handleSchoolChange} required placeholder="school@email.com" />
                        </div>
                        <div>
                          <FieldLabel accent={C.gold}>Phone Number *</FieldLabel>
                          <StyledInput icon={Phone} type="tel" name="phone" value={schoolForm.phone}
                            onChange={handleSchoolChange} required placeholder="+91 XXXXX XXXXX" />
                        </div>
                      </div>
                    </StaggerField>

                    {/* City, State, Pincode */}
                    <StaggerField i={5}>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { name: "city",    ph: "City"    },
                          { name: "state",   ph: "State"   },
                          { name: "pincode", ph: "Pincode" },
                        ].map(f => (
                          <div key={f.name}>
                            <FieldLabel accent={C.gold}>{f.ph} *</FieldLabel>
                            <StyledInput type="text" name={f.name} value={schoolForm[f.name]}
                              onChange={handleSchoolChange} required placeholder={f.ph} />
                          </div>
                        ))}
                      </div>
                    </StaggerField>

                    {/* Student Count & Start Date */}
                    <StaggerField i={6}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <FieldLabel accent={C.gold}>Approx. Student Count *</FieldLabel>
                          <StyledInput icon={UsersRound} type="number" name="studentCount" value={schoolForm.studentCount}
                            onChange={handleSchoolChange} required min="1" placeholder="Number of students" />
                        </div>
                        <div>
                          <FieldLabel accent={C.gold}>Preferred Start Date *</FieldLabel>
                          <StyledInput icon={Calendar} type="date" name="preferredStartDate" value={schoolForm.preferredStartDate}
                            onChange={handleSchoolChange} required />
                        </div>
                      </div>
                    </StaggerField>

                    {/* Message */}
                    <StaggerField i={7}>
                      <FieldLabel accent={C.gold}>Additional Requirements *</FieldLabel>
                      <StyledTextarea name="message" value={schoolForm.message}
                        onChange={handleSchoolChange} required rows="3"
                        placeholder="Tell us about your requirements, preferred schedule, etc." />
                    </StaggerField>

                    {/* Buttons */}
                    <StaggerField i={8}>
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <MagBtn type="button" onClick={onClose}
                          className="flex-1 px-5 py-3 rounded-xl font-semibold text-sm transition-all"
                          style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.72)", border: "1px solid rgba(255,255,255,0.12)" }}>
                          Cancel
                        </MagBtn>
                        <MagBtn type="submit" disabled={loading}
                          className="flex-1 px-5 py-3 text-white rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg relative overflow-hidden"
                          style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})`, boxShadow: `0 6px 22px ${C.p(.32)}` }}>
                          <span className="relative z-10 flex items-center gap-2">
                            {loading ? (
                              <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />Submitting…</>
                            ) : (
                              <><Building className="w-4 h-4" />
                                <span>Submit Partnership Request</span>
                                <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                  <ChevronRight className="w-4 h-4" />
                                </motion.div></>
                            )}
                          </span>
                          <motion.div className="absolute inset-0" initial={{ x: "100%" }} whileHover={{ x: 0 }} transition={{ duration: .35 }}
                            style={{ background: `linear-gradient(135deg,${C.mid},#9e3f12)` }} />
                        </MagBtn>
                      </div>
                    </StaggerField>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* ── FOOTER ── */}
            <div className="relative z-10 px-6 pb-5 text-center">
              <motion.div className="h-px w-full mb-4" style={{ background: `linear-gradient(90deg,transparent,${C.p(.3)},transparent)` }}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: .6, duration: .8, ease: EASE_EXPO }} />
              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.38)" }}>
                {enrollmentType === "student"
                  ? "We'll contact you within 24 hours to confirm enrollment details."
                  : "Our team will reach out to discuss partnership opportunities."}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default RoboticsEnrollmentModal;