import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Floating sparkle particle
function Sparkle({ style }) {
  return (
    <span
      aria-hidden="true"
      style={style}
      className="ice-sparkle absolute pointer-events-none select-none text-[#C5A059]/60 opacity-0"
    >
      ✦
    </span>
  );
}

export default function IceJewelleryCryptoHero() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const dealBadges = [
    { icon: "💎", label: "Premium Collection" },
    { icon: "⚡", label: "Safe Delivery" },
    { icon: "₿", label: "Crypto accepted" },
  ];

  const categories = [
    { icon: "⛓️", name: "Chains", price: "From $129" },
    { icon: "💍", name: "Rings", price: "From $79" },
    { icon: "📿", name: "Pendants", price: "From $89" },
    { icon: "⌚", name: "Bracelets", price: "From $99" },
  ];

  const sparklePositions = [
    { top: "12%", left: "6%", fontSize: "10px", animationDelay: "0s" },
    { top: "28%", left: "18%", fontSize: "7px", animationDelay: "0.4s" },
    { top: "58%", left: "10%", fontSize: "12px", animationDelay: "0.8s" },
    { top: "78%", left: "22%", fontSize: "8px", animationDelay: "0.3s" },
    { top: "14%", right: "14%", fontSize: "11px", animationDelay: "0.6s" },
    { top: "38%", right: "8%", fontSize: "8px", animationDelay: "1.1s" },
    { top: "68%", right: "18%", fontSize: "13px", animationDelay: "0.2s" },
    { top: "82%", right: "10%", fontSize: "9px", animationDelay: "0.7s" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,650;1,400&display=swap');

        .luxury-serif {
          font-family: 'Cormorant Garamond', 'Playfair Display', serif;
        }

        @keyframes iceFadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes iceSparkle {
          0%   { opacity: 0; transform: scale(0.5) rotate(0deg); }
          40%  { opacity: 0.8; transform: scale(1.3) rotate(25deg); }
          70%  { opacity: 0.5; transform: scale(1) rotate(-15deg); }
          100% { opacity: 0; transform: scale(0.3) rotate(40deg); }
        }
        @keyframes iceShine {
          0%   { left: -60%; }
          100% { left: 130%; }
        }
        @keyframes iceFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes icePulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(197, 160, 89, 0.25); }
          50%       { box-shadow: 0 0 0 8px rgba(197, 160, 89, 0); }
        }
        @keyframes iceBadgeIn {
          from { opacity: 0; transform: scale(0.96) translateY(6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .ice-hero-section {
          animation: iceFadeIn 0.8s ease both;
        }
        .ice-sparkle {
          animation: iceSparkle 3.2s ease-in-out infinite;
        }
        .ice-shine-bar::after {
          content: '';
          position: absolute;
          top: 0; bottom: 0;
          width: 50%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: iceShine 3s ease-in-out infinite;
        }
        .ice-float {
          animation: iceFloat 6.5s ease-in-out infinite;
        }
        .ice-badge-cta {
          animation: icePulseGlow 2.5s ease-in-out infinite;
        }
        .ice-badge-in {
          animation: iceBadgeIn 0.6s ease both;
        }
        .ice-cat-card {
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .ice-cat-card:hover {
          transform: translateY(-3px) scale(1.015);
          box-shadow: 0 12px 30px -10px rgba(197, 160, 89, 0.12), 0 0 15px rgba(197, 160, 89, 0.05);
        }
        .ice-btn-primary {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .ice-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(197, 160, 89, 0.3);
        }
        .ice-btn-secondary {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .ice-btn-secondary:hover {
          transform: translateY(-2px);
          background-color: rgba(255, 255, 255, 0.8);
          border-color: #C5A059;
        }
      `}</style>

      <section
        aria-label="Ice Jewellery Crypto — Premium Storefront"
        className="ice-hero-section relative w-full overflow-hidden border-b border-stone-200/50 bg-[#FAF8F4]"
        style={{ minHeight: "480px" }}
      >
        {/* Soft, premium champagne-gold ambient glows */}
        <div
          aria-hidden="true"
          className="absolute -top-[150px] -left-[120px] w-[500px] h-[500px] rounded-full pointer-events-none opacity-40 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(197,160,89,0.07) 0%, transparent 70%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute top-[15%] -right-[100px] w-[450px] h-[450px] rounded-full pointer-events-none opacity-30 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, transparent 60%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute bottom-[-120px] left-[35%] w-[480px] h-[480px] rounded-full pointer-events-none opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)",
          }}
        />

        {/* Floating Sparkles */}
        {sparklePositions.map((pos, i) => (
          <Sparkle
            key={i}
            style={{
              ...pos,
              animationDelay: pos.animationDelay,
              animationDuration: `${2.6 + i * 0.2}s`,
            }}
          />
        ))}

        {/* Content Grid */}
        <div
          className="relative mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 px-4 sm:px-6 py-12 sm:py-16 lg:py-20 z-10"
          style={{ maxWidth: "1280px" }}
        >
          {/* Left Side: Editorial Typography & Actions */}
          <div className="flex flex-col items-start w-full lg:w-[53%]">
            {/* Elegant Luxury Badge */}
            <div
              className="ice-badge-in flex items-center gap-2 mb-5 rounded-full px-3.5 py-1 text-[10px] font-bold tracking-[0.25em] uppercase bg-white border border-stone-200 text-[#C5A059] shadow-2xs"
              style={{ animationDelay: "0.05s" }}
            >
              <span className="text-[8px] text-[#C5A059]">✦</span> Ice Boutique
            </div>

            {/* Editorial-style Headline */}
            <h2 className="luxury-serif text-4xl sm:text-5xl lg:text-6xl font-light text-stone-900 leading-[1.12] tracking-tight mb-5">
              Luxury Pieces.
              <br />
              Paid in{" "}
              <span className="font-semibold bg-gradient-to-r from-[#B48F47] via-[#D4AF37] to-[#B48F47] bg-clip-text text-transparent">
                Crypto.
              </span>
            </h2>

            {/* Premium refined subtext */}
            <p className="text-sm sm:text-base font-normal text-stone-600 leading-relaxed mb-8 max-w-lg">
              Secure premium iced-out Cuban links, diamond engagement rings, custom pendants, and elite watches seamlessly. Transact securely using Bitcoin, Ethereum, Solana, and major stablecoins.
            </p>

            {/* Deal highlights row */}
            <div className="flex flex-wrap gap-2.5 mb-9">
              {dealBadges.map((b, i) => (
                <span
                  key={b.label}
                  className="ice-badge-in flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold bg-white border border-stone-200/60 text-stone-700 shadow-3xs"
                  style={{ animationDelay: `${0.1 + i * 0.08}s` }}
                >
                  <span className="opacity-90">{b.icon}</span>
                  {b.label}
                </span>
              ))}
            </div>

            {/* Actions Buttons with Champagne-gold Styling */}
            <div className="flex flex-row gap-3.5 mb-8 w-full sm:w-auto">
              <button
                id="ice-jewelry-shop-now-cta"
                aria-label="Shop Ice Collection"
                className="ice-btn-primary ice-badge-cta relative overflow-hidden flex items-center justify-center gap-2 rounded-xl px-7 sm:px-9 py-3.5 text-sm sm:text-base font-extrabold text-stone-950 cursor-pointer bg-gradient-to-r from-[#C5A059] via-[#E2C99B] to-[#C5A059] hover:from-[#B48F47] hover:to-[#C5A059] flex-1 sm:flex-none border border-transparent shadow-md shadow-[#C5A059]/20"
                onClick={() => navigate("/ice-jewellery")}
              >
                <span>💎</span>
                Shop Collection
              </button>

              <button
                id="ice-jewelry-crypto-cta"
                aria-label="Buy with Crypto"
                className="ice-btn-secondary flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm sm:text-base font-bold text-stone-800 cursor-pointer bg-white/40 border border-stone-300 hover:border-stone-400 flex-1 sm:flex-none shadow-2xs"
                onClick={() => navigate("/ice-jewellery")}
              >
                Buy with Crypto
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4.5 w-4.5 text-stone-500 transition-transform group-hover:translate-x-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-bold tracking-wider text-stone-500 uppercase">
              <span className="flex items-center gap-1.5">
                <span className="text-[#C5A059]">✓</span> Safe Delivery
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[#C5A059]">✓</span> 100% Secure
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[#C5A059]">✓</span> No KYC Required
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[#C5A059]">★★★★★</span> 4.9/5 Rating
              </span>
            </div>
          </div>

          {/* Right Side: Layered Showcase & Display Case Category Grid */}
          <div className="relative flex flex-col items-center w-full lg:w-[47%]">
            {/* Visual Showcase Card */}
            <div className="ice-float relative w-full max-w-[430px] rounded-2xl overflow-hidden shadow-xl border border-stone-200 bg-white">
              {/* Shine sweep overlay */}
              <div
                className="ice-shine-bar absolute inset-0 z-10 overflow-hidden rounded-2xl pointer-events-none"
                aria-hidden="true"
              />

              {/* Showcase Image */}
              <div className="relative h-[220px] w-full overflow-hidden bg-stone-50">
                <img
                  src="/assets/ice_jewellery/hero_showcase.png"
                  alt="Ice Jewellery Premium Showcase"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-103"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                  }}
                />

                {/* Floating Badges */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-stone-900 border border-[#C5A059]/25 text-[9px] uppercase tracking-widest font-black px-3 py-1 rounded-md shadow-xs z-20">
                  ✦ Exclusive Ice
                </div>

                <div className="absolute top-4 right-4 bg-[#C5A059] text-stone-950 text-[9px] uppercase tracking-widest font-extrabold px-2.5 py-1 rounded-md shadow-xs z-20">
                  40% OFF
                </div>
              </div>
            </div>

            {/* Display Case Category Grid */}
            <div className="grid grid-cols-2 gap-3 mt-4 w-full max-w-[430px]">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  id={`ice-quick-${cat.name.toLowerCase()}`}
                  aria-label={`Shop ${cat.name}`}
                  className="ice-cat-card flex items-center gap-3.5 rounded-xl p-3 bg-white/60 border border-stone-200/80 hover:border-[#C5A059]/40 cursor-pointer text-left backdrop-blur-md"
                  onClick={() => navigate("/ice-jewellery")}
                >
                  <span className="flex items-center justify-center rounded-lg bg-[#FAF8F4] border border-stone-200/70 w-9.5 h-9.5 text-lg shrink-0 text-[#C5A059]">
                    {cat.icon}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-stone-800 leading-tight truncate">
                      {cat.name}
                    </span>
                    <span className="text-[10px] font-semibold text-[#A47F37] mt-0.5">
                      {cat.price}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Accepted Payments Sub-Bar */}
            <div className="flex items-center justify-between w-full max-w-[430px] mt-5 px-1.5">
              <span className="text-[9px] font-black text-stone-400 uppercase tracking-[0.15em]">
                Accepted Payments
              </span>
              <div className="flex gap-3 text-xs font-semibold text-stone-500">
                <span className="flex items-center gap-0.5 hover:text-[#C5A059] transition-colors">₿ <span className="text-[9px] font-semibold text-stone-400">BTC</span></span>
                <span className="flex items-center gap-0.5 hover:text-[#C5A059] transition-colors">Ξ <span className="text-[9px] font-semibold text-stone-400">ETH</span></span>
                <span className="flex items-center gap-0.5 hover:text-[#C5A059] transition-colors">◎ <span className="text-[9px] font-semibold text-stone-400">SOL</span></span>
                <span className="flex items-center gap-0.5 hover:text-[#C5A059] transition-colors">● <span className="text-[9px] font-semibold text-stone-400">USDT</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Sleek section divider matching the next section */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden pointer-events-none z-1" aria-hidden="true">
          <svg
            viewBox="0 0 1440 28"
            preserveAspectRatio="none"
            style={{ width: "100%", height: "24px", display: "block" }}
          >
            <path
              d="M0,14 C360,28 1080,0 1440,14 L1440,28 L0,28 Z"
              className="fill-gray-50 dark:fill-gray-900"
            />
          </svg>
        </div>
      </section>
    </>
  );
}
