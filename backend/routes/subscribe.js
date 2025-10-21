const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { email } = req.body;
  const pool = req.app.locals.pool;
  const validateEmail = req.app.locals.validateEmail;

  if (!email || !validateEmail(email))
    return res.status(400).json({ success: false, message: 'Invalid email address' });

  try {
    const existing = await pool.query('SELECT * FROM newsletter_subscribers WHERE email = $1', [email]);
    if (existing.rows.length > 0)
      return res.status(400).json({ success: false, message: 'Email already subscribed' });

    await pool.query('INSERT INTO newsletter_subscribers (email) VALUES ($1)', [email]);

    // Send welcome email
    const transporter = req.app.locals.transporter;
    if (transporter) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to BeautyLux!',
        html: `<h1>Welcome to BeautyLux!</h1><p>Thank you for subscribing to our newsletter.</p>`
      };
      transporter.sendMail(mailOptions, err => { if (err) console.log(err); });
    }

    res.json({ success: true, message: 'Successfully subscribed to newsletter' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

module.exports = router;
