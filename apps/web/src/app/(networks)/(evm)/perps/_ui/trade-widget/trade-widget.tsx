import { classNames } from '@sushiswap/ui'
import { PerpsCard } from '../_common/perps-card'
import { AvailableToTrade } from './available-to-trade'
import { ConfirmDialog } from './confirm-dialog'
import { CurrentPosition } from './current-position'
import { Leverage } from './leverage'
import { OrderForms } from './order-forms'
import { OrderStats } from './order-stats'
import { TradeSideSelect } from './trade-side-select'
import { TradeTypeSelect } from './trade-type-select'

export const TradeWidget = () => (
  <div className="flex flex-col gap-1 h-full">
    <div className="flex flex-col gap-1">
      <Leverage />
      <TradeTypeSelect />
      <TradeSideSelect />
    </div>
    <PerpsCard fullHeight className={'p-2 pb-3 h-full'}>
      <div className="h-full flex flex-col justify-between gap-2">
        <div className="flex flex-col gap-1.5 mt-0.5 h-full">
          <AvailableToTrade />
          <CurrentPosition />
          <OrderForms />
        </div>
        <div className="flex flex-col gap-3">
          <ConfirmDialog />
          <OrderStats />
        </div>
      </div>
    </PerpsCard>
  </div>
)
