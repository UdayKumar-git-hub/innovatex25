// File: server.js
// --- Dependencies ---
// Run `npm install express node-fetch cors` to install these.

const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();

// --- Middleware ---
app.use(express.json()); // To parse JSON request bodies
app.use(cors());         // To allow requests from your frontend

// --- Configuration ---
// ⚠️ CRITICAL: For production, use environment variables, not hardcoded keys!
// Example: const CASHFREE_CLIENT_ID = process.env.CASHFREE_CLIENT_ID;
const CASHFREE_CLIENT_ID = '10740233429ec59b4bde3effd3f3204701';
const CASHFREE_CLIENT_SECRET = 'cfsk_ma_prod_1d3901ac8e0c40555324ae5b8dc3611b_cb065e7d';

// Use 'https://api.cashfree.com/pg/orders' for production
const CASHFREE_API_URL = 'https://sandbox.cashfree.com/pg/orders';

// --- API Endpoint ---
app.post('/api/create-cashfree-order', async (req, res) => {
    try {
        // Data sent from the React frontend
        const { order_amount, order_id, customer_details } = req.body;

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
                    // This URL is where the user is sent after some payments.
                    // You must build a page to handle this and verify the payment status.
                    return_url: `https://YOUR_LIVE_WEBSITE.com/order-status?order_id=${order_id}`
                }
            }),
        });

        const data = await response.json();

        if (!response.ok || data.type === 'error') {
            console.error('Cashfree API Error:', data.message);
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
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));