'use client'

import { DialogTrigger, DialogType, Message, useDialog } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import type React from 'react'
import { type FC, useEffect, useMemo, useState } from 'react'
import { PriceImpactWarning } from 'src/app/(networks)/_ui/price-impact-warning'
import { SlippageWarning } from 'src/app/(networks)/_ui/slippage-warning'
import type { SupportedChainId } from 'src/config'
import { APPROVE_TAG_SWAP } from 'src/lib/constants'
import { usePersistedSlippageError } from 'src/lib/hooks'
import { useSlippageTolerance } from 'src/lib/hooks/use-slippage-tolerance'
import { warningSeverity } from 'src/lib/swap/warning-severity'
import { Checker } from 'src/lib/wagmi/systems/checker'
import { SLIPPAGE_WARNING_THRESHOLD } from 'src/lib/wagmi/systems/checker/slippage'
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
import {
  SimpleSwapTradeReviewDialog,
  type SimpleSwapTradeReviewDialogVariant,
} from './simple-swap-trade-review-dialog'
import { useIsSwapMaintenance } from './use-is-swap-maintenance'

export function SimpleSwapTradeButton({
  variant = 'default',
}: {
  variant?: SimpleSwapTradeReviewDialogVariant
}) {
  return (
    <SimpleSwapTradeReviewDialog variant={variant}>
      {({ error, isSuccess }) => (
        <_SimpleSwapTradeButton
          error={error}
          isSuccess={isSuccess}
          variant={variant}
        />
      )}
    </SimpleSwapTradeReviewDialog>
  )
}

interface SimpleSwapTradeButtonProps {
  error: Error | null
  isSuccess: boolean
  variant: SimpleSwapTradeReviewDialogVariant
}

function _SimpleSwapTradeButton<TChainId extends SupportedChainId>({
  error,
  isSuccess,
  variant,
}: SimpleSwapTradeButtonProps) {
  const { data: maintenance } = useIsSwapMaintenance()
  const { isSlippageError } = usePersistedSlippageError({ isSuccess, error })
  const { data: quote } = useSimpleSwapTradeQuote()
  const { setOpen: setReviewOpen } = useDialog(DialogType.Review)
  const [checked, setChecked] = useState(false)

  const {
    state: {
      swapAmount,
      swapAmountString,
      chainId,
      token0,
      token1,
      slippageToleranceOptions,
    },
    mutate: { setSwapAmount },
  } = useDerivedStateSimpleSwap<TChainId>()
  const [slippagePercent] = useSlippageTolerance(
    slippageToleranceOptions?.storageKey,
    slippageToleranceOptions?.defaultValue,
  )
  const walletNamespace = isSvmChainId(chainId) ? 'svm' : 'evm'
  const buttonVariant = variant === 'perps' ? 'perps-default' : 'default'

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
          variant={buttonVariant}
        >
          <Checker.Connect namespace={walletNamespace} variant={buttonVariant}>
            <Checker.Network chainId={chainId} variant={buttonVariant}>
              <Checker.Amounts
                chainId={chainId}
                amount={swapAmount}
                variant={buttonVariant}
              >
                <Checker.Slippage
                  text="Swap With High Slippage"
                  slippageTolerance={slippagePercent}
                >
                  <Checker.ApproveERC20
                    id="approve-erc20"
                    amount={swapAmount}
                    variant={buttonVariant}
                    contract={
                      isRedSnwapperChainId(chainId)
                        ? RED_SNWAPPER_ADDRESS[chainId]
                        : undefined
                    }
                  >
                    <Checker.Success tag={APPROVE_TAG_SWAP}>
                      <Checker.PartialRoute
                        trade={quote}
                        setSwapAmount={setSwapAmount}
                        onAccepted={() => setReviewOpen(true)}
                        variant={buttonVariant}
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="xl"
                            variant={buttonVariant}
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
                      </Checker.PartialRoute>
                    </Checker.Success>
                  </Checker.ApproveERC20>
                </Checker.Slippage>
              </Checker.Amounts>
            </Checker.Network>
          </Checker.Connect>
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
