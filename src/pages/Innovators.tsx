import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Rocket, Users, Target, Trophy, Clock, CheckCircle, Star, Zap } from 'lucide-react';
import Footer from '../components/Footer';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const Innovators: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50 to-gray-100">
      <motion.main 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible" 
        className="relative max-w-6xl mx-auto px-6 py-32"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Lightbulb className="h-16 w-16 text-green-500 mr-4" />
            <h1 className="text-6xl md:text-7xl font-extrabold gradient-title premium-font">
              Young Innovators
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A challenge where students present original solutions and learn to believe in the power of their ideas.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-green-200/50">
            <div className="flex items-center mb-6">
              <Rocket className="h-8 w-8 text-green-500 mr-3" />
              <h2 className="text-3xl font-bold gradient-title premium-font">Innovation Challenge</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              Young Innovators is designed to nurture the entrepreneurial spirit in students. Teams will identify 
              real-world problems and develop innovative solutions, learning to think like entrepreneurs and 
              change-makers. This competition emphasizes creativity, feasibility, and social impact.
            </p>
            <div className="bg-green-100/50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-semibold text-center">Team Size: 2-4 Members</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-green-200/50">
            <div className="flex items-center mb-6">
              <Target className="h-8 w-8 text-green-500 mr-3" />
              <h2 className="text-3xl font-bold gradient-title premium-font">Learning Goals</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Develop problem-solving and critical thinking skills</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Foster entrepreneurial mindset and innovation</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Build confidence in presenting ideas</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Understand social impact and sustainability</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-green-200/50 mb-12">
          <div className="flex items-center mb-6">
            <Clock className="h-8 w-8 text-green-500 mr-3" />
            <h2 className="text-3xl font-bold gradient-title premium-font">Competition Phases</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-lg font-bold text-green-800 mb-2">Problem Identification</h3>
              <p className="text-gray-600 text-sm">Identify and define a real-world problem</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-bold text-green-800 mb-2">Solution Design</h3>
              <p className="text-gray-600 text-sm">Develop innovative and feasible solutions</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-lg font-bold text-green-800 mb-2">Prototype Creation</h3>
              <p className="text-gray-600 text-sm">Build a working prototype or detailed plan</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">4</span>
              </div>
              <h3 className="text-lg font-bold text-green-800 mb-2">Final Pitch</h3>
              <p className="text-gray-600 text-sm">Present solution to panel of judges</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-green-200/50">
            <div className="flex items-center mb-6">
              <Trophy className="h-8 w-8 text-green-500 mr-3" />
              <h2 className="text-3xl font-bold gradient-title premium-font">Evaluation Criteria</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="font-semibold text-green-800">Innovation & Creativity</span>
                <span className="text-green-600 font-bold">35%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="font-semibold text-green-800">Feasibility & Implementation</span>
                <span className="text-green-600 font-bold">30%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="font-semibold text-green-800">Social Impact</span>
                <span className="text-green-600 font-bold">20%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="font-semibold text-green-800">Presentation Quality</span>
                <span className="text-green-600 font-bold">15%</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-green-200/50">
            <div className="flex items-center mb-6">
              <Zap className="h-8 w-8 text-green-500 mr-3" />
              <h2 className="text-3xl font-bold gradient-title premium-font">Innovation Areas</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                <h4 className="font-semibold text-green-800">Technology & Digital Solutions</h4>
                <p className="text-sm text-gray-600">Apps, websites, digital tools</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                <h4 className="font-semibold text-green-800">Environmental Sustainability</h4>
                <p className="text-sm text-gray-600">Eco-friendly solutions and green tech</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                <h4 className="font-semibold text-green-800">Social Innovation</h4>
                <p className="text-sm text-gray-600">Community solutions and social impact</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                <h4 className="font-semibold text-green-800">Education & Learning</h4>
                <p className="text-sm text-gray-600">Educational tools and learning methods</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="bg-gradient-to-r from-green-500 to-green-600 p-8 rounded-2xl shadow-lg text-white text-center">
          <Star className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Believe in Your Ideas!</h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Every great innovation started with a simple idea. Join Young Innovators and transform 
            your creative thoughts into solutions that can change the world!
          </p>
          <button className="bg-white text-green-600 font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors">
            Register for Young Innovators
          </button>
        </motion.div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default Innovators;