const PRIVY_ACCESS_TOKEN_STORAGE_KEY = 'privy:pat'
const PRIVY_REFRESH_TOKEN_STORAGE_KEY = 'privy:refresh_token'
const PRIVY_SESSION_COOKIE_KEY = 'privy-session'
const PRIVY_LOGIN_METHOD_STORAGE_KEY = 'sushi:privy-login-method'
const PRIVY_SVM_RECONNECT_STORAGE_KEY = 'sushi:privy-svm-reconnect'

const PRIVY_SESSION_STORAGE_KEYS = [
  PRIVY_ACCESS_TOKEN_STORAGE_KEY,
  PRIVY_REFRESH_TOKEN_STORAGE_KEY,
] as const
const PRIVY_OAUTH_CALLBACK_PARAMETERS = [
  'privy_oauth_code',
  'privy_oauth_state',
  'privy_oauth_provider',
] as const

function readStorageString(key: string): string | undefined {
  if (typeof window === 'undefined') return undefined

  try {
    const value = window.localStorage.getItem(key)
    if (!value) return undefined
    const parsed: unknown = JSON.parse(value)
    return typeof parsed === 'string' && parsed ? parsed : undefined
  } catch {
    return undefined
  }
}

function hasPrivySessionCookie(): boolean {
  if (typeof document === 'undefined') return false

  try {
    return document.cookie.split(';').some((cookie) => {
      const [key, ...value] = cookie.trim().split('=')
      return key === PRIVY_SESSION_COOKIE_KEY && value.join('=').length > 0
    })
  } catch {
    return false
  }
}

/** Returns whether Privy's own storage indicates a restorable session. */
export function hasStoredPrivySession(): boolean {
  if (hasPrivySessionCookie()) return true

  const refreshToken = readStorageString(PRIVY_REFRESH_TOKEN_STORAGE_KEY)
  if (!refreshToken || refreshToken === 'deprecated') return false

  return Boolean(readStorageString(PRIVY_ACCESS_TOKEN_STORAGE_KEY))
}

export function isPrivySessionStorageKey(key: string | null): boolean {
  return PRIVY_SESSION_STORAGE_KEYS.some((storageKey) => storageKey === key)
}

/** Returns whether the URL contains a complete Privy OAuth callback. */
export function isPrivyOAuthCallback(search: string): boolean {
  const searchParams = new URLSearchParams(search)
  return PRIVY_OAUTH_CALLBACK_PARAMETERS.every((parameter) =>
    Boolean(searchParams.get(parameter)),
  )
}

export function getPrivyLoginMethod(): 'email' | 'twitter' | undefined {
  if (typeof window === 'undefined') return undefined

  try {
    const loginMethod = window.localStorage.getItem(
      PRIVY_LOGIN_METHOD_STORAGE_KEY,
    )
    return loginMethod === 'email' || loginMethod === 'twitter'
      ? loginMethod
      : undefined
  } catch {
    return undefined
  }
}

export function setPrivyLoginMethod(
  loginMethod: 'email' | 'twitter' | undefined,
): void {
  if (typeof window === 'undefined') return

  try {
    if (loginMethod) {
      window.localStorage.setItem(PRIVY_LOGIN_METHOD_STORAGE_KEY, loginMethod)
    } else {
      window.localStorage.removeItem(PRIVY_LOGIN_METHOD_STORAGE_KEY)
    }
  } catch {}
}

export function setPrivySvmReconnect(enabled: boolean): void {
  if (typeof window === 'undefined') return

  try {
    if (enabled) {
      window.localStorage.setItem(PRIVY_SVM_RECONNECT_STORAGE_KEY, 'true')
    } else {
      window.localStorage.removeItem(PRIVY_SVM_RECONNECT_STORAGE_KEY)
    }
  } catch {}
}

export function shouldReconnectPrivySvm(): boolean {
  if (typeof window === 'undefined') return false

  try {
    return (
      window.localStorage.getItem(PRIVY_SVM_RECONNECT_STORAGE_KEY) === 'true'
    )
  } catch {
    return false
  }
}
