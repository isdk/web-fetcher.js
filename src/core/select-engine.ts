import { FetchEngine } from '../engine/base'
import { FetchContext } from './context'
import {
  FetchResponse,
  FetchSite,
} from './types'
import { getRetryAfter } from '../utils'

export async function maybeCreateEngine(
  ctx: FetchContext,
  args?: { url?: string; engine?: string }
) {
  let result: FetchEngine | undefined

  // 1. Get engine preference: prioritize args, then context
  const enginePref = args?.engine || ctx.engine

  // 2. If a specific engine is requested (not 'auto')
  if (enginePref && enginePref !== 'auto') {
    // puppeteer 引擎尚未实现：与其在注册表中查不到后报笼统的初始化失败，
    // 不如直接给出明确的“未支持”错误，避免误导用户以为是环境问题。
    if (enginePref === 'puppeteer') {
      throw new Error(
        'Engine "puppeteer" is not supported yet; use "browser" (playwright) or "http" instead.'
      )
    }
    result = await FetchEngine.create(ctx, { engine: enginePref })
    if (!result) {
      throw new Error(
        `Engine "${enginePref}" is not available or failed to initialize.`
      )
    }
    return result
  }

  // 3. Handle 'auto' or unspecified engine
  const url = args?.url || ctx.url
  // 站点注册表开关：useSiteRegistry 为 false 时跳过匹配（默认 true）
  const matched = ctx.useSiteRegistry === false ? null : pickSiteMatched(url, ctx.sites)

  // 3a. Try to match engine from site registry
  if (matched?.engine && matched.engine !== 'auto') {
    result = await FetchEngine.create(ctx, { engine: matched.engine })
    if (result) return result
  }

  // 3b. Final fallback to http for 'auto' mode
  result = await FetchEngine.create(ctx, { engine: 'http' })
  if (!result) {
    throw new Error('Failed to create default http engine')
  }
  return result
}

export async function ensureSmartUpgradeIfNeeded(
  ctx: FetchContext,
  res: FetchResponse
) {
  if (!ctx.enableSmart) return false
  // already browser engine
  if (ctx.internal.engine?.mode === 'browser') {
    return true
  }

  if (smartShouldUseBrowser(res, ctx)) {
    // 释放旧引擎
    const oldEngine = ctx.internal.engine
    if (oldEngine) {
      if (!ctx.syncStateOnUpgrade) {
        // 如果不要求同步状态，升级前清除上下文中的 cookies，确保新引擎是干净的
        ctx.cookies = []
      } else {
        // 如果要求同步，确保最新状态已同步到 context
        ctx.cookies = (await oldEngine.cookies()) || []
      }
      await oldEngine.dispose()
      ctx.internal.engine = undefined
    }

    // 标记当前为升级模式，后续请求应当穿透缓存以实现“愈合”
    ctx.internal.isUpgraded = true

    const engine = await FetchEngine.create(ctx, { engine: 'browser' })
    if (engine) {
      ctx.eventBus.emit('context:engine:upgraded', { to: 'browser' })
      return engine
    }
  }
  return false
}

export function isProbablyDynamicHtml(body: string) {
  const patterns = [
    '__NUXT__',
    '__NEXT_DATA__',
    'id="__NEXT"',
    'data-reactroot',
    'data-hydration',
    'ng-version',
    'window.__APOLLO_STATE__',
    'webpackJsonp',
    'vite',
    'requirejs',
    'System.register',
    'Please enable JavaScript',
    'enable-javascript',
    'captcha',
    'Cloudflare',
  ]
  return patterns.some((p) => body.includes(p))
}

export function smartShouldUseBrowser(
  res: FetchResponse,
  ctx: FetchContext = {} as any,
) {
  const upgradeThresholdMs = ctx.upgradeThresholdMs ?? 5000;
  const cacheStatus = (res.headers?.['x-proxy-cache'] as string) || ''
  if (cacheStatus.includes('WAF_CHALLENGE')) {
    return true
  }

  if (
    res.statusCode! >= 500 ||
    res.statusCode! === 401 ||
    res.statusCode! === 403
  )
    return true

  if (res.statusCode === 429) {
    const retryAfter = getRetryAfter(res.headers)
    // 如果没有 Retry-After 或者等待时间过长 (>阈值)，则升级到浏览器
    if (retryAfter === null || retryAfter > upgradeThresholdMs) {
      return true
    }
    return false // 时间短，建议重试而不是升级
  }

  if (!res.contentType) return false
  if (res.contentType.includes('text/html')) {
    if (ctx.upgradeOnJsContent && isProbablyDynamicHtml(res.html!)) return true
  }
  return false
}

/** Normalizes a configured domain: trims, lowercases, drops a leading dot. */
function normalizeDomain(domain?: string): string {
  return (domain ?? '').trim().toLowerCase().replace(/^\.+/, '')
}

/**
 * True when `host` is the domain itself or a real subdomain of it.
 *
 * @remarks
 * The comparison is label-boundary aware on purpose: a bare
 * `host.endsWith(domain)` would let `evilbing.com` or `bing.com.my-vps.net`
 * inherit a rule written for `bing.com`, and a site rule decides the engine
 * (and with it `antibot`, `proxy`, headers, session state).
 */
function hostMatchesDomain(host: string, domain: string): boolean {
  return !!domain && (host === domain || host.endsWith(`.${domain}`))
}

/** True when `pathname` is at or below one of the configured path prefixes. */
function pathInScope(pathname: string, scope: string[]): boolean {
  return scope.some((p) => {
    const prefix = p.endsWith('/') ? p : `${p}/`
    return pathname === p || pathname.startsWith(prefix)
  })
}

/** Longest configured path prefix, used to rank candidate specificity. */
function longestPathScope(scope?: string[]): number {
  return (scope ?? []).reduce((max, p) => Math.max(max, p.length), 0)
}

export function pickSiteMatched(url?: string, sites?: FetchSite[]): FetchSite | null {
  if (!url || !sites?.length) return null
  let u: URL
  try {
    u = new URL(url)
  } catch {
    // 不可解析的 URL：没有站点规则可匹配，不应抛出到调用方
    return null
  }
  const host = u.hostname.toLowerCase()
  if (!host) return null

  const candidates = sites
    .map((site) => ({ site, domain: normalizeDomain(site.domain) }))
    .filter(({ site, domain }) =>
      hostMatchesDomain(host, domain) &&
      (!site.pathScope?.length || pathInScope(u.pathname, site.pathScope))
    )
  if (candidates.length === 0) return null

  // 最具体的规则优先：domain 越长越具体，其次 pathScope 前缀越长越具体。
  // 同分时保持声明顺序（Array#sort 稳定）。
  candidates.sort(
    (a, b) =>
      b.domain.length - a.domain.length ||
      longestPathScope(b.site.pathScope) - longestPathScope(a.site.pathScope)
  )
  return candidates[0].site
}
