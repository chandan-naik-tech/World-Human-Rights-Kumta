import React, { useEffect, useState } from 'react';
import { Search, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get('/api/members');
        if (res.data.success) {
          setMembers(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load members:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(search.toLowerCase()) ||
    member.village.toLowerCase().includes(search.toLowerCase())
  );

  const getProfileImage = (url) => {
    if (url && url !== '/uploads/default-avatar.png') {
      return url;
    }
    return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop';
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
          <span className="text-gold font-bold uppercase tracking-widest text-xs">Foundation Network</span>
          <h1 className="text-4xl md:text-5xl font-black text-navy-royal dark:text-white font-serif leading-tight">
            MEMBERS DIRECTORY
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Our active core members driving village-level campaigns, organizing services, and representing the local values.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <input
            type="text"
            placeholder="Search by name or village..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-5 py-3.5 pl-12 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-royal text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold shadow-md font-medium text-sm transition"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        </div>

        {/* Members Grid */}
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMembers.map((member, index) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 3) * 0.1 }}
                key={member._id}
                className="bg-white dark:bg-navy-royal rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-slate-100 dark:border-slate-800/80 transition duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Badge */}
                  <div className="h-56 bg-slate-100 relative overflow-hidden">
                    <img
                      src={getProfileImage(member.photoUrl)}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-navy-royal/90 dark:bg-gold/90 text-white dark:text-navy-royal text-[10px] font-bold uppercase tracking-wider">
                      {member.designation}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-navy-royal dark:text-white leading-tight">{member.name}</h3>
                    
                    <div className="flex items-center space-x-2 text-xs font-semibold text-gold">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="uppercase tracking-wider">Village: {member.village}</span>
                    </div>

                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed pt-2">
                      {member.description || 'No detailed background provided.'}
                    </p>
                  </div>
                </div>

                {/* Footer Info */}
                {member.phone && (
                  <div className="px-6 py-4 bg-slate-50 dark:bg-navy-dark/40 border-t border-slate-100 dark:border-slate-800/50 flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    <span>Phone: {member.phone}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            No members matching your search query.
          </div>
        )}

      </div>
    </div>
  );
};

export default Members;
