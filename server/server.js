const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8000;
const FRONTEND_URL = process.env.FRONTEND_URL;

// Updated CORS for production
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? FRONTEND_URL
    : ['http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'Renart Case Study API', 
    status: 'running',
    environment: process.env.NODE_ENV || 'development'
  });
});

const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});