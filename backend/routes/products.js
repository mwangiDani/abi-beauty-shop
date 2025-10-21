const express = require('express');
const router = express.Router();

// Sample products (can later fetch from DB)
let products = [
  { id: 1, name: "Radiance Serum", category: "Skincare", price: 68, stock: 50 },
  { id: 2, name: "Velvet Lipstick", category: "Makeup", price: 32, stock: 100 },
  { id: 3, name: "Hydrating Mist", category: "Skincare", price: 45, stock: 75 }
];

// Get all products
router.get('/', (req, res) => res.json({ success: true, data: products }));

// Get single product
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, data: product });
});

// Search products
router.get('/search/:query', (req, res) => {
  const query = req.params.query.toLowerCase();
  const results = products.filter(
    p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
  );
  res.json({ success: true, data: results });
});

module.exports = router;
