import { FetchContext } from "../../core/context";
import { BaseFetchActionOptions, FetchAction } from "../fetch-action";

export class ClickAction extends FetchAction {
  static override id = 'click';
  static override returnType = 'none' as const;
  static override capabilities = { http: 'simulate' as const, browser: 'native' as const };

  async onExecute(context: FetchContext, options?: BaseFetchActionOptions): Promise<void> {
    const { selector } = options?.params || {};
    if (!selector) throw new Error('Selector is required for click action');

    const engine = context.internal.engine;
    if (!engine) throw new Error('No engine available');

    await engine.click(selector);
  }
}

FetchAction.register(ClickAction);
