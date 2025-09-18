const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto"); // Import the crypto module for UUIDs
require("dotenv").config();

// Using the dynamic import for node-fetch as you had it
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

// --- Configuration ---
const FRONTEND_URL = process.env.FRONTEND_URL || "https://rhinnovatex.netlify.app";
const REGISTRATIONS_DB_PATH = path.join(__dirname, "registrations.json");

// --- Middleware ---
app.use(express.json());

// A more robust CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman, server-to-server)
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/$/, "");
    const normalizedFrontend = FRONTEND_URL.replace(/\/$/, "");

    if (normalizedOrigin === normalizedFrontend) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: The origin ${origin} is not allowed.`));
    }
  },
  credentials: true,
}));


// --- Helper Functions ---

/**
 * Reads the registrations from our temporary JSON database.
 * If the file doesn't exist, it returns an empty array.
 */
const getRegistrations = async () => {
    try {
        await fs.access(REGISTRATIONS_DB_PATH);
        const data = await fs.readFile(REGISTRATIONS_DB_PATH, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        // If the file doesn't exist or is empty, start with an empty array
        return [];
    }
};

/**
 * Saves a new registration to the JSON database.
 * @param {object} newRegistration - The complete registration data.
 */
const saveRegistration = async (newRegistration) => {
    const registrations = await getRegistrations();
    registrations.push(newRegistration);
    await fs.writeFile(REGISTRATIONS_DB_PATH, JSON.stringify(registrations, null, 2));
};


// --- API Routes ---

// Health Check: Confirms the server is running.
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is healthy" });
});

// Create Payment Order: Interacts with Cashfree to start the payment process.
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

    // IMPROVEMENT: Use a more collision-resistant unique ID instead of Date.now()
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
          return_url: `${FRONTEND_URL}/success?order_id={order_id}`,
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
        // Log the detailed error from Cashfree for better debugging
        console.error("Cashfree API Error:", data);
        return res
            .status(response.status)
            .json({ message: data.message || "Failed to create order with payment provider" });
    }
    res.status(200).json(data);
  } catch (err) {
    console.error("Error in /api/create-payment-order:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// --- NEW ---
// Register Team: Saves the final registration data after a successful payment.
app.post("/api/register", async (req, res) => {
    try {
        const registrationData = req.body;

        // Basic Validation: Ensure critical data is present
        if (!registrationData.teamName || !registrationData.members || registrationData.members.length === 0 || !registrationData.payment_id) {
            return res.status(400).json({ message: "Invalid registration data. Required fields are missing." });
        }

        // Add a timestamp for when the registration was saved on the server
        const finalData = {
            ...registrationData,
            server_timestamp: new Date().toISOString()
        };

        // Save the data to our temporary database
        // NOTE: For a production app, replace this with a real database (e.g., MongoDB, PostgreSQL, Firebase).
        await saveRegistration(finalData);

        console.log(`Successfully registered team: ${registrationData.teamName}`);
        res.status(201).json({ success: true, message: "Registration successful!" });

    } catch(err) {
        console.error("Error in /api/register:", err);
        res.status(500).json({ message: "Failed to save registration data due to a server error." });
    }
});


// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 InnovateX25 backend running on port ${PORT}`);
  console.log(`CORS is configured to allow requests from: ${FRONTEND_URL}`);
});
  