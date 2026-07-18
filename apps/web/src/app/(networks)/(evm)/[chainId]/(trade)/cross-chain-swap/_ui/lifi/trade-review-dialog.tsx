'use client'

import {
  Button,
  DialogClose,
  DialogContent,
  DialogCustom,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
  DialogType,
} from '@sushiswap/ui'
import type React from 'react'
import type { ReactNode } from 'react'
import type { LifiXSwapSupportedChainId } from 'src/config'
import {
  ConfirmationDialogContent,
  Divider,
  GetStateComponent,
  failedState,
  finishedState,
} from './confirmation-dialog'
import { ConfirmSwapButton } from './trade-review-dialog/confirm-swap-button'
import { DialogBody } from './trade-review-dialog/dialog-body'
import { useCrossChainSwapTradeReview } from './trade-review-dialog/hooks/use-cross-chain-swap-trade-review'
import { RecipientSection } from './trade-review-dialog/recipient-section'
import { ReviewIntro } from './trade-review-dialog/review-intro'
import { TradeDetails } from './trade-review-dialog/trade-details'
import { TradeHeader } from './trade-review-dialog/trade-header'
import { TradeWarnings } from './trade-review-dialog/trade-warnings'

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
    route,
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
    retryReceiptObservation,
    isEstGasError,
    estGasError,
    isStepQueryError,
    showPriceImpactWarning,
    showSlippageWarning,
  } = useCrossChainSwapTradeReview<TChainId0, TChainId1>()

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
      <DialogCustom dialogType={DialogType.Confirm}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Cross-chain swap</DialogTitle>
            <DialogDescription asChild>
              <div>
                <ConfirmationDialogContent
                  dialogState={stepStates}
                  bridgeUrl={lifiData?.lifiExplorerLink}
                  txHash={hash}
                  dstTxHash={lifiData?.receiving?.txHash}
                  onRetrySourceReceipt={retryReceiptObservation}
                  route={route}
                />
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="py-5">
              <div className="relative flex gap-3">
                <GetStateComponent index={1} state={stepStates.source} />
                <Divider />
                <GetStateComponent index={2} state={stepStates.bridge} />
                <Divider />
                <GetStateComponent index={3} state={stepStates.dest} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button size="xl" fullWidth id="swap-dialog-close">
                {failedState(stepStates)
                  ? 'Try again'
                  : finishedState(stepStates)
                    ? 'Make another swap'
                    : 'Close'}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </DialogCustom>
    </>
  )
}
