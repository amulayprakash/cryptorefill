import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';

export default function Footer() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  // Listen to external theme changes to keep dropdown value in sync
  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem('theme') || 'light');
    };
    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  const handleSelectChange = (e) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    
    const root = window.document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('theme', newTheme);
    // Dispatch event to notify other components (like Header)
    window.dispatchEvent(new Event('themeChanged'));
  };

  return (
    <footer className="bg-[#F9FAFB] dark:bg-gray-950 text-sm text-gray-500 dark:text-gray-400 pt-16 pb-8 border-t border-gray-100 dark:border-gray-800/80 font-sans transition-colors">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
          
          {/* Column 1: Brand & Settings */}
          <div className="flex flex-col">
            <img
              src="/logo.png"
              alt="Mad Deals Logo"
              className="mt-0 h-14 w-auto sm:h-16 md:h-20 object-contain hover:scale-105 transition-transform duration-300 drop-shadow-sm hover:drop-shadow-md"
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 italic mb-8">Trusted since 2018</p>
            
            <p className="text-[13px] mb-6">Version 2.0.3180</p>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[13px] text-gray-700 dark:text-gray-300">Theme</span>
              <select 
                value={theme}
                onChange={handleSelectChange}
                className="border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 text-[13px] focus:outline-hidden text-gray-800 dark:text-gray-200"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            
            <p className="text-[13px] cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Cookie settings</p>
          </div>

          {/* Column 2: Popular */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold mb-4">Popular</h3>
            <ul className="space-y-3 text-[13px]">
              {['Airbnb', 'Amazon', 'Everything Apple', 'Google Play', 'Netflix', 'Nintendo eShop', 'PlayStation Store', 'Steam', 'Xbox', 'eSIM', 'Flights', 'Stays'].map((item) => (
                <li key={item}><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Column 3: Questions & Community */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold mb-4">Questions</h3>
            <ul className="space-y-3 text-[13px] mb-8">
              {['Spend Crypto', 'How it works', 'Help', 'FAQ', 'Contact us'].map((item) => (
                <li key={item}><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
            
            <h3 className="text-gray-900 dark:text-white font-bold mb-4">Community</h3>
            <ul className="space-y-3 text-[13px]">
              {['Ambassador program', 'Crypto use map', 'Earn points', 'Events', 'Insights', 'Referral', 'Reviews'].map((item) => (
                <li key={item}><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Column 4: Company and legal */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold mb-4">Company and legal</h3>
            <ul className="space-y-3 text-[13px]">
              {['Mad Deals labs', 'Careers', 'Press and media', 'Trust and safety', 'About'].map((item) => (
                <li key={item}><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Column 5: Partnerships */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold mb-4">Partnerships</h3>
            <ul className="space-y-3 text-[13px]">
              {['For brands', 'Consumer and digital brands', 'Wallets and exchanges', 'API docs', 'AI agents', 'Investors', 'Atomicrails'].map((item) => (
                <li key={item}><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-wrap items-center gap-4 text-[13px] text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
            <span>© 2026 Mad Deals</span>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy policy</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of service</a>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Facebook */}
            <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/></svg>
            </a>
            {/* X/Twitter */}
            <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            {/* Instagram */}
            <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"><Send className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
