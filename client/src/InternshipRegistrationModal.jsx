import { useState, useRef, useEffect } from "react";
import { X, Briefcase, User, Mail, Phone, GraduationCap, BookOpen, Send, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import toast from "react-hot-toast";

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
      onMouseMove={e => { if (!disabled && ref.current) { const r = ref.current.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * .32); y.set((e.clientY - r.top - r.height / 2) * .32); } }}
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
   STAGGER FORM
══════════════════════════════════════════════ */
function StaggerForm({ children }) {
  return (
    <motion.div initial="hidden" animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}>
      {children}
    </motion.div>
  );
}
function StaggerItem({ children }) {
  return (
    <motion.div
      variants={{ hidden: { y: 20, opacity: 0, filter: "blur(4px)" }, visible: { y: 0, opacity: 1, filter: "blur(0px)" } }}
      transition={{ duration: 0.55, ease: EASE_EXPO }}>
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   FOCUS INPUT
══════════════════════════════════════════════ */
const inputCls = "w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-sm outline-none transition-all duration-300 bg-[#FFF4ED] text-[#1A1A1A] placeholder-gray-400";

function FocusInput({ as: Tag = "input", focused, ...rest }) {
  return (
    <div className="relative">
      <Tag className={inputCls}
        style={{ borderColor: focused ? "#F04A06" : "#e5e7eb", boxShadow: focused ? "0 0 0 3px rgba(230,107,38,0.12)" : undefined }}
        {...rest} />
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
   FIELD
══════════════════════════════════════════════ */
function Field({ label, icon: Icon, required, children }) {
  return (
    <StaggerItem>
      <div>
        <label className="flex text-xs sm:text-sm font-semibold mb-1.5 items-center gap-1.5"
          style={{ color: "#1A1A1A" }}>
          {Icon && <Icon className="w-3.5 h-3.5" style={{ color: "#F04A06" }} />}
          {label}
          {required && <span style={{ color: "#D4AF37" }}>*</span>}
        </label>
        {children}
      </div>
    </StaggerItem>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
function InternshipRegistrationModal({ internship, onClose }) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", department: "", education: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);

  const ch = field => e => setFormData(p => ({ ...p, [field]: e.target.value }));
  const fo = f => () => setFocused(f);
  const bl = () => setFocused(null);

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setSubmitStatus(null);
    try {
      const res = await fetch("http://localhost:5000/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, course: internship.title, type: "internship" }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitStatus("success");
        toast.success("Internship application submitted successfully!");
        setTimeout(onClose, 2000);
      } else {
        setSubmitStatus("error");
        toast.error(data.message || "Application failed");
      }
    } catch {
      setSubmitStatus("error");
      toast.error("Failed to submit application");
    } finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: .25 }}
        className="fixed inset-0 flex items-center justify-center z-50 p-3 sm:p-4"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

        <motion.div
          initial={{ opacity: 0, scale: .88, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: .88, y: 30 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100"
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
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                </Float>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white leading-tight">Apply for Internship</h2>
                  <p className="text-white/75 text-xs mt-0.5 line-clamp-1">{internship.title}</p>
                </div>
              </div>

              <motion.button onClick={onClose} whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: .9 }}
                className="relative z-10 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors border border-white/20">
                <X className="w-4 h-4 text-white" />
              </motion.button>
            </div>
            {/* gold bar */}
            <motion.div className="h-0.75 w-full origin-left" style={{ background: "linear-gradient(90deg,#D4AF37,#F04A06,#D4AF37)" }}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: .7, ease: EASE_EXPO, delay: .15 }} />
          </div>

          {/* ── internship info chip ── */}
          <div className="px-5 sm:px-6 pt-5">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, ease: EASE_EXPO }}
              className="flex items-center gap-3 p-3 rounded-xl border border-[#D4AF37]/30 mb-2"
              style={{ background: "linear-gradient(to right,#FFF4ED,#fff)" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg,#F04A06,#C5531A)" }}>
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-[#F04A06] truncate">{internship.title}</p>
                {internship.duration && (
                  <p className="text-[10px] text-gray-400 mt-0.5">{internship.duration} · {internship.type}</p>
                )}
              </div>
              <motion.div animate={{ opacity: [.5, 1, .5] }} transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0" />
            </motion.div>
          </div>

          {/* ── Form ── */}
          <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3">
            <form onSubmit={handleSubmit}>
              <StaggerForm>

                <Field label="Full Name" icon={User} required>
                  <FocusInput type="text" required value={formData.name}
                    onChange={ch("name")} onFocus={fo("name")} onBlur={bl}
                    focused={focused === "name"} placeholder="Your full name" />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <Field label="Email" icon={Mail} required>
                    <FocusInput type="email" required value={formData.email}
                      onChange={ch("email")} onFocus={fo("email")} onBlur={bl}
                      focused={focused === "email"} placeholder="john@example.com" />
                  </Field>
                  <Field label="Phone" icon={Phone} required>
                    <FocusInput type="tel" required value={formData.phone}
                      onChange={ch("phone")} onFocus={fo("phone")} onBlur={bl}
                      focused={focused === "phone"} placeholder="+91 9876543210" />
                  </Field>
                </div>

                <div className="mt-4">
                  <Field label="Department / Branch" icon={BookOpen}>
                    <FocusInput type="text" value={formData.department}
                      onChange={ch("department")} onFocus={fo("department")} onBlur={bl}
                      focused={focused === "department"} placeholder="e.g., CSE, ECE, Mechanical" />
                  </Field>
                </div>

                <div className="mt-4">
                  <Field label="Education Level" icon={GraduationCap} required>
                    <div className="relative">
                      <select required value={formData.education}
                        onChange={ch("education")} onFocus={fo("education")} onBlur={bl}
                        className={inputCls}
                        style={{ borderColor: focused === "education" ? "#F04A06" : "#e5e7eb", boxShadow: focused === "education" ? "0 0 0 3px rgba(230,107,38,0.12)" : undefined }}>
                        <option value="">Select level…</option>
                        <option value="undergraduate">Undergraduate</option>
                        <option value="graduate">Graduate</option>
                        <option value="postgraduate">Postgraduate</option>
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

                <div className="mt-4">
                  <Field label="Why do you want this internship?" icon={null} required>
                    <div className="relative">
                      <textarea required value={formData.message}
                        onChange={ch("message")} onFocus={fo("message")} onBlur={bl}
                        rows="3" placeholder="Tell us about your interest and goals…"
                        className={inputCls + " resize-none"}
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
                        Application submitted! We'll be in touch soon.
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

                {/* Action buttons */}
                <StaggerItem>
                  <div className="flex gap-3 mt-5 pb-1">
                    <MagBtn type="submit" disabled={loading}
                      className="flex-1 relative overflow-hidden py-3 rounded-xl font-black text-sm text-black transition-all shadow-md hover:shadow-lg disabled:opacity-55 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{ background: "linear-gradient(135deg,#F04A06,#C5531A)" }}>
                      <span className="relative z-10 flex items-center gap-2">
                        {loading ? (
                          <>
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: .9, ease: "linear" }}
                              className="w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                            Submitting…
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Apply Now
                          </>
                        )}
                      </span>
                      <motion.div className="absolute inset-0 bg-[#C5531A] origin-left"
                        initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: .35 }} />
                    </MagBtn>

                    <MagBtn type="button" onClick={onClose}
                      className="px-5 py-3 rounded-xl font-black text-sm border border-gray-200 text-[#1A1A1A] hover:border-[#F04A06] hover:text-[#F04A06] transition-all bg-white">
                      Cancel
                    </MagBtn>
                  </div>
                </StaggerItem>

              </StaggerForm>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default InternshipRegistrationModal;