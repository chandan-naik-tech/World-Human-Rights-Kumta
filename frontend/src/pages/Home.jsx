import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, Calendar, Award, ArrowRight, BookOpen, Heart, Eye, Target, MessageSquare } from 'lucide-react';
import axios from 'axios';



const Home = () => {
  const [settings, setSettings] = useState(null);
  const [news, setNews] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Form states for mini-contact
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [settingsRes, leadersRes, galleryRes] = await Promise.all([
          axios.get('/api/settings'),
          axios.get('/api/leaders'),
          axios.get('/api/gallery')
        ]);

        if (settingsRes.data.success) setSettings(settingsRes.data.data);
        if (leadersRes.data.success) setLeaders(leadersRes.data.data.slice(0, 4));
        if (galleryRes.data.success) setGallery(galleryRes.data.data.slice(0, 6));
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Slide duration timer
  useEffect(() => {
    if (!settings || !settings.heroBanners || settings.heroBanners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % settings.heroBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [settings]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setSubmitStatus({ success: false, msg: 'Please fill in all fields.' });
      return;
    }
    try {
      const res = await axios.post('/api/contact', form);
      if (res.data.success) {
        setSubmitStatus({ success: true, msg: 'Message sent successfully! We will contact you soon.' });
        setForm({ name: '', email: '', message: '' });
      }
    } catch (err) {
      setSubmitStatus({ success: false, msg: 'Failed to send message. Please try again later.' });
    }
  };

  const localBanners = [
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1600&auto=format&fit=crop'
  ];

  const getBannerUrl = (banner, idx) => {
    if (banner && !banner.includes('default-banner')) {
      return banner;
    }
    return localBanners[idx % localBanners.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-navy-dark">
        <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const banners = settings?.heroBanners?.length > 0 ? settings.heroBanners : localBanners;

  return (
    <div className="w-full">
      {/* 1. Hero Banner Section */}
      <div className="relative h-[85vh] md:h-[90vh] overflow-hidden bg-navy-royal">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${getBannerUrl(banners[currentSlide], currentSlide)}")` }}
          >
            {/* Banner Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/95 via-navy-royal/60 to-transparent"></div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="max-w-2xl text-white space-y-6"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-gold-light border border-gold/30 text-xs tracking-widest font-extrabold uppercase">
                Official Human Rights Organization
              </span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight uppercase font-serif">
                {settings?.heroTitle || 'WORLD HUMAN RIGHTS'}
              </h1>
              <p className="text-lg md:text-xl text-slate-200 leading-relaxed font-sans font-light">
                {settings?.heroSubtitle || 'WHR RK FOUNDATIONS KUMTA, U.K. - Defending civil rights, advocating for justice, and offering human services globally.'}
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/about"
                  className="px-8 py-3.5 rounded-full bg-gold hover:bg-gold-dark text-navy-dark hover:text-white font-bold transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg flex items-center space-x-2"
                >
                  <span>Know More</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-3.5 rounded-full bg-transparent hover:bg-white/10 text-white border-2 border-white/60 hover:border-white font-bold transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Slider Indicator Bullets */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2.5 z-20">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'bg-gold w-8' : 'bg-white/50 hover:bg-white'
              }`}
              aria-label={`Slide ${idx + 1}`}
            ></button>
          ))}
        </div>
      </div>


      {/* 3. Introduction / Mission & Vision */}
      <section className="py-20 bg-slate-50 dark:bg-navy-dark/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <span className="text-gold font-bold uppercase tracking-widest text-xs">Who We Are</span>
            <h2 className="text-3xl md:text-4xl font-black text-navy-royal dark:text-white font-serif leading-tight">
              WORLD HUMAN RIGHTS & SOCIAL SERVICE FOUNDATION
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              {settings?.history || 'WHR RK Foundations Kumta was established with a mandate to defend fundamental liberties, serve disadvantaged segments of society, and coordinate resources for social service. We stand as a beacon of trust, legal literacy, and active service.'}
            </p>
            <div className="flex gap-4">
              <Link to="/about" className="inline-flex items-center space-x-1.5 text-gold hover:text-gold-dark font-extrabold tracking-wide uppercase text-sm group">
                <span>Read Full History</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-navy-royal p-6 rounded-3xl shadow-md border border-slate-100 dark:border-slate-800 space-y-4"
            >
              <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-2xl w-fit"><Target className="w-6 h-6 text-red-500" /></div>
              <h3 className="text-xl font-bold text-navy-royal dark:text-white">Our Mission</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {settings?.mission || 'To safeguard citizen liberties, secure universal human rights, and provide accessible legal aid.'}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-navy-royal p-6 rounded-3xl shadow-md border border-slate-100 dark:border-slate-800 space-y-4"
            >
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-2xl w-fit"><Eye className="w-6 h-6 text-blue-500" /></div>
              <h3 className="text-xl font-bold text-navy-royal dark:text-white">Our Vision</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {settings?.vision || 'To achieve an equal, peaceful society where justice, dignity, and civic integrity are protected.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>


      {/* 5. Gallery Preview */}
      <section className="py-20 bg-slate-50 dark:bg-navy-dark/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="space-y-3">
              <span className="text-gold font-bold uppercase tracking-widest text-xs">Visual records</span>
              <h2 className="text-3xl md:text-4xl font-black text-navy-royal dark:text-white font-serif">GALLERY SPOTLIGHT</h2>
            </div>
            <Link to="/gallery" className="mt-4 md:mt-0 px-6 py-2.5 rounded-full border-2 border-gold text-gold hover:bg-gold hover:text-navy-dark text-sm font-bold transition duration-300">
              Explore Gallery
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item) => (
              <div key={item._id} className="group relative h-72 rounded-3xl overflow-hidden shadow-md cursor-pointer">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-[10px] text-gold font-bold uppercase tracking-widest">{item.category}</span>
                  <h3 className="text-white text-lg font-bold mt-1">{item.title || 'Social Drive'}</h3>
                  <p className="text-slate-300 text-xs mt-1 line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* 7. Quick Contact & Map */}
      <section className="py-20 bg-slate-50 dark:bg-navy-dark/40 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Details & Mini Form */}
          <div className="space-y-8 bg-white dark:bg-navy-royal p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
            <div className="space-y-3">
              <span className="text-gold font-bold uppercase tracking-widest text-xs">Reach Out</span>
              <h2 className="text-3xl font-black text-navy-royal dark:text-white font-serif">GET IN TOUCH</h2>
              <p className="text-slate-400 text-sm">Have a complaint or query? Fill in the form and we will get back to you.</p>
            </div>

            {submitStatus && (
              <div className={`p-4 rounded-xl text-sm ${submitStatus.success ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600'}`}>
                {submitStatus.msg}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your full name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-dark text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-dark text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Your Message</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Describe your inquiry..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-dark text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-gold"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gold hover:bg-gold-dark text-navy-dark hover:text-white font-bold transition duration-300 flex items-center justify-center space-x-2 shadow-lg"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          </div>

          {/* Map Column */}
          <div className="h-full min-h-[400px] rounded-3xl overflow-hidden shadow-xl relative border-4 border-white dark:border-navy-royal">
            <iframe
              title="WHR Office Map"
              src={settings?.contactDetails?.googleMapsEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3869.643360408544!2d74.41738727579626!3d14.419022681577717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbc18b84319489b%3A0xc48de1d56e7d6928!2sKumta%2C%20Karnataka%20581343!5e0!3m2!1sen!2sin!4v1710500000000!5m2!1sen!2sin"}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
