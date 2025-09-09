import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { DollarSign, Users2, Gift, Award, LucideIcon } from 'lucide-react';

// --- Data Structure ---
const perks = [
  {
    icon: DollarSign,
    title: "Cash Prize",
    description: "Exciting monetary rewards for winners",
  },
  {
    icon: Users2,
    title: "Networking",
    description: "Connect with like-minded innovators and mentors",
  },
  {
    icon: Gift,
    title: "Goodies",
    description: "Bags, books, pens, and exclusive merchandise",
  },
  {
    icon: Award,
    title: "Participation Certificate",
    description: "Official recognition for all attendees",
  }
];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
};


const Perks: React.FC = () => {
  return (
    <section className="relative py-28 bg-gray-50 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-50">
            <motion.div 
              className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_center,_rgba(250,204,21,0.15)_0%,_rgba(250,204,21,0)_40%)]"
              animate={{ scale: [1, 1.1, 1], rotate: [0, -10, 0] }}
              transition={{ duration: 30, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            />
            <motion.div 
              className="absolute bottom-[-20%] right-[-15%] w-[60vw] h-[60vw] bg-[radial-gradient(circle_at_center,_rgba(253,224,71,0.1)_0%,_rgba(253,224,71,0)_35%)]"
               animate={{ scale: [1, 0.9, 1], rotate: [0, 10, 0] }}
              transition={{ duration: 40, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <motion.div 
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={titleVariants}
        >
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600">
                Prizes, Perks & More!
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We believe in recognizing and rewarding innovation, creativity, and participation.
          </p>
        </motion.div>
        
        <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
          {perks.map((perk) => (
            <PerkCard key={perk.title} perk={perk} />
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
            className="text-center mt-24"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="bg-white/60 backdrop-blur-lg p-10 rounded-2xl shadow-xl border-2 border-yellow-400/50 max-w-3xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Join hundreds of students in this transformative experience. Register now and be part of InnovateX25!
            </p>
            <MagneticButton text="Register Today!" />
          </div>
        </motion.div>

      </div>
    </section>
  );
};


// --- Reusable Sub-Components ---

interface PerkCardProps {
  perk: {
    icon: LucideIcon;
    title: string;
    description: string;
  };
}

const PerkCard: React.FC<PerkCardProps> = ({ perk }) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { stiffness: 200, damping: 25 });
    const springY = useSpring(y, { stiffness: 200, damping: 25 });
    
    const rotateX = useTransform(springY, [-0.5, 0.5], ['15deg', '-15deg']);
    const rotateY = useTransform(springX, [-0.5, 0.5], ['-15deg', '15deg']);
    
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

  const IconComponent = perk.icon;

  return (
    <motion.div
        ref={ref}
        variants={itemVariants}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
            transformStyle: "preserve-3d",
            rotateX,
            rotateY
        }}
        className="relative bg-white/50 backdrop-blur-md rounded-2xl border border-gray-200/80 shadow-lg text-center p-8"
    >
        <div className="mb-5" style={{ transform: "translateZ(40px)"}}>
            <motion.div 
                className="inline-block p-5 bg-yellow-100/50 rounded-full border border-yellow-200/80"
                style={{ boxShadow: `0 0 20px 5px rgba(250, 204, 21, 0.4)` }}
                whileHover={{ scale: 1.1, rotate: 10 }}
            >
                <IconComponent className="h-10 w-10 text-yellow-500" />
            </motion.div>
        </div>
        <div style={{ transform: "translateZ(30px)"}}>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{perk.title}</h3>
            <p className="text-gray-600 leading-relaxed">{perk.description}</p>
        </div>
    </motion.div>
  );
};


const MagneticButton: React.FC<{text: string}> = ({ text }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative bg-yellow-400 text-black font-bold px-10 py-4 text-lg rounded-full"
            whileHover={{ scale: 1.05, boxShadow: '0px 10px 30px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
            {text}
            <motion.div
                 className="absolute inset-0 rounded-full -z-10"
                 style={{
                    background: "radial-gradient(circle, rgba(250, 204, 21, 0.8) 0%, rgba(250, 204, 21, 0) 70%)",
                    filter: "blur(20px)"
                 }}
                 initial={{ scale: 0, opacity: 0 }}
                 animate={{ scale: isHovered ? 1.3 : 0, opacity: isHovered ? 1 : 0 }}
                 transition={{ duration: 0.3 }}
            />
        </motion.button>
    );
};


export default Perks;
