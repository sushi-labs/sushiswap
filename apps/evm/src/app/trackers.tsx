'use client'

import { GoogleAnalytics } from '@sushiswap/ui'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export function Trackers() {
  return (
    <>
      <VercelAnalytics />
      <GoogleAnalytics />
      <SpeedInsights />
    </>
  )
}
