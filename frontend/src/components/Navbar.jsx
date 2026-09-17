import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, Shield, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDevModal, setShowDevModal] = useState(false);
  const [isPhotoZoomed, setIsPhotoZoomed] = useState(false);
  const [cacheBust, setCacheBust] = useState(Date.now());
  const { theme, toggleTheme } = useTheme();
  const { token, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const [developerInfo, setDeveloperInfo] = useState(null);

  useEffect(() => {
    const fetchDevInfo = async () => {
      try {
        const res = await axios.get('/api/settings');
        if (res.data.success) {
          setDeveloperInfo({
            name: res.data.data.developerName,
            phone: res.data.data.developerPhone,
            photoUrl: res.data.data.developerPhotoUrl
          });
        }
      } catch (err) {
        console.error('Navbar failed to load developer info:', err);
      }
    };
    fetchDevInfo();
  }, []);

  const links = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/leadership', label: 'Leadership' },
    { path: '/members', label: 'Members' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/videos', label: 'Videos' },
    { path: '/contact', label: 'Contact' }
  ];

  const activeStyle = "text-gold font-semibold border-b-2 border-gold pb-1 transition-all duration-200";
  const inactiveStyle = "text-slate-700 dark:text-slate-300 hover:text-gold dark:hover:text-gold font-medium transition-all duration-200";

  return (
    <nav className="sticky top-0 z-50 glass-nav border-b border-slate-200/50 dark:border-slate-800/50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand Name */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-3xl">⚖️</span>
              <div className="flex flex-col">
                <span className="font-extrabold text-navy-royal dark:text-white text-lg tracking-wider font-serif">
                  WORLD HUMAN RIGHTS
                </span>
                <span className="text-[10px] text-gold dark:text-gold-light tracking-widest font-semibold uppercase -mt-1">
                  WHR RK Foundations
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Right Utilities (Theme Toggle & Admin controls) */}
          <div className="hidden lg:flex items-center space-x-4">
            {developerInfo && developerInfo.name && (
              <div 
                onClick={() => setShowDevModal(true)}
                className="flex items-center space-x-2 border-r border-slate-200/60 dark:border-slate-800/60 pr-4 mr-2 cursor-pointer hover:opacity-80 transition duration-200"
              >
                <img
                  src={`${developerInfo.photoUrl}?t=${cacheBust}`}
                  alt={developerInfo.name}
                  className="w-8 h-8 rounded-full object-cover border border-gold"
                />
                <div className="flex flex-col text-[10px] leading-tight">
                  <span className="font-extrabold text-slate-700 dark:text-slate-200">{developerInfo.name}</span>
                  <span className="text-slate-400 font-semibold">{developerInfo.phone}</span>
                  <span className="text-gold font-bold uppercase tracking-widest text-[7px] -mt-0.5">Creator</span>
                </div>
              </div>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-light transition duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-gold-light" /> : <Moon className="w-5 h-5" />}
            </button>

            {token ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/admin/dashboard"
                  className="flex items-center space-x-1 px-3.5 py-1.5 rounded-full bg-navy-royal text-white hover:bg-navy-deep text-xs font-semibold shadow-md transition duration-200"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-full text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition duration-200"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/admin-login"
                className="px-4 py-2 rounded-full bg-slate-100 dark:bg-navy-light text-slate-700 dark:text-slate-300 hover:bg-navy-royal hover:text-white dark:hover:bg-gold dark:hover:text-navy-royal text-sm font-semibold transition duration-300 shadow-sm"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-light transition duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-gold" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-light focus:outline-none transition duration-200"
              aria-label="Toggle main menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="lg:hidden glass-nav border-b border-slate-200 dark:border-slate-800">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-md text-base font-semibold ${
                    isActive
                      ? 'bg-gold text-white dark:bg-gold dark:text-navy-royal shadow-sm'
                      : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-light'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* Mobile Admin links */}
            <hr className="my-2 border-slate-200 dark:border-slate-800" />
            {token ? (
              <div className="space-y-1">
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 rounded-md text-base font-semibold bg-navy-royal text-white hover:bg-navy-deep flex items-center space-x-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left block px-3 py-2.5 rounded-md text-base font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/admin-login"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-md text-base font-semibold bg-slate-100 dark:bg-navy-light text-slate-700 dark:text-slate-300 text-center hover:bg-navy-royal hover:text-white"
              >
                Admin Login
              </Link>
            )}
            
            {developerInfo && developerInfo.name && (
              <div 
                onClick={() => {
                  setIsOpen(false);
                  setShowDevModal(true);
                }}
                className="flex items-center space-x-3 px-3 py-3 border-t border-slate-200/50 dark:border-slate-800/50 mt-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-navy-light/30 rounded-lg transition duration-200"
              >
                <img
                  src={`${developerInfo.photoUrl}?t=${cacheBust}`}
                  alt={developerInfo.name}
                  className="w-10 h-10 rounded-full object-cover border border-gold"
                />
                <div className="flex flex-col text-xs leading-tight">
                  <span className="font-extrabold text-slate-850 dark:text-slate-200">{developerInfo.name}</span>
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">{developerInfo.phone}</span>
                  <span className="text-gold font-bold uppercase tracking-widest text-[8px] mt-0.5">Creator</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Creator Profile Image Modal */}
      {showDevModal && developerInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md transition-all duration-300">
          <div className="relative bg-white dark:bg-navy-royal rounded-3xl border border-slate-200/50 dark:border-slate-800 p-6 max-w-sm w-full text-center shadow-2xl space-y-6 transform scale-100 transition-transform">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowDevModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500 rounded-full bg-slate-100 dark:bg-navy-light transition"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile Photo */}
            <div className="flex justify-center pt-4">
              <img
                src={`${developerInfo.photoUrl}?t=${cacheBust}`}
                alt={developerInfo.name}
                onClick={() => setIsPhotoZoomed(true)}
                className="w-40 h-40 rounded-full object-cover border-4 border-gold shadow-lg cursor-pointer hover:scale-105 transition duration-200"
                title="Click to view larger image"
              />
            </div>

            {/* Profile Info */}
            <div className="space-y-2">
              <span className="text-[10px] font-black text-gold uppercase tracking-widest bg-gold/10 px-3 py-1 rounded-full">Website Creator</span>
              <h4 className="text-2xl font-black text-slate-800 dark:text-white font-serif">{developerInfo.name}</h4>
              <p className="text-slate-450 dark:text-slate-400 text-sm font-medium">Developed by WHR Team</p>
            </div>

            {/* Contact Details */}
            <div className="p-4 bg-slate-50 dark:bg-navy-dark rounded-2xl flex flex-col items-center justify-center space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Contact Number</span>
              <a 
                href={`tel:${developerInfo.phone}`} 
                className="text-lg font-bold text-navy-royal dark:text-gold hover:underline"
              >
                {developerInfo.phone}
              </a>
            </div>

            {/* Footer action */}
            <button 
              onClick={() => setShowDevModal(false)}
              className="w-full py-3 rounded-2xl bg-gold hover:bg-gold-dark text-navy-dark font-black uppercase text-xs tracking-wider transition shadow-lg shadow-gold/20"
            >
              Close Profile
            </button>

          </div>
        </div>
      )}
      {/* Zoomed Creator Photo Lightbox */}
      {isPhotoZoomed && developerInfo && (
        <div 
          onClick={() => setIsPhotoZoomed(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-lg transition-all duration-300 cursor-zoom-out"
        >
          <button 
            onClick={() => setIsPhotoZoomed(false)}
            className="absolute top-6 right-6 p-3 text-white hover:text-rose-500 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
            aria-label="Close zoomed view"
          >
            <X className="w-6 h-6" />
          </button>
          
          <img
            src={`${developerInfo.photoUrl}?t=${cacheBust}`}
            alt={developerInfo.name}
            className="max-w-full max-h-[85vh] rounded-2xl border-2 border-gold/50 shadow-2xl object-contain"
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
