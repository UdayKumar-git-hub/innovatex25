// api/server.cjs

const express = require("express");
const cors = require("cors");
require("dotenv").config();
// Use dynamic import for node-fetch
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

// --- CONFIGURATION ---

// Whitelist now ONLY contains your primary domain.
const allowedOrigins = [
  'https://reelhaus.in'
];

// --- MIDDLEWARE ---

// Updated CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, server-to-server)
    if (!origin) return callback(null, true);
    
    // Normalize origin by removing trailing slash if it exists
    const normalizedOrigin = origin.replace(/\/$/, '');

    if (allowedOrigins.includes(normalizedOrigin)) {
      // If the origin is in our whitelist, allow it
      callback(null, true);
    } else {
      // Otherwise, block it
      callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
    }
  }
}));

app.use(express.json());

// --- ROUTES ---

// Health Check Route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is healthy" });
});

// Payment Creation Route
app.post("/api/create-payment-order", async (req, res) => {
  const API_ENV = process.env.CASHFREE_API_ENV || "sandbox";
  const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
  const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
  const FRONTEND_URL = "https://reelhaus.in"; // Hardcoded to your primary domain

  const CASHFREE_API_URL =
    API_ENV === "production"
      ? "https://api.cashfree.com/pg"
      : "https://sandbox.cashfree.com/pg";

  try {
    const { order_amount, customer_details } = req.body;
    if (!order_amount || !customer_details) {
      return res.status(400).json({ message: "Missing required order details" });
    }

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
          return_url: `${FRONTEND_URL}/success?order_id={order_id}`,
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Cashfree API Error:", data);
      return res
        .status(response.status)
        .json({ message: data.message || "Failed to create payment order with Cashfree" });
    }
    res.status(200).json(data);
  } catch (err) {
    console.error("Internal Server Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// --- SERVER INITIALIZATION ---

// This part is for local development. Render will use its own start command.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running locally on port ${PORT}`);
});

// Export the app for serverless environments or as a module for Render
module.exports = app;