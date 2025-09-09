import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Gavel, 
  Users, 
  Target, 
  IndianRupee, 
  ClipboardList, 
  CheckCircle, 
  Star, 
  Trophy, 
  Shield,
  Briefcase,
  Megaphone,
  Scale,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

// A simple Footer component defined within the same file
const Footer = () => (
  <footer className="bg-gray-100 py-8">
    <div className="max-w-7xl mx-auto px-6 text-center text-gray-500">
      <p>&copy; {new Date().getFullYear()} Reel Haus Club. All rights reserved.</p>
      <p className="text-sm mt-2">Where strategy meets the spirit of cricket.</p>
    </div>
  </footer>
);

// Helper component for Objective Cards
const ObjectiveCard = ({ icon: Icon, title, children }) => (
  <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-blue-200/50 text-center h-full">
    <div className="flex justify-center mb-4">
      <div className="bg-blue-100 p-3 rounded-full">
        <Icon className="h-8 w-8 text-blue-600" />
      </div>
    </div>
    <h3 className="text-xl font-bold text-blue-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{children}</p>
  </motion.div>
);

const IplAuction = () => {
  const [activeTab, setActiveTab] = useState('roles');
  
  const TABS = {
    roles: {
      label: 'Roles & Responsibilities',
      icon: Users,
      content: (
        <div className="space-y-4 text-left">
          <div>
            <h4 className="font-bold text-blue-800 mb-2">For Organizers (Reel Haus Club)</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Prepare the player pool list with base prices.</li>
              <li>Set up the auction environment (screen, placards).</li>
              <li>Ensure transparency in bidding and budget tracking.</li>
              <li>Act as Auctioneer and Judges.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-blue-800 mb-2">For Participants</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Work as a team and define roles internally.</li>
              <li>Maintain discipline during the bidding process.</li>
              <li>Follow rules and respect time limits for decision-making.</li>
            </ul>
          </div>
        </div>
      )
    },
    materials: {
      label: 'Materials & Setup',
      icon: Briefcase,
      content: (
        <ul className="space-y-3 text-left">
            <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span><strong>Stage Setup:</strong> Auctioneer’s table, microphone, and gavel.</span></li>
            <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span><strong>Visual Aids:</strong> Projector/Screen for player info and bidding status.</span></li>
            <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span><strong>Team Tables:</strong> Each team gets a table with their franchise placard.</span></li>
            <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span><strong>Wallet Tracking:</strong> Live digital spreadsheet managed by organizers.</span></li>
        </ul>
      )
    },
    rules: {
      label: 'Auction Rules',
      icon: Gavel,
      content: (
         <ul className="space-y-3 text-left">
            <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>Each team must raise their placard to confirm a bid.</span></li>
            <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>The Auctioneer has the authority to reject unfair bids or re-auction unsold players.</span></li>
            <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>A player, once sold, cannot be transferred.</span></li>
            <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>The decision of the Judges is final and binding.</span></li>
          </ul>
      )
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-gray-100 font-sans">
      <motion.main 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible" 
        className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center mb-20">
          <div className="flex items-center justify-center mb-6">
            <Gavel className="h-12 w-12 sm:h-16 sm:w-16 text-blue-500 mr-4" />
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-800">
              IPL Auction
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Step into the shoes of a franchise owner in this thrilling simulation of the official Indian Premier League Player Auction.
          </p>
        </motion.div>

        {/* Objectives Section */}
        <motion.div variants={itemVariants} className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 gradient-title-blue">Core Objectives</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <ObjectiveCard icon={Target} title="Enhance Strategic Thinking">Make quick, well-thought-out decisions on player bids, spending, and strategy.</ObjectiveCard>
                <ObjectiveCard icon={IndianRupee} title="Improve Financial Literacy">Manage a ₹90 Crores budget, understanding allocation, cost, and prioritization.</ObjectiveCard>
                <ObjectiveCard icon={Megaphone} title="Develop Communication Skills">Practice teamwork, debate, and persuasion while bidding against other teams.</ObjectiveCard>
                <ObjectiveCard icon={Trophy} title="Encourage Sports Enthusiasm">Build on the popularity of cricket for an enjoyable and educational experience.</ObjectiveCard>
                <ObjectiveCard icon={Scale} title="Promote Analytical Evaluation">Analyze player value and build a balanced, winning squad.</ObjectiveCard>
                <ObjectiveCard icon={Sparkles} title="Learn by Doing">Gain hands-on experience in a fun, gamified, and competitive environment.</ObjectiveCard>
            </div>
        </motion.div>
        
        {/* Squad Rules & Budget */}
        <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-blue-200/50 mb-20">
            <h2 className="text-4xl font-bold text-center mb-10 gradient-title-blue">Squad Rules & Budget</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <IndianRupee className="h-10 w-10 text-blue-500 mx-auto mb-3" />
                    <p className="text-3xl font-bold text-blue-800">₹90 Cr</p>
                    <p className="text-gray-600 font-semibold">Total Budget</p>
                </div>
                 <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <Users className="h-10 w-10 text-blue-500 mx-auto mb-3" />
                    <p className="text-3xl font-bold text-blue-800">13</p>
                    <p className="text-gray-600 font-semibold">Max Players</p>
                </div>
                 <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <Star className="h-10 w-10 text-blue-500 mx-auto mb-3" />
                    <p className="text-3xl font-bold text-blue-800">4</p>
                    <p className="text-gray-600 font-semibold">Foreign Players</p>
                </div>
                 <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <ClipboardList className="h-10 w-10 text-blue-500 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mt-2"><strong>6</strong> Batsmen, <strong>2</strong> All-Rounders, <strong>3</strong> Bowlers</p>
                    <p className="text-gray-600 font-semibold">Playing XI Composition</p>
                </div>
            </div>
        </motion.div>

        {/* Placeholder for Judging & Schedule */}
        <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-blue-200/50 mb-20 text-center">
            <div className="flex justify-center items-center mb-4">
                <Info className="h-8 w-8 text-blue-500 mr-3" />
                <h2 className="text-3xl font-bold gradient-title-blue">Judging & Schedule</h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
                The detailed judging criteria and the full event schedule will be announced at the event to ensure a fair and exciting competition for all teams.
            </p>
        </motion.div>

        {/* Key Information Tabs */}
        <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-blue-200/50 mb-20 text-center">
          <div className="flex flex-col sm:flex-row justify-center border-b border-blue-200 mb-6">
            {Object.entries(TABS).map(([key, { label, icon: Icon }]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center justify-center font-semibold p-4 transition-colors duration-300 w-full sm:w-auto ${
                  activeTab === key
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-blue-500'
                }`}
              >
                <Icon className="w-5 h-5 mr-2"/> {label}
              </button>
            ))}
          </div>
          <div className="p-4 min-h-[200px] text-gray-700 flex items-center justify-center">
            {TABS[activeTab].content}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-600 to-indigo-800 p-10 rounded-2xl shadow-2xl text-white text-center">
          <Trophy className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
          <h2 className="text-4xl font-bold mb-4">Are You Ready to Bid?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            This is where cricket excitement meets strategic genius. Build your dream team, manage your budget, and outsmart the competition to lift the trophy!
          </p>
          <button className="bg-white text-blue-600 font-bold px-8 py-4 rounded-full text-lg hover:bg-gray-100 transform hover:scale-105 transition-transform duration-300 shadow-lg">
            Register Now
          </button>
        </motion.div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default IplAuction;
