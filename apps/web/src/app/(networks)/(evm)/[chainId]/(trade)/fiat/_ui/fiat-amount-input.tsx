'use client'
import { FiatInput } from 'src/lib/crossmint'
import { useDerivedStateFiatBuy } from './derivedstate-fiat-buy-provider'

export const FiatAmountInput = () => {
  const {
    mutate: { setFiatAmount, setPaymentCurrency },
    state: { fiatAmountString, paymentCurrency },
  } = useDerivedStateFiatBuy()

  return (
    <FiatInput
      value={fiatAmountString}
      onChange={setFiatAmount}
      currency={paymentCurrency}
      onCurrencyChange={setPaymentCurrency}
      label="You pay"
    />
  )
}
