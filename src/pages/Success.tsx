import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, PartyPopper } from 'lucide-react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';

const Success: React.FC = () => {
  const location = useLocation();
  // Provide default values in case state is not passed
  const { teamName, paymentId } = location.state || { teamName: 'Innovators', paymentId: 'N/A' };
  
  // A simple hook to get window dimensions for the confetti effect.
  const useWindowSize = () => {
    const [size, setSize] = useState([0, 0]);
    useEffect(() => {
      const handleResize = () => {
        setSize([window.innerWidth, window.innerHeight]);
      };
      window.addEventListener('resize', handleResize);
      handleResize(); // Set initial size
      return () => window.removeEventListener('resize', handleResize);
    }, []);
    return size;
  };
  
  const [width, height] = useWindowSize();

  return (
    <>
      {width > 0 && <Confetti width={width} height={height} recycle={false} numberOfPieces={300} />}
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-6 font-sans">
        <div className="max-w-2xl w-full bg-white/70 backdrop-blur-md p-10 rounded-2xl shadow-lg border border-green-200 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
          >
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Registration Successful!</h1>
            <p className="text-lg text-gray-600 mb-8">
              Congratulations, <strong>{teamName}</strong>! Your team is officially registered for InnovateX25.
            </p>
            <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-left space-y-2">
              <p className="text-gray-700"><strong>Team Name:</strong> {teamName}</p>
              <p className="text-gray-700"><strong>Payment ID:</strong> {paymentId}</p>
              <p className="text-gray-700 mt-4">A confirmation email with event details will be sent to your team leader shortly. Get ready to innovate!</p>
            </div>
            <Link 
              to="/"
              className="mt-10 inline-flex items-center px-8 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              <PartyPopper className="w-5 h-5 mr-2" />
              Back to Registration
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Success;

