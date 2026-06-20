import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import AllProducts from './pages/AllProducts';
import ScrollToTop from './components/ScrollToTop';
import './index.css';

export default function App() {
  return (
    <ReactLenis root>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/products" element={<AllProducts />} />
        </Routes>
      </Router>
    </ReactLenis>
  );
}
