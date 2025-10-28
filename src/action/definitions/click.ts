import { FetchContext } from "../../core/context";
import { BaseFetchActionProperties, FetchAction } from "../fetch-action";

export class ClickAction extends FetchAction {
  static override id = 'click';
  static override returnType = 'none' as const;
  static override capabilities = { http: 'simulate' as const, browser: 'native' as const };

  async onExecute(context: FetchContext, options?: BaseFetchActionProperties): Promise<void> {
    const { selector, ...restOptions } = options?.params || {};
    if (!selector) throw new Error('Selector is required for click action');
    await this.delegateToEngine(context, 'click', selector, restOptions);
  }
}

FetchAction.register(ClickAction);
