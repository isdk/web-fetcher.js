import type { Cookie, SessionPoolOptions } from 'crawlee';
import { FetchActionOptions } from "../action/fetch-action";

export type { Cookie } from 'crawlee';

// Cookie 定义
/*
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
*/

export type FetchEngineType = 'http' | 'browser';
export type BrowserEngine = 'playwright' | 'puppeteer';

type FetchEngineMode = FetchEngineType | 'auto' | string;
export type ResourceType = 'image' | 'stylesheet' | 'font' | 'script' | 'media' | string;

/**
 * Storage configuration options for the fetch engine.
 *
 * @remarks
 * Controls how Crawlee's internal storage (RequestQueue, KeyValueStore, SessionPool) is managed.
 */
export interface StorageOptions {
  /**
   * Custom identifier for the storage.
   * If provided, multiple sessions can share the same storage by using the same ID.
   * If not provided, a unique session ID is used (strong isolation).
   */
  id?: string;
  /**
   * Whether to persist storage to disk.
   * If true, uses Crawlee's disk persistence. If false, data might be stored in memory or temporary directory.
   * Corresponds to Crawlee's `persistStorage` configuration.
   */
  persist?: boolean;
  /**
   * Whether to delete the storage (RequestQueue and KeyValueStore) when the session is closed.
   * Defaults to true. Set to false if you want to keep data for future reuse with the same `id`.
   */
  purge?: boolean;
  /**
   * Additional Crawlee configuration options.
   * Allows fine-grained control over the underlying Crawlee instance.
   */
  config?: Record<string, any>;
}

export interface BaseFetcherProperties {
  /**
   * 抓取模式
   *
   * - `http`: 使用 HTTP 进行抓取
   * - `browser`: 使用浏览器进行抓取
   * - `auto`: auto 会走“智能探测”选择 http 或 browser, 但是如果没有启用 smart，并且在站点注册表中没有，那么则等价为 http.
   */
  engine?: FetchEngineMode;
  enableSmart?: boolean  // 启用智能探测
  useSiteRegistry?: boolean  // 使用站点配置
  antibot?: boolean;

  headers?: Record<string, string>;
  cookies?: Cookie[];
  sessionState?: any;
  sessionPoolOptions?: SessionPoolOptions;
  overrideSessionState?: boolean;
  reuseCookies?: boolean; // 默认 true
  throwHttpErrors?: boolean;

  proxy?: string | string[];
  // 阻止加载特定类型的资源
  blockResources?: ResourceType[];

  /**
   * Storage configuration for session isolation and persistence.
   */
  storage?: StorageOptions;

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
  requestHandlerTimeoutSecs?: number;
  maxConcurrency?: number;
  maxRequestsPerMinute?: number;
  delayBetweenRequestsMs?: number;
  retries?: number;

  sites?: FetchSite[];
  url?: string;
}

export interface FetchSite extends BaseFetcherProperties {
  domain: string;
  pathScope?: string[];

  meta?: {
    updatedAt?: number;
    ttlMs?: number;
    source?: 'manual' | 'smart';
  };
}

export type OnFetchPauseCallback = (options: {
  message?: string;
}) => Promise<void>;

export interface FetcherOptions extends BaseFetcherProperties {
  actions?: FetchActionOptions[];
  onPause?: OnFetchPauseCallback;
}

export interface FetchMetadata {
  mode: FetchEngineType;
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
  headers: Record<string, string>;
  contentType?: string;
  body?: string | Buffer<ArrayBufferLike>;
  html?: string;
  text?: string;
  json?: any;
  cookies?: Cookie[];
  sessionState?: any;
  metadata?: FetchMetadata;
}

export const DefaultFetcherProperties: BaseFetcherProperties = {
  engine: 'auto',
  enableSmart: true,
  useSiteRegistry: true,
  antibot: false,
  headers: {},
  cookies: [],
  reuseCookies: true,
  throwHttpErrors: undefined,
  proxy: [],
  blockResources: [],
  storage: {
    purge: true,
  },
  ignoreSslErrors: true,
  browser: {
    engine: 'playwright',
    headless: true,
    waitUntil: 'domcontentloaded',
  },
  http: {
    method: 'GET',
  },
  timeoutMs: 60000,
  requestHandlerTimeoutSecs: undefined,
  maxConcurrency: 1,
  maxRequestsPerMinute: 1000,
  delayBetweenRequestsMs: 0,
  retries: 0,
  sites: [],
}

export const FetcherOptionKeys = Object.keys(DefaultFetcherProperties).concat(['actions', 'onPause']);
