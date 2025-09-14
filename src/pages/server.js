// A simple example of an Express.js backend server to handle Cashfree payments.
//
// How to run this server:
// 1. Install dependencies: `npm install express dotenv node-fetch cors`
// 2. Create the `.env` file in the same directory and add your credentials.
// 3. Run the server: `node server.js`

const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config(); // This line loads the .env file

const app = express();

// --- Configuration ---
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const API_ENV = process.env.CASHFREE_API_ENV || 'sandbox';
const CASHFREE_API_URL = API_ENV === 'production' 
    ? 'https://api.cashfree.com/pg' 
    : 'https://sandbox.cashfree.com/pg';

// --- Middleware ---
// Enable CORS only for your specific frontend URL for security
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// --- Route to Check Server Health ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// --- Route to Create Payment Order ---
app.post('/api/create-payment-order', async (req, res) => {
  try {
    const { order_amount, customer_details } = req.body;

    // Basic validation
    if (!order_amount || !customer_details) {
      return res.status(400).json({ message: 'Missing required order details.' });
    }

    const response = await fetch(`${CASHFREE_API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
        'x-api-version': '2022-09-01', // Use a recent, stable API version
      },
      body: JSON.stringify({
        order_id: `INNOVATEX-SVR-${Date.now()}`,
        order_amount: order_amount,
        order_currency: "INR",
        customer_details: customer_details,
        order_meta: {
          // This allows redirects back to your app after payment on some platforms
          return_url: `${process.env.RETURN_URL}?order_id={order_id}`
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
  if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
    console.warn('⚠️ WARNING: Cashfree credentials are not set in the .env file.');
  }
});