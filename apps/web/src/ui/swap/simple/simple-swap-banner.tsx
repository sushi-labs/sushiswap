import { StrapiBanner } from '../strapi-banner/strapi-banner'
import {
  KatanaBridgeBanner,
  SimpleSwapBridgeBanner,
} from './simple-swap-bridge-banner'

export const SimpleSwapBanner = () => {
  return (
    <div className="flex flex-col gap-4 xl:fixed xl:right-8 xl:bottom-8">
      <KatanaBridgeBanner className="h-24 min-w-[360px]" />
      <StrapiBanner className="h-24 min-w-[360px]" />
      <SimpleSwapBridgeBanner className="h-24 min-w-[360px]" />
    </div>
  )
}
