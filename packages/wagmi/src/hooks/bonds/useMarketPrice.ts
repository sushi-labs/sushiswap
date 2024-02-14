import { MarketId, getMarketPricesContracts } from '@sushiswap/bonds-sdk'
import { useContractReads } from 'wagmi'

interface UseBondMarketPrices {
  marketIds: MarketId[] | undefined
  enabled?: boolean
}

export const useBondMarketPrices = ({
  marketIds: _marketIds,
  enabled,
}: UseBondMarketPrices) => {
  const marketIds = _marketIds || []

  return useContractReads({
    allowFailure: false,
    contracts: getMarketPricesContracts({ marketIds: marketIds }),
    enabled: Boolean(marketIds && enabled),
  })
}
