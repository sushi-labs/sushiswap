import { Card, classNames } from '@sushiswap/ui'
import { AvailableToTrade } from './available-to-trade'
import { ConfirmDialog } from './confirm-dialog'
import { CurrentPosition } from './current-position'
import { Leverage } from './leverage'
import { OrderForms } from './order-forms'
import { OrderStats } from './order-stats'
import { TradeSideSelect } from './trade-side-select'
import { TradeTypeSelect } from './trade-type-select'

export const TradeWidget = ({ className }: { className?: string }) => (
  <Card className={classNames('p-2 pb-3', className ?? '')}>
    <div className="h-full flex flex-col justify-between gap-2">
      <div className="flex flex-col gap-2">
        <Leverage />
        <TradeTypeSelect />
        <div className="flex flex-col gap-2 mt-1">
          <TradeSideSelect />
          <AvailableToTrade />
          <CurrentPosition />
          <OrderForms />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <ConfirmDialog />
        <hr className="border-t border-accent" />
        <OrderStats />
      </div>
    </div>
  </Card>
)
