import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, ExternalLink, Package, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabaseClient';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order');
  const txHash = searchParams.get('tx');
  const network = searchParams.get('network');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(!!orderId);

  useEffect(() => {
    if (!orderId) return;
    supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()
      .then(({ data }) => {
        setOrder(data);
        setLoading(false);
      });
  }, [orderId]);

  const explorerBase =
    network === 'tron'
      ? 'https://tronscan.org/#/transaction/'
      : 'https://etherscan.io/tx/';

  const networkLabel = network === 'tron' ? 'TRON' : 'Ethereum';

  const truncate = (str, front = 10, back = 6) =>
    str ? `${str.slice(0, front)}…${str.slice(-back)}` : '';

  if (!txHash) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
          <Package className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-4" />
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Order Not Found</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">We couldn't find this order. Please check your transaction history.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}
          >
            Go Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const items = order?.items || [];
  const totalUsdt = order?.total_usdt || null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors">
      <Header />

      <div className="max-w-lg mx-auto px-4 py-12">
        {/* Success card */}
        <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl overflow-hidden">
          {/* Green header */}
          <div className="bg-green-50 dark:bg-green-950/30 px-6 py-8 text-center border-b border-green-100 dark:border-green-900/40">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 text-green-500" />
              </div>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">Order Confirmed!</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your payment was received successfully. Your order is being processed.
            </p>
          </div>

          {/* Details */}
          <div className="px-6 py-5 space-y-4">
            {/* Order ID */}
            {orderId && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order ID</span>
                <span className="text-xs font-mono text-gray-700 dark:text-gray-300">{truncate(orderId, 12, 8)}</span>
              </div>
            )}

            {/* Network */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Network</span>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{networkLabel}</span>
            </div>

            {/* Total */}
            {totalUsdt && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount Paid</span>
                <span className="text-sm font-extrabold text-green-600 dark:text-green-400">{Number(totalUsdt).toFixed(2)} USDT</span>
              </div>
            )}

            {/* Transaction hash */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transaction</span>
              <a
                href={`${explorerBase}${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                {truncate(txHash)}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Items list */}
            {!loading && items.length > 0 && (
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Items</p>
                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.product_name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">${item.selected_price} × {item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">${Number(item.line_total).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="px-6 pb-6">
            <Link
              to="/products"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all"
              style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
            >
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
