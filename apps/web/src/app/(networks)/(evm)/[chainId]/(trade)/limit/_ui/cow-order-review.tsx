'use client'

import {
  Button,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  List,
  Message,
} from '@sushiswap/ui'
import type { CowLimitChainId } from 'src/lib/swap/cow/chains'
import {
  DialogConfirm,
  DialogProvider,
  DialogReview,
} from 'src/lib/transaction-dialog'
import { Checker } from 'src/lib/wagmi/systems/checker'
import { shortenAddress } from 'sushi'
import { formatCowTimestamp, formatCowTokenAmount } from './cow-format'
import type { CowOrderAction, CowReviewedOrder } from './use-cow-order-action'
import { useCowTokens } from './use-cow-tokens'

function getStepsNote(
  review: CowReviewedOrder,
  action: CowOrderAction,
): string | undefined {
  const notes: string[] = []
  if (review.wrapNative && !action.progress.wrapped)
    notes.push(
      'Native tokens your wrapped balance does not cover are wrapped first (network gas).',
    )
  if (review.previous)
    notes.push(
      review.atomicReplacement
        ? 'Placing the replacement cancels the original order.'
        : action.progress.cancelled
          ? 'The original order was cancelled. Confirm to place the replacement.'
          : 'The original order is cancelled on-chain first (network gas).',
    )
  return notes.length ? notes.join(' ') : undefined
}

function CowOrderReviewContent({
  chainId,
  review,
  action,
  onPlaced,
}: {
  chainId: CowLimitChainId
  review: CowReviewedOrder
  action: CowOrderAction
  onPlaced(): void
}): React.JSX.Element {
  const { order, owner } = review.prepared
  const { sell, buy } = useCowTokens(chainId, order.sellToken, order.buyToken)
  const steps = getStepsNote(review, action)

  return (
    <DialogContent>
      <DialogHeader className="!text-left">
        <DialogTitle>
          {review.previous ? 'Replace' : 'Sell'}{' '}
          {sell ? formatCowTokenAmount(sell, order.sellAmount) : '…'}
        </DialogTitle>
        <DialogDescription>
          Receive at least{' '}
          {buy ? formatCowTokenAmount(buy, order.buyAmount) : '…'} if fully
          filled
        </DialogDescription>
      </DialogHeader>
      <List className="!pt-0">
        <List.Control>
          <List.KeyValue title="Expires">
            {formatCowTimestamp(order.validTo)}
          </List.KeyValue>
          <List.KeyValue title="Recipient">
            {shortenAddress(owner)}
          </List.KeyValue>
          <List.KeyValue title="Partial fills">Enabled</List.KeyValue>
          <List.KeyValue title="Fees">
            No Sushi fee. CoW execution fees apply.
          </List.KeyValue>
          <List.KeyValue title="Powered by">CoW Protocol</List.KeyValue>
        </List.Control>
      </List>
      {steps && (
        <Message variant="muted" size="sm">
          {steps}
        </Message>
      )}
      {action.error && (
        <Message variant="destructive" size="sm" role="alert">
          {action.error}
        </Message>
      )}
      <DialogFooter className="flex-col gap-2">
        <Checker.Connect namespace="evm">
          <Checker.Network chainId={chainId}>
            <Button
              fullWidth
              size="xl"
              loading={action.busy}
              disabled={action.busy}
              onClick={() => action.submit(onPlaced)}
            >
              {review.previous ? 'Replace order' : 'Place order'}
            </Button>
            {action.canPresign && (
              <Button
                fullWidth
                variant="secondary"
                disabled={action.busy}
                onClick={() => action.authorizeOnchain(onPlaced)}
              >
                Authorize on-chain (network gas)
              </Button>
            )}
          </Checker.Network>
        </Checker.Connect>
      </DialogFooter>
    </DialogContent>
  )
}

// Wraps the review trigger, which opens the dialog once the order is prepared.
export function CowOrderReviewDialog({
  chainId,
  action,
  onPlaced,
  children,
}: {
  chainId: CowLimitChainId
  action: CowOrderAction
  onPlaced(): void
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <DialogProvider>
      <DialogReview>
        {({ confirm }) => (
          <>
            {children}
            {action.review && (
              <CowOrderReviewContent
                chainId={chainId}
                review={action.review}
                action={action}
                onPlaced={() => {
                  confirm()
                  onPlaced()
                }}
              />
            )}
          </>
        )}
      </DialogReview>
      <DialogConfirm
        chainId={chainId}
        status="success"
        testId="place-another-order"
        buttonText="Place another order"
        txHash={undefined}
        successMessage="Your limit order was placed"
      />
    </DialogProvider>
  )
}
