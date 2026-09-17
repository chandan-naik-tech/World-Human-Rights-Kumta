const { sequelize } = require('../config/db');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load models
const { Admin, Leader, Member, Gallery, Video, Activity, News, Settings } = require('../models');

dotenv.config({ path: path.join(__dirname, '../.env') });

const leadersData = [
  {
    name: 'Dr. Ram Kumar',
    designation: 'President',
    phone: '+91 94812 34567',
    email: 'president@worldhumanrights.org',
    description: 'Dr. Ram Kumar has spent over two decades working in grassroots social work and community development. As the President of the WHR RK Foundation, he directs our central strategy, coordinates with international teams, and spearheads local social outreach.',
    photoUrl: '/uploads/default-avatar.png',
    facebook: 'https://facebook.com', instagram: 'https://instagram.com', whatsapp: '919481234567'
  },
  {
    name: 'Adv. Suresh Naik',
    designation: 'Director',
    phone: '+91 94812 34568',
    email: 'director@worldhumanrights.org',
    description: 'A practicing Senior Advocate with a focus on public interest litigation and civil liberties. Adv. Suresh Naik leads our legal advisory cell, coordinating pro-bono defense, legal literacy programs, and judicial advocacy.',
    photoUrl: '/uploads/default-avatar.png',
    facebook: 'https://facebook.com', instagram: 'https://instagram.com', whatsapp: '919481234568'
  },
  {
    name: 'Lord George Hastings',
    designation: 'World President',
    phone: '+44 20 7946 0958',
    email: 'world.president@worldhumanrights.org',
    description: 'Based in London, Lord George Hastings coordinates international partnerships, oversees human rights monitoring frameworks across global regions, and leads advocacy efforts at international forums.',
    photoUrl: '/uploads/default-avatar.png',
    facebook: 'https://facebook.com', instagram: 'https://instagram.com', whatsapp: '442079460958'
  },
  {
    name: 'Dr. Ravindra Nath',
    designation: 'National President',
    phone: '+91 11 2345 6789',
    email: 'national.president@worldhumanrights.org',
    description: 'Dr. Ravindra Nath is an author and retired civil servant who oversees organizational divisions, national campaigns, policy research, and administrative affairs across India.',
    photoUrl: '/uploads/default-avatar.png',
    facebook: 'https://facebook.com', instagram: 'https://instagram.com', whatsapp: '911123456789'
  },
  {
    name: 'Adv. K. R. Shastri',
    designation: 'District Legal Advisor',
    phone: '+91 94812 34569',
    email: 'shastri.legal@worldhumanrights.org',
    description: 'Coordinates district-level legal defense frameworks, runs legal aid clinics for rural communities, and counsels local authorities on civil rights obligations.',
    photoUrl: '/uploads/default-avatar.png',
    facebook: 'https://facebook.com', instagram: 'https://instagram.com', whatsapp: '919481234569'
  },
  {
    name: 'Sri. Venkatraman Gouda',
    designation: 'Taluk President',
    phone: '+91 94812 34570',
    email: 'kumta.president@worldhumanrights.org',
    description: 'Responsible for leading the Kumta Taluk division, mobilizing local community members, and managing all social service drives and grievance meetings.',
    photoUrl: '/uploads/default-avatar.png',
    facebook: 'https://facebook.com', instagram: 'https://instagram.com', whatsapp: '919481234570'
  },
  {
    name: 'Sri. Shripad Naik',
    designation: 'Taluk Vice President',
    phone: '+91 94812 34571',
    email: 'kumta.vp@worldhumanrights.org',
    description: 'Assists the Taluk President in managing local services, organizing operations, and keeping track of developmental programs.',
    photoUrl: '/uploads/default-avatar.png',
    facebook: 'https://facebook.com', instagram: 'https://instagram.com', whatsapp: '919481234571'
  },
  {
    name: 'Sri. Prabhakar Patgar',
    designation: 'Coordinator',
    phone: '+91 94812 34572',
    email: 'coord.kumta@worldhumanrights.org',
    description: 'Directs logistics, coordinates volunteers, and organizes setups for events, meetings, and awareness rallies.',
    photoUrl: '/uploads/default-avatar.png',
    facebook: 'https://facebook.com', instagram: 'https://instagram.com', whatsapp: '919481234572'
  },
  {
    name: 'Sri. Satish Naik',
    designation: 'Secretary',
    phone: '+91 94812 34573',
    email: 'sec.kumta@worldhumanrights.org',
    description: 'Manages administrative records, logs meeting minutes, maintains official correspondence, and handles member documentation.',
    photoUrl: '/uploads/default-avatar.png',
    facebook: 'https://facebook.com', instagram: 'https://instagram.com', whatsapp: '919481234573'
  },
  {
    name: 'Adv. Priti Hegde',
    designation: 'Lawyer',
    phone: '+91 94812 34574',
    email: 'priti.legal@worldhumanrights.org',
    description: 'A dedicated human rights lawyer focused on women and children rights. Offers free consultations and legal advocacy.',
    photoUrl: '/uploads/default-avatar.png',
    facebook: 'https://facebook.com', instagram: 'https://instagram.com', whatsapp: '919481234574'
  },
  {
    name: 'Sri. Umesh Shetty',
    designation: 'District Member',
    phone: '+91 94812 34575',
    email: 'umesh.member@worldhumanrights.org',
    description: 'Represents regional concerns at district forums, reviews local issues, and aids in resource mobilization.',
    photoUrl: '/uploads/default-avatar.png',
    facebook: 'https://facebook.com', instagram: 'https://instagram.com', whatsapp: '919481234575'
  }
];

// Exactly 18 members
const membersData = [
  { name: 'Ramesh Gowda', designation: 'Taluk Member', village: 'Kumta', phone: '+91 91011 12131', description: 'Active in community welfare, public dispute resolution, and local campaigns.', photoUrl: '/uploads/default-avatar.png' },
  { name: 'Savitha Patgar', designation: 'District Member', village: 'Karwar', phone: '+91 91011 12132', description: 'Leads local women empowerment workshops and self-help group programs.', photoUrl: '/uploads/default-avatar.png' },
  { name: 'Ganesh Naik', designation: 'Village Coordinator', village: 'Hegde', phone: '+91 91011 12133', description: 'Manages environmental preservation awareness and volunteer actions.', photoUrl: '/uploads/default-avatar.png' },
  { name: 'Laxmi Harikantra', designation: 'Social Worker', village: 'Mirjan', phone: '+91 91011 12134', description: 'Assists fishermen cooperatives and local families with government aid programs.', photoUrl: '/uploads/default-avatar.png' },
  { name: 'Manjunath Bhandari', designation: 'Legal Advisor Taluk', village: 'Kumta', phone: '+91 91011 12135', description: 'Provides legal aid to marginal farmers and small-scale traders.', photoUrl: '/uploads/default-avatar.png' },
  { name: 'Prema Madival', designation: 'Committee Member', village: 'Gokarna', phone: '+91 91011 12136', description: 'Coordinates sanitation, health check-up campaigns, and pilgrim services.', photoUrl: '/uploads/default-avatar.png' },
  { name: 'Abdul Rasheed', designation: 'District Coordinator', village: 'Bhatkal', phone: '+91 91011 12137', description: 'Manages multi-cultural dialogue, education drives, and youth engagement.', photoUrl: '/uploads/default-avatar.png' },
  { name: 'Deepa Naik', designation: 'Taluk Secretary', village: 'Honnavar', phone: '+91 91011 12138', description: 'Maintains local records, organizes health clinics, and maps village needs.', photoUrl: '/uploads/default-avatar.png' },
  { name: 'Vignesh Hegde', designation: 'Social Service Head', village: 'Sirsi', phone: '+91 91011 12139', description: 'Supervises blood bank databases, coordinates medical drives.', photoUrl: '/uploads/default-avatar.png' },
  { name: 'Anita Fernandes', designation: 'Committee Coordinator', village: 'Yellapur', phone: '+91 91011 12140', description: 'Supports forest-dwelling communities and runs primary education tutorials.', photoUrl: '/uploads/default-avatar.png' },
  { name: 'Satish Shetty', designation: 'District Advisor', village: 'Kumta', phone: '+91 91011 12141', description: 'Advises on regional development, legal workshops, and safety reviews.', photoUrl: '/uploads/default-avatar.png' },
  { name: 'Kavitha Gouda', designation: 'Women Wing Representative', village: 'Ankola', phone: '+91 91011 12142', description: 'Organizes vocational training classes, handles local domestic queries.', photoUrl: '/uploads/default-avatar.png' },
  { name: 'Prakash Achari', designation: 'Youth Representative', village: 'Kumta', phone: '+91 91011 12143', description: 'Mobilizes college students for blood donations and disaster management.', photoUrl: '/uploads/default-avatar.png' },
  { name: 'Rekha Bhat', designation: 'Public Relations Officer', village: 'Karwar', phone: '+91 91011 12144', description: 'Manages press relationships, draft alerts, and prints quarterly reports.', photoUrl: '/uploads/default-avatar.png' },
  { name: 'Raghavendra Devadiga', designation: 'Taluk Treasurer', village: 'Honnavar', phone: '+91 91011 12145', description: 'Tracks local donations, manages accounts, and releases service funds.', photoUrl: '/uploads/default-avatar.png' },
  { name: 'Geeta Patgar', designation: 'Human Rights Advocate', village: 'Kumta', phone: '+91 91011 12146', description: 'Coordinates rights-literacy pamphlets, leads village street plays.', photoUrl: '/uploads/default-avatar.png' },
  { name: 'Anand Mesta', designation: 'Community Coordinator', village: 'Mirjan', phone: '+91 91011 12147', description: 'Coordinates public toilet upkeep, clean water drives, and local sanitations.', photoUrl: '/uploads/default-avatar.png' },
  { name: 'Sunita Naik', designation: 'Taluk Committee Member', village: 'Hegde', phone: '+91 91011 12148', description: 'Organizes village library networks and senior health check-ups.', photoUrl: '/uploads/default-avatar.png' }
];

const galleryData = [
  { title: 'Blood Donation Camp 2026', description: 'Organized in Kumta town hall where 120+ units of blood were collected.', category: 'Social Service', imageUrl: 'https://images.unsplash.com/photo-1615461066841-6116ecdccd04?q=80&w=800&auto=format&fit=crop' },
  { title: 'Legal Awareness Seminar', description: 'Educating citizens on fundamental rights and legal options.', category: 'Awareness Programs', imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop' },
  { title: 'Food Distribution Drive', description: 'Distributing essential groceries to underprivileged families in villages.', category: 'Social Service', imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop' },
  { title: 'Annual General Body Meeting', description: 'Discussing goals and strategies with all national and state coordinators.', category: 'Meetings', imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop' },
  { title: 'Outstanding Service Award Ceremony', description: 'WHR receiving recognition for outstanding community legal service.', category: 'Events', imageUrl: 'https://images.unsplash.com/photo-1531058020387-3be344559767?q=80&w=800&auto=format&fit=crop' },
  { title: 'World Human Rights Day Rally', description: 'Public rally to mark Human Rights Day with slogans and placards.', category: 'Events', imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop' }
];

const videosData = [
  { title: 'Human Rights Awareness Campaign', description: 'A short documentary on individual rights and the constitution.', type: 'youtube', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  { title: 'Social Service Activity Highlights', description: 'Highlights of social service activities from 2025.', type: 'youtube', url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk' }
];

const activitiesData = [
  { title: 'Free Medical Checkup Camp', description: 'A free general health checkup and medicine distribution camp for village residents.', type: 'program', date: new Date('2026-06-10'), imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop' },
  { title: 'Legal Literacy Workshop', description: 'Advocates educating women and underprivileged families on civil remedies.', type: 'past', date: new Date('2026-05-15'), imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=800&auto=format&fit=crop' },
  { title: 'Upcoming Blood Donation Drive', description: 'Scheduled at the Kumta office. We invite volunteers to donate blood.', type: 'upcoming', date: new Date('2026-08-25'), imageUrl: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=800&auto=format&fit=crop' }
];

const newsData = [
  { title: 'WHR Opens New Legal Clinic', content: 'In our quest to offer accessible justice, a new daily legal aid clinic is open in Kumta, running every evening. Citizens can drop by for free counsel on family disputes, civil rights, land concerns, and public services.', date: new Date('2026-07-01'), imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=800&auto=format&fit=crop' },
  { title: 'Campaign for Girl Child Education Launched', content: 'Our state unit launched the "Beti Padhao" campaign in regional schools, distributing free bags, notebooks, and offering scholarships to girls from underprivileged backgrounds.', date: new Date('2026-06-20'), imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop' }
];

const seedDB = async () => {
  try {
    // Authenticate first
    await sequelize.authenticate();
    console.log('Seeder authenticated with SQLite database.');

    // 1. Backup old database if exists before clearing
    const dbPath = path.join(__dirname, '../database/whr_database.sqlite');
    if (fs.existsSync(dbPath)) {
      const backupPath = `${dbPath}.bak-${Date.now()}`;
      fs.copyFileSync(dbPath, backupPath);
      console.log(`\n--- DATABASE BACKED UP SUCCESSFULLY ---`);
      console.log(`Location: ${backupPath}`);
      console.log(`----------------------------------------\n`);
    }

    // Clear database and create tables via force sync
    console.log('Re-syncing database tables (dropping old ones if any)...');
    await sequelize.sync({ force: true });

    // 2. Create Admin Account
    console.log('Seeding Admin account...');
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin12345';
    
    await Admin.create({
      username: adminUsername,
      email: 'admin@worldhumanrights.org',
      password: adminPassword, // Hooks hash this automatically
      name: 'Central Admin Team',
      role: 'admin'
    });
    console.log(`Admin account created successfully! Username: ${adminUsername}, Password: ${adminPassword}`);

    // 3. Create Settings
    console.log('Seeding organization settings...');
    await Settings.create({}); // Schema defaults populate this automatically

    // 4. Seed Leaders
    console.log('Seeding Leader profiles...');
    await Leader.bulkCreate(leadersData);

    // 5. Seed Members (18 members)
    console.log('Seeding 18 Member profiles...');
    await Member.bulkCreate(membersData);

    // 6. Seed Gallery
    console.log('Seeding Gallery items...');
    await Gallery.bulkCreate(galleryData);

    // 7. Seed Videos
    console.log('Seeding Videos...');
    await Video.bulkCreate(videosData);

    // 8. Seed Activities
    console.log('Seeding Activities...');
    await Activity.bulkCreate(activitiesData);

    // 9. Seed News
    console.log('Seeding News articles...');
    await News.bulkCreate(newsData);

    console.log('SQLite Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
