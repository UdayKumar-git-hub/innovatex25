import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Trophy, Megaphone, Lightbulb, MessageSquare, ChevronRight,
  ChevronLeft, Check, Star, Mail, Phone, User, CreditCard,
  Sparkles, PartyPopper, AlertTriangle, Instagram
} from 'lucide-react';

// --- Global Constants ---
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // fallback if env variable is missing

// --- Helper Functions ---
const loadCashfreeSDK = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (typeof (window as any).cashfree === 'object') {
      return resolve(true);
    }
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Cashfree SDK failed to load.'));
    document.body.appendChild(script);
  });
};

const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/api/health`);
    if (!response.ok) return false;
    const data = await response.json();
    return data.status === 'ok';
  } catch (error) {
    console.error("Backend health check failed:", error);
    return false;
  }
};

const createPaymentOrder = async (orderData: any): Promise<any> => {
  const response = await fetch(`${API_URL}/api/create-payment-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create payment order on the backend.');
  }
  return response.json();
};

interface TeamMember {
  fullName: string;
  grade: string;
  email: string;
  phoneNumber: string;
}

interface FormData {
  teamName: string;
  teamSize: number;
  challenges: string[];
  interests: string[];
  otherInterest: string;
  superpower: string;
  members: TeamMember[];
  agreedToRules: boolean;
}

const Register: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [validationError, setValidationError] = React.useState('');
  const [registrationComplete, setRegistrationComplete] = React.useState(false);
  const [finalPaymentInfo, setFinalPaymentInfo] = React.useState({ teamName: '', paymentId: '' });
  const [postPaymentError, setPostPaymentError] = React.useState('');
  const [hasFollowedInstagram, setHasFollowedInstagram] = React.useState(false);
  const [backendStatus, setBackendStatus] = React.useState<'checking' | 'online' | 'offline'>('checking');

  const [formData, setFormData] = React.useState<FormData>({
    teamName: '',
    teamSize: 2,
    challenges: ['ipl', 'brand', 'innovators', 'echoes'],
    interests: [],
    otherInterest: '',
    superpower: '',
    members: Array(4).fill(null).map(() => ({ fullName: '', grade: '', email: '', phoneNumber: '' })),
    agreedToRules: false
  });

  React.useEffect(() => {
    const initializeServices = async () => {
      setBackendStatus('checking');
      const isBackendOnline = await checkBackendHealth();
      setBackendStatus(isBackendOnline ? 'online' : 'offline');

      if (isBackendOnline) {
        try { await loadCashfreeSDK(); } catch (error) { setValidationError((error as Error).message); }
      } else { setValidationError('Could not connect to the server.'); }
    };
    initializeServices();
  }, []);

  const handleInputChange = (field: string, value: any) => { setFormData(prev => ({ ...prev, [field]: value })); };
  const handleMemberChange = (index: number, field: string, value: string) => {
    const newMembers = [...formData.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    if (index === 0 && field === 'grade') {
      for (let i = 1; i < formData.teamSize; i++) newMembers[i] = { ...newMembers[i], grade: value };
    }
    setFormData(prev => ({ ...prev, members: newMembers }));
  };

  const handleInterestToggle = (interest: string) => {
    const newInterests = formData.interests.includes(interest) ? formData.interests.filter(i => i !== interest) : [...formData.interests, interest];
    handleInputChange('interests', newInterests);
  };

  const calculateTotal = () => {
    const basePrice = 449, teamDiscount = 50, platformFeeRate = 0.05;
    const subtotal = basePrice * formData.teamSize;
    const priceAfterDiscount = subtotal - teamDiscount;
    const platformFee = priceAfterDiscount * platformFeeRate;
    return { subtotal, teamDiscount, priceAfterDiscount, platformFee, total: priceAfterDiscount + platformFee };
  };

  const handlePayment = async () => {
    const leader = formData.members[0];
    if (!leader.fullName || !leader.email.includes('@') || !leader.phoneNumber) { setValidationError("Team Leader's details are incomplete."); setCurrentStep(3); return; }
    if (backendStatus !== 'online' || !isStepValid()) { setValidationError("Fix errors before proceeding."); return; }
    setValidationError(''); setPostPaymentError(''); setIsLoading(true);
    try {
      const paymentDetails = calculateTotal();
      const orderData = { order_amount: parseFloat(paymentDetails.total.toFixed(2)), customer_details: { customer_id: `CUST-${Date.now()}`, customer_email: leader.email, customer_phone: leader.phoneNumber, customer_name: leader.fullName } };
      const sessionResponse = await createPaymentOrder(orderData);
      const { payment_session_id, order_id } = sessionResponse;
      if (!payment_session_id) throw new Error("Failed to create payment session.");
      const cashfree = new (window as any).cashfree.Cashfree();
      cashfree.drop(document.getElementById("payment-form"), {
        components: ["order-details", "card", "upi", "netbanking"],
        paymentSessionId: payment_session_id,
        onSuccess: (data: any) => {
          setIsLoading(false);
          if (data.order && data.order.status === 'PAID') {
            const paymentId = data.order.payment_id;
            localStorage.setItem('registrationData', JSON.stringify({ team_name: formData.teamName, payment_id: paymentId, order_id, total_amount: paymentDetails.total }));
            setFinalPaymentInfo({ teamName: formData.teamName, paymentId });
            setRegistrationComplete(true);
          } else setPostPaymentError("Payment unsuccessful.");
        },
        onFailure: (data: any) => { setIsLoading(false); setPostPaymentError(`Payment failed: ${data.order.error_text}`); }
      });
    } catch (error: any) { setValidationError(error.message || "Payment gateway error."); setIsLoading(false); }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.teamName.trim() !== '';
      case 2: return (formData.interests.length > 0 || formData.otherInterest.trim() !== '') && formData.superpower.trim() !== '';
      case 3: return formData.members.slice(0, formData.teamSize).every(m => m.fullName && m.grade && m.email.includes('@') && m.phoneNumber);
      case 4: return hasFollowedInstagram;
      case 5: return formData.agreedToRules;
      default: return false;
    }
  };

  const nextStep = () => { if (isStepValid() && currentStep < 5) setCurrentStep(currentStep + 1); };
  const prevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  if (registrationComplete) return <div className="min-h-screen flex items-center justify-center">Registration Complete</div>;

  return <div className="min-h-screen">Form UI here...</div>;
};

export default Register;
