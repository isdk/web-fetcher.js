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
export type FetchMode = BaseFetchMode | 'auto' | 'smart';
export type BrowserEngine = 'playwright' | 'puppeteer';

export interface BaseFetcherOptions {
  mode?: FetchMode;
  engine?: BrowserEngine;
  antibot?: boolean;
  headers?: Record<string, string>;
  proxy?: string | string[];

  auth?: {
    reuseCookies?: boolean; // 默认 true
    preloadCookies?: Cookie[];
  };

  ignoreSslErrors?: boolean;

  timeoutMs?: number;
  maxConcurrency?: number;
  maxRequestsPerMinute?: number;
  delayBetweenRequestsMs?: number;

  browser?: {
    headless?: boolean;
    waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
    blockResources?: Array<'images'|'stylesheets'|'fonts'|'scripts'|'media'>;
  };

  http?: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: any;
  };
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
