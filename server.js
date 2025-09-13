// --- Backend Server Example (e.g., server.js) ---
// You would need to run `npm install express node-fetch cors` for this.

const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors'); // Import the CORS middleware
const app = express();

// ==================================================================
// MIDDLEWARE SETUP
// ==================================================================
app.use(express.json());

// Use the CORS middleware. This will allow your React frontend 
// (running on a different origin, e.g., localhost:3000) 
// to make requests to this backend server (e.g., localhost:3001).
app.use(cors());


// ==================================================================
// CONFIGURATION
// ==================================================================
// IMPORTANT: Store these securely as environment variables, not hardcoded.
const CASHFREE_CLIENT_ID = '10740233429ec59b4bde3effd3f3204701';
const CASHFREE_CLIENT_SECRET = 'cfsk_ma_prod_1d3901ac8e0c40555324ae5b8dc3611b_cb065e7d';
// Use 'https://api.cashfree.com/pg/orders' for production environment
const CASHFREE_API_URL = 'https://sandbox.cashfree.com/pg/orders'; 


// ==================================================================
// API ENDPOINT
// ==================================================================
app.post('/api/create-cashfree-order', async (req, res) => {
    try {
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
                    // You can add additional info here if needed
                    return_url: `https://your-domain.com/order-status?order_id=${order_id}`
                }
            }),
        });

        const data = await response.json();

        if (!response.ok || data.type === 'error') {
            console.error('Cashfree API Error:', data.message);
            return res.status(response.status).json({ error: data.message || 'An error occurred with the payment provider.' });
        }
        
        // Send the payment_session_id back to the frontend
        res.status(200).json({ payment_session_id: data.payment_session_id });

    } catch (error) {
        console.error('Error creating Cashfree order:', error);
        res.status(500).send('Internal Server Error');
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

