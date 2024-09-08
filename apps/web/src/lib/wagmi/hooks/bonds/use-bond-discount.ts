import {
  MarketId,
  getBondDiscount,
  getChainIdAuctioneerMarketFromMarketId,
} from '@sushiswap/bonds-sdk'
import { useMemo } from 'react'
import { usePrices } from 'src/app/(evm)/_common/ui/price-provider/price-provider/use-prices'
import { Address } from 'viem'
import { useBondMarketPrices } from './use-bond-market-price'

interface UseBondsDiscount {
  marketId: MarketId
  marketScale: bigint
  quoteToken: {
    address: Address
    decimals: number
  }
  payoutToken: {
    address: Address
    decimals: number
  }
  enabled?: boolean
}

export const useBondDiscount = ({
  marketId,
  marketScale,
  payoutToken,
  quoteToken,
  enabled = true,
}: UseBondsDiscount) => {
  const { chainId } = getChainIdAuctioneerMarketFromMarketId(marketId)

  const { data: prices, isLoading: isPricesLoading } = usePrices({
    chainId: enabled ? chainId : undefined,
  })
  const { data: marketPrice, isLoading: isMarketPriceLoading } =
    useBondMarketPrices({
      marketIds: [marketId],
      enabled,
    })

  const discount = useMemo(() => {
    if (!marketPrice || !prices) return undefined

    const quoteTokenPriceUSD = prices.get(quoteToken.address)
    const payoutTokenPriceUSD = prices.get(payoutToken.address)

    return getBondDiscount({
      marketPrice: marketPrice[0],
      marketScale: marketScale,
      payoutToken: {
        decimals: payoutToken.decimals,
        priceUSD: +(payoutTokenPriceUSD?.toFixed(10) || 0),
      },
      quoteToken: {
        decimals: quoteToken.decimals,
        priceUSD: +(quoteTokenPriceUSD?.toFixed(10) || 0),
      },
    })
  }, [prices, marketPrice, marketScale, payoutToken, quoteToken])

  return {
    ...discount,
    isLoading: isPricesLoading || isMarketPriceLoading,
  }
}
