import { Card, classNames } from '@sushiswap/ui'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { PerpsChecker } from '../perps-checker'
import { Leverage } from './leverage'
import { TradeSideSelect } from './trade-side-select'
import { TradeTypeSelect } from './trade-type-select'

export const TradeWidget = ({ className }: { className?: string }) => (
  <Card className={classNames('p-2', className ?? '')}>
    <div className="h-full flex flex-col justify-between">
      <div className="flex flex-col gap-2">
        <Leverage />
        <TradeTypeSelect />
        <div className="flex flex-col gap-2 mt-1">
          <TradeSideSelect />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Test />
        <div>setttings</div>
      </div>
    </div>
  </Card>
)

const Test = () => {
  return (
    <Checker.Connect size="default" namespace="evm">
      <PerpsChecker.Legal size="default">
        <PerpsChecker.Deposit size="default">
          <PerpsChecker.EnableTrading size="default">
            <PerpsChecker.BuilderFee size="default">
              <div>todo - testing checkers atm</div>
            </PerpsChecker.BuilderFee>
          </PerpsChecker.EnableTrading>
        </PerpsChecker.Deposit>
      </PerpsChecker.Legal>
    </Checker.Connect>
  )
}
