'use client'

import { BENTOBOX_ADDRESS, BentoBoxChainId } from '@sushiswap/bentobox-sdk'
import { Type as Currency } from '@sushiswap/currency'
import { useMemo } from 'react'
import { Address, useContractReads } from 'wagmi'

type UseBentoBoxTotals = (
  chainId: BentoBoxChainId | undefined,
  currencies: (Currency | undefined)[],
  config?: Parameters<typeof useContractReads>[0]
) => Record<string, { base: bigint; elastic: bigint }> | undefined

export const useBentoBoxTotals: UseBentoBoxTotals = (chainId, currencies, config) => {
  const addresses = useMemo(
    () =>
      currencies
        .filter((currency): currency is Currency => Boolean(currency?.wrapped))
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
                address: BENTOBOX_ADDRESS[chainId],
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
    watch: !(typeof config?.enabled !== 'undefined' && !config?.enabled),
    keepPreviousData: true,
    enabled: !!chainId,
    select: (results) => results.map((r) => r.result),
  })

  return useMemo(() => {
    return totals?.reduce<Record<string, { base: bigint; elastic: bigint }>>((previousValue, currentValue, i) => {
      if (!currentValue) return previousValue
      const [elastic, base] = currentValue
      previousValue[addresses[i]] = { elastic, base }
      return previousValue
    }, {})
  }, [totals, addresses])
}

export const useBentoBoxTotal = (
  chainId: BentoBoxChainId | undefined,
  currency: Currency | undefined,
  config?: Parameters<typeof useContractReads>[0]
): { base: bigint; elastic: bigint } | undefined => {
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
