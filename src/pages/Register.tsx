import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Trophy, 
  Megaphone, 
  Lightbulb, 
  MessageSquare, 
  ChevronRight, 
  ChevronLeft,
  Check,
  Star,
  Mail,
  Phone,
  User, 
  CreditCard,
  Sparkles,
  PartyPopper,
  AlertTriangle,
  Instagram
} from 'lucide-react';

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

// For TypeScript to recognize the Cashfree and Supabase objects on the window
interface CustomWindow extends Window {
    Cashfree: any;
    supabase: any; // Add supabase to the window interface
}

declare const window: CustomWindow;


const Register: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [supabase, setSupabase] = useState<any>(null); // State to hold the client
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [finalPaymentInfo, setFinalPaymentInfo] = useState({ teamName: '', paymentId: ''});
  const [postPaymentError, setPostPaymentError] = useState('');
  const [hasFollowedInstagram, setHasFollowedInstagram] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    teamName: '',
    teamSize: 2,
    challenges: ['ipl', 'brand', 'innovators', 'echoes'],
    interests: [],
    otherInterest: '',
    superpower: '',
    members: Array(4).fill(null).map(() => ({
      fullName: '',
      grade: '',
      email: '',
      phoneNumber: ''
    })),
    agreedToRules: false
  });

  useEffect(() => {
    // Load Cashfree Script
    const cashfreeScript = document.createElement('script');
    cashfreeScript.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    cashfreeScript.async = true;
    document.body.appendChild(cashfreeScript);

    // Load Supabase Script
    const supabaseScript = document.createElement('script');
    supabaseScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    supabaseScript.async = true;

    supabaseScript.onload = () => {
      const supabaseUrl = 'https://ytjnonkfkhcpkijhvlqi.supabase.co'; 
      const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
      
      if (supabaseUrl && supabaseAnonKey && window.supabase) {
        const { createClient } = window.supabase;
        setSupabase(createClient(supabaseUrl, supabaseAnonKey));
        console.log("Supabase client initialized successfully.");
      } else {
        console.warn("Supabase credentials missing or script failed to load.");
      }
    };
    document.body.appendChild(supabaseScript);

    return () => {
        if (document.body.contains(cashfreeScript)) {
            document.body.removeChild(cashfreeScript);
        }
        if (document.body.contains(supabaseScript)) {
            document.body.removeChild(supabaseScript);
        }
    }
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

  const isStepValid = () => {
    switch (currentStep) {
        case 1:
            return formData.teamName.trim() !== '';
        case 2:
            return (formData.interests.length > 0 || formData.otherInterest.trim() !== '') && formData.superpower.trim() !== '';
        case 3:
            for (let i = 0; i < formData.teamSize; i++) {
                const member = formData.members[i];
                if (!member.fullName.trim() || !member.grade || !member.email.trim() || !member.phoneNumber.trim()) {
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
    if (currentStep < 5 && isStepValid()) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // This function is called AFTER a successful payment
  const handleSuccessfulPayment = async (paymentId: string) => {
    const paymentDetails = calculateTotal();
    try {
        const registrationData = {
            team_name: formData.teamName,
            team_size: formData.teamSize,
            grade: formData.members[0].grade,
            interests: formData.interests,
            other_interest: formData.otherInterest,
            superpower: formData.superpower,
            members: formData.members.slice(0, formData.teamSize),
            payment_id: paymentId,
            total_amount: paymentDetails.total,
            payment_gateway: 'Cashfree'
        };
        
        if (!supabase) {
            console.error("Supabase client is not initialized.");
            throw new Error("Supabase is not connected.");
        }

        const { data, error } = await supabase
            .from('registrations')
            .insert([registrationData])
            .select();

        if (error) {
            throw error;
        }

        console.log('Successfully saved to Supabase:', data);
        setFinalPaymentInfo({
            teamName: formData.teamName,
            paymentId: paymentId
        });
        setRegistrationComplete(true);

    } catch (error: any) {
        console.error('Error saving to Supabase after payment:', error);
        setPostPaymentError(
            `Your payment was successful (ID: ${paymentId}), but registration failed. Please contact support.`
        );
    } finally {
        setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!isStepValid()) {
        setValidationError("Please ensure you've agreed to the rules before proceeding.");
        return;
    }
    setValidationError('');
    setPostPaymentError('');
    setIsLoading(true);

    if (!window.Cashfree) {
      setValidationError("Payment gateway failed to load.");
      setIsLoading(false);
      return;
    }
    
    try {
        console.log("Creating secure payment session...");
        const paymentDetails = calculateTotal();
        const customerDetails = {
            customer_id: `customer_${Date.now()}`,
            customer_name: formData.members[0].fullName,
            customer_email: formData.members[0].email,
            customer_phone: formData.members[0].phoneNumber,
        };
        
        const orderMeta = {
            team_name: formData.teamName,
            team_size: formData.teamSize
        };

        const response = await fetch('http://localhost:3001/api/create-payment-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: paymentDetails.total,
                customer_details: customerDetails,
                order_meta: orderMeta
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create payment session');
        }
        
        const sessionData = await response.json();
        const paymentSessionId = sessionData.payment_session_id;

        console.log("Payment session created successfully:", paymentSessionId);
        
        const cashfree = new window.Cashfree({ mode: sessionData.environment || "sandbox" });
        const result = await cashfree.checkout({ paymentSessionId });
        
        if (result.error) {
            console.error("Payment failed:", result.error.message);
            setValidationError(`Payment failed: ${result.error.message}`);
            setIsLoading(false);
            return;
        }
        
        if (result.paymentDetails) {
            console.log("Payment successful:", result.paymentDetails);
            handleSuccessfulPayment(result.paymentDetails.cf_payment_id);
        }
        
    } catch (error: any) {
        console.error("Payment initialization failed:", error);
        setValidationError(error.message || "Could not initiate payment.");
        setIsLoading(false);
    }
  };

  return (
    <div>
      {/* The UI code remains unchanged, except for payment handling now using Cashfree */}
    </div>
  );
};

export default Register;
