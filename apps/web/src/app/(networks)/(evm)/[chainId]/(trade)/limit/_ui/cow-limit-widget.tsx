'use client'

import { Message } from '@sushiswap/ui'
import type { CowLimitChainId } from 'src/lib/swap/cow/chains'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import type { EvmAddress } from 'sushi/evm'
import { useDerivedStateSimpleSwap } from '../../swap/_ui/derivedstate-simple-swap-provider'
import { SimpleSwapTokenNotFoundDialog } from '../../swap/_ui/simple-swap-token-not-found-dialog'
import { SimpleSwapWidgetFrame } from '../../swap/_ui/simple-swap-widget-frame'
import { CowLimitInputs } from './cow-limit-inputs'
import { CowLimitReviewButton } from './cow-limit-review-button'
import { CowOrderReviewDialog } from './cow-order-review'
import { CowOrders } from './cow-orders'
import { useCowLimitDraft } from './use-cow-limit-draft'
import { useCowLimitPrice } from './use-cow-limit-price'
import { useCowOrderAction } from './use-cow-order-action'

export function CowLimitWidget(): React.JSX.Element {
  const owner = useAccount('evm')
  const {
    state: { chainId },
  } = useDerivedStateSimpleSwap<CowLimitChainId>()
  return (
    <SimpleSwapWidgetFrame chainId={chainId} mode="limit">
      <CowLimitForm
        key={`${chainId}:${owner}`}
        chainId={chainId}
        owner={owner}
      />
    </SimpleSwapWidgetFrame>
  )
}

function CowLimitForm({
  chainId,
  owner,
}: { chainId: CowLimitChainId; owner?: EvmAddress }): React.JSX.Element {
  const {
    state: { token0, swapAmountString },
  } = useDerivedStateSimpleSwap<CowLimitChainId>()

  const action = useCowOrderAction(chainId, owner)
  const pricing = useCowLimitPrice(chainId, owner, action.busy)
  const draft = useCowLimitDraft({ chainId, owner, action, pricing })

  const { sellAmount, buyAmount, inputError, quote, debouncedAmount } = pricing

  return (
    <>
      <CowLimitInputs chainId={chainId} pricing={pricing} draft={draft} />
      {inputError && (
        <Message variant="destructive" size="sm" role="alert">
          {inputError}
        </Message>
      )}
      {draft.error && (
        <Message variant="destructive" size="sm" role="alert">
          {draft.error}
        </Message>
      )}
      <CowOrderReviewDialog
        chainId={chainId}
        action={action}
        onPlaced={draft.discard}
      >
        <CowLimitReviewButton
          chainId={chainId}
          owner={owner}
          sell={token0}
          sellAmount={sellAmount}
          replacedUid={draft.editing?.uid}
          loading={draft.reviewing}
          disabled={
            draft.reviewing ||
            action.busy ||
            !sellAmount ||
            !buyAmount ||
            Boolean(inputError) ||
            quote.isError ||
            !quote.data ||
            quote.isFetching ||
            debouncedAmount !== swapAmountString
          }
          onReview={draft.review}
        />
      </CowOrderReviewDialog>
      <SimpleSwapTokenNotFoundDialog />
      <CowOrders
        chainId={chainId}
        owner={owner}
        onEdit={(order) => void draft.edit(order)}
        disabled={action.busy || draft.reviewing}
      />
    </>
  )
}
