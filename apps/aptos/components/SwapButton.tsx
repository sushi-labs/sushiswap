import { Button } from '@sushiswap/ui'
import { useSwapState } from 'app/swap/trade/TradeProvider'
import { warningSeverity } from 'lib/swap/warningSeverity'
import React, { useEffect, useMemo, useState } from 'react'
import { useIsSwapMaintenance } from 'utils/use-is-swap-maintenance'
import { useSwapRouter } from 'utils/useSwapRouter'
import { Checker } from './Checker'
import { Modal } from './Modal/Modal'

export const SwapButton = () => {
  const { data: maintenance } = useIsSwapMaintenance()
  const { amount, noRouteFound, error, token0 } = useSwapState()
  const [checked, setChecked] = useState<boolean>(false)
  const { data: routes } = useSwapRouter()

  useEffect(() => {
    if (warningSeverity(routes?.priceImpact) <= 3) {
      setChecked(false)
    }
  }, [routes])

  const checkerAmount = useMemo(() => {
    if (!token0) return []

    return [
      {
        currency: token0.address,
        amount: Number(amount) * 10 ** token0.decimals,
      },
    ]
  }, [amount, token0])

  return (
    <Modal.Trigger tag="review-modal">
      {({ open }) => (
        <>
          <div className="pt-4">
            <Checker.Guard
              guardWhen={maintenance}
              guardText="Maintenance in progress"
              fullWidth
            >
              <Checker.Guard
                guardWhen={Boolean(noRouteFound)}
                guardText={noRouteFound}
                fullWidth
              >
                <Checker.Connect>
                  <Checker.Amounts amounts={checkerAmount}>
                    <Checker.Guard
                      guardWhen={
                        !checked && warningSeverity(routes?.priceImpact) > 3
                      }
                      guardText="Price impact too high"
                      variant="destructive"
                    >
                      <Checker.Guard
                        guardWhen={Boolean(error)}
                        guardText="An unknown error occurred"
                      >
                        <Button
                          size="xl"
                          fullWidth
                          onClick={() => (amount ? open() : {})}
                        >
                          Swap
                        </Button>
                      </Checker.Guard>
                    </Checker.Guard>
                  </Checker.Amounts>
                </Checker.Connect>
              </Checker.Guard>
            </Checker.Guard>
          </div>
          {warningSeverity(routes?.priceImpact) > 3 && (
            <div className="flex items-start px-4 py-3 mt-4 rounded-xl bg-red/20">
              <input
                id="expert-checkbox"
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                className="cursor-pointer mr-1 w-5 h-5 mt-0.5 text-red-600 !ring-red-600 bg-white border-red rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2"
              />
              <label
                htmlFor="expert-checkbox"
                className="ml-2 font-medium text-red-600"
              >
                Price impact is too high. You will lose a big portion of your
                funds in this trade. Please tick the box if you would like to
                continue.
              </label>
            </div>
          )}
        </>
      )}
    </Modal.Trigger>
  )
}
