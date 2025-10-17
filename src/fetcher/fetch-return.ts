import { FetchActionResult } from "./fetch-action";
import { FetchContext } from "./context";
import { FetchResponse } from "./types";

export type FetchReturnType = 'response' | 'context' | 'outputs' | 'any';

export interface FetchReturnTypeRegistry {
  response: FetchResponse;
  context: FetchContext;
  result: FetchActionResult<any> | undefined;
  outputs: Record<string, any>;
  any: any;
}

// 方便未来扩展，可以通过合并模块来添加新的映射
// declare module "./base-fetch-action" {
//   interface FetchReturnTypeRegistry {
//     custom: CustomType;
//   }
// }
export type FetchReturnTypeFor<R extends FetchReturnType> =
  R extends keyof FetchReturnTypeRegistry ? FetchReturnTypeRegistry[R] : never;

