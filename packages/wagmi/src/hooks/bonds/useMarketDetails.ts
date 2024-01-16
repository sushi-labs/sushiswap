import {
  REFERRER_ADDRESS,
  getBondDiscount,
  getMarketInfosContracts,
  getMarketPricesContracts,
  getMaxAmountsAcceptedContracts,
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
    const maxAmountAccepted = getMaxAmountsAcceptedContracts({
      marketIds: [bond.id],
      referrer: REFERRER_ADDRESS[bond.chainId],
    })[0]

    return [
      marketPrice,
      remainingCapacity,
      marketInfo,
      maxAmountAccepted,
    ] as const
  }, [bond.id, bond.chainId])

  const { data } = useContractReads({
    allowFailure: false,
    contracts,
    enabled: Boolean(enabled),
    watch: Boolean(enabled),
  })

  const [marketPrice, remainingCapacityBI, marketInfo, maxAmountAcceptedBI] =
    useMemo(() => data || [], [data])

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

  const [availableCapacity, availableCapacityUSD] = useMemo(() => {
    if (!marketInfo) return []

    const amount = Amount.fromRawAmount(
      new Token(bond.payoutToken),
      marketInfo[5],
    )

    if (!payoutTokenPriceUSD) return [amount]

    const amountUSD = Number(amount.toSignificant(18)) * payoutTokenPriceUSD

    return [amount, amountUSD]
  }, [bond, marketInfo, payoutTokenPriceUSD])

  const [remainingCapacity, remainingCapacityUSD] = useMemo(() => {
    if (!remainingCapacityBI) return []

    const amount = Amount.fromRawAmount(
      new Token(bond.capacityInQuote ? bond.quoteToken : bond.payoutToken),
      remainingCapacityBI,
    )

    if (!quoteTokenPriceUSD || !payoutTokenPriceUSD) return [amount]

    const amountUSD =
      Number(amount.toSignificant(18)) *
      (bond.capacityInQuote ? quoteTokenPriceUSD : payoutTokenPriceUSD)

    return [amount, amountUSD]
  }, [bond, remainingCapacityBI, quoteTokenPriceUSD, payoutTokenPriceUSD])

  const maxAmountAccepted = useMemo(() => {
    if (!maxAmountAcceptedBI) return undefined

    // Let's ask the bond guys about this - wouldn't match up with the maxPayout
    // https://dev.bondprotocol.finance/developers/market-calculations#capacity-payout-and-allowances
    const mAAreduced = maxAmountAcceptedBI // - (maxAmountAcceptedBI / 1000n) * 5n

    return Amount.fromRawAmount(new Token(bond.quoteToken), mAAreduced)
  }, [bond, maxAmountAcceptedBI])

  return {
    ...discount,
    quoteTokenPriceUSD,
    payoutTokenPriceUSD,
    marketPrice,
    maxAmountAccepted,
    availableCapacity,
    availableCapacityUSD,
    remainingCapacity,
    remainingCapacityUSD,
  }
}
