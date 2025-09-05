import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Users, 
  Target, 
  Presentation, 
  ClipboardList, 
  CheckCircle, 
  Star, 
  Trophy, 
  Shield,
  Palette,
  Megaphone,
  Scale,
  Calendar,
  Sparkles,
  Award
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
      <p className="text-sm mt-2">Crafting the brands of tomorrow, today.</p>
    </div>
  </footer>
);

// Helper component for Objective Cards
const ObjectiveCard = ({ icon: Icon, title, children }) => (
  <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-teal-200/50 text-center h-full">
    <div className="flex justify-center mb-4">
      <div className="bg-teal-100 p-3 rounded-full">
        <Icon className="h-8 w-8 text-teal-600" />
      </div>
    </div>
    <h3 className="text-xl font-bold text-teal-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{children}</p>
  </motion.div>
);

// Helper component for Judging Criteria Bars
const CriteriaBar = ({ label, percentage }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-gray-700">{label}</span>
            <span className="font-bold text-teal-600">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div 
              className="bg-gradient-to-r from-teal-400 to-teal-600 h-2.5 rounded-full" 
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
        </div>
    </div>
);

const BrandBattles = () => {
  const [activeTab, setActiveTab] = useState('roles');
  
  const TABS = {
    roles: {
      label: 'Participant Roles',
      icon: Users,
      content: (
        <div className="space-y-4 text-left">
          <div>
            <h4 className="font-bold text-teal-800 mb-2">Divide & Conquer</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li><strong>Creative Head:</strong> Designs taglines, slogans, and campaign visuals.</li>
              <li><strong>Marketing Strategist:</strong> Defines the brand's Unique Selling Points (USP).</li>
              <li><strong>Presentation Lead:</strong> Delivers the pitch with confidence and clarity.</li>
              <li><strong>Analyst:</strong> Prepares counter-arguments to defend the brand.</li>
            </ul>
          </div>
        </div>
      )
    },
    rules: {
      label: 'Rules & Regulations',
      icon: Shield,
      content: (
         <ul className="space-y-3 text-left">
            <li className="flex items-start"><CheckCircle className="h-5 w-5 text-teal-500 mr-3 mt-1 flex-shrink-0" /><span>Pitches are limited to 7 minutes, with a 3-minute defense round.</span></li>
            <li className="flex items-start"><CheckCircle className="h-5 w-5 text-teal-500 mr-3 mt-1 flex-shrink-0" /><span>Respect for competitors is mandatory; no offensive remarks allowed.</span></li>
            <li className="flex items-start"><CheckCircle className="h-5 w-5 text-teal-500 mr-3 mt-1 flex-shrink-0" /><span>All team members must actively participate in the presentation.</span></li>
            <li className="flex items-start"><CheckCircle className="h-5 w-5 text-teal-500 mr-3 mt-1 flex-shrink-0" /><span>The judges' decision is final.</span></li>
          </ul>
      )
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-teal-50 to-gray-100 font-sans">
      <motion.main 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible" 
        className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center mb-20">
          <div className="flex items-center justify-center mb-6">
            <Megaphone className="h-12 w-12 sm:h-16 sm:w-16 text-teal-500 mr-4" />
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-800">
              Brand Battles
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            A creative competition where you become the strategist, pitching and defending brands in a thrilling battle for market dominance.
          </p>
        </motion.div>

        {/* Objectives Section */}
        <motion.div variants={itemVariants} className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 gradient-title-teal">Key Objectives</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <ObjectiveCard icon={Target} title="Marketing Concepts">Get hands-on exposure to how companies build and maintain brand identity.</ObjectiveCard>
                <ObjectiveCard icon={Palette} title="Creative Advertising">Think outside the box to create catchy slogans, jingles, and campaigns.</ObjectiveCard>
                <ObjectiveCard icon={Presentation} title="Presentation Skills">Develop strong public speaking and persuasive communication abilities.</ObjectiveCard>
                <ObjectiveCard icon={Users} title="Teamwork & Collaboration">Learn to divide roles and work together as creative directors, marketers, and more.</ObjectiveCard>
                <ObjectiveCard icon={Shield} title="Analytical Thinking">Analyze competitor strengths and position your brand as superior.</ObjectiveCard>
                <ObjectiveCard icon={Sparkles} title="Practical Exposure">See firsthand how branding influences everyday choices in the real world.</ObjectiveCard>
            </div>
        </motion.div>
        
        {/* Event Flow Section */}
        <motion.div variants={itemVariants} className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 gradient-title-teal">The Battle Plan</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-teal-50 border border-teal-200 rounded-xl">
                <p className="font-bold text-teal-600 mb-2">Phase 1</p>
                <h3 className="text-xl font-bold text-teal-900 mb-2">Orientation (15 min)</h3>
                <p className="text-gray-600 text-sm">Rules are explained and teams are assigned their brands.</p>
              </div>
               <div className="text-center p-6 bg-teal-50 border border-teal-200 rounded-xl">
                <p className="font-bold text-teal-600 mb-2">Phase 2</p>
                <h3 className="text-xl font-bold text-teal-900 mb-2">Preparation (30 min)</h3>
                <p className="text-gray-600 text-sm">Brainstorm slogans, design ads, and develop your winning strategy.</p>
              </div>
               <div className="text-center p-6 bg-teal-50 border border-teal-200 rounded-xl">
                <p className="font-bold text-teal-600 mb-2">Phase 3</p>
                <h3 className="text-xl font-bold text-teal-900 mb-2">Brand Pitch (5-7 min)</h3>
                <p className="text-gray-600 text-sm">Present your brand identity, USPs, and campaign to the judges.</p>
              </div>
               <div className="text-center p-6 bg-teal-50 border border-teal-200 rounded-xl">
                <p className="font-bold text-teal-600 mb-2">Phase 4</p>
                <h3 className="text-xl font-bold text-teal-900 mb-2">Counter Round (3 min)</h3>
                <p className="text-gray-600 text-sm">Challenge claims from rivals and persuasively defend your brand.</p>
              </div>
            </div>
        </motion.div>

        {/* Judging & Schedule */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
            <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-teal-200/50">
                <div className="flex items-center mb-6">
                    <Scale className="h-8 w-8 text-teal-500 mr-3" />
                    <h2 className="text-3xl font-bold gradient-title-teal">Judging Criteria</h2>
                </div>
                <div className="space-y-6">
                    <CriteriaBar label="Creativity & Originality" percentage={30} />
                    <CriteriaBar label="Brand Positioning" percentage={20} />
                    <CriteriaBar label="Presentation Skills" percentage={20} />
                    <CriteriaBar label="Defense & Counter-Arguments" percentage={20} />
                    <CriteriaBar label="Teamwork & Collaboration" percentage={10} />
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-teal-200/50">
                <div className="flex items-center mb-6">
                    <Calendar className="h-8 w-8 text-teal-500 mr-3" />
                    <h2 className="text-3xl font-bold gradient-title-teal">Event Schedule</h2>
                </div>
                <ul className="space-y-3">
                    <li className="flex items-center p-3 bg-teal-50 rounded-lg"><span className="font-bold text-teal-800 w-32">10:00 – 10:15</span><span className="text-gray-700">Orientation & Briefing</span></li>
                    <li className="flex items-center p-3 bg-teal-50 rounded-lg"><span className="font-bold text-teal-800 w-32">10:15 – 10:45</span><span className="text-gray-700">Preparation Phase</span></li>
                    <li className="flex items-center p-3 bg-teal-50 rounded-lg"><span className="font-bold text-teal-800 w-32">10:45 – 11:30</span><span className="text-gray-700">Brand Pitches</span></li>
                    <li className="flex items-center p-3 bg-teal-50 rounded-lg"><span className="font-bold text-teal-800 w-32">11:30 – 12:00</span><span className="text-gray-700">Counter Round</span></li>
                    <li className="flex items-center p-3 bg-teal-50 rounded-lg"><span className="font-bold text-teal-800 w-32">12:00 – 12:30</span><span className="text-gray-700">Feedback & Winner</span></li>
                </ul>
            </motion.div>
        </div>
        
        {/* Key Information Tabs */}
        <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-teal-200/50 mb-20 text-center">
          <div className="flex flex-col sm:flex-row justify-center border-b border-teal-200 mb-6">
            {Object.entries(TABS).map(([key, { label, icon: Icon }]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center justify-center font-semibold p-4 transition-colors duration-300 w-full sm:w-auto ${
                  activeTab === key
                    ? 'border-b-2 border-teal-600 text-teal-600'
                    : 'text-gray-500 hover:text-teal-500'
                }`}
              >
                <Icon className="w-5 h-5 mr-2"/> {label}
              </button>
            ))}
          </div>
          <div className="p-4 min-h-[150px] text-gray-700 flex items-center justify-center">
            {TABS[activeTab].content}
          </div>
        </motion.div>


        {/* Final CTA */}
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-teal-600 to-cyan-800 p-10 rounded-2xl shadow-2xl text-white text-center">
          <Award className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
          <h2 className="text-4xl font-bold mb-4">Unleash Your Brand's Power!</h2>
          <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
            This is your chance to showcase creativity, strategic thinking, and confidence. Build valuable skills, have fun, and battle to become the ultimate brand champion.
          </p>
          <button className="bg-white text-teal-600 font-bold px-8 py-4 rounded-full text-lg hover:bg-gray-100 transform hover:scale-105 transition-transform duration-300 shadow-lg">
            Register Now
          </button>
        </motion.div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default BrandBattles;
