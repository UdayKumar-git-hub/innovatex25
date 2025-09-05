import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

// --- Navigation Data ---
const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'IPL Auction', href: '/ipl' },
  { name: 'Brand Battles', href: '/brand-battles' },
  { name: 'Innovators', href: '/innovators' },
  { name: 'Echoes', href: '/echoes' },
  { name: 'Itinerary', href: '/itinerary' },
  { name: 'Rules', href: '/rules' },
  { name: 'T&C', href: '/terms' },
  { name: 'Documentation', href: '/doc' },
];

// --- Reusable Components ---
const AnimatedLogo: React.FC = () => (
  <div className="flex flex-col items-start">
    <span className="text-xs text-gray-500 tracking-wider">reelhaus.hyd presents</span>
    <Link to="/" className="text-3xl font-extrabold relative overflow-hidden">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 drop-shadow-md">
        InnovateX25
      </span>
      <motion.div
        className="absolute top-0 left-0 h-full w-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)]"
        initial={{ x: "-100%" }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </Link>
  </div>
);

const MagneticButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold px-8 py-3 rounded-full transition-transform duration-300 w-full md:w-auto shadow-lg overflow-hidden"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      Register Now!
      <motion.div
        className="absolute inset-0 rounded-full -z-10"
        style={{
          background: "radial-gradient(circle, rgba(250,204,21,0.7) 0%, rgba(250,204,21,0) 70%)",
          filter: "blur(20px)"
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: isHovered ? 1.2 : 0, opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.35 }}
      />
    </motion.button>
  );
};

const DesktopNav: React.FC = () => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const location = useLocation();

  return (
    <nav onMouseLeave={() => setHoveredLink(null)} className="hidden md:flex items-center gap-8">
      {navLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          onClick={(e) => { e.preventDefault(); window.location.href = link.href; }}
          onMouseEnter={() => setHoveredLink(link.name)}
          className={`font-semibold relative py-2 transition-colors hover:text-black text-sm tracking-wide ${location.pathname === link.href ? 'text-yellow-600' : 'text-gray-700'}`}
        >
          {link.name}
          {(hoveredLink === link.name || location.pathname === link.href) && (
            <motion.div
              layoutId="underline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500 rounded"
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            />
          )}
        </a>
      ))}
    </nav>
  );
};

const MobileMenu: React.FC<{ isOpen: boolean; setIsOpen: (isOpen: boolean) => void }> = ({ isOpen, setIsOpen }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-yellow-50 via-white to-gray-100/95 backdrop-blur-xl z-40 md:hidden pt-20"
      >
        <nav className="flex flex-col items-center justify-center h-full space-y-8">
          {navLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-bold text-gray-800 hover:text-yellow-600 transition-colors"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {link.name}
            </motion.a>
          ))}
          <MagneticButton />
        </nav>
      </motion.div>
    )}
  </AnimatePresence>
);

// --- Main Header Component ---
const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
      setIsOpen(false);
    } else {
      setHidden(false);
    }
    setIsScrolled(latest > 50);
  });

  return (
    <>
      <motion.header
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed top-0 left-0 w-full z-50"
      >
        <motion.div
          className="backdrop-blur-lg border-b border-gray-200/60"
          animate={{
            backgroundColor: isScrolled
              ? 'rgba(255,255,255,0.85)'
              : 'rgba(255,255,255,1)'
          }}
          transition={{ duration: 0.35 }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex justify-between items-center h-20">
              <AnimatedLogo />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <DesktopNav />
              </div>
              <div className="hidden md:block">
                <MagneticButton />
              </div>
              <motion.button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 z-50">
                <motion.div
                  className="w-6 h-0.5 bg-gray-800 my-1 rounded"
                  animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                />
                <motion.div
                  className="w-6 h-0.5 bg-gray-800 my-1 rounded"
                  animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                />
                <motion.div
                  className="w-6 h-0.5 bg-gray-800 my-1 rounded"
                  animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.header>
      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Header;
