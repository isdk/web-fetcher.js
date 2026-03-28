import { FetchContext } from '../../core/context'
import { BaseFetchActionProperties, FetchAction } from '../fetch-action'

export interface MouseMoveParams {
  x?: number
  y?: number
  selector?: string
  steps?: number
}

export class MouseMoveAction extends FetchAction {
  static override id = 'mouseMove'
  static override returnType = 'none' as const
  static override capabilities = {
    http: 'noop' as const,
    browser: 'native' as const,
  }

  async onExecute(
    context: FetchContext,
    options?: BaseFetchActionProperties
  ): Promise<void> {
    const params = options?.params as MouseMoveParams
    await this.delegateToEngine(context, 'mouseMove', params)
  }
}

export interface MouseClickParams {
  x?: number
  y?: number
  button?: 'left' | 'right' | 'middle'
  clickCount?: number
  delay?: number
}

export class MouseClickAction extends FetchAction {
  static override id = 'mouseClick'
  static override returnType = 'none' as const
  static override capabilities = {
    http: 'noop' as const,
    browser: 'native' as const,
  }

  async onExecute(
    context: FetchContext,
    options?: BaseFetchActionProperties
  ): Promise<void> {
    const params = options?.params as MouseClickParams
    await this.delegateToEngine(context, 'mouseClick', params)
  }
}

FetchAction.register(MouseMoveAction)
FetchAction.register(MouseClickAction)
