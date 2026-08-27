import { FiatAmountInput } from './fiat-amount-input'
import { FiatBuyButton } from './fiat-buy-button'
import { FiatQuickAmountSelect } from './fiat-quick-amount-select'
import { FiatTokenSelector } from './fiat-token-selector'

export function FiatBuyWidget() {
  return (
    <>
      <div className="space-y-2">
        <FiatAmountInput />
        <FiatQuickAmountSelect />
        <FiatTokenSelector />
      </div>

      <div className="flex flex-col">
        <FiatBuyButton />
      </div>
    </>
  )
}
