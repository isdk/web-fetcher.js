import { FetchEngine } from "../engine/base";
import { FetchContext } from "./context";
import { BaseFetcherProperties, FetchResponse, FetchSite } from "./types";

export async function maybeCreateEngine(ctx: FetchContext, args?: { url?: string }) {
  const url = args?.url || ctx.url;
  const matched = pickSiteMatched(url, ctx.sites);
  const enginePref = (ctx.engine || matched?.engine || 'auto') as BaseFetcherProperties['engine'];

  let result = await FetchEngine.create(ctx, { engine: enginePref });
  if (!result) {
    result = await FetchEngine.create(ctx, { engine: 'http' });
  }
  return result;
}

export async function ensureSmartUpgradeIfNeeded(ctx: FetchContext, res: FetchResponse) {
  if (!ctx.enableSmart) return false;
  // already browser engine
  if (ctx.internal.engine?.mode === 'browser') return true;
  // 简单规则：403/401/5xx 或 明显需要JS，触发升级
  if (smartShouldUseBrowser(res)) {
    // 释放旧引擎，切换浏览器引擎并重试
    await ctx.internal.engine?.dispose?.();
    const engine = await FetchEngine.create(ctx, {engine: 'browser'});
    ctx.eventBus.emit('context:engine:upgraded', { to: 'browser' });
    return engine;
  }
  return false;
}

export function isProbablyDynamicHtml(body: string) {
  const patterns = [
    '__NUXT__', '__NEXT_DATA__', 'id="__NEXT"', 'data-reactroot', 'data-hydration', 'ng-version',
    'window.__APOLLO_STATE__', 'webpackJsonp', 'vite', 'requirejs', 'System.register',
    'Please enable JavaScript', 'enable-javascript', 'captcha', 'Cloudflare',
  ];
  return patterns.some(p => body.includes(p));
}

export function smartShouldUseBrowser(res: FetchResponse) {
  if (res.statusCode! >= 500 || res.statusCode! === 401 || res.statusCode! === 403) return true;
  if (!res.contentType) return false;
  if (res.contentType.includes('text/html')) {
    if (isProbablyDynamicHtml(res.html!)) return true;
  }
  return false;
}

export function pickSiteMatched(url?: string, sites?: FetchSite[]) {
  if (!url || !sites?.length) return null;
  const u = new URL(url);
  // 简易匹配：domain 完整匹配或后缀匹配
  let matched = sites.find(s => s.domain === u.hostname);
  if (!matched) matched = sites.find(s => u.hostname.endsWith(s.domain));
  if (!matched) return null;
  if (matched.pathScope?.length) {
    const ok = matched.pathScope.some(p => u.pathname.startsWith(p));
    if (!ok) return null;
  }
  return matched;
}
