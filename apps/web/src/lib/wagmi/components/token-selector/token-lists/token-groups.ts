import { type Amount, Fraction, getNativeAddress } from 'sushi'
import type { PriceMap } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import type { TokenSelectorChainId } from '../config'

export function getTokenGroups<TChainId extends TokenSelectorChainId>({
  currencies,
  balancesMap,
  pricesMap,
}: {
  currencies: readonly CurrencyFor<TChainId>[]
  balancesMap: Map<string, Amount<CurrencyFor<TChainId>>> | undefined
  pricesMap: PriceMap<TChainId> | undefined
}): {
  myCurrencies: CurrencyFor<TChainId>[]
  otherCurrencies: CurrencyFor<TChainId>[]
} {
  const seen = new Set<string>()
  const owned: {
    currency: CurrencyFor<TChainId>
    amount: Fraction
    value: Fraction | undefined
  }[] = []
  const otherCurrencies: CurrencyFor<TChainId>[] = []

  for (const currency of currencies) {
    if (seen.has(currency.id)) continue
    seen.add(currency.id)

    const balance = balancesMap?.get(
      currency.type === 'native'
        ? getNativeAddress(currency.chainId)
        : currency.address,
    )
    if (!balance || balance.amount <= 0n) {
      otherCurrencies.push(currency)
      continue
    }

    const amount = new Fraction({
      numerator: balance.amount,
      denominator: 10n ** BigInt(balance.currency.decimals),
    })
    const price = pricesMap?.getFraction(
      currency.wrap().address as ContractAddressFor<TChainId>,
    )
    owned.push({ currency, amount, value: price && amount.mul(price) })
  }

  owned.sort((a, b) => {
    // Keep priced holdings ahead of unpriced holdings so comparisons never
    // mix fiat values with token amounts.
    if (a.value && !b.value) return -1
    if (!a.value && b.value) return 1

    const aValue = a.value ?? a.amount
    const bValue = b.value ?? b.amount
    return aValue.gt(bValue) ? -1 : aValue.lt(bValue) ? 1 : 0
  })

  return {
    myCurrencies: owned.map(({ currency }) => currency),
    otherCurrencies,
  }
}
