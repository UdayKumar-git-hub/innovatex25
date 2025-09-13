// Load environment variables from .env file
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Set up middleware
app.use(cors()); // Allows your frontend to communicate with this backend
app.use(express.json()); // Allows the server to read JSON from requests

const PORT = process.env.PORT || 3001; // The port your backend server will run on

const CF_APP_ID = process.env.CASHFREE_APP_ID;
const CF_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const NODE_ENV = process.env.NODE_ENV || 'sandbox';
const NODE_ENV = process.env.NODE_ENV || 'sandbox';

// Use production URL for live payments, sandbox for testing
const CF_API_URL = NODE_ENV === 'production' 
  ? 'https://api.cashfree.com/pg' 
  : 'https://sandbox.cashfree.com/pg';

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    environment: NODE_ENV,
    timestamp: new Date().toISOString() 
// Use production URL for live payments, sandbox for testing
const CF_API_URL = NODE_ENV === 'production' 
  ? 'https://api.cashfree.com/pg' 
  : 'https://sandbox.cashfree.com/pg';

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'InnovateX25 Payment Server is running',
    environment: NODE_ENV,
    timestamp: new Date().toISOString() 
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    environment: NODE_ENV,
    timestamp: new Date().toISOString() 
  });
});

// This is the API endpoint your React app will call
app.post('/api/create-payment-session', async (req, res) => {
  // Check if keys are loaded correctly
  if (!CF_APP_ID || !CF_SECRET_KEY) {
    console.error('❌ Missing Cashfree credentials in environment variables');
    return res.status(500).json({ 
      error: 'Server is missing API credentials. Please check your .env file.' 
    });
  }

  // Validate that credentials are not placeholder values
  if (CF_APP_ID.includes('YOUR_CASHFREE_APP_ID') || CF_SECRET_KEY.includes('YOUR_CASHFREE_SECRET_KEY')) {
    console.error('❌ Placeholder credentials detected. Please update your .env file with real Cashfree credentials.');
    return res.status(500).json({ 
      error: 'Server credentials are not configured. Please contact support.' 
    });
    return res.status(500).json({ 
      error: 'Server is missing API credentials. Please check your .env file.' 
    });
  }

  // Validate that credentials are not placeholder values
  if (CF_APP_ID.includes('YOUR_CASHFREE_APP_ID') || CF_SECRET_KEY.includes('YOUR_CASHFREE_SECRET_KEY')) {
    console.error('❌ Placeholder credentials detected. Please update your .env file with real Cashfree credentials.');
    return res.status(500).json({ 
      error: 'Server credentials are not configured. Please contact support.' 
    });
  }

  try {
    const { amount, customer_details, order_meta } = req.body;

    // Validate required fields
    if (!amount || !customer_details || !customer_details.customer_name || !customer_details.customer_email) {
      return res.status(400).json({ 
        error: 'Missing required fields: amount, customer_name, or customer_email' 
      });
    }

    const order_id = `innovatex25_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    // Validate required fields
    if (!amount || !customer_details || !customer_details.customer_name || !customer_details.customer_email) {
      return res.status(400).json({ 
        error: 'Missing required fields: amount, customer_name, or customer_email' 
      });
    }

    const order_id = `innovatex25_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const requestData = {
      order_id: order_id,
      order_amount: parseFloat(amount).toFixed(2),
      order_currency: "INR",
      customer_details: {
        customer_id: customer_details.customer_id || `customer_${Date.now()}`,
        customer_name: customer_details.customer_name,
        customer_email: customer_details.customer_email,
        customer_phone: customer_details.customer_phone || "9999999999"
      },
        customer_id: customer_details.customer_id || `customer_${Date.now()}`,
        customer_name: customer_details.customer_name,
        customer_email: customer_details.customer_email,
        customer_phone: customer_details.customer_phone || "9999999999"
      },
      order_meta: {
        ...order_meta,
        // Update this URL to your deployed site URL in production
        return_url: `${req.headers.origin || 'http://localhost:3000'}/success?order_id=${order_id}`,
        notify_url: `${req.headers.origin || 'http://localhost:3001'}/api/webhook` // For payment notifications
      }
    };

    const headers = {
      'Content-Type': 'application/json',
      'x-client-id': CF_APP_ID,
      'x-client-secret': CF_SECRET_KEY,
      'x-api-version': '2022-09-01',
    };

    console.log(`🔄 Creating payment session for order: ${order_id}, amount: ₹${amount}`);

    console.log(`🔄 Creating payment session for order: ${order_id}, amount: ₹${amount}`);

    // Securely call Cashfree from the backend
    const response = await axios.post(
      `${CF_API_URL}/orders`, 
      requestData, 
      { headers }
    );

    console.log(`✅ Payment session created successfully: ${response.data.payment_session_id}`);

    console.log(`✅ Payment session created successfully: ${response.data.payment_session_id}`);

    // Send the valid payment_session_id back to the frontend
    res.status(200).json({
      ...response.data,
      order_id: order_id,
      environment: NODE_ENV
    });
      ...response.data,
      order_id: order_id,
      environment: NODE_ENV
    });

  } catch (error) {
    console.error("❌ Error creating Cashfree order:", error.response ? error.response.data : error.message);
    
    // Send appropriate error message to frontend
    const errorMessage = error.response?.data?.message || 'Failed to create payment session. Please try again.';
    res.status(500).json({ 
      error: errorMessage,
      details: NODE_ENV === 'sandbox' ? error.response?.data : undefined
    });
    // Send appropriate error message to frontend
    const errorMessage = error.response?.data?.message || 'Failed to create payment session. Please try again.';
    res.status(500).json({ 
      error: errorMessage,
      details: NODE_ENV === 'sandbox' ? error.response?.data : undefined
    });
  }
});

// Webhook endpoint for payment notifications (optional but recommended)
app.post('/api/webhook', (req, res) => {
  console.log('📨 Payment webhook received:', req.body);
  // Here you would verify the webhook signature and update your database
  res.status(200).json({ status: 'received' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Webhook endpoint for payment notifications (optional but recommended)
app.post('/api/webhook', (req, res) => {
  console.log('📨 Payment webhook received:', req.body);
  // Here you would verify the webhook signature and update your database
  res.status(200).json({ status: 'received' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✅ Secure payment server is running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`🔗 API URL: ${CF_API_URL}`);
  
  if (CF_APP_ID && CF_SECRET_KEY && !CF_APP_ID.includes('YOUR_CASHFREE_APP_ID')) {
    console.log(`🔑 Cashfree credentials loaded successfully`);
  } else {
    console.log(`⚠️  WARNING: Please update your .env file with real Cashfree credentials`);
  }
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`🔗 API URL: ${CF_API_URL}`);
  
  if (CF_APP_ID && CF_SECRET_KEY && !CF_APP_ID.includes('YOUR_CASHFREE_APP_ID')) {
    console.log(`🔑 Cashfree credentials loaded successfully`);
  } else {
    console.log(`⚠️  WARNING: Please update your .env file with real Cashfree credentials`);
  }
});