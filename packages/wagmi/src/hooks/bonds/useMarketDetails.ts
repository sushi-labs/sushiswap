import {
  getBondDiscount,
  getMarketInfosContracts,
  getMarketPricesContracts,
  getRemainingCapacitiesContracts,
} from '@sushiswap/bonds-sdk'
import { Bond } from '@sushiswap/client'
import { usePrices } from '@sushiswap/react-query'
import { useMemo } from 'react'
import { Amount, Token } from 'sushi/currency'
import { getAddress } from 'viem'
import { useContractReads } from 'wagmi'

interface UseBondMarketDetails {
  bond: Bond
  enabled?: boolean
}

export const useBondMarketDetails = ({
  bond,
  enabled = true,
}: UseBondMarketDetails) => {
  const { data: prices } = usePrices({
    chainId: enabled ? bond.chainId : undefined,
  })

  const contracts = useMemo(() => {
    const marketPrice = getMarketPricesContracts({ marketIds: [bond.id] })[0]
    const remainingCapacity = getRemainingCapacitiesContracts({
      marketIds: [bond.id],
    })[0]
    const marketInfo = getMarketInfosContracts({ marketIds: [bond.id] })[0]

    return [marketPrice, remainingCapacity, marketInfo] as const
  }, [bond.id])

  const { data } = useContractReads({
    allowFailure: false,
    contracts,
    enabled: Boolean(enabled),
    watch: Boolean(enabled),
  })

  const [marketPrice, remainingCapacityBI, marketInfo] = useMemo(
    () => data || [],
    [data],
  )

  const [quoteTokenPriceUSD, payoutTokenPriceUSD] = useMemo(() => {
    if (!prices) return []

    return [
      Number((prices[getAddress(bond.quoteToken.address)] || 0).toFixed(10)),
      Number((prices[getAddress(bond.payoutToken.address)] || 0).toFixed(10)),
    ]
  }, [prices, bond])

  const discount = useMemo(() => {
    if (!marketPrice || !quoteTokenPriceUSD || !payoutTokenPriceUSD)
      return undefined

    return getBondDiscount({
      marketPrice: marketPrice,
      marketScale: BigInt(bond.marketScale),
      payoutToken: {
        decimals: bond.payoutToken.decimals,
        priceUSD: payoutTokenPriceUSD,
      },
      quoteToken: {
        decimals: bond.quoteToken.decimals,
        priceUSD: quoteTokenPriceUSD,
      },
    })
  }, [quoteTokenPriceUSD, payoutTokenPriceUSD, marketPrice, bond])

  const currentCapacity = useMemo(() => {
    if (!marketInfo) return undefined

    return Amount.fromRawAmount(new Token(bond.payoutToken), marketInfo[5])
  }, [bond, marketInfo])

  const remainingCapacity = useMemo(() => {
    if (!remainingCapacityBI) return undefined

    return Amount.fromRawAmount(
      new Token(bond.capacityInQuote ? bond.quoteToken : bond.payoutToken),
      remainingCapacityBI,
    )
  }, [bond, remainingCapacityBI])

  return {
    ...discount,
    quoteTokenPriceUSD,
    payoutTokenPriceUSD,
    currentCapacity,
    remainingCapacity,
  }
}
