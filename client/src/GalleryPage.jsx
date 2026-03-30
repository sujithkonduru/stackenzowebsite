import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Star, Quote } from "lucide-react";

function GalleryPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const imageModules = import.meta.glob('/public/images/*.{jpg,jpeg,png,gif,webp}');
        const imageList = [];
        for (const path in imageModules) {
          const module = await imageModules[path]();
          const filename = path.split('/').pop();
          const nameWithoutExt = filename.split('.')[0];
          imageList.push({
            src: `/images/${filename}`,
            alt: filename.replace(/[-_]/g, ' ').split('.')[0],
            title: nameWithoutExt.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          });
        }
        imageList.sort((a, b) => a.title.localeCompare(b.title));
        setImages(imageList);
      } catch (error) {
        console.error("Error loading images:", error);
      } finally {
        setLoading(false);
      }
    };
    loadImages();
  }, []);

  if (loading) {
    return (
      <div className="bg-white text-[#1A1A1A] min-h-screen">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#1A1A1A]">Loading gallery...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white text-[#1A1A1A] min-h-screen">
      <Navbar />

      {/* ── Gallery Section ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-[#FFF4ED] to-white relative overflow-hidden min-h-screen">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(230,107,38,0.1) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#E66B26] to-[#C5531A] text-transparent bg-clip-text">
              Our Gallery
            </h1>
            <p className="text-[#1A1A1A] max-w-2xl mx-auto text-lg">
              Explore our world of innovation, collaboration, and technological excellence
            </p>
            {images.length > 0 && (
              <p className="text-[#D4AF37] text-sm mt-2">
                {images.length} {images.length === 1 ? 'image' : 'images'} found
              </p>
            )}
          </motion.div>

          {/* Gallery Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#E66B26]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-lg font-semibold mb-1">{image.title}</h3>
                    <p className="text-sm text-[#FFF4ED]">{image.alt}</p>
                  </div>
                  <div className="absolute top-2 right-2 bg-[#D4AF37] text-white px-2 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    View
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* No Images Fallback */}
          {images.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📷</div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">No Images Found</h3>
              <p className="text-[#1A1A1A]">Add images to the /images folder to display them here</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default GalleryPage;