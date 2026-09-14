'use client'

import { InterfaceModalName, Trace, useTrace } from '@sushiswap/telemetry'
import { DialogContent, DialogFooter } from '@sushiswap/ui'
import { type ReactElement, useEffect, useRef } from 'react'
import {
  DialogConfirm,
  DialogReview,
  DialogType,
  useDialog,
} from 'src/lib/transaction-dialog'
import { useDerivedStateSimpleSwap } from '../derivedstate-simple-swap-provider'
import { ConfirmSwapButton } from './confirm-swap-button'
import { DialogBody } from './dialog-body'
import { RecipientSection } from './recipient-section'
import { ReviewIntro } from './review-intro'
import { TradeDetails } from './trade-details'
import { TradeHeader } from './trade-header'
import { TradeWarnings } from './trade-warnings'
import type {
  SimpleSwapTradeReview,
  SimpleSwapTradeReviewDialogProps,
} from './types'

export function SimpleSwapTradeReviewDialogContent({
  autoConfirm,
  children,
  tradeReview,
  variant = 'default',
}: SimpleSwapTradeReviewDialogProps & {
  tradeReview: SimpleSwapTradeReview
}): ReactElement {
  const {
    state: { token0, token1, chainId, swapAmount, recipient },
  } = useDerivedStateSimpleSwap()

  const trace = useTrace()

  const {
    trade,
    tradeRef,
    isSwapQueryFetching,
    isSwapQuerySuccess,
    isSwapQueryError,
    swapQueryError,
    isWrap,
    isUnwrap,
    isSwap,
    slippagePercent,
    showSlippageWarning,
    showPriceImpactWarning,
    priceImpactSeverity,
    write,
    isWritePending,
    txHash,
    status,
  } = tradeReview

  return (
    <Trace modal={InterfaceModalName.CONFIRM_SWAP}>
      <DialogReview>
        {({ confirm }) => (
          <>
            <ReviewIntro
              renderChildren={children}
              swapQueryError={swapQueryError}
              isSwapQuerySuccess={isSwapQuerySuccess}
              isSwapQueryFetching={isSwapQueryFetching}
            />
            {autoConfirm && !isSwapQueryError ? (
              <AutoConfirmSwap confirm={confirm} write={write} />
            ) : (
              <DialogContent variant={variant} className="max-h-[80vh]">
                <TradeHeader
                  trade={trade}
                  isWrap={isWrap}
                  isUnwrap={isUnwrap}
                  variant={variant}
                />
                <DialogBody>
                  <TradeWarnings
                    showSlippageWarning={showSlippageWarning}
                    showPriceImpactWarning={showPriceImpactWarning}
                  />
                  <TradeDetails
                    chainId={chainId}
                    trade={trade}
                    token1Symbol={token1?.symbol}
                    slippagePercent={slippagePercent}
                    isSwap={isSwap}
                    priceImpactSeverity={priceImpactSeverity}
                    isSwapQueryFetching={isSwapQueryFetching}
                    variant={variant}
                  />
                  <RecipientSection
                    chainId={chainId}
                    recipient={recipient}
                    variant={variant}
                  />
                </DialogBody>
                <DialogFooter>
                  <ConfirmSwapButton
                    confirm={confirm}
                    trade={trade}
                    token0Symbol={token0?.symbol}
                    token1Symbol={token1?.symbol}
                    isWrap={isWrap}
                    isUnwrap={isUnwrap}
                    isSwapQueryError={isSwapQueryError}
                    isWritePending={isWritePending}
                    swapAmount={swapAmount}
                    showPriceImpactWarning={showPriceImpactWarning}
                    showSlippageWarning={showSlippageWarning}
                    write={write}
                    trace={trace}
                    variant={variant}
                  />
                </DialogFooter>
              </DialogContent>
            )}
          </>
        )}
      </DialogReview>
      <DialogConfirm
        variant={variant}
        chainId={chainId}
        status={status}
        testId="make-another-swap"
        buttonText="Make another swap"
        txHash={txHash}
        successMessage={`You ${
          isWrap ? 'wrapped' : isUnwrap ? 'unwrapped' : 'sold'
        } ${tradeRef.current?.amountIn?.toSignificant(6)} ${token0?.symbol} ${
          isWrap ? 'to' : isUnwrap ? 'to' : 'for'
        } ${tradeRef.current?.amountOut?.toSignificant(6)} ${token1?.symbol}`}
      />
    </Trace>
  )
}

function AutoConfirmSwap({
  confirm,
  write,
}: {
  confirm(): void
  write: SimpleSwapTradeReview['write']
}): null {
  const { setOpen: setReviewOpen } = useDialog(DialogType.Review)
  const { setOpen: setConfirmOpen } = useDialog(DialogType.Confirm)
  const submittedRef = useRef(false)

  useEffect(() => {
    if (!write || submittedRef.current) return

    submittedRef.current = true
    void write(confirm).finally(() => {
      setReviewOpen(false)
      setConfirmOpen(false)
    })
  }, [confirm, setReviewOpen, setConfirmOpen, write])

  return null
}
