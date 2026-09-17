import React, { useEffect, useState } from 'react';
import { Calendar, User, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const News = () => {
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null); // holds news object for modal
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get('/api/news');
        if (res.data.success) {
          setNews(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load news:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

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
          <span className="text-gold font-bold uppercase tracking-widest text-xs">Press Releases</span>
          <h1 className="text-4xl md:text-5xl font-black text-navy-royal dark:text-white font-serif leading-tight">
            OFFICIAL NEWS & ANNOUNCEMENTS
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Read press statements, media releases, court rulings summaries, and active operational announcements from our divisions.
          </p>
        </div>

        {/* News Grid */}
        {news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <motion.div
                whileHover={{ y: -5 }}
                key={item._id}
                onClick={() => setSelectedNews(item)}
                className="bg-white dark:bg-navy-royal rounded-3xl overflow-hidden shadow-lg border border-slate-200/40 dark:border-slate-800/80 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {item.imageUrl && (
                    <div className="h-52 bg-slate-200 overflow-hidden">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="p-6 space-y-3">
                    <div className="flex items-center space-x-3 text-xs font-semibold text-slate-400">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-gold" />
                        <span>{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <User className="w-3.5 h-3.5 text-gold" />
                        <span>WHR Media</span>
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-navy-royal dark:text-white leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 dark:bg-navy-dark/40 border-t border-slate-100 dark:border-slate-800/60 text-xs font-bold text-navy-royal dark:text-white hover:text-gold transition flex items-center space-x-1">
                  <span>Read Full Article</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            No news articles posted yet.
          </div>
        )}

        {/* Detailed News Modal */}
        <AnimatePresence>
          {selectedNews && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedNews(null)}
                className="absolute inset-0 bg-navy-dark/80 backdrop-blur-sm"
              />

              {/* Modal Body */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white dark:bg-navy-royal w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedNews(null)}
                  className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-900/50 hover:bg-slate-900/70 text-white transition"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* News Banner */}
                {selectedNews.imageUrl && (
                  <div className="h-64 bg-slate-100 relative">
                    <img
                      src={selectedNews.imageUrl}
                      alt={selectedNews.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* News Details */}
                <div className="p-8 space-y-4">
                  <div className="flex items-center space-x-3 text-xs font-semibold text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-gold" />
                      <span>{new Date(selectedNews.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-gold" />
                      <span>WHR Central Secretariat</span>
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold text-navy-royal dark:text-white font-serif leading-tight">
                    {selectedNews.title}
                  </h2>
                  
                  <div className="w-16 h-1 bg-gold rounded-full"></div>

                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line pt-2 font-sans">
                    {selectedNews.content}
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default News;
