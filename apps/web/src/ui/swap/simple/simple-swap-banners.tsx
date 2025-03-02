import { StrapiBanner } from '../strapi-banner/strapi-banner'
import { SimpleSwapBridgeBanner } from './simple-swap-bridge-banner'

export const SimpleSwapBanners = () => {
  return (
    <div className="xl:fixed xl:right-8 xl:bottom-8 w-[360]">
      <StrapiBanner />
      <SimpleSwapBridgeBanner />
    </div>
  )
}
