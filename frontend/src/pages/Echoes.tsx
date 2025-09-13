import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  Target, 
  Trophy, 
  Clock, 
  CheckCircle, 
  Star, 
  Gavel,
  BookOpen,
  Briefcase,
  Heart,
  ShieldCheck,
  ThumbsUp,
  UserCheck,
  ClipboardList,
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
      <p className="text-sm mt-2">Fostering growth, one conversation at a time.</p>
    </div>
  </footer>
);

// Helper component for Objective Cards
const ObjectiveCard = ({ icon: Icon, title, children }) => (
  <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-red-200/50 text-center h-full">
    <div className="flex justify-center mb-4">
      <div className="bg-red-100 p-3 rounded-full">
        <Icon className="h-8 w-8 text-red-600" />
      </div>
    </div>
    <h3 className="text-xl font-bold text-red-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{children}</p>
  </motion.div>
);

// Helper component for Timeline Steps
const TimelineStep = ({ icon: Icon, title, time, children, isLast = false }) => (
  <div className="flex items-start">
    <div className="flex flex-col items-center mr-6">
      <div className="bg-red-500 text-white rounded-full p-3 z-10">
        <Icon className="w-6 h-6" />
      </div>
      {!isLast && <div className="w-px h-full bg-red-200 mt-2"></div>}
    </div>
    <div className="pb-12">
      <p className="text-sm font-semibold text-red-600 mb-1">{time}</p>
      <h4 className="text-xl font-bold text-gray-800 mb-2">{title}</h4>
      <p className="text-gray-600 leading-relaxed">{children}</p>
    </div>
  </div>
);


const Echoes = () => {
  const [activeTab, setActiveTab] = useState('confidentiality');
  
  const TABS = {
    confidentiality: {
      label: 'Confidentiality',
      icon: ShieldCheck,
      content: (
        <>
          <p className="mb-4 text-gray-700">The success of Echoes depends on trust. Hence, strict confidentiality rules apply:</p>
          <ul className="space-y-3">
            <li className="flex items-start"><CheckCircle className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" /><span><strong>No Disclosure:</strong> Personal doubts or concerns will not be shared with teachers, parents, or school management without the student’s consent.</span></li>
            <li className="flex items-start"><CheckCircle className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" /><span><strong>Respect:</strong> Mentors and students must respect each other’s privacy and dignity.</span></li>
            <li className="flex items-start"><CheckCircle className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" /><span><strong>Safe Space:</strong> No mocking, judgment, or criticism is tolerated.</span></li>
            <li className="flex items-start"><CheckCircle className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" /><span><strong>Professional Support:</strong> If a serious concern arises, Reel Haus will handle it sensitively and connect the student to professionals.</span></li>
          </ul>
        </>
      ),
    },
    roles: {
      label: 'Roles & Responsibilities',
      icon: Users,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-red-800 mb-2">For Organizers (Reel Haus Club)</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Invite and prepare mentors.</li>
              <li>Set up discussion areas.</li>
              <li>Ensure confidentiality and respectful conduct.</li>
              <li>Collect feedback after the session.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-red-800 mb-2">For Mentors</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Listen actively and patiently.</li>
              <li>Share knowledge and personal experiences.</li>
              <li>Encourage students to think positively.</li>
              <li>Maintain confidentiality at all times.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-red-800 mb-2">For Participants</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Be open to asking questions.</li>
              <li>Respect the mentor’s time and guidance.</li>
              <li>Keep an open mind while receiving feedback.</li>
              <li>Use the opportunity to learn.</li>
            </ul>
          </div>
        </div>
      )
    },
    rules: {
      label: 'Rules & Regulations',
      icon: Gavel,
      content: (
         <ul className="space-y-3">
            <li className="flex items-start"><CheckCircle className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" /><span>Respectful interaction is mandatory.</span></li>
            <li className="flex items-start"><CheckCircle className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" /><span>Come prepared with at least one academic or personal question.</span></li>
            <li className="flex items-start"><CheckCircle className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" /><span>No recording or sharing of conversations is allowed.</span></li>
            <li className="flex items-start"><CheckCircle className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" /><span>Mentors must keep discussions non-judgmental and confidential.</span></li>
            <li className="flex items-start"><CheckCircle className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" /><span>Time limits must be followed to ensure fairness.</span></li>
          </ul>
      )
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-red-50 to-gray-100 font-sans">
      <motion.main 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible" 
        className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center mb-20">
          <div className="flex items-center justify-center mb-6">
            <MessageSquare className="h-12 w-12 sm:h-16 sm:w-16 text-red-500 mr-4" />
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800">
              Session Echoes
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            A unique mentorship and guidance-based session creating a safe, open, and supportive environment for students of classes 8, 9, and 10. Your voice, heard and valued.
          </p>
        </motion.div>

        {/* Objectives Section */}
        <motion.div variants={itemVariants} className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 gradient-title">Our Core Objectives</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <ObjectiveCard icon={BookOpen} title="Academic Guidance">Clarify doubts in science, math, languages, and provide exam strategies.</ObjectiveCard>
                <ObjectiveCard icon={Briefcase} title="Career Awareness">Introduce diverse career paths like engineering, medicine, arts, and entrepreneurship.</ObjectiveCard>
                <ObjectiveCard icon={Heart} title="Personal Development">Encourage self-confidence, time management, and leadership qualities.</ObjectiveCard>
                <ObjectiveCard icon={ShieldCheck} title="Confidential Counseling">Provide a safe platform to share personal struggles without judgment.</ObjectiveCard>
                <ObjectiveCard icon={Users} title="Mentor-Student Bond">Create lasting, supportive relationships that extend beyond the event.</ObjectiveCard>
                <ObjectiveCard icon={ThumbsUp} title="Holistic Support">Frame education as a journey of personal growth, not just grades.</ObjectiveCard>
            </div>
        </motion.div>

        {/* Event Flow Section */}
        <motion.div variants={itemVariants} className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 gradient-title">Event Flow & Structure</h2>
            <div className="max-w-3xl mx-auto">
              <TimelineStep icon={ClipboardList} title="Orientation" time="10 Minutes">
                Introduction of mentors, explanation of the session format, and grounding in the rules of confidentiality.
              </TimelineStep>
              <TimelineStep icon={Users} title="Mentor Interaction Phase" time="60 Minutes">
                Small teams of 6-8 students sit with mentors to discuss academic doubts, career guidance, personal matters, and more in rotating sessions.
              </TimelineStep>
              <TimelineStep icon={BookOpen} title="Guidance & Resource Sharing" time="20 Minutes">
                Mentors provide study materials, career resources, and personal growth tips. We commit to connecting students with specialized help if needed.
              </TimelineStep>
              <TimelineStep icon={Sparkles} title="Closing Reflection" time="10 Minutes" isLast>
                Mentors and students reflect on key takeaways, reinforcing that Echoes is a lasting, supportive space.
              </TimelineStep>
            </div>
        </motion.div>
        
        {/* Key Information Tabs */}
        <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-red-200/50 mb-20">
          <div className="flex flex-col sm:flex-row justify-center border-b border-red-200 mb-6">
            {Object.entries(TABS).map(([key, { label, icon: Icon }]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center justify-center font-semibold p-4 transition-colors duration-300 w-full sm:w-auto ${
                  activeTab === key
                    ? 'border-b-2 border-red-600 text-red-600'
                    : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <Icon className="w-5 h-5 mr-2"/> {label}
              </button>
            ))}
          </div>
          <div className="p-4 min-h-[200px] text-gray-700">
            {TABS[activeTab].content}
          </div>
        </motion.div>

        {/* Schedule & Outcomes */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
            <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-red-200/50">
                <div className="flex items-center mb-6">
                    <Calendar className="h-8 w-8 text-red-500 mr-3" />
                    <h2 className="text-3xl font-bold gradient-title">Sample Schedule</h2>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg"><span className="font-semibold text-gray-700">2:00 – 2:10 PM</span><span className="font-bold text-red-800">Orientation</span></div>
                    <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg"><span className="font-semibold text-gray-700">2:10 – 3:10 PM</span><span className="font-bold text-red-800">Mentor Interaction</span></div>
                    <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg"><span className="font-semibold text-gray-700">3:10 – 3:30 PM</span><span className="font-bold text-red-800">Resource Sharing</span></div>
                    <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg"><span className="font-semibold text-gray-700">3:30 – 3:40 PM</span><span className="font-bold text-red-800">Reflection</span></div>
                    <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg"><span className="font-semibold text-gray-700">3:40 – 3:50 PM</span><span className="font-bold text-red-800">Feedback</span></div>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-red-200/50">
                 <div className="flex items-center mb-6">
                    <Award className="h-8 w-8 text-red-500 mr-3" />
                    <h2 className="text-3xl font-bold gradient-title">Learning Outcomes</h2>
                </div>
                 <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" />Gain clarity in academics and career paths.</li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" />Feel confident discussing personal challenges.</li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" />Learn how to seek guidance and mentorship.</li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" />Improve problem-solving and decision-making skills.</li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" />Develop a habit of open communication.</li>
                 </ul>
            </motion.div>
        </div>

        {/* Final CTA */}
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-red-600 to-red-800 p-10 rounded-2xl shadow-2xl text-white text-center">
          <Star className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
          <h2 className="text-4xl font-bold mb-4">Let Your Voice Echo!</h2>
          <p className="text-red-100 mb-8 max-w-2xl mx-auto">
            This session is more than an event—it's a bridge of trust. Join us to grow into a confident, self-aware, and well-guided individual. The echoes of these conversations will shape your future.
          </p>
          <button className="bg-white text-red-600 font-bold px-8 py-4 rounded-full text-lg hover:bg-gray-100 transform hover:scale-105 transition-transform duration-300 shadow-lg">
            Register Now
          </button>
        </motion.div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default Echoes;
