import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, PartyPopper, Copy, Share2 } from 'lucide-react';

// A standalone, enhanced success page component.
// It simulates receiving data and includes a self-contained confetti effect.

const SuccessPage: React.FC = () => {
    // --- State Management ---
    // In a real app, this data would come from props or a router.
    // We simulate it here to make the component self-contained.
    const [teamInfo, setTeamInfo] = React.useState({
        teamName: 'The Innovators',
        paymentId: 'pay_ABC123XYZ456',
    });
    const [isCopied, setIsCopied] = React.useState(false);

    // --- Handlers ---
    const handleCopyToClipboard = () => {
        // A temporary textarea is created to execute the copy command.
        const textArea = document.createElement('textarea');
        textArea.value = teamInfo.paymentId;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy'); // execCommand is used for broader compatibility in iFrames
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
        document.body.removeChild(textArea);
    };

    // --- Components ---
    const ConfettiEffect: React.FC = () => {
        // A lightweight, CSS-based confetti effect.
        const confetti = Array.from({ length: 100 }).map((_, i) => {
            const style = {
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                backgroundColor: ['#fde68a', '#4ade80', '#60a5fa', '#f472b6'][Math.floor(Math.random() * 4)],
            };
            return <div key={i} className="confetti" style={style}></div>;
        });

        return <div className="confetti-container">{confetti}</div>;
    };
    
    const shareText = `We're excited to announce that our team, "${teamInfo.teamName}", has officially registered for InnovateX25! Get ready for some epic innovation. #InnovateX25 #ReelhausHYD`;

    return (
        <>
            <ConfettiEffect />
            {/* CSS for the confetti is included in the style tag below */}
            <style>{`
                .confetti-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    overflow: hidden;
                    z-index: 9999;
                }
                .confetti {
                    position: absolute;
                    width: 8px;
                    height: 16px;
                    top: -20px;
                    opacity: 0.8;
                    animation: fall 4s linear forwards;
                }
                @keyframes fall {
                    to {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `}</style>

            <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4 font-sans">
                <div className="max-w-2xl w-full bg-white/80 backdrop-blur-lg p-8 sm:p-10 rounded-2xl shadow-xl border border-green-200 text-center">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
                    >
                        <CheckCircle className="h-16 w-16 sm:h-20 sm:w-20 text-green-500 mx-auto mb-5" />
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3">Registration Successful!</h1>
                        <p className="text-base sm:text-lg text-gray-600 mb-6">
                            Congratulations, <strong>{teamInfo.teamName}</strong>! Your team is officially in.
                        </p>
                        
                        {/* --- Event Details Box --- */}
                        <div className="bg-green-50 p-5 rounded-lg border border-green-200 text-left space-y-3 text-gray-800">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">Team Name:</p>
                                    <p>{teamInfo.teamName}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Event Dates:</p>
                                    <p>Oct 26-27, 2025</p>
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold">Payment ID:</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="font-mono text-sm bg-green-100 p-1 rounded">{teamInfo.paymentId}</span>
                                    <button
                                        onClick={handleCopyToClipboard}
                                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-100 rounded-md transition-all"
                                        title="Copy to Clipboard"
                                    >
                                        {isCopied ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm pt-2">
                                A confirmation email with all the details will be sent to your team leader shortly. Get ready to innovate!
                            </p>
                        </div>
                        
                        {/* --- Share & Action Buttons --- */}
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a 
                              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                            >
                                <Share2 className="w-5 h-5 mr-2" />
                                Share on X
                            </a>
                            <a 
                                href="#" // In a real app, this would be a <Link to="/">
                                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                            >
                                <PartyPopper className="w-5 h-5 mr-2" />
                                Back to Home
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default SuccessPage;

