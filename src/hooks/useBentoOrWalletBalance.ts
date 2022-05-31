import { Currency, CurrencyAmount, Token } from '@sushiswap/core-sdk'
import { useBentoBalancesV2 } from 'app/state/bentobox/hooks'
import { useCurrencyBalances } from 'app/state/wallet/hooks'
import { useMemo } from 'react'

export const useBentoOrWalletBalances = (
  account: string | undefined,
  currencies: (Currency | Token | undefined)[],
  fromWallet?: (boolean | undefined)[]
) => {
  const tokenAddresses = useMemo(
    // @ts-ignore TYPE NEEDS FIXING
    () => (currencies.every((el) => el) ? currencies.map((el: Currency) => el.wrapped.address) : undefined),
    [currencies]
  )

  const balance = useCurrencyBalances(account, currencies)
  const { data: bentoBalance } = useBentoBalancesV2(tokenAddresses)

  return useMemo(() => {
    if (!currencies.every((el) => !!el) || !bentoBalance) {
      return []
    }

    return currencies.map((cur, index) => {
      if (!cur) {
        return undefined
      }

      let element: CurrencyAmount<Currency> | undefined
      const tokenBalanceFromWallet = fromWallet?.[index]
      if (tokenBalanceFromWallet === false) {
        element = bentoBalance.find((el) => el?.currency.wrapped.address === cur.wrapped.address)
      } else {
        element = balance.find((el) => el?.currency.wrapped.address === cur.wrapped.address)
      }

      if (!element) {
        element = CurrencyAmount.fromRawAmount(cur.wrapped, '0')
      }

      return element
    }, [])
  }, [currencies, bentoBalance, fromWallet, balance])
}

export const useBentoOrWalletBalance = (account?: string, currency?: Currency, fromWallet?: boolean) => {
  const currencies = useMemo(() => [currency], [currency])
  const flags = useMemo(() => [fromWallet], [fromWallet])
  const balances = useBentoOrWalletBalances(account, currencies, flags)
  return useMemo(() => (balances ? balances[0] : undefined), [balances])
}
