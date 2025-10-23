import type { SiteRegistryInit, SiteRegistryItem, WebFetcherOptions } from '../types';
import { URL } from 'node:url';

export class SiteRegistry {
  private items: SiteRegistryItem[] = [];
  constructor(init?: SiteRegistryInit) {
    if (init?.sites?.length) this.items = [...init.sites];
  }

  match(url: string): SiteRegistryItem | undefined {
    const u = new URL(url);
    const host = u.hostname;
    const path = u.pathname;
    // 后缀匹配 + pathScope 优先
    const candidates = this.items
      .filter(it => host === it.domain || host.endsWith('.' + it.domain))
      .filter(it => !it.pathScope || it.pathScope.some(p => path.startsWith(p)));
    // 更长 pathScope 优先
    candidates.sort((a,b) => (b.pathScope?.[0]?.length ?? 0) - (a.pathScope?.[0]?.length ?? 0));
    return candidates[0];
  }

  upsertFromDecision(url: string, smart: { decided:'http'|'browser'; reasons:string[] }, opts: WebFetcherOptions) {
    // 简单演示：将决定写入 domain 级别
    const u = new URL(url);
    const domain = u.hostname.split('.').slice(-2).join('.');
    const existing = this.items.find(it => it.domain === domain);
    if (existing) {
      existing.mode = smart.decided === 'browser' ? 'browser' : 'http';
    } else {
      this.items.push({ domain, mode: smart.decided });
    }
  }

  getAll() { return this.items; }
}
