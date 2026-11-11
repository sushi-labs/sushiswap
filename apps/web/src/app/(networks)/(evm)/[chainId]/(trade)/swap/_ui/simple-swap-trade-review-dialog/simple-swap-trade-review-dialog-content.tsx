'use client'

import { InterfaceModalName, Trace, useTrace } from '@sushiswap/telemetry'
import {
  Currency,
  DialogContent,
  DialogFooter,
  List,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
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
                <TradeHeader variant={variant} />
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
                  />
                  <RecipientSection chainId={chainId} recipient={recipient} />
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
        successTitle="Swap Successful"
        successMessage={
          <List className="!pt-0 w-full">
            <List.Control
              className={classNames(
                '!bg-transparent !border-transparent !py-2 !px-0',
              )}
            >
              <List.KeyValue
                title={
                  <div className="text-muted-foreground text-lg whitespace-nowrap">
                    Sold
                  </div>
                }
                fontWeight="normal"
                className="!py-2"
                flex
              >
                <div className="flex items-center gap-1 text-lg">
                  {isSwapQueryFetching ? (
                    <SkeletonText align="right" fontSize="lg" />
                  ) : tradeRef?.current?.amountIn ? (
                    <div className="flex items-center gap-1">
                      {tradeRef?.current?.amountIn?.toSignificant(6)}
                      <Currency.Icon
                        currency={tradeRef?.current?.amountIn?.currency}
                        width={16}
                        height={16}
                      />
                      {tradeRef?.current?.amountIn?.currency.symbol}
                    </div>
                  ) : (
                    '-'
                  )}
                </div>
              </List.KeyValue>
              <List.KeyValue
                title={
                  <div className="text-muted-foreground text-lg whitespace-nowrap">
                    Received
                  </div>
                }
                fontWeight="normal"
                className="!py-2"
                flex
              >
                <div className="flex items-center gap-1 text-lg">
                  {isSwapQueryFetching ? (
                    <SkeletonText align="right" fontSize="lg" />
                  ) : tradeRef?.current?.amountOut ? (
                    <div className="flex items-center gap-1">
                      {tradeRef?.current?.amountOut?.toSignificant(6)}
                      <Currency.Icon
                        currency={tradeRef?.current?.amountOut?.currency}
                        width={16}
                        height={16}
                      />
                      {tradeRef?.current?.amountOut?.currency.symbol}
                    </div>
                  ) : (
                    '-'
                  )}
                </div>
              </List.KeyValue>
            </List.Control>
          </List>
        }
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
