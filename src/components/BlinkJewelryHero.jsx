import React, { useState, useEffect } from "react";

// Floating sparkle particle
function Sparkle({ style }) {
  return (
    <span
      aria-hidden="true"
      style={style}
      className="blink-sparkle absolute pointer-events-none select-none text-yellow-300 opacity-0"
    >
      ✦
    </span>
  );
}

export default function BlinkJewelryHero() {
  const [shimmer, setShimmer] = useState(false);

  useEffect(() => {
    // Trigger shimmer animation on mount
    const t = setTimeout(() => setShimmer(true), 300);
    return () => clearTimeout(t);
  }, []);

  const dealBadges = [
    { icon: "💎", label: "Premium Collection" },
    { icon: "⚡", label: "Limited Time Deal" },
    { icon: "🏆", label: "Best Offers" },
  ];

  const jewels = [
    { icon: "💍", label: "Rings", sub: "Starting ₹999" },
    { icon: "📿", label: "Necklaces", sub: "Starting ₹1,499" },
    { icon: "✨", label: "Earrings", sub: "Starting ₹599" },
    { icon: "⌚", label: "Bracelets", sub: "Starting ₹799" },
  ];

  const sparklePositions = [
    { top: "12%", left: "8%", fontSize: "10px", animationDelay: "0s" },
    { top: "25%", left: "18%", fontSize: "8px", animationDelay: "0.4s" },
    { top: "55%", left: "5%", fontSize: "12px", animationDelay: "0.8s" },
    { top: "75%", left: "20%", fontSize: "7px", animationDelay: "0.3s" },
    { top: "10%", right: "15%", fontSize: "10px", animationDelay: "0.6s" },
    { top: "35%", right: "8%", fontSize: "8px", animationDelay: "1s" },
    { top: "70%", right: "18%", fontSize: "11px", animationDelay: "0.2s" },
    { top: "88%", right: "5%", fontSize: "7px", animationDelay: "0.7s" },
  ];

  return (
    <>
      {/* Inline styles for animations not covered by Tailwind */}
      <style>{`
        @keyframes blinkFadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blinkSparkle {
          0%   { opacity: 0; transform: scale(0.5) rotate(0deg); }
          40%  { opacity: 1; transform: scale(1.2) rotate(20deg); }
          70%  { opacity: 0.7; transform: scale(1) rotate(-10deg); }
          100% { opacity: 0; transform: scale(0.4) rotate(30deg); }
        }
        @keyframes blinkShine {
          0%   { left: -60%; }
          100% { left: 130%; }
        }
        @keyframes blinkFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes blinkPulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251,191,36,0.4); }
          50%       { box-shadow: 0 0 0 12px rgba(251,191,36,0); }
        }
        @keyframes blinkBadgeIn {
          from { opacity: 0; transform: scale(0.85) translateY(6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .blink-hero-section {
          animation: blinkFadeIn 0.7s ease both;
        }
        .blink-sparkle {
          animation: blinkSparkle 2.8s ease-in-out infinite;
        }
        .blink-shine-bar::after {
          content: '';
          position: absolute;
          top: 0; bottom: 0;
          width: 50%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          animation: blinkShine 2.4s ease-in-out infinite;
        }
        .blink-float {
          animation: blinkFloat 4s ease-in-out infinite;
        }
        .blink-float-slow {
          animation: blinkFloat 6s ease-in-out infinite;
        }
        .blink-badge-cta {
          animation: blinkPulseGlow 2s ease-in-out infinite;
        }
        .blink-badge-in {
          animation: blinkBadgeIn 0.5s ease both;
        }
        .blink-jewel-card:hover {
          transform: translateY(-4px) scale(1.04);
          box-shadow: 0 12px 32px rgba(0,0,0,0.18), 0 0 0 1.5px rgba(251,191,36,0.25);
        }
        .blink-jewel-card {
          transition: transform 0.28s ease, box-shadow 0.28s ease;
        }
        .blink-cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(17,24,39,0.35);
        }
        .blink-cta-primary {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .blink-cta-secondary:hover {
          background: rgba(255,255,255,0.14);
          transform: translateY(-2px);
        }
        .blink-cta-secondary {
          transition: background 0.2s ease, transform 0.2s ease;
        }
      `}</style>

      <section
        aria-label="Blink Jewelry — Featured Collection"
        className="blink-hero-section relative w-full overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0f0c29 0%, #1a1040 30%, #24243e 60%, #0f0c29 100%)",
          minHeight: "420px",
        }}
      >
        {/* Ambient glow blobs */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-80px",
            left: "-60px",
            width: "380px",
            height: "380px",
            background:
              "radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "-60px",
            right: "-40px",
            width: "320px",
            height: "320px",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "40%",
            left: "40%",
            width: "260px",
            height: "260px",
            background:
              "radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)",
            transform: "translate(-50%,-50%)",
            pointerEvents: "none",
          }}
        />

        {/* Floating sparkles */}
        {sparklePositions.map((pos, i) => (
          <Sparkle
            key={i}
            style={{
              ...pos,
              fontSize: pos.fontSize,
              animationDelay: pos.animationDelay,
              animationDuration: `${2.4 + i * 0.3}s`,
            }}
          />
        ))}

        {/* Main content grid */}
        <div
          className="relative mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 px-4 sm:px-6 py-8 sm:py-10 lg:py-12"
          style={{ maxWidth: "1280px" }}
        >
          {/* ─── LEFT: Copy + CTAs ─── */}
          <div className="flex flex-col items-start w-full lg:w-[52%] z-10">
            {/* Brand pill */}
            <div
              className="blink-badge-in flex items-center gap-2 mb-4 rounded-full px-3.5 py-1.5 text-xs font-bold tracking-widest uppercase"
              style={{
                background: "rgba(251,191,36,0.12)",
                border: "1px solid rgba(251,191,36,0.35)",
                color: "#fbbf24",
                animationDelay: "0.1s",
              }}
            >
              <span style={{ fontSize: "12px" }}>✦</span>
              Blink Jewelry — Exclusive Drop
            </div>

            {/* Headline */}
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-3"
              style={{
                color: "#ffffff",
                letterSpacing: "-0.5px",
                textShadow: "0 2px 24px rgba(0,0,0,0.5)",
              }}
            >
              Shine That{" "}
              <span
                style={{
                  background:
                    "linear-gradient(90deg, #fbbf24 0%, #f59e0b 40%, #fde68a 70%, #fbbf24 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Stands Out.
              </span>
            </h2>

            {/* Subheading */}
            <p
              className="text-sm sm:text-base font-medium mb-5 max-w-md"
              style={{ color: "rgba(255,255,255,0.72)", lineHeight: "1.65" }}
            >
              Exclusive jewelry deals you can't miss. Elegant pieces, premium
              craftsmanship —&nbsp;at prices that won't break the bank.
            </p>

            {/* Deal badges row */}
            <div className="flex flex-wrap gap-2 mb-6">
              {dealBadges.map((b, i) => (
                <span
                  key={b.label}
                  className="blink-badge-in flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] sm:text-xs font-semibold"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.16)",
                    color: "rgba(255,255,255,0.88)",
                    backdropFilter: "blur(6px)",
                    animationDelay: `${0.2 + i * 0.1}s`,
                  }}
                >
                  <span>{b.icon}</span>
                  {b.label}
                </span>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-row gap-3 mb-6 w-full sm:w-auto">
              <button
                id="blink-jewelry-shop-now"
                aria-label="Shop Blink Jewelry"
                className="blink-cta-primary blink-badge-cta flex items-center justify-center gap-2 rounded-xl px-5 sm:px-7 py-3 text-sm sm:text-base font-bold text-gray-900 cursor-pointer flex-1 sm:flex-none"
                style={{
                  background:
                    "linear-gradient(135deg, #fbbf24 0%, #f59e0b 60%, #d97706 100%)",
                  boxShadow: "0 4px 18px rgba(251,191,36,0.35)",
                  animationDelay: "0.4s",
                }}
              >
                <span>💎</span>
                Shop Blink Jewelry
              </button>

              <button
                id="blink-jewelry-view-deals"
                aria-label="View jewelry deals"
                className="blink-cta-secondary flex items-center justify-center gap-2 rounded-xl px-5 sm:px-6 py-3 text-sm sm:text-base font-semibold cursor-pointer flex-1 sm:flex-none"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  color: "#ffffff",
                  backdropFilter: "blur(6px)",
                }}
              >
                View All Deals
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
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

            {/* Trust strip */}
            <div
              className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] sm:text-xs font-medium"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              <span className="flex items-center gap-1">
                <span className="text-green-400">✓</span> Safe Delivery
              </span>
              <span className="flex items-center gap-1">
                <span className="text-green-400">✓</span> Pay with Crypto
              </span>
              <span className="flex items-center gap-1">
                <span className="text-green-400">✓</span> No KYC Required
              </span>
              <span className="flex items-center gap-1">
                <span className="text-yellow-400">★★★★★</span> Trusted by 50k+
              </span>
            </div>
          </div>

          {/* ─── RIGHT: Visual Jewelry Cards ─── */}
          <div
            className="relative flex flex-col items-center w-full lg:w-[48%] z-10"
            style={{ minHeight: "260px" }}
          >
            {/* Hero image + glow */}
            <div
              className="blink-float relative rounded-2xl overflow-hidden shadow-2xl w-full"
              style={{
                maxWidth: "420px",
                border: "1px solid rgba(251,191,36,0.2)",
                background: "rgba(15,12,41,0.6)",
              }}
            >
              {/* Shine sweep */}
              <div
                className="blink-shine-bar absolute inset-0 z-10 overflow-hidden rounded-2xl pointer-events-none"
                aria-hidden="true"
              />

              <img
                src="/assets/blink_jewelry_hero.png"
                alt="Blink Jewelry — Premium Collection"
                className="w-full object-cover"
                style={{
                  height: "220px",
                  objectPosition: "center",
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = "none";
                }}
              />

              {/* "New Arrivals" chip floating on image */}
              <div
                className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold z-20"
                style={{
                  background: "rgba(251,191,36,0.95)",
                  color: "#1a1a1a",
                }}
              >
                <span>✦</span> New Arrivals
              </div>

              {/* Discount chip */}
              <div
                className="absolute top-3 right-3 rounded-full px-2.5 py-1 text-[11px] font-black z-20"
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  boxShadow: "0 2px 8px rgba(239,68,68,0.5)",
                }}
              >
                Up to 40% OFF
              </div>
            </div>

            {/* Jewelry category cards — 2×2 grid */}
            <div className="grid grid-cols-2 gap-2.5 mt-3 w-full" style={{ maxWidth: "420px" }}>
              {jewels.map((j, i) => (
                <button
                  key={j.label}
                  id={`blink-jewelry-${j.label.toLowerCase()}`}
                  aria-label={`Shop ${j.label}`}
                  className="blink-jewel-card flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer text-left"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    backdropFilter: "blur(8px)",
                    animationDelay: `${0.3 + i * 0.08}s`,
                  }}
                >
                  <span
                    className="flex items-center justify-center rounded-lg shrink-0"
                    style={{
                      width: "36px",
                      height: "36px",
                      background: "rgba(251,191,36,0.12)",
                      border: "1px solid rgba(251,191,36,0.2)",
                      fontSize: "18px",
                    }}
                  >
                    {j.icon}
                  </span>
                  <div className="flex flex-col">
                    <span
                      className="text-xs sm:text-sm font-bold leading-tight"
                      style={{ color: "#ffffff" }}
                    >
                      {j.label}
                    </span>
                    <span
                      className="text-[10px] sm:text-[11px] font-medium mt-0.5"
                      style={{ color: "rgba(251,191,36,0.85)" }}
                    >
                      {j.sub}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom separator wave */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "28px",
            background:
              "linear-gradient(to bottom right, transparent 49%, #f9fafb 50%)",
            pointerEvents: "none",
          }}
          className="dark:hidden"
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "28px",
            background:
              "linear-gradient(to bottom right, transparent 49%, #111827 50%)",
            pointerEvents: "none",
          }}
          className="hidden dark:block"
        />
      </section>
    </>
  );
}
