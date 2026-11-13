'use client'

import {
  Button,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dots,
} from '@sushiswap/ui'
import { nanoid } from 'nanoid'
import { type ReactNode, useState } from 'react'
import { APPROVE_TAG_XSWAP } from 'src/lib/constants'
import {
  DialogProvider,
  DialogReview,
  DialogType,
  useDialog,
} from 'src/lib/transaction-dialog'
import { useApproved } from 'src/lib/wagmi/systems/checker/provider'
import { DialogBody } from '../lifi/trade-review-dialog/dialog-body'
import { useXSwapRoutingLock } from '../xswap-routing-context'
import { LayerZeroExecutionConfirmation } from './execution-confirmation'
import { useSharedLayerZeroExecutions } from './execution-state-context'
import { getLayerZeroTradeAmounts } from './get-trade-amounts'
import { useLayerZeroExecute } from './hooks/use-layerzero-execute'
import { LayerZeroPendingExecutions } from './pending-executions'
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
  const sharedExecutions = useSharedLayerZeroExecutions()
  const execute = useLayerZeroExecute()
  const { approved } = useApproved(APPROVE_TAG_XSWAP)
  const { open: confirmationOpen, setOpen: setConfirmationOpen } = useDialog(
    DialogType.Confirm,
  )
  const { open: reviewOpen } = useDialog(DialogType.Review)
  useXSwapRoutingLock(
    'layerzero',
    reviewOpen || confirmationOpen || isSubmitting,
  )
  const [executionId, setExecutionId] = useState<string>()
  const execution = executions.find((item) => item.id === executionId)
  const quote = previewQuote.data
  const amounts = quote ? getLayerZeroTradeAmounts(quote) : undefined

  return (
    <>
      <DialogReview>
        {() => (
          <>
            {children}
            <DialogContent className="max-h-[80vh]">
              <DialogHeader className="!text-left">
                <DialogTitle>
                  Receive {amounts?.amountOut.toSignificant(6)} {token1?.symbol}
                </DialogTitle>
                <DialogDescription>
                  Swap {amounts?.amountIn.toSignificant(6)} {token0?.symbol}
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
                    execute.mutate({ id, quote })
                  }}
                >
                  {isSubmitting ? (
                    <Dots>Confirm Swap</Dots>
                  ) : (
                    <>
                      Swap {token0?.symbol} for {token1?.symbol}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </>
        )}
      </DialogReview>
      {!sharedExecutions ? (
        <LayerZeroPendingExecutions
          executions={executions}
          onSelect={(id) => {
            setExecutionId(id)
            setConfirmationOpen(true)
          }}
        />
      ) : null}
      <LayerZeroExecutionConfirmation
        execution={execution}
        fallbackQuote={execute.variables?.quote}
        error={execute.error?.message}
        isSubmitting={isSubmitting}
      />
    </>
  )
}
