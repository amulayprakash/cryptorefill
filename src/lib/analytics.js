import { supabase } from './supabaseClient';
import { getSourceDomain } from '../config/domains';

const VISITOR_KEY = 'qg_visitor_id';

// Persistent per-browser id so daily/lifetime unique-visitor counts are meaningful.
export function getVisitorId() {
  if (typeof window === 'undefined') return 'server';
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function trackEvent(eventType, extra = {}) {
  try {
    const payload = {
      session_id: getVisitorId(),
      event_type: eventType,
      page_path: typeof window !== 'undefined' ? window.location.pathname : null,
      source_domain: getSourceDomain(),
      referrer: typeof document !== 'undefined' ? document.referrer || null : null,
      ...extra,
    };
    supabase
      .from('analytics_events')
      .insert(payload)
      .then(({ error }) => {
        if (error) console.error('[analytics] trackEvent failed:', error);
      });
  } catch (err) {
    console.error('[analytics] trackEvent error:', err);
  }
}
