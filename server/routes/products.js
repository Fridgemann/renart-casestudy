const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Load products from JSON file
const getProducts = () => {
  try {
    const filePath = path.join(__dirname, '../data/products.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const products = JSON.parse(jsonData);

    return products.map(product => ({
        ...product,
        price: calculatePrice(product.weight, product.popularityScore, goldPrice = 50)
    }));
  } catch (error) {
    console.error('Error reading products.json:', error);
    return [];
  }
};

// Price calculation function
const calculatePrice = (weight, popularityScore, goldPrice) => {
  return ((popularityScore + 1) * weight * goldPrice).toFixed(2);
}

router.get('/', (req, res) => {
  const products = getProducts();
  res.json(products);
});

module.exports = router;
