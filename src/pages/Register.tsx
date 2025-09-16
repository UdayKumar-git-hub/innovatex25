import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Trophy, Megaphone, Lightbulb, MessageSquare, ChevronRight,
  ChevronLeft, Check, Star, Mail, Phone, User, CreditCard,
  Sparkles, PartyPopper, AlertTriangle, Instagram
} from 'lucide-react';

// --- Helper Functions ---

// Hardcoding the URL to fix the `import.meta.env` build error.
const API_URL = 'http://localhost:4000';

/**
 * Dynamically loads the Cashfree SDK by creating a script tag.
 * This is the most compatible method and avoids build issues.
 */
const loadCashfreeSDK = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // If the SDK is already loaded, resolve immediately.
    if (typeof (window as any).cashfree === 'object') {
      return resolve(true);
    }
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Cashfree SDK failed to load. Check ad-blockers or network issues.'));
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

// --- Component Interfaces ---
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

// --- Main Component ---
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
    members: Array(4).fill(null).map(() => ({
      fullName: '', grade: '', email: '', phoneNumber: ''
    })),
    agreedToRules: false
  });

  React.useEffect(() => {
    const initializeServices = async () => {
      setBackendStatus('checking');
      const isBackendOnline = await checkBackendHealth();
      setBackendStatus(isBackendOnline ? 'online' : 'offline');

      if (isBackendOnline) {
        try {
          // Load the SDK when the component mounts and backend is online.
          await loadCashfreeSDK();
          console.log('Cashfree SDK loaded successfully.');
        } catch (error) {
          console.error('Failed to initialize payment SDK:', error);
          setValidationError((error as Error).message);
        }
      } else {
        setValidationError('Could not connect to the server. Please ensure your backend is running and try again.');
      }
    };
    initializeServices();
  }, []);
  
  const challenges = [
    { id: 'ipl', name: 'IPL Auction', description: 'Building a dream cricket team with a budget', icon: Trophy },
    { id: 'brand', name: 'Brand Battles', description: 'Creating and pitching a cool new brand', icon: Megaphone },
    { id: 'innovators', name: 'Young Innovators', description: 'Coming up with a game-changing new idea', icon: Lightbulb },
    { id: 'echoes', name: 'ECHOES', description: 'Sharing your story and speaking your mind', icon: MessageSquare }
  ];

  const interests = [
    'Gaming & Esports',
    'Technology & Coding',
    'Art, Design & Video',
    'Sports & Strategy',
    'Public Speaking & Debating',
    'Business & Marketing'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMemberChange = (index: number, field: string, value: string) => {
    const newMembers = [...formData.members];
    newMembers[index] = { ...newMembers[index], [field]: value };

    if (index === 0 && field === 'grade') {
      for (let i = 1; i < formData.teamSize; i++) {
        newMembers[i] = { ...newMembers[i], grade: value };
      }
    }
    setFormData(prev => ({ ...prev, members: newMembers }));
  };

  const handleInterestToggle = (interest: string) => {
    const newInterests = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest];
    handleInputChange('interests', newInterests);
  };

  const calculateTotal = () => {
    const basePrice = 449;
    const teamDiscount = 50;
    const platformFeeRate = 0.05;

    const subtotal = basePrice * formData.teamSize;
    const priceAfterDiscount = subtotal - teamDiscount;
    const platformFee = priceAfterDiscount * platformFeeRate;
    const total = priceAfterDiscount + platformFee;

    return { subtotal, teamDiscount, priceAfterDiscount, platformFee, total };
  };
  
  const handlePayment = async () => {
    // ✨ 1. ADDED: Final, robust validation before sending the payment request.
    const leader = formData.members[0];
    if (!leader.fullName.trim() || !leader.email.trim().includes('@') || !leader.phoneNumber.trim()) {
      setValidationError("Team Leader's details (Full Name, Email, Phone) are incomplete. Please go back and fill them out.");
      // Set the step back to the user details page for convenience.
      setCurrentStep(3); 
      return;
    }

    if (backendStatus !== 'online' || !isStepValid()) {
      setValidationError("Please fix the errors before proceeding.");
      return;
    }
    setValidationError('');
    setPostPaymentError('');
    setIsLoading(true);

    try {
      const paymentDetails = calculateTotal();
      const orderData = {
        order_amount: parseFloat(paymentDetails.total.toFixed(2)),
        customer_details: {
          customer_id: `CUST-${Date.now()}`,
          customer_email: formData.members[0].email,
          customer_phone: formData.members[0].phoneNumber,
          customer_name: formData.members[0].fullName,
        }
      };
      
      // ✨ 2. ADDED: A console log to show you the exact data being sent.
      // This helps with debugging if the error persists.
      console.log("Sending order data to backend:", orderData);

      const sessionResponse = await createPaymentOrder(orderData);
      const { payment_session_id, order_id } = sessionResponse;

      if (!payment_session_id) {
        throw new Error("Failed to create payment session from backend.");
      }

      // Use the globally available `cashfree` object from the loaded script.
      const cashfree = new (window as any).cashfree.Cashfree();
      
      const dropinConfig = {
        components: ["order-details", "card", "upi", "netbanking"],
        paymentSessionId: payment_session_id,
        onSuccess: (data: any) => {
          setIsLoading(false);
          if (data.order && data.order.status === 'PAID') {
            const paymentId = data.order.payment_id;
            const registrationData = {
              team_name: formData.teamName,
              payment_id: paymentId,
              order_id: order_id,
              total_amount: paymentDetails.total
              // ... add other form data to save
            };
            console.log("Saving registration:", registrationData);
            localStorage.setItem('registrationData', JSON.stringify(registrationData));
            
            setFinalPaymentInfo({ teamName: formData.teamName, paymentId });
            setRegistrationComplete(true);
          } else {
             setPostPaymentError("Payment status was not successful. Please contact support.");
          }
        },
        onFailure: (data: any) => {
          setIsLoading(false);
          setPostPaymentError(`Payment failed: ${data.order.error_text}. Please try again.`);
        },
      };
      
      cashfree.drop(dropinConfig);

    } catch (error: any) {
      setValidationError(error.message || "Could not connect to the payment gateway.");
      setIsLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.teamName.trim() !== '';
      case 2:
        return (formData.interests.length > 0 || formData.otherInterest.trim() !== '') && formData.superpower.trim() !== '';
      case 3:
        for (let i = 0; i < formData.teamSize; i++) {
          const member = formData.members[i];
          if (!member.fullName.trim() || !member.grade || !member.email.trim().includes('@') || !member.phoneNumber.trim()) {
            return false;
          }
        }
        return true;
      case 4:
        return hasFollowedInstagram;
      case 5:
        return formData.agreedToRules;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (isStepValid()) {
      if(currentStep < 5) setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (registrationComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-green-50 to-gray-100 py-32 font-sans flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white p-10 rounded-2xl shadow-xl max-w-lg mx-auto"
        >
          <PartyPopper className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-600 mb-2">Registration Complete!</h1>
          <p className="text-gray-700 mb-4">
            Congratulations, <strong>{finalPaymentInfo.teamName}</strong>! Your team is officially registered for InnovateX25.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800">
            <p>Your Payment ID is:</p>
            <p className="font-mono font-semibold mt-1">{finalPaymentInfo.paymentId}</p>
          </div>
          <p className="text-gray-600 mt-6 text-sm">We've sent a confirmation to your team leader's email. Get ready to innovate!</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-yellow-50 to-gray-100 py-32 font-sans">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-yellow-500 mr-3" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-600">
              InnovateX25 Registration
            </h1>
          </div>
          <p className="text-gray-600 mb-2">Presented by reelhaus.hyd</p>
          <p className="text-lg font-semibold text-yellow-600">#UnleashingtheX-FactorofInnovation</p>
          
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-yellow-200/50 mt-8 max-w-2xl mx-auto">
            {backendStatus === 'checking' && (
              <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded-lg">
                <p className="text-blue-800 text-sm">🔄 Checking backend services...</p>
              </div>
            )}
            {backendStatus === 'offline' && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-800 text-sm">⚠️ Backend services are currently unavailable. Please try again later.</p>
              </div>
            )}
            {backendStatus === 'online' && (
              <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                <p className="text-green-800 text-sm">✅ All systems ready!</p>
              </div>
            )}
            <p className="text-gray-700 leading-relaxed">
              Hey Innovators! Get ready for an epic experience where your ideas can shine. 
              InnovateX25 is your chance to team up with friends, tackle fun challenges, and show everyone what you've got!
            </p>
          </div>
        </motion.div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 max-w-lg mx-auto">
            {[1, 2, 3, 4, 5].map((step, index) => (
              <React.Fragment key={step}>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    step <= currentStep ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step < currentStep ? <Check className="w-5 h-5" /> : step}
                  </div>
                </div>
                {index < 4 && (
                  <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                    step < currentStep ? 'bg-yellow-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="text-center text-sm text-gray-600 font-semibold">
            Step {currentStep} of 5
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-yellow-200/50"
          >
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Users className="w-6 h-6 mr-3 text-yellow-500" />
                  Your Team Identity
                </h2>
              
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Awesome Team Name:
                    </label>
                    <input
                      type="text"
                      value={formData.teamName}
                      onChange={(e) => handleInputChange('teamName', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Enter your team name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Your Team Size:
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {[2, 3, 4].map((size) => (
                        <label key={size} className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-yellow-50 transition-colors ${formData.teamSize === size ? 'border-yellow-500 bg-yellow-50 ring-2 ring-yellow-400' : 'border-gray-300'}`}>
                          <input
                            type="radio"
                            name="teamSize"
                            value={size}
                            checked={formData.teamSize === size}
                            onChange={(e) => handleInputChange('teamSize', parseInt(e.target.value))}
                            className="sr-only"
                          />
                          <span className="font-medium">Team of {size}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Star className="w-6 h-6 mr-3 text-yellow-500" />
                  Tell Us About Your Team!
                </h2>
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      All teams will compete in all challenges. Get ready!
                    </label>
                    <div className="grid md:grid-cols-2 gap-4">
                      {challenges.map((challenge) => {
                        const IconComponent = challenge.icon;
                        return (
                          <div key={challenge.id} className="flex items-start p-4 bg-gray-50/50 border border-gray-200 rounded-lg">
                            <IconComponent className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-gray-800">{challenge.name}</div>
                              <div className="text-sm text-gray-600">{challenge.description}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      What are your team's interests? (Check all that apply)
                    </label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {interests.map((interest) => (
                        <label key={interest} className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-yellow-50 transition-colors ${formData.interests.includes(interest) ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300'}`}>
                          <input
                            type="checkbox"
                            checked={formData.interests.includes(interest)}
                            onChange={() => handleInterestToggle(interest)}
                            className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500"
                          />
                          <span className="ml-3 text-gray-700">{interest}</span>
                        </label>
                      ))}
                      <div className="flex items-center p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-yellow-500">
                        <input
                          type="checkbox"
                          checked={formData.otherInterest !== ''}
                          readOnly
                          className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500"
                        />
                        <input
                          type="text"
                          value={formData.otherInterest}
                          onChange={(e) => handleInputChange('otherInterest', e.target.value)}
                          placeholder="Other..."
                          className="ml-3 flex-1 bg-transparent border-none outline-none placeholder-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      What's your team's secret superpower?
                    </label>
                    <textarea
                      value={formData.superpower}
                      onChange={(e) => handleInputChange('superpower', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      rows={3}
                      placeholder="e.g., Super creative, amazing planners, master strategists..."
                    />
                  </div>
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <User className="w-6 h-6 mr-3 text-yellow-500" />
                  Your Team Roster
                </h2>
                  <p className="text-sm text-gray-600 mb-6 -mt-4">The team's grade will be set by the Team Leader.</p>

                <div className="space-y-8">
                  {Array.from({ length: formData.teamSize }, (_, index) => (
                    <div key={index} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Member {index + 1} {index === 0 && '(Team Leader)'}
                      </h3>
                    
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name:
                          </label>
                          <input
                            type="text"
                            value={formData.members[index].fullName}
                            onChange={(e) => handleMemberChange(index, 'fullName', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="Enter full name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Grade:
                          </label>
                          <select
                            value={formData.members[index].grade}
                            onChange={(e) => handleMemberChange(index, 'grade', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-200/70 disabled:cursor-not-allowed"
                            disabled={index > 0}
                          >
                            <option value="">Select Grade</option>
                            <option value="7th">7th</option>
                            <option value="8th">8th</option>
                            <option value="9th">9th</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address:
                          </label>
                          <input
                            type="email"
                            value={formData.members[index].email}
                            onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="Enter email address"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number:
                          </label>
                          <input
                            type="tel"
                            value={formData.members[index].phoneNumber}
                            onChange={(e) => handleMemberChange(index, 'phoneNumber', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Instagram className="w-6 h-6 mr-3 text-yellow-500" />
                  Stay Updated!
                </h2>
                <div className="text-center space-y-6">
                  <p className="text-gray-700">
                    Follow <a href="https://www.instagram.com/reelhaus.hyd/" target="_blank" rel="noopener noreferrer" className="font-semibold text-yellow-600 hover:underline">@reelhaus.hyd</a> on Instagram for all event updates, announcements, and behind-the-scenes fun!
                  </p>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Scan the QR code to follow us:</p>
                    <div className="flex justify-center">
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.instagram.com/reelhaus.hyd/" 
                        alt="QR code for reelhaus.hyd Instagram"
                        className="rounded-lg shadow-md"
                      />
                    </div>
                  </div>
                  <div className="flex items-start justify-center p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-md mx-auto">
                    <input
                      type="checkbox"
                      id="follow"
                      checked={hasFollowedInstagram}
                      onChange={(e) => setHasFollowedInstagram(e.target.checked)}
                      className="mt-1 mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="follow" className="text-gray-700 text-left">
                      Yes, our team is now following @reelhaus.hyd for important updates!
                    </label>
                  </div>
                </div>
              </div>
            )}
            {currentStep === 5 && (() => {
              const paymentDetails = calculateTotal();
              return (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <CreditCard className="w-6 h-6 mr-3 text-yellow-500" />
                    Registration Fee & Payment
                  </h2>
                  
                  <div className="space-y-6">
                    {postPaymentError && (
                      <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                        <div className='flex'>
                          <AlertTriangle className='h-5 w-5 text-red-500 mr-3'/>
                          <div>
                            <p className="font-bold">Payment Error</p>
                            <p>{postPaymentError}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-6 rounded-lg border border-yellow-300">
                      <div className="flex items-center mb-4">
                        <Sparkles className="w-6 h-6 text-yellow-600 mr-2" />
                        <h3 className="text-lg font-bold text-yellow-800">Early Bird Offer!</h3>
                      </div>
                      <p className="text-yellow-700 mb-2">
                        Register before <strong>October 15th, 2025</strong> and get a <strong>₹50 discount per team!</strong>
                      </p>
                      <p className="text-yellow-800 font-semibold">
                        Early Bird Price: ₹449 per person (Regular: ₹499)
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Summary</h3>
                        <div className="space-y-3 text-gray-700">
                          <div className="flex justify-between">
                              <span>Team of {formData.teamSize} × ₹449</span>
                              <span>₹{paymentDetails.subtotal.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-green-600">
                              <span>Early Bird Discount</span>
                              <span>- ₹{paymentDetails.teamDiscount.toLocaleString()}</span>
                          </div>
                          <hr className="my-2"/>
                          <div className="flex justify-between font-semibold">
                              <span>Subtotal</span>
                              <span>₹{paymentDetails.priceAfterDiscount.toLocaleString()}</span>
                          </div>
                           <div className="flex justify-between">
                              <span>Platform Fee (5%)</span>
                              <span>+ ₹{paymentDetails.platformFee.toFixed(2)}</span>
                          </div>
                          <hr className="my-2 border-t-2 border-gray-300"/>
                          <div className="flex justify-between text-2xl font-bold text-gray-800 mt-2">
                              <span>Total Amount Due</span>
                              <span>₹{paymentDetails.total.toFixed(2)}</span>
                          </div>
                      </div>
                    </div>
                    <div className="flex items-start p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <input
                        type="checkbox"
                        id="agreeRules"
                        checked={formData.agreedToRules}
                        onChange={(e) => handleInputChange('agreedToRules', e.target.checked)}
                        className="mt-1 mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="agreeRules" className="text-gray-700">
                        By checking this box, our team agrees to the rules and is ready to bring our A-game!
                      </label>
                    </div>
                    {validationError && (
                        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center font-medium">
                            {validationError}
                        </div>
                    )}
                  </div>
                </div>
              )
            })()}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </button>
          {currentStep < 5 ? (
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className="flex items-center px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <button
              onClick={handlePayment}
              disabled={!formData.agreedToRules || isLoading || backendStatus !== 'online'}
              className="flex items-center justify-center px-8 py-3 bg-green-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors w-60"
            >
              {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  Proceed to Payment
                  {backendStatus !== 'online' && (
                    <span className="ml-2 text-xs">(Service Unavailable)</span>
                  )}
                  <CreditCard className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          )}
        </div>
        <div className="mt-12 text-center bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-yellow-200/50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Questions? Contact the event crew:</h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-gray-700">reelhaus.hyd@gmail.com</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-gray-700">+919392449721, +919110387918</span>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default Register;


