import { Card, classNames } from '@sushiswap/ui'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { PerpsChecker } from './perps-checker'

export const TradeWidget = ({ className }: { className?: string }) => (
  <Card className={classNames('p-2', className ?? '')}>
    <Checker.Connect size="default">
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
  </Card>
)
