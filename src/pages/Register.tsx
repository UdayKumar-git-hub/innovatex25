// File: Register.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Trophy, Megaphone, Lightbulb, MessageSquare, ChevronRight,
    ChevronLeft, Check, Star, Mail, Phone, User, CreditCard,
    Sparkles, PartyPopper, AlertTriangle, Instagram
} from 'lucide-react';

// --- Configuration ---
// This URL must point to your running backend server.
const BACKEND_URL = 'http://localhost:3001';

// --- Type Definitions ---
interface TeamMember {
    fullName: string;
    grade: string;
    email: string;
    phoneNumber: string;
}

interface FormData {
    teamName: string;
    teamSize: number;
    interests: string[];
    otherInterest: string;
    superpower: string;
    members: TeamMember[];
    agreedToRules: boolean;
}

// For recognizing SDKs on the window object
interface CustomWindow extends Window {
    Cashfree?: any;
    supabase?: any;
}
declare const window: CustomWindow;

// --- Custom Hook for Loading External Scripts ---
const useExternalScript = (src: string, sdkName: string) => {
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (window[sdkName as keyof Window]) {
            setIsReady(true);
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = true;

        const onLoad = () => {
            console.log(`${sdkName} SDK script loaded.`);
            setIsReady(true);
        };
        const onError = () => {
            const msg = `Failed to load the ${sdkName} script.`;
            console.error(msg);
            setError(msg);
        };

        script.addEventListener('load', onLoad);
        script.addEventListener('error', onError);

        document.body.appendChild(script);

        return () => {
            script.removeEventListener('load', onLoad);
            script.removeEventListener('error', onError);
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [src, sdkName]);

    return { isReady, error };
};


// ==================================================================
// MAIN REGISTER COMPONENT
// ==================================================================
const Register: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [supabase, setSupabase] = useState<any>(null);
    const [registrationComplete, setRegistrationComplete] = useState(false);
    const [finalPaymentInfo, setFinalPaymentInfo] = useState({ teamName: '', paymentId: '' });
    const [postPaymentError, setPostPaymentError] = useState('');
    const [hasFollowedInstagram, setHasFollowedInstagram] = useState(false);

    // Use custom hooks to manage SDK loading
    const { isReady: isCashfreeReady, error: cashfreeError } = useExternalScript('https://sdk.cashfree.com/js/v3/cashfree.js', 'Cashfree');
    const { isReady: isSupabaseReady, error: supabaseError } = useExternalScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2', 'supabase');

    const [formData, setFormData] = useState<FormData>({
        teamName: '',
        teamSize: 2,
        interests: [],
        otherInterest: '',
        superpower: '',
        members: Array(4).fill(null).map(() => ({ fullName: '', grade: '', email: '', phoneNumber: '' })),
        agreedToRules: false
    });

    // Initialize Supabase client once the script is ready
    useEffect(() => {
        if (isSupabaseReady && window.supabase) {
            const supabaseUrl = 'https://ytjnonkfkhcpkijhvlqi.supabase.co';
            const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0am5vbmtma2hjcGtpamh2bHFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MTAzMjgsImV4cCI6MjA3Mjk4ODMyOH0.4TrFHEY-r1YMrqfG8adBmjgnVKYCnUC34rvnwsZfehE';
            if (supabaseUrl && supabaseAnonKey) {
                const { createClient } = window.supabase;
                setSupabase(createClient(supabaseUrl, supabaseAnonKey));
                console.log("Supabase client initialized successfully.");
            }
        }
    }, [isSupabaseReady]);

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

    const calculateTotal = useCallback(() => {
        const basePrice = 449;
        const teamDiscount = 50;
        const platformFeeRate = 0.05;
        const subtotal = basePrice * formData.teamSize;
        const priceAfterDiscount = subtotal - teamDiscount;
        const platformFee = priceAfterDiscount * platformFeeRate;
        const total = priceAfterDiscount + platformFee;
        return { total };
    }, [formData.teamSize]);

    const isStepValid = useCallback(() => {
        switch (currentStep) {
            case 1:
                return formData.teamName.trim() !== '';
            case 2:
                return (formData.interests.length > 0 || formData.otherInterest.trim() !== '') && formData.superpower.trim() !== '';
            case 3:
                for (let i = 0; i < formData.teamSize; i++) {
                    const member = formData.members[i];
                    if (!member.fullName.trim() || !member.grade || !member.email.trim().includes('@') || member.phoneNumber.trim().length < 10) {
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
    }, [currentStep, formData, hasFollowedInstagram]);

    const nextStep = () => currentStep < 5 && isStepValid() && setCurrentStep(currentStep + 1);
    const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);

    const handlePayment = async () => {
        if (!isStepValid()) {
            setValidationError("Please agree to the rules before proceeding.");
            return;
        }
        setValidationError('');
        setPostPaymentError('');
        setIsLoading(true);

        if (!isCashfreeReady) {
            setValidationError(cashfreeError || "Payment gateway is not ready. Please refresh.");
            setIsLoading(false);
            return;
        }

        try {
            const { total } = calculateTotal();
            const orderId = `INNOVATEX-${Date.now()}`;
            
            const orderData = {
                order_amount: total.toFixed(2),
                order_id: orderId,
                customer_details: {
                    customer_id: `CUST-${Date.now()}`,
                    customer_email: formData.members[0].email,
                    customer_phone: formData.members[0].phoneNumber,
                    customer_name: formData.members[0].fullName,
                }
            };

            const response = await fetch(`${BACKEND_URL}/api/create-cashfree-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to communicate with the server.');
            }

            const { payment_session_id } = await response.json();
            
            if (!payment_session_id) {
                throw new Error("Could not retrieve a payment session ID.");
            }

            const cashfree = new window.Cashfree();
            cashfree.checkout({
                paymentSessionId: payment_session_id,
                onSuccess: async (data: any) => {
                    if (data.order && data.order.status === 'PAID') {
                        const paymentId = data.order.payment_id;
                        try {
                            if (!supabase) throw new Error("Supabase client is not ready.");

                            const { error } = await supabase.from('registrations').insert([{
                                team_name: formData.teamName,
                                team_size: formData.teamSize,
                                grade: formData.members[0].grade,
                                interests: formData.interests,
                                other_interest: formData.otherInterest,
                                superpower: formData.superpower,
                                members: formData.members.slice(0, formData.teamSize),
                                payment_id: paymentId,
                                total_amount: total
                            }]);

                            if (error) throw error;
                            
                            setFinalPaymentInfo({ teamName: formData.teamName, paymentId });
                            setRegistrationComplete(true);
                        } catch (dbError: any) {
                            console.error('CRITICAL: Supabase save failed after payment:', dbError);
                            setPostPaymentError(`Your payment was successful (ID: ${paymentId}), but we couldn't save your registration. Please contact support.`);
                        } finally {
                            setIsLoading(false);
                        }
                    }
                },
                onFailure: (data: any) => {
                    console.error('Cashfree Payment Failed:', data);
                    setPostPaymentError(`Payment failed: ${data.order.error_text || 'Unknown error'}. Please try again.`);
                    setIsLoading(false);
                },
            });

        } catch (error: any) {
            console.error("Payment Initiation Error:", error);
            setValidationError(error.message);
            setIsLoading(false);
        }
    };
    
    // --- UI Rendering ---

    if (registrationComplete) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white via-green-50 to-gray-100 py-32 font-sans flex items-center justify-center">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center bg-white p-10 rounded-2xl shadow-xl max-w-lg mx-auto">
                    <PartyPopper className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-green-600 mb-2">Registration Complete!</h1>
                    <p className="text-gray-700 mb-4">Congratulations, <strong>{finalPaymentInfo.teamName}</strong>! Your team is officially registered.</p>
                    <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800">
                        <p>Your Payment ID is:</p>
                        <p className="font-mono font-semibold mt-1">{finalPaymentInfo.paymentId}</p>
                    </div>
                    <p className="text-gray-600 mt-6 text-sm">We've sent a confirmation to your team leader's email. Get ready to innovate!</p>
                </motion.div>
            </div>
        );
    }

    const renderStepContent = () => {
        // NOTE: The individual step components (Step1_TeamIdentity, Step2_TeamDetails, etc.)
        // would be defined here or imported from other files for better organization.
        // For brevity, the full JSX is assumed to be within this return block.
        switch (currentStep) {
            // Case 1 to 5 would return the JSX for each step...
            default: return <div>Loading...</div>
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-yellow-50 to-gray-100 py-32 font-sans">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header and Progress Bar JSX */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                     <div className="flex items-center justify-center mb-4">
                         <Sparkles className="h-8 w-8 text-yellow-500 mr-3" />
                         <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-600">InnovateX25 Registration</h1>
                     </div>
                     {/* ... rest of header ... */}
                </motion.div>

                <div className="mb-8">
                     {/* Progress bar JSX */}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div key={currentStep} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }} className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-yellow-200/50">
                        {/* {renderStepContent()} */}
                        {/* Placeholder for the actual step form fields */}
                        <p>This is where the form for step {currentStep} would appear.</p>
                        <p>Please paste the full JSX for the form steps here.</p>
                    </motion.div>
                </AnimatePresence>

                <div className="flex justify-between mt-8">
                    <button onClick={prevStep} disabled={currentStep === 1} className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"><ChevronLeft className="w-5 h-5 mr-2" />Previous</button>
                    {currentStep < 5 ? (
                        <button onClick={nextStep} disabled={!isStepValid()} className="flex items-center px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Next<ChevronRight className="w-5 h-5 ml-2" /></button>
                    ) : (
                        <button onClick={handlePayment} disabled={!formData.agreedToRules || isLoading || !isCashfreeReady} className="flex items-center justify-center px-8 py-3 bg-green-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors w-60">
                            {isLoading ? (<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>)
                                : !isCashfreeReady ? ('Initializing...')
                                    : (<>Proceed to Payment<CreditCard className="w-5 h-5 ml-2" /></>)}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;