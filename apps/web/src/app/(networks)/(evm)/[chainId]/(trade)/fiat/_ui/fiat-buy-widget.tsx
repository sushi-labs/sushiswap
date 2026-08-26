import { FiatAmountInput } from './fiat-amount-input'
import { FiatQuickAmountSelect } from './fiat-quick-amount-select'

export function FiatBuyWidget() {
  return (
    <>
      <div className="space-y-2">
        <FiatAmountInput />
        <FiatQuickAmountSelect />
      </div>

      <div className="flex flex-col">
        <div>token selector</div>
        <div>todo trade button to open review modal</div>
        <div className="mt-2">
          <div>todo buy stats</div>
        </div>
      </div>
    </>
  )
}
