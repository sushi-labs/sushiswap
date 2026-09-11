type WaitForValueOptions<T> = {
  getError?(value: T): Error | undefined
  getValue(): T
  predicate(value: T): boolean
  signal?: AbortSignal
  subscribe(listener: () => void): () => void
  timeoutMessage: string
  timeoutMs: number
}

export class WaitForValueTimeoutError extends Error {
  override readonly name = 'WaitForValueTimeoutError'
}

export function waitForValue<T>({
  getError,
  getValue,
  predicate,
  signal,
  subscribe,
  timeoutMessage,
  timeoutMs,
}: WaitForValueOptions<T>): Promise<T> {
  if (signal?.aborted) {
    return Promise.reject(
      signal.reason instanceof Error
        ? signal.reason
        : new Error('Waiting for value was cancelled'),
    )
  }

  const current = getValue()
  const currentError = getError?.(current)
  if (currentError) return Promise.reject(currentError)
  if (predicate(current)) return Promise.resolve(current)

  return new Promise((resolve, reject) => {
    let settled = false
    const cleanup: {
      timeout?: ReturnType<typeof setTimeout>
      unsubscribe(): void
    } = { unsubscribe: () => undefined }

    function finish(): void {
      settled = true
      if (cleanup.timeout) clearTimeout(cleanup.timeout)
      signal?.removeEventListener('abort', onAbort)
      cleanup.unsubscribe()
    }

    function onAbort(): void {
      if (settled) return
      finish()
      reject(
        signal?.reason instanceof Error
          ? signal.reason
          : new Error('Waiting for value was cancelled'),
      )
    }

    function check(): void {
      if (settled) return
      try {
        const value = getValue()
        const error = getError?.(value)
        if (error) {
          finish()
          reject(error)
        } else if (predicate(value)) {
          finish()
          resolve(value)
        }
      } catch (error) {
        finish()
        reject(error)
      }
    }

    const subscription = subscribe(check)
    cleanup.unsubscribe = subscription
    if (settled) {
      cleanup.unsubscribe()
      return
    }

    check()
    if (settled) return

    signal?.addEventListener('abort', onAbort, { once: true })
    if (signal?.aborted) {
      onAbort()
      return
    }

    cleanup.timeout = setTimeout(() => {
      if (settled) return
      finish()
      reject(new WaitForValueTimeoutError(timeoutMessage))
    }, timeoutMs)
  })
}
