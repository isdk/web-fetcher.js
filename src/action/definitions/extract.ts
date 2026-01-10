import { FetchContext } from '../../core/context'
import { ExtractSchema } from '../../core/extract'
import { BaseFetchActionProperties, FetchAction } from '../fetch-action'

export interface ExtractActionProperties extends BaseFetchActionProperties {
  params: ExtractSchema
}

export class ExtractAction extends FetchAction {
  static override id = 'extract'
  static override returnType = 'any' as const
  static override capabilities = {
    http: 'native' as const,
    browser: 'native' as const,
  }

  async onExecute(
    context: FetchContext,
    options?: ExtractActionProperties
  ): Promise<any> {
    const schema = options?.params
    if (!schema) throw new Error('Schema is required for extract action')
    return this.delegateToEngine(context, 'extract', schema)
  }
}

FetchAction.register(ExtractAction)
