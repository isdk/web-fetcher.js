import { BaseFetchActionProperties, FetchAction } from "../fetch-action";
import { FetchContext } from "../../core/context";
import { OnFetchPauseCallback } from '../../core/types';

export class PauseAction extends FetchAction {
  static override id = 'pause';

  // This action is only meaningful in browser mode
  static override capabilities = { http: 'noop' as const, browser: 'native' as const };

  static override returnType = 'none' as const;

  async onExecute(context: FetchContext, options?: BaseFetchActionProperties): Promise<void> {
    const { selector, message, attribute } = options?.params || {};
    const engine = context.internal.engine;

    // 1. Only execute in browser engine
    if (engine?.mode !== 'browser') {
      console.warn('[PauseAction] can only run in browser engine. Skipped.');
      return;
    }

    // 2. (Optional) If a selector is provided, only pause if the element exists
    if (selector) {
      // Use `extract` with a simple schema to check for the element's existence.
      // We ask for a basic property like `tagName`. If the result is null or undefined, the element doesn't exist.
      const tagName = await engine?.extract<string>({
        selector,
        attribute,
      });

      if (!tagName) {
        return; // Element not found, so we don't pause.
      }
    }

    // 3. Get onPause callback from context
    // The context object is expected to be the hydrated FetcherOptions.
    const onPauseHandler = (context as any).onPause as OnFetchPauseCallback | undefined;

    if (onPauseHandler) {
      console.info(message || 'Execution paused for manual intervention.');

      // 4. Execute and wait for the callback to complete
      // The callback will be responsible for handling user interaction and waiting
      await onPauseHandler({ message });

      console.info('Resuming execution...');
    } else {
      console.warn(
        '[PauseAction] was called, but no `onPause` handler was provided in fetchWeb options. Skipped.'
      );
    }
  }
}

// Register the Action to make it available
FetchAction.register(PauseAction);
