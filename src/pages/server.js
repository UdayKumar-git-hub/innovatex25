// File: server.js
// --- Dependencies ---
// Run `npm install express node-fetch cors dotenv` to install these.

const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// --- Middleware ---
app.use(express.json()); // To parse JSON request bodies
app.use(cors({
  // In production, restrict this to your frontend's domain for security
  // e.g., origin: 'https://your-live-website.com'
  origin: '*' 
}));

// --- Configuration ---
const {
  PORT,
  CASHFREE_APP_ID,
  CASHFREE_SECRET_KEY,
  CASHFREE_API_ENV,
  RETURN_URL
} = process.env;

// Validate that critical environment variables are set
if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
  console.error("FATAL ERROR: Cashfree credentials are not defined in the .env file.");
  process.exit(1); // Exit if critical configuration is missing
}

// Determine the correct API endpoint based on the environment
const CASHFREE_API_BASE_URL = CASHFREE_API_ENV === 'production'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg';

const CASHFREE_API_URL = `${CASHFREE_API_BASE_URL}/orders`;

// --- API Endpoint: Create Cashfree Order ---
app.post('/api/create-cashfree-order', async (req, res) => {
    try {
        // Data sent from the React frontend
        const { order_amount, order_id, customer_details } = req.body;

        // Basic validation
        if (!order_amount || !order_id || !customer_details) {
            return res.status(400).json({ error: 'Missing required order details.' });
        }

        const response = await fetch(CASHFREE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-version': '2022-09-01',
                'x-client-id': CASHFREE_APP_ID,
                'x-client-secret': CASHFREE_SECRET_KEY,
            },
            body: JSON.stringify({
                order_id: order_id,
                order_amount: order_amount,
                order_currency: 'INR',
                customer_details: customer_details,
                order_meta: {
                    // This URL is where the user is sent after some payments.
                    // You must build a page to handle this and verify the payment status.
                    return_url: `${RETURN_URL}?order_id=${order_id}`
                }
            }),
        });

        const data = await response.json();

        if (!response.ok || data.type === 'error') {
            console.error('Cashfree API Error:', data.message || data);
            return res.status(response.status).json({ error: data.message || 'An error occurred with the payment provider.' });
        }
        
        // Success! Send the session ID back to the frontend.
        res.status(200).json({ payment_session_id: data.payment_session_id });

    } catch (error) {
        console.error('Internal Server Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// --- Start Server ---
const port = PORT || 3001;
app.listen(port, () => console.log(`✅ Server is running on port ${port}`));
