import { Type as Currency } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'
import { useMemo } from 'react'
import { useContractReads } from 'wagmi'

import { getBentoBoxContractConfig } from './useBentoBoxContract'

type UseBentoBoxTotals = (
  chainId: number,
  tokens: (Currency | undefined)[]
) => Record<string, { base: JSBI; elastic: JSBI }> | undefined

export const useBentoBoxTotals: UseBentoBoxTotals = (chainId, tokens) => {
  const addresses = useMemo(() => tokens.map((token) => [token?.wrapped.address]), [tokens])
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
    cacheTime: 20_000,
    keepPreviousData: true,
  })

  return useMemo(() => {
    return totals?.reduce((previousValue, currentValue) => {
      const { base, elastic } = currentValue
      const rebase = { base: JSBI.BigInt(base), elastic: JSBI.BigInt(elastic) }
      return { ...previousValue, [currentValue.address]: rebase }
    })
  }, [totals])
}

export const useBentoBoxTotal = (
  chainId: number,
  token: Currency | undefined
): { base: JSBI; elastic: JSBI } | undefined => {
  const totals = useBentoBoxTotals(
    chainId,
    useMemo(() => [token], [token])
  )
  return useMemo(() => {
    if (!totals || !token || !(token.wrapped.address in totals)) {
      return undefined
    }
    return totals[token.wrapped.address]
  }, [token, totals])
}
