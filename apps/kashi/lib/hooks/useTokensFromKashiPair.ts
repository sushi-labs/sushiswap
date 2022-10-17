import { Native, Token } from '@sushiswap/currency'
import { KashiMediumRiskLendingPairV1 } from 'lib/KashiPair'
import { useMemo } from 'react'

export const useTokensFromKashiPair = (pair: KashiMediumRiskLendingPairV1) => {
  // console.log('useTokensFromKashiPair', pair)
  return useMemo(
    () => ({
      asset:
        Native.onChain(pair.chainId).wrapped.address.toLowerCase() === pair.asset.address.toLowerCase()
          ? Native.onChain(pair.chainId)
          : new Token({
              ...pair.asset,
              address: pair.asset.address,
              name: pair.asset.name,
              decimals: Number(pair.asset.decimals),
              symbol: pair.asset.symbol,
              chainId: pair.chainId,
            }),
      collateral:
        Native.onChain(pair.chainId).wrapped.address.toLowerCase() === pair.collateral.address.toLowerCase()
          ? Native.onChain(pair.chainId)
          : new Token({
              ...pair.collateral,
              address: pair.collateral.address,
              name: pair.collateral.name,
              decimals: Number(pair.collateral.decimals),
              symbol: pair.collateral.symbol,
              chainId: pair.chainId,
            }),
    }),
    [pair.chainId, pair.asset, pair.collateral]
  )
}
