import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import FourPillars from '../components/FourPillars';
import Benefits from '../components/Benefits';
import Schedule from '../components/Schedule';
import Perks from '../components/Perks';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <About />
      <FourPillars />
      <Benefits />
      <Schedule />
      <Perks />
      <Footer />
    </div>
  );
};

export default Home;