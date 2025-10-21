const pool = require('../db');
const { sendContactNotification } = require('../utils/email');

exports.submitContactForm = async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  if (!firstName || !lastName || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO contact_messages (first_name, last_name, email, subject, message, created_at, status)
       VALUES ($1,$2,$3,$4,$5,NOW(),'unread') RETURNING *`,
      [firstName, lastName, email, subject, message]
    );

    sendContactNotification(result.rows[0]);
    res.json({ success: true, message: 'Message sent successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ success: false, message: 'Failed to save message' });
  }
};
