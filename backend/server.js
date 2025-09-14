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
app.use(cors()); // Enable Cross-Origin Resource Sharing for your React app
app.use(express.json());

const PORT = process.env.PORT || 4000;
const CASHFREE_API_URL = 'https://sandbox.cashfree.com/pg'; // Use 'https://api.cashfree.com/pg' for production

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
        'x-api-version': '2022-09-01',
      },
      body: JSON.stringify({
        order_id: `INNOVATEX-SERVER-${Date.now()}`,
        order_amount: order_amount,
        order_currency: "INR",
        customer_details: customer_details,
        order_meta: {
          // This allows redirects back to your app after payment
          return_url: 'http://localhost:3000/return?order_id={order_id}'
        }
      }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Cashfree API Error:', errorData);
        return res.status(response.status).json({ message: errorData.message || 'Failed to create payment session with Cashfree.' });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
    console.warn('WARNING: Cashfree credentials are not set in the .env file.');
  }
});
