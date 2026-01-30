'use client'

import { DialogTrigger, Message } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import type React from 'react'
import { type FC, useEffect, useMemo, useState } from 'react'
import { PriceImpactWarning } from 'src/app/(networks)/_ui/price-impact-warning'
import { SlippageWarning } from 'src/app/(networks)/_ui/slippage-warning'
import type { SupportedChainId } from 'src/config'
import { APPROVE_TAG_SWAP } from 'src/lib/constants'
import { usePersistedSlippageError } from 'src/lib/hooks'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { warningSeverity } from 'src/lib/swap/warningSeverity'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { SLIPPAGE_WARNING_THRESHOLD } from 'src/lib/wagmi/systems/Checker/slippage'
import { ZERO } from 'sushi'
import {
  EvmNative,
  RED_SNWAPPER_ADDRESS,
  isRedSnwapperChainId,
} from 'sushi/evm'
import { SvmNative, isSvmChainId } from 'sushi/svm'
import {
  useDerivedStateSimpleSwap,
  useSimpleSwapTradeQuote,
} from './derivedstate-simple-swap-provider'
import { SimpleSwapTradeReviewDialog } from './simple-swap-trade-review-dialog'
import { useIsSwapMaintenance } from './use-is-swap-maintenance'

export function SimpleSwapTradeButton() {
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

function _SimpleSwapTradeButton<TChainId extends SupportedChainId>({
  error,
  isSuccess,
}: SimpleSwapTradeButtonProps) {
  const [slippagePercent] = useSlippageTolerance()

  const { data: maintenance } = useIsSwapMaintenance()
  const { isSlippageError } = usePersistedSlippageError({ isSuccess, error })
  const { data: quote } = useSimpleSwapTradeQuote()
  const [checked, setChecked] = useState(false)

  const {
    state: { swapAmount, swapAmountString, chainId, token0, token1 },
    mutate: { setSwapAmount },
  } = useDerivedStateSimpleSwap<TChainId>()
  const walletNamespace = isSvmChainId(chainId) ? 'svm' : 'evm'

  const [isWrap, isUnwrap] = useMemo(() => {
    const wrappedAddress = isSvmChainId(chainId)
      ? SvmNative.fromChainId(chainId).wrap().address
      : EvmNative.fromChainId(chainId).wrap().address

    return [
      token0?.type === 'native' && token1?.wrap().address === wrappedAddress,
      token1?.type === 'native' && token0?.wrap().address === wrappedAddress,
    ]
  }, [chainId, token0, token1])

  const showPriceImpactWarning = useMemo(() => {
    const priceImpactSeverity = warningSeverity(quote?.priceImpact)
    return priceImpactSeverity > 3
  }, [quote?.priceImpact])

  const showSlippageWarning = useMemo(() => {
    // No slippage setting on SVM chains
    if (isSvmChainId(chainId)) return false

    return !slippagePercent.lt(SLIPPAGE_WARNING_THRESHOLD)
  }, [chainId, slippagePercent])

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
            <Checker.Connect namespace={walletNamespace}>
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
                                quote?.status === 'NoWay' ||
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
                              : quote?.status === 'NoWay'
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
