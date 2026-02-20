import { Button, DialogTrigger } from '@sushiswap/ui'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useUserSettingsState } from '../../account-management/settings-provider'
import { PerpsChecker } from '../../perps-checker'
import { useAssetState } from '../asset-state-provider'
import { PlaceOrderButton } from './place-order-button'

export const ConfirmDialogTrigger = () => {
  const {
    state: { tradeSide },
  } = useAssetState()
  const {
    state: { quickConfirmPositionEnabled },
  } = useUserSettingsState()

  return (
    <Checker.Connect size="lg" namespace="evm">
      <PerpsChecker.Legal size="lg">
        <PerpsChecker.Deposit size="lg">
          <PerpsChecker.EnableTrading size="lg">
            <PerpsChecker.BuilderFee size="lg">
              <PerpsChecker.OrderAmount
                size="lg"
                variant={tradeSide === 'long' ? 'default' : 'destructive'}
              >
                {quickConfirmPositionEnabled ? (
                  <PlaceOrderButton />
                ) : (
                  <DialogTrigger asChild>
                    <Button
                      fullWidth
                      size="lg"
                      variant={tradeSide === 'long' ? 'default' : 'destructive'}
                    >
                      Place Order
                    </Button>
                  </DialogTrigger>
                )}
              </PerpsChecker.OrderAmount>
            </PerpsChecker.BuilderFee>
          </PerpsChecker.EnableTrading>
        </PerpsChecker.Deposit>
      </PerpsChecker.Legal>
    </Checker.Connect>
  )
}
