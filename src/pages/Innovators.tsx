import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Rocket, Users, Target, Trophy, Clock, CheckCircle, Star, Zap } from 'lucide-react';

// Animation variants for the main container and its children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

// A simple footer component to keep everything in one file
const Footer = () => (
  <footer className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 py-8">
    <div className="max-w-6xl mx-auto px-6 text-center">
      <p className="font-semibold">&copy; 2025 Young Innovators. All Rights Reserved.</p>
      <p className="text-gray-600 mt-2">An initiative by Reel Haus Club.</p>
    </div>
  </footer>
);


const Innovators: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50 to-gray-100">
      <motion.main 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible" 
        className="relative max-w-6xl mx-auto px-6 py-32"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Lightbulb className="h-16 w-16 text-green-500 mr-4" />
            <h1 className="text-6xl md:text-7xl font-extrabold gradient-title premium-font">
              Young Innovators
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A case study challenge where students analyze the success stories of modern startups and present their findings.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Event Overview Section */}
          <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-green-200/50">
            <div className="flex items-center mb-6">
              <Rocket className="h-8 w-8 text-green-500 mr-3" />
              <h2 className="text-3xl font-bold gradient-title premium-font">Event Overview</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              Young Innovators is a case study event where student teams analyze successful startups like Blinkit, Ola, or Tesla. Teams study their assigned case, then present their analysis on the startup's idea, its success factors, and what new features they would add to make it even better.
            </p>
            <div className="bg-green-100/50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-semibold text-center">Team Size: 4-5 Members | Target Audience: Classes 8, 9, & 10</p>
            </div>
          </motion.div>

          {/* Objectives Section */}
          <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-green-200/50">
            <div className="flex items-center mb-6">
              <Target className="h-8 w-8 text-green-500 mr-3" />
              <h2 className="text-3xl font-bold gradient-title premium-font">Objectives</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Introduce real-world entrepreneurship concepts and startup journeys.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Develop analytical thinking to dissect business success factors.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Improve public speaking and presentation skills.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Encourage creativity by suggesting innovative improvements.</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Event Flow Section */}
        <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-green-200/50 mb-12">
          <div className="flex items-center mb-6">
            <Clock className="h-8 w-8 text-green-500 mr-3" />
            <h2 className="text-3xl font-bold gradient-title premium-font">Event Flow & Structure</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-lg font-bold text-green-800 mb-2">Orientation (10 min)</h3>
              <p className="text-gray-600 text-sm">Rules explained and case studies assigned</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-bold text-green-800 mb-2">Preparation (30 min)</h3>
              <p className="text-gray-600 text-sm">Teams research and prepare their analysis</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-lg font-bold text-green-800 mb-2">Presentation (6-8 min)</h3>
              <p className="text-gray-600 text-sm">Teams present their findings and ideas</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">4</span>
              </div>
              <h3 className="text-lg font-bold text-green-800 mb-2">Q&A & Feedback (15 min)</h3>
              <p className="text-gray-600 text-sm">Judges and peers ask questions</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Evaluation Criteria Section */}
          <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-green-200/50">
            <div className="flex items-center mb-6">
              <Trophy className="h-8 w-8 text-green-500 mr-3" />
              <h2 className="text-3xl font-bold gradient-title premium-font">Evaluation Criteria</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="font-semibold text-green-800">Understanding of Startup</span>
                <span className="text-green-600 font-bold">25%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="font-semibold text-green-800">Analysis of Success Factors</span>
                <span className="text-green-600 font-bold">25%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="font-semibold text-green-800">Creativity in Suggestions</span>
                <span className="text-green-600 font-bold">20%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="font-semibold text-green-800">Presentation Quality</span>
                <span className="text-green-600 font-bold">15%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="font-semibold text-green-800">Team Participation</span>
                <span className="text-green-600 font-bold">15%</span>
              </div>
            </div>
          </motion.div>

          {/* Example Case Studies Section */}
          <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-green-200/50">
            <div className="flex items-center mb-6">
              <Users className="h-8 w-8 text-green-500 mr-3" />
              <h2 className="text-3xl font-bold gradient-title premium-font">Example Case Studies</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                <h4 className="font-semibold text-green-800">Blinkit</h4>
                <p className="text-sm text-gray-600">Instant grocery delivery</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                <h4 className="font-semibold text-green-800">Ola</h4>
                <p className="text-sm text-gray-600">Ride-hailing services</p>
              </div>
               <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                <h4 className="font-semibold text-green-800">Zomato</h4>
                <p className="text-sm text-gray-600">Food delivery platform</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                <h4 className="font-semibold text-green-800">Paytm</h4>
                <p className="text-sm text-gray-600">Digital payments solution</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                <h4 className="font-semibold text-green-800">Tesla</h4>
                <p className="text-sm text-gray-600">Electric cars and clean energy</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Final CTA */}
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-green-500 to-green-600 p-8 rounded-2xl shadow-lg text-white text-center">
          <Star className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Analyze the Greats, Become the Next!</h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            By analyzing the journey of real-world startups, you not only understand how companies succeed but also develop your own ability to innovate. Join us to see the world differently!
          </p>
          <button className="bg-white text-green-600 font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors">
            Register Now
          </button>
        </motion.div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default Innovators;

