import React, { useEffect, useState } from 'react';
import { Search, Mail, Phone, Facebook, Instagram, MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Leadership = () => {
  const [leaders, setLeaders] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await axios.get('/api/leaders');
        if (res.data.success) {
          setLeaders(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load leaders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  const filteredLeaders = leaders.filter(leader =>
    leader.name.toLowerCase().includes(search.toLowerCase()) ||
    leader.designation.toLowerCase().includes(search.toLowerCase())
  );

  const getProfileImage = (url) => {
    if (url && url !== '/uploads/default-avatar.png') {
      return url;
    }
    // Fallback Unsplash avatar
    return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop';
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
          <span className="text-gold font-bold uppercase tracking-widest text-xs">Governing Council</span>
          <h1 className="text-4xl md:text-5xl font-black text-navy-royal dark:text-white font-serif leading-tight">
            ORGANIZATION LEADERSHIP
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Meet the international, national, and state leaders driving our legal assistance initiatives and social campaigns.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <input
            type="text"
            placeholder="Search by name or designation..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-5 py-3.5 pl-12 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-royal text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold shadow-md font-medium text-sm transition"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        </div>

        {/* Grid of Leaders */}
        {filteredLeaders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredLeaders.map((leader) => (
              <motion.div
                layout
                whileHover={{ y: -6 }}
                key={leader._id}
                onClick={() => setSelectedLeader(leader)}
                className="bg-white dark:bg-navy-royal rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col h-full"
              >
                <div className="h-64 bg-slate-100 overflow-hidden relative">
                  <img
                    src={getProfileImage(leader.photoUrl)}
                    alt={leader.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-navy-royal/90 dark:bg-gold/90 text-white dark:text-navy-royal text-[10px] font-bold uppercase tracking-widest shadow-md">
                    {leader.designation}
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-navy-royal dark:text-white line-clamp-1">{leader.name}</h3>
                    <p className="text-xs text-gold dark:text-gold-light font-bold tracking-wider uppercase mt-1">{leader.designation}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {leader.description || 'No detailed background provided.'}
                    </p>
                  </div>
                  <div className="text-xs text-slate-400 font-semibold uppercase hover:text-gold transition">
                    View Full Profile &rarr;
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            No leaders matching your search query.
          </div>
        )}

        {/* Dynamic Modal for Biography & Social Media */}
        <AnimatePresence>
          {selectedLeader && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedLeader(null)}
                className="absolute inset-0 bg-navy-dark/70 backdrop-blur-sm"
              />

              {/* Modal Body */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white dark:bg-navy-royal w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedLeader(null)}
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/50 hover:bg-slate-900/70 text-white hover:text-rose-400 transition"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Left Photo Column */}
                <div className="md:w-2/5 h-64 md:h-auto bg-slate-200 relative">
                  <img
                    src={getProfileImage(selectedLeader.photoUrl)}
                    alt={selectedLeader.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Right Details Column */}
                <div className="md:w-3/5 p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <span className="text-[10px] text-gold font-bold uppercase tracking-wider">{selectedLeader.designation}</span>
                    <h2 className="text-3xl font-bold text-navy-royal dark:text-white font-serif">{selectedLeader.name}</h2>
                    <div className="w-16 h-1 bg-gold rounded-full"></div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed pt-2">
                      {selectedLeader.description || 'No detailed biography provided.'}
                    </p>
                  </div>

                  {/* Contacts & Socials */}
                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
                      {selectedLeader.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                          <span>{selectedLeader.phone}</span>
                        </div>
                      )}
                      {selectedLeader.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                          <span>{selectedLeader.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Social Media Link Icons */}
                    <div className="flex space-x-3 pt-2">
                      {selectedLeader.socialLinks?.facebook && (
                        <a
                          href={selectedLeader.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-slate-100 dark:bg-navy-dark hover:bg-navy-royal hover:text-white dark:hover:bg-gold dark:hover:text-navy-royal transition text-slate-500 dark:text-slate-300"
                        >
                          <Facebook className="w-4 h-4" />
                        </a>
                      )}
                      {selectedLeader.socialLinks?.instagram && (
                        <a
                          href={selectedLeader.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-slate-100 dark:bg-navy-dark hover:bg-navy-royal hover:text-white dark:hover:bg-gold dark:hover:text-navy-royal transition text-slate-500 dark:text-slate-300"
                        >
                          <Instagram className="w-4 h-4" />
                        </a>
                      )}
                      {selectedLeader.socialLinks?.whatsapp && (
                        <a
                          href={`https://wa.me/${selectedLeader.socialLinks.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-slate-100 dark:bg-navy-dark hover:bg-navy-royal hover:text-white dark:hover:bg-gold dark:hover:text-navy-royal transition text-slate-500 dark:text-slate-300"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Leadership;
