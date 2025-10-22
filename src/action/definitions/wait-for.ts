import { FetchContext } from "../../core/context";
import { BaseFetchActionOptions, FetchAction } from "../fetch-action";

export class WaitForAction extends FetchAction {
  static override id = 'waitFor';
  static override returnType = 'none' as const;
  static override capabilities = { http: 'native' as const, browser: 'native' as const };

  async onExecute(context: FetchContext, options?: BaseFetchActionOptions): Promise<void> {
    const engine = context.internal.engine;
    if (!engine) throw new Error('No engine available');

    await engine.waitFor(options?.params);
  }
}

FetchAction.register(WaitForAction);