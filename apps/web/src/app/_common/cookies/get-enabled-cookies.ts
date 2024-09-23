import type { CookieType } from './cookie-dialog'

export function parseEnabledCookieTypes(
  cookieString: string,
): Set<CookieType> | undefined {
  const acceptedCookieString = cookieString
    .split('; ')
    .find((cookie) => cookie.startsWith('accepted-cookies='))

  if (acceptedCookieString) {
    const cookieTypes = acceptedCookieString.split('=')[1].split(',')
    return new Set(cookieTypes) as Set<CookieType>
  }

  return undefined
}

export function getEnabledCookieTypes() {
  if (typeof document === 'undefined') return undefined

  return parseEnabledCookieTypes(document.cookie)
}
