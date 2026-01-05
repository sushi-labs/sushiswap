import { classNames } from '@sushiswap/ui'

export const TradeWidget = ({ className }: { className?: string }) => (
  <div className={classNames('bg-orange-500/50 border ', className ?? '')}>
    settings/buy/sell
  </div>
)
