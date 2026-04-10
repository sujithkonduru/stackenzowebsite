import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { X, User, Mail, Phone, BookOpen, GraduationCap, MessageSquare, Send, CheckCircle, AlertCircle, Layers } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Toast from "./Toast";

/* ══════════════════════════════════════════════
   EASING
══════════════════════════════════════════════ */
const EASE_EXPO = [0.16, 1, 0.3, 1];
const EASE_BACK = [0.34, 1.56, 0.64, 1];

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
      onMouseMove={e => { if (!disabled && ref.current) { const r = ref.current.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * .3); y.set((e.clientY - r.top - r.height / 2) * .3); } }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileTap={{ scale: .95 }} onClick={onClick} className={className}>
      {children}
    </motion.button>
  );
}

/* ══════════════════════════════════════════════
   FLOAT
══════════════════════════════════════════════ */
function Float({ children, className = "", duration = 4, yRange = 8, delay = 0 }) {
  return (
    <motion.div className={className}
      animate={{ y: [-yRange / 2, yRange / 2, -yRange / 2] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}>
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   STAGGER FORM / ITEM
══════════════════════════════════════════════ */
function StaggerForm({ children }) {
  return (
    <motion.div initial="hidden" animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.065 } } }}>
      {children}
    </motion.div>
  );
}
function SI({ children }) { // StaggerItem shorthand
  return (
    <motion.div
      variants={{ hidden: { y: 20, opacity: 0, filter: "blur(4px)" }, visible: { y: 0, opacity: 1, filter: "blur(0px)" } }}
      transition={{ duration: 0.55, ease: EASE_EXPO }}>
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   INPUT STYLE
══════════════════════════════════════════════ */
const inputCls = "w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-sm outline-none transition-all duration-300 bg-[#FFF4ED] text-[#1A1A1A] placeholder-gray-400";

/* ══════════════════════════════════════════════
   FOCUS INPUT
══════════════════════════════════════════════ */
function FocusInput({ as: Tag = "input", focused, children, ...rest }) {
  return (
    <div className="relative">
      {children
        ? <Tag className={inputCls}
            style={{ borderColor: focused ? "#F04A06" : "#e5e7eb", boxShadow: focused ? "0 0 0 3px rgba(230,107,38,0.12)" : undefined }}
            {...rest}>{children}</Tag>
        : <Tag className={inputCls}
            style={{ borderColor: focused ? "#F04A06" : "#e5e7eb", boxShadow: focused ? "0 0 0 3px rgba(230,107,38,0.12)" : undefined }}
            {...rest} />
      }
      <AnimatePresence>
        {focused && (
          <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ boxShadow: "0 0 0 2px rgba(212,175,55,0.4)", borderRadius: 12 }} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════
   FIELD LABEL WRAPPER
══════════════════════════════════════════════ */
function Field({ label, icon: Icon, required, children }) {
  return (
    <SI>
      <div>
        <label className="block text-xs sm:text-sm font-semibold mb-1.5 flex items-center gap-1.5"
          style={{ color: "#1A1A1A" }}>
          {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#F04A06" }} />}
          {label}
          {required && <span style={{ color: "#D4AF37" }}>*</span>}
        </label>
        {children}
      </div>
    </SI>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
function EnrollmentModal({ isOpen, onClose, title = "Enrollment Form", type = "enrollment", workshopTitle = "", department = "" }) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", course: "", education: "", message: "", department: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [focused, setFocused] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    if (workshopTitle || department) {
      setFormData(prev => ({ ...prev, course: workshopTitle || prev.course, department: department || prev.department }));
    }
  }, [workshopTitle, department]);

  /* lock body scroll */
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const fo = f => () => setFocused(f);
  const bl = () => setFocused(null);
  const ch = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true); setSubmitStatus(null);
    try {
      const res = await fetch("http://localhost:5000/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type, department: formData.department }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitStatus("success");
        setToast({ show: true, message: "Thank you! We'll contact you within 24 hours." });
        setTimeout(() => {
          onClose();
          setFormData({ name: "", email: "", phone: "", course: "", education: "", message: "", department: "" });
          setSubmitStatus(null);
        }, 1800);
      } else {
        const msg = data.errors ? data.errors.map(e => e.msg || e.message).join(", ") : data.message || "Failed to submit. Please try again.";
        setSubmitStatus("error");
        setToast({ show: true, message: msg });
      }
    } catch {
      setSubmitStatus("error");
      setToast({ show: true, message: "Failed to submit. Please check your connection and try again." });
    } finally { setIsSubmitting(false); }
  };

  if (!isOpen) return null;

  const typeLabel = type === "internship" ? "Internship" : type === "workshop" ? "Workshop" : "Program";
  const headerIcon = type === "internship" ? Layers : BookOpen;
  const HeaderIcon = headerIcon;

  return (
    <>
      <Toast message={toast.message} isVisible={toast.show} onClose={() => setToast({ show: false, message: "" })} />

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: .25 }}
          className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}
          onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

          <motion.div
            initial={{ opacity: 0, scale: .88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: .88, y: 30 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="relative bg-white rounded-2xl sm:rounded-3xl max-w-md w-full max-h-[95vh] sm:max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100"
            style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.18)" }}>

            {/* ── Header ── */}
            <div className="sticky top-0 z-10 rounded-t-2xl sm:rounded-t-3xl overflow-hidden">
              <div className="relative px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between"
                style={{ background: "linear-gradient(135deg,#F04A06,#C5531A)" }}>
                {/* dot pattern */}
                <div className="absolute inset-0 opacity-[.07]"
                  style={{ backgroundImage: "radial-gradient(circle at 2px 2px,rgba(255,255,255,0.5) 1px,transparent 0)", backgroundSize: "22px 22px" }} />
                {/* floating ring */}
                <Float className="absolute right-14 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/15 pointer-events-none" duration={5} yRange={6} />

                <div className="relative z-10 flex items-center gap-3">
                  <Float duration={4} yRange={6}>
                    <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/25">
                      <HeaderIcon className="w-5 h-5 text-white" />
                    </div>
                  </Float>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white leading-tight">{title}</h2>
                    <p className="text-white/70 text-xs mt-0.5">{typeLabel} Registration</p>
                  </div>
                </div>

                <motion.button onClick={onClose} whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: .9 }}
                  className="relative z-10 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors border border-white/20">
                  <X className="w-4 h-4 text-white" />
                </motion.button>
              </div>
              {/* animated gold bar */}
              <motion.div className="h-[3px] w-full origin-left"
                style={{ background: "linear-gradient(90deg,#D4AF37,#F04A06,#D4AF37)" }}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: .7, ease: EASE_EXPO, delay: .15 }} />
            </div>

            {/* ── Context chip (shows program name) ── */}
            {(workshopTitle || formData.course) && (
              <div className="px-5 sm:px-6 pt-4">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, ease: EASE_EXPO }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#D4AF37]/30"
                  style={{ background: "linear-gradient(to right,#FFF4ED,#fff)" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#F04A06,#C5531A)" }}>
                    <HeaderIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-[#F04A06] truncate">{workshopTitle || formData.course}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{typeLabel} · Stackenzo</p>
                  </div>
                  <motion.div animate={{ opacity: [.5, 1, .5] }} transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-[#D4AF37] flex-shrink-0" />
                </motion.div>
              </div>
            )}

            {/* ── Form ── */}
            <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-4">
              <form onSubmit={handleSubmit}>
                <StaggerForm>

                  {/* Name */}
                  <Field label="Full Name" icon={User} required>
                    <FocusInput type="text" name="name" value={formData.name} onChange={ch}
                      required placeholder="Enter your full name"
                      focused={focused === "name"} onFocus={fo("name")} onBlur={bl} />
                  </Field>

                  {/* Email */}
                  <div className="mt-3 sm:mt-4">
                    <Field label="Email Address" icon={Mail} required>
                      <FocusInput type="email" name="email" value={formData.email} onChange={ch}
                        required placeholder="your.email@example.com"
                        focused={focused === "email"} onFocus={fo("email")} onBlur={bl} />
                    </Field>
                  </div>

                  {/* Phone */}
                  <div className="mt-3 sm:mt-4">
                    <Field label="Phone Number" icon={Phone} required>
                      <FocusInput type="tel" name="phone" value={formData.phone} onChange={ch}
                        required pattern="[0-9]{10}" placeholder="10-digit mobile number"
                        focused={focused === "phone"} onFocus={fo("phone")} onBlur={bl} />
                    </Field>
                  </div>

                  {/* Course */}
                  <div className="mt-3 sm:mt-4">
                    <Field label={type === "internship" ? "Internship Program" : "Course / Workshop"} icon={BookOpen} required>
                      <FocusInput type="text" name="course" value={formData.course} onChange={ch}
                        required placeholder={type === "internship" ? "Select internship program" : "Select course or workshop"}
                        focused={focused === "course"} onFocus={fo("course")} onBlur={bl} />
                    </Field>
                  </div>

                  {/* Department (read-only if pre-filled) */}
                  {formData.department && (
                    <div className="mt-3 sm:mt-4">
                      <SI>
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold mb-1.5 flex items-center gap-1.5"
                            style={{ color: "#1A1A1A" }}>
                            <Layers className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#F04A06" }} />
                            Department
                          </label>
                          <div className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-[#D4AF37]/40 text-sm bg-[#FFF4ED] text-[#F04A06] font-semibold cursor-not-allowed flex items-center gap-2">
                            <motion.div animate={{ opacity: [.5, 1, .5] }} transition={{ duration: 2, repeat: Infinity }}
                              className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] flex-shrink-0" />
                            {formData.department}
                          </div>
                        </div>
                      </SI>
                    </div>
                  )}

                  {/* Education */}
                  <div className="mt-3 sm:mt-4">
                    <Field label="Educational Background" icon={GraduationCap} required>
                      <div className="relative">
                        <select name="education" value={formData.education} onChange={ch} required
                          className={inputCls}
                          onFocus={fo("education")} onBlur={bl}
                          style={{ borderColor: focused === "education" ? "#F04A06" : "#e5e7eb", boxShadow: focused === "education" ? "0 0 0 3px rgba(230,107,38,0.12)" : undefined }}>
                          <option value="">Select your education level</option>
                          <option value="high-school">High School</option>
                          <option value="undergraduate">Undergraduate</option>
                          <option value="graduate">Graduate</option>
                          <option value="postgraduate">Postgraduate</option>
                          <option value="professional">Working Professional</option>
                        </select>
                        <AnimatePresence>
                          {focused === "education" && (
                            <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                              style={{ boxShadow: "0 0 0 2px rgba(212,175,55,0.4)", borderRadius: 12 }} />
                          )}
                        </AnimatePresence>
                      </div>
                    </Field>
                  </div>

                  {/* Message */}
                  <div className="mt-3 sm:mt-4">
                    <Field label="Additional Information" icon={MessageSquare}>
                      <div className="relative">
                        <textarea name="message" value={formData.message} onChange={ch}
                          rows="3" placeholder="Tell us about your goals and expectations…"
                          className={inputCls + " resize-none"}
                          onFocus={fo("message")} onBlur={bl}
                          style={{ borderColor: focused === "message" ? "#F04A06" : "#e5e7eb", boxShadow: focused === "message" ? "0 0 0 3px rgba(230,107,38,0.12)" : undefined }} />
                        <AnimatePresence>
                          {focused === "message" && (
                            <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                              style={{ boxShadow: "0 0 0 2px rgba(212,175,55,0.4)", borderRadius: 12 }} />
                          )}
                        </AnimatePresence>
                      </div>
                    </Field>
                  </div>

                  {/* Status banners */}
                  <AnimatePresence>
                    {submitStatus === "success" && (
                      <motion.div initial={{ opacity: 0, y: 10, scale: .95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: .95 }}
                        className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl border"
                        style={{ background: "rgba(212,175,55,0.1)", borderColor: "rgba(212,175,55,0.4)" }}>
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: .5 }}>
                          <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                        </motion.div>
                        <p className="text-sm font-semibold" style={{ color: "#F04A06" }}>
                          Enrollment submitted! We'll contact you within 24 hours.
                        </p>
                      </motion.div>
                    )}
                    {submitStatus === "error" && (
                      <motion.div initial={{ opacity: 0, y: 10, scale: .95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: .95 }}
                        className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl border border-red-200"
                        style={{ background: "rgba(239,68,68,0.07)" }}>
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <p className="text-sm font-semibold text-red-600">Failed to submit. Please try again.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Buttons */}
                  <SI>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-5 pb-1">
                      <MagBtn type="button" onClick={onClose}
                        className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-black text-sm border border-gray-200 text-[#1A1A1A] hover:border-[#F04A06] hover:text-[#F04A06] transition-all bg-white order-2 sm:order-1">
                        Cancel
                      </MagBtn>
                      <MagBtn type="submit" disabled={isSubmitting}
                        className="flex-1 relative overflow-hidden px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-black text-sm text-white shadow-md hover:shadow-lg disabled:opacity-55 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-1 sm:order-2"
                        style={{ background: "linear-gradient(135deg,#F04A06,#C5531A)" }}>
                        <span className="relative z-10 flex items-center gap-2">
                          {isSubmitting ? (
                            <>
                              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: .9, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                              Submitting…
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Submit
                            </>
                          )}
                        </span>
                        <motion.div className="absolute inset-0 bg-[#C5531A] origin-left"
                          initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: .35 }} />
                      </MagBtn>
                    </div>
                  </SI>

                </StaggerForm>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default EnrollmentModal;