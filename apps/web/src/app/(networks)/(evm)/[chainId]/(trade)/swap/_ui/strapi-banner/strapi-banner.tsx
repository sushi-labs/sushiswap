'use client'

import { StrapiBannerContent } from './strapi-banner-content'
import { useStrapiBanner } from './strapi-banner-context-provider'

export function StrapiBanner({ className }: { className?: string }) {
  const { banner, cookie } = useStrapiBanner()

  if (!banner) return <></>

  return (
    <StrapiBannerContent
      banner={banner}
      cookie={cookie}
      className={className}
    />
  )
}
