import { NetworkMenu } from '../swap/trade/favorite-recent/network-menu'

export function PortfolioHeader() {
  return (
    <div className="flex gap-3 justify-between items-center md:justify-start">
      <span className="md:text-[32px] text-lg font-semibold">
        Portfolio Overview
      </span>
      <NetworkMenu
        triggerVariant="networks"
        className="!min-h-[36px] !h-[36px]"
      />
    </div>
  )
}
