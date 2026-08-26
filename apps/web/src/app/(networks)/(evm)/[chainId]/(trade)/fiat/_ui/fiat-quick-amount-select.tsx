'use client'

import { QuickFiatAmountSelect } from 'src/lib/crossmint'
import { useDerivedStateFiatBuy } from './derivedstate-fiat-buy-provider'

export function FiatQuickAmountSelect() {
  const {
    mutate: { setFiatAmount },
    state: { paymentCurrency },
  } = useDerivedStateFiatBuy()

  return (
    <QuickFiatAmountSelect
      currency={paymentCurrency}
      onChange={setFiatAmount}
    />
  )
}
