import React from 'react';
// The only change is here: using BrowserRouter for cleaner URLs
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Home from './pages/Home';
import IPL from './pages/IPL';
import BrandBattles from './pages/BrandBattles';
import Innovators from './pages/Innovators';
import Echoes from './pages/Echoes';
import Itinerary from './pages/Itinerary';
import Rules from './pages/Rules';
import Terms from './pages/Terms';
import Book from './pages/Book';
import Register from './pages/Register';
import Success from './pages/Success';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ipl" element={<IPL />} />
        <Route path="/brand-battles" element={<BrandBattles />} />
        <Route path="/innovators" element={<Innovators />} />
        <Route path="/echoes" element={<Echoes />} />
        <Route path="/itinerary" element={<Itinerary />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/doc" element={<Book />} />
        <Route path="/register" element={<Register />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
}

export default App;