import { Type as Currency } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'
import { useMemo } from 'react'
import { useContractReads } from 'wagmi'

import { getBentoBoxContractConfig } from './useBentoBoxContract'

type UseBentoBoxTotals = (
  chainId: number,
  currencies: (Currency | undefined)[]
) => Record<string, { base: JSBI; elastic: JSBI }> | undefined

export const useBentoBoxTotals: UseBentoBoxTotals = (chainId, currencies) => {
  const addresses = useMemo(
    () =>
      currencies
        .filter((currency): currency is Currency => Boolean(currency && currency.wrapped))
        .map((token) => token.wrapped.address),
    [currencies]
  )
  const contracts = useMemo(
    () =>
      addresses.map((address) => ({
        chainId,
        ...getBentoBoxContractConfig(chainId),
        functionName: 'totals',
        args: [address],
      })),
    [addresses, chainId]
  )

  const { data: totals } = useContractReads({
    contracts,
  })
  return useMemo(() => {
    return totals?.reduce<Record<string, { base: JSBI; elastic: JSBI }>>((previousValue, currentValue, i) => {
      if (!currentValue) return previousValue
      const { base, elastic } = currentValue
      const rebase = { base: JSBI.BigInt(base), elastic: JSBI.BigInt(elastic) }
      previousValue[addresses[i]] = rebase
      return previousValue
    }, {})
  }, [totals, addresses])
}

export const useBentoBoxTotal = (
  chainId: number,
  currency: Currency | undefined
): { base: JSBI; elastic: JSBI } | undefined => {
  const totals = useBentoBoxTotals(
    chainId,
    useMemo(() => [currency], [currency])
  )
  return useMemo(() => {
    if (!totals || !currency) {
      return undefined
    }
    return totals[currency.wrapped.address]
  }, [currency, totals])
}
