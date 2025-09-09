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
  Home
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

// --- Validation ---
const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

interface MemberErrors {
    email?: string;
}

// For TypeScript to recognize the Razorpay and Supabase objects on the window
interface CustomWindow extends Window {
    Razorpay: any;
    supabase: any;
}

declare const window: CustomWindow;

// --- Success Page Component ---
interface SuccessProps {
    teamName: string;
    paymentId: string;
    ticketId: string;
    onBackToHome: () => void;
}

const SuccessPage: React.FC<SuccessProps> = ({ teamName, paymentId, ticketId, onBackToHome }) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-green-50 to-gray-100 py-32 font-sans flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center bg-white p-10 rounded-2xl shadow-xl max-w-lg mx-auto w-full"
            >
                <PartyPopper className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-green-600 mb-2">Registration Complete!</h1>
                <p className="text-gray-700 mb-6">
                    Congratulations, <strong>{teamName}</strong>! Your team is officially registered.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-left border">
                    <div>
                        <p className="text-gray-600 font-semibold">Your Ticket ID:</p>
                        <p className="font-mono font-bold text-lg mt-1 text-indigo-600 tracking-wider bg-indigo-50 p-2 rounded-md">{ticketId}</p>
                    </div>
                    <hr className="my-3" />
                    <div>
                        <p className="text-gray-600 font-semibold">Your Payment ID:</p>
                        <p className="font-mono text-gray-800 mt-1 break-all">{paymentId}</p>
                    </div>
                </div>
                <p className="text-gray-600 mt-6 text-sm">We've sent a confirmation with your ticket to the team leader's email. Get ready to innovate!</p>
                <button
                    onClick={onBackToHome}
                    className="mt-8 inline-flex items-center px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                    <Home className="w-4 h-4 mr-2" />
                    Register Another Team
                </button>
            </motion.div>
        </div>
    );
};


// --- Registration Form Component ---
interface RegisterProps {
    onRegistrationSuccess: (details: { teamName: string; paymentId: string; ticketId: string }) => void;
}

const Register: React.FC<RegisterProps> = ({ onRegistrationSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<MemberErrors[]>([]);
  const [supabase, setSupabase] = useState<any>(null);
  const [postPaymentError, setPostPaymentError] = useState('');
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
    // Scripts are loaded here, as before.
    const razorpayScript = document.createElement('script');
    razorpayScript.src = 'https://checkout.razorpay.com/v1/checkout.js';
    razorpayScript.async = true;
    document.body.appendChild(razorpayScript);

    const supabaseScript = document.createElement('script');
    supabaseScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    supabaseScript.async = true;

    supabaseScript.onload = () => {
      const supabaseUrl = 'https://ytjnonkfkhcpkijhvlqi.supabase.co'; 
      const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0am5vbmtma2hjcGtpamh2bHFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MTAzMjgsImV4cCI6MjA3Mjk4NjMyOH0.4TrFHEY-r1YMrqfG8adBmjgnVKYCnUC34rvnwsZfehE';
      
      if (supabaseUrl && supabaseAnonKey && window.supabase) {
        const { createClient } = window.supabase;
        setSupabase(createClient(supabaseUrl, supabaseAnonKey));
        console.log("Supabase client initialized successfully.");
      } else {
        console.warn("Supabase credentials are not provided or the script failed to load.");
      }
    };
    document.body.appendChild(supabaseScript);

    return () => {
        if (document.body.contains(razorpayScript)) document.body.removeChild(razorpayScript);
        if (document.body.contains(supabaseScript)) document.body.removeChild(supabaseScript);
    }
  }, []);
  
  useEffect(() => {
    setFormErrors(Array(formData.teamSize).fill({}));
  }, [formData.teamSize]);

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

    if (field === 'email') {
        const newErrors = [...formErrors];
        if (value.trim() && !isValidEmail(value)) {
            newErrors[index] = { ...newErrors[index], email: 'Please enter a valid email address.' };
        } else {
            newErrors[index] = { ...newErrors[index], email: undefined };
        }
        setFormErrors(newErrors);
    }
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

  const validateCurrentStep = () => {
    switch (currentStep) {
        case 1:
            return formData.teamName.trim() !== '';
        case 2:
            return (formData.interests.length > 0 || formData.otherInterest.trim() !== '') && formData.superpower.trim() !== '';
        case 3: {
            let isValid = true;
            const newErrors: MemberErrors[] = Array(formData.teamSize).fill({});
            for (let i = 0; i < formData.teamSize; i++) {
                const member = formData.members[i];
                if (!member.fullName.trim() || !member.grade || !member.phoneNumber.trim()) {
                    isValid = false;
                }
                if (!member.email.trim() || !isValidEmail(member.email)) {
                    isValid = false;
                    if (!isValidEmail(member.email)) {
                       newErrors[i] = { ...newErrors[i], email: 'Please enter a valid email address.' };
                    }
                }
            }
            setFormErrors(newErrors);
            return isValid && formErrors.every(err => !err.email);
        }
        case 4:
            return formData.agreedToRules;
        default:
            return false;
    }
  };
  
  const generateTicketId = (): string => {
    const prefix = "INX25-HYD-";
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return prefix + result;
  };

  const nextStep = () => {
    if (currentStep < 4 && validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handlePayment = async () => {
    if (!validateCurrentStep()) {
        setPostPaymentError("Please ensure all fields are correct and you've agreed to the rules.");
        return;
    }
    setPostPaymentError('');
    setIsLoading(true);

    const paymentDetails = calculateTotal();
    const amountInPaise = Math.round(paymentDetails.total * 100);

    const notesData = {
      team_name: formData.teamName,
      team_size: formData.teamSize,
      team_grade: formData.members[0].grade,
      ...formData.members.slice(0, formData.teamSize).reduce((acc, member, index) => {
        acc[`member_${index + 1}_name`] = member.fullName;
        acc[`member_${index + 1}_email`] = member.email;
        acc[`member_${index + 1}_phone`] = member.phoneNumber;
        return acc;
      }, {} as Record<string, any>)
    };

    const options = {
        key: "rzp_test_RFPjS89YJb6J7f",
        amount: amountInPaise,
        currency: "INR",
        name: "InnovateX25 Registration",
        description: `Fee for Team '${formData.teamName}'`,
        image: "https://i.ibb.co/L5T1x6m/reelhaus-logo.png",
        
        handler: async function (response: any) {
            try {
                const ticketId = generateTicketId();
                const registrationData = {
                    team_name: formData.teamName,
                    team_size: formData.teamSize,
                    grade: formData.members[0].grade,
                    interests: formData.interests,
                    other_interest: formData.otherInterest,
                    superpower: formData.superpower,
                    members: formData.members.slice(0, formData.teamSize),
                    payment_id: response.razorpay_payment_id,
                    total_amount: paymentDetails.total,
                    ticket_id: ticketId
                };
                
                if (!supabase) throw new Error("Supabase is not connected.");

                const { error } = await supabase.from('registrations').insert([registrationData]);
                if (error) throw error;

                console.log('Successfully saved to Supabase.');
                
                try {
                  const { error: functionError } = await supabase.functions.invoke('send-confirmation-email', { body: registrationData });
                  if (functionError) throw functionError;
                  console.log('Confirmation email function invoked.');
                } catch (emailError) {
                  console.error('Could not send confirmation email:', emailError);
                }

                onRegistrationSuccess({
                    teamName: formData.teamName,
                    paymentId: response.razorpay_payment_id,
                    ticketId: ticketId
                });

            } catch (error: any) {
                console.error('CRITICAL: Error saving to Supabase:', error);
                setPostPaymentError(`Payment successful (ID: ${response.razorpay_payment_id}), but failed to save registration. Please contact support.`);
            } finally {
                setIsLoading(false);
            }
        },
        prefill: {
            name: formData.members[0].fullName,
            email: formData.members[0].email,
            contact: formData.members[0].phoneNumber,
        },
        notes: notesData,
        theme: { color: "#FBBF24", backdrop_color: "rgba(0, 0, 0, 0.6)" },
        modal: { ondismiss: () => setIsLoading(false) }
    };

    if (!window.Razorpay) {
        setPostPaymentError("Payment gateway failed to load. Please try again.");
        setIsLoading(false);
        return;
    }

    new window.Razorpay(options).open();
  };

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
            <p className="text-gray-700 leading-relaxed">
              Hey Innovators! Get ready for an epic experience where your ideas can shine.
            </p>
          </div>
        </motion.div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 max-w-lg mx-auto">
            {[1, 2, 3, 4].map((step, index) => (
              <React.Fragment key={step}>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${ step <= currentStep ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {step < currentStep ? <Check className="w-5 h-5" /> : step}
                  </div>
                </div>
                {index < 3 && (<div className={`flex-1 h-1 mx-2 transition-all duration-300 ${ step < currentStep ? 'bg-yellow-500' : 'bg-gray-200'}`} />)}
              </React.Fragment>
            ))}
          </div>
          <div className="text-center text-sm text-gray-600 font-semibold">Step {currentStep} of 4</div>
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
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><Users className="w-6 h-6 mr-3 text-yellow-500" />Your Team Identity</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Awesome Team Name:</label>
                    <input type="text" value={formData.teamName} onChange={(e) => handleInputChange('teamName', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" placeholder="Enter your team name" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Your Team Size:</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[2, 3, 4].map((size) => (
                        <label key={size} className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-yellow-50 transition-colors ${formData.teamSize === size ? 'border-yellow-500 bg-yellow-50 ring-2 ring-yellow-400' : 'border-gray-300'}`}>
                          <input type="radio" name="teamSize" value={size} checked={formData.teamSize === size} onChange={(e) => handleInputChange('teamSize', parseInt(e.target.value))} className="sr-only" />
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
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><Star className="w-6 h-6 mr-3 text-yellow-500" />Tell Us About Your Team!</h2>
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">All teams will compete in all challenges. Get ready!</label>
                    <div className="grid md:grid-cols-2 gap-4">
                      {challenges.map(({id, name, description, icon: Icon}) => (
                          <div key={id} className="flex items-start p-4 bg-gray-50/50 border border-gray-200 rounded-lg">
                            <Icon className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-gray-800">{name}</div>
                              <div className="text-sm text-gray-600">{description}</div>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">What are your team's interests? (Check all that apply)</label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {interests.map((interest) => (
                        <label key={interest} className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-yellow-50 transition-colors ${formData.interests.includes(interest) ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300'}`}>
                           <input type="checkbox" checked={formData.interests.includes(interest)} onChange={() => handleInterestToggle(interest)} className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500" />
                          <span className="ml-3 text-gray-700">{interest}</span>
                        </label>
                      ))}
                      <div className="flex items-center p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-yellow-500">
                        <input type="checkbox" checked={formData.otherInterest !== ''} readOnly className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500" />
                        <input type="text" value={formData.otherInterest} onChange={(e) => handleInputChange('otherInterest', e.target.value)} placeholder="Other..." className="ml-3 flex-1 bg-transparent border-none outline-none placeholder-gray-500" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">What's your team's secret superpower?</label>
                    <textarea value={formData.superpower} onChange={(e) => handleInputChange('superpower', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" rows={3} placeholder="e.g., Super creative, amazing planners..." />
                  </div>
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><User className="w-6 h-6 mr-3 text-yellow-500" />Your Team Roster</h2>
                <p className="text-sm text-gray-600 mb-6 -mt-4">The team's grade will be set by the Team Leader.</p>
                <div className="space-y-8">
                  {Array.from({ length: formData.teamSize }, (_, index) => (
                    <div key={index} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Member {index + 1} {index === 0 && '(Team Leader)'}</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name:</label>
                          <input type="text" value={formData.members[index].fullName} onChange={(e) => handleMemberChange(index, 'fullName', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" placeholder="Enter full name" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Grade:</label>
                          <select value={formData.members[index].grade} onChange={(e) => handleMemberChange(index, 'grade', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-200/70 disabled:cursor-not-allowed" disabled={index > 0}>
                            <option value="">Select Grade</option>
                            <option value="7th">7th</option><option value="8th">8th</option><option value="9th">9th</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address:</label>
                          <input type="email" value={formData.members[index].email} onChange={(e) => handleMemberChange(index, 'email', e.target.value)} className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent ${formErrors[index]?.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-yellow-500'}`} placeholder="Enter email address" />
                          {formErrors[index]?.email && <p className="text-red-600 text-xs mt-1">{formErrors[index].email}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number:</label>
                          <input type="tel" value={formData.members[index].phoneNumber} onChange={(e) => handleMemberChange(index, 'phoneNumber', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" placeholder="Enter phone number" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {currentStep === 4 && (() => {
              const paymentDetails = calculateTotal();
              return (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><CreditCard className="w-6 h-6 mr-3 text-yellow-500" />Registration Fee & Payment</h2>
                  <div className="space-y-6">
                    {postPaymentError && (<div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700"><div className='flex'><AlertTriangle className='h-5 w-5 text-red-500 mr-3'/><p>{postPaymentError}</p></div></div>)}
                    <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-6 rounded-lg border border-yellow-300">
                      <div className="flex items-center mb-4"><Sparkles className="w-6 h-6 text-yellow-600 mr-2" /><h3 className="text-lg font-bold text-yellow-800">Early Bird Offer!</h3></div>
                      <p className="text-yellow-700 mb-2">Register before <strong>October 15th, 2025</strong> for a <strong>₹50 team discount!</strong></p>
                      <p className="text-yellow-800 font-semibold">Early Bird Price: ₹449 per person</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Summary</h3>
                      <div className="space-y-3 text-gray-700">
                        <div className="flex justify-between"><span>Team of {formData.teamSize} × ₹449</span><span>₹{paymentDetails.subtotal.toLocaleString()}</span></div>
                        <div className="flex justify-between text-green-600"><span>Early Bird Discount</span><span>- ₹{paymentDetails.teamDiscount.toLocaleString()}</span></div>
                        <hr className="my-2"/>
                        <div className="flex justify-between font-semibold"><span>Subtotal</span><span>₹{paymentDetails.priceAfterDiscount.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Platform Fee (5%)</span><span>+ ₹{paymentDetails.platformFee.toFixed(2)}</span></div>
                        <hr className="my-2 border-t-2 border-gray-300"/>
                        <div className="flex justify-between text-2xl font-bold text-gray-800 mt-2"><span>Total Amount Due</span><span>₹{paymentDetails.total.toFixed(2)}</span></div>
                      </div>
                    </div>
                    <div className="flex items-start p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <input type="checkbox" id="agreeRules" checked={formData.agreedToRules} onChange={(e) => handleInputChange('agreedToRules', e.target.checked)} className="mt-1 mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      <label htmlFor="agreeRules" className="text-gray-700">By checking this box, our team agrees to the rules and is ready to bring our A-game!</label>
                    </div>
                  </div>
                </div>
              )
            })()}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <button onClick={prevStep} disabled={currentStep === 1} className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"><ChevronLeft className="w-5 h-5 mr-2" />Previous</button>
          {currentStep < 4 ? (
            <button onClick={nextStep} disabled={!validateCurrentStep()} className="flex items-center px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Next<ChevronRight className="w-5 h-5 ml-2" /></button>
          ) : (
            <button onClick={handlePayment} disabled={!formData.agreedToRules || isLoading} className="flex items-center justify-center px-8 py-3 bg-green-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors w-60">
              {isLoading ? (<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>) : (<>Proceed to Payment<CreditCard className="w-5 h-5 ml-2" /></>)}
            </button>
          )}
        </div>

        <div className="mt-12 text-center bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-yellow-200/50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Questions? Contact the event crew:</h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center"><Mail className="w-5 h-5 text-yellow-500 mr-2" /><span className="text-gray-700">reelhaus.hyd@gmail.com</span></div>
            <div className="flex items-center"><Phone className="w-5 h-5 text-yellow-500 mr-2" /><span className="text-gray-700">+919392449721, +919110387918</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}; 

// --- Main App Component ---
// This component manages which "page" is visible: the registration form or the success screen.
const App: React.FC = () => {
    const [page, setPage] = useState<'register' | 'success'>('register');
    const [successData, setSuccessData] = useState<{ teamName: string; paymentId: string; ticketId: string } | null>(null);

    const handleRegistrationSuccess = (details: { teamName: string; paymentId: string; ticketId: string }) => {
        setSuccessData(details);
        setPage('success');
    };

    const handleBackToHome = () => {
        setPage('register');
        setSuccessData(null);
    };

    if (page === 'success' && successData) {
        return <SuccessPage {...successData} onBackToHome={handleBackToHome} />;
    }

    return <Register onRegistrationSuccess={handleRegistrationSuccess} />;
};

export default App;

