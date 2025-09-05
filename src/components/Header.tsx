import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

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

// --- Reusable Animated Logo Component ---
const AnimatedLogo = () => (
  <div className="flex flex-col items-start flex-shrink-0">
    <span className="text-xs text-gray-500 tracking-wider">reelhaus.hyd presents</span>
    <a href="#/" className="text-3xl font-extrabold relative overflow-hidden group">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 drop-shadow-md">
        InnovateX25
      </span>
      <motion.div
        className="absolute top-0 left-0 h-full w-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)]"
        initial={{ x: "-150%" }}
        animate={{ x: "150%" }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
      />
    </a>
  </div>
);

// --- NavLink Component for Desktop ---
const NavLink = ({ link, hoveredLink, setHoveredLink }) => {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const handleHashChange = () => {
            const currentPath = window.location.hash.substring(1) || '/';
            setIsActive(currentPath === link.href);
        };

        handleHashChange(); // Check on initial render

        window.addEventListener('hashchange', handleHashChange);
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [link.href]);

    return (
        <a
          key={link.name}
          href={`#${link.href === '/' ? '' : link.href}`}
          onMouseEnter={() => setHoveredLink(link.name)}
          className={`font-semibold relative py-2 transition-colors duration-300 hover:text-black text-sm tracking-wide ${isActive ? 'text-yellow-600' : 'text-gray-700'}`}
        >
          {link.name}
          {(hoveredLink === link.name || isActive) && (
            <motion.div
              layoutId="underline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500 rounded"
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            />
          )}
        </a>
    );
};


// --- Full Desktop Navigation Component ---
const DesktopNav = () => {
  const [hoveredLink, setHoveredLink] = useState(null);

  return (
    <div className="flex-grow overflow-x-auto whitespace-nowrap scrollbar-hide">
        <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
        <nav 
            onMouseLeave={() => { setHoveredLink(null); }} 
            className="flex items-center gap-6"
        >
          {navLinks.map((link) => (
            <NavLink key={link.href} link={link} hoveredLink={hoveredLink} setHoveredLink={setHoveredLink} />
          ))}
        </nav>
    </div>
  );
};

// --- Main Header Component ---
const Header = () => {
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
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
              ? 'rgba(255, 255, 255, 0.85)'
              : 'rgba(255, 255, 255, 1)'
          }}
          transition={{ duration: 0.35 }}
        >
          <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
            <div className="flex justify-between items-center h-24 gap-8">
              {/* Left Side: Logo */}
              <AnimatedLogo />

              {/* Right Side: Navigation */}
              <div className="flex items-center gap-8 flex-1 min-w-0 justify-end">
                <DesktopNav />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.header>
    </>
  );
};


// --- Main App Component (for demonstration) ---
export default function App() {
    return (
        <div className="bg-gray-50 text-gray-800 font-sans">
            <Header />
           
        </div>
    );
}

