// api/server.cjs

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

// --- Config ---
let FRONTEND_URL = process.env.FRONTEND_URL || "https://rhinnovatex.netlify.app";
// Remove trailing slash to prevent CORS mismatch
FRONTEND_URL = FRONTEND_URL.replace(/\/$/, "");

// Enable CORS for the frontend only
app.use(cors({ origin: FRONTEND_URL }));

// Enable JSON parsing
app.use(express.json());

// --- Health Check ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// --- Registration Route ---
app.post("/api/register", (req, res) => {
  // You can replace this with actual DB logic
  console.log("Received registration data:", req.body);
  res.status(200).json({ success: true, message: "Registration saved!" });
});

// --- Payment Route ---
app.post("/api/create-payment-order", async (req, res) => {
  const API_ENV = process.env.CASHFREE_API_ENV || "sandbox";
  const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
  const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
  const CASHFREE_API_URL =
    API_ENV === "production"
      ? "https://api.cashfree.com/pg"
      : "https://sandbox.cashfree.com/pg";

  try {
    const { order_amount, customer_details } = req.body;
    if (!order_amount || !customer_details) {
      return res.status(400).json({ message: "Missing order details" });
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
      return res
        .status(response.status)
        .json({ message: data.message || "Failed to create order" });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Error creating payment order:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
