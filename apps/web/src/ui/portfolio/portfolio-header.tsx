import { NetworkMenu } from '../swap/trade/favorite-recent/network-menu'

export function PortfolioHeader() {
  return (
    <div className="flex gap-3 items-center">
      <span className="text-[32px] font-semibold">Portfolio Overview</span>
      <NetworkMenu
        triggerVariant="networks"
        className="!min-h-[36px] !h-[36px]"
      />
    </div>
  )
}
