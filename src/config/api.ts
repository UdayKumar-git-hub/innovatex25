// API Configuration
export const API_CONFIG = {
  // Backend API URL - Update this based on your deployment
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  
  // API Endpoints
  ENDPOINTS: {
    HEALTH: '/health',
    CREATE_ORDER: '/api/create-cashfree-order'
  }
};

// Cashfree Configuration
export const CASHFREE_CONFIG = {
  // Environment - 'sandbox' for testing, 'production' for live
  ENVIRONMENT: import.meta.env.VITE_CASHFREE_ENV || 'sandbox',
  
  // Cashfree SDK URL
  SDK_URL: 'https://sdk.cashfree.com/js/v3/cashfree.js'
};