'use client'

import { Button, DialogTrigger } from '@sushiswap/ui'
import React, { useEffect, useMemo, useState } from 'react'
import { PriceImpactWarning } from 'src/ui/common'
import { useIsSwapMaintenance } from '~stellar/_common/lib/edge/use-is-swap-maintenance'
import { requiresPriceImpactConfirmation } from '~stellar/_common/lib/utils/warning-severity'
import { Checker } from '~stellar/_common/ui/checker'
import { useSimpleSwapState } from './simple-swap-provider/simple-swap-provider'
// import { SimpleSwapTradeReviewDialog } from './simple-swap-trade-review-dialog'

export const SimpleSwapTradeButton = () => {
  const { data: maintenance } = useIsSwapMaintenance()
  const { amount, token0, error, priceImpact } = useSimpleSwapState()
  const [checked, setChecked] = useState<boolean>(false)

  const showPriceImpactWarning = requiresPriceImpactConfirmation(
    priceImpact || undefined,
  )
  const noRouteFound = ''

  // Reset
  useEffect(() => {
    if (checked && !showPriceImpactWarning) {
      setChecked(false)
    }
  }, [checked, showPriceImpactWarning])

  const checkerAmount = useMemo(() => {
    if (!token0) return []

    return [
      {
        token: token0,
        amount: Number(amount) * 10 ** token0.decimals,
      },
    ]
  }, [amount, token0])

  return (
    <>
      {/* <SimpleSwapTradeReviewDialog> */}
      <div className="mt-4">
        <Checker.Guard
          guardWhen={maintenance}
          guardText="Maintenance in progress"
          fullWidth
          size="xl"
        >
          <Checker.Guard
            guardWhen={Boolean(noRouteFound)}
            guardText={noRouteFound}
            fullWidth
            size="xl"
          >
            <Checker.Connect fullWidth size="xl">
              <Checker.Amounts amounts={checkerAmount} fullWidth size="xl">
                <Checker.Guard
                  guardWhen={!checked && showPriceImpactWarning}
                  guardText="Price impact too high"
                  variant="destructive"
                  size="xl"
                  fullWidth
                >
                  <Checker.Guard
                    guardWhen={Boolean(error)}
                    guardText="An unknown error occurred"
                    size="xl"
                    fullWidth
                  >
                    {/* <DialogTrigger asChild> */}
                    <Button
                      size="xl"
                      fullWidth
                      onClick={() =>
                        alert(
                          'This will open the pre-transaction review dialog.',
                        )
                      }
                    >
                      Swap
                    </Button>
                    {/* </DialogTrigger> */}
                  </Checker.Guard>
                </Checker.Guard>
              </Checker.Amounts>
            </Checker.Connect>
          </Checker.Guard>
        </Checker.Guard>
      </div>
      {showPriceImpactWarning && (
        <PriceImpactWarning
          className="mt-4"
          checked={checked}
          setChecked={setChecked}
        />
      )}
      {/* </SimpleSwapTradeReviewDialog> */}
    </>
  )
}
