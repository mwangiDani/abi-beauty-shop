const express = require('express');
const router = express.Router();

let orders = [];

router.post('/', (req, res) => {
  const { items, customerInfo, totalAmount } = req.body;
  if (!items || !customerInfo || !totalAmount)
    return res.status(400).json({ success: false, message: 'Missing required fields' });

  const order = { id: orders.length + 1, items, customerInfo, totalAmount, status: 'pending', createdAt: new Date() };
  orders.push(order);

  // Send confirmation email
  const transporter = req.app.locals.transporter;
  if (transporter) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerInfo.email,
      subject: 'BeautyLux - Order Confirmation',
      html: `<h1>Thank you for your order!</h1><p>Order ID: ${order.id}</p><p>Total Amount: $${order.totalAmount}</p>`
    };
    transporter.sendMail(mailOptions, err => { if (err) console.log(err); });
  }

  res.status(201).json({ success: true, message: 'Order created successfully', data: order });
});

module.exports = router;
