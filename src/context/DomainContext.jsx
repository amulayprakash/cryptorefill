import { createContext, useContext, useEffect, useMemo } from 'react';
import { getDomainConfig, getSourceDomain } from '../config/domains';

// ── Context ───────────────────────────────────────────────────────────────────

const DomainContext = createContext(null);

// ── Provider ──────────────────────────────────────────────────────────────────

/**
 * DomainProvider
 *
 * - Detects the current hostname and resolves the matching brand config.
 * - Injects CSS custom properties into :root so themed colors work globally.
 * - Updates the browser <title> and <link rel="icon">.
 * - Exposes the config and the raw source_domain string via useDomainConfig().
 */
export function DomainProvider({ children }) {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '__default__';
  const config = useMemo(() => getDomainConfig(hostname), [hostname]);
  const sourceDomain = useMemo(() => getSourceDomain(), []);

  // Inject CSS custom properties into :root
  useEffect(() => {
    if (!config.cssVars) return;
    const root = document.documentElement;
    Object.entries(config.cssVars).forEach(([prop, value]) => {
      root.style.setProperty(prop, value);
    });
  }, [config]);

  // Update <title>
  useEffect(() => {
    document.title = config.name;
  }, [config]);

  // Update <link rel="icon">
  useEffect(() => {
    if (!config.favicon) return;
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = config.favicon;
  }, [config]);

  const value = useMemo(
    () => ({ config, sourceDomain, hostname }),
    [config, sourceDomain, hostname]
  );

  return <DomainContext.Provider value={value}>{children}</DomainContext.Provider>;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * useDomainConfig()
 *
 * Returns { config, sourceDomain, hostname }
 *
 * config       — full branding config object for the current domain
 * sourceDomain — bare hostname string (e.g. "maddeals.store") to store in DB
 * hostname     — same as sourceDomain; provided for convenience
 *
 * @throws if used outside of <DomainProvider>
 */
export function useDomainConfig() {
  const ctx = useContext(DomainContext);
  if (!ctx) {
    throw new Error('useDomainConfig must be used within a <DomainProvider>');
  }
  return ctx;
}
