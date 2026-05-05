import { BaseFetchActionProperties, FetchContext } from '../../core'
import { FetchAction } from '../fetch-action'

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

export interface ScrollIntoViewParams {
  selector: string
}

export class ScrollIntoViewAction extends FetchAction {
  static override id = 'scrollIntoView'
  static override returnType = 'none' as const
  static override capabilities = {
    http: 'noop' as const,
    browser: 'native' as const,
  }

  async onExecute(
    context: FetchContext,
    options?: BaseFetchActionProperties
  ): Promise<void> {
    const params = options?.params as ScrollIntoViewParams
    await this.delegateToEngine(context, 'scrollIntoView', params)
  }
}

export interface MouseWheelParams {
  /**
   * Target X coordinate for the mouse wheel event.
   */
  x?: number
  /**
   * Target Y coordinate for the mouse wheel event.
   */
  y?: number
  /**
   * Selector for the element to scroll. If provided, mouse will move to this element before scrolling.
   */
  selector?: string
  /**
   * Horizontal scroll delta.
   */
  deltaX?: number
  /**
   * Vertical scroll delta.
   */
  deltaY?: number
  /**
   * Number of steps to split the scroll into for simulating human-like behavior.
   */
  steps?: number
}

export class MouseWheelAction extends FetchAction {
  static override id = 'mouseWheel'
  static override returnType = 'none' as const
  static override capabilities = {
    http: 'noop' as const,
    browser: 'native' as const,
  }

  async onExecute(
    context: FetchContext,
    options?: BaseFetchActionProperties
  ): Promise<void> {
    const params = options?.params as MouseWheelParams
    await this.delegateToEngine(context, 'mouseWheel', params)
  }
}

FetchAction.register(MouseMoveAction)
FetchAction.register(MouseClickAction)
FetchAction.register(ScrollIntoViewAction)
FetchAction.register(MouseWheelAction)
