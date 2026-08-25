import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  clearPrivySessionMarker,
  ensurePrivySessionMarker,
  hasPrivySessionMarker,
  setPrivySvmReconnect,
  shouldReconnectPrivySvm,
} from './privy-session-marker'

function createStorage(initial: Record<string, string> = {}): Storage {
  const values = new Map(Object.entries(initial))
  return {
    get length() {
      return values.size
    },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => Array.from(values.keys())[index] ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value),
  }
}

function installBrowser(storage: Storage): void {
  vi.stubGlobal('window', { localStorage: storage })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

beforeEach(() => {
  installBrowser(createStorage())
})

describe('Privy session marker', () => {
  it('records a session without authentication data', () => {
    ensurePrivySessionMarker()

    expect(hasPrivySessionMarker()).toBe(true)
    expect(shouldReconnectPrivySvm()).toBe(false)

    clearPrivySessionMarker()
    expect(hasPrivySessionMarker()).toBe(false)
  })

  it('preserves SVM reconnect intent when refreshing the session marker', () => {
    setPrivySvmReconnect(true)
    ensurePrivySessionMarker()

    expect(shouldReconnectPrivySvm()).toBe(true)

    setPrivySvmReconnect(false)
    expect(shouldReconnectPrivySvm()).toBe(false)
  })

  it('does not create a marker when disabling an absent intent', () => {
    setPrivySvmReconnect(false)

    expect(hasPrivySessionMarker()).toBe(false)
  })

  it('fails closed for malformed markers and unavailable storage', () => {
    installBrowser(createStorage({ 'sushi:privy-session': '{' }))
    expect(hasPrivySessionMarker()).toBe(false)

    installBrowser(
      createStorage({
        'sushi:privy-session': JSON.stringify({
          session: true,
        }),
      }),
    )
    expect(hasPrivySessionMarker()).toBe(false)

    installBrowser({
      get length(): number {
        throw new Error('blocked')
      },
      clear: () => {
        throw new Error('blocked')
      },
      getItem: () => {
        throw new Error('blocked')
      },
      key: () => null,
      removeItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('blocked')
      },
    })
    expect(hasPrivySessionMarker()).toBe(false)
  })
})
