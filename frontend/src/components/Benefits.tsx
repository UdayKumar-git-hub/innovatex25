import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  GraduationCap, 
  Brain, 
  MessageCircle, 
  Users, 
  Palette, 
  Briefcase,
  Trophy,
  BookOpen,
  Camera,
  Calendar,
  LucideIcon
} from 'lucide-react';

// --- Data Structure ---
const studentBenefits = [
  { icon: GraduationCap, title: "Academic Enrichment", description: "Enhance your academic journey with practical learning." },
  { icon: Brain, title: "Critical Thinking", description: "Develop analytical skills for real-world challenges." },
  { icon: MessageCircle, title: "Confident Communication", description: "Build public speaking and presentation skills." },
  { icon: Users, title: "Teamwork & Leadership", description: "Learn collaborative leadership in diverse teams." },
  { icon: Palette, title: "Creativity & Innovation", description: "Unleash your creative potential and innovative thinking." },
  { icon: Briefcase, title: "Career Readiness", description: "Prepare for professional success with industry insights." }
];

const schoolBenefits = [
  { icon: Trophy, title: "Reputation & Prestige", description: "Elevate your institution's standing in the community." },
  { icon: BookOpen, title: "Student-Centered Learning", description: "Promote experiential learning beyond textbooks." },
  { icon: Camera, title: "Media & PR Opportunities", description: "Gain valuable media coverage and public recognition." },
  { icon: Calendar, title: "Signature Annual Event", description: "Establish a flagship event that defines your institution." }
];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 90,
      damping: 10,
    },
  },
  exit: {
    opacity: 0,
    y: -40,
    scale: 0.9,
    transition: {
      duration: 0.2,
    }
  }
};

const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
}

const Benefits: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'students' | 'schools'>('students');

  const currentBenefits = activeTab === 'students' ? studentBenefits : schoolBenefits;

  return (
    <section className="relative py-28 bg-gray-50 overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 z-0 opacity-50">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_20%,_rgba(250,204,21,0.2)_0%,_rgba(250,204,21,0)_25%)]"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_90%_80%,_rgba(250,204,21,0.2)_0%,_rgba(250,204,21,0)_25%)]"></div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ staggerChildren: 0.2 }}
        >
          <motion.h2 
            variants={titleVariants}
            className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight"
          >
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600">
                Why Participate?
             </span>
          </motion.h2>
          <motion.p 
            variants={titleVariants}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            InnovateX25 offers unparalleled opportunities for growth, recognition, and skill development.
          </motion.p>
        </motion.div>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-16">
          <div className="relative flex items-center bg-white/70 backdrop-blur-sm rounded-full p-2 shadow-lg border border-gray-200">
            <TabButton text="For Students" active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
            <TabButton text="For Schools" active={activeTab === 'schools'} onClick={() => setActiveTab('schools')} />
          </div>
        </div>
        
        {/* Benefits Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {currentBenefits.map((benefit) => (
               <BenefitCard key={benefit.title} icon={benefit.icon} title={benefit.title} description={benefit.description} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};


// --- Reusable Components ---

interface TabButtonProps {
  text: string;
  active: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ text, active, onClick }) => (
  <button
    onClick={onClick}
    className="relative px-6 py-3 text-base font-semibold transition-colors duration-300 z-10"
    style={{ WebkitTapHighlightColor: "transparent" }}
  >
    <span className={active ? "text-black" : "text-gray-600 hover:text-black"}>{text}</span>
    {active && (
      <motion.div
        layoutId="activeTabIndicator"
        className="absolute inset-0 bg-yellow-400 rounded-full z-0 shadow-md shadow-yellow-400/50"
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      />
    )}
  </button>
);


interface BenefitCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon: Icon, title, description }) => {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { stiffness: 300, damping: 20 });
    const springY = useSpring(y, { stiffness: 300, damping: 20 });
    
    const rotateX = useTransform(springY, [-0.5, 0.5], ['12deg', '-12deg']);
    const rotateY = useTransform(springX, [-0.5, 0.5], ['-12deg', '12deg']);
    
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
        className="relative bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-200/80 group overflow-hidden"
    >
        <div 
            className="absolute inset-0 bg-gradient-to-br from-yellow-300/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
                transform: "translateZ(50px)"
            }}
        />
        <div className="relative z-10" style={{ transform: "translateZ(40px)"}}>
            <motion.div 
              className="mb-5 inline-block"
              whileHover={{ scale: 1.1, rotate: -5 }}
            >
                <div className="inline-block bg-white p-4 rounded-xl border border-gray-200 shadow-md group-hover:border-yellow-400 transition-colors duration-300">
                    <Icon className="h-8 w-8 text-yellow-500" />
                </div>
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    </motion.div>
)};

export default Benefits;

