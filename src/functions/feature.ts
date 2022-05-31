import { ChainId } from '@sushiswap/core-sdk'
import features from 'app/config/features'
import { Feature } from 'app/enums'

export function featureEnabled(feature: Feature, chainId: ChainId = ChainId.ETHEREUM): boolean {
  // @ts-ignore TYPE NEEDS FIXING
  return chainId && chainId in features && features[chainId].includes(feature)
}

export function chainsWithFeature(feature: Feature): ChainId[] {
  return (
    Object.keys(features)
      // @ts-ignore TYPE NEEDS FIXING
      .filter((chainKey) => featureEnabled(feature, ChainId[chainKey]))
      // @ts-ignore TYPE NEEDS FIXING
      .map((chain) => ChainId[chain])
  )
}
