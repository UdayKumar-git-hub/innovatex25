// Load environment variables from the .env file into process.env
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// --- CORS Configuration ---
// This is a security feature that controls which websites can make requests to your backend.
// We need to explicitly allow your frontend's URL.
const allowedOrigins = [
  'http://localhost:3000', // Common for Create React App
  'http://localhost:5173', // Common for Vite
  'http://127.0.0.1:5173', // Also common for Vite
  // IMPORTANT: Add your Bolt AI public frontend URL here when you deploy/run it.
  // Example: 'https://your-frontend-url.boltai.app' 
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use(cors(corsOptions));
// --- End of CORS Configuration ---


// Middleware to parse incoming JSON requests from the frontend
app.use(express.json()); 

const PORT = 3001; // The port your backend server will run on

// Safely get your credentials from the .env file
const CF_APP_ID = process.env.CASHFREE_APP_ID;
const CF_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

// Define Cashfree API details
// Use 'https://sandbox.cashfree.com/pg' for testing
// Use 'https://api.cashfree.com/pg' for real payments
const CF_API_URL = 'https://sandbox.cashfree.com/pg'; 
const CF_API_VERSION = '2022-09-01';

// This is the main API endpoint that your React app will call
app.post('/api/create-payment-session', async (req, res) => {
  console.log('Request received to create a payment session.');

  // Security check to ensure your keys are loaded
  if (!CF_APP_ID || !CF_SECRET_KEY) {
    console.error('FATAL ERROR: API credentials are not found in the .env file.');
    return res.status(500).json({ error: 'Server is missing API credentials.' });
  }

  try {
    const { amount, customer_details, order_meta } = req.body;
    const order_id = `order_${Date.now()}`; // Create a unique ID for this transaction

    // Structure the data exactly as the Cashfree API requires
    const requestData = {
      order_id: order_id,
      order_amount: amount,
      order_currency: "INR",
      customer_details: customer_details,
      order_meta: {
        ...order_meta,
        // The URL the user is sent to after payment. Update this for your live site.
        return_url: `http://localhost:5173/success?order_id=${order_id}` 
      }
    };

    // Prepare the secret headers for authentication
    const headers = {
      'Content-Type': 'application/json',
      'x-client-id': CF_APP_ID,
      'x-client-secret': CF_SECRET_KEY,
      'x-api-version': CF_API_VERSION,
    };

    // Make the secure call to Cashfree's server
    const response = await axios.post(`${CF_API_URL}/orders`, requestData, { headers });

    console.log('Successfully created Cashfree order.');
    // Send the payment_session_id from Cashfree's response back to the frontend
    res.status(200).json(response.data);

  } catch (error) {
    console.error("--- CASHFREE API ERROR ---");
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error Data:', error.response.data);
      res.status(500).json({ error: error.response.data.message || 'Failed to create payment session.' });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error Message:', error.message);
      res.status(500).json({ error: 'An unexpected error occurred while contacting the payment gateway.' });
    }
  }
});

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`✅ Secure payment server is running on http://localhost:${PORT}`);
  console.log(`Mode: ${CF_API_URL.includes('sandbox') ? 'Sandbox (Test Payments)' : 'Production (Live Payments)'}`);
});
```

### Prerequisites Checklist

For this `server.js` file to work, you must have the following set up correctly **inside your `backend` folder**:

1.  **File Location:** This file must be named `server.js` and be inside the `backend` folder.
2.  **Dependencies Installed:** You must have run `npm install express axios dotenv cors` in the terminal while inside the `backend` folder.
3.  **A `.env` File:** You must have a file named `.env` in the same `backend` folder, and it must contain your keys like this:
    ```
    CASHFREE_APP_ID="YOUR_APP_ID_HERE"
    CASHFREE_SECRET_KEY="YOUR_SECRET_KEY_HERE"
    

