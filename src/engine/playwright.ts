import { PlaywrightCrawler, Configuration } from 'crawlee'
import type {
  PlaywrightCrawlingContext,
  PlaywrightCrawlerOptions,
} from 'crawlee'
import { firefox } from 'playwright'
import { FetchEngine, type GotoActionOptions, FetchEngineAction } from './base'
import { FetchResponse, type OnFetchPauseCallback } from '../core/types'
import { FetchEngineContext } from '../core/context'
import { CommonError, ErrorCode, NotFoundError } from '@isdk/common-error'
import { ExtractValueSchema, FetchElementScope } from '../core/extract'
import { normalizeHtml } from '../utils/cheerio-helpers'
import { normalizeExtractSchema } from '../core/normalize-extract-schema'

const DefaultTimeoutMs = 30_000

type Page = NonNullable<PlaywrightCrawlingContext['page']>
type Locator = ReturnType<Page['locator']>

export class PlaywrightFetchEngine extends FetchEngine<
  PlaywrightCrawlingContext,
  PlaywrightCrawler,
  PlaywrightCrawlerOptions
> {
  static readonly id = 'playwright'
  static readonly mode = 'browser'

  protected async _buildResponse(
    context: PlaywrightCrawlingContext
  ): Promise<FetchResponse> {
    const { page, response, request, session } = context
    // In case of failed request, page might be closed.
    if (!page || page.isClosed()) {
      return {
        url: request.url,
        finalUrl: request.loadedUrl || request.url,
        statusCode: response?.status(),
        statusText: response?.statusText(),
        headers: (await response?.allHeaders()) || {},
        body: '',
        html: '',
        text: '',
      }
    }
    const body = await page.content()
    const text = await page.textContent('body')
    const cookies = await page.context().cookies()
    if (session) {
      session.setCookies(cookies, request.url)
    }
    const result: FetchResponse = {
      url: page.url(),
      finalUrl: page.url(),
      statusCode: response?.status(),
      statusText: response?.statusText(),
      headers: (await response?.allHeaders()) || {},
      body,
      html: body,
      text: text || '',
    }

    if (this.opts?.debug && response) {
      const request =
        typeof response.request === 'function'
          ? response.request()
          : (response as any).request
      if (request && typeof request.timing === 'function') {
        const t = request.timing()
        result.metadata = {
          timings: {
            start: t.startTime,
            total: t.responseEnd - t.startTime,
            ttfb: t.responseStart - t.requestStart,
            dns: t.domainLookupEnd - t.domainLookupStart,
            tcp: t.connectEnd - t.connectStart,
            download: t.responseEnd - t.responseStart,
          },
        } as any
      }
    }

    if (this.opts?.output?.cookies !== false) {
      result.cookies = cookies
    }
    return result
  }

  async _querySelectorAll(
    scope: Locator | Locator[],
    selector: string
  ): Promise<FetchElementScope[]> {
    if (Array.isArray(scope)) {
      const results: Locator[] = []
      for (const loc of scope) {
        // find in children
        const matches = await loc.locator(selector).all()
        results.push(...matches)
        // check if current element matches
        const isMatch = await loc.evaluate(
          (el, sel) => el.matches(sel),
          selector
        )
        if (isMatch) results.push(loc)
      }
      return results
    }
    return scope.locator(selector).all()
  }

  async _nextSiblingsUntil(
    scope: Locator,
    untilSelector?: string
  ): Promise<FetchElementScope[]> {
    const allFollowing = await scope
      .locator('xpath=following-sibling::*')
      .all()
    if (!untilSelector) return allFollowing

    const results = []
    for (const loc of allFollowing) {
      if (await loc.evaluate((el, sel) => el.matches(sel), untilSelector)) {
        break
      }
      results.push(loc)
    }
    return results
  }

  async _parentElement(scope: Locator): Promise<FetchElementScope | null> {
    // In Playwright, xpath '..' gets parent
    const parent = scope.locator('xpath=..')
    if ((await parent.count()) === 0) return null
    return parent.first()
  }

  async _isSameElement(
    scope1: Locator,
    scope2: Locator
  ): Promise<boolean> {
    const h1 = await scope1.elementHandle()
    const h2 = await scope2.elementHandle()
    if (!h1 || !h2) return false
    const result = await h1.evaluate((node1, node2) => node1 === node2, h2)
    // Handles should be disposed?
    // In this flow, we might be creating many handles.
    // Ideally we should manage disposal, but Locators manage their own lifecycle mostly.
    // ElementHandles obtained manually should be disposed.
    await h1.dispose()
    await h2.dispose()
    return result
  }

  async _extractValue(
    schema: ExtractValueSchema,
    scope: Locator
  ): Promise<any> {
    const { attribute, type = 'string', mode = 'text' } = schema

    if ((await scope.count()) === 0) return null

    let value: string | null = ''
    if (attribute) {
      value = await scope.getAttribute(attribute)
    } else if (type === 'html' || mode === 'html' || mode === 'outerHTML') {
      if (mode === 'outerHTML') {
        value = await scope.evaluate((el) => el.outerHTML)
      } else {
        value = await scope.innerHTML()
      }
      if (value) value = normalizeHtml(value)
    } else if (mode === 'innerText') {
      value = await scope.innerText()
    } else {
      value = await scope.textContent()
    }

    if (value === null) return null
    value = value.trim()

    switch (type) {
      case 'number':
        return parseFloat(value.replace(/[^0-9.-]+/g, '')) || null
      case 'boolean':
        const lowerValue = value.toLowerCase()
        return lowerValue === 'true' || lowerValue === '1'
      default:
        return value
    }
  }

  protected _getInitialElementScope(context: PlaywrightCrawlingContext): FetchElementScope {
    const { page } = context
    if (!page) return null
    return page.locator(':root')
  }

  protected async executeAction(
    context: PlaywrightCrawlingContext,
    action: FetchEngineAction
  ): Promise<any> {
    const { page } = context
    const defaultTimeout = this.opts?.timeoutMs || DefaultTimeoutMs
    switch (action.type) {
      case 'dispose':
        return
      case 'navigate': {
        const response = await page.goto(action.url, {
          waitUntil: action.opts?.waitUntil || 'domcontentloaded',
          timeout: this.opts?.timeoutMs || DefaultTimeoutMs,
        })
        if (response) context = { ...context, response }
        const fetchResponse = await this.buildResponse(context)
        this.lastResponse = fetchResponse
        return fetchResponse
      }
      case 'click': {
        // const beforePageId = page.mainFrame().url();
        await page.click(action.selector, { timeout: defaultTimeout })
        await page.waitForLoadState('networkidle', { timeout: defaultTimeout })
        // if (beforePageId !== page.mainFrame().url()) {
        const navResponse = await this.buildResponse(context)
        this.lastResponse = navResponse
        // }
        return
      }
      case 'fill':
        await page.fill(action.selector, action.value, {
          timeout: defaultTimeout,
        })
        const navResponse = await this.buildResponse(context)
        this.lastResponse = navResponse
        return
      case 'trim': {
        const trimInfo = this._getTrimInfo(action.options)
        await page.evaluate((info) => {
          const { selectors, removeComments, removeHidden } = info

          selectors.forEach((s) => {
            document.querySelectorAll(s).forEach((el) => el.remove())
          })

          if (removeHidden) {
            const toRemove: Element[] = []
            document.querySelectorAll('*').forEach((el) => {
              const style = window.getComputedStyle(el)
              if (style.display === 'none' || style.visibility === 'hidden') {
                toRemove.push(el)
              }
            })
            toRemove.forEach((el) => el.remove())
          }

          if (removeComments) {
            const iterator = document.createNodeIterator(
              document,
              NodeFilter.SHOW_COMMENT
            )
            const comments: Node[] = []
            let node
            // eslint-disable-next-line no-cond-assign
            while ((node = iterator.nextNode())) {
              comments.push(node)
            }
            comments.forEach((c) => c.parentElement?.removeChild(c))
          }
        }, trimInfo)
        this.lastResponse = await this.buildResponse(context)
        return
      }
      case 'waitFor':
        try {
          if (action.options?.selector) {
            await page.waitForSelector(action.options.selector, {
              timeout: defaultTimeout,
            })
          }
          if (action.options?.networkIdle) {
            await page.waitForLoadState('networkidle', {
              timeout: defaultTimeout,
            })
          }
        } catch (e) {
          if (action.options?.failOnTimeout === false) {
            // ignore error
          } else {
            throw e
          }
        }
        if (action.options?.ms) {
          await page.waitForTimeout(action.options.ms)
        }
        return
      case 'submit': {
        const formSelector = action.selector || 'form'
        const el = page.locator(formSelector).first()
        if ((await el.count()) === 0) {
          throw new NotFoundError(formSelector, 'submit')
        }

        const enctype =
          action.options?.enctype || 'application/x-www-form-urlencoded'

        if (enctype === 'application/json') {
          const formHandle = await el.elementHandle()
          if (!formHandle) {
            throw new CommonError(
              `submit: could not get form handle for ${formSelector}`,
              'submit'
            )
          }

          const result = await formHandle.evaluate(
            async (form: HTMLFormElement) => {
              const formData = new FormData(form)
              const data: Record<string, string> = {}
              formData.forEach((value, key) => {
                data[key] = value.toString()
              })

              const response = await fetch(form.action, {
                method: form.method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
              })

              const html = await response.text()
              return {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                body: html,
                html,
                text: html,
                url: form.action,
                finalUrl: response.url,
              }
            }
          )

          await formHandle.dispose()
          await page.setContent(result.html)

          this.lastResponse = result
          return
        } else {
          await el.evaluate((form: HTMLFormElement) => form.submit())
          await page.waitForLoadState('networkidle', {
            timeout: defaultTimeout,
          })
          this.lastResponse = await this.buildResponse(context)
          return
        }
      }
      default:
        throw new CommonError(
          `Unknown action type: ${(action as any).type}`,
          'PlaywrightFetchEngine.executeAction',
          ErrorCode.NotSupported
        )
    }
  }

  protected _createCrawler(
    options: PlaywrightCrawlerOptions,
    config?: Configuration
  ): PlaywrightCrawler {
    return new PlaywrightCrawler(options, config)
  }

  protected async _getSpecificCrawlerOptions(
    ctx: FetchEngineContext
  ): Promise<Partial<PlaywrightCrawlerOptions>> {
    const headless = ctx.browser?.headless ?? true

    const crawlerOptions: Partial<PlaywrightCrawlerOptions> = {
      maxRequestRetries: ctx.retries || 3,
      headless,
      proxyConfiguration: this.proxyConfiguration,
      requestHandlerTimeoutSecs: ctx.requestHandlerTimeoutSecs,
      preNavigationHooks: [
        async ({ page, request }, gotOptions) => {
          // await page.setExtraHTTPHeaders(this.hdrs);
          gotOptions.throwHttpErrors = ctx.throwHttpErrors

          const blockedTypes = this.blockedTypes
          if (blockedTypes.size > 0) {
            await page.route('**/*', (route) => {
              if (blockedTypes.has(route.request().resourceType())) {
                route.abort()
              } else {
                route.continue()
              }
            })
          }
        },
      ],
    }

    if (this.opts?.antibot) {
      crawlerOptions.browserPoolOptions = {
        // Disable the default fingerprint spoofing to avoid conflicts with Camoufox.
        useFingerprints: false,
      }

      const { launchOptions } = await import('camoufox-js')
      const lo = await launchOptions({
        headless,
      })

      crawlerOptions.launchContext = {
        launcher: firefox,
        launchOptions: lo,
      }

      crawlerOptions.postNavigationHooks = [
        async ({ page, handleCloudflareChallenge }) => {
          await handleCloudflareChallenge()
        },
      ]
    }

    return crawlerOptions
  }

  async goto(url: string, opts?: GotoActionOptions): Promise<FetchResponse> {
    if (this.isPageActive) {
      return this.dispatchAction({ type: 'navigate', url, opts })
    }

    if (!this.requestQueue) {
      throw new CommonError('RequestQueue not initialized', 'goto')
    }

    const requestId = `req-${++this.requestCounter}`
    const promise = new Promise<FetchResponse>((resolve, reject) => {
      this.pendingRequests.set(requestId, { resolve, reject })
    })

    await this.requestQueue.addRequest({
      url,
      headers: this.hdrs, // update headers
      userData: {
        requestId,
        waitUntil: opts?.waitUntil || 'domcontentloaded',
      },
      uniqueKey: `${url}-${requestId}`,
    })

    return promise
  }
}

FetchEngine.register(PlaywrightFetchEngine)
