import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';

const Schedule: React.FC = () => {
  const scheduleData = [
    {
      day: "Day 1",
      date: "TBD",
      shifts: [
        {
          time: "Morning Shift",
          title: "Inauguration & Orientation",
          description: "Welcome ceremony and event briefing",
          icon: Calendar
        },
        {
          time: "Afternoon Shift",
          title: "All Four Rounds",
          description: "Begin the competition journey",
          icon: Clock
        }
      ]
    },
    {
      day: "Day 2",
      date: "TBD",
      shifts: [
        {
          time: "Morning Shift",
          title: "All Four Rounds",
          description: "Main event activities and challenges",
          icon: Clock
        },
        {
          time: "Afternoon Shift",
          title: "All Four Rounds",
          description: "Continued competitions and skill development",
          icon: Clock
        }
      ]
    },
    {
      day: "Day 3",
      date: "TBD",
      shifts: [
        {
          time: "Morning Shift",
          title: "All Four Rounds",
          description: "Final rounds and ultimate challenges",
          icon: Clock
        },
        {
          time: "Afternoon Shift",
          title: "Valedictory & Awards",
          description: "Prize distribution & certificate handouts",
          icon: MapPin,
          highlight: true
        }
      ]
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: i * 0.2, type: 'spring', stiffness: 100, damping: 12 }
    })
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-gray-100 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FACC15' fill-opacity='0.05'%3E%3Crect x='0' y='0' width='20' height='20'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-4">
            3 Days Schedule
          </h2>
          <p 
            className="text-xl text-gray-700 font-medium italic"
            style={{ fontFamily: 'Dancing Script, cursive' }}
          >
            Your journey to innovation
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="space-y-12">
          {scheduleData.map((day, dayIndex) => (
            <div key={day.day} className="relative">
              {/* Timeline connector */}
              {dayIndex < scheduleData.length - 1 && (
                <div className="absolute left-6 top-24 w-1 h-32 bg-gradient-to-b from-yellow-400 to-yellow-600 hidden lg:block"></div>
              )}
              
              <div className="lg:flex items-start space-y-8 lg:space-y-0 lg:space-x-8">
                {/* Day Header */}
                <div className="lg:w-1/4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 rounded-2xl shadow-lg text-center"
                  >
                    <h3 className="text-2xl font-black text-white mb-2 premium-font">
                      {day.day}
                    </h3>
                    <p className="text-white premium-font opacity-90">{day.date}</p>
                  </motion.div>
                </div>
                
                {/* Shifts */}
                <div className="lg:w-3/4 grid md:grid-cols-2 gap-6">
                  {day.shifts.map((shift, shiftIndex) => {
                    const IconComponent = shift.icon;
                    return (
                      <motion.div
                        key={shiftIndex}
                        className={`p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4 ${
                          shift.highlight
                            ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-500 shadow-yellow-200/70 hover:shadow-yellow-300'
                            : 'bg-white border-yellow-400 hover:shadow-xl'
                        }`}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        custom={shiftIndex}
                      >
                        <div className="flex items-center mb-3">
                          <div className="bg-gray-100 p-2 rounded-full mr-3">
                            <IconComponent className="h-5 w-5 text-yellow-600" />
                          </div>
                          <span className="text-sm premium-font text-gray-700 font-semibold">{shift.time}</span>
                        </div>
                        <h4 className="text-lg font-bold bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent mb-2">
                          {shift.title}
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{shift.description}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Schedule;
