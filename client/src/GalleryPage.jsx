import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

// ── Static gallery data ──────────────────────────────────────────────────────
const GALLERY_DATA = [
  { id: 1,  category: "Education",         image: "/images/generated-image.png"    },
  { id: 2,  category: "Events",            image: "/images/light house.jpg"  },
  { id: 3,  category: "Digital Marketing", image: "/images/website1.png"     },
  { id: 4,  category: "Robotics",          image: "/images/robotics workshop.jpg"  },
  { id: 5,  category: "Education",         image: "/images/edu2.jpg"    },
  { id: 6,  category: "Digital Marketing", image: "/images/stackenzo logo image.jpeg"},
  { id: 7,  category: "Digital Marketing", image: "/images/Stackenzo small Logo.jpeg"},
];

const CATEGORIES = ["All", "Education", "Events", "Digital Marketing", "Robotics"];

// ── Helper: derive a readable title from the image filename ──────────────────
function titleFromPath(src) {
  const filename = src.split("/").pop() ?? "";
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

// ── Filter Button ────────────────────────────────────────────────────────────
function FilterButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        relative px-5 py-2 rounded-full text-sm font-semibold
        transition-all duration-300 ease-in-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F04A06] focus-visible:ring-offset-2
        ${
          active
            ? "bg-[#F04A06] text-white shadow-lg shadow-[#F04A06]/30 scale-105"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
        }
      `}
    >
      {active && (
        <motion.span
          layoutId="activeFilterPill"
          className="absolute inset-0 rounded-full bg-[#F04A06] -z-10"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      {label}
    </button>
  );
}

// ── Image Card ───────────────────────────────────────────────────────────────
function GalleryCard({ item }) {
  const title = titleFromPath(item.image);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: -10 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl
                 border border-gray-100 bg-white
                 transition-shadow duration-300"
    >
      {/* Image */}
      <div className="overflow-hidden">
        <img
          src={item.image}
          alt={title}
          className="w-full h-52 sm:h-56 object-cover
                     group-hover:scale-110 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/600x400/FFF4ED/E66B26?text=${encodeURIComponent(item.category)}`;
          }}
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#F04A06]/80 via-transparent to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Info (slides up on hover) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white
                      translate-y-full group-hover:translate-y-0
                      transition-transform duration-300 ease-out">
        <h3 className="text-base font-bold leading-tight">{title}</h3>
        <span className="text-xs text-orange-100 mt-0.5 inline-block">{item.category}</span>
      </div>

      {/* Category badge */}
      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm
                       text-[#F04A06] text-xs font-semibold px-3 py-1 rounded-full
                       shadow-sm border border-orange-100
                       opacity-0 group-hover:opacity-100
                       transition-opacity duration-300">
        {item.category}
      </span>
    </motion.div>
  );
}

// ── Gallery Page ─────────────────────────────────────────────────────────────
function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? GALLERY_DATA
      : GALLERY_DATA.filter((item) => item.category === activeCategory);

  return (
    <div className="bg-white text-[#1A1A1A] min-h-screen">
      <Navbar />

      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-[#FFF4ED] to-white relative overflow-hidden min-h-screen">
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #F04A06 1px, transparent 0)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">

          {/* ── Heading ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center pt-10 pb-16 px-4 sm:px-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3
                           bg-gradient-to-r from-[#F04A06] to-[#F04A06]
                           text-transparent bg-clip-text">
              Our Gallery
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto text-base sm:text-lg">
              Explore our world of innovation, collaboration, and technological excellence
            </p>
          </motion.div>

          {/* ── Filter Buttons ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {CATEGORIES.map((cat) => (
              <FilterButton
                key={cat}
                label={cat}
                active={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              />
            ))}
          </motion.div>

          {/* ── Result count ── */}
          <motion.p
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-[#D4AF37] mb-8"
          >
            {filtered.length} {filtered.length === 1 ? "image" : "images"} in&nbsp;
            <span className="font-semibold">{activeCategory}</span>
          </motion.p>

          {/* ── Grid ── */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((item) => (
                <GalleryCard key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* ── Empty state ── */}
          <AnimatePresence>
            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-24"
              >
                <div className="text-6xl mb-4">📷</div>
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">No Images Found</h3>
                <p className="text-gray-500">
                  No images available for&nbsp;
                  <span className="text-[#F04A06] font-semibold">{activeCategory}</span>.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      <Footer />
    </div>
  );
}

export default GalleryPage;