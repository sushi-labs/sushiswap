import { classNames } from '@sushiswap/ui'

export const Chart = ({ className }: { className?: string }) => (
  <div className={classNames('bg-red-500/50 border', className ?? '')}>
    chart
  </div>
)
