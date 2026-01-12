import { FetchContext } from '../../core/context'
import { BaseFetchActionProperties, FetchAction } from '../fetch-action'

export class TrimAction extends FetchAction {
  static override id = 'trim'
  static override returnType = 'none' as const
  static override capabilities = {
    http: 'simulate' as const,
    browser: 'native' as const,
  }

  async onExecute(
    context: FetchContext,
    options?: BaseFetchActionProperties
  ): Promise<void> {
    const params = options?.params || {}
    await this.delegateToEngine(context, 'trim', params)
  }
}

FetchAction.register(TrimAction)
