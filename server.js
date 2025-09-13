// --- Backend Server Example (e.g., server.js) ---
// You would need to run `npm install express node-fetch` for this.

const express = require('express');
const fetch = require('node-fetch'); // Using node-fetch for API calls in Node.js
const app = express();
app.use(express.json());

// IMPORTANT: Store these securely as environment variables, not hardcoded.
const CASHFREE_CLIENT_ID = '10740233429ec59b4bde3effd3f3204701';
const CASHFREE_CLIENT_SECRET = 'cfsk_ma_prod_1d3901ac8e0c40555324ae5b8dc3611b_cb065e7d';
const CASHFREE_API_URL = 'https://sandbox.cashfree.com/pg/orders'; // Use production URL when live

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

        if (data.order_status === 'ERROR' || data.type === 'error') {
            return res.status(500).json({ error: data.message });
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
