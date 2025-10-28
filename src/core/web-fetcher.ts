import { FetchSession } from "./session";
import { FetcherOptions, FetchResponse } from "./types";

export class WebFetcher {
  constructor(private defaults: FetcherOptions = {}) {}

  async createSession(options?: FetcherOptions): Promise<FetchSession> {
    const merged: FetcherOptions = { ...this.defaults, ...(options || {}) };
    return new FetchSession(merged);
  }

  async fetch(url: string, options?: FetcherOptions): Promise<{ result: FetchResponse | undefined, outputs: Record<string, any> }>
  async fetch(options: FetcherOptions): Promise<{ result: FetchResponse | undefined, outputs: Record<string, any> }>
  async fetch(url: string|FetcherOptions, options?: FetcherOptions): Promise<{ result: FetchResponse | undefined, outputs: Record<string, any> }> {
    if (typeof url !== 'string') {
      options = url;
      url = options.url!;
    }
    const session = await this.createSession(options);
    try {
      const actions = options?.actions || [];
      if (url && actions.findIndex(a => a.id === 'goto' && a.params?.url === url) !== 0) {
        actions.unshift({ id: 'goto', params: { url } });
      }
      const response = await session.executeAll(actions);
      // const response = await session.execute<'response'>({ id: 'goto', params: { url } });
      return response;
    } finally {
      await session.dispose();
    }
  }
}
