type WaitForValueOptions<T> = {
  getError?(value: T): Error | undefined
  getValue(): T
  predicate(value: T): boolean
  subscribe(listener: () => void): () => void
  timeoutMessage: string
  timeoutMs: number
}

export function waitForValue<T>({
  getError,
  getValue,
  predicate,
  subscribe,
  timeoutMessage,
  timeoutMs,
}: WaitForValueOptions<T>): Promise<T> {
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
      cleanup.unsubscribe()
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

    cleanup.timeout = setTimeout(() => {
      if (settled) return
      finish()
      reject(new Error(timeoutMessage))
    }, timeoutMs)
  })
}
