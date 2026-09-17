import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle } from 'lucide-react';
import axios from 'axios';

const Contact = () => {
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactSettings = async () => {
      try {
        const res = await axios.get('/api/settings');
        if (res.data.success) {
          setSettings(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load settings in contact page:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContactSettings();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus({ success: false, msg: 'Please fill in all required fields (Name, Email, Message).' });
      return;
    }
    try {
      const res = await axios.post('/api/contact', form);
      if (res.data.success) {
        setStatus({ success: true, msg: 'Thank you! Your message has been sent successfully. Our team will review and respond soon.' });
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (err) {
      setStatus({ success: false, msg: 'Failed to submit form. Please check your network and try again.' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-navy-dark">
        <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const details = settings?.contactDetails || {
    address: 'WHR RK Foundations Office, Kumta, Uttara Kannada, Karnataka, India - 581343',
    phone1: '+91 9481234567',
    phone2: '+91 9481234568',
    email: 'info@worldhumanrights.org',
    whatsapp: '919481234567',
    googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3869.643360408544!2d74.41738727579626!3d14.419022681577717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbc18b84319489b%3A0xc48de1d56e7d6928!2sKumta%2C%20Karnataka%20581343!5e0!3m2!1sen!2sin!4v1710500000000!5m2!1sen!2sin'
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-navy-dark/10 py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-gold font-bold uppercase tracking-widest text-xs">Get In Touch</span>
          <h1 className="text-4xl md:text-5xl font-black text-navy-royal dark:text-white font-serif leading-tight">
            CONTACT HEADQUARTERS
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Contact our central office in Kumta for grievance reporting, membership applications, and legal advisor references.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Form */}
          <div className="bg-white dark:bg-navy-royal p-8 md:p-10 rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-800/80 space-y-6">
            <h2 className="text-2xl font-bold text-navy-royal dark:text-white font-serif">Submit a Grievance or Inquiry</h2>
            
            {status && (
              <div className={`p-4 rounded-xl text-sm flex items-start space-x-2 ${
                status.success ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600'
              }`}>
                {status.success && <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                <span>{status.msg}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-dark text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-dark text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Phone Number</label>
                  <input
                    type="text"
                    placeholder="Contact number"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-dark text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Subject</label>
                  <input
                    type="text"
                    placeholder="Reason for message"
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-dark text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Message *</label>
                <textarea
                  required
                  rows="5"
                  placeholder="Describe your inquiry or case details..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-dark text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-gold"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gold hover:bg-gold-dark text-navy-dark hover:text-white font-bold transition duration-300 flex items-center justify-center space-x-2 shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>Submit Grievance</span>
              </button>
            </form>
          </div>

          {/* Right Column: Contact info & Maps */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="bg-white dark:bg-navy-royal p-8 rounded-3xl shadow-lg border border-slate-200/50 dark:border-slate-800/80 space-y-6">
              <h2 className="text-2xl font-bold text-navy-royal dark:text-white font-serif">Office Locations</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <h4 className="font-extrabold text-navy-royal dark:text-white">Kumta HQ</h4>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{details.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <h4 className="font-extrabold text-navy-royal dark:text-white">Phone Support</h4>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{details.phone1} / {details.phone2}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <h4 className="font-extrabold text-navy-royal dark:text-white">Email Address</h4>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{details.email}</p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp button */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/50">
                <a
                  href={`https://wa.me/${details.whatsapp.replace(/\D/g, '')}?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20World%20Human%20Rights%20Organization.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition duration-300 flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-5 h-5 fill-white" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="h-64 rounded-3xl overflow-hidden shadow-lg border-4 border-white dark:border-navy-royal">
              <iframe
                title="WHR Office Location"
                src={details.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
