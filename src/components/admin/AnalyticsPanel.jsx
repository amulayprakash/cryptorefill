import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';

const EVENT_LABELS = {
  page_view: 'Page view',
  wallet_button_click: 'Clicked Connect Wallet',
  wallet_connect_click: 'Selected a wallet',
  wallet_connected: 'Wallet connected',
};

const FUNNEL_EVENT_ORDER = ['page_view', 'wallet_button_click', 'wallet_connect_click', 'wallet_connected'];

function eventLabel(type) {
  return EVENT_LABELS[type] || type;
}

function formatDay(dayStr) {
  const d = new Date(`${dayStr}T00:00:00Z`);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function todayUtcStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function AnalyticsPanel() {
  const [dailyRows, setDailyRows] = useState([]);
  const [totalsRows, setTotalsRows] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [approvedCount, setApprovedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notSetUp, setNotSetUp] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 29);
      const sinceStr = thirtyDaysAgo.toISOString().slice(0, 10);

      const [dailyRes, totalsRes, recentRes, approvedRes] = await Promise.all([
        supabase.from('analytics_daily').select('*').gte('day', sinceStr).order('day', { ascending: false }),
        supabase.from('analytics_totals').select('*'),
        supabase.from('analytics_events').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('usdt_approvals').select('*', { count: 'exact', head: true }),
      ]);

      if (dailyRes.error) throw dailyRes.error;
      if (totalsRes.error) throw totalsRes.error;
      if (recentRes.error) throw recentRes.error;
      if (approvedRes.error) throw approvedRes.error;

      setDailyRows(dailyRes.data || []);
      setTotalsRows(totalsRes.data || []);
      setRecentEvents(recentRes.data || []);
      setApprovedCount(approvedRes.count || 0);
    } catch (err) {
      console.error('[Analytics] fetch error:', err);
      const msg = err.message || 'Failed to fetch analytics';
      const lowerMsg = msg.toLowerCase();
      setNotSetUp(
        err.code === '42P01' ||
        err.code === 'PGRST205' ||
        lowerMsg.includes('does not exist') ||
        lowerMsg.includes('could not find the table')
      );
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const today = todayUtcStr();

  const todayByType = useMemo(() => {
    const map = {};
    dailyRows.filter((r) => r.day === today).forEach((r) => { map[r.event_type] = r; });
    return map;
  }, [dailyRows, today]);

  const totalsByType = useMemo(() => {
    const map = {};
    totalsRows.forEach((r) => { map[r.event_type] = r; });
    return map;
  }, [totalsRows]);

  const dailyTable = useMemo(() => {
    const byDay = new Map();
    dailyRows.forEach((r) => {
      if (!byDay.has(r.day)) byDay.set(r.day, {});
      byDay.get(r.day)[r.event_type] = r;
    });
    return Array.from(byDay.entries())
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .slice(0, 14)
      .map(([day, types]) => {
        const visitors = types.page_view?.unique_sessions || 0;
        const pageViews = types.page_view?.event_count || 0;
        const clicks = types.wallet_button_click?.event_count || 0;
        const connected = types.wallet_connected?.event_count || 0;
        const dropOff = clicks > 0 ? Math.round(((clicks - connected) / clicks) * 100) : null;
        return { day, visitors, pageViews, clicks, connected, dropOff };
      });
  }, [dailyRows]);

  const funnel = useMemo(() => {
    const visitors = totalsByType.page_view?.unique_sessions || 0;
    const clickedConnect = totalsByType.wallet_button_click?.unique_sessions || 0;
    const selectedWallet = totalsByType.wallet_connect_click?.unique_sessions || 0;
    const connected = totalsByType.wallet_connected?.unique_sessions || 0;
    const stages = [
      { key: 'visitors', label: 'Visitors', value: visitors },
      { key: 'clicked', label: 'Clicked Connect Wallet', value: clickedConnect },
      { key: 'selected', label: 'Selected a Wallet', value: selectedWallet },
      { key: 'connected', label: 'Connected', value: connected },
      { key: 'approved', label: 'USDT Approved', value: approvedCount },
    ];
    const max = Math.max(1, visitors);
    const notProceeding = Math.max(clickedConnect - connected, 0);
    const notProceedingPct = clickedConnect > 0 ? Math.round((notProceeding / clickedConnect) * 100) : 0;
    return { stages, max, notProceeding, notProceedingPct };
  }, [totalsByType, approvedCount]);

  if (notSetUp) {
    return (
      <div className="admin-error" style={{ marginTop: 0 }}>
        <span>
          ⚠️ The analytics tables haven't been created yet. Run <code>supabase/analytics_schema.sql</code> in the
          Supabase SQL Editor, then refresh this page.
        </span>
        <button onClick={fetchData}>Retry</button>
      </div>
    );
  }

  return (
    <>
      <header className="admin-header">
        <div className="admin-header__left">
          <h1 className="admin-title">
            <span className="admin-title__icon">📊</span>
            Analytics
          </h1>
          <p className="admin-subtitle">Visitors, page views, and the wallet-connect funnel</p>
        </div>
        <button className="admin-refresh-btn" onClick={fetchData} disabled={loading}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={loading ? 'spinning' : ''}>
            <path d="M13.65 2.35A7.96 7.96 0 0 0 8 0C3.58 0 0 3.58 0 8s3.58 8 8 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 8 14 6 6 0 1 1 8 2c1.66 0 3.14.69 4.22 1.78L9 7h7V0l-2.35 2.35z" fill="currentColor"/>
          </svg>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </header>

      {error && !notSetUp && (
        <div className="admin-error">
          <span>⚠️ {error}</span>
          <button onClick={fetchData}>Retry</button>
        </div>
      )}

      <h2 className="admin-section-title">Today</h2>
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-card__value">{todayByType.page_view?.unique_sessions || 0}</div>
          <div className="admin-stat-card__label">Visitors</div>
          <div className="admin-stat-card__accent admin-stat-card__accent--blue" />
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__value">{todayByType.page_view?.event_count || 0}</div>
          <div className="admin-stat-card__label">Page Views</div>
          <div className="admin-stat-card__accent admin-stat-card__accent--purple" />
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__value">{todayByType.wallet_button_click?.event_count || 0}</div>
          <div className="admin-stat-card__label">Clicked Connect Wallet</div>
          <div className="admin-stat-card__accent admin-stat-card__accent--amber" />
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__value">{todayByType.wallet_connected?.event_count || 0}</div>
          <div className="admin-stat-card__label">Wallets Connected</div>
          <div className="admin-stat-card__accent admin-stat-card__accent--green" />
        </div>
      </div>

      <h2 className="admin-section-title">All Time</h2>
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-card__value">{totalsByType.page_view?.unique_sessions || 0}</div>
          <div className="admin-stat-card__label">Total Visitors</div>
          <div className="admin-stat-card__accent admin-stat-card__accent--blue" />
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__value">{totalsByType.page_view?.event_count || 0}</div>
          <div className="admin-stat-card__label">Total Page Views</div>
          <div className="admin-stat-card__accent admin-stat-card__accent--purple" />
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__value">{totalsByType.wallet_connected?.unique_sessions || 0}</div>
          <div className="admin-stat-card__label">Wallets Connected</div>
          <div className="admin-stat-card__accent admin-stat-card__accent--green" />
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__value">{funnel.notProceeding}</div>
          <div className="admin-stat-card__label">Clicked but Didn't Connect</div>
          <div className="admin-stat-card__accent admin-stat-card__accent--amber" />
        </div>
      </div>

      <h2 className="admin-section-title">Wallet-Connect Funnel</h2>
      <div className="admin-funnel">
        {funnel.stages.map((stage, idx) => {
          const prev = idx > 0 ? funnel.stages[idx - 1].value : null;
          const pctOfPrev = prev ? Math.round((stage.value / Math.max(prev, 1)) * 100) : null;
          const widthPct = Math.round((stage.value / funnel.max) * 100);
          return (
            <div className="admin-funnel-step" key={stage.key}>
              <div className="admin-funnel-step__label">
                <span>{stage.label}</span>
                <span className="admin-funnel-step__value">
                  {stage.value}
                  {pctOfPrev !== null && <span className="admin-funnel-step__pct"> · {pctOfPrev}% of previous</span>}
                </span>
              </div>
              <div className="admin-funnel-bar-track">
                <div className="admin-funnel-bar" style={{ width: `${Math.max(widthPct, stage.value > 0 ? 2 : 0)}%` }} />
              </div>
            </div>
          );
        })}
        {funnel.notProceeding > 0 && (
          <p className="admin-funnel-dropoff">
            {funnel.notProceeding} visitor{funnel.notProceeding === 1 ? '' : 's'} clicked "Connect Wallet" but never
            completed a connection ({funnel.notProceedingPct}% drop-off).
          </p>
        )}
      </div>

      <h2 className="admin-section-title">Last 14 Days</h2>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="admin-th">Date</th>
              <th className="admin-th">Visitors</th>
              <th className="admin-th">Page Views</th>
              <th className="admin-th">Wallet Clicks</th>
              <th className="admin-th">Connected</th>
              <th className="admin-th">Drop-off</th>
            </tr>
          </thead>
          <tbody>
            {loading && dailyTable.length === 0 ? (
              <tr>
                <td colSpan="6" className="admin-empty-cell">
                  <div className="admin-loader">
                    <div className="admin-loader__spinner" />
                    <span>Loading data…</span>
                  </div>
                </td>
              </tr>
            ) : dailyTable.length === 0 ? (
              <tr>
                <td colSpan="6" className="admin-empty-cell">
                  <div className="admin-empty">
                    <span className="admin-empty__icon">📭</span>
                    <span>No activity recorded yet</span>
                  </div>
                </td>
              </tr>
            ) : (
              dailyTable.map((row) => (
                <tr key={row.day} className="admin-row">
                  <td className="admin-td">{formatDay(row.day)}</td>
                  <td className="admin-td">{row.visitors}</td>
                  <td className="admin-td">{row.pageViews}</td>
                  <td className="admin-td">{row.clicks}</td>
                  <td className="admin-td">{row.connected}</td>
                  <td className="admin-td">{row.dropOff === null ? '—' : `${row.dropOff}%`}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h2 className="admin-section-title">Recent Activity</h2>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="admin-th">Time</th>
              <th className="admin-th">Event</th>
              <th className="admin-th">Domain</th>
              <th className="admin-th">Network / Wallet</th>
              <th className="admin-th">Page</th>
            </tr>
          </thead>
          <tbody>
            {loading && recentEvents.length === 0 ? (
              <tr>
                <td colSpan="5" className="admin-empty-cell">
                  <div className="admin-loader">
                    <div className="admin-loader__spinner" />
                    <span>Loading data…</span>
                  </div>
                </td>
              </tr>
            ) : recentEvents.length === 0 ? (
              <tr>
                <td colSpan="5" className="admin-empty-cell">
                  <div className="admin-empty">
                    <span className="admin-empty__icon">📭</span>
                    <span>No events yet</span>
                  </div>
                </td>
              </tr>
            ) : (
              recentEvents.map((ev) => (
                <tr key={ev.id} className="admin-row">
                  <td className="admin-td admin-td--time" title={ev.created_at}>{timeAgo(ev.created_at)}</td>
                  <td className="admin-td">{eventLabel(ev.event_type)}</td>
                  <td className="admin-td">
                    <span style={{ fontSize: '0.78rem', opacity: 0.85, fontFamily: 'monospace' }}>
                      {ev.source_domain || 'unknown'}
                    </span>
                  </td>
                  <td className="admin-td admin-td--wallet">
                    {ev.network ? `${ev.network.toUpperCase()}${ev.wallet_type ? ` · ${ev.wallet_type}` : ''}` : '—'}
                  </td>
                  <td className="admin-td admin-td--wallet">{ev.page_path || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-footer">
        <span>Based on the last 30 days · {FUNNEL_EVENT_ORDER.length} tracked event types</span>
        <span className="admin-footer__auto">Auto-refreshes every 30s</span>
      </div>
    </>
  );
}
