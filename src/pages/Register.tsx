import React, { useReducer, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from 'https://unpkg.com/@supabase/supabase-js@2/dist/supabase.mjs';
import {
    Users, Trophy, Megaphone, Lightbulb, ChevronRight,
    ChevronLeft, Check, Mail, Phone, User, CreditCard,
    Sparkles, PartyPopper, AlertTriangle, UploadCloud, QrCode
} from 'lucide-react';

// --- Configuration ---
// IMPORTANT: Replace with your actual Supabase Project URL and Anon Key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// The QR code image to be displayed for manual payment. 
// Replace this URL with the direct link to your QR code image.
const PAYMENT_QR_CODE_URL = "https://i.imgur.com/your-qr-code.png"; // Example QR Code URL

// The external payment link for teams of 2.
const TEAM_OF_2_PAYMENT_LINK = "https://payments.cashfree.com/forms?code=InnovateX25";


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
                    placeholder="e.g., The Code Crusaders"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Team Size:</label>
                <div className="flex space-x-4">
                    {[2, 3, 4].map(size => (
                        <button
                            key={size}
                            onClick={() => dispatch({ type: 'SET_TEAM_SIZE', payload: size })}
                            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${formData.teamSize === size ? 'bg-yellow-500 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            {size} Members
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const Step2_Interests = ({ formData, dispatch }: { formData: FormData, dispatch: React.Dispatch<FormAction> }) => {
    const interestsOptions = ['AI/ML', 'Web3', 'Hardware', 'Open Source', 'FinTech', 'Sustainability'];

    const toggleInterest = (interest: string) => {
        const newInterests = formData.interests.includes(interest)
            ? formData.interests.filter(i => i !== interest)
            : [...formData.interests, interest];
        dispatch({ type: 'UPDATE_FIELD', field: 'interests', payload: newInterests });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Trophy className="w-6 h-6 mr-3 text-yellow-500" />
                Domains of Interest
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {interestsOptions.map(interest => (
                    <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`p-4 border rounded-lg text-center font-semibold transition-all duration-200 ${formData.interests.includes(interest) ? 'bg-yellow-500 text-white border-yellow-500 shadow-md' : 'bg-white text-gray-700 border-gray-300 hover:border-yellow-400'}`}
                    >
                        {interest}
                    </button>
                ))}
            </div>
            <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Something Else?</label>
                <input
                    type="text"
                    value={formData.otherInterest}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'otherInterest', payload: e.target.value })}
                    placeholder="e.g., Game Development"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
            </div>
        </div>
    );
};

const Step3_Superpower = ({ formData, dispatch }: { formData: FormData, dispatch: React.Dispatch<FormAction> }) => (
    <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Megaphone className="w-6 h-6 mr-3 text-yellow-500" />
            Your Team's Superpower
        </h2>
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">What makes your team special? (Be creative!)</label>
            <textarea
                value={formData.superpower}
                onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'superpower', payload: e.target.value })}
                placeholder="e.g., We can turn coffee into code at superhuman speeds and have a knack for finding the funniest bugs."
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
        </div>
    </div>
);

const Step4_MemberDetails = ({ formData, dispatch }: { formData: FormData, dispatch: React.Dispatch<FormAction> }) => (
    <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Lightbulb className="w-6 h-6 mr-3 text-yellow-500" />
            Team Member Details
        </h2>
        <div className="space-y-6">
            {Array.from({ length: formData.teamSize }).map((_, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="font-bold text-lg mb-4 text-gray-700">
                        {index === 0 ? 'Team Leader' : `Member ${index + 1}`}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField icon={<User />} type="text" placeholder="Full Name" value={formData.members[index].fullName} onChange={(e) => dispatch({ type: 'UPDATE_MEMBER', index, field: 'fullName', payload: e.target.value })} />
                        <InputField icon={<User />} type="text" placeholder="Grade/Year" value={formData.members[index].grade} onChange={(e) => dispatch({ type: 'UPDATE_MEMBER', index, field: 'grade', payload: e.target.value })} />
                        <InputField icon={<Mail />} type="email" placeholder="Email Address" value={formData.members[index].email} onChange={(e) => dispatch({ type: 'UPDATE_MEMBER', index, field: 'email', payload: e.target.value })} />
                        <InputField icon={<Phone />} type="tel" placeholder="Phone Number" value={formData.members[index].phoneNumber} onChange={(e) => dispatch({ type: 'UPDATE_MEMBER', index, field: 'phoneNumber', payload: e.target.value })} />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const InputField = ({ icon, ...props }: { icon: React.ReactNode, [key: string]: any }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
        </div>
        <input {...props} className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500" />
    </div>
);

const Step5_Payment = ({ formData, setSubmissionStatus, setIsLoading, setFinalError }: {
    formData: FormData,
    setSubmissionStatus: (status: 'success' | 'error' | 'idle') => void,
    setIsLoading: (loading: boolean) => void,
    setFinalError: (error: string) => void
}) => {
    const [transactionId, setTransactionId] = useState('');
    const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
    const [fileError, setFileError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setFileError('File is too large. Maximum size is 5MB.');
                setPaymentScreenshot(null);
            } else if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
                setFileError('Invalid file type. Please upload a JPG, PNG, or GIF.');
                setPaymentScreenshot(null);
            } else {
                setFileError('');
                setPaymentScreenshot(file);
            }
        }
    };

    const handleSupabaseSubmit = async () => {
        if (!paymentScreenshot || !transactionId.trim()) {
            setFinalError('Please upload a screenshot and enter the transaction ID.');
            return;
        }

        setIsLoading(true);
        setFinalError('');

        try {
            // 1. Upload screenshot to Supabase Storage
            const fileExt = paymentScreenshot.name.split('.').pop();
            const fileName = `${formData.teamName.replace(/\s+/g, '_')}-${Date.now()}.${fileExt}`;
            const filePath = `payment_screenshots/${fileName}`;

            let { error: uploadError } = await supabase.storage
                .from('registrations') // IMPORTANT: Create a bucket named 'registrations' in your Supabase project
                .upload(filePath, paymentScreenshot);

            if (uploadError) {
                throw uploadError;
            }

            // 2. Get the public URL of the uploaded file
            const { data: urlData } = supabase.storage
                .from('registrations')
                .getPublicUrl(filePath);

            const screenshotUrl = urlData.publicUrl;

            // 3. Prepare data for the database
            const registrationData = {
                team_name: formData.teamName,
                team_size: formData.teamSize,
                interests: formData.interests,
                other_interest: formData.otherInterest,
                superpower: formData.superpower,
                members: formData.members.slice(0, formData.teamSize),
                transaction_id: transactionId,
                screenshot_url: screenshotUrl,
                created_at: new Date().toISOString(),
            };
            
            // 4. Insert data into Supabase table
            const { error: insertError } = await supabase
                .from('teams') // IMPORTANT: Create a table named 'teams' in your Supabase project
                .insert([registrationData]);

            if (insertError) {
                throw insertError;
            }

            setSubmissionStatus('success');
        } catch (error: any) {
            console.error('Supabase submission error:', error);
            setFinalError(`Submission failed: ${error.message}. Please try again.`);
            setSubmissionStatus('error');
        } finally {
            setIsLoading(false);
        }
    };


    const fee = formData.teamSize * 100;

    if (formData.teamSize === 2) {
        return (
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><CreditCard className="w-6 h-6 mr-3 text-yellow-500" />Final Step: Payment</h2>
                <div className="p-6 border rounded-lg bg-yellow-50 text-yellow-800 border-yellow-200">
                    <p className="font-semibold">You will be redirected to our secure payment partner, Cashfree, to complete your registration.</p>
                    <p className="mt-2">Team Size: {formData.teamSize}</p>
                    <p>Total Fee: ₹{fee}</p>
                </div>
                <a href={TEAM_OF_2_PAYMENT_LINK} target="_blank" rel="noopener noreferrer"
                    className="mt-6 w-full bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-yellow-600 transition-all duration-300 flex items-center justify-center text-lg">
                    Proceed to Payment <ChevronRight className="w-5 h-5 ml-2" />
                </a>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><CreditCard className="w-6 h-6 mr-3 text-yellow-500" />Final Step: Payment Confirmation</h2>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-lg text-gray-800 mb-4">Payment Summary</h3>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Team Name:</span>
                    <span className="font-semibold text-gray-800">{formData.teamName}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Team Size:</span>
                    <span className="font-semibold text-gray-800">{formData.teamSize} Members</span>
                </div>
                <div className="border-t border-gray-300 my-4"></div>
                <div className="flex justify-between items-center text-xl">
                    <span className="text-gray-700 font-bold">Total Amount:</span>
                    <span className="font-extrabold text-yellow-600">₹{fee}</span>
                </div>
            </div>

            <div className="mt-6 text-center">
                <p className="text-gray-700 mb-4 font-semibold">Scan the QR code below to pay using any UPI app.</p>
                <div className="flex justify-center p-4 bg-white rounded-lg shadow-md border border-gray-200 w-60 h-60 mx-auto">
                    <img src={PAYMENT_QR_CODE_URL} alt="Payment QR Code" className="w-full h-full object-contain" />
                </div>
                <p className="text-xs text-gray-500 mt-2">After payment, proceed to the next step.</p>
            </div>
            
            <div className="mt-8 space-y-6">
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Transaction ID:</label>
                    <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="Enter the UPI Transaction ID"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Payment Screenshot:</label>
                    <div 
                        className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-yellow-500 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                         <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/png, image/jpeg, image/gif"
                         />
                         <div className="text-gray-500">
                            <UploadCloud className="w-12 h-12 mx-auto text-gray-400" />
                            {paymentScreenshot ? (
                                <p className="mt-2 text-green-600 font-semibold">{paymentScreenshot.name}</p>
                            ) : (
                                <p className="mt-2">Click to upload or drag and drop</p>
                            )}
                            <p className="text-xs mt-1">PNG, JPG, GIF up to 5MB</p>
                         </div>
                    </div>
                    {fileError && <p className="text-red-500 text-sm mt-2">{fileError}</p>}
                </div>
            </div>

            <button
                onClick={handleSupabaseSubmit}
                disabled={!paymentScreenshot || !transactionId}
                className="mt-8 w-full bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-yellow-600 transition-all duration-300 flex items-center justify-center text-lg disabled:bg-gray-400 disabled:cursor-not-allowed">
                Submit Registration
            </button>
        </div>
    );
};

// --- Main Registration Component ---
export default function Register() {
    const [formData, dispatch] = useReducer(formReducer, initialFormData);
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [isLoading, setIsLoading] = useState(false);
    const [finalError, setFinalError] = useState('');

    const validateStep = () => {
        const newErrors: { [key: string]: string } = {};
        if (currentStep === 1) {
            if (!formData.teamName.trim()) newErrors.teamName = 'Team name is required.';
        } else if (currentStep === 4) {
            for (let i = 0; i < formData.teamSize; i++) {
                if (!formData.members[i].fullName.trim()) newErrors[`member${i}_fullName`] = `Member ${i + 1}'s name is required.`;
                if (!/^\S+@\S+\.\S+$/.test(formData.members[i].email)) newErrors[`member${i}_email`] = `Member ${i + 1}'s email is invalid.`;
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep()) {
            if (currentStep < 5) setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const steps = [
        <Step1_TeamIdentity formData={formData} dispatch={dispatch} />,
        <Step2_Interests formData={formData} dispatch={dispatch} />,
        <Step3_Superpower formData={formData} dispatch={dispatch} />,
        <Step4_MemberDetails formData={formData} dispatch={dispatch} />,
        <Step5_Payment formData={formData} setSubmissionStatus={setSubmissionStatus} setIsLoading={setIsLoading} setFinalError={setFinalError} />,
    ];

    return (
        <div className="bg-gray-50 min-h-screen font-sans flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-6 sm:p-10 my-8">
                <AnimatePresence mode="wait">
                    {submissionStatus === 'success' ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="text-center py-10"
                        >
                            <PartyPopper className="w-20 h-20 mx-auto text-green-500 bg-green-100 rounded-full p-3" />
                            <h2 className="text-3xl font-bold text-gray-800 mt-6">Registration Successful!</h2>
                            <p className="text-gray-600 mt-3 max-w-md mx-auto">
                                Welcome aboard, {formData.teamName}! We've received your details. Get ready for an amazing event. We'll be in touch soon with more information.
                            </p>
                            <button onClick={() => window.location.reload()} className="mt-8 bg-yellow-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-yellow-600 transition-all duration-300">
                                Register Another Team
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="text-center mb-8">
                                <h1 className="text-4xl font-extrabold text-gray-800 flex items-center justify-center">
                                    <Sparkles className="w-8 h-8 mr-3 text-yellow-500" />
                                    InnovateX '25 Registration
                                </h1>
                                <p className="text-gray-600 mt-2">Join the ultimate innovation challenge!</p>
                            </div>

                            <StepIndicator currentStep={currentStep} />
                            
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ x: 30, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -30, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="my-8"
                                >
                                    {steps[currentStep - 1]}
                                </motion.div>
                            </AnimatePresence>

                            {Object.keys(errors).length > 0 && (
                                <div className="text-red-500 text-sm mb-4">
                                    {Object.values(errors).map((error, i) => <p key={i}>{error}</p>)}
                                </div>
                            )}

                            {isLoading && (
                                <div className="flex items-center justify-center space-x-2 my-4">
                                    <div className="w-4 h-4 rounded-full bg-yellow-500 animate-pulse"></div>
                                    <div className="w-4 h-4 rounded-full bg-yellow-500 animate-pulse [animation-delay:0.2s]"></div>
                                    <div className="w-4 h-4 rounded-full bg-yellow-500 animate-pulse [animation-delay:0.4s]"></div>
                                    <p className="text-gray-600">Submitting your registration...</p>
                                </div>
                            )}

                            {finalError && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative my-4" role="alert">
                                    <strong className="font-bold">Oops! </strong>
                                    <span className="block sm:inline">{finalError}</span>
                                </div>
                            )}

                            <div className="flex justify-between mt-8">
                                <button
                                    onClick={prevStep}
                                    disabled={currentStep === 1 || isLoading}
                                    className="bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-400 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
                                    <ChevronLeft className="w-5 h-5 mr-2" />
                                    Back
                                </button>
                                {currentStep < 5 ? (
                                    <button
                                        onClick={nextStep}
                                        disabled={isLoading}
                                        className="bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-yellow-600 transition-all duration-300 flex items-center disabled:opacity-50">
                                        Next
                                        <ChevronRight className="w-5 h-5 ml-2" />
                                    </button>
                                ) : null}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

