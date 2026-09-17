import React, { useEffect, useState } from 'react';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get('/api/activities');
        if (res.data.success) {
          setActivities(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load activities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const filteredActivities = activeTab === 'all'
    ? activities
    : activities.filter(act => act.type === activeTab);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-navy-dark">
        <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getTypeStyle = (type) => {
    switch (type) {
      case 'upcoming':
        return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50';
      case 'past':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/30';
      case 'program':
        return 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-200/50';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-navy-dark/10 py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-gold font-bold uppercase tracking-widest text-xs">Event Tracking</span>
          <h1 className="text-4xl md:text-5xl font-black text-navy-royal dark:text-white font-serif leading-tight">
            ACTIVITIES & PROGRAMS
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Keep track of our schedule, register for upcoming rallies/donation camps, and explore details of past social campaigns.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            { id: 'all', label: 'All Activities' },
            { id: 'upcoming', label: 'Upcoming Events' },
            { id: 'past', label: 'Past Campaigns' },
            { id: 'program', label: 'Social Service Programs' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gold border-gold text-navy-dark shadow-md'
                  : 'bg-white dark:bg-navy-royal border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-gold hover:text-gold'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Timeline Layout */}
        {filteredActivities.length > 0 ? (
          <div className="relative max-w-4xl mx-auto pl-6 md:pl-0">
            {/* Center Timeline Line (Desktop only) */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 transform md:-translate-x-1/2"></div>

            <div className="space-y-12">
              {filteredActivities.map((act, index) => {
                const isEven = index % 2 === 0;

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    key={act._id}
                    className={`relative flex flex-col md:flex-row items-start ${
                      isEven ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Circle Node indicator */}
                    <div className="absolute left-[17px] md:left-1/2 w-6 h-6 rounded-full bg-gold border-4 border-white dark:border-navy-royal transform -translate-x-1/2 z-10 shadow-md"></div>

                    {/* Timeline Card */}
                    <div className="w-full md:w-[45%] bg-white dark:bg-navy-royal rounded-3xl p-6 md:p-8 shadow-lg border border-slate-100 dark:border-slate-800/80 hover:shadow-2xl transition duration-300 space-y-4">
                      {act.imageUrl && (
                        <div className="h-44 overflow-hidden rounded-2xl">
                          <img src={act.imageUrl} alt={act.title} className="w-full h-full object-cover" />
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getTypeStyle(act.type)}`}>
                          {act.type}
                        </span>
                        
                        <span className="flex items-center space-x-1 text-[11px] font-medium text-slate-400">
                          <Calendar className="w-3.5 h-3.5 text-gold" />
                          <span>{new Date(act.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-navy-royal dark:text-white leading-snug">{act.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">{act.description}</p>
                    </div>

                    {/* Spacer for structural balance */}
                    <div className="hidden md:block w-[10%]"></div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            No activities listed under this category yet.
          </div>
        )}

      </div>
    </div>
  );
};

export default Activities;
