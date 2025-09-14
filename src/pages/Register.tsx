import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Trophy, Megaphone, Lightbulb, MessageSquare, ChevronRight,
    ChevronLeft, Check, Star, Mail, Phone, User, CreditCard,
    Sparkles, PartyPopper, AlertTriangle, Instagram, Loader2
} from 'lucide-react';

// --- This lets TypeScript know window.Cashfree will exist ---
declare global {
    interface Window { Cashfree?: any; }
}

// --- Configuration ---
// The URL of your simple backend server.
const BACKEND_URL = 'http://localhost:3001';

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

const Register: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [registrationComplete, setRegistrationComplete] = useState(false);
    const [finalPaymentInfo, setFinalPaymentInfo] = useState({ teamName: '', paymentId: '' });
    const [postPaymentError, setPostPaymentError] = useState('');
    const [hasFollowedInstagram, setHasFollowedInstagram] = useState(false);
    const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
    const [formData, setFormData] = useState<FormData>({
        teamName: '',
        teamSize: 2,
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
        // --- This runs once to check the server and load the Cashfree script ---
        const initializeServices = async () => {
            // 1. Check if backend is running
            try {
                const response = await fetch(`${BACKEND_URL}/health`);
                if (response.ok) {
                    setBackendStatus('online');
                } else {
                    setBackendStatus('offline');
                }
            } catch (error) {
                setBackendStatus('offline');
            }

            // 2. Load Cashfree SDK Script
            const script = document.createElement('script');
            script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
            script.async = true;
            document.body.appendChild(script);
        };

        initializeServices();
    }, []);

    // ... (keep your challenges, interests, handleInputChange, handleMemberChange, handleInterestToggle functions)
    const challenges = [
        { id: 'ipl', name: 'IPL Auction', description: 'Building a dream cricket team with a budget', icon: Trophy },
        { id: 'brand', name: 'Brand Battles', description: 'Creating and pitching a cool new brand', icon: Megaphone },
        { id: 'innovators', name: 'Young Innovators', description: 'Coming up with a game-changing new idea', icon: Lightbulb },
        { id: 'echoes', name: 'ECHOES', description: 'Sharing your story and speaking your mind', icon: MessageSquare }
    ];
    const interests = ['Gaming & Esports', 'Technology & Coding', 'Art, Design & Video', 'Sports & Strategy', 'Public Speaking & Debating', 'Business & Marketing'];
    const handleInputChange = (field: keyof FormData, value: any) => { setFormData(prev => ({ ...prev, [field]: value })); };
    const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
        const newMembers = [...formData.members];
        newMembers[index] = { ...newMembers[index], [field]: value };
        if (index === 0 && field === 'grade') {
            for (let i = 1; i < formData.teamSize; i++) { newMembers[i] = { ...newMembers[i], grade: value }; }
        }
        setFormData(prev => ({ ...prev, members: newMembers }));
    };
    const handleInterestToggle = (interest: string) => {
        const newInterests = formData.interests.includes(interest) ? formData.interests.filter(i => i !== interest) : [...formData.interests, interest];
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

    // --- THIS IS THE PAYMENT LOGIC ---
    const handlePayment = async () => {
        if (!isStepValid()) { return; }
        if (backendStatus !== 'online') {
            setPostPaymentError("Cannot connect to payment server. Please try again later.");
            return;
        }

        setValidationError('');
        setPostPaymentError('');
        setIsLoading(true);

        if (!window.Cashfree) {
            setPostPaymentError("Payment gateway has not loaded. Please refresh the page.");
            setIsLoading(false);
            return;
        }

        try {
            const paymentDetails = calculateTotal();
            const orderData = {
                order_amount: parseFloat(paymentDetails.total.toFixed(2)),
                order_id: `INNOVATEX-${formData.teamName.replace(/\s+/g, '')}-${Date.now()}`,
                customer_details: {
                    customer_id: `CUST-${formData.members[0].email}`,
                    customer_email: formData.members[0].email,
                    customer_phone: formData.members[0].phoneNumber,
                    customer_name: formData.members[0].fullName,
                }
            };

            // 1. Call your backend to get the payment_session_id
            const response = await fetch(`${BACKEND_URL}/api/create-cashfree-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Failed to create payment order.");
            }

            const session = await response.json();
            const payment_session_id = session.payment_session_id;

            if (!payment_session_id) {
                throw new Error("Did not receive payment session ID from server.");
            }

            // 2. Launch Cashfree Checkout
            const cashfree = new window.Cashfree();
            cashfree.checkout({
                paymentSessionId: payment_session_id,
                onSuccess: (data) => {
                    if (data.order && data.order.status === 'PAID') {
                        setFinalPaymentInfo({
                            teamName: formData.teamName,
                            paymentId: data.order.payment_id
                        });
                        setRegistrationComplete(true);
                    }
                },
                onFailure: (data) => {
                    console.error('Cashfree Payment Failed:', data);
                    setPostPaymentError(data.order.error_text || "Payment failed. Please try again.");
                    setIsLoading(false);
                },
            });

        } catch (error: any) {
            console.error("Error during payment initiation:", error);
            setPostPaymentError(error.message);
            setIsLoading(false);
        }
    };

    // ... (keep your isStepValid, nextStep, prevStep functions and all the JSX)
    const isStepValid = () => {
        switch (currentStep) {
            case 1: return formData.teamName.trim() !== '';
            case 2: return (formData.interests.length > 0 || formData.otherInterest.trim() !== '') && formData.superpower.trim() !== '';
            case 3:
                for (let i = 0; i < formData.teamSize; i++) {
                    const member = formData.members[i];
                    if (!member.fullName.trim() || !member.grade || !member.email.trim() || !member.phoneNumber.trim()) return false;
                }
                return true;
            case 4: return hasFollowedInstagram;
            case 5: return formData.agreedToRules;
            default: return false;
        }
    };
    const nextStep = () => { if (currentStep < 5 && isStepValid()) setCurrentStep(currentStep + 1); };
    const prevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };
    if (registrationComplete) {
        return (
            <div className="min-h-screen bg-green-50 py-32 font-sans flex items-center justify-center">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center bg-white p-10 rounded-2xl shadow-xl max-w-lg mx-auto">
                    <PartyPopper className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-green-600 mb-2">Registration Complete!</h1>
                    <p className="text-gray-700 mb-4">Congratulations, <strong>{finalPaymentInfo.teamName}</strong>! Your team is officially registered.</p>
                    <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800">
                        <p>Your Payment ID is:</p>
                        <p className="font-mono font-semibold mt-1">{finalPaymentInfo.paymentId}</p>
                    </div>
                </motion.div>
            </div>
        )
    }
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-yellow-50 to-gray-100 py-32 font-sans">
            <div className="max-w-4xl mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-600">InnovateX25 Registration</h1>
                    <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-lg mt-8 max-w-2xl mx-auto">
                        {backendStatus === 'checking' && <div className="p-3 bg-blue-100 text-blue-800 rounded-lg text-sm">🔄 Checking backend services...</div>}
                        {backendStatus === 'offline' && <div className="p-3 bg-red-100 text-red-800 rounded-lg text-sm">⚠️ Payment server is offline. Please contact support.</div>}
                        {backendStatus === 'online' && <div className="p-3 bg-green-100 text-green-800 rounded-lg text-sm">✅ All systems ready!</div>}
                    </div>
                </motion.div>
                {/* ... The rest of your multi-step form JSX ... */}
                <AnimatePresence mode="wait">
                    <motion.div key={currentStep} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }} className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-yellow-200/50">
                        {currentStep === 5 && (() => {
                            const paymentDetails = calculateTotal();
                            return (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                        <CreditCard className="w-6 h-6 mr-3 text-yellow-500" /> Registration Fee & Payment
                                    </h2>
                                    <div className="space-y-6">
                                        {postPaymentError && (
                                            <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                                                <p className="font-bold">Payment Error:</p>
                                                <p>{postPaymentError}</p>
                                            </div>
                                        )}
                                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Summary</h3>
                                            <div className="space-y-3 text-gray-700">
                                                <div className="flex justify-between"><span>Team of {formData.teamSize} × ₹449</span><span>₹{paymentDetails.subtotal.toLocaleString()}</span></div>
                                                <div className="flex justify-between text-green-600"><span>Early Bird Discount</span><span>- ₹{paymentDetails.teamDiscount.toLocaleString()}</span></div>
                                                <hr />
                                                <div className="flex justify-between font-semibold"><span>Subtotal</span><span>₹{paymentDetails.priceAfterDiscount.toLocaleString()}</span></div>
                                                <div className="flex justify-between"><span>Platform Fee (5%)</span><span>+ ₹{paymentDetails.platformFee.toFixed(2)}</span></div>
                                                <hr className="border-t-2"/>
                                                <div className="flex justify-between text-2xl font-bold text-gray-800 mt-2"><span>Total Amount Due</span><span>₹{paymentDetails.total.toFixed(2)}</span></div>
                                            </div>
                                        </div>
                                        <div className="flex items-start p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <input type="checkbox" id="agreeRules" checked={formData.agreedToRules} onChange={(e) => handleInputChange('agreedToRules', e.target.checked)} className="mt-1 mr-3 h-4 w-4 text-blue-600 rounded"/>
                                            <label htmlFor="agreeRules" className="text-gray-700">By checking this box, our team agrees to the rules and is ready to bring our A-game!</label>
                                        </div>
                                    </div>
                                </div>
                            )
                        })()}
                        {/* Your other steps (1-4) would go here */}
                    </motion.div>
                </AnimatePresence>
                <div className="flex justify-between mt-8">
                    <button onClick={prevStep} disabled={currentStep === 1} className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold disabled:opacity-50 hover:bg-gray-300">
                        <ChevronLeft className="w-5 h-5 mr-2" /> Previous
                    </button>
                    {currentStep < 5 ? (
                        <button onClick={nextStep} disabled={!isStepValid()} className="flex items-center px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 disabled:opacity-50">
                            Next <ChevronRight className="w-5 h-5 ml-2" />
                        </button>
                    ) : (
                        <button onClick={handlePayment} disabled={!formData.agreedToRules || isLoading || backendStatus !== 'online'} className="flex items-center justify-center px-8 py-3 bg-green-500 text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-green-600 w-60">
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CreditCard className="w-5 h-5 mr-2" /> Proceed to Payment</>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;

