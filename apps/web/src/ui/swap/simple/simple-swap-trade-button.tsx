'use client'

import { Button, DialogTrigger } from '@sushiswap/ui'
import { type FC, useEffect, useMemo, useState } from 'react'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { SLIPPAGE_WARNING_THRESHOLD } from 'src/lib/wagmi/systems/Checker/Slippage'
import { PriceImpactWarning, SlippageWarning } from 'src/ui/common'
import { RED_SNWAPPER_ADDRESS, isRedSnwapperChainId } from 'sushi/config'
import { Native } from 'sushi/currency'
import { ZERO } from 'sushi/math'
import { APPROVE_TAG_SWAP } from '../../../lib/constants'
import { usePersistedSlippageError } from '../../../lib/hooks'
import { warningSeverity } from '../../../lib/swap/warningSeverity'
import {
  useDerivedStateSimpleSwap,
  useSimpleSwapTradeQuote,
} from './derivedstate-simple-swap-provider'
import { SimpleSwapTradeReviewDialog } from './simple-swap-trade-review-dialog'
import { useIsSwapMaintenance } from './use-is-swap-maintenance'

export const SimpleSwapTradeButton: FC = () => {
  return (
    <SimpleSwapTradeReviewDialog>
      {({ error, isSuccess }) => (
        <_SimpleSwapTradeButton error={error} isSuccess={isSuccess} />
      )}
    </SimpleSwapTradeReviewDialog>
  )
}

interface SimpleSwapTradeButtonProps {
  error: Error | null
  isSuccess: boolean
}

const _SimpleSwapTradeButton: FC<SimpleSwapTradeButtonProps> = ({
  error,
  isSuccess,
}) => {
  const [slippagePercent] = useSlippageTolerance()

  const { data: maintenance } = useIsSwapMaintenance()
  const { isSlippageError } = usePersistedSlippageError({ isSuccess, error })
  const { data: quote } = useSimpleSwapTradeQuote()
  const [checked, setChecked] = useState(false)

  const {
    state: { swapAmount, swapAmountString, chainId0: chainId, token0, token1 },
    mutate: { setSwapAmount },
  } = useDerivedStateSimpleSwap()

  const isWrap =
    token0?.isNative &&
    token1?.wrapped.address === Native.onChain(chainId).wrapped.address
  const isUnwrap =
    token1?.isNative &&
    token0?.wrapped.address === Native.onChain(chainId).wrapped.address

  const showPriceImpactWarning = useMemo(() => {
    const priceImpactSeverity = warningSeverity(quote?.priceImpact)
    return priceImpactSeverity > 3
  }, [quote?.priceImpact])

  const showSlippageWarning = useMemo(() => {
    return !slippagePercent.lessThan(SLIPPAGE_WARNING_THRESHOLD)
  }, [slippagePercent])

  // Reset
  useEffect(() => {
    if (checked && !showPriceImpactWarning) {
      setChecked(false)
    }
  }, [showPriceImpactWarning, checked])

  return (
    <>
      <div>
        <Checker.Guard
          guardWhen={maintenance}
          guardText="Maintenance in progress"
        >
          <Checker.PartialRoute trade={quote} setSwapAmount={setSwapAmount}>
            <Checker.Connect>
              <Checker.Network chainId={chainId}>
                <Checker.Amounts chainId={chainId} amount={swapAmount}>
                  <Checker.Slippage
                    text="Swap With High Slippage"
                    slippageTolerance={slippagePercent}
                  >
                    <Checker.ApproveERC20
                      id="approve-erc20"
                      amount={swapAmount}
                      contract={
                        isRedSnwapperChainId(chainId)
                          ? RED_SNWAPPER_ADDRESS[chainId]
                          : undefined
                      }
                    >
                      <Checker.Success tag={APPROVE_TAG_SWAP}>
                        <DialogTrigger asChild>
                          <Button
                            size="xl"
                            disabled={Boolean(
                              isSlippageError ||
                                error ||
                                !quote?.amountOut?.greaterThan(ZERO) ||
                                quote?.route?.status === 'NoWay' ||
                                +swapAmountString === 0 ||
                                (!checked && showPriceImpactWarning),
                            )}
                            color={
                              showPriceImpactWarning || showSlippageWarning
                                ? 'red'
                                : 'blue'
                            }
                            fullWidth
                            testId="swap"
                          >
                            {!checked && showPriceImpactWarning
                              ? 'Price impact too high'
                              : quote?.route?.status === 'NoWay'
                                ? 'No trade found'
                                : isWrap
                                  ? 'Wrap'
                                  : isUnwrap
                                    ? 'Unwrap'
                                    : 'Swap'}
                          </Button>
                        </DialogTrigger>
                      </Checker.Success>
                    </Checker.ApproveERC20>
                  </Checker.Slippage>
                </Checker.Amounts>
              </Checker.Network>
            </Checker.Connect>
          </Checker.PartialRoute>
        </Checker.Guard>
      </div>
      {showSlippageWarning && <SlippageWarning className="mt-4" />}
      {showPriceImpactWarning && (
        <PriceImpactWarning
          className="mt-4"
          checked={checked}
          setChecked={setChecked}
        />
      )}
    </>
  )
}
