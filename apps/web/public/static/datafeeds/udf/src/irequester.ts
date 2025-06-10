import type { RequestParams, UdfErrorResponse, UdfResponse } from './helpers'

export interface IRequester {
  sendRequest<T extends UdfResponse>(
    datafeedUrl: string,
    urlPath: string,
    params?: RequestParams,
  ): Promise<T | UdfErrorResponse>
  sendRequest<T>(
    datafeedUrl: string,
    urlPath: string,
    params?: RequestParams,
  ): Promise<T>
  sendRequest<T>(
    datafeedUrl: string,
    urlPath: string,
    params?: RequestParams,
  ): Promise<T>
}
