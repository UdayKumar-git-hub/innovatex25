// api/server.cjs

const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Dynamically import node-fetch, which is an ESM module
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

// --- MIDDLEWARE ---

// Use CORS. Since the frontend is served from the same Vercel domain,
// requests to /api/* are same-origin. This simple setup is robust
// for Vercel's environment, including preview deployments.
app.use(cors());

// Parse JSON bodies for POST requests
app.use(express.json());


// --- API ROUTES ---

// Health Check Endpoint: Confirms the server is running.
// Accessible at https://reelhaus.in/api/health
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Backend is healthy" });
});

// Payment Order Creation Endpoint
// Accessible at https://reelhaus.in/api/create-payment-order
app.post("/api/create-payment-order", async (req, res) => {
  // Load environment variables securely
  const API_ENV = process.env.CASHFREE_API_ENV || "production";
  const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
  const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
  const FRONTEND_URL = "https://reelhaus.in"; // Your production frontend URL for Cashfree's return_url

  // Determine Cashfree API endpoint based on environment
  const CASHFREE_API_URL =
    API_ENV === "production"
      ? "https://api.cashfree.com/pg"
      : "https://sandbox.cashfree.com/pg";

  // Validate that server environment variables are set
  if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      console.error("FATAL: Missing Cashfree credentials in environment variables.");
      return res.status(500).json({ message: "Server configuration error." });
  }

  try {
    const { order_amount, customer_details } = req.body;

    // Input validation
    if (!order_amount || !customer_details) {
      return res.status(400).json({ message: "Missing required order details from frontend" });
    }

    // Make the request to Cashfree's API
    const response = await fetch(`${CASHFREE_API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
        "x-api-version": "2022-09-01",
      },
      body: JSON.stringify({
        order_id: `INNOVATEX-SVR-${Date.now()}`,
        order_amount,
        order_currency: "INR",
        customer_details,
        order_meta: {
          // This is the URL where Cashfree will redirect the user after payment
          return_url: `${FRONTEND_URL}/success?order_id={order_id}`,
        },
      }),
    });

    const data = await response.json();

    // Handle non-successful responses from Cashfree
    if (!response.ok) {
      console.error("Cashfree API Error:", data);
      return res
        .status(response.status)
        .json({ message: data.message || "Failed to create payment order via Cashfree" });
    }

    // Send successful response back to the frontend
    res.status(200).json(data);
  } catch (err) {
    console.error("Internal Server Error in /api/create-payment-order:", err);
    res.status(500).json({ message: "An internal server error occurred" });
  }
});


// --- VERCEL EXPORT ---
// This line is essential for Vercel to handle the Express app correctly
// as a serverless function. Do not add app.listen() here.
module.exports = app;
