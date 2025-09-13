import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Star, Award, Mic, Gift, Trophy } from 'lucide-react';

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


const Itinerary: React.FC = () => {
  const scheduleData = [
    {
      day: "Day 1",
      date: "TBD",
      shifts: [
        {
          time: "9:00 AM - 12:00 PM",
          title: "Inauguration & Orientation",
          description: "The event kicks off with a formal inauguration, followed by an overview of the events, rules, and team preparations.",
          icon: Calendar,
          activities: [
            "Lighting of the Lamp",
            "Participant Settling & Team Kit Distribution",
            "Introduction to InnovateX: Event Overview & Rules",
            "Chief Guest Speech / Faculty Introduction",
            "Event Kickstart Guide and Venue Allocation"
          ]
        },
        {
          time: "1:00 PM - 4:00 PM",
          title: "Events Commence",
          description: "The competitions begin! Teams dive into the first phase of their respective challenges at their allocated venues.",
          icon: Clock,
          activities: [
            "IPL Auction",
            "BrandBattles",
            "Young Innovators",
            "Echoes",
          ]
        }
      ]
    },
    {
      day: "Day 2",
      date: "TBD",
      shifts: [
        {
          time: "9:00 AM - 12:00 PM",
          title: "Shift 1: Competitions Continue",
          description: "The momentum continues as teams engage in the core activities of each event.",
          icon: Clock,
          activities: [
            "IPL Auction",
            "BrandBattles",
            "Young Innovators",
            "Echoes"
          ]
        },
        {
          time: "1:00 PM - 4:00 PM",
          title: "Shift 2: Strategic Deep Dive",
          description: "The afternoon is dedicated to intensive sessions where strategies are refined and executed.",
          icon: Clock,
          activities: [
            "IPL Auction",
            "BrandBattles",
            "Young Innovators",
            "Echoes"
          ]
        }
      ]
    },
    {
      day: "Day 3",
      date: "TBD",
      shifts: [
        {
          time: "9:00 AM - 10:30 AM",
          title: "The Grand Finale",
          description: "The final rounds of all competitions take place, leading up to the selection of the winners.",
          icon: Trophy,
          activities: [
            "IPL Auction - Final Rounds",
            "BrandBattles - Final Pitches",
            "Young Innovators - Final Presentations",
            "Echoes - Final Debates"
          ]
        },
        {
          time: "1:00 PM - 4:00 PM",
          title: "Refreshments & Valedictory",
          description: "The closing ceremony, celebrating the participants' hard work with awards, performances, and acknowledgments.",
          icon: Award,
          highlight: true,
          activities: [
            "Prize Distribution Ceremony",
            "Cultural Performances (optional)",
            "Certificate Handouts to Participants",
            "Vote of Thanks",
            "Group Photos & Refreshments for All"
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
            Your complete 3-day journey through innovation, strategy, and creativity at InnovateX'25.
          </p>
        </motion.div>

        <div className="space-y-16">
          {scheduleData.map((day, dayIndex) => (
            <motion.div key={day.day} variants={itemVariants} className="relative">
              {/* Timeline connector */}
              {dayIndex < scheduleData.length - 1 && (
                <div className="absolute left-1/2 -ml-0.5 w-1 h-full bg-gradient-to-b from-blue-200 to-blue-300 hidden lg:block z-0"></div>
              )}
              
              <div className="lg:flex items-center justify-center relative">
                  <div className="lg:w-1/2 lg:pr-8">
                    {day.shifts.filter((_, i) => i % 2 === 0).map((shift, shiftIndex) => (
                        <ShiftCard key={shiftIndex} shift={shift} alignment="right" />
                    ))}
                  </div>
                  <div className="hidden lg:flex w-20 h-20 bg-blue-500 rounded-full border-8 border-white shadow-lg items-center justify-center z-10">
                     <span className="text-white font-bold text-lg">{day.day.split(' ')[1]}</span>
                  </div>
                  <div className="lg:w-1/2 lg:pl-8">
                    {day.shifts.filter((_, i) => i % 2 !== 0).map((shift, shiftIndex) => (
                        <ShiftCard key={shiftIndex} shift={shift} alignment="left" />
                    ))}
                  </div>
                   <div className="lg:hidden text-center my-8">
                        <div className="inline-block bg-blue-500 rounded-full p-4">
                            <h3 className="text-3xl font-black text-white premium-font">{day.day}</h3>
                            <p className="text-blue-100 premium-font text-lg">{day.date}</p>
                        </div>
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

const ShiftCard = ({ shift, alignment }) => {
    const IconComponent = shift.icon;
    const alignClass = alignment === 'right' ? 'lg:text-right' : 'lg:text-left';
    return(
        <motion.div
        className={`p-8 rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4 mb-8 ${
          shift.highlight
            ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-500 shadow-yellow-200/70 hover:shadow-yellow-300'
            : 'bg-white/80 backdrop-blur-md border-blue-400 hover:shadow-xl'
        }`}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className={`flex items-center mb-6 ${alignment === 'right' ? 'lg:flex-row-reverse' : ''}`}>
          <div className="bg-blue-100 p-3 rounded-full mx-4">
            <IconComponent className="h-6 w-6 text-blue-600" />
          </div>
          <div className={alignClass}>
            <span className="text-sm premium-font text-blue-700 font-semibold bg-blue-100 px-3 py-1 rounded-full">
              {shift.time}
            </span>
            <h4 className="text-2xl font-bold gradient-title premium-font mt-2">
              {shift.title}
            </h4>
          </div>
        </div>
        
        <p className={`text-gray-600 mb-6 leading-relaxed ${alignClass}`}>
          {shift.description}
        </p>
        
        {shift.activities && (
          <div className="grid md:grid-cols-2 gap-3">
            {shift.activities.map((activity, actIndex) => (
              <div key={actIndex} className={`flex items-center p-3 bg-blue-50 rounded-lg ${alignment === 'right' ? 'lg:flex-row-reverse' : ''}`}>
                <div className="w-2 h-2 bg-blue-500 rounded-full mx-3 flex-shrink-0"></div>
                <span className={`text-sm text-blue-800 font-medium ${alignClass} w-full`}>{activity}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    )
}

export default Itinerary;

