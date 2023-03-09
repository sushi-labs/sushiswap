import { Type as Currency } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'
import { useMemo } from 'react'
import { Address, useContractReads } from 'wagmi'
import { BentoBoxV1ChainId, bentoBoxV1Address } from '@sushiswap/bentobox'

type UseBentoBoxTotals = (
  chainId: BentoBoxV1ChainId | undefined,
  currencies: (Currency | undefined)[],
  config?: Parameters<typeof useContractReads>[0]
) => Record<string, { base: JSBI; elastic: JSBI }> | undefined

export const useBentoBoxTotals: UseBentoBoxTotals = (chainId, currencies, config) => {
  const addresses = useMemo(
    () =>
      currencies
        .filter((currency): currency is Currency => Boolean(currency && currency.wrapped))
        .map((token) => token.wrapped.address),
    [currencies]
  )

  const contracts = useMemo(
    () =>
      chainId
        ? addresses.map(
            (address) =>
              ({
                chainId,
                address: bentoBoxV1Address[chainId],
                abi: [
                  {
                    inputs: [
                      {
                        internalType: 'contract IERC20',
                        name: '',
                        type: 'address',
                      },
                    ],
                    name: 'totals',
                    outputs: [
                      {
                        internalType: 'uint128',
                        name: 'elastic',
                        type: 'uint128',
                      },
                      {
                        internalType: 'uint128',
                        name: 'base',
                        type: 'uint128',
                      },
                    ],
                    stateMutability: 'view',
                    type: 'function',
                  },
                ] as const,
                functionName: 'totals',
                args: [address as Address],
              } as const)
          )
        : undefined,
    [addresses, chainId]
  )

  const { data: totals } = useContractReads({
    contracts,
    watch: !(typeof config?.enabled !== undefined && !config?.enabled),
    keepPreviousData: true,
    enabled: !!chainId,
  })

  return useMemo(() => {
    return totals?.reduce<Record<string, { base: JSBI; elastic: JSBI }>>((previousValue, currentValue, i) => {
      if (!currentValue) return previousValue
      const { base, elastic } = currentValue
      const rebase = {
        base: JSBI.BigInt(base),
        elastic: JSBI.BigInt(elastic),
      }
      previousValue[addresses[i]] = rebase
      return previousValue
    }, {})
  }, [totals, addresses])
}

export const useBentoBoxTotal = (
  chainId: BentoBoxV1ChainId | undefined,
  currency: Currency | undefined,
  config?: Parameters<typeof useContractReads>[0]
): { base: JSBI; elastic: JSBI } | undefined => {
  const totals = useBentoBoxTotals(
    chainId,
    useMemo(() => [currency], [currency]),
    config
  )
  return useMemo(() => {
    if (!totals || !currency) {
      return undefined
    }
    return totals[currency.wrapped.address]
  }, [currency, totals])
}
