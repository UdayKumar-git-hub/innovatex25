# InnovateX25 Payment Backend

This is the secure backend server for handling Cashfree payments for the InnovateX25 registration system.

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
1. Copy `.env.example` to `.env`
2. Get your Cashfree credentials from [Cashfree Dashboard](https://merchant.cashfree.com/merchants/login)
3. Update the `.env` file with your actual credentials:

```env
CASHFREE_APP_ID="your_actual_app_id"
CASHFREE_SECRET_KEY="your_actual_secret_key"
NODE_ENV="sandbox"  # Use "production" for live payments
```

### 3. Run the Server
```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### POST /api/create-payment-session
Creates a secure payment session with Cashfree.

**Request Body:**
```json
{
  "amount": 1500.00,
  "customer_details": {
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "9999999999"
  },
  "order_meta": {
    "team_name": "The Innovators"
  }
}
```

**Response:**
```json
{
  "payment_session_id": "session_xxx",
  "order_id": "innovatex25_xxx",
  "environment": "sandbox"
}
```

### GET /health
Health check endpoint to verify server status.

## Security Notes

- Never commit your `.env` file to version control
- Use sandbox credentials for testing
- Switch to production credentials only when ready for live payments
- The server validates all credentials before processing payments

## Troubleshooting

1. **"Missing API credentials"**: Update your `.env` file with real Cashfree credentials
2. **CORS errors**: Make sure the frontend URL is allowed in CORS settings
3. **Payment session creation fails**: Check your Cashfree dashboard for API key status