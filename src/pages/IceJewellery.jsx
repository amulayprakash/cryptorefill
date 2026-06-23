import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

/* ─── Jewelry catalog data ─── */
const JEWELRY_ITEMS = [
  { id: "ice-chain-01", name: "Iced-Out Miami Cuban Link",   category: "Chains",    price: "$189", originalPrice: "$299", badge: "🔥 Best Seller", crypto: "≈ 0.0035 BTC", imageUrl: "/assets/ice_jewellery/ice_chain_01.png" },
  { id: "ice-chain-02", name: "Diamond-Cut Box Chain 18k",   category: "Chains",    price: "$129", originalPrice: "$210", badge: "💎 Premium",    crypto: "≈ 0.0024 BTC", imageUrl: "/assets/ice_jewellery/ice_chain_02.png" },
  { id: "ice-chain-03", name: "Figaro Platinum Link Chain",  category: "Chains",    price: "$149", originalPrice: "$229", badge: "⚡ Deal",       crypto: "≈ 0.0028 BTC", imageUrl: "/assets/ice_jewellery/ice_chain_03.png" },
  { id: "ice-chain-04", name: "Rope Twist Gold Chain",       category: "Chains",    price: "$99",  originalPrice: "$159", badge: null,             crypto: "≈ 0.0019 BTC", imageUrl: "/assets/ice_jewellery/ice_chain_04.png" },
  { id: "ice-ring-01",  name: "Solitaire Diamond Halo Ring", category: "Rings",     price: "$249", originalPrice: "$399", badge: "💎 Premium",    crypto: "≈ 0.0047 BTC", imageUrl: "/assets/ice_jewellery/ice_ring_01.png" },
  { id: "ice-ring-02",  name: "Iced Pinky Band Ring",        category: "Rings",     price: "$79",  originalPrice: "$120", badge: "⚡ Deal",       crypto: "≈ 0.0015 BTC", imageUrl: "/assets/ice_jewellery/ice_ring_02.png" },
  { id: "ice-ring-03",  name: "Princess Cut Engagement Ring",category: "Rings",     price: "$349", originalPrice: "$549", badge: "👑 Luxury",     crypto: "≈ 0.0066 BTC", imageUrl: "/assets/ice_jewellery/ice_ring_03.png" },
  { id: "ice-ring-04",  name: "Men's Signet Gold Ring",      category: "Rings",     price: "$89",  originalPrice: "$140", badge: null,             crypto: "≈ 0.0017 BTC", imageUrl: "/assets/ice_jewellery/ice_ring_04.png" },
  { id: "ice-brace-01", name: "Diamond Tennis Bracelet",     category: "Bracelets", price: "$299", originalPrice: "$449", badge: "🔥 Best Seller", crypto: "≈ 0.0056 BTC", imageUrl: "/assets/ice_jewellery/ice_brace_01.png" },
  { id: "ice-brace-02", name: "Iced Baguette Link Bracelet", category: "Bracelets", price: "$179", originalPrice: "$269", badge: "💎 Premium",    crypto: "≈ 0.0034 BTC", imageUrl: "/assets/ice_jewellery/ice_brace_02.png" },
  { id: "ice-brace-03", name: "Gold Herringbone Bracelet",   category: "Bracelets", price: "$109", originalPrice: "$179", badge: null,             crypto: "≈ 0.0021 BTC", imageUrl: "/assets/ice_jewellery/ice_brace_03.png" },
  { id: "ice-pend-01",  name: "Diamond Cross Pendant",       category: "Pendants",  price: "$139", originalPrice: "$219", badge: "💎 Premium",    crypto: "≈ 0.0026 BTC", imageUrl: "/assets/ice_jewellery/ice_pend_01.png" },
  { id: "ice-pend-02",  name: "Iced Crown Medallion",        category: "Pendants",  price: "$169", originalPrice: "$259", badge: "👑 Luxury",     crypto: "≈ 0.0032 BTC", imageUrl: "/assets/ice_jewellery/ice_pend_02.png" },
  { id: "ice-pend-03",  name: "Crypto BTC Symbol Pendant",   category: "Pendants",  price: "$89",  originalPrice: "$139", badge: "₿ Crypto",     crypto: "≈ 0.0017 BTC", imageUrl: "/assets/ice_jewellery/ice_pend_03.png" },
  { id: "ice-ear-01",   name: "Diamond Stud Earrings",       category: "Earrings",  price: "$119", originalPrice: "$189", badge: "💎 Premium",    crypto: "≈ 0.0022 BTC", imageUrl: "/assets/ice_jewellery/ice_ear_01.png" },
  { id: "ice-ear-02",   name: "Gold Hoop Drop Earrings",     category: "Earrings",  price: "$79",  originalPrice: "$129", badge: null,             crypto: "≈ 0.0015 BTC", imageUrl: "/assets/ice_jewellery/ice_ear_02.png" },
  { id: "ice-watch-01", name: "Iced Chronograph Watch",      category: "Watches",   price: "$499", originalPrice: "$749", badge: "👑 Luxury",     crypto: "≈ 0.0094 BTC", imageUrl: "/assets/ice_jewellery/ice_watch_01.png" },
  { id: "ice-watch-02", name: "Minimalist Gold Dress Watch", category: "Watches",   price: "$299", originalPrice: "$449", badge: "🔥 Best Seller", crypto: "≈ 0.0056 BTC", imageUrl: "/assets/ice_jewellery/ice_watch_02.svg" },
  { id: "ice-gift-01",  name: "Ice Jewellery $100 Gift Card",category: "Gift Cards", price: "$100", originalPrice: "$100", badge: "🎁 Gift",      crypto: "≈ 0.0019 BTC", imageUrl: "/assets/ice_jewellery/ice_gift_01.svg" },
  { id: "ice-gift-02",  name: "Ice Jewellery $250 Gift Card",category: "Gift Cards", price: "$250", originalPrice: "$250", badge: "🎁 Gift",      crypto: "≈ 0.0047 BTC", imageUrl: "/assets/ice_jewellery/ice_gift_02.svg" },
];

const CATEGORIES = ["All", "Chains", "Rings", "Bracelets", "Pendants", "Earrings", "Watches", "Gift Cards"];
const CAT_ICONS = { All:"💎", Chains:"⛓️", Rings:"💍", Bracelets:"📿", Pendants:"🏅", Earrings:"✨", Watches:"⌚", "Gift Cards":"🎁" };

/* ── SVG visual placeholder per category, site-native light card style ── */
function JewelVisual({ category }) {
  const shapes = {
    Chains: (
      <g>
        <ellipse cx="60" cy="60" rx="36" ry="10" fill="none" stroke="url(#pChain)" strokeWidth="5"/>
        <ellipse cx="60" cy="60" rx="25" ry="7"  fill="none" stroke="url(#pChain)" strokeWidth="3" opacity="0.5"/>
        <circle  cx="60" cy="60" r="9" fill="url(#pGold)"/>
      </g>
    ),
    Rings: (
      <g>
        <circle cx="60" cy="60" r="30" fill="none" stroke="url(#pGold)" strokeWidth="10"/>
        <circle cx="60" cy="30" r="11" fill="url(#pBlue)"/>
        <circle cx="60" cy="30" r="5"  fill="rgba(255,255,255,0.7)"/>
      </g>
    ),
    Bracelets: (
      <g>
        <path d="M30,60 Q40,28 60,26 Q80,28 90,60 Q80,92 60,94 Q40,92 30,60" fill="none" stroke="url(#pGold)" strokeWidth="7"/>
        <circle cx="77" cy="34" r="7" fill="url(#pBlue)"/>
        <circle cx="77" cy="34" r="3" fill="rgba(255,255,255,0.8)"/>
      </g>
    ),
    Pendants: (
      <g>
        <polygon points="60,20 77,56 60,74 43,56" fill="url(#pBlue)"/>
        <polygon points="60,20 77,56 60,56 43,56" fill="rgba(255,255,255,0.25)"/>
        <rect x="57" y="9" width="6" height="13" fill="url(#pGold)" rx="3"/>
        <circle cx="60" cy="42" r="4" fill="rgba(255,255,255,0.85)"/>
      </g>
    ),
    Earrings: (
      <g>
        <circle cx="42" cy="40" r="13" fill="url(#pBlue)"/>
        <circle cx="42" cy="40" r="6"  fill="rgba(255,255,255,0.7)"/>
        <circle cx="78" cy="40" r="13" fill="url(#pBlue)"/>
        <circle cx="78" cy="40" r="6"  fill="rgba(255,255,255,0.7)"/>
        <line x1="42" y1="27" x2="42" y2="14" stroke="url(#pGold)" strokeWidth="3"/>
        <line x1="78" y1="27" x2="78" y2="14" stroke="url(#pGold)" strokeWidth="3"/>
      </g>
    ),
    Watches: (
      <g>
        <circle cx="60" cy="60" r="33" fill="none" stroke="url(#pGold)" strokeWidth="8"/>
        <circle cx="60" cy="60" r="24" fill="#f0f4ff"/>
        <circle cx="60" cy="60" r="24" fill="url(#pWatchFace)" opacity="0.4"/>
        <line x1="60" y1="60" x2="60" y2="44" stroke="#1e40af" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="60" y1="60" x2="73" y2="60" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="60" cy="60" r="2.5" fill="#1e40af"/>
      </g>
    ),
    "Gift Cards": (
      <g>
        <rect x="16" y="32" width="88" height="56" rx="10" fill="url(#pCard)" />
        <rect x="16" y="50" width="88" height="6"  fill="rgba(255,255,255,0.15)"/>
        <text x="60" y="62" textAnchor="middle" fontSize="18" fontWeight="900" fill="white" opacity="0.9">💎</text>
        <text x="60" y="78" textAnchor="middle" fontSize="8"  fontWeight="800" fill="rgba(255,255,255,0.75)">ICE JEWELLERY</text>
      </g>
    ),
  };
  return (
    <svg viewBox="0 0 120 120" fill="none" style={{ width: "100%", height: "100%" }}>
      <rect width="120" height="120" fill="url(#bg2Light)"/>
      {shapes[category] || shapes["Pendants"]}
      {/* Sparkle accents */}
      <text x="18" y="26" fontSize="8" fill="#f59e0b" opacity="0.6">✦</text>
      <text x="93" y="30" fontSize="6" fill="#6366f1" opacity="0.5">✦</text>
      <text x="90" y="98" fontSize="7" fill="#f59e0b" opacity="0.45">✦</text>
      <defs>
        <linearGradient id="bg2Light" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#eff6ff"/>  {/* blue-50 */}
          <stop offset="100%" stopColor="#f0f9ff"/>  {/* sky-50 */}
        </linearGradient>
        <linearGradient id="pGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#fde68a"/>
          <stop offset="50%"  stopColor="#f59e0b"/>
          <stop offset="100%" stopColor="#92400e"/>
        </linearGradient>
        <linearGradient id="pBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#bfdbfe"/>  {/* blue-200 */}
          <stop offset="40%"  stopColor="#3b82f6"/>  {/* blue-500 */}
          <stop offset="100%" stopColor="#1e40af"/>  {/* blue-800 */}
        </linearGradient>
        <linearGradient id="pChain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#e5e7eb"/>
          <stop offset="50%"  stopColor="#9ca3af"/>
          <stop offset="100%" stopColor="#4b5563"/>
        </linearGradient>
        <linearGradient id="pCard" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#1e40af"/>
          <stop offset="100%" stopColor="#4f46e5"/>
        </linearGradient>
        <radialGradient id="pWatchFace" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#dbeafe" stopOpacity="1"/>
          <stop offset="100%" stopColor="#eff6ff" stopOpacity="0"/>
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ── Product Card — matches the site's existing card style exactly ── */
function JewelCard({ item }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const priceNum = parseInt(item.price.replace("$",""));
  const origNum  = parseInt(item.originalPrice.replace("$",""));
  const discount = origNum > priceNum ? Math.round((1 - priceNum / origNum) * 100) : null;

  return (
    <div
      onClick={() => navigate(`/product/${item.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: "16px",
        overflow: "hidden",
        background: hovered ? "linear-gradient(160deg, #fafbfd 0%, #f7f6f2 100%)" : "#ffffff",
        border: `1px solid ${hovered ? "rgba(197, 160, 89, 0.35)" : "#f3f4f6"}`,
        boxShadow: hovered ? "0 16px 40px rgba(197, 160, 89, 0.12)" : "0 1px 4px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.28s cubic-bezier(0.22,1,0.36,1)",
        cursor: "pointer",
      }}
      className="dark:bg-gray-800 dark:border-gray-700"
    >
      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "16/10", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }} className="dark:bg-gray-900">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => {
              e.target.style.display = "none";
              const fb = e.target.parentElement.querySelector(".jewel-fallback-svg");
              if (fb) fb.style.display = "block";
            }}
          />
        ) : null}
        <div
          className="jewel-fallback-svg w-full h-full"
          style={{ display: item.imageUrl ? "none" : "block" }}
        >
          <JewelVisual category={item.category} />
        </div>

        {/* Discount badge — red-650 */}
        {discount && (
          <span style={{
            position: "absolute", top: "8px", right: "8px",
            background: "#dc2626", color: "#fff",
            padding: "2px 8px", borderRadius: "6px",
            fontSize: "9px", fontWeight: 900,
            boxShadow: "0 1px 4px rgba(220,38,38,0.3)",
          }}>
            {discount}% OFF
          </span>
        )}

        {/* Category badge — champagne-gold */}
        {item.badge && (
          <span style={{
            position: "absolute", top: "8px", left: "8px",
            background: "rgba(197, 160, 89, 0.9)",
            backdropFilter: "blur(4px)",
            color: "#1c1917",
            padding: "2px 8px", borderRadius: "5px",
            fontSize: "9px", fontWeight: 800,
          }}>
            {item.badge}
          </span>
        )}
      </div>

      {/* Info — matches site's product card info layout */}
      <div style={{ padding: "12px 12px 0" }}>
        <p style={{
          fontWeight: 700, fontSize: "13px",
          color: hovered ? "#C5A059" : "#111827",
          marginBottom: "4px", lineHeight: 1.3,
          transition: "color 0.2s",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}
          className="dark:text-white"
        >
          {item.name}
        </p>

        {/* Price row */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "7px", marginBottom: "2px" }}>
          <span style={{ fontWeight: 800, fontSize: "14px", color: "#A47F37" }}
            className="dark:text-amber-400"
          >
            {item.price}
          </span>
          {origNum > priceNum && (
            <span style={{ fontSize: "11px", color: "#9ca3af", textDecoration: "line-through" }}>
              {item.originalPrice}
            </span>
          )}
        </div>

        {/* Crypto equiv — delivery-style subtle row */}
        <div style={{
          display: "flex", alignItems: "center", gap: "4px",
          fontSize: "9px", fontWeight: 700,
          color: "#9ca3af",
          borderTop: "1px solid #f9fafb", paddingTop: "7px", marginTop: "6px",
        }}
          className="dark:border-gray-700"
        >
          <span style={{ color: "#C5A059" }}>₿</span>
          {item.crypto}
          <span style={{ marginLeft: "auto", color: "#16a34a" }}>⚡ Instant</span>
        </div>
      </div>

      {/* Hover CTA — matches site's gold hover CTA pattern */}
      <div style={{
        overflow: "hidden",
        transition: "max-height 0.28s ease",
        maxHeight: hovered ? "50px" : "0",
      }}>
        <div style={{
          margin: "8px 12px 12px",
          background: "linear-gradient(135deg, #C5A059, #D4AF37)",
          borderRadius: "10px",
          padding: "8px",
          textAlign: "center",
          fontSize: "12px", fontWeight: 800, color: "#1c1917",
        }}>
          Buy with Crypto →
        </div>
      </div>

      {!hovered && <div style={{ height: "12px" }} />}
    </div>
  );
}

/* ── Main Page ── */
export default function IceJewellery() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() =>
    JEWELRY_ITEMS.filter(item => {
      const catOk = activeCategory === "All" || item.category === activeCategory;
      const searchOk = !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      return catOk && searchOk;
    }),
    [activeCategory, search]
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,650;1,400&display=swap');

        .luxury-serif {
          font-family: 'Cormorant Garamond', 'Playfair Display', serif;
        }

        /* Page uses site-native bg-white / dark:bg-gray-900 */
        .ijp-page { background: #ffffff; min-height: 100vh; }
        .dark .ijp-page { background: #111827; }

        @keyframes ijpFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .ijp-fade { animation: ijpFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both; }

        /* Hero banner — premium ivory-white boutique header */
        .ijp-hero {
          background: #FAF8F4;
          position: relative; overflow: hidden;
          padding: 56px 24px 64px;
          border-bottom: 1px solid rgba(197, 160, 89, 0.15);
        }

        /* Category filter buttons — luxury gold accents */
        .ijp-cat-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 7px 16px; border-radius: 999px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          border: 1px solid #e5e7eb; /* gray-200 */
          background: #ffffff; color: #6b7280; /* gray-500 */
          transition: all 0.2s ease; white-space: nowrap;
        }
        .ijp-cat-btn:hover { border-color: #C5A059; background: #FAF8F4; color: #1c1917; }
        .ijp-cat-btn.active {
          background: linear-gradient(135deg, #C5A059, #D4AF37);
          color: #1c1917; border-color: transparent;
          box-shadow: 0 4px 14px rgba(197, 160, 89, 0.25);
        }
        .dark .ijp-cat-btn { background: #1f2937; border-color: #374151; color: #9ca3af; }
        .dark .ijp-cat-btn:hover { background: #374151; color: #e5e7eb; }
        .dark .ijp-cat-btn.active { background: linear-gradient(135deg, #C5A059, #D4AF37); color: #1c1917; }

        /* Search input */
        .ijp-search {
          background: #f3f4f6; /* gray-100 */
          border: 1px solid transparent;
          border-radius: 12px;
          padding: 9px 14px 9px 38px;
          color: #111827; font-size: 14px;
          outline: none; width: 100%; max-width: 280px;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
        }
        .ijp-search::placeholder { color: #9ca3af; }
        .ijp-search:focus { border-color: #C5A059; box-shadow: 0 0 0 1px #C5A059; }
        .dark .ijp-search { background: #1f2937; color: #f9fafb; border-color: #374151; }
        .dark .ijp-search::placeholder { color: #6b7280; }

        /* Product grid */
        .ijp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }
        @media (max-width: 640px) {
          .ijp-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }

        /* Stat card — premium jewelry display case style */
        .ijp-stat {
          padding: 14px 18px; border-radius: 14px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(197, 160, 89, 0.15);
          backdrop-filter: blur(8px);
          display: flex; flex-direction: column; gap: 3px;
          min-width: 125px;
          box-shadow: 0 4px 12px rgba(197, 160, 89, 0.04);
          transition: all 0.3s ease;
        }
        .ijp-stat:hover {
          transform: translateY(-2px);
          border-color: rgba(197, 160, 89, 0.35);
          box-shadow: 0 6px 16px rgba(197, 160, 89, 0.08);
        }

        /* Back link */
        .ijp-back {
          display: inline-flex; align-items: center; gap: 6px;
          color: #78716c; font-size: 13px; font-weight: 700;
          background: none; border: none; cursor: pointer;
          text-decoration: none; padding: 0; margin-bottom: 20px;
          transition: all 0.2s;
        }
        .ijp-back:hover { color: #C5A059; }

        /* Section heading */
        .ijp-section-h { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 16px; }
        .dark .ijp-section-h { color: #f9fafb; }

        /* Gift CTA strip */
        .ijp-gift-strip {
          border-radius: 16px;
          background: #FAF8F4;
          border: 1px solid rgba(197, 160, 89, 0.15);
          padding: 24px 28px;
          display: flex; flex-wrap: wrap;
          align-items: center; justify-content: space-between;
          gap: 16px; margin-top: 40px;
        }
        .dark .ijp-gift-strip { background: #1f2937; border-color: #374151; }

        .ijp-gift-btn {
          padding: 11px 24px; border-radius: 12px;
          background: linear-gradient(135deg, #C5A059, #D4AF37);
          color: #1c1917; font-weight: 800; font-size: 14px;
          border: none; cursor: pointer; white-space: nowrap;
          box-shadow: 0 4px 14px rgba(197, 160, 89, 0.25);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .ijp-gift-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(197, 160, 89, 0.4); }

        /* Live dot */
        @keyframes ijpPulseGreen {
          0%,100% { box-shadow: 0 0 0 0 rgba(22,163,74,0.5); }
          50% { box-shadow: 0 0 0 8px rgba(22,163,74,0); }
        }
        .ijp-live-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #16a34a;
          animation: ijpPulseGreen 1.8s ease-in-out infinite;
        }
      `}</style>

      <div className="ijp-page">
        <Header />

        {/* ── Page Hero ── */}
        <div className="ijp-hero">
          {/* Subtle champagne-gold ambient glows */}
          <div style={{
            position: "absolute", top: "-80px", right: "-60px",
            width: "350px", height: "350px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(197,160,89,0.06) 0%, transparent 70%)",
            filter: "blur(50px)",
          }} />
          <div style={{
            position: "absolute", bottom: "-60px", left: "-60px",
            width: "300px", height: "300px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, transparent 60%)",
            filter: "blur(40px)",
          }} />

          <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
            {/* Back link */}
            <Link to="/" className="ijp-back">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to Home
            </Link>

            {/* Eyebrow */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "7px",
              background: "rgba(255,255,255,0.8)", border: "1px solid rgba(197, 160, 89, 0.2)",
              borderRadius: "999px", padding: "4px 13px",
              fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em",
              textTransform: "uppercase", color: "#C5A059",
              marginBottom: "14px",
              boxShadow: "0 1px 3px rgba(197, 160, 89, 0.05)",
            }}>
              <span>💎</span> Ice Jewellery Crypto — Full Collection
            </div>

            {/* Heading */}
            <h1 className="luxury-serif" style={{
              fontSize: "clamp(2.2rem, 5vw, 3.6rem)", fontWeight: 300,
              color: "#1c1917", letterSpacing: "-0.02em",
              margin: "0 0 10px", lineHeight: 1.1,
            }}>
              Shop Ice <span className="italic text-[#C5A059] font-light">Jewellery</span>
            </h1>
            <p style={{
              fontSize: "15px", color: "#57534e",
              maxWidth: "500px", lineHeight: 1.65, marginBottom: "24px",
            }}>
              {JEWELRY_ITEMS.length} premium pieces available — buy instantly with Bitcoin, Ethereum &amp; more crypto.
            </p>

            {/* Stats */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {[
                { label: "Products",       value: `${JEWELRY_ITEMS.length}+`, icon: "💎" },
                { label: "Crypto Accepted",value: "BTC · ETH · SOL",         icon: "₿"  },
                { label: "Avg. Delivery",  value: "Instant",                  icon: "⚡" },
                { label: "Rated",          value: "★ 4.9 / 5",               icon: "👑" },
              ].map(s => (
                <div key={s.label} className="ijp-stat">
                  <span style={{ fontSize: "16px" }}>{s.icon}</span>
                  <span style={{ fontSize: "14px", fontWeight: 900, color: "#1c1917" }}>{s.value}</span>
                  <span style={{ fontSize: "10px", color: "#78716c", fontWeight: 600 }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Catalog ── */}
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "28px 20px 48px" }}>

          {/* Live indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "18px" }}>
            <div className="ijp-live-dot" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#6b7280" }}>
              Live collection — updated daily
            </span>
          </div>

          {/* Filters + search */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", flex: 1 }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  id={`ijp-filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  aria-label={`Filter ${cat}`}
                  className={`ijp-cat-btn${activeCategory === cat ? " active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  <span>{CAT_ICONS[cat]}</span>
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)",
                fontSize: "14px", pointerEvents: "none", color: "#9ca3af",
              }}>🔍</span>
              <input
                type="text"
                className="ijp-search"
                placeholder="Search jewelry..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                id="ijp-search"
                aria-label="Search jewelry"
              />
            </div>
          </div>

          {/* Result count — matches AllProducts style */}
          <div style={{ marginBottom: "16px" }}>
            <span style={{ fontSize: "13px", color: "#6b7280", fontWeight: 600 }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
            </span>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "72px 20px" }}>
              <div style={{ fontSize: "44px", marginBottom: "14px" }}>🔍</div>
              <p style={{ fontSize: "18px", fontWeight: 700, color: "#374151", marginBottom: "6px" }}
                className="dark:text-gray-300"
              >
                No items found
              </p>
              <p style={{ fontSize: "14px", color: "#9ca3af" }}>
                Try a different category or search term.
              </p>
            </div>
          ) : (
            <div className="ijp-grid">
              {filtered.map(item => (
                <JewelCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* Gift CTA strip */}
          <div className="ijp-gift-strip">
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 900, color: "#111827", margin: "0 0 5px" }}
                className="dark:text-white"
              >
                🎁 Looking for a Gift?
              </h2>
              <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}
                className="dark:text-gray-400"
              >
                Crypto gift cards — the perfect luxury present. Redeemable for any Ice Jewellery item.
              </p>
            </div>
            <button
              id="ijp-gift-cta"
              aria-label="Browse Gift Cards"
              className="ijp-gift-btn"
              onClick={() => setActiveCategory("Gift Cards")}
            >
              🎁 Browse Gift Cards
            </button>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
