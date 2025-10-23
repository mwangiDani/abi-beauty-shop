const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// DATABASE CONNECTION (PostgreSQL)
// ============================================
console.log("DEBUG: DATABASE_URL =", process.env.DATABASE_URL);
console.log("DEBUG: DB_SSL =", process.env.DB_SSL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch(err => console.error("❌ Database connection error:", err));

// Make pool available in routes
app.locals.pool = pool;

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ============================================
// EMAIL TRANSPORTER
// ============================================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

app.locals.transporter = transporter;
app.locals.validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ============================================
// API ROUTES
// ============================================
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/subscribe', require('./routes/subscribe'));
app.use('/api/contact', require('./routes/contact'));

// ============================================
// SERVE FRONTEND (React)
// ============================================
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Fallback to index.html for non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 BeautyLux Server running on port ${PORT}`);
});
