import { Button, DialogTrigger } from '@sushiswap/ui'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useUserSettingsState } from '../../account-management'
import { PerpsChecker } from '../../perps-checker'
import { PlaceOrderButton } from './place-order-button'

export const ConfirmDialogTrigger = () => {
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
                <PerpsChecker.HyperReferral size="sm" variant="perps-default">
                  <PerpsChecker.TwapRunningTime
                    size="sm"
                    variant="perps-default"
                  >
                    <PerpsChecker.OrderAmount size="sm" variant="perps-default">
                      <PerpsChecker.TakeStopTrigger
                        size="sm"
                        variant="perps-default"
                      >
                        <PerpsChecker.TwapSuborder
                          size="sm"
                          variant="perps-default"
                        >
                          {quickConfirmPositionEnabled ? (
                            <PlaceOrderButton />
                          ) : (
                            <DialogTrigger asChild>
                              <Button
                                fullWidth
                                size="sm"
                                variant="perps-default"
                              >
                                Place Order
                              </Button>
                            </DialogTrigger>
                          )}
                        </PerpsChecker.TwapSuborder>
                      </PerpsChecker.TakeStopTrigger>
                    </PerpsChecker.OrderAmount>
                  </PerpsChecker.TwapRunningTime>
                </PerpsChecker.HyperReferral>
              </PerpsChecker.BuilderFee>
            </PerpsChecker.EnableTrading>
          </PerpsChecker.Deposit>
        </PerpsChecker.StableAmount>
      </PerpsChecker.Legal>
    </Checker.Connect>
  )
}
