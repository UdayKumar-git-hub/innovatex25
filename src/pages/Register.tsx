import React, { useReducer, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Trophy, Megaphone, Lightbulb, MessageSquare, ChevronRight,
    ChevronLeft, Check, Star, Mail, Phone, User,
    Sparkles, PartyPopper, Instagram, CheckCircle
} from 'lucide-react';

// --- Configuration ---
const GRADE_LEVELS = ["7th", "8th", "9th"];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;

// --- Type Definitions & Interfaces ---
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

type FormAction =
    | { type: 'UPDATE_FIELD'; field: keyof Omit<FormData, 'members'>; payload: any }
    | { type: 'UPDATE_MEMBER'; index: number; field: keyof TeamMember; payload: string }
    | { type: 'SET_TEAM_SIZE'; payload: number };

// --- State Management (Reducer) ---
const initialFormData: FormData = {
    teamName: '',
    teamSize: 2,
    interests: [],
    otherInterest: '',
    superpower: '',
    members: Array(4).fill(null).map(() => ({
        fullName: '', grade: '', email: '', phoneNumber: ''
    })),
    agreedToRules: false
};

const formReducer = (state: FormData, action: FormAction): FormData => {
    switch (action.type) {
        case 'UPDATE_FIELD':
            return { ...state, [action.field]: action.payload };
        case 'UPDATE_MEMBER': {
            const newMembers = [...state.members];
            newMembers[action.index] = { ...newMembers[action.index], [action.field]: action.payload };
            // Auto-fill grade for other members based on the team leader's grade.
            if (action.index === 0 && action.field === 'grade') {
                for (let i = 1; i < state.teamSize; i++) {
                    newMembers[i] = { ...newMembers[i], grade: action.payload };
                }
            }
            return { ...state, members: newMembers };
        }
        case 'SET_TEAM_SIZE':
            return { ...state, teamSize: action.payload };
        default:
            return state;
    }
};

// --- Child Components for each Step ---

const StepIndicator = ({ currentStep }: { currentStep: number }) => (
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
        <div className="text-center text-sm text-gray-600 font-semibold">
            Step {currentStep} of 5
        </div>
    </div>
);

const Step1_TeamIdentity = ({ formData, dispatch }: { formData: FormData, dispatch: React.Dispatch<FormAction> }) => (
    <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Users className="w-6 h-6 mr-3 text-yellow-500" />
            Your Team Identity
        </h2>
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Awesome Team Name:</label>
                <input
                    type="text"
                    value={formData.teamName}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'teamName', payload: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter your team name"
                />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Your Team Size:</label>
                <div className="grid grid-cols-3 gap-4">
                    {[2, 3, 4].map((size) => (
                        <label key={size} className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-yellow-50 transition-colors ${formData.teamSize === size ? 'border-yellow-500 bg-yellow-50 ring-2 ring-yellow-400' : 'border-gray-300'}`}>
                            <input
                                type="radio"
                                name="teamSize"
                                value={size}
                                checked={formData.teamSize === size}
                                onChange={(e) => dispatch({ type: 'SET_TEAM_SIZE', payload: parseInt(e.target.value) })}
                                className="sr-only"
                            />
                            <span className="font-medium">Team of {size}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const Step2_TeamDetails = ({ formData, dispatch }: { formData: FormData, dispatch: React.Dispatch<FormAction> }) => {
    const challenges = [
        { id: 'ipl', name: 'IPL Auction', description: 'Building a dream cricket team with a budget', icon: Trophy },
        { id: 'brand', name: 'Brand Battles', description: 'Creating and pitching a cool new brand', icon: Megaphone },
        { id: 'innovators', name: 'Young Innovators', description: 'Coming up with a game-changing new idea', icon: Lightbulb },
        { id: 'echoes', name: 'ECHOES', description: 'Sharing your story and speaking your mind', icon: MessageSquare }
    ];
    const interests = [
        'Gaming & Esports', 'Technology & Coding', 'Art, Design & Video',
        'Sports & Strategy', 'Public Speaking & Debating', 'Business & Marketing'
    ];

    const handleInterestToggle = (interest: string) => {
        const newInterests = formData.interests.includes(interest)
            ? formData.interests.filter(i => i !== interest)
            : [...formData.interests, interest];
        dispatch({ type: 'UPDATE_FIELD', field: 'interests', payload: newInterests });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Star className="w-6 h-6 mr-3 text-yellow-500" />
                Tell Us About Your Team!
            </h2>
            <div className="space-y-8">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">All teams will compete in all challenges. Get ready!</label>
                    <div className="grid md:grid-cols-2 gap-4">
                        {challenges.map(c => <div key={c.id} className="flex items-start p-4 bg-gray-50/50 border border-gray-200 rounded-lg"><c.icon className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" /><div><div className="font-medium text-gray-800">{c.name}</div><div className="text-sm text-gray-600">{c.description}</div></div></div>)}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">What are your team's interests? (Check all that apply)</label>
                    <div className="grid md:grid-cols-2 gap-3">
                        {interests.map(i => <label key={i} className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-yellow-50 ${formData.interests.includes(i) ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300'}`}><input type="checkbox" checked={formData.interests.includes(i)} onChange={() => handleInterestToggle(i)} className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500" /><span className="ml-3 text-gray-700">{i}</span></label>)}
                        <div className="flex items-center p-3 border rounded-lg focus-within:ring-2 focus-within:ring-yellow-500"><input type="checkbox" checked={formData.otherInterest !== ''} readOnly className="w-4 h-4 text-yellow-600" /><input type="text" value={formData.otherInterest} onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'otherInterest', payload: e.target.value })} placeholder="Other..." className="ml-3 flex-1 bg-transparent outline-none" /></div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">What's your team's secret superpower?</label>
                    <textarea value={formData.superpower} onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'superpower', payload: e.target.value })} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500" rows={3} placeholder="e.g., Super creative, amazing planners..." />
                </div>
            </div>
        </div>
    );
};

const Step3_TeamRoster = ({ formData, dispatch }: { formData: FormData, dispatch: React.Dispatch<FormAction> }) => {
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const numericValue = e.target.value.replace(/\D/g, '');
        if (numericValue.length <= 10) {
            dispatch({ type: 'UPDATE_MEMBER', index, field: 'phoneNumber', payload: numericValue });
        }
    };
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <User className="w-6 h-6 mr-3 text-yellow-500" /> Your Team Roster
            </h2>
            <p className="text-sm text-gray-600 mb-6 -mt-4">The team's grade will be set by the Team Leader.</p>
            <div className="space-y-8">
                {Array.from({ length: formData.teamSize }).map((_, index) => (
                    <div key={index} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Member {index + 1} {index === 0 && '(Team Leader)'}</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <input type="text" value={formData.members[index].fullName} onChange={e => dispatch({ type: 'UPDATE_MEMBER', index, field: 'fullName', payload: e.target.value })} placeholder="Full Name" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500" />
                            <select value={formData.members[index].grade} onChange={e => dispatch({ type: 'UPDATE_MEMBER', index, field: 'grade', payload: e.target.value })} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-200/70" disabled={index > 0}>
                                <option value="">Select Grade</option>
                                {GRADE_LEVELS.map(grade => <option key={grade} value={grade}>{grade}</option>)}
                            </select>
                            <input type="email" value={formData.members[index].email} onChange={e => dispatch({ type: 'UPDATE_MEMBER', index, field: 'email', payload: e.target.value })} placeholder="Email Address" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500" />
                            <input type="tel" value={formData.members[index].phoneNumber} onChange={(e) => handlePhoneChange(e, index)} placeholder="10-Digit Phone Number" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};

const Step4_Socials = ({ hasFollowed, setHasFollowed }: { hasFollowed: boolean, setHasFollowed: React.Dispatch<React.SetStateAction<boolean>> }) => (
    <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Instagram className="w-6 h-6 mr-3 text-yellow-500" /> Stay Updated!
        </h2>
        <div className="text-center space-y-6">
            <p className="text-gray-700">Follow <a href="https://www.instagram.com/reelhaus.hyd/" target="_blank" rel="noopener noreferrer" className="font-semibold text-yellow-600 hover:underline">@reelhaus.hyd</a> on Instagram for all event updates!</p>
            <div>
                <p className="text-sm text-gray-600 mb-2">Scan the QR code to follow us:</p>
                <div className="flex justify-center">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.instagram.com/reelhaus.hyd/" alt="QR code for reelhaus.hyd Instagram" className="rounded-lg shadow-md" />
                </div>
            </div>
            <div className="flex items-start justify-center p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-md mx-auto">
                <input type="checkbox" id="follow" checked={hasFollowed} onChange={e => setHasFollowed(e.target.checked)} className="mt-1 mr-3 h-4 w-4 text-blue-600 rounded focus:ring-blue-500" />
                <label htmlFor="follow" className="text-gray-700 text-left">Yes, our team is now following @reelhaus.hyd for important updates!</label>
            </div>
        </div>
    </div>
);

const Step5_Review = ({ formData, dispatch, validationError }: { formData: FormData, dispatch: React.Dispatch<FormAction>, validationError: string }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><CheckCircle className="w-6 h-6 mr-3 text-yellow-500" /> Review & Submit</h2>
            <div className="space-y-6">
                 <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">You're all set!</h3>
                    <p className="text-gray-600">Please review your information on the previous pages. Once you're ready, agree to the rules and submit your registration.</p>
                </div>
                <div className="flex items-start p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <input type="checkbox" id="agreeRules" checked={formData.agreedToRules} onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'agreedToRules', payload: e.target.checked })} className="mt-1 mr-3 h-4 w-4 text-blue-600 rounded focus:ring-blue-500" />
                    <label htmlFor="agreeRules" className="text-gray-700">By checking this box, our team agrees to the rules and is ready to bring our A-game!</label>
                </div>
                {validationError && <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center font-medium">{validationError}</div>}
            </div>
        </div>
    )
};

const RegistrationSuccess = ({ teamName }: { teamName: string }) => (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50 to-gray-100 py-32 font-sans flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center bg-white p-10 rounded-2xl shadow-xl max-w-lg mx-auto">
            <PartyPopper className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-green-600 mb-2">Registration Submitted!</h1>
            <p className="text-gray-700 mb-4">Congratulations, <strong>{teamName}</strong>! Your team's registration has been received for InnovateX25.</p>
            <p className="text-gray-600 mt-6 text-sm">We've sent a confirmation to your team leader's email. Get ready to innovate!</p>
        </motion.div>
    </div>
);

// --- Main Component ---
const App = () => {
    const [formData, dispatch] = useReducer(formReducer, initialFormData);
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [registrationComplete, setRegistrationComplete] = useState(false);
    const [finalTeamName, setFinalTeamName] = useState('');
    const [hasFollowedInstagram, setHasFollowedInstagram] = useState(false);

    const validateStep = useCallback((step: number): { isValid: boolean; message: string } => {
        switch (step) {
            case 1:
                if (formData.teamName.trim().length < 3) {
                    return { isValid: false, message: "Please enter a team name (at least 3 characters)." };
                }
                return { isValid: true, message: "" };
            case 2:
                if (formData.interests.length === 0 && formData.otherInterest.trim() === '') {
                    return { isValid: false, message: "Please select at least one interest." };
                }
                if (formData.superpower.trim().length < 10) {
                    return { isValid: false, message: "Please describe your superpower (at least 10 characters)." };
                }
                return { isValid: true, message: "" };
            case 3:
            case 5: // Case 5 runs all validations up to this point
                for (let i = 0; i < formData.teamSize; i++) {
                    const member = formData.members[i];
                    if (member.fullName.trim().length < 3) return { isValid: false, message: `Please enter a full name for Member ${i + 1}.` };
                    if (!member.grade) return { isValid: false, message: `Please select a grade for Member ${i + 1}.` };
                    if (!emailRegex.test(member.email)) return { isValid: false, message: `Please enter a valid email for Member ${i + 1}.` };
                    if (!phoneRegex.test(member.phoneNumber)) return { isValid: false, message: `Please enter a valid 10-digit phone number for Member ${i + 1}.` };
                }
                if (step === 5 && !hasFollowedInstagram) {
                     return { isValid: false, message: "Please confirm you've followed on Instagram (Step 4)." };
                }
                if (step === 5 && !formData.agreedToRules) {
                    return { isValid: false, message: "You must agree to the rules to proceed." };
                }
                return { isValid: true, message: "" };

            case 4:
                if (!hasFollowedInstagram) {
                    return { isValid: false, message: "Please follow us on Instagram to stay updated!" };
                }
                return { isValid: true, message: "" };

            default:
                return { isValid: false, message: "An unknown error occurred." };
        }
    }, [formData, hasFollowedInstagram]);
    
    const handleSubmit = async () => {
        const finalValidation = validateStep(5);
        if (!finalValidation.isValid) {
            setValidationError(finalValidation.message);
             if (finalValidation.message.includes("Member")) {
                setCurrentStep(3);
            } else if (finalValidation.message.includes("Instagram")){
                 setCurrentStep(4);
            }
            return;
        }

        setValidationError('');
        setIsLoading(true);

        // Simulate a form submission
        setTimeout(() => {
            setIsLoading(false);
            setFinalTeamName(formData.teamName);
            setRegistrationComplete(true);
            console.log("Form Submitted:", {
                ...formData,
                members: formData.members.slice(0, formData.teamSize)
            });
        }, 1500);
    };

    const nextStep = () => {
        const validation = validateStep(currentStep);
        if (validation.isValid) {
            setValidationError('');
            if (currentStep < 5) {
                setCurrentStep(currentStep + 1);
            }
        } else {
            setValidationError(validation.message);
        }
    };

    const prevStep = () => {
        setValidationError(''); // Clear errors when going back
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1: return <Step1_TeamIdentity formData={formData} dispatch={dispatch} />;
            case 2: return <Step2_TeamDetails formData={formData} dispatch={dispatch} />;
            case 3: return <Step3_TeamRoster formData={formData} dispatch={dispatch} />;
            case 4: return <Step4_Socials hasFollowed={hasFollowedInstagram} setHasFollowed={setHasFollowedInstagram} />;
            case 5: return <Step5_Review formData={formData} dispatch={dispatch} validationError={validationError}/>;
            default: return null;
        }
    }

    if (registrationComplete) {
        return <RegistrationSuccess teamName={finalTeamName} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-yellow-50 to-gray-100 py-20 font-sans">
            <div className="max-w-4xl mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-600 flex items-center justify-center"><Sparkles className="h-8 w-8 mr-3" />InnovateX25 Registration</h1>
                    <p className="text-gray-600 mt-4 mb-2">Presented by reelhaus.hyd</p>
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
                        {renderCurrentStep()}
                    </motion.div>
                </AnimatePresence>

                {validationError && currentStep !== 5 && <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-800 rounded-lg text-center font-semibold">{validationError}</div>}

                <div className="flex justify-between mt-8">
                    <button onClick={prevStep} disabled={currentStep === 1} className="flex items-center px-6 py-3 bg-gray-200 rounded-lg font-semibold disabled:opacity-50 hover:bg-gray-300"><ChevronLeft className="w-5 h-5 mr-2" />Previous</button>
                    {currentStep < 5 ? (
                        <button onClick={nextStep} className="flex items-center px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600">Next<ChevronRight className="w-5 h-5 ml-2" /></button>
                    ) : (
                        <button onClick={handleSubmit} disabled={isLoading} className="flex items-center justify-center px-8 py-3 bg-green-500 text-white rounded-lg font-semibold w-60 hover:bg-green-600 disabled:opacity-50 transition-colors">
                            {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Submit Registration'}
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

export default App;

