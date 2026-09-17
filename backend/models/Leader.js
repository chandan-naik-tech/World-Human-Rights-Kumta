const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Leader = sequelize.define('Leader', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  photoUrl: {
    type: DataTypes.STRING,
    defaultValue: '/uploads/default-avatar.png'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Flattened social links
  facebook: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  instagram: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  whatsapp: {
    type: DataTypes.STRING,
    defaultValue: ''
  }
});

module.exports = Leader;
