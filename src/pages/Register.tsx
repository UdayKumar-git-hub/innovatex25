import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import {
  Users, Trophy, Megaphone, Lightbulb, MessageSquare, ChevronRight,
  ChevronLeft, Check, Star, Mail, Phone, User, Sparkles, PartyPopper, Instagram, Upload, AlertTriangle
} from 'lucide-react';

// --- Supabase Configuration ---
const SUPABASE_URL = 'https://ytjnonkfkhcpkijhvlqi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0am5vbmtma2hjcGtpamh2bHFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MTAzMjgsImV4cCI6MjA3Mjk4NjMyOH0.4TrFHEY-r1YMrqfG8adBmjgnVKYCnUC34rvnwsZfeE';

// We must wait for the script to load before creating the client.
let supabase = null;

// --- Main Component ---
const Register = () => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [validationError, setValidationError] = React.useState('');
  const [registrationComplete, setRegistrationComplete] = React.useState(false);
  const [hasFollowedInstagram, setHasFollowedInstagram] = React.useState(false);
  const [finalTeamName, setFinalTeamName] = React.useState('');

  // Manual Payment State
  const [paymentScreenshot, setPaymentScreenshot] = React.useState(null);
  const [transactionId, setTransactionId] = React.useState('');
  const [qrCodeSrc] = React.useState('https://placehold.co/200x200?text=Scan+to+Pay');
  const [upiDetails] = React.useState('your_upi_id@bank');

  const [formData, setFormData] = React.useState({
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

  // Load the Supabase SDK from CDN
  React.useEffect(() => {
    if (!window.supabase) {
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      script.async = true;
      script.onload = () => {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      };
      document.body.appendChild(script);
    } else {
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...formData.members];
    newMembers[index] = { ...newMembers[index], [field]: value };

    if (index === 0 && field === 'grade') {
      for (let i = 1; i < formData.teamSize; i++) {
        newMembers[i] = { ...newMembers[i], grade: value };
      }
    }
    setFormData(prev => ({ ...prev, members: newMembers }));
  };

  const handleInterestToggle = (interest) => {
    const newInterests = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest];
    handleInputChange('interests', newInterests);
  };
  
  const calculateTotal = () => {
    return formData.teamSize * 499;
  };

  const handleFinalSubmission = async () => {
    if (!paymentScreenshot || !transactionId.trim()) {
      setValidationError("Please upload a payment screenshot and enter the transaction ID.");
      return;
    }
    setValidationError('');
    setIsLoading(true);

    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized. Please try again.');
      }

      const registrationData = {
        team_name: formData.teamName,
        team_size: formData.teamSize,
        challenges: formData.challenges,
        grade: formData.members[0].grade,
        interests: formData.interests,
        other_interest: formData.otherInterest,
        superpower: formData.superpower,
        members: formData.members.slice(0, formData.teamSize),
        payment_id: transactionId,
        total_amount: calculateTotal(),
      };

      const { data, error } = await supabase
        .from('registrations')
        .insert([registrationData])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }
      
      setRegistrationComplete(true);
      setFinalTeamName(formData.teamName);

    } catch (error) {
      setValidationError("Failed to submit registration. Please try again or contact support.");
      console.error(error);
    } finally {
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
          return paymentScreenshot && transactionId.trim() !== '';
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (isStepValid()) {
      setCurrentStep(currentStep + 1);
      setValidationError('');
    } else {
      setValidationError("Please fill out all required fields.");
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
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
            Congratulations, <strong>{finalTeamName}</strong>! Your team is officially registered for InnovateX25.
          </p>
          <p className="text-gray-600 mt-6 text-sm">Your registration is pending verification of your payment. We will notify you via email once it's confirmed. Get ready to innovate!</p>
        </motion.div>
      </div>
    );
  }

  // --- JSX for the form ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-yellow-50 to-gray-100 py-32 font-sans">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header Section */}
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

        {/* Stepper Section */}
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
        {validationError && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center font-medium mb-6">
            <div className='flex items-center justify-center'>
              <AlertTriangle className='h-5 w-5 text-red-500 mr-2'/>
              {validationError}
            </div>
          </div>
        )}

        {/* Form Content Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-yellow-200/50"
          >
            {/* All form steps are rendered here */}
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
                  {/* Challenges list */}
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
                  {/* Interests checkboxes */}
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
                  {/* Superpower textarea */}
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
            {currentStep === 5 && (
              <motion.div
                key="manual-payment-step"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-yellow-200/50"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Upload className="w-6 h-6 mr-3 text-yellow-500" />
                  Manual Payment & Confirmation
                </h2>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-6 rounded-lg border border-yellow-300 text-center">
                    <h3 className="text-lg font-bold text-yellow-800 mb-2">Registration Fee: ₹{calculateTotal()} for a team of {formData.teamSize}</h3>
                    <p className="text-sm text-yellow-700">Please make a UPI payment to the details below.</p>
                  </div>
                  <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-700 font-semibold mb-2">Scan this QR Code to Pay:</p>
                    <img src={qrCodeSrc} alt="Payment QR Code" className="rounded-lg shadow-md mb-4" />
                    <p className="text-gray-800 font-mono text-sm">UPI ID: {upiDetails}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Transaction ID:
                      </label>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Enter transaction ID"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Upload Payment Screenshot:
                      </label>
                      <div className="flex items-center">
                        <label className="flex-1 cursor-pointer bg-yellow-100 text-yellow-800 p-3 rounded-lg border border-yellow-300 hover:bg-yellow-200 transition-colors flex items-center justify-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setPaymentScreenshot(e.target.files[0])}
                            className="sr-only"
                          />
                          <Upload className="w-5 h-5 mr-2" />
                          {paymentScreenshot ? paymentScreenshot.name : 'Choose file'}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
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
              onClick={handleFinalSubmission}
              disabled={isLoading || !isStepValid()}
              className="flex items-center justify-center px-8 py-3 bg-green-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors w-60"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  Complete Registration
                </>
              )}
            </button>
          )}
        </div>
        {/* Footer Section */}
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
