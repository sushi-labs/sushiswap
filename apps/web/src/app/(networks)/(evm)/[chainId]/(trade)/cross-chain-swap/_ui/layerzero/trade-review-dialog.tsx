'use client'

import {
  Button,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
  DialogType,
  Dots,
  Message,
  useDialog,
} from '@sushiswap/ui'
import { nanoid } from 'nanoid'
import { type ReactNode, useState } from 'react'
import { APPROVE_TAG_XSWAP } from 'src/lib/constants'
import { useApproved } from 'src/lib/wagmi/systems/checker/provider'
import { getChainById } from 'sushi'
import { CrossChainSwapConfirmationDialog } from '../cross-chain-swap-confirmation-dialog'
import { CrossChainSwapConfirmationContent } from '../lifi/confirmation-dialog'
import { DialogBody } from '../lifi/trade-review-dialog/dialog-body'
import { getLayerZeroExecutionStepStates } from './execution-step-states'
import { getLayerZeroTradeAmounts } from './get-trade-amounts'
import { useLayerZeroExecute } from './hooks/use-layerzero-execute'
import { LayerZeroTradeDetails } from './trade-details'
import { useLayerZeroXSwap } from './xswap-provider'

export function LayerZeroTradeReviewDialog({
  children,
}: { children: ReactNode }): ReactNode {
  return (
    <DialogProvider>
      <LayerZeroTradeReviewDialogContent>
        {children}
      </LayerZeroTradeReviewDialogContent>
    </DialogProvider>
  )
}

function LayerZeroTradeReviewDialogContent({
  children,
}: { children: ReactNode }): ReactNode {
  const {
    state: { token0, token1, executions, isSubmitting },
    previewQuote,
    sourceNetworkFee,
  } = useLayerZeroXSwap()
  const execute = useLayerZeroExecute()
  const { approved } = useApproved(APPROVE_TAG_XSWAP)
  const { setOpen: setConfirmationOpen } = useDialog(DialogType.Confirm)
  const [executionId, setExecutionId] = useState<string>()
  const execution = executions.find((item) => item.id === executionId)
  const submittedQuote = execution?.quote ?? execute.variables?.quote
  const submittedAmounts = submittedQuote
    ? getLayerZeroTradeAmounts(submittedQuote)
    : undefined
  const error = execution
    ? execution.delivery?.status === 'SUCCESS'
      ? undefined
      : execution.error
    : execute.error?.message
  const stepStates = getLayerZeroExecutionStepStates(execution, Boolean(error))
  const bridgeUrl = execution?.txHash
    ? `https://layerzeroscan.com/tx/${encodeURIComponent(execution.txHash)}`
    : undefined
  const quote = previewQuote.data
  const amounts = quote ? getLayerZeroTradeAmounts(quote) : undefined
  const pending = executions.filter(
    (item) =>
      item.txHash &&
      item.sourceStatus !== 'FAILED' &&
      item.delivery?.status !== 'SUCCESS',
  )

  return (
    <>
      <DialogReview>
        {({ confirm }) => (
          <>
            <div className="mt-4">{children}</div>
            <DialogContent className="max-h-[80vh]">
              <DialogHeader className="!text-left">
                <DialogTitle>
                  Receive {amounts?.amountOut.toSignificant(6)} {token1.symbol}
                </DialogTitle>
                <DialogDescription>
                  Swap {amounts?.amountIn.toSignificant(6)} {token0.symbol}
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                {quote && amounts ? (
                  <LayerZeroTradeDetails
                    quote={quote}
                    amounts={amounts}
                    sourceNetworkFee={sourceNetworkFee}
                  />
                ) : null}
              </DialogBody>
              <DialogFooter>
                <Button
                  fullWidth
                  size="xl"
                  testId="confirm-swap"
                  disabled={
                    !quote ||
                    previewQuote.isFetching ||
                    Boolean(previewQuote.error) ||
                    isSubmitting ||
                    !approved
                  }
                  onClick={() => {
                    if (!quote || isSubmitting || !approved) return
                    const id = nanoid()
                    setExecutionId(id)
                    confirm()
                    execute.mutate({ id, quote })
                  }}
                >
                  {isSubmitting ? (
                    <Dots>Confirm Swap</Dots>
                  ) : (
                    <>
                      Swap {token0.symbol} for {token1.symbol}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </>
        )}
      </DialogReview>
      {pending.length ? (
        <div className="mt-2 flex flex-col gap-1">
          {pending.map((item) => (
            <Button
              key={item.id}
              variant="secondary"
              fullWidth
              onClick={() => {
                setExecutionId(item.id)
                setConfirmationOpen(true)
              }}
            >
              Track Swap: {getChainById(item.quote.fromChainId).name} →{' '}
              {getChainById(item.quote.toChainId).name}
            </Button>
          ))}
        </div>
      ) : null}
      <CrossChainSwapConfirmationDialog
        stepStates={stepStates}
        closeDisabled={isSubmitting && !execution?.txHash}
        description={
          execution?.delivery?.status === 'ACTION_REQUIRED' ? (
            'This transfer needs attention. Open LayerZero Scan for recovery details.'
          ) : submittedQuote ? (
            <CrossChainSwapConfirmationContent
              chainId0={submittedQuote.fromChainId}
              chainId1={submittedQuote.toChainId}
              txHash={execution?.txHash}
              dstTxHash={execution?.delivery?.destinationTxHash}
              bridgeUrl={bridgeUrl}
              dialogState={stepStates}
              recipient={submittedQuote.recipient}
              amountIn={submittedAmounts?.amountIn.toSignificant(6)}
              amountOut={submittedAmounts?.amountOut.toSignificant(6)}
              token0Symbol={submittedAmounts?.amountIn.currency.symbol}
              token1Symbol={submittedAmounts?.amountOut.currency.symbol}
            />
          ) : (
            'Please sign order with your wallet.'
          )
        }
      >
        {error ? (
          <Message variant="warning" size="sm">
            {execution?.txHash && execution.sourceStatus !== 'FAILED'
              ? 'Confirmation could not be completed. Do not resend this transfer; track the existing transaction below.'
              : error}
          </Message>
        ) : null}
        {bridgeUrl ? (
          <a
            href={bridgeUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue text-sm text-center"
          >
            Track on LayerZero Scan ↗
          </a>
        ) : null}
      </CrossChainSwapConfirmationDialog>
    </>
  )
}
