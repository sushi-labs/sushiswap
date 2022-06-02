import { ChainId } from '@sushiswap/chain'

import type { KOVAN_STAKING_Farm as FarmDTO } from '../.graphclient'
import { getBuiltGraphSDK } from '../.graphclient'

const SUPPORTED_CHAINS = [ChainId.KOVAN]

const isNetworkSupported = (chainId: number) => SUPPORTED_CHAINS.includes(chainId)

export const getFarms = async (chainId: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return undefined
  const sdk = getBuiltGraphSDK()
  const now = (new Date().getTime() / 1000).toFixed()
  if (network === ChainId.KOVAN) {
    return (await sdk.KovanStakingFarms({ where: { endTime_gte: now } })).KOVAN_STAKING_farms as FarmDTO[]
  }
}

export const getSubscribedIncentives = async (chainId: string, address: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return undefined
  const sdk = getBuiltGraphSDK()
  if (network === ChainId.KOVAN) {
    const subscribedIncentiveIds = (
      await sdk.KovanStakingUserSubscriptions({ id: address.toLowerCase() })
    ).KOVAN_STAKING_user?.subscriptions?.map((sub) => sub.incentive.id)
    return Array.from(new Set(subscribedIncentiveIds))
  }
}

export const getSubscribedFarms = async (chainId: string, address: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return undefined
  const sdk = getBuiltGraphSDK()
  if (network === ChainId.KOVAN) {
    const subscribedIncentiveIds = (
      await sdk.KovanStakingUserSubscriptions({ id: address.toLowerCase() })
    ).KOVAN_STAKING_user?.subscriptions?.map((sub) => sub.incentive.farm.id)
    return Array.from(new Set(subscribedIncentiveIds))
  }
}

export const getUserFarms = async (chainId: string, address: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return undefined
  const sdk = getBuiltGraphSDK()
  if (network === ChainId.KOVAN) {
    const subscribedFarmIds = await getSubscribedFarms(chainId, address)
    if (!subscribedFarmIds) return {}
    return (await sdk.KovanStakingUserFarms({ farmIds: subscribedFarmIds })).KOVAN_STAKING_farms
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
