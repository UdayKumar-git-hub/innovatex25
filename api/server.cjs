const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
require("dotenv").config();

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

// --- Configuration ---
// --- FIX: Create a whitelist of allowed domains for CORS ---
const allowedOrigins = [
    'https://reelhaus.in', // Your new production domain
    'https://rhinnovatex.netlify.app', // Your old domain
    process.env.FRONTEND_URL, // Keep support for the environment variable
    'http://localhost:3000', // For local development
    'http://localhost:5173'  // For local Vite/React development
].filter(Boolean); // Filter out undefined/null values from the array


const REGISTRATIONS_DB_PATH = path.join("/tmp", "registrations.json");

// --- Middleware ---
app.use(express.json());

// --- FIX: Updated CORS configuration to use the whitelist ---
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman, server-to-server) or from whitelisted domains
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: The origin '${origin}' is not allowed.`));
    }
  },
  credentials: true,
}));


// --- Helper Functions ---
const getRegistrations = async () => {
    try {
        await fs.access(REGISTRATIONS_DB_PATH);
        const data = await fs.readFile(REGISTRATIONS_DB_PATH, "utf-8");
        return data ? JSON.parse(data) : [];
    } catch (error) {
        return [];
    }
};

const saveRegistration = async (newRegistration) => {
    const registrations = await getRegistrations();
    registrations.push(newRegistration);
    await fs.writeFile(REGISTRATIONS_DB_PATH, JSON.stringify(registrations, null, 2));
};


// --- API Routes ---
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is healthy" });
});

app.post("/create-payment-order", async (req, res) => {
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
          // Use the origin from the request for the return URL for flexibility
          return_url: `${req.headers.origin}/success?order_id={order_id}`,
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
        console.error("Cashfree API Error:", data);
        return res
            .status(response.status)
            .json({ message: data.message || "Failed to create order with payment provider" });
    }
    res.status(200).json(data);
  } catch (err) {
    console.error("Error in /create-payment-order:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/register", async (req, res) => {
    try {
        const registrationData = req.body;
        if (!registrationData.teamName || !registrationData.members || !registrationData.payment_id) {
            return res.status(400).json({ message: "Invalid registration data. Required fields are missing." });
        }
        const finalData = { ...registrationData, server_timestamp: new Date().toISOString() };
        await saveRegistration(finalData);
        console.log(`Successfully registered team: ${registrationData.teamName}`);
        res.status(201).json({ success: true, message: "Registration successful!" });
    } catch(err) {
        console.error("Error in /register:", err);
        res.status(500).json({ message: "Failed to save registration data due to a server error." });
    }
});

module.exports = app;

