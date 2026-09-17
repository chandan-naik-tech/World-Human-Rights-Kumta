import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import axios from 'axios';

const WhatsAppButton = () => {
  const [phone, setPhone] = useState('919481234567'); // Default fallback

  useEffect(() => {
    const fetchNumber = async () => {
      try {
        const res = await axios.get('/api/settings');
        if (res.data.success && res.data.data.contactDetails.whatsapp) {
          // Remove non-numeric characters for WA Link
          const numOnly = res.data.data.contactDetails.whatsapp.replace(/\D/g, '');
          setPhone(numOnly);
        }
      } catch (err) {
        console.error('Failed to load settings in whatsapp button:', err);
      }
    };
    fetchNumber();
  }, []);

  return (
    <a
      href={`https://wa.me/${phone}?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20World%20Human%20Rights%20Organization.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl hover:shadow-emerald-400/40 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center animate-pulse"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-white" />
    </a>
  );
};

export default WhatsAppButton;
