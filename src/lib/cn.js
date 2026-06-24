// Minimal classNames helper. Tailwind is loaded via CDN in index.html, so
// arbitrary values resolve at runtime and we don't need tailwind-merge.
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
