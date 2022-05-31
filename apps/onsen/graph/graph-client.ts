import { ChainId } from '@sushiswap/chain'

import { getBuiltGraphSDK } from '../.graphclient'
import { TokenRepresentation } from '../features/onsen/context/representations'

const SUPPORTED_CHAINS = [ChainId.KOVAN]

const isNetworkSupported = (chainId: number) => SUPPORTED_CHAINS.includes(chainId)

// export const getFarm = async (chainId: string, id: string): Promise<FarmRepresentation | undefined> => {
//   const network = Number(chainId)
//   if (!isNetworkSupported(network)) return undefined
//   const sdk = getBuiltGraphSDK()
//   if (network === ChainId.KOVAN) {
//     return (await sdk.KovanOnsenFarm({ id })).KOVAN_ONSEN_incentive as FarmRepresentation
//   }
// }

export const getFarms = async (chainId: string): Promise<TokenRepresentation[] | undefined> => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return undefined
  const sdk = getBuiltGraphSDK()
  const now = (new Date().getTime() / 1000).toFixed()
  if (network === ChainId.KOVAN) {
    return (
      await sdk.KovanStakingStakedTokens({where: {endTime_gte: now}})
    ).KOVAN_STAKING_tokens as TokenRepresentation[]
  }
}

// export const getFarmToken = async (chainId: string, id: string, type: FarmType): Promise<TridentPoolRepresentation | undefined> => {
//   const network = Number(chainId)
//   if (!isNetworkSupported(network)) return undefined
//   const sdk = getBuiltGraphSDK()
//   if (network === ChainId.KOVAN) {
//     if (type === FarmType.TRIDENT) return (await sdk.KovanTridentPool({ id })).KOVAN_TRIDENT_pool as TridentPoolRepresentation
//     // if (type === FarmType.LEGACY) return (await sdk.KovanTridentPool({ id })).KOVAN_TRIDENT_pool as TridentPoolRepresentation
//     else return undefined
//   }
// }

// export const getTridentPool = async (chainId: string, id: string) => {
//   const network = Number(chainId)
//   if (!isNetworkSupported(network)) return {}
//   const sdk = await getBuiltGraphSDK()
//   if (network === ChainId.KOVAN) {
//     return (await sdk.KovanTridentPool({ id })).KOVAN_TRIDENT_pool ?? {}
//   }
// }
