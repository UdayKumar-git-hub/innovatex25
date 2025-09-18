// api/server.cjs

const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Dynamic import for node-fetch
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- ROUTES ---

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Backend is healthy" });
});

// Create payment order
app.post("/api/create-payment-order", async (req, res) => {
  const { order_amount, customer_details } = req.body;
  if (!order_amount || !customer_details) {
    return res.status(400).json({ message: "Missing order details" });
  }

  const API_ENV = process.env.CASHFREE_API_ENV || "production";
  const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
  const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
  const FRONTEND_URL = "https://reelhaus.in";

  if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
    return res.status(500).json({ message: "Server misconfiguration: missing Cashfree credentials" });
  }

  try {
    // Generate unique order ID
    const orderId = `INNOVATEX-SVR-${Date.now()}`;

    // Determine Cashfree endpoint
    const CASHFREE_API_URL =
      API_ENV === "production"
        ? "https://api.cashfree.com/pg/orders"
        : "https://sandbox.cashfree.com/pg/orders";

    // Call Cashfree API
    const response = await fetch(CASHFREE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
        "x-api-version": "2022-09-01",
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount,
        order_currency: "INR",
        customer_details,
        order_meta: {
          return_url: `${FRONTEND_URL}/success?order_id=${orderId}`
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Cashfree API Error:", data);
      return res.status(response.status).json({
        message: data.message || "Failed to create payment order",
        details: data,
      });
    }

    res.status(200).json(data);

  } catch (err) {
    console.error("Internal Server Error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// --- Vercel export ---
module.exports = app;
