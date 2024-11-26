'use client'

import { GoogleAnalytics, GoogleTagManager, HotJar } from '@sushiswap/ui'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { useEnabledCookies } from './_common/cookies/use-enabled-cookies'

export function Trackers() {
  const enabledCookies = useEnabledCookies()

  const performanceEnabled = !!enabledCookies?.has('performance')

  return (
    <>
      <VercelAnalytics />
      <GoogleAnalytics enabled={performanceEnabled} />
      <GoogleTagManager enabled={performanceEnabled} />
      <HotJar enabled={performanceEnabled} />
      <SpeedInsights />
    </>
  )
}
