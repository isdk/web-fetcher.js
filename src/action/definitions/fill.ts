import { FetchContext } from "../../fetcher/context";
import { BaseFetchActionOptions, FetchAction } from "../fetch-action";

export class FillAction extends FetchAction {
  static override id = 'fill';
  static override returnType = 'none' as const;
  static override capabilities = { http: 'simulate' as const, browser: 'native' as const };

  async onExecute(context: FetchContext, options?: BaseFetchActionOptions): Promise<void> {
    const { selector, value } = options?.params || {};
    if (!selector || value === undefined) {
      throw new Error('Selector and value are required for fill action');
    }

    const engine = context.internal.engine;
    if (!engine) throw new Error('No engine available');

    await engine.fill(selector, value);
  }
}

FetchAction.register(FillAction);
