import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIdx, setSelectedIdx] = useState(null); // lightbox index
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Social Service', 'Awareness Programs', 'Meetings', 'Events'];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get('/api/gallery');
        if (res.data.success) {
          setItems(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter(item => item.category === selectedCategory);

  const openLightbox = (idx) => {
    setSelectedIdx(idx);
    document.body.classList.add('lightbox-open');
  };

  const closeLightbox = () => {
    setSelectedIdx(null);
    document.body.classList.remove('lightbox-open');
  };

  const navigateLightbox = (direction) => {
    if (selectedIdx === null) return;
    let nextIdx = selectedIdx + direction;
    if (nextIdx < 0) nextIdx = filteredItems.length - 1;
    if (nextIdx >= filteredItems.length) nextIdx = 0;
    setSelectedIdx(nextIdx);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-navy-dark">
        <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 dark:bg-navy-dark/10 py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-gold font-bold uppercase tracking-widest text-xs">Visual Documentation</span>
          <h1 className="text-4xl md:text-5xl font-black text-navy-royal dark:text-white font-serif leading-tight">
            PHOTO GALLERY
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Browse through photographs of our historical meetings, awareness camps, award ceremonies, and community social programs.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-gold border-gold text-navy-dark shadow-md'
                  : 'bg-white dark:bg-navy-royal border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-gold hover:text-gold'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={item._id}
                onClick={() => openLightbox(index)}
                className="group relative h-80 rounded-3xl overflow-hidden shadow-md cursor-pointer border border-slate-200/50 dark:border-slate-800/80 hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Overlay details */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gold font-bold uppercase tracking-widest">{item.category}</span>
                    <ZoomIn className="w-5 h-5 text-white/80" />
                  </div>
                  <h3 className="text-white text-lg font-bold mt-1.5">{item.title || 'Social Drive'}</h3>
                  <p className="text-slate-300 text-xs mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            No images uploaded under this category yet.
          </div>
        )}

        {/* Custom Lightbox */}
        <AnimatePresence>
          {selectedIdx !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeLightbox}
                className="absolute inset-0 bg-navy-dark/95 backdrop-blur-sm"
              />

              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-950 text-white hover:text-rose-400 transition shadow-lg"
                aria-label="Close Lightbox"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Left */}
              <button
                onClick={() => navigateLightbox(-1)}
                className="absolute left-4 md:left-8 z-50 p-3 rounded-full bg-slate-900/60 hover:bg-slate-950 text-white hover:text-gold transition shadow-lg"
                aria-label="Previous Image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Image & Description Container */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative z-10 w-full max-w-4xl max-h-[85vh] flex flex-col justify-center items-center"
              >
                <img
                  src={filteredItems[selectedIdx].imageUrl}
                  alt={filteredItems[selectedIdx].title}
                  className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl"
                />

                <div className="mt-4 text-center max-w-xl px-4 text-white">
                  <span className="text-[10px] text-gold font-bold uppercase tracking-widest block mb-1">
                    {filteredItems[selectedIdx].category}
                  </span>
                  <h3 className="text-xl font-bold font-serif">{filteredItems[selectedIdx].title || 'Social Activity'}</h3>
                  {filteredItems[selectedIdx].description && (
                    <p className="text-slate-300 text-xs mt-1">{filteredItems[selectedIdx].description}</p>
                  )}
                </div>
              </motion.div>

              {/* Navigation Right */}
              <button
                onClick={() => navigateLightbox(1)}
                className="absolute right-4 md:right-8 z-50 p-3 rounded-full bg-slate-900/60 hover:bg-slate-950 text-white hover:text-gold transition shadow-lg"
                aria-label="Next Image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Gallery;
