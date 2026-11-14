'use client'

import { Button, Message } from '@sushiswap/ui'
import type { CowLimitChainId } from 'src/lib/swap/cow/chains'
import { CurrencyInput } from 'src/lib/wagmi/components/web3-input/currency'
import { formatUnits } from 'viem'
import { useDerivedStateSimpleSwap } from '../../swap/_ui/derivedstate-simple-swap-provider'
import { CowEditOptions } from './cow-edit-options'
import { CowExpirySelect } from './cow-expiry-select'
import { CowLimitPriceField } from './cow-limit-price-field'
import type { CowLimitDraft } from './use-cow-limit-draft'
import type { CowLimitPricing } from './use-cow-limit-price'

export function CowLimitInputs({
  chainId,
  pricing,
  draft,
}: {
  chainId: CowLimitChainId
  pricing: CowLimitPricing
  draft: CowLimitDraft
}): React.JSX.Element {
  const {
    state: { token0, token1, swapAmountString },
    mutate: { setToken0, setToken1, setSwapAmount, switchTokens },
  } = useDerivedStateSimpleSwap<CowLimitChainId>()

  const { buyAmount, resetPrice } = pricing
  const { editing, expiry, setExpiry } = draft

  return (
    <>
      <CurrencyInput
        id="cow-sell"
        type="INPUT"
        value={swapAmountString}
        onChange={setSwapAmount}
        currency={token0}
        chainId={chainId}
        onSelect={
          editing
            ? undefined
            : (currency) => {
                setToken0(currency)
                resetPrice()
              }
        }
        label={editing ? 'Remaining sell amount' : 'Sell'}
      />
      {!editing && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            switchTokens()
            resetPrice()
          }}
        >
          Switch tokens
        </Button>
      )}
      <CurrencyInput
        id="cow-buy"
        type="OUTPUT"
        value={
          buyAmount && token1 ? formatUnits(buyAmount, token1.decimals) : ''
        }
        currency={token1}
        chainId={chainId}
        onSelect={
          editing
            ? undefined
            : (currency) => {
                setToken1(currency)
                resetPrice()
              }
        }
        disabled
        disableMaxButton
        label="Minimum receive"
      />
      {token0?.isNative && (
        <Message variant="muted" size="sm">
          Approve {token0.wrap().symbol} for CoW, then any {token0.symbol} not
          covered by your {token0.wrap().symbol} balance is wrapped before you
          sign your limit order. Approval and wrapping cost network gas.
        </Message>
      )}
      <CowLimitPriceField pricing={pricing} />
      <CowExpirySelect value={expiry} onChange={setExpiry} editing={editing} />
      {editing && (
        <CowEditOptions editing={editing} onStopEditing={draft.stopEditing} />
      )}
    </>
  )
}
