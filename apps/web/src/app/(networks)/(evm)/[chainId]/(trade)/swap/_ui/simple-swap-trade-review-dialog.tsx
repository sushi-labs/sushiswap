'use client'

import { InterfaceModalName, Trace, useTrace } from '@sushiswap/telemetry'
import {
  DialogConfirm,
  DialogContent,
  DialogFooter,
  DialogProvider,
  DialogReview,
  DialogType,
  useDialog,
} from '@sushiswap/ui'
import { type FC, type ReactNode, useEffect, useRef } from 'react'
import { isSvmChainId } from 'sushi/svm'
import { useDerivedStateSimpleSwap } from './derivedstate-simple-swap-provider'
import { ConfirmSwapButton } from './simple-swap-trade-review-dialog/confirm-swap-button'
import { DialogBody } from './simple-swap-trade-review-dialog/dialog-body'
import { RecipientSection } from './simple-swap-trade-review-dialog/recipient-section'
import { ReviewIntro } from './simple-swap-trade-review-dialog/review-intro'
import { TradeDetails } from './simple-swap-trade-review-dialog/trade-details'
import { TradeHeader } from './simple-swap-trade-review-dialog/trade-header'
import { TradeWarnings } from './simple-swap-trade-review-dialog/trade-warnings'
import { useEvmSimpleSwapTradeReview } from './simple-swap-trade-review-dialog/use-evm-simple-swap-trade-review'
import { getSimpleSwapTradeReview } from './simple-swap-trade-review-dialog/use-simple-swap-trade-review'
import { useSvmSimpleSwapTradeReview } from './simple-swap-trade-review-dialog/use-svm-simple-swap-trade-review'

type SimpleSwapTradeReviewDialogProps = {
  children({
    error,
    isSuccess,
  }: { error: Error | null; isSuccess: boolean }): ReactNode
  autoConfirm?: boolean
  variant?: SimpleSwapTradeReviewDialogVariant
}

export type SimpleSwapTradeReviewDialogVariant = 'default' | 'perps'

type SimpleSwapTradeReview = ReturnType<typeof getSimpleSwapTradeReview>

export const SimpleSwapTradeReviewDialog: FC<
  SimpleSwapTradeReviewDialogProps
> = ({ autoConfirm = false, children, variant = 'default' }) => {
  return (
    <DialogProvider>
      <SimpleSwapTradeReviewDialogRouter
        autoConfirm={autoConfirm}
        variant={variant}
      >
        {children}
      </SimpleSwapTradeReviewDialogRouter>
    </DialogProvider>
  )
}

const SimpleSwapTradeReviewDialogRouter: FC<
  SimpleSwapTradeReviewDialogProps
> = ({ autoConfirm, children, variant }) => {
  const {
    state: { chainId },
  } = useDerivedStateSimpleSwap()

  if (isSvmChainId(chainId)) {
    return (
      <SvmSimpleSwapTradeReviewDialog
        autoConfirm={autoConfirm}
        variant={variant}
      >
        {children}
      </SvmSimpleSwapTradeReviewDialog>
    )
  }

  return (
    <EvmSimpleSwapTradeReviewDialog autoConfirm={autoConfirm} variant={variant}>
      {children}
    </EvmSimpleSwapTradeReviewDialog>
  )
}

const EvmSimpleSwapTradeReviewDialog: FC<SimpleSwapTradeReviewDialogProps> = ({
  autoConfirm,
  children,
  variant,
}) => {
  const baseTradeReview = useEvmSimpleSwapTradeReview({ variant })
  const tradeReview = getSimpleSwapTradeReview(baseTradeReview)

  return (
    <SimpleSwapTradeReviewDialogContent
      autoConfirm={autoConfirm}
      tradeReview={tradeReview}
      variant={variant}
    >
      {children}
    </SimpleSwapTradeReviewDialogContent>
  )
}

const SvmSimpleSwapTradeReviewDialog: FC<SimpleSwapTradeReviewDialogProps> = ({
  autoConfirm,
  children,
  variant,
}) => {
  const baseTradeReview = useSvmSimpleSwapTradeReview()
  const tradeReview = getSimpleSwapTradeReview(baseTradeReview)

  return (
    <SimpleSwapTradeReviewDialogContent
      autoConfirm={autoConfirm}
      tradeReview={tradeReview}
      variant={variant}
    >
      {children}
    </SimpleSwapTradeReviewDialogContent>
  )
}

const SimpleSwapTradeReviewDialogContent: FC<
  SimpleSwapTradeReviewDialogProps & {
    tradeReview: SimpleSwapTradeReview
  }
> = ({ autoConfirm, children, tradeReview, variant = 'default' }) => {
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

const AutoConfirmSwap: FC<{
  confirm(): void
  write: SimpleSwapTradeReview['write']
}> = ({ confirm, write }) => {
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
