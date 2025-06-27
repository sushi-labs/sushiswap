import { StrapiBanner } from '../strapi-banner/strapi-banner'
import { SimpleSwapBridgeBanner } from './simple-swap-bridge-banner'

export const SimpleSwapBanner = () => {
  return (
    <div className="flex flex-col gap-4 xl:fixed xl:right-8 xl:bottom-8">
      <StrapiBanner className="h-24 min-w-[360px]" />
      <SimpleSwapBridgeBanner className="h-24 min-w-[360px]" />
    </div>
  )
}
