import React, { useReducer, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from 'https://unpkg.com/@supabase/supabase-js@2/dist/supabase.mjs';
import {
  Users, Trophy, Megaphone, Lightbulb, ChevronRight,
  ChevronLeft, Check, Mail, Phone, User,
  Sparkles, PartyPopper, AlertTriangle, UploadCloud, CreditCard
} from 'lucide-react';

// --- Supabase Setup ---
const supabaseUrl = 'https://ytjnonkfkhcpkijhvlqi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0am5vbmtma2hjcGtpamh2bHFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MTAzMjgsImV4cCI6MjA3Mjk4NjMyOH0.4TrFHEY-r1YMrqfG8adBmjgnVKYCnUC34rvnwsZfehE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Replace with your actual UPI QR Code ---
const PAYMENT_QR_CODE_URL = "https://i.imgur.com/your-qr-code.png";

// --- Types ---
interface TeamMember {
  fullName: string;
  grade: string;
  email: string;
  phoneNumber: string;
}

interface FormData {
  teamName: string;
  teamSize: number;
  members: TeamMember[];
}

type FormAction =
  | { type: 'UPDATE_FIELD'; field: keyof Omit<FormData, 'members'>; payload: any }
  | { type: 'UPDATE_MEMBER'; index: number; field: keyof TeamMember; payload: string }
  | { type: 'SET_TEAM_SIZE'; payload: number };

// --- Reducer ---
const initialFormData: FormData = {
  teamName: '',
  teamSize: 2,
  members: Array(4).fill(null).map(() => ({
    fullName: '', grade: '', email: '', phoneNumber: ''
  }))
};

const formReducer = (state: FormData, action: FormAction): FormData => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.payload };
    case 'UPDATE_MEMBER': {
      const newMembers = [...state.members];
      newMembers[action.index] = { ...newMembers[action.index], [action.field]: action.payload };
      return { ...state, members: newMembers };
    }
    case 'SET_TEAM_SIZE':
      return { ...state, teamSize: action.payload };
    default:
      return state;
  }
};

// --- Input Field Component ---
const InputField = ({ icon, ...props }: { icon: React.ReactNode, [key: string]: any }) => (
  <div className="relative mb-3">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
      {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
    </div>
    <input {...props}
      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

// --- Register Component ---
const Register: React.FC = () => {
  const [formData, dispatch] = useReducer(formReducer, initialFormData);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  // Handle Screenshot Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  // Submit to Supabase
  const handleSubmit = async () => {
    setLoading(true);

    try {
      let screenshotUrl = null;
      if (screenshot) {
        const { data, error } = await supabase.storage
          .from('payment-screenshots')
          .upload(`payments/${Date.now()}-${screenshot.name}`, screenshot);

        if (error) throw error;

        const { data: publicUrl } = supabase.storage
          .from('payment-screenshots')
          .getPublicUrl(data.path);

        screenshotUrl = publicUrl.publicUrl;
      }

      const { error: insertError } = await supabase.from('registrations').insert([{
        ...formData,
        transactionId,
        screenshotUrl
      }]);

      if (insertError) throw insertError;

      setSuccess(true);
    } catch (err) {
      console.error("Submission Error:", err);
      alert("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <AnimatePresence mode="wait">
        {!success ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Team Details */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-indigo-500" /> Team Details
                </h2>
                <InputField
                  icon={<User />}
                  placeholder="Team Name"
                  value={formData.teamName}
                  onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'teamName', payload: e.target.value })}
                />
                <label className="block text-sm font-medium mb-2">Team Size</label>
                <select
                  value={formData.teamSize}
                  onChange={e => dispatch({ type: 'SET_TEAM_SIZE', payload: Number(e.target.value) })}
                  className="w-full border px-3 py-2 rounded-xl mb-4"
                >
                  {[1, 2, 3, 4].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <button
                  onClick={nextStep}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl"
                >
                  Next <ChevronRight className="inline w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2: Team Members */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-indigo-500" /> Team Members
                </h2>
                {formData.members.slice(0, formData.teamSize).map((member, idx) => (
                  <div key={idx} className="mb-4 p-3 border rounded-xl">
                    <h3 className="font-semibold mb-2">Member {idx + 1}</h3>
                    <InputField
                      icon={<User />}
                      placeholder="Full Name"
                      value={member.fullName}
                      onChange={e => dispatch({ type: 'UPDATE_MEMBER', index: idx, field: 'fullName', payload: e.target.value })}
                    />
                    <InputField
                      icon={<Mail />}
                      placeholder="Email"
                      value={member.email}
                      onChange={e => dispatch({ type: 'UPDATE_MEMBER', index: idx, field: 'email', payload: e.target.value })}
                    />
                    <InputField
                      icon={<Phone />}
                      placeholder="Phone Number"
                      value={member.phoneNumber}
                      onChange={e => dispatch({ type: 'UPDATE_MEMBER', index: idx, field: 'phoneNumber', payload: e.target.value })}
                    />
                    <InputField
                      icon={<Lightbulb />}
                      placeholder="Grade/Branch"
                      value={member.grade}
                      onChange={e => dispatch({ type: 'UPDATE_MEMBER', index: idx, field: 'grade', payload: e.target.value })}
                    />
                  </div>
                ))}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={prevStep}
                    className="px-4 py-2 border rounded-xl"
                  >
                    <ChevronLeft className="inline w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl"
                  >
                    Next <ChevronRight className="inline w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-indigo-500" /> Payment
                </h2>
                <p className="mb-2">Scan the QR code below and pay the registration fee.</p>
                <img src={PAYMENT_QR_CODE_URL} alt="Payment QR" className="w-48 h-48 mx-auto mb-4" />
                <InputField
                  icon={<Check />}
                  placeholder="Transaction ID"
                  value={transactionId}
                  onChange={e => setTransactionId(e.target.value)}
                />
                <div className="mt-3">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 border rounded-xl"
                  >
                    <UploadCloud className="w-5 h-5" /> Upload Screenshot
                  </button>
                  {screenshot && <p className="mt-2 text-sm text-green-600">{screenshot.name} selected</p>}
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={prevStep}
                    className="px-4 py-2 border rounded-xl"
                  >
                    <ChevronLeft className="inline w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-xl"
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <PartyPopper className="w-12 h-12 text-green-500 mx-auto" />
            <h2 className="text-xl font-bold mt-2">Registration Successful!</h2>
            <p className="text-gray-600">We’ve received your details and payment screenshot.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Register;
