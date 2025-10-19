export function absoluteUrlFrom(base: string, maybeRelative: string) {
  try {
    return new URL(maybeRelative, base).toString();
  } catch {
    return maybeRelative;
  }
}

export function isProbablyDynamicHtml(body: string) {
  // 一些常见 SPA/SSR 线索
  const patterns = [
    '__NUXT__', '__NEXT_DATA__', 'id="__NEXT"', 'data-reactroot', 'data-hydration', 'ng-version',
    'window.__APOLLO_STATE__', 'webpackJsonp', 'vite', 'requirejs', 'System.register',
    'Please enable JavaScript', 'enable-javascript', 'captcha', 'Cloudflare',
  ];
  return patterns.some(p => body.includes(p));
}

export function isHref(value: string) {
  return /^https?:\/\//i.test(value) || !value.startsWith('/') || value.startsWith('?')
}
