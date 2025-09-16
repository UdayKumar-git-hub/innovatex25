const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Initialize the Express app
const app = express();

// --- Configuration from Environment Variables ---
const FRONTEND_URL = process.env.FRONTEND_URL;
const API_ENV = process.env.CASHFREE_API_ENV || 'sandbox';
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

const CASHFREE_API_URL = API_ENV === 'production'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

// --- Security Middleware ---
app.use(helmet());
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: { message: "Too many requests, please try again after 15 minutes." }
});

// --- API Routes ---

// ✅ Route 1: The Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// ✅ Route 2: The Create Payment Order Endpoint
app.post('/api/create-payment-order', paymentLimiter, async (req, res) => {
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
            return res.status(response.status).json({ message: errorData.message || 'Failed to create payment session.' });
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Export the Express app to be used by Vercel
module.exports = app;