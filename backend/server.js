// File: server.js
// --- Dependencies ---
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- Middleware ---
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// --- Configuration ---
const {
  PORT,
  CASHFREE_APP_ID,
  CASHFREE_SECRET_KEY,
  CASHFREE_API_ENV,
  RETURN_URL
} = process.env;

// Validate that critical environment variables are set
if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
  console.error("FATAL ERROR: Cashfree credentials are not defined in the .env file.");
  console.error("Please copy .env.example to .env and fill in your Cashfree credentials.");
  process.exit(1);
}

// Determine the correct API endpoint based on the environment
const CASHFREE_API_BASE_URL = CASHFREE_API_ENV === 'production'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg';

const CASHFREE_API_URL = `${CASHFREE_API_BASE_URL}/orders`;

// --- Health Check Endpoint ---
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'InnovateX25 Backend API is running',
    environment: CASHFREE_API_ENV || 'sandbox'
  });
});

// --- API Endpoint: Create Cashfree Order ---
app.post('/api/create-cashfree-order', async (req, res) => {
    try {
        console.log('Received order creation request:', req.body);
        
        // Data sent from the React frontend
        const { order_amount, order_id, customer_details } = req.body;

        // Basic validation
        if (!order_amount || !order_id || !customer_details) {
            return res.status(400).json({ 
              error: 'Missing required order details.',
              required: ['order_amount', 'order_id', 'customer_details']
            });
        }

        // Validate customer details
        if (!customer_details.customer_email || !customer_details.customer_phone || !customer_details.customer_name) {
            return res.status(400).json({ 
              error: 'Missing required customer details.',
              required: ['customer_email', 'customer_phone', 'customer_name']
            });
        }

        const orderPayload = {
            order_id: order_id,
            order_amount: parseFloat(order_amount),
            order_currency: 'INR',
            customer_details: {
                customer_id: customer_details.customer_id || `CUST-${Date.now()}`,
                customer_email: customer_details.customer_email,
                customer_phone: customer_details.customer_phone,
                customer_name: customer_details.customer_name
            },
            order_meta: {
                return_url: RETURN_URL || `${process.env.FRONTEND_URL}/success?order_id=${order_id}`
            }
        };

        console.log('Creating Cashfree order with payload:', orderPayload);

        const response = await fetch(CASHFREE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-version': '2022-09-01',
                'x-client-id': CASHFREE_APP_ID,
                'x-client-secret': CASHFREE_SECRET_KEY,
            },
            body: JSON.stringify(orderPayload),
        });

        const data = await response.json();
        console.log('Cashfree API response:', data);

        if (!response.ok || data.type === 'error') {
            console.error('Cashfree API Error:', data);
            return res.status(response.status || 400).json({ 
              error: data.message || 'An error occurred with the payment provider.',
              details: data
            });
        }
        
        // Success! Send the session ID back to the frontend.
        console.log('Order created successfully:', data.payment_session_id);
        res.status(200).json({ 
          payment_session_id: data.payment_session_id,
          order_id: data.order_id
        });

    } catch (error) {
        console.error('Internal Server Error:', error);
        res.status(500).json({ 
          error: 'Internal Server Error',
          message: error.message
        });
    }
});

// --- Error handling middleware ---
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// --- 404 handler ---
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// --- Start Server ---
const port = PORT || 3001;
app.listen(port, () => {
  console.log(`✅ InnovateX25 Backend Server is running on port ${port}`);
  console.log(`🌍 Environment: ${CASHFREE_API_ENV || 'sandbox'}`);
  console.log(`🔗 Health check: http://localhost:${port}/health`);
  console.log(`💳 Payment API: http://localhost:${port}/api/create-cashfree-order`);
});