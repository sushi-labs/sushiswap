import { Button, DialogTrigger } from '@sushiswap/ui'
import React, { useEffect, useMemo, useState } from 'react'
import { PriceImpactWarning } from 'src/app/(networks)/_ui/price-impact-warning'
import { useIsSwapMaintenance } from '~aptos/_common/lib/edge/use-is-swap-maintenance'
import { Checker } from '~aptos/_common/ui/checker'
import { useSwap } from '~aptos/swap/lib/use-swap'
import { warningSeverity } from '~aptos/swap/lib/warning-severity'
import { useSimpleSwapState } from '~aptos/swap/ui/simple/simple-swap-provider/simple-swap-provider'
import { SimpleSwapTradeReviewDialog } from './simple-swap-trade-review-dialog'

export const SimpleSwapTradeButton = () => {
  const { data: maintenance } = useIsSwapMaintenance()
  const { amount, noRouteFound, error, token0 } = useSimpleSwapState()
  const [checked, setChecked] = useState<boolean>(false)
  const { data: routes } = useSwap()

  const showPriceImpactWarning = useMemo(() => {
    const priceImpactSeverity = warningSeverity(routes?.priceImpact)
    return priceImpactSeverity > 3
  }, [routes?.priceImpact])

  // Reset
  useEffect(() => {
    if (checked && !showPriceImpactWarning) {
      setChecked(false)
    }
  }, [showPriceImpactWarning, checked])

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
    <SimpleSwapTradeReviewDialog>
      <div>
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
                    <DialogTrigger asChild>
                      <Button size="xl" fullWidth>
                        Swap
                      </Button>
                    </DialogTrigger>
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
    </SimpleSwapTradeReviewDialog>
  )
}
