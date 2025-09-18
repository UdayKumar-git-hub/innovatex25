const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

// Dynamic import for node-fetch in CommonJS
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

// --- Config ---
const FRONTEND_URLS = [
  "https://rhinnovatex.netlify.app",
  "https://innovatex25.vercel.app"
];

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// --- Middleware ---
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || FRONTEND_URLS.includes(origin.replace(/\/$/, ""))) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: Origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

// --- Routes ---
// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is healthy" });
});

// Create Cashfree order
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
      return res.status(400).json({ message: "Missing required order details" });
    }

    const uniqueOrderId = `INX25-${crypto.randomUUID()}`;

    const response = await fetch(`${CASHFREE_API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
        "x-api-version": "2022-09-01",
      },
      body: JSON.stringify({
        order_id: uniqueOrderId,
        order_amount,
        order_currency: "INR",
        customer_details,
        order_meta: {
          return_url: `${FRONTEND_URLS[1]}/success?order_id={order_id}`,
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Cashfree API Error:", data);
      return res
        .status(response.status)
        .json({ message: data.message || "Failed to create order" });
    }
    res.status(200).json(data);
  } catch (err) {
    console.error("Error in /api/create-payment-order:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Register team (save to Supabase)
app.post("/api/register", async (req, res) => {
  try {
    const registrationData = req.body;

    if (
      !registrationData.teamName ||
      !registrationData.members?.length ||
      !registrationData.payment_id
    ) {
      return res
        .status(400)
        .json({ message: "Invalid registration data. Required fields missing." });
    }

    const { data, error } = await supabase
      .from("registrations")
      .insert([
        {
          teamName: registrationData.teamName,
          members: registrationData.members,
          payment_id: registrationData.payment_id,
        },
      ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ message: "Failed to save registration." });
    }

    console.log(`✅ Registered team: ${registrationData.teamName}`);
    res.status(201).json({ success: true, message: "Registration successful!" });
  } catch (err) {
    console.error("Error in /api/register:", err);
    res.status(500).json({ message: "Server error while saving registration." });
  }
});

// --- Export for Vercel ---
module.exports = app;
