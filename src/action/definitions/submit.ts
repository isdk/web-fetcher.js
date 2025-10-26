import { FetchContext } from "../../core/context";
import { BaseFetchActionOptions, FetchAction } from "../fetch-action";

export class SubmitAction extends FetchAction {
  static override id = 'submit';
  static override returnType = 'none' as const;
  static override capabilities = { http: 'simulate' as const, browser: 'native' as const };

  async onExecute(context: FetchContext, options?: BaseFetchActionOptions): Promise<void> {
    const { selector, ...restOptions } = options?.params || {};
    await this.delegateToEngine(context, 'submit', selector, restOptions);
  }
}

FetchAction.register(SubmitAction);