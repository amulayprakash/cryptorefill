import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, SlidersHorizontal, Zap, X } from 'lucide-react';
import { products } from '../data/products';
import Header from '../components/Header';
import Footer from '../components/Footer';

const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

export default function AllProducts() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const initialCategory = searchParams.get('category') || 'All';
  const [activeCategory, setActiveCategory] = useState(
    categories.includes(initialCategory) ? initialCategory : 'All'
  );

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors">
      <Header />

      {/* Page Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #1e40af 100%)',
        }}
        className="relative overflow-hidden pt-10 pb-16 px-4"
      >
        {/* Decorative blobs */}
        <div
          style={{
            position: 'absolute', top: '-60px', right: '-60px',
            width: '300px', height: '300px', borderRadius: '50%',
            background: 'rgba(99,102,241,0.25)', filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute', bottom: '-40px', left: '-40px',
            width: '200px', height: '200px', borderRadius: '50%',
            background: 'rgba(59,130,246,0.3)', filter: 'blur(50px)',
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm font-semibold mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
            All Gift Cards
          </h1>
          <p className="text-blue-200 text-base sm:text-lg max-w-xl">
            {products.length} products available — buy instantly with Bitcoin, Ethereum & more crypto.
          </p>

          {/* Search Bar */}
          <div className="mt-8 relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-gray-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-xl"
              style={{ background: 'rgba(255,255,255,0.95)' }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category Filters */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200"
              style={
                activeCategory === cat
                  ? {
                      background: 'linear-gradient(135deg, #1e40af, #6366f1)',
                      color: 'white',
                      borderColor: 'transparent',
                      boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                    }
                  : {
                      background: 'transparent',
                      color: 'var(--cat-text, #6b7280)',
                      borderColor: '#e5e7eb',
                    }
              }
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-sm text-gray-400 font-medium">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No products found</p>
            <p className="text-gray-400 text-sm">Try a different search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} navigate={navigate} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

function ProductCard({ product, navigate }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="cursor-pointer group rounded-2xl overflow-hidden border transition-all duration-300"
      style={{
        borderColor: hovered ? 'rgba(99,102,241,0.4)' : '#e5e7eb',
        boxShadow: hovered
          ? '0 16px 40px rgba(99,102,241,0.18)'
          : '0 1px 4px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        background: hovered
          ? 'linear-gradient(160deg, #f8faff 0%, #f0f4ff 100%)'
          : 'white',
      }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: '16/10', background: '#f3f4f6' }}
      >
        <img
          src={`/${product.imageUrl}`}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
          onError={e => {
            e.target.onerror = null;
            e.target.src = '/assets/placeholder_mockup.png';
          }}
        />
        {/* Category badge */}
        <span
          className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
          style={{ background: 'rgba(30,64,175,0.85)', backdropFilter: 'blur(6px)' }}
        >
          {product.category}
        </span>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <p className="font-bold text-sm text-gray-900 truncate mb-0.5">{product.name}</p>
        <p className="text-xs text-gray-500 font-medium mb-2">{product.priceRange}</p>

        <div
          className="flex items-center gap-1 text-[10px] font-bold transition-all duration-200"
          style={{ color: hovered ? '#1e40af' : '#9ca3af' }}
        >
          <Zap className="w-3 h-3" />
          Instant delivery
        </div>
      </div>

      {/* Buy CTA that appears on hover */}
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: hovered ? '48px' : '0' }}
      >
        <div
          className="mx-3.5 mb-3.5 rounded-xl py-2 text-center text-xs font-bold text-white"
          style={{
            background: 'linear-gradient(135deg, #1e40af, #6366f1)',
          }}
        >
          Buy with Crypto →
        </div>
      </div>
    </div>
  );
}
