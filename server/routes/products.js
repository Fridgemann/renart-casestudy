// gold calls could be more frequent but since im working with a free api plan
// I've reduced the frequency of calls to stay within limits while still providing
// reasonably fresh data. The 30-day average is now fetched every 7 days instead of daily,
// and the current price is cached for 8 hours instead of 5 minutes.
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Cache for gold price to avoid too many API calls
let goldPriceCache = {
  price: process.env.FALLBACK_PRICE || 50, // initial fallback
  lastUpdated: 0,
  cacheExpiry: 8 * 60 * 60 * 1000, // 8 hours (was 5 minutes)
  hasSuccessfulCall: false,
  thirtyDayAverage: null,
  lastAverageUpdate: 0,
  averageUpdateExpiry: 7 * 24 * 60 * 60 * 1000 // 7 days (was 24 hours)
};

// Fetch 30-day average gold price (reduced frequency)
const fetch30DayAverage = async () => {
  try {
    // Get data for every 5 days instead of daily (6 data points instead of 30)
    const promises = [];
    for (let i = 5; i <= 30; i += 5) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      promises.push(
        fetch(`https://www.goldapi.io/api/XAU/USD/${dateString}`, {
          headers: {
            'x-access-token': process.env.GOLD_API_KEY,
            'Content-Type': 'application/json'
          }
        })
      );
    }
    
    // Fetch all data points
    const responses = await Promise.allSettled(promises);
    const prices = [];
    
    for (const response of responses) {
      if (response.status === 'fulfilled' && response.value.ok) {
        const data = await response.value.json();
        if (data.price_gram_24k) {
          prices.push(data.price_gram_24k);
        }
      }
    }
    
    // Calculate average from successful responses
    if (prices.length > 0) {
      const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;
      console.log(`30-day average calculated from ${prices.length} data points: $${average.toFixed(2)}`);
      return average;
    } else {
      console.error('No valid price data found for 30-day average');
      return null;
    }
    
  } catch (error) {
    console.error('Error fetching 30-day average:', error);
    return null;
  }
};

// Get or update 30-day average (used as smart fallback)
const get30DayAverage = async () => {
  const now = Date.now();
  
  // Use cached average if still valid (now 7 days)
  if (goldPriceCache.thirtyDayAverage && 
      now - goldPriceCache.lastAverageUpdate < goldPriceCache.averageUpdateExpiry) {
    console.log('Using cached 30-day average');
    return goldPriceCache.thirtyDayAverage;
  }
  
  // Fetch new 30-day average (uses ~6 API calls)
  console.log('Fetching fresh 30-day average...');
  const average = await fetch30DayAverage();
  if (average) {
    goldPriceCache.thirtyDayAverage = average;
    goldPriceCache.lastAverageUpdate = now;
    return average;
  }
  
  return goldPriceCache.thirtyDayAverage || parseFloat(process.env.FALLBACK_PRICE) || 50;
};

// Fetch current gold price from Gold API
const fetchGoldPrice = async () => {
  try {
    console.log('Making API call for current gold price...');
    const response = await fetch('https://www.goldapi.io/api/XAU/USD', {
      headers: {
        'x-access-token': process.env.GOLD_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      const newPrice = data.price_gram_24k;
      
      // Update cache with successful API call
      goldPriceCache.price = newPrice;
      goldPriceCache.hasSuccessfulCall = true;
      console.log(`Current gold price updated: $${newPrice.toFixed(2)}`);
      
      return newPrice;
    } else {
      console.error('Gold API error:', response.status);
      // Use 30-day average as intelligent fallback
      return goldPriceCache.hasSuccessfulCall ? 
        goldPriceCache.price : 
        await get30DayAverage();
    }
  } catch (error) {
    console.error('Error fetching gold price:', error);
    // Use 30-day average as intelligent fallback
    return goldPriceCache.hasSuccessfulCall ? 
      goldPriceCache.price : 
      await get30DayAverage();
  }
};

// Get cached or fresh gold price
const getGoldPrice = async () => {
  const now = Date.now();
  
  // Use cached price if it's still valid and we've had a successful call
  if (now - goldPriceCache.lastUpdated < goldPriceCache.cacheExpiry && goldPriceCache.hasSuccessfulCall) {
    console.log('Using cached current gold price');
    return goldPriceCache.price;
  }
  
  // Fetch new price (uses 1 API call)
  const newPrice = await fetchGoldPrice();
  goldPriceCache.lastUpdated = now;
  
  return newPrice;
};

// Load products from JSON file
const getProducts = async () => {
  try {
    const filePath = path.join(__dirname, '../data/products.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const products = JSON.parse(jsonData);
    
    // Get real-time gold price
    const goldPrice = await getGoldPrice();

    return products.map(product => ({
        ...product,
        price: calculatePrice(product.weight, product.popularityScore, goldPrice)
    }));
  } catch (error) {
    console.error('Error reading products.json:', error);
    return [];
  }
};

// Price calculation function
const calculatePrice = (weight, popularityScore, goldPrice) => {
  return ((popularityScore + 1) * weight * goldPrice).toFixed(2);
};

router.get('/', async (req, res) => {
  const products = await getProducts();
  res.json(products);
});

module.exports = router;
