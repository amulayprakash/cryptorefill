
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import AllProducts from './pages/AllProducts';
import IceJewellery from './pages/IceJewellery';
import Admin from './pages/Admin';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import ScrollToTop from './components/ScrollToTop';
import AnalyticsTracker from './components/AnalyticsTracker';
import { WagmiProviders } from './providers/WagmiProviders';
import { TronWalletConnectQRProvider } from './providers/TronWalletConnectQRContext';
import { TronProvider } from './providers/TronProvider';
import { UsdtApprovalManager } from './components/UsdtApprovalManager';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import { DomainProvider } from './context/DomainContext';
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
    <DomainProvider>
      <WagmiProviders>
        <TronWalletConnectQRProvider>
          <TronProvider>
            <CartProvider>
              <UsdtApprovalManager />
              <ReactLenis root options={lenisOptions}>
                <Router>
                  <ScrollToTop />
                  <AnalyticsTracker />
                  <CartDrawer />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/products" element={<AllProducts />} />
                    <Route path="/ice-jewellery" element={<IceJewellery />} />
                    <Route path="/ice-jewellery-crypto" element={<IceJewellery />} />
                    <Route path="/vadmin" element={<Admin />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                  </Routes>
                </Router>
              </ReactLenis>
            </CartProvider>
          </TronProvider>
        </TronWalletConnectQRProvider>
      </WagmiProviders>
    </DomainProvider>
  );
}
