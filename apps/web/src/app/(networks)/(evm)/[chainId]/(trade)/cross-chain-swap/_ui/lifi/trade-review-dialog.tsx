'use client'

import {
  DialogContent,
  DialogFooter,
  DialogProvider,
  DialogReview,
  DialogType,
  useDialog,
} from '@sushiswap/ui'
import type React from 'react'
import { type ReactNode, type RefObject, useEffect } from 'react'
import type { LifiXSwapSupportedChainId } from 'src/config'
import { CrossChainSwapConfirmationDialog } from '../cross-chain-swap-confirmation-dialog'
import { ConfirmationDialogContent, StepState } from './confirmation-dialog'
import { ConfirmSwapButton } from './trade-review-dialog/confirm-swap-button'
import { DialogBody } from './trade-review-dialog/dialog-body'
import { useCrossChainSwapTradeReview } from './trade-review-dialog/hooks/use-cross-chain-swap-trade-review'
import { RecipientSection } from './trade-review-dialog/recipient-section'
import { ReviewIntro } from './trade-review-dialog/review-intro'
import { TradeDetails } from './trade-review-dialog/trade-details'
import { TradeHeader } from './trade-review-dialog/trade-header'
import { TradeWarnings } from './trade-review-dialog/trade-warnings'
import type { UseLifiXSwapSelectedTradeRouteReturn } from './xswap-provider'

interface CrossChainSwapTradeReviewDialogProps {
  children: ReactNode
}

export function CrossChainSwapTradeReviewDialog<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>({ children }: CrossChainSwapTradeReviewDialogProps) {
  return (
    <DialogProvider>
      <CrossChainSwapTradeReviewDialogContent<TChainId0, TChainId1>>
        {children}
      </CrossChainSwapTradeReviewDialogContent>
    </DialogProvider>
  )
}

function CrossChainSwapTradeReviewDialogContent<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>({
  children,
}: {
  children: ReactNode
}) {
  const {
    step,
    stepStates,
    lifiData,
    hash,
    routeRef,
    executionDuration,
    feesBreakdown,
    totalFeesUSD,
    chainId0Fees,
    amountOutUSD,
    amountOutMinUSD,
    isPriceLoading,
    slippagePercent,
    isWritePending,
    write,
    isEstGasError,
    estGasError,
    isStepQueryError,
    showPriceImpactWarning,
    showSlippageWarning,
    tracking: { setStepStates },
  } = useCrossChainSwapTradeReview<TChainId0, TChainId1>()

  const { open: confirmDialogOpen } = useDialog(DialogType.Confirm)
  useEffect(() => {
    if (!confirmDialogOpen) {
      setStepStates({
        source: StepState.NotStarted,
        bridge: StepState.NotStarted,
        dest: StepState.NotStarted,
      })
    }
  }, [confirmDialogOpen, setStepStates])

  return (
    <>
      <DialogReview>
        {({ confirm }) => (
          <>
            <ReviewIntro estGasError={estGasError}>{children}</ReviewIntro>
            <DialogContent className="max-h-[80vh]">
              <TradeHeader step={step} />
              <DialogBody>
                <TradeWarnings
                  showSlippageWarning={showSlippageWarning}
                  showPriceImpactWarning={showPriceImpactWarning}
                />
                <TradeDetails
                  executionDuration={executionDuration}
                  step={step}
                  feesBreakdown={feesBreakdown}
                  totalFeesUSD={totalFeesUSD}
                  chainId0Fees={chainId0Fees}
                  amountOutUSD={amountOutUSD}
                  amountOutMinUSD={amountOutMinUSD}
                  isPriceLoading={isPriceLoading}
                  slippagePercent={slippagePercent}
                />
                <RecipientSection />
              </DialogBody>
              <DialogFooter>
                <ConfirmSwapButton
                  confirm={confirm}
                  write={write}
                  isWritePending={isWritePending}
                  isEstGasError={isEstGasError}
                  isStepQueryError={isStepQueryError}
                  showPriceImpactWarning={showPriceImpactWarning}
                  showSlippageWarning={showSlippageWarning}
                />
              </DialogFooter>
            </DialogContent>
          </>
        )}
      </DialogReview>
      <CrossChainSwapConfirmationDialog
        stepStates={stepStates}
        description={
          <ConfirmationDialogContent
            dialogState={stepStates}
            bridgeUrl={lifiData?.lifiExplorerLink}
            txHash={hash}
            dstTxHash={lifiData?.receiving?.txHash}
            routeRef={
              routeRef as RefObject<UseLifiXSwapSelectedTradeRouteReturn<
                TChainId0,
                TChainId1
              > | null>
            }
          />
        }
      />
    </>
  )
}
