import React, { useRef } from 'react';
import { motion, useTransform, useScroll, useSpring } from 'framer-motion';
import { Zap, CalendarDays, Sparkles, Award } from 'lucide-react';

// --- Animation Variants ---
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 15,
      mass: 0.5,
    },
  },
};

const About: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  });

  // Parallax effect for the right column
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const springY = useSpring(y, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <section ref={targetRef} className="relative py-32 md:py-48 bg-gray-50 text-gray-900 overflow-hidden">
      {/* Background Abstract Shapes */}
      <div className="absolute inset-0 z-0 opacity-40">
        <motion.div 
          className="absolute top-[10%] left-[5%] w-96 h-96 bg-yellow-300 rounded-full filter blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, -50, 0], scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute bottom-[15%] right-[10%] w-80 h-80 bg-yellow-200/80 rounded-full filter blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, 60, 0], scale: [1, 0.9, 1], rotate: [0, -15, 0] }}
          transition={{ duration: 25, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <motion.div className="text-center mb-24" variants={itemVariants}>
          <h2 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 drop-shadow-[0_2px_15px_rgba(250,204,21,0.4)]">
              What is InnovateX25?
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            It’s more than an event. It's a launchpad for the next generation of creators, thinkers, and leaders.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left Column: Info Cards */}
          <motion.div className="space-y-12" variants={sectionVariants}>
            <motion.div variants={itemVariants}>
              <InfoCard
                icon={<CalendarDays className="h-8 w-8 text-yellow-500" />}
                title="A Three-Day Power Fest"
                description="An immersive three-day, six-shift festival blending strategy, communication, and innovation into one electrifying experience."
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <InfoCard
                icon={<Sparkles className="h-8 w-8 text-yellow-500" />}
                title="A Journey of Growth"
                description="A transformative journey where students unearth hidden strengths and cultivate essential real-world skills beyond the classroom."
              />
            </motion.div>
          </motion.div>

          {/* Right Column: Core Pillars with Parallax */}
          <motion.div style={{ y: springY }} variants={itemVariants}>
            <div className="sticky top-24 bg-white/60 backdrop-blur-md p-10 rounded-3xl border border-yellow-400/20 shadow-2xl shadow-yellow-400/30">
              <div className="text-center">
                <motion.div
                  animate={{ rotateY: [0, 15, -15, 0] }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Award className="h-20 w-20 text-yellow-500 mx-auto mb-8 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Unleash Your Potential
                </h3>
                <p className="text-gray-600 font-medium text-lg mb-8">
                  The event is built on three core pillars that define its spirit:
                </p>
                <div className="space-y-6 text-left">
                  <Pillar text="BID: Master strategy in a high-stakes auction." />
                  <Pillar text="BATTLE: Sharpen logic and leadership in intense debates." />
                  <Pillar text="BELIEVE: Pitch world-changing ideas and trust your vision." />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

// --- Reusable Components ---

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, description }) => (
  <motion.div
    className="relative bg-white/50 p-8 rounded-2xl border border-gray-200/50 group overflow-hidden shadow-lg"
    whileHover={{ y: -5, scale: 1.03 }}
    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
  >
    <motion.div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="flex items-start relative z-10">
      <div className="bg-white p-4 rounded-full mr-5 border border-yellow-300/30 group-hover:border-yellow-400 transition-colors duration-300 shadow-md">
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  </motion.div>
);

const Pillar: React.FC<{ text: string }> = ({ text }) => (
  <motion.div
    className="flex items-center"
    whileHover={{ x: 10 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <Zap className="h-6 w-6 text-yellow-500 mr-4 flex-shrink-0" />
    <span className="text-gray-700 text-lg font-medium">{text}</span>
  </motion.div>
);

export default About;

