import { FetcherOptions, FetchResponse } from "./core/types";
import { WebFetcher } from "./core/web-fetcher";

export async function fetchWeb(options: FetcherOptions): Promise<FetchResponse|undefined>
export async function fetchWeb(url: string, options?: FetcherOptions): Promise<FetchResponse|undefined>
export async function fetchWeb(url: string|FetcherOptions, options?: FetcherOptions): Promise<FetchResponse|undefined> {
  const fetcher = new WebFetcher();
  return fetcher.fetch(url as any, options);
}
