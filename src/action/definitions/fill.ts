import { FetchContext } from "../../core/context";
import { BaseFetchActionOptions, FetchAction } from "../fetch-action";

export class FillAction extends FetchAction {
  static override id = 'fill';
  static override returnType = 'none' as const;
  static override capabilities = { http: 'simulate' as const, browser: 'native' as const };

  async onExecute(context: FetchContext, options?: BaseFetchActionOptions): Promise<void> {
    const { selector, value, ...restOptions } = options?.params || {};
    if (!selector) throw new Error('Selector is required for fill action');
    if (value === undefined) throw new Error('Value is required for fill action');
    await this.delegateToEngine(context, 'fill', selector, value, restOptions);
  }
}

FetchAction.register(FillAction);
