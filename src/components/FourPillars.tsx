import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Trophy, Megaphone, Lightbulb, MessageSquare } from 'lucide-react';

// --- Data Structure ---
const pillars = [
  {
    id: 1,
    title: "IPL Auction",
    icon: Trophy,
    description: "An IPL-style auction where students learn decision-making, resource management, and teamwork.",
    teamSize: "2-4",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
    glowColor: "rgba(59, 130, 246, 0.4)"
  },
  {
    id: 2,
    title: "Brand Battles",
    icon: Megaphone,
    description: "Design campaigns, logos, and pitches. Encourages students to think outside the box.",
    teamSize: "2-4",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-500",
    glowColor: "rgba(168, 85, 247, 0.4)"
  },
  {
    id: 3,
    title: "Young Innovators",
    icon: Lightbulb,
    description: "A challenge where students present original solutions and believe in the power of their ideas.",
    teamSize: "2-4",
    iconBg: "bg-green-100",
    iconColor: "text-green-500",
    glowColor: "rgba(34, 197, 94, 0.4)"
  },
  {
    id: 4,
    title: "Echoes",
    icon: MessageSquare,
    description: "Structured debates that sharpen logic, articulation, and leadership.",
    teamSize: "2-4",
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
    glowColor: "rgba(239, 68, 68, 0.4)"
  }
];

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
}

const FourPillars: React.FC = () => {
  return (
    <section className="relative py-28 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0 opacity-50">
        <motion.div 
          className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_5%_15%,_rgba(250,204,21,0.2)_0%,_rgba(250,204,21,0)_25%)]"
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 30, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_95%_85%,_rgba(253,224,71,0.15)_0%,_rgba(253,224,71,0)_20%)]"
           animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 35, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
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
                Bid. Battle. Believe.
             </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The four pillars that define the InnovateX25 experience.
          </p>
        </motion.div>
        
        <motion.div 
            className="grid md:grid-cols-2 xl:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
          {pillars.map((pillar) => (
            <PillarCard key={pillar.id} pillar={pillar} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// --- Reusable Pillar Card Component ---

interface PillarCardProps {
  pillar: {
    id: number;
    title: string;
    icon: React.ElementType;
    description: string;
    teamSize: string;
    iconBg: string;
    iconColor: string;
    glowColor: string;
  };
}

const PillarCard: React.FC<PillarCardProps> = ({ pillar }) => {
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

  const IconComponent = pillar.icon;

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
        className="relative bg-white/50 backdrop-blur-md rounded-2xl border border-gray-200/80 shadow-lg"
    >
      <div className="p-6" style={{ transform: "translateZ(40px)"}}>
        <div className="mb-5 text-center">
            <motion.div 
                className={`inline-block p-4 rounded-full border border-gray-200 ${pillar.iconBg}`}
                style={{ boxShadow: `0 0 20px 5px ${pillar.glowColor}` }}
                whileHover={{ scale: 1.1, rotate: 10 }}
            >
                <IconComponent className={`h-10 w-10 ${pillar.iconColor}`} />
            </motion.div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
          {pillar.title}
        </h3>
        <p className="text-gray-600 leading-relaxed text-sm mb-4 text-center">
          {pillar.description}
        </p>
        <div className="bg-yellow-100/50 border border-yellow-200/80 rounded-lg p-3 mt-4">
          <p className="text-sm font-bold text-yellow-800 text-center">
            Team Size: {pillar.teamSize}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default FourPillars;
