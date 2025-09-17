// File: /api/server.cjs

const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- Configuration from .env file ---
// Vercel will provide the PORT, so we don't need it here.
const FRONTEND_URL = process.env.FRONTEND_URL;
const API_ENV = process.env.CASHFREE_API_ENV || 'sandbox';
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

const CASHFREE_API_URL = API_ENV === 'production' 
    ? 'https://api.cashfree.com/pg' 
    : 'https://sandbox.cashfree.com/pg';

// --- Middleware ---
// Allow requests from your frontend URL
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// --- Route to Check Server Health ---
// Vercel rewrites /api/health to this function
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// --- Route to Create Payment Order ---
// Vercel rewrites /api/create-payment-order to this function
app.post('/api/create-payment-order', async (req, res) => {
  try {
    const { order_amount, customer_details } = req.body;

    if (!order_amount || !customer_details) {
      return res.status(400).json({ message: 'Missing required order details.' });
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
        order_amount: order_amount,
        order_currency: "INR",
        customer_details: customer_details,
        order_meta: {
          return_url: `${FRONTEND_URL}/success?order_id={order_id}`
        }
      }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Cashfree API Error:', errorData);
        return res.status(response.status).json({ message: errorData.message || 'Failed to create payment session.' });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Server Error creating payment order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ❌ REMOVE THIS LINE: app.listen(PORT, () => { ... });

// ✅ ADD THIS LINE: This exports the app for Vercel to use.
module.exports = app;