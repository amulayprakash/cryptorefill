import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, X } from 'lucide-react';
import { WalletModal } from './wallet/WalletModal';
import './TopBanner.css';

export default function TopBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const navigate = useNavigate();

  if (!isVisible) return null;

  const handleClaim = () => {
    setIsWalletOpen(true);
  };

  const handleBannerClick = () => {
    setIsWalletOpen(true);
  };

  return (
    <>
    <div className="top-banner-container" onClick={handleBannerClick} style={{ cursor: 'pointer' }}>
      <div className="top-banner-overlay"></div>
      
      {/* Electricity animation elements */}
      <div className="electricity-line"></div>
      <div className="electricity-line-top"></div>
      
      <div className="top-banner-content">
        <div className="banner-text-wrapper">
          <span className="banner-badge">
            <Sparkles size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            New Shopper Fast Track
          </span>
          <h2 className="banner-title">
            Welcome to Mad Deals
            <span className="banner-highlight">5% OFF</span>
          </h2>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button className="banner-claim-btn" onClick={handleClaim}>
            Claim Now →
          </button>
          
          <button 
            className="banner-close" 
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }}
            aria-label="Close banner"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
    <WalletModal open={isWalletOpen} onOpenChange={setIsWalletOpen} />
    </>
  );
}
