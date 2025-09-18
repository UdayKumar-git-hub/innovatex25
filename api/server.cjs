// api/server.cjs

const express = require("express");
const cors = require("cors");
require("dotenv").config();
// The dynamic import for node-fetch is correct for CommonJS
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

// --- Configuration ---
// Allow your specific frontend URL. Using a wildcard is less secure.
const FRONTEND_URL = process.env.FRONTEND_URL || "https://reelhaus.in";

// --- Middleware ---
// More robust CORS setup
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// --- API Routes ---
// It's good practice to group all API routes under a single router.
const apiRouter = express.Router();

// Health Check Route: /api/health
apiRouter.get("/health", (req, res) => {
  console.log("✅ Health check endpoint was hit successfully.");
  res.status(200).json({ status: "ok", message: "Backend is healthy" });
});

// Payment Route: /api/create-payment-order
apiRouter.post("/create-payment-order", async (req, res) => {
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
      return res.status(response.status).json({ message: data.message || "Failed to create payment order" });
    }
    res.status(200).json(data);
  } catch (err) {
    console.error("Internal Server Error in /create-payment-order:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Use the router for all routes starting with /api
app.use("/api", apiRouter);


// --- Catch-all Route for Debugging ---
// This will catch any request that doesn't match the routes above it.
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found.` });
});


// --- Start Server ---
// This part is correct for Render.com
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running and listening on port ${PORT}`);
});