import { FetchContext } from '../../core/context'
import { EvaluateActionOptions } from '../../engine/base'
import { BaseFetchActionProperties, FetchAction } from '../fetch-action'

/**
 * Action that evaluates a JavaScript function or expression in the context of the page.
 *
 * @remarks
 * This action is cross-engine compatible. In Cheerio (HTTP) mode, it simulates a browser environment
 * by providing `window` and `document` objects linked to the Cheerio instance.
 *
 * Key features:
 * - Supports async functions.
 * - Supports direct expressions (e.g., `"document.title"`).
 * - Detects URL changes and triggers navigation.
 * - Consistent parameter passing with Playwright (single argument).
 *
 * @example
 * ```json
 * {
 *   "action": "evaluate",
 *   "params": {
 *     "fn": "({ selector }) => document.querySelector(selector).textContent",
 *     "args": { "selector": "h1" }
 *   },
 *   "storeAs": "pageTitle"
 * }
 * ```
 */
export class EvaluateAction extends FetchAction {
  static override id = 'evaluate'
  static override returnType = 'any' as const
  static override capabilities = {
    http: 'simulate' as const,
    browser: 'native' as const,
  }

  async onExecute(
    context: FetchContext,
    options?: BaseFetchActionProperties
  ): Promise<any> {
    const params = options?.params as EvaluateActionOptions | undefined
    if (!params) throw new Error('evaluate action: params is required')

    return await this.delegateToEngine(context, 'evaluate', params)
  }
}

FetchAction.register(EvaluateAction)
