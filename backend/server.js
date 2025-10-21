// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// DATABASE CONNECTION
// ============================================
const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "beautylux_db",
  user: "postgres",
  password: "2005"
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
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
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
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
  console.log(`📍 http://localhost:${PORT}`);
});
