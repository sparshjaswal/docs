// Docusaurus client module to mount a navbar theme toggle button
// Uses the same tri-state schema and SVG icons as the homepage (dark/light/simple)

// This file only runs on the client

type ThemeKind = 'dark' | 'light' | 'simple';

const MOUNTED_ATTR = 'data-theme-toggle-mounted';

function getSavedTheme(): ThemeKind {
  try {
    const saved = (window.localStorage.getItem('hpTheme') as ThemeKind | null) ?? 'dark';
    if (saved === 'dark' || saved === 'light' || saved === 'simple') return saved;
  } catch { /* noop */ }
  return 'dark';
}

function saveTheme(t: ThemeKind) {
  try { window.localStorage.setItem('hpTheme', t); } catch { /* noop */ }
}

function applyTheme(t: ThemeKind) {

  try {
    const html = document.documentElement;
    // Custom attribute for any site-specific styling
    html.setAttribute('data-portfolio-theme', t);
    // Sync with Docusaurus expected attribute so syntax highlighting and theme tokens switch correctly
    html.setAttribute('data-theme', t === 'dark' ? 'dark' : 'light');
  } catch { /* noop */ }
  saveTheme(t);
}

function nextTheme(t: ThemeKind): ThemeKind {
  return t === 'dark' ? 'light' : t === 'light' ? 'simple' : 'dark';
}

function renderIcon(t: ThemeKind): string {
  switch (t) {
    case 'light':
      return `
<svg class="navThemeIcon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <defs>
    <radialGradient id="sunGrad" cx="0.5" cy="0.5">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="70%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#f97316" />
    </radialGradient>
  </defs>
  <circle cx="12" cy="12" r="4.5" fill="url(#sunGrad)" />
  <g stroke="#f59e0b" stroke-width="2.8" stroke-linecap="round">
    <line x1="12" y1="1" x2="12" y2="3.5" />
    <line x1="12" y1="20.5" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
    <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3.5" y2="12" />
    <line x1="20.5" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
    <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
  </g>
  <circle cx="12" cy="12" r="2" fill="#fcd34d" opacity="0.8" />
</svg>`;
    case 'simple':
      return `
<svg class="navThemeIcon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <defs>
    <linearGradient id="monitorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6b7280" />
      <stop offset="50%" stop-color="#4b5563" />
      <stop offset="100%" stop-color="#374151" />
    </linearGradient>
  </defs>
  <rect x="2" y="3.5" width="20" height="13" rx="2.5" stroke="#4b5563" stroke-width="2" fill="none" />
  <rect x="4" y="5.5" width="16" height="9" fill="url(#monitorGrad)" />
  <rect x="10" y="16.8" width="4" height="1.7" fill="#6b7280" />
  <rect x="8" y="18.8" width="8" height="1.7" fill="#4b5563" />
  <circle cx="6" cy="6.5" r="0.8" fill="#10b981" />
  <circle cx="8.5" cy="6.5" r="0.8" fill="#f59e0b" />
  <circle cx="11" cy="6.5" r="0.8" fill="#ef4444" />
  <rect x="13" y="7.5" width="6" height="0.7" fill="#9ca3af" rx="0.3" />
  <rect x="13" y="9" width="4" height="0.7" fill="#9ca3af" rx="0.3" />
</svg>`;
    default:
      return `
<svg class="navThemeIcon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <defs>
    <radialGradient id="moonGrad" cx="0.3" cy="0.3">
      <stop offset="0%" stop-color="#a78bfa" />
      <stop offset="100%" stop-color="#6366f1" />
    </radialGradient>
  </defs>
  <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" fill="url(#moonGrad)" stroke="#8b5cf6" stroke-width="1.5" />
  <circle cx="15.5" cy="7.5" r="1" fill="#fbbf24" opacity="0.9" />
  <circle cx="17.5" cy="10" r="0.7" fill="#fbbf24" opacity="0.7" />
  <circle cx="19" cy="6.5" r="0.4" fill="#fbbf24" opacity="0.8" />
</svg>`;
  }
}

function mountToggle() {
  let current: ThemeKind = getSavedTheme();
  applyTheme(current);

  const applyToEl = (el: HTMLElement) => {
    // Prevent re-initialization (which can cause MutationObserver feedback loops)
    if (el.getAttribute(MOUNTED_ATTR) === 'true') return;
    el.setAttribute(MOUNTED_ATTR, 'true');

    el.setAttribute('type', 'button');
    el.setAttribute('aria-label', 'Toggle site theme');
    el.innerHTML = renderIcon(current);
    el.onclick = () => {
      current = nextTheme(current);
      applyTheme(current);
      // Update icon only when user toggles, not during observer callbacks
      el.innerHTML = renderIcon(current);
    };
  };

  const ensureButton = (): HTMLElement => {
    let el = document.getElementById('nav-theme-toggle-btn') as HTMLElement | null;
    if (!el) {
      el = document.createElement('button');
      el.id = 'nav-theme-toggle-btn';
      el.className = 'nav-theme-toggle';
      // Append to body so it remains visible even when Navbar is hidden
      document.body.appendChild(el);
    }
    return el;
  };

  const tryMount = () => {


    const el = ensureButton();
    applyToEl(el);
  };

  // Initial attempt after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryMount, { once: true });
  } else {
    tryMount();
  }



  // Observe SPA route/nav replacements and ensure button stays mounted
  const obs = new MutationObserver(() => {



    const el = ensureButton();
    if (el.getAttribute(MOUNTED_ATTR) !== 'true') applyToEl(el);
  });
  obs.observe(document.body, { childList: true, subtree: true });
}

if (typeof window !== 'undefined') {
  try { mountToggle(); } catch { /* noop */ }
}
