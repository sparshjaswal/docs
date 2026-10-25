/** Resolve old fragments before adding the site's base URL. */
export function resolveDocRedirect(
  to: string,
  search: string,
  hash: string,
  hashTargets?: Record<string, string>,
): string {
  if (!hashTargets) return `${to}${search}${hash}`;

  let key: string;
  try {
    key = decodeURIComponent(hash.replace(/^#/, ''));
  } catch {
    key = '';
  }
  const target = Object.hasOwn(hashTargets, key) ? hashTargets[key] : to;
  const separator = target.indexOf('#');
  const pathname = separator < 0 ? target : target.slice(0, separator);
  const fragment = separator < 0 ? '' : target.slice(separator);
  return `${pathname}${search}${fragment}`;
}
