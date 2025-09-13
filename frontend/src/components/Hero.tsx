import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Lightbulb, Star, Zap, Moon, Sun } from 'lucide-react';

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const Hero: React.FC = () => {
  const title = "InnovateX25";
  const ref = useRef<HTMLDivElement>(null);
  const [darkMode, setDarkMode] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 100, damping: 20 });
  const springY = useSpring(y, { stiffness: 100, damping: 20 });

  const rotateX = useTransform(springY, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-7deg', '7deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative min-h-screen flex items-center justify-center py-20 overflow-hidden transition-colors duration-700 ${
        darkMode ? 'bg-gradient-to-b from-yellow-400 to-yellow-600' : 'bg-gradient-to-b from-white to-gray-100'
      }`}
      style={{ perspective: '1000px' }}
    >
      {/* Theme toggle button (top-left corner, leaving header gap) */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-6 left-6 p-3 rounded-full shadow-lg bg-white/70 hover:bg-white transition z-20"
      >
        {darkMode ? (
          <Sun className="h-6 w-6 text-yellow-500" />
        ) : (
          <Moon className="h-6 w-6 text-gray-700" />
        )}
      </button>

      <AnimatedBackground darkMode={darkMode} />

      <motion.div
        style={{ rotateX, rotateY }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10"
      >
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div className="mb-4" variants={itemVariants}>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter">
              {title.split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 50, filter: 'blur(5px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    delay: 0.2 + index * 0.05,
                    type: 'spring',
                    stiffness: 120,
                    damping: 10,
                  }}
                  className={`inline-block text-transparent bg-clip-text ${
                    darkMode
                      ? 'bg-gradient-to-r from-white via-gray-200 to-gray-300'
                      : 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600'
                  }`}
                >
                  {char}
                </motion.span>
              ))}
            </h1>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center justify-center gap-3 mb-4">
            <Lightbulb className={`h-6 w-6 ${darkMode ? 'text-white' : 'text-yellow-500'}`} />
            <p className={`text-lg italic ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>
              ideas shine through
            </p>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className={`text-xl md:text-2xl lg:text-3xl font-semibold mb-12 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}
          >
            #UnleashingtheX-FactorofInnovation
          </motion.h2>

          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12"
          >
            <Pillar name="Bid" description="Learn Strategy" icon={Star} darkMode={darkMode} />
            <Pillar name="Battle" description="Learn Leadership" icon={Zap} darkMode={darkMode} />
            <Pillar name="Believe" description="Learn to Innovate" icon={Lightbulb} darkMode={darkMode} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <MagneticButton darkMode={darkMode} href="/register" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

const Pillar: React.FC<{ name: string; description: string; icon: React.ElementType; darkMode: boolean }> = ({
  name,
  description,
  icon: Icon,
  darkMode,
}) => (
  <motion.div
    className={`relative group flex flex-col items-center p-6 rounded-2xl border backdrop-blur-lg transition-colors duration-500 ${
      darkMode
        ? 'border-white/40 bg-gray-800/40'
        : 'border-gray-200/80 bg-white/50'
    }`}
    whileHover={{ scale: 1.05, y: -5 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div
      className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
        darkMode ? 'bg-white/20' : 'bg-yellow-400/20'
      }`}
    ></div>
    <div className={`flex items-center text-lg md:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-700'}`}>
      <Icon className={`h-6 w-6 mr-3 ${darkMode ? 'text-white' : 'text-yellow-400'}`} />
      {name}
    </div>
    <motion.p
      className={`${darkMode ? 'text-gray-300' : 'text-gray-500'} text-sm mt-1`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      {description}
    </motion.p>
  </motion.div>
);

const MagneticButton: React.FC<{ darkMode: boolean; href?: string }> = ({ darkMode, href = "#" }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative font-bold px-10 py-4 text-lg rounded-full inline-block text-center ${
        darkMode ? 'bg-white text-yellow-600' : 'bg-yellow-400 text-black'
      }`}
      whileHover={{ scale: 1.05, boxShadow: '0px 10px 30px rgba(0,0,0,0.1)' }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      Register Now!
      <motion.div
        className="absolute inset-0 rounded-full -z-10"
        style={{
          background: darkMode
            ? 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)'
            : 'radial-gradient(circle, rgba(250, 204, 21, 0.8) 0%, rgba(250, 204, 21, 0) 70%)',
          filter: 'blur(20px)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: isHovered ? 1.3 : 0, opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.a>
  );
};

const AnimatedBackground: React.FC<{ darkMode: boolean }> = ({ darkMode }) => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    {/* Yellow blurred circles in light, white/grey in dark */}
    <motion.div
      className={`absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full blur-[80px] ${
        darkMode ? 'bg-white/30' : 'bg-yellow-300/40'
      }`}
      animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className={`absolute bottom-[-15%] right-[-15%] w-[50vw] h-[50vw] rounded-full blur-[90px] ${
        darkMode ? 'bg-gray-200/40' : 'bg-yellow-400/35'
      }`}
      animate={{ scale: [1, 0.9, 1], opacity: [0.6, 0.9, 0.6] }}
      transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
    />
  </div>
);

export default Hero;
