// emails.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send welcome email to new subscriber
function sendWelcomeEmail(email) {
  if (!process.env.EMAIL_USER) return;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to BeautyLux!',
    html: `
      <h1>Welcome to BeautyLux!</h1>
      <p>Thank you for subscribing to our newsletter.</p>
      <p>Stay tuned for exclusive offers and beauty tips!</p>
    `
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log('❌ Welcome email error:', err);
    else console.log('✅ Welcome email sent:', info.response);
  });
}

// Export all email functions
module.exports = { sendWelcomeEmail };
