const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbDir = path.join(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize Sequelize with SQLite dialect
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(dbDir, 'whr_database.sqlite'),
  logging: false // Turn off console logs of SQL statements for cleaner startup
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite Database Connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the SQLite database:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
