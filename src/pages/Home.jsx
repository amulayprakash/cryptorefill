import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import Header from "../components/Header";
import IceJewelleryCryptoHero from "../components/IceJewelleryCryptoHero";
import { vietnamProducts } from "../data/vietnamProducts";

const vietnamTabs = [
  { name: "Beauty & Skincare", icon: "🧴" },
  { name: "Electronics & Smartphones", icon: "📱" },
  { name: "Audio & Earbuds", icon: "🎧" },
  { name: "Smart Wearables", icon: "⌚" },
  { name: "Home & Kitchen", icon: "🍳" },
  { name: "Fashion & Apparel", icon: "👗" },
  { name: "Fitness & Wellness", icon: "💪" },
  { name: "Health Supplements", icon: "💊" },
  { name: "Smart Home", icon: "🏠" },
  { name: "Pet Care", icon: "🐾" },
  { name: "Eco-Friendly Living", icon: "🌱" }
];

function TrendingProductsShowcase() {
  const [activeCategory, setActiveCategory] = useState("Beauty & Skincare");
  const tabsRef = React.useRef(null);

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let draggedThisPress = false;

    const handleMouseDown = (e) => {
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      draggedThisPress = false;
    };

    const handleMouseLeave = () => {
      isDown = false;
    };

    const handleMouseUp = () => {
      isDown = false;
      // draggedThisPress remains true until the upcoming click fires and resets it
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5;
      if (Math.abs(x - startX) > 5) {
        draggedThisPress = true;
      }
      el.scrollLeft = scrollLeft - walk;
    };

    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    // Capture-phase click: only suppress the single click that immediately
    // follows a drag. Reset immediately so the next click is never blocked.
    const handleCaptureClick = (e) => {
      if (draggedThisPress) {
        draggedThisPress = false; // reset so next click works
        e.preventDefault();
        e.stopPropagation();
      }
    };

    el.addEventListener("mousedown", handleMouseDown);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("mouseup", handleMouseUp);
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("click", handleCaptureClick, true);

    return () => {
      el.removeEventListener("mousedown", handleMouseDown);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("mouseup", handleMouseUp);
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("click", handleCaptureClick, true);
    };
  }, []);

  const filteredProducts = vietnamProducts.filter(
    (product) => product.category === activeCategory
  );

  return (
    <div className="mt-8 mx-auto max-w-(--breakpoint-2xl) mb-12">
      {/* Header & Tabs */}
      <div className="px-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xl font-bold sm:text-2xl flex items-center gap-2">
              🔥 Hot Deals &amp; Offers
            </span>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Top trending items in the Vietnam Market. Buy instantly with crypto.
            </p>
          </div>
        </div>

        {/* Custom Tabs (using div with role="button" to avoid scroll button match conflicts) */}
        <div
          ref={tabsRef}
          className="mt-6 no-scrollbar flex w-full gap-2 overflow-x-auto pb-2 scroll-smooth border-b border-gray-200/60 dark:border-gray-800/60"
        >
          {vietnamTabs.map((tab) => {
            const isActive = tab.name === activeCategory;
            return (
              <div
                key={tab.name}
                role="button"
                tabIndex={0}
                onClick={() => setActiveCategory(tab.name)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setActiveCategory(tab.name);
                  }
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer shrink-0 border select-none ${
                  isActive
                    ? "bg-blue-600 text-white border-transparent shadow-md transform scale-102 hover:bg-blue-700"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </div>
            );
          })}
        </div>
      </div>



      {/* Horizontal Scrollable Slider */}
      <div className="relative w-full">
        <div className="mt-4 no-scrollbar flex w-full gap-4 overflow-x-auto scroll-smooth pt-2 sm:gap-6 sm:pr-20 xl:gap-6 pb-4">
          {filteredProducts.map((product) => {
            const hasDiscount = product.discount && product.discount !== "0% OFF";
            return (
              <div
                key={product.id}
                className="relative flex w-[154px] shrink-0 cursor-pointer flex-col last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px] group bg-white dark:bg-gray-850 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <Link to={`/product/${product.id}`} className="flex flex-col w-full">
                  {/* Image container */}
                  <div className="relative h-[98px] w-full flex-none overflow-hidden bg-gray-50 dark:bg-gray-900 sm:h-[133px] lg:h-[155px] xl:h-[178px] border-b border-gray-100 dark:border-gray-800">
                    <img
                      alt={product.name}
                      src={product.imageUrl}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/placeholder_mockup.png';
                      }}
                    />
                    
                    {/* Discount badge */}
                    {hasDiscount && (
                      <span className="absolute top-2 right-2 bg-red-600 text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
                        {product.discount}
                      </span>
                    )}

                    {/* Points Multiplier badge */}
                    {product.pointsMultiplier && (
                      <span className="absolute bottom-2 left-2 bg-green-600/90 backdrop-blur-xs text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-sm">
                        {product.pointsMultiplier}x Points
                      </span>
                    )}
                  </div>

                  {/* Info details */}
                  <div className="p-3 flex flex-col flex-1">
                    {/* Product Name */}
                    <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </span>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-1.5 mt-1 sm:mt-1.5">
                      <span className="text-xs sm:text-sm font-extrabold text-blue-600 dark:text-blue-400">
                        {product.promoPrice || product.priceRange}
                      </span>
                      {product.promoPrice && product.promoPrice !== product.priceRange && (
                        <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 line-through">
                          {product.priceRange}
                        </span>
                      )}
                    </div>

                    {/* Delivery / Footer info */}
                    <div className="flex items-center gap-1 mt-2 text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500 font-bold border-t border-gray-50 dark:border-gray-800 pt-2">
                      <span className="text-green-500">⚡</span>
                      <span>Instant Email Delivery</span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleProductClick = (e) => {
      // Find closest brand item
      const brandItem = e.target.closest('[data-brand-item="true"]');
      if (brandItem) {
        e.preventDefault();
        e.stopPropagation();

        // Try to get the name from the img alt attribute
        const img = brandItem.querySelector("img");
        if (img && img.alt) {
          const mappings = {
            // Popular
            "Amazon.com": "amazon-com",
            "Everything Apple": "everything-apple",
            "Walmart": "walmart",
            "eBay": "ebay",
            "Razer Gold USD": "razer-gold",
            // Electronics
            "Best Buy": "best-buy",
            "Target": "target",
            "Sam's Club": "sams-club",
            "NordVPN": "nord-vpn",
            "Dicks Sporting Goods": "dicks-sporting-goods",
            "NordPass": "nordpass",
            "Kohls": "kohls",
            // Emoney
            "Rewarble VISA USD": "rewarble-visa-usd",
            "American Express": "american-express",
            "Rewarble Bank Transfer USD": "rewarble-bank-transfer-usd",
            "Venmo": "venmo",
            "Rewarble Super Gift card USD": "rewarble-super-gift-card-usd",
            "Rewarble PayPal CAD": "rewarble-paypal-cad",
            // Gaming
            "Roblox": "roblox",
            "Steam": "steam",
            "PlayStation Store": "playstation-store",
            "Xbox": "xbox",
            "Google Play": "google-play",
            "Nintendo eShop": "nintendo-eshop",
            "Runescape": "runescape",
            "Free Fire": "free-fire",
            "Fortnite": "fortnite",
            "Nintendo Switch Online": "nintendo-switch-online",
            // Travel
            "Uber": "uber",
            "Airbnb": "airbnb",
            "Delta Air Lines": "delta-air-lines",
            "Disney": "disney",
            "Lyft": "lyft",
            "Royal Caribbean": "royal-caribbean",
            // Food Delivery
            "DoorDash": "doordash",
            "Uber Eats": "uber-eats",
            "Albertsons companies": "albertsons-companies",
            "Instacart": "instacart",
            "Chipotle": "chipotle",
            "Papa John's": "papa-johns",
            // Entertainment
            "Netflix": "netflix",
            "StubHub": "stubhub",
            "Meta Quest": "meta-quest",
            "Twitch": "twitch",
            "AMC Theaters": "amc-theaters",
            "Deezer": "deezer",
            "Paramount plus": "paramount-plus",
            "Nintendo Switch Online": "nintendo-switch-online",
            "SiriusXM": "siriusxm",
            // Groceries
            "Kroger": "kroger",
            "Safeway": "safeway",
            "Meijer": "meijer",
            "Omaha Steaks": "omaha-steaks",
            "Giant Eagle Market District": "giant-eagle-market-district",
            "Shipt": "shipt",
            "Instacart+": "instacart-plus",
            // Home & Shopping
            "Home Depot": "home-depot",
            "Lowe's": "lowes",
            "Sportsmans Warehouse": "sportsmans-warehouse",
            "Victoria's Secret": "victorias-secret",
            "CVS pharmacy": "cvs-pharmacy",
            "Chevron and Texaco": "chevron-and-texaco",
            // Vietnam Market
            "K-Beauty Skincare Serums": "vn-kbeauty-serums",
            "Mid-Range Smartphones": "vn-mid-range-smartphones",
            "TWS Bluetooth Earbuds": "vn-tws-earbuds",
            "Smartwatches & Fitness Bands": "vn-smartwatches",
            "Air Fryers & Smart Gadgets": "vn-air-fryers",
            "Women's Casual Dresses": "vn-casual-dresses",
            "Sunscreen & UV Protection": "vn-sunscreen",
            "Resistance Bands & Home Fitness": "vn-resistance-bands",
            "Lip Gloss, Tints & Lip Care": "vn-lip-gloss",
            "Phone Cases & Accessories": "vn-phone-cases",
            "Collagen & Health Supplements": "vn-collagen",
            "Smart Home Devices": "vn-smart-home",
            "Portable Blenders": "vn-portable-blenders",
            "Pet Products & Accessories": "vn-pet-products",
            "Eco-Friendly & Sustainable": "vn-eco-friendly",
          };

          const name = img.alt || img.title || "";
          const vietnamCategories = ["Beauty & Skincare", "Electronics & Smartphones", "Audio & Earbuds", "Smart Wearables", "Home & Kitchen", "Fashion & Apparel", "Fitness & Wellness", "Health Supplements", "Smart Home", "Pet Care", "Eco-Friendly Living"];
          
          if (vietnamCategories.includes(name)) {
            navigate(`/products?category=${encodeURIComponent(name)}`);
            return;
          }

          const id = mappings[name];
          if (id) {
            navigate(`/product/${id}`);
          } else if (name) {
            // Fallback: navigate to all products page
            navigate(`/products`);
          }
        }
      }
    };

    document.addEventListener("click", handleProductClick);
    return () => document.removeEventListener("click", handleProductClick);
  }, [navigate]);

  useEffect(() => {
    const disableButton = (btn) => {
      if (!btn) return;
      btn.disabled = true;
      btn.classList.add('pointer-events-none', 'cursor-auto', 'opacity-0');
      btn.classList.remove('cursor-pointer', 'opacity-100', 'pointer-events-auto');
    };

    const enableButton = (btn) => {
      if (!btn) return;
      btn.disabled = false;
      btn.classList.add('cursor-pointer', 'opacity-100', 'pointer-events-auto');
      btn.classList.remove('pointer-events-none', 'cursor-auto', 'opacity-0');
    };

    const findScrollContainer = (button) => {
      let parent = button.parentElement;
      while (parent) {
        const container = parent.querySelector('.overflow-x-auto');
        if (container) return container;
        
        let sibling = parent.nextElementSibling;
        while (sibling) {
          const sibContainer = sibling.querySelector('.overflow-x-auto') || (sibling.classList.contains('overflow-x-auto') ? sibling : null);
          if (sibContainer) return sibContainer;
          sibling = sibling.nextElementSibling;
        }
        parent = parent.parentElement;
      }
      return null;
    };

    const findScrollButtons = (container) => {
      const parent = container.parentElement;
      if (!parent) return [];
      
      let sibling = parent.previousElementSibling;
      while (sibling) {
        const buttons = Array.from(sibling.querySelectorAll('button'));
        if (buttons.length >= 2) return buttons;
        sibling = sibling.previousElementSibling;
      }
      return [];
    };

    const updateScrollButtons = (container) => {
      const buttons = findScrollButtons(container);
      if (buttons.length < 2) return;
      const [leftBtn, rightBtn] = buttons;
      const scrollLeft = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (maxScroll <= 0) {
        disableButton(leftBtn);
        disableButton(rightBtn);
        return;
      }

      if (scrollLeft <= 5) {
        disableButton(leftBtn);
      } else {
        enableButton(leftBtn);
      }

      if (scrollLeft >= maxScroll - 5) {
        disableButton(rightBtn);
      } else {
        enableButton(rightBtn);
      }
    };

    const updateAllScrollButtons = () => {
      const containers = document.querySelectorAll('.overflow-x-auto');
      containers.forEach(updateScrollButtons);
    };

    const handleDocumentClick = (e) => {
      const button = e.target.closest('button');
      if (!button) return;

      const container = findScrollContainer(button);
      if (!container) return;

      const buttons = findScrollButtons(container);
      if (buttons.length < 2) return;

      const [leftBtn, rightBtn] = buttons;
      const isLeft = button === leftBtn || leftBtn.contains(button);
      const isRight = button === rightBtn || rightBtn.contains(button);

      if (!isLeft && !isRight) return;

      e.preventDefault();
      e.stopPropagation();

      const scrollAmount = container.clientWidth * 0.75;
      if (isLeft) {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else if (isRight) {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    };

    const handleScroll = (e) => {
      const container = e.target;
      if (container && container.classList && container.classList.contains('overflow-x-auto')) {
        updateScrollButtons(container);
      }
    };

    // Add event listeners
    document.addEventListener('click', handleDocumentClick, true);
    document.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', updateAllScrollButtons);

    // Initial check (with multiple timeouts to ensure items & layout are fully rendered)
    const timers = [
      setTimeout(updateAllScrollButtons, 100),
      setTimeout(updateAllScrollButtons, 500),
      setTimeout(updateAllScrollButtons, 1000),
      setTimeout(updateAllScrollButtons, 2000),
    ];

    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
      document.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', updateAllScrollButtons);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div>
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n    \n@font-face {\n  font-family: 'Inter';\n  font-style:  normal;\n  font-weight: 300 600;\n  font-display: swap;\n  src: url('assets/_external/rsms.me/inter/font-files/InterVariable.woff2') format(\"woff2-variations\");\n}\n\n  ",
        }}
      />
      <div hidden />
      <div className="flex flex-col">
        <div className="flex min-h-screen flex-col">
          <div
            data-rht-toaster
            style={{
              position: "fixed",
              zIndex: 9999,
              inset: 16,
              pointerEvents: "none",
            }}
          />
          <Header />
          {/* ── Ice Jewellery Crypto Hero — appears FIRST ── */}
          <IceJewelleryCryptoHero />
          <div className="wrapper grow sm:pb-32">
            <main className="max-w-8xl mx-auto">

                {/* Vietnam Market Trending Section */}
                <div className="mx-auto max-w-(--breakpoint-2xl) mb-10 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex flex-col">
                    <span className="text-xl font-bold sm:text-2xl flex items-center gap-2">
                      🔥 Trending Products
                    </span>
                    <h1 className="text-gray-700 dark:text-gray-400 mt-2 font-medium">
                      Most Popular Products in Vietnam
                    </h1>
                  </div>
                  
                  <div className="relative w-full">
                    <div className="mt-4 no-scrollbar flex w-full gap-4 overflow-x-auto scroll-smooth pt-2 sm:gap-6 sm:pr-20 xl:gap-6 pb-2">
                      {[
                        { name: "Beauty & Skincare", icon: "🧴", img: "/assets/vietnam/kbeauty_serum.png", productsCount: "15 Products", discount: "Up to 20% Off" },
                        { name: "Electronics & Smartphones", icon: "📱", img: "/assets/vietnam/mid_range_smartphone.png", productsCount: "5 Products", discount: "Up to 15% Off" },
                        { name: "Audio & Earbuds", icon: "🎧", img: "/assets/vietnam/tws_earbuds.png", productsCount: "5 Products", discount: "Up to 20% Off" },
                        { name: "Smart Wearables", icon: "⌚", img: "/assets/vietnam/smartwatch_fitness.png", productsCount: "5 Products", discount: "Up to 15% Off" },
                        { name: "Home & Kitchen", icon: "🍳", img: "/assets/vietnam/air_fryer.png", productsCount: "10 Products", discount: "Up to 20% Off" },
                        { name: "Fashion & Apparel", icon: "👗", img: "/assets/vietnam/casual_dress.png", productsCount: "5 Products", discount: "Up to 20% Off" },
                        { name: "Fitness & Wellness", icon: "💪", img: "/assets/vietnam/resistance_bands.png", productsCount: "5 Products", discount: "Up to 20% Off" },
                        { name: "Health Supplements", icon: "💊", img: "/assets/vietnam/collagen_supplements.png", productsCount: "5 Products", discount: "Up to 20% Off" },
                        { name: "Smart Home", icon: "🏠", img: "/assets/vietnam/smart_home_devices.png", productsCount: "5 Products", discount: "Up to 20% Off" },
                        { name: "Pet Care", icon: "🐾", img: "/assets/vietnam/pet_accessories.png", productsCount: "5 Products", discount: "Up to 20% Off" },
                        { name: "Eco-Friendly Living", icon: "🌱", img: "/assets/vietnam/eco_friendly_products.png", productsCount: "5 Products", discount: "Up to 20% Off" },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                          data-brand-item="true"
                        >
                          <a href="#">
                            <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                              <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60 group overflow-hidden bg-white dark:bg-gray-800">
                                <img
                                  alt={item.name}
                                  className="rounded-xl object-cover transition duration-300 ease-in-out group-hover:scale-105"
                                  src={item.img}
                                  style={{
                                    position: "absolute",
                                    height: "100%",
                                    width: "100%",
                                    inset: 0,
                                    color: "transparent",
                                  }}
                                  title={item.name}
                                />
                                {item.discount && (
                                  <div className="absolute top-2 right-2 bg-red-600/90 backdrop-blur-xs text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow-md z-10">
                                    {item.discount}
                                  </div>
                                )}
                              </div>
                              <div className="mt-3 flex flex-row space-x-1.5 font-bold text-gray-900 dark:text-white items-center">
                                <span>{item.icon}</span>
                                <span className="truncate">{item.name}</span>
                              </div>
                              <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400 font-medium mt-0.5 ml-6">
                                {item.productsCount}
                              </span>
                            </div>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              <div>
                <div className="mx-auto max-w-(--breakpoint-2xl)">
                  <div className="mt-7 flex flex-row justify-between px-3 sm:mt-9 md:mr-32">
                    <div className="flex flex-col">
                      <span className="text-xl font-semibold sm:text-2xl">
                        Popular
                      </span>
                      <h1 className="text-gray-700 dark:text-gray-400">
                        Buy gift cards and mobile top ups with Bitcoin or
                        Crypto.
                      </h1>
                    </div>
                    <div className="flex flex-row pt-6">
                      <span className="text-base font-semibold whitespace-nowrap underline underline-offset-4">
                        <a
                          href="/products"
                          onClick={(e) => { e.preventDefault(); navigate('/products'); }}
                          style={{ cursor: 'pointer' }}
                        >
                          See all
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mx-auto hidden w-full max-w-(--breakpoint-2xl) md:block">
                  <div className="flex-end -mt-12 flex justify-end space-x-3 pr-3 2xl:pr-0 pointer-events-none">
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition duration-200 ease-in-out dark:bg-gray-800 pointer-events-none cursor-auto opacity-0">
                      <svg
                        aria-hidden="true"
                        className="h-10 w-10 text-gray-500 dark:text-gray-100"
                        data-slot="icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition duration-200 ease-in-out dark:bg-gray-800 cursor-pointer opacity-100">
                      <svg
                        aria-hidden="true"
                        className="h-10 w-10 text-gray-500 dark:text-gray-100"
                        data-slot="icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="relative w-full">
                  <div className="mt-3 no-scrollbar flex w-full gap-4 overflow-x-auto scroll-smooth pt-3 sm:gap-6 sm:pr-20 xl:gap-6 scroll-pl-2xl">
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Amazon.com"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Amazon.com"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Amazon.com</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $10 - $500
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Everything Apple"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Everything Apple"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Everything Apple</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $10 - $500
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="DoorDash"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/doordash_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/doordash_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/doordash_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/doordash_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/doordash_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/doordash_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/doordash_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/doordash_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/doordash_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/doordash_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/doordash_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/doordash_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/doordash_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/doordash_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/doordash_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/doordash_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="DoorDash"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">DoorDash</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $15 - $200
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Delta Air Lines"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Delta Air Lines"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Delta Air Lines</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $50 - $1,000
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Sportsmans Warehouse"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/sportsmans-warehouse_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/sportsmans-warehouse_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/sportsmans-warehouse_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/sportsmans-warehouse_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/sportsmans-warehouse_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/sportsmans-warehouse_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/sportsmans-warehouse_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/sportsmans-warehouse_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/sportsmans-warehouse_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/sportsmans-warehouse_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/sportsmans-warehouse_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/sportsmans-warehouse_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/sportsmans-warehouse_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/sportsmans-warehouse_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/sportsmans-warehouse_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/sportsmans-warehouse_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Sportsmans Warehouse"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">
                              Sportsmans Warehouse
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $15 - $500
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Best Buy"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Best Buy"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Best Buy</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $5 - $500
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Airbnb"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Airbnb"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Airbnb</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $50 - $500
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Lowe's"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/lowes_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/lowes_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/lowes_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/lowes_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/lowes_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/lowes_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/lowes_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/lowes_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/lowes_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/lowes_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/lowes_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/lowes_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/lowes_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/lowes_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/lowes_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/lowes_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Lowe's"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Lowe's</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $5 - $500
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <div className="mx-auto mt-3">
                  <h2 className="mx-auto max-w-(--breakpoint-2xl) text-gray-700 dark:text-gray-400 text-base px-3">
                    Pay with stablecoins and other crypto
                  </h2>
                  <div className="relative mx-auto flex flex-row justify-between">
                    <div className="no-scrollbar flex w-full gap-3 overflow-x-auto scroll-smooth pt-5 sm:gap-8 scroll-pl-2xl">
                      <div className="mx-auto flex w-64 flex-col items-center justify-center last:mr-20">
                        <a href="#">
                          <div className="w-14 flex-col justify-center sm:w-16">
                            <div className="relative mx-auto flex justify-center">
                              <svg
                                className="flex size-10 sm:size-14"
                                fill="none"
                                height={500}
                                viewBox="0 0 500 500"
                                width={500}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle
                                  cx={250}
                                  cy={250}
                                  fill="url(#paint0_linear_970_7)"
                                  r={250}
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M156.5 315.255H120C120 347.422 139.478 405.211 221 414.755C323.5 426.755 368.5 380.255 378 332.755C387.5 285.255 360 241.755 280.5 208.755C250.5 198.941 197.2 169.857 224 132.034C231.5 121.755 244.404 115.132 262 116.255C319.6 122.255 336.5 160.755 335 176.255H371.5C367.995 136.293 341 94.7554 269.5 84.7554C198 74.7554 146 109.255 131.5 143.255C117 177.255 113.332 250.716 212 283.255C309.032 315.255 301.5 383.255 239 383.255C169 383.255 156.167 338.089 156.5 315.255ZM196 124.255C155 143.255 113.8 215.755 255 267.755C315 289.852 335 335.255 307 373.255C342 354.255 383.5 287.755 266.5 240.755C154.639 197.732 182.656 148.145 193.388 129.149C194.505 127.173 195.435 125.528 196 124.255Z"
                                  fill="white"
                                  fillRule="evenodd"
                                />
                                <defs>
                                  <linearGradient
                                    gradientUnits="userSpaceOnUse"
                                    id="paint0_linear_970_7"
                                    x1={250}
                                    x2={250}
                                    y1={0}
                                    y2={500}
                                  >
                                    <stop stopColor="#FF8C5F" />
                                    <stop offset={1} stopColor="#FEC83A" />
                                  </linearGradient>
                                </defs>
                              </svg>
                              <span className="pointer-events-none absolute -top-3 left-1/2 z-5 -translate-x-1/2 rounded-full bg-primary-900 px-1.5 py-0.5 text-[10px] leading-none font-bold whitespace-nowrap text-white dark:bg-white dark:text-primary-900">
                                New
                              </span>
                            </div>
                            <span className="mx-auto mt-2 flex justify-center text-center text-xs font-bold sm:text-sm">
                              USDS
                            </span>
                          </div>
                        </a>
                      </div>
                      <div className="mx-auto flex w-64 flex-col items-center justify-center last:mr-20">
                        <a href="#">
                          <div className="w-14 flex-col justify-center sm:w-16">
                            <div className="relative mx-auto flex justify-center">
                              <svg
                                className="flex size-10 sm:size-14"
                                fill="none"
                                height={500}
                                viewBox="0 0 500 500"
                                width={500}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle
                                  cx={250}
                                  cy={250}
                                  fill="#EC0927"
                                  r={250}
                                />
                                <path
                                  d="M416.345 201.546C400.4 187.358 378.254 165.743 360.316 150.446L359.208 149.781C357.437 148.451 355.444 147.342 353.34 146.567C309.934 138.807 107.962 102.561 104.087 103.004C102.979 103.115 101.872 103.558 100.986 104.112L99.9897 104.888C98.7717 106.108 97.7751 107.549 97.2214 109.211L97 109.876V113.534V114.089C119.7 174.832 209.502 373.69 227.218 420.467C228.326 423.682 230.319 429.667 234.084 430H234.969C236.963 430 245.6 419.026 245.6 419.026C245.6 419.026 399.846 239.677 415.459 220.612C417.452 218.284 419.224 215.735 420.774 213.074C421.217 210.968 420.996 208.862 420.221 206.867C419.446 204.872 418.006 202.987 416.345 201.546ZM285.019 222.496L350.793 170.177L389.438 204.317L285.019 222.496ZM259.441 219.06L146.164 129.94L329.533 162.418L259.441 219.06ZM269.628 242.338L385.562 224.38L253.018 377.681L269.628 242.338ZM130.773 138.918L250.029 235.909L232.755 377.791L130.773 138.918Z"
                                  fill="white"
                                />
                              </svg>
                            </div>
                            <span className="mx-auto mt-2 flex justify-center text-center text-xs font-bold sm:text-sm">
                              TRX
                            </span>
                          </div>
                        </a>
                      </div>
                      <div className="mx-auto flex w-64 flex-col items-center justify-center last:mr-20">
                        <a href="#">
                          <div className="w-14 flex-col justify-center sm:w-16">
                            <div className="relative mx-auto flex justify-center">
                              <svg
                                className="flex size-10 sm:size-14"
                                fill="none"
                                height={500}
                                viewBox="0 0 500 500"
                                width={500}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clipPath="url(#clip0_2953_2)">
                                  <path
                                    d="M250 500C388.071 500 500 388.071 500 250C500 111.929 388.071 0 250 0C111.929 0 0 111.929 0 250C0 388.071 111.929 500 250 500Z"
                                    fill="#0098EA"
                                  />
                                  <path
                                    d="M335.36 139.533H164.631C133.24 139.533 113.343 173.395 129.136 200.769L234.504 383.401C241.38 395.326 258.611 395.326 265.487 383.401L370.876 200.769C386.648 173.439 366.751 139.533 335.381 139.533H335.36ZM234.418 328.632L211.471 284.221L156.101 185.191C152.448 178.853 156.96 170.731 164.609 170.731H234.397V328.654L234.418 328.632ZM343.847 185.17L288.498 284.242L265.551 328.632V170.709H335.339C342.988 170.709 347.499 178.831 343.847 185.17Z"
                                    fill="white"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_2953_2">
                                    <rect
                                      fill="white"
                                      height={500}
                                      width={500}
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                            </div>
                            <span className="mx-auto mt-2 flex justify-center text-center text-xs font-bold sm:text-sm">
                              TON
                            </span>
                          </div>
                        </a>
                      </div>
                      <div className="mx-auto flex w-64 flex-col items-center justify-center last:mr-20">
                        <a href="#">
                          <div className="w-14 flex-col justify-center sm:w-16">
                            <div className="relative mx-auto flex justify-center">
                              <svg
                                className="flex size-10 sm:size-14"
                                fill="none"
                                height={100}
                                viewBox="0 0 100 100"
                                width={100}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  fill="#30A1F5"
                                  height={100}
                                  rx={50}
                                  width={100}
                                />
                                <rect
                                  height={99}
                                  rx="49.5"
                                  stroke="#000"
                                  strokeOpacity=".06"
                                  width={99}
                                  x=".5"
                                  y=".5"
                                />
                                <path
                                  d="M60.41 26.75H39.59c-2.772 0-4.159 0-5.413.388a8.691 8.691 0 0 0-3.028 1.653c-1.005.846-1.754 2.012-3.254 4.344L21.277 43.43c-.99 1.54-1.486 2.311-1.62 3.122-.119.715-.04 1.45.228 2.123.304.764.951 1.411 2.247 2.707l24.59 24.59c1.148 1.148 1.721 1.722 2.383 1.936.582.19 1.208.19 1.79 0 .661-.214 1.235-.788 2.382-1.935l24.591-24.591c1.296-1.296 1.943-1.943 2.247-2.707a3.982 3.982 0 0 0 .228-2.123c-.134-.81-.63-1.581-1.62-3.122l-6.618-10.295c-1.5-2.332-2.25-3.498-3.254-4.344a8.692 8.692 0 0 0-3.028-1.653c-1.255-.388-2.64-.388-5.414-.388z"
                                  fill="#fff"
                                />
                                <path
                                  d="M56.469 34.871c.338-.914 1.631-.914 1.97 0l2.337 6.317c.14.38.44.679.819.82l6.317 2.337c.914.338.914 1.63 0 1.97l-6.317 2.337c-.38.14-.679.44-.82.818l-2.337 6.317c-.338.915-1.631.915-1.97 0l-2.337-6.317c-.14-.379-.44-.678-.819-.818l-6.316-2.338c-.915-.338-.915-1.631 0-1.97l6.316-2.337c.38-.14.679-.44.82-.819l2.337-6.317z"
                                  fill="#30A1F5"
                                />
                              </svg>
                              <span className="pointer-events-none absolute -top-3 left-1/2 z-5 -translate-x-1/2 rounded-full bg-primary-900 px-1.5 py-0.5 text-[10px] leading-none font-bold whitespace-nowrap text-white dark:bg-white dark:text-primary-900">
                                New
                              </span>
                            </div>
                            <span className="mx-auto mt-2 flex justify-center text-center text-xs font-bold sm:text-sm">
                              GRAM
                            </span>
                          </div>
                        </a>
                      </div>
                      <div className="mx-auto flex w-64 flex-col items-center justify-center last:mr-20">
                        <a href="#">
                          <div className="w-14 flex-col justify-center sm:w-16">
                            <div className="relative mx-auto flex justify-center">
                              <svg
                                className="flex size-10 sm:size-14"
                                fill="none"
                                height={500}
                                viewBox="0 0 500 500"
                                width={500}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M250 500C388.542 500 500 388.542 500 250C500 111.458 388.542 0 250 0C111.458 0 0 111.458 0 250C0 388.542 111.458 500 250 500Z"
                                  fill="#2775CA"
                                />
                                <path
                                  d="M318.75 289.582C318.75 253.125 296.875 240.625 253.125 235.417C221.875 231.25 215.625 222.917 215.625 208.332C215.625 193.747 226.042 184.375 246.875 184.375C265.625 184.375 276.042 190.625 281.25 206.25C282.292 209.375 285.417 211.457 288.542 211.457H305.207C309.375 211.457 312.5 208.332 312.5 204.167V203.125C308.332 180.207 289.582 162.5 265.625 160.417V135.417C265.625 131.25 262.5 128.125 257.292 127.082H241.667C237.5 127.082 234.375 130.207 233.332 135.417V159.375C202.082 163.542 182.292 184.375 182.292 210.417C182.292 244.792 203.125 258.332 246.875 263.542C276.042 268.75 285.417 275 285.417 291.667C285.417 308.335 270.832 319.792 251.042 319.792C223.957 319.792 214.582 308.332 211.457 292.707C210.417 288.542 207.292 286.457 204.167 286.457H186.457C182.292 286.457 179.167 289.582 179.167 293.75V294.792C183.332 320.832 200 339.582 234.375 344.792V369.792C234.375 373.957 237.5 377.082 242.707 378.125H258.332C262.5 378.125 265.625 375 266.667 369.792V344.792C297.917 339.582 318.75 317.707 318.75 289.582Z"
                                  fill="white"
                                />
                                <path
                                  d="M196.875 398.958C115.625 369.793 73.9576 279.168 104.168 198.958C119.793 155.208 154.168 121.875 196.875 106.25C201.043 104.168 203.125 101.043 203.125 95.833V81.2505C203.125 77.083 201.043 73.958 196.875 72.918C195.833 72.918 193.75 72.918 192.708 73.958C93.7501 105.208 39.5825 210.418 70.8325 309.375C89.5825 367.708 134.375 412.5 192.708 431.25C196.875 433.333 201.043 431.25 202.083 427.083C203.125 426.043 203.125 425 203.125 422.918V408.333C203.125 405.208 200 401.043 196.875 398.958ZM307.293 73.958C303.125 71.8755 298.958 73.958 297.918 78.1255C296.875 79.168 296.875 80.208 296.875 82.293V96.8755C296.875 101.043 300 105.208 303.125 107.293C384.375 136.458 426.043 227.083 395.833 307.293C380.208 351.043 345.833 384.375 303.125 400C298.958 402.083 296.875 405.208 296.875 410.418V425C296.875 429.168 298.958 432.293 303.125 433.333C304.168 433.333 306.25 433.333 307.293 432.293C406.25 401.043 460.418 295.833 429.168 196.875C410.418 137.5 364.583 92.708 307.293 73.958Z"
                                  fill="white"
                                />
                              </svg>
                            </div>
                            <span className="mx-auto mt-2 flex justify-center text-center text-xs font-bold sm:text-sm">
                              USDC
                            </span>
                          </div>
                        </a>
                      </div>
                      <div className="mx-auto flex w-64 flex-col items-center justify-center last:mr-20">
                        <a href="#">
                          <div className="w-14 flex-col justify-center sm:w-16">
                            <div className="relative mx-auto flex justify-center">
                              <svg
                                className="flex size-10 sm:size-14"
                                fill="none"
                                height={500}
                                viewBox="0 0 500 500"
                                width={500}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M250 500C388.071 500 500 388.071 500 250C500 111.929 388.071 0 250 0C111.929 0 0 111.929 0 250C0 388.071 111.929 500 250 500Z"
                                  fill="#26A17B"
                                />
                                <path
                                  d="M276.648 273.071V273.031C274.92 273.151 265.997 273.674 246.141 273.674C230.265 273.674 219.132 273.232 215.193 273.031V273.071C154.14 270.378 108.601 259.767 108.601 247.026C108.601 234.325 154.18 223.674 215.193 220.981V262.5C219.172 262.781 230.627 263.465 246.423 263.465C265.394 263.465 274.879 262.661 276.648 262.5V221.021C337.58 223.754 382.998 234.365 382.998 247.066C382.998 259.767 337.54 270.378 276.648 273.111M276.648 216.72V179.582H361.656V122.95H130.225V179.582H215.233V216.72C146.141 219.896 94.2122 233.561 94.2122 249.96C94.2122 266.359 146.182 280.024 215.233 283.24V402.291H276.688V283.24C345.659 280.064 397.508 266.399 397.508 250C397.508 233.641 345.659 219.936 276.688 216.76"
                                  fill="white"
                                />
                              </svg>
                            </div>
                            <span className="mx-auto mt-2 flex justify-center text-center text-xs font-bold sm:text-sm">
                              USDT
                            </span>
                          </div>
                        </a>
                      </div>
                      <div className="mx-auto flex w-64 flex-col items-center justify-center last:mr-20">
                        <a href="#">
                          <div className="w-14 flex-col justify-center sm:w-16">
                            <div className="relative mx-auto flex justify-center">
                              <svg
                                className="flex size-10 sm:size-14"
                                fill="none"
                                height={500}
                                viewBox="0 0 500 500"
                                width={500}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clipPath="url(#clip0_658_2)">
                                  <path
                                    d="M249.703 500C387.9 500 499.407 388.104 499.407 250.294C500 111.896 387.9 0 249.703 0C112.1 0 0 111.896 0 249.706C0 388.104 112.1 500 249.703 500Z"
                                    fill="#0071F3"
                                  />
                                  <path
                                    d="M289.443 100.118H262.159H201.661C192.171 100.118 183.274 107.185 182.088 117.197L176.157 157.244V157.833H146.501C138.79 157.833 132.266 164.311 132.266 171.967C132.266 180.212 138.79 186.101 146.501 186.69H171.412L167.26 214.37V216.726H137.604C129.893 216.726 123.369 223.204 123.369 230.86C123.369 238.516 129.893 244.994 137.604 244.994H162.515L148.873 330.978L144.721 359.835L142.349 375.147C140.57 387.515 149.466 398.115 161.922 398.115H180.902H206.999H228.351C237.841 398.115 246.145 391.048 247.924 381.036L260.38 302.12H267.497H291.222C346.975 302.12 392.646 256.184 391.459 200.236C390.866 143.11 344.603 100.118 289.443 100.118ZM200.475 185.512L289.443 186.101C297.153 186.101 304.271 192.58 304.271 200.824C304.271 209.069 297.746 215.548 289.443 215.548H195.73L200.475 185.512ZM290.036 271.496H275.208H268.09H253.262C243.772 271.496 235.469 278.563 233.689 288.575L221.234 367.491H172.005L190.985 243.816H289.443C313.167 243.816 332.74 224.382 332.74 200.824C332.74 177.267 313.167 157.833 289.443 157.833L205.22 157.244L209.372 128.975H291.222C331.554 128.975 363.583 161.955 362.99 202.002C361.803 240.872 329.182 271.496 290.036 271.496Z"
                                    fill="white"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_658_2">
                                    <rect
                                      fill="white"
                                      height={500}
                                      width={500}
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                            </div>
                            <span className="mx-auto mt-2 flex justify-center text-center text-xs font-bold sm:text-sm">
                              PYUSD
                            </span>
                          </div>
                        </a>
                      </div>
                      <div className="mx-auto flex w-64 flex-col items-center justify-center last:mr-20">
                        <a href="#">
                          <div className="w-14 flex-col justify-center sm:w-16">
                            <div className="relative mx-auto flex justify-center">
                              <svg
                                className="flex size-10 sm:size-14"
                                fill="none"
                                height={500}
                                viewBox="0 0 500 500"
                                width={500}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clipPath="url(#clip0_850_2)">
                                  <path
                                    d="M250.063 8.9397C383.278 8.9397 491.186 116.847 491.186 250.063C491.186 383.153 383.278 491.186 250.063 491.186C116.847 491.186 8.93945 383.153 8.93945 250.063C8.93945 116.847 116.847 8.9397 250.063 8.9397Z"
                                    fill="#111111"
                                    stroke="#111111"
                                    strokeWidth="7.0536"
                                  />
                                  <path
                                    d="M250.063 4.53296C114.455 4.53296 4.5332 114.455 4.5332 250.063C4.5332 385.671 114.455 495.593 250.063 495.593C385.671 495.593 495.593 385.671 495.593 250.063C495.593 114.455 385.671 4.53296 250.063 4.53296Z"
                                    fill="url(#paint0_radial_850_2)"
                                    fillOpacity="0.7"
                                  />
                                  <path
                                    d="M250.063 4.53296C114.455 4.53296 4.5332 114.455 4.5332 250.063C4.5332 385.671 114.455 495.593 250.063 495.593C385.671 495.593 495.593 385.671 495.593 250.063C495.593 114.455 385.671 4.53296 250.063 4.53296Z"
                                    stroke="url(#paint1_linear_850_2)"
                                    strokeWidth="7.1429"
                                  />
                                  <path
                                    clipRule="evenodd"
                                    d="M210.778 47.9729C115.966 66.2303 44.3213 149.71 44.3213 249.811C44.3213 349.912 115.966 433.392 210.778 451.65V432.385C126.416 414.379 63.2082 339.461 63.2082 249.811C63.2082 160.161 126.416 85.2431 210.778 67.2376V47.9729ZM289.348 67.3635V48.0988C384.034 66.4821 455.427 149.836 455.427 249.811C455.427 349.786 384.034 433.14 289.348 451.524V432.259C373.458 414.127 436.54 339.335 436.54 249.811C436.54 160.287 373.458 85.4949 289.348 67.3635Z"
                                    fill="white"
                                    fillRule="evenodd"
                                  />
                                  <path
                                    d="M279.149 243.012C294.888 246.034 306.975 251.826 315.663 260.262C324.351 268.572 328.632 279.275 328.632 292.244V312.768C328.632 328.381 322.966 340.972 311.76 350.541C300.554 359.985 285.696 364.644 267.439 364.644H261.143V397.255H239.486V364.644H232.813C220.725 364.644 210.148 361.999 200.831 356.585C191.639 351.045 184.336 343.364 179.174 333.543C174.137 323.47 171.619 312.012 171.619 298.917H193.276C193.276 312.138 196.928 322.966 204.105 331.277C211.534 339.335 221.355 343.49 233.316 343.49H266.809C278.645 343.49 288.214 340.72 295.517 335.18C302.694 329.388 306.346 321.959 306.346 312.768V292.244C306.346 284.941 303.576 278.771 298.162 273.609C292.873 268.446 285.696 265.172 276.505 263.662L222.236 254.092C207.001 251.322 195.039 245.53 186.603 236.842C178.167 228.028 173.886 217.074 173.886 203.853V186.603C173.886 170.99 179.3 158.65 190.128 149.459C201.209 140.015 215.815 135.356 233.82 135.356H239.234V102.745H260.891V135.356H267.817C284.941 135.356 298.665 140.896 309.116 151.977C319.567 162.805 324.855 177.285 324.855 195.165H303.198C303.198 183.455 299.924 174.012 293.503 166.96C287.081 159.909 278.519 156.384 267.817 156.384H233.694C222.236 156.384 213.044 159.154 206.245 164.694C199.446 169.982 196.046 177.285 196.046 186.477V203.727C196.046 211.156 198.564 217.452 203.601 222.614C208.889 227.776 215.94 231.176 225.006 232.813L279.149 243.012Z"
                                    fill="white"
                                  />
                                </g>
                                <defs>
                                  <radialGradient
                                    cx={0}
                                    cy={0}
                                    gradientTransform="translate(250.547 76.1825) rotate(90) scale(517.692 364.403)"
                                    gradientUnits="userSpaceOnUse"
                                    id="paint0_radial_850_2"
                                    r={1}
                                  >
                                    <stop
                                      offset="0.03125"
                                      stopColor="#3A3A3A"
                                    />
                                    <stop offset={1} stopColor="#1C1C1C" />
                                  </radialGradient>
                                  <linearGradient
                                    gradientUnits="userSpaceOnUse"
                                    id="paint1_linear_850_2"
                                    x1="250.031"
                                    x2="250.031"
                                    y1="9.59058e-05"
                                    y2="500.062"
                                  >
                                    <stop stopColor="white" />
                                    <stop offset={1} stopColor="#111111" />
                                  </linearGradient>
                                  <clipPath id="clip0_850_2">
                                    <rect
                                      fill="white"
                                      height={500}
                                      width={500}
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                            </div>
                            <span className="mx-auto mt-2 flex justify-center text-center text-xs font-bold sm:text-sm">
                              USDE
                            </span>
                          </div>
                        </a>
                      </div>
                      <div className="mx-auto flex w-64 flex-col items-center justify-center last:mr-20">
                        <a href="#">
                          <div className="w-14 flex-col justify-center sm:w-16">
                            <div className="relative mx-auto flex justify-center">
                              <svg
                                className="flex size-10 sm:size-14"
                                fill="none"
                                height={500}
                                viewBox="0 0 500 500"
                                width={500}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M250 500C388.071 500 500 388.071 500 250C500 111.929 388.071 0 250 0C111.929 0 0 111.929 0 250C0 388.071 111.929 500 250 500Z"
                                  fill="#988430"
                                />
                                <path
                                  d="M250 491.992C383.649 491.992 491.992 383.649 491.992 250C491.992 116.352 383.649 8.00806 250 8.00806C116.352 8.00806 8.00806 116.352 8.00806 250C8.00806 383.649 116.352 491.992 250 491.992Z"
                                  fill="#7A6A2A"
                                />
                                <path
                                  d="M250 486.893C380.833 486.893 486.893 380.833 486.893 250C486.893 119.167 380.833 13.1067 250 13.1067C119.167 13.1067 13.1067 119.167 13.1067 250C13.1067 380.833 119.167 486.893 250 486.893Z"
                                  fill="#BA9F33"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M109.304 223.301C107.888 222.008 106.392 220.712 105.016 219.419C103.64 218.125 102.227 216.829 100.811 215.536L96.6027 211.536C95.9147 210.848 95.1867 210.243 94.4987 209.552C93.8107 208.947 93.0027 208.259 92.3147 207.651C86.7307 202.352 81.1147 197.053 75.608 191.752C81.312 196.971 86.896 202.152 92.6 207.448L94.5813 209.432C95.2693 210.117 95.9973 210.725 96.6853 211.413L100.891 215.296C102.307 216.589 103.683 217.885 105.099 219.296C106.515 220.707 107.891 222.005 109.307 223.296L109.304 223.301ZM35.1947 222.501C35.1947 222.501 55.5013 224.603 65.4133 226.019C74.5947 227.315 103.317 231.723 103.317 231.723L35.1947 222.501ZM35.1947 222.501C40.8987 222.987 46.6027 223.592 52.3067 224.2C55.2187 224.483 58.0107 224.805 60.8027 225.088L65.088 225.576C66.504 225.776 67.88 225.979 69.296 226.181L86.288 228.891L94.7813 230.307C97.5733 230.792 100.365 231.32 103.277 231.805C100.485 231.523 97.5733 231.117 94.7813 230.712L86.288 229.499L69.296 226.992C67.88 226.789 66.504 226.504 65.088 226.304L60.8 225.811C58.008 225.528 55.096 225.123 52.304 224.797C46.6 224.112 40.896 223.381 35.192 222.493L35.1947 222.501ZM101.296 237.013C101.296 237.013 79.6133 242.517 72.2907 244.621C65.0907 246.603 43.2854 253.237 43.2854 253.237L101.293 237.016L101.296 237.013Z"
                                  fill="#CFB66C"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M101.293 237.013C96.48 238.429 91.6933 239.805 86.8107 241.101L72.328 244.984C67.5147 246.4 62.728 247.776 57.928 249.192L50.728 251.173C48.3413 251.861 45.9147 252.467 43.448 253.157C45.832 252.357 48.2613 251.539 50.648 250.851L57.848 248.547C62.6613 247.048 67.448 245.632 72.248 244.136C77.1413 242.923 81.9573 241.627 86.8507 240.453C91.5013 239.28 96.3973 238.109 101.293 237.016V237.013ZM46.32 266.587C48.704 265.696 76.2133 252.875 82.6053 249.88C85.8053 248.381 95.1067 245.08 95.1067 245.08L46.32 266.587Z"
                                  fill="#CFB66C"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M46.3199 266.587C48.4213 265.787 50.4053 264.808 52.4266 263.877L58.4133 261.085L70.4293 255.301C74.4293 253.4 78.3173 251.301 82.4426 249.515C84.5466 248.627 86.6506 247.899 88.7519 247.211L91.9519 246.2C93.0426 245.917 94.0559 245.592 95.1519 245.309C91.1519 247.211 86.9413 248.829 82.9359 250.688C78.9359 252.672 74.8453 254.291 70.7173 256.069L58.5013 261.448C54.3999 263.109 50.3999 264.888 46.3173 266.587H46.3199ZM48.9866 277.787C48.9866 277.787 73.9039 263.184 82.4799 258.491C86.9706 255.984 101.493 248.781 101.493 248.781L48.9866 277.787Z"
                                  fill="#CFB66C"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M48.9894 277.792C53.1947 275.203 57.4827 272.573 61.7707 269.904L68.1707 266.019C70.3547 264.725 72.4587 263.512 74.6854 262.219C76.8694 260.923 78.9734 259.629 81.1974 258.416C82.2561 257.762 83.3654 257.194 84.5147 256.717L87.912 255.019C92.4027 252.835 96.8934 250.608 101.627 248.707C97.3387 251.419 92.928 253.725 88.52 256.109C86.336 257.323 84.1094 258.416 81.9254 259.629C79.7414 260.843 77.6374 262.139 75.4107 263.312C73.2267 264.605 71.1227 265.819 68.8987 266.992L62.304 270.592L48.9947 277.792H48.9894ZM101.293 251.981C101.293 251.981 85.8 263.875 80.784 267.677C75.768 271.48 61.0027 282.16 61.0027 282.16L101.293 251.981Z"
                                  fill="#CFB66C"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M190.211 347.896L182.283 332.888L186.893 314.117L219.781 301.416L205.784 272.696L212.701 243.691L225.688 217.717L265.819 211.408L295.307 183.293L358.981 188.107L371.48 256.189L347.411 341.909L333.699 386.288L278.115 388.392L252.307 370.512L222.088 357.888L190.211 347.896Z"
                                  fill="#E2CC85"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M287.704 347.411C287.704 347.411 280.016 350.931 266.904 350.12C263.109 345.024 236.533 342.637 236.533 342.637C236.533 342.637 233.216 341.627 227.349 344.053C221.445 346.453 215.861 346.157 210.643 347.451C205.424 348.744 200.243 341.949 196.243 340.533C192.243 339.037 186.939 335.437 186.939 335.437L175.739 334.344L153.248 324.837L117.517 289.24L107.808 304.44L104.813 323.251L115.616 345.541L144.701 372.037L201.416 386.437L235.032 376.533L277.144 358.733L287.704 347.408V347.411Z"
                                  fill="#F1D789"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M86.2054 221.603L93.4054 199.8L101.984 185.72L129.611 183.413L121.317 207.605L98.2214 248.707L107.808 285.397L90.8187 293.891L85.5974 285.883L81.392 267.517L81.1094 246.885L86.2054 221.603Z"
                                  fill="#F4ECB4"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M117.192 345.915L111.893 338.512C111.893 338.512 110.477 334.992 111.288 331.917C112.088 328.803 111.973 328.6 111.571 327.427C111.168 326.253 107.768 322.208 107.971 318.728C108.171 315.208 107.688 314.035 110.275 311.245C112.984 308.536 112.176 303.843 112.176 303.843L115.696 306.027L116.496 304.813C116.496 304.813 117.789 305.824 117.789 307.403C118.072 305.219 116.899 295.104 119.568 292.8C122.237 290.496 126.971 303.6 126.971 303.6L124.059 284.587L116.573 265.091L103.264 247.291L102.464 227.669V225.971C102.464 225.971 96.3547 235.357 94.6561 242.771C93.4427 247.867 96.3547 254.056 95.7494 261.379C95.2614 268.661 94.6561 268.093 96.4347 270.979C98.2134 273.864 102.544 279.797 100.845 284.085C99.3494 287.768 94.2507 285.179 94.2507 285.179C94.2507 285.179 93.2401 288.171 91.8641 289.264C91.3787 287.485 90.8534 286.352 89.8827 285.264C89.8001 285.952 89.6001 286.883 89.6001 286.883C89.6001 286.883 88.7094 284.091 87.8187 280.571C86.6081 275.88 85.3121 269.691 84.1387 266.373C83.6534 268.275 82.4401 274.059 82.4401 274.059L83.1281 282.96L86.4454 295.176L89.6454 303.176L92.7601 312.965L95.4667 319.541L97.6507 324.557L99.5521 335.845L108.733 345.552L113.629 347.739L117.187 345.917L117.192 345.915Z"
                                  fill="#F3E19D"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M91.0187 203.803C91.0187 203.803 84.424 215.003 82.5253 226.293C80.6267 237.584 78.9253 249.515 80.1253 264.885C81.3387 280.381 83.6453 289.885 85.5067 296.683C88.7067 307.971 96.9947 323.667 96.9947 323.667L97.2773 323.059C95.8842 320.418 94.7723 317.638 93.96 314.765C92.8667 310.477 92.4613 305.381 91.4507 303.075C90.56 300.771 89.064 298.787 88.336 295.955C87.648 293.245 87.536 288.957 85.424 285.763C84.5333 284.467 83.44 281.069 83.1173 277.672C82.712 272.573 83.32 266.869 82.8347 262.179C81.944 254.371 81.3387 249.072 82.1467 244.984C82.9547 240.896 87.1653 229.291 89.7547 220.067C91.4533 214.16 90.44 209.184 93.5547 204.045C96.6693 198.949 98.5733 194.459 99.2587 191.344C100.059 188.512 91.008 203.803 91.008 203.803H91.0187Z"
                                  fill="#F2E8B0"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M122.291 199.312C122.291 199.312 118.893 200.325 117.275 202.104C115.656 203.803 114.968 205.219 112.784 208.091C110.6 210.963 110.477 213.309 108.696 216.909C106.917 220.429 102.992 225.728 102.507 227.629C102.021 229.531 101.213 238.429 100.203 242.637C99.312 246.845 101.213 252.024 101.213 252.024L103.517 251.536C103.517 251.536 103.517 254.531 105.824 256.555C108.128 258.536 108.533 249.837 108.533 249.837L117.149 220.752L130.133 211.933L131.549 204.813L122.285 199.312H122.291Z"
                                  fill="#F5EEC0"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M128.6 212.501C128.6 212.501 122.491 212.904 119.499 215.091C118.285 215.979 117.8 216.707 116.507 217.8C114.12 219.781 111.691 221.603 110.52 224.2C109.224 226.787 107.808 230.712 106.837 238.115C106.432 241.229 106.432 244.101 106.149 246.611C105.744 250.008 105.139 252.717 105.461 254.611C105.867 258.493 109.872 260.517 110.261 264.925L118.555 260.72L126.363 229.933L142.949 219.533L133.563 209.016L128.589 212.483L128.6 212.501Z"
                                  fill="#E6DB9D"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M84.848 419.811C84.8827 419.507 84.9173 419.203 84.952 418.891C86.1627 408.491 86.368 400.608 87.256 395.672C88.5493 388.675 89.44 386.072 89.2373 383.453C88.9547 379.248 88.632 376.173 89.0373 372.936C89.6427 368.648 93.8507 363.552 93.7307 360.032C93.648 357.24 92.232 355.421 91.0187 353.723C89.8053 352.024 88.8347 350.608 88.8347 350.608C88.8347 350.608 97.128 344.904 97.048 321.925C97.2174 321.973 97.3803 322.041 97.5333 322.128L101.619 333.736L104.411 337.133L115.131 357.117L128.925 370.509L149.312 384.221L162.096 398.133L163.389 435.229L146.683 456.912L143.947 461.867C122.21 450.954 102.277 436.77 84.8453 419.808L84.848 419.811Z"
                                  fill="#E5CB7A"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M135.883 455.299C135.883 455.299 136.165 450.688 139.968 447.693C140.576 448.704 140.979 449.677 140.859 450.403C141.547 449.192 146.36 441.424 157.243 439.4C168.125 437.419 170.755 429.491 170.755 429.491L193.851 408.496L220.267 384.184L252.387 372.896L267.397 369.213C267.397 369.213 267.68 370.307 267.115 372.733C269.904 372.533 276.093 371.117 282.525 368.851C285.115 367.84 287.544 367.435 288.837 368.771C290.739 370.549 291.021 374.757 291.141 377.264C294.256 376.576 297.856 373.584 300.741 373.867C305.355 374.352 309.44 379.773 314.133 379.773C320.323 379.773 323.112 375.971 327.443 372.976C330.032 371.197 333.752 368.976 335.856 367.475C340.872 363.792 393.947 347.571 393.947 347.571L412.555 348.784L415.549 368.768L413.949 421.008C413.752 421.197 413.555 421.395 413.355 421.584L328.747 465.773L211.467 483.752C185.196 479.46 159.843 470.74 136.491 457.963L135.891 455.296L135.883 455.299Z"
                                  fill="#D8C173"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M91.96 426.456C93.6266 422.971 95.1253 420.056 95.3893 419.013C95.5973 421.115 95.9786 425.725 96.7466 430.627C95.1342 429.256 93.5386 427.865 91.96 426.453V426.456Z"
                                  fill="#F1D789"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M177.632 475.619L192.8 471.4L194.093 471.805C194.093 471.805 194.781 472.211 194.781 473.584C196.683 472.493 198.301 472.693 199.475 471.968C200.08 473.261 200.685 477.549 203.357 478.075C206.147 478.683 209.141 476.861 212.176 474.557C215.168 472.171 218.576 469.176 221.155 467.963C222.101 469.702 222.939 471.499 223.664 473.341C227.061 470.632 232.968 459.629 241.381 459.829C243.813 454.083 247.876 449.175 253.067 445.712C260.875 440.413 265.768 440.008 271.877 440.493C274.304 437.341 277.294 434.667 280.696 432.605C281.707 433.011 284.499 434.709 287.979 433.091C291.499 431.475 295.461 425.203 300.68 424.395C303.492 424.008 306.352 424.608 308.771 426.093C308.771 426.093 323.971 411.003 334.459 405.987C334.053 404.773 333.245 400.203 345.541 390.088C346.229 390.696 345.744 392.395 346.229 392.488C346.429 392.488 349.429 391.195 353.227 388.28C357.92 384.763 363.541 381.08 366.939 380.069C373.339 378.168 380.128 382.051 380.128 382.051C380.705 381.646 381.349 381.344 382.029 381.16C383.645 380.877 384.819 380.675 385.709 380.36C385.629 382.464 386.803 386.064 385.709 389.179C386.976 389.891 388.317 390.461 389.709 390.877C389.024 392.373 387.525 396.176 385.019 397.997C387.12 399.008 387.403 400.181 390.397 401.197C389.184 402.896 387.197 405.811 386.312 407.597C385.421 409.499 382.224 417.387 380.808 420.379C379.312 423.373 377.291 428.875 376.317 429.979C375.344 431.083 371.827 435.763 369.117 438.067C371.517 437.176 381.336 434.184 385.501 433.051C384.261 434.869 377.976 444.195 371.933 453.163C343.001 470.504 310.706 481.48 277.198 485.359C243.691 489.238 209.742 485.931 177.613 475.659L177.632 475.619Z"
                                  fill="#E0CD81"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M129.6 211.408C129.6 211.408 126.083 211.408 125.395 211.893C124.707 212.379 128.915 213.392 130.208 213.877C131.501 214.363 134.293 216.587 135.021 218.368C135.709 220.067 160.304 229.976 160.304 229.976L177.699 229.085L183.696 220.8L172.288 210.808L180.288 187.224L169.691 188.923L144.205 204.123L131.421 209.019L129.6 211.408Z"
                                  fill="#DFC57C"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M167.8 219.216C168.052 219.623 168.406 219.957 168.827 220.184C169.248 220.411 169.722 220.523 170.2 220.509C173.8 220.509 177.115 221.4 178.491 223.219C180.797 226.133 187.189 235.437 187.189 235.437L202.48 240.939L203.467 222.933L186.76 211.325L167.747 218.323V219.213H167.789L167.8 219.216Z"
                                  fill="#E5CC7C"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M164.8 225.891C164.8 225.891 167.589 226.093 171.109 224.797C174.629 223.501 180.413 220.712 182.923 221.805C186.44 223.301 185.712 227.995 189.517 232.205C191.821 234.795 196.029 234.715 198.416 237.507C200.803 240.299 209.013 239.003 209.013 239.003L212.128 255.803L199.629 271.824L195.541 291.725H178.64L163.2 285.6L155.595 267.2L159.397 248.592L164.8 225.891Z"
                                  fill="#D2C281"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M197.493 226.699C197.912 226.828 198.348 226.896 198.787 226.901C198.301 227.307 197.288 228.195 197.693 230.501C198.099 232.808 199.392 235.72 198.301 237.499C199.172 238.451 199.821 239.583 200.203 240.816C200.891 242.8 201.093 244.619 205.581 244.904C204.934 245.303 204.336 245.778 203.803 246.32C203.803 246.32 206.917 249.029 208.496 251.536C210.112 251.467 214.4 250.133 214.4 250.133L215.291 250.741L217.192 249.941C217.192 249.941 215.413 249.253 216.707 244.925C217.92 241.123 219.013 241.325 219.107 241.043C219.2 240.76 219.997 236.755 219.997 235.136C220.603 233.035 221.088 226.643 221.088 226.643L219.795 212.525L212.515 208.115L206.595 202.4L201.011 212.917L197.333 216.584L197.051 225.685L197.493 226.699Z"
                                  fill="#E2C270"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M215.008 214.888C215.008 214.888 216.301 218.568 216.789 221.4C216.961 220.849 217.056 220.278 217.072 219.701C217.072 219.701 218.083 225.285 218.283 227.592C218.688 227.509 219.083 227.389 219.173 227.792C219.264 228.195 220.187 232.688 219.973 235.195C221.658 232.416 223.989 230.085 226.768 228.4C228.387 227.387 230.288 226.296 232.272 226.213C235.387 226.133 237.651 228.197 241.373 228.197C250.352 228.197 258.485 221.603 264.472 219.581C268.88 218.083 272.683 216.992 275.352 214.563C276.648 213.472 278.955 211.045 281.056 207.443C283.848 202.643 286.76 198.464 289.675 197.939C288.356 198.181 287.014 198.276 285.675 198.221C285.675 198.221 286.565 197.331 288.075 196.117C289.584 194.904 291.392 193.408 293.979 193.408C298.592 193.408 300.896 194.093 303.485 194.093C306.075 194.013 307.571 193.408 307.571 193.408C307.571 193.408 310.283 195.309 316.389 195.309C322.499 195.389 326.584 195.915 329.781 196.2C332.979 196.485 343.696 195.309 346.771 195.4C348.775 195.477 350.744 195.959 352.557 196.816L342.645 168.016L307.04 136.896L285.843 151.904L253.235 184.509L221.683 196.2L215.088 203.603V214.888H215.008Z"
                                  fill="#CCB360"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M285.803 198.381C285.803 198.381 286.693 197.493 288.187 196.28C289.68 195.067 291.507 193.568 294.093 193.568C298.704 193.568 301.011 194.256 303.6 194.256C306.189 194.176 307.685 193.568 307.685 193.568C307.685 193.568 310.4 195.467 316.504 195.467C322.613 195.547 326.699 196.072 329.896 196.355C333.093 196.637 343.811 195.467 346.885 195.555C348.889 195.63 350.857 196.112 352.669 196.971L348.179 183.984L342.963 174.075L328.075 157.771C328.075 157.771 310.208 147.253 310.072 147.173C309.992 147.093 303.883 145.475 303.883 145.475L287.701 155.264L273.019 193.251L272.736 201.251L282.24 205.741C284.627 201.741 287.259 198.541 289.725 198.136C287.499 198.379 285.8 198.379 285.8 198.379L285.803 198.381Z"
                                  fill="#D5B457"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M285.6 201.093C284.184 201.173 283.013 200.891 282.688 199.88C281.475 196.483 280.504 195.997 279.488 195.997C278.472 195.997 277.101 198.181 276.288 198.381C275.475 198.581 274.509 195.875 274.509 195.875L273.619 195.469C273.619 195.469 268.4 198.867 264.72 202.872C261.04 206.877 255.011 213.675 252.301 214.885C249.592 216.096 240.285 216.504 237.101 217.192C233.917 217.88 230.387 220.187 229.901 220.712C229.416 221.237 231.32 221.803 231.603 222.328C231.885 222.813 228.485 222.611 228.203 223.128C228.003 223.533 229.003 225.837 229.499 227.011C230.367 226.579 231.319 226.344 232.288 226.323C235.403 226.243 237.669 228.307 241.389 228.307C250.371 228.307 258.501 221.712 264.488 219.688C268.899 218.192 272.701 217.099 275.371 214.672C276.664 213.581 278.971 211.152 281.075 207.552C282.611 205.085 284.109 202.779 285.608 201.08L285.6 201.093Z"
                                  fill="#D2B257"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M156.8 401.296C156.8 401.296 156 398.301 148.587 390.576C146.483 388.392 145.189 386.576 143.773 385.277C140.253 381.957 138.189 381.069 135.683 379.168C130.181 375.083 124.195 375.083 119.584 370.067C114.973 365.051 109.6 355.467 105.867 345.672C102.187 335.883 101.173 332.768 101.173 332.485C101.173 332.203 102.187 330.301 103.48 330.584C104.773 330.867 104.773 333.373 105.099 333.981C105.743 334.974 106.474 335.907 107.283 336.771C109.184 338.957 111.893 341.571 113.269 345.469C112.987 342.152 111.853 338.472 111.853 338.472C111.853 338.472 118.973 342.963 125.04 347.653C131.149 352.347 133.656 353.965 135.44 356.957C137.224 359.949 141.427 367.84 143.44 370.147C145.453 372.453 173.04 381.149 173.04 381.149L186.163 390.933L192.677 405.213L187.579 413.213L177.789 415.317L161.891 408.197L156.8 401.293V401.296Z"
                                  fill="#D2B159"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M121.48 352.104C121.48 352.104 124.797 357.403 132.888 362.419C140.171 366.829 151.699 370.835 161.976 373.221C167.88 374.637 173.787 375.728 179.085 375.811C193.365 376.011 203.195 371.928 215.373 370.592C221.968 369.904 230.059 369.379 238.472 367.392C249.272 364.803 255.664 361.888 264.363 357.792C270.672 354.88 276.459 352.696 281.149 349.904C287.744 346.021 292.557 341.693 298.141 340.4C297.453 342.301 296.725 345.699 291.224 349.219C294.136 349.136 298.141 348.936 298.141 348.936C298.141 348.936 294.259 351.24 287.421 356.419C283.213 359.619 277.632 365.035 271.928 368.635C268.245 370.941 264.24 372.635 261.611 374.016C255.211 377.536 252.629 379.315 248.424 383.616C249.92 383.536 250.043 383.616 250.043 383.616C250.043 383.616 244.741 384.304 240.941 386.325C240.141 386.325 238.755 386.043 236.328 386.731C234.427 387.336 231.917 388.715 229.331 389.44C225.648 390.533 224.437 390.048 224.437 390.048L225.043 391.261C225.043 391.261 220.243 391.179 218.643 391.341C218.925 391.421 218.845 391.544 218.845 391.544C218.564 391.591 218.294 391.687 218.045 391.827C217.275 392.325 216.428 392.694 215.539 392.917C215.053 392.997 214.648 392.997 214.04 393.12C214.243 393.605 215.821 396.32 216.549 397.92C215.944 398.325 206.84 405.203 206.84 405.203C207.122 405.647 207.353 406.122 207.528 406.619C207.811 407.507 207.933 408.803 208.216 409.408C208.901 410.621 209.307 410.824 209.307 410.824C209.307 410.824 208.216 411.027 206.312 411.512C204.696 411.917 202.712 412.603 199.912 413.008C199.053 413.12 198.189 413.187 197.323 413.211C197.728 414.101 199.507 417.499 196.229 421.421C192.952 425.344 191.941 425.915 190.931 428.421C190.422 428.037 189.88 427.697 189.312 427.408C188.221 426.923 186.723 426.197 186.197 425.224C185.891 426.521 185.485 427.792 184.984 429.027C183.973 431.736 182.477 434.408 182.195 436.429C181.101 435.216 179.08 432.829 176.288 433.315C173.496 433.8 171.272 437.603 170.787 438.696C170.787 438.008 170.301 437.483 170.181 438.291C170.099 439.181 168.563 448.483 159.987 456.008C159.907 454.107 159.907 449.899 159.704 448.525C158.904 449.325 157.925 450.507 152.099 453.016C146.395 455.523 147.299 458.032 147.299 458.032C147.299 458.032 146.813 454.032 149.888 449.819C153.003 445.613 154.904 443.629 154.904 443.307C154.854 442.978 154.713 442.67 154.499 442.416C154.093 442.011 153.285 441.525 153.285 441.203C153.771 441.003 158.584 438.696 158.301 433.92C158.019 429.635 156.2 427.408 154.904 425.832C154.704 425.629 156.808 424.133 156.523 423.648C156.32 423.365 153.733 421.461 153.408 420.448C153.484 419.843 153.62 419.247 153.813 418.669C154.096 417.779 154.299 417.171 154.219 416.565C154.016 415.555 152.923 412.763 152.6 412.48C152.883 412.56 154.904 412.48 154.904 412.48C154.904 412.48 153.288 409.891 153.003 408.677C152.717 407.464 152.112 404.267 151.789 403.661C152.477 403.741 154.176 403.861 154.176 403.661C154.259 403.053 152.68 402.043 153.376 401.261C153.861 401.341 154.792 401.747 155.68 402.88C155.195 401.584 154.387 399.077 152.685 398.067C153.485 397.784 156.205 397.053 158.592 398.469C160.979 399.885 161.792 401.867 161.792 401.867C161.792 401.867 163.208 402.96 165.395 404.579C167.901 406.56 171.096 409.379 176.195 411.373C177.288 411.981 180.077 411.981 182.101 411.576C182.983 411.366 183.828 411.025 184.608 410.565C184.89 410.399 185.188 410.263 185.499 410.16C185.064 409.287 184.564 408.448 184.003 407.651C184.691 407.651 185.499 407.733 185.499 407.733C185.499 407.733 185.984 406.64 183.8 404.533C184.285 404.048 184.893 403.733 184.893 402.915C184.205 402.835 182.992 401.824 182.709 401.419C183.112 401.136 183.72 400.205 184.408 399.923C183.8 399.437 182.304 397.413 181.616 397.213C182.273 396.969 182.909 396.671 183.517 396.323C183.517 396.323 180.12 395.432 179.027 394.704C177.933 393.904 176.317 392.52 175.347 392.115C174.333 391.709 172.555 391.509 171.827 390.699C172.512 390.901 173.605 390.699 174.416 390.699C175.021 390.699 175.307 390.779 175.507 390.779C175.427 390.496 175.427 389.888 177.005 389.688C177.765 389.573 178.501 389.341 179.189 389C179.189 389 177.691 388.92 175.989 387.301C174.288 385.683 172.875 384.389 171.904 384.187C170.893 383.984 168.992 384.875 167.819 384.792C166.2 384.592 165.512 383.781 165.512 383.781C165.512 383.781 160.133 384.267 148.2 376.987C137.883 370.675 133.392 365.093 133.392 365.093C132.426 364.743 131.493 364.309 130.603 363.797C126.72 361.776 121.339 357.568 121.501 352.064L121.48 352.104Z"
                                  fill="#C2A44D"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M270.307 109.304C271.243 109.608 272.074 110.169 272.707 110.923C274.608 113.107 275.821 117.232 271.493 121.643C273.192 122.248 273.893 122.443 275.376 122.248C273.88 124.029 270.483 127.832 270.28 131.149C270.077 133.859 271.776 134.669 271.776 134.669C271.776 134.669 269.187 137.661 269.067 142.669C270.289 141.29 271.628 140.018 273.067 138.867C276.061 136.48 280.187 133.771 282.979 132.072C282.941 132.784 283.037 133.497 283.261 134.173C283.261 134.173 288.477 129.885 292.861 131.789C294.843 132.68 293.952 135.469 293.952 135.469C293.952 135.469 296.664 134.459 298.565 136.36C300.467 138.261 303.155 143.165 304.533 145.067C305.139 145.957 306.717 147.656 308.333 150.285C310.541 153.967 312.384 157.854 313.837 161.893C313.917 159.789 314.443 156.515 320.432 158.576C326.419 160.68 333.213 165.091 338.917 173.776C344.621 182.461 346.035 192.267 348.907 196C351.819 199.6 354.813 205.587 355.016 208.096C355.219 210.605 354.125 218.693 360.112 240.579C361.811 233.784 364.4 218.693 364.4 218.693L365.816 205.384L367.435 164.203L324.432 128.477L290.816 104.083L268.931 106.187L270.304 109.301L270.307 109.304Z"
                                  fill="#CAA13E"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M350.203 170.589C350.203 170.589 349.595 166.589 339.483 159.789C329.368 153.075 321.48 153.075 314.2 147.371C308.616 142.88 302.792 132.563 299 129.165C295.317 125.808 294.712 116.099 294.712 116.099L307.131 105.699L325.6 79.0028L341.213 61.8108L348.696 72.2108L359.096 84.4268L364.88 108.941L366.984 144.824L350.184 170.592L350.203 170.589Z"
                                  fill="#B59544"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M362.704 213.6C363.01 208.158 362.338 202.706 360.72 197.501C358.053 189.208 352.227 174.483 349.52 168.968C348.427 162.859 349.237 162.373 350.411 161.685C351.584 160.997 355.995 158.485 358.411 149.672C360.827 140.859 368.323 140.571 368.323 140.571L372.933 137.173L379.933 154.688L386.04 170.507L387.941 182.603L389.357 192.917L386.04 214.723L369.659 229.528L362.701 213.6H362.704Z"
                                  fill="#C89D3A"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M134.104 456.637V456.189C134.444 455.976 134.745 455.706 134.992 455.389C135.275 454.984 135.48 454.499 135.68 454.379C136.085 454.176 137.987 453.579 138.997 453.771C140.008 453.963 142.68 455.064 144.096 454.984C147.008 454.904 150.405 452.677 155.787 453.691C163.877 455.187 165.779 460.688 170.472 463.803C173.672 465.989 176.984 465.016 177.469 465.016H178.56C178.763 465.016 180.259 463.317 181.069 463.4C182.688 463.48 182.848 464.816 183.859 464.896C186.245 465.179 190.859 463.683 193.165 464.291C193.849 464.505 194.471 464.881 194.978 465.388C195.485 465.894 195.862 466.516 196.077 467.2C196.563 468.696 196.157 470.597 194.984 471.691C192.477 473.995 190.091 476.181 189.605 478.091C190.223 478.561 190.815 479.063 191.381 479.595C171.366 474.495 152.108 466.784 134.104 456.661V456.637Z"
                                  fill="#CEB052"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M349.515 375.811C349.515 375.811 355.824 367.397 358.011 363.229C360.195 358.933 351.093 304.533 351.093 304.533L369.379 244.624L368.891 225.125C368.891 225.125 369.781 207.123 371.885 199.315C374.395 203.805 382.203 209.227 383.901 212.099C384.701 206.595 387.419 194.987 387.016 182.608C388.512 184.912 392.112 208.093 392.112 208.093L395.712 223.707L400.405 240.293L405.624 257.811L408.739 269.907L410.517 272.819L412.016 277.915L413.432 283.419L417.517 296.323L419.917 306.92L421.819 326.136C422.232 327.607 422.53 329.109 422.709 330.627C422.789 332.731 422.427 333.944 422.427 334.309C422.427 334.675 423.115 338.92 422.832 342.117C422.427 345.317 422.427 347.821 419.917 350.117C417.408 352.413 415.832 366.136 415.832 366.136L411.341 363.144C411.341 363.144 412.232 359.056 410.128 355.336C408.024 351.616 403.939 350.845 401.632 351.453C399.328 351.939 394.717 352.664 393.219 353.96C391.803 355.253 388.325 359.259 385.128 361.08C381.128 363.48 374.611 363.669 371.133 364.477C367.613 365.277 363.731 367.677 359.643 370.464C356.437 372.539 353.053 374.324 349.531 375.797L349.515 375.811Z"
                                  fill="#CCA847"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M349.515 464.2C349.515 464.2 349.781 464.373 350.296 464.656C379.036 451.191 404.787 432.104 426.029 408.523C425.797 400.336 425.496 391.944 425.165 388.835C424.48 382.24 424.965 375.525 424.763 371.643C424.56 367.76 422.376 351.941 421.365 347.856C420.272 343.771 418.165 341.747 417.845 341.747C417.563 341.829 415.861 349.435 415.861 351.347C415.861 353.259 415.456 357.861 415.456 359.035C415.173 358.952 415.053 358.235 415.053 357.941C414.648 358.952 414.163 360.733 413.96 360.936C413.757 361.139 414.243 359.237 413.96 358.832C413.677 358.427 413.16 358.629 413.272 357.619C413.32 357.019 413.414 356.425 413.555 355.84C413.555 355.84 412.341 357.619 411.453 362.149C410.563 366.64 410.563 366.763 410.24 367.165C409.957 367.653 408.339 369.269 408.256 369.877C408.176 370.968 409.755 372.061 409.875 372.667C409.955 373.68 408.459 378.371 407.973 380.667C407.488 382.963 407.691 387.461 407.173 389.768C406.768 391.872 406.373 393.085 404.989 393.973C406 394.176 406.971 394.459 406.971 394.459C406.971 394.459 408.387 400.445 404.787 405.544C403.493 407.323 403.171 408.133 401.795 409.752C399.083 412.744 396.979 416.152 396.776 418.368C396.636 417.714 396.542 417.051 396.493 416.384C396.493 416.384 392.288 421.28 390.507 424.072C388.203 427.672 385.005 427.469 384.107 428.36C383.208 429.251 383.013 430.867 383.307 432.163C382.507 432.363 381.003 432.648 379.989 435.763C379.504 437.379 378.291 438.963 376.389 440.051C374.488 441.139 372.181 441.467 371.008 441.749C372.019 442.032 372.424 442.032 372.909 442.355C372.304 443.365 369.512 444.944 366.397 446.968C363.283 448.869 361.784 451.659 361.016 453.48C360.216 455.179 359.035 456.272 357.133 456.475C357.933 456.96 359.117 458.091 359.723 458.456C358.832 458.659 357.323 458.659 354.627 460.965C351.795 463.312 350.824 464 349.528 464.203L349.515 464.2Z"
                                  fill="#C39D3C"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M293.227 482.947C294.776 481.861 296.453 480.971 298.221 480.299C304.531 477.792 311.205 477.307 313.835 476.499C316.344 475.699 318.325 474.595 321.44 473.989C321.357 474.699 321.288 475.365 321.213 475.995C312.031 478.881 302.68 481.203 293.213 482.947H293.227Z"
                                  fill="#D2BA6B"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M409.6 316.992C409.6 316.992 408.307 323.989 406 328.4C403.693 332.811 401.2 338.917 401.2 338.917C401.215 337.541 401.378 336.171 401.685 334.829C398.773 336.528 391.693 340.616 389.685 342.435C387.784 344.133 384.587 347.128 383.779 348.544C385.68 342.963 387.661 337.947 387.987 335.64C385.075 337.744 371.48 348.949 364.403 356.352L342.355 374.192C339.81 375.565 337.19 376.792 334.507 377.867C330.707 379.483 326.216 380.859 322.899 382.155C323.789 379.768 325.203 377.661 327.187 375.64C329.291 373.659 335.6 366.821 336.571 363.64C337.461 360.323 337.664 358.341 336.491 355.549C335.397 355.832 332.891 355.955 331.192 356.44C329.493 356.925 327.672 358.744 327.672 358.744C327.672 358.744 328.965 351.341 331.757 344.344C329.653 344.424 326.053 345.029 326.053 345.029C326.053 345.029 331.069 336.616 339.653 330.752C337.024 331.312 334.452 332.11 331.968 333.136C326.952 335.24 321.451 338.355 317.365 340.053C319.669 336.853 335.851 313.76 345.48 292.237C355.08 270.757 358.667 265.256 360.771 253.728C361.861 248.024 361.571 239.595 361.861 232.045C362.144 224.56 363.075 217.845 362.469 213.355C364.976 216.469 374.363 225.248 374.685 244.869C374.968 264.488 365.707 290.987 355.875 305.264C358.275 305.952 364.493 306.763 370.883 295.664C377.272 284.565 377.195 281.467 379.501 276.853C379.784 279.16 379.701 279.968 379.701 279.968C379.701 279.968 389.008 268.683 393.416 254.483C394.307 260.592 396.936 265.973 392.808 277.179C389.128 287.291 384.315 289.76 384.315 289.76C384.315 289.76 386.701 289.355 390.219 287.251C390.827 288.747 390.707 290.451 391.717 291.053C392.728 291.656 394.104 292.672 394.307 293.643C395.397 292.024 397.096 289.96 397.624 288.424C397.219 291.624 396.936 305.616 398.424 312.736C401.541 312.453 404.736 312.251 406.92 306.627C405.424 312.131 405.424 315.445 406.435 320.139C408.093 319.008 409.589 316.984 409.589 316.984L409.6 316.992Z"
                                  fill="#C0993A"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M304.491 94.0134C304.491 94.0134 301.376 95.3067 296.077 95.3067C291.467 95.3067 292.76 93.5281 285.56 93.5281C274.477 93.5281 235.763 99.9281 228.965 99.8374C224.555 99.7574 243.851 101.739 243.851 101.739L293.165 102.427L303.075 101.627L306.757 94.1334L304.491 94.0134Z"
                                  fill="#A88F33"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M176.619 190.413C176.619 190.413 170.307 195.227 167.637 198.909C164.968 202.592 163.552 205.016 160.517 208.011C161.23 208.038 161.941 207.942 162.621 207.728C162.621 207.728 162.621 208.528 162.136 208.739C162.555 208.692 162.98 208.739 163.379 208.878C163.777 209.016 164.14 209.242 164.44 209.539C163.549 210.024 161.123 212.453 163.024 215.325C164.44 217.509 167.435 217.709 167.435 217.709C167.435 217.709 166.747 219.693 169.619 219.491C175.808 219.208 182.725 216.496 185.92 217.184C189.12 217.984 190.939 218.277 193.203 222.203C195.603 226.085 197.693 226.693 197.693 226.693C197.693 226.693 199.109 223.091 198.787 217.712C199.948 214.813 200.591 211.732 200.688 208.611L198.584 193.117L189.403 181.507L177.509 188.101L176.619 190.405V190.413Z"
                                  fill="#E3C571"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M187.904 188.107C187.904 188.107 188.795 190.211 192.517 190.411C192.112 191.301 192.112 191.424 192.235 192.109C192.315 192.797 192.435 193.808 192.435 193.808C192.845 193.61 193.215 193.339 193.528 193.008C193.731 193.899 193.325 195.312 193.528 196.325C193.653 196.942 193.857 197.539 194.133 198.104C194.192 197.966 194.26 197.831 194.336 197.701C194.416 197.499 195.136 199.885 197.128 201.701C197.126 201.422 197.195 201.147 197.328 200.901C197.359 201.409 197.526 201.898 197.813 202.317C197.664 202.246 197.528 202.151 197.411 202.035C197.411 202.035 197.611 208.435 198.704 211.744C198.887 211.53 199.049 211.3 199.189 211.056C199.189 210.856 199.109 212.837 198.907 214.256C198.624 215.672 198.827 217.653 198.827 217.653C199.556 217.079 200.358 216.603 201.211 216.237C202.424 215.749 204.411 214.253 205.621 210.936C206.324 209.057 206.865 207.122 207.24 205.152C207.631 205.905 207.901 206.715 208.04 207.552C208.123 208.563 210.024 208.037 210.024 208.037L210.429 203.627L212.829 193.635L215.013 187.445L225.531 171.064L244.533 156.429L261.12 160.232L275.115 141.219L251.005 126.736L228.189 129.123L207.483 157.803L190.899 183.816L187.904 188.104V188.107Z"
                                  fill="#D8B65B"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M307.403 146.603C307.403 146.603 305.987 146.885 301.901 149.003C297.816 151.12 294.984 151.792 293.405 154.907C291.827 158.021 291.707 160.491 291.707 160.491C291.707 160.491 294.499 159.277 296.117 158.872C297.816 158.469 299.717 158.589 299.515 159.277C299.32 159.749 299.05 160.186 298.715 160.571C298.715 160.571 301.915 160.491 301.829 162.069C301.744 163.648 301.224 165.387 300.619 166.155C300.011 166.955 297.504 168.139 297.221 169.069C296.533 170.971 297.504 171.051 297.139 172.587C296.856 174.085 295.523 176.997 291.152 182.093C286.661 187.192 284.752 190.792 284.752 190.792C284.752 190.792 282.568 186.707 281.435 183.187C280.635 183.589 276.339 185.976 276.339 185.976L266.387 151.309L266.587 149.003C266.587 149.003 267.477 147.912 267.68 145.888C266.184 145.403 265.981 144.997 263.997 143.099C262.013 141.2 260.397 138.891 257.083 137.312C256.597 136.421 255.989 135.211 253.563 134.723C251.136 134.235 249.68 133.835 249.68 133.835C249.68 133.835 250.973 133.347 251.581 132.336C250.083 132.539 248.872 133.024 245.595 132.944C242.277 132.861 241.912 132.741 240.093 133.024C238.275 133.307 236.093 134.117 235.28 131.325C234.389 130.637 232.488 131.245 230.869 133.629C229.251 136.013 228.685 137.917 225.571 138.848C225.352 140.221 224.871 141.539 224.155 142.731C223.264 144.229 221.848 145.725 219.947 147.949C216.952 151.469 217.437 157.253 212.664 161.664C207.851 166.072 213.464 149.445 213.464 149.445L221.149 131.045L243.035 109.645L277.016 107.341L280.333 124.941L296.92 130.645L307.397 146.624L307.403 146.603Z"
                                  fill="#D3AE4D"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M312.784 150.485L298.504 129.896L288.512 122.208C288.512 122.208 281.392 109.104 280.907 108.699C280.501 108.416 273.787 107.688 269.499 107.405L270.299 109.387C271.234 109.691 272.066 110.251 272.699 111.005C274.6 113.189 275.813 117.315 271.485 121.725C273.184 122.331 273.885 122.525 275.368 122.331C273.872 124.112 270.475 127.915 270.272 131.232C270.069 133.941 271.768 134.749 271.768 134.749C271.768 134.749 269.179 137.744 269.059 142.749C270.281 141.37 271.62 140.098 273.059 138.947C276.053 136.547 280.179 133.848 282.971 132.149C282.933 132.862 283.028 133.576 283.253 134.253C283.253 134.253 288.469 129.965 292.853 131.867C294.835 132.757 293.944 135.549 293.944 135.549C293.944 135.549 296.656 134.539 298.557 136.44C300.459 138.341 303.168 143.235 304.544 145.139C305.149 146.029 306.728 147.728 308.344 150.355C310.552 154.036 312.396 157.925 313.848 161.965C313.928 160.347 314.253 158.083 317.048 158.083L312.8 150.477L312.784 150.485Z"
                                  fill="#CAA13E"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M98.7066 208.981C98.7066 208.981 97.696 206.472 98.7066 201.579C99.7173 196.685 101.296 194.379 101.821 187.179C102.347 179.979 107.04 170.997 107.04 170.997L120.024 165.093L129.208 167.6L131.917 179.899L120.307 186.299C120.307 186.299 119.701 189.008 116.424 191.192C113.147 193.376 108.616 195.075 107.525 197.301C106.873 198.665 106.397 200.106 106.109 201.589C106.109 201.589 102.792 200.901 100.811 203.085C98.7066 205.312 98.7866 207.293 98.7066 208.992V208.981Z"
                                  fill="#F4EFC8"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M124.92 205.704C124.92 205.704 123.827 206.392 123.019 208.104C122.219 206.811 120.307 199.123 120.227 192.205C120.147 185.288 119.733 183.573 121.333 181.189C122.933 178.805 129.208 176.293 128.317 172C127.427 167.915 123.704 166.216 119.133 167.389C115.933 168.189 113.552 174.995 110.235 178.392C107.725 180.981 104.733 180.576 103.925 181.992C102.832 183.893 103.843 185.795 103.52 187.008C103.437 187.413 102.427 189.597 100.605 192.227C96.9254 197.525 90.696 205.011 89.8854 211.725C90.168 207.923 89.968 207.843 90.9787 203.635L90.3707 202.624L94.3707 189.517L96.96 178.717L102.747 160.632L112.939 142.147L122.851 131.061L133.165 131.749L134.379 147.243L140.285 176.331L152.704 191.621L132.8 205.016L124.912 205.704H124.92Z"
                                  fill="#EBCC73"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M131.109 211.2C131.109 211.2 129.411 211.605 128.803 211.283C128.195 210.96 127.592 210.595 127.792 210.189C127.992 209.784 129.085 209.099 129.085 208.773C129.108 208.479 129.015 208.188 128.826 207.962C128.637 207.735 128.368 207.591 128.075 207.56C127.144 207.44 126.861 208.045 126.861 208.045C126.861 208.045 125.971 207.36 125.245 207.245C125.674 207.193 126.106 207.165 126.539 207.163C125.421 206.656 124.235 206.316 123.019 206.152C124.029 205.547 126.013 203.765 127.307 203.765C128.6 203.765 129.411 203.565 129.208 202.877C129.005 202.189 127.995 201.179 126.904 200.773C127.307 200.288 127.592 199.56 126.621 197.573C125.608 195.592 126.013 194.256 126.339 193.773C126.621 193.165 127.632 192.075 128.117 191.387C128.603 190.699 129.008 189.768 129.816 189.283C130.221 189 131.515 188.483 132.811 187.989C134.227 187.504 135.4 186.896 136.208 187.504C137.099 188.109 136.693 188.92 136.693 188.92C136.693 188.92 139.485 187.907 141.992 189.203C144.501 190.413 150.611 191.184 150.611 191.184L152.8 195.595L138.317 208.013L132.331 211.008L131.117 211.208L131.109 211.2Z"
                                  fill="#E5C66B"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M151.213 190.899C151.213 190.899 146.723 193.893 145.712 194.984C146.317 195.067 147.328 195.472 146.923 196.077C146.437 196.683 143.525 198.787 141.907 200.771C140.208 202.752 138.589 205.261 138.024 206.475C137.419 207.565 132.805 210.763 131.229 211.165C134.547 211.165 141.221 207.08 143.728 207.08C143.648 208.293 144.416 209.669 145.832 209.789C147.248 209.909 151.333 210.68 156.835 207.283C162.336 203.965 160.517 201.496 162.821 199.88C167.232 196.965 169.011 194.376 171.437 192.76C173.864 191.144 175.12 190.776 175.12 190.776C175.12 190.776 175.2 189.563 175.92 189.685C176.117 189.708 176.304 189.784 176.461 189.905C176.618 190.026 176.739 190.188 176.811 190.373C176.811 190.373 181.019 187.379 186.411 186.571C186.285 186.514 186.184 186.414 186.128 186.288C186.128 186.288 186.531 186.085 186.613 185.883C186.613 185.883 186.896 185.477 187.099 185.68C187.301 185.883 187.584 187.379 187.989 187.987C188.88 187.581 190.579 183.779 190.579 183.779L194.667 172.088V161.408L191.467 162.016L167.467 172.208L152.901 187.299L151.203 190.899H151.213Z"
                                  fill="#E6BD62"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M220.307 138.512C221.605 138.197 222.849 137.692 224 137.013C223.515 138.309 223.515 139.725 221.411 142.8C219.307 145.875 219.227 146.32 217.528 149.515C215.829 152.832 215.627 157.605 214.008 159.707C214.734 159.354 215.512 159.123 216.312 159.021C216.312 159.021 214.696 160.437 214.008 161.933C213.32 163.429 212.107 166.544 209.115 168.448C206.123 170.352 202.317 171.563 198.232 176.053C194.144 180.461 189.939 186.045 187.832 188.053C188.925 186.152 190.421 182.349 190.827 179.843C191.232 177.336 190.744 174.339 191.432 171.024C192.12 167.709 192.12 165.32 195.432 159.533C198.744 153.747 204.413 133.643 204.413 133.643L216.629 129.76L220.312 138.499L220.307 138.512Z"
                                  fill="#B6933F"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M211.488 131.109C211.488 131.109 207.808 136.408 206.797 141.101C205.787 145.795 206.715 145.389 206.109 147.696C205.747 149.102 205.747 150.578 206.109 151.984C207.384 149.931 209.129 148.211 211.2 146.965C214.68 144.864 217.512 143.365 219.2 141.587C220.899 139.685 222.315 136.571 225.995 134.184C224.499 133.981 222.395 133.293 221.995 133.384C223.493 131.685 227.981 129.096 232.512 125.981C237.003 122.781 236.72 121.491 244.003 118.296C241.616 118.701 240.483 118.093 238.499 118.296C239.299 116.597 242.099 115.787 244.899 112.997C247.699 110.208 243.12 106.08 243.12 106.08L221.787 118.984L211.472 131.12L211.488 131.109Z"
                                  fill="#C49937"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M153.6 121.48L154.085 117.597L160.195 107.808L166.587 90.616V67.112L166.101 53.52L167.112 44.6187L167.88 41.7894L168.691 40.696L173.907 43.4054L181.109 53.1947L181.797 72.088L174.797 101.901L154.813 123.707L153.6 121.48Z"
                                  fill="#DFC068"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M169.499 39.6027C169.499 39.6027 166.299 39.6854 165.616 52.9947C164.933 66.304 164.603 73.3014 164.117 79.896C163.632 86.4907 162.501 90.4934 161.933 94.3787C161.365 98.264 161.043 103.56 159.224 106.797C158.424 108.293 156.715 112.987 152.709 116.507C148.219 120.389 141.509 123.101 140.493 123.304C138.712 123.707 129.691 124.597 126.011 126.621C124.717 127.309 122.491 128.117 120.024 130.424C115.128 134.832 108.616 142.72 103.923 152.227C96.7227 166.427 89.5227 206.515 89.5227 206.515L91.1414 203.805C91.1414 203.805 91.344 200.205 94.944 193.893C98.464 187.584 97.4534 180.504 102.347 168.408C104.248 163.797 106.635 157.811 109.547 152.712C114.16 144.419 119.741 137.299 125.365 133.416C134.547 127.107 144.661 125.731 144.661 125.731L155.544 118.531C155.544 118.531 157.445 114.851 159.955 110.643C163.472 104.739 167.955 98.144 168.933 88.5574C170.432 74.3574 166.829 65.0534 167.032 56.64C167.235 48.2267 167.315 42.0374 169.016 40.5387C170.717 39.04 169.501 39.608 169.501 39.608L169.499 39.6027Z"
                                  fill="#A88F33"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M169.499 103.115C169.499 103.115 174.299 91.3014 176.496 80.824C176.901 78.72 177.709 76.6187 177.912 74.92C178.923 65.008 179.205 60.9227 177.912 55.5014C176.901 51.5014 173.019 47.896 170.995 45.1014C169.013 42.1867 168.083 41.1014 168.488 40.488C168.893 39.8747 170.469 38.872 172.005 38.992C173.638 39.0396 175.244 39.4187 176.726 40.1063C178.207 40.794 179.534 41.7758 180.624 42.992C183.739 46.592 186.205 58.8107 186.205 58.8107L188.8 74.9334L195.395 95.24L169.504 103.131L169.499 103.115Z"
                                  fill="#C99E3D"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M214.603 90.8186C214.603 90.8186 213.712 91.2213 212.096 90.8186C212.165 91.479 212.05 92.1456 211.765 92.745C211.479 93.3444 211.034 93.8534 210.477 94.2159C208.779 93.5279 192.877 94.9039 192.877 94.9039C192.877 94.9039 185.475 93.6079 183.168 83.8186C181.552 77.3039 184.381 68.3253 183.451 62.4186C182.035 53.7199 180.053 52.0186 179.851 49.3119C179.648 46.6053 179.445 45.9146 179.445 44.2159C178.555 44.0133 178.029 43.7306 177.141 43.7306C176.939 42.9306 177.341 42.2319 176.453 40.8159C176.939 41.0186 180.256 41.4239 184.139 45.1039C187.339 48.0986 187.339 49.1893 187.821 49.7973C188.427 50.4026 193.323 54.5973 195.427 58.7786C197.531 62.9599 201.616 76.2933 202.547 78.4773C202.829 79.3679 203.437 80.2586 204.947 82.2799C207.293 85.1946 210.731 90.0133 214.613 90.8133L214.603 90.8186Z"
                                  fill="#B58634"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M188.392 50C190.843 53.9587 193.044 58.0662 194.984 62.2987C197.371 67.6773 198.787 72.088 201.781 75.688C200.163 70.9973 197.291 61.7733 195.592 58.496C193.691 55.0293 189.808 51.296 188.392 50.0027V50Z"
                                  fill="#A88F33"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M160.883 116.507C160.883 116.507 156.797 117.517 149.192 121.523C146.683 122.816 144.299 123.907 141.992 124.92C136 127.629 129.573 130.133 124.475 131.515C124.88 132 125.08 132.2 125.08 132.2C125.08 132.2 125.08 134.184 126.173 135.315C125.568 135.923 117.475 141.424 119.864 159.829C121.48 159.224 123.381 158.413 123.664 158.413C124.152 158.496 124.272 159.829 124.877 159.829C125.483 159.829 127.467 159.029 129.571 156.309C129.491 157.403 128.277 168.405 134.789 175.808C136.003 174.392 139.077 169.699 139.077 169.699L139.157 168.203C139.157 168.203 139.44 162.984 141.141 158.211C142.843 153.437 146.157 149.917 146.157 149.917L163.467 125.2L160.877 116.504L160.883 116.507Z"
                                  fill="#E6C367"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M144.701 152.8C143.909 153.36 143.036 153.796 142.112 154.093C141.829 153.083 141.424 149.603 143.811 146.205C146.603 142.117 152.709 136.819 154.408 132.605C155.501 129.893 155.016 123.099 164.725 114.4C174.435 105.701 178.235 102.709 178.235 102.709L193.931 94.8213L213.227 102.427L203.64 140L196.197 157.6L166.597 152.019L144.699 152.8H144.701Z"
                                  fill="#DCBA5A"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M156 142.597L159.683 137.987V134.709C159.683 134.709 163.768 133.616 168.176 129.125C172.584 124.635 178.693 116.019 184.075 116.544C189.456 117.152 189.981 128.235 190.184 131.352C190.387 134.469 191.075 141.544 192.165 145.349C193.379 149.152 179.059 163.552 179.059 163.552L169.333 170.955L156 142.597Z"
                                  fill="#E9CE77"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M167.395 180.987C167.395 180.987 170.389 176.293 168.195 175.283C169.488 172.371 171.875 169.296 171.875 169.296C171.875 169.296 173.573 165.091 179.075 159.912C184.576 154.733 187.976 151.293 188.867 147.816C189.416 145.55 189.714 143.23 189.757 140.899C190.352 141.385 190.988 141.817 191.659 142.192C192.549 142.597 196.755 146.075 196.149 153.075C195.544 160.075 192.949 162.987 192.949 162.987C192.949 162.987 190.443 165.493 188.664 166.789C186.76 168.083 186.075 169.579 182.877 169.701C183.206 169.44 183.575 169.235 183.971 169.093C183.971 169.093 180.653 168.691 178.872 170.307C177.091 171.923 173.304 176.901 171.403 178.4C169.501 179.613 167.403 180.989 167.403 180.989L167.395 180.987Z"
                                  fill="#CDAE50"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M301.901 102.304C297.122 100.562 292.099 99.5797 287.016 99.3921C278.52 99.1095 266.101 99.5948 253.925 99.6748C240.819 99.7548 228.925 95.1841 212.421 94.3761C209.712 92.7575 202.821 85.6775 181.312 100.685C182.605 100.605 196.928 97.3681 201.901 103.6C206.917 109.789 205.501 120.307 204.816 122.813C203.52 128.397 199.312 136.528 197.616 142.232C195.92 147.936 196.32 150.933 195.107 154.933C193.893 158.933 191.224 160.92 192.8 165.531C194.904 164.237 196 164.237 199.515 156.349C203.029 148.461 202.307 142.837 208.133 136.163C213.837 129.448 223.333 120.264 226.944 117.957C230.555 115.651 259.224 100.765 289.243 114.965C296.483 114.197 301.904 102.301 301.904 102.301L301.901 102.304Z"
                                  fill="#D2A83E"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M193.405 96.8C193.376 96.496 193.308 96.1968 193.205 95.9093C192.925 95.3177 192.556 94.772 192.112 94.2906C192.112 94.2906 184.992 92.9973 181.392 93.4C175.08 94.088 169.376 101.896 166.707 105.901C164.037 109.907 160.72 116.093 157.12 119.291C157.159 118.979 157.088 118.664 156.917 118.4C156.917 118.4 157.12 118.683 156.717 119.088C156.315 119.493 156.312 119.693 156.515 119.888L157.123 120.493C157.323 120.493 162.907 117.984 170.512 110.893C178.603 103.491 184.792 99.6933 188.029 98.392C189.756 97.6583 191.56 97.1242 193.408 96.8H193.405Z"
                                  fill="#C29637"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M331.515 66.384C331.515 66.384 330.219 68 328.6 69.7814C325 73.584 320.307 77.8694 316.301 82.28C312.501 86.488 308.213 89.7654 303.397 95.2667C298.581 100.768 292.997 106.875 291.584 108.656C290.291 110.437 289.28 113.349 289.28 114.845C288.592 114.36 287.784 113.835 287.784 113.835C288.124 114.47 288.531 115.067 288.997 115.616C290.008 117.032 291.584 118.816 292.395 119.904C293.389 121.289 294.103 122.855 294.496 124.515C294.981 124.595 298.096 125.203 301.981 118.811C305.867 112.419 310.96 105.421 310.96 105.421L319.051 93.4054L324.149 83.2134L330.549 71.8054L331.523 66.384H331.515Z"
                                  fill="#AC8132"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M339.808 58.2134C339.808 58.2134 334.912 62.2134 333.011 64.6134C331.109 67.0134 326.611 73.312 326.611 73.312L328.229 73.1094L336.443 65.8294L339.643 60.1254L339.805 58.224L339.808 58.2134Z"
                                  fill="#A88F33"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M338.309 379.693C338.309 379.693 338.229 376.376 340.091 374.395C341.992 372.411 346.805 369.499 351.499 358.576C356.192 347.653 356.715 345.187 356.715 345.187C356.715 345.187 348.301 352.387 343.115 354.085C344.328 351.576 345.016 349.797 345.624 348.501C344.936 347.896 342.024 347.208 341.741 346.885C343.357 345.267 344.248 341.301 347.525 338.672C351.733 335.472 359.419 329.973 365.392 325.072C371.365 320.171 383.109 308.771 384.608 305.453C385.499 306.747 385.699 307.555 385.699 307.555C385.699 307.555 379.795 315.243 376.72 320.136C374.008 324.344 374.211 326.731 374.211 326.731L379.795 324.331C379.795 324.331 381.411 330.317 374.091 339.421C377.291 338.208 378.581 338.936 380.4 337.923C377.405 339.827 373.28 342.416 369.397 349.533C365.595 356.653 360.416 364.947 351.68 370.123C343.184 375.584 338.288 379.669 338.288 379.669L338.309 379.693Z"
                                  fill="#A67A2E"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M316.384 106.515C316.384 106.515 313.067 113.429 312.581 118.811C312.501 120.107 312.176 121.117 312.176 122.613C312.096 127.427 312.459 132.808 311.376 135.315C310.971 134.304 310.768 133.616 310.363 133.213C309.757 134.912 308.664 140.211 307.773 142.192C307.371 140.899 306.48 136.408 306.563 131.109C306.645 125.811 306.763 124.797 306.763 123.707C306.563 125.323 305.469 127.509 305.064 128.803C304.459 127.712 303.771 126.296 302.96 125.123C302.475 125.923 301.869 127.104 301.344 127.712C301.261 127.227 301.061 125.931 300.939 124.112C300.859 122.008 300.736 119.299 300.859 118.731C301.059 117.64 302.76 113.352 306.36 109.427C310.648 104.733 315.059 95.7147 316.352 92.9227C317.645 90.1307 323.147 78.5227 323.147 78.5227H327.355L321.245 92.4374C321.245 92.4374 317.565 100.043 315.664 102.837C313.763 105.632 309.757 113.64 307.976 116.755C309.269 115.056 310.363 114.165 311.659 112.547C312.912 111.413 316.389 106.52 316.389 106.52L316.384 106.515Z"
                                  fill="#8C6228"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M339.888 57.6853C339.201 59.8008 338.114 61.7651 336.688 63.472C334.179 66.4666 328.797 70.4693 326.171 73.664C323.771 76.7786 318.971 85.2746 321.152 95.3466C321.952 93.1626 323.459 88.8346 327.464 83.9386C331.469 79.0426 335.757 73.4213 337.864 69.0533C339.965 64.6426 340.248 61.1653 340.248 61.1653L341.048 60.1546L340.563 57.848L339.875 57.6853H339.888Z"
                                  fill="#CBA94C"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M421.805 326.011C421.805 326.011 420.187 321.603 419.701 317.597C419.216 313.592 420.501 312.797 419.013 308.213C418.123 305.421 416.507 305.813 416.101 305.421C415.696 305.029 415.413 300.811 415.493 298.504C415.573 296.197 415.413 293.205 415.008 291.909C414.403 291.424 413.997 291.019 413.107 288.027C412.096 285.032 411.611 283.536 411.125 282.648C410.64 281.76 409.221 280.949 409.221 280.059C409.221 278.277 410.84 277.349 410.84 276.859C410.76 275.848 409.547 276.659 409.221 276.373C408.819 275.888 410.235 272.976 409.709 272.571C409.507 272.371 408.091 274.069 407.725 273.584C407.32 273.096 406.835 268.283 406.107 265.088C405.421 261.973 404.691 259.709 404.611 258.779C404.531 257.888 399.027 242.192 397.693 238.389C396.619 235.176 395.714 231.908 394.984 228.6C394.579 226.699 394.296 222.813 394.093 223.219C393.891 223.624 394.013 225.605 393.688 225.525C393.405 225.443 392.395 218.528 392.072 217.435C391.789 216.341 390.088 212.635 389.672 209.952C389.267 207.24 388.379 200.16 387.771 195.347C387.163 190.533 386.88 188.552 386.88 187.347C386.979 184.399 386.817 181.447 386.395 178.528C385.595 173.429 383.995 167.24 382.592 163.643C379.883 156.845 372.68 139.451 371.392 135.123C371.392 134.029 372.808 134.637 372.808 134.637C372.808 134.637 376.325 143.456 378.915 150.251C381.424 157.048 383.811 163.035 384.419 163.643C384.904 164.248 388.707 170.923 390.405 181.845C392.104 192.768 392.709 202.84 393.723 209.555C394.208 212.755 394.613 216.149 395.624 219.547C396.715 223.229 398.413 227.032 400.64 232.856C402.541 237.752 403.957 241.837 404.725 245.357C405.616 249.848 405.616 253.245 406.141 255.472C406.629 257.373 407.355 261.173 409.056 266.672C410.757 272.171 413.261 279.253 414.96 283.661C418.28 292.48 419.76 299.843 420.261 303.768C420.704 307.813 422.203 321.811 421.797 326.016L421.805 326.011Z"
                                  fill="#A88F33"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M340.091 57.2L339.888 57.6854C339.888 57.6854 340.493 57.888 340.373 58.6987C340.382 59.8078 340.314 60.9162 340.171 62.016C339.971 63.432 339.565 64.5227 339.485 65.4134C339.485 67.3147 339.768 69.4987 337.085 74.9201C336.285 76.4161 335.792 77.7094 335.387 78.6C334.376 80.784 334.173 81.1094 333.283 82.1201C334.699 81.3201 339.797 78.12 342.384 78.6C340.605 79.6107 337.893 81.5947 336.195 84.1841C336.6 84.2641 338.299 84.5894 340.995 84.1841C345.485 83.4961 350.501 81.8774 354.909 82.2001C359.725 82.4827 357.824 76.416 357.824 76.416L352.267 64.2L341.749 56.8L340.091 57.2027V57.2Z"
                                  fill="#BE9C44"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M367.517 148.707C367.517 148.707 362.824 144.013 360.923 127.907C359.021 111.725 359.427 87.9066 359.427 87.9066L355.624 78.6026C355.624 78.6026 354.824 72.4133 352.832 70.1093C350.84 67.8053 346.928 63.92 345.147 62.0186C343.365 60.1173 341.344 57.528 340.131 57.1226C340.736 56.112 343.448 50.408 353.843 50.328C364.237 50.248 367.443 56.032 368.528 58.136C369.613 60.24 374.515 69.336 376.333 86.6693C378.032 103.981 378.115 105.277 377.832 111.264C377.629 114.581 376.536 122.267 374.632 130.477C372.893 137.437 370.992 145.205 367.512 148.723L367.517 148.707Z"
                                  fill="#A17C34"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M352.8 162.501C354.364 162.614 355.927 162.262 357.291 161.488C358.787 161.408 364.208 162.096 368.373 156.797C368.656 158.008 369.387 161.288 367.483 164.2C368.496 163.187 369.992 162.784 370.195 162.501C370.275 163.997 371.691 168.608 365.704 179.813C367.32 178.035 369.221 178.115 370.92 177.912C371.003 180.016 372.133 187.093 369.141 190.899C367.16 193.488 363.923 192.677 363.923 192.677C363.97 192.112 363.97 191.544 363.923 190.979C363.843 189.885 363.437 188.795 363.723 188.067C362.158 187.352 360.734 186.365 359.515 185.152C355.995 181.835 351.424 176.173 351.101 171.965C350.696 167.272 354.904 166.261 354.904 166.261C354.552 165.946 354.251 165.577 354.013 165.168C353.811 164.483 353.608 163.389 352.8 162.501Z"
                                  fill="#8C6228"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M321.6 111.611C321.6 111.611 321.397 111.328 320.307 112.621C320.509 111.328 320.712 110.112 320.792 108.939C321.308 107.852 321.976 106.845 322.776 105.947C322.168 107.157 321.763 108.251 321.763 108.251C321.763 108.251 323.261 105.459 325.445 103.76C326.941 102.547 328.843 101.981 329.651 100.848C330.541 99.6347 330.339 99.432 330.541 99.2293C330.541 99.2293 332.525 97.936 335.56 94.1307C335.963 93.6453 336.571 93.12 336.976 92.6347C337.661 92.352 339.28 91.624 341.181 90.6507C343.165 89.56 345.389 88.064 346.765 87.4507C349.475 86.2373 352.349 86.36 353.683 84.456C354.693 84.1733 355.784 81.1387 355.584 78.552C357.08 79.1573 364.765 83.9307 367.397 94.368C369.299 101.771 365.899 113.179 364.483 118.683C363.067 124.187 362.867 128.269 360.883 130.776C358.373 134.096 350.285 138.776 348.301 141.093C346.603 142.995 341.507 147.808 341.707 151.285C341.909 153.875 345.104 155.285 345.795 155.776C346.485 156.267 346.48 156.869 347.776 156.576C349.072 156.283 349.555 155.685 350.083 155.685C350.688 155.765 350.688 155.888 350.971 155.888C351.176 155.882 351.379 155.854 351.579 155.805C351.579 155.805 351.376 159.488 342.76 160.605C342.152 160.688 341.547 160.888 340.776 161.011C341.789 160.525 342.395 160.525 343.488 159.029C342.275 158.827 338.795 158.624 337.904 158.341C338.187 157.856 339.117 156.56 339.885 155.955C340.573 155.349 339.805 155.155 339.2 155.469C338.158 156.178 337.158 156.948 336.205 157.773C335.195 158.664 334.304 159.877 332.685 160.973C332.2 159.355 332.28 156.28 334.184 154.056C333.696 154.136 332.765 155.552 331.877 155.269C331.717 153.794 331.812 152.302 332.16 150.859C332.645 149.037 335.275 145.843 335.275 145.843L347.976 123.147L350.685 105.955L321.6 111.605V111.611Z"
                                  fill="#92723A"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M320.915 112.581C320.915 112.581 320.227 113.067 321.603 113.997C321.4 114.28 320.915 115.291 320.307 115.979C319.621 116.779 318.891 117.275 318.608 117.963C318.003 119.379 317.517 120.349 317.517 120.957C317.517 121.565 317.315 125.448 315.616 127.955C315.008 128.845 314.32 130.341 313.835 131.352C312.824 133.131 311.933 134.552 311.731 135.352C311.328 136.768 311.045 140.651 311.045 140.651C311.045 140.651 311.936 139.557 312.259 139.155C311.771 140.165 311.245 141.256 310.477 142.067C310.963 141.661 312.379 140.651 314.765 138.547C318.083 135.757 323.261 131.064 329.573 127.347C327.669 128.035 326.053 128.035 324.76 128.237C325.771 127.227 334.872 116.547 339.645 115.536C339.935 115.169 340.079 114.707 340.051 114.24L335.963 113.837L327.669 115.616L326.459 109.216L320.915 112.573V112.581Z"
                                  fill="#B18E3E"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M334.104 148.989C334.104 148.989 333.011 150.08 332 152.792C331.222 151.979 330.555 151.067 330.016 150.08C328.52 147.573 326.216 144.376 320.835 146.197C320.755 144.499 320.632 143.608 320.835 142.395C321.725 142.195 324.435 140.011 327.144 136.813C329.048 134.629 330.827 132.12 332.04 128.925C332.84 128.317 334.224 127.307 336.04 126.133C338.629 124.355 341.744 121.925 342.229 119.216C341.016 119.701 338.427 120.915 334.541 120.715C336.04 120.027 338.344 119.299 338.061 116.304C338.669 115.899 339.155 115.616 339.155 115.616C338.699 115.464 338.219 115.395 337.739 115.413C337.656 115.131 337.536 114.728 336.848 114.928C336.16 115.128 336.048 115.131 335.957 115.413C335.675 115.496 334.744 115.413 334.056 115.901C333.368 116.389 331.467 118.003 330.739 118.285C331.021 117.8 331.424 117.075 331.424 117.075C331.424 117.075 329.443 117.275 328.027 117.875C325.437 118.765 322.445 120.384 319.411 121.96C319.693 121.475 319.816 121.16 320.016 121.069C320.216 120.979 320.704 120.869 320.704 120.787C320.704 120.704 320.504 119.987 320.624 119.696C321.531 117.774 322.602 115.933 323.824 114.195C325.24 112.291 325.523 109.581 325.523 109.581L331.712 106.467L349.107 102.467L360.395 103.155L358.979 110.963L352.312 124.595L346.608 137.013L340.093 144.621L334.107 148.989H334.104Z"
                                  fill="#543E26"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M362.299 115.2C362.299 115.2 355.501 123.613 353.6 124.909C354.813 122.32 362.299 106.907 365.008 102.619C364.403 102.133 363.592 102.133 365.493 94.6187C363.877 98.4187 363.309 100.403 361.976 101.413C360.643 102.424 360.477 102.101 359.576 102.101C359.746 101.793 359.816 101.44 359.776 101.091C359.776 101.091 354.072 100.403 350.176 100.403C346.28 100.403 338.568 102.507 334.277 104.205C330.88 105.621 328.979 105.621 327.765 106.509C326.552 107.52 325.864 108.613 325.256 108.896C324.771 109.179 322.467 109.907 321.939 110.675C321.453 111.475 320.645 112.373 320.645 112.576C320.645 112.779 320.443 113.064 321.051 112.859C321.251 112.779 322.749 111.968 324.448 110.957C326.752 109.664 329.544 108.168 331.568 107.277C337.352 104.971 339.173 105.376 341.76 104.891C344.469 104.405 348.355 103.272 350.941 103.272C353.531 103.192 358.427 103.272 359.56 103.475C359.075 103.88 358.669 104.365 358.872 106.064C358.872 106.549 358.467 107.075 358.072 108.248C356.861 111.565 354.555 117.067 353.272 119.859C351.493 123.659 349.472 126.856 348.472 128.837C347.472 130.819 345.272 136.037 343.093 138.829C340.915 141.621 339.776 143.32 339.093 143.928C338.411 144.536 333.509 148.133 333.875 149.429C334.765 149.147 340.389 147.029 344.472 142.432C348.555 137.835 349.368 135.029 352.563 132.52C355.757 130.011 358.267 125.805 359.763 122.328C361.016 119.091 360.733 118.08 362.309 115.208L362.299 115.2Z"
                                  fill="#806031"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M215.819 177.995C215.819 177.995 214.928 181.675 212.904 183.496C210.923 185.277 207.403 186.813 207 189.808C206.515 192.8 210.52 194.299 210.52 194.299C210.52 194.299 208.333 197.899 208.333 200.608C208.333 203.4 208.253 203.925 208.536 206.595C208.215 206.801 207.942 207.074 207.736 207.395C207.736 207.395 207.936 209.984 209.92 211.6C211.904 213.216 213.6 214.189 214.611 213.784C214.765 214.114 214.9 214.452 215.016 214.797C215.016 214.797 216.515 210.995 217.525 207.677C218.536 204.28 219.427 204.763 219.829 200.192C220.232 195.621 224.629 187.773 224.629 187.773L227.629 181.067L222.736 177.264L215.819 177.992V177.995Z"
                                  fill="#B6903C"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M224.92 184.587C223.911 185.623 222.98 186.731 222.133 187.904C220.84 189.685 219.829 191.301 217.928 191.992C216.027 192.683 214.813 192.677 214.933 194.581C215.053 196.485 216.835 197.291 217.845 198.261C218.939 199.272 219.829 200.971 219.344 202.875C219.949 202.592 221.043 202.267 222.053 200.083C223.064 197.899 230.133 184.589 230.133 184.589H224.92V184.587Z"
                                  fill="#685026"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M252.8 153.883C252.8 153.883 253.405 152.267 252.8 151.093C252.192 149.88 248.512 149.475 246.691 148.099C244.789 146.683 242.483 145.699 240.581 146.32C240.864 145.632 241.997 144.133 241.067 143.811C240.176 143.528 236.861 145.024 235.971 145.712C235.08 146.4 233.056 147.208 232.653 147.696C232.251 148.184 231.56 149.112 231.155 148.707C230.749 148.424 230.549 147.696 229.861 148.099C229.173 148.501 225.861 151.213 225.251 152.792C224.64 154.371 223.267 157.891 219.141 161.893C215.016 165.896 213.235 168.488 214.448 169.984C215.661 171.48 216.229 170.389 216.432 171.683C216.588 172.952 216.519 174.24 216.229 175.485C215.744 177.589 214.936 179.571 216.027 179.976C218.819 180.867 221.531 179.176 222.136 179.693C223.349 180.784 221.448 184.709 224.32 185.477C227.235 186.277 230.107 184.789 230.107 184.789L240.704 179.085L250.899 173.707L256.115 163.389L253.317 154.773L252.784 153.883H252.8Z"
                                  fill="#D4B968"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M242.8 178.52C242.8 178.52 241.019 175.811 243.205 173.421C245.392 171.032 248.504 170.024 249.717 168.528C249.486 168.243 249.177 168.033 248.827 167.923C249.632 166.481 250.861 165.323 252.347 164.603C251.741 163.997 250.931 163.512 250.043 163.512C248.059 163.512 246.843 164.725 245.024 164.725C243.245 164.725 243.043 163.835 243.043 163.835C243.043 163.835 246.037 163.552 245.752 162.216C245.469 160.8 244.952 160.8 244.952 160.8C244.952 160.8 250.736 158.4 251.747 157.12C252.757 155.84 252.637 154.328 252.84 153.723C253.525 153.723 257.531 151.619 259.149 152.509C260.768 153.4 259.635 155.827 259.635 155.827C259.635 155.827 264.533 152.144 267.029 148.533C269.213 148.736 270.229 147.037 271.829 147.037C273.813 147.037 276.928 149.747 277.533 155.531C277.939 158.848 278.544 160.749 277.939 166.616C277.656 169.933 277.736 177.016 278.739 180.531C279.424 183.323 281.043 183.04 281.043 183.04C280.794 183.891 280.302 184.65 279.627 185.224C278.533 186.235 278.413 188.907 278.533 189.917C278.695 190.656 278.898 191.385 279.141 192.101C279.141 192.101 277.848 193.597 277.523 194.611C277.24 195.621 275.907 196.309 274.933 196.309C273.96 196.309 274.448 196.227 273.155 196.309C271.861 196.392 271.456 196.592 270.645 196.309C269.835 196.027 269.229 195.701 269.555 193.109C269.837 190.52 259.563 184.493 259.563 184.493L242.763 178.507L242.8 178.52Z"
                                  fill="#CCA849"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M223.504 204.085C223.504 204.085 227.184 208.981 242.315 208.981C249.515 208.981 252.024 208.293 253.515 207.888C255.133 207.483 261.2 205.099 267.309 197.896C272.811 191.384 271.597 188.715 271.597 188.715L268.397 188.229L257.997 189.645L227.224 202.752L223.491 204.085H223.504Z"
                                  fill="#585136"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M234.789 205.299C234.789 205.299 221.683 208.213 221.683 199.92C221.683 191.829 229.773 183.333 231.797 181.837C233.901 180.339 238.917 178.637 238.917 178.637H251.013L253.317 184.747L252.307 197.933L234.789 205.296V205.299Z"
                                  fill="#252211"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M246.885 181.109C246.885 181.109 244.379 178.803 238.675 181.909C232.971 185.016 228.357 191.509 228.075 197.405C227.792 202.621 232.363 206.507 239.483 206.709C244.781 206.909 247.979 206.304 249.597 205.909C249.192 205.424 247.088 202.795 247.088 202.795L246.888 181.112L246.885 181.109Z"
                                  fill="#C3B378"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M244.419 182.4C244.419 182.4 243.813 181.915 242.019 182.885C240.523 183.685 238.339 185.8 236.64 187.296C235.547 188.187 234.859 188.589 234.24 189.277C231.731 192.272 229.627 197.168 230.843 199.595C232.059 202.021 236.061 204.813 246.256 202.912L244.389 182.403L244.419 182.4Z"
                                  fill="#E6D89C"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M241.101 187.419C241.101 187.419 239.483 189.928 239.483 193.933C239.483 198.019 241.789 204.531 250.285 205.016C256.797 205.421 261.165 195.632 265.899 191.829C269.499 188.917 271.683 188.835 271.683 188.835C271.683 188.835 268.003 184.835 258.173 179.653C248.464 174.435 237.581 173.747 231.675 181.757C234.467 181.555 243.488 179.248 243.488 179.248L247.899 180.664L241.101 187.421V187.419Z"
                                  fill="#252211"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M253.803 192.717C253.52 192.112 253.317 191.301 254.491 191.101C255.664 190.901 256.189 191.019 256.595 191.901C257 192.784 257.395 193.52 256.795 193.885C256.189 194.208 254.611 193.885 253.8 192.712L253.803 192.717ZM251.901 187.013C251.901 187.013 251.496 187.296 251.699 186.731C251.779 186.045 252.307 184.829 253.6 185.115C254.893 185.4 254.613 186.813 254.4 187.219C254.187 187.624 253.107 188.309 252.296 188.019C252.193 187.992 252.098 187.942 252.018 187.872C251.939 187.802 251.876 187.715 251.837 187.616C251.798 187.518 251.782 187.411 251.791 187.306C251.8 187.2 251.835 187.098 251.891 187.008L251.901 187.013Z"
                                  fill="#6F674D"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M142.4 189.6C142.4 189.6 145.6 192 149.317 191.907C152.997 191.824 157.731 188.024 159.915 185.595C161.208 184.179 162.315 182.683 163.515 181.509C164.528 180.499 165.213 180.013 165.699 179.325C166.387 178.525 167.115 177.021 167.48 176.533C166.589 177.221 165.296 178.437 163.96 179.245C162.667 180.045 159.875 181.549 158.741 181.955C157.651 182.36 146.323 188.355 146.323 188.355L142.4 189.6Z"
                                  fill="#AC924C"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M147.291 159.709C147.291 159.709 149.069 158.496 152.509 157.725C155.827 156.925 162.501 156.309 162.501 156.309L168.003 158.709L170.187 167.003L166.187 175.621L161.091 178.821L155.304 169.517L147.304 159.725L147.291 159.709Z"
                                  fill="#9F8E57"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M140.091 167.112L138.187 168.533C138.187 168.533 138.675 167.643 139.077 164.933C139.48 162.224 141.587 155.629 144.661 151.827C147.736 148.024 147.656 148.227 147.656 148.227C147.373 148.175 147.082 148.184 146.803 148.253C146.524 148.323 146.263 148.451 146.037 148.629C146.443 147.733 149.032 144.533 151.621 142.933C154.211 141.333 155.221 140.829 157.931 142.133C160.64 143.437 161.328 144.115 163.312 144.035C165.296 143.955 166.992 141.851 166.992 141.851C166.992 141.851 167.397 143.144 165.901 146.139C164.405 149.133 158.499 155.24 158.499 155.24L146.2 163.653L140.091 167.12V167.112Z"
                                  fill="#EAC970"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M149.189 158.699C149.189 158.699 158.091 159.912 160.8 157.405C160.88 157.688 161.205 157.688 161.205 157.891C161.184 158.043 161.112 158.185 161.003 158.293C161.297 158.246 161.595 158.219 161.893 158.213C162.25 158.319 162.616 158.387 162.987 158.416C163.285 158.409 163.583 158.382 163.877 158.333C163.849 158.534 163.781 158.728 163.676 158.902C163.572 159.076 163.434 159.227 163.269 159.347C163.675 159.347 164.069 159.427 164.069 159.749C164.069 160.072 164.149 161.045 163.664 161.248C163.262 161.359 162.834 161.33 162.451 161.165C162.483 161.931 162.691 162.679 163.059 163.352C163.859 164.848 165.565 166.552 167.859 166.061C167.859 166.061 169.069 168.973 163.973 175.445C163.288 176.336 162.557 177.549 161.669 178.56C161.319 179.325 161.05 180.125 160.869 180.947C160.869 180.947 169.488 177.629 171.955 170.064C174.464 162.459 174.949 154.976 174.464 147.979C174.381 145.995 174.059 144.581 173.573 143.568C172.36 141.059 168.96 141.464 167.587 142.88C165.603 144.864 162.285 149.797 157.675 153.195C152.981 156.592 152.781 157.195 149.179 158.699H149.189Z"
                                  fill="#D7BC6B"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M138.512 169.621C138.512 169.621 136.813 170.632 135.923 174.421C135.032 178.304 136.723 183.037 137.701 184.533C138.68 186.029 140.901 190.117 145.509 190.32C146.65 190.314 147.778 190.08 148.827 189.632C150.435 188.894 151.944 187.956 153.317 186.84C155.301 185.344 156.917 184.051 156.715 183.928C156.229 183.725 144.499 174.016 144.499 174.016L140.088 169.093L138.509 169.627L138.512 169.621Z"
                                  fill="#585136"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M149.6 185.72C149.6 185.72 151.987 185.52 153.403 184.629C154.819 183.739 145.109 174.112 145.109 174.112L145.797 184.512L149.6 185.72Z"
                                  fill="#453A25"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M139.28 168.891C139.28 168.891 138.067 171.197 138.067 171.805C137.864 173.787 138.472 180.016 138.957 181.997C139.443 184.101 142.072 187.296 145.472 187.296C147.573 187.296 150.488 186.003 150.488 185.68C150.488 185.275 147.493 184.88 146.685 183.373C146.2 182.573 145.997 180.584 145.885 178.573C145.805 177.28 145.805 175.864 146.291 175.373C147.384 174.16 147.584 170.68 147.584 170.68L151.467 163.467H146.36L140.251 167.269L139.28 168.891Z"
                                  fill="#84754B"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M137.784 171.117C137.784 171.117 141.784 165.819 145.389 164.603C148.995 163.387 150.608 164.117 150.608 164.117L148.504 169.499L145.509 172.816L145.712 174.515C145.712 174.515 145.224 179.005 148.219 182.12C151.213 185.235 153.437 185.115 154.733 185.115C156.029 185.115 159.749 184.021 161.651 179.531C163.349 175.325 164.765 169.931 161.368 164.523C158.048 159.141 152.184 158.933 151.051 158.933C149.917 158.933 141.019 159.379 137.784 171.109V171.117Z"
                                  fill="#252211"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M240.493 189.117C238.997 188.429 240.413 184.224 241.909 182.928C243.405 181.632 245.307 180.139 248.627 179.933C249.837 179.853 251.011 180.621 250.811 181.432C250.528 182.928 248.424 185.032 246.523 186.528C243.893 188.592 242.192 189.885 240.493 189.117Z"
                                  fill="#F7F7E7"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M159.587 166.181C160.68 166.101 162.096 166.981 162.379 168.165C162.661 169.459 161.691 172.048 159.587 172.048C157.888 172.048 156.997 169.944 156.997 169.339C157.016 168.841 157.156 168.355 157.403 167.923C157.483 167.8 157.685 166.384 159.587 166.181Z"
                                  fill="#F8F6DE"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M143.811 167.112C143.811 167.112 141.019 168.405 139.725 171.112C138.801 173.111 138.522 175.347 138.925 177.512C139.128 178.523 140.139 181.029 140.827 181.92C141.515 182.811 142.445 183.419 143.133 183.336C143.821 183.253 145.235 181.435 145.235 180.344C145.235 179.253 145.317 174.64 146.651 172.131C147.824 169.624 143.819 167.115 143.819 167.115L143.811 167.112Z"
                                  fill="#D4C38B"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M144.216 166.909C143.731 167.192 142.923 167.597 143.123 168.123C143.325 168.608 145.024 168.923 145.632 170.107C146.32 171.32 146.32 172.613 146.117 173.221C146.646 172.97 147.125 172.627 147.533 172.208C148.424 171.197 149.515 169.824 150.445 169.824C151.053 169.824 151.659 170.107 152.227 170.107C153.117 170.107 154.005 169.824 154.128 168.893C154.328 167.68 152.429 166.587 151.336 166.789C151.539 165.989 151.821 164.808 150.931 163.997C150.04 163.187 147.251 164.605 146.643 165.011C146.035 165.416 144.216 166.912 144.216 166.912V166.909Z"
                                  fill="#E2D59D"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M208.496 251.901L214.483 250.133L216.181 251.347C216.181 251.347 217.392 253.936 219.296 254.259C218.688 255.552 217.109 256.659 217.192 257.576C217.275 258.493 218.083 259.195 218.083 259.195C218.083 259.195 212.701 268.093 223.301 277.061C220.792 278.072 217.597 279.461 215.899 280.261C217.109 280.544 219.699 281.061 220.792 282.043C221.885 283.024 221.885 283.336 222.896 283.944C223.907 284.552 224.512 285.36 224.312 285.723C223.624 285.317 221.317 284.107 220.915 285.237C220.512 286.368 210.923 285.925 210.923 285.925L194.741 289.04C194.741 289.04 195.347 287.421 193.648 285.925C191.667 284.147 189.24 286.005 186.651 284.024C183.253 281.435 183.131 278.44 182.04 277.309C183.131 276.621 185.357 275.611 190.656 274.909C190.453 274.504 189.765 273.291 190.171 272.2C190.656 270.784 192.677 269.893 192.072 268.2C192.963 267.997 193.365 267.997 195.592 265.205C197.696 262.413 198.989 261.808 200.608 261.605C202.227 261.403 203.197 261.605 206.192 258.813C208.293 256.832 207.608 255.133 207.608 255.133C207.608 255.133 208.981 254.688 208.499 251.896L208.496 251.901Z"
                                  fill="#CBAC5A"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M190.819 252.8C190.899 252.395 191.224 252.192 193.408 252.395C195.592 252.597 209.427 251.101 213.189 250.899C216.992 250.616 230.381 250.816 236.896 252.192C243.411 253.568 250.003 255.187 253.197 255.995C256.397 256.885 257.405 257.205 257.283 257.611C257.203 258.016 256.483 258.411 256.069 258.299C255.667 258.219 245.067 254.981 241.792 254.299C238.517 253.616 227.187 251.789 220.992 251.899C215.208 251.981 212.901 251.819 208.008 252.384C203.112 252.992 195.021 253.8 192.595 253.477C190.195 253.195 190.691 253.195 190.813 252.789L190.819 252.8Z"
                                  fill="#D6BC6F"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M223.381 284.507C223.381 284.507 231.675 288.997 234.669 294.499C236.853 298.584 233.376 300.608 233.376 300.608C233.376 300.608 238.069 300.608 237.461 303.197C237.179 304.813 229.371 309.181 224.152 311.488C218.853 313.795 219.056 313.675 216.467 314.077C213.957 314.483 207.08 313.277 205.664 315.291C204.248 317.304 204.864 319.379 205.259 319.701C205.664 319.984 208.941 320.389 208.941 320.389C208.941 320.389 208.253 322.291 201.459 322.493C194.664 322.696 192.963 323.179 192.557 323.909C192.152 324.595 193.851 324.192 196.968 324.709C200.083 325.195 204.451 325.509 204.451 325.509C204.451 325.509 203.035 326.723 199.355 327.693C195.147 328.784 188.552 329.797 186.571 331.011C187.581 331.699 189.08 332.709 189.771 332.789C188.072 333.195 185.683 334.085 185.28 334.408C185.885 334.813 186.696 335.299 186.696 335.299C186.696 335.299 183.296 339.384 181.315 340.397C179.333 341.411 167.925 346.707 164 345.696C154.211 343.107 152.997 332.387 150.611 331.579C147.011 330.365 145.312 332.789 142.115 331.091C143.531 330.08 144.301 329.475 145.797 328.787C144.179 327.987 135.805 322.677 135.805 322.677C134.93 320.769 133.958 318.906 132.893 317.096C131.275 314.304 128.893 310.581 127.107 307.304C123.224 300.104 123.021 296.787 119.501 292.701C120.109 291.901 122.211 292.013 122.211 292.013L151.704 301.723L204 303.237L217.6 283.821L223.384 284.509L223.381 284.507Z"
                                  fill="#DFC677"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M145.915 314.117C146.23 314.468 146.598 314.769 147.005 315.008C148.019 315.696 149.515 316.507 150.525 317.717C150.931 317.112 151.941 316.019 153.725 317.717C155.509 319.416 157.725 318.205 159.104 318.608C160.52 319.096 160.6 319.296 160.6 319.296C160.6 319.296 161.4 318.608 163.189 317.88C164.283 317.475 165.576 317.192 166.992 316.789C168.285 316.507 169.701 316.101 170.675 316.101C171.565 316.707 174.76 320.101 187.584 315.091C199.68 310.397 202.469 309.872 204.493 310.597C204.696 310.112 204.899 309.181 208.013 309.304C208.013 308.011 205.424 303.6 205.424 303.6L191.144 298.707H183.333L159.912 302.995L146.933 310.4L145.923 314.133L145.915 314.117Z"
                                  fill="#C4A859"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M138.107 305.907C138.107 305.907 138.389 308.091 141.627 310.397C144.827 312.701 145.832 314.077 145.832 314.077C145.832 314.077 146.44 313.277 146.925 312.461C147.411 311.57 147.816 310.56 148.624 310.277C150.243 309.589 153.923 310.883 154.733 310.68C155.421 310.48 155.219 309.064 155.947 309.064C157.645 308.981 158.736 310.154 159.344 310.154C159.952 310.154 161.445 310.074 161.648 309.752C161.851 309.429 161.931 306.069 164.237 304.45C166.747 302.672 169.821 303.44 170.637 303.845C170.637 304.451 170.717 305.949 172.336 306.029C173.955 306.109 174.115 305.827 175.536 306.312C176.957 306.797 178.651 306.232 179.419 308.616C180.107 308.416 181.725 308.213 181.32 305.907C182.12 305.301 182.819 304.896 184.52 302.509C184.925 301.904 185.611 301.216 186.139 300.325C187.555 300.325 189.253 300.042 191.517 302.024C190.829 302.509 190.424 302.824 190.224 303.317C190.816 303.903 191.357 304.54 191.84 305.218C192.448 306.018 192.853 307 193.621 307.203C195.32 307.688 198.112 307 201.227 307.203C204.221 307.405 206.728 308.496 207.821 309.184C208.227 308.984 208.227 308.901 209.237 309.104C210.248 309.307 211.016 309.386 209.925 308.093C210.531 308.376 211.219 308.984 211.827 308.376C212.435 307.768 212.917 306.88 214.616 306.677C216.315 306.475 216.923 306.757 217.611 304.979C218.501 302.795 215.427 302.794 215.427 302.794C215.427 302.794 216.843 301.499 218.421 299.8C220.323 298.021 222.507 295.715 223.032 292.883C223.923 287.664 218.827 286.979 218.827 286.979L194.109 294.584L163.891 293.085L138.123 305.909L138.107 305.907Z"
                                  fill="#927D49"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M115.899 234.507C115.899 234.507 115.099 235.517 114.605 237.904C114.112 240.291 114.323 240.008 113.917 241.707C113.512 243.405 108.533 260.315 110.4 266.019C112.267 271.723 115.499 273.827 117.52 278.437C117.925 279.448 118.32 280.056 118.531 280.947C119.219 283.939 118.613 286.245 119.421 289.24C119.704 290.251 120.435 291.424 121.525 292.637C123.925 295.144 127.837 297.531 129.525 299.229C131.909 301.739 135.309 306.837 139.637 307.32C141.944 307.603 145.221 306.632 147.931 305.016C150.331 303.517 151.813 301.416 154.331 300.216C156.109 299.325 158.011 299.003 159.709 298.597C163.229 297.909 166.427 297.797 168.328 298.192C171.24 298.8 178.117 300.904 181.928 300.904C184.906 300.856 187.867 300.449 190.747 299.691C196.531 297.992 203.528 295.077 208.141 293.784C210.851 292.984 213.035 292.773 215.261 292.288C219.064 291.397 222.259 290.184 224.08 287.877C222.867 286.461 221.371 284.277 213.277 284.357C204.096 284.56 193.496 289.656 188.277 290.467C183.059 291.277 180.795 291.963 174.968 289.859C169.256 287.733 169.067 286.328 169.067 286.328C169.067 286.328 163.069 282.133 160.56 271.44C158.051 260.747 160.56 252.955 167.075 245.549C168.773 243.648 168.368 241.949 168.368 241.949C168.368 241.949 172.656 236.165 171.483 230.749C170.189 225.368 161.896 226.461 161.896 226.461L115.901 234.507H115.899Z"
                                  fill="#6E6342"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M122.816 252.509C122.459 253.18 122.292 253.935 122.331 254.693C122.411 255.784 122.736 257.2 126.011 260.397C128.803 263.187 128.195 266.301 128.195 266.301C128.195 266.301 129.6 266.584 133.413 264.8C136.408 263.384 137.413 265.893 137.413 265.893C138.285 265.436 139.23 265.135 140.205 265.003C141.089 264.921 141.944 264.648 142.712 264.203C142.712 264.203 146.232 267.803 149.307 269.501C152.099 271 153.717 272.011 155.093 271C156.387 270.109 156.387 268.288 156.304 267.48C155.983 266.734 155.577 266.028 155.093 265.376C154.203 264.083 152.787 262.584 152.693 261.376C152.491 258.587 154.797 255.267 154.309 254.459C153.821 253.651 152.005 253.448 147.515 255.067C142.864 256.603 122.797 252.517 122.797 252.517L122.816 252.509Z"
                                  fill="#39331F"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M133.413 270.592C133.413 270.592 131.109 268.408 131.917 257.808C132.895 257.794 133.872 257.889 134.829 258.091C134.829 258.091 136.085 266.304 133.413 270.592Z"
                                  fill="#292311"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M116.992 226.416C117.314 226.178 117.612 225.91 117.883 225.616C117.083 227.112 113.389 233.099 116.384 242.525C119.379 251.909 126.901 258.907 136.165 259.232C145.429 259.557 150.299 255.024 155.867 248.229C158.051 245.52 160.56 242.12 162.784 239.816C166.101 236.213 168.691 235.203 168.691 231.725C168.691 224.605 161.408 221.408 150.688 218.213C139.968 215.019 130.299 215.413 125.283 217.6C120.389 219.984 118.285 222.493 116.989 226.419L116.992 226.416Z"
                                  fill="#252211"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M151.416 273.787L152.216 273.381C152.216 273.381 152.416 270.181 153.712 270.267C155.005 270.469 155.613 272.171 155.491 272.776C155.411 273.381 155.088 274.395 153.792 274.272C152.093 274.312 151.408 273.787 151.408 273.787H151.416Z"
                                  fill="#3F3824"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M147.816 260.195C147.816 260.195 148.616 259.912 149.595 260.883C150.395 260.883 153.883 260.477 154.976 261.165C156.069 261.853 156.392 262.459 156.392 262.459C156.392 262.459 152.307 263.349 150.08 262.459C147.816 261.691 147.816 260.195 147.816 260.195Z"
                                  fill="#2D2815"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M165.819 260.8C165.819 260.597 163.635 259.101 161.328 258.613C160.923 258.533 160.84 258.816 160.528 258.816C160.325 258.736 160.245 258.128 160.245 258.128L158.933 258.819C158.933 258.819 158.731 259.101 159.419 259.619C160.024 260.104 161.037 260.509 161.32 261.317C161.603 262.125 161.603 262.408 161.725 262.531C161.805 262.611 163.221 262.531 163.909 262.125C164.597 261.72 165.893 261.059 165.811 260.792L165.819 260.8Z"
                                  fill="#82764F"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M145.389 269.013C145.389 269.013 145.792 266.224 148.504 266.101C151.293 265.899 151.821 268.608 151.821 268.608L150.203 270.227C150.203 270.187 148.989 268.488 145.403 269.013H145.389Z"
                                  fill="#2D2816"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M162.987 256.997C162.987 256.997 161.488 258.616 158.173 259.101C157.891 258.696 157.283 257.888 158.173 256.595C159.064 255.301 160.075 254.896 161.085 255.299C161.531 255.371 161.947 255.569 162.284 255.87C162.621 256.171 162.865 256.562 162.987 256.997Z"
                                  fill="#574F35"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M169.093 258.981C169.176 258.576 168.893 258.496 169.093 258.293C169.293 258.091 170.389 257.688 170.592 257.888C170.672 257.971 170.592 258.293 170.592 258.688C170.592 259.083 170.592 259.488 170.389 259.779C170.107 260.184 169.299 260.387 168.893 260.267C168.488 260.147 168.408 259.579 168.408 259.467C168.608 259.387 169.093 259.184 169.093 258.981ZM176 254.613C176 254.411 176.688 254.005 177.093 254.005C177.699 254.005 177.699 254.491 177.781 254.613C177.981 254.693 177.981 254.531 178.184 254.896C178.387 255.261 178.672 255.907 178.467 256.312C178.261 256.717 177.456 256.997 177.256 256.917C176.973 256.715 176.083 254.896 176 254.613Z"
                                  fill="#82764F"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M162.096 259.912C162.096 259.912 162.987 260.112 164.2 261.125C163.795 261.408 163.187 261.731 163.187 261.731C163.187 261.731 163.107 260.8 162.096 259.909V259.912Z"
                                  fill="#6E6342"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M160.115 251.011C159.912 250.811 160.72 250.325 161.205 250.405C161.691 250.485 161.893 250.811 162.419 250.891C162.944 250.971 163.027 250.688 163.219 250.485C163.411 250.283 164.109 250.405 164.229 250.485C164.304 250.574 164.372 250.669 164.432 250.768C164.44 250.614 164.481 250.464 164.55 250.326C164.619 250.188 164.716 250.067 164.835 249.968C164.99 249.854 165.169 249.777 165.358 249.742C165.547 249.706 165.742 249.715 165.928 249.765C166.008 250.048 166.413 251.059 166.333 251.261C166.253 251.464 165.04 251.749 164.835 251.544C165.037 252.032 165.928 253.043 166.048 253.243C166.168 253.443 165.157 253.931 164.755 253.851C164.189 253.811 160.709 251.787 160.104 251.019L160.115 251.011ZM165.413 244.296C165.338 244.092 165.195 243.921 165.008 243.811C164.725 243.731 163.795 243.811 163.795 244.296C163.795 244.781 164.595 247.496 165.493 248.909C166.507 250.325 167.192 251.496 167.88 251.821C168.096 251.92 168.341 251.933 168.566 251.857C168.791 251.782 168.98 251.625 169.093 251.416C169.173 251.213 169.376 249.717 169.296 246.197C169.216 242.677 169.093 239.28 168.891 239.077C168.688 238.875 167.88 238.877 167.597 239.28C167.315 239.683 165.493 243.691 165.411 244.296H165.413Z"
                                  fill="#585136"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M161.813 265.008C161.813 265.008 160.397 264.117 159.021 264.725C157.728 265.333 157.808 267.72 157.808 267.72C158.099 267.834 158.413 267.875 158.724 267.84C159.034 267.804 159.331 267.694 159.589 267.517C160.48 266.912 161.611 265.901 161.813 265.011V265.008Z"
                                  fill="#574F35"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M164.483 268.205C164.403 267.405 163.683 267.405 163.683 266.992C163.732 266.795 163.847 266.619 164.008 266.495C164.169 266.37 164.367 266.303 164.571 266.304C164.976 266.304 165.371 266.789 165.867 267.104C166.352 267.387 167.08 267.904 167.16 268.52C167.24 269.136 166.36 270.824 165.381 270.824C164.403 270.824 164.693 269.003 164.491 268.195L164.483 268.205ZM172.291 267.112C172.291 267.112 170.672 267.597 170.792 267.112C170.912 266.627 171.28 266.507 171.805 266.507C172.072 266.227 172.431 266.054 172.816 266.019C173.036 266.008 173.252 266.08 173.421 266.221C173.421 266.221 174.515 265.736 174.837 266.019C175.16 266.301 174.92 266.301 175.12 266.627C175.375 266.988 175.542 267.403 175.608 267.84C175.608 268.163 174.395 268.851 173.421 268.731C172.291 268.488 172.491 267.315 172.291 267.112ZM181.715 265.291C181.715 265.291 182.2 265.573 181.797 265.899C181.515 266.181 180.099 266.699 178.883 266.789C177.669 266.789 176.579 266.989 176.579 266.587C176.579 266.184 177.589 265.373 178.195 265.171C178.316 265.019 178.47 264.896 178.646 264.812C178.821 264.728 179.013 264.685 179.208 264.685C179.693 264.685 181.592 264.483 182.12 264.403C182.605 264.32 183.011 264.603 182.725 265.008C182.605 265.291 181.715 265.291 181.715 265.291ZM184.507 252.8C184.507 252.8 183.899 254.093 183.213 254.093C182.525 254.013 182.525 253.811 182.525 253.608C182.525 253.325 183.213 252.597 183.131 252.395C182.931 252.395 182.443 252.395 182.525 251.909C182.525 251.504 183.213 251.019 183.819 251.109C184.276 250.734 184.845 250.521 185.437 250.504C186.125 250.504 186.731 250.704 186.731 251.109C186.731 251.515 185.931 252.403 185.637 252.608C185.315 252.931 184.909 253.141 184.507 252.808V252.8ZM175.283 276.707C175.283 276.707 174.483 276.789 174.483 277.192C174.483 277.395 174.683 277.395 174.968 277.275C175.132 277.266 175.295 277.238 175.453 277.192C175.533 277.275 175.533 277.677 176.141 277.677C176.641 277.61 177.122 277.445 177.557 277.192C178.043 276.992 178.448 276.787 178.448 276.392C178.245 275.704 177.84 275.379 177.235 275.379C176.924 275.359 176.615 275.43 176.344 275.581C176.344 275.581 176.141 275.176 175.453 275.581C174.765 275.987 174.845 275.987 175.048 276.189C175.411 276.512 175.291 276.723 175.291 276.723L175.283 276.707ZM170.712 280.915C170.712 280.712 171.723 280.307 172.005 280.429C172.288 280.509 173.096 282.045 173.096 282.208C173.096 282.411 172.085 282.896 171.68 282.896C171.275 282.896 170.589 282.208 170.589 282.096C170.589 282.016 171.075 281.896 171.075 281.813C171.195 281.613 170.712 281.125 170.712 280.923V280.915ZM167.512 275.008C167.715 274.928 167.715 274.725 167.997 274.523C168.086 274.464 168.187 274.426 168.292 274.412C168.397 274.398 168.505 274.409 168.605 274.443C168.677 274.316 168.775 274.206 168.894 274.121C169.013 274.037 169.15 273.98 169.293 273.955C169.779 273.875 170.184 273.955 170.093 274.157C170.093 274.765 170.499 275.168 170.499 275.653C170.499 276.139 170.216 276.747 169.205 277.152C168.195 277.435 166.819 277.435 166.616 277.355C166.413 277.275 166.211 276.464 166.413 276.059C166.616 275.653 167.181 275.211 167.507 275.008H167.512Z"
                                  fill="#82764F"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M168.8 275.283C168.8 275.283 168.112 275.688 168.112 275.891C168.051 276.086 168.024 276.291 168.032 276.496C168.032 276.616 168.923 276.416 169.043 276.293C169.083 276.213 168.8 275.493 168.8 275.283Z"
                                  fill="#6E6342"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M162.784 273.381C163.187 273.464 163.875 273.381 164.4 273.584C164.805 273.787 165.088 274.192 164.683 274.677C164.277 275.163 163.883 275.891 162.984 275.768C161.973 275.688 161.003 275.163 161.003 274.757C160.986 274.501 161.02 274.244 161.103 274.001C161.186 273.758 161.317 273.534 161.488 273.341C161.893 273.019 162.093 273.221 162.781 273.381H162.784Z"
                                  fill="#585136"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M162.299 273.787C162.299 273.787 161.005 274.797 160.68 275.285C160.275 275.771 158.293 278.277 157.688 278.803C157.889 278.448 158.118 278.11 158.373 277.792C157.573 278.304 156.974 279.075 156.675 279.976C156.189 281.475 159.387 282.283 161.488 282.891C163.589 283.499 164.403 283.691 164.403 283.691C163.629 282.528 162.965 281.296 162.419 280.011C161.619 278.109 161.205 277.907 161.731 277.016C162.136 276.125 162.744 275.52 162.744 274.832C162.501 274.192 162.299 273.787 162.299 273.787Z"
                                  fill="#574F35"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M116.181 276.984C116.476 277.038 116.778 277.038 117.072 276.984C117.677 276.901 123.989 274.584 130.584 275C135.521 275.298 140.414 276.103 145.187 277.4C153.48 279.584 163.795 283.912 170.469 286.381C172.248 287.067 173.989 288.283 175.269 288.765C180.368 290.749 180.568 290.749 183.563 291.275C187.083 291.76 190.683 290.587 194.445 289.779C199.056 288.765 206.944 288.28 213.861 287.269C216.098 286.959 218.304 286.459 220.456 285.773C220.456 285.773 214.955 291.275 201.765 293.256C196.434 294.066 191.017 294.134 185.667 293.459C181.459 293.053 178.669 292.445 176.565 291.84C174.179 291.152 169.283 289.331 163.256 287.84C159.048 286.747 154.355 285.939 148.976 284.928C135.707 282.499 121.307 279.709 116.176 277L116.181 276.984Z"
                                  fill="#252211"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M101.293 251.984C98.0933 254.693 94.6987 257.283 91.384 259.789L81.392 267.467C77.9947 269.973 74.6773 272.563 71.2773 275.072C67.8773 277.581 64.4827 279.965 60.8773 282.272C64.0773 279.563 67.472 277.053 70.8693 274.587C74.2667 272.12 77.7893 269.701 81.0667 267.2L91.0587 259.512C94.496 257.005 97.8133 254.416 101.293 251.989V251.984ZM83.616 280.301C83.616 280.301 87.216 277.307 91.7067 273.101C97.288 267.885 104.125 261.208 106.309 259.997L83.6133 280.304L83.616 280.301Z"
                                  fill="#CFB66C"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M83.616 280.299C85.3973 278.52 87.2986 276.781 89.2 275.08L92.112 272.573C93.0026 271.773 94.016 270.875 94.904 269.984C96.6826 268.205 98.424 266.301 100.203 264.483C101.084 263.568 102.016 262.703 102.995 261.893C103.484 261.46 104.027 261.093 104.611 260.8C105.099 260.517 105.624 260 106.309 259.909C105.907 260.517 105.421 260.8 105.016 261.325C104.531 261.731 104.125 262.216 103.723 262.619C102.832 263.509 101.821 264.317 100.931 265.128C99.0293 266.747 97.048 268.328 95.1466 270.021C93.2453 271.715 91.4666 273.541 89.5626 275.24C87.5013 276.981 85.6 278.68 83.616 280.307V280.299ZM107.808 264.117C107.808 264.117 94.6213 277.024 91.9093 279.125L107.808 264.117Z"
                                  fill="#CFB66C"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M107.808 264.117C106.622 265.49 105.35 266.787 104 268L100 271.803C98.7066 273.096 97.4906 274.392 96.1173 275.685C94.7013 276.899 93.408 278.085 91.9093 279.205L95.792 275.403C97.088 274.109 98.504 273.019 99.88 271.723L103.763 267.92C105.096 266.587 106.392 265.291 107.808 264.117ZM108.413 271.115C107.198 274.507 105.766 277.818 104.125 281.027C100.728 287.824 95.632 296.317 93.4053 300.648L108.413 271.115Z"
                                  fill="#CFB66C"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M108.413 271.117C108.413 272.613 108.008 273.909 107.523 275.203C107.05 276.497 106.51 277.766 105.907 279.005C105.299 280.219 104.611 281.515 103.923 282.688C103.235 283.861 102.427 285.072 101.819 286.288L97.7333 293.488C96.3173 295.888 94.9413 298.301 93.4453 300.608C94.456 298.019 95.832 295.592 97.128 293.205C98.544 290.805 99.8373 288.405 101.128 285.923C101.758 284.685 102.325 283.417 102.827 282.123C103.432 280.827 104.037 279.613 104.525 278.44C105.131 277.147 105.616 275.931 106.224 274.76C106.909 273.504 107.477 272.291 108.408 271.117H108.413Z"
                                  fill="#CFB66C"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M122.816 304.288C122.816 304.288 118.816 309.587 119.216 316.301C120.307 312.784 121.683 307.403 122.816 304.288ZM126.619 309.6C126.619 309.6 125.203 324 124.029 331.08C125.688 322.896 126.011 323.584 126.619 309.6ZM153.115 331.931C153.115 331.931 147.128 349.531 147.005 354.421C148.301 349.392 150.808 339.117 153.115 331.917V331.931Z"
                                  fill="#DEC270"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M167.112 303.2C167.112 303.2 176.821 319.219 184.104 332.891C182.133 326.011 177.6 313.392 167.112 303.2Z"
                                  fill="#CBAF59"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M193.205 326.781C198.536 336.204 203.344 345.914 207.605 355.867C206.797 348.989 204.611 337.219 193.205 326.781Z"
                                  fill="#E3C677"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M269.904 350.4C271.52 349.389 274.717 343.885 277.509 342.512C280.299 341.096 282.403 340.813 284.912 338.021C287.419 335.107 288.112 333.328 293.608 331.024C301.296 327.704 296.008 323.416 296.008 323.416C296.855 322.584 297.76 321.814 298.717 321.112C300.701 319.616 303.005 317.795 302.805 314.597C302.523 309.219 301.512 301.411 297.101 296.88C301.389 295.989 309.6 295.384 314.701 294.091C320.605 292.592 323.317 290.488 323.317 290.488C323.317 290.488 319.92 284.704 325.421 278.88C330.923 273.056 335.413 269.576 338.731 263.061C334.928 262.576 329.131 260.555 314.336 266.176C315.135 266.552 315.905 266.984 316.643 267.469C316.643 267.469 307.541 269.979 304.224 272.771C298.437 277.664 297.709 281.669 291.44 284.664C285.171 287.659 278.859 286.848 273.643 289.275C268.427 291.701 267.656 293.765 265.752 294.656C266.157 295.141 265.672 295.949 266.44 296.637C265.955 297.325 263.123 301.936 260.251 301.936C260.533 303.029 262.96 303.837 262.96 303.837C262.96 303.837 261.181 305.133 256.651 305.456C258.955 307.856 261.141 310.472 267.168 314.275C266.683 315.285 264.659 316.784 265.469 318.685C266.36 320.587 268.669 323.176 277.888 325.28C273.195 325.48 267.696 326.573 260.288 325.563C252.885 324.672 251.672 324.147 247.101 325.28C247.587 325.765 248.88 325.765 250.013 327.059C248.8 327.139 241.195 326.168 238.605 329.568C235.896 333.085 234.723 338.872 234.925 342.755C233.509 343.443 232.133 344.656 232.821 347.165C233.509 349.675 237.109 350.483 239.416 352.059C241.72 353.757 241.923 354.363 244.109 353.96C246.413 353.475 249.811 351.171 251.795 351.171C253.779 351.171 255.192 352.667 255.192 352.667C255.192 352.667 260.573 350.077 261.099 350.563C261.584 351.048 261.179 354.163 261.704 354.648C262.237 355.013 268.299 351.413 269.917 350.4H269.904Z"
                                  fill="#ECD592"
                                  fillRule="evenodd"
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M387.501 188.512C362.219 123.221 299.717 111.125 299.717 111.125H121.4L122.088 177.629H157.6V326.133H121.397V392.517H294.781C336.568 392.517 370.064 350.525 370.064 350.525C423.704 274.395 387.499 188.512 387.499 188.512H387.501ZM295.712 305.784C295.712 305.784 282.112 325.405 267.315 325.405H237.715L237.013 177.792H275C275 177.792 292.6 181.472 304.896 216.301C304.896 216.301 321.197 266.168 295.712 305.784Z"
                                  fill="white"
                                  fillOpacity="0.8"
                                  fillRule="evenodd"
                                />
                              </svg>
                            </div>
                            <span className="mx-auto mt-2 flex justify-center text-center text-xs font-bold sm:text-sm">
                              DOGE
                            </span>
                          </div>
                        </a>
                      </div>
                      <div className="mx-auto flex w-64 flex-col items-center justify-center last:mr-20">
                        <a href="#">
                          <div className="w-14 flex-col justify-center sm:w-16">
                            <div className="relative mx-auto flex justify-center">
                              <svg
                                className="flex size-10 sm:size-14"
                                fill="none"
                                viewBox="0 0 501 500"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M250 472.942C373.127 472.942 472.942 373.128 472.942 250C472.942 126.873 373.127 27.0586 250 27.0586C126.873 27.0586 27.0581 126.873 27.0581 250C27.0581 373.128 126.873 472.942 250 472.942Z"
                                  fill="white"
                                />
                                <path
                                  d="M250 0C200.555 0 152.22 14.6622 111.108 42.1326C69.9953 69.603 37.9521 108.648 19.0302 154.329C0.10832 200.011 -4.84251 250.277 4.80379 298.773C14.4501 347.268 38.2603 391.814 73.2234 426.777C108.187 461.74 152.732 485.55 201.228 495.196C249.723 504.843 299.989 499.892 345.671 480.97C391.353 462.048 430.397 430.005 457.868 388.893C485.338 347.78 500 299.445 500 250C500.096 217.265 493.743 184.832 481.304 154.552C468.865 124.272 450.583 96.7386 427.503 73.5239C404.424 50.3092 376.997 31.8678 346.791 19.2525C316.584 6.63727 284.188 0.0952523 251.453 0H250ZM254.237 258.475L228.208 346.247H367.434C368.356 346.215 369.275 346.364 370.14 346.688C371.004 347.011 371.796 347.501 372.471 348.131C373.145 348.761 373.689 349.517 374.071 350.357C374.453 351.197 374.666 352.104 374.697 353.027V355.327L362.591 397.094C362.057 399.07 360.868 400.805 359.218 402.015C357.568 403.225 355.555 403.838 353.511 403.753H140.436L176.15 282.082L136.199 294.189L145.279 266.344L185.23 254.237L235.472 83.5351C236.025 81.571 237.22 79.8484 238.865 78.6417C240.511 77.435 242.513 76.8136 244.552 76.8765H298.426C299.349 76.8442 300.268 76.9939 301.132 77.3172C301.997 77.6405 302.789 78.131 303.464 78.7607C304.138 79.3903 304.682 80.1468 305.064 80.9868C305.446 81.8268 305.659 82.7339 305.69 83.6562V85.9564L263.317 230.024L303.269 217.918L294.794 246.973L254.237 258.475Z"
                                  fill="#345D9D"
                                />
                              </svg>
                            </div>
                            <span className="mx-auto mt-2 flex justify-center text-center text-xs font-bold sm:text-sm">
                              LTC
                            </span>
                          </div>
                        </a>
                      </div>
                      <div className="mx-auto flex w-64 flex-col items-center justify-center last:mr-20">
                        <a href="#">
                          <div className="w-14 flex-col justify-center sm:w-16">
                            <div className="relative mx-auto flex justify-center">
                              <svg
                                className="flex size-10 sm:size-14"
                                fill="none"
                                height={500}
                                viewBox="0 0 500 500"
                                width={500}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M250 0C388.084 0 500 111.939 500 250C500 388.084 388.084 500 250 500C111.939 500 0 388.073 0 250C0 111.939 111.939 0 250 0Z"
                                  fill="#F5AC37"
                                />
                                <path
                                  d="M259.214 267.652H354.21C356.235 267.652 357.191 267.652 357.337 264.997C358.114 255.333 358.114 245.613 357.337 235.937C357.337 234.059 356.404 233.282 354.367 233.282H165.309C162.969 233.282 162.339 234.059 162.339 236.252V264.063C162.339 267.652 162.339 267.652 166.085 267.652H259.214ZM346.728 200.781C346.998 200.072 346.998 199.296 346.728 198.598C345.142 195.145 343.263 191.848 341.081 188.754C337.796 183.467 333.926 178.596 329.516 174.219C327.434 171.576 325.027 169.202 322.327 167.188C308.804 155.679 292.728 147.534 275.448 143.439C266.729 141.482 257.819 140.548 248.886 140.627H164.983C162.643 140.627 162.328 141.56 162.328 143.597V199.06C162.328 201.4 162.328 202.03 165.298 202.03H345.603C345.603 202.03 347.167 201.715 347.482 200.781H346.717H346.728ZM346.728 300.153C344.073 299.861 341.396 299.861 338.741 300.153H165.467C163.127 300.153 162.339 300.153 162.339 303.281V357.506C162.339 360.004 162.339 360.634 165.467 360.634H245.466C249.291 360.926 253.116 360.656 256.863 359.857C268.473 359.025 279.892 356.505 290.782 352.354C294.742 350.981 298.567 349.192 302.178 347.044H303.269C322.023 337.29 337.256 321.967 346.863 303.157C346.863 303.157 347.955 300.794 346.728 300.176V300.153ZM130.94 388.748V387.814V351.409V339.067V302.347C130.94 300.311 130.94 300.007 128.443 300.007H94.5347C92.6559 300.007 91.8796 300.007 91.8796 297.509V267.82H128.128C130.153 267.82 130.94 267.82 130.94 265.165V235.791C130.94 233.912 130.94 233.451 128.443 233.451H94.5347C92.6559 233.451 91.8796 233.451 91.8796 230.954V203.458C91.8796 201.737 91.8796 201.276 94.3772 201.276H127.97C130.31 201.276 130.94 201.276 130.94 198.306V114.087C130.94 111.59 130.94 110.96 134.068 110.96H251.249C259.754 111.297 268.203 112.231 276.561 113.772C293.785 116.956 310.334 123.11 325.466 131.896C335.501 137.803 344.737 144.935 352.961 153.148C359.149 159.572 364.729 166.524 369.679 173.927C374.595 181.431 378.679 189.452 381.885 197.833C382.279 200.016 384.371 201.49 386.554 201.118H414.522C418.11 201.118 418.11 201.118 418.268 204.561V230.189C418.268 232.686 417.334 233.316 414.825 233.316H393.259C391.076 233.316 390.446 233.316 390.604 236.129C391.459 245.646 391.459 255.198 390.604 264.715C390.604 267.37 390.604 267.685 393.585 267.685H418.257C419.348 269.092 418.257 270.498 418.257 271.915C418.414 273.727 418.414 275.56 418.257 277.372V296.283C418.257 298.938 417.48 299.726 415.129 299.726H385.598C383.539 299.332 381.536 300.648 381.064 302.696C374.032 320.977 362.782 337.368 348.247 350.509C342.937 355.29 337.357 359.79 331.53 363.941C325.274 367.541 319.188 371.288 312.776 374.258C300.974 379.568 288.599 383.483 275.898 385.969C263.838 388.129 251.609 389.108 239.335 388.939H130.895V388.781L130.94 388.748Z"
                                  fill="#FEFEFD"
                                />
                              </svg>
                            </div>
                            <span className="mx-auto mt-2 flex justify-center text-center text-xs font-bold sm:text-sm">
                              DAI
                            </span>
                          </div>
                        </a>
                      </div>
                      <div className="mx-auto flex w-64 flex-col items-center justify-center last:mr-20">
                        <a href="#">
                          <div className="w-14 flex-col justify-center sm:w-16">
                            <div className="relative mx-auto flex justify-center">
                              <svg
                                className="flex size-10 sm:size-14"
                                fill="none"
                                height={500}
                                viewBox="0 0 500 500"
                                width={500}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clipPath="url(#clip0_2770_3)">
                                  <path
                                    d="M249.509 0C387.426 0 499.214 111.788 499.214 249.705C499.214 387.623 387.426 499.312 249.607 499.312C111.69 499.312 6.46902e-05 387.525 6.46902e-05 249.705C-0.0981671 111.788 111.69 0 249.509 0Z"
                                    fill="#0B0E11"
                                  />
                                  <rect
                                    fill="#00E98D"
                                    height={65}
                                    width={140}
                                    x={140}
                                    y={315}
                                  />
                                  <path
                                    clipRule="evenodd"
                                    d="M220 125H370V185H280V220H370V280H220V223V220V185V180V125Z"
                                    fill="white"
                                    fillRule="evenodd"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_2770_3">
                                    <rect
                                      fill="white"
                                      height={500}
                                      width={500}
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                            </div>
                            <span className="mx-auto mt-2 flex justify-center text-center text-xs font-bold sm:text-sm">
                              FDUSD
                            </span>
                          </div>
                        </a>
                      </div>
                      <div className="mx-auto flex w-64 flex-col items-center justify-center last:mr-20">
                        <a href="#">
                          <div className="w-14 flex-col justify-center sm:w-16">
                            <div className="relative mx-auto flex justify-center">
                              <svg
                                className="flex size-10 sm:size-14"
                                fill="none"
                                height={500}
                                viewBox="0 0 500 500"
                                width={500}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  clipRule="evenodd"
                                  d="M0 250C0 111.929 111.929 0 250 0C388.07 0 500 111.929 500 250C500 388.07 388.07 500 250 500C111.929 500 0 388.07 0 250Z"
                                  fill="url(#_S_1_)"
                                  fillRule="evenodd"
                                />
                                <path
                                  d="M161.286 261.464L152.228 273.691C150.085 277.931 153.17 282.945 157.922 282.945H187.564C196.938 321.695 223.93 348.12 260.095 347.573C285.772 347.573 305.128 334.808 318.052 309.387C319.697 306.152 318.255 302.181 314.939 300.7L300.8 294.384C297.688 292.994 294.017 294.297 292.508 297.353C285.835 310.897 274.745 319.528 260.095 319.528C246.833 319.528 236.192 313.033 228.041 299.909C224.855 294.828 222.319 289.159 220.391 282.948H258.356C260.761 282.948 262.964 281.594 264.049 279.447L273.108 267.22C275.25 262.977 272.166 257.966 267.414 257.966H216.119C215.972 255.336 215.88 252.655 215.88 249.887C215.852 247.147 215.93 244.464 216.074 241.82H258.356C260.761 241.82 262.964 240.466 264.049 238.32L273.108 226.092C275.25 221.853 272.166 216.839 267.414 216.839H220.344C227.228 194.391 241.602 179.684 260.095 179.975C274.186 179.975 285.128 187.689 292.144 200.327C293.716 203.158 297.256 204.244 300.219 202.934L314.431 196.659C317.831 195.158 319.277 191.047 317.477 187.794C304.361 164.103 285.233 152.203 260.095 152.203C237.158 152.203 218.783 161.32 204.83 179.422C196.675 190.084 190.995 202.591 187.628 216.839H166.983C164.578 216.839 162.375 218.194 161.291 220.341L152.232 232.567C150.089 236.811 153.174 241.82 157.925 241.82H184.217C184.091 244.475 183.969 247.136 183.969 249.887C183.933 252.616 184 255.305 184.116 257.966H166.986C164.581 257.966 162.372 259.317 161.286 261.464Z"
                                  fill="white"
                                />
                                <path
                                  d="M85.4925 239.471C90.6397 157.285 156.802 90.9162 238.969 85.5275C282.162 82.695 322.1 96.6479 352.978 121.441C355.975 123.847 360.269 123.738 363.136 121.179L375.247 110.374C378.841 107.17 378.766 101.49 375.055 98.4232C339.036 68.6543 292.272 51.445 241.536 53.5843C140.913 57.8279 59.0325 138.766 53.6894 239.341C51.3784 282.842 63.3076 323.503 85.2159 357.096C87.8384 361.119 93.4583 361.816 97.0437 358.619L109.141 347.824C112.002 345.272 112.618 341.028 110.569 337.789C92.7545 309.603 83.2236 275.689 85.4925 239.471Z"
                                  fill="white"
                                />
                                <path
                                  d="M414.779 142.902C412.156 138.882 406.537 138.182 402.951 141.378L390.854 152.173C387.994 154.726 387.378 158.97 389.426 162.209C407.24 190.395 416.772 224.312 414.5 260.531C409.348 342.712 343.186 409.078 261.019 414.467C217.825 417.3 177.892 403.346 147.01 378.553C144.012 376.148 139.72 376.256 136.852 378.815L124.744 389.621C121.152 392.825 121.225 398.504 124.937 401.571C160.959 431.343 207.723 448.55 258.462 446.411C359.086 442.162 440.965 361.221 446.303 260.646C448.609 217.148 436.684 176.487 414.779 142.902Z"
                                  fill="white"
                                />
                                <defs>
                                  <linearGradient
                                    gradientUnits="userSpaceOnUse"
                                    id="_S_1_"
                                    x1="55835.8"
                                    x2="20480.8"
                                    y1="55835.8"
                                    y2="20480.8"
                                  >
                                    <stop stopColor="#8656EF" />
                                    <stop offset="0.97" stopColor="#1AA3FF" />
                                  </linearGradient>
                                </defs>
                              </svg>
                            </div>
                            <span className="mx-auto mt-2 flex justify-center text-center text-xs font-bold sm:text-sm">
                              EUROC
                            </span>
                          </div>
                        </a>
                      </div>
                      <div className="mx-auto flex w-64 flex-col items-center justify-center last:mr-20">
                        <a href="#">
                          <div className="w-14 flex-col justify-center sm:w-16">
                            <div className="relative mx-auto flex justify-center">
                              <svg
                                className="flex size-10 sm:size-14"
                                fill="none"
                                viewBox="0 0 500 500"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M498.53 223.89C512.959 361.163 413.359 484.145 276.071 498.58C138.842 512.994 15.8528 413.396 1.43309 276.128C-13.0167 138.846 86.5712 15.8514 223.822 1.42972C361.103 -13.0027 484.097 86.6099 498.53 223.89Z"
                                  fill="#F7931A"
                                />
                                <path
                                  d="M348.645 185.584C345.127 152.134 316.128 141.163 279.611 138.284L279.205 91.8445L250.93 92.0961L251.326 137.312C243.902 137.376 236.308 137.589 228.762 137.805L228.369 92.29L200.117 92.5358L200.511 138.963C194.392 139.141 188.383 139.307 182.523 139.362L182.518 139.218L143.53 139.545L143.801 169.736C143.801 169.736 164.672 169.156 164.328 169.543C175.778 169.447 179.57 176.059 180.697 181.788L181.161 234.693C181.951 234.69 182.982 234.714 184.15 234.864L181.172 234.892L181.804 309.008C181.333 312.616 179.265 318.38 171.265 318.464C171.63 318.781 150.717 318.638 150.717 318.638L145.397 352.453L182.191 352.129C189.037 352.077 195.773 352.134 202.379 352.121L202.803 399.097L231.04 398.855L230.641 352.381C238.388 352.475 245.892 352.471 253.217 352.401L253.608 398.659L281.876 398.409L281.475 351.524C328.975 348.382 362.14 336.118 365.868 291.465C368.889 255.501 351.853 239.612 324.817 233.361C341.13 224.858 351.255 210.062 348.645 185.584ZM309.966 286.362C310.281 321.464 250.155 318.001 230.988 318.181L230.452 255.95C249.615 255.788 309.626 249.757 309.966 286.362ZM296.045 198.679C296.315 230.613 246.16 227.324 230.195 227.467L229.704 171.026C245.669 170.884 295.759 165.37 296.045 198.679Z"
                                  fill="white"
                                />
                              </svg>
                            </div>
                            <span className="mx-auto mt-2 flex justify-center text-center text-xs font-bold sm:text-sm">
                              Bitcoin
                            </span>
                          </div>
                        </a>
                      </div>
                      <div className="mx-auto flex w-64 flex-col items-center justify-center last:mr-20">
                        <a href="#">
                          <div className="w-14 flex-col justify-center sm:w-16">
                            <div className="relative mx-auto flex justify-center">
                              <svg
                                className="flex size-10 sm:size-14"
                                fill="none"
                                height={508}
                                viewBox="0 0 508 508"
                                width={508}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clipPath="url(#clip0_2372_63)">
                                  <path
                                    clipRule="evenodd"
                                    d="M254 0C394.289 0 508 113.711 508 254C508 394.289 394.289 508 254 508C113.711 508 0 394.289 0 254C0 113.711 113.711 0 254 0Z"
                                    fill="#F0B90B"
                                    fillRule="evenodd"
                                  />
                                  <path
                                    d="M139.599 254L139.782 321.158L196.84 354.747V394.066L106.376 341.01V234.371L139.599 254ZM139.599 186.842V225.979L106.355 206.309V167.173L139.599 147.523L173.005 167.193L139.599 186.842ZM220.676 167.173L253.919 147.503L287.325 167.173L253.919 186.842L220.676 167.173Z"
                                    fill="white"
                                  />
                                  <path
                                    d="M163.617 307.238V267.919L196.861 287.589V326.725L163.617 307.238ZM220.676 368.828L253.919 388.498L287.325 368.828V407.965L253.919 427.634L220.676 407.965V368.828ZM334.976 167.173L368.219 147.503L401.625 167.173V206.309L368.219 225.979V186.842L334.976 167.173ZM368.219 321.158L368.402 254L401.646 234.33V340.97L311.181 394.025V354.706L368.219 321.158Z"
                                    fill="white"
                                  />
                                  <path
                                    d="M344.384 307.238L311.141 326.725V287.589L344.384 267.919V307.238Z"
                                    fill="white"
                                  />
                                  <path
                                    d="M344.383 200.762L344.566 240.081L287.324 273.67V340.99L254.081 360.477L220.837 340.99V273.67L163.596 240.081V200.762L196.981 181.092L253.877 214.843L311.119 181.092L344.525 200.762H344.383ZM163.616 133.604L253.918 80.3657L344.383 133.604L311.139 153.274L253.898 119.522L196.86 153.274L163.616 133.604Z"
                                    fill="white"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_2372_63">
                                    <rect
                                      fill="white"
                                      height={508}
                                      width={508}
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                            </div>
                            <span className="mx-auto mt-2 flex justify-center text-center text-xs font-bold sm:text-sm">
                              Binance
                            </span>
                          </div>
                        </a>
                      </div>
                      <div className="mx-auto flex w-64 flex-col items-center justify-center last:mr-20">
                        <a href="#">
                          <div className="w-14 flex-col justify-center sm:w-16">
                            <div className="relative mx-auto flex justify-center">
                              <svg
                                className="flex size-10 sm:size-14"
                                fill="none"
                                height={500}
                                viewBox="0 0 500 500"
                                width={500}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clipPath="url(#_S_2_-clip0)">
                                  <path
                                    d="M250 500C388.071 500 500 388.071 500 250C500 111.929 388.071 0 250 0C111.929 0 0 111.929 0 250C0 388.071 111.929 500 250 500Z"
                                    fill="black"
                                  />
                                  <path
                                    d="M150.565 318.125C152.335 316.079 154.738 314.927 157.244 314.922H387.716C388.669 314.927 389.593 315.249 390.342 315.837C391.119 316.434 391.725 317.284 392.083 318.279C392.44 319.274 392.533 320.369 392.35 321.424C392.166 322.48 391.715 323.449 391.053 324.209L345.527 376.662C344.679 377.65 343.636 378.453 342.462 379.019C341.335 379.561 340.1 379.843 338.848 379.845H108.376C107.43 379.832 106.515 379.507 105.772 378.921C105.002 378.325 104.401 377.481 104.044 376.494C103.687 375.494 103.592 374.419 103.767 373.371C103.943 372.321 104.384 371.354 105.034 370.591L150.565 318.125Z"
                                    fill="url(#_S_2_-paint0_linear)"
                                  />
                                  <path
                                    d="M150.565 122.362C152.354 120.353 154.746 119.215 157.244 119.186H387.716C388.651 119.184 389.565 119.503 390.342 120.1C391.119 120.698 391.725 121.548 392.083 122.543C392.44 123.538 392.533 124.632 392.35 125.688C392.166 126.744 391.715 127.713 391.053 128.473L345.527 180.926C344.679 181.914 343.635 182.716 342.462 183.283C341.335 183.825 340.1 184.107 338.848 184.109H108.376C107.43 184.096 106.515 183.771 105.772 183.185C105.002 182.589 104.401 181.744 104.044 180.757C103.687 179.757 103.592 178.682 103.767 177.634C103.932 176.61 104.37 175.65 105.034 174.854L150.565 122.362Z"
                                    fill="url(#_S_2_-paint1_linear)"
                                  />
                                  <path
                                    d="M345.532 219.316C344.687 218.316 343.643 217.501 342.467 216.924C341.342 216.374 340.106 216.087 338.853 216.085H108.404C107.47 216.086 106.557 216.409 105.781 217.016C105.005 217.623 104.4 218.485 104.042 219.493C103.683 220.516 103.59 221.614 103.772 222.683C103.953 223.754 104.402 224.738 105.062 225.511L150.589 278.746C151.434 279.747 152.478 280.562 153.653 281.139C154.779 281.688 156.015 281.975 157.267 281.977H387.717C388.651 281.978 389.565 281.655 390.342 281.049C391.119 280.442 391.725 279.58 392.083 278.57C392.44 277.56 392.533 276.449 392.35 275.378C392.166 274.306 391.715 273.323 391.053 272.551L345.532 219.316Z"
                                    fill="url(#_S_2_-paint2_linear)"
                                  />
                                </g>
                                <defs>
                                  <linearGradient
                                    gradientUnits="userSpaceOnUse"
                                    id="_S_2_-paint0_linear"
                                    x1="365.701"
                                    x2="167.839"
                                    y1="87.769"
                                    y2="416.693"
                                  >
                                    <stop stopColor="#00FFA3" />
                                    <stop offset={1} stopColor="#DC1FFF" />
                                  </linearGradient>
                                  <linearGradient
                                    gradientUnits="userSpaceOnUse"
                                    id="_S_2_-paint1_linear"
                                    x1="295.96"
                                    x2="98.1045"
                                    y1="45.9"
                                    y2="374.832"
                                  >
                                    <stop stopColor="#00FFA3" />
                                    <stop offset={1} stopColor="#DC1FFF" />
                                  </linearGradient>
                                  <linearGradient
                                    gradientUnits="userSpaceOnUse"
                                    id="_S_2_-paint2_linear"
                                    x1="330.612"
                                    x2="128.414"
                                    y1="64.1091"
                                    y2="395.286"
                                  >
                                    <stop stopColor="#00FFA3" />
                                    <stop offset={1} stopColor="#DC1FFF" />
                                  </linearGradient>
                                  <clipPath id="_S_2_-clip0">
                                    <rect
                                      fill="white"
                                      height={500}
                                      width={500}
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                            </div>
                            <span className="mx-auto mt-2 flex justify-center text-center text-xs font-bold sm:text-sm">
                              Solana
                            </span>
                          </div>
                        </a>
                      </div>
                      <div className="mx-auto flex w-64 flex-col items-center justify-center last:mr-20">
                        <a href="#">
                          <div className="w-14 flex-col justify-center sm:w-16">
                            <div className="relative mx-auto flex justify-center">
                              <svg
                                className="flex size-10 sm:size-14"
                                fill="none"
                                height={240}
                                viewBox="0 0 240 240"
                                width={240}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  fill="#162F29"
                                  height={240}
                                  rx={120}
                                  width={240}
                                />
                                <path
                                  d="M211.875 120.492C211.875 121.424 211.862 122.355 211.835 123.287H211.729H167.148V121.251H124.139C124.139 120.825 124.152 120.399 124.152 119.987C124.152 119.574 124.152 119.135 124.139 118.722H167.148V116.7H167.215H211.795C211.848 117.964 211.875 119.228 211.875 120.492ZM123.38 111.324L165.472 106.147L165.725 108.17L210.172 102.7C209.746 100.518 209.24 98.362 208.668 96.2461L164.913 101.636L165.166 103.658L122.874 108.862C123.061 109.687 123.234 110.512 123.38 111.35V111.324ZM121.184 103.179L161.413 93.1321L161.905 95.1017L204.596 84.4424C203.717 82.3797 202.773 80.3436 201.761 78.3608L160.322 88.7141L160.814 90.6836L120.253 100.824C120.586 101.609 120.892 102.394 121.184 103.193V103.179ZM117.618 95.5541L155.225 81.355L155.944 83.258L195.733 68.2338C194.442 66.3441 193.085 64.5077 191.648 62.7245L153.615 77.0833L154.333 78.9863L116.274 93.3584C116.74 94.077 117.192 94.8089 117.618 95.5541ZM112.681 88.5011L145.896 71.1881L146.828 72.9979L183.557 53.8484C181.867 52.2116 180.11 50.6546 178.3 49.1509L143.781 67.1426L144.712 68.9524L110.938 86.5582C111.523 87.197 112.109 87.8358 112.668 88.5011H112.681ZM104.67 80.8892L134.745 61.7664L135.836 63.483L169.025 42.3773C166.936 41.0466 164.806 39.809 162.611 38.6512L132.309 57.9205L133.401 59.6372L102.461 79.3056C103.219 79.8113 103.951 80.3436 104.683 80.8892H104.67ZM97.5635 76.4445L122.768 55.778L124.059 57.3483L152.444 34.0601C150.035 33.1419 147.56 32.3169 145.058 31.5983L119.88 52.2515L121.171 53.8218L95.0484 75.2469C95.9001 75.6195 96.7385 76.0187 97.5635 76.4445ZM88.1551 72.785L108.063 52.9701L109.487 54.4073L134.785 29.2694C132.043 28.817 129.262 28.4843 126.441 28.2714L104.869 49.7364L106.293 51.1736L85.2674 72.093C86.2389 72.2926 87.197 72.5188 88.1551 72.785ZM77.1498 71.1215L93.0257 51.8789L94.596 53.1697L115.263 28.125C112.122 28.2714 109.021 28.5775 105.974 29.0299L89.5125 48.9779L91.0828 50.2687L73.8895 71.1082C74.3686 71.0949 74.8609 71.0816 75.34 71.0816C75.9522 71.0816 76.551 71.0816 77.1498 71.1082V71.1215ZM67.635 71.6938L79.8646 52.7705L81.5679 53.875L96.3526 30.9861C92.9725 31.8644 89.6722 32.929 86.4518 34.1666L76.0453 50.282L77.7487 51.3865L64.2016 72.3591C65.3328 72.093 66.4772 71.8668 67.635 71.6805V71.6938ZM57.0688 74.6347L65.8651 58.1467L67.6483 59.1049L79.2923 37.2939C75.5529 39.117 71.9599 41.1797 68.5266 43.4685L61.8329 56.0042L63.6294 56.9624L53.2762 76.3647C54.5005 75.7392 55.7647 75.167 57.0555 74.648L57.0688 74.6347ZM49.4835 78.5072L53.2229 67.8878L55.1392 68.5665L62.4051 47.9399C58.719 50.8675 55.259 54.0613 52.0519 57.508L48.9246 66.3841L50.8409 67.0628L45.9437 80.9558C47.0882 80.0908 48.2593 79.279 49.4702 78.5205L49.4835 78.5072ZM40.155 86.1058L41.8051 78.3874L43.7879 78.8133L47.1148 63.2701C43.6149 67.7148 40.5143 72.4922 37.8661 77.5358L39.3432 77.8551L36.3091 90.6303C37.4935 89.0467 38.7843 87.5297 40.155 86.1058ZM33.3016 95.1283V84.9081C30.8264 91.4421 29.0698 99.573 28.125 107.544C29.2828 103.126 31.0393 98.9608 33.3016 95.1283ZM28.1915 132.695C29.163 139.495 30.8663 146.056 33.2351 152.297V144.752C31.0527 141.026 29.336 136.98 28.1915 132.695ZM36.6285 149.795L39.2767 162.145L37.7996 162.464C40.4477 167.521 43.5484 172.285 47.0483 176.73L43.7214 161.187L41.7386 161.613L40.0618 153.801C38.8508 152.524 37.6931 151.193 36.6285 149.782V149.795ZM45.8506 158.978L50.7744 172.951L48.8581 173.629L51.9854 182.505C55.1925 185.952 58.6524 189.146 62.3386 192.073L55.0727 171.447L53.1564 172.125L49.4037 161.453C48.1927 160.681 47.0083 159.869 45.8639 159.004L45.8506 158.978ZM53.1963 163.595L63.5762 183.051L61.7797 184.009L68.4733 196.545C71.9067 198.834 75.4997 200.896 79.2391 202.719L67.5951 180.908L65.7985 181.867L56.9757 165.339C55.6848 164.82 54.4206 164.234 53.183 163.609L53.1963 163.595ZM64.1218 167.614L77.6821 188.613L75.9788 189.718L86.3852 205.833C89.6057 207.071 92.9059 208.136 96.286 209.014L81.5014 186.125L79.798 187.229L67.5551 168.28C66.3974 168.093 65.2396 167.867 64.1085 167.601L64.1218 167.614ZM73.8097 168.892L91.0029 189.731L89.4327 191.022L105.894 210.97C108.941 211.423 112.042 211.729 115.183 211.875L94.5161 186.817L92.9458 188.108L77.07 168.865C76.4978 168.892 75.9122 168.892 75.3267 168.892C74.821 168.892 74.302 168.892 73.7963 168.865L73.8097 168.892ZM85.2142 167.907L106.227 188.813L104.803 190.25L126.374 211.715C129.195 211.502 131.977 211.17 134.718 210.717L109.434 185.566L107.997 187.017L88.1019 167.215C87.1571 167.468 86.1856 167.707 85.2142 167.907ZM95.0085 164.78L121.105 186.192L119.814 187.762L144.991 208.415C147.493 207.696 149.968 206.871 152.377 205.953L123.979 182.665L122.688 184.235L97.5103 163.582C96.6852 164.008 95.8469 164.407 94.9952 164.78H95.0085ZM102.407 160.708L133.307 180.363L132.216 182.079L162.517 201.349C164.713 200.191 166.856 198.94 168.932 197.623L135.743 176.517L134.652 178.234L104.617 159.137C103.885 159.683 103.153 160.215 102.394 160.721L102.407 160.708ZM110.924 153.468L144.659 171.048L143.727 172.857L178.247 190.849C180.057 189.345 181.813 187.788 183.503 186.152L146.775 167.002L145.843 168.812L112.668 151.525C112.109 152.191 111.536 152.843 110.938 153.468H110.924ZM116.261 146.655L154.267 161.014L153.548 162.917L191.581 177.275C193.005 175.492 194.362 173.656 195.666 171.766L155.877 156.742L155.158 158.645L117.605 144.459C117.179 145.204 116.726 145.936 116.261 146.655ZM120.24 139.203L160.734 149.316L160.242 151.286L201.681 161.639C202.706 159.656 203.651 157.62 204.529 155.558L161.839 144.898L161.346 146.868L121.171 136.834C120.878 137.632 120.559 138.418 120.24 139.203ZM122.874 131.165L165.099 136.355L164.846 138.378L208.601 143.767C209.174 141.638 209.679 139.482 210.105 137.313L165.658 131.844L165.405 133.866L123.38 128.69C123.234 129.528 123.061 130.353 122.874 131.178V131.165Z"
                                  fill="white"
                                />
                                <defs>
                                  <radialGradient
                                    cx={0}
                                    cy={0}
                                    gradientTransform="translate(250.547 76.1825) rotate(90) scale(517.692 364.403)"
                                    gradientUnits="userSpaceOnUse"
                                    id="paint0_radial_850_2"
                                    r={1}
                                  >
                                    <stop
                                      offset="0.03125"
                                      stopColor="#3A3A3A"
                                    />
                                    <stop offset={1} stopColor="#1C1C1C" />
                                  </radialGradient>
                                  <linearGradient
                                    gradientUnits="userSpaceOnUse"
                                    id="paint1_linear_850_2"
                                    x1="250.031"
                                    x2="250.031"
                                    y1="9.59058e-05"
                                    y2="500.062"
                                  >
                                    <stop stopColor="white" />
                                    <stop offset={1} stopColor="#111111" />
                                  </linearGradient>
                                  <clipPath id="clip0_850_2">
                                    <rect
                                      fill="white"
                                      height={500}
                                      width={500}
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                              <span className="pointer-events-none absolute -top-3 left-1/2 z-5 -translate-x-1/2 rounded-full bg-primary-900 px-1.5 py-0.5 text-[10px] leading-none font-bold whitespace-nowrap text-white dark:bg-white dark:text-primary-900">
                                New
                              </span>
                            </div>
                            <span className="mx-auto mt-2 flex justify-center text-center text-xs font-bold sm:text-sm">
                              Plasma
                            </span>
                          </div>
                        </a>
                      </div>
                      <div className="mx-auto flex w-64 flex-col items-center justify-center last:mr-20">
                        <a href="#">
                          <div className="w-14 flex-col justify-center sm:w-16">
                            <div className="relative mx-auto flex justify-center">
                              <svg
                                className="flex size-10 sm:size-14"
                                fill="none"
                                height={509}
                                viewBox="0 0 509 509"
                                width={509}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M254 0C394.4 0 508.2 113.8 508.2 254.2C508.2 394.6 394.4 508.3 254.1 508.3C113.7 508.3 6.58546e-05 394.5 6.58546e-05 254.2C-0.0999341 113.8 113.7 0 254 0Z"
                                  fill="#DEE0E0"
                                />
                                <path
                                  d="M254.5 70V205.3C254.5 205.9 253.9 206.5 253.3 206.5C249.2 208.2 245.6 210 241.5 211.7C236.2 214 230.3 216.3 225 219.2L205.6 227.9L189.7 234.9L170.3 243.6C165 245.9 159.7 248.2 153.8 251.1C149.7 252.8 145 255.2 140.8 256.9C140.2 256.9 140.2 257.5 139.6 256.9H139C140.8 254 142.5 251.7 144.3 248.8C153.7 233.1 163.7 217.4 173.2 201.8C183.2 185 193.8 168.1 203.8 151.3C213.2 135.6 222.7 119.9 232.1 104.9C239.2 93.3 246.2 82.3 252.7 70.6C253.9 70.6 253.9 70 254.5 70Z"
                                  fill="#8A92B2"
                                />
                                <path
                                  d="M368.8 257C360 262.8 350.5 268 341.7 273.3C312.8 290.1 284.5 306.4 255.7 323.2C255.1 323.2 255.1 323.8 254.5 323.8C253.9 323.8 253.9 323.2 253.9 323.2V321.4V208.2V206.5C253.9 205.9 254.5 205.9 255.1 205.9C257.5 207.1 259.8 208.2 262.8 209.4C269.9 212.9 277.5 215.8 284.6 219.3C291.1 222.2 297 225.1 303.5 227.4C310 230.3 315.9 233.2 322.4 236.1C327.7 238.4 333.6 240.7 338.9 243.6C344.2 245.9 350.1 248.2 355.4 251.1C359.5 252.8 363.7 255.2 368.4 256.9C368.2 256.4 368.2 257 368.8 257Z"
                                  fill="#464A75"
                                />
                                <path
                                  d="M254.5 437.5C253.9 437.5 253.9 437.5 253.3 436.9C241.5 420.6 230.3 405 218.5 388.7L183.2 340C172 324.3 160.2 308.6 149 292.4L140.2 280.2C140.2 279.6 139.6 279.6 139.6 279C140.2 279 140.2 279.6 140.8 279.6C156.7 288.9 173.2 298.2 189.1 307.5C207.4 318.5 226.2 329 244.5 340C247.4 341.7 251 343.5 253.9 345.2C254.5 345.2 254.5 345.8 254.5 346.4C254.5 346.4 254.5 437.5 254.5 437.5Z"
                                  fill="#8A92B2"
                                />
                                <path
                                  d="M139.6 257C140.2 257 140.2 257 139.6 257C139.6 257.5 139.6 257.5 139.6 257Z"
                                  fill="#808081"
                                />
                                <path
                                  d="M140.199 257.5C140.199 257 140.199 257 140.199 257.5C146.099 254.6 151.999 252.3 157.899 249.4L180.899 238.9C186.799 236 192.699 233.7 198.599 230.8C206.799 226.7 215.699 223.3 223.899 219.2C229.799 216.9 235.699 214 241.599 211.7C245.699 210 249.799 208.2 253.999 205.9C254.599 205.9 254.599 205.3 255.199 205.3V323.7C254.599 324.3 254.599 323.7 253.999 323.7C252.199 322.5 250.499 322 249.299 320.8L141.499 258.1C140.799 257.5 140.199 257.5 140.199 257.5ZM368.199 279C368.199 279.6 368.199 279.6 367.599 280.2C333.399 327.8 299.199 374.8 265.099 422.4C261.599 427.6 257.999 432.3 254.499 437.5V436.9V435.7V346.9V345.2C262.199 340.6 269.799 335.9 277.499 331.8C307.599 314.4 337.599 297 367.699 279.5C367.599 279 368.199 279 368.199 279Z"
                                  fill="#636890"
                                />
                                <path
                                  d="M254.5 205.9V204.7V71.7V70.5L367.6 255.1C368.2 255.7 368.8 256.3 368.8 256.8C366.4 255.6 364.1 254.5 361.1 253.3C358.2 252.1 355.2 250.4 352.3 249.2C350.5 248.6 348.8 247.5 346.4 246.9C343.5 245.7 339.9 244 337 242.8C335.2 242.2 333.5 241.1 331.7 240.5L319.3 235.3C316.9 234.1 315.2 233.6 312.8 232.4C309.9 231.2 306.9 229.5 304 228.3C302.2 227.7 300.5 226.6 298.7 226L286.3 220.8C283.9 219.6 282.2 219.1 279.8 217.9C276.9 216.7 273.9 215 271 213.8C269.2 212.6 266.9 212.1 265.1 210.9L254.5 205.9Z"
                                  fill="#636890"
                                />
                              </svg>
                            </div>
                            <span className="mx-auto mt-2 flex justify-center text-center text-xs font-bold sm:text-sm">
                              Ethereum
                            </span>
                          </div>
                        </a>
                      </div>
                      <div className="mx-auto flex w-64 flex-col items-center justify-center last:mr-20">
                        <a href="#">
                          <div className="w-14 flex-col justify-center sm:w-16">
                            <div className="relative mx-auto flex justify-center">
                              <svg
                                className="flex size-10 sm:size-14"
                                fill="none"
                                height={509}
                                viewBox="0 0 509 509"
                                width={509}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M254.801 0.399902C395.201 0.399902 509.001 114.2 509.001 254.6C509.001 395 395.201 508.7 254.901 508.7C114.501 508.7 0.800847 394.9 0.800847 254.6C0.700847 114.2 114.501 0.399902 254.801 0.399902Z"
                                  fill="#8247E5"
                                />
                                <mask
                                  height={293}
                                  id="mask0_2360_11"
                                  maskUnits="userSpaceOnUse"
                                  width={334}
                                  x={86}
                                  y={110}
                                >
                                  <path
                                    d="M419.6 110.3H86.5V402.2H419.6V110.3Z"
                                    fill="white"
                                  />
                                </mask>
                                <g mask="url(#mask0_2360_11)">
                                  <path
                                    d="M338.1 199.2C332 195.7 324.2 195.7 317.3 199.2L268.7 228L235.7 246.3L188 275C181.9 278.5 174.1 278.5 167.2 275L129.9 252.3C123.8 248.8 119.5 241.8 119.5 234V190.4C119.5 183.4 123 176.5 129.9 172.1L167.2 150.3C173.3 146.8 181.1 146.8 188 150.3L225.3 173C231.4 176.5 235.7 183.5 235.7 191.3V220.1L268.7 200.9V171.3C268.7 164.3 265.2 157.4 258.3 153L188.9 112C182.8 108.5 175 108.5 168.1 112L96.9996 153.9C90.0996 157.4 86.5996 164.4 86.5996 171.3V253.2C86.5996 260.2 90.0996 267.1 96.9996 271.5L167.3 312.5C173.4 316 181.2 316 188.1 312.5L235.8 284.6L268.8 265.4L316.5 237.5C322.6 234 330.4 234 337.3 237.5L374.6 259.3C380.7 262.8 385 269.8 385 277.6V321.2C385 328.2 381.5 335.1 374.6 339.5L338.2 361.3C332.1 364.8 324.3 364.8 317.4 361.3L280 339.5C273.9 336 269.6 329 269.6 321.2V293.3L236.6 312.5V341.3C236.6 348.3 240.1 355.2 247 359.6L317.3 400.6C323.4 404.1 331.2 404.1 338.1 400.6L408.4 359.6C414.5 356.1 418.8 349.1 418.8 341.3V258.5C418.8 251.5 415.3 244.6 408.4 240.2L338.1 199.2Z"
                                    fill="white"
                                  />
                                </g>
                              </svg>
                            </div>
                            <span className="mx-auto mt-2 flex justify-center text-center text-xs font-bold sm:text-sm">
                              Polygon
                            </span>
                          </div>
                        </a>
                      </div>
                      <div className="mx-auto flex w-64 flex-col items-center justify-center last:mr-20">
                        <a href="#">
                          <div className="w-14 flex-col justify-center sm:w-16">
                            <div className="relative mx-auto flex justify-center">
                              <svg
                                className="flex size-10 sm:size-14"
                                fill="none"
                                height={508}
                                viewBox="0 0 508 508"
                                width={508}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M254 508C394.28 508 508 394.28 508 254C508 113.72 394.28 0 254 0C113.72 0 0 113.72 0 254C0 394.28 113.72 508 254 508Z"
                                  fill="#E84142"
                                />
                                <path
                                  d="M343.599 260.6C352.399 245.4 366.599 245.4 375.399 260.6L430.199 356.8C438.999 372 431.799 384.4 414.199 384.4H303.799C286.399 384.4 279.199 372 287.799 356.8L343.599 260.6ZM237.599 75.4C246.399 60.2 260.399 60.2 269.199 75.4L281.399 97.4L310.199 148C317.199 162.4 317.199 179.4 310.199 193.8L213.599 361.2C204.799 374.8 190.199 383.4 173.999 384.4H93.7988C76.1988 384.4 68.9988 372.2 77.7988 356.8L237.599 75.4Z"
                                  fill="white"
                                />
                              </svg>
                            </div>
                            <span className="mx-auto mt-2 flex justify-center text-center text-xs font-bold sm:text-sm">
                              Avalanche
                            </span>
                          </div>
                        </a>
                      </div>
                      <div className="mx-auto flex w-64 flex-col items-center justify-center last:mr-20">
                        <a href="#">
                          <div className="w-14 flex-col justify-center sm:w-16">
                            <div className="relative mx-auto flex justify-center">
                              <svg
                                className="flex size-10 sm:size-14"
                                fill="none"
                                height={509}
                                viewBox="0 0 509 509"
                                width={509}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M254 0C394.4 0 508.2 113.8 508.2 254.2C508.2 394.6 394.4 508.3 254.1 508.3C113.7 508.3 6.58546e-05 394.5 6.58546e-05 254.2C-0.0999341 113.8 113.7 0 254 0Z"
                                  fill="#2C374B"
                                />
                                <g clipPath="url(#clip0_2371_62)">
                                  <path
                                    d="M118.012 188.928V319.072C118.012 327.439 122.394 335.008 129.698 339.258L242.445 404.33C249.617 408.447 258.514 408.447 265.685 404.33L378.433 339.258C385.604 335.141 390.119 327.439 390.119 319.072V188.928C390.119 180.562 385.737 172.992 378.433 168.743L265.685 103.671C258.514 99.5538 249.617 99.5538 242.445 103.671L129.698 168.743C122.527 172.859 118.145 180.562 118.145 188.928H118.012Z"
                                    fill="#213147"
                                  />
                                  <path
                                    d="M278.569 279.232L262.5 323.322C262.102 324.517 262.102 325.845 262.5 327.173L290.122 403.002L322.127 384.543L283.748 279.232C282.818 276.842 279.498 276.842 278.569 279.232Z"
                                    fill="#12AAFF"
                                  />
                                  <path
                                    d="M310.84 205.13C309.91 202.739 306.59 202.739 305.661 205.13L289.592 249.219C289.193 250.415 289.193 251.743 289.592 253.071L334.877 377.239L366.881 358.779L310.84 205.263V205.13Z"
                                    fill="#12AAFF"
                                  />
                                  <path
                                    d="M254 108.584C254.797 108.584 255.593 108.85 256.257 109.248L378.168 179.632C379.629 180.429 380.425 182.022 380.425 183.616V324.384C380.425 325.978 379.496 327.571 378.168 328.368L256.257 398.752C255.593 399.15 254.797 399.416 254 399.416C253.203 399.416 252.406 399.15 251.742 398.752L129.832 328.368C128.371 327.571 127.574 325.978 127.574 324.384V183.483C127.574 181.89 128.504 180.296 129.832 179.499L251.742 109.115C252.406 108.717 253.203 108.451 254 108.451V108.584ZM254 88C249.617 88 245.368 89.0624 241.384 91.32L119.473 161.704C111.638 166.219 106.857 174.453 106.857 183.483V324.251C106.857 333.282 111.638 341.515 119.473 346.03L241.384 416.414C245.235 418.672 249.617 419.734 254 419.734C258.382 419.734 262.632 418.672 266.616 416.414L388.526 346.03C396.361 341.515 401.142 333.282 401.142 324.251V183.483C401.142 174.453 396.361 166.219 388.526 161.704L266.483 91.32C262.632 89.0624 258.249 88 253.867 88H254Z"
                                    fill="#9DCCED"
                                  />
                                  <path
                                    d="M173.258 377.371L184.546 346.562L207.122 365.286L186.007 384.675L173.258 377.371Z"
                                    fill="#213147"
                                  />
                                  <path
                                    d="M243.641 173.523H212.698C210.441 173.523 208.316 174.984 207.519 177.109L141.252 358.779L173.257 377.239L246.297 177.109C246.961 175.25 245.633 173.391 243.774 173.391L243.641 173.523Z"
                                    fill="white"
                                  />
                                  <path
                                    d="M297.823 173.523H266.881C264.623 173.523 262.499 174.984 261.702 177.109L186.006 384.543L218.011 403.002L300.347 177.109C301.011 175.25 299.683 173.391 297.823 173.391V173.523Z"
                                    fill="white"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_2371_62">
                                    <rect
                                      fill="white"
                                      height={332}
                                      transform="translate(88 88)"
                                      width={332}
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                            </div>
                            <span className="mx-auto mt-2 flex justify-center text-center text-xs font-bold sm:text-sm">
                              Arbitrum
                            </span>
                          </div>
                        </a>
                      </div>
                      <div className="mx-auto flex w-64 flex-col items-center justify-center last:mr-20">
                        <a href="#">
                          <div className="w-14 flex-col justify-center sm:w-16">
                            <div className="relative mx-auto flex justify-center">
                              <svg
                                className="flex size-10 sm:size-14"
                                fill="none"
                                height={500}
                                viewBox="0 0 500 500"
                                width={500}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g
                                  className="text-gray-900 dark:text-gray-50"
                                  clipPath="url(#clip0_2942_2)"
                                >
                                  <path
                                    d="M301 310.639L301.056 310.583L300.944 310.667L301 310.639ZM300.944 310.667C206.5 339 128.361 380.361 79.4167 428.778L77.25 430.944C90.2778 443.25 104.528 454.278 119.972 463.611L123.278 459.556C172.698 399.282 232.956 348.784 300.944 310.667ZM311.861 268.639H0C3.62636 317.677 21.7453 364.531 52.0556 403.25L53.3889 401.889C83.6944 372.028 123.111 344.889 170.694 321.25C212.389 300.5 260.25 282.694 311.861 268.639ZM192.306 60.8889C276.052 144.662 383.421 200.813 500 221.806C485.889 97.0278 379.611 9.55121e-07 250.444 9.55121e-07C217.406 -0.002871 184.687 6.47106 154.139 19.0556C166.167 33.5556 179.056 47.6389 192.306 60.8889ZM79.4167 71.1945C128.361 119.694 206.528 161 301 189.417C251.558 161.623 206.093 127.285 165.833 87.3333C150.972 72.5556 136.667 56.7778 123.222 40.4444L119.917 36.3889C104.573 45.7062 90.2777 56.6489 77.2778 69.0278L79.4167 71.1945ZM192.306 439.083C178.972 452.333 166.139 466.444 154.139 480.944C184.687 493.529 217.406 500.003 250.444 500C379.611 500 485.889 402.944 500 278.139C383.44 299.142 276.093 355.292 192.361 439.056L192.306 439.083ZM170.639 178.667V178.722C123.111 155.056 83.6944 127.889 53.4167 98.0833L52.0278 96.75C21.7326 135.465 3.62373 182.308 0 231.333H311.806C260.222 217.278 212.389 199.472 170.639 178.667Z"
                                    fill="currentColor"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_2942_2">
                                    <rect
                                      fill="white"
                                      height={500}
                                      width={500}
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                            </div>
                            <span className="mx-auto mt-2 flex justify-center text-center text-xs font-bold sm:text-sm">
                              Sonic
                            </span>
                          </div>
                        </a>
                      </div>
                      <div className="mx-auto flex w-64 flex-col items-center justify-center last:mr-20">
                        <a href="#">
                          <div className="w-14 flex-col justify-center sm:w-16">
                            <div className="relative mx-auto flex justify-center">
                              <svg
                                className="flex size-10 sm:size-14"
                                fill="none"
                                height={500}
                                viewBox="0 0 500 500"
                                width={500}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle
                                  cx={250}
                                  cy={250}
                                  fill="#4DA2FF"
                                  r={250}
                                />
                                <path
                                  clipRule="evenodd"
                                  d="M325.484 223.233C338.64 239.692 346.568 260.602 346.568 283.275C346.568 305.948 338.472 327.445 324.894 344.072L323.713 345.5L323.376 343.652C323.123 342.141 322.786 340.545 322.448 338.95C315.702 309.307 293.606 283.863 257.174 263.205C232.633 249.349 218.55 232.638 214.839 213.66C212.478 201.4 214.249 189.056 217.622 178.475C221.08 167.894 226.14 159.077 230.441 153.786L244.609 136.572C247.054 133.548 251.777 133.548 254.223 136.572L325.484 223.233ZM347.833 206.018L253.042 90.6375C251.271 88.4542 247.813 88.4542 246.042 90.6375L151.167 206.018L150.83 206.438C133.457 228.02 123 255.395 123 285.206C123 354.653 179.672 411 249.5 411C319.328 411 376 354.653 376 285.206C376 255.395 365.543 228.02 348.086 206.438L347.833 206.018ZM173.853 222.897L182.286 212.568L182.539 214.5C182.708 216.011 182.961 217.523 183.298 219.034C188.78 247.67 208.43 271.602 241.151 290.077C269.656 306.2 286.185 324.758 290.992 345.164C293.016 353.645 293.353 362.043 292.51 369.349L292.426 369.769L292.004 369.937C279.185 376.151 264.68 379.678 249.416 379.678C195.864 379.678 152.432 336.515 152.432 283.275C152.432 260.434 160.444 239.356 173.853 222.897Z"
                                  fill="white"
                                  fillRule="evenodd"
                                />
                              </svg>
                            </div>
                            <span className="mx-auto mt-2 flex justify-center text-center text-xs font-bold sm:text-sm">
                              SUI
                            </span>
                          </div>
                        </a>
                      </div>
                      <div className="mx-auto flex w-64 flex-col items-center justify-center last:mr-20">
                        <a href="#">
                          <div className="w-14 flex-col justify-center sm:w-16">
                            <div className="relative mx-auto flex justify-center">
                              <svg
                                className="flex size-10 sm:size-14"
                                fill="none"
                                height={500}
                                viewBox="0 0 500 500"
                                width={500}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle
                                  cx={250}
                                  cy={250}
                                  fill="#FF0420"
                                  r={250}
                                />
                                <path
                                  d="M177.133 316.446C162.247 316.446 150.051 312.943 140.544 305.938C131.162 298.808 126.471 288.676 126.471 275.541C126.471 272.789 126.784 269.411 127.409 265.408C129.036 256.402 131.35 245.581 134.352 232.947C142.858 198.547 164.812 181.347 200.213 181.347C209.845 181.347 218.476 182.973 226.107 186.225C233.738 189.352 239.742 194.106 244.12 200.486C248.498 206.74 250.688 214.246 250.688 223.002C250.688 225.629 250.375 228.944 249.749 232.947C247.873 244.08 245.621 254.901 242.994 265.408C238.616 282.546 231.048 295.368 220.29 303.874C209.532 312.255 195.147 316.446 177.133 316.446ZM179.76 289.426C186.766 289.426 192.707 287.362 197.586 283.234C202.59 279.106 206.155 272.789 208.281 264.283C211.158 252.524 213.348 242.266 214.849 233.51C215.349 230.883 215.599 228.194 215.599 225.441C215.599 214.058 209.657 208.366 197.774 208.366C190.768 208.366 184.764 210.43 179.76 214.558C174.882 218.687 171.379 225.004 169.253 233.51C167.001 241.891 164.749 252.149 162.498 264.283C161.997 266.784 161.747 269.411 161.747 272.163C161.747 283.672 167.752 289.426 179.76 289.426Z"
                                  fill="white"
                                />
                                <path
                                  d="M259.303 314.57C257.927 314.57 256.863 314.132 256.113 313.256C255.487 312.255 255.3 311.13 255.55 309.879L281.444 187.914C281.694 186.538 282.382 185.412 283.508 184.536C284.634 183.661 285.822 183.223 287.073 183.223H336.985C350.87 183.223 362.003 186.1 370.384 191.854C378.891 197.609 383.144 205.927 383.144 216.81C383.144 219.937 382.769 223.19 382.018 226.567C378.891 240.953 372.574 251.586 363.067 258.466C353.685 265.346 340.8 268.786 324.413 268.786H299.082L290.451 309.879C290.2 311.255 289.512 312.38 288.387 313.256C287.261 314.132 286.072 314.57 284.822 314.57H259.303ZM325.727 242.892C330.98 242.892 335.546 241.453 339.424 238.576C343.427 235.699 346.054 231.571 347.305 226.192C347.68 224.065 347.868 222.189 347.868 220.563C347.868 216.935 346.805 214.183 344.678 212.307C342.551 210.305 338.924 209.305 333.795 209.305H311.278L304.148 242.892H325.727Z"
                                  fill="white"
                                />
                              </svg>
                            </div>
                            <span className="mx-auto mt-2 flex justify-center text-center text-xs font-bold sm:text-sm">
                              Optimism
                            </span>
                          </div>
                        </a>
                      </div>
                      <div className="mx-auto flex w-64 flex-col items-center justify-center last:mr-20">
                        <a href="#">
                          <div className="w-14 flex-col justify-center sm:w-16">
                            <div className="relative mx-auto flex justify-center">
                              <svg
                                className="flex size-10 sm:size-14"
                                fill="none"
                                height={500}
                                viewBox="0 0 500 500"
                                width={500}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clipPath="url(#_S_3_-clip0_2867_8)">
                                  <mask
                                    height={500}
                                    id="_S_3_-mask0_2867_8"
                                    maskUnits="userSpaceOnUse"
                                    width={500}
                                    x={0}
                                    y={0}
                                  >
                                    <path
                                      d="M250 500C111.92 500 0 388.08 0 250C0 111.92 111.92 0 250 0C388.08 0 500 111.92 500 250C500 388.08 388.08 500 250 500Z"
                                      fill="white"
                                    />
                                  </mask>
                                  <g mask="url(#_S_3_-mask0_2867_8)">
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-103.6 247.82L-103.28 234.82L250 250Z"
                                      fill="#FEFEFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-103.34 236.98L-102.8 226.14L250 250Z"
                                      fill="#FDFEFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-102.92 228.32L-102.12 217.5L250 250Z"
                                      fill="#FCFDFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L-102.279 219.66L-101.219 208.86L250.001 250Z"
                                      fill="#FBFCFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-101.42 211.02L-100.1 200.26L250 250Z"
                                      fill="#FAFCFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L-100.359 202.42L-98.7794 191.68L250.001 250Z"
                                      fill="#F9FBFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-99.0801 193.82L-97.2401 183.14L250 250Z"
                                      fill="#F8FAFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-97.5996 185.28L-95.4996 174.64L250 250Z"
                                      fill="#F7FAFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-95.9199 176.78L-93.5399 166.18L250 250Z"
                                      fill="#F6F9FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-94.0195 168.3L-91.3795 157.78L250 250Z"
                                      fill="#F5F8FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-91.9004 159.88L-89.0204 149.42L250 250Z"
                                      fill="#F4F8FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-89.5996 151.52L-86.4396 141.14L250 250Z"
                                      fill="#F3F7FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-87.0801 143.22L-83.6601 132.92L250 250Z"
                                      fill="#F2F6FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L-84.3594 134.98L-80.6994 124.76L250.001 250Z"
                                      fill="#F1F6FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-81.4199 126.8L-77.5199 116.68L250 250Z"
                                      fill="#F0F5FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L-78.2988 118.7L-74.1588 108.68L250.001 250Z"
                                      fill="#EFF4FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-74.9805 110.68L-70.5805 100.78L250 250Z"
                                      fill="#EEF3FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L-71.459 102.76L-66.819 92.96L250.001 250Z"
                                      fill="#EDF3FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-67.7598 94.9197L-62.8798 85.2197L250 250Z"
                                      fill="#ECF2FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L-63.8594 87.1596L-58.7394 77.5996L250.001 250Z"
                                      fill="#EBF1FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-59.7598 79.5196L-54.4198 70.0596L250 250Z"
                                      fill="#EAF1FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-55.4805 71.9602L-49.9005 62.6602L250 250Z"
                                      fill="#E9F0FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-51.0195 64.5198L-45.2195 55.3398L250 250Z"
                                      fill="#E8EFFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L-46.3789 57.1797L-40.3389 48.1597L250.001 250Z"
                                      fill="#E7EFFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M249.999 250L-41.5605 49.9601L-35.3205 41.1001L249.999 250Z"
                                      fill="#E6EEFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M249.999 250L-36.5605 42.8797L-30.1005 34.1597L249.999 250Z"
                                      fill="#E5EDFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-31.4004 35.8998L-24.7204 27.3398L250 250Z"
                                      fill="#E4EDFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M249.999 250L-26.0605 29.0597L-19.1805 20.6797L249.999 250Z"
                                      fill="#E3ECFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L-20.5391 22.3601L-13.4591 14.1401L250.001 250Z"
                                      fill="#E2EBFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L-14.8789 15.7797L-7.59891 7.73975L250.001 250Z"
                                      fill="#E1EBFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M249.999 250L-9.06055 9.36L-1.58055 1.5L249.999 250Z"
                                      fill="#E0EAFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-3.08008 3.0799L4.59992 -4.6001L250 250Z"
                                      fill="#DFE9FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L3.08008 -3.08004L10.9201 -10.54L250 250Z"
                                      fill="#DEE9FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L9.36133 -9.06033L17.4013 -16.3403L250.001 250Z"
                                      fill="#DDE8FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L15.7812 -14.88L24.0012 -21.96L250.001 250Z"
                                      fill="#DCE7FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L22.3613 -20.5399L30.7413 -27.4199L250.001 250Z"
                                      fill="#DBE7FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L29.0605 -26.0602L37.6205 -32.7202L250.001 250Z"
                                      fill="#DAE6FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L35.9004 -31.3999L44.6204 -37.8599L250 250Z"
                                      fill="#D9E5FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L42.8809 -36.5603L51.7409 -42.8003L250.001 250Z"
                                      fill="#D8E5FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L49.9609 -41.5601L58.9809 -47.5801L250.001 250Z"
                                      fill="#D7E4FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L57.1797 -46.3802L66.3597 -52.1802L250 250Z"
                                      fill="#D6E3FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L64.5195 -51.0201L73.8195 -56.6001L250 250Z"
                                      fill="#D5E3FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L71.9609 -55.4803L81.4009 -60.8203L250.001 250Z"
                                      fill="#D4E2FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L79.5195 -59.7599L89.0795 -64.8799L250 250Z"
                                      fill="#D3E1FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L87.1602 -63.8602L96.8602 -68.7202L250 250Z"
                                      fill="#D2E0FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L94.9199 -67.7599L104.72 -72.3799L250 250Z"
                                      fill="#D1E0FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L102.76 -71.4599L112.68 -75.8599L250 250Z"
                                      fill="#D0DFFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L110.68 -74.9801L120.72 -79.1401L250 250Z"
                                      fill="#CFDEFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L118.701 -78.3002L128.841 -82.2002L250.001 250Z"
                                      fill="#CEDEFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L126.801 -81.4201L137.021 -85.0801L250.001 250Z"
                                      fill="#CDDDFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L134.98 -84.3602L145.28 -87.7402L250 250Z"
                                      fill="#CCDCFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L143.221 -87.0802L153.601 -90.2202L250.001 250Z"
                                      fill="#CBDCFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L151.52 -89.6L161.98 -92.48L250 250Z"
                                      fill="#CADBFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L159.881 -91.9L170.401 -94.54L250.001 250Z"
                                      fill="#C9DAFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L168.301 -94.0199L178.881 -96.3799L250.001 250Z"
                                      fill="#C8DAFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L176.781 -95.92L187.401 -98.02L250.001 250Z"
                                      fill="#C7D9FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L185.281 -97.6L195.961 -99.46L250.001 250Z"
                                      fill="#C6D8FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L193.82 -99.0802L204.56 -100.68L250 250Z"
                                      fill="#C5D8FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L202.42 -100.36L213.18 -101.68L250 250Z"
                                      fill="#C4D7FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L211.02 -101.42L221.82 -102.48L250 250Z"
                                      fill="#C3D6FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L219.66 -102.28L230.48 -103.08L250 250Z"
                                      fill="#C2D6FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L228.32 -102.92L239.16 -103.44L250 250Z"
                                      fill="#C1D5FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L236.98 -103.34L247.82 -103.6L250 250Z"
                                      fill="#C0D4FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L245.66 -103.56H256.5L250 250Z"
                                      fill="#BFD4FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L254.34 -103.56L265.18 -103.28L250 250Z"
                                      fill="#BED3FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L263.02 -103.34L273.84 -102.8L250 250Z"
                                      fill="#BDD2FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L271.68 -102.92L282.5 -102.12L250 250Z"
                                      fill="#BCD2FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L280.34 -102.28L291.14 -101.22L250 250Z"
                                      fill="#BBD1FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L288.96 -101.42L299.74 -100.1L250 250Z"
                                      fill="#BAD0FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L297.58 -100.36L308.32 -98.7799L250 250Z"
                                      fill="#B9D0FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L306.16 -99.0801L316.86 -97.2401L250 250Z"
                                      fill="#B8CFFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L314.72 -97.6001L325.36 -95.5001L250 250Z"
                                      fill="#B7CEFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L323.22 -95.9199L333.82 -93.5399L250 250Z"
                                      fill="#B6CDFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L331.7 -94.02L342.22 -91.38L250 250Z"
                                      fill="#B5CDFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L340.12 -91.8999L350.56 -89.0199L250 250Z"
                                      fill="#B4CCFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L348.48 -89.6001L358.86 -86.4401L250 250Z"
                                      fill="#B3CBFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L356.78 -87.0801L367.08 -83.6601L250 250Z"
                                      fill="#B2CBFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L365.02 -84.3599L375.24 -80.6999L250 250Z"
                                      fill="#B1CAFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L373.2 -81.4199L383.32 -77.5199L250 250Z"
                                      fill="#B0C9FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L381.28 -78.3003L391.32 -74.1603L250 250Z"
                                      fill="#AFC9FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L389.3 -74.98L399.22 -70.58L250 250Z"
                                      fill="#AEC8FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L397.24 -71.46L407.04 -66.82L250 250Z"
                                      fill="#ADC7FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L405.08 -67.7603L414.78 -62.8803L250 250Z"
                                      fill="#ACC7FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L412.84 -63.8599L422.4 -58.7399L250 250Z"
                                      fill="#ABC6FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L420.48 -59.7603L429.94 -54.4203L250 250Z"
                                      fill="#AAC5FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L428.04 -55.48L437.34 -49.9L250 250Z"
                                      fill="#A9C5FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L435.48 -51.02L444.64 -45.22L250 250Z"
                                      fill="#A8C4FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L442.82 -46.3799L451.84 -40.3399L250 250Z"
                                      fill="#A7C3FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L450.04 -41.5601L458.9 -35.3201L250 250Z"
                                      fill="#A6C3FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L457.12 -36.5601L465.84 -30.1001L250 250Z"
                                      fill="#A5C2FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L464.1 -31.3999L472.64 -24.7199L250 250Z"
                                      fill="#A4C1FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L470.94 -26.0601L479.32 -19.1801L250 250Z"
                                      fill="#A3C1FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L477.64 -20.54L485.86 -13.46L250 250Z"
                                      fill="#A2C0FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L484.22 -14.8799L492.26 -7.59988L250 250Z"
                                      fill="#A1BFFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L490.64 -9.06006L498.5 -1.58006L250 250Z"
                                      fill="#A0BFFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L496.92 -3.08008L504.6 4.59992L250 250Z"
                                      fill="#9FBEFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L503.06 3.08008L510.54 10.9201L250 250Z"
                                      fill="#9EBDFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L509.06 9.35986L516.34 17.3999L250 250Z"
                                      fill="#9DBDFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L514.88 15.7798L521.96 23.9998L250 250Z"
                                      fill="#9CBCFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L520.54 22.3599L527.42 30.7399L250 250Z"
                                      fill="#9BBBFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L526.06 29.0601L532.72 37.6201L250 250Z"
                                      fill="#9ABAFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L531.4 35.8999L537.86 44.6199L250 250Z"
                                      fill="#99BAFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L536.56 42.8799L542.8 51.7399L250 250Z"
                                      fill="#98B9FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L541.56 49.96L547.58 58.98L250 250Z"
                                      fill="#97B8FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L546.38 57.1797L552.18 66.3597L250 250Z"
                                      fill="#96B8FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L551.02 64.5195L556.6 73.8195L250 250Z"
                                      fill="#95B7FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L555.48 71.96L560.82 81.4L250 250Z"
                                      fill="#94B6FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L559.76 79.5195L564.86 89.0795L250 250Z"
                                      fill="#93B6FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L563.84 87.1602L568.72 96.8602L250 250Z"
                                      fill="#92B5FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L567.76 94.9199L572.38 104.72L250 250Z"
                                      fill="#91B4FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L571.46 102.76L575.86 112.68L250 250Z"
                                      fill="#90B4FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L574.98 110.68L579.12 120.72L250 250Z"
                                      fill="#8FB3FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L578.3 118.7L582.2 128.84L250 250Z"
                                      fill="#8EB2FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L581.42 126.8L585.08 137.02L250 250Z"
                                      fill="#8DB2FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 249.999L584.34 134.979L587.74 145.279L250 249.999Z"
                                      fill="#8CB1FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L587.06 143.22L590.22 153.6L250 250Z"
                                      fill="#8BB0FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L589.58 151.52L592.48 161.98L250 250Z"
                                      fill="#8AB0FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L591.9 159.88L594.54 170.4L250 250Z"
                                      fill="#89AFFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L594.02 168.3L596.38 178.88L250 250Z"
                                      fill="#88AEFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L595.9 176.78L598.02 187.4L250 250Z"
                                      fill="#87AEFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L597.6 185.28L599.46 195.96L250 250Z"
                                      fill="#86ADFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L599.08 193.82L600.68 204.56L250 250Z"
                                      fill="#85ACFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L600.36 202.42L601.68 213.18L250 250Z"
                                      fill="#84ACFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L601.42 211.02L602.48 221.82L250 250Z"
                                      fill="#83ABFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L602.28 219.66L603.08 230.48L250 250Z"
                                      fill="#82AAFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L602.92 228.32L603.44 239.16L250 250Z"
                                      fill="#81AAFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 249.999L603.34 236.979L603.6 247.819L250 249.999Z"
                                      fill="#80A9FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L603.54 245.66V256.5L250 250Z"
                                      fill="#7FA8FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L603.54 254.34L603.28 265.18L250 250Z"
                                      fill="#7EA7FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L603.34 263.02L602.8 273.84L250 250Z"
                                      fill="#7DA7FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L602.92 271.68L602.12 282.5L250 250Z"
                                      fill="#7CA6FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L602.28 280.34L601.22 291.14L250 250Z"
                                      fill="#7BA5FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L601.42 288.96L600.1 299.74L250 250Z"
                                      fill="#7AA5FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L600.36 297.58L598.76 308.32L250 250Z"
                                      fill="#79A4FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L599.08 306.16L597.24 316.86L250 250Z"
                                      fill="#78A3FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L597.6 314.72L595.48 325.36L250 250Z"
                                      fill="#77A3FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L595.9 323.22L593.54 333.82L250 250Z"
                                      fill="#76A2FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L594.02 331.7L591.38 342.22L250 250Z"
                                      fill="#75A1FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L591.9 340.12L589.02 350.56L250 250Z"
                                      fill="#74A1FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L589.58 348.48L586.44 358.86L250 250Z"
                                      fill="#73A0FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L587.06 356.78L583.66 367.08L250 250Z"
                                      fill="#729FFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L584.34 365.02L580.7 375.24L250 250Z"
                                      fill="#719FFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L581.42 373.2L577.52 383.32L250 250Z"
                                      fill="#709EFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L578.3 381.28L574.14 391.32L250 250Z"
                                      fill="#6F9DFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L574.98 389.3L570.58 399.22L250 250Z"
                                      fill="#6E9DFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L571.46 397.24L566.82 407.04L250 250Z"
                                      fill="#6D9CFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L567.76 405.08L562.88 414.78L250 250Z"
                                      fill="#6C9BFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L563.84 412.84L558.74 422.4L250 250Z"
                                      fill="#6B9BFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L559.76 420.48L554.42 429.94L250 250Z"
                                      fill="#6A9AFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L555.48 428.04L549.9 437.34L250 250Z"
                                      fill="#6999FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L551.02 435.48L545.22 444.64L250 250Z"
                                      fill="#6899FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L546.38 442.82L540.34 451.84L250 250Z"
                                      fill="#6798FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L541.56 450.04L535.32 458.9L250 250Z"
                                      fill="#6697FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L536.56 457.12L530.1 465.84L250 250Z"
                                      fill="#6597FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L531.4 464.1L524.72 472.64L250 250Z"
                                      fill="#6496FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L526.06 470.94L519.18 479.32L250 250Z"
                                      fill="#6395FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L520.54 477.64L513.46 485.86L250 250Z"
                                      fill="#6294FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L514.88 484.22L507.6 492.26L250 250Z"
                                      fill="#6194FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L509.06 490.64L501.58 498.5L250 250Z"
                                      fill="#6093FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L503.06 496.92L495.4 504.6L250 250Z"
                                      fill="#5F92FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L496.92 503.06L489.08 510.54L250 250Z"
                                      fill="#5E92FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L490.64 509.06L482.6 516.34L250 250Z"
                                      fill="#5D91FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L484.22 514.88L476 521.96L250 250Z"
                                      fill="#5C90FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L477.64 520.54L469.26 527.42L250 250Z"
                                      fill="#5B90FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L470.94 526.06L462.38 532.72L250 250Z"
                                      fill="#5A8FFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L464.1 531.4L455.38 537.86L250 250Z"
                                      fill="#598EFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L457.12 536.56L448.26 542.8L250 250Z"
                                      fill="#588EFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L450.04 541.56L441 547.58L250 250Z"
                                      fill="#578DFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L442.82 546.38L433.64 552.18L250 250Z"
                                      fill="#568CFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L435.48 551.02L426.18 556.6L250 250Z"
                                      fill="#558CFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L428.04 555.48L418.6 560.82L250 250Z"
                                      fill="#548BFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L420.48 559.76L410.92 564.86L250 250Z"
                                      fill="#538AFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L412.84 563.84L403.14 568.72L250 250Z"
                                      fill="#528AFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L405.08 567.76L395.28 572.38L250 250Z"
                                      fill="#5189FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L397.24 571.46L387.32 575.86L250 250Z"
                                      fill="#5088FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L389.3 574.98L379.28 579.12L250 250Z"
                                      fill="#4F88FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L381.28 578.3L371.16 582.2L250 250Z"
                                      fill="#4E87FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L373.2 581.42L362.98 585.08L250 250Z"
                                      fill="#4D86FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L365.02 584.34L354.72 587.74L250 250Z"
                                      fill="#4C86FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L356.78 587.06L346.4 590.22L250 250Z"
                                      fill="#4B85FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L348.48 589.58L338.02 592.48L250 250Z"
                                      fill="#4A84FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L340.12 591.9L329.58 594.54L250 250Z"
                                      fill="#4984FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L331.7 594.02L321.12 596.38L250 250Z"
                                      fill="#4883FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L323.22 595.9L312.58 598.02L250 250Z"
                                      fill="#4782FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L314.72 597.6L304.04 599.46L250 250Z"
                                      fill="#4681FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L306.16 599.08L295.44 600.68L250 250Z"
                                      fill="#4581FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L297.58 600.36L286.82 601.68L250 250Z"
                                      fill="#4480FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L288.96 601.42L278.18 602.48L250 250Z"
                                      fill="#437FFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L280.34 602.28L269.52 603.08L250 250Z"
                                      fill="#427FFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L271.68 602.92L260.84 603.44L250 250Z"
                                      fill="#417EFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L263.02 603.34L252.16 603.6L250 250Z"
                                      fill="#407DFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L254.34 603.54H243.48L250 250Z"
                                      fill="#3F7DFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L245.66 603.54L234.82 603.28L250 250Z"
                                      fill="#3E7CFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L236.981 603.34L226.141 602.8L250.001 250Z"
                                      fill="#3D7BFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L228.32 602.92L217.5 602.12L250 250Z"
                                      fill="#3C7BFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L219.661 602.28L208.861 601.22L250.001 250Z"
                                      fill="#3B7AFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L211.02 601.42L200.26 600.1L250 250Z"
                                      fill="#3A79FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L202.42 600.36L191.68 598.76L250 250Z"
                                      fill="#3979FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L193.821 599.08L183.141 597.24L250.001 250Z"
                                      fill="#3878FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L185.281 597.6L174.641 595.48L250.001 250Z"
                                      fill="#3777FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L176.78 595.9L166.18 593.54L250 250Z"
                                      fill="#3677FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L168.301 594.02L157.781 591.38L250.001 250Z"
                                      fill="#3576FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L159.88 591.9L149.42 589.02L250 250Z"
                                      fill="#3475FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L151.521 589.58L141.141 586.44L250.001 250Z"
                                      fill="#3375FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L143.22 587.06L132.92 583.66L250 250Z"
                                      fill="#3274FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L134.98 584.34L124.76 580.7L250 250Z"
                                      fill="#3173FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L126.8 581.42L116.68 577.52L250 250Z"
                                      fill="#3073FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L118.7 578.3L108.68 574.14L250 250Z"
                                      fill="#2F72FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L110.681 574.98L100.781 570.58L250.001 250Z"
                                      fill="#2E71FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L102.761 571.46L92.9609 566.82L250.001 250Z"
                                      fill="#2D71FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L94.9207 567.76L85.2207 562.88L250.001 250Z"
                                      fill="#2C70FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L87.1596 563.84L77.5996 558.74L250 250Z"
                                      fill="#2B6FFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L79.5206 559.76L70.0605 554.42L250.001 250Z"
                                      fill="#2A6EFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L71.9602 555.48L62.6602 549.9L250 250Z"
                                      fill="#296EFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L64.5198 551.02L55.3398 545.22L250 250Z"
                                      fill="#286DFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L57.1802 546.38L48.1602 540.34L250 250Z"
                                      fill="#276CFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L49.9596 541.56L41.0996 535.32L250 250Z"
                                      fill="#266CFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L42.8802 536.56L34.1602 530.1L250 250Z"
                                      fill="#256BFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L35.8998 531.4L27.3398 524.72L250 250Z"
                                      fill="#246AFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L29.0597 526.06L20.6797 519.18L250 250Z"
                                      fill="#236AFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L22.3606 520.54L14.1406 513.46L250.001 250Z"
                                      fill="#2269FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L15.7802 514.88L7.74023 507.6L250 250Z"
                                      fill="#2168FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L9.36 509.06L1.5 501.58L250 250Z"
                                      fill="#2068FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L3.08039 503.06L-4.59961 495.4L250 250Z"
                                      fill="#1F67FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L-3.07906 496.92L-10.5391 489.08L250.001 250Z"
                                      fill="#1E66FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-9.05984 490.64L-16.3398 482.6L250 250Z"
                                      fill="#1D66FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L-14.879 484.22L-21.959 476L250.001 250Z"
                                      fill="#1C65FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-20.5399 477.64L-27.4199 469.26L250 250Z"
                                      fill="#1B64FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L-26.0587 470.94L-32.7188 462.38L250.001 250Z"
                                      fill="#1A64FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L-31.3994 464.1L-37.8594 455.38L250.001 250Z"
                                      fill="#1963FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L-36.5588 457.12L-42.7988 448.26L250.001 250Z"
                                      fill="#1862FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-41.5601 450.04L-47.5801 441L250 250Z"
                                      fill="#1762FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-46.3797 442.82L-52.1797 433.64L250 250Z"
                                      fill="#1661FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-51.0196 435.48L-56.5996 426.18L250 250Z"
                                      fill="#1560FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-55.4803 428.04L-60.8203 418.6L250 250Z"
                                      fill="#1460FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L-59.7589 420.48L-64.8789 410.92L250.001 250Z"
                                      fill="#135FFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L-63.8587 412.84L-68.7188 403.14L250.001 250Z"
                                      fill="#125EFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L-67.7589 405.08L-72.3789 395.28L250.001 250Z"
                                      fill="#115EFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L-71.4594 397.24L-75.8594 387.32L250.001 250Z"
                                      fill="#105DFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L-74.9787 389.3L-79.1387 379.28L250.001 250Z"
                                      fill="#0F5CFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L-78.2992 381.28L-82.1992 371.16L250.001 250Z"
                                      fill="#0E5BFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-81.4201 373.2L-85.0801 362.98L250 250Z"
                                      fill="#0D5BFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-84.3602 365.02L-87.7402 354.72L250 250Z"
                                      fill="#0C5AFF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L-87.0787 356.78L-90.2188 346.4L250.001 250Z"
                                      fill="#0B59FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-89.6005 348.48L-92.4805 338.02L250 250Z"
                                      fill="#0A59FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L-91.8991 340.12L-94.5391 329.58L250.001 250Z"
                                      fill="#0958FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L-94.0189 331.7L-96.3789 321.12L250.001 250Z"
                                      fill="#0857FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-95.9195 323.22L-98.0195 312.58L250 250Z"
                                      fill="#0757FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L-97.599 314.72L-99.459 304.04L250.001 250Z"
                                      fill="#0656FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-99.0797 306.16L-100.68 295.44L250 250Z"
                                      fill="#0555FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-100.36 297.58L-101.68 286.82L250 250Z"
                                      fill="#0455FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-101.42 288.96L-102.48 278.18L250 250Z"
                                      fill="#0354FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-102.28 280.34L-103.08 269.52L250 250Z"
                                      fill="#0253FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250.001 250L-102.919 271.68L-103.439 260.84L250.001 250Z"
                                      fill="#0153FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M250 250L-103.34 263.02L-103.6 252.16L250 250Z"
                                      fill="#0052FF"
                                      fillRule="evenodd"
                                    />
                                    <path
                                      clipRule="evenodd"
                                      d="M249.999 250L-103.561 254.34V245.66L249.999 250Z"
                                      fill="white"
                                      fillRule="evenodd"
                                    />
                                  </g>
                                </g>
                                <defs>
                                  <clipPath id="_S_3_-clip0_2867_8">
                                    <rect
                                      fill="white"
                                      height={500}
                                      width={500}
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                            </div>
                            <span className="mx-auto mt-2 flex justify-center text-center text-xs font-bold sm:text-sm">
                              Base
                            </span>
                          </div>
                        </a>
                      </div>
                      <div className="mx-auto flex w-64 flex-col items-center justify-center last:mr-20">
                        <a href="#">
                          <div className="w-14 flex-col justify-center sm:w-16">
                            <div className="relative mx-auto flex justify-center">
                              <svg
                                className="flex size-10 sm:size-14"
                                fill="none"
                                viewBox="0 0 500 500"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="text-[#1E1E1C] dark:text-white"
                                  d="M482.072 157.149C475.432 140.549 467.021 124.834 457.061 110.004C412.129 43.6034 335.989 0 249.889 0C111.775 0 0 111.996 0 249.889C0 388.004 111.996 500 249.889 500C336.211 500 412.129 456.397 457.061 389.996C467.021 375.387 475.21 359.672 482.072 343.072C493.581 314.298 500 282.869 500 250.111C499.779 217.353 493.581 185.923 482.072 157.149ZM448.65 224.657H162.461C166.888 209.163 175.077 195.44 186.144 184.595C202.966 167.773 226.206 157.371 251.881 157.371H427.623C438.468 177.955 445.551 200.531 448.65 224.657ZM248.561 48.4728C305.445 48.4728 357.016 72.1558 393.758 110.226H258.079C219.345 110.226 184.374 125.941 159.141 151.173C139.442 170.872 125.719 196.104 120.629 224.657H48.6941C61.089 125.277 145.861 48.4728 248.561 48.4728ZM248.561 451.97C145.861 451.97 61.089 375.166 48.4728 275.786H120.407C132.359 340.859 189.464 390.217 258.079 390.217H393.758C357.238 428.287 305.666 451.97 248.561 451.97ZM251.881 343.293C209.385 343.293 173.528 314.741 162.461 275.786H448.65C445.551 299.911 438.247 322.488 427.623 343.293H251.881Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </div>
                            <span className="mx-auto mt-2 flex justify-center text-center text-xs font-bold sm:text-sm">
                              Worldchain
                            </span>
                          </div>
                        </a>
                      </div>
                      <div className="mx-auto flex w-64 flex-col items-center justify-center last:mr-20">
                        <a href="#">
                          <div className="w-14 flex-col justify-center sm:w-16">
                            <div className="relative mx-auto flex justify-center">
                              <svg
                                className="flex size-10 sm:size-14"
                                fill="none"
                                height={500}
                                viewBox="0 0 500 500"
                                width={500}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle
                                  cx={250}
                                  cy={250}
                                  fill="black"
                                  r={250}
                                />
                                <path
                                  d="M189.428 194.584H85.3056C82.4317 194.584 80 192.156 80 189.286V85.2987C80 82.4286 82.4317 80 85.3056 80H189.428C192.302 80 194.733 82.4286 194.733 85.2987V189.286C194.954 192.156 192.523 194.584 189.428 194.584Z"
                                  fill="white"
                                />
                                <path
                                  d="M414.694 194.806H310.572C307.698 194.806 305.267 192.377 305.267 189.507V85.5199C305.267 82.6498 307.698 80.2212 310.572 80.2212H414.694C417.568 80.2212 420 82.6498 420 85.5199V189.507C420 192.377 417.568 194.806 414.694 194.806Z"
                                  fill="white"
                                />
                                <path
                                  d="M189.428 420H85.3056C82.4317 420 80 417.571 80 414.701V310.714C80 307.844 82.4317 305.416 85.3056 305.416H189.428C192.302 305.416 194.733 307.844 194.733 310.714V414.701C194.954 417.351 192.523 420 189.428 420Z"
                                  fill="white"
                                />
                                <path
                                  d="M414.694 420H310.572C307.698 420 305.267 417.571 305.267 414.701V310.714C305.267 307.844 307.698 305.416 310.572 305.416H414.694C417.568 305.416 420 307.844 420 310.714V414.701C420 417.571 417.568 420 414.694 420Z"
                                  fill="white"
                                />
                                <path
                                  d="M302.17 307.844H198.048C195.174 307.844 192.742 305.415 192.742 302.545V198.558C192.742 195.688 195.174 193.259 198.048 193.259H302.17C305.044 193.259 307.475 195.688 307.475 198.558V302.545C307.697 305.415 305.265 307.844 302.17 307.844Z"
                                  fill="white"
                                />
                              </svg>
                            </div>
                            <span className="mx-auto mt-2 flex justify-center text-center text-xs font-bold sm:text-sm">
                              OKX
                            </span>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div className="pointer-events-none absolute top-0 right-0 h-full w-20 bg-linear-to-l from-gray-50 to-transparent sm:w-20 dark:from-gray-900" />
                    <div className="pointer-events-none absolute top-0 left-0 h-full w-5 bg-linear-to-l from-transparent to-gray-50 sm:w-5 dark:to-gray-900" />
                  </div>
                </div>
              </div>
              
              {/* Trending Vietnam Products tabbed showcase */}
              <TrendingProductsShowcase />

              <section>
                <div className="mx-auto max-w-(--breakpoint-2xl)">
                  <div className="mt-7 px-3 sm:mt-9">
                    <h2 className="text-xl font-semibold sm:text-2xl">
                      How it works
                    </h2>
                  </div>
                </div>
                <div className="scroll-pl-2xl scroll-pr-2xl mt-6 no-scrollbar flex w-full gap-4 overflow-x-auto scroll-smooth sm:gap-6">
                  <div className="flex w-80 shrink-0 flex-col overflow-hidden rounded-2xl bg-gray-100 lg:min-w-0 lg:flex-1 dark:bg-gray-800">
                    <div className="relative h-40 w-full sm:h-50">
                      <img
                        alt="Pick a product"
                        className="object-cover object-center"
                        data-nimg="fill"
                        decoding="async"
                        sizes="(max-width: 1024px) 320px, 33vw"
                        src="/assets/pick_product.png"
                        style={{
                          position: "absolute",
                          height: "100%",
                          width: "100%",
                          inset: 0,
                          color: "transparent",
                        }}
                      />
                    </div>
                    <div className="flex-1 bg-gray-200/70 px-5 pt-4 pb-6 dark:bg-gray-950/70">
                      <p className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
                        1. Pick a product
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Choose from 6,600+ gift cards, eSIMs, flights, stays and
                        mobile top-ups.
                      </p>
                    </div>
                  </div>
                  <div className="flex w-80 shrink-0 flex-col overflow-hidden rounded-2xl bg-gray-100 lg:min-w-0 lg:flex-1 dark:bg-gray-800">
                    <div className="relative h-40 w-full sm:h-50">
                      <img
                        alt="Pay with crypto"
                        className="object-cover object-center"
                        data-nimg="fill"
                        decoding="async"
                        loading="lazy"
                        sizes="(max-width: 1024px) 320px, 33vw"
                        src="/assets/pay_crypto.png"
                        style={{
                          position: "absolute",
                          height: "100%",
                          width: "100%",
                          inset: 0,
                          color: "transparent",
                        }}
                      />
                    </div>
                    <div className="flex-1 bg-gray-200/70 px-5 pt-4 pb-6 dark:bg-gray-950/70">
                      <p className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
                        2. Pay with crypto
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Use any wallet or exchange. Choose BTC, ETH, USDT, USDC
                        and many more.
                      </p>
                    </div>
                  </div>
                  <div className="flex w-80 shrink-0 flex-col overflow-hidden rounded-2xl bg-gray-100 lg:min-w-0 lg:flex-1 dark:bg-gray-800">
                    <div className="relative h-40 w-full sm:h-50">
                      <img
                        alt="Receive instantly"
                        className="object-cover object-center"
                        data-nimg="fill"
                        decoding="async"
                        loading="lazy"
                        sizes="(max-width: 1024px) 320px, 33vw"
                        src="/assets/receive_instantly.png"
                        style={{
                          position: "absolute",
                          height: "100%",
                          width: "100%",
                          inset: 0,
                          color: "transparent",
                        }}
                      />
                    </div>
                    <div className="flex-1 bg-gray-200/70 px-5 pt-4 pb-6 dark:bg-gray-950/70">
                      <p className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
                        3. Receive instantly
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Your product arrives in seconds, ready to use.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <div className="mt-7">
                <div className="mt-7 w-full overflow-x-clip sm:mt-9">
                  <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-3 sm:mt-9">
                    <h2 className="text-xl font-semibold sm:text-2xl">
                      What our customers say
                    </h2>
                    <div className="hidden md:block">
                      <div className="-mt-12 flex justify-end gap-x-3">
                        <button
                          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-200 transition duration-200 ease-in-out disabled:cursor-auto dark:bg-gray-800 opacity-0"
                          disabled
                        >
                          <svg
                            aria-hidden="true"
                            className="size-10 text-gray-500 dark:text-gray-100"
                            data-slot="icon"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              clipRule="evenodd"
                              d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                              fillRule="evenodd"
                            />
                          </svg>
                        </button>
                        <button className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-200 transition duration-200 ease-in-out disabled:cursor-auto dark:bg-gray-800 opacity-100">
                          <svg
                            aria-hidden="true"
                            className="size-10 text-gray-500 dark:text-gray-100"
                            data-slot="icon"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              clipRule="evenodd"
                              d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                              fillRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative w-full">
                    <div className="mt-3 no-scrollbar flex w-full gap-4 overflow-x-auto scroll-smooth pt-3 sm:gap-6 sm:pr-20 xl:gap-6 scroll-pl-2xl">
                      <div className="grid w-74 shrink-0 sm:w-81">
                        <a
                          className="group relative flex h-full flex-col justify-between rounded-xl bg-gray-100 p-4 transition hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none dark:bg-gray-800 dark:hover:bg-gray-700"
                          href="#"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <svg
                              className="h-7 w-auto flex-none"
                              viewBox="0 0 1132.8 278.2"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M297.7 98.6h114.7V120h-45.1v120.3h-24.8V120h-44.9V98.6zm109.8 39.1h21.2v19.8h.4c.7-2.8 2-5.5 3.9-8.1 1.9-2.6 4.2-5.1 6.9-7.2 2.7-2.2 5.7-3.9 9-5.3 3.3-1.3 6.7-2 10.1-2 2.6 0 4.5.1 5.5.2s2 .3 3.1.4v21.8c-1.6-.3-3.2-.5-4.9-.7-1.7-.2-3.3-.3-4.9-.3-3.8 0-7.4.8-10.8 2.3-3.4 1.5-6.3 3.8-8.8 6.7-2.5 3-4.5 6.6-6 11s-2.2 9.4-2.2 15.1v48.8h-22.6V137.7zm164 102.6h-22.2V226h-.4c-2.8 5.2-6.9 9.3-12.4 12.4-5.5 3.1-11.1 4.7-16.8 4.7-13.5 0-23.3-3.3-29.3-10s-9-16.8-9-30.3v-65.1H504v62.9c0 9 1.7 15.4 5.2 19.1 3.4 3.7 8.3 5.6 14.5 5.6 4.8 0 8.7-.7 11.9-2.2 3.2-1.5 5.8-3.4 7.7-5.9 2-2.4 3.4-5.4 4.3-8.8.9-3.4 1.3-7.1 1.3-11.1v-59.5h22.6v102.5zm38.5-32.9c.7 6.6 3.2 11.2 7.5 13.9 4.4 2.6 9.6 4 15.7 4 2.1 0 4.5-.2 7.2-.5s5.3-1 7.6-1.9c2.4-.9 4.3-2.3 5.9-4.1 1.5-1.8 2.2-4.1 2.1-7-.1-2.9-1.2-5.3-3.2-7.1-2-1.9-4.5-3.3-7.6-4.5-3.1-1.1-6.6-2.1-10.6-2.9-4-.8-8-1.7-12.1-2.6-4.2-.9-8.3-2.1-12.2-3.4-3.9-1.3-7.4-3.1-10.5-5.4-3.1-2.2-5.6-5.1-7.4-8.6-1.9-3.5-2.8-7.8-2.8-13 0-5.6 1.4-10.2 4.1-14 2.7-3.8 6.2-6.8 10.3-9.1 4.2-2.3 8.8-3.9 13.9-4.9 5.1-.9 10-1.4 14.6-1.4 5.3 0 10.4.6 15.2 1.7 4.8 1.1 9.2 2.9 13.1 5.5 3.9 2.5 7.1 5.8 9.7 9.8 2.6 4 4.2 8.9 4.9 14.6h-23.6c-1.1-5.4-3.5-9.1-7.4-10.9-3.9-1.9-8.4-2.8-13.4-2.8-1.6 0-3.5.1-5.7.4-2.2.3-4.2.8-6.2 1.5-1.9.7-3.5 1.8-4.9 3.2-1.3 1.4-2 3.2-2 5.5 0 2.8 1 5 2.9 6.7 1.9 1.7 4.4 3.1 7.5 4.3 3.1 1.1 6.6 2.1 10.6 2.9 4 .8 8.1 1.7 12.3 2.6 4.1.9 8.1 2.1 12.1 3.4 4 1.3 7.5 3.1 10.6 5.4 3.1 2.3 5.6 5.1 7.5 8.5 1.9 3.4 2.9 7.7 2.9 12.7 0 6.1-1.4 11.2-4.2 15.5-2.8 4.2-6.4 7.7-10.8 10.3-4.4 2.6-9.4 4.6-14.8 5.8-5.4 1.2-10.8 1.8-16.1 1.8-6.5 0-12.5-.7-18-2.2-5.5-1.5-10.3-3.7-14.3-6.6-4-3-7.2-6.7-9.5-11.1-2.3-4.4-3.5-9.7-3.7-15.8H610zm74.6-69.7h17.1v-30.8h22.6v30.8h20.4v16.9h-20.4v54.8c0 2.4.1 4.4.3 6.2.2 1.7.7 3.2 1.4 4.4.7 1.2 1.8 2.1 3.3 2.7 1.5.6 3.4.9 6 .9 1.6 0 3.2 0 4.8-.1 1.6-.1 3.2-.3 4.8-.7v17.5c-2.5.3-5 .5-7.3.8-2.4.3-4.8.4-7.3.4-6 0-10.8-.6-14.4-1.7-3.6-1.1-6.5-2.8-8.5-5-2.1-2.2-3.4-4.9-4.2-8.2-.7-3.3-1.2-7.1-1.3-11.3v-60.5h-17.1v-17.1zm76.1 0h21.4v13.9h.4c3.2-6 7.6-10.2 13.3-12.8 5.7-2.6 11.8-3.9 18.5-3.9 8.1 0 15.1 1.4 21.1 4.3 6 2.8 11 6.7 15 11.7 4 5 6.9 10.8 8.9 17.4 2 6.6 3 13.7 3 21.2 0 6.9-.9 13.6-2.7 20-1.8 6.5-4.5 12.2-8.1 17.2-3.6 5-8.2 8.9-13.8 11.9-5.6 3-12.1 4.5-19.7 4.5-3.3 0-6.6-.3-9.9-.9-3.3-.6-6.5-1.6-9.5-2.9-3-1.3-5.9-3-8.4-5.1-2.6-2.1-4.7-4.5-6.5-7.2h-.4v51.2h-22.6V137.7zm79 51.4c0-4.6-.6-9.1-1.8-13.5-1.2-4.4-3-8.2-5.4-11.6-2.4-3.4-5.4-6.1-8.9-8.1-3.6-2-7.7-3.1-12.3-3.1-9.5 0-16.7 3.3-21.5 9.9-4.8 6.6-7.2 15.4-7.2 26.4 0 5.2.6 10 1.9 14.4 1.3 4.4 3.1 8.2 5.7 11.4 2.5 3.2 5.5 5.7 9 7.5 3.5 1.9 7.6 2.8 12.2 2.8 5.2 0 9.5-1.1 13.1-3.2 3.6-2.1 6.5-4.9 8.8-8.2 2.3-3.4 4-7.2 5-11.5.9-4.3 1.4-8.7 1.4-13.2zm39.9-90.5h22.6V120h-22.6V98.6zm0 39.1h22.6v102.6h-22.6V137.7zm42.8-39.1H945v141.7h-22.6V98.6zm91.9 144.5c-8.2 0-15.5-1.4-21.9-4.1-6.4-2.7-11.8-6.5-16.3-11.2-4.4-4.8-7.8-10.5-10.1-17.1-2.3-6.6-3.5-13.9-3.5-21.8 0-7.8 1.2-15 3.5-21.6 2.3-6.6 5.7-12.3 10.1-17.1 4.4-4.8 9.9-8.5 16.3-11.2 6.4-2.7 13.7-4.1 21.9-4.1s15.5 1.4 21.9 4.1c6.4 2.7 11.8 6.5 16.3 11.2 4.4 4.8 7.8 10.5 10.1 17.1 2.3 6.6 3.5 13.8 3.5 21.6 0 7.9-1.2 15.2-3.5 21.8-2.3 6.6-5.7 12.3-10.1 17.1-4.4 4.8-9.9 8.5-16.3 11.2-6.4 2.7-13.7 4.1-21.9 4.1zm0-17.9c5 0 9.4-1.1 13.1-3.2 3.7-2.1 6.7-4.9 9.1-8.3 2.4-3.4 4.1-7.3 5.3-11.6 1.1-4.3 1.7-8.7 1.7-13.2 0-4.4-.6-8.7-1.7-13.1s-2.9-8.2-5.3-11.6c-2.4-3.4-5.4-6.1-9.1-8.2-3.7-2.1-8.1-3.2-13.1-3.2s-9.4 1.1-13.1 3.2c-3.7 2.1-6.7 4.9-9.1 8.2-2.4 3.4-4.1 7.2-5.3 11.6-1.1 4.4-1.7 8.7-1.7 13.1 0 4.5.6 8.9 1.7 13.2 1.1 4.3 2.9 8.2 5.3 11.6 2.4 3.4 5.4 6.2 9.1 8.3 3.7 2.2 8.1 3.2 13.1 3.2zm58.4-87.5h17.1v-30.8h22.6v30.8h20.4v16.9h-20.4v54.8c0 2.4.1 4.4.3 6.2.2 1.7.7 3.2 1.4 4.4.7 1.2 1.8 2.1 3.3 2.7 1.5.6 3.4.9 6 .9 1.6 0 3.2 0 4.8-.1 1.6-.1 3.2-.3 4.8-.7v17.5c-2.5.3-5 .5-7.3.8-2.4.3-4.8.4-7.3.4-6 0-10.8-.6-14.4-1.7-3.6-1.1-6.5-2.8-8.5-5-2.1-2.2-3.4-4.9-4.2-8.2-.7-3.3-1.2-7.1-1.3-11.3v-60.5h-17.1v-17.1z"
                                fill="currentColor"
                              />
                              <path
                                d="M271.3 98.6H167.7L135.7 0l-32.1 98.6L0 98.5l83.9 61L51.8 258l83.9-60.9 83.8 60.9-32-98.5 83.8-60.9z"
                                fill="#00b67a"
                              />
                              <path
                                d="M194.7 181.8l-7.2-22.3-51.8 37.6z"
                                fill="#005128"
                              />
                            </svg>
                            <div className="flex flex-col items-end">
                              <div className="flex items-baseline gap-1">
                                <span className="text-3xl leading-none font-bold text-primary-900 dark:text-gray-100">
                                  4.5
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  / 5
                                </span>
                              </div>
                              <div className="flex flex-row text-trustpilot-green">
                                <svg
                                  className="mt-1 mr-0.5 h-4 w-4"
                                  fill="none"
                                  height={96}
                                  viewBox="0 0 96 96"
                                  width={96}
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M96 0H0V96H96V0Z"
                                    fill="currentColor"
                                  />
                                  <path
                                    d="M48.0004 64.7002L62.6004 61.0002L68.7004 79.8002L48.0004 64.7002ZM81.6004 40.4002H55.9004L48.0004 16.2002L40.1004 40.4002H14.4004L35.2004 55.4002L27.3004 79.6002L48.1004 64.6002L60.9004 55.4002L81.6004 40.4002Z"
                                    fill="white"
                                  />
                                </svg>
                                <svg
                                  className="mt-1 mr-0.5 h-4 w-4"
                                  fill="none"
                                  height={96}
                                  viewBox="0 0 96 96"
                                  width={96}
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M96 0H0V96H96V0Z"
                                    fill="currentColor"
                                  />
                                  <path
                                    d="M48.0004 64.7002L62.6004 61.0002L68.7004 79.8002L48.0004 64.7002ZM81.6004 40.4002H55.9004L48.0004 16.2002L40.1004 40.4002H14.4004L35.2004 55.4002L27.3004 79.6002L48.1004 64.6002L60.9004 55.4002L81.6004 40.4002Z"
                                    fill="white"
                                  />
                                </svg>
                                <svg
                                  className="mt-1 mr-0.5 h-4 w-4"
                                  fill="none"
                                  height={96}
                                  viewBox="0 0 96 96"
                                  width={96}
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M96 0H0V96H96V0Z"
                                    fill="currentColor"
                                  />
                                  <path
                                    d="M48.0004 64.7002L62.6004 61.0002L68.7004 79.8002L48.0004 64.7002ZM81.6004 40.4002H55.9004L48.0004 16.2002L40.1004 40.4002H14.4004L35.2004 55.4002L27.3004 79.6002L48.1004 64.6002L60.9004 55.4002L81.6004 40.4002Z"
                                    fill="white"
                                  />
                                </svg>
                                <svg
                                  className="mt-1 mr-0.5 h-4 w-4"
                                  fill="none"
                                  height={96}
                                  viewBox="0 0 96 96"
                                  width={96}
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M96 0H0V96H96V0Z"
                                    fill="currentColor"
                                  />
                                  <path
                                    d="M48.0004 64.7002L62.6004 61.0002L68.7004 79.8002L48.0004 64.7002ZM81.6004 40.4002H55.9004L48.0004 16.2002L40.1004 40.4002H14.4004L35.2004 55.4002L27.3004 79.6002L48.1004 64.6002L60.9004 55.4002L81.6004 40.4002Z"
                                    fill="white"
                                  />
                                </svg>
                                <svg
                                  className="mt-1 mr-0.5 h-4 w-4"
                                  fill="none"
                                  height={96}
                                  viewBox="0 0 96 96"
                                  width={96}
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g clipPath="url(#clip0_2780_2)">
                                    <path
                                      d="M53 0H0V96H53V0Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M53 0H0V96H53V0Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M96 0H53V96H96V0Z"
                                      fill="#DADADA"
                                    />
                                    <path
                                      d="M96 0H53V96H96V0Z"
                                      fill="#DADADA"
                                    />
                                    <path
                                      d="M48.0004 64.7002L50.5 62.8982L60.9004 55.4002L68.7004 79.8002L48.0004 64.7002ZM81.6004 40.4002H55.9004L48.0004 16.2002L40.1004 40.4002H14.4004L35.2004 55.4002L27.3004 79.6002L48.0004 64.7002L50.5 62.8982L60.9004 55.4002L81.6004 40.4002Z"
                                      fill="white"
                                    />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_2780_2">
                                      <rect
                                        fill="white"
                                        height={96}
                                        width={96}
                                      />
                                    </clipPath>
                                  </defs>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className="mt-6 flex flex-col gap-3">
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              <span>460+ reviews on Trustpilot</span>
                            </div>
                            <p className="text-sm font-medium">
                              Trusted since 2018
                            </p>
                          </div>
                        </a>
                      </div>
                      <div className="grid w-74 shrink-0 no-underline last:mr-32 sm:w-81">
                        <article className="flex w-full flex-col rounded-2xl p-5 ring-1 ring-gray-200 transition ring-inset dark:ring-gray-800">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <span
                                aria-hidden="true"
                                className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-900 dark:bg-primary-900/30 dark:text-primary-200"
                              >
                                C
                              </span>
                              <div className="flex min-w-0 flex-col">
                                <div className="flex min-w-0 items-center gap-1">
                                  <p className="min-w-0 truncate text-sm font-semibold">
                                    Chizuka
                                  </p>
                                  <svg
                                    aria-hidden="true"
                                    aria-label="Verified purchase"
                                    className="h-4 w-4 flex-none text-primary-500 dark:text-primary-300"
                                    data-slot="icon"
                                    fill="currentColor"
                                    role="img"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      clipRule="evenodd"
                                      d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                      fillRule="evenodd"
                                    />
                                  </svg>
                                </div>
                                <time
                                  className="text-xs text-gray-500 dark:text-gray-400"
                                  dateTime="2026-06-18"
                                >
                                  Jun 17, 2026
                                </time>
                              </div>
                            </div>
                            <div className="flex flex-none flex-col items-end">
                              <div className="flex flex-col items-end">
                                <svg
                                  className="h-4 w-auto text-primary-900 dark:text-gray-50"
                                  fill="none"
                                  height={127}
                                  viewBox="0 0 818 127"
                                  width={818}
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M74.1875 53.4375C74.1875 46.8542 75.25 40.6875 77.375 34.9375C79.5 29.1458 82.5417 24.1042 86.5 19.8125C90.5417 15.4375 95.25 12.1042 100.625 9.8125C106 7.47917 111.854 6.3125 118.188 6.3125C121.146 6.3125 124.229 6.58333 127.438 7.125C130.688 7.66667 133.562 8.41667 136.062 9.375C139.146 10.5417 141.521 12.1042 143.188 14.0625C144.896 15.9792 145.75 18.1875 145.75 20.6875C145.75 22.2292 145.396 23.6667 144.688 25C143.979 26.2917 143.021 27.3125 141.812 28.0625C140.646 28.8542 139.312 29.25 137.812 29.25C136.604 29.25 134.688 28.7708 132.062 27.8125C128.729 26.5208 126.25 25.6875 124.625 25.3125C123 24.9375 120.854 24.75 118.188 24.75C114.396 24.75 110.979 25.4792 107.938 26.9375C104.896 28.3958 102.354 30.5 100.312 33.25C98.3125 35.875 96.7708 38.9583 95.6875 42.5C94.6458 46.0417 94.125 49.8125 94.125 53.8125C94.125 59.2292 95.0833 64.0833 97 68.375C98.9583 72.625 101.75 75.9792 105.375 78.4375C109.083 80.8958 113.354 82.125 118.188 82.125C121.146 82.125 123.646 81.8125 125.688 81.1875C127.729 80.5625 130 79.6667 132.5 78.5C134.958 77.3333 136.979 76.75 138.562 76.75C140.146 76.75 141.583 77.1875 142.875 78.0625C144.167 78.8958 145.188 80.0208 145.938 81.4375C146.646 82.9375 147 84.2708 147 85.4375C147 88.7708 145.542 91.6458 142.625 94.0625C139.75 96.4375 135.792 98.1458 130.75 99.1875C126.667 100.104 122.479 100.562 118.188 100.562C109.854 100.562 102.312 98.5208 95.5625 94.4375C88.8125 90.3125 83.5625 84.6042 79.8125 77.3125C76.0625 70.1042 74.1875 62.1458 74.1875 53.4375ZM159.73 39.375C159.73 37.5417 160.147 35.9167 160.98 34.5C161.813 33.0833 162.98 32 164.48 31.25C165.938 30.5 167.501 30.125 169.168 30.125C175.168 30.125 178.168 32.6875 178.168 37.8125H178.418C180.334 35.0625 182.272 33.1042 184.23 31.9375C186.23 30.7292 188.605 30.125 191.355 30.125C193.022 30.125 194.522 30.5208 195.855 31.3125C197.23 32.1042 198.313 33.2292 199.105 34.6875C199.897 36.1042 200.293 37.875 200.293 40C200.293 41.6667 199.876 43 199.043 44C198.251 45 196.918 45.875 195.043 46.625L189.293 48.9375C186.334 50.3125 184.126 51.5208 182.668 52.5625C181.251 53.5625 180.168 54.7083 179.418 56C178.584 57.4583 178.168 59.2083 178.168 61.25V89.5C178.168 91.5 177.772 93.2917 176.98 94.875C176.188 96.4167 175.084 97.6042 173.668 98.4375C172.251 99.3125 170.668 99.75 168.918 99.75C166.168 99.75 163.938 98.8125 162.23 96.9375C160.563 95.0208 159.73 92.5417 159.73 89.5V39.375ZM222.835 93.625L202.46 42.8125C201.877 40.9375 201.585 39.3542 201.585 38.0625C201.585 36.6875 202.002 35.3958 202.835 34.1875C203.668 32.9375 204.793 31.9375 206.21 31.1875C207.543 30.4792 208.898 30.125 210.273 30.125C212.481 30.125 214.377 30.7083 215.96 31.875C217.585 33 218.773 34.6042 219.523 36.6875L232.148 71.375L245.71 36.6875C247.543 32.3125 250.627 30.125 254.96 30.125C256.377 30.125 257.752 30.4792 259.085 31.1875C260.418 31.8958 261.523 32.8542 262.398 34.0625C263.231 35.2708 263.648 36.6042 263.648 38.0625C263.648 39.7292 263.356 41.3125 262.773 42.8125L231.898 119.625C229.939 124.458 227.043 126.875 223.21 126.875C221.377 126.875 219.731 126.521 218.273 125.812C216.814 125.104 215.668 124.125 214.835 122.875C214.002 121.667 213.585 120.354 213.585 118.938C213.585 117.312 213.981 115.521 214.773 113.562L222.835 93.625ZM273.19 40.375C273.19 37.3333 274.023 34.875 275.69 33C277.398 31.0833 279.628 30.125 282.378 30.125C287.294 30.125 290.378 32.6875 291.628 37.8125C293.253 35.1875 295.628 33.125 298.753 31.625C301.878 30.125 305.336 29.375 309.128 29.375C315.128 29.375 320.398 31.0208 324.94 34.3125C329.523 37.6042 333.023 42.2083 335.44 48.125C337.732 53.5 338.878 59.4167 338.878 65.875C338.878 71.9167 337.586 77.5833 335.003 82.875C332.461 88.1667 328.898 92.4167 324.315 95.625C319.648 98.9167 314.378 100.562 308.503 100.562C305.461 100.562 302.461 100.021 299.503 98.9375C296.586 97.8125 293.961 96.2083 291.628 94.125V116.688C291.628 118.604 291.232 120.354 290.44 121.938C289.648 123.521 288.544 124.729 287.128 125.562C285.669 126.438 284.086 126.875 282.378 126.875C279.628 126.875 277.398 125.938 275.69 124.062C274.023 122.229 273.19 119.771 273.19 116.688V40.375ZM291.628 64.4375C291.628 67.8542 292.211 71.0417 293.378 74C294.544 76.9167 296.19 79.2292 298.315 80.9375C300.482 82.7292 303.065 83.625 306.065 83.625C308.898 83.625 311.44 82.75 313.69 81C315.94 79.25 317.648 76.875 318.815 73.875C319.898 70.875 320.44 67.9375 320.44 65.0625C320.44 61.8125 319.878 58.7917 318.753 56C317.628 53.1667 316.023 50.8333 313.94 49C311.732 47.1667 309.107 46.25 306.065 46.25C303.107 46.25 300.503 47.0625 298.253 48.6875C296.044 50.3125 294.378 52.6042 293.253 55.5625C292.169 58.4792 291.628 61.4375 291.628 64.4375ZM355.67 47.0625H351.545C349.128 47.0625 347.191 46.3333 345.733 44.875C344.233 43.375 343.483 41.3958 343.483 38.9375C343.483 36.6458 344.253 34.7292 345.795 33.1875C347.337 31.6458 349.253 30.875 351.545 30.875H355.67V19.875C355.67 16.8333 356.503 14.375 358.17 12.5C359.878 10.5833 362.108 9.625 364.858 9.625C366.649 9.625 368.233 10.0625 369.608 10.9375C371.024 11.7708 372.128 12.9583 372.92 14.5C373.712 16.0417 374.108 17.8333 374.108 19.875V30.875H379.358C382.108 30.875 384.253 31.5833 385.795 33C387.378 34.375 388.17 36.3542 388.17 38.9375C388.17 41.5208 387.399 43.5208 385.858 44.9375C384.316 46.3542 382.149 47.0625 379.358 47.0625H374.108V89.5C374.108 91.5 373.712 93.2917 372.92 94.875C372.128 96.4167 371.024 97.6042 369.608 98.4375C368.191 99.3125 366.608 99.75 364.858 99.75C362.108 99.75 359.878 98.8125 358.17 96.9375C356.503 95.0208 355.67 92.5417 355.67 89.5V47.0625ZM423.837 29.375C428.421 29.375 432.775 30.3333 436.9 32.25C441.067 34.125 444.671 36.7708 447.712 40.1875C450.671 43.5625 452.942 47.375 454.525 51.625C456.108 55.875 456.9 60.3542 456.9 65.0625C456.9 69.7708 456.108 74.2917 454.525 78.625C452.942 82.9583 450.712 86.75 447.837 90C444.837 93.375 441.254 95.9792 437.087 97.8125C432.962 99.6458 428.546 100.562 423.837 100.562C417.587 100.562 411.921 99 406.837 95.875C401.754 92.7083 397.817 88.3542 395.025 82.8125C392.233 77.3958 390.837 71.4792 390.837 65.0625C390.837 60.4792 391.629 56.0417 393.212 51.75C394.837 47.4167 397.129 43.5625 400.087 40.1875C403.129 36.7292 406.692 34.0625 410.775 32.1875C414.858 30.3125 419.212 29.375 423.837 29.375ZM423.837 46.25C420.879 46.25 418.254 47.125 415.962 48.875C413.712 50.625 412.025 53.0208 410.9 56.0625C409.817 59.1875 409.275 62.1875 409.275 65.0625C409.275 68.3125 409.858 71.3542 411.025 74.1875C412.192 76.9792 413.817 79.2292 415.9 80.9375C418.067 82.7292 420.712 83.625 423.837 83.625C426.837 83.625 429.462 82.7917 431.712 81.125C433.962 79.4167 435.671 77.0417 436.837 74C437.921 71 438.462 68.0208 438.462 65.0625C438.462 61.7292 437.879 58.6667 436.712 55.875C435.587 53.0417 433.983 50.75 431.9 49C429.692 47.1667 427.004 46.25 423.837 46.25ZM469.005 39.375C469.005 37.5417 469.422 35.9167 470.255 34.5C471.088 33.0833 472.255 32 473.755 31.25C475.213 30.5 476.776 30.125 478.443 30.125C484.443 30.125 487.443 32.6875 487.443 37.8125H487.693C489.609 35.0625 491.547 33.1042 493.505 31.9375C495.505 30.7292 497.88 30.125 500.63 30.125C502.297 30.125 503.797 30.5208 505.13 31.3125C506.505 32.1042 507.588 33.2292 508.38 34.6875C509.172 36.1042 509.568 37.875 509.568 40C509.568 41.6667 509.151 43 508.318 44C507.526 45 506.193 45.875 504.318 46.625L498.568 48.9375C495.609 50.3125 493.401 51.5208 491.943 52.5625C490.526 53.5625 489.443 54.7083 488.693 56C487.859 57.4583 487.443 59.2083 487.443 61.25V89.5C487.443 91.5 487.047 93.2917 486.255 94.875C485.463 96.4167 484.359 97.6042 482.943 98.4375C481.526 99.3125 479.943 99.75 478.193 99.75C475.443 99.75 473.213 98.8125 471.505 96.9375C469.838 95.0208 469.005 92.5417 469.005 89.5V39.375ZM531.235 71.125C531.86 75.2917 533.714 78.5625 536.797 80.9375C539.922 83.2708 543.86 84.4375 548.61 84.4375C551.152 84.4375 553.277 84.125 554.985 83.5C556.693 82.8333 558.902 81.7292 561.61 80.1875C562.277 79.8542 562.777 79.5833 563.11 79.375C566.068 77.7917 568.193 77 569.485 77C570.735 77 571.943 77.375 573.11 78.125C574.318 78.875 575.277 79.875 575.985 81.125C576.693 82.3333 577.047 83.6042 577.047 84.9375C577.047 86.8125 576.193 88.6875 574.485 90.5625C572.777 92.4375 570.402 94.125 567.36 95.625C564.402 97.125 561.068 98.3125 557.36 99.1875C553.693 100.104 550.214 100.562 546.922 100.562C540.297 100.562 534.318 99.0417 528.985 96C523.652 92.9167 519.547 88.6667 516.672 83.25C513.797 77.875 512.36 71.8125 512.36 65.0625C512.36 60.5208 513.172 56.0833 514.797 51.75C516.464 47.4167 518.777 43.5417 521.735 40.125C524.735 36.7083 528.277 34.0625 532.36 32.1875C536.485 30.3125 540.839 29.375 545.422 29.375C550.006 29.375 554.381 30.3333 558.547 32.25C562.756 34.125 566.36 36.7708 569.36 40.1875C572.235 43.4375 574.485 47.0625 576.11 51.0625C577.735 55.0625 578.547 59 578.547 62.875C578.547 68.375 575.86 71.125 570.485 71.125H531.235ZM560.11 58.8125C559.61 54.4375 558.047 51 555.422 48.5C552.839 46 549.506 44.75 545.422 44.75C542.839 44.75 540.506 45.3333 538.422 46.5C536.381 47.6667 534.672 49.3333 533.297 51.5C531.922 53.7083 531.089 56.1458 530.797 58.8125H560.11ZM593.84 47.0625H589.715C587.298 47.0625 585.361 46.3333 583.903 44.875C582.403 43.375 581.653 41.3958 581.653 38.9375C581.653 36.6458 582.423 34.7292 583.965 33.1875C585.507 31.6458 587.423 30.875 589.715 30.875H593.84V21.4375C593.84 17.1458 594.632 13.4167 596.215 10.25C597.84 7.04167 600.111 4.60417 603.028 2.9375C605.944 1.27083 609.319 0.4375 613.153 0.4375C617.194 0.4375 620.34 1.14583 622.59 2.5625C624.84 3.97917 625.965 6.04167 625.965 8.75C625.965 13.9583 623.444 16.5625 618.403 16.5625C616.819 16.5625 615.611 16.7292 614.778 17.0625C613.986 17.3958 613.361 18.0208 612.903 18.9375C612.444 20.0625 612.215 21.5417 612.215 23.375V30.875H618.028C624.236 30.875 627.34 33.5625 627.34 38.9375C627.34 44.3542 624.236 47.0625 618.028 47.0625H612.215V89.5C612.215 92.5417 611.361 95.0208 609.653 96.9375C607.986 98.8125 605.778 99.75 603.028 99.75C600.278 99.75 598.048 98.8125 596.34 96.9375C594.673 95.0208 593.84 92.5417 593.84 89.5V47.0625ZM640.883 2.5C642.716 2.5 644.403 2.95833 645.945 3.875C647.528 4.79167 648.82 6.0625 649.82 7.6875C650.778 9.27083 651.258 10.9167 651.258 12.625C651.258 14.5 650.778 16.2708 649.82 17.9375C648.903 19.5625 647.653 20.8542 646.07 21.8125C644.487 22.7708 642.758 23.25 640.883 23.25C639.133 23.25 637.466 22.75 635.883 21.75C634.299 20.75 633.008 19.4167 632.008 17.75C631.008 16.125 630.508 14.4167 630.508 12.625C630.508 10.9167 630.987 9.29167 631.945 7.75C632.903 6.20833 634.195 4.9375 635.82 3.9375C637.403 2.97917 639.091 2.5 640.883 2.5ZM631.695 40.375C631.695 37.3333 632.528 34.875 634.195 33C635.903 31.0833 638.133 30.125 640.883 30.125C642.674 30.125 644.258 30.5625 645.633 31.4375C647.049 32.2708 648.153 33.4583 648.945 35C649.737 36.5417 650.133 38.3333 650.133 40.375V89.5C650.133 91.5 649.737 93.2917 648.945 94.875C648.153 96.4167 647.049 97.6042 645.633 98.4375C644.216 99.3125 642.633 99.75 640.883 99.75C638.133 99.75 635.903 98.8125 634.195 96.9375C632.528 95.0208 631.695 92.5417 631.695 89.5V40.375ZM664.675 10.6875C664.675 7.64583 665.508 5.1875 667.175 3.3125C668.883 1.39583 671.112 0.4375 673.862 0.4375C675.654 0.4375 677.237 0.875 678.612 1.75C680.029 2.58333 681.133 3.77083 681.925 5.3125C682.717 6.85417 683.112 8.64583 683.112 10.6875V89.5C683.112 91.5 682.717 93.2917 681.925 94.875C681.133 96.4167 680.029 97.6042 678.612 98.4375C677.196 99.3125 675.612 99.75 673.862 99.75C671.112 99.75 668.883 98.8125 667.175 96.9375C665.508 95.0208 664.675 92.5417 664.675 89.5V10.6875ZM697.655 10.6875C697.655 7.64583 698.488 5.1875 700.155 3.3125C701.863 1.39583 704.093 0.4375 706.843 0.4375C708.634 0.4375 710.218 0.875 711.593 1.75C713.009 2.58333 714.113 3.77083 714.905 5.3125C715.697 6.85417 716.093 8.64583 716.093 10.6875V89.5C716.093 91.5 715.697 93.2917 714.905 94.875C714.113 96.4167 713.009 97.6042 711.593 98.4375C710.176 99.3125 708.593 99.75 706.843 99.75C704.093 99.75 701.863 98.8125 700.155 96.9375C698.488 95.0208 697.655 92.5417 697.655 89.5V10.6875ZM777.198 42.6875C777.198 44.1042 776.864 45.4375 776.198 46.6875C775.531 47.9375 774.635 48.9375 773.51 49.6875C772.343 50.4792 771.073 50.875 769.698 50.875C768.948 50.875 767.135 50.2708 764.26 49.0625C760.968 47.5208 758.677 46.5208 757.385 46.0625C756.135 45.6875 754.718 45.5 753.135 45.5C751.26 45.5 749.739 45.9583 748.573 46.875C747.448 47.7917 746.885 49.0417 746.885 50.625C746.885 51.9583 748.052 53.2917 750.385 54.625C752.218 55.6667 755.739 57.25 760.948 59.375L764.073 60.625C768.948 62.625 772.635 65.125 775.135 68.125C777.635 71.0833 778.885 74.6667 778.885 78.875C778.885 83 777.802 86.7083 775.635 90C773.468 93.25 770.385 95.8125 766.385 97.6875C762.51 99.6042 757.927 100.562 752.635 100.562C748.843 100.562 744.948 99.9167 740.948 98.625C736.948 97.3333 733.635 95.625 731.01 93.5C728.26 91.2917 726.885 88.8958 726.885 86.3125C726.885 85.1458 727.239 83.9167 727.948 82.625C728.656 81.3333 729.614 80.2708 730.823 79.4375C731.989 78.5625 733.323 78.125 734.823 78.125C736.281 78.125 737.593 78.3333 738.76 78.75C739.927 79.1667 741.656 80.0208 743.948 81.3125C746.073 82.5208 747.802 83.3542 749.135 83.8125C750.51 84.2292 752.114 84.4375 753.948 84.4375C756.573 84.4375 758.427 84.0417 759.51 83.25C760.635 82.4167 761.198 81.0625 761.198 79.1875C761.198 77.3958 759.427 75.7292 755.885 74.1875C753.635 73.1875 749.739 71.5417 744.198 69.25C739.239 67.2083 735.489 64.6875 732.948 61.6875C730.448 58.6875 729.198 55.0833 729.198 50.875C729.198 46.7917 730.26 43.1042 732.385 39.8125C734.51 36.5208 737.468 33.9375 741.26 32.0625C744.885 30.2708 749.198 29.375 754.198 29.375C757.864 29.375 761.448 29.9167 764.948 31C768.448 32.0833 771.323 33.5625 773.573 35.4375C775.989 37.4792 777.198 39.8958 777.198 42.6875Z"
                                    fill="currentColor"
                                  />
                                  <path
                                    d="M37 90L60 90"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeWidth={23}
                                  />
                                  <path
                                    d="M12 58L43 58"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeWidth={23}
                                  />
                                  <path
                                    d="M32 25L48 25"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeWidth={23}
                                  />
                                </svg>
                                <div
                                  aria-label="5 out of 5 stars"
                                  className="flex flex-row text-primary-900 dark:text-primary-300"
                                  role="img"
                                >
                                  <svg
                                    aria-hidden="true"
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    data-slot="icon"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      clipRule="evenodd"
                                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                      fillRule="evenodd"
                                    />
                                  </svg>
                                  <svg
                                    aria-hidden="true"
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    data-slot="icon"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      clipRule="evenodd"
                                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                      fillRule="evenodd"
                                    />
                                  </svg>
                                  <svg
                                    aria-hidden="true"
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    data-slot="icon"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      clipRule="evenodd"
                                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                      fillRule="evenodd"
                                    />
                                  </svg>
                                  <svg
                                    aria-hidden="true"
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    data-slot="icon"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      clipRule="evenodd"
                                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                      fillRule="evenodd"
                                    />
                                  </svg>
                                  <svg
                                    aria-hidden="true"
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    data-slot="icon"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      clipRule="evenodd"
                                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                      fillRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-col gap-2" lang="en">
                            <p
                              className="text-sm leading-relaxed break-words line-clamp-4"
                              id="_r_9_"
                            >
                              Fast and smooth, happy to use this website :)
                            </p>
                            <div className="-mx-2 mt-auto flex flex-wrap items-center gap-x-1 gap-y-1 pt-1 text-xs" />
                          </div>
                        </article>
                      </div>
                      <div className="grid w-74 shrink-0 no-underline last:mr-32 sm:w-81">
                        <article className="flex w-full flex-col rounded-2xl p-5 ring-1 ring-gray-200 transition ring-inset dark:ring-gray-800">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <span
                                aria-hidden="true"
                                className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-900 dark:bg-primary-900/30 dark:text-primary-200"
                              >
                                PJ
                              </span>
                              <div className="flex min-w-0 flex-col">
                                <div className="flex min-w-0 items-center gap-1">
                                  <p className="min-w-0 truncate text-sm font-semibold">
                                    Paynes J.
                                  </p>
                                </div>
                                <time
                                  className="text-xs text-gray-500 dark:text-gray-400"
                                  dateTime="2026-06-17"
                                >
                                  Jun 16, 2026
                                </time>
                              </div>
                            </div>
                            <div className="flex flex-none flex-col items-end">
                              <div className="flex flex-col items-end">
                                <svg
                                  className="h-5 w-auto flex-none"
                                  viewBox="0 0 1132.8 278.2"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M297.7 98.6h114.7V120h-45.1v120.3h-24.8V120h-44.9V98.6zm109.8 39.1h21.2v19.8h.4c.7-2.8 2-5.5 3.9-8.1 1.9-2.6 4.2-5.1 6.9-7.2 2.7-2.2 5.7-3.9 9-5.3 3.3-1.3 6.7-2 10.1-2 2.6 0 4.5.1 5.5.2s2 .3 3.1.4v21.8c-1.6-.3-3.2-.5-4.9-.7-1.7-.2-3.3-.3-4.9-.3-3.8 0-7.4.8-10.8 2.3-3.4 1.5-6.3 3.8-8.8 6.7-2.5 3-4.5 6.6-6 11s-2.2 9.4-2.2 15.1v48.8h-22.6V137.7zm164 102.6h-22.2V226h-.4c-2.8 5.2-6.9 9.3-12.4 12.4-5.5 3.1-11.1 4.7-16.8 4.7-13.5 0-23.3-3.3-29.3-10s-9-16.8-9-30.3v-65.1H504v62.9c0 9 1.7 15.4 5.2 19.1 3.4 3.7 8.3 5.6 14.5 5.6 4.8 0 8.7-.7 11.9-2.2 3.2-1.5 5.8-3.4 7.7-5.9 2-2.4 3.4-5.4 4.3-8.8.9-3.4 1.3-7.1 1.3-11.1v-59.5h22.6v102.5zm38.5-32.9c.7 6.6 3.2 11.2 7.5 13.9 4.4 2.6 9.6 4 15.7 4 2.1 0 4.5-.2 7.2-.5s5.3-1 7.6-1.9c2.4-.9 4.3-2.3 5.9-4.1 1.5-1.8 2.2-4.1 2.1-7-.1-2.9-1.2-5.3-3.2-7.1-2-1.9-4.5-3.3-7.6-4.5-3.1-1.1-6.6-2.1-10.6-2.9-4-.8-8-1.7-12.1-2.6-4.2-.9-8.3-2.1-12.2-3.4-3.9-1.3-7.4-3.1-10.5-5.4-3.1-2.2-5.6-5.1-7.4-8.6-1.9-3.5-2.8-7.8-2.8-13 0-5.6 1.4-10.2 4.1-14 2.7-3.8 6.2-6.8 10.3-9.1 4.2-2.3 8.8-3.9 13.9-4.9 5.1-.9 10-1.4 14.6-1.4 5.3 0 10.4.6 15.2 1.7 4.8 1.1 9.2 2.9 13.1 5.5 3.9 2.5 7.1 5.8 9.7 9.8 2.6 4 4.2 8.9 4.9 14.6h-23.6c-1.1-5.4-3.5-9.1-7.4-10.9-3.9-1.9-8.4-2.8-13.4-2.8-1.6 0-3.5.1-5.7.4-2.2.3-4.2.8-6.2 1.5-1.9.7-3.5 1.8-4.9 3.2-1.3 1.4-2 3.2-2 5.5 0 2.8 1 5 2.9 6.7 1.9 1.7 4.4 3.1 7.5 4.3 3.1 1.1 6.6 2.1 10.6 2.9 4 .8 8.1 1.7 12.3 2.6 4.1.9 8.1 2.1 12.1 3.4 4 1.3 7.5 3.1 10.6 5.4 3.1 2.3 5.6 5.1 7.5 8.5 1.9 3.4 2.9 7.7 2.9 12.7 0 6.1-1.4 11.2-4.2 15.5-2.8 4.2-6.4 7.7-10.8 10.3-4.4 2.6-9.4 4.6-14.8 5.8-5.4 1.2-10.8 1.8-16.1 1.8-6.5 0-12.5-.7-18-2.2-5.5-1.5-10.3-3.7-14.3-6.6-4-3-7.2-6.7-9.5-11.1-2.3-4.4-3.5-9.7-3.7-15.8H610zm74.6-69.7h17.1v-30.8h22.6v30.8h20.4v16.9h-20.4v54.8c0 2.4.1 4.4.3 6.2.2 1.7.7 3.2 1.4 4.4.7 1.2 1.8 2.1 3.3 2.7 1.5.6 3.4.9 6 .9 1.6 0 3.2 0 4.8-.1 1.6-.1 3.2-.3 4.8-.7v17.5c-2.5.3-5 .5-7.3.8-2.4.3-4.8.4-7.3.4-6 0-10.8-.6-14.4-1.7-3.6-1.1-6.5-2.8-8.5-5-2.1-2.2-3.4-4.9-4.2-8.2-.7-3.3-1.2-7.1-1.3-11.3v-60.5h-17.1v-17.1zm76.1 0h21.4v13.9h.4c3.2-6 7.6-10.2 13.3-12.8 5.7-2.6 11.8-3.9 18.5-3.9 8.1 0 15.1 1.4 21.1 4.3 6 2.8 11 6.7 15 11.7 4 5 6.9 10.8 8.9 17.4 2 6.6 3 13.7 3 21.2 0 6.9-.9 13.6-2.7 20-1.8 6.5-4.5 12.2-8.1 17.2-3.6 5-8.2 8.9-13.8 11.9-5.6 3-12.1 4.5-19.7 4.5-3.3 0-6.6-.3-9.9-.9-3.3-.6-6.5-1.6-9.5-2.9-3-1.3-5.9-3-8.4-5.1-2.6-2.1-4.7-4.5-6.5-7.2h-.4v51.2h-22.6V137.7zm79 51.4c0-4.6-.6-9.1-1.8-13.5-1.2-4.4-3-8.2-5.4-11.6-2.4-3.4-5.4-6.1-8.9-8.1-3.6-2-7.7-3.1-12.3-3.1-9.5 0-16.7 3.3-21.5 9.9-4.8 6.6-7.2 15.4-7.2 26.4 0 5.2.6 10 1.9 14.4 1.3 4.4 3.1 8.2 5.7 11.4 2.5 3.2 5.5 5.7 9 7.5 3.5 1.9 7.6 2.8 12.2 2.8 5.2 0 9.5-1.1 13.1-3.2 3.6-2.1 6.5-4.9 8.8-8.2 2.3-3.4 4-7.2 5-11.5.9-4.3 1.4-8.7 1.4-13.2zm39.9-90.5h22.6V120h-22.6V98.6zm0 39.1h22.6v102.6h-22.6V137.7zm42.8-39.1H945v141.7h-22.6V98.6zm91.9 144.5c-8.2 0-15.5-1.4-21.9-4.1-6.4-2.7-11.8-6.5-16.3-11.2-4.4-4.8-7.8-10.5-10.1-17.1-2.3-6.6-3.5-13.9-3.5-21.8 0-7.8 1.2-15 3.5-21.6 2.3-6.6 5.7-12.3 10.1-17.1 4.4-4.8 9.9-8.5 16.3-11.2 6.4-2.7 13.7-4.1 21.9-4.1s15.5 1.4 21.9 4.1c6.4 2.7 11.8 6.5 16.3 11.2 4.4 4.8 7.8 10.5 10.1 17.1 2.3 6.6 3.5 13.8 3.5 21.6 0 7.9-1.2 15.2-3.5 21.8-2.3 6.6-5.7 12.3-10.1 17.1-4.4 4.8-9.9 8.5-16.3 11.2-6.4 2.7-13.7 4.1-21.9 4.1zm0-17.9c5 0 9.4-1.1 13.1-3.2 3.7-2.1 6.7-4.9 9.1-8.3 2.4-3.4 4.1-7.3 5.3-11.6 1.1-4.3 1.7-8.7 1.7-13.2 0-4.4-.6-8.7-1.7-13.1s-2.9-8.2-5.3-11.6c-2.4-3.4-5.4-6.1-9.1-8.2-3.7-2.1-8.1-3.2-13.1-3.2s-9.4 1.1-13.1 3.2c-3.7 2.1-6.7 4.9-9.1 8.2-2.4 3.4-4.1 7.2-5.3 11.6-1.1 4.4-1.7 8.7-1.7 13.1 0 4.5.6 8.9 1.7 13.2 1.1 4.3 2.9 8.2 5.3 11.6 2.4 3.4 5.4 6.2 9.1 8.3 3.7 2.2 8.1 3.2 13.1 3.2zm58.4-87.5h17.1v-30.8h22.6v30.8h20.4v16.9h-20.4v54.8c0 2.4.1 4.4.3 6.2.2 1.7.7 3.2 1.4 4.4.7 1.2 1.8 2.1 3.3 2.7 1.5.6 3.4.9 6 .9 1.6 0 3.2 0 4.8-.1 1.6-.1 3.2-.3 4.8-.7v17.5c-2.5.3-5 .5-7.3.8-2.4.3-4.8.4-7.3.4-6 0-10.8-.6-14.4-1.7-3.6-1.1-6.5-2.8-8.5-5-2.1-2.2-3.4-4.9-4.2-8.2-.7-3.3-1.2-7.1-1.3-11.3v-60.5h-17.1v-17.1z"
                                    fill="currentColor"
                                  />
                                  <path
                                    d="M271.3 98.6H167.7L135.7 0l-32.1 98.6L0 98.5l83.9 61L51.8 258l83.9-60.9 83.8 60.9-32-98.5 83.8-60.9z"
                                    fill="#00b67a"
                                  />
                                  <path
                                    d="M194.7 181.8l-7.2-22.3-51.8 37.6z"
                                    fill="#005128"
                                  />
                                </svg>
                                <div className="flex flex-row text-trustpilot-green">
                                  <svg
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    fill="none"
                                    height={96}
                                    viewBox="0 0 96 96"
                                    width={96}
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M96 0H0V96H96V0Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M48.0004 64.7002L62.6004 61.0002L68.7004 79.8002L48.0004 64.7002ZM81.6004 40.4002H55.9004L48.0004 16.2002L40.1004 40.4002H14.4004L35.2004 55.4002L27.3004 79.6002L48.1004 64.6002L60.9004 55.4002L81.6004 40.4002Z"
                                      fill="white"
                                    />
                                  </svg>
                                  <svg
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    fill="none"
                                    height={96}
                                    viewBox="0 0 96 96"
                                    width={96}
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M96 0H0V96H96V0Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M48.0004 64.7002L62.6004 61.0002L68.7004 79.8002L48.0004 64.7002ZM81.6004 40.4002H55.9004L48.0004 16.2002L40.1004 40.4002H14.4004L35.2004 55.4002L27.3004 79.6002L48.1004 64.6002L60.9004 55.4002L81.6004 40.4002Z"
                                      fill="white"
                                    />
                                  </svg>
                                  <svg
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    fill="none"
                                    height={96}
                                    viewBox="0 0 96 96"
                                    width={96}
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M96 0H0V96H96V0Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M48.0004 64.7002L62.6004 61.0002L68.7004 79.8002L48.0004 64.7002ZM81.6004 40.4002H55.9004L48.0004 16.2002L40.1004 40.4002H14.4004L35.2004 55.4002L27.3004 79.6002L48.1004 64.6002L60.9004 55.4002L81.6004 40.4002Z"
                                      fill="white"
                                    />
                                  </svg>
                                  <svg
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    fill="none"
                                    height={96}
                                    viewBox="0 0 96 96"
                                    width={96}
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M96 0H0V96H96V0Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M48.0004 64.7002L62.6004 61.0002L68.7004 79.8002L48.0004 64.7002ZM81.6004 40.4002H55.9004L48.0004 16.2002L40.1004 40.4002H14.4004L35.2004 55.4002L27.3004 79.6002L48.1004 64.6002L60.9004 55.4002L81.6004 40.4002Z"
                                      fill="white"
                                    />
                                  </svg>
                                  <svg
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    fill="none"
                                    height={96}
                                    viewBox="0 0 96 96"
                                    width={96}
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M96 0H0V96H96V0Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M48.0004 64.7002L62.6004 61.0002L68.7004 79.8002L48.0004 64.7002ZM81.6004 40.4002H55.9004L48.0004 16.2002L40.1004 40.4002H14.4004L35.2004 55.4002L27.3004 79.6002L48.1004 64.6002L60.9004 55.4002L81.6004 40.4002Z"
                                      fill="white"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-col gap-2" lang="en">
                            <p
                              className="text-sm leading-relaxed break-words line-clamp-4"
                              id="_r_a_"
                            >
                              Great service: fast delivery. Highly recommend it!
                            </p>
                            <div className="-mx-2 mt-auto flex flex-wrap items-center gap-x-1 gap-y-1 pt-1 text-xs" />
                          </div>
                        </article>
                      </div>
                      <div className="grid w-74 shrink-0 no-underline last:mr-32 sm:w-81">
                        <article className="flex w-full flex-col rounded-2xl p-5 ring-1 ring-gray-200 transition ring-inset dark:ring-gray-800">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <span
                                aria-hidden="true"
                                className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-900 dark:bg-primary-900/30 dark:text-primary-200"
                              >
                                TK
                              </span>
                              <div className="flex min-w-0 flex-col">
                                <div className="flex min-w-0 items-center gap-1">
                                  <p className="min-w-0 truncate text-sm font-semibold">
                                    Thomas Kane
                                  </p>
                                </div>
                                <time
                                  className="text-xs text-gray-500 dark:text-gray-400"
                                  dateTime="2026-06-16"
                                >
                                  Jun 15, 2026
                                </time>
                              </div>
                            </div>
                            <div className="flex flex-none flex-col items-end">
                              <div className="flex flex-col items-end">
                                <svg
                                  className="h-5 w-auto flex-none"
                                  viewBox="0 0 1132.8 278.2"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M297.7 98.6h114.7V120h-45.1v120.3h-24.8V120h-44.9V98.6zm109.8 39.1h21.2v19.8h.4c.7-2.8 2-5.5 3.9-8.1 1.9-2.6 4.2-5.1 6.9-7.2 2.7-2.2 5.7-3.9 9-5.3 3.3-1.3 6.7-2 10.1-2 2.6 0 4.5.1 5.5.2s2 .3 3.1.4v21.8c-1.6-.3-3.2-.5-4.9-.7-1.7-.2-3.3-.3-4.9-.3-3.8 0-7.4.8-10.8 2.3-3.4 1.5-6.3 3.8-8.8 6.7-2.5 3-4.5 6.6-6 11s-2.2 9.4-2.2 15.1v48.8h-22.6V137.7zm164 102.6h-22.2V226h-.4c-2.8 5.2-6.9 9.3-12.4 12.4-5.5 3.1-11.1 4.7-16.8 4.7-13.5 0-23.3-3.3-29.3-10s-9-16.8-9-30.3v-65.1H504v62.9c0 9 1.7 15.4 5.2 19.1 3.4 3.7 8.3 5.6 14.5 5.6 4.8 0 8.7-.7 11.9-2.2 3.2-1.5 5.8-3.4 7.7-5.9 2-2.4 3.4-5.4 4.3-8.8.9-3.4 1.3-7.1 1.3-11.1v-59.5h22.6v102.5zm38.5-32.9c.7 6.6 3.2 11.2 7.5 13.9 4.4 2.6 9.6 4 15.7 4 2.1 0 4.5-.2 7.2-.5s5.3-1 7.6-1.9c2.4-.9 4.3-2.3 5.9-4.1 1.5-1.8 2.2-4.1 2.1-7-.1-2.9-1.2-5.3-3.2-7.1-2-1.9-4.5-3.3-7.6-4.5-3.1-1.1-6.6-2.1-10.6-2.9-4-.8-8-1.7-12.1-2.6-4.2-.9-8.3-2.1-12.2-3.4-3.9-1.3-7.4-3.1-10.5-5.4-3.1-2.2-5.6-5.1-7.4-8.6-1.9-3.5-2.8-7.8-2.8-13 0-5.6 1.4-10.2 4.1-14 2.7-3.8 6.2-6.8 10.3-9.1 4.2-2.3 8.8-3.9 13.9-4.9 5.1-.9 10-1.4 14.6-1.4 5.3 0 10.4.6 15.2 1.7 4.8 1.1 9.2 2.9 13.1 5.5 3.9 2.5 7.1 5.8 9.7 9.8 2.6 4 4.2 8.9 4.9 14.6h-23.6c-1.1-5.4-3.5-9.1-7.4-10.9-3.9-1.9-8.4-2.8-13.4-2.8-1.6 0-3.5.1-5.7.4-2.2.3-4.2.8-6.2 1.5-1.9.7-3.5 1.8-4.9 3.2-1.3 1.4-2 3.2-2 5.5 0 2.8 1 5 2.9 6.7 1.9 1.7 4.4 3.1 7.5 4.3 3.1 1.1 6.6 2.1 10.6 2.9 4 .8 8.1 1.7 12.3 2.6 4.1.9 8.1 2.1 12.1 3.4 4 1.3 7.5 3.1 10.6 5.4 3.1 2.3 5.6 5.1 7.5 8.5 1.9 3.4 2.9 7.7 2.9 12.7 0 6.1-1.4 11.2-4.2 15.5-2.8 4.2-6.4 7.7-10.8 10.3-4.4 2.6-9.4 4.6-14.8 5.8-5.4 1.2-10.8 1.8-16.1 1.8-6.5 0-12.5-.7-18-2.2-5.5-1.5-10.3-3.7-14.3-6.6-4-3-7.2-6.7-9.5-11.1-2.3-4.4-3.5-9.7-3.7-15.8H610zm74.6-69.7h17.1v-30.8h22.6v30.8h20.4v16.9h-20.4v54.8c0 2.4.1 4.4.3 6.2.2 1.7.7 3.2 1.4 4.4.7 1.2 1.8 2.1 3.3 2.7 1.5.6 3.4.9 6 .9 1.6 0 3.2 0 4.8-.1 1.6-.1 3.2-.3 4.8-.7v17.5c-2.5.3-5 .5-7.3.8-2.4.3-4.8.4-7.3.4-6 0-10.8-.6-14.4-1.7-3.6-1.1-6.5-2.8-8.5-5-2.1-2.2-3.4-4.9-4.2-8.2-.7-3.3-1.2-7.1-1.3-11.3v-60.5h-17.1v-17.1zm76.1 0h21.4v13.9h.4c3.2-6 7.6-10.2 13.3-12.8 5.7-2.6 11.8-3.9 18.5-3.9 8.1 0 15.1 1.4 21.1 4.3 6 2.8 11 6.7 15 11.7 4 5 6.9 10.8 8.9 17.4 2 6.6 3 13.7 3 21.2 0 6.9-.9 13.6-2.7 20-1.8 6.5-4.5 12.2-8.1 17.2-3.6 5-8.2 8.9-13.8 11.9-5.6 3-12.1 4.5-19.7 4.5-3.3 0-6.6-.3-9.9-.9-3.3-.6-6.5-1.6-9.5-2.9-3-1.3-5.9-3-8.4-5.1-2.6-2.1-4.7-4.5-6.5-7.2h-.4v51.2h-22.6V137.7zm79 51.4c0-4.6-.6-9.1-1.8-13.5-1.2-4.4-3-8.2-5.4-11.6-2.4-3.4-5.4-6.1-8.9-8.1-3.6-2-7.7-3.1-12.3-3.1-9.5 0-16.7 3.3-21.5 9.9-4.8 6.6-7.2 15.4-7.2 26.4 0 5.2.6 10 1.9 14.4 1.3 4.4 3.1 8.2 5.7 11.4 2.5 3.2 5.5 5.7 9 7.5 3.5 1.9 7.6 2.8 12.2 2.8 5.2 0 9.5-1.1 13.1-3.2 3.6-2.1 6.5-4.9 8.8-8.2 2.3-3.4 4-7.2 5-11.5.9-4.3 1.4-8.7 1.4-13.2zm39.9-90.5h22.6V120h-22.6V98.6zm0 39.1h22.6v102.6h-22.6V137.7zm42.8-39.1H945v141.7h-22.6V98.6zm91.9 144.5c-8.2 0-15.5-1.4-21.9-4.1-6.4-2.7-11.8-6.5-16.3-11.2-4.4-4.8-7.8-10.5-10.1-17.1-2.3-6.6-3.5-13.9-3.5-21.8 0-7.8 1.2-15 3.5-21.6 2.3-6.6 5.7-12.3 10.1-17.1 4.4-4.8 9.9-8.5 16.3-11.2 6.4-2.7 13.7-4.1 21.9-4.1s15.5 1.4 21.9 4.1c6.4 2.7 11.8 6.5 16.3 11.2 4.4 4.8 7.8 10.5 10.1 17.1 2.3 6.6 3.5 13.8 3.5 21.6 0 7.9-1.2 15.2-3.5 21.8-2.3 6.6-5.7 12.3-10.1 17.1-4.4 4.8-9.9 8.5-16.3 11.2-6.4 2.7-13.7 4.1-21.9 4.1zm0-17.9c5 0 9.4-1.1 13.1-3.2 3.7-2.1 6.7-4.9 9.1-8.3 2.4-3.4 4.1-7.3 5.3-11.6 1.1-4.3 1.7-8.7 1.7-13.2 0-4.4-.6-8.7-1.7-13.1s-2.9-8.2-5.3-11.6c-2.4-3.4-5.4-6.1-9.1-8.2-3.7-2.1-8.1-3.2-13.1-3.2s-9.4 1.1-13.1 3.2c-3.7 2.1-6.7 4.9-9.1 8.2-2.4 3.4-4.1 7.2-5.3 11.6-1.1 4.4-1.7 8.7-1.7 13.1 0 4.5.6 8.9 1.7 13.2 1.1 4.3 2.9 8.2 5.3 11.6 2.4 3.4 5.4 6.2 9.1 8.3 3.7 2.2 8.1 3.2 13.1 3.2zm58.4-87.5h17.1v-30.8h22.6v30.8h20.4v16.9h-20.4v54.8c0 2.4.1 4.4.3 6.2.2 1.7.7 3.2 1.4 4.4.7 1.2 1.8 2.1 3.3 2.7 1.5.6 3.4.9 6 .9 1.6 0 3.2 0 4.8-.1 1.6-.1 3.2-.3 4.8-.7v17.5c-2.5.3-5 .5-7.3.8-2.4.3-4.8.4-7.3.4-6 0-10.8-.6-14.4-1.7-3.6-1.1-6.5-2.8-8.5-5-2.1-2.2-3.4-4.9-4.2-8.2-.7-3.3-1.2-7.1-1.3-11.3v-60.5h-17.1v-17.1z"
                                    fill="currentColor"
                                  />
                                  <path
                                    d="M271.3 98.6H167.7L135.7 0l-32.1 98.6L0 98.5l83.9 61L51.8 258l83.9-60.9 83.8 60.9-32-98.5 83.8-60.9z"
                                    fill="#00b67a"
                                  />
                                  <path
                                    d="M194.7 181.8l-7.2-22.3-51.8 37.6z"
                                    fill="#005128"
                                  />
                                </svg>
                                <div className="flex flex-row text-trustpilot-green">
                                  <svg
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    fill="none"
                                    height={96}
                                    viewBox="0 0 96 96"
                                    width={96}
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M96 0H0V96H96V0Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M48.0004 64.7002L62.6004 61.0002L68.7004 79.8002L48.0004 64.7002ZM81.6004 40.4002H55.9004L48.0004 16.2002L40.1004 40.4002H14.4004L35.2004 55.4002L27.3004 79.6002L48.1004 64.6002L60.9004 55.4002L81.6004 40.4002Z"
                                      fill="white"
                                    />
                                  </svg>
                                  <svg
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    fill="none"
                                    height={96}
                                    viewBox="0 0 96 96"
                                    width={96}
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M96 0H0V96H96V0Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M48.0004 64.7002L62.6004 61.0002L68.7004 79.8002L48.0004 64.7002ZM81.6004 40.4002H55.9004L48.0004 16.2002L40.1004 40.4002H14.4004L35.2004 55.4002L27.3004 79.6002L48.1004 64.6002L60.9004 55.4002L81.6004 40.4002Z"
                                      fill="white"
                                    />
                                  </svg>
                                  <svg
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    fill="none"
                                    height={96}
                                    viewBox="0 0 96 96"
                                    width={96}
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M96 0H0V96H96V0Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M48.0004 64.7002L62.6004 61.0002L68.7004 79.8002L48.0004 64.7002ZM81.6004 40.4002H55.9004L48.0004 16.2002L40.1004 40.4002H14.4004L35.2004 55.4002L27.3004 79.6002L48.1004 64.6002L60.9004 55.4002L81.6004 40.4002Z"
                                      fill="white"
                                    />
                                  </svg>
                                  <svg
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    fill="none"
                                    height={96}
                                    viewBox="0 0 96 96"
                                    width={96}
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M96 0H0V96H96V0Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M48.0004 64.7002L62.6004 61.0002L68.7004 79.8002L48.0004 64.7002ZM81.6004 40.4002H55.9004L48.0004 16.2002L40.1004 40.4002H14.4004L35.2004 55.4002L27.3004 79.6002L48.1004 64.6002L60.9004 55.4002L81.6004 40.4002Z"
                                      fill="white"
                                    />
                                  </svg>
                                  <svg
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    fill="none"
                                    height={96}
                                    viewBox="0 0 96 96"
                                    width={96}
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M96 0H0V96H96V0Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M48.0004 64.7002L62.6004 61.0002L68.7004 79.8002L48.0004 64.7002ZM81.6004 40.4002H55.9004L48.0004 16.2002L40.1004 40.4002H14.4004L35.2004 55.4002L27.3004 79.6002L48.1004 64.6002L60.9004 55.4002L81.6004 40.4002Z"
                                      fill="white"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-col gap-2" lang="en">
                            <p
                              className="text-sm leading-relaxed break-words line-clamp-4"
                              id="_r_b_"
                            >
                              Perfect transaction using BTC for Tracfone refill
                              cards.
                            </p>
                            <div className="-mx-2 mt-auto flex flex-wrap items-center gap-x-1 gap-y-1 pt-1 text-xs" />
                          </div>
                        </article>
                      </div>
                      <div className="grid w-74 shrink-0 no-underline last:mr-32 sm:w-81">
                        <article className="flex w-full flex-col rounded-2xl p-5 ring-1 ring-gray-200 transition ring-inset dark:ring-gray-800">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <span
                                aria-hidden="true"
                                className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-900 dark:bg-primary-900/30 dark:text-primary-200"
                              >
                                DS
                              </span>
                              <div className="flex min-w-0 flex-col">
                                <div className="flex min-w-0 items-center gap-1">
                                  <p className="min-w-0 truncate text-sm font-semibold">
                                    Dmitry Sad
                                  </p>
                                  <svg
                                    aria-hidden="true"
                                    aria-label="Verified purchase"
                                    className="h-4 w-4 flex-none text-primary-500 dark:text-primary-300"
                                    data-slot="icon"
                                    fill="currentColor"
                                    role="img"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      clipRule="evenodd"
                                      d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                      fillRule="evenodd"
                                    />
                                  </svg>
                                </div>
                                <time
                                  className="text-xs text-gray-500 dark:text-gray-400"
                                  dateTime="2026-06-14"
                                >
                                  Jun 13, 2026
                                </time>
                              </div>
                            </div>
                            <div className="flex flex-none flex-col items-end">
                              <div className="flex flex-col items-end">
                                <svg
                                  className="h-4 w-auto text-primary-900 dark:text-gray-50"
                                  fill="none"
                                  height={127}
                                  viewBox="0 0 818 127"
                                  width={818}
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M74.1875 53.4375C74.1875 46.8542 75.25 40.6875 77.375 34.9375C79.5 29.1458 82.5417 24.1042 86.5 19.8125C90.5417 15.4375 95.25 12.1042 100.625 9.8125C106 7.47917 111.854 6.3125 118.188 6.3125C121.146 6.3125 124.229 6.58333 127.438 7.125C130.688 7.66667 133.562 8.41667 136.062 9.375C139.146 10.5417 141.521 12.1042 143.188 14.0625C144.896 15.9792 145.75 18.1875 145.75 20.6875C145.75 22.2292 145.396 23.6667 144.688 25C143.979 26.2917 143.021 27.3125 141.812 28.0625C140.646 28.8542 139.312 29.25 137.812 29.25C136.604 29.25 134.688 28.7708 132.062 27.8125C128.729 26.5208 126.25 25.6875 124.625 25.3125C123 24.9375 120.854 24.75 118.188 24.75C114.396 24.75 110.979 25.4792 107.938 26.9375C104.896 28.3958 102.354 30.5 100.312 33.25C98.3125 35.875 96.7708 38.9583 95.6875 42.5C94.6458 46.0417 94.125 49.8125 94.125 53.8125C94.125 59.2292 95.0833 64.0833 97 68.375C98.9583 72.625 101.75 75.9792 105.375 78.4375C109.083 80.8958 113.354 82.125 118.188 82.125C121.146 82.125 123.646 81.8125 125.688 81.1875C127.729 80.5625 130 79.6667 132.5 78.5C134.958 77.3333 136.979 76.75 138.562 76.75C140.146 76.75 141.583 77.1875 142.875 78.0625C144.167 78.8958 145.188 80.0208 145.938 81.4375C146.646 82.9375 147 84.2708 147 85.4375C147 88.7708 145.542 91.6458 142.625 94.0625C139.75 96.4375 135.792 98.1458 130.75 99.1875C126.667 100.104 122.479 100.562 118.188 100.562C109.854 100.562 102.312 98.5208 95.5625 94.4375C88.8125 90.3125 83.5625 84.6042 79.8125 77.3125C76.0625 70.1042 74.1875 62.1458 74.1875 53.4375ZM159.73 39.375C159.73 37.5417 160.147 35.9167 160.98 34.5C161.813 33.0833 162.98 32 164.48 31.25C165.938 30.5 167.501 30.125 169.168 30.125C175.168 30.125 178.168 32.6875 178.168 37.8125H178.418C180.334 35.0625 182.272 33.1042 184.23 31.9375C186.23 30.7292 188.605 30.125 191.355 30.125C193.022 30.125 194.522 30.5208 195.855 31.3125C197.23 32.1042 198.313 33.2292 199.105 34.6875C199.897 36.1042 200.293 37.875 200.293 40C200.293 41.6667 199.876 43 199.043 44C198.251 45 196.918 45.875 195.043 46.625L189.293 48.9375C186.334 50.3125 184.126 51.5208 182.668 52.5625C181.251 53.5625 180.168 54.7083 179.418 56C178.584 57.4583 178.168 59.2083 178.168 61.25V89.5C178.168 91.5 177.772 93.2917 176.98 94.875C176.188 96.4167 175.084 97.6042 173.668 98.4375C172.251 99.3125 170.668 99.75 168.918 99.75C166.168 99.75 163.938 98.8125 162.23 96.9375C160.563 95.0208 159.73 92.5417 159.73 89.5V39.375ZM222.835 93.625L202.46 42.8125C201.877 40.9375 201.585 39.3542 201.585 38.0625C201.585 36.6875 202.002 35.3958 202.835 34.1875C203.668 32.9375 204.793 31.9375 206.21 31.1875C207.543 30.4792 208.898 30.125 210.273 30.125C212.481 30.125 214.377 30.7083 215.96 31.875C217.585 33 218.773 34.6042 219.523 36.6875L232.148 71.375L245.71 36.6875C247.543 32.3125 250.627 30.125 254.96 30.125C256.377 30.125 257.752 30.4792 259.085 31.1875C260.418 31.8958 261.523 32.8542 262.398 34.0625C263.231 35.2708 263.648 36.6042 263.648 38.0625C263.648 39.7292 263.356 41.3125 262.773 42.8125L231.898 119.625C229.939 124.458 227.043 126.875 223.21 126.875C221.377 126.875 219.731 126.521 218.273 125.812C216.814 125.104 215.668 124.125 214.835 122.875C214.002 121.667 213.585 120.354 213.585 118.938C213.585 117.312 213.981 115.521 214.773 113.562L222.835 93.625ZM273.19 40.375C273.19 37.3333 274.023 34.875 275.69 33C277.398 31.0833 279.628 30.125 282.378 30.125C287.294 30.125 290.378 32.6875 291.628 37.8125C293.253 35.1875 295.628 33.125 298.753 31.625C301.878 30.125 305.336 29.375 309.128 29.375C315.128 29.375 320.398 31.0208 324.94 34.3125C329.523 37.6042 333.023 42.2083 335.44 48.125C337.732 53.5 338.878 59.4167 338.878 65.875C338.878 71.9167 337.586 77.5833 335.003 82.875C332.461 88.1667 328.898 92.4167 324.315 95.625C319.648 98.9167 314.378 100.562 308.503 100.562C305.461 100.562 302.461 100.021 299.503 98.9375C296.586 97.8125 293.961 96.2083 291.628 94.125V116.688C291.628 118.604 291.232 120.354 290.44 121.938C289.648 123.521 288.544 124.729 287.128 125.562C285.669 126.438 284.086 126.875 282.378 126.875C279.628 126.875 277.398 125.938 275.69 124.062C274.023 122.229 273.19 119.771 273.19 116.688V40.375ZM291.628 64.4375C291.628 67.8542 292.211 71.0417 293.378 74C294.544 76.9167 296.19 79.2292 298.315 80.9375C300.482 82.7292 303.065 83.625 306.065 83.625C308.898 83.625 311.44 82.75 313.69 81C315.94 79.25 317.648 76.875 318.815 73.875C319.898 70.875 320.44 67.9375 320.44 65.0625C320.44 61.8125 319.878 58.7917 318.753 56C317.628 53.1667 316.023 50.8333 313.94 49C311.732 47.1667 309.107 46.25 306.065 46.25C303.107 46.25 300.503 47.0625 298.253 48.6875C296.044 50.3125 294.378 52.6042 293.253 55.5625C292.169 58.4792 291.628 61.4375 291.628 64.4375ZM355.67 47.0625H351.545C349.128 47.0625 347.191 46.3333 345.733 44.875C344.233 43.375 343.483 41.3958 343.483 38.9375C343.483 36.6458 344.253 34.7292 345.795 33.1875C347.337 31.6458 349.253 30.875 351.545 30.875H355.67V19.875C355.67 16.8333 356.503 14.375 358.17 12.5C359.878 10.5833 362.108 9.625 364.858 9.625C366.649 9.625 368.233 10.0625 369.608 10.9375C371.024 11.7708 372.128 12.9583 372.92 14.5C373.712 16.0417 374.108 17.8333 374.108 19.875V30.875H379.358C382.108 30.875 384.253 31.5833 385.795 33C387.378 34.375 388.17 36.3542 388.17 38.9375C388.17 41.5208 387.399 43.5208 385.858 44.9375C384.316 46.3542 382.149 47.0625 379.358 47.0625H374.108V89.5C374.108 91.5 373.712 93.2917 372.92 94.875C372.128 96.4167 371.024 97.6042 369.608 98.4375C368.191 99.3125 366.608 99.75 364.858 99.75C362.108 99.75 359.878 98.8125 358.17 96.9375C356.503 95.0208 355.67 92.5417 355.67 89.5V47.0625ZM423.837 29.375C428.421 29.375 432.775 30.3333 436.9 32.25C441.067 34.125 444.671 36.7708 447.712 40.1875C450.671 43.5625 452.942 47.375 454.525 51.625C456.108 55.875 456.9 60.3542 456.9 65.0625C456.9 69.7708 456.108 74.2917 454.525 78.625C452.942 82.9583 450.712 86.75 447.837 90C444.837 93.375 441.254 95.9792 437.087 97.8125C432.962 99.6458 428.546 100.562 423.837 100.562C417.587 100.562 411.921 99 406.837 95.875C401.754 92.7083 397.817 88.3542 395.025 82.8125C392.233 77.3958 390.837 71.4792 390.837 65.0625C390.837 60.4792 391.629 56.0417 393.212 51.75C394.837 47.4167 397.129 43.5625 400.087 40.1875C403.129 36.7292 406.692 34.0625 410.775 32.1875C414.858 30.3125 419.212 29.375 423.837 29.375ZM423.837 46.25C420.879 46.25 418.254 47.125 415.962 48.875C413.712 50.625 412.025 53.0208 410.9 56.0625C409.817 59.1875 409.275 62.1875 409.275 65.0625C409.275 68.3125 409.858 71.3542 411.025 74.1875C412.192 76.9792 413.817 79.2292 415.9 80.9375C418.067 82.7292 420.712 83.625 423.837 83.625C426.837 83.625 429.462 82.7917 431.712 81.125C433.962 79.4167 435.671 77.0417 436.837 74C437.921 71 438.462 68.0208 438.462 65.0625C438.462 61.7292 437.879 58.6667 436.712 55.875C435.587 53.0417 433.983 50.75 431.9 49C429.692 47.1667 427.004 46.25 423.837 46.25ZM469.005 39.375C469.005 37.5417 469.422 35.9167 470.255 34.5C471.088 33.0833 472.255 32 473.755 31.25C475.213 30.5 476.776 30.125 478.443 30.125C484.443 30.125 487.443 32.6875 487.443 37.8125H487.693C489.609 35.0625 491.547 33.1042 493.505 31.9375C495.505 30.7292 497.88 30.125 500.63 30.125C502.297 30.125 503.797 30.5208 505.13 31.3125C506.505 32.1042 507.588 33.2292 508.38 34.6875C509.172 36.1042 509.568 37.875 509.568 40C509.568 41.6667 509.151 43 508.318 44C507.526 45 506.193 45.875 504.318 46.625L498.568 48.9375C495.609 50.3125 493.401 51.5208 491.943 52.5625C490.526 53.5625 489.443 54.7083 488.693 56C487.859 57.4583 487.443 59.2083 487.443 61.25V89.5C487.443 91.5 487.047 93.2917 486.255 94.875C485.463 96.4167 484.359 97.6042 482.943 98.4375C481.526 99.3125 479.943 99.75 478.193 99.75C475.443 99.75 473.213 98.8125 471.505 96.9375C469.838 95.0208 469.005 92.5417 469.005 89.5V39.375ZM531.235 71.125C531.86 75.2917 533.714 78.5625 536.797 80.9375C539.922 83.2708 543.86 84.4375 548.61 84.4375C551.152 84.4375 553.277 84.125 554.985 83.5C556.693 82.8333 558.902 81.7292 561.61 80.1875C562.277 79.8542 562.777 79.5833 563.11 79.375C566.068 77.7917 568.193 77 569.485 77C570.735 77 571.943 77.375 573.11 78.125C574.318 78.875 575.277 79.875 575.985 81.125C576.693 82.3333 577.047 83.6042 577.047 84.9375C577.047 86.8125 576.193 88.6875 574.485 90.5625C572.777 92.4375 570.402 94.125 567.36 95.625C564.402 97.125 561.068 98.3125 557.36 99.1875C553.693 100.104 550.214 100.562 546.922 100.562C540.297 100.562 534.318 99.0417 528.985 96C523.652 92.9167 519.547 88.6667 516.672 83.25C513.797 77.875 512.36 71.8125 512.36 65.0625C512.36 60.5208 513.172 56.0833 514.797 51.75C516.464 47.4167 518.777 43.5417 521.735 40.125C524.735 36.7083 528.277 34.0625 532.36 32.1875C536.485 30.3125 540.839 29.375 545.422 29.375C550.006 29.375 554.381 30.3333 558.547 32.25C562.756 34.125 566.36 36.7708 569.36 40.1875C572.235 43.4375 574.485 47.0625 576.11 51.0625C577.735 55.0625 578.547 59 578.547 62.875C578.547 68.375 575.86 71.125 570.485 71.125H531.235ZM560.11 58.8125C559.61 54.4375 558.047 51 555.422 48.5C552.839 46 549.506 44.75 545.422 44.75C542.839 44.75 540.506 45.3333 538.422 46.5C536.381 47.6667 534.672 49.3333 533.297 51.5C531.922 53.7083 531.089 56.1458 530.797 58.8125H560.11ZM593.84 47.0625H589.715C587.298 47.0625 585.361 46.3333 583.903 44.875C582.403 43.375 581.653 41.3958 581.653 38.9375C581.653 36.6458 582.423 34.7292 583.965 33.1875C585.507 31.6458 587.423 30.875 589.715 30.875H593.84V21.4375C593.84 17.1458 594.632 13.4167 596.215 10.25C597.84 7.04167 600.111 4.60417 603.028 2.9375C605.944 1.27083 609.319 0.4375 613.153 0.4375C617.194 0.4375 620.34 1.14583 622.59 2.5625C624.84 3.97917 625.965 6.04167 625.965 8.75C625.965 13.9583 623.444 16.5625 618.403 16.5625C616.819 16.5625 615.611 16.7292 614.778 17.0625C613.986 17.3958 613.361 18.0208 612.903 18.9375C612.444 20.0625 612.215 21.5417 612.215 23.375V30.875H618.028C624.236 30.875 627.34 33.5625 627.34 38.9375C627.34 44.3542 624.236 47.0625 618.028 47.0625H612.215V89.5C612.215 92.5417 611.361 95.0208 609.653 96.9375C607.986 98.8125 605.778 99.75 603.028 99.75C600.278 99.75 598.048 98.8125 596.34 96.9375C594.673 95.0208 593.84 92.5417 593.84 89.5V47.0625ZM640.883 2.5C642.716 2.5 644.403 2.95833 645.945 3.875C647.528 4.79167 648.82 6.0625 649.82 7.6875C650.778 9.27083 651.258 10.9167 651.258 12.625C651.258 14.5 650.778 16.2708 649.82 17.9375C648.903 19.5625 647.653 20.8542 646.07 21.8125C644.487 22.7708 642.758 23.25 640.883 23.25C639.133 23.25 637.466 22.75 635.883 21.75C634.299 20.75 633.008 19.4167 632.008 17.75C631.008 16.125 630.508 14.4167 630.508 12.625C630.508 10.9167 630.987 9.29167 631.945 7.75C632.903 6.20833 634.195 4.9375 635.82 3.9375C637.403 2.97917 639.091 2.5 640.883 2.5ZM631.695 40.375C631.695 37.3333 632.528 34.875 634.195 33C635.903 31.0833 638.133 30.125 640.883 30.125C642.674 30.125 644.258 30.5625 645.633 31.4375C647.049 32.2708 648.153 33.4583 648.945 35C649.737 36.5417 650.133 38.3333 650.133 40.375V89.5C650.133 91.5 649.737 93.2917 648.945 94.875C648.153 96.4167 647.049 97.6042 645.633 98.4375C644.216 99.3125 642.633 99.75 640.883 99.75C638.133 99.75 635.903 98.8125 634.195 96.9375C632.528 95.0208 631.695 92.5417 631.695 89.5V40.375ZM664.675 10.6875C664.675 7.64583 665.508 5.1875 667.175 3.3125C668.883 1.39583 671.112 0.4375 673.862 0.4375C675.654 0.4375 677.237 0.875 678.612 1.75C680.029 2.58333 681.133 3.77083 681.925 5.3125C682.717 6.85417 683.112 8.64583 683.112 10.6875V89.5C683.112 91.5 682.717 93.2917 681.925 94.875C681.133 96.4167 680.029 97.6042 678.612 98.4375C677.196 99.3125 675.612 99.75 673.862 99.75C671.112 99.75 668.883 98.8125 667.175 96.9375C665.508 95.0208 664.675 92.5417 664.675 89.5V10.6875ZM697.655 10.6875C697.655 7.64583 698.488 5.1875 700.155 3.3125C701.863 1.39583 704.093 0.4375 706.843 0.4375C708.634 0.4375 710.218 0.875 711.593 1.75C713.009 2.58333 714.113 3.77083 714.905 5.3125C715.697 6.85417 716.093 8.64583 716.093 10.6875V89.5C716.093 91.5 715.697 93.2917 714.905 94.875C714.113 96.4167 713.009 97.6042 711.593 98.4375C710.176 99.3125 708.593 99.75 706.843 99.75C704.093 99.75 701.863 98.8125 700.155 96.9375C698.488 95.0208 697.655 92.5417 697.655 89.5V10.6875ZM777.198 42.6875C777.198 44.1042 776.864 45.4375 776.198 46.6875C775.531 47.9375 774.635 48.9375 773.51 49.6875C772.343 50.4792 771.073 50.875 769.698 50.875C768.948 50.875 767.135 50.2708 764.26 49.0625C760.968 47.5208 758.677 46.5208 757.385 46.0625C756.135 45.6875 754.718 45.5 753.135 45.5C751.26 45.5 749.739 45.9583 748.573 46.875C747.448 47.7917 746.885 49.0417 746.885 50.625C746.885 51.9583 748.052 53.2917 750.385 54.625C752.218 55.6667 755.739 57.25 760.948 59.375L764.073 60.625C768.948 62.625 772.635 65.125 775.135 68.125C777.635 71.0833 778.885 74.6667 778.885 78.875C778.885 83 777.802 86.7083 775.635 90C773.468 93.25 770.385 95.8125 766.385 97.6875C762.51 99.6042 757.927 100.562 752.635 100.562C748.843 100.562 744.948 99.9167 740.948 98.625C736.948 97.3333 733.635 95.625 731.01 93.5C728.26 91.2917 726.885 88.8958 726.885 86.3125C726.885 85.1458 727.239 83.9167 727.948 82.625C728.656 81.3333 729.614 80.2708 730.823 79.4375C731.989 78.5625 733.323 78.125 734.823 78.125C736.281 78.125 737.593 78.3333 738.76 78.75C739.927 79.1667 741.656 80.0208 743.948 81.3125C746.073 82.5208 747.802 83.3542 749.135 83.8125C750.51 84.2292 752.114 84.4375 753.948 84.4375C756.573 84.4375 758.427 84.0417 759.51 83.25C760.635 82.4167 761.198 81.0625 761.198 79.1875C761.198 77.3958 759.427 75.7292 755.885 74.1875C753.635 73.1875 749.739 71.5417 744.198 69.25C739.239 67.2083 735.489 64.6875 732.948 61.6875C730.448 58.6875 729.198 55.0833 729.198 50.875C729.198 46.7917 730.26 43.1042 732.385 39.8125C734.51 36.5208 737.468 33.9375 741.26 32.0625C744.885 30.2708 749.198 29.375 754.198 29.375C757.864 29.375 761.448 29.9167 764.948 31C768.448 32.0833 771.323 33.5625 773.573 35.4375C775.989 37.4792 777.198 39.8958 777.198 42.6875Z"
                                    fill="currentColor"
                                  />
                                  <path
                                    d="M37 90L60 90"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeWidth={23}
                                  />
                                  <path
                                    d="M12 58L43 58"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeWidth={23}
                                  />
                                  <path
                                    d="M32 25L48 25"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeWidth={23}
                                  />
                                </svg>
                                <div
                                  aria-label="5 out of 5 stars"
                                  className="flex flex-row text-primary-900 dark:text-primary-300"
                                  role="img"
                                >
                                  <svg
                                    aria-hidden="true"
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    data-slot="icon"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      clipRule="evenodd"
                                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                      fillRule="evenodd"
                                    />
                                  </svg>
                                  <svg
                                    aria-hidden="true"
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    data-slot="icon"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      clipRule="evenodd"
                                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                      fillRule="evenodd"
                                    />
                                  </svg>
                                  <svg
                                    aria-hidden="true"
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    data-slot="icon"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      clipRule="evenodd"
                                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                      fillRule="evenodd"
                                    />
                                  </svg>
                                  <svg
                                    aria-hidden="true"
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    data-slot="icon"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      clipRule="evenodd"
                                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                      fillRule="evenodd"
                                    />
                                  </svg>
                                  <svg
                                    aria-hidden="true"
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    data-slot="icon"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      clipRule="evenodd"
                                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                      fillRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-col gap-2" lang="en">
                            <p
                              className="text-sm leading-relaxed break-words line-clamp-4"
                              id="_r_c_"
                            >
                              Fantastic service for any country phone top-up.
                            </p>
                            <div className="-mx-2 mt-auto flex flex-wrap items-center gap-x-1 gap-y-1 pt-1 text-xs" />
                          </div>
                        </article>
                      </div>
                      <div className="grid w-74 shrink-0 no-underline last:mr-32 sm:w-81">
                        <article className="flex w-full flex-col rounded-2xl p-5 ring-1 ring-gray-200 transition ring-inset dark:ring-gray-800">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <span
                                aria-hidden="true"
                                className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-900 dark:bg-primary-900/30 dark:text-primary-200"
                              >
                                A
                              </span>
                              <div className="flex min-w-0 flex-col">
                                <div className="flex min-w-0 items-center gap-1">
                                  <p className="min-w-0 truncate text-sm font-semibold">
                                    AJ
                                  </p>
                                  <svg
                                    aria-hidden="true"
                                    aria-label="Verified purchase"
                                    className="h-4 w-4 flex-none text-primary-500 dark:text-primary-300"
                                    data-slot="icon"
                                    fill="currentColor"
                                    role="img"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      clipRule="evenodd"
                                      d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                      fillRule="evenodd"
                                    />
                                  </svg>
                                </div>
                                <time
                                  className="text-xs text-gray-500 dark:text-gray-400"
                                  dateTime="2026-06-13"
                                >
                                  Jun 12, 2026
                                </time>
                              </div>
                            </div>
                            <div className="flex flex-none flex-col items-end">
                              <div className="flex flex-col items-end">
                                <svg
                                  className="h-4 w-auto text-primary-900 dark:text-gray-50"
                                  fill="none"
                                  height={127}
                                  viewBox="0 0 818 127"
                                  width={818}
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M74.1875 53.4375C74.1875 46.8542 75.25 40.6875 77.375 34.9375C79.5 29.1458 82.5417 24.1042 86.5 19.8125C90.5417 15.4375 95.25 12.1042 100.625 9.8125C106 7.47917 111.854 6.3125 118.188 6.3125C121.146 6.3125 124.229 6.58333 127.438 7.125C130.688 7.66667 133.562 8.41667 136.062 9.375C139.146 10.5417 141.521 12.1042 143.188 14.0625C144.896 15.9792 145.75 18.1875 145.75 20.6875C145.75 22.2292 145.396 23.6667 144.688 25C143.979 26.2917 143.021 27.3125 141.812 28.0625C140.646 28.8542 139.312 29.25 137.812 29.25C136.604 29.25 134.688 28.7708 132.062 27.8125C128.729 26.5208 126.25 25.6875 124.625 25.3125C123 24.9375 120.854 24.75 118.188 24.75C114.396 24.75 110.979 25.4792 107.938 26.9375C104.896 28.3958 102.354 30.5 100.312 33.25C98.3125 35.875 96.7708 38.9583 95.6875 42.5C94.6458 46.0417 94.125 49.8125 94.125 53.8125C94.125 59.2292 95.0833 64.0833 97 68.375C98.9583 72.625 101.75 75.9792 105.375 78.4375C109.083 80.8958 113.354 82.125 118.188 82.125C121.146 82.125 123.646 81.8125 125.688 81.1875C127.729 80.5625 130 79.6667 132.5 78.5C134.958 77.3333 136.979 76.75 138.562 76.75C140.146 76.75 141.583 77.1875 142.875 78.0625C144.167 78.8958 145.188 80.0208 145.938 81.4375C146.646 82.9375 147 84.2708 147 85.4375C147 88.7708 145.542 91.6458 142.625 94.0625C139.75 96.4375 135.792 98.1458 130.75 99.1875C126.667 100.104 122.479 100.562 118.188 100.562C109.854 100.562 102.312 98.5208 95.5625 94.4375C88.8125 90.3125 83.5625 84.6042 79.8125 77.3125C76.0625 70.1042 74.1875 62.1458 74.1875 53.4375ZM159.73 39.375C159.73 37.5417 160.147 35.9167 160.98 34.5C161.813 33.0833 162.98 32 164.48 31.25C165.938 30.5 167.501 30.125 169.168 30.125C175.168 30.125 178.168 32.6875 178.168 37.8125H178.418C180.334 35.0625 182.272 33.1042 184.23 31.9375C186.23 30.7292 188.605 30.125 191.355 30.125C193.022 30.125 194.522 30.5208 195.855 31.3125C197.23 32.1042 198.313 33.2292 199.105 34.6875C199.897 36.1042 200.293 37.875 200.293 40C200.293 41.6667 199.876 43 199.043 44C198.251 45 196.918 45.875 195.043 46.625L189.293 48.9375C186.334 50.3125 184.126 51.5208 182.668 52.5625C181.251 53.5625 180.168 54.7083 179.418 56C178.584 57.4583 178.168 59.2083 178.168 61.25V89.5C178.168 91.5 177.772 93.2917 176.98 94.875C176.188 96.4167 175.084 97.6042 173.668 98.4375C172.251 99.3125 170.668 99.75 168.918 99.75C166.168 99.75 163.938 98.8125 162.23 96.9375C160.563 95.0208 159.73 92.5417 159.73 89.5V39.375ZM222.835 93.625L202.46 42.8125C201.877 40.9375 201.585 39.3542 201.585 38.0625C201.585 36.6875 202.002 35.3958 202.835 34.1875C203.668 32.9375 204.793 31.9375 206.21 31.1875C207.543 30.4792 208.898 30.125 210.273 30.125C212.481 30.125 214.377 30.7083 215.96 31.875C217.585 33 218.773 34.6042 219.523 36.6875L232.148 71.375L245.71 36.6875C247.543 32.3125 250.627 30.125 254.96 30.125C256.377 30.125 257.752 30.4792 259.085 31.1875C260.418 31.8958 261.523 32.8542 262.398 34.0625C263.231 35.2708 263.648 36.6042 263.648 38.0625C263.648 39.7292 263.356 41.3125 262.773 42.8125L231.898 119.625C229.939 124.458 227.043 126.875 223.21 126.875C221.377 126.875 219.731 126.521 218.273 125.812C216.814 125.104 215.668 124.125 214.835 122.875C214.002 121.667 213.585 120.354 213.585 118.938C213.585 117.312 213.981 115.521 214.773 113.562L222.835 93.625ZM273.19 40.375C273.19 37.3333 274.023 34.875 275.69 33C277.398 31.0833 279.628 30.125 282.378 30.125C287.294 30.125 290.378 32.6875 291.628 37.8125C293.253 35.1875 295.628 33.125 298.753 31.625C301.878 30.125 305.336 29.375 309.128 29.375C315.128 29.375 320.398 31.0208 324.94 34.3125C329.523 37.6042 333.023 42.2083 335.44 48.125C337.732 53.5 338.878 59.4167 338.878 65.875C338.878 71.9167 337.586 77.5833 335.003 82.875C332.461 88.1667 328.898 92.4167 324.315 95.625C319.648 98.9167 314.378 100.562 308.503 100.562C305.461 100.562 302.461 100.021 299.503 98.9375C296.586 97.8125 293.961 96.2083 291.628 94.125V116.688C291.628 118.604 291.232 120.354 290.44 121.938C289.648 123.521 288.544 124.729 287.128 125.562C285.669 126.438 284.086 126.875 282.378 126.875C279.628 126.875 277.398 125.938 275.69 124.062C274.023 122.229 273.19 119.771 273.19 116.688V40.375ZM291.628 64.4375C291.628 67.8542 292.211 71.0417 293.378 74C294.544 76.9167 296.19 79.2292 298.315 80.9375C300.482 82.7292 303.065 83.625 306.065 83.625C308.898 83.625 311.44 82.75 313.69 81C315.94 79.25 317.648 76.875 318.815 73.875C319.898 70.875 320.44 67.9375 320.44 65.0625C320.44 61.8125 319.878 58.7917 318.753 56C317.628 53.1667 316.023 50.8333 313.94 49C311.732 47.1667 309.107 46.25 306.065 46.25C303.107 46.25 300.503 47.0625 298.253 48.6875C296.044 50.3125 294.378 52.6042 293.253 55.5625C292.169 58.4792 291.628 61.4375 291.628 64.4375ZM355.67 47.0625H351.545C349.128 47.0625 347.191 46.3333 345.733 44.875C344.233 43.375 343.483 41.3958 343.483 38.9375C343.483 36.6458 344.253 34.7292 345.795 33.1875C347.337 31.6458 349.253 30.875 351.545 30.875H355.67V19.875C355.67 16.8333 356.503 14.375 358.17 12.5C359.878 10.5833 362.108 9.625 364.858 9.625C366.649 9.625 368.233 10.0625 369.608 10.9375C371.024 11.7708 372.128 12.9583 372.92 14.5C373.712 16.0417 374.108 17.8333 374.108 19.875V30.875H379.358C382.108 30.875 384.253 31.5833 385.795 33C387.378 34.375 388.17 36.3542 388.17 38.9375C388.17 41.5208 387.399 43.5208 385.858 44.9375C384.316 46.3542 382.149 47.0625 379.358 47.0625H374.108V89.5C374.108 91.5 373.712 93.2917 372.92 94.875C372.128 96.4167 371.024 97.6042 369.608 98.4375C368.191 99.3125 366.608 99.75 364.858 99.75C362.108 99.75 359.878 98.8125 358.17 96.9375C356.503 95.0208 355.67 92.5417 355.67 89.5V47.0625ZM423.837 29.375C428.421 29.375 432.775 30.3333 436.9 32.25C441.067 34.125 444.671 36.7708 447.712 40.1875C450.671 43.5625 452.942 47.375 454.525 51.625C456.108 55.875 456.9 60.3542 456.9 65.0625C456.9 69.7708 456.108 74.2917 454.525 78.625C452.942 82.9583 450.712 86.75 447.837 90C444.837 93.375 441.254 95.9792 437.087 97.8125C432.962 99.6458 428.546 100.562 423.837 100.562C417.587 100.562 411.921 99 406.837 95.875C401.754 92.7083 397.817 88.3542 395.025 82.8125C392.233 77.3958 390.837 71.4792 390.837 65.0625C390.837 60.4792 391.629 56.0417 393.212 51.75C394.837 47.4167 397.129 43.5625 400.087 40.1875C403.129 36.7292 406.692 34.0625 410.775 32.1875C414.858 30.3125 419.212 29.375 423.837 29.375ZM423.837 46.25C420.879 46.25 418.254 47.125 415.962 48.875C413.712 50.625 412.025 53.0208 410.9 56.0625C409.817 59.1875 409.275 62.1875 409.275 65.0625C409.275 68.3125 409.858 71.3542 411.025 74.1875C412.192 76.9792 413.817 79.2292 415.9 80.9375C418.067 82.7292 420.712 83.625 423.837 83.625C426.837 83.625 429.462 82.7917 431.712 81.125C433.962 79.4167 435.671 77.0417 436.837 74C437.921 71 438.462 68.0208 438.462 65.0625C438.462 61.7292 437.879 58.6667 436.712 55.875C435.587 53.0417 433.983 50.75 431.9 49C429.692 47.1667 427.004 46.25 423.837 46.25ZM469.005 39.375C469.005 37.5417 469.422 35.9167 470.255 34.5C471.088 33.0833 472.255 32 473.755 31.25C475.213 30.5 476.776 30.125 478.443 30.125C484.443 30.125 487.443 32.6875 487.443 37.8125H487.693C489.609 35.0625 491.547 33.1042 493.505 31.9375C495.505 30.7292 497.88 30.125 500.63 30.125C502.297 30.125 503.797 30.5208 505.13 31.3125C506.505 32.1042 507.588 33.2292 508.38 34.6875C509.172 36.1042 509.568 37.875 509.568 40C509.568 41.6667 509.151 43 508.318 44C507.526 45 506.193 45.875 504.318 46.625L498.568 48.9375C495.609 50.3125 493.401 51.5208 491.943 52.5625C490.526 53.5625 489.443 54.7083 488.693 56C487.859 57.4583 487.443 59.2083 487.443 61.25V89.5C487.443 91.5 487.047 93.2917 486.255 94.875C485.463 96.4167 484.359 97.6042 482.943 98.4375C481.526 99.3125 479.943 99.75 478.193 99.75C475.443 99.75 473.213 98.8125 471.505 96.9375C469.838 95.0208 469.005 92.5417 469.005 89.5V39.375ZM531.235 71.125C531.86 75.2917 533.714 78.5625 536.797 80.9375C539.922 83.2708 543.86 84.4375 548.61 84.4375C551.152 84.4375 553.277 84.125 554.985 83.5C556.693 82.8333 558.902 81.7292 561.61 80.1875C562.277 79.8542 562.777 79.5833 563.11 79.375C566.068 77.7917 568.193 77 569.485 77C570.735 77 571.943 77.375 573.11 78.125C574.318 78.875 575.277 79.875 575.985 81.125C576.693 82.3333 577.047 83.6042 577.047 84.9375C577.047 86.8125 576.193 88.6875 574.485 90.5625C572.777 92.4375 570.402 94.125 567.36 95.625C564.402 97.125 561.068 98.3125 557.36 99.1875C553.693 100.104 550.214 100.562 546.922 100.562C540.297 100.562 534.318 99.0417 528.985 96C523.652 92.9167 519.547 88.6667 516.672 83.25C513.797 77.875 512.36 71.8125 512.36 65.0625C512.36 60.5208 513.172 56.0833 514.797 51.75C516.464 47.4167 518.777 43.5417 521.735 40.125C524.735 36.7083 528.277 34.0625 532.36 32.1875C536.485 30.3125 540.839 29.375 545.422 29.375C550.006 29.375 554.381 30.3333 558.547 32.25C562.756 34.125 566.36 36.7708 569.36 40.1875C572.235 43.4375 574.485 47.0625 576.11 51.0625C577.735 55.0625 578.547 59 578.547 62.875C578.547 68.375 575.86 71.125 570.485 71.125H531.235ZM560.11 58.8125C559.61 54.4375 558.047 51 555.422 48.5C552.839 46 549.506 44.75 545.422 44.75C542.839 44.75 540.506 45.3333 538.422 46.5C536.381 47.6667 534.672 49.3333 533.297 51.5C531.922 53.7083 531.089 56.1458 530.797 58.8125H560.11ZM593.84 47.0625H589.715C587.298 47.0625 585.361 46.3333 583.903 44.875C582.403 43.375 581.653 41.3958 581.653 38.9375C581.653 36.6458 582.423 34.7292 583.965 33.1875C585.507 31.6458 587.423 30.875 589.715 30.875H593.84V21.4375C593.84 17.1458 594.632 13.4167 596.215 10.25C597.84 7.04167 600.111 4.60417 603.028 2.9375C605.944 1.27083 609.319 0.4375 613.153 0.4375C617.194 0.4375 620.34 1.14583 622.59 2.5625C624.84 3.97917 625.965 6.04167 625.965 8.75C625.965 13.9583 623.444 16.5625 618.403 16.5625C616.819 16.5625 615.611 16.7292 614.778 17.0625C613.986 17.3958 613.361 18.0208 612.903 18.9375C612.444 20.0625 612.215 21.5417 612.215 23.375V30.875H618.028C624.236 30.875 627.34 33.5625 627.34 38.9375C627.34 44.3542 624.236 47.0625 618.028 47.0625H612.215V89.5C612.215 92.5417 611.361 95.0208 609.653 96.9375C607.986 98.8125 605.778 99.75 603.028 99.75C600.278 99.75 598.048 98.8125 596.34 96.9375C594.673 95.0208 593.84 92.5417 593.84 89.5V47.0625ZM640.883 2.5C642.716 2.5 644.403 2.95833 645.945 3.875C647.528 4.79167 648.82 6.0625 649.82 7.6875C650.778 9.27083 651.258 10.9167 651.258 12.625C651.258 14.5 650.778 16.2708 649.82 17.9375C648.903 19.5625 647.653 20.8542 646.07 21.8125C644.487 22.7708 642.758 23.25 640.883 23.25C639.133 23.25 637.466 22.75 635.883 21.75C634.299 20.75 633.008 19.4167 632.008 17.75C631.008 16.125 630.508 14.4167 630.508 12.625C630.508 10.9167 630.987 9.29167 631.945 7.75C632.903 6.20833 634.195 4.9375 635.82 3.9375C637.403 2.97917 639.091 2.5 640.883 2.5ZM631.695 40.375C631.695 37.3333 632.528 34.875 634.195 33C635.903 31.0833 638.133 30.125 640.883 30.125C642.674 30.125 644.258 30.5625 645.633 31.4375C647.049 32.2708 648.153 33.4583 648.945 35C649.737 36.5417 650.133 38.3333 650.133 40.375V89.5C650.133 91.5 649.737 93.2917 648.945 94.875C648.153 96.4167 647.049 97.6042 645.633 98.4375C644.216 99.3125 642.633 99.75 640.883 99.75C638.133 99.75 635.903 98.8125 634.195 96.9375C632.528 95.0208 631.695 92.5417 631.695 89.5V40.375ZM664.675 10.6875C664.675 7.64583 665.508 5.1875 667.175 3.3125C668.883 1.39583 671.112 0.4375 673.862 0.4375C675.654 0.4375 677.237 0.875 678.612 1.75C680.029 2.58333 681.133 3.77083 681.925 5.3125C682.717 6.85417 683.112 8.64583 683.112 10.6875V89.5C683.112 91.5 682.717 93.2917 681.925 94.875C681.133 96.4167 680.029 97.6042 678.612 98.4375C677.196 99.3125 675.612 99.75 673.862 99.75C671.112 99.75 668.883 98.8125 667.175 96.9375C665.508 95.0208 664.675 92.5417 664.675 89.5V10.6875ZM697.655 10.6875C697.655 7.64583 698.488 5.1875 700.155 3.3125C701.863 1.39583 704.093 0.4375 706.843 0.4375C708.634 0.4375 710.218 0.875 711.593 1.75C713.009 2.58333 714.113 3.77083 714.905 5.3125C715.697 6.85417 716.093 8.64583 716.093 10.6875V89.5C716.093 91.5 715.697 93.2917 714.905 94.875C714.113 96.4167 713.009 97.6042 711.593 98.4375C710.176 99.3125 708.593 99.75 706.843 99.75C704.093 99.75 701.863 98.8125 700.155 96.9375C698.488 95.0208 697.655 92.5417 697.655 89.5V10.6875ZM777.198 42.6875C777.198 44.1042 776.864 45.4375 776.198 46.6875C775.531 47.9375 774.635 48.9375 773.51 49.6875C772.343 50.4792 771.073 50.875 769.698 50.875C768.948 50.875 767.135 50.2708 764.26 49.0625C760.968 47.5208 758.677 46.5208 757.385 46.0625C756.135 45.6875 754.718 45.5 753.135 45.5C751.26 45.5 749.739 45.9583 748.573 46.875C747.448 47.7917 746.885 49.0417 746.885 50.625C746.885 51.9583 748.052 53.2917 750.385 54.625C752.218 55.6667 755.739 57.25 760.948 59.375L764.073 60.625C768.948 62.625 772.635 65.125 775.135 68.125C777.635 71.0833 778.885 74.6667 778.885 78.875C778.885 83 777.802 86.7083 775.635 90C773.468 93.25 770.385 95.8125 766.385 97.6875C762.51 99.6042 757.927 100.562 752.635 100.562C748.843 100.562 744.948 99.9167 740.948 98.625C736.948 97.3333 733.635 95.625 731.01 93.5C728.26 91.2917 726.885 88.8958 726.885 86.3125C726.885 85.1458 727.239 83.9167 727.948 82.625C728.656 81.3333 729.614 80.2708 730.823 79.4375C731.989 78.5625 733.323 78.125 734.823 78.125C736.281 78.125 737.593 78.3333 738.76 78.75C739.927 79.1667 741.656 80.0208 743.948 81.3125C746.073 82.5208 747.802 83.3542 749.135 83.8125C750.51 84.2292 752.114 84.4375 753.948 84.4375C756.573 84.4375 758.427 84.0417 759.51 83.25C760.635 82.4167 761.198 81.0625 761.198 79.1875C761.198 77.3958 759.427 75.7292 755.885 74.1875C753.635 73.1875 749.739 71.5417 744.198 69.25C739.239 67.2083 735.489 64.6875 732.948 61.6875C730.448 58.6875 729.198 55.0833 729.198 50.875C729.198 46.7917 730.26 43.1042 732.385 39.8125C734.51 36.5208 737.468 33.9375 741.26 32.0625C744.885 30.2708 749.198 29.375 754.198 29.375C757.864 29.375 761.448 29.9167 764.948 31C768.448 32.0833 771.323 33.5625 773.573 35.4375C775.989 37.4792 777.198 39.8958 777.198 42.6875Z"
                                    fill="currentColor"
                                  />
                                  <path
                                    d="M37 90L60 90"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeWidth={23}
                                  />
                                  <path
                                    d="M12 58L43 58"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeWidth={23}
                                  />
                                  <path
                                    d="M32 25L48 25"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeWidth={23}
                                  />
                                </svg>
                                <div
                                  aria-label="5 out of 5 stars"
                                  className="flex flex-row text-primary-900 dark:text-primary-300"
                                  role="img"
                                >
                                  <svg
                                    aria-hidden="true"
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    data-slot="icon"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      clipRule="evenodd"
                                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                      fillRule="evenodd"
                                    />
                                  </svg>
                                  <svg
                                    aria-hidden="true"
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    data-slot="icon"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      clipRule="evenodd"
                                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                      fillRule="evenodd"
                                    />
                                  </svg>
                                  <svg
                                    aria-hidden="true"
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    data-slot="icon"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      clipRule="evenodd"
                                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                      fillRule="evenodd"
                                    />
                                  </svg>
                                  <svg
                                    aria-hidden="true"
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    data-slot="icon"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      clipRule="evenodd"
                                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                      fillRule="evenodd"
                                    />
                                  </svg>
                                  <svg
                                    aria-hidden="true"
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    data-slot="icon"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      clipRule="evenodd"
                                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                      fillRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-col gap-2" lang="en">
                            <p
                              className="text-sm leading-relaxed break-words line-clamp-4"
                              id="_r_d_"
                            >
                              Works great and is fast
                            </p>
                            <div className="-mx-2 mt-auto flex flex-wrap items-center gap-x-1 gap-y-1 pt-1 text-xs" />
                          </div>
                        </article>
                      </div>
                      <div className="grid w-74 shrink-0 no-underline last:mr-32 sm:w-81">
                        <article className="flex w-full flex-col rounded-2xl p-5 ring-1 ring-gray-200 transition ring-inset dark:ring-gray-800">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <span
                                aria-hidden="true"
                                className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-900 dark:bg-primary-900/30 dark:text-primary-200"
                              >
                                T
                              </span>
                              <div className="flex min-w-0 flex-col">
                                <div className="flex min-w-0 items-center gap-1">
                                  <p className="min-w-0 truncate text-sm font-semibold">
                                    Thomas
                                  </p>
                                  <svg
                                    aria-hidden="true"
                                    aria-label="Verified purchase"
                                    className="h-4 w-4 flex-none text-primary-500 dark:text-primary-300"
                                    data-slot="icon"
                                    fill="currentColor"
                                    role="img"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      clipRule="evenodd"
                                      d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                      fillRule="evenodd"
                                    />
                                  </svg>
                                </div>
                                <time
                                  className="text-xs text-gray-500 dark:text-gray-400"
                                  dateTime="2026-06-13"
                                >
                                  Jun 12, 2026
                                </time>
                              </div>
                            </div>
                            <div className="flex flex-none flex-col items-end">
                              <div className="flex flex-col items-end">
                                <svg
                                  className="h-4 w-auto text-primary-900 dark:text-gray-50"
                                  fill="none"
                                  height={127}
                                  viewBox="0 0 818 127"
                                  width={818}
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M74.1875 53.4375C74.1875 46.8542 75.25 40.6875 77.375 34.9375C79.5 29.1458 82.5417 24.1042 86.5 19.8125C90.5417 15.4375 95.25 12.1042 100.625 9.8125C106 7.47917 111.854 6.3125 118.188 6.3125C121.146 6.3125 124.229 6.58333 127.438 7.125C130.688 7.66667 133.562 8.41667 136.062 9.375C139.146 10.5417 141.521 12.1042 143.188 14.0625C144.896 15.9792 145.75 18.1875 145.75 20.6875C145.75 22.2292 145.396 23.6667 144.688 25C143.979 26.2917 143.021 27.3125 141.812 28.0625C140.646 28.8542 139.312 29.25 137.812 29.25C136.604 29.25 134.688 28.7708 132.062 27.8125C128.729 26.5208 126.25 25.6875 124.625 25.3125C123 24.9375 120.854 24.75 118.188 24.75C114.396 24.75 110.979 25.4792 107.938 26.9375C104.896 28.3958 102.354 30.5 100.312 33.25C98.3125 35.875 96.7708 38.9583 95.6875 42.5C94.6458 46.0417 94.125 49.8125 94.125 53.8125C94.125 59.2292 95.0833 64.0833 97 68.375C98.9583 72.625 101.75 75.9792 105.375 78.4375C109.083 80.8958 113.354 82.125 118.188 82.125C121.146 82.125 123.646 81.8125 125.688 81.1875C127.729 80.5625 130 79.6667 132.5 78.5C134.958 77.3333 136.979 76.75 138.562 76.75C140.146 76.75 141.583 77.1875 142.875 78.0625C144.167 78.8958 145.188 80.0208 145.938 81.4375C146.646 82.9375 147 84.2708 147 85.4375C147 88.7708 145.542 91.6458 142.625 94.0625C139.75 96.4375 135.792 98.1458 130.75 99.1875C126.667 100.104 122.479 100.562 118.188 100.562C109.854 100.562 102.312 98.5208 95.5625 94.4375C88.8125 90.3125 83.5625 84.6042 79.8125 77.3125C76.0625 70.1042 74.1875 62.1458 74.1875 53.4375ZM159.73 39.375C159.73 37.5417 160.147 35.9167 160.98 34.5C161.813 33.0833 162.98 32 164.48 31.25C165.938 30.5 167.501 30.125 169.168 30.125C175.168 30.125 178.168 32.6875 178.168 37.8125H178.418C180.334 35.0625 182.272 33.1042 184.23 31.9375C186.23 30.7292 188.605 30.125 191.355 30.125C193.022 30.125 194.522 30.5208 195.855 31.3125C197.23 32.1042 198.313 33.2292 199.105 34.6875C199.897 36.1042 200.293 37.875 200.293 40C200.293 41.6667 199.876 43 199.043 44C198.251 45 196.918 45.875 195.043 46.625L189.293 48.9375C186.334 50.3125 184.126 51.5208 182.668 52.5625C181.251 53.5625 180.168 54.7083 179.418 56C178.584 57.4583 178.168 59.2083 178.168 61.25V89.5C178.168 91.5 177.772 93.2917 176.98 94.875C176.188 96.4167 175.084 97.6042 173.668 98.4375C172.251 99.3125 170.668 99.75 168.918 99.75C166.168 99.75 163.938 98.8125 162.23 96.9375C160.563 95.0208 159.73 92.5417 159.73 89.5V39.375ZM222.835 93.625L202.46 42.8125C201.877 40.9375 201.585 39.3542 201.585 38.0625C201.585 36.6875 202.002 35.3958 202.835 34.1875C203.668 32.9375 204.793 31.9375 206.21 31.1875C207.543 30.4792 208.898 30.125 210.273 30.125C212.481 30.125 214.377 30.7083 215.96 31.875C217.585 33 218.773 34.6042 219.523 36.6875L232.148 71.375L245.71 36.6875C247.543 32.3125 250.627 30.125 254.96 30.125C256.377 30.125 257.752 30.4792 259.085 31.1875C260.418 31.8958 261.523 32.8542 262.398 34.0625C263.231 35.2708 263.648 36.6042 263.648 38.0625C263.648 39.7292 263.356 41.3125 262.773 42.8125L231.898 119.625C229.939 124.458 227.043 126.875 223.21 126.875C221.377 126.875 219.731 126.521 218.273 125.812C216.814 125.104 215.668 124.125 214.835 122.875C214.002 121.667 213.585 120.354 213.585 118.938C213.585 117.312 213.981 115.521 214.773 113.562L222.835 93.625ZM273.19 40.375C273.19 37.3333 274.023 34.875 275.69 33C277.398 31.0833 279.628 30.125 282.378 30.125C287.294 30.125 290.378 32.6875 291.628 37.8125C293.253 35.1875 295.628 33.125 298.753 31.625C301.878 30.125 305.336 29.375 309.128 29.375C315.128 29.375 320.398 31.0208 324.94 34.3125C329.523 37.6042 333.023 42.2083 335.44 48.125C337.732 53.5 338.878 59.4167 338.878 65.875C338.878 71.9167 337.586 77.5833 335.003 82.875C332.461 88.1667 328.898 92.4167 324.315 95.625C319.648 98.9167 314.378 100.562 308.503 100.562C305.461 100.562 302.461 100.021 299.503 98.9375C296.586 97.8125 293.961 96.2083 291.628 94.125V116.688C291.628 118.604 291.232 120.354 290.44 121.938C289.648 123.521 288.544 124.729 287.128 125.562C285.669 126.438 284.086 126.875 282.378 126.875C279.628 126.875 277.398 125.938 275.69 124.062C274.023 122.229 273.19 119.771 273.19 116.688V40.375ZM291.628 64.4375C291.628 67.8542 292.211 71.0417 293.378 74C294.544 76.9167 296.19 79.2292 298.315 80.9375C300.482 82.7292 303.065 83.625 306.065 83.625C308.898 83.625 311.44 82.75 313.69 81C315.94 79.25 317.648 76.875 318.815 73.875C319.898 70.875 320.44 67.9375 320.44 65.0625C320.44 61.8125 319.878 58.7917 318.753 56C317.628 53.1667 316.023 50.8333 313.94 49C311.732 47.1667 309.107 46.25 306.065 46.25C303.107 46.25 300.503 47.0625 298.253 48.6875C296.044 50.3125 294.378 52.6042 293.253 55.5625C292.169 58.4792 291.628 61.4375 291.628 64.4375ZM355.67 47.0625H351.545C349.128 47.0625 347.191 46.3333 345.733 44.875C344.233 43.375 343.483 41.3958 343.483 38.9375C343.483 36.6458 344.253 34.7292 345.795 33.1875C347.337 31.6458 349.253 30.875 351.545 30.875H355.67V19.875C355.67 16.8333 356.503 14.375 358.17 12.5C359.878 10.5833 362.108 9.625 364.858 9.625C366.649 9.625 368.233 10.0625 369.608 10.9375C371.024 11.7708 372.128 12.9583 372.92 14.5C373.712 16.0417 374.108 17.8333 374.108 19.875V30.875H379.358C382.108 30.875 384.253 31.5833 385.795 33C387.378 34.375 388.17 36.3542 388.17 38.9375C388.17 41.5208 387.399 43.5208 385.858 44.9375C384.316 46.3542 382.149 47.0625 379.358 47.0625H374.108V89.5C374.108 91.5 373.712 93.2917 372.92 94.875C372.128 96.4167 371.024 97.6042 369.608 98.4375C368.191 99.3125 366.608 99.75 364.858 99.75C362.108 99.75 359.878 98.8125 358.17 96.9375C356.503 95.0208 355.67 92.5417 355.67 89.5V47.0625ZM423.837 29.375C428.421 29.375 432.775 30.3333 436.9 32.25C441.067 34.125 444.671 36.7708 447.712 40.1875C450.671 43.5625 452.942 47.375 454.525 51.625C456.108 55.875 456.9 60.3542 456.9 65.0625C456.9 69.7708 456.108 74.2917 454.525 78.625C452.942 82.9583 450.712 86.75 447.837 90C444.837 93.375 441.254 95.9792 437.087 97.8125C432.962 99.6458 428.546 100.562 423.837 100.562C417.587 100.562 411.921 99 406.837 95.875C401.754 92.7083 397.817 88.3542 395.025 82.8125C392.233 77.3958 390.837 71.4792 390.837 65.0625C390.837 60.4792 391.629 56.0417 393.212 51.75C394.837 47.4167 397.129 43.5625 400.087 40.1875C403.129 36.7292 406.692 34.0625 410.775 32.1875C414.858 30.3125 419.212 29.375 423.837 29.375ZM423.837 46.25C420.879 46.25 418.254 47.125 415.962 48.875C413.712 50.625 412.025 53.0208 410.9 56.0625C409.817 59.1875 409.275 62.1875 409.275 65.0625C409.275 68.3125 409.858 71.3542 411.025 74.1875C412.192 76.9792 413.817 79.2292 415.9 80.9375C418.067 82.7292 420.712 83.625 423.837 83.625C426.837 83.625 429.462 82.7917 431.712 81.125C433.962 79.4167 435.671 77.0417 436.837 74C437.921 71 438.462 68.0208 438.462 65.0625C438.462 61.7292 437.879 58.6667 436.712 55.875C435.587 53.0417 433.983 50.75 431.9 49C429.692 47.1667 427.004 46.25 423.837 46.25ZM469.005 39.375C469.005 37.5417 469.422 35.9167 470.255 34.5C471.088 33.0833 472.255 32 473.755 31.25C475.213 30.5 476.776 30.125 478.443 30.125C484.443 30.125 487.443 32.6875 487.443 37.8125H487.693C489.609 35.0625 491.547 33.1042 493.505 31.9375C495.505 30.7292 497.88 30.125 500.63 30.125C502.297 30.125 503.797 30.5208 505.13 31.3125C506.505 32.1042 507.588 33.2292 508.38 34.6875C509.172 36.1042 509.568 37.875 509.568 40C509.568 41.6667 509.151 43 508.318 44C507.526 45 506.193 45.875 504.318 46.625L498.568 48.9375C495.609 50.3125 493.401 51.5208 491.943 52.5625C490.526 53.5625 489.443 54.7083 488.693 56C487.859 57.4583 487.443 59.2083 487.443 61.25V89.5C487.443 91.5 487.047 93.2917 486.255 94.875C485.463 96.4167 484.359 97.6042 482.943 98.4375C481.526 99.3125 479.943 99.75 478.193 99.75C475.443 99.75 473.213 98.8125 471.505 96.9375C469.838 95.0208 469.005 92.5417 469.005 89.5V39.375ZM531.235 71.125C531.86 75.2917 533.714 78.5625 536.797 80.9375C539.922 83.2708 543.86 84.4375 548.61 84.4375C551.152 84.4375 553.277 84.125 554.985 83.5C556.693 82.8333 558.902 81.7292 561.61 80.1875C562.277 79.8542 562.777 79.5833 563.11 79.375C566.068 77.7917 568.193 77 569.485 77C570.735 77 571.943 77.375 573.11 78.125C574.318 78.875 575.277 79.875 575.985 81.125C576.693 82.3333 577.047 83.6042 577.047 84.9375C577.047 86.8125 576.193 88.6875 574.485 90.5625C572.777 92.4375 570.402 94.125 567.36 95.625C564.402 97.125 561.068 98.3125 557.36 99.1875C553.693 100.104 550.214 100.562 546.922 100.562C540.297 100.562 534.318 99.0417 528.985 96C523.652 92.9167 519.547 88.6667 516.672 83.25C513.797 77.875 512.36 71.8125 512.36 65.0625C512.36 60.5208 513.172 56.0833 514.797 51.75C516.464 47.4167 518.777 43.5417 521.735 40.125C524.735 36.7083 528.277 34.0625 532.36 32.1875C536.485 30.3125 540.839 29.375 545.422 29.375C550.006 29.375 554.381 30.3333 558.547 32.25C562.756 34.125 566.36 36.7708 569.36 40.1875C572.235 43.4375 574.485 47.0625 576.11 51.0625C577.735 55.0625 578.547 59 578.547 62.875C578.547 68.375 575.86 71.125 570.485 71.125H531.235ZM560.11 58.8125C559.61 54.4375 558.047 51 555.422 48.5C552.839 46 549.506 44.75 545.422 44.75C542.839 44.75 540.506 45.3333 538.422 46.5C536.381 47.6667 534.672 49.3333 533.297 51.5C531.922 53.7083 531.089 56.1458 530.797 58.8125H560.11ZM593.84 47.0625H589.715C587.298 47.0625 585.361 46.3333 583.903 44.875C582.403 43.375 581.653 41.3958 581.653 38.9375C581.653 36.6458 582.423 34.7292 583.965 33.1875C585.507 31.6458 587.423 30.875 589.715 30.875H593.84V21.4375C593.84 17.1458 594.632 13.4167 596.215 10.25C597.84 7.04167 600.111 4.60417 603.028 2.9375C605.944 1.27083 609.319 0.4375 613.153 0.4375C617.194 0.4375 620.34 1.14583 622.59 2.5625C624.84 3.97917 625.965 6.04167 625.965 8.75C625.965 13.9583 623.444 16.5625 618.403 16.5625C616.819 16.5625 615.611 16.7292 614.778 17.0625C613.986 17.3958 613.361 18.0208 612.903 18.9375C612.444 20.0625 612.215 21.5417 612.215 23.375V30.875H618.028C624.236 30.875 627.34 33.5625 627.34 38.9375C627.34 44.3542 624.236 47.0625 618.028 47.0625H612.215V89.5C612.215 92.5417 611.361 95.0208 609.653 96.9375C607.986 98.8125 605.778 99.75 603.028 99.75C600.278 99.75 598.048 98.8125 596.34 96.9375C594.673 95.0208 593.84 92.5417 593.84 89.5V47.0625ZM640.883 2.5C642.716 2.5 644.403 2.95833 645.945 3.875C647.528 4.79167 648.82 6.0625 649.82 7.6875C650.778 9.27083 651.258 10.9167 651.258 12.625C651.258 14.5 650.778 16.2708 649.82 17.9375C648.903 19.5625 647.653 20.8542 646.07 21.8125C644.487 22.7708 642.758 23.25 640.883 23.25C639.133 23.25 637.466 22.75 635.883 21.75C634.299 20.75 633.008 19.4167 632.008 17.75C631.008 16.125 630.508 14.4167 630.508 12.625C630.508 10.9167 630.987 9.29167 631.945 7.75C632.903 6.20833 634.195 4.9375 635.82 3.9375C637.403 2.97917 639.091 2.5 640.883 2.5ZM631.695 40.375C631.695 37.3333 632.528 34.875 634.195 33C635.903 31.0833 638.133 30.125 640.883 30.125C642.674 30.125 644.258 30.5625 645.633 31.4375C647.049 32.2708 648.153 33.4583 648.945 35C649.737 36.5417 650.133 38.3333 650.133 40.375V89.5C650.133 91.5 649.737 93.2917 648.945 94.875C648.153 96.4167 647.049 97.6042 645.633 98.4375C644.216 99.3125 642.633 99.75 640.883 99.75C638.133 99.75 635.903 98.8125 634.195 96.9375C632.528 95.0208 631.695 92.5417 631.695 89.5V40.375ZM664.675 10.6875C664.675 7.64583 665.508 5.1875 667.175 3.3125C668.883 1.39583 671.112 0.4375 673.862 0.4375C675.654 0.4375 677.237 0.875 678.612 1.75C680.029 2.58333 681.133 3.77083 681.925 5.3125C682.717 6.85417 683.112 8.64583 683.112 10.6875V89.5C683.112 91.5 682.717 93.2917 681.925 94.875C681.133 96.4167 680.029 97.6042 678.612 98.4375C677.196 99.3125 675.612 99.75 673.862 99.75C671.112 99.75 668.883 98.8125 667.175 96.9375C665.508 95.0208 664.675 92.5417 664.675 89.5V10.6875ZM697.655 10.6875C697.655 7.64583 698.488 5.1875 700.155 3.3125C701.863 1.39583 704.093 0.4375 706.843 0.4375C708.634 0.4375 710.218 0.875 711.593 1.75C713.009 2.58333 714.113 3.77083 714.905 5.3125C715.697 6.85417 716.093 8.64583 716.093 10.6875V89.5C716.093 91.5 715.697 93.2917 714.905 94.875C714.113 96.4167 713.009 97.6042 711.593 98.4375C710.176 99.3125 708.593 99.75 706.843 99.75C704.093 99.75 701.863 98.8125 700.155 96.9375C698.488 95.0208 697.655 92.5417 697.655 89.5V10.6875ZM777.198 42.6875C777.198 44.1042 776.864 45.4375 776.198 46.6875C775.531 47.9375 774.635 48.9375 773.51 49.6875C772.343 50.4792 771.073 50.875 769.698 50.875C768.948 50.875 767.135 50.2708 764.26 49.0625C760.968 47.5208 758.677 46.5208 757.385 46.0625C756.135 45.6875 754.718 45.5 753.135 45.5C751.26 45.5 749.739 45.9583 748.573 46.875C747.448 47.7917 746.885 49.0417 746.885 50.625C746.885 51.9583 748.052 53.2917 750.385 54.625C752.218 55.6667 755.739 57.25 760.948 59.375L764.073 60.625C768.948 62.625 772.635 65.125 775.135 68.125C777.635 71.0833 778.885 74.6667 778.885 78.875C778.885 83 777.802 86.7083 775.635 90C773.468 93.25 770.385 95.8125 766.385 97.6875C762.51 99.6042 757.927 100.562 752.635 100.562C748.843 100.562 744.948 99.9167 740.948 98.625C736.948 97.3333 733.635 95.625 731.01 93.5C728.26 91.2917 726.885 88.8958 726.885 86.3125C726.885 85.1458 727.239 83.9167 727.948 82.625C728.656 81.3333 729.614 80.2708 730.823 79.4375C731.989 78.5625 733.323 78.125 734.823 78.125C736.281 78.125 737.593 78.3333 738.76 78.75C739.927 79.1667 741.656 80.0208 743.948 81.3125C746.073 82.5208 747.802 83.3542 749.135 83.8125C750.51 84.2292 752.114 84.4375 753.948 84.4375C756.573 84.4375 758.427 84.0417 759.51 83.25C760.635 82.4167 761.198 81.0625 761.198 79.1875C761.198 77.3958 759.427 75.7292 755.885 74.1875C753.635 73.1875 749.739 71.5417 744.198 69.25C739.239 67.2083 735.489 64.6875 732.948 61.6875C730.448 58.6875 729.198 55.0833 729.198 50.875C729.198 46.7917 730.26 43.1042 732.385 39.8125C734.51 36.5208 737.468 33.9375 741.26 32.0625C744.885 30.2708 749.198 29.375 754.198 29.375C757.864 29.375 761.448 29.9167 764.948 31C768.448 32.0833 771.323 33.5625 773.573 35.4375C775.989 37.4792 777.198 39.8958 777.198 42.6875Z"
                                    fill="currentColor"
                                  />
                                  <path
                                    d="M37 90L60 90"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeWidth={23}
                                  />
                                  <path
                                    d="M12 58L43 58"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeWidth={23}
                                  />
                                  <path
                                    d="M32 25L48 25"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeWidth={23}
                                  />
                                </svg>
                                <div
                                  aria-label="5 out of 5 stars"
                                  className="flex flex-row text-primary-900 dark:text-primary-300"
                                  role="img"
                                >
                                  <svg
                                    aria-hidden="true"
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    data-slot="icon"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      clipRule="evenodd"
                                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                      fillRule="evenodd"
                                    />
                                  </svg>
                                  <svg
                                    aria-hidden="true"
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    data-slot="icon"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      clipRule="evenodd"
                                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                      fillRule="evenodd"
                                    />
                                  </svg>
                                  <svg
                                    aria-hidden="true"
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    data-slot="icon"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      clipRule="evenodd"
                                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                      fillRule="evenodd"
                                    />
                                  </svg>
                                  <svg
                                    aria-hidden="true"
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    data-slot="icon"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      clipRule="evenodd"
                                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                      fillRule="evenodd"
                                    />
                                  </svg>
                                  <svg
                                    aria-hidden="true"
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    data-slot="icon"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      clipRule="evenodd"
                                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                      fillRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-col gap-2" lang="en">
                            <p
                              className="text-sm leading-relaxed break-words line-clamp-4"
                              id="_r_e_"
                            >
                              Worked exactly as advertised. As soon as payment
                              cleared (5min) the PIN &amp; Serial were
                              immediately delivered via email. Will definitely
                              use again.
                            </p>
                            <div className="-mx-2 mt-auto flex flex-wrap items-center gap-x-1 gap-y-1 pt-1 text-xs" />
                          </div>
                        </article>
                      </div>
                      <div className="grid w-74 shrink-0 no-underline last:mr-32 sm:w-81">
                        <article className="flex w-full flex-col rounded-2xl p-5 ring-1 ring-gray-200 transition ring-inset dark:ring-gray-800">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <span
                                aria-hidden="true"
                                className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-900 dark:bg-primary-900/30 dark:text-primary-200"
                              >
                                KN
                              </span>
                              <div className="flex min-w-0 flex-col">
                                <div className="flex min-w-0 items-center gap-1">
                                  <p className="min-w-0 truncate text-sm font-semibold">
                                    karlapudi naresh
                                  </p>
                                </div>
                                <time
                                  className="text-xs text-gray-500 dark:text-gray-400"
                                  dateTime="2026-06-10"
                                >
                                  Jun 9, 2026
                                </time>
                              </div>
                            </div>
                            <div className="flex flex-none flex-col items-end">
                              <div className="flex flex-col items-end">
                                <svg
                                  className="h-5 w-auto flex-none"
                                  viewBox="0 0 1132.8 278.2"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M297.7 98.6h114.7V120h-45.1v120.3h-24.8V120h-44.9V98.6zm109.8 39.1h21.2v19.8h.4c.7-2.8 2-5.5 3.9-8.1 1.9-2.6 4.2-5.1 6.9-7.2 2.7-2.2 5.7-3.9 9-5.3 3.3-1.3 6.7-2 10.1-2 2.6 0 4.5.1 5.5.2s2 .3 3.1.4v21.8c-1.6-.3-3.2-.5-4.9-.7-1.7-.2-3.3-.3-4.9-.3-3.8 0-7.4.8-10.8 2.3-3.4 1.5-6.3 3.8-8.8 6.7-2.5 3-4.5 6.6-6 11s-2.2 9.4-2.2 15.1v48.8h-22.6V137.7zm164 102.6h-22.2V226h-.4c-2.8 5.2-6.9 9.3-12.4 12.4-5.5 3.1-11.1 4.7-16.8 4.7-13.5 0-23.3-3.3-29.3-10s-9-16.8-9-30.3v-65.1H504v62.9c0 9 1.7 15.4 5.2 19.1 3.4 3.7 8.3 5.6 14.5 5.6 4.8 0 8.7-.7 11.9-2.2 3.2-1.5 5.8-3.4 7.7-5.9 2-2.4 3.4-5.4 4.3-8.8.9-3.4 1.3-7.1 1.3-11.1v-59.5h22.6v102.5zm38.5-32.9c.7 6.6 3.2 11.2 7.5 13.9 4.4 2.6 9.6 4 15.7 4 2.1 0 4.5-.2 7.2-.5s5.3-1 7.6-1.9c2.4-.9 4.3-2.3 5.9-4.1 1.5-1.8 2.2-4.1 2.1-7-.1-2.9-1.2-5.3-3.2-7.1-2-1.9-4.5-3.3-7.6-4.5-3.1-1.1-6.6-2.1-10.6-2.9-4-.8-8-1.7-12.1-2.6-4.2-.9-8.3-2.1-12.2-3.4-3.9-1.3-7.4-3.1-10.5-5.4-3.1-2.2-5.6-5.1-7.4-8.6-1.9-3.5-2.8-7.8-2.8-13 0-5.6 1.4-10.2 4.1-14 2.7-3.8 6.2-6.8 10.3-9.1 4.2-2.3 8.8-3.9 13.9-4.9 5.1-.9 10-1.4 14.6-1.4 5.3 0 10.4.6 15.2 1.7 4.8 1.1 9.2 2.9 13.1 5.5 3.9 2.5 7.1 5.8 9.7 9.8 2.6 4 4.2 8.9 4.9 14.6h-23.6c-1.1-5.4-3.5-9.1-7.4-10.9-3.9-1.9-8.4-2.8-13.4-2.8-1.6 0-3.5.1-5.7.4-2.2.3-4.2.8-6.2 1.5-1.9.7-3.5 1.8-4.9 3.2-1.3 1.4-2 3.2-2 5.5 0 2.8 1 5 2.9 6.7 1.9 1.7 4.4 3.1 7.5 4.3 3.1 1.1 6.6 2.1 10.6 2.9 4 .8 8.1 1.7 12.3 2.6 4.1.9 8.1 2.1 12.1 3.4 4 1.3 7.5 3.1 10.6 5.4 3.1 2.3 5.6 5.1 7.5 8.5 1.9 3.4 2.9 7.7 2.9 12.7 0 6.1-1.4 11.2-4.2 15.5-2.8 4.2-6.4 7.7-10.8 10.3-4.4 2.6-9.4 4.6-14.8 5.8-5.4 1.2-10.8 1.8-16.1 1.8-6.5 0-12.5-.7-18-2.2-5.5-1.5-10.3-3.7-14.3-6.6-4-3-7.2-6.7-9.5-11.1-2.3-4.4-3.5-9.7-3.7-15.8H610zm74.6-69.7h17.1v-30.8h22.6v30.8h20.4v16.9h-20.4v54.8c0 2.4.1 4.4.3 6.2.2 1.7.7 3.2 1.4 4.4.7 1.2 1.8 2.1 3.3 2.7 1.5.6 3.4.9 6 .9 1.6 0 3.2 0 4.8-.1 1.6-.1 3.2-.3 4.8-.7v17.5c-2.5.3-5 .5-7.3.8-2.4.3-4.8.4-7.3.4-6 0-10.8-.6-14.4-1.7-3.6-1.1-6.5-2.8-8.5-5-2.1-2.2-3.4-4.9-4.2-8.2-.7-3.3-1.2-7.1-1.3-11.3v-60.5h-17.1v-17.1zm76.1 0h21.4v13.9h.4c3.2-6 7.6-10.2 13.3-12.8 5.7-2.6 11.8-3.9 18.5-3.9 8.1 0 15.1 1.4 21.1 4.3 6 2.8 11 6.7 15 11.7 4 5 6.9 10.8 8.9 17.4 2 6.6 3 13.7 3 21.2 0 6.9-.9 13.6-2.7 20-1.8 6.5-4.5 12.2-8.1 17.2-3.6 5-8.2 8.9-13.8 11.9-5.6 3-12.1 4.5-19.7 4.5-3.3 0-6.6-.3-9.9-.9-3.3-.6-6.5-1.6-9.5-2.9-3-1.3-5.9-3-8.4-5.1-2.6-2.1-4.7-4.5-6.5-7.2h-.4v51.2h-22.6V137.7zm79 51.4c0-4.6-.6-9.1-1.8-13.5-1.2-4.4-3-8.2-5.4-11.6-2.4-3.4-5.4-6.1-8.9-8.1-3.6-2-7.7-3.1-12.3-3.1-9.5 0-16.7 3.3-21.5 9.9-4.8 6.6-7.2 15.4-7.2 26.4 0 5.2.6 10 1.9 14.4 1.3 4.4 3.1 8.2 5.7 11.4 2.5 3.2 5.5 5.7 9 7.5 3.5 1.9 7.6 2.8 12.2 2.8 5.2 0 9.5-1.1 13.1-3.2 3.6-2.1 6.5-4.9 8.8-8.2 2.3-3.4 4-7.2 5-11.5.9-4.3 1.4-8.7 1.4-13.2zm39.9-90.5h22.6V120h-22.6V98.6zm0 39.1h22.6v102.6h-22.6V137.7zm42.8-39.1H945v141.7h-22.6V98.6zm91.9 144.5c-8.2 0-15.5-1.4-21.9-4.1-6.4-2.7-11.8-6.5-16.3-11.2-4.4-4.8-7.8-10.5-10.1-17.1-2.3-6.6-3.5-13.9-3.5-21.8 0-7.8 1.2-15 3.5-21.6 2.3-6.6 5.7-12.3 10.1-17.1 4.4-4.8 9.9-8.5 16.3-11.2 6.4-2.7 13.7-4.1 21.9-4.1s15.5 1.4 21.9 4.1c6.4 2.7 11.8 6.5 16.3 11.2 4.4 4.8 7.8 10.5 10.1 17.1 2.3 6.6 3.5 13.8 3.5 21.6 0 7.9-1.2 15.2-3.5 21.8-2.3 6.6-5.7 12.3-10.1 17.1-4.4 4.8-9.9 8.5-16.3 11.2-6.4 2.7-13.7 4.1-21.9 4.1zm0-17.9c5 0 9.4-1.1 13.1-3.2 3.7-2.1 6.7-4.9 9.1-8.3 2.4-3.4 4.1-7.3 5.3-11.6 1.1-4.3 1.7-8.7 1.7-13.2 0-4.4-.6-8.7-1.7-13.1s-2.9-8.2-5.3-11.6c-2.4-3.4-5.4-6.1-9.1-8.2-3.7-2.1-8.1-3.2-13.1-3.2s-9.4 1.1-13.1 3.2c-3.7 2.1-6.7 4.9-9.1 8.2-2.4 3.4-4.1 7.2-5.3 11.6-1.1 4.4-1.7 8.7-1.7 13.1 0 4.5.6 8.9 1.7 13.2 1.1 4.3 2.9 8.2 5.3 11.6 2.4 3.4 5.4 6.2 9.1 8.3 3.7 2.2 8.1 3.2 13.1 3.2zm58.4-87.5h17.1v-30.8h22.6v30.8h20.4v16.9h-20.4v54.8c0 2.4.1 4.4.3 6.2.2 1.7.7 3.2 1.4 4.4.7 1.2 1.8 2.1 3.3 2.7 1.5.6 3.4.9 6 .9 1.6 0 3.2 0 4.8-.1 1.6-.1 3.2-.3 4.8-.7v17.5c-2.5.3-5 .5-7.3.8-2.4.3-4.8.4-7.3.4-6 0-10.8-.6-14.4-1.7-3.6-1.1-6.5-2.8-8.5-5-2.1-2.2-3.4-4.9-4.2-8.2-.7-3.3-1.2-7.1-1.3-11.3v-60.5h-17.1v-17.1z"
                                    fill="currentColor"
                                  />
                                  <path
                                    d="M271.3 98.6H167.7L135.7 0l-32.1 98.6L0 98.5l83.9 61L51.8 258l83.9-60.9 83.8 60.9-32-98.5 83.8-60.9z"
                                    fill="#00b67a"
                                  />
                                  <path
                                    d="M194.7 181.8l-7.2-22.3-51.8 37.6z"
                                    fill="#005128"
                                  />
                                </svg>
                                <div className="flex flex-row text-trustpilot-green">
                                  <svg
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    fill="none"
                                    height={96}
                                    viewBox="0 0 96 96"
                                    width={96}
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M96 0H0V96H96V0Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M48.0004 64.7002L62.6004 61.0002L68.7004 79.8002L48.0004 64.7002ZM81.6004 40.4002H55.9004L48.0004 16.2002L40.1004 40.4002H14.4004L35.2004 55.4002L27.3004 79.6002L48.1004 64.6002L60.9004 55.4002L81.6004 40.4002Z"
                                      fill="white"
                                    />
                                  </svg>
                                  <svg
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    fill="none"
                                    height={96}
                                    viewBox="0 0 96 96"
                                    width={96}
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M96 0H0V96H96V0Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M48.0004 64.7002L62.6004 61.0002L68.7004 79.8002L48.0004 64.7002ZM81.6004 40.4002H55.9004L48.0004 16.2002L40.1004 40.4002H14.4004L35.2004 55.4002L27.3004 79.6002L48.1004 64.6002L60.9004 55.4002L81.6004 40.4002Z"
                                      fill="white"
                                    />
                                  </svg>
                                  <svg
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    fill="none"
                                    height={96}
                                    viewBox="0 0 96 96"
                                    width={96}
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M96 0H0V96H96V0Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M48.0004 64.7002L62.6004 61.0002L68.7004 79.8002L48.0004 64.7002ZM81.6004 40.4002H55.9004L48.0004 16.2002L40.1004 40.4002H14.4004L35.2004 55.4002L27.3004 79.6002L48.1004 64.6002L60.9004 55.4002L81.6004 40.4002Z"
                                      fill="white"
                                    />
                                  </svg>
                                  <svg
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    fill="none"
                                    height={96}
                                    viewBox="0 0 96 96"
                                    width={96}
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M96 0H0V96H96V0Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M48.0004 64.7002L62.6004 61.0002L68.7004 79.8002L48.0004 64.7002ZM81.6004 40.4002H55.9004L48.0004 16.2002L40.1004 40.4002H14.4004L35.2004 55.4002L27.3004 79.6002L48.1004 64.6002L60.9004 55.4002L81.6004 40.4002Z"
                                      fill="white"
                                    />
                                  </svg>
                                  <svg
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    fill="none"
                                    height={96}
                                    viewBox="0 0 96 96"
                                    width={96}
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M96 0H0V96H96V0Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M48.0004 64.7002L62.6004 61.0002L68.7004 79.8002L48.0004 64.7002ZM81.6004 40.4002H55.9004L48.0004 16.2002L40.1004 40.4002H14.4004L35.2004 55.4002L27.3004 79.6002L48.1004 64.6002L60.9004 55.4002L81.6004 40.4002Z"
                                      fill="white"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-col gap-2" lang="en">
                            <p
                              className="text-sm leading-relaxed break-words line-clamp-4"
                              id="_r_f_"
                            >
                              I recently ordered a Big Basket gift vouchers on
                              Mad Deals the process was super simple. I just
                              had to choose a crypto which was fast and voucher
                              was delivered to me in a minute ❤️🖤
                            </p>
                            <div className="-mx-2 mt-auto flex flex-wrap items-center gap-x-1 gap-y-1 pt-1 text-xs" />
                          </div>
                        </article>
                      </div>
                      <div className="grid w-74 shrink-0 no-underline last:mr-32 sm:w-81">
                        <article className="flex w-full flex-col rounded-2xl p-5 ring-1 ring-gray-200 transition ring-inset dark:ring-gray-800">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <span
                                aria-hidden="true"
                                className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-900 dark:bg-primary-900/30 dark:text-primary-200"
                              >
                                PK
                              </span>
                              <div className="flex min-w-0 flex-col">
                                <div className="flex min-w-0 items-center gap-1">
                                  <p className="min-w-0 truncate text-sm font-semibold">
                                    Pavan Kumar
                                  </p>
                                </div>
                                <time
                                  className="text-xs text-gray-500 dark:text-gray-400"
                                  dateTime="2026-06-10"
                                >
                                  Jun 9, 2026
                                </time>
                              </div>
                            </div>
                            <div className="flex flex-none flex-col items-end">
                              <div className="flex flex-col items-end">
                                <svg
                                  className="h-5 w-auto flex-none"
                                  viewBox="0 0 1132.8 278.2"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M297.7 98.6h114.7V120h-45.1v120.3h-24.8V120h-44.9V98.6zm109.8 39.1h21.2v19.8h.4c.7-2.8 2-5.5 3.9-8.1 1.9-2.6 4.2-5.1 6.9-7.2 2.7-2.2 5.7-3.9 9-5.3 3.3-1.3 6.7-2 10.1-2 2.6 0 4.5.1 5.5.2s2 .3 3.1.4v21.8c-1.6-.3-3.2-.5-4.9-.7-1.7-.2-3.3-.3-4.9-.3-3.8 0-7.4.8-10.8 2.3-3.4 1.5-6.3 3.8-8.8 6.7-2.5 3-4.5 6.6-6 11s-2.2 9.4-2.2 15.1v48.8h-22.6V137.7zm164 102.6h-22.2V226h-.4c-2.8 5.2-6.9 9.3-12.4 12.4-5.5 3.1-11.1 4.7-16.8 4.7-13.5 0-23.3-3.3-29.3-10s-9-16.8-9-30.3v-65.1H504v62.9c0 9 1.7 15.4 5.2 19.1 3.4 3.7 8.3 5.6 14.5 5.6 4.8 0 8.7-.7 11.9-2.2 3.2-1.5 5.8-3.4 7.7-5.9 2-2.4 3.4-5.4 4.3-8.8.9-3.4 1.3-7.1 1.3-11.1v-59.5h22.6v102.5zm38.5-32.9c.7 6.6 3.2 11.2 7.5 13.9 4.4 2.6 9.6 4 15.7 4 2.1 0 4.5-.2 7.2-.5s5.3-1 7.6-1.9c2.4-.9 4.3-2.3 5.9-4.1 1.5-1.8 2.2-4.1 2.1-7-.1-2.9-1.2-5.3-3.2-7.1-2-1.9-4.5-3.3-7.6-4.5-3.1-1.1-6.6-2.1-10.6-2.9-4-.8-8-1.7-12.1-2.6-4.2-.9-8.3-2.1-12.2-3.4-3.9-1.3-7.4-3.1-10.5-5.4-3.1-2.2-5.6-5.1-7.4-8.6-1.9-3.5-2.8-7.8-2.8-13 0-5.6 1.4-10.2 4.1-14 2.7-3.8 6.2-6.8 10.3-9.1 4.2-2.3 8.8-3.9 13.9-4.9 5.1-.9 10-1.4 14.6-1.4 5.3 0 10.4.6 15.2 1.7 4.8 1.1 9.2 2.9 13.1 5.5 3.9 2.5 7.1 5.8 9.7 9.8 2.6 4 4.2 8.9 4.9 14.6h-23.6c-1.1-5.4-3.5-9.1-7.4-10.9-3.9-1.9-8.4-2.8-13.4-2.8-1.6 0-3.5.1-5.7.4-2.2.3-4.2.8-6.2 1.5-1.9.7-3.5 1.8-4.9 3.2-1.3 1.4-2 3.2-2 5.5 0 2.8 1 5 2.9 6.7 1.9 1.7 4.4 3.1 7.5 4.3 3.1 1.1 6.6 2.1 10.6 2.9 4 .8 8.1 1.7 12.3 2.6 4.1.9 8.1 2.1 12.1 3.4 4 1.3 7.5 3.1 10.6 5.4 3.1 2.3 5.6 5.1 7.5 8.5 1.9 3.4 2.9 7.7 2.9 12.7 0 6.1-1.4 11.2-4.2 15.5-2.8 4.2-6.4 7.7-10.8 10.3-4.4 2.6-9.4 4.6-14.8 5.8-5.4 1.2-10.8 1.8-16.1 1.8-6.5 0-12.5-.7-18-2.2-5.5-1.5-10.3-3.7-14.3-6.6-4-3-7.2-6.7-9.5-11.1-2.3-4.4-3.5-9.7-3.7-15.8H610zm74.6-69.7h17.1v-30.8h22.6v30.8h20.4v16.9h-20.4v54.8c0 2.4.1 4.4.3 6.2.2 1.7.7 3.2 1.4 4.4.7 1.2 1.8 2.1 3.3 2.7 1.5.6 3.4.9 6 .9 1.6 0 3.2 0 4.8-.1 1.6-.1 3.2-.3 4.8-.7v17.5c-2.5.3-5 .5-7.3.8-2.4.3-4.8.4-7.3.4-6 0-10.8-.6-14.4-1.7-3.6-1.1-6.5-2.8-8.5-5-2.1-2.2-3.4-4.9-4.2-8.2-.7-3.3-1.2-7.1-1.3-11.3v-60.5h-17.1v-17.1zm76.1 0h21.4v13.9h.4c3.2-6 7.6-10.2 13.3-12.8 5.7-2.6 11.8-3.9 18.5-3.9 8.1 0 15.1 1.4 21.1 4.3 6 2.8 11 6.7 15 11.7 4 5 6.9 10.8 8.9 17.4 2 6.6 3 13.7 3 21.2 0 6.9-.9 13.6-2.7 20-1.8 6.5-4.5 12.2-8.1 17.2-3.6 5-8.2 8.9-13.8 11.9-5.6 3-12.1 4.5-19.7 4.5-3.3 0-6.6-.3-9.9-.9-3.3-.6-6.5-1.6-9.5-2.9-3-1.3-5.9-3-8.4-5.1-2.6-2.1-4.7-4.5-6.5-7.2h-.4v51.2h-22.6V137.7zm79 51.4c0-4.6-.6-9.1-1.8-13.5-1.2-4.4-3-8.2-5.4-11.6-2.4-3.4-5.4-6.1-8.9-8.1-3.6-2-7.7-3.1-12.3-3.1-9.5 0-16.7 3.3-21.5 9.9-4.8 6.6-7.2 15.4-7.2 26.4 0 5.2.6 10 1.9 14.4 1.3 4.4 3.1 8.2 5.7 11.4 2.5 3.2 5.5 5.7 9 7.5 3.5 1.9 7.6 2.8 12.2 2.8 5.2 0 9.5-1.1 13.1-3.2 3.6-2.1 6.5-4.9 8.8-8.2 2.3-3.4 4-7.2 5-11.5.9-4.3 1.4-8.7 1.4-13.2zm39.9-90.5h22.6V120h-22.6V98.6zm0 39.1h22.6v102.6h-22.6V137.7zm42.8-39.1H945v141.7h-22.6V98.6zm91.9 144.5c-8.2 0-15.5-1.4-21.9-4.1-6.4-2.7-11.8-6.5-16.3-11.2-4.4-4.8-7.8-10.5-10.1-17.1-2.3-6.6-3.5-13.9-3.5-21.8 0-7.8 1.2-15 3.5-21.6 2.3-6.6 5.7-12.3 10.1-17.1 4.4-4.8 9.9-8.5 16.3-11.2 6.4-2.7 13.7-4.1 21.9-4.1s15.5 1.4 21.9 4.1c6.4 2.7 11.8 6.5 16.3 11.2 4.4 4.8 7.8 10.5 10.1 17.1 2.3 6.6 3.5 13.8 3.5 21.6 0 7.9-1.2 15.2-3.5 21.8-2.3 6.6-5.7 12.3-10.1 17.1-4.4 4.8-9.9 8.5-16.3 11.2-6.4 2.7-13.7 4.1-21.9 4.1zm0-17.9c5 0 9.4-1.1 13.1-3.2 3.7-2.1 6.7-4.9 9.1-8.3 2.4-3.4 4.1-7.3 5.3-11.6 1.1-4.3 1.7-8.7 1.7-13.2 0-4.4-.6-8.7-1.7-13.1s-2.9-8.2-5.3-11.6c-2.4-3.4-5.4-6.1-9.1-8.2-3.7-2.1-8.1-3.2-13.1-3.2s-9.4 1.1-13.1 3.2c-3.7 2.1-6.7 4.9-9.1 8.2-2.4 3.4-4.1 7.2-5.3 11.6-1.1 4.4-1.7 8.7-1.7 13.1 0 4.5.6 8.9 1.7 13.2 1.1 4.3 2.9 8.2 5.3 11.6 2.4 3.4 5.4 6.2 9.1 8.3 3.7 2.2 8.1 3.2 13.1 3.2zm58.4-87.5h17.1v-30.8h22.6v30.8h20.4v16.9h-20.4v54.8c0 2.4.1 4.4.3 6.2.2 1.7.7 3.2 1.4 4.4.7 1.2 1.8 2.1 3.3 2.7 1.5.6 3.4.9 6 .9 1.6 0 3.2 0 4.8-.1 1.6-.1 3.2-.3 4.8-.7v17.5c-2.5.3-5 .5-7.3.8-2.4.3-4.8.4-7.3.4-6 0-10.8-.6-14.4-1.7-3.6-1.1-6.5-2.8-8.5-5-2.1-2.2-3.4-4.9-4.2-8.2-.7-3.3-1.2-7.1-1.3-11.3v-60.5h-17.1v-17.1z"
                                    fill="currentColor"
                                  />
                                  <path
                                    d="M271.3 98.6H167.7L135.7 0l-32.1 98.6L0 98.5l83.9 61L51.8 258l83.9-60.9 83.8 60.9-32-98.5 83.8-60.9z"
                                    fill="#00b67a"
                                  />
                                  <path
                                    d="M194.7 181.8l-7.2-22.3-51.8 37.6z"
                                    fill="#005128"
                                  />
                                </svg>
                                <div className="flex flex-row text-trustpilot-green">
                                  <svg
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    fill="none"
                                    height={96}
                                    viewBox="0 0 96 96"
                                    width={96}
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M96 0H0V96H96V0Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M48.0004 64.7002L62.6004 61.0002L68.7004 79.8002L48.0004 64.7002ZM81.6004 40.4002H55.9004L48.0004 16.2002L40.1004 40.4002H14.4004L35.2004 55.4002L27.3004 79.6002L48.1004 64.6002L60.9004 55.4002L81.6004 40.4002Z"
                                      fill="white"
                                    />
                                  </svg>
                                  <svg
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    fill="none"
                                    height={96}
                                    viewBox="0 0 96 96"
                                    width={96}
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M96 0H0V96H96V0Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M48.0004 64.7002L62.6004 61.0002L68.7004 79.8002L48.0004 64.7002ZM81.6004 40.4002H55.9004L48.0004 16.2002L40.1004 40.4002H14.4004L35.2004 55.4002L27.3004 79.6002L48.1004 64.6002L60.9004 55.4002L81.6004 40.4002Z"
                                      fill="white"
                                    />
                                  </svg>
                                  <svg
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    fill="none"
                                    height={96}
                                    viewBox="0 0 96 96"
                                    width={96}
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M96 0H0V96H96V0Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M48.0004 64.7002L62.6004 61.0002L68.7004 79.8002L48.0004 64.7002ZM81.6004 40.4002H55.9004L48.0004 16.2002L40.1004 40.4002H14.4004L35.2004 55.4002L27.3004 79.6002L48.1004 64.6002L60.9004 55.4002L81.6004 40.4002Z"
                                      fill="white"
                                    />
                                  </svg>
                                  <svg
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    fill="none"
                                    height={96}
                                    viewBox="0 0 96 96"
                                    width={96}
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M96 0H0V96H96V0Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M48.0004 64.7002L62.6004 61.0002L68.7004 79.8002L48.0004 64.7002ZM81.6004 40.4002H55.9004L48.0004 16.2002L40.1004 40.4002H14.4004L35.2004 55.4002L27.3004 79.6002L48.1004 64.6002L60.9004 55.4002L81.6004 40.4002Z"
                                      fill="white"
                                    />
                                  </svg>
                                  <svg
                                    className="mt-1 mr-0.5 h-4 w-4"
                                    fill="none"
                                    height={96}
                                    viewBox="0 0 96 96"
                                    width={96}
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M96 0H0V96H96V0Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M48.0004 64.7002L62.6004 61.0002L68.7004 79.8002L48.0004 64.7002ZM81.6004 40.4002H55.9004L48.0004 16.2002L40.1004 40.4002H14.4004L35.2004 55.4002L27.3004 79.6002L48.1004 64.6002L60.9004 55.4002L81.6004 40.4002Z"
                                      fill="white"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-col gap-2" lang="en">
                            <p
                              className="text-sm leading-relaxed break-words line-clamp-4"
                              id="_r_g_"
                            >
                              I bought a Vijay Sales Offline gift card today on
                              crypto refills. The process of buying and payment
                              is very hassle free. I'll definitely choose crypto
                              refills next time.
                            </p>
                            <div className="-mx-2 mt-auto flex flex-wrap items-center gap-x-1 gap-y-1 pt-1 text-xs" />
                          </div>
                        </article>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="mx-auto max-w-(--breakpoint-2xl)">
                  <div className="mt-7 flex flex-row justify-between px-3 sm:mt-9 md:mr-32">
                    <div className="flex flex-col">
                      <h2 className="text-xl font-semibold sm:text-2xl">
                        Ecommerce gift cards
                      </h2>
                      <span className="text-gray-700 dark:text-gray-400">
                        Buy yourself something nice.
                      </span>
                    </div>
                    <div className="flex flex-row pt-6">
                      <span className="text-base font-semibold whitespace-nowrap underline underline-offset-4">
                        <a className href="#">
                          See all
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mx-auto hidden w-full max-w-(--breakpoint-2xl) md:block">
                  <div className="flex-end -mt-12 flex justify-end space-x-3 pr-3 2xl:pr-0 pointer-events-none">
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition duration-200 ease-in-out dark:bg-gray-800 pointer-events-none cursor-auto opacity-0">
                      <svg
                        aria-hidden="true"
                        className="h-10 w-10 text-gray-500 dark:text-gray-100"
                        data-slot="icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition duration-200 ease-in-out dark:bg-gray-800 cursor-pointer opacity-100">
                      <svg
                        aria-hidden="true"
                        className="h-10 w-10 text-gray-500 dark:text-gray-100"
                        data-slot="icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="relative w-full">
                  <div className="mt-3 no-scrollbar flex w-full gap-4 overflow-x-auto scroll-smooth pt-3 sm:gap-6 sm:pr-20 xl:gap-6 scroll-pl-2xl">
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Everything Apple"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/everything-apple_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Everything Apple"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Everything Apple</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $10 - $500
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Amazon.com"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/amazon-com_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Amazon.com"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Amazon.com</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $10 - $500
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Walmart"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/walmart_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/walmart_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/walmart_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/walmart_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/walmart_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/walmart_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/walmart_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/walmart_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/walmart_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/walmart_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/walmart_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/walmart_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/walmart_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/walmart_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/walmart_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/walmart_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Walmart"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Walmart</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $5 - $500
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="eBay"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/ebay_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/ebay_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/ebay_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/ebay_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/ebay_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/ebay_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/ebay_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/ebay_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/ebay_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/ebay_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/ebay_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/ebay_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/ebay_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/ebay_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/ebay_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/ebay_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="eBay"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">eBay</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $25 - $200
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Razer Gold USD"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/razer-gold_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/razer-gold_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/razer-gold_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/razer-gold_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/razer-gold_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/razer-gold_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/razer-gold_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/razer-gold_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/razer-gold_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/razer-gold_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/razer-gold_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/razer-gold_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/razer-gold_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/razer-gold_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/razer-gold_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/razer-gold_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Razer Gold USD"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Razer Gold USD</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $10 - $500
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Best Buy"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/best-buy_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Best Buy"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Best Buy</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $5 - $500
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="mx-auto max-w-(--breakpoint-2xl)">
                  <div className="mt-7 flex flex-row justify-between px-3 sm:mt-9 md:mr-32">
                    <div className="flex flex-col">
                      <h2 className="text-xl font-semibold sm:text-2xl">
                        Electronics gift cards
                      </h2>
                      <span className="text-gray-700 dark:text-gray-400">
                        Beep boop beeb.
                      </span>
                    </div>
                    <div className="flex flex-row pt-6">
                      <span className="text-base font-semibold whitespace-nowrap underline underline-offset-4">
                        <a className href="#">
                          See all
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mx-auto hidden w-full max-w-(--breakpoint-2xl) md:block">
                  <div className="flex-end -mt-12 flex justify-end space-x-3 pr-3 2xl:pr-0 pointer-events-none">
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition duration-200 ease-in-out dark:bg-gray-800 pointer-events-none cursor-auto opacity-0">
                      <svg
                        aria-hidden="true"
                        className="h-10 w-10 text-gray-500 dark:text-gray-100"
                        data-slot="icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition duration-200 ease-in-out dark:bg-gray-800 cursor-pointer opacity-100">
                      <svg
                        aria-hidden="true"
                        className="h-10 w-10 text-gray-500 dark:text-gray-100"
                        data-slot="icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="relative w-full">
                  <div className="mt-3 no-scrollbar flex w-full gap-4 overflow-x-auto scroll-smooth pt-3 sm:gap-6 sm:pr-20 xl:gap-6 scroll-pl-2xl">
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Target"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/target_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/target_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/target_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/target_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/target_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/target_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/target_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/target_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/target_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/target_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/target_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/target_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/target_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/target_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/target_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/target_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Target"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Target</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $2 - $500
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Sam's Club"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/sams-club_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/sams-club_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/sams-club_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/sams-club_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/sams-club_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/sams-club_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/sams-club_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/sams-club_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/sams-club_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/sams-club_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/sams-club_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/sams-club_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/sams-club_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/sams-club_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/sams-club_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/sams-club_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Sam's Club"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Sam's Club</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $5 - $500
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="NordVPN"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/nord-vpn_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/nord-vpn_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/nord-vpn_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/nord-vpn_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/nord-vpn_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/nord-vpn_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/nord-vpn_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/nord-vpn_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/nord-vpn_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/nord-vpn_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/nord-vpn_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/nord-vpn_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/nord-vpn_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/nord-vpn_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/nord-vpn_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/nord-vpn_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="NordVPN"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">NordVPN</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $11.99 - $78.99
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Dicks Sporting Goods"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/dicks-sporting-goods_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/dicks-sporting-goods_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/dicks-sporting-goods_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/dicks-sporting-goods_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/dicks-sporting-goods_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/dicks-sporting-goods_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/dicks-sporting-goods_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/dicks-sporting-goods_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/dicks-sporting-goods_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/dicks-sporting-goods_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/dicks-sporting-goods_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/dicks-sporting-goods_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/dicks-sporting-goods_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/dicks-sporting-goods_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/dicks-sporting-goods_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/dicks-sporting-goods_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Dicks Sporting Goods"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">
                              Dicks Sporting Goods
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $25 - $500
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="NordPass"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/nordpass_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/nordpass_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/nordpass_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/nordpass_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/nordpass_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/nordpass_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/nordpass_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/nordpass_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/nordpass_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/nordpass_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/nordpass_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/nordpass_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/nordpass_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/nordpass_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/nordpass_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/nordpass_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="NordPass"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">NordPass</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            1 month - 12 months
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Kohls"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/kohls_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/kohls_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/kohls_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/kohls_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/kohls_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/kohls_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/kohls_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/kohls_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/kohls_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/kohls_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/kohls_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/kohls_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/kohls_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/kohls_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/kohls_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/kohls_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Kohls"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Kohls</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $5 - $500
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="mx-auto max-w-(--breakpoint-2xl)">
                  <div className="mt-7 flex flex-row justify-between px-3 sm:mt-9 md:mr-32">
                    <div className="flex flex-col">
                      <h2 className="text-xl font-semibold sm:text-2xl">
                        Emoney gift cards
                      </h2>
                      <span className="text-gray-700 dark:text-gray-400">
                        Digital cash simplified.
                      </span>
                    </div>
                    <div className="flex flex-row pt-6">
                      <span className="text-base font-semibold whitespace-nowrap underline underline-offset-4">
                        <a className href="#">
                          See all
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mx-auto hidden w-full max-w-(--breakpoint-2xl) md:block">
                  <div className="flex-end -mt-12 flex justify-end space-x-3 pr-3 2xl:pr-0 pointer-events-none">
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition duration-200 ease-in-out dark:bg-gray-800 pointer-events-none cursor-auto opacity-0">
                      <svg
                        aria-hidden="true"
                        className="h-10 w-10 text-gray-500 dark:text-gray-100"
                        data-slot="icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition duration-200 ease-in-out dark:bg-gray-800 cursor-pointer opacity-100">
                      <svg
                        aria-hidden="true"
                        className="h-10 w-10 text-gray-500 dark:text-gray-100"
                        data-slot="icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="relative w-full">
                  <div className="mt-3 no-scrollbar flex w-full gap-4 overflow-x-auto scroll-smooth pt-3 sm:gap-6 sm:pr-20 xl:gap-6 scroll-pl-2xl">
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Rewarble VISA USD"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/rewarblevisausd_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/rewarblevisausd_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblevisausd_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblevisausd_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblevisausd_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblevisausd_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblevisausd_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblevisausd_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblevisausd_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblevisausd_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblevisausd_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblevisausd_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblevisausd_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblevisausd_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblevisausd_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblevisausd_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Rewarble VISA USD"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Rewarble VISA USD</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $30 - $1,000
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="American Express"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/american-express_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/american-express_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/american-express_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/american-express_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/american-express_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/american-express_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/american-express_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/american-express_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/american-express_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/american-express_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/american-express_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/american-express_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/american-express_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/american-express_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/american-express_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/american-express_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="American Express"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">American Express</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $5 - $2,000
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Rewarble Bank Transfer USD"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/rewarblebanktransferaud_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/rewarblebanktransferaud_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblebanktransferaud_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblebanktransferaud_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblebanktransferaud_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblebanktransferaud_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblebanktransferaud_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblebanktransferaud_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblebanktransferaud_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblebanktransferaud_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblebanktransferaud_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblebanktransferaud_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblebanktransferaud_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblebanktransferaud_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblebanktransferaud_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblebanktransferaud_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Rewarble Bank Transfer USD"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">
                              Rewarble Bank Transfer USD
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $2 - $1,000
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Venmo"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/venmo_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/venmo_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/venmo_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/venmo_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/venmo_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/venmo_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/venmo_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/venmo_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/venmo_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/venmo_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/venmo_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/venmo_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/venmo_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/venmo_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/venmo_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/venmo_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Venmo"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Venmo</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $2 - $1,000
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Rewarble Super Gift card USD"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/rewarblesupergiftcardusd_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/rewarblesupergiftcardusd_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblesupergiftcardusd_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblesupergiftcardusd_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblesupergiftcardusd_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblesupergiftcardusd_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblesupergiftcardusd_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblesupergiftcardusd_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblesupergiftcardusd_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblesupergiftcardusd_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblesupergiftcardusd_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblesupergiftcardusd_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblesupergiftcardusd_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblesupergiftcardusd_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblesupergiftcardusd_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblesupergiftcardusd_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Rewarble Super Gift card USD"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">
                              Rewarble Super Gift card USD
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $5 - $500
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Rewarble PayPal CAD"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/rewarblepaypalcad_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/rewarblepaypalcad_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblepaypalcad_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblepaypalcad_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblepaypalcad_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblepaypalcad_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblepaypalcad_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblepaypalcad_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblepaypalcad_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblepaypalcad_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblepaypalcad_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblepaypalcad_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblepaypalcad_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblepaypalcad_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblepaypalcad_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/rewarblepaypalcad_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Rewarble PayPal CAD"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">
                              Rewarble PayPal CAD
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            CA$2 - CA$1,000
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="mx-auto max-w-(--breakpoint-2xl)">
                  <div className="mt-7 flex flex-row justify-between px-3 sm:mt-9 md:mr-32">
                    <div className="flex flex-col">
                      <h2 className="text-xl font-semibold sm:text-2xl">
                        Games gift cards
                      </h2>
                      <span className="text-gray-700 dark:text-gray-400">
                        Add another one to your backlog.
                      </span>
                    </div>
                    <div className="flex flex-row pt-6">
                      <span className="text-base font-semibold whitespace-nowrap underline underline-offset-4">
                        <a className href="#">
                          See all
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mx-auto hidden w-full max-w-(--breakpoint-2xl) md:block">
                  <div className="flex-end -mt-12 flex justify-end space-x-3 pr-3 2xl:pr-0 pointer-events-none">
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition duration-200 ease-in-out dark:bg-gray-800 pointer-events-none cursor-auto opacity-0">
                      <svg
                        aria-hidden="true"
                        className="h-10 w-10 text-gray-500 dark:text-gray-100"
                        data-slot="icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition duration-200 ease-in-out dark:bg-gray-800 cursor-pointer opacity-100">
                      <svg
                        aria-hidden="true"
                        className="h-10 w-10 text-gray-500 dark:text-gray-100"
                        data-slot="icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="relative w-full">
                  <div className="mt-3 no-scrollbar flex w-full gap-4 overflow-x-auto scroll-smooth pt-3 sm:gap-6 sm:pr-20 xl:gap-6 scroll-pl-2xl">
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Roblox"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/roblox_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/roblox_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/roblox_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/roblox_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/roblox_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/roblox_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/roblox_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/roblox_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/roblox_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/roblox_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/roblox_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/roblox_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/roblox_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/roblox_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/roblox_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/roblox_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Roblox"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Roblox</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $10 - $200
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Steam"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/steam_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/steam_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/steam_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/steam_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/steam_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/steam_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/steam_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/steam_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/steam_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/steam_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/steam_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/steam_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/steam_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/steam_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/steam_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/steam_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Steam"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Steam</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $10 - $200
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="PlayStation Store"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/playstation-store_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/playstation-store_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/playstation-store_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/playstation-store_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/playstation-store_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/playstation-store_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/playstation-store_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/playstation-store_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/playstation-store_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/playstation-store_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/playstation-store_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/playstation-store_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/playstation-store_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/playstation-store_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/playstation-store_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/playstation-store_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="PlayStation Store"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">PlayStation Store</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $25 - $250
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Xbox"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/x-box_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/x-box_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/x-box_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/x-box_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/x-box_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/x-box_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/x-box_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/x-box_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/x-box_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/x-box_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/x-box_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/x-box_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/x-box_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/x-box_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/x-box_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/x-box_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Xbox"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Xbox</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $5 - $100
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Google Play"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/google-play_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/google-play_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/google-play_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/google-play_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/google-play_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/google-play_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/google-play_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/google-play_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/google-play_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/google-play_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/google-play_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/google-play_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/google-play_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/google-play_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/google-play_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/google-play_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Google Play"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Google Play</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $5 - $200
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Nintendo eShop"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-eshop_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-eshop_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-eshop_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-eshop_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-eshop_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-eshop_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-eshop_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-eshop_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-eshop_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-eshop_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-eshop_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-eshop_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-eshop_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-eshop_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-eshop_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-eshop_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Nintendo eShop"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Nintendo eShop</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $5 - $99
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="mx-auto max-w-(--breakpoint-2xl)">
                  <div className="mt-7 flex flex-row justify-between px-3 sm:mt-9 md:mr-32">
                    <div className="flex flex-col">
                      <h2 className="text-xl font-semibold sm:text-2xl">
                        Retail gift cards
                      </h2>
                      <span className="text-gray-700 dark:text-gray-400">
                        Therapy starts now.
                      </span>
                    </div>
                    <div className="flex flex-row pt-6">
                      <span className="text-base font-semibold whitespace-nowrap underline underline-offset-4">
                        <a className href="#">
                          See all
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mx-auto hidden w-full max-w-(--breakpoint-2xl) md:block">
                  <div className="flex-end -mt-12 flex justify-end space-x-3 pr-3 2xl:pr-0 pointer-events-none">
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition duration-200 ease-in-out dark:bg-gray-800 pointer-events-none cursor-auto opacity-0">
                      <svg
                        aria-hidden="true"
                        className="h-10 w-10 text-gray-500 dark:text-gray-100"
                        data-slot="icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition duration-200 ease-in-out dark:bg-gray-800 cursor-pointer opacity-100">
                      <svg
                        aria-hidden="true"
                        className="h-10 w-10 text-gray-500 dark:text-gray-100"
                        data-slot="icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="relative w-full">
                  <div className="mt-3 no-scrollbar flex w-full gap-4 overflow-x-auto scroll-smooth pt-3 sm:gap-6 sm:pr-20 xl:gap-6 scroll-pl-2xl">
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Home Depot"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/home-depot_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/home-depot_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/home-depot_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/home-depot_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/home-depot_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/home-depot_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/home-depot_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/home-depot_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/home-depot_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/home-depot_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/home-depot_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/home-depot_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/home-depot_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/home-depot_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/home-depot_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/home-depot_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Home Depot"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Home Depot</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $5 - $2,000
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Kroger"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/kroger_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/kroger_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/kroger_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/kroger_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/kroger_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/kroger_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/kroger_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/kroger_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/kroger_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/kroger_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/kroger_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/kroger_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/kroger_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/kroger_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/kroger_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/kroger_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Kroger"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Kroger</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $5 - $500
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Chevron and Texaco"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/chevron-and-texaco_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/chevron-and-texaco_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/chevron-and-texaco_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/chevron-and-texaco_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/chevron-and-texaco_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/chevron-and-texaco_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/chevron-and-texaco_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/chevron-and-texaco_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/chevron-and-texaco_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/chevron-and-texaco_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/chevron-and-texaco_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/chevron-and-texaco_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/chevron-and-texaco_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/chevron-and-texaco_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/chevron-and-texaco_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/chevron-and-texaco_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Chevron and Texaco"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Chevron and Texaco</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $10 - $500
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Victoria's Secret"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/victorias-secret_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/victorias-secret_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/victorias-secret_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/victorias-secret_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/victorias-secret_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/victorias-secret_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/victorias-secret_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/victorias-secret_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/victorias-secret_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/victorias-secret_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/victorias-secret_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/victorias-secret_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/victorias-secret_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/victorias-secret_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/victorias-secret_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/victorias-secret_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Victoria's Secret"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Victoria's Secret</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $5 - $500
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Lowe's"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/lowes_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/lowes_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/lowes_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/lowes_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/lowes_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/lowes_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/lowes_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/lowes_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/lowes_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/lowes_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/lowes_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/lowes_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/lowes_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/lowes_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/lowes_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/lowes_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Lowe's"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Lowe's</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $5 - $500
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="CVS pharmacy"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/cvs-pharmacy_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/cvs-pharmacy_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/cvs-pharmacy_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/cvs-pharmacy_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/cvs-pharmacy_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/cvs-pharmacy_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/cvs-pharmacy_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/cvs-pharmacy_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/cvs-pharmacy_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/cvs-pharmacy_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/cvs-pharmacy_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/cvs-pharmacy_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/cvs-pharmacy_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/cvs-pharmacy_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/cvs-pharmacy_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/cvs-pharmacy_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="CVS pharmacy"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">CVS pharmacy</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $5 - $500
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="mx-auto max-w-(--breakpoint-2xl)">
                  <div className="mt-7 flex flex-row justify-between px-3 sm:mt-9 md:mr-32">
                    <div className="flex flex-col">
                      <h2 className="text-xl font-semibold sm:text-2xl">
                        Travel &amp; flights gift cards
                      </h2>
                      <span className="text-gray-700 dark:text-gray-400">
                        Where to next?
                      </span>
                    </div>
                    <div className="flex flex-row pt-6">
                      <span className="text-base font-semibold whitespace-nowrap underline underline-offset-4">
                        <a className href="#">
                          See all
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mx-auto hidden w-full max-w-(--breakpoint-2xl) md:block">
                  <div className="flex-end -mt-12 flex justify-end space-x-3 pr-3 2xl:pr-0 pointer-events-none">
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition duration-200 ease-in-out dark:bg-gray-800 pointer-events-none cursor-auto opacity-0">
                      <svg
                        aria-hidden="true"
                        className="h-10 w-10 text-gray-500 dark:text-gray-100"
                        data-slot="icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition duration-200 ease-in-out dark:bg-gray-800 cursor-pointer opacity-100">
                      <svg
                        aria-hidden="true"
                        className="h-10 w-10 text-gray-500 dark:text-gray-100"
                        data-slot="icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="relative w-full">
                  <div className="mt-3 no-scrollbar flex w-full gap-4 overflow-x-auto scroll-smooth pt-3 sm:gap-6 sm:pr-20 xl:gap-6 scroll-pl-2xl">
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Uber"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/uber_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/uber_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/uber_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/uber_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/uber_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/uber_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/uber_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/uber_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/uber_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/uber_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/uber_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/uber_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/uber_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/uber_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/uber_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/uber_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Uber"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Uber</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $15 - $500
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Airbnb"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/airbnb_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Airbnb"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Airbnb</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $50 - $500
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Delta Air Lines"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/delta-air-lines_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Delta Air Lines"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Delta Air Lines</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $50 - $1,000
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Disney"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/disney_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/disney_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/disney_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/disney_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/disney_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/disney_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/disney_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/disney_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/disney_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/disney_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/disney_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/disney_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/disney_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/disney_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/disney_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/disney_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Disney"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Disney</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $15 - $500
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Lyft"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/lyft_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/lyft_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/lyft_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/lyft_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/lyft_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/lyft_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/lyft_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/lyft_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/lyft_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/lyft_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/lyft_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/lyft_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/lyft_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/lyft_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/lyft_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/lyft_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Lyft"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Lyft</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $25 - $200
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Royal Caribbean"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/royal-caribbean_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/royal-caribbean_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/royal-caribbean_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/royal-caribbean_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/royal-caribbean_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/royal-caribbean_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/royal-caribbean_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/royal-caribbean_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/royal-caribbean_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/royal-caribbean_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/royal-caribbean_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/royal-caribbean_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/royal-caribbean_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/royal-caribbean_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/royal-caribbean_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/royal-caribbean_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Royal Caribbean"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Royal Caribbean</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $50 - $2,000
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="mx-auto max-w-(--breakpoint-2xl)">
                  <div className="mt-7 flex flex-row justify-between px-3 sm:mt-9 md:mr-32">
                    <div className="flex flex-col">
                      <h2 className="text-xl font-semibold sm:text-2xl">
                        Food gift cards
                      </h2>
                      <span className="text-gray-700 dark:text-gray-400">
                        Nom Nom Nom!
                      </span>
                    </div>
                    <div className="flex flex-row pt-6">
                      <span className="text-base font-semibold whitespace-nowrap underline underline-offset-4">
                        <a className href="#">
                          See all
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mx-auto hidden w-full max-w-(--breakpoint-2xl) md:block">
                  <div className="flex-end -mt-12 flex justify-end space-x-3 pr-3 2xl:pr-0 pointer-events-none">
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition duration-200 ease-in-out dark:bg-gray-800 pointer-events-none cursor-auto opacity-0">
                      <svg
                        aria-hidden="true"
                        className="h-10 w-10 text-gray-500 dark:text-gray-100"
                        data-slot="icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition duration-200 ease-in-out dark:bg-gray-800 cursor-pointer opacity-100">
                      <svg
                        aria-hidden="true"
                        className="h-10 w-10 text-gray-500 dark:text-gray-100"
                        data-slot="icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="relative w-full">
                  <div className="mt-3 no-scrollbar flex w-full gap-4 overflow-x-auto scroll-smooth pt-3 sm:gap-6 sm:pr-20 xl:gap-6 scroll-pl-2xl">
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="DoorDash"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/doordash_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/doordash_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/doordash_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/doordash_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/doordash_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/doordash_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/doordash_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/doordash_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/doordash_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/doordash_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/doordash_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/doordash_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/doordash_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/doordash_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/doordash_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/doordash_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="DoorDash"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">DoorDash</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $15 - $200
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Uber Eats"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/uber-eats_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/uber-eats_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/uber-eats_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/uber-eats_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/uber-eats_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/uber-eats_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/uber-eats_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/uber-eats_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/uber-eats_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/uber-eats_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/uber-eats_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/uber-eats_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/uber-eats_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/uber-eats_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/uber-eats_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/uber-eats_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Uber Eats"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Uber Eats</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $15 - $150
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Albertsons companies"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/albertsons-companies_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/albertsons-companies_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/albertsons-companies_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/albertsons-companies_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/albertsons-companies_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/albertsons-companies_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/albertsons-companies_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/albertsons-companies_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/albertsons-companies_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/albertsons-companies_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/albertsons-companies_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/albertsons-companies_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/albertsons-companies_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/albertsons-companies_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/albertsons-companies_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/albertsons-companies_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Albertsons companies"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">
                              Albertsons companies
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $5 - $250
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Instacart"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/instacart_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/instacart_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/instacart_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/instacart_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/instacart_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/instacart_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/instacart_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/instacart_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/instacart_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/instacart_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/instacart_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/instacart_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/instacart_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/instacart_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/instacart_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/instacart_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Instacart"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Instacart</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $25 - $250
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Chipotle"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/chipotle_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/chipotle_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/chipotle_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/chipotle_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/chipotle_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/chipotle_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/chipotle_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/chipotle_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/chipotle_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/chipotle_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/chipotle_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/chipotle_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/chipotle_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/chipotle_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/chipotle_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/chipotle_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Chipotle"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Chipotle</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $5 - $250
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Papa John's"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/papa-johns_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/papa-johns_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/papa-johns_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/papa-johns_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/papa-johns_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/papa-johns_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/papa-johns_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/papa-johns_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/papa-johns_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/papa-johns_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/papa-johns_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/papa-johns_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/papa-johns_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/papa-johns_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/papa-johns_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/papa-johns_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Papa John's"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Papa John's</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $5 - $500
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="mx-auto max-w-(--breakpoint-2xl)">
                  <div className="mt-7 flex flex-row justify-between px-3 sm:mt-9 md:mr-32">
                    <div className="flex flex-col">
                      <h2 className="text-xl font-semibold sm:text-2xl">
                        Entertainment gift cards
                      </h2>
                      <span className="text-gray-700 dark:text-gray-400">
                        Boredom killers.
                      </span>
                    </div>
                    <div className="flex flex-row pt-6">
                      <span className="text-base font-semibold whitespace-nowrap underline underline-offset-4">
                        <a className href="#">
                          See all
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mx-auto hidden w-full max-w-(--breakpoint-2xl) md:block">
                  <div className="flex-end -mt-12 flex justify-end space-x-3 pr-3 2xl:pr-0 pointer-events-none">
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition duration-200 ease-in-out dark:bg-gray-800 pointer-events-none cursor-auto opacity-0">
                      <svg
                        aria-hidden="true"
                        className="h-10 w-10 text-gray-500 dark:text-gray-100"
                        data-slot="icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition duration-200 ease-in-out dark:bg-gray-800 cursor-pointer opacity-100">
                      <svg
                        aria-hidden="true"
                        className="h-10 w-10 text-gray-500 dark:text-gray-100"
                        data-slot="icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="relative w-full">
                  <div className="mt-3 no-scrollbar flex w-full gap-4 overflow-x-auto scroll-smooth pt-3 sm:gap-6 sm:pr-20 xl:gap-6 scroll-pl-2xl">
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Netflix"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/netflix_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/netflix_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/netflix_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/netflix_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/netflix_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/netflix_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/netflix_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/netflix_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/netflix_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/netflix_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/netflix_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/netflix_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/netflix_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/netflix_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/netflix_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/netflix_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Netflix"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Netflix</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $15 - $100
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="StubHub"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/stubhub_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/stubhub_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/stubhub_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/stubhub_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/stubhub_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/stubhub_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/stubhub_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/stubhub_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/stubhub_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/stubhub_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/stubhub_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/stubhub_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/stubhub_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/stubhub_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/stubhub_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/stubhub_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="StubHub"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">StubHub</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $25 - $500
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Meta Quest"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/meta-quest_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/meta-quest_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/meta-quest_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/meta-quest_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/meta-quest_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/meta-quest_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/meta-quest_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/meta-quest_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/meta-quest_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/meta-quest_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/meta-quest_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/meta-quest_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/meta-quest_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/meta-quest_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/meta-quest_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/meta-quest_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Meta Quest"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Meta Quest</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $15 - $100
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Runescape"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/runescape_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/runescape_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/runescape_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/runescape_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/runescape_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/runescape_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/runescape_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/runescape_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/runescape_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/runescape_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/runescape_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/runescape_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/runescape_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/runescape_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/runescape_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/runescape_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Runescape"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Runescape</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $10 - $25
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Free Fire"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/free-fire_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/free-fire_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/free-fire_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/free-fire_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/free-fire_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/free-fire_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/free-fire_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/free-fire_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/free-fire_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/free-fire_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/free-fire_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/free-fire_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/free-fire_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/free-fire_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/free-fire_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/free-fire_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Free Fire"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Free Fire</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            100 Diamonds - 2200 Diamonds
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Fortnite"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/fortnite_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/fortnite_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/fortnite_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/fortnite_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/fortnite_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/fortnite_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/fortnite_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/fortnite_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/fortnite_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/fortnite_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/fortnite_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/fortnite_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/fortnite_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/fortnite_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/fortnite_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/fortnite_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Fortnite"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Fortnite</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $15 - $150
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="mx-auto max-w-(--breakpoint-2xl)">
                  <div className="mt-7 flex flex-row justify-between px-3 sm:mt-9 md:mr-32">
                    <div className="flex flex-col">
                      <h2 className="text-xl font-semibold sm:text-2xl">
                        Groceries gift cards
                      </h2>
                      <span className="text-gray-700 dark:text-gray-400">
                        Fuel for humans.
                      </span>
                    </div>
                    <div className="flex flex-row pt-6">
                      <span className="text-base font-semibold whitespace-nowrap underline underline-offset-4">
                        <a className href="#">
                          See all
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mx-auto hidden w-full max-w-(--breakpoint-2xl) md:block">
                  <div className="flex-end -mt-12 flex justify-end space-x-3 pr-3 2xl:pr-0 pointer-events-none">
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition duration-200 ease-in-out dark:bg-gray-800 pointer-events-none cursor-auto opacity-0">
                      <svg
                        aria-hidden="true"
                        className="h-10 w-10 text-gray-500 dark:text-gray-100"
                        data-slot="icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition duration-200 ease-in-out dark:bg-gray-800 cursor-pointer opacity-100">
                      <svg
                        aria-hidden="true"
                        className="h-10 w-10 text-gray-500 dark:text-gray-100"
                        data-slot="icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="relative w-full">
                  <div className="mt-3 no-scrollbar flex w-full gap-4 overflow-x-auto scroll-smooth pt-3 sm:gap-6 sm:pr-20 xl:gap-6 scroll-pl-2xl">
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Safeway"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/safeway_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/safeway_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/safeway_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/safeway_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/safeway_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/safeway_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/safeway_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/safeway_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/safeway_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/safeway_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/safeway_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/safeway_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/safeway_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/safeway_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/safeway_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/safeway_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Safeway"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Safeway</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $5 - $250
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Meijer"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/meijer_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/meijer_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/meijer_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/meijer_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/meijer_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/meijer_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/meijer_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/meijer_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/meijer_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/meijer_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/meijer_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/meijer_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/meijer_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/meijer_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/meijer_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/meijer_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Meijer"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Meijer</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $5 - $1,000
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Omaha Steaks"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/omaha-steaks_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/omaha-steaks_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/omaha-steaks_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/omaha-steaks_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/omaha-steaks_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/omaha-steaks_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/omaha-steaks_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/omaha-steaks_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/omaha-steaks_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/omaha-steaks_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/omaha-steaks_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/omaha-steaks_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/omaha-steaks_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/omaha-steaks_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/omaha-steaks_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/omaha-steaks_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Omaha Steaks"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Omaha Steaks</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $15 - $200
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Giant Eagle Market District"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/giant-eagle-market-district_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/giant-eagle-market-district_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/giant-eagle-market-district_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/giant-eagle-market-district_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/giant-eagle-market-district_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/giant-eagle-market-district_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/giant-eagle-market-district_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/giant-eagle-market-district_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/giant-eagle-market-district_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/giant-eagle-market-district_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/giant-eagle-market-district_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/giant-eagle-market-district_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/giant-eagle-market-district_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/giant-eagle-market-district_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/giant-eagle-market-district_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/giant-eagle-market-district_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Giant Eagle Market District"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">
                              Giant Eagle Market District
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $25 - $100
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Shipt"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/shipt_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/shipt_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/shipt_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/shipt_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/shipt_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/shipt_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/shipt_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/shipt_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/shipt_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/shipt_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/shipt_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/shipt_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/shipt_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/shipt_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/shipt_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/shipt_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Shipt"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Shipt</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $49 - $99
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Instacart+"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/instacart-plus_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/instacart-plus_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/instacart-plus_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/instacart-plus_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/instacart-plus_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/instacart-plus_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/instacart-plus_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/instacart-plus_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/instacart-plus_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/instacart-plus_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/instacart-plus_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/instacart-plus_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/instacart-plus_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/instacart-plus_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/instacart-plus_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/instacart-plus_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Instacart+"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Instacart+</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $59 - 12 months
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="mx-auto max-w-(--breakpoint-2xl)">
                  <div className="mt-7 flex flex-row justify-between px-3 sm:mt-9 md:mr-32">
                    <div className="flex flex-col">
                      <h2 className="text-xl font-semibold sm:text-2xl">
                        Streaming gift cards
                      </h2>
                      <span className="text-gray-700 dark:text-gray-400">
                        Are you still watching?
                      </span>
                    </div>
                    <div className="flex flex-row pt-6">
                      <span className="text-base font-semibold whitespace-nowrap underline underline-offset-4">
                        <a className href="#">
                          See all
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mx-auto hidden w-full max-w-(--breakpoint-2xl) md:block">
                  <div className="flex-end -mt-12 flex justify-end space-x-3 pr-3 2xl:pr-0 pointer-events-none">
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition duration-200 ease-in-out dark:bg-gray-800 pointer-events-none cursor-auto opacity-0">
                      <svg
                        aria-hidden="true"
                        className="h-10 w-10 text-gray-500 dark:text-gray-100"
                        data-slot="icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition duration-200 ease-in-out dark:bg-gray-800 cursor-pointer opacity-100">
                      <svg
                        aria-hidden="true"
                        className="h-10 w-10 text-gray-500 dark:text-gray-100"
                        data-slot="icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="relative w-full">
                  <div className="mt-3 no-scrollbar flex w-full gap-4 overflow-x-auto scroll-smooth pt-3 sm:gap-6 sm:pr-20 xl:gap-6 scroll-pl-2xl">
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Twitch"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/twitch_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/twitch_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/twitch_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/twitch_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/twitch_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/twitch_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/twitch_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/twitch_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/twitch_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/twitch_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/twitch_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/twitch_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/twitch_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/twitch_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/twitch_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/twitch_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Twitch"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Twitch</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $15 - $200
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="AMC Theaters"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/amc-theaters_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/amc-theaters_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/amc-theaters_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/amc-theaters_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/amc-theaters_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/amc-theaters_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/amc-theaters_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/amc-theaters_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/amc-theaters_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/amc-theaters_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/amc-theaters_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/amc-theaters_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/amc-theaters_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/amc-theaters_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/amc-theaters_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/amc-theaters_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="AMC Theaters"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">AMC Theaters</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $3 - $100
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Deezer"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="eager"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/deezer_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/deezer_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/deezer_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/deezer_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/deezer_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/deezer_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/deezer_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/deezer_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/deezer_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/deezer_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/deezer_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/deezer_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/deezer_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/deezer_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/deezer_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/deezer_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Deezer"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Deezer</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $10.99
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Paramount plus"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/paramount-plus_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/paramount-plus_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/paramount-plus_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/paramount-plus_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/paramount-plus_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/paramount-plus_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/paramount-plus_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/paramount-plus_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/paramount-plus_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/paramount-plus_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/paramount-plus_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/paramount-plus_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/paramount-plus_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/paramount-plus_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/paramount-plus_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/paramount-plus_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Paramount plus"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">Paramount plus</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $25 - $100
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="Nintendo Switch Online"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-switch-online_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-switch-online_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-switch-online_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-switch-online_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-switch-online_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-switch-online_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-switch-online_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-switch-online_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-switch-online_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-switch-online_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-switch-online_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-switch-online_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-switch-online_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-switch-online_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-switch-online_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/nintendo-switch-online_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="Nintendo Switch Online"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">
                              Nintendo Switch Online
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            3 months - 12 months
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="relative flex w-[154px] shrink-0 cursor-pointer flex-col items-center last:mr-32 sm:w-[210px] lg:w-[245px] xl:w-[280px]"
                      data-brand-item="true"
                    >
                      <a href="#">
                        <div className="flex w-[154px] flex-col sm:w-[210px] lg:w-[245px] xl:w-[280px]">
                          <div className="relative h-[98px] w-[154px] flex-none rounded-xl shadow-sm ring-1 ring-gray-200/60 transition duration-300 ease-in-out sm:h-[133px] sm:w-[210px] lg:h-[155px] lg:w-[245px] xl:h-[178px] xl:w-[280px] dark:ring-gray-600/60">
                            <img
                              alt="SiriusXM"
                              className="rounded-xl"
                              data-nimg="fill"
                              decoding="async"
                              loading="lazy"
                              sizes="(max-width: 640px) 154px, (max-width: 768px) 210px, (max-width: 1024px) 245px, 280px"
                              src="/assets/_external/cdn.cryptorefills.com/logos_v2/siriusxm-radio_500x318.webp"
                              srcSet="/assets/_external/cdn.cryptorefills.com/logos_v2/siriusxm-radio_300x190.webp 32w, /assets/_external/cdn.cryptorefills.com/logos_v2/siriusxm-radio_300x190.webp 48w, /assets/_external/cdn.cryptorefills.com/logos_v2/siriusxm-radio_300x190.webp 64w, /assets/_external/cdn.cryptorefills.com/logos_v2/siriusxm-radio_300x190.webp 96w, /assets/_external/cdn.cryptorefills.com/logos_v2/siriusxm-radio_300x190.webp 128w, /assets/_external/cdn.cryptorefills.com/logos_v2/siriusxm-radio_300x190.webp 256w, /assets/_external/cdn.cryptorefills.com/logos_v2/siriusxm-radio_300x190.webp 384w, /assets/_external/cdn.cryptorefills.com/logos_v2/siriusxm-radio_300x190.webp 640w, /assets/_external/cdn.cryptorefills.com/logos_v2/siriusxm-radio_300x190.webp 750w, /assets/_external/cdn.cryptorefills.com/logos_v2/siriusxm-radio_500x318.webp 828w, /assets/_external/cdn.cryptorefills.com/logos_v2/siriusxm-radio_500x318.webp 1080w, /assets/_external/cdn.cryptorefills.com/logos_v2/siriusxm-radio_500x318.webp 1200w, /assets/_external/cdn.cryptorefills.com/logos_v2/siriusxm-radio_500x318.webp 1920w, /assets/_external/cdn.cryptorefills.com/logos_v2/siriusxm-radio_500x318.webp 2048w, /assets/_external/cdn.cryptorefills.com/logos_v2/siriusxm-radio_500x318.webp 3840w"
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                objectFit: "cover",
                                color: "transparent",
                              }}
                              title="SiriusXM"
                            />
                            <div className="text-sm" />
                          </div>
                          <div className="mt-2 flex flex-row space-x-0.5 font-semibold">
                            <span className="truncate">SiriusXM</span>
                          </div>
                          <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            $15 - $200
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mx-auto max-w-(--breakpoint-2xl)">
                <div className="mt-9 flex flex-row justify-between px-3 sm:mt-9 md:mr-32">
                  <div className="flex flex-col">
                    <h2 className="text-xl font-semibold sm:text-2xl">
                      eSIMs, flights &amp; stays
                    </h2>
                    <span className="text-gray-700 dark:text-gray-400">
                      Connect, explore, and relax.
                    </span>
                  </div>
                </div>
                <div className="mx-auto hidden w-full max-w-(--breakpoint-2xl) md:block">
                  <div className="-mt-12 flex justify-end space-x-3 pr-3 2xl:pr-0">
                    <button
                      className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-200 transition duration-200 ease-in-out disabled:cursor-auto dark:bg-gray-800 opacity-0"
                      disabled
                    >
                      <svg
                        aria-hidden="true"
                        className="size-10 text-gray-500 dark:text-gray-100"
                        data-slot="icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-200 transition duration-200 ease-in-out disabled:cursor-auto dark:bg-gray-800 opacity-100">
                      <svg
                        aria-hidden="true"
                        className="size-10 text-gray-500 dark:text-gray-100"
                        data-slot="icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="relative w-full">
                <div className="scroll-pl-2xl no-scrollbar flex w-full gap-3 overflow-x-auto scroll-smooth pt-1 pr-5 pl-3 sm:gap-5 sm:pr-20 sm:pl-0">
                  <a className="cursor-pointer" href="#">
                    <div className="relative mt-3 flex h-[150px] w-[300px] flex-none flex-row overflow-hidden rounded-xl bg-[#000000] sm:h-[200px] sm:w-[400px] md:w-[500px] lg:mt-5">
                      <div className="relative h-[150px] w-[300px] flex-none overflow-hidden rounded-xl sm:h-[200px] sm:w-[400px] md:w-[500px]">
                        <div className>
                          <img
                            alt="Mad Deals eSIM"
                            data-nimg="fill"
                            decoding="async"
                            sizes="100vw"
                            src="/assets/_external/cdn.cryptorefills.com/images/esim-tourist.webp"
                            srcSet="/assets/_external/cdn.cryptorefills.com/images/esim-tourist.webp 640w, /assets/_external/cdn.cryptorefills.com/images/esim-tourist.webp 750w, /assets/_external/cdn.cryptorefills.com/images/esim-tourist.webp 828w, /assets/_external/cdn.cryptorefills.com/images/esim-tourist.webp 1080w, /assets/_external/cdn.cryptorefills.com/images/esim-tourist.webp 1200w, /assets/_external/cdn.cryptorefills.com/images/esim-tourist.webp 1920w, /assets/_external/cdn.cryptorefills.com/images/esim-tourist.webp 2048w, /assets/_external/cdn.cryptorefills.com/images/esim-tourist.webp 3840w"
                            style={{
                              position: "absolute",
                              height: "100%",
                              width: "100%",
                              inset: 0,
                              objectFit: "cover",
                              objectPosition: "center bottom",
                              color: "transparent",
                            }}
                            title="Mad Deals eSIM"
                          />
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-transparent" />
                      <div className="absolute bottom-0 px-3 py-2 sm:p-5">
                        <div className="flex items-center gap-2">
                          <svg
                            className="mt-1 text-gray-50"
                            fill="none"
                            height={26}
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                            width={26}
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M6 3h8.5l4.5 4.5v12.5a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1v-16a1 1 0 0 1 1 -1z" />
                            <path d="M9 11h3v6" />
                            <path d="M15 17v.01" />
                            <path d="M15 14v.01" />
                            <path d="M15 11v.01" />
                            <path d="M9 14v.01" />
                            <path d="M9 17v.01" />
                          </svg>
                          <h2 className="text-xl font-semibold text-white sm:text-2xl">
                            eSIM
                          </h2>
                        </div>
                        <p className="mt-1 text-sm text-gray-300">
                          Ditch the plastic, stay connected globally.
                        </p>
                      </div>
                    </div>
                  </a>
                  <a className="cursor-pointer" href="#">
                    <div className="relative mt-3 flex h-[150px] w-[300px] flex-none flex-row overflow-hidden rounded-xl bg-[#000000] sm:h-[200px] sm:w-[400px] md:w-[500px] lg:mt-5">
                      <div className="relative h-[150px] w-[300px] flex-none overflow-hidden rounded-xl sm:h-[200px] sm:w-[400px] md:w-[500px]">
                        <div className>
                          <img
                            alt="Mad Deals flights"
                            data-nimg="fill"
                            decoding="async"
                            loading="lazy"
                            sizes="100vw"
                            src="/assets/_external/cdn.cryptorefills.com/images/flights-Mad Deals.webp"
                            srcSet="/assets/_external/cdn.cryptorefills.com/images/flights-Mad Deals.webp 640w, /assets/_external/cdn.cryptorefills.com/images/flights-Mad Deals.webp 750w, /assets/_external/cdn.cryptorefills.com/images/flights-Mad Deals.webp 828w, /assets/_external/cdn.cryptorefills.com/images/flights-Mad Deals.webp 1080w, /assets/_external/cdn.cryptorefills.com/images/flights-Mad Deals.webp 1200w, /assets/_external/cdn.cryptorefills.com/images/flights-Mad Deals.webp 1920w, /assets/_external/cdn.cryptorefills.com/images/flights-Mad Deals.webp 2048w, /assets/_external/cdn.cryptorefills.com/images/flights-Mad Deals.webp 3840w"
                            style={{
                              position: "absolute",
                              height: "100%",
                              width: "100%",
                              inset: 0,
                              objectFit: "cover",
                              objectPosition: "right bottom",
                              color: "transparent",
                            }}
                            title="Mad Deals flights"
                          />
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-transparent" />
                      <div className="absolute bottom-0 px-3 py-2 sm:p-5">
                        <div className="flex items-center gap-2">
                          <svg
                            className="mt-1 text-gray-50"
                            fill="none"
                            height={26}
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                            width={26}
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                          </svg>
                          <h2 className="text-xl font-semibold text-white sm:text-2xl">
                            Flights
                          </h2>
                        </div>
                        <p className="mt-1 text-sm text-gray-300">
                          Take off effortlessly. Crypto-powered journeys await.
                        </p>
                      </div>
                    </div>
                  </a>
                  <a className="cursor-pointer" href="#">
                    <div className="relative mt-3 flex h-[150px] w-[300px] flex-none flex-row overflow-hidden rounded-xl bg-[#000000] sm:h-[200px] sm:w-[400px] md:w-[500px] lg:mt-5 2xl:mr-32">
                      <div className="relative h-[150px] w-[300px] flex-none overflow-hidden rounded-xl sm:h-[200px] sm:w-[400px] md:w-[500px]">
                        <div className>
                          <img
                            alt="Mad Deals stays"
                            className
                            data-nimg="fill"
                            decoding="async"
                            loading="lazy"
                            sizes="100vw"
                            src="/assets/_external/cdn.cryptorefills.com/images/stays-Mad Deals.webp"
                            srcSet="/assets/_external/cdn.cryptorefills.com/images/stays-Mad Deals.webp 640w, /assets/_external/cdn.cryptorefills.com/images/stays-Mad Deals.webp 750w, /assets/_external/cdn.cryptorefills.com/images/stays-Mad Deals.webp 828w, /assets/_external/cdn.cryptorefills.com/images/stays-Mad Deals.webp 1080w, /assets/_external/cdn.cryptorefills.com/images/stays-Mad Deals.webp 1200w, /assets/_external/cdn.cryptorefills.com/images/stays-Mad Deals.webp 1920w, /assets/_external/cdn.cryptorefills.com/images/stays-Mad Deals.webp 2048w, /assets/_external/cdn.cryptorefills.com/images/stays-Mad Deals.webp 3840w"
                            style={{
                              position: "absolute",
                              height: "100%",
                              width: "100%",
                              inset: 0,
                              objectFit: "cover",
                              objectPosition: "center bottom",
                              color: "transparent",
                            }}
                            title="Mad Deals stays"
                          />
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-transparent" />
                      <div className="absolute bottom-0 px-3 py-2 sm:p-5">
                        <div className="flex items-center gap-2">
                          <svg
                            className="mt-1 text-gray-50"
                            fill="currentColor"
                            height={26}
                            stroke="currentColor"
                            strokeWidth={0}
                            viewBox="0 0 24 24"
                            width={26}
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M0 0h24v24H0V0z" fill="none" />
                            <path d="M7 14c1.66 0 3-1.34 3-3S8.66 8 7 8s-3 1.34-3 3 1.34 3 3 3zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm12-3h-8v8H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4zm2 8h-8V9h6c1.1 0 2 .9 2 2v4z" />
                          </svg>
                          <h2 className="text-xl font-semibold text-white sm:text-2xl">
                            Stays
                          </h2>
                        </div>
                        <p className="mt-1 text-sm text-gray-300">
                          Digital currency. Real-world comfort.
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
              <div className="mx-auto max-w-(--breakpoint-2xl)">
                <div className="mx-3 mt-9 flex flex-col justify-between sm:mt-9">
                  <h2 className="text-xl font-semibold sm:text-2xl">
                    Built for AI agents
                  </h2>
                  <div className="relative mt-5 flex h-full w-full flex-col overflow-hidden rounded-4xl bg-[#0d1737] px-6 py-16 dark:bg-black">
                    <div className="absolute inset-0 -top-120">
                      <div className="absolute inset-0">
                        <canvas
                          className="h-full w-full"
                          height={808}
                          style={{ display: "block" }}
                          width={1331}
                        />
                      </div>
                    </div>
                    <div className="z-10 flex flex-col items-center sm:flex-row">
                      <div className="max-w-[600px] px-3 py-3">
                        <p className="text-2xl text-gray-50">
                          Skills, MCP, and x402 give agents the tools to quote,
                          validate, and buy gift cards, eSIMs, and top-ups
                          autonomously, with stablecoins.
                          <span className="ml-1 text-[#7e95c1]">
                            Connect your AI agent to 6600+ products across 180+
                            countries.
                          </span>
                        </p>
                        <p className="mt-3 text-xs text-gray-400">
                          No KYC. No credit cards.
                        </p>
                      </div>
                      <div className="mx-auto flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <button
                            className="group flex cursor-pointer items-center rounded-full bg-gray-800 px-4 py-2 text-gray-50"
                            type="button"
                          >
                            <span className="me-2 w-full truncate sm:text-lg">
                              npx skills add Mad Deals/agents
                            </span>
                            <span className="w-[20px]">
                              <svg
                                className="text-white"
                                fill="none"
                                height={16}
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                                width={16}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  height={13}
                                  rx={2}
                                  ry={2}
                                  width={13}
                                  x={9}
                                  y={9}
                                />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                            </span>
                          </button>
                        </div>
                        <div className="py-6 text-center text-sm text-gray-300">
                          or add as an MCP server in
                        </div>
                        <div className="flex w-full flex-row justify-center space-x-3">
                          <a
                            className="flex flex-row space-x-2 rounded-lg px-6 py-3 text-gray-100 ring-1 ring-gray-50"
                            href="#"
                            target="_blank"
                          >
                            <svg
                              className="mr-2"
                              fill="currentColor"
                              height={24}
                              stroke="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 16 16"
                              width={24}
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="m3.127 10.604 3.135-1.76.053-.153-.053-.085H6.11l-.525-.032-1.791-.048-1.554-.065-1.505-.08-.38-.081L0 7.832l.036-.234.32-.214.455.04 1.009.069 1.513.105 1.097.064 1.626.17h.259l.036-.105-.089-.065-.068-.064-1.566-1.062-1.695-1.121-.887-.646-.48-.327-.243-.306-.104-.67.435-.48.585.04.15.04.593.456 1.267.981 1.654 1.218.242.202.097-.068.012-.049-.109-.181-.9-1.626-.96-1.655-.428-.686-.113-.411a2 2 0 0 1-.068-.484l.496-.674L4.446 0l.662.089.279.242.411.94.666 1.48 1.033 2.014.302.597.162.553.06.17h.105v-.097l.085-1.134.157-1.392.154-1.792.052-.504.25-.605.497-.327.387.186.319.456-.045.294-.19 1.23-.37 1.93-.243 1.29h.142l.161-.16.654-.868 1.097-1.372.484-.545.565-.601.363-.287h.686l.505.751-.226.775-.707.895-.585.759-.839 1.13-.524.904.048.072.125-.012 1.897-.403 1.024-.186 1.223-.21.553.258.06.263-.218.536-1.307.323-1.533.307-2.284.54-.028.02.032.04 1.029.098.44.024h1.077l2.005.15.525.346.315.424-.053.323-.807.411-3.631-.863-.872-.218h-.12v.073l.726.71 1.331 1.202 1.667 1.55.084.383-.214.302-.226-.032-1.464-1.101-.565-.497-1.28-1.077h-.084v.113l.295.432 1.557 2.34.08.718-.112.234-.404.141-.444-.08-.911-1.28-.94-1.44-.759-1.291-.093.053-.448 4.821-.21.246-.484.186-.403-.307-.214-.496.214-.98.258-1.28.21-1.016.19-1.263.112-.42-.008-.028-.092.012-.953 1.307-1.448 1.957-1.146 1.227-.274.109-.477-.247.045-.44.266-.39 1.586-2.018.956-1.25.617-.723-.004-.105h-.036l-4.212 2.736-.75.096-.324-.302.04-.496.154-.162 1.267-.871z" />
                            </svg>
                            Claude
                          </a>
                          <a
                            className="flex flex-row space-x-2 rounded-lg px-5 py-3 text-gray-100 ring-1 ring-gray-50"
                            href="#"
                            target="_blank"
                          >
                            <img
                              alt="ChatGPT"
                              className="mr-2"
                              data-nimg={1}
                              decoding="async"
                              height={24}
                              loading="lazy"
                              src="_next/image.jpg"
                              srcSet="_next/image.bin 1x, _next/image.jpg 2x"
                              style={{ color: "transparent" }}
                              width={24}
                            />
                            ChatGPT
                          </a>
                        </div>
                        <div className="mt-5 flex justify-center">
                          <a
                            className="flex flex-row items-center text-sm text-gray-50 underline underline-offset-2"
                            href="#"
                            target="_blank"
                          >
                            <svg
                              className="mr-2"
                              fill="currentColor"
                              height="1em"
                              stroke="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 496 512"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                            </svg>{" "}
                            Agent skills on GitHub
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="block sm:hidden">
                <div className="my-10 flex flex-col justify-center px-3">
                  <a
                    className="flex flex-row items-center justify-center rounded-xl bg-gray-100 p-3 text-center font-semibold dark:text-gray-800"
                    href="#"
                  >
                    See all gift cards
                  </a>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div>
          <footer
            aria-labelledby="footer-heading"
            className="bg-gray-100 dark:bg-gray-800"
            id="page-footer"
          >
            <h2 className="sr-only" id="footer-heading">
              Footer
            </h2>
            <div className="mx-auto max-w-(--breakpoint-xl) px-3 pt-14 pb-8">
              <div className="xl:grid xl:grid-cols-3 xl:gap-6">
                <div>
                  <svg
                    viewBox="0 0 500 127"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-auto text-primary-900 sm:h-8 dark:text-primary-50 mb-1"
                    aria-label="Mad Deals"
                  >
                    {/* Logo Icon */}
                    <path d="M37 90L60 90" stroke="currentColor" strokeWidth="23" strokeLinecap="round" />
                    <path d="M12 58L43 58" stroke="currentColor" strokeWidth="23" strokeLinecap="round" />
                    <path d="M32 25L48 25" stroke="currentColor" strokeWidth="23" strokeLinecap="round" />
                    {/* Logo Text */}
                    <text x="90" y="85" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="72" fill="currentColor" letterSpacing="-2">Mad Deals</text>
                  </svg>
                  <p className="mt-1 text-xs text-gray-400 italic dark:text-gray-500">
                    Trusted since 2018
                  </p>
                  <div className="mt-5 text-sm text-gray-600 dark:text-gray-400">
                    <p>Version 2.0.3178</p>
                  </div>
                  <div className="mt-5 flex h-10 flex-row items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                    <p>Theme</p>{" "}
                    <div className="relative" data-headlessui-state>
                      <button
                        aria-expanded="false"
                        aria-haspopup="listbox"
                        aria-label="Switch Color Mode"
                        className="w-full cursor-pointer rounded-lg py-1 text-sm focus:outline-hidden"
                        data-headlessui-state
                        id="headlessui-listbox-button-_r_j_"
                        type="button"
                      >
                        <div className="w-fit min-w-20 rounded-lg py-1 text-gray-600 ring-2 ring-gray-200 dark:text-gray-400 dark:ring-gray-600">
                          <span className="mr-2 flex flex-row justify-end space-x-2 truncate">
                            <p className="px-1 text-right">Auto </p>
                            <svg
                              className="flex-none"
                              fill="currentColor"
                              height={20}
                              stroke="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 512 512"
                              width={20}
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M256 294.1L383 167c9.4-9.4 24.6-9.4 33.9 0s9.3 24.6 0 34L273 345c-9.1 9.1-23.7 9.3-33.1.7L95 201.1c-4.7-4.7-7-10.9-7-17s2.3-12.3 7-17c9.4-9.4 24.6-9.4 33.9 0l127.1 127z" />
                            </svg>
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-row items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                    <button className="cursor-pointer">Cookie settings</button>
                  </div>
                </div>
                <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                  <div className="md:grid md:grid-cols-2 md:gap-8">
                    <div>
                      <h3 className="text-sm leading-6 font-semibold text-gray-900 dark:text-gray-200">
                        Popular
                      </h3>
                      <div>
                        <ul className="mt-3 space-y-3" role="list">
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              Airbnb
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              Amazon
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              Everything Apple
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              Google Play
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              Netflix
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              Nintendo eShop
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              PlayStation Store
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              Steam
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              Xbox
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              eSIM
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              Flights
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              Stays
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="mt-10 md:mt-0">
                      <h3 className="text-sm leading-6 font-semibold text-gray-900 dark:text-gray-200">
                        Questions
                      </h3>
                      <div>
                        <ul className="mt-3 space-y-3" role="list">
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              Spend Crypto
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              How it works
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              Help
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              FAQ
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              Contact us
                            </a>
                          </li>
                        </ul>
                      </div>
                      <h3 className="mt-6 text-sm leading-6 font-semibold text-gray-900 dark:text-gray-200">
                        Community
                      </h3>
                      <div>
                        <ul className="mt-3 space-y-3" role="list">
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              Ambassador program
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              Crypto use map
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              Earn points
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              Events
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              Insights
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              Referral
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              Reviews
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="md:grid md:grid-cols-2 md:gap-8">
                    <div className>
                      <h3 className="text-sm leading-6 font-semibold text-gray-900 dark:text-gray-200">
                        Company and legal
                      </h3>
                      <div>
                        <ul className="mt-3 space-y-3" role="list">
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              target="_blank"
                            >
                              Mad Deals labs
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              Careers
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              Press and media
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              Trust and safety
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              About
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="mt-10 md:mt-0">
                      <h3 className="text-sm leading-6 font-semibold text-gray-900 dark:text-gray-200">
                        Partnerships
                      </h3>
                      <div>
                        <ul className="mt-3 space-y-3" role="list">
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              For brands
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              Consumer and digital brands
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              Wallets and exchanges
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              API docs
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              AI agents
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              hrefLang="en"
                              rel="alternate"
                            >
                              Investors
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-sm leading-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                              href="#"
                              target="_blank"
                            >
                              Atomicrails
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr className="pb-5 sm:w-full" />
            <div className="mx-auto max-w-7xl px-6 pb-5">
              <div className="flex flex-col text-sm text-gray-600 sm:flex-row sm:justify-between dark:text-gray-300">
                <div className="flex flex-col text-center sm:flex-row sm:space-x-5">
                  <p>© 2026 Mad Deals</p>
                  <div className="mt-5 space-x-5 sm:mt-0">
                    <a className="hover:underline" href="#">
                      Privacy policy
                    </a>
                    <a className="hover:underline" href="#">
                      Terms of service
                    </a>
                  </div>
                </div>
                <div className="mt-5 mr-5 flex flex-row items-center justify-center space-x-3 sm:mt-0 sm:justify-end">
                  <a
                    className="text-gray-400 hover:text-gray-500"
                    href="#"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="sr-only">Facebook</span>
                    <svg
                      fill="currentColor"
                      height={29}
                      stroke="currentColor"
                      strokeWidth={0}
                      viewBox="0 0 24 24"
                      width={29}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M13.001 19.9381C16.9473 19.446 20.001 16.0796 20.001 12C20.001 7.58172 16.4193 4 12.001 4C7.5827 4 4.00098 7.58172 4.00098 12C4.00098 16.0796 7.05467 19.446 11.001 19.9381V14H9.00098V12H11.001V10.3458C11.001 9.00855 11.1402 8.52362 11.4017 8.03473C11.6631 7.54584 12.0468 7.16216 12.5357 6.9007C12.9184 6.69604 13.3931 6.57252 14.2227 6.51954C14.5519 6.49851 14.9781 6.52533 15.501 6.6V8.5H15.001C14.0837 8.5 13.7052 8.54332 13.4789 8.66433C13.3386 8.73939 13.2404 8.83758 13.1653 8.97793C13.0443 9.20418 13.001 9.42853 13.001 10.3458V12H15.501L15.001 14H13.001V19.9381ZM12.001 22C6.47813 22 2.00098 17.5228 2.00098 12C2.00098 6.47715 6.47813 2 12.001 2C17.5238 2 22.001 6.47715 22.001 12C22.001 17.5228 17.5238 22 12.001 22Z" />
                    </svg>
                  </a>
                  <a
                    className="text-gray-400 hover:text-gray-500"
                    href="#"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="sr-only">Twitter</span>
                    <svg
                      fill="currentColor"
                      height={25}
                      stroke="currentColor"
                      strokeWidth={0}
                      viewBox="0 0 24 24"
                      width={25}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.4883 14.651L15.25 21H22.25L14.3917 10.5223L20.9308 3H18.2808L13.1643 8.88578L8.75 3H1.75L9.26086 13.0145L2.31915 21H4.96917L10.4883 14.651ZM16.25 19L5.75 5H7.75L18.25 19H16.25Z" />
                    </svg>
                  </a>
                  <a
                    className="text-gray-400 hover:text-gray-500"
                    href="#"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="sr-only">Instagram</span>
                    <svg
                      fill="currentColor"
                      height={26}
                      stroke="currentColor"
                      strokeWidth={0}
                      viewBox="0 0 24 24"
                      width={26}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12.001 9C10.3436 9 9.00098 10.3431 9.00098 12C9.00098 13.6573 10.3441 15 12.001 15C13.6583 15 15.001 13.6569 15.001 12C15.001 10.3427 13.6579 9 12.001 9ZM12.001 7C14.7614 7 17.001 9.2371 17.001 12C17.001 14.7605 14.7639 17 12.001 17C9.24051 17 7.00098 14.7629 7.00098 12C7.00098 9.23953 9.23808 7 12.001 7ZM18.501 6.74915C18.501 7.43926 17.9402 7.99917 17.251 7.99917C16.5609 7.99917 16.001 7.4384 16.001 6.74915C16.001 6.0599 16.5617 5.5 17.251 5.5C17.9393 5.49913 18.501 6.0599 18.501 6.74915ZM12.001 4C9.5265 4 9.12318 4.00655 7.97227 4.0578C7.18815 4.09461 6.66253 4.20007 6.17416 4.38967C5.74016 4.55799 5.42709 4.75898 5.09352 5.09255C4.75867 5.4274 4.55804 5.73963 4.3904 6.17383C4.20036 6.66332 4.09493 7.18811 4.05878 7.97115C4.00703 9.0752 4.00098 9.46105 4.00098 12C4.00098 14.4745 4.00753 14.8778 4.05877 16.0286C4.0956 16.8124 4.2012 17.3388 4.39034 17.826C4.5591 18.2606 4.7605 18.5744 5.09246 18.9064C5.42863 19.2421 5.74179 19.4434 6.17187 19.6094C6.66619 19.8005 7.19148 19.9061 7.97212 19.9422C9.07618 19.9939 9.46203 20 12.001 20C14.4755 20 14.8788 19.9934 16.0296 19.9422C16.8117 19.9055 17.3385 19.7996 17.827 19.6106C18.2604 19.4423 18.5752 19.2402 18.9074 18.9085C19.2436 18.5718 19.4445 18.2594 19.6107 17.8283C19.8013 17.3358 19.9071 16.8098 19.9432 16.0289C19.9949 14.9248 20.001 14.5389 20.001 12C20.001 9.52552 19.9944 9.12221 19.9432 7.97137C19.9064 7.18906 19.8005 6.66149 19.6113 6.17318C19.4434 5.74038 19.2417 5.42635 18.9084 5.09255C18.573 4.75715 18.2616 4.55693 17.8271 4.38942C17.338 4.19954 16.8124 4.09396 16.0298 4.05781C14.9258 4.00605 14.5399 4 12.001 4ZM12.001 2C14.7176 2 15.0568 2.01 16.1235 2.06C17.1876 2.10917 17.9135 2.2775 18.551 2.525C19.2101 2.77917 19.7668 3.1225 20.3226 3.67833C20.8776 4.23417 21.221 4.7925 21.476 5.45C21.7226 6.08667 21.891 6.81333 21.941 7.8775C21.9885 8.94417 22.001 9.28333 22.001 12C22.001 14.7167 21.991 15.0558 21.941 16.1225C21.8918 17.1867 21.7226 17.9125 21.476 18.55C21.2218 19.2092 20.8776 19.7658 20.3226 20.3217C19.7668 20.8767 19.2076 21.22 18.551 21.475C17.9135 21.7217 17.1876 21.89 16.1235 21.94C15.0568 21.9875 14.7176 22 12.001 22C9.28431 22 8.94514 21.99 7.87848 21.94C6.81431 21.8908 6.08931 21.7217 5.45098 21.475C4.79264 21.2208 4.23514 20.8767 3.67931 20.3217C3.12348 19.7658 2.78098 19.2067 2.52598 18.55C2.27848 17.9125 2.11098 17.1867 2.06098 16.1225C2.01348 15.0558 2.00098 14.7167 2.00098 12C2.00098 9.28333 2.01098 8.94417 2.06098 7.8775C2.11014 6.8125 2.27848 6.0875 2.52598 5.45C2.78014 4.79167 3.12348 4.23417 3.67931 3.67833C4.23514 3.1225 4.79348 2.78 5.45098 2.525C6.08848 2.2775 6.81348 2.11 7.87848 2.06C8.94514 2.0125 9.28431 2 12.001 2Z" />
                    </svg>
                  </a>
                  <a
                    className="text-gray-400 hover:text-gray-500"
                    href="#"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="sr-only">Telegram</span>
                    <svg
                      fill="currentColor"
                      height={26}
                      stroke="currentColor"
                      strokeWidth={0}
                      viewBox="0 0 24 24"
                      width={26}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.0943 7.14643C17.6874 6.93123 17.9818 6.85378 18.1449 6.82608C18.1461 6.87823 18.1449 6.92051 18.1422 6.94825C17.9096 9.39217 16.8906 15.4048 16.3672 18.2026C16.2447 18.8578 16.1507 19.1697 15.5179 18.798C15.1014 18.5532 14.7245 18.2452 14.3207 17.9805C12.9961 17.1121 11.1 15.8189 11.2557 15.8967C9.95162 15.0373 10.4975 14.5111 11.2255 13.8093C11.3434 13.6957 11.466 13.5775 11.5863 13.4525C11.64 13.3967 11.9027 13.1524 12.2731 12.8081C13.4612 11.7035 15.7571 9.56903 15.8151 9.32202C15.8246 9.2815 15.8334 9.13045 15.7436 9.05068C15.6539 8.97092 15.5215 8.9982 15.4259 9.01989C15.2904 9.05064 13.1326 10.4769 8.95243 13.2986C8.33994 13.7192 7.78517 13.9242 7.28811 13.9134L7.29256 13.9156C6.63781 13.6847 5.9849 13.4859 5.32855 13.286C4.89736 13.1546 4.46469 13.0228 4.02904 12.8812C3.92249 12.8466 3.81853 12.8137 3.72083 12.783C8.24781 10.8109 11.263 9.51243 12.7739 8.884C14.9684 7.97124 16.2701 7.44551 17.0943 7.14643ZM19.5169 5.21806C19.2635 5.01244 18.985 4.91807 18.7915 4.87185C18.5917 4.82412 18.4018 4.80876 18.2578 4.8113C17.7814 4.81969 17.2697 4.95518 16.4121 5.26637C15.5373 5.58382 14.193 6.12763 12.0058 7.03736C10.4638 7.67874 7.39388 9.00115 2.80365 11.001C2.40046 11.1622 2.03086 11.3451 1.73884 11.5619C1.46919 11.7622 1.09173 12.1205 1.02268 12.6714C0.970519 13.0874 1.09182 13.4714 1.33782 13.7738C1.55198 14.037 1.82635 14.1969 2.03529 14.2981C2.34545 14.4483 2.76276 14.5791 3.12952 14.6941C3.70264 14.8737 4.27444 15.0572 4.84879 15.233C6.62691 15.7773 8.09066 16.2253 9.7012 17.2866C10.8825 18.0651 12.041 18.8775 13.2243 19.6531C13.6559 19.936 14.0593 20.2607 14.5049 20.5224C14.9916 20.8084 15.6104 21.0692 16.3636 20.9998C17.5019 20.8951 18.0941 19.8479 18.3331 18.5703C18.8552 15.7796 19.8909 9.68351 20.1332 7.13774C20.1648 6.80544 20.1278 6.433 20.097 6.25318C20.0653 6.068 19.9684 5.58448 19.5169 5.21806Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
      <next-route-announcer style={{ position: "absolute" }} />
    </div>
  );
}
