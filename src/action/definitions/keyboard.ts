import { FetchContext } from '../../core/context'
import { BaseFetchActionProperties, FetchAction } from '../fetch-action'

export interface KeyboardTypeParams {
  text: string
  delay?: number
}

export class KeyboardTypeAction extends FetchAction {
  static override id = 'keyboardType'
  static override returnType = 'none' as const
  static override capabilities = {
    http: 'noop' as const,
    browser: 'native' as const,
  }

  async onExecute(
    context: FetchContext,
    options?: BaseFetchActionProperties
  ): Promise<void> {
    const params = options?.params as KeyboardTypeParams
    if (!params?.text) throw new Error('text is required for keyboardType action')
    await this.delegateToEngine(context, 'keyboardType', params.text, params.delay)
  }
}

export interface KeyboardPressParams {
  key: string
  delay?: number
}

export class KeyboardPressAction extends FetchAction {
  static override id = 'keyboardPress'
  static override returnType = 'none' as const
  static override capabilities = {
    http: 'noop' as const,
    browser: 'native' as const,
  }

  async onExecute(
    context: FetchContext,
    options?: BaseFetchActionProperties
  ): Promise<void> {
    const params = options?.params as KeyboardPressParams
    if (!params?.key) throw new Error('key is required for keyboardPress action')
    await this.delegateToEngine(context, 'keyboardPress', params.key, params.delay)
  }
}

FetchAction.register(KeyboardTypeAction)
FetchAction.register(KeyboardPressAction)
