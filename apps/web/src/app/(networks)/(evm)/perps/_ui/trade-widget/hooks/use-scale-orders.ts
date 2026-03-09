import { useQuery } from '@tanstack/react-query'
import { buildScaleOrders } from 'src/lib/perps'
import { useAssetState } from '../asset-state-provider'

export const useScaleOrders = () => {
  const {
    state: { size, scaleStartEnd, totalOrders, sizeSkew, asset, tradeType },
  } = useAssetState()

  return useQuery({
    queryKey: [
      'scale-order',
      size,
      scaleStartEnd,
      totalOrders,
      sizeSkew,
      asset?.decimals,
      asset?.marketType,
    ],
    queryFn: () => {
      if (
        !size.base ||
        !scaleStartEnd.start ||
        !scaleStartEnd.end ||
        !totalOrders ||
        !sizeSkew ||
        !asset
      ) {
        return null
      }
      return buildScaleOrders({
        totalSize: size.base,
        startPrice: scaleStartEnd.start,
        endPrice: scaleStartEnd.end,
        numberOfOrders: totalOrders,
        sizeSkew: sizeSkew,
        decimals: asset.decimals,
        marketType: asset.marketType,
      })
    },

    enabled: Boolean(
      size.base &&
        scaleStartEnd.start &&
        scaleStartEnd.end &&
        totalOrders &&
        sizeSkew &&
        asset?.decimals &&
        asset?.marketType &&
        tradeType === 'scale',
    ),
  })
}
