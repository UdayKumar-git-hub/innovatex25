// A simple example of an Express.js backend server to handle Cashfree payments.
// NOTE: Credentials are hardcoded for a specific, restrictive environment.
// DO NOT use this code in a real production application.

const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();

// --- Configuration ---
const PORT = 4000;
const RETURN_URL = "http://localhost:5174/success"; // Default success URL

const API_ENV = 'sandbox'; // Or 'production'
const CASHFREE_API_URL = API_ENV === 'production' 
    ? 'https://api.cashfree.com/pg' 
    : 'https://sandbox.cashfree.com/pg';
    
// --- Middleware ---
// ✨ FIXED: This allows connections from both port 5173 and 5174
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use(cors(corsOptions));
app.use(express.json());


// --- Route to Check Server Health ---
app.get('/api/health', (req, res) => {
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
        'x-client-id': "10740233429ec59b4bde3effd3f3204701", // Your App ID
        // ✨ FIXED: Add your secret key inside the quotes
        'x-client-secret': "cfsk_ma_prod_1d3901ac8e0c40555324ae5b8dc3611b_cb065e7d", 
        'x-api-version': '2022-09-01',
      },
      body: JSON.stringify({
        order_id: `INNOVATEX-SVR-${Date.now()}`,
        order_amount: order_amount,
        order_currency: "INR",
        customer_details: customer_details,
        order_meta: {
          return_url: `${RETURN_URL}?order_id={order_id}`
        }
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
  console.warn('⚠️ WARNING: Credentials are hardcoded in server.js. Do not use in production!');
});