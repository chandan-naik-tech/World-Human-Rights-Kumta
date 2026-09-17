import React, { useEffect, useState } from 'react';
import { Shield, Target, Eye, Bookmark } from 'lucide-react';
import axios from 'axios';

const About = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/settings');
        if (res.data.success) {
          setSettings(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load settings in about page:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-navy-dark">
        <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const defaultObjectives = [
    'To provide free legal advice and representation to underprivileged groups.',
    'To coordinate social service programs including blood donation drives, health checkups, and disaster relief.',
    'To raise civic awareness through seminars, meetings, and academic programs.',
    'To monitor and report human rights violations locally, nationally, and internationally.'
  ];

  const objectives = Array.isArray(settings?.objectives) && settings.objectives.length > 0 ? settings.objectives : defaultObjectives;

  return (
    <div className="w-full bg-slate-50 dark:bg-navy-dark/10 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-gold font-bold uppercase tracking-widest text-xs">Official Profile</span>
          <h1 className="text-4xl md:text-5xl font-black text-navy-royal dark:text-white font-serif leading-tight">
            ABOUT OUR ORGANIZATION
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            World Human Rights (WHR RK Foundations Kumta, U.K.) operates with national and global leadership to secure, protect, and serve human values.
          </p>
        </div>

        {/* History / Background Section */}
        <section className="bg-white dark:bg-navy-royal p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800/80 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-3xl font-bold text-navy-royal dark:text-white font-serif border-l-4 border-gold pl-4">Our History</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans text-sm md:text-base">
              {settings?.history || 'World Human Rights (WHR RK Foundations Kumta, U.K.) was established with a clear mandate to protect human rights, serve society, and advocate for justice. Under the leadership of local, national, and international visionaries, our organization works continuously to provide legal support, raise social awareness, organize blood drives, and coordinate emergency response initiatives for those in need.'}
            </p>
          </div>
          <div className="h-64 bg-slate-100 dark:bg-navy-dark rounded-2xl flex items-center justify-center p-6 border border-slate-200/50 dark:border-slate-800">
            <div className="text-center space-y-2">
              <span className="text-6xl text-gold animate-pulse">⚖️</span>
              <h3 className="font-extrabold text-navy-royal dark:text-white mt-4 font-serif">WHR FOUNDATION</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold">Registered NGO</p>
            </div>
          </div>
        </section>

        {/* Mission & Vision & Objectives Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mission */}
          <div className="bg-white dark:bg-navy-royal p-8 rounded-3xl shadow-md border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-2xl w-fit"><Target className="w-6 h-6 text-red-500" /></div>
            <h3 className="text-2xl font-bold text-navy-royal dark:text-white font-serif">Our Mission</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-sans">
              {settings?.mission || 'To safeguard citizen liberties, secure universal human rights, and provide accessible legal aid.'}
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white dark:bg-navy-royal p-8 rounded-3xl shadow-md border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-2xl w-fit"><Eye className="w-6 h-6 text-blue-500" /></div>
            <h3 className="text-2xl font-bold text-navy-royal dark:text-white font-serif">Our Vision</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-sans">
              {settings?.vision || 'To achieve an equal, peaceful society where justice, dignity, and civic integrity are protected.'}
            </p>
          </div>

          {/* Objectives */}
          <div className="bg-white dark:bg-navy-royal p-8 rounded-3xl shadow-md border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="p-3 bg-gold-pale/20 rounded-2xl w-fit"><Bookmark className="w-6 h-6 text-gold" /></div>
            <h3 className="text-2xl font-bold text-navy-royal dark:text-white font-serif">Key Objectives</h3>
            <ul className="space-y-2 text-slate-500 dark:text-slate-400 text-xs md:text-sm list-disc pl-4 font-sans">
              {objectives.map((obj, i) => (
                <li key={i} className="leading-relaxed">{obj}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Presidents and Directors messages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* President Msg */}
          <div className="bg-white dark:bg-navy-royal rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-slate-100 dark:bg-navy-dark h-64 md:h-auto relative overflow-hidden">
              <img
                src={settings?.presidentMessage?.photoUrl && settings?.presidentMessage?.photoUrl !== '/uploads/default-avatar.png' ? settings.presidentMessage.photoUrl : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop'}
                alt={settings?.presidentMessage?.name || 'President'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-2/3 p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] text-gold font-bold uppercase tracking-wider">Foundation President</span>
                <h3 className="text-2xl font-bold text-navy-royal dark:text-white font-serif">{settings?.presidentMessage?.name || 'Dr. Ram Kumar'}</h3>
                <div className="w-12 h-0.5 bg-gold rounded"></div>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed italic pt-2">
                  "{settings?.presidentMessage?.message || 'Dear friends, our foundation stands as a shield for the voiceless. We welcome you to join our network of activists dedicated to justice, equality, and human service.'}"
                </p>
              </div>
            </div>
          </div>

          {/* Director Msg */}
          <div className="bg-white dark:bg-navy-royal rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-slate-100 dark:bg-navy-dark h-64 md:h-auto relative overflow-hidden">
              <img
                src={settings?.directorMessage?.photoUrl && settings?.directorMessage?.photoUrl !== '/uploads/default-avatar.png' ? settings.directorMessage.photoUrl : 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop'}
                alt={settings?.directorMessage?.name || 'Director'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-2/3 p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] text-gold font-bold uppercase tracking-wider">Legal Advisor</span>
                <h3 className="text-2xl font-bold text-navy-royal dark:text-white font-serif">{settings?.directorMessage?.name || 'Adv. Suresh Naik'}</h3>
                <div className="w-12 h-0.5 bg-gold rounded"></div>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed italic pt-2">
                  "{settings?.directorMessage?.message || 'Legal literacy is our primary tool. Our mission is to educate every citizen on their fundamental rights and provide them with concrete tools to secure justice.'}"
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default About;
