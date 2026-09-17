const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database & Sync schemas
connectDB().then(() => {
  sequelize.sync();
});

const app = express();

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  res.on('finish', () => {
    console.log(`[${new Date().toLocaleTimeString()}] Response Status: ${res.statusCode}`);
  });
  next();
});

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false // Allow loading images in frontend
}));

// CORS Configuration
app.use(cors({
  origin: '*', // For dev simplicity; modify for production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Uploads Folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate Limiting (Increased threshold to prevent admin rate limiting during data entry)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Limit each IP to 10000 requests per window
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api', limiter);

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/leaders', require('./routes/leaderRoutes'));
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

// Frontend error logger endpoint
app.post('/api/log-error', (req, res) => {
  console.log('\n--- FRONTEND JS ERROR DETECTED ---');
  console.log('Message:', req.body.message);
  console.log('Stack:', req.body.stack);
  console.log('-----------------------------------\n');
  res.status(200).json({ success: true });
});

// Root path handler
app.get('/', (req, res) => {
  res.send('World Human Rights Organization API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
