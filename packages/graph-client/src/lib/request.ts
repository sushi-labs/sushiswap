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

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    const response = (error as { response?: unknown }).response
    if (response && typeof response === 'object') {
      const errors = (response as { errors?: unknown }).errors
      if (Array.isArray(errors)) {
        const messages = errors.flatMap((item: unknown) => {
          if (!item || typeof item !== 'object') return []
          const message = (item as { message?: unknown }).message
          return typeof message === 'string' ? [message] : []
        })
        if (messages.length > 0) return messages.join(' ')
      }
    }

    if (error instanceof Error && error.message) return error.message
  }

  if (typeof error === 'string' && error) return error
  return 'Request failed'
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
  let lastError: unknown
  while (remainingRetries > 0) {
    try {
      if (options.timeout) {
        return await requestWithTimeout(params, options.timeout)
      } else {
        return await _request(params)
      }
    } catch (err: unknown) {
      remainingRetries--
      lastError = err
    }
  }

  throw new Error(getErrorMessage(lastError), { cause: lastError })
}
