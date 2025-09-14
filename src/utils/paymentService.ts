import { API_CONFIG, CASHFREE_CONFIG } from '../config/api';

// Types
interface OrderData {
  order_amount: number;
  order_id: string;
  customer_details: {
    customer_id: string;
    customer_email: string;
    customer_phone: string;
    customer_name: string;
  };
}

interface PaymentResponse {
  payment_session_id: string;
  order_id: string;
}

// Load Cashfree SDK
export const loadCashfreeSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.Cashfree) {
      resolve();
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector(`script[src="${CASHFREE_CONFIG.SDK_URL}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Cashfree SDK')));
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.src = CASHFREE_CONFIG.SDK_URL;
    script.async = true;
    
    script.onload = () => {
      if (window.Cashfree) {
        resolve();
      } else {
        reject(new Error('Cashfree SDK loaded but not available'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Cashfree SDK'));
    };
    
    document.head.appendChild(script);
  });
};

// Create payment order
export const createPaymentOrder = async (orderData: OrderData): Promise<PaymentResponse> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CREATE_ORDER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create payment order');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating payment order:', error);
    throw error;
  }
};

// Check backend health
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`);
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

// Declare Cashfree on window object
declare global {
  interface Window {
    Cashfree: any;
  }
}