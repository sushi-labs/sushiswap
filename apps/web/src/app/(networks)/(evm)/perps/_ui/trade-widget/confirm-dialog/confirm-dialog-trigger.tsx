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
    <Checker.Connect size="sm" namespace="evm" variant="perps-default">
      <PerpsChecker.Legal size="sm" variant="perps-default">
        <PerpsChecker.StableAmount size="sm" variant="perps-default">
          <PerpsChecker.Deposit size="sm" variant="perps-default">
            <PerpsChecker.EnableTrading size="sm" variant="perps-default">
              <PerpsChecker.BuilderFee size="sm" variant="perps-default">
                <PerpsChecker.Referral size="sm" variant="perps-default">
                  <PerpsChecker.TwapRunningTime
                    size="sm"
                    variant={
                      tradeSide === 'long' ? 'perps-long' : 'perps-short'
                    }
                  >
                    <PerpsChecker.OrderAmount
                      size="sm"
                      variant={
                        tradeSide === 'long' ? 'perps-long' : 'perps-short'
                      }
                    >
                      <PerpsChecker.TakeStopTrigger
                        size="sm"
                        variant={
                          tradeSide === 'long' ? 'perps-long' : 'perps-short'
                        }
                      >
                        <PerpsChecker.TwapSuborder
                          size="sm"
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
                                size="sm"
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
        </PerpsChecker.StableAmount>
      </PerpsChecker.Legal>
    </Checker.Connect>
  )
}
