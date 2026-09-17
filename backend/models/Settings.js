const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Settings = sequelize.define('Settings', {
  heroTitle: {
    type: DataTypes.STRING,
    defaultValue: 'WORLD HUMAN RIGHTS'
  },
  heroSubtitle: {
    type: DataTypes.STRING,
    defaultValue: 'WHR RK FOUNDATIONS KUMTA, U.K. - Official Human Rights and Social Service Organization'
  },
  heroBanners: {
    type: DataTypes.TEXT,
    defaultValue: JSON.stringify([
      '/uploads/default-banner1.jpg',
      '/uploads/default-banner2.jpg',
      '/uploads/default-banner3.jpg'
    ]),
    get() {
      const rawValue = this.getDataValue('heroBanners');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('heroBanners', JSON.stringify(value));
    }
  },
  history: {
    type: DataTypes.TEXT,
    defaultValue: 'World Human Rights (WHR RK Foundations Kumta, U.K.) was established with a clear mandate to protect human rights, serve society, and advocate for justice. Under the leadership of local, national, and international visionaries, our organization works continuously to provide legal support, raise social awareness, organize blood drives, and coordinate emergency response initiatives for those in need.'
  },
  mission: {
    type: DataTypes.TEXT,
    defaultValue: 'To defend human rights, secure dignity, empower weak and vulnerable groups, raise civic awareness, and offer immediate legal and community assistance to those facing injustice or hardship.'
  },
  vision: {
    type: DataTypes.TEXT,
    defaultValue: 'To create a society built on equality, mutual respect, and peace, where every individual has complete access to their civil, political, economic, social, and cultural rights.'
  },
  objectives: {
    type: DataTypes.TEXT,
    defaultValue: JSON.stringify([
      'To provide free legal advice and representation to underprivileged groups.',
      'To coordinate social service programs including blood donation drives, health checkups, and disaster relief.',
      'To raise civic awareness through seminars, meetings, and academic programs.',
      'To monitor and report human rights violations locally, nationally, and internationally.'
    ]),
    get() {
      const rawValue = this.getDataValue('objectives');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('objectives', JSON.stringify(value));
    }
  },
  // Flattened President Message
  presidentName: {
    type: DataTypes.STRING,
    defaultValue: 'Dr. Ram Kumar'
  },
  presidentPhotoUrl: {
    type: DataTypes.STRING,
    defaultValue: '/uploads/default-avatar.png'
  },
  presidentMessage: {
    type: DataTypes.TEXT,
    defaultValue: 'Dear friends, our foundation stands as a shield for the voiceless. We welcome you to join our network of activists dedicated to justice, equality, and human service.'
  },
  // Flattened Director Message
  directorName: {
    type: DataTypes.STRING,
    defaultValue: 'Adv. Suresh Naik'
  },
  directorPhotoUrl: {
    type: DataTypes.STRING,
    defaultValue: '/uploads/default-avatar.png'
  },
  directorMessage: {
    type: DataTypes.TEXT,
    defaultValue: 'Legal literacy is our primary tool. Our mission is to educate every citizen on their fundamental rights and provide them with concrete tools to secure justice.'
  },
  // Flattened Contact Details
  address: {
    type: DataTypes.STRING,
    defaultValue: 'WHR RK Foundations Office, Kumta, Uttara Kannada, Karnataka, India - 581343'
  },
  phone1: {
    type: DataTypes.STRING,
    defaultValue: '+91 9481234567'
  },
  phone2: {
    type: DataTypes.STRING,
    defaultValue: '+91 9481234568'
  },
  email: {
    type: DataTypes.STRING,
    defaultValue: 'info@worldhumanrights.org'
  },
  whatsapp: {
    type: DataTypes.STRING,
    defaultValue: '919481234567'
  },
  googleMapsEmbedUrl: {
    type: DataTypes.TEXT,
    defaultValue: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3869.643360408544!2d74.41738727579626!3d14.419022681577717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbc18b84319489b%3A0xc48de1d56e7d6928!2sKumta%2C%20Karnataka%20581343!5e0!3m2!1sen!2sin!4v1710500000000!5m2!1sen!2sin'
  },
  developerName: {
    type: DataTypes.STRING,
    defaultValue: 'WHR Developer'
  },
  developerPhone: {
    type: DataTypes.STRING,
    defaultValue: '+91 9876543210'
  },
  developerPhotoUrl: {
    type: DataTypes.STRING,
    defaultValue: '/uploads/default-avatar.png'
  }
});

module.exports = Settings;
