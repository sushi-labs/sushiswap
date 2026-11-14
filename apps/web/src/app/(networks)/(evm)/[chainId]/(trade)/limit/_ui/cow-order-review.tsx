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
  SkeletonText,
} from '@sushiswap/ui'
import {
  type CowLimitPrice,
  formatPriceDifference,
  getOrderPrice,
  getPriceDifference,
} from 'src/lib/swap/cow/amounts'
import type { CowLimitChainId } from 'src/lib/swap/cow/chains'
import {
  DialogConfirm,
  DialogProvider,
  DialogReview,
} from 'src/lib/transaction-dialog'
import { Checker } from 'src/lib/wagmi/systems/checker'
import { Amount, formatUSD, shortenAddress } from 'sushi'
import { type EvmCurrency, getEvmChainById, isEvmAddressEqual } from 'sushi/evm'
import { useCurrencyPrice } from '~evm/_common/ui/price-provider/price-provider/use-currency-price'
import {
  formatCowRelativeTime,
  formatCowTimestamp,
  formatCowTokenAmount,
} from './cow-format'
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

function formatUsdValue(
  currency: EvmCurrency | undefined,
  amount: bigint | string,
  usd: number | undefined,
): string | undefined {
  if (!currency || !usd) return undefined
  return `≈ ${formatUSD(Number(new Amount(currency, amount).toString()) * usd)}`
}

function CowOrderReviewContent({
  chainId,
  review,
  action,
  marketPrice,
  onPlaced,
}: {
  chainId: CowLimitChainId
  review: CowReviewedOrder
  action: CowOrderAction
  marketPrice: CowLimitPrice | undefined
  onPlaced(): void
}): React.JSX.Element {
  const { order, owner } = review.prepared
  const { sell, buy } = useCowTokens(chainId, order.sellToken, order.buyToken)
  const { data: sellUsd } = useCurrencyPrice({ currency: sell })
  const { data: buyUsd } = useCurrencyPrice({ currency: buy })
  const steps = getStepsNote(review, action)
  const chain = getEvmChainById(chainId)

  const limitPrice = sell && buy ? getOrderPrice(order, sell, buy) : undefined
  // The form's market price, if it is still for this order's pair.
  const market =
    marketPrice &&
    sell &&
    buy &&
    isEvmAddressEqual(marketPrice.base.wrap().address, sell.address) &&
    isEvmAddressEqual(marketPrice.quote.wrap().address, buy.wrap().address)
      ? marketPrice
      : undefined
  const difference =
    limitPrice && market ? getPriceDifference(limitPrice, market) : undefined
  const minReceivedUsd = formatUsdValue(buy, order.buyAmount, buyUsd)
  const previousPrice =
    review.previous && sell && buy
      ? getOrderPrice(review.previous, sell, buy)
      : undefined

  return (
    <DialogContent className="max-h-[80vh]">
      <DialogHeader className="!text-left">
        <DialogTitle>
          Buy at least {buy ? formatCowTokenAmount(buy, order.buyAmount) : '…'}
        </DialogTitle>
        <DialogDescription>
          {review.previous ? 'Replace order selling' : 'Sell'}{' '}
          {sell ? formatCowTokenAmount(sell, order.sellAmount) : '…'}
          {formatUsdValue(sell, order.sellAmount, sellUsd)
            ? ` (${formatUsdValue(sell, order.sellAmount, sellUsd)})`
            : ''}
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-4 overflow-y-auto">
        <List className="!pt-0">
          <List.Control>
            <List.KeyValue title="Network">{chain.name}</List.KeyValue>
            <List.KeyValue title="Limit price">
              {limitPrice && sell && buy ? (
                `1 ${sell.symbol} = ${limitPrice.toSignificant(6)} ${buy.symbol}`
              ) : (
                <SkeletonText align="right" fontSize="sm" />
              )}
            </List.KeyValue>
            {previousPrice && sell && buy && (
              <List.KeyValue title="Previous price">
                {`1 ${sell.symbol} = ${previousPrice.toSignificant(6)} ${buy.symbol}`}
              </List.KeyValue>
            )}
            {difference && (
              <List.KeyValue title="Vs. market">
                <span className={difference.lt(0) ? 'text-red' : 'text-green'}>
                  {formatPriceDifference(difference)}
                </span>
              </List.KeyValue>
            )}
            <List.KeyValue title="Min. received">
              {buy ? (
                formatCowTokenAmount(buy, order.buyAmount)
              ) : (
                <SkeletonText align="right" fontSize="sm" />
              )}
            </List.KeyValue>
            {minReceivedUsd && (
              <List.KeyValue title="Min. value">{minReceivedUsd}</List.KeyValue>
            )}
            <List.KeyValue title="Partial fills">Allowed</List.KeyValue>
            <List.KeyValue title="Expires">
              <span title={formatCowTimestamp(order.validTo)}>
                {formatCowRelativeTime(order.validTo)}
              </span>
            </List.KeyValue>
          </List.Control>
        </List>
        <List className="!pt-0">
          <List.Control>
            <List.KeyValue title="Recipient">
              <Button variant="link" size="sm" asChild>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={chain.getAccountUrl(owner)}
                >
                  {shortenAddress(owner)}
                </a>
              </Button>
            </List.KeyValue>
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
      </div>
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
  marketPrice,
  onPlaced,
  children,
}: {
  chainId: CowLimitChainId
  action: CowOrderAction
  marketPrice: CowLimitPrice | undefined
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
                marketPrice={marketPrice}
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
