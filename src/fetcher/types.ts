import type { FetchActionResult } from './base-fetch-action'

export type Headers = Record<string, string>;

// Cookie 定义
export interface Cookie {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  expires?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

export type BaseFetchMode = 'http' | 'browser';
export type FetchMode = BaseFetchMode | 'auto' | 'smart' | 'site';
export type BrowserEngine = 'playwright' | 'puppeteer';

export interface BaseFetcherOptions {
  /**
   * 抓取模式
   *
   * - `http`: 使用 HTTP 进行抓取
   * - `browser`: 使用浏览器进行抓取
   * - `auto`: auto 会走“智能探测”选择 http 或 browser, 但是如果没有启用 smart，并且在站点注册表中没有，那么则等价为 http.
   * - `smart`: 进行智能探测，自动选择模式
   * - `site`: 使用站点注册表进行抓取，如果没有站点注册表，则等价为 http.
   */
  mode?: FetchMode;
  antibot?: boolean;
  headers?: Record<string, string>;
  proxy?: string | string[];
  // 阻止加载特定类型的资源
  blockResources?: Array<'images'|'stylesheets'|'fonts'|'scripts'|'media'|string>;

  auth?: {
    reuseCookies?: boolean; // 默认 true
    preloadCookies?: Cookie[];
  };

  // browser 模式下，没有对应的配置，需要根据浏览器类型去设置浏览器内部配置，也可能无法配置。
  ignoreSslErrors?: boolean;

  browser?: {
    /**
     * 浏览器引擎，默认为 playwright
     *
     * - `playwright`: 使用 Playwright 引擎
     * - `puppeteer`: 使用 Puppeteer 引擎
     */
    engine?: BrowserEngine;
    headless?: boolean;
    waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
  };

  http?: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: any;
  };

  timeoutMs?: number;
  maxConcurrency?: number;
  maxRequestsPerMinute?: number;
  delayBetweenRequestsMs?: number;
}

export interface FetchSite extends BaseFetcherOptions {
  domain: string;
  pathScope?: string[];

  meta?: {
    updatedAt?: number;
    ttlMs?: number;
    source?: 'manual' | 'smart';
  };
}

export interface FetcherOptions extends BaseFetcherOptions {
  sites?: FetchSite[];
}

export interface FetchMetadata {
  mode: BaseFetchMode;
  engine?: BrowserEngine;
  timings?: {
    start: number;
    total: number;
    ttfb?: number;
    dns?: number;
    tcp?: number;
    firstByte?: number;
    download?: number;
  };
  proxy?: string;
  [key: string]: any;
}

// 标准抓取响应
export interface FetchResponse {
  url: string;
  finalUrl: string;
  statusCode?: number;
  statusText?: string;
  headers: Headers;
  contentType?: string;
  html?: string;
  text?: string;
  json?: any;
  cookies?: Cookie[];
  metadata?: FetchMetadata;
}

export type FetchReturnKind = 'response' | 'context' | 'result' | 'outputs' | 'none';

// 返回类型映射
export type FetchReturnTypeFor<R extends FetchReturnKind> =
  R extends 'response' ? FetchResponse :
  R extends 'context' ? FetchContext :
  R extends 'result' ? FetchActionResult | undefined :
  R extends 'outputs' ? Record<string, any> :
  void;

export interface FetchContext {
  id: string;
  mode: BaseFetchMode;
  engine?: BrowserEngine;
  url?: string;
  finalUrl?: string;

  headers: Record<string, string>;
  cookies: Cookie[];
  proxy?: string;

  lastResponse?: FetchResponse;
  lastResult?: FetchActionResult;

  currentAction?: {
    name: string;
    params?: any;
    index?: number;
    startedAt: number;
    finishedAt?: number;
    error?: { message: string; code?: string };
  };

  outputs: Map<string, any>;
}
