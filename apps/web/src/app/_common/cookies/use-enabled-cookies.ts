'use client'

import { useEffect, useMemo, useState } from 'react'
import { parseEnabledCookieTypes } from './get-enabled-cookies'

export function useEnabledCookies() {
  const [cookieString, setCookieString] = useState(
    typeof document === 'undefined' ? '' : document.cookie,
  )

  useEffect(() => {
    if (typeof document === 'undefined') return
    setCookieString(document.cookie)
  }, [])

  useEffect(() => {
    const onCookieChange = () => {
      setCookieString(document.cookie)
    }

    document.addEventListener('cookieChange', onCookieChange)

    return () => {
      document.removeEventListener('cookieChange', onCookieChange)
    }
  }, [])

  return useMemo(() => parseEnabledCookieTypes(cookieString), [cookieString])
}
