import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Phone, Mail, Instagram } from 'lucide-react';

// --- Animation Variants ---
const footerVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1], // Quintic Out
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-black text-white py-24 overflow-hidden" style={{ perspective: '1000px' }}>
      {/* Animated Aurora Background */}
      <div className="absolute inset-0 z-0 opacity-50">
        <motion.div 
          className="absolute top-0 left-0 w-[150%] h-[150%] bg-[radial-gradient(circle_at_20%_30%,_rgba(250,204,21,0.2)_0%,_rgba(250,204,21,0)_25%)]"
          animate={{ x: ['-20%', '20%'], y: ['-20%', '20%'] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-[150%] h-[150%] bg-[radial-gradient(circle_at_80%_70%,_rgba(253,224,71,0.15)_0%,_rgba(253,224,71,0)_20%)]"
          animate={{ x: ['20%', '-20%'], y: ['20%', '-20%'] }}
          transition={{ duration: 25, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        variants={footerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <motion.div 
          className="grid lg:grid-cols-3 gap-12"
          style={{ transform: 'rotateX(10deg)' }}
        >
          {/* Brand Section */}
          <motion.div className="lg:col-span-1" variants={itemVariants}>
            <div className="mb-6">
              <h3 className="text-5xl font-extrabold text-white mb-2 relative">
                <ShimmeringText text="InnovateX25" />
              </h3>
              <p className="text-yellow-400 font-semibold text-lg">An event by Reelhaus Hyd</p>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Unleashing the X-Factor through strategy, creativity, and belief in transformative ideas.
            </p>
          </motion.div>
          
          {/* Contact Section */}
          <motion.div className="lg:col-span-1" variants={itemVariants}>
             <h4 className="text-2xl font-bold mb-6 text-yellow-400">Get in Touch</h4>
            <div className="space-y-5">
              <ContactItem icon={<Phone size={22} />} text="+91 9392449721 / +91 9110387918" />
              <ContactItem icon={<Mail size={22} />} text="reelhaus.hyd@gmail.com" />
              <ContactItem icon={<Instagram size={22} />} text="@reelhaus.hyd" href="https://instagram.com/reelhaus.hyd" />
            </div>
          </motion.div>
          
          {/* CTA Section */}
          <motion.div className="lg:col-span-1" variants={itemVariants}>
            <h4 className="text-2xl font-bold mb-6 text-yellow-400">Ready to Innovate?</h4>
            <p className="text-gray-300 mb-6">
              Don't miss out. Showcase your skills and connect with fellow innovators.
              <a href="/register">Register Now</a>
            <MagneticButton />
          </motion.div>
        </motion.div>
        
        {/* Bottom Bar */}
        <motion.div 
          className="mt-20 pt-8 border-t border-gray-800 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <p className="text-gray-400">
            © {new Date().getFullYear()} InnovateX25. Presented by Reelhaus Hyd. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
};

// --- Reusable Sub-Components ---

const ShimmeringText: React.FC<{ text: string }> = ({ text }) => (
    <>
      {text}
      <motion.span
        className="absolute inset-0 w-full h-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)]"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: 'linear' }}
      />
    </>
);

const MagneticButton: React.FC = () => {
      }
    const ref = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 150, damping: 20, mass: 0.1 });
    const springY = useSpring(y, { stiffness: 150, damping: 20, mass: 0.1 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const diffX = e.clientX - rect.left - rect.width / 2;
        const diffY = e.clientY - rect.top - rect.height / 2;
        x.set(diffX);
        y.set(diffY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.a
            href="/register"
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: springX, y: springY }}
            className="bg-yellow-400 text-black font-bold px-8 py-4 rounded-lg transition-shadow duration-300 relative inline-block"
            whileHover={{ 
                scale: 1.05,
                boxShadow: "0px 0px 40px rgba(250, 204, 21, 0.9)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
            Register Now!
        </motion.a>
    )
  )
}

interface ContactItemProps {
    icon: React.ReactNode;
    text: string;
    href?: string;
}

const ContactItem: React.FC<ContactItemProps> = ({ icon, text, href }) => {
    const Component = href ? 'a' : 'div';
    
    return (
        <motion.div
            className="flex items-center group"
            whileHover={{ x: 10 }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <motion.div
                className="bg-gray-800 p-3 rounded-full mr-4 border border-yellow-500/30 group-hover:border-yellow-400 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(250,204,21,0.5)]"
                whileHover={{ scale: 1.15, rotate: -10 }}
            >
                <div className="text-yellow-400">{icon}</div>
            </motion.div>
            <Component
              href={href}
              target={href ? "_blank" : undefined}
              rel={href ? "noopener noreferrer" : undefined}
              className={`text-gray-200 text-lg ${href ? 'hover:text-yellow-300' : ''} transition-colors duration-300`}
            >
                {text}
            </Component>
        </motion.div>
    )
}

export default Footer;

