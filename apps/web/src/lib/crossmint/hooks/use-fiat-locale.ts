'use client'

import { useIsMounted } from '@sushiswap/hooks'

export const DEFAULT_FIAT_LOCALE = 'en-US'

export function useFiatLocale(locale?: string): string {
  const isMounted = useIsMounted()
  const providedLocale = locale?.trim()

  if (providedLocale) return providedLocale

  return isMounted ? navigator.language : DEFAULT_FIAT_LOCALE
}
