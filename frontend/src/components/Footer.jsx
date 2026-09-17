import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Shield } from 'lucide-react';
import axios from 'axios';

const Footer = () => {
  const [details, setDetails] = useState({
    address: 'WHR RK Foundations Office, Kumta, Uttara Kannada, Karnataka, India - 581343',
    phone1: '+91 9481234567',
    phone2: '+91 9481234568',
    email: 'info@worldhumanrights.org',
    whatsapp: '919481234567'
  });

  useEffect(() => {
    const fetchFooterSettings = async () => {
      try {
        const res = await axios.get('/api/settings');
        if (res.data.success && res.data.data.contactDetails) {
          setDetails(res.data.data.contactDetails);
        }
      } catch (err) {
        console.error('Failed to load settings in footer:', err);
      }
    };
    fetchFooterSettings();
  }, []);

  return (
    <footer className="bg-navy-royal dark:bg-navy-dark text-slate-200 border-t border-slate-800 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Info Column */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl">⚖️</span>
            <div className="flex flex-col">
              <span className="font-extrabold text-white text-lg tracking-wider font-serif">
                WORLD HUMAN RIGHTS
              </span>
              <span className="text-[9px] text-gold tracking-widest font-semibold uppercase -mt-1">
                WHR RK Foundations
              </span>
            </div>
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed">
            WHR RK Foundations Kumta, U.K. is a registered Human Rights & Social Service Organization dedicated to community support, legal assistance, and human rights advocacy.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-navy-deep hover:bg-gold hover:text-navy-royal transition duration-200" aria-label="Facebook">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-navy-deep hover:bg-gold hover:text-navy-royal transition duration-200" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white tracking-wide border-b border-navy-deep pb-2">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="text-slate-400 hover:text-gold transition duration-200">About Us</Link></li>
            <li><Link to="/leadership" className="text-slate-400 hover:text-gold transition duration-200">Leadership Team</Link></li>
            <li><Link to="/members" className="text-slate-400 hover:text-gold transition duration-200">Members Directory</Link></li>
            <li><Link to="/gallery" className="text-slate-400 hover:text-gold transition duration-200">Photo Gallery</Link></li>
            <li><Link to="/activities" className="text-slate-400 hover:text-gold transition duration-200">Activities & Events</Link></li>
          </ul>
        </div>

        {/* Categories Column */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white tracking-wide border-b border-navy-deep pb-2 font-sans">Focus Areas</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>Legal Literacy & Aid</li>
            <li>Blood Donation Drives</li>
            <li>Social Services</li>
            <li>Human Rights Protection</li>
            <li>Awareness Seminars</li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white tracking-wide border-b border-navy-deep pb-2">Contact Info</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start space-x-2.5">
              <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <span className="text-slate-400 leading-relaxed">{details.address}</span>
            </li>
            <li className="flex items-center space-x-2.5">
              <Phone className="w-5 h-5 text-gold flex-shrink-0" />
              <span className="text-slate-400">{details.phone1} / {details.phone2}</span>
            </li>
            <li className="flex items-center space-x-2.5">
              <Mail className="w-5 h-5 text-gold flex-shrink-0" />
              <span className="text-slate-400">{details.email}</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} WHR RK Foundations Kumta. All rights reserved.</p>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <Link to="/admin-login" className="hover:text-gold flex items-center space-x-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
