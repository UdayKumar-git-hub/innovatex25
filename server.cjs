const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = 4000;
const RETURN_URL = "http://localhost:5174/success"; 
const API_ENV = 'sandbox';
const CASHFREE_API_URL = API_ENV === 'sandbox' ? 'https://sandbox.cashfree.com/pg' : 'https://api.cashfree.com/pg';

// --- Middleware ---
app.use(cors()); 
app.use(express.json());

// --- Route to Check Server Health ---
app.get('/api/health', (req, res) => {
  // THIS MESSAGE IS THE PROOF WE NEED
  console.log("✅ Health check endpoint was hit successfully!"); 
  res.status(200).json({ status: 'ok' });
});

// --- Route to Create Payment Order ---
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
        'x-client-id': "10740233429ec59b4bde3effd3f3204701",
        'x-client-secret': "cfsk_ma_prod_1d3901ac8e0c40555324ae5b8dc3611b_cb065e7d", // PASTE YOUR SECRET KEY
        'x-api-version': '2022-09-01',
      },
      body: JSON.stringify({
        order_id: `INNOVATEX-SVR-${Date.now()}`,
        order_amount: order_amount,
        order_currency: "INR",
        customer_details: customer_details,
        order_meta: { return_url: `${RETURN_URL}?order_id={order_id}` }
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

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.warn('⚠️ WARNING: Credentials are hardcoded. Do not use in production!');
});