require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// --- Middleware ---
// Allow requests from your React app (adjust origin in production)
app.use(cors({ origin: 'http://localhost:5173' })); 
app.use(express.json());

// --- Environment Variables ---
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_API_URL = process.env.CASHFREE_API_URL;
const PORT = process.env.PORT || 3001;

if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
  console.error("FATAL ERROR: Cashfree credentials are not defined in .env file.");
  process.exit(1);
}

// --- API Endpoint ---
app.post('/api/create-payment-session', async (req, res) => {
  try {
    const { amount, customer_details, order_meta } = req.body;
    const orderId = `order_${Date.now()}`;

    // Prepare the request to Cashfree
    const requestData = {
      order_id: orderId,
      order_amount: parseFloat(amount).toFixed(2),
      order_currency: "INR",
      customer_details: customer_details,
      order_meta: {
        ...order_meta,
        return_url: `http://localhost:5173/payment-success?order_id={order_id}` // Example return URL
      }
    };

    const headers = {
      'Content-Type': 'application/json',
      'x-api-version': '2023-08-01',
      'x-client-id': CASHFREE_APP_ID,
      'x-client-secret': CASHFREE_SECRET_KEY
    };

    // Make the API call to Cashfree
    const response = await axios.post(`${CASHFREE_API_URL}/orders`, requestData, { headers });

    // Send the payment_session_id back to the frontend
    res.status(200).json({ 
        payment_session_id: response.data.payment_session_id,
        environment: CASHFREE_API_URL.includes('sandbox') ? 'sandbox' : 'production'
    });

  } catch (error) {
    console.error("Error creating payment session:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to create payment session." });
  }
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`✅ Server is running securely on port ${PORT}`);
});