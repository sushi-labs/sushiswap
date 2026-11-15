'use client'

import { SwitchTokensButton } from 'src/lib/components/switch-tokens-button'
import type { CowLimitChainId } from 'src/lib/swap/cow/chains'
import { CurrencyInput } from 'src/lib/wagmi/components/web3-input/currency'
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

  const { buyAmountString, setBuyAmount } = pricing
  const { editing, expiry, setExpiry } = draft

  return (
    <>
      <CurrencyInput
        id="cow-sell"
        type="INPUT"
        className="border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl"
        value={swapAmountString}
        onChange={setSwapAmount}
        currency={token0}
        chainId={chainId}
        onSelect={editing ? undefined : setToken0}
        label={editing ? 'Remaining sell amount' : 'Sell'}
      />
      {!editing && <SwitchTokensButton onClick={switchTokens} />}
      <CurrencyInput
        id="cow-buy"
        type="OUTPUT"
        className="border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl"
        value={buyAmountString}
        onChange={setBuyAmount}
        currency={token1}
        chainId={chainId}
        onSelect={editing ? undefined : setToken1}
        disableMaxButton
        label="Minimum receive"
      />
      <CowLimitPriceField pricing={pricing} />
      <CowExpirySelect value={expiry} onChange={setExpiry} editing={editing} />
      {editing && (
        <CowEditOptions editing={editing} onStopEditing={draft.stopEditing} />
      )}
    </>
  )
}
