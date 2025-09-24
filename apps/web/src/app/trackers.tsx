'use client'

import { faro } from '@grafana/faro-web-sdk'
import { GoogleAnalytics, GoogleTagManager, HotJar } from '@sushiswap/ui'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { useEnabledCookies } from './_common/cookies/use-enabled-cookies'

export function Trackers() {
  const enabledCookies = useEnabledCookies()

  const analyiticsEnabled = !!enabledCookies?.has('analytical')
  const googleEnabled = analyiticsEnabled && !!enabledCookies?.has('google')
  const hotjarEnabled = analyiticsEnabled && !!enabledCookies?.has('hotjar')

  return (
    <>
      <VercelAnalytics
        beforeSend={(event) => (analyiticsEnabled ? event : null)}
      />
      <GoogleAnalytics enabled={analyiticsEnabled} />
      <GoogleTagManager enabled={googleEnabled} />
      <HotJar enabled={hotjarEnabled} />
      <SpeedInsights />
    </>
  )
}
