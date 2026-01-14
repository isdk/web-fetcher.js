import { CheerioCrawler, Configuration } from 'crawlee'
import type { CheerioCrawlingContext, CheerioCrawlerOptions } from 'crawlee'
import * as cheerio from 'cheerio'
import { FetchEngine, type GotoActionOptions, FetchEngineAction } from './base'
import { FetchResponse } from '../core/types'
import { FetchEngineContext } from '../core/context'
import { createPromiseLock } from './promise-lock'
import { CommonError, ErrorCode, NotFoundError } from '@isdk/common-error'
import { ExtractValueSchema, FetchElementScope } from '../core/extract'
import { getInnerText, normalizeHtml } from '../utils/cheerio-helpers'

type CheerioAPI = NonNullable<CheerioCrawlingContext['$']>
type CheerioSelection = ReturnType<CheerioAPI>
type CheerioNode = ReturnType<CheerioSelection['first']>

export class CheerioFetchEngine extends FetchEngine<
  CheerioCrawlingContext,
  CheerioCrawler,
  CheerioCrawlerOptions
> {
  static readonly id = 'cheerio'
  static readonly mode = 'http'

  private _ensureCheerioContext(context: CheerioCrawlingContext) {
    if (!context.$ && context.body) {
      let text =
        typeof context.body === 'string'
          ? context.body
          : Buffer.isBuffer(context.body)
            ? context.body.toString('utf-8')
            : JSON.stringify(context.body)
      // If it looks like JSON or just plain text, wrap it to allow basic selection
      if (!text.trim().startsWith('<')) {
        text = `<html><body><pre>${text}</pre></body></html>`
      }
      ;(context as any).$ = cheerio.load(text)
    }
  }

  protected async _buildResponse(
    context: CheerioCrawlingContext
  ): Promise<FetchResponse> {
    this._ensureCheerioContext(context)
    const { request, response, body, $ } = context
    const newHtml = $?.html()
    let text =
      typeof body === 'string'
        ? body
        : Buffer.isBuffer(body)
          ? body.toString('utf-8')
          : String(body ?? '')
    if (newHtml && newHtml !== text) {
      text = newHtml
    }

    let headers = response?.headers as Record<string, string>
    // If 'headers' object doesn't exist, create it from 'rawHeaders'
    if (!headers && (response as any)?.rawHeaders) {
      headers = {}
      const rawHeaders = (response as any).rawHeaders
      for (let i = 0; i < rawHeaders.length; i += 2) {
        headers[rawHeaders[i].toLowerCase()] = rawHeaders[i + 1]
      }
    }

    const result: FetchResponse = {
      url: request.url,
      finalUrl: request.loadedUrl || request.url,
      statusCode: response?.statusCode ?? 200,
      statusText: response?.statusMessage,
      headers: headers || {}, // Use the newly constructed headers
      body,
      html: normalizeHtml(text),
      text,
    }

    if (this.opts?.debug && (response as any)?.timings) {
      const t = (response as any).timings
      result.metadata = {
        timings: {
          start: t.start,
          total: t.phases?.total,
          ttfb: t.phases?.firstByte,
          dns: t.phases?.dns,
          tcp: t.phases?.tcp,
          download: t.phases?.download,
        },
      } as any
    }

    return result
  }

  async _querySelectorAll(
    scope: { $: CheerioAPI; el: any } | any[],
    selector: string
  ): Promise<FetchElementScope[]> {
    if (Array.isArray(scope)) {
      if (scope.length === 0) return []
      const { $ } = scope[0]
      // Use the underlying DOM elements [0] for Cheerio collection
      const nodes = scope.map((c) => c.el[0]).filter(Boolean)
      const $els = $(nodes)
      return $els
        .find(selector)
        .add($els.filter(selector))
        .toArray()
        .map((e: any) => ({ $, el: $(e) }))
    }
    const { $, el } = scope
    return el
      .find(selector)
      .toArray()
      .map((e: any) => ({ $, el: $(e) }))
  }

  async _nextSiblingsUntil(
    scope: { $: CheerioAPI; el: CheerioNode },
    untilSelector?: string
  ): Promise<FetchElementScope[]> {
    const { $, el } = scope
    const nextSiblings = untilSelector
      ? el.nextUntil(untilSelector)
      : el.nextAll()
    return nextSiblings.toArray().map((e) => ({ $, el: $(e) }))
  }

  async _parentElement(scope: {
    $: CheerioAPI
    el: CheerioNode
  }): Promise<FetchElementScope | null> {
    const { $, el } = scope
    const parent = el.parent()
    if (parent.length === 0) return null
    return { $, el: parent }
  }

  async _isSameElement(
    scope1: { el: CheerioNode },
    scope2: { el: CheerioNode }
  ): Promise<boolean> {
    return scope1.el[0] === scope2.el[0]
  }

  async _extractValue(
    schema: ExtractValueSchema,
    scope: { $: CheerioAPI; el: CheerioNode }
  ): Promise<any> {
    const { $, el } = scope
    const { attribute, type = 'string', mode = 'text' } = schema

    if (el.length === 0) return null

    let value: string | null = ''
    if (attribute) {
      value = el.attr(attribute) ?? null
    } else if (type === 'html' || mode === 'html' || mode === 'outerHTML') {
      value =
        mode === 'outerHTML'
          ? $.html(el)
          : (el.html() ?? (type === 'html' ? '' : null))
      if (value) value = normalizeHtml(value.trim())
    } else if (mode === 'innerText') {
      value = getInnerText(el)
    } else {
      value = el.text().trim()
    }

    if (value === null) return null

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

  protected _getInitialElementScope(context: CheerioCrawlingContext): FetchElementScope {
    const { $ } = context
    if (!$) return null
    return { $, el: $.root() }
  }

  protected async executeAction(
    context: CheerioCrawlingContext,
    action: FetchEngineAction
  ): Promise<any> {
    const { $ } = context
    switch (action.type) {
      case 'dispose':
        // This action is used by the base class cleanup logic.
        return
      case 'click': {
        if (!$)
          throw new CommonError(
            `Cheerio context not available for action: ${action.type}`,
            'click'
          )
        const selector = action.selector
        const $link = $(selector).first()

        let absoluteUrl: string

        if ($link.length === 0) {
          // Selector not found. Let's assume it's a URL.
          try {
            absoluteUrl = new URL(
              selector,
              context.request.loadedUrl || context.request.url
            ).href
          } catch {
            throw new CommonError(
              `click: selector not found or invalid URL: ${selector}`,
              'click'
            )
          }
        } else if ($link.is('a') && $link.attr('href')) {
          const href = $link.attr('href')!
          absoluteUrl = new URL(
            href,
            context.request.loadedUrl || context.request.url
          ).href
        } else if (
          $link.is('input[type="submit"], button[type="submit"], button, input')
        ) {
          const $form = $link.closest('form')
          if ($form.length)
            return this.executeAction(context, {
              type: 'submit',
              selector: $form,
            })
          throw new CommonError(
            'click: submit-like element without form',
            'click'
          )
        } else {
          throw new CommonError(
            `click: unsupported element for http simulate. Selector: ${selector}`,
            'click'
          )
        }

        const loadedRequest = await context.sendRequest({ url: absoluteUrl })
        await this._updateStateAfterNavigation(context, loadedRequest)
        return
      }
      case 'fill': {
        if (!$)
          throw (
            new CommonError(
              `Cheerio context not available for action: ${action.type}`
            ),
            'fill'
          )
        const $input = $(action.selector).first()
        if ($input.length === 0)
          throw new CommonError(`fill: selector not found: ${action.selector}`)
        if ($input.is('input, textarea, select')) {
          $input.val(action.value)
          this.lastResponse = await this.buildResponse(context)
        } else {
          throw new CommonError(`fill: not a form field: ${action.selector}`)
        }
        return
      }
      case 'trim': {
        if (!$)
          throw new CommonError(
            `Cheerio context not available for action: ${action.type}`,
            'trim'
          )
        const { selectors, removeComments } = this._getTrimInfo(action.options)

        selectors.forEach((s) => $(s).remove())

        if (removeComments) {
          $('*')
            .contents()
            .filter((_, el: any) => el.type === 'comment')
            .remove()
        }
        this.lastResponse = await this.buildResponse(context)
        return
      }
      case 'waitFor':
        if (action.options?.ms) {
          await new Promise((resolve) =>
            setTimeout(resolve, action.options!.ms)
          )
        }
        return
      case 'submit': {
        if (!$)
          throw new CommonError(
            `Cheerio context not available for action: ${action.type}`,
            'submit'
          )
        const $form: CheerioNode =
          typeof action.selector === 'string'
            ? $(action.selector).first()
            : action.selector != null
              ? action.selector
              : $('form').first()
        if ($form.length === 0)
          throw new NotFoundError(action.selector, 'submit')
        const actionAttr =
          $form.attr('action') ||
          context.request.loadedUrl ||
          context.request.url
        const method = ($form.attr('method') || 'GET').toUpperCase()
        const url = new URL(
          actionAttr,
          context.request.loadedUrl || context.request.url
        ).href
        const formData: Record<string, string> = {}
        $form.find('input, select, textarea').each((_, el) => {
          const $el = $(el)
          const name = $el.attr('name')
          if (!name) return
          const value = $el.val()
          if (value != null) {
            formData[name] = String(value)
          }
        })

        let loadedRequest: any
        if (method === 'GET') {
          const urlObj = new URL(url)
          Object.entries(formData).forEach(([key, value]) =>
            urlObj.searchParams.set(key, value)
          )
          loadedRequest = await context.sendRequest({
            url: urlObj.href,
            method: 'GET',
          })
        } else {
          const enctype =
            action.options?.enctype ||
            ($form.attr('enctype') as any) ||
            'application/x-www-form-urlencoded'
          let body: any
          const headers: Record<string, string> = {}

          if (enctype === 'application/json') {
            body = JSON.stringify(formData)
            headers['Content-Type'] = 'application/json'
          } else {
            body = new URLSearchParams(formData).toString()
            headers['Content-Type'] = 'application/x-www-form-urlencoded'
          }
          loadedRequest = await context.sendRequest({
            url,
            method: 'POST',
            body,
            headers,
          })
        }

        await this._updateStateAfterNavigation(context, loadedRequest)
        return
      }
      default:
        throw new CommonError(
          `Unknown action type: ${(action as any).type}`,
          'CheerioFetchEngine.executeAction',
          ErrorCode.NotSupported
        )
    }
  }

  private async _updateStateAfterNavigation(
    context: CheerioCrawlingContext,
    loadedRequest: any
  ) {
    const response = loadedRequest

    // Update the context with the new response and body
    context.response = response
    context.body = response.body
    // Clear $ to force re-evaluation in _ensureCheerioContext/buildResponse
    ;(context as any).$ = undefined
    if (response.url) {
      context.request.loadedUrl = response.url
    }

    this.lastResponse = await this.buildResponse(context)
  }

  protected _createCrawler(
    options: CheerioCrawlerOptions,
    config?: Configuration
  ): CheerioCrawler {
    return new CheerioCrawler(options, config)
  }

  protected _getSpecificCrawlerOptions(
    ctx: FetchEngineContext
  ): CheerioCrawlerOptions {
    const crawlerOptions: CheerioCrawlerOptions = {
      additionalMimeTypes: ['text/plain'],
      maxRequestRetries: 1,
      requestHandlerTimeoutSecs: ctx.requestHandlerTimeoutSecs,
      proxyConfiguration: this.proxyConfiguration,
      preNavigationHooks: [
        ({ session, request }, gotOptions) => {
          // gotOptions.headers = { ...this.hdrs }; // 已经移到 goto 处理
          gotOptions.throwHttpErrors = ctx.throwHttpErrors
          if (this.opts?.timeoutMs)
            gotOptions.timeout = { request: this.opts.timeoutMs }
        },
      ],
    }
    return crawlerOptions
  }

  async goto(
    url: string,
    params?: GotoActionOptions
  ): Promise<void | FetchResponse> {
    // If a page is already active, tell it to clean up.
    if (this.isPageActive) {
      // We don't await this, as that would re-introduce the deadlock.
      this.dispatchAction({ type: 'dispose' }).catch(() => {
        // Ignore errors, we just want to signal disposal.
      })
    }

    const requestId = `req-${++this.requestCounter}`
    const promise = new Promise<FetchResponse>((resolve, reject) => {
      const timeoutMs = params?.timeoutMs || this.opts?.timeoutMs || 30000
      const timeoutId = setTimeout(() => {
        this.pendingRequests.delete(requestId)
        this.navigationLock.release() // Release lock on timeout
        reject(
          new CommonError(
            `goto timed out after ${timeoutMs}ms.`,
            'gotoTimeout',
            ErrorCode.RequestTimeout
          )
        )
      }, timeoutMs)

      const cleanupAndResolve = (response: FetchResponse) => {
        clearTimeout(timeoutId)
        resolve(response)
      }

      const cleanupAndReject = (error: any) => {
        clearTimeout(timeoutId)
        reject(error)
      }

      this.pendingRequests.set(requestId, {
        resolve: cleanupAndResolve,
        reject: cleanupAndReject,
      })
    })

    // Add the request to the queue BEFORE awaiting the lock.
    // This prevents a race condition where the crawler might shut down
    // thinking the queue is empty.
    this.requestQueue!.addRequest({
      ...params,
      url,
      headers: { ...this.hdrs, ...params?.headers },
      userData: { requestId },
      uniqueKey: `${url}-${requestId}`,
    }).catch((error) => {
      const pending = this.pendingRequests.get(requestId)
      if (pending) {
        this.pendingRequests.delete(requestId)
        this.navigationLock.release()
        pending.reject(error)
      }
    })

    // Now, wait for the previous handler to finish and release its lock.
    await this.navigationLock

    // Set a new lock for this navigation session.
    this.navigationLock = createPromiseLock()

    return promise
  }
}

FetchEngine.register(CheerioFetchEngine)
