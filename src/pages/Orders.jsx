import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { Link } from 'react-router-dom';
import { Package, ExternalLink, Calendar, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabaseClient';

export default function Orders() {
  const { address: evmAddress } = useAccount();
  const { address: tronAddress } = useWallet();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mockConnected, setMockConnected] = useState(false);

  // We consider whichever wallet is connected
  const activeAddress = mockConnected ? '0xTESTINGWALLETADDRESS12345' : (evmAddress || tronAddress);

  useEffect(() => {
    if (!activeAddress) {
      Promise.resolve().then(() => setOrders([]));
      return;
    }

    setLoading(true);
    supabase
      .from('orders')
      .select('*')
      .eq('wallet_address', activeAddress)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setOrders(data);
        }
        setLoading(false);
      });
  }, [activeAddress]);

  const truncate = (str, front = 6, back = 4) =>
    str ? `${str.slice(0, front)}…${str.slice(-back)}` : '';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">My Orders</h1>

        {!activeAddress ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Connect Your Wallet</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Please connect your wallet to view your order history.
            </p>
            <button
              onClick={() => setMockConnected(true)}
              className="inline-block px-6 py-3 rounded-xl font-bold text-gray-900 bg-gray-200 text-sm shadow-md transition-all"
            >
              [TESTING] Bypass Connect
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
            <p className="text-sm font-semibold text-gray-500">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Orders Found</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Looks like you haven't placed any orders with this wallet yet.
            </p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 rounded-xl font-bold text-white text-sm shadow-md hover:shadow-lg transition-all"
              style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const items = order.items || [];
              const date = new Date(order.created_at).toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric',
              });

              const explorerBase =
                order.network === 'tron'
                  ? 'https://tronscan.org/#/transaction/'
                  : 'https://etherscan.io/tx/';

              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-all hover:shadow-md"
                >
                  {/* Order Header */}
                  <div className="bg-gray-50 dark:bg-gray-800/80 px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-6">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Order Placed</p>
                        <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900 dark:text-white">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {date}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total</p>
                        <p className="text-sm font-extrabold text-blue-600 dark:text-blue-400">{Number(order.total_usdt).toFixed(2)} USDT</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                        order.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {order.status || 'Processing'}
                      </span>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      {/* Items */}
                      <div className="flex-1 space-y-4">
                        {items.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center shrink-0">
                               <Package className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">{item.product_name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Qty: {item.quantity} · ${item.selected_price} each
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Details & Tx */}
                      <div className="md:w-64 shrink-0 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700 space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Order ID</p>
                          <p className="text-xs font-mono text-gray-700 dark:text-gray-300 select-all">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Network</p>
                          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 capitalize">{order.network || 'Ethereum'}</p>
                        </div>
                        {order.tx_hash && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Transaction</p>
                            <a
                              href={`${explorerBase}${order.tx_hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {truncate(order.tx_hash)}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
