const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');
const serverless = require('serverless-http');
require('dotenv').config();

const app = express();

// --- Config ---
const FRONTEND_URL = process.env.FRONTEND_URL || '*';
const API_ENV = process.env.CASHFREE_API_ENV || 'sandbox';
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

const CASHFREE_API_URL =
  API_ENV === 'production'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

// --- Middleware ---
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// --- Serve React build ---
const DIST_DIR = path.join(__dirname, '../dist');
app.use(express.static(DIST_DIR));

// --- Health Route ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// --- Payment Route ---
app.post('/api/create-payment-order', async (req, res) => {
  try {
    const { order_amount, customer_details } = req.body;

    if (!order_amount || !customer_details) {
      return res.status(400).json({ message: 'Missing order details' });
    }

    const response = await fetch(`${CASHFREE_API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
        'x-api-version': '2022-09-01',
      },
      body: JSON.stringify({
        order_id: `INNOVATEX-SVR-${Date.now()}`,
        order_amount,
        order_currency: 'INR',
        customer_details,
        order_meta: {
          return_url: `${FRONTEND_URL}/success?order_id={order_id}`,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ message: errorData.message });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// --- SPA fallback (React Router) ---
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// ✅ Export for Vercel
module.exports = serverless(app);
