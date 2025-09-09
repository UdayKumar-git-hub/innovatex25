import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Clock, Trophy, AlertTriangle, CheckCircle, BookOpen, Star } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const Footer = () => (
    <footer className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 py-8">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="font-semibold">&copy; 2025 InnovateX'25. All Rights Reserved.</p>
        <p className="text-gray-600 mt-2">Presented by reelhaus.hyd</p>
        <p className="text-gray-500 mt-2">Contact: +91 9392449721, +91 9110387918</p>
      </div>
    </footer>
  );

const Rules: React.FC = () => {
  const generalRules = [
    "All participants must register before the deadline",
    "Teams must consist of 2-4 members from the same institution",
    "Participants must carry valid student ID cards",
    "Mobile phones must be on silent mode during competitions",
    "Respectful behavior towards organizers, judges, and fellow participants is mandatory",
    "Any form of misconduct will result in immediate disqualification",
    "Decisions made by judges and organizers are final and binding",
    "Participants must attend all briefing sessions"
  ];

  const eventSpecificRules = {
    "IPL Auction": [
      "Each team receives a virtual budget of ₹90 Crores",
      "Maximum squad size of 13 players",
      "Only 4 foreign players allowed per team",
      "Teams must raise placards to confirm bids",
      "Excessive delays may lead to bid disqualification",
      "No player transfers allowed once purchased"
    ],
    "Brand Battles": [
      "Original content creation is mandatory",
      "No plagiarism or copyright infringement allowed",
      "Teams must present within allocated time limits",
      "All materials must be submitted before deadline",
      "Use of inappropriate content will lead to disqualification",
      "Teams must bring their own design materials"
    ],
    "Young Innovators": [
      "Solutions must address real-world problems",
      "Prototypes or detailed implementation plans required",
      "No existing commercial solutions allowed",
      "Teams must demonstrate feasibility of their solution",
      "Intellectual property rights belong to participants",
      "Judges may ask technical questions during presentation"
    ],
    "Echoes (Mentorship Session)": [
      "Respectful interaction between students and mentors is mandatory.",
      "Come prepared with at least one academic or personal question.",
      "No recording or sharing of conversations is allowed to ensure privacy.",
      "Mentors must keep all discussions non-judgmental and confidential.",
      "Time limits per team must be followed to ensure fairness for all.",
      "Discussions must remain constructive, positive, and supportive."
    ]
  };

  const codeOfConduct = [
    "Maintain professional decorum throughout the event",
    "Respect diversity and promote inclusive participation",
    "No discrimination based on gender, religion, or background",
    "Report any inappropriate behavior to organizers immediately",
    "Keep the venue clean and organized",
    "No consumption of alcohol or prohibited substances",
    "Dress code: Smart casual or formal attire"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-gray-100">
      <motion.main 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible" 
        className="relative max-w-6xl mx-auto px-6 py-32"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-16 w-16 text-orange-500 mr-4" />
            <h1 className="text-6xl md:text-7xl font-extrabold gradient-title premium-font">
              Rules & Guidelines
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Fair play, respect, and excellence - the foundation of InnovateX25. Please read and follow all guidelines.
          </p>
        </motion.div>

        {/* General Rules */}
        <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-orange-200/50 mb-12">
          <div className="flex items-center mb-6">
            <BookOpen className="h-8 w-8 text-orange-500 mr-3" />
            <h2 className="text-3xl font-bold gradient-title premium-font">General Rules</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {generalRules.map((rule, index) => (
              <div key={index} className="flex items-start p-4 bg-orange-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{rule}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Event-Specific Rules */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold gradient-title premium-font mb-4">Event-Specific Rules</h2>
            <p className="text-gray-600">Each competition has its own set of specialized guidelines</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {Object.entries(eventSpecificRules).map(([event, rules]) => (
              <motion.div 
                key={event}
                className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-orange-200/50"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h3 className="text-2xl font-bold gradient-title premium-font mb-4 text-center">{event}</h3>
                <div className="space-y-3">
                  {rules.map((rule, ruleIndex) => (
                    <div key={ruleIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{rule}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Code of Conduct */}
        <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-orange-200/50 mb-12">
          <div className="flex items-center mb-6">
            <Users className="h-8 w-8 text-orange-500 mr-3" />
            <h2 className="text-3xl font-bold gradient-title premium-font">Code of Conduct</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {codeOfConduct.map((conduct, index) => (
              <div key={index} className="flex items-start p-4 bg-orange-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{conduct}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Important Notes */}
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-red-500 to-red-600 p-8 rounded-2xl shadow-lg text-white mb-12">
          <div className="flex items-center mb-6">
            <AlertTriangle className="h-8 w-8 text-white mr-3" />
            <h2 className="text-3xl font-bold">Important Notes</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-white rounded-full mr-3 mt-2 flex-shrink-0"></div>
                <span>Violation of any rule may result in immediate disqualification</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-white rounded-full mr-3 mt-2 flex-shrink-0"></div>
                <span>Organizers reserve the right to modify rules if necessary</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-white rounded-full mr-3 mt-2 flex-shrink-0"></div>
                <span>All participants must sign a consent form</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-white rounded-full mr-3 mt-2 flex-shrink-0"></div>
                <span>Photography and videography will be conducted for promotional purposes</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-white rounded-full mr-3 mt-2 flex-shrink-0"></div>
                <span>Participants are responsible for their personal belongings</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-white rounded-full mr-3 mt-2 flex-shrink-0"></div>
                <span>Emergency contact information must be provided during registration</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact for Clarifications */}
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 rounded-2xl shadow-lg text-white text-center">
          <Star className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Questions About Rules?</h2>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            If you have any questions or need clarification about the rules and guidelines, 
            don't hesitate to contact our organizing team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-white text-orange-600 font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors">
              Contact Organizers
            </button>
            <div className="flex items-center text-orange-100">
              <Clock className="h-5 w-5 mr-2" />
              <span className="text-sm">Response within 24 hours</span>
            </div>
          </div>
        </motion.div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default Rules;
