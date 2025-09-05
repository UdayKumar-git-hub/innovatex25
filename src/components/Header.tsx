import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { HashRouter as Router, Link, useLocation } from 'react-router-dom';

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
    <Link to="/" className="flex flex-col items-start flex-shrink-0">
        <span className="text-xs text-gray-500 tracking-wider">reelhaus.hyd presents</span>
        <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600">
            InnovateX25
        </span>
    </Link>
);

// --- Desktop Navigation Component ---
const DesktopNav = () => {
    const [hoveredLink, setHoveredLink] = useState(null);
    const location = useLocation();

    return (
        <nav className="hidden md:flex items-center gap-8" onMouseLeave={() => setHoveredLink(null)}>
            {navLinks.map((link) => (
                <Link
                    key={link.name}
                    to={link.href}
                    onMouseEnter={() => setHoveredLink(link.name)}
                    className={`font-semibold relative py-2 transition-colors duration-300 text-sm tracking-wide whitespace-nowrap ${
                        location.pathname === link.href ? "text-yellow-600" : "text-gray-700 hover:text-black"
                    }`}
                >
                    {link.name}
                    {(hoveredLink === link.name || location.pathname === link.href) && (
                        <motion.div
                            layoutId="underline"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500 rounded"
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        />
                    )}
                </Link>
            ))}
        </nav>
    );
};

// --- Mobile Menu Drawer ---
const MobileMenu = ({ isOpen, setIsOpen }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-white/90 backdrop-blur-lg z-40 md:hidden pt-20"
            >
                <nav className="flex flex-col items-center justify-center h-full space-y-10">
                    {navLinks.map((link, index) => (
                        <motion.div
                            key={link.name}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                             <Link
                                to={link.href}
                                onClick={() => setIsOpen(false)}
                                className="text-2xl font-extrabold text-gray-800 hover:text-yellow-600 transition-colors"
                            >
                                {link.name}
                            </Link>
                        </motion.div>
                    ))}
                </nav>
            </motion.div>
        )}
    </AnimatePresence>
);

// --- Main Header Component ---
const Header = () => {
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
                    className="backdrop-blur-lg border-b border-gray-200/60 shadow-sm"
                    animate={{ backgroundColor: isScrolled ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,1)" }}
                    transition={{ duration: 0.35 }}
                >
                    <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
                        <div className="flex justify-between items-center h-20">
                            {/* Left: Logo */}
                            <AnimatedLogo />

                            {/* Right: Desktop Navigation */}
                            <DesktopNav />

                            {/* Right: Mobile Menu Toggle */}
                            <div className="md:hidden">
                                <motion.button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="p-2 z-50 rounded-lg bg-white/70 shadow-sm backdrop-blur hover:bg-white transition"
                                >
                                    <motion.div className="w-6 h-0.5 bg-gray-800 my-1 rounded" animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} />
                                    <motion.div className="w-6 h-0.5 bg-gray-800 my-1 rounded" animate={isOpen ? { opacity: 0 } : { opacity: 1 }} />
                                    <motion.div className="w-6 h-0.5 bg-gray-800 my-1 rounded" animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.header>

            {/* Mobile Menu Component */}
            <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    );
};


// --- Main App Component (for demonstration) ---
export default function App() {
    return (
        <Router>
            <div className="bg-gray-50 text-gray-800 font-sans">
                <Header />
                <main className="pt-24 min-h-screen">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h1 className="text-5xl font-bold mt-12 mb-4">Header Component</h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Scroll down to see the header hide and reappear.
                        </p>
                        <div className="h-[200vh] bg-gray-100 rounded-lg p-8 flex items-start justify-center">
                           <p className="text-gray-400">Page Content Area</p>
                        </div>
                    </div>
                </main>
            </div>
        </Router>
    );
}


