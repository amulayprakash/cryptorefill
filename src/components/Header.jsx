import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Search, ShoppingCart, User, Globe, HelpCircle } from 'lucide-react';
import { WalletButton } from './wallet/WalletButton';
import { useCart } from '../context/CartContext';
import { useDomainConfig } from '../context/DomainContext';

export default function Header() {
  const { itemCount, openCart } = useCart();
  const { config } = useDomainConfig();
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const navRef = useRef(null);
  const [navHeight, setNavHeight] = useState(92);

  // Dynamically track sticky navbar height so the spacer always matches
  useEffect(() => {
    if (!navRef.current) return;
    const observer = new ResizeObserver(() => {
      if (navRef.current) setNavHeight(navRef.current.offsetHeight);
    });
    observer.observe(navRef.current);
    setNavHeight(navRef.current.offsetHeight);
    return () => observer.disconnect();
  }, []);

  // Handle dynamic class setting for Dark Mode
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Show a temporary toast notification for mock interactions
  const triggerToast = (message) => {
    setToastMsg(message);
    setTimeout(() => {
      setToastMsg('');
    }, 2500);
  };

  return (
    <div id="navbar-main" className="relative">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-800 dark:border-gray-200 transition-all duration-300 transform translate-y-0 scale-100">
          <span className="font-semibold text-sm">{toastMsg}</span>
        </div>
      )}

      <div
        ref={navRef}
        className="fixed z-20 w-screen bg-gray-50/90 pb-2 backdrop-blur-xs transition-transform duration-300 dark:bg-gray-900/90 translate-y-0"
        id="sticky-navbar"
      >
        {/* Top bar: Language and Country Selector */}
        <nav
          aria-label="Language and Country"
          className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200/50 dark:border-gray-700/50 transition-colors"
        >
          <div className="relative mx-auto flex max-w-7xl px-4">
            <div className="flex h-9 w-full items-center justify-between text-xs font-semibold text-gray-600 dark:text-gray-300">
              {/* Trustpilot or Left-aligned item */}
              <div className="flex items-center space-x-2">
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); triggerToast("Trustpilot reviews are coming soon!"); }}
                  className="flex items-center hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <span className="hidden sm:inline-block mr-1">Excellent reviews on</span>
                  <span className="text-green-600 font-extrabold tracking-tight">Trustpilot</span>
                </a>
              </div>

              {/* Right-aligned language and currency tools */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => triggerToast("Region selection is coming soon!")}
                  className="cursor-pointer flex items-center hover:text-gray-900 dark:hover:text-white transition-colors gap-1"
                >
                  <Globe className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                  <span className="hidden md:inline">Global</span>
                </button>
                
                <button
                  onClick={() => triggerToast("Language selection is coming soon!")}
                  className="cursor-pointer flex items-center hover:text-gray-900 dark:hover:text-white transition-colors gap-1"
                >
                  <Globe className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                  <span className="hidden md:inline">English</span>
                </button>

                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); triggerToast("How can we help you today?"); }}
                  className="flex items-center hover:text-gray-900 dark:hover:text-white transition-colors gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                  <span className="hidden md:inline">Help</span>
                </a>

                {/* Interactive Theme Switcher */}
                <button
                  aria-label="Switch Color Mode"
                  className="cursor-pointer flex items-center justify-center p-1 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4 text-yellow-500 fill-current" />
                  ) : (
                    <Moon className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Global Navbar */}
        <nav
          aria-label="Global"
          className="mx-auto flex w-full max-w-7xl justify-between items-center px-4 py-2"
        >
          {isMobileSearchOpen ? (
            /* Mobile Search Bar Mode */
            <div className="flex w-full items-center gap-2 py-1 animate-fadeIn">
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for brands or categories..."
                  className="w-full rounded-xl bg-gray-100 dark:bg-gray-800 py-1.5 pl-9 pr-4 text-sm text-gray-900 dark:text-gray-50 border border-transparent focus:border-blue-500 focus:outline-hidden transition-all"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      triggerToast(`Searching for "${e.target.value}"...`);
                      setIsMobileSearchOpen(false);
                    }
                  }}
                />
              </div>
              <button
                onClick={() => setIsMobileSearchOpen(false)}
                className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-xs font-semibold px-2 py-1"
              >
                Cancel
              </button>
            </div>
          ) : (
            /* Standard Logo and Actions Row */
            <>
              {/* Logo */}
              <div className="flex flex-none items-center pr-4">
                <Link to="/" className="flex flex-col group">
                  <img
                    src={config.logo}
                    alt={config.logoAlt}
                    className="mt-0 h-20 w-auto sm:h-24 md:h-28 object-contain hover:scale-105 transition-transform duration-300 drop-shadow-sm hover:drop-shadow-md"
                  />
                </Link>
              </div>

              {/* Desktop Search Bar */}
              <div className="hidden md:block flex-1 max-w-md mx-6">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for brands or categories"
                    className="w-full rounded-xl bg-gray-100 dark:bg-gray-800 py-1.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-500 focus:outline-hidden dark:text-gray-50 dark:placeholder:text-gray-500 transition-colors border border-transparent focus:border-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        triggerToast(`Searching for "${e.target.value}"...`);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Actions: Connect Wallet, Mobile Search, Profile, Cart */}
              <div className="flex items-center space-x-2.5">
                {/* Connect Wallet (Desktop) */}
                <WalletButton />

                {/* Connect Wallet (Mobile) */}
                <WalletButton variant="mobile" />

                {/* Mobile Search Button */}
                <button
                  aria-label="Search product"
                  onClick={() => setIsMobileSearchOpen(true)}
                  className="md:hidden cursor-pointer flex justify-center items-center rounded-xl bg-gray-100 hover:bg-gray-200 h-[38px] w-[38px] dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                >
                  <Search className="w-4.5 h-4.5" />
                </button>

                {/* Profile Button */}
                <button
                  aria-label="Login and account"
                  onClick={() => triggerToast("User Account system is coming soon!")}
                  className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                >
                  <User className="w-4.5 h-4.5" />
                </button>

                {/* Cart Button */}
                <button
                  aria-label="Open shopping cart"
                  onClick={openCart}
                  className="relative bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 group flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-xl text-gray-600 dark:text-gray-300 transition-colors"
                >
                  <ShoppingCart className="w-4.5 h-4.5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center px-1">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </button>
              </div>
            </>
          )}
        </nav>
      </div>
      {/* Spacer — height matches the actual sticky navbar so content never overlaps */}
      <div style={{ height: navHeight }} />
    </div>
  );
}
