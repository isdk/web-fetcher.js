export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return '';
  }
}

export function matchDomain(url: string, site: { domain: string; pathScope?: string[] }): boolean {
  const domain = extractDomain(url);
  if (!domain.endsWith(site.domain)) {
    return false;
  }

  if (!site.pathScope || site.pathScope.length === 0) {
    return true;
  }

  try {
    const parsed = new URL(url);
    return site.pathScope.some((scope) => parsed.pathname.startsWith(scope));
  } catch {
    return false;
  }
}

export function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.href;
  } catch(err) {
    console.error('Failed to normalize url:' + url, err)
    return url;
  }
}
