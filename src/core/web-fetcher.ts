import { FetchSession } from './session'
import { FetcherOptions, FetchResponse } from './types'

/**
 * High-level entry point for the Web Fetcher library.
 *
 * @remarks
 * The `WebFetcher` provides a simplified API for fetching web content without manually managing sessions.
 * It can be used for one-off requests or as a factory for more complex `FetchSession` instances.
 *
 * @example
 * ```ts
 * const fetcher = new WebFetcher();
 * const { result } = await fetcher.fetch('https://example.com');
 * ```
 */
export class WebFetcher {
  /**
   * Creates a new WebFetcher with default options.
   *
   * @param defaults - Default configuration options applied to all sessions and requests.
   */
  constructor(private defaults: FetcherOptions = {}) {}

  /**
   * Creates a new FetchSession.
   *
   * @param options - Configuration options for the session, merged with defaults.
   * @returns A promise resolving to a new FetchSession instance.
   */
  async createSession(options?: FetcherOptions): Promise<FetchSession> {
    const merged: FetcherOptions = { ...this.defaults, ...(options || {}) }
    return new FetchSession(merged)
  }

  /**
   * Fetches content from a URL or executes a complex action script.
   *
   * @remarks
   * This method automatically creates a session, executes the specified actions,
   * retrieves the content, and disposes of the session.
   *
   * @param url - The target URL or a complete FetcherOptions object.
   * @param options - Additional options when the first parameter is a URL string.
   * @returns A promise resolving to the final response and any extracted outputs.
   */
  async fetch(
    url: string,
    options?: FetcherOptions
  ): Promise<{
    result: FetchResponse | undefined
    outputs: Record<string, any>
  }>
  async fetch(options: FetcherOptions): Promise<{
    result: FetchResponse | undefined
    outputs: Record<string, any>
  }>
  async fetch(
    url: string | FetcherOptions,
    options?: FetcherOptions
  ): Promise<{
    result: FetchResponse | undefined
    outputs: Record<string, any>
  }> {
    if (typeof url !== 'string') {
      options = url
      url = options.url!
    }
    const session = await this.createSession(options)
    try {
      const actions = options?.actions || []
      // Auto-insert 'goto' if url is provided and not already the first action
      if (
        url &&
        actions.findIndex(
          (a) => (a.id === 'goto' || a.name === 'goto') && a.params?.url === url
        ) !== 0
      ) {
        actions.unshift({ id: 'goto', params: { url } })
      }
      const response = await session.executeAll(actions)
      return response
    } finally {
      await session.dispose()
    }
  }
}
