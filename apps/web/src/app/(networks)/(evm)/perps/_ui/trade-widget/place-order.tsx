import { Button } from '@sushiswap/ui'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { PerpsChecker } from '../perps-checker'
import { useAssetState } from './asset-state-provider'

export const PlaceOrder = () => {
  const {
    state: { tradeSide },
  } = useAssetState()
  return (
    <Checker.Connect size="default" namespace="evm">
      <PerpsChecker.Legal size="default">
        <PerpsChecker.Deposit size="default">
          <PerpsChecker.EnableTrading size="default">
            <PerpsChecker.BuilderFee size="default">
              <Button
                fullWidth
                size="lg"
                variant={tradeSide === 'long' ? 'default' : 'destructive'}
                onClick={() => {
                  //todo: implement is valid order logic/checker for disabled state
                  alert(
                    'todo: create order data and call useExecuteOrders mutate fn',
                  )
                }}
              >
                Place Order
              </Button>
            </PerpsChecker.BuilderFee>
          </PerpsChecker.EnableTrading>
        </PerpsChecker.Deposit>
      </PerpsChecker.Legal>
    </Checker.Connect>
  )
}
