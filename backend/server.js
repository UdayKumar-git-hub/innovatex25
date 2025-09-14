// File: backend/server.js
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config(); // Make sure to load environment variables

const app = express();

// --- Middleware ---
app.use(express.json()); // To parse JSON request bodies

// --- CORS Configuration ---
// This is a more robust CORS setup that explicitly allows your frontend URL.
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const corsOptions = {
  origin: frontendUrl,
  optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));
console.log(`Accepting requests from: ${frontendUrl}`);

// --- Configuration ---
const CASHFREE_CLIENT_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_CLIENT_SECRET = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_API_ENV = process.env.CASHFREE_API_ENV || 'sandbox'; // Default to sandbox

const CASHFREE_API_URL = CASHFREE_API_ENV === 'production'
  ? 'https://api.cashfree.com/pg/orders'
  : 'https://sandbox.cashfree.com/pg/orders';

console.log(`Using Cashfree API URL: ${CASHFREE_API_URL}`);

// --- API Endpoints ---

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'Server is healthy' });
});

app.post('/api/create-cashfree-order', async (req, res) => {
    try {
        const { order_amount, order_id, customer_details } = req.body;

        // Basic validation
        if (!order_amount || !order_id || !customer_details) {
            return res.status(400).json({ error: 'Missing required order details.' });
        }
        if (!CASHFREE_CLIENT_ID || !CASHFREE_CLIENT_SECRET) {
            console.error('Cashfree credentials are not configured on the server.');
            return res.status(500).json({ error: 'Payment gateway credentials are not configured.' });
        }

        const response = await fetch(CASHFREE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-version': '2022-09-01',
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
            console.error('Cashfree API Error:', data.message);
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
app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));
