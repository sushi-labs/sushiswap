'use client'

import { DialogTrigger, Message } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import type React from 'react'
import { type FC, useEffect, useMemo, useState } from 'react'
import { PriceImpactWarning } from 'src/app/(networks)/_ui/PriceImpactWarning'
import { SlippageWarning } from 'src/app/(networks)/_ui/SlippageWarning'
import { APPROVE_TAG_SWAP } from 'src/lib/constants'
import { usePersistedSlippageError } from 'src/lib/hooks'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { warningSeverity } from 'src/lib/swap/warningSeverity'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { SLIPPAGE_WARNING_THRESHOLD } from 'src/lib/wagmi/systems/Checker/Slippage'
import { ZERO } from 'sushi'
import {
  EvmNative,
  RED_SNWAPPER_ADDRESS,
  isRedSnwapperChainId,
} from 'sushi/evm'
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
    state: { swapAmount, swapAmountString, chainId, token0, token1 },
    mutate: { setSwapAmount },
  } = useDerivedStateSimpleSwap()

  const isWrap =
    token0?.type === 'native' &&
    token1?.wrap().address === EvmNative.fromChainId(chainId).wrap().address
  const isUnwrap =
    token1?.type === 'native' &&
    token0?.wrap().address === EvmNative.fromChainId(chainId).wrap().address

  const showPriceImpactWarning = useMemo(() => {
    const priceImpactSeverity = warningSeverity(quote?.priceImpact)
    return priceImpactSeverity > 3
  }, [quote?.priceImpact])

  const showSlippageWarning = useMemo(() => {
    return !slippagePercent.lt(SLIPPAGE_WARNING_THRESHOLD)
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
                                !quote?.amountOut?.gt(ZERO) ||
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
