import type { FetchRequest, WebFetcherOptions } from '../types';
import type { WebFetcherEvents } from '../event/create-event';
import { HttpEngine } from '../engine/http-engine';
import { BrowserEngine } from '../engine/browser-engine';
import { looksLikeJSApp, looksLikeBotChallenge, domChangedSignificantly } from '../../refs/src/utils/dom';

export class SmartDetector {
  private http = new HttpEngine();
  private browser = new BrowserEngine();

  constructor(private parent: { on: any; }) {}

  async decide(req: FetchRequest, opts: WebFetcherOptions, headers: Record<string,string>, id: string) {
    const reasons: string[] = [];
    let antiBotDetected = false;

    // 1) 先 http 试探
    let httpRes: any;
    try {
      httpRes = await this.http.fetch({ id: id + ':probe-http', url: req.url, headers, options: { ...opts, mode: 'http' }, emit: ()=>{} } as any);
    } catch (e:any) {
      reasons.push('http-error:'+ (e?.message ?? ''));
    }

    if (httpRes) {
      const html = httpRes.html ?? (httpRes.body ? httpRes.body.toString('utf-8') : '');
      const ct = httpRes.contentType ?? '';
      if (ct.includes('application/json')) {
        reasons.push('http-json-ok');
        return { decided: 'http' as const, reasons, antiBotDetected };
      }
      if (looksLikeBotChallenge(html)) {
        reasons.push('bot-challenge-in-http');
        antiBotDetected = true;
        // 尝试浏览器升级
        const browserRes = await this.tryBrowser(req.url, opts, headers, id, reasons);
        return browserRes ?? { decided: 'browser' as const, reasons, antiBotDetected };
      }
      if (looksLikeJSApp(html)) {
        reasons.push('js-app-sparse-html');
        // 浏览器比对确认
        const browserRes = await this.tryBrowser(req.url, opts, headers, id, reasons, true);
        return browserRes ?? { decided: 'browser' as const, reasons, antiBotDetected };
      }
      // 尝试对比渲染差异
      const domDiffLarge = await this.compareDomIfNeeded(req.url, opts, headers, html);
      if (domDiffLarge) {
        reasons.push('dom-diff-large');
        return { decided: 'browser' as const, reasons, antiBotDetected };
      }
      // http 已有完整 HTML
      reasons.push('http-html-ok');
      return { decided: 'http' as const, reasons, antiBotDetected };
    } else {
      // http 失败则尝试 browser
      const browserRes = await this.tryBrowser(req.url, opts, headers, id, reasons);
      antiBotDetected = true;
      return browserRes ?? { decided: 'browser' as const, reasons, antiBotDetected };
    }
  }

  private async tryBrowser(url: string, opts: WebFetcherOptions, headers: Record<string,string>, id: string, reasons: string[], quick = false) {
    try {
      const res = await this.browser.fetch({ id: id + ':probe-browser', url, headers, options: { ...opts, captureNetworkJson: true }, emit: ()=>{} } as any);
      if (res.json) reasons.push('browser-json-ok');
      if (res.html) reasons.push('browser-html-ok');
      return { decided: 'browser' as const, reasons, antiBotDetected: false };
    } catch (e:any) {
      reasons.push('browser-error:' + (e?.message ?? ''));
      return null;
    }
  }

  private async compareDomIfNeeded(url: string, opts: WebFetcherOptions, headers: Record<string,string>, httpHtml: string) {
    try {
      const res = await this.browser.fetch({ id: 'dom-compare', url, headers, options: { ...opts }, emit: ()=>{} } as any);
      const browserHtml = res.html ?? '';
      return domChangedSignificantly(httpHtml, browserHtml);
    } catch { return false; }
  }
}
