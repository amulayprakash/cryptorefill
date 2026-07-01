/**
 * domains.js — Multi-domain branding configuration
 *
 * Each key is an exact hostname (no protocol, no trailing slash).
 * Add a new domain by duplicating an existing block and adjusting values.
 * The `__default__` entry is used when no hostname matches.
 *
 * Logo paths are relative to the /public folder.
 * CSS custom properties are injected into :root by DomainContext.
 */

export const DOMAIN_CONFIGS = {
  // ── maddeals.store ─────────────────────────────────────────────────────────
  'maddeals.store': {
    /** Displayed name used in title tag, footer, etc. */
    name: 'Mad Deals',
    /** Path to logo image (must exist in /public) */
    logo: '/logo.png',
    /** Alt text for the logo image */
    logoAlt: 'Mad Deals Logo',
    /** Browser favicon (must exist in /public) */
    favicon: '/favicon.ico',
    /** Short tagline shown under the logo in the footer */
    tagline: 'Trusted since 2018',
    /** Version string shown in footer */
    version: '2.0.3180',
    /** Copyright holder name shown in footer */
    footerCompany: 'Mad Deals',
    /** Copyright year */
    copyrightYear: '2026',
    /**
     * CSS custom properties injected into :root.
     * Use these in your CSS as var(--brand-primary) etc.
     */
    cssVars: {
      '--brand-primary': '#C5A059',
      '--brand-accent': '#1a1a2e',
      '--selection-bg': '#C5A059',
    },
    /** Social links shown in the footer bottom bar */
    socialLinks: {
      facebook: '#',
      twitter: '#',
      instagram: '#',
      telegram: '#',
    },
    /** Footer column – Company links */
    companyLinks: [
      'Mad Deals labs',
      'Careers',
      'Press and media',
      'Trust and safety',
      'About',
    ],
  },

  // ── localhost (development) ─────────────────────────────────────────────────
  // Localhost falls through to __default__ unless you override it here.
  // Uncomment and customise if you want a specific dev experience:
  // 'localhost': { ...DOMAIN_CONFIGS['maddeals.store'] },

  // ── Add more domains below ──────────────────────────────────────────────────
  // 'example-brand.com': {
  //   name: 'Example Brand',
  //   logo: '/logo-example.png',
  //   logoAlt: 'Example Brand Logo',
  //   favicon: '/favicon-example.ico',
  //   tagline: 'Your tagline here',
  //   version: '1.0.0',
  //   footerCompany: 'Example Brand Inc.',
  //   copyrightYear: '2026',
  //   cssVars: {
  //     '--brand-primary': '#3B82F6',
  //     '--brand-accent': '#0f172a',
  //     '--selection-bg': '#3B82F6',
  //   },
  //   socialLinks: {
  //     facebook: '#',
  //     twitter: '#',
  //     instagram: '#',
  //     telegram: '#',
  //   },
  //   companyLinks: [
  //     'Example Brand labs',
  //     'Careers',
  //     'Press and media',
  //     'Trust and safety',
  //     'About',
  //   ],
  // },

  // ── Fallback (unknown / new domains) ───────────────────────────────────────
  __default__: {
    name: 'Mad Deals',
    logo: '/logo.png',
    logoAlt: 'Mad Deals Logo',
    favicon: '/favicon.ico',
    tagline: 'Trusted since 2018',
    version: '2.0.3180',
    footerCompany: 'Mad Deals',
    copyrightYear: '2026',
    cssVars: {
      '--brand-primary': '#C5A059',
      '--brand-accent': '#1a1a2e',
      '--selection-bg': '#C5A059',
    },
    socialLinks: {
      facebook: '#',
      twitter: '#',
      instagram: '#',
      telegram: '#',
    },
    companyLinks: [
      'Mad Deals labs',
      'Careers',
      'Press and media',
      'Trust and safety',
      'About',
    ],
  },
};

/**
 * Returns the branding config for the current domain.
 * Falls back to __default__ if the hostname is not in DOMAIN_CONFIGS.
 *
 * @param {string} [hostname] - override hostname (defaults to window.location.hostname)
 * @returns {object} domain config object
 */
export function getDomainConfig(hostname) {
  const host = hostname ?? (typeof window !== 'undefined' ? window.location.hostname : '__default__');
  return DOMAIN_CONFIGS[host] ?? DOMAIN_CONFIGS['__default__'];
}

/**
 * Returns the bare hostname string to store in the DB as source_domain.
 * @returns {string}
 */
export function getSourceDomain() {
  return typeof window !== 'undefined' ? window.location.hostname : 'unknown';
}
