require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json());

const PORT = 3001; // We'll run the backend on a different port

const CF_APP_ID = process.env.CASHFREE_APP_ID;
const CF_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

// Use 'https://api.cashfree.com/pg' for Production
const CF_API_URL = 'https://sandbox.cashfree.com/pg';

app.post('/api/create-payment-session', async (req, res) => {
  try {
    const { amount, customer_details, order_meta } = req.body;

    // A unique ID for the order in your system
    const order_id = `order_${Date.now()}`;

    const requestData = {
      order_id: order_id,
      order_amount: amount,
      order_currency: "INR",
      customer_details: customer_details,
      order_meta: {
        ...order_meta,
        return_url: `http://localhost:3000/return?order_id=${order_id}` // Your success page
      }
    };

    const headers = {
      'Content-Type': 'application/json',
      'x-client-id': CF_APP_ID,
      'x-client-secret': CF_SECRET_KEY,
      'x-api-version': '2022-09-01',
    };

    // Make the API call to Cashfree to create an order
    const response = await axios.post(
      `${CF_API_URL}/orders`, 
      requestData, 
      { headers }
    );

    // Send the payment_session_id back to the frontend
    res.status(200).json(response.data);

  } catch (error) {
    console.error("Error creating Cashfree order:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to create payment session.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});