const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;
  const pool = req.app.locals.pool;
  const validateEmail = req.app.locals.validateEmail;

  if (!firstName || !lastName || !email || !subject || !message)
    return res.status(400).json({ success: false, message: 'All fields are required' });

  if (!validateEmail(email))
    return res.status(400).json({ success: false, message: 'Invalid email' });

  try {
    const result = await pool.query(
      `INSERT INTO contact_messages (first_name, last_name, email, subject, message, created_at) 
       VALUES ($1,$2,$3,$4,$5,NOW()) RETURNING *`,
      [firstName, lastName, email, subject, message]
    );

    // Send notification email
    const transporter = req.app.locals.transporter;
    if (transporter) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `New Contact Message: ${subject}`,
        html: `<p>From: ${firstName} ${lastName}</p><p>Email: ${email}</p><p>Message: ${message}</p>`
      };
      transporter.sendMail(mailOptions, err => { if (err) console.log(err); });
    }

    res.json({ success: true, message: 'Message sent successfully', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

module.exports = router;
