'use client'

import { DialogType, useDialog } from '@sushiswap/ui'
import { useEffect, useMemo, useRef } from 'react'
import { APPROVE_TAG_SWAP } from 'src/lib/constants'
import { CheckerProvider } from 'src/lib/wagmi/systems/checker/provider'
import { Success } from 'src/lib/wagmi/systems/checker/success'
import { EdgeProvider } from 'src/providers/edge-config-provider'
import { EvmNative, EvmToken } from 'sushi/evm'
import { DetailsInteractionTrackerProvider } from '~evm/[chainId]/(trade)/_ui/details-interaction-tracker-provider'
import {
  DerivedstateSimpleSwapProvider,
  useDerivedStateSimpleSwap,
} from '~evm/[chainId]/(trade)/swap/_ui/derivedstate-simple-swap-provider'
import { SimpleSwapTradeReviewDialog } from '~evm/[chainId]/(trade)/swap/_ui/simple-swap-trade-review-dialog'
import { defaultSwapEdgeConfig } from '~evm/[chainId]/(trade)/swap/swap-edge-config'
import {
  LAUNCHPAD_SLIPPAGE_TOLERANCE_OPTIONS,
  LAUNCHPAD_SWAP_FEE,
} from '../../_lib/launchpad-swap'
import type { LaunchpadChainId } from '../../constants'
import type { LaunchpadToken } from '../../types'

export function QuickBuyTradeReview({
  token,
  amount,
  onClose,
}: {
  token: LaunchpadToken
  amount: string
  onClose(): void
}) {
  const nativeCurrency = useMemo(
    () => EvmNative.fromChainId(token.chainId),
    [token.chainId],
  )
  const launchCurrency = useMemo(
    () =>
      new EvmToken({
        chainId: token.chainId,
        address: token.address,
        decimals: token.decimals,
        symbol: token.symbol,
        name: token.name,
      }),
    [token.address, token.chainId, token.decimals, token.name, token.symbol],
  )

  return (
    <EdgeProvider config={defaultSwapEdgeConfig}>
      <CheckerProvider>
        <DerivedstateSimpleSwapProvider
          chainId={token.chainId}
          token0={nativeCurrency}
          token1={launchCurrency}
          persistToUrl={false}
          fee={LAUNCHPAD_SWAP_FEE}
          slippageToleranceOptions={LAUNCHPAD_SLIPPAGE_TOLERANCE_OPTIONS}
          directPool={{
            address: token.pool.address,
            quoteTokenAddress: token.pool.quoteToken.address,
            launchTokenAddress: token.address,
            feeTier: token.pool.feeTier,
          }}
        >
          <DetailsInteractionTrackerProvider>
            <Success tag={APPROVE_TAG_SWAP}>
              <SimpleSwapTradeReviewDialog autoConfirm variant="perps">
                {() => (
                  <QuickBuyTradeReviewTrigger
                    amount={amount}
                    onClose={onClose}
                  />
                )}
              </SimpleSwapTradeReviewDialog>
            </Success>
          </DetailsInteractionTrackerProvider>
        </DerivedstateSimpleSwapProvider>
      </CheckerProvider>
    </EdgeProvider>
  )
}

function QuickBuyTradeReviewTrigger({
  amount,
  onClose,
}: {
  amount: string
  onClose(): void
}) {
  const {
    mutate: { setSwapAmount },
  } = useDerivedStateSimpleSwap<LaunchpadChainId>()
  const { open: reviewOpen, setOpen: setReviewOpen } = useDialog(
    DialogType.Review,
  )
  const { open: confirmOpen } = useDialog(DialogType.Confirm)
  const openRequestedRef = useRef(false)
  const wasOpenRef = useRef(false)

  useEffect(() => {
    if (openRequestedRef.current) return

    openRequestedRef.current = true
    setSwapAmount(amount)
    setReviewOpen(true)
  }, [amount, setReviewOpen, setSwapAmount])

  useEffect(() => {
    if (reviewOpen || confirmOpen) {
      wasOpenRef.current = true
      return
    }

    if (!wasOpenRef.current) return

    setSwapAmount('')
    onClose()
  }, [confirmOpen, onClose, reviewOpen, setSwapAmount])

  return null
}
