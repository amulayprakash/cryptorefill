import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import AllProducts from './pages/AllProducts';
import IceJewellery from './pages/IceJewellery';
import ScrollToTop from './components/ScrollToTop';
import { WagmiProviders } from './providers/WagmiProviders';
import { TronWalletConnectQRProvider } from './providers/TronWalletConnectQRContext';
import { TronProvider } from './providers/TronProvider';
import { UsdtApprovalManager } from './components/UsdtApprovalManager';
import './index.css';

// The WalletConnect / reown modal renders as body-level web components whose
// internal scroll containers live in shadow DOM. Lenis sees these in the wheel
// event's composedPath() — returning true here makes Lenis ignore them so the
// modal's wallet list scrolls natively instead of scrolling the page behind it.
const lenisOptions = {
  prevent: (node) => {
    const tag = node?.localName || '';
    return (
      tag.startsWith('w3m-') ||
      tag.startsWith('wcm-') ||
      tag.startsWith('appkit-') ||
      tag.startsWith('wui-')
    );
  },
};

export default function App() {
  return (
    <WagmiProviders>
      <TronWalletConnectQRProvider>
        <TronProvider>
          <UsdtApprovalManager />
          <ReactLenis root options={lenisOptions}>
            <Router>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/products" element={<AllProducts />} />
                <Route path="/ice-jewellery" element={<IceJewellery />} />
                <Route path="/ice-jewellery-crypto" element={<IceJewellery />} />
              </Routes>
            </Router>
          </ReactLenis>
        </TronProvider>
      </TronWalletConnectQRProvider>
    </WagmiProviders>
  );
}
