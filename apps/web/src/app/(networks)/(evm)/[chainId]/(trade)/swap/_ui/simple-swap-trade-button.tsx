'use client'

import { DialogTrigger, DialogType, Message, useDialog } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import type React from 'react'
import { type FC, useEffect, useMemo, useState } from 'react'
import { PriceImpactWarning } from 'src/app/(networks)/_ui/price-impact-warning'
import { SlippageWarning } from 'src/app/(networks)/_ui/slippage-warning'
import type { SupportedChainId } from 'src/config'
import { APPROVE_TAG_SWAP } from 'src/lib/constants'
import { usePersistedSlippageError } from 'src/lib/hooks/use-persisted-slippage-error'
import { useSlippageTolerance } from 'src/lib/hooks/use-slippage-tolerance'
import { warningSeverity } from 'src/lib/swap/warning-severity'
import { Amounts } from 'src/lib/wagmi/systems/checker/amounts'
import { ApproveERC20 } from 'src/lib/wagmi/systems/checker/approve-erc20'
import { Connect } from 'src/lib/wagmi/systems/checker/connect'
import { Guard } from 'src/lib/wagmi/systems/checker/guard'
import { Network } from 'src/lib/wagmi/systems/checker/network'
import { PartialRoute } from 'src/lib/wagmi/systems/checker/partial-route'
import {
  SLIPPAGE_WARNING_THRESHOLD,
  Slippage,
} from 'src/lib/wagmi/systems/checker/slippage'
import { Success } from 'src/lib/wagmi/systems/checker/success'
import { ZERO } from 'sushi'
import {
  type EvmChainId,
  EvmNative,
  RED_SNWAPPER_ADDRESS,
  isRedSnwapperChainId,
} from 'sushi/evm'
import { type SvmChainId, SvmNative, isSvmChainId } from 'sushi/svm'
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
        <Guard
          guardWhen={maintenance}
          guardText="Maintenance in progress"
          variant={buttonVariant}
        >
          <Connect namespace={walletNamespace} variant={buttonVariant}>
            <Network chainId={chainId} variant={buttonVariant}>
              <Amounts
                chainId={chainId}
                amount={swapAmount}
                variant={buttonVariant}
              >
                <Slippage
                  text="Swap With High Slippage"
                  slippageTolerance={slippagePercent}
                >
                  <ApproveERC20<EvmChainId | SvmChainId>
                    id="approve-erc20"
                    amount={swapAmount}
                    variant={buttonVariant}
                    contract={
                      isRedSnwapperChainId(chainId)
                        ? RED_SNWAPPER_ADDRESS[chainId]
                        : undefined
                    }
                  >
                    <Success tag={APPROVE_TAG_SWAP}>
                      <PartialRoute
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
                      </PartialRoute>
                    </Success>
                  </ApproveERC20>
                </Slippage>
              </Amounts>
            </Network>
          </Connect>
        </Guard>
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
