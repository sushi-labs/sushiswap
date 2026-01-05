import { classNames } from '@sushiswap/ui'

export const TradeTables = ({ className }: { className?: string }) => (
  <div className={classNames('bg-teal-500/50 border ', className ?? '')}>
    trades/trade history
  </div>
)
