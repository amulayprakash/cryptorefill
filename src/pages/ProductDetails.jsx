import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../data/products';
import { 
  ArrowLeft, 
  Zap, 
  CheckCircle2, 
  RefreshCcw,
  Minus,
  Plus
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ProductDetails() {
  const { id } = useParams();
  const product = getProductById(id);
  
  const [selectedAmount, setSelectedAmount] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  
  const [expandedSection, setExpandedSection] = useState('how-to-redeem');

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <h1 className="text-3xl font-bold text-gray-850 dark:text-white mb-4">Product Not Found</h1>
        <Link to="/" className="text-blue-600 hover:text-blue-500 hover:underline">Return to Home</Link>
      </div>
    );
  }

  // Set default amount if empty
  if (selectedAmount === '' && product.detailedPriceOptions.length > 0) {
    setSelectedAmount(product.detailedPriceOptions[0].toString());
  }

  const estimatedPrice = selectedAmount ? (parseFloat(selectedAmount) * selectedQuantity).toFixed(2) : '0.00';
  const points = selectedAmount ? Math.floor(parseFloat(selectedAmount) * selectedQuantity * (product.pointsMultiplier || 1.05)) : 0;

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleAddToCart = () => {
    if (window.HeaderTriggerToast) {
      window.HeaderTriggerToast(`Added ${selectedQuantity}x ${product.name} gift card ($${selectedAmount}) to cart!`);
    } else {
      alert(`Added ${selectedQuantity}x ${product.name} to cart!`);
    }
  };

  const handleBuyNow = () => {
    if (window.HeaderTriggerToast) {
      window.HeaderTriggerToast(`Redirecting to payment gateway for $${estimatedPrice} USDC...`);
    } else {
      alert(`Proceeding to checkout for $${estimatedPrice} USDC`);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-20 font-sans text-gray-900 dark:text-gray-100 transition-colors">
      {/* Reusable responsive Header */}
      <Header />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Catalog
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Column: Image Container (Responsive Padding) */}
          <div className="w-full lg:w-[45%] flex-shrink-0">
            <div className={`w-full ${product.category === 'Jewellery' ? 'bg-[#FAF8F4] dark:bg-amber-900/10 border-[#C5A059]/20' : 'bg-gray-50 dark:bg-gray-800/40 border-gray-100 dark:border-gray-850'} rounded-3xl p-6 sm:p-12 lg:p-16 flex items-center justify-center aspect-[4/3] relative border shadow-xs transition-colors`}>
              <div className="w-full max-w-[280px] rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-lg border border-gray-100 dark:border-gray-800 transform hover:scale-103 transition-transform duration-350">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = '/assets/placeholder_mockup.png';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Content Details */}
          <div className="w-full lg:w-[55%] flex flex-col pt-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              {product.name} {product.category !== 'Jewellery' && "gift card"}
            </h1>
            
            <p className="text-gray-600 dark:text-gray-350 text-[15px] leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Badges Box: Styled Card Container */}
            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-[13px] font-bold text-gray-700 dark:text-gray-300 ${product.category === 'Jewellery' ? 'bg-[#FAF8F4] dark:bg-amber-900/10 border-[#C5A059]/20' : 'bg-gray-50 dark:bg-gray-800/30 border-gray-150/40 dark:border-gray-800/40'} p-4 rounded-2xl border transition-colors`}>
              <div className="flex items-center gap-2">
                <Zap className={`w-4 h-4 ${product.category === 'Jewellery' ? 'text-[#C5A059]' : 'text-green-500'} fill-current`} />
                <span>Instant delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 ${product.category === 'Jewellery' ? 'text-[#C5A059]' : 'text-green-500'}`} />
                <span>{product.category === 'Jewellery' ? 'Premium Quality' : 'Online & instore'}</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCcw className={`w-4 h-4 ${product.category === 'Jewellery' ? 'text-[#C5A059]' : 'text-green-500'}`} />
                <span>Fair refund policy</span>
              </div>
            </div>

            {/* Selection Grid: Fix Mobile Overlaps */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-end mb-6">
              
              {/* Amount Selection */}
              <div className="col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Amount</label>
                <div className="relative">
                  <select 
                    value={selectedAmount}
                    onChange={(e) => setSelectedAmount(e.target.value)}
                    className="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl py-2.5 pl-4 pr-10 text-gray-900 dark:text-white font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                  >
                    {product.detailedPriceOptions.map(price => (
                      <option key={price} value={price} className="dark:bg-gray-850">${price}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Quantity</label>
                <div className="relative">
                  <select 
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                    className="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl py-2.5 pl-4 pr-10 text-gray-900 dark:text-white font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <option key={num} value={num} className="dark:bg-gray-850">{num}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              {/* Estimated Price Panel (Premium Card Style) */}
              <div className={`col-span-1 ${product.category === 'Jewellery' ? 'bg-amber-50/50 dark:bg-amber-900/20 border-amber-100/50 dark:border-amber-700/30' : 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-100/50 dark:border-blue-900/30'} p-3.5 rounded-xl border flex flex-col justify-center h-[72px] transition-colors`}>
                <label className={`block text-[10px] font-extrabold uppercase tracking-wider ${product.category === 'Jewellery' ? 'text-[#C5A059]' : 'text-blue-600 dark:text-blue-400'} mb-1`}>Estimated price</label>
                <div className="flex items-center gap-2 text-gray-900 dark:text-white font-extrabold text-base sm:text-lg">
                  <div className={`w-5 h-5 rounded-full ${product.category === 'Jewellery' ? 'bg-[#C5A059]' : 'bg-blue-600'} text-white flex items-center justify-center text-[10px] font-black`}>
                    $
                  </div>
                  <span>{estimatedPrice} USDC</span>
                </div>
              </div>

            </div>

            {/* Points Earned */}
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-455 mb-6">
              Points you earn: <span className={`font-extrabold ${product.category === 'Jewellery' ? 'text-[#C5A059]' : 'text-blue-600 dark:text-blue-400'} ml-1`}>RC {points}</span>
            </div>

            {/* Action Buttons: Stylized with smooth gradients and hover transformations */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={handleAddToCart}
                className={`flex-1 cursor-pointer bg-white dark:bg-gray-800 ${product.category === 'Jewellery' ? 'hover:bg-[#FAF8F4] dark:hover:bg-amber-900/20 text-[#C5A059] border-[#C5A059]/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-gray-700'} border py-3.5 px-6 rounded-xl font-bold text-[15px] shadow-xs hover:shadow-sm transform hover:-translate-y-0.5 active:translate-y-0 transition-all text-center`}
              >
                Add to cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="flex-1 cursor-pointer py-3.5 px-6 rounded-xl font-bold text-[15px] text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all text-center"
                style={{ background: product.category === 'Jewellery' ? 'linear-gradient(135deg, #C5A059 0%, #D4AF37 100%)' : 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
                onMouseEnter={e => e.currentTarget.style.background = product.category === 'Jewellery' ? 'linear-gradient(135deg, #B48F47 0%, #C5A059 100%)' : 'linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%)'}
                onMouseLeave={e => e.currentTarget.style.background = product.category === 'Jewellery' ? 'linear-gradient(135deg, #C5A059 0%, #D4AF37 100%)' : 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)'}
              >
                Buy now
              </button>
            </div>

            {/* Regional Limitation Alert */}
            <div className="flex items-center gap-2 text-[13px] font-bold text-gray-600 dark:text-gray-400 pb-8 border-b border-gray-150 dark:border-gray-800/80 transition-colors">
              <img src="/assets/_external/cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/us.svg" alt="US" className="w-5 h-auto rounded-[2px]" />
              <span>May only be redeemable in {product.region}</span>
            </div>

            {/* Terms and FAQ Accordions */}
            <div className="mt-4 flex flex-col">
              
              {/* How to redeem */}
              <div className="border-b border-gray-150 dark:border-gray-850 py-4.5 transition-colors">
                <button 
                  onClick={() => toggleSection('how-to-redeem')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="text-[15px] font-bold text-gray-800 dark:text-gray-200">How to redeem</span>
                  {expandedSection === 'how-to-redeem' ? (
                    <Minus className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Plus className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {expandedSection === 'how-to-redeem' && (
                  <div className="mt-3 text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed pr-4 animate-fadeIn">
                    {product.redeemInstructions}
                  </div>
                )}
              </div>

              {/* Terms and conditions */}
              <div className="border-b border-gray-150 dark:border-gray-850 py-4.5 transition-colors">
                <button 
                  onClick={() => toggleSection('terms')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="text-[15px] font-bold text-gray-800 dark:text-gray-200">Terms and conditions</span>
                  {expandedSection === 'terms' ? (
                    <Minus className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Plus className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {expandedSection === 'terms' && (
                  <div className="mt-3 text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed pr-4 animate-fadeIn">
                    {product.terms}
                  </div>
                )}
              </div>

              {/* FAQ Accordion */}
              <div className="border-b border-gray-150 dark:border-gray-850 py-4.5 transition-colors">
                <button 
                  onClick={() => toggleSection('faq')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="text-[15px] font-bold text-gray-800 dark:text-gray-200">Frequently asked questions</span>
                  {expandedSection === 'faq' ? (
                    <Minus className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Plus className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {expandedSection === 'faq' && (
                  <div className="mt-3 text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed pr-4 animate-fadeIn">
                    {product.faq && product.faq.length > 0 ? (
                      <div className="space-y-4">
                        {product.faq.map((item, index) => (
                          <div key={index}>
                            <p className="font-bold text-gray-800 dark:text-gray-200 mb-1">{item.q}</p>
                            <p className="text-gray-600 dark:text-gray-400">{item.a}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      "No frequently asked questions available for this product."
                    )}
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
