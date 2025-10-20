import { FetchContext } from "../../fetcher/context";
import { BaseFetchActionOptions, FetchAction } from "../fetch-action";

export class GetContentAction extends FetchAction {
  static override id = 'getContent';
  static override returnType = 'response' as const;
  static override capabilities = { http: 'native' as const, browser: 'native' as const };

  async onExecute(context: FetchContext, options?: BaseFetchActionOptions): Promise<void> {
    const engine = context.internal.engine;
    if (!engine) throw new Error('No engine available');

    await engine.getContent();
  }
}

FetchAction.register(GetContentAction);