// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// DATABASE CONNECTION (Render Managed PostgreSQL)
// ============================================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use Render external DB URL
  ssl: { rejectUnauthorized: false }         // Required for Render
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL on Render"))
  .catch(err => console.error("❌ Database connection error:", err));

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// ============================================
// EMAIL TRANSPORTER
// ============================================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,       // Set in Render environment variables
    pass: process.env.EMAIL_PASSWORD    // Set in Render environment variables
  }
});

// Make pool & transporter accessible to routes
app.locals.pool = pool;
app.locals.transporter = transporter;

// ============================================
// ROUTES
// ============================================
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/subscribe', require('./routes/subscribe'));
app.use('/api/contact', require('./routes/contact'));

// ============================================
// HELPER FUNCTIONS
// ============================================
app.locals.validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 BeautyLux Server running on port ${PORT}`);
});
