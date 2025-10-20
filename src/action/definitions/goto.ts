import { GotoActionOptions } from "../../engine/base";
import { FetchContext } from "../../fetcher/context";
import { FetchResponse } from "../../fetcher/types";
import { BaseFetchActionOptions, FetchAction } from "../fetch-action";

interface GotoParams extends GotoActionOptions {
  url?: string;
}

export class GotoAction extends FetchAction {
  static override id = 'goto';
  static override returnType = 'response' as const;
  static override capabilities = {
    http: 'native' as const,
    browser: 'native' as const,
  };

  async onExecute(context: FetchContext, options?: BaseFetchActionOptions, eventPayload?: any): Promise<FetchResponse|void> {
    const params = options?.params as GotoParams | undefined;
    const url = params?.url || context.url;

    if (!url) throw new Error('URL is required for goto action');

    const engine = context.internal.engine;
    if (!engine) throw new Error('No engine available'); // TODO:  惰性创建引擎

    context.url = url;
    const response = await engine.goto(url, params);


    return response;
  }
}

FetchAction.register(GotoAction);
