import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Star } from 'lucide-react';
import Footer from '../components/Footer';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const Itinerary: React.FC = () => {
  const scheduleData = [
    {
      day: "Day 1",
      date: "TBD",
      shifts: [
        {
          time: "Morning Shift",
          title: "Inauguration & Orientation",
          description: "Welcome ceremony, event briefing, and team formations",
          icon: Calendar,
          activities: [
            "Registration and Welcome",
            "Opening Ceremony",
            "Event Rules & Guidelines",
            "Team Introductions",
            "Venue Tour"
          ]
        },
        {
          time: "Afternoon Shift",
          title: "Events Kickstart",
          description: "Begin the competition journey across all four pillars",
          icon: Clock,
          activities: [
            "IPL Auction - Round 1",
            "Brand Battles - Brief & Research",
            "Young Innovators - Problem Identification",
            "Echoes - Topic Announcement"
          ]
        }
      ]
    },
    {
      day: "Day 2",
      date: "TBD",
      shifts: [
        {
          time: "Morning Shift",
          title: "Competition Intensifies",
          description: "Main event activities and challenges across all pillars",
          icon: Clock,
          activities: [
            "IPL Auction - Strategic Bidding",
            "Brand Battles - Campaign Development",
            "Young Innovators - Solution Design",
            "Echoes - Preliminary Rounds"
          ]
        },
        {
          time: "Afternoon Shift",
          title: "Skills Development",
          description: "Continued competitions and skill enhancement sessions",
          icon: Clock,
          activities: [
            "Workshop Sessions",
            "Mentorship Rounds",
            "Peer Learning Activities",
            "Progress Evaluations"
          ]
        }
      ]
    },
    {
      day: "Day 3",
      date: "TBD",
      shifts: [
        {
          time: "Morning Shift",
          title: "Grand Finale",
          description: "Final rounds and ultimate challenges",
          icon: Clock,
          activities: [
            "IPL Auction - Final Squad Building",
            "Brand Battles - Campaign Presentations",
            "Young Innovators - Solution Pitches",
            "Echoes - Championship Debates"
          ]
        },
        {
          time: "Afternoon Shift",
          title: "Valedictory & Awards",
          description: "Prize distribution, certificate handouts, and closing ceremony",
          icon: MapPin,
          highlight: true,
          activities: [
            "Results Announcement",
            "Prize Distribution",
            "Certificate Ceremony",
            "Closing Address",
            "Networking Session"
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-gray-100">
      <motion.main 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible" 
        className="relative max-w-7xl mx-auto px-6 py-32"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Calendar className="h-16 w-16 text-blue-500 mr-4" />
            <h1 className="text-6xl md:text-7xl font-extrabold gradient-title premium-font">
              Event Itinerary
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your complete 3-day journey through innovation, strategy, and creativity at InnovateX25.
          </p>
        </motion.div>

        <div className="space-y-16">
          {scheduleData.map((day, dayIndex) => (
            <motion.div key={day.day} variants={itemVariants} className="relative">
              {/* Timeline connector */}
              {dayIndex < scheduleData.length - 1 && (
                <div className="absolute left-8 top-32 w-1 h-64 bg-gradient-to-b from-blue-400 to-blue-600 hidden lg:block z-0"></div>
              )}
              
              <div className="lg:flex items-start space-y-8 lg:space-y-0 lg:space-x-12">
                {/* Day Header */}
                <div className="lg:w-1/4 relative z-10">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 rounded-2xl shadow-xl text-center"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <h3 className="text-3xl font-black text-white mb-2 premium-font">
                      {day.day}
                    </h3>
                    <p className="text-blue-100 premium-font text-lg">{day.date}</p>
                    <div className="mt-4 w-16 h-1 bg-white/50 mx-auto rounded-full"></div>
                  </motion.div>
                </div>
                
                {/* Shifts */}
                <div className="lg:w-3/4 space-y-8">
                  {day.shifts.map((shift, shiftIndex) => {
                    const IconComponent = shift.icon;
                    return (
                      <motion.div
                        key={shiftIndex}
                        className={`p-8 rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4 ${
                          shift.highlight
                            ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-500 shadow-yellow-200/70 hover:shadow-yellow-300'
                            : 'bg-white/80 backdrop-blur-md border-blue-400 hover:shadow-xl'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <div className="flex items-center mb-6">
                          <div className="bg-blue-100 p-3 rounded-full mr-4">
                            <IconComponent className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <span className="text-sm premium-font text-blue-700 font-semibold bg-blue-100 px-3 py-1 rounded-full">
                              {shift.time}
                            </span>
                            <h4 className="text-2xl font-bold gradient-title premium-font mt-2">
                              {shift.title}
                            </h4>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          {shift.description}
                        </p>
                        
                        {shift.activities && (
                          <div className="grid md:grid-cols-2 gap-3">
                            {shift.activities.map((activity, actIndex) => (
                              <div key={actIndex} className="flex items-center p-3 bg-blue-50 rounded-lg">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                                <span className="text-sm text-blue-800 font-medium">{activity}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants} className="mt-20 bg-gradient-to-r from-blue-500 to-blue-600 p-8 rounded-2xl shadow-lg text-white text-center">
          <Star className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Ready for the Journey?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Three days of innovation, competition, and growth await you. Join us for an unforgettable 
            experience that will shape your future and expand your horizons.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-white text-blue-600 font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors">
              Register Now
            </button>
            <div className="flex items-center text-blue-100">
              <Users className="h-5 w-5 mr-2" />
              <span className="text-sm">Limited seats available</span>
            </div>
          </div>
        </motion.div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default Itinerary;