const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Video = sequelize.define('Video', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['upload', 'youtube', 'facebook', 'instagram']]
    }
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Video;
