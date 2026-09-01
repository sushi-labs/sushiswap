import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  hasStoredPrivySession,
  isPrivySessionStorageKey,
  setPrivySvmReconnect,
  shouldReconnectPrivySvm,
} from './privy-storage'

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

function installBrowser(storage: Storage, cookie = ''): void {
  vi.stubGlobal('window', { localStorage: storage })
  vi.stubGlobal('document', { cookie })
}

function createBlockedStorage(): Storage {
  return {
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
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

beforeEach(() => {
  installBrowser(createStorage())
})

describe('Privy storage', () => {
  it('detects Privy refresh credentials', () => {
    installBrowser(
      createStorage({
        'privy:pat': JSON.stringify('access-token'),
        'privy:refresh_token': JSON.stringify('refresh-token'),
      }),
    )
    expect(hasStoredPrivySession()).toBe(true)
  })

  it('detects Privy’s session cookie', () => {
    installBrowser(createStorage(), 'other=value; privy-session=session-value')

    expect(hasStoredPrivySession()).toBe(true)
  })

  it('ignores incomplete, deprecated, and malformed credentials', () => {
    installBrowser(
      createStorage({
        'privy:pat': JSON.stringify('access-token'),
        'privy:refresh_token': JSON.stringify('deprecated'),
      }),
    )
    expect(hasStoredPrivySession()).toBe(false)

    installBrowser(
      createStorage({
        'privy:pat': 'not-json',
        'privy:refresh_token': JSON.stringify('refresh-token'),
      }),
    )
    expect(hasStoredPrivySession()).toBe(false)

    installBrowser(
      createStorage({
        'privy:refresh_token': JSON.stringify('refresh-token'),
      }),
    )
    expect(hasStoredPrivySession()).toBe(false)
  })

  it('recognizes only SDK keys that can change session detection', () => {
    expect(isPrivySessionStorageKey('privy:pat')).toBe(true)
    expect(isPrivySessionStorageKey('privy:refresh_token')).toBe(true)
    expect(isPrivySessionStorageKey('privy:token')).toBe(false)
    expect(isPrivySessionStorageKey('sushi:privy-svm-reconnect')).toBe(false)
    expect(isPrivySessionStorageKey('sushi:privy-session')).toBe(false)
    expect(isPrivySessionStorageKey(null)).toBe(false)
  })

  it('stores only Solana reconnect intent in Sushi storage', () => {
    expect(shouldReconnectPrivySvm()).toBe(false)

    setPrivySvmReconnect(true)
    expect(shouldReconnectPrivySvm()).toBe(true)

    setPrivySvmReconnect(false)
    expect(shouldReconnectPrivySvm()).toBe(false)
  })

  it('fails closed when browser storage is unavailable', () => {
    installBrowser(createBlockedStorage())

    expect(hasStoredPrivySession()).toBe(false)
    expect(shouldReconnectPrivySvm()).toBe(false)
    expect(() => setPrivySvmReconnect(true)).not.toThrow()
  })
})
