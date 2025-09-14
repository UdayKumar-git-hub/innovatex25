// File: backend/server.js
// --- Dependencies ---
// Run `npm install express cors node-fetch@2 dotenv nodemon` in the 'backend' folder.

const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// --- Middleware ---
app.use(express.json()); // To parse JSON request bodies

// CORS Configuration to allow requests from your frontend
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Your frontend's URL
};
app.use(cors(corsOptions));

// --- Configuration ---
const CASHFREE_CLIENT_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_CLIENT_SECRET = process.env.CASHFREE_SECRET_KEY;

// Determine API URL based on environment (sandbox or production)
const isProd = process.env.CASHFREE_API_ENV === 'production';
const CASHFREE_API_URL = isProd
    ? 'https://api.cashfree.com/pg/orders'
    : 'https://sandbox.cashfree.com/pg/orders';

// --- API Endpoints ---

// Health check endpoint for debugging frontend-backend connection
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

// Endpoint to create a Cashfree payment order
app.post('/api/create-cashfree-order', async (req, res) => {
    try {
        const { order_amount, order_id, customer_details } = req.body;

        if (!order_amount || !order_id || !customer_details) {
            return res.status(400).json({ error: 'Missing required order details.' });
        }

        const response = await fetch(CASHFREE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-version': '2023-08-01', // Use a recent, valid API version
                'x-client-id': CASHFREE_CLIENT_ID,
                'x-client-secret': CASHFREE_CLIENT_SECRET,
            },
            body: JSON.stringify({
                order_id: order_id,
                order_amount: order_amount,
                order_currency: 'INR',
                customer_details: customer_details,
                order_meta: {
                    return_url: `${process.env.RETURN_URL}?order_id=${order_id}`
                }
            }),
        });

        const data = await response.json();

        if (!response.ok || data.type === 'error') {
            console.error('Cashfree API Error:', data);
            return res.status(response.status).json({ error: data.message || 'An error occurred with the payment provider.' });
        }

        res.status(200).json({ payment_session_id: data.payment_session_id });

    } catch (error) {
        console.error('Internal Server Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// --- Start Server ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Accepting requests from: ${corsOptions.origin}`);
    console.log(`Using Cashfree API URL: ${CASHFREE_API_URL}`);
    console.log(`✅ Server is running on port ${PORT}`);
});