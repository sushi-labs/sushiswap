import { Button, DialogTrigger } from '@sushiswap/ui'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useUserSettingsState } from '../../account-management'
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
    <Checker.Connect size="lg" namespace="evm" variant="perps-default">
      <PerpsChecker.Legal size="lg" variant="perps-default">
        <PerpsChecker.Deposit size="lg" variant="perps-default">
          <PerpsChecker.EnableTrading size="lg" variant="perps-default">
            <PerpsChecker.BuilderFee size="lg" variant="perps-default">
              <PerpsChecker.Referral size="lg" variant="perps-default">
                <PerpsChecker.TwapRunningTime
                  size="lg"
                  variant={tradeSide === 'long' ? 'perps-long' : 'perps-short'}
                >
                  <PerpsChecker.OrderAmount
                    size="lg"
                    variant={
                      tradeSide === 'long' ? 'perps-long' : 'perps-short'
                    }
                  >
                    <PerpsChecker.TakeStopTrigger
                      size="lg"
                      variant={
                        tradeSide === 'long' ? 'perps-long' : 'perps-short'
                      }
                    >
                      <PerpsChecker.TwapSuborder
                        size="lg"
                        variant={
                          tradeSide === 'long' ? 'perps-long' : 'perps-short'
                        }
                      >
                        {quickConfirmPositionEnabled ? (
                          <PlaceOrderButton />
                        ) : (
                          <DialogTrigger asChild>
                            <Button
                              fullWidth
                              size="lg"
                              variant={
                                tradeSide === 'long'
                                  ? 'perps-long'
                                  : 'perps-short'
                              }
                              data-glow="true"
                            >
                              Place Order
                            </Button>
                          </DialogTrigger>
                        )}
                      </PerpsChecker.TwapSuborder>
                    </PerpsChecker.TakeStopTrigger>
                  </PerpsChecker.OrderAmount>
                </PerpsChecker.TwapRunningTime>
              </PerpsChecker.Referral>
            </PerpsChecker.BuilderFee>
          </PerpsChecker.EnableTrading>
        </PerpsChecker.Deposit>
      </PerpsChecker.Legal>
    </Checker.Connect>
  )
}
