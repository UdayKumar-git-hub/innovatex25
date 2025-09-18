import React, { useReducer, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Trophy, Megaphone, Lightbulb, MessageSquare, ChevronRight,
  ChevronLeft, Check, Star, Mail, Phone, User, CreditCard,
  Sparkles, PartyPopper, AlertTriangle, Instagram
} from 'lucide-react';

// --- Configuration ---
// In Vite apps use `import.meta.env` to read env vars exposed at build time.
const API_URL = import.meta.env.VITE_API_URL || '';
const MOCK_API = !API_URL;

// --- State Management (Reducer) ---
const defaultMember = () => ({ fullName: '', grade: '', email: '', phoneNumber: '' });
const initialFormData = {
  teamName: '',
  teamSize: 2,
  interests: [],
  otherInterest: '',
  superpower: '',
  members: Array(4).fill(null).map(defaultMember),
  agreedToRules: false
};

const formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.payload };

    case 'UPDATE_MEMBER': {
      const index = action.index;
      const newMembers = [...state.members];
      // ensure the member object exists
      if (!newMembers[index]) newMembers[index] = defaultMember();
      newMembers[index] = { ...newMembers[index], [action.field]: action.payload };

      // If team leader (index 0) changed grade, propagate it to other members (business rule)
      if (index === 0 && action.field === 'grade') {
        for (let i = 1; i < state.teamSize; i++) {
          if (!newMembers[i]) newMembers[i] = defaultMember();
          newMembers[i] = { ...newMembers[i], grade: action.payload };
        }
      }
      return { ...state, members: newMembers };
    }

    case 'SET_TEAM_SIZE': {
      const size = Number(action.payload) || 2;
      // clamp between 2 and 4
      const clamped = Math.min(Math.max(size, 2), 4);
      const existing = [...state.members];
      // truncate or extend members array to match new size but keep a backing store of 4 members
      const updatedMembers = existing.slice(0, Math.max(clamped, existing.length));
      while (updatedMembers.length < 4) updatedMembers.push(defaultMember());
      return { ...state, teamSize: clamped, members: updatedMembers };
    }

    default:
      return state;
  }
};

// --- API & SDK Helper Functions ---
const loadCashfreeSDK = () => {
  if (MOCK_API) return Promise.resolve(true);

  return new Promise((resolve, reject) => {
    // Robust checks for many possible global names
    if (typeof window !== 'undefined' && (window.cashfree || window.Cashfree || window.cashfreeSDK)) {
      return resolve(true);
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Cashfree SDK failed to load. Check ad-blockers or network issues.'));
    document.body.appendChild(script);
  });
};

const checkBackendHealth = async () => {
  if (MOCK_API) {
    console.log('MOCK MODE: Simulating a healthy backend.');
    return new Promise((resolve) => setTimeout(() => resolve(true), 300));
  }
  try {
    const res = await fetch(`${API_URL}/api/health`);
    if (!res.ok) return false;
    const json = await res.json();
    return json && json.status === 'ok';
  } catch (err) {
    console.error('Backend health check failed:', err);
    return false;
  }
};

const createPaymentOrder = async (orderData) => {
  if (MOCK_API) {
    console.log('MOCK MODE: Simulating payment order creation with data:', orderData);
    return new Promise((resolve) => setTimeout(() => resolve({ payment_session_id: 'mock_session_id_12345', order_id: 'mock_order_id_67890' }), 700));
  }
  try {
    const response = await fetch(`${API_URL}/api/create-payment-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Payment order creation failed with status ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error('createPaymentOrder error:', err);
    throw err;
  }
};

const saveRegistrationData = async (registrationData) => {
  if (MOCK_API) {
    console.log('MOCK MODE: Simulating saving registration data:', registrationData);
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 700));
  }
  try {
    const response = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registrationData),
    });
    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.message || `Registration save failed with status ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error('saveRegistrationData error:', err);
    throw err;
  }
};

// --- Child Components ---
const StepIndicator = ({ currentStep }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-4 max-w-lg mx-auto">
      {[1, 2, 3, 4, 5].map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step <= currentStep ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step < currentStep ? <Check className="w-5 h-5" /> : step}
            </div>
          </div>
          {index < 4 && (
            <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${step < currentStep ? 'bg-yellow-500' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
    <div className="text-center text-sm text-gray-600 font-semibold">Step {currentStep} of 5</div>
  </div>
);

const RegistrationSuccess = ({ finalPaymentInfo }) => (
  <div className="min-h-screen bg-gradient-to-b from-white via-green-50 to-gray-100 py-32 font-sans flex items-center justify-center">
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center bg-white p-10 rounded-2xl shadow-xl max-w-lg mx-auto">
      <PartyPopper className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h1 className="text-3xl font-bold text-green-600 mb-2">Registration Complete!</h1>
      <p className="text-gray-700 mb-4">Congratulations, <strong>{finalPaymentInfo.teamName}</strong>! Your team is officially registered for InnovateX25.</p>
      <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800">
        <p>Your Payment ID is:</p>
        <p className="font-mono font-semibold mt-1">{finalPaymentInfo.paymentId}</p>
      </div>
      <p className="text-gray-600 mt-6 text-sm">We've sent a confirmation to your team leader's email. Get ready to innovate!</p>
    </motion.div>
  </div>
);

// --- Main Component ---
const Register = () => {
  const [formData, dispatch] = useReducer(formReducer, initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [postPaymentError, setPostPaymentError] = useState('');
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [finalPaymentInfo, setFinalPaymentInfo] = useState({ teamName: '', paymentId: '' });
  const [hasFollowedInstagram, setHasFollowedInstagram] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    let mounted = true;
    const initializeServices = async () => {
      setBackendStatus('checking');
      const isBackendOnline = await checkBackendHealth();
      if (!mounted) return;
      setBackendStatus(isBackendOnline ? 'online' : 'offline');

      if (isBackendOnline) {
        try {
          await loadCashfreeSDK();
          console.log('Cashfree SDK loaded successfully.');
        } catch (error) {
          console.error('Failed to initialize payment SDK:', error);
          setValidationError(error.message);
        }
      } else if (!MOCK_API) {
        setValidationError('Could not connect to the server. Please try again later.');
      }
    };
    initializeServices();
    return () => { mounted = false; };
  }, []);

  const calculateTotal = () => {
    const basePrice = 449;
    const teamDiscount = 50;
    const platformFeeRate = 0.05;
    const subtotal = basePrice * formData.teamSize;
    const priceAfterDiscount = Math.max(0, subtotal - teamDiscount);
    const platformFee = parseFloat((priceAfterDiscount * platformFeeRate).toFixed(2));
    const total = parseFloat((priceAfterDiscount + platformFee).toFixed(2));
    return { subtotal, teamDiscount, priceAfterDiscount, platformFee, total };
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.teamName.trim() !== '';
      case 2:
        return (formData.interests.length > 0 || formData.otherInterest.trim() !== '') && formData.superpower.trim() !== '';
      case 3: {
        for (let i = 0; i < formData.teamSize; i++) {
          const member = formData.members[i] || defaultMember();
          if (!member.fullName.trim()) return false;
          if (!member.grade) return false;
          if (!member.email.trim() || !member.email.includes('@')) return false;
          if (!member.phoneNumber.trim()) return false;
        }
        return true;
      }
      case 4:
        return hasFollowedInstagram;
      case 5:
        return formData.agreedToRules;
      default:
        return false;
    }
  };

  const nextStep = () => {
    setValidationError('');
    if (isStepValid()) {
      if (currentStep < 5) setCurrentStep((s) => s + 1);
    } else {
      setValidationError('Please complete the required fields before moving on.');
    }
  };
  const prevStep = () => {
    setValidationError('');
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handlePayment = async () => {
    setValidationError('');
    setPostPaymentError('');

    const leader = formData.members[0] || defaultMember();
    if (!leader.fullName.trim() || !leader.email.trim().includes('@') || !leader.phoneNumber.trim()) {
      setValidationError("Team Leader's details are incomplete. Please go back and fill them out.");
      setCurrentStep(3);
      return;
    }

    if (backendStatus !== 'online') {
      setValidationError('Payment services are currently unavailable.');
      return;
    }

    setIsLoading(true);

    try {
      const paymentDetails = calculateTotal();
      const orderData = {
        order_amount: paymentDetails.total,
        customer_details: {
          customer_id: `CUST-${Date.now()}`,
          customer_email: leader.email,
          customer_phone: leader.phoneNumber,
          customer_name: leader.fullName,
        }
      };

      const sessionResponse = await createPaymentOrder(orderData);
      const { payment_session_id, order_id } = sessionResponse || {};

      if (!payment_session_id) throw new Error('Failed to create payment session.');

      const onSuccess = async (data) => {
        try {
          if (data.order && data.order.status === 'PAID') {
            const paymentId = data.order.payment_id || data.order.paymentId || 'unknown_payment_id';
            const fullRegistrationData = { ...formData, payment_id: paymentId, order_id: order_id, total_amount: paymentDetails.total };
            try {
              await saveRegistrationData(fullRegistrationData);
              setFinalPaymentInfo({ teamName: formData.teamName, paymentId });
              setRegistrationComplete(true);
            } catch (saveError) {
              console.error('Save error after payment:', saveError);
              setPostPaymentError(`Your payment was successful (Payment ID: ${paymentId}), but we couldn't save your registration. Please contact support with this Payment ID.`);
            }
          } else {
            setPostPaymentError('Payment status was not successful. Please contact support.');
          }
        } finally {
          setIsLoading(false);
        }
      };

      const onFailure = (data) => {
        setIsLoading(false);
        const msg = data?.order?.error_text || data?.message || 'Unknown payment error';
        setPostPaymentError(`Payment failed: ${msg}. Please try again.`);
      };

      if (MOCK_API) {
        // Simulate a small delay then call onSuccess
        setTimeout(() => onSuccess({ order: { status: 'PAID', payment_id: 'mock_payment_id_xyz789' } }), 1200);
      } else {
        // Robustly pick the Cashfree constructor
        const CashfreeClass = window.cashfree?.Cashfree || window.Cashfree || window.cashfreeSDK || null;
        if (!CashfreeClass) throw new Error('Payment SDK not initialized or blocked by browser extensions.');
        const cashfree = new CashfreeClass();
        if (typeof cashfree.drop !== 'function') throw new Error('Payment SDK does not expose the `drop` method.');

        cashfree.drop(document.getElementById('payment-form'), {
          components: ['order-details', 'card', 'upi', 'netbanking'],
          paymentSessionId: payment_session_id,
          onSuccess,
          onFailure,
        });
      }

    } catch (err) {
      console.error('handlePayment error:', err);
      setValidationError(err.message || 'Could not connect to the payment gateway.');
      setIsLoading(false);
    }
  };

  if (registrationComplete) return <RegistrationSuccess finalPaymentInfo={finalPaymentInfo} />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-yellow-50 to-gray-100 py-20 font-sans">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-600 flex items-center justify-center"><Sparkles className="h-8 w-8 mr-3" />InnovateX25 Registration</h1>
          <p className="text-gray-600 mt-4 mb-2">Presented by reelhaus.hyd</p>
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-yellow-200/50 mt-8 max-w-2xl mx-auto">
            {backendStatus === 'checking' && <div className="p-3 bg-blue-100 border rounded-lg text-blue-800 text-sm">🔄 Checking backend services...</div>}
            {backendStatus === 'offline' && <div className="p-3 bg-red-100 border rounded-lg text-red-800 text-sm">⚠️ Backend services are currently unavailable.</div>}
            {backendStatus === 'online' && <div className="p-3 bg-green-100 border rounded-lg text-green-800 text-sm">✅ All systems ready!</div>}
          </div>
        </motion.div>

        <StepIndicator currentStep={currentStep} />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-yellow-200/50"
          >
            <div id="payment-form"></div>

            {/* --- Step 1 --- */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><Users className="w-6 h-6 mr-3 text-yellow-500" />Your Team Identity</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Awesome Team Name:</label>
                    <input type="text" value={formData.teamName} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'teamName', payload: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" placeholder="Enter your team name" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Your Team Size:</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[2, 3, 4].map((size) => (
                        <label key={size} className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-yellow-50 ${formData.teamSize === size ? 'border-yellow-500 bg-yellow-50 ring-2 ring-yellow-400' : 'border-gray-300'}`}>
                          <input type="radio" name="teamSize" value={size} checked={formData.teamSize === size} onChange={(e) => dispatch({ type: 'SET_TEAM_SIZE', payload: parseInt(e.target.value) })} className="sr-only" />
                          <span className="font-medium">Team of {size}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- Step 2 --- */}
            {currentStep === 2 && (() => {
              const challenges = [{ id: 'ipl', name: 'IPL Auction', description: 'Building a dream cricket team with a budget', icon: Trophy }, { id: 'brand', name: 'Brand Battles', description: 'Creating and pitching a cool new brand', icon: Megaphone }, { id: 'innovators', name: 'Young Innovators', description: 'Coming up with a game-changing new idea', icon: Lightbulb }, { id: 'echoes', name: 'ECHOES', description: 'Sharing your story and speaking your mind', icon: MessageSquare }];
              const interests = ['Gaming & Esports', 'Technology & Coding', 'Art, Design & Video', 'Sports & Strategy', 'Public Speaking & Debating', 'Business & Marketing'];
              const handleInterestToggle = (interest) => { const newInterests = formData.interests.includes(interest) ? formData.interests.filter(i => i !== interest) : [...formData.interests, interest]; dispatch({ type: 'UPDATE_FIELD', field: 'interests', payload: newInterests }); };
              return (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><Star className="w-6 h-6 mr-3 text-yellow-500" />Tell Us About Your Team!</h2>
                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-4">All teams will compete in all challenges. Get ready!</label>
                      <div className="grid md:grid-cols-2 gap-4">{challenges.map(c => <div key={c.id} className="flex items-start p-4 bg-gray-50/50 border border-gray-200 rounded-lg"><c.icon className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" /><div><div className="font-medium text-gray-800">{c.name}</div><div className="text-sm text-gray-600">{c.description}</div></div></div>)}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-4">What are your team's interests? (Check all that apply)</label>
                      <div className="grid md:grid-cols-2 gap-3">{interests.map(i => <label key={i} className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-yellow-50 ${formData.interests.includes(i) ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300'}`}><input type="checkbox" checked={formData.interests.includes(i)} onChange={() => handleInterestToggle(i)} className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500" /><span className="ml-3 text-gray-700">{i}</span></label>)}<div className="flex items-center p-3 border rounded-lg focus-within:ring-2 focus-within:ring-yellow-500"><input type="checkbox" checked={formData.otherInterest !== ''} readOnly className="w-4 h-4 text-yellow-600" /><input type="text" value={formData.otherInterest} onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'otherInterest', payload: e.target.value })} placeholder="Other..." className="ml-3 flex-1 bg-transparent outline-none" /></div></div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">What's your team's secret superpower?</label>
                      <textarea value={formData.superpower} onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'superpower', payload: e.target.value })} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500" rows={3} placeholder="e.g., Super creative, amazing planners..." />
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* --- Step 3 --- */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><User className="w-6 h-6 mr-3 text-yellow-500" /> Your Team Roster</h2>
                <p className="text-sm text-gray-600 mb-6 -mt-4">The team's grade will be set by the Team Leader.</p>
                <div className="space-y-8">
                  {Array.from({ length: formData.teamSize }).map((_, index) => (
                    <div key={index} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Member {index + 1} {index === 0 && '(Team Leader)'}</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <input type="text" value={formData.members[index]?.fullName || ''} onChange={e => dispatch({ type: 'UPDATE_MEMBER', index, field: 'fullName', payload: e.target.value })} placeholder="Full Name" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500" />
                        <select value={formData.members[index]?.grade || ''} onChange={e => dispatch({ type: 'UPDATE_MEMBER', index, field: 'grade', payload: e.target.value })} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-200/70" disabled={index > 0}>
                          <option value="">Select Grade</option>
                          <option value="7th">7th</option>
                          <option value="8th">8th</option>
                          <option value="9th">9th</option>
                        </select>
                        <input type="email" value={formData.members[index]?.email || ''} onChange={e => dispatch({ type: 'UPDATE_MEMBER', index, field: 'email', payload: e.target.value })} placeholder="Email Address" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500" />
                        <input type="tel" value={formData.members[index]?.phoneNumber || ''} onChange={e => dispatch({ type: 'UPDATE_MEMBER', index, field: 'phoneNumber', payload: e.target.value })} placeholder="Phone Number" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- Step 4 --- */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><Instagram className="w-6 h-6 mr-3 text-yellow-500" /> Stay Updated!</h2>
                <div className="text-center space-y-6">
                  <p className="text-gray-700">Follow <a href="https://www.instagram.com/reelhaus.hyd/" target="_blank" rel="noopener noreferrer" className="font-semibold text-yellow-600 hover:underline">@reelhaus.hyd</a> on Instagram for all event updates!</p>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Scan the QR code to follow us:</p>
                    <div className="flex justify-center"><img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.instagram.com/reelhaus.hyd/" alt="QR code for Instagram" className="rounded-lg shadow-md" /></div>
                  </div>
                  <div className="flex items-start justify-center p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-md mx-auto">
                    <input type="checkbox" id="follow" checked={hasFollowedInstagram} onChange={e => setHasFollowedInstagram(e.target.checked)} className="mt-1 mr-3 h-4 w-4 text-blue-600 rounded focus:ring-blue-500" />
                    <label htmlFor="follow" className="text-gray-700 text-left">Yes, our team is now following @reelhaus.hyd for important updates!</label>
                  </div>
                </div>
              </div>
            )}

            {/* --- Step 5 --- */}
            {currentStep === 5 && (() => {
              const paymentDetails = calculateTotal();
              return (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><CreditCard className="w-6 h-6 mr-3 text-yellow-500" /> Registration Fee & Payment</h2>
                  <div className="space-y-6">
                    {postPaymentError && <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 flex items-start"><AlertTriangle className='h-5 w-5 mr-3 flex-shrink-0' /><p><span className="font-bold">Payment Error:</span> {postPaymentError}</p></div>}
                    <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-6 rounded-lg border border-yellow-300"><h3 className="text-lg font-bold text-yellow-800 mb-2 flex items-center"><Sparkles className="w-6 h-6 mr-2" />Early Bird Offer!</h3><p className="text-yellow-700 mb-2">Register before <strong>October 15th, 2025</strong> and get a <strong>₹50 discount per team!</strong></p><p className="text-yellow-800 font-semibold">Early Bird Price: ₹449 per person</p></div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Summary</h3>
                      <div className="space-y-3 text-gray-700">
                        <div className="flex justify-between"><span>Team of {formData.teamSize} × ₹449</span><span>₹{paymentDetails.subtotal.toLocaleString()}</span></div>
                        <div className="flex justify-between text-green-600"><span>Early Bird Discount</span><span>- ₹{paymentDetails.teamDiscount.toLocaleString()}</span></div>
                        <hr className="my-2" />
                        <div className="flex justify-between font-semibold"><span>Subtotal</span><span>₹{paymentDetails.priceAfterDiscount.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Platform Fee (5%)</span><span>+ ₹{paymentDetails.platformFee.toFixed(2)}</span></div>
                        <hr className="my-2 border-t-2 border-gray-300" />
                        <div className="flex justify-between text-2xl font-bold text-gray-800 mt-2"><span>Total Amount Due</span><span>₹{paymentDetails.total.toFixed(2)}</span></div>
                      </div>
                    </div>
                    <div className="flex items-start p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <input type="checkbox" id="agreeRules" checked={formData.agreedToRules} onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'agreedToRules', payload: e.target.checked })} className="mt-1 mr-3 h-4 w-4 text-blue-600 rounded focus:ring-blue-500" />
                      <label htmlFor="agreeRules" className="text-gray-700">By checking this box, our team agrees to the rules and is ready to bring our A-game!</label>
                    </div>
                    {validationError && <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center font-medium">{validationError}</div>}
                  </div>
                </div>
              );
            })()}

          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <button onClick={prevStep} disabled={currentStep === 1} className="flex items-center px-6 py-3 bg-gray-200 rounded-lg font-semibold disabled:opacity-50 hover:bg-gray-300"><ChevronLeft className="w-5 h-5 mr-2" />Previous</button>
          {currentStep < 5 ? (
            <button onClick={nextStep} disabled={!isStepValid()} className="flex items-center px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 disabled:opacity-50">Next<ChevronRight className="w-5 h-5 ml-2" /></button>
          ) : (
            <button onClick={handlePayment} disabled={!formData.agreedToRules || isLoading || backendStatus !== 'online'} className="flex items-center justify-center px-8 py-3 bg-green-500 text-white rounded-lg font-semibold w-60 hover:bg-green-600 disabled:opacity-50">
              {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <>{backendStatus !== 'online' ? 'Service Unavailable' : 'Proceed to Payment'}<CreditCard className="w-5 h-5 ml-2" /></>}
            </button>
          )}
        </div>

        <div className="mt-12 text-center bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-yellow-200/50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Questions? Contact us:</h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center"><Mail className="w-5 h-5 text-yellow-500 mr-2" />reelhaus.hyd@gmail.com</div>
            <div className="flex items-center"><Phone className="w-5 h-5 text-yellow-500 mr-2" />+919392449721</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
