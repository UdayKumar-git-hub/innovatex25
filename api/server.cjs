// api/server.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import serverless from 'serverless-http';
import dotenv from 'dotenv';

dotenv.config();

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

// ✅ Export for Vercel
export const handler = serverless(app);
