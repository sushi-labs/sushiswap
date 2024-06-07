import {
  type RequestExtendedOptions,
  request as _request,
} from 'graphql-request'

export interface RequestOptions {
  retries?: number
  timeout?: number
}

function delayWithError(ms: number) {
  return new Promise<undefined>((resolve) =>
    setTimeout(() => resolve(undefined), ms),
  )
}

async function requestWithTimeout<T, V extends object = object>(
  options: RequestExtendedOptions<V, T>,
  timeout: number,
): Promise<T> {
  const res = await Promise.race([_request(options), delayWithError(timeout)])

  if (typeof res === 'undefined') {
    throw new Error('Request timed out')
  }

  return res as Awaited<T>
}

export async function request<T, V extends object = object>(
  params: RequestExtendedOptions<V, T>,
  options: RequestOptions = {},
): Promise<T> {
  let remainingRetries = options.retries ?? 1

  while (remainingRetries > 0) {
    try {
      if (options.timeout) {
        return await requestWithTimeout(params, options.timeout)
      } else {
        return await _request(params)
      }
    } catch {
      remainingRetries--
    }
  }

  throw new Error('Retries exceeded')
}
