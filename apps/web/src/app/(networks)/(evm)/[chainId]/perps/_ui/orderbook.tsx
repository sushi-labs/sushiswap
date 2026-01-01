import { classNames } from '@sushiswap/ui'

export const Orderbook = ({ className }: { className?: string }) => (
  <div className={classNames('bg-yellow-500/50 border', className ?? '')}>
    orderbook/trades
  </div>
)
