'use client'

import { GoogleAnalytics, GoogleTagManager, HotJar } from '@sushiswap/ui'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { useEnabledCookies } from './_common/cookies/use-enabled-cookies'

export function Trackers() {
  const enabledCookies = useEnabledCookies()

  const analyiticsEnabled = !!enabledCookies?.has('analytical')

  return (
    <>
      <VercelAnalytics />
      <GoogleAnalytics enabled={analyiticsEnabled} />
      <GoogleTagManager enabled={analyiticsEnabled} />
      <HotJar enabled={analyiticsEnabled} />
      <SpeedInsights />
    </>
  )
}
