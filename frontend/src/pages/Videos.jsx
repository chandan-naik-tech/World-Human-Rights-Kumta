import React, { useEffect, useState } from 'react';
import { Play, Calendar, ExternalLink, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Helper to extract YouTube Video ID
const getYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null); // holds selected video object
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get('/api/videos');
        if (res.data.success) {
          setVideos(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load videos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
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
          <span className="text-gold font-bold uppercase tracking-widest text-xs">Video Archive</span>
          <h1 className="text-4xl md:text-5xl font-black text-navy-royal dark:text-white font-serif leading-tight">
            ORGANIZATION VIDEOS
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Watch documentaries, rally highlights, local television coverages, and educational human rights clips directly on our platform.
          </p>
        </div>

        {/* Videos Grid */}
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((vid) => {
              const ytId = vid.type === 'youtube' ? getYouTubeId(vid.url) : null;
              const thumbnail = ytId
                ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
                : 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop';

              return (
                <motion.div
                  whileHover={{ y: -5 }}
                  key={vid._id}
                  className="bg-white dark:bg-navy-royal rounded-3xl overflow-hidden shadow-lg border border-slate-200/40 dark:border-slate-800/80 flex flex-col justify-between"
                >
                  {/* Video Thumbnail with Play Button */}
                  <div
                    onClick={() => setActiveVideo(vid)}
                    className="h-52 bg-slate-900 relative overflow-hidden group cursor-pointer"
                  >
                    <img
                      src={thumbnail}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="p-4 rounded-full bg-gold/90 text-navy-dark group-hover:scale-110 shadow-2xl transition duration-300 transform">
                        <Play className="w-6 h-6 fill-navy-dark" />
                      </div>
                    </div>
                    {/* Source tag */}
                    <div className="absolute bottom-4 left-4 px-2.5 py-1 rounded bg-black/75 text-[10px] text-gold font-bold uppercase tracking-wider">
                      {vid.type}
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
                    <div>
                      <h3
                        onClick={() => setActiveVideo(vid)}
                        className="text-lg font-bold text-navy-royal dark:text-white leading-snug hover:text-gold cursor-pointer transition line-clamp-2"
                      >
                        {vid.title}
                      </h3>
                      {vid.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                          {vid.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(vid.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                      </div>
                      
                      {/* Social/External link check */}
                      {(vid.type === 'facebook' || vid.type === 'instagram') && (
                        <a
                          href={vid.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-gold hover:text-gold-dark"
                        >
                          <span>Open Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            No video files found.
          </div>
        )}

        {/* Dynamic Video Modal Player */}
        <AnimatePresence>
          {activeVideo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveVideo(null)}
                className="absolute inset-0 bg-navy-dark/90 backdrop-blur-sm"
              />

              {/* Close Button */}
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-slate-900/65 text-white hover:text-rose-400 transition"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Player Body */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative z-10 w-full max-w-3xl bg-black rounded-2xl overflow-hidden shadow-2xl"
              >
                {activeVideo.type === 'youtube' ? (
                  <div className="aspect-video w-full">
                    <iframe
                      title={activeVideo.title}
                      src={`https://www.youtube.com/embed/${getYouTubeId(activeVideo.url)}?autoplay=1`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : activeVideo.type === 'upload' ? (
                  <div className="w-full aspect-video">
                    <video
                      src={activeVideo.url}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                    ></video>
                  </div>
                ) : (
                  <div className="p-8 text-center bg-navy-royal text-white space-y-4">
                    <h3 className="text-2xl font-bold font-serif">{activeVideo.title}</h3>
                    <p className="text-sm text-slate-300">This social video is hosted on external servers.</p>
                    <a
                      href={activeVideo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-gold hover:bg-gold-dark text-navy-dark hover:text-white font-bold transition duration-300"
                    >
                      <span>Watch on {activeVideo.type}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Videos;
