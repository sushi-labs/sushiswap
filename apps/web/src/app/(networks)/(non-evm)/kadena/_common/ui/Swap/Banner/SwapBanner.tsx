import { SimpleSwapBridgeBanner } from './SwapBridgeBanner'

export const SimpleSwapBanner = () => {
  return (
    <div className="flex flex-col gap-4 xl:fixed xl:right-8 xl:bottom-8">
      <SimpleSwapBridgeBanner className="h-24 min-w-[360px]" />
    </div>
  )
}
