import { useContractReads } from 'wagmi'
import { MarketId, getMarketPricesContracts } from '../../../../bonds-sdk'

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
