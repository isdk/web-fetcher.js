import { FetchContext } from '../../core/context'
import { BaseFetchActionProperties, FetchAction } from '../fetch-action'

export class GetContentAction extends FetchAction {
  static override id = 'getContent'
  static override returnType = 'response' as const
  static override capabilities = {
    http: 'native' as const,
    browser: 'native' as const,
  }

  async onExecute(
    context: FetchContext,
    options?: BaseFetchActionProperties
  ): Promise<any> {
    return await this.delegateToEngine(context, 'getContent', options?.params)
  }
}

FetchAction.register(GetContentAction)
