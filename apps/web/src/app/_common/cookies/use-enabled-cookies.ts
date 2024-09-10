'use client'

import { useMemo } from 'react'
import { parseEnabledCookieTypes } from './get-enabled-cookies'

export function useEnabledCookies() {
  const cookieString = typeof document === 'undefined' ? '' : document.cookie

  return useMemo(() => parseEnabledCookieTypes(cookieString), [cookieString])
}
