import { PlaywrightCrawler, Configuration } from 'crawlee'
import type {
  PlaywrightCrawlingContext,
  PlaywrightCrawlerOptions,
} from 'crawlee'
import { firefox } from 'playwright'
import { FetchEngine, type GotoActionOptions, FetchEngineAction, getRandomDelay } from './base'
import { FetchResponse } from '../core/types'
import { FetchEngineContext } from '../core/context'
import { CommonError, ErrorCode, NotFoundError } from '@isdk/common-error'
import { ExtractValueSchema, FetchElementScope } from '../core/extract'
import { normalizeHtml } from '../utils/cheerio-helpers'
import { isDownloadAllowed } from '../utils'

const DefaultTimeoutMs = 3_000

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
    const scopes = Array.isArray(scope) ? scope : [scope]
    const results: Locator[] = []

    for (const loc of scopes) {
      const matches = await loc.locator(selector).all()
      results.push(...matches)

      try {
        const isMatch = await loc.evaluate(
          (el, sel) => el.matches(sel),
          selector
        )
        if (isMatch) {
          // Handled in order below
        }
      } catch (e) {
        // Ignore
      }
    }

    const finalResults: Locator[] = []
    for (const loc of scopes) {
      let isSelfMatch = false
      try {
        isSelfMatch = await loc.evaluate((el, sel) => el.matches(sel), selector)
      } catch {}

      if (isSelfMatch) finalResults.push(loc)

      const descendants = await loc.locator(selector).all()
      finalResults.push(...descendants)
    }

    return finalResults
  }

  async _nextSiblingsUntil(
    scope: Locator,
    untilSelector?: string
  ): Promise<FetchElementScope[]> {
    const allFollowing = await scope.locator('xpath=following-sibling::*').all()
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
    const parent = scope.locator('xpath=..')
    if ((await parent.count()) === 0) return null
    return parent.first()
  }

  async _isSameElement(scope1: Locator, scope2: Locator): Promise<boolean> {
    const h1 = await scope1.elementHandle()
    const h2 = await scope2.elementHandle()
    if (!h1 || !h2) return false
    try {
      const result = await h1.evaluate((node1, node2) => node1 === node2, h2)
      return result
    } finally {
      await h1.dispose()
      await h2.dispose()
    }
  }

  async _findClosestAncestor(
    scope: Locator,
    candidates: Locator[]
  ): Promise<FetchElementScope | null> {
    if (candidates.length === 0) return null

    const scopeHandle = await scope.elementHandle()
    if (!scopeHandle) return null

    const candidateHandles = await Promise.all(
      candidates.map((c) => c.elementHandle())
    )

    try {
      const matchIndex = await scopeHandle.evaluate((node, nodes) => {
        const candidateSet = new Set(nodes)
        let current: SVGElement | HTMLElement | null = node
        while (current) {
          if (candidateSet.has(current)) {
            return nodes.indexOf(current)
          }
          current = current.parentElement
        }
        return -1
      }, candidateHandles)

      if (matchIndex !== -1) {
        return candidates[matchIndex]
      }
      return null
    } finally {
      await scopeHandle.dispose()
      await Promise.all(candidateHandles.map((h) => h?.dispose()))
    }
  }

  async _contains(container: Locator, element: Locator): Promise<boolean> {
    const h1 = await container.elementHandle()
    const h2 = await element.elementHandle()
    if (!h1 || !h2) return false
    try {
      return await h1.evaluate((parent, child) => parent.contains(child), h2)
    } finally {
      await h1.dispose()
      await h2.dispose()
    }
  }

  async _findCommonAncestor(
    scope1: Locator,
    scope2: Locator
  ): Promise<FetchElementScope | null> {
    const h1 = await scope1.elementHandle()
    const h2 = await scope2.elementHandle()
    if (!h1 || !h2) return null

    try {
      const resultHandle = await h1.evaluateHandle((node1, node2) => {
        function getXPath(elm: any): string {
          if (elm.id) return `//*[@id="${elm.id}"]`
          if (elm === document.body) return '/html/body'
          if (elm === document.documentElement) return '/html'

          let ix = 0
          const siblings = elm.parentNode ? elm.parentNode.childNodes : []
          for (let i = 0; i < siblings.length; i++) {
            const sibling = siblings[i]
            if (sibling === elm) {
              return (
                getXPath(elm.parentNode) +
                '/' +
                elm.tagName.toLowerCase() +
                '[' +
                (ix + 1) +
                ']'
              )
            }
            if (sibling.nodeType === 1 && sibling.tagName === elm.tagName) ix++
          }
          return ''
        }

        let result: Node | null = null
        if (node1 === node2) result = node1
        else if (node1.contains(node2)) result = node1
        else if (node2.contains(node1)) result = node2
        else {
          const parents2 = new Set()
          let curr: any = node2.parentElement
          while (curr) {
            parents2.add(curr)
            curr = curr.parentElement
          }

          curr = node1.parentElement
          while (curr) {
            if (parents2.has(curr)) {
              result = curr
              break
            }
            curr = curr.parentElement
          }
        }

        if (!result || result.nodeType !== 1) return null
        return getXPath(result)
      }, h2)

      if (!resultHandle) return null
      const xpath = await resultHandle.jsonValue()

      if (typeof xpath === 'string' && xpath) {
        return scope1.page().locator(`xpath=${xpath}`)
      }
      return null
    } finally {
      await h1.dispose()
      await h2.dispose()
    }
  }

  async _findContainerChild(
    element: Locator,
    container: Locator
  ): Promise<FetchElementScope | null> {
    const hElement = await element.elementHandle()
    const hContainer = await container.elementHandle()
    if (!hElement || !hContainer) return null

    try {
      const resultHandle = await hElement.evaluateHandle(
        (node, containerNode) => {
          function getXPath(elm: any): string {
            if (elm.id) return `//*[@id="${elm.id}"]`
            if (elm === document.body) return '/html/body'
            if (elm === document.documentElement) return '/html'

            let ix = 0
            const siblings = elm.parentNode ? elm.parentNode.childNodes : []
            for (let i = 0; i < siblings.length; i++) {
              const sibling = siblings[i]
              if (sibling === elm) {
                return (
                  getXPath(elm.parentNode) +
                  '/' +
                  elm.tagName.toLowerCase() +
                  '[' +
                  (ix + 1) +
                  ']'
                )
              }
              if (sibling.nodeType === 1 && sibling.tagName === elm.tagName)
                ix++
            }
            return ''
          }

          let result: any = null
          if (node === containerNode) result = node
          else {
            let curr: any = node
            while (curr) {
              if (curr.parentElement === containerNode) {
                result = curr
                break
              }
              curr = curr.parentElement
            }
          }

          if (!result || result.nodeType !== 1) return null
          return getXPath(result)
        },
        hContainer
      )

      if (!resultHandle) return null
      const xpath = await resultHandle.jsonValue()

      if (typeof xpath === 'string' && xpath) {
        return element.page().locator(`xpath=${xpath}`)
      }
      return null
    } finally {
      await hElement.dispose()
      await hContainer.dispose()
    }
  }

  async _extractValue(
    schema: ExtractValueSchema,
    scope: Locator
  ): Promise<any> {
    const { attribute, type = 'string', mode = 'text' } = schema

    const count = await scope.count()
    this._logDebug(
      'extract',
      `_extractValue: count=${count} schema=${JSON.stringify(schema)}`
    )

    if (count === 0) return null

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

  protected _getInitialElementScope(
    context: PlaywrightCrawlingContext
  ): FetchElementScope {
    const { page } = context
    if (!page) return null
    return page.locator(':root')
  }

  protected isPageContextValid(context: PlaywrightCrawlingContext): boolean {
    return !!context.page && !context.page.isClosed()
  }

  protected async _waitForNavigation(
    context: PlaywrightCrawlingContext,
    oldUrl: string,
    actionType: string
  ) {
    const { page } = context
    const defaultTimeout = this.opts?.timeoutMs || DefaultTimeoutMs

    try {
      // Wait for URL to change (302 redirects will be followed automatically)
      await page.waitForURL((url) => url.href !== oldUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 5000, // Short timeout for potential navigation
      })
      this._logDebug(actionType, 'URL changed to:', page.url())
    } catch (e) {
      this._logDebug(actionType, 'No URL change detected within 5s')
    }

    await page.waitForLoadState('networkidle', { timeout: defaultTimeout })
    this.lastResponse = await this.buildResponse(context)
  }

  // ===== 下载捕获（Playwright download 事件）=====

  /** 获取当前请求上下文捕获到的最近一个 download 对象（Crawlee 按请求隔离收集）。 */
  private async _getCapturedDownload(
    context: PlaywrightCrawlingContext
  ): Promise<any | null> {
    const listDownloads = (context as any).listDownloads as
      | (() => Promise<any[]>)
      | undefined
    if (typeof listDownloads !== 'function') return null
    const downloads = await listDownloads()
    return downloads.length ? downloads[downloads.length - 1] : null
  }

  /** 将 Playwright Download 对象读取为 Buffer（等待下载完成后流式收集，注意大文件内存占用）。 */
  private async _readDownload(download: any): Promise<Buffer> {
    const stream = await download.createReadStream()
    const chunks: Buffer[] = []
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    }
    return Buffer.concat(chunks)
  }

  /** 由 Playwright Download 对象构造标准 FetchResponse（body 为原始二进制 Buffer）。 */
  private async _buildDownloadResponse(
    context: PlaywrightCrawlingContext,
    download: any
  ): Promise<FetchResponse> {
    const headers: Record<string, string> = {}
    const contentType = this._getDownloadContentType(download)
    if (contentType) headers['content-type'] = contentType
    const body = await this._readDownload(download)
    const result: FetchResponse = {
      url: download.url() || context.request.url,
      finalUrl:
        download.url() || context.request.loadedUrl || context.request.url,
      statusCode: 200,
      headers,
      body,
      html: '',
      text: '',
    }
    return this._enrichResponse(context, result)
  }

  /**
   * 若当前上下文捕获了允许下载的 download，构造并返回响应；否则返回 null。
   * 是否允许由 `additionalMimeTypes` 决定（文本类 MIME 始终允许），与 http 引擎语义一致。
   */
  private async _tryBuildDownloadResponse(
    context: PlaywrightCrawlingContext
  ): Promise<FetchResponse | null> {
    const download = await this._getCapturedDownload(context)
    if (!download) return null
    const contentType = this._getDownloadContentType(download)
    if (!isDownloadAllowed(contentType, this.opts?.additionalMimeTypes)) {
      this._logDebug(
        'download',
        `Download content-type ${contentType || '(unknown)'} not allowed by additionalMimeTypes, skipping.`
      )
      return null
    }
    try {
      const response = await this._buildDownloadResponse(context, download)
      this._logDebug(
        'download',
        `Captured download: ${download.suggestedFilename()} (${response.contentType})`
      )
      return response
    } catch (err) {
      this._logDebug(
        'download',
        `Failed to read download ${download.suggestedFilename()}:`,
        err
      )
      return null
    }
  }

  /** goto 路径：若捕获了允许的下载，resolve gotoPromise 并返回 true。 */
  private async _tryResolveDownload(
    context: PlaywrightCrawlingContext
  ): Promise<boolean> {
    const requestId = context.request.userData.requestId
    const gotoPromise = this.pendingRequests.get(requestId)
    if (!gotoPromise) return false
    const response = await this._tryBuildDownloadResponse(context)
    if (!response) return false
    this.pendingRequests.delete(requestId)
    this.lastResponse = response
    gotoPromise.resolve(response)
    return true
  }

  protected currentMousePos = { x: 0, y: 0 }

  protected async _sharedRequestHandler(
    context: PlaywrightCrawlingContext,
    error?: Error
  ): Promise<void> {
    const { page } = context
    if (page && !this.mouseInitialized) {
      await this._initializeMousePos(page)
    }
    // 兜底：部分浏览器引擎在触发下载时不会中止导航（goto 正常返回），这里同样捕获下载。
    // 若已 resolve gotoPromise，仍需调用 super 完成清理（释放锁、关闭页面等）。
    if (await this._tryResolveDownload(context)) {
      return super._sharedRequestHandler(context, error)
    }
    return super._sharedRequestHandler(context, error)
  }

  protected async _sharedFailedRequestHandler(
    context: PlaywrightCrawlingContext & {
      response?: FetchResponse
      body?: string | Buffer
    },
    error?: Error
  ): Promise<void> {
    // 导航因触发下载而中止（如 net::ERR_ABORTED）时，将 download 作为成功响应返回，
    // 而不是报导航错误。随后仍调用共享 handler 完成清理。
    if (await this._tryResolveDownload(context)) {
      return this._sharedRequestHandler(context, error)
    }
    return super._sharedFailedRequestHandler(context, error)
  }

  protected mouseInitialized = false

  // Playwright 的 Download 对象不提供 contentType()，需要跟踪页面响应头来确定下载文件类型。
  private _instrumentedPages = new WeakSet<any>()
  private _downloadContentTypes = new Map<string, string>()

  /** 为页面挂载 response 监听，记录各 URL 的 Content-Type（每个页面只挂一次）。 */
  private _instrumentPage(page: any) {
    if (this._instrumentedPages.has(page)) return
    this._instrumentedPages.add(page)
    page.on('response', (response: any) => {
      try {
        const contentType = response.headers()['content-type']
        if (contentType) {
          this._downloadContentTypes.set(response.url(), contentType)
        }
      } catch {
        // 忽略序列化/监听错误
      }
    })
  }

  /** 获取下载 URL 对应的 Content-Type（未捕获到时返回空串）。 */
  private _getDownloadContentType(download: any): string {
    return this._downloadContentTypes.get(download.url()) || ''
  }

  protected async _initializeMousePos(page: Page) {
    if (
      this.mouseInitialized ||
      this.currentMousePos.x !== 0 ||
      this.currentMousePos.y !== 0
    ) {
      this.mouseInitialized = true
      return
    }

    const startOnLeftEdge = Math.random() > 0.5
    let x = 0
    let y = 0

    if (startOnLeftEdge) {
      x = 0
      y = Math.floor(Math.random() * 600) + 100
    } else {
      x = Math.floor(Math.random() * 800) + 100
      y = 0
    }

    this.currentMousePos = { x, y }
    try {
      await page.mouse.move(x, y)
      this.mouseInitialized = true
    } catch (e) {
      // Ignore if page is navigating
    }
  }

  protected _getTrajectory(
    start: { x: number; y: number },
    end: { x: number; y: number },
    steps = -1
  ) {
    const trajectory = []
    const distance = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    )

    if (steps === -1) {
      // Use 2-5 segments for the curve. Browser handles the pixel-level smoothing.
      steps = Math.max(2, Math.min(3, Math.floor(distance / 400) + 2))
    }

    // Quadratic Bézier curve (subtle 0.1 intensity)
    const midX = start.x + (end.x - start.x) / 2
    const midY = start.y + (end.y - start.y) / 2
    const cp = {
      x: midX + (Math.random() - 0.5) * distance * 0.1,
      y: midY + (Math.random() - 0.5) * distance * 0.1,
    }

    const easeInOutCubic = (t: number): number =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

    for (let i = 1; i <= steps; i++) {
      const t = easeInOutCubic(i / steps)
      const x =
        (1 - t) * (1 - t) * start.x + 2 * (1 - t) * t * cp.x + t * t * end.x
      const y =
        (1 - t) * (1 - t) * start.y + 2 * (1 - t) * t * cp.y + t * t * end.y
      trajectory.push({ x, y })
    }
    return trajectory
  }

  protected async _moveToPos(
    context: PlaywrightCrawlingContext,
    target: { x: number; y: number },
    steps: number = -1
  ): Promise<{ x: number; y: number }> {
    const { page } = context
    const startPos = { ...this.currentMousePos }
    if (target.x < 0) {
      target.x =
        Math.floor(Math.random() * getRandomDelay(Math.abs(target.x))) +
        (startPos.x || 0)
    }
    if (target.y < 0) {
      target.y =
        Math.floor(Math.random() * getRandomDelay(Math.abs(target.y))) +
        (startPos.y || 0)
    }
    const viewport = page.viewportSize()
    if (viewport) {
      target.x = Math.max(0, Math.min(target.x, viewport.width - 1))
      target.y = Math.max(0, Math.min(target.y, viewport.height - 1))
    }

    const trajectory = this._getTrajectory(startPos, target, steps)

    const totalDistance = Math.sqrt(
      Math.pow(target.x - startPos.x, 2) + Math.pow(target.y - startPos.y, 2)
    )

    // Global pixel-per-step density (1 to 3 pixels per step)
    const pixelsPerStep = Math.max(1, Math.min(3, totalDistance / 500 + 1))

    // Find the longest segment to ensure it's smooth
    let maxSegmentDist = 0
    let lastP = startPos
    for (const p of trajectory) {
      const d = Math.sqrt(
        Math.pow(p.x - lastP.x, 2) + Math.pow(p.y - lastP.y, 2)
      )
      if (d > maxSegmentDist) maxSegmentDist = d
      lastP = p
    }

    // IMPORTANT: Use the same number of steps for EVERY segment.
    // Since segments are spatially eased (closer at ends, further in middle),
    // using constant steps/time per segment creates natural acceleration/deceleration.
    const stepsPerSegment = Math.max(
      5,
      Math.floor(maxSegmentDist / pixelsPerStep)
    )

    for (const pos of trajectory) {
      // Browser-side interpolation handles the smooth movement within each eased segment
      await page.mouse.move(pos.x, pos.y, { steps: stepsPerSegment })
    }

    this.currentMousePos = target
    return this.currentMousePos
  }

  protected async _ensureVisible(
    context: PlaywrightCrawlingContext,
    selector: string
  ): Promise<{ x: number; y: number }> {
    const { page } = context
    const loc = page.locator(selector).first()
    await loc.scrollIntoViewIfNeeded()
    const box = await loc.boundingBox()
    if (!box) {
      throw new CommonError(
        `Selector not found or not visible: ${selector}`,
        'ensureVisible'
      )
    }

    return {
      x: box.x + box.width / 2,
      y: box.y + box.height / 2,
    }
  }

  protected async _moveToSelector(
    context: PlaywrightCrawlingContext,
    selector: string,
    steps: number = -1
  ): Promise<{ x: number; y: number }> {
    const pos = await this._ensureVisible(context, selector)
    return this._moveToPos(context, pos, steps)
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
        // Workaround for a critical deadlock in camoufox-js/Firefox:
        // When Firefox renders an 'application/json' response, it creates a synthetic JSON Viewer document.
        // The injected evasions from camoufox-js poison this specific page's context.
        // Any subsequent navigation away from this JSON document (even to about:blank) will
        // cause the underlying Playwright renderer teardown process to hang indefinitely.
        //
        // To fix this with zero network intrusion (and avoid proxy-crawlee cache conflicts),
        // we detect if the current page was poisoned by JSON, and if so, we create a fresh,
        // unpolluted page in the same BrowserContext to handle the new navigation.
        // The old page is safely closed by the _sharedRequestHandler finally block.
        const isJson = this.lastResponse?.contentType === 'application/json'
        if (this.opts?.antibot && isJson) {
          context.page = await context.page.context().newPage()
        }

        let response: Awaited<ReturnType<Page['goto']>> | null = null
        try {
          response = await context.page.goto(action.url, {
            waitUntil: action.opts?.waitUntil || 'domcontentloaded',
            timeout: this.opts?.timeoutMs || DefaultTimeoutMs,
          })
        } catch (err) {
          // 导航触发下载（ERR_ABORTED）→ 返回下载内容而非导航错误
          const downloadResponse = await this._tryBuildDownloadResponse(context)
          if (downloadResponse) {
            this.lastResponse = downloadResponse
            return downloadResponse
          }
          throw err
        }
        if (response) {
          context = { ...context, response }
          this._logDebug(
            'navigate',
            `Navigation status: ${response.status()} for ${response.url()}`
          )
        }
        const fetchResponse = await this.buildResponse(context)
        // 兜底：goto 未抛错但实际触发了下载
        const downloadResponse = await this._tryBuildDownloadResponse(context)
        if (downloadResponse) {
          this.lastResponse = downloadResponse
          return downloadResponse
        }
        this.lastResponse = fetchResponse
        return fetchResponse
      }
      case 'mouseMove': {
        const { x, y, selector, steps = -1 } = action.params
        if (selector) {
          await this._moveToSelector(context, selector, steps)
          this.lastResponse = await this.buildResponse(context)
        } else if (x !== undefined && y !== undefined) {
          await this._moveToPos(context, { x, y }, steps)
        }
        return
      }
      case 'mouseClick': {
        const {
          x,
          y,
          selector,
          button = 'left',
          clickCount = 1,
          delay = 0,
          steps = -1,
        } = action.params as any
        if (selector) {
          await this._moveToSelector(context, selector, steps)
        } else if (x !== undefined && y !== undefined) {
          await this._moveToPos(context, { x, y }, steps)
        }

        await page.mouse.click(this.currentMousePos.x, this.currentMousePos.y, {
          button,
          clickCount,
          delay: getRandomDelay(delay || 50, 0.2),
        })
        // Small delay to allow DOM updates to settle
        await page.waitForTimeout(getRandomDelay(100, 0.5))
        this.lastResponse = await this.buildResponse(context)
        return
      }
      case 'mouseWheel': {
        const {
          x,
          y,
          selector,
          deltaX = 0,
          deltaY = 0,
          steps = 1,
        } = action.params as any
        if (selector) {
          const pos = await this._ensureVisible(context, selector)
          await page.mouse.move(pos.x, pos.y)
          this.currentMousePos = pos
        } else if (x !== undefined && y !== undefined) {
          await this._moveToPos(context, { x, y })
        }

        if (steps > 1) {
          const stepDeltaX = deltaX / steps
          const stepDeltaY = deltaY / steps
          for (let i = 0; i < steps; i++) {
            await page.mouse.wheel(stepDeltaX, stepDeltaY)
          }
        } else {
          await page.mouse.wheel(deltaX, deltaY)
        }

        // Small delay to allow potential scroll-triggered updates to settle
        await page.waitForTimeout(getRandomDelay(100, 0.5))
        this.lastResponse = await this.buildResponse(context)
        return
      }
      case 'scrollIntoView': {
        const { selector } = action.params
        await this._ensureVisible(context, selector)
        this.lastResponse = await this.buildResponse(context)
        return
      }
      case 'keyboardType': {
        const { text, delay = 150 } = action.params
        await page.keyboard.type(text, { delay: getRandomDelay(delay) })
        this.lastResponse = await this.buildResponse(context)
        return
      }
      case 'keyboardPress': {
        const { key, delay = 50 } = action.params
        await page.keyboard.press(key, { delay: getRandomDelay(delay) })
        this.lastResponse = await this.buildResponse(context)
        return
      }
      case 'click': {
        const oldUrl = page.url()
        await page.click(action.selector, { timeout: defaultTimeout })
        await this._waitForNavigation(context, oldUrl, 'click')
        // 点击触发了下载 → 返回下载内容
        const downloadResponse = await this._tryBuildDownloadResponse(context)
        if (downloadResponse) {
          this.lastResponse = downloadResponse
          return downloadResponse
        }
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
          if (action.options?.ms) {
            await page.waitForTimeout(getRandomDelay(action.options.ms, 0.1))
          }
        } catch (e) {
          if (action.options?.failOnTimeout === false) {
            // ignore error
          } else {
            throw e
          }
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
          // ... (keep existing JSON handling) ...
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
          this._logDebug('submit', 'Submitting form by form.submit()...')
          const oldUrl = page.url()

          await el.evaluate((form: HTMLFormElement) => form.submit())
          await this._waitForNavigation(context, oldUrl, 'submit')
          // 表单提交触发了下载 → 返回下载内容
          const downloadResponse = await this._tryBuildDownloadResponse(context)
          if (downloadResponse) {
            this.lastResponse = downloadResponse
            return downloadResponse
          }
          return
        }
      }
      case 'evaluate': {
        const { fn, args = [] } = action.params
        const prevUrl = page.url()

        let result: any
        if (typeof fn === 'function') {
          result = await page.evaluate(fn, args)
        } else {
          result = await page.evaluate(
            ([f, a]: [any, any]) => {
              // eslint-disable-next-line no-eval
              const evaluated = (0, eval)(`(${f})`)
              return typeof evaluated === 'function' ? evaluated(a) : evaluated
            },
            [fn, args] as [any, any]
          )
        }

        // If URL changed or page is navigating, wait for it to settle
        if (page.url() !== prevUrl) {
          await page
            .waitForLoadState('domcontentloaded', { timeout: defaultTimeout })
            .catch(() => {})
          this.lastResponse = await this.buildResponse(context)
        } else {
          // Even if URL didn't change, the content might have been updated by JS
          try {
            this.lastResponse = await this.buildResponse(context)
          } catch (e) {
            // If buildResponse fails (e.g. page navigated away during build), try one more wait
            await page
              .waitForLoadState('domcontentloaded', { timeout: defaultTimeout })
              .catch(() => {})
            this.lastResponse = await this.buildResponse(context)
          }
        }
        return result
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
      maxRequestRetries: ctx.retries ?? 3,
      headless,
      proxyConfiguration: this.proxyConfiguration,
      requestHandlerTimeoutSecs: ctx.requestHandlerTimeoutSecs,
      navigationTimeoutSecs: this.opts?.timeoutMs
        ? Math.ceil(this.opts.timeoutMs / 1000)
        : undefined,
      preNavigationHooks: [
        async ({ page, request }) => {
          if (this.opts?.timeoutMs) {
            page.setDefaultTimeout(this.opts.timeoutMs)
            page.setDefaultNavigationTimeout(this.opts.timeoutMs)
          }

          // 跟踪响应头以便下载捕获时确定文件类型（必须在导航前挂载）。
          this._instrumentPage(page)

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

    const userLaunchOptions = ctx.browser?.launchOptions || {}

    if (this.opts?.antibot) {
      crawlerOptions.browserPoolOptions = {
        useFingerprints: false,
      }

      const { launchOptions } = await import('camoufox-js')
      const lo = await launchOptions({
        headless,
        ...userLaunchOptions,
      })

      crawlerOptions.launchContext = {
        launcher: firefox,
        launchOptions: {
          ...lo,
          viewport: null,
        },
      }

      crawlerOptions.postNavigationHooks = [
        async ({ page, handleCloudflareChallenge }) => {
          await handleCloudflareChallenge()
        },
      ]
    } else {
      if (Object.keys(userLaunchOptions).length > 0) {
        crawlerOptions.launchContext = {
          launchOptions: userLaunchOptions,
        }
      }
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
      headers: this.hdrs,
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
