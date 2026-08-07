import { SimpleSwapBridgeBanner } from './simple-swap-bridge-banner'
// import { StrapiBanner } from './strapi-banner/strapi-banner'

export const SimpleSwapBanner = () => {
  return (
    <div className="flex flex-col gap-4 xl:fixed xl:right-8 xl:bottom-12">
      {/* Disabled: unused for a while, and its provider's cookies() read made
          the whole swap subtree request-bound. Re-enable by restoring this and
          the StrapiBannerProvider in ../providers.tsx. */}
      {/* <StrapiBanner className="h-24 min-w-[360px]" /> */}
      <SimpleSwapBridgeBanner className="h-24 min-w-[360px]" />
    </div>
  )
}
