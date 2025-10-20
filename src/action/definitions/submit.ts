import { FetchContext } from "../../fetcher/context";
import { BaseFetchActionOptions, FetchAction } from "../fetch-action";

export class SubmitAction extends FetchAction {
  static override id = 'submit';
  static override returnType = 'none' as const;
  static override capabilities = { http: 'simulate' as const, browser: 'native' as const };

  async onExecute(context: FetchContext, options?: BaseFetchActionOptions): Promise<void> {
    const { selector } = options?.params || {};

    const engine = context.internal.engine;
    if (!engine) throw new Error('No engine available');

    await engine.submit(selector);
  }
}

FetchAction.register(SubmitAction);