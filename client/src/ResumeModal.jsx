import { useState, useEffect, useRef } from "react";
import { X, Upload, FileText, CheckCircle, AlertCircle, Send, User, Mail, Phone, Briefcase, Clock } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

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
   STAGGER CONTAINER
══════════════════════════════════════════════ */
function StaggerForm({ children }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}>
      {children}
    </motion.div>
  );
}

function StaggerItem({ children }) {
  return (
    <motion.div
      variants={{ hidden: { y: 22, opacity: 0, filter: "blur(4px)" }, visible: { y: 0, opacity: 1, filter: "blur(0px)" } }}
      transition={{ duration: 0.55, ease: EASE_EXPO }}>
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   FIELD WRAPPER  (focus ring animation)
══════════════════════════════════════════════ */
function Field({ label, icon: Icon, required, children }) {
  return (
    <StaggerItem>
      <div>
        <label className="block text-xs sm:text-sm font-semibold mb-1.5 flex items-center gap-1.5"
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
   INPUT STYLE HELPER
══════════════════════════════════════════════ */
const inputCls = "w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-sm sm:text-base outline-none transition-all duration-300 bg-[#FFF4ED] text-[#1A1A1A] placeholder-gray-400";

function FocusInput({ as: Tag = "input", name, value, onChange, onFocus, onBlur, focused, ...rest }) {
  return (
    <div className="relative">
      <Tag name={name} value={value} onChange={onChange} onFocus={onFocus} onBlur={onBlur}
        className={inputCls}
        style={{
          borderColor: focused ? "#F04A06" : "#e5e7eb",
          boxShadow: focused ? "0 0 0 3px rgba(230,107,38,0.12)" : undefined,
        }}
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
   MAIN COMPONENT
══════════════════════════════════════════════ */
function ResumeModal({ isOpen, onClose, jobTitle = "" }) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", position: jobTitle, experience: "", message: "" });
  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null | "success" | "error"
  const [focused, setFocused] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (isOpen && jobTitle) setFormData(prev => ({ ...prev, position: jobTitle }));
  }, [isOpen, jobTitle]);

  /* lock body scroll when open */
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateFile = file => {
    if (!file) return false;
    if (file.type !== "application/pdf") { alert("Please upload a PDF file only"); return false; }
    if (file.size > 5 * 1024 * 1024) { alert("File size must be less than 5MB"); return false; }
    return true;
  };

  const handleFileChange = e => { const f = e.target.files[0]; if (validateFile(f)) setResumeFile(f); };

  const handleDrop = e => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0]; if (validateFile(f)) setResumeFile(f);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!resumeFile) { alert("Please upload your resume"); return; }
    setIsSubmitting(true); setSubmitStatus(null);
    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
    fd.append("resume", resumeFile);
    try {
      const res = await fetch("http://localhost:5000/api/resumes/submit", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setSubmitStatus("success");
        setTimeout(() => { onClose(); setFormData({ name: "", email: "", phone: "", position: "", experience: "", message: "" }); setResumeFile(null); setSubmitStatus(null); }, 2200);
      } else { setSubmitStatus("error"); }
    } catch { setSubmitStatus("error"); }
    finally { setIsSubmitting(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: .25 }}
          className="fixed inset-0 flex items-center justify-center z-50 p-3 sm:p-4"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}
          onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

          <motion.div
            initial={{ opacity: 0, scale: .88, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: .88, y: 32 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100"
            style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.18)" }}>

            {/* ── Header ── */}
            <div className="sticky top-0 z-10 rounded-t-2xl sm:rounded-t-3xl overflow-hidden">
              <div className="relative px-5 sm:px-7 py-4 sm:py-5 flex items-center justify-between"
                style={{ background: "linear-gradient(135deg,#F04A06,#C5531A)" }}>
                {/* dot pattern */}
                <div className="absolute inset-0 opacity-[.07]"
                  style={{ backgroundImage: "radial-gradient(circle at 2px 2px,rgba(255,255,255,0.5) 1px,transparent 0)", backgroundSize: "22px 22px" }} />
                {/* floating orb */}
                <Float className="absolute right-16 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-white/15 pointer-events-none" duration={5} yRange={6} />

                <div className="relative z-10 flex items-center gap-3">
                  <Float duration={4} yRange={6}>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/25">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                  </Float>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-white leading-tight">Submit Your Resume</h2>
                    {jobTitle && <p className="text-white/75 text-xs mt-0.5">for {jobTitle}</p>}
                  </div>
                </div>

                <motion.button onClick={onClose} whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: .9 }}
                  className="relative z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors border border-white/20">
                  <X className="w-4 h-4 text-white" />
                </motion.button>
              </div>

              {/* gold accent bar */}
              <motion.div className="h-[3px] w-full origin-left" style={{ background: "linear-gradient(90deg,#D4AF37,#F04A06,#D4AF37)" }}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: .7, ease: EASE_EXPO, delay: .15 }} />
            </div>

            {/* ── Form ── */}
            <div className="px-5 sm:px-7 py-5 sm:py-6">
              <form onSubmit={handleSubmit}>
                <StaggerForm>

                  {/* Name */}
                  <StaggerItem>
                    <Field label="Full Name" icon={User} required>
                      <FocusInput type="text" name="name" value={formData.name} onChange={handleChange}
                        required placeholder="John Doe"
                        focused={focused === "name"}
                        onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} />
                    </Field>
                  </StaggerItem>

                  {/* Email + Phone */}
                  <StaggerItem>
                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                      <Field label="Email" icon={Mail} required>
                        <FocusInput type="email" name="email" value={formData.email} onChange={handleChange}
                          required placeholder="john@example.com"
                          focused={focused === "email"}
                          onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} />
                      </Field>
                      <Field label="Phone" icon={Phone} required>
                        <FocusInput type="tel" name="phone" value={formData.phone} onChange={handleChange}
                          required placeholder="+91 9876543210"
                          focused={focused === "phone"}
                          onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)} />
                      </Field>
                    </div>
                  </StaggerItem>

                  {/* Position + Experience */}
                  <StaggerItem>
                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                      <Field label="Position Interested In" icon={Briefcase}>
                        <FocusInput type="text" name="position" value={formData.position} onChange={handleChange}
                          placeholder="e.g., Full Stack Developer"
                          focused={focused === "position"}
                          onFocus={() => setFocused("position")} onBlur={() => setFocused(null)} />
                      </Field>
                      <Field label="Total Experience" icon={Clock}>
                        <div className="relative">
                          <select name="experience" value={formData.experience} onChange={handleChange}
                            onFocus={() => setFocused("experience")} onBlur={() => setFocused(null)}
                            className={inputCls}
                            style={{ borderColor: focused === "experience" ? "#F04A06" : "#e5e7eb", boxShadow: focused === "experience" ? "0 0 0 3px rgba(230,107,38,0.12)" : undefined }}>
                            <option value="">Select Experience</option>
                            <option value="Fresher">Fresher</option>
                            <option value="0-1 years">0–1 years</option>
                            <option value="1-3 years">1–3 years</option>
                            <option value="3-5 years">3–5 years</option>
                            <option value="5-10 years">5–10 years</option>
                            <option value="10+ years">10+ years</option>
                          </select>
                          <AnimatePresence>
                            {focused === "experience" && (
                              <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                style={{ boxShadow: "0 0 0 2px rgba(212,175,55,0.4)", borderRadius: 12 }} />
                            )}
                          </AnimatePresence>
                        </div>
                      </Field>
                    </div>
                  </StaggerItem>

                  {/* File upload */}
                  <StaggerItem>
                    <div className="mt-4">
                      <label className="block text-xs sm:text-sm font-semibold mb-1.5 flex items-center gap-1.5"
                        style={{ color: "#1A1A1A" }}>
                        <Upload className="w-3.5 h-3.5" style={{ color: "#F04A06" }} />
                        Upload Resume (PDF only)
                        <span style={{ color: "#D4AF37" }}>*</span>
                      </label>
                      <input type="file" accept=".pdf" onChange={handleFileChange} required className="hidden" id="resume-upload" />
                      <motion.label htmlFor="resume-upload"
                        animate={{ borderColor: dragOver ? "#F04A06" : resumeFile ? "#D4AF37" : "#e5e7eb", background: dragOver ? "rgba(230,107,38,0.06)" : resumeFile ? "rgba(212,175,55,0.06)" : "#FFF4ED" }}
                        transition={{ duration: .2 }}
                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        className="flex flex-col items-center justify-center w-full px-4 py-5 sm:py-6 rounded-xl border-2 border-dashed cursor-pointer transition-all">
                        {resumeFile ? (
                          <motion.div initial={{ scale: .9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
                              style={{ background: "linear-gradient(135deg,#F04A06,#C5531A)" }}>
                              <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold" style={{ color: "#F04A06" }}>{resumeFile.name}</p>
                              <p className="text-xs text-gray-400">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB • PDF</p>
                            </div>
                            <motion.div whileHover={{ scale: 1.1 }}
                              onClick={e => { e.preventDefault(); setResumeFile(null); }}
                              className="ml-2 w-6 h-6 rounded-full bg-gray-100 hover:bg-red-50 flex items-center justify-center transition-colors">
                              <X className="w-3 h-3 text-gray-400 hover:text-red-400" />
                            </motion.div>
                          </motion.div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-center">
                            <motion.div animate={{ y: dragOver ? -4 : 0 }} transition={{ duration: .2 }}
                              className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200"
                              style={{ background: "#FFF4ED" }}>
                              <Upload className="w-5 h-5" style={{ color: "#F04A06" }} />
                            </motion.div>
                            <div>
                              <p className="text-sm font-semibold" style={{ color: "#1A1A1A" }}>
                                {dragOver ? "Drop your file here" : "Click to upload or drag & drop"}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">PDF only · Max 5 MB</p>
                            </div>
                          </div>
                        )}
                      </motion.label>
                    </div>
                  </StaggerItem>

                  {/* Message */}
                  <StaggerItem>
                    <div className="mt-4">
                      <Field label="Additional Message" icon={null}>
                        <div className="relative">
                          <textarea name="message" value={formData.message} onChange={handleChange}
                            onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
                            rows="3" placeholder="Tell us why you'd be a great fit…"
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
                  </StaggerItem>

                  {/* Status messages */}
                  <AnimatePresence>
                    {submitStatus === "success" && (
                      <motion.div initial={{ opacity: 0, y: 10, scale: .95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: .95 }}
                        className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl border"
                        style={{ background: "rgba(212,175,55,0.1)", borderColor: "rgba(212,175,55,0.4)" }}>
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: .5 }}>
                          <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                        </motion.div>
                        <p className="text-sm font-semibold" style={{ color: "#F04A06" }}>
                          Resume submitted! We'll contact you soon.
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
                    <div className="flex gap-3 mt-5 sm:mt-6 pb-1">
                      <MagBtn type="submit" disabled={isSubmitting}
                        className="flex-1 relative overflow-hidden py-3 sm:py-3.5 rounded-xl font-black text-sm sm:text-base text-black transition-all shadow-md hover:shadow-lg disabled:opacity-55 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
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
                              Submit Resume
                            </>
                          )}
                        </span>
                        {/* hover shimmer */}
                        <motion.div className="absolute inset-0 bg-[#C5531A] origin-left"
                          initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: .35 }} />
                      </MagBtn>

                      <MagBtn type="button" onClick={onClose}
                        className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-black text-sm border border-gray-200 text-[#1A1A1A] hover:border-[#F04A06] hover:text-[#F04A06] transition-all bg-white">
                        Cancel
                      </MagBtn>
                    </div>
                  </StaggerItem>

                </StaggerForm>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ResumeModal;