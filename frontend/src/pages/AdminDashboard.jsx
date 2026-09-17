import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, Users, Image as ImageIcon, Video, Calendar, FileText,
  Inbox, Settings, LogOut, Plus, Trash2, Edit, Check, Eye, X, Upload
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(false);

  // Data states
  const [stats, setStats] = useState({ leaders: 0, members: 0, gallery: 0, videos: 0, contacts: 0 });
  const [leaders, setLeaders] = useState([]);
  const [members, setMembers] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [videos, setVideos] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [settings, setSettings] = useState(null);

  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null); // holds item being edited
  const [formType, setFormType] = useState(''); // 'leader', 'member', 'activity', 'news', 'gallery', 'video'

  // Upload file fields
  const [selectedFile, setSelectedFile] = useState(null);

  // Generic text form states
  const [textForm, setTextForm] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadersRes, membersRes, galleryRes, videosRes, contactsRes, settingsRes] = await Promise.all([
        axios.get('/api/leaders'),
        axios.get('/api/members'),
        axios.get('/api/gallery'),
        axios.get('/api/videos'),
        axios.get('/api/contact'),
        axios.get('/api/settings')
      ]);

      if (leadersRes.data.success) setLeaders(leadersRes.data.data);
      if (membersRes.data.success) setMembers(membersRes.data.data);
      if (galleryRes.data.success) setGallery(galleryRes.data.data);
      if (videosRes.data.success) setVideos(videosRes.data.data);
      if (contactsRes.data.success) setContacts(contactsRes.data.data);
      if (settingsRes.data.success) {
        setSettings(settingsRes.data.data);
        // Prep settings form
        setSettingsForm({
          heroTitle: settingsRes.data.data.heroTitle,
          heroSubtitle: settingsRes.data.data.heroSubtitle,
          history: settingsRes.data.data.history,
          mission: settingsRes.data.data.mission,
          vision: settingsRes.data.data.vision,
          presidentName: settingsRes.data.data.presidentMessage.name,
          presidentMessage: settingsRes.data.data.presidentMessage.message,
          directorName: settingsRes.data.data.directorMessage.name,
          directorMessage: settingsRes.data.data.directorMessage.message,
          address: settingsRes.data.data.contactDetails.address,
          phone1: settingsRes.data.data.contactDetails.phone1,
          phone2: settingsRes.data.data.contactDetails.phone2,
          email: settingsRes.data.data.contactDetails.email,
          whatsapp: settingsRes.data.data.contactDetails.whatsapp,
          googleMapsEmbedUrl: settingsRes.data.data.contactDetails.googleMapsEmbedUrl,
          objectives: JSON.stringify(settingsRes.data.data.objectives),
          developerName: settingsRes.data.data.developerName || '',
          developerPhone: settingsRes.data.data.developerPhone || ''
        });
      }

      setStats({
        leaders: leadersRes.data.data?.length || 0,
        members: membersRes.data.data?.length || 0,
        gallery: galleryRes.data.data?.length || 0,
        videos: videosRes.data.data?.length || 0,
        contacts: contactsRes.data.data?.length || 0
      });

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Settings custom Form state
  const [settingsForm, setSettingsForm] = useState({
    heroTitle: '', heroSubtitle: '', history: '', mission: '', vision: '',
    presidentName: '', presidentMessage: '', directorName: '', directorMessage: '',
    address: '', phone1: '', phone2: '', email: '', whatsapp: '', googleMapsEmbedUrl: '', objectives: '[]',
    developerName: '', developerPhone: ''
  });
  const [settingsFiles, setSettingsFiles] = useState({
    heroBanners: null, presidentPhoto: null, directorPhoto: null, developerPhoto: null
  });
  const [settingsStatus, setSettingsStatus] = useState(null);

  // Settings submit handler
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSettingsStatus({ type: 'loading', msg: 'Updating settings...' });

    const formData = new FormData();
    Object.keys(settingsForm).forEach(key => {
      formData.append(key, settingsForm[key]);
    });

    if (settingsFiles.heroBanners) {
      for (let i = 0; i < settingsFiles.heroBanners.length; i++) {
        formData.append('heroBanners', settingsFiles.heroBanners[i]);
      }
    }
    if (settingsFiles.presidentPhoto) {
      formData.append('presidentPhoto', settingsFiles.presidentPhoto);
    }
    if (settingsFiles.directorPhoto) {
      formData.append('directorPhoto', settingsFiles.directorPhoto);
    }
    if (settingsFiles.developerPhoto) {
      formData.append('developerPhoto', settingsFiles.developerPhoto);
    }

    try {
      const res = await axios.put('/api/settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setSettings(res.data.data);
        setSettingsStatus({ type: 'success', msg: 'Website settings updated successfully!' });
      }
    } catch (err) {
      setSettingsStatus({ type: 'error', msg: 'Failed to update settings. Please check fields.' });
    }
  };

  // Logouts session
  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  // DELETE handler helper
  const handleDelete = async (url, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await axios.delete(`${url}/${id}`);
      if (res.data.success) {
        fetchData();
      }
    } catch (error) {
      alert('Delete failed.');
    }
  };

  // CONTACT Action handlers
  const handleContactStatus = async (id, status) => {
    try {
      const res = await axios.put(`/api/contact/${id}`, { status });
      if (res.data.success) {
        fetchData();
      }
    } catch (error) {
      alert('Failed to update inquiry status.');
    }
  };

  // Generic create/update submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Append text fields
    Object.keys(textForm).forEach(key => {
      formData.append(key, textForm[key]);
    });

    // Append file if selected
    if (selectedFile) {
      const fileField = (formType === 'gallery') ? 'image' : (formType === 'video') ? 'video' : (formType === 'leader' || formType === 'member') ? 'photo' : 'image';
      formData.append(fileField, selectedFile);
    }

    try {
      let res;
      let url = `/api/${formType}s`;
      if (formType === 'gallery') url = '/api/gallery';

      if (editItem) {
        // Update PUT
        res = await axios.put(`${url}/${editItem._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Create POST
        res = await axios.post(url, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (res.data.success) {
        setIsModalOpen(false);
        setEditItem(null);
        setSelectedFile(null);
        setTextForm({});
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed.');
    }
  };

  const openAddModal = (type) => {
    setFormType(type);
    setEditItem(null);
    setSelectedFile(null);
    
    // Initial fields based on type
    if (type === 'leader') {
      setTextForm({ name: '', designation: '', phone: '', email: '', description: '', facebook: '', instagram: '', whatsapp: '' });
    } else if (type === 'member') {
      setTextForm({ name: '', designation: '', village: '', phone: '', description: '' });
    } else if (type === 'activity') {
      setTextForm({ title: '', description: '', type: 'program', date: '' });
    } else if (type === 'news') {
      setTextForm({ title: '', content: '', date: '' });
    } else if (type === 'gallery') {
      setTextForm({ title: '', description: '', category: 'Social Service' });
    } else if (type === 'video') {
      setTextForm({ title: '', description: '', type: 'youtube', url: '' });
    }
    setIsModalOpen(true);
  };

  const openEditModal = (type, item) => {
    setFormType(type);
    setEditItem(item);
    setSelectedFile(null);

    if (type === 'leader') {
      setTextForm({
        name: item.name, designation: item.designation, phone: item.phone, email: item.email, description: item.description,
        facebook: item.socialLinks?.facebook, instagram: item.socialLinks?.instagram, whatsapp: item.socialLinks?.whatsapp
      });
    } else if (type === 'member') {
      setTextForm({ name: item.name, designation: item.designation, village: item.village, phone: item.phone, description: item.description });
    } else if (type === 'activity') {
      setTextForm({ title: item.title, description: item.description, type: item.type, date: item.date ? item.date.substring(0, 10) : '' });
    } else if (type === 'news') {
      setTextForm({ title: item.title, content: item.content, date: item.date ? item.date.substring(0, 10) : '' });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-navy-dark flex flex-col md:flex-row transition-all duration-300">
      
      {/* Sidebar Nav */}
      <aside className="w-full md:w-64 bg-navy-royal text-white flex flex-col justify-between p-6">
        <div className="space-y-8">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">⚖️</span>
            <div>
              <h1 className="font-extrabold text-sm tracking-widest font-serif uppercase">WHR CONTROL</h1>
              <p className="text-[10px] text-gold uppercase tracking-wider font-semibold">Central Admin Panel</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'stats', label: 'Statistics', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'leaders', label: 'Leaders Directory', icon: <Users className="w-4 h-4" /> },
              { id: 'members', label: 'Members catalog', icon: <Users className="w-4 h-4" /> },
              { id: 'gallery', label: 'Photo Gallery', icon: <ImageIcon className="w-4 h-4" /> },
              { id: 'videos', label: 'Videos & Links', icon: <Video className="w-4 h-4" /> },
              { id: 'inbox', label: 'Contacts Inbox', icon: <Inbox className="w-4 h-4" /> },
              { id: 'settings', label: 'Website Settings', icon: <Settings className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === tab.id
                    ? 'bg-gold text-navy-dark shadow-lg'
                    : 'hover:bg-navy-deep text-slate-300 hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-navy-deep mt-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-400 hover:bg-rose-950/20 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Board content */}
      <main className="flex-grow p-6 md:p-10 space-y-8 overflow-y-auto max-h-screen">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-navy-royal dark:text-white font-serif uppercase">
              {activeTab === 'stats' ? 'Dashboard Summary' : `${activeTab} Management`}
            </h2>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Central administration system</p>
          </div>
          
          <button
            onClick={() => navigate('/')}
            className="mt-4 md:mt-0 px-5 py-2 rounded-full bg-white dark:bg-navy-royal text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 text-xs font-bold transition hover:bg-gold hover:text-navy-dark"
          >
            Go to Website &rarr;
          </button>
        </div>

        {/* Tab contents */}
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* 1. STATS TAB */}
            {activeTab === 'stats' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { label: 'Leaders Profiles', val: stats.leaders, bg: 'from-blue-500 to-indigo-600' },
                    { label: 'Active Members', val: stats.members, bg: 'from-emerald-500 to-teal-600' },
                    { label: 'Gallery Images', val: stats.gallery, bg: 'from-purple-500 to-pink-600' },
                    { label: 'Videos Archive', val: stats.videos, bg: 'from-amber-500 to-orange-600' },
                    { label: 'Pending Inquiries', val: contacts.filter(c => c.status === 'unread').length, bg: 'from-rose-500 to-red-600' }
                  ].map((stat, idx) => (
                    <div key={idx} className={`p-6 rounded-3xl bg-gradient-to-br ${stat.bg} text-white shadow-lg space-y-2`}>
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">{stat.label}</h4>
                      <p className="text-4xl font-black">{stat.val}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white dark:bg-navy-royal p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-navy-royal dark:text-white font-serif mb-4">Quick Seeding Info</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    Use the seeder script to populate default test data. Make sure the database holds exactly 18 member cards for public catalog display.
                  </p>
                </div>
              </div>
            )}

            {/* 2. LEADERS TAB */}
            {activeTab === 'leaders' && (
              <div className="space-y-6">
                <button
                  onClick={() => openAddModal('leader')}
                  className="px-5 py-2.5 rounded-full bg-gold hover:bg-gold-dark text-navy-dark hover:text-white font-bold text-xs flex items-center space-x-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Leader</span>
                </button>

                <div className="bg-white dark:bg-navy-royal rounded-3xl overflow-hidden shadow-md border border-slate-200/50 dark:border-slate-800">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-slate-50 dark:bg-navy-dark text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                      <tr>
                        <th className="p-4">Photo</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Designation</th>
                        <th className="p-4">Contact</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {leaders.map((leader) => (
                        <tr key={leader._id} className="hover:bg-slate-50/50 dark:hover:bg-navy-dark/10">
                          <td className="p-4">
                            <img src={leader.photoUrl} alt={leader.name} className="w-12 h-12 object-cover rounded-full border" />
                          </td>
                          <td className="p-4 font-bold text-navy-royal dark:text-white">{leader.name}</td>
                          <td className="p-4"><span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold">{leader.designation}</span></td>
                          <td className="p-4 text-xs text-slate-500">
                            <div>{leader.email}</div>
                            <div>{leader.phone}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center space-x-2">
                              <button onClick={() => openEditModal('leader', leader)} className="p-2 bg-blue-50 dark:bg-blue-950/20 text-blue-600 rounded-lg hover:bg-blue-100"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete('/api/leaders', leader._id)} className="p-2 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-lg hover:bg-rose-100"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. MEMBERS TAB */}
            {activeTab === 'members' && (
              <div className="space-y-6">
                <button
                  onClick={() => openAddModal('member')}
                  className="px-5 py-2.5 rounded-full bg-gold hover:bg-gold-dark text-navy-dark hover:text-white font-bold text-xs flex items-center space-x-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Member</span>
                </button>

                <div className="bg-white dark:bg-navy-royal rounded-3xl overflow-hidden shadow-md border border-slate-200/50 dark:border-slate-800">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-slate-50 dark:bg-navy-dark text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                      <tr>
                        <th className="p-4">Photo</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Village</th>
                        <th className="p-4">Role</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {members.map((member) => (
                        <tr key={member._id} className="hover:bg-slate-50/50 dark:hover:bg-navy-dark/10">
                          <td className="p-4">
                            <img src={member.photoUrl} alt={member.name} className="w-12 h-12 object-cover rounded-full border" />
                          </td>
                          <td className="p-4 font-bold text-navy-royal dark:text-white">{member.name}</td>
                          <td className="p-4 text-slate-500 font-medium">{member.village}</td>
                          <td className="p-4"><span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold">{member.designation}</span></td>
                          <td className="p-4">
                            <div className="flex items-center justify-center space-x-2">
                              <button onClick={() => openEditModal('member', member)} className="p-2 bg-blue-50 dark:bg-blue-950/20 text-blue-600 rounded-lg hover:bg-blue-100"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete('/api/members', member._id)} className="p-2 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-lg hover:bg-rose-100"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. GALLERY TAB */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <button
                  onClick={() => openAddModal('gallery')}
                  className="px-5 py-2.5 rounded-full bg-gold hover:bg-gold-dark text-navy-dark hover:text-white font-bold text-xs flex items-center space-x-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Image</span>
                </button>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {gallery.map(item => (
                    <div key={item._id} className="bg-white dark:bg-navy-royal p-4 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800 flex flex-col justify-between space-y-4">
                      <div className="h-36 rounded-xl overflow-hidden relative">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[8px] text-white font-bold uppercase tracking-wider">{item.category}</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-navy-royal dark:text-white line-clamp-1">{item.title || 'Untitled'}</h4>
                        <p className="text-[10px] text-slate-400 line-clamp-2">{item.description}</p>
                      </div>
                      <button
                        onClick={() => handleDelete('/api/gallery', item._id)}
                        className="w-full py-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. VIDEOS TAB */}
            {activeTab === 'videos' && (
              <div className="space-y-6">
                <button
                  onClick={() => openAddModal('video')}
                  className="px-5 py-2.5 rounded-full bg-gold hover:bg-gold-dark text-navy-dark hover:text-white font-bold text-xs flex items-center space-x-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Video (MP4 / Social Link)</span>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {videos.map(item => (
                    <div key={item._id} className="bg-white dark:bg-navy-royal p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800 flex flex-col justify-between space-y-4 shadow-sm">
                      <div>
                        <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-navy-dark text-[9px] text-gold font-bold uppercase tracking-widest">{item.type}</span>
                        <h3 className="font-bold text-base text-navy-royal dark:text-white mt-2.5 line-clamp-2">{item.title}</h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-3 truncate">{item.url}</p>
                      </div>
                      <button
                        onClick={() => handleDelete('/api/videos', item._id)}
                        className="w-full py-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Video</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}



            {/* 8. INBOX TAB */}
            {activeTab === 'inbox' && (
              <div className="bg-white dark:bg-navy-royal rounded-3xl overflow-hidden shadow-md border border-slate-200/50 dark:border-slate-800">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-slate-50 dark:bg-navy-dark text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="p-4">Sender</th>
                      <th className="p-4">Subject</th>
                      <th className="p-4">Message</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {contacts.map((c) => (
                      <tr key={c._id} className={`hover:bg-slate-50/50 dark:hover:bg-navy-dark/10 ${c.status === 'unread' ? 'bg-amber-500/5 font-medium' : ''}`}>
                        <td className="p-4">
                          <div className="font-bold text-slate-800 dark:text-white">{c.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{c.email}</div>
                          <div className="text-[10px] text-slate-400">{c.phone}</div>
                        </td>
                        <td className="p-4 text-navy-royal dark:text-slate-300 font-bold">{c.subject}</td>
                        <td className="p-4 text-xs max-w-xs truncate" title={c.message}>{c.message}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            c.status === 'unread' ? 'bg-amber-100 text-amber-700' : c.status === 'replied' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center space-x-2">
                            {c.status === 'unread' && (
                              <button onClick={() => handleContactStatus(c._id, 'read')} className="p-2 bg-blue-50 dark:bg-blue-950/20 text-blue-600 rounded-lg hover:bg-blue-100" title="Mark Read"><Check className="w-4 h-4" /></button>
                            )}
                            {c.status !== 'replied' && (
                              <button onClick={() => handleContactStatus(c._id, 'replied')} className="p-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-lg hover:bg-emerald-100" title="Mark Replied"><Check className="w-4 h-4" /></button>
                            )}
                            <button onClick={() => handleDelete('/api/contact', c._id)} className="p-2 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-lg hover:bg-rose-100"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 9. SETTINGS TAB */}
            {activeTab === 'settings' && settings && (
              <form onSubmit={handleSettingsSubmit} className="bg-white dark:bg-navy-royal p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800 space-y-8 shadow-sm">
                
                {settingsStatus && (
                  <div className={`p-4 rounded-xl text-sm ${
                    settingsStatus.type === 'success' ? 'bg-emerald-50 text-emerald-600' : settingsStatus.type === 'error' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {settingsStatus.msg}
                  </div>
                )}

                {/* Hero section group */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-navy-royal dark:text-white font-serif border-l-4 border-gold pl-3">Homepage Hero Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Hero Title</label>
                      <input
                        type="text"
                        value={settingsForm.heroTitle}
                        onChange={e => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-dark text-slate-800 dark:text-white border focus:ring-2 focus:ring-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Hero Subtitle</label>
                      <input
                        type="text"
                        value={settingsForm.heroSubtitle}
                        onChange={e => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-dark text-slate-800 dark:text-white border focus:ring-2 focus:ring-gold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Upload Hero Banners (Select up to 3 files to replace current slides)</label>
                    <input
                      type="file"
                      multiple
                      onChange={e => setSettingsFiles({ ...settingsFiles, heroBanners: e.target.files })}
                      className="w-full text-xs"
                    />
                  </div>
                </div>

                {/* History group */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-navy-royal dark:text-white font-serif border-l-4 border-gold pl-3">Organization Background</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">History Paragraph</label>
                      <textarea
                        rows="4"
                        value={settingsForm.history}
                        onChange={e => setSettingsForm({ ...settingsForm, history: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-dark text-slate-800 dark:text-white border focus:ring-2 focus:ring-gold text-sm"
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Core Mission</label>
                        <textarea
                          rows="3"
                          value={settingsForm.mission}
                          onChange={e => setSettingsForm({ ...settingsForm, mission: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-dark text-slate-800 dark:text-white border focus:ring-2 focus:ring-gold text-sm"
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Core Vision</label>
                        <textarea
                          rows="3"
                          value={settingsForm.vision}
                          onChange={e => setSettingsForm({ ...settingsForm, vision: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-dark text-slate-800 dark:text-white border focus:ring-2 focus:ring-gold text-sm"
                        ></textarea>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Objectives (JSON format array of strings)</label>
                      <input
                        type="text"
                        value={settingsForm.objectives}
                        onChange={e => setSettingsForm({ ...settingsForm, objectives: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-dark text-slate-800 dark:text-white border focus:ring-2 focus:ring-gold font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* President & Director messages */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-navy-royal dark:text-white font-serif border-l-4 border-gold pl-3">Leaders Messages</h3>
                  
                  {/* President Msg Block */}
                  <div className="p-4 bg-slate-50 dark:bg-navy-dark rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">President Name</label>
                        <input
                          type="text"
                          value={settingsForm.presidentName}
                          onChange={e => setSettingsForm({ ...settingsForm, presidentName: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-navy-royal text-slate-800 dark:text-white border"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">President Message</label>
                        <textarea
                          rows="3"
                          value={settingsForm.presidentMessage}
                          onChange={e => setSettingsForm({ ...settingsForm, presidentMessage: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-navy-royal text-slate-800 dark:text-white border text-sm"
                        ></textarea>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">President Photo</label>
                      <input
                        type="file"
                        onChange={e => setSettingsFiles({ ...settingsFiles, presidentPhoto: e.target.files[0] })}
                        className="text-xs"
                      />
                      {settings.presidentMessage.photoUrl && (
                        <img src={settings.presidentMessage.photoUrl} alt="pres" className="w-16 h-16 object-cover rounded mt-3 border" />
                      )}
                    </div>
                  </div>

                  {/* Legal Advisor Msg Block */}
                  <div className="p-4 bg-slate-50 dark:bg-navy-dark rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Legal Advisor Name</label>
                        <input
                          type="text"
                          value={settingsForm.directorName}
                          onChange={e => setSettingsForm({ ...settingsForm, directorName: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-navy-royal text-slate-800 dark:text-white border"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Legal Advisor Message</label>
                        <textarea
                          rows="3"
                          value={settingsForm.directorMessage}
                          onChange={e => setSettingsForm({ ...settingsForm, directorMessage: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-navy-royal text-slate-800 dark:text-white border text-sm"
                        ></textarea>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Legal Advisor Photo</label>
                      <input
                        type="file"
                        onChange={e => setSettingsFiles({ ...settingsFiles, directorPhoto: e.target.files[0] })}
                        className="text-xs"
                      />
                      {settings.directorMessage.photoUrl && (
                        <img src={settings.directorMessage.photoUrl} alt="dir" className="w-16 h-16 object-cover rounded mt-3 border" />
                      )}
                    </div>
                  </div>

                  {/* Developer/Creator Profile Msg Block */}
                  <div className="p-4 bg-slate-50 dark:bg-navy-dark rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Developer Name</label>
                        <input
                          type="text"
                          value={settingsForm.developerName}
                          onChange={e => setSettingsForm({ ...settingsForm, developerName: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-navy-royal text-slate-800 dark:text-white border"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Developer Phone Number</label>
                        <input
                          type="text"
                          value={settingsForm.developerPhone}
                          onChange={e => setSettingsForm({ ...settingsForm, developerPhone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-navy-royal text-slate-800 dark:text-white border"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Developer Photo</label>
                      <input
                        type="file"
                        onChange={e => setSettingsFiles({ ...settingsFiles, developerPhoto: e.target.files[0] })}
                        className="text-xs"
                      />
                      {settings.developerPhotoUrl && (
                        <img src={settings.developerPhotoUrl} alt="dev" className="w-16 h-16 object-cover rounded mt-3 border" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact settings group */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-navy-royal dark:text-white font-serif border-l-4 border-gold pl-3">Contact & Address details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Address</label>
                      <input
                        type="text"
                        value={settingsForm.address}
                        onChange={e => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-dark text-slate-800 dark:text-white border text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Phone 1</label>
                      <input
                        type="text"
                        value={settingsForm.phone1}
                        onChange={e => setSettingsForm({ ...settingsForm, phone1: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-dark text-slate-800 dark:text-white border text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Phone 2</label>
                      <input
                        type="text"
                        value={settingsForm.phone2}
                        onChange={e => setSettingsForm({ ...settingsForm, phone2: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-dark text-slate-800 dark:text-white border text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email Address</label>
                      <input
                        type="email"
                        value={settingsForm.email}
                        onChange={e => setSettingsForm({ ...settingsForm, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-dark text-slate-800 dark:text-white border text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">WhatsApp (Numeric, e.g. 919481234567)</label>
                      <input
                        type="text"
                        value={settingsForm.whatsapp}
                        onChange={e => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-dark text-slate-800 dark:text-white border text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Google Maps Embed URL</label>
                      <input
                        type="text"
                        value={settingsForm.googleMapsEmbedUrl}
                        onChange={e => setSettingsForm({ ...settingsForm, googleMapsEmbedUrl: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-dark text-slate-800 dark:text-white border text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-gold hover:bg-gold-dark text-navy-dark hover:text-white font-bold text-xs uppercase tracking-wider shadow"
                >
                  Save Settings Changes
                </button>
              </form>
            )}

          </div>
        )}
      </main>

      {/* CREATE / EDIT DYNAMIC MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-navy-dark/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-navy-royal w-full max-w-lg rounded-3xl p-8 relative z-10 border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Icon */}
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-rose-500"><X className="w-5 h-5" /></button>

              <h3 className="text-xl font-bold font-serif text-navy-royal dark:text-white uppercase mb-6 border-b pb-2">
                {editItem ? `Edit ${formType}` : `Add New ${formType}`}
              </h3>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                
                {/* Form fields based on formType */}
                {formType === 'leader' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Name</label>
                      <input type="text" required value={textForm.name} onChange={e => setTextForm({ ...textForm, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-navy-dark text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Designation</label>
                      <input type="text" required value={textForm.designation} onChange={e => setTextForm({ ...textForm, designation: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-navy-dark text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Phone</label>
                        <input type="text" value={textForm.phone} onChange={e => setTextForm({ ...textForm, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-navy-dark text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email</label>
                        <input type="email" value={textForm.email} onChange={e => setTextForm({ ...textForm, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-navy-dark text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description</label>
                      <textarea rows="3" value={textForm.description} onChange={e => setTextForm({ ...textForm, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-navy-dark text-xs" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Facebook Link</label>
                        <input type="text" value={textForm.facebook} onChange={e => setTextForm({ ...textForm, facebook: e.target.value })} className="w-full px-2 py-1.5 border rounded bg-slate-50 dark:bg-navy-dark text-xs" />
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Instagram Link</label>
                        <input type="text" value={textForm.instagram} onChange={e => setTextForm({ ...textForm, instagram: e.target.value })} className="w-full px-2 py-1.5 border rounded bg-slate-50 dark:bg-navy-dark text-xs" />
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">WhatsApp No</label>
                        <input type="text" value={textForm.whatsapp} onChange={e => setTextForm({ ...textForm, whatsapp: e.target.value })} className="w-full px-2 py-1.5 border rounded bg-slate-50 dark:bg-navy-dark text-xs" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Photo Upload</label>
                      <input type="file" onChange={e => setSelectedFile(e.target.files[0])} className="text-xs" />
                    </div>
                  </>
                )}

                {formType === 'member' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Name</label>
                      <input type="text" required value={textForm.name} onChange={e => setTextForm({ ...textForm, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-navy-dark text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Designation</label>
                        <input type="text" required value={textForm.designation} onChange={e => setTextForm({ ...textForm, designation: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-navy-dark text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Village/Town</label>
                        <input type="text" required value={textForm.village} onChange={e => setTextForm({ ...textForm, village: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-navy-dark text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Phone</label>
                      <input type="text" value={textForm.phone} onChange={e => setTextForm({ ...textForm, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-navy-dark text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description</label>
                      <textarea rows="3" value={textForm.description} onChange={e => setTextForm({ ...textForm, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-navy-dark text-xs" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Photo Upload</label>
                      <input type="file" onChange={e => setSelectedFile(e.target.files[0])} className="text-xs" />
                    </div>
                  </>
                )}

                {formType === 'activity' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Activity Title</label>
                      <input type="text" required value={textForm.title} onChange={e => setTextForm({ ...textForm, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-navy-dark text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description</label>
                      <textarea rows="3" required value={textForm.description} onChange={e => setTextForm({ ...textForm, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-navy-dark text-xs" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Type</label>
                        <select value={textForm.type} onChange={e => setTextForm({ ...textForm, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-navy-dark text-sm">
                          <option value="upcoming">Upcoming Event</option>
                          <option value="past">Past Campaign</option>
                          <option value="program">Social Service Program</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Date</label>
                        <input type="date" value={textForm.date} onChange={e => setTextForm({ ...textForm, date: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-navy-dark text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Image Upload</label>
                      <input type="file" onChange={e => setSelectedFile(e.target.files[0])} className="text-xs" />
                    </div>
                  </>
                )}

                {formType === 'news' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Headline</label>
                      <input type="text" required value={textForm.title} onChange={e => setTextForm({ ...textForm, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-navy-dark text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Content</label>
                      <textarea rows="5" required value={textForm.content} onChange={e => setTextForm({ ...textForm, content: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-navy-dark text-xs" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Publish Date</label>
                      <input type="date" value={textForm.date} onChange={e => setTextForm({ ...textForm, date: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-navy-dark text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Banner Image</label>
                      <input type="file" onChange={e => setSelectedFile(e.target.files[0])} className="text-xs" />
                    </div>
                  </>
                )}

                {formType === 'gallery' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Image Title</label>
                      <input type="text" value={textForm.title} onChange={e => setTextForm({ ...textForm, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-navy-dark text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Short Description</label>
                      <input type="text" value={textForm.description} onChange={e => setTextForm({ ...textForm, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-navy-dark text-xs" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category</label>
                      <select value={textForm.category} onChange={e => setTextForm({ ...textForm, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-navy-dark text-sm">
                        <option value="Social Service">Social Service</option>
                        <option value="Awareness Programs">Awareness Programs</option>
                        <option value="Meetings">Meetings</option>
                        <option value="Events">Events</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Image File *</label>
                      <input type="file" required onChange={e => setSelectedFile(e.target.files[0])} className="text-xs" />
                    </div>
                  </>
                )}

                {formType === 'video' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Video Title</label>
                      <input type="text" required value={textForm.title} onChange={e => setTextForm({ ...textForm, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-navy-dark text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Short description</label>
                      <input type="text" value={textForm.description} onChange={e => setTextForm({ ...textForm, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-navy-dark text-xs" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Video Source Type</label>
                      <select value={textForm.type} onChange={e => setTextForm({ ...textForm, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-navy-dark text-sm">
                        <option value="youtube">YouTube Link</option>
                        <option value="facebook">Facebook Link</option>
                        <option value="instagram">Instagram Reel Link</option>
                        <option value="upload">Custom MP4 Upload</option>
                      </select>
                    </div>
                    
                    {textForm.type === 'upload' ? (
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Upload MP4 File *</label>
                        <input type="file" required={!editItem} onChange={e => setSelectedFile(e.target.files[0])} className="text-xs" />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">External Link URL *</label>
                        <input type="text" placeholder="https://..." value={textForm.url} onChange={e => setTextForm({ ...textForm, url: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-navy-dark text-sm" />
                      </div>
                    )}
                  </>
                )}

                <div className="pt-4 flex justify-end space-x-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider text-slate-500">Cancel</button>
                  <button type="submit" className="px-6 py-2 rounded-xl bg-gold text-navy-dark hover:bg-gold-dark font-bold text-xs uppercase tracking-wider">Save Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
};

export default AdminDashboard;
