import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// No longer importing from a local file to resolve the issue.
// import { supabase } from './supabaseClient'; 
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
  Sparkles
} from 'lucide-react';

// --- Dummy useNavigate hook ---
const useNavigate = () => {
    return (path, options) => {
        console.log(`Navigating to ${path} with state:`, options?.state);
        // In a real app, this would change the URL. Here, we'll just log it.
        alert(`Registration successful! You would be redirected to ${path}.`);
    };
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

// For TypeScript to recognize the Razorpay and Supabase objects on the window
interface CustomWindow extends Window {
    Razorpay: any;
    supabase: any; // Add supabase to the window interface
}

declare const window: CustomWindow;


const Register: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [supabase, setSupabase] = useState<any>(null); // State to hold the client
  const [formData, setFormData] = useState<FormData>({
    teamName: '',
    teamSize: 2,
    challenges: ['ipl', 'brand', 'innovators', 'echoes'], // All challenges are mandatory now
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

  const navigate = useNavigate();

  useEffect(() => {
    // Load Razorpay Script
    const razorpayScript = document.createElement('script');
    razorpayScript.src = 'https://checkout.razorpay.com/v1/checkout.js';
    razorpayScript.async = true;
    document.body.appendChild(razorpayScript);

    // Load Supabase Script
    const supabaseScript = document.createElement('script');
    supabaseScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    supabaseScript.async = true;

    supabaseScript.onload = () => {
      // Supabase is now available on the window object
      const supabaseUrl = 'https://ytjnonkfkhcpkijhvlqi.supabase.co'; // IMPORTANT: Replace
      const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0am5vbmtma2hjcGtpamh2bHFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MTAzMjgsImV4cCI6MjA3Mjk4NjMyOH0.4TrFHEY-r1YMrqfG8adBmjgnVKYCnUC34rvnwsZfehE'; // IMPORTANT: Replace
      
      // Check if credentials are provided and the script is loaded
      if (supabaseUrl && supabaseUrl !== 'https://ytjnonkfkhcpkijhvlqi.supabase.co' && supabaseAnonKey && supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0am5vbmtma2hjcGtpamh2bHFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MTAzMjgsImV4cCI6MjA3Mjk4NjMyOH0.4TrFHEY-r1YMrqfG8adBmjgnVKYCnUC34rvnwsZfehE' && window.supabase) {
        const { createClient } = window.supabase;
        setSupabase(createClient(supabaseUrl, supabaseAnonKey));
        console.log("Supabase client initialized successfully.");
      } else {
        console.warn("Supabase credentials are not provided or the script failed to load. Database operations will be disabled.");
      }
    };
    document.body.appendChild(supabaseScript);

    return () => {
        // Cleanup scripts on component unmount
        if (document.body.contains(razorpayScript)) {
            document.body.removeChild(razorpayScript);
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

    // If the team leader's grade is changed, update all other members' grades.
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

    return {
        subtotal,
        teamDiscount,
        priceAfterDiscount,
        platformFee,
        total
    };
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
            return formData.agreedToRules;
        default:
            return false;
    }
  };

  const nextStep = () => {
    if (currentStep < 4 && isStepValid()) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handlePayment = async () => {
    if (!isStepValid()) {
        setValidationError("Please ensure you've agreed to the rules before proceeding.");
        return;
    }
    setValidationError('');
    setIsLoading(true);

    const paymentDetails = calculateTotal();
    const amountInPaise = Math.round(paymentDetails.total * 100);

    // Enhanced notes object for detailed record-keeping on Razorpay dashboard
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
        key: "rzp_test_RFPjS89YJb6J7f", // Your actual Razorpay Key ID
        amount: amountInPaise,
        currency: "INR",
        name: "InnovateX25 Registration",
        description: `Fee for Team '${formData.teamName}' with ${formData.teamSize} members.`,
        image: "https://i.ibb.co/L5T1x6m/reelhaus-logo.png", // Your direct image link
        
        handler: async function (response: any) {
            console.log('Payment Successful:', response);
            
            try {
                const registrationData = {
                    team_name: formData.teamName,
                    team_size: formData.teamSize,
                    grade: formData.members[0].grade,
                    interests: formData.interests,
                    other_interest: formData.otherInterest,
                    superpower: formData.superpower,
                    members: formData.members.slice(0, formData.teamSize),
                    payment_id: response.razorpay_payment_id,
                    total_amount: paymentDetails.total
                };
                
                if (!supabase) {
                    console.error("Supabase client is not initialized. Check your credentials in Register.jsx.");
                    throw new Error("Database connection is not configured.");
                }

                const { data, error } = await supabase
                    .from('registrations')
                    .insert([registrationData])
                    .select();

                if (error) {
                    throw error;
                }

                console.log('Successfully saved to Supabase:', data);
                navigate('/success', { 
                    state: { 
                        teamName: formData.teamName,
                        paymentId: response.razorpay_payment_id 
                    } 
                });

            } catch (error) {
                console.error('CRITICAL: Error saving to Supabase after payment:', error);
                alert(
                    `Your payment was successful (ID: ${response.razorpay_payment_id}), but we couldn't save your registration. Please contact support with your Payment ID.`
                );
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
        theme: {
            color: "#FBBF24",
            backdrop_color: "rgba(0, 0, 0, 0.6)"
        },
        modal: {
            ondismiss: function () {
                console.log('Payment modal dismissed.');
                setIsLoading(false);
            }
        }
    };

    if (!window.Razorpay) {
        setValidationError("Payment gateway failed to load. Please check your internet connection and try again.");
        setIsLoading(false);
        return;
    }

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-yellow-50 to-gray-100 py-32 font-sans">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
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
              InnovateX25 is your chance to team up with friends, tackle fun challenges, and show everyone what you've got!
            </p>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 max-w-lg mx-auto">
            {[1, 2, 3, 4].map((step, index) => (
              <React.Fragment key={step}>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    step <= currentStep ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step < currentStep ? <Check className="w-5 h-5" /> : step}
                  </div>
                </div>
                {index < 3 && (
                  <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                    step < currentStep ? 'bg-yellow-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="text-center text-sm text-gray-600 font-semibold">
            Step {currentStep} of 4
          </div>
        </div>

        {/* Form Steps */}
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
                      All teams will compete in all challenges. Get ready for an epic showdown!
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

            {currentStep === 4 && (() => {
              const paymentDetails = calculateTotal();
              return (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <CreditCard className="w-6 h-6 mr-3 text-yellow-500" />
                    Registration Fee & Payment
                  </h2>

                  <div className="space-y-6">
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

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </button>

          {currentStep < 4 ? (
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
              disabled={!formData.agreedToRules || isLoading}
              className="flex items-center justify-center px-8 py-3 bg-green-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors w-60"
            >
              {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                  <>
                      Proceed to Payment
                      <CreditCard className="w-5 h-5 ml-2" />
                  </>
              )}
            </button>
          )}
        </div>

        {/* Contact Info */}
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

