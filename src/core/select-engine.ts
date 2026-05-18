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
  const matched = pickSiteMatched(url, ctx.sites)

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

export function pickSiteMatched(url?: string, sites?: FetchSite[]) {
  if (!url || !sites?.length) return null
  const u = new URL(url)
  // 简易匹配：domain 完整匹配或后缀匹配
  let matched = sites.find((s) => s.domain === u.hostname)
  if (!matched) matched = sites.find((s) => u.hostname.endsWith(s.domain))
  if (!matched) return null
  if (matched.pathScope?.length) {
    const ok = matched.pathScope.some((p) => u.pathname.startsWith(p))
    if (!ok) return null
  }
  return matched
}
