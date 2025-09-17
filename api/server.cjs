// A secure Express.js backend server for Vercel

const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config(); // Loads .env file for local development

const app = express();

// --- Configuration ---
// These values MUST be set in your Vercel Project Settings > Environment Variables
const FRONTEND_URL = process.env.FRONTEND_URL;
const API_ENV = process.env.CASHFREE_API_ENV || 'sandbox';
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

const CASHFREE_API_URL = API_ENV === 'production'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

// --- Middleware ---
// Sets up CORS to only allow requests from your frontend's domain
const corsOptions = {
  origin: FRONTEND_URL
};
app.use(cors(corsOptions));

// Parses incoming JSON request bodies
app.use(express.json());

// --- API Routes ---

/**
 * @route GET /api/health
 * @description A simple health check endpoint to confirm the server is running.
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

/**
 * @route POST /api/create-payment-order
 * @description Creates a new payment order with Cashfree.
 */
app.post('/api/create-payment-order', async (req, res) => {
  try {
    const { order_amount, customer_details } = req.body;

    // Basic validation
    if (!order_amount || !customer_details) {
      return res.status(400).json({ message: 'Missing required order details.' });
    }

    // Call the Cashfree API
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

    const data = await response.json();

    // Handle errors from Cashfree's API
    if (!response.ok) {
        console.error('Cashfree API Error:', data);
        return res.status(response.status).json({ message: data.message || 'Failed to create payment session.' });
    }
    
    // Send the successful response back to the frontend
    res.status(200).json(data);

  } catch (error) {
    console.error('Server Error creating payment order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// --- Vercel Export ---
// This line makes the Express app available for Vercel's serverless environment.
module.exports = app;