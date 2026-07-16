/*
 * Docusaurus client module: Sidebar and Breadcrumb behavior
 * - Ensures unrelated sidebar categories are collapsed on navigation
 * - Expands the active category path
 * - (Optional) closes the mobile sidebar drawer after navigation
 * - Makes the last breadcrumb clickable (including the current page)
 * - Leverages robust selectors for Docusaurus v2/v3 themes
 */

// Small utility: run after DOM updates
function defer(fn: () => void, delay = 0) {
  window.setTimeout(fn, delay);
}

function isHTMLElement(node: Element | null): node is HTMLElement {
  return !!node && node instanceof HTMLElement;
}

function getSidebarRoot(): HTMLElement | null {
  // Primary sidebar menu container
  const el = document.querySelector('.theme-doc-sidebar-menu');
  return isHTMLElement(el) ? el : null;
}

function collapseAllCategories(root: HTMLElement) {
  const buttons = Array.from(
    root.querySelectorAll<HTMLButtonElement>('button[aria-expanded]')
  );
  for (const btn of buttons) {
    btn.setAttribute('aria-expanded', 'false');
  }
}

function expandAncestorsOf(el: Element) {
  let node: Element | null = el;
  while (node) {
    if (
      node instanceof HTMLElement &&
      node.classList.contains('theme-doc-sidebar-item-category')
    ) {
      const btn = node.querySelector<HTMLButtonElement>('button[aria-expanded]');
      if (btn) btn.setAttribute('aria-expanded', 'true');
    }
    node = node.parentElement;
  }
}

function applySidebarState() {
  const root = getSidebarRoot();
  if (!root) return;

  // 1) Collapse everything first
  collapseAllCategories(root);

  // 2) Find the active page link inside the sidebar
  const activeLink =
    root.querySelector<HTMLAnchorElement>('a.menu__link--active, a[aria-current="page"]') ||
    // Fallback: some themes mark active with aria-current only
    root.querySelector<HTMLAnchorElement>('a[aria-current="true"], a[aria-current="location"]');

  if (activeLink) {
    // 3) Expand only the ancestors of the active link
    expandAncestorsOf(activeLink);
  }
}

function closeMobileSidebarIfOpen() {
  // Docusaurus uses a body class when the mobile sidebar is open
  if (document.body.classList.contains('navbar-sidebar--show')) {
    const backdrop = document.querySelector<HTMLElement>('.navbar-sidebar__backdrop');
    if (backdrop) {
      backdrop.click();
    } else {
      // Fallback: remove the class to avoid trapping focus
      document.body.classList.remove('navbar-sidebar--show');
    }
  }
}

function onNavOrBreadcrumbInteraction() {
  // Re-apply after a short delay to allow the new route to mount
  defer(() => {
    applySidebarState();
    closeMobileSidebarIfOpen();
  }, 50);
}

const BC_SELECTOR = 'nav[aria-label="Breadcrumbs"].breadcrumbs, nav[aria-label="Breadcrumbs"]';

// Track which breadcrumb navs have been enhanced without mutating DOM nodes
const enhancedBreadcrumbs = new WeakSet<HTMLElement>();

function makeLastBreadcrumbClickable() {
  const bcRoots = document.querySelectorAll<HTMLElement>(BC_SELECTOR);
  if (!bcRoots.length) return;

  bcRoots.forEach((bcRoot) => {
    const items = bcRoot.querySelectorAll('li.breadcrumbs__item');
    if (!items.length) return;
    const last = items[items.length - 1] as HTMLElement;

    // Skip if already clickable
    if (last.querySelector('a')) return;

    const label = last.querySelector<HTMLElement>('span, a, .breadcrumbs__link');
    if (!label) return;

    const a = document.createElement('a');
    a.href = window.location.pathname + window.location.search + window.location.hash;
    a.className = 'breadcrumbs__link';
    a.setAttribute('aria-current', 'page');

    // Move all child nodes to the anchor to preserve text and any icons
    while (label.firstChild) {
      a.appendChild(label.firstChild);
    }
    label.replaceWith(a);
  });
}

function wireBreadcrumbClicks() {
  // There might be multiple breadcrumb navs across layouts; wire each once.
  const bcRoots = document.querySelectorAll<HTMLElement>(BC_SELECTOR);
  if (!bcRoots.length) return;

  bcRoots.forEach((bcRoot) => {
    // Avoid duplicate listeners across route updates
    if (enhancedBreadcrumbs.has(bcRoot)) return;

    bcRoot.addEventListener(
      'click',
      (e: Event) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;
        const link = target.closest('a');
        if (link && bcRoot.contains(link)) {
          // Let navigation happen; schedule sidebar update
          onNavOrBreadcrumbInteraction();
        }
      },
      { capture: true }
    );
    enhancedBreadcrumbs.add(bcRoot);
  });
}

export function onRouteDidUpdate() {
  // Apply on any route change
  defer(() => {
    applySidebarState();
    wireBreadcrumbClicks();
    makeLastBreadcrumbClickable();
    // If route came from a sidebar click on mobile, ensure drawer closes
    closeMobileSidebarIfOpen();
  }, 0);
}
