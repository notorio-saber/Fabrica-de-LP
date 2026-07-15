const IGNORED_HOSTS = new Set(['localhost', '127.0.0.1']);

// Platform domains that host the app itself, not an affiliate subdomain
// (e.g. Netlify's own preview/production URLs, or a bare custom apex domain
// added later). A hostname ending in one of these is never a slug source.
const PLATFORM_SUFFIXES = ['.netlify.app', '.netlify.live'];

export function resolveSlug(hostname: string, paramSlug?: string): string | null {
  if (paramSlug) return paramSlug;

  if (IGNORED_HOSTS.has(hostname) || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return null;
  }

  if (PLATFORM_SUFFIXES.some((suffix) => hostname.endsWith(suffix))) {
    return null;
  }

  const parts = hostname.split('.');
  if (parts.length > 2 && parts[0] !== 'www') {
    return parts[0];
  }

  return null;
}
