
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FetchEngine } from '../src/engine/base';
import { CheerioFetchEngine } from '../src/engine/cheerio';
import { PlaywrightFetchEngine } from '../src/engine/playwright';
import { FetchEngineContext } from '../src/core/context';

describe('FetchEngine Proxy Configuration', () => {
  let context: FetchEngineContext;

  beforeEach(() => {
    context = {
      id: `test-proxy-${Date.now()}-${Math.random()}`,
    } as any;
  });

  const testProxyConfig = async (engineName: 'cheerio' | 'playwright', EngineClass: any) => {
    const proxyUrl = 'http://localhost:8080';
    const engine = await FetchEngine.create(context, {
      engine: engineName,
      proxy: proxyUrl,
    }) as any;

    expect(engine).toBeInstanceOf(EngineClass);
    expect(engine.proxyConfiguration).toBeDefined();
    // Use the actual ProxyConfiguration API to check URLs if possible, or just check the internal state
    expect(engine.proxyConfiguration.proxyUrls).toContain(proxyUrl);

    await engine.dispose();
  };

  it('should configure proxy for CheerioFetchEngine', async () => {
    await testProxyConfig('cheerio', CheerioFetchEngine);
  });

  it('should configure proxy for PlaywrightFetchEngine', async () => {
    await testProxyConfig('playwright', PlaywrightFetchEngine);
  });

  it('should correctly report proxy in metadata from context.proxyInfo', async () => {
     const proxyUrl = 'http://localhost:8888';
     const engine = await FetchEngine.create(context, {
        engine: 'cheerio',
        proxy: proxyUrl,
        debug: true
      }) as any;

      // Mock Crawlee context
      const mockContext = {
         request: { url: 'http://localhost:3000', loadedUrl: 'http://localhost:3000' },
         response: { statusCode: 200, headers: { 'content-type': 'text/html' } },
         body: '<html></html>',
         session: { getCookies: () => [] },
         proxyInfo: { url: proxyUrl }
      };
      
      // Use the public buildResponse (it's protected in base.ts, but let's check visibility)
      // Since it's protected, we access it via 'any'
      const response = await engine.buildResponse(mockContext as any);
      
      expect(response.metadata.proxy).toBe(proxyUrl);
      
      await engine.dispose();
  });

  it('should fallback to opts.proxy in metadata if proxyInfo is missing', async () => {
    const proxyUrl = 'http://localhost:9999';
    const engine = await FetchEngine.create(context, {
       engine: 'cheerio',
       proxy: proxyUrl,
       debug: true
     }) as any;

     const mockContext = {
        request: { url: 'http://localhost:3000' },
        response: { statusCode: 200, headers: { 'content-type': 'text/html' } },
        body: '<html></html>',
        session: { getCookies: () => [] },
        // proxyInfo is missing
     };
     
     const response = await engine.buildResponse(mockContext as any);
     expect(response.metadata.proxy).toBe(proxyUrl);
     
     await engine.dispose();
 });
});
