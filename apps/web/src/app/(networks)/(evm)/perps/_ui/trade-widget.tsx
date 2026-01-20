import { Card, classNames } from '@sushiswap/ui'
import { EnableTrading } from './enable-trading'

export const TradeWidget = ({ className }: { className?: string }) => (
  <Card className={classNames('p-2', className ?? '')}>
    <EnableTrading />
  </Card>
)
