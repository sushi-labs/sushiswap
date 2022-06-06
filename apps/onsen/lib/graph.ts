import { ChainId } from '@sushiswap/chain'
import type { Farm as FarmDTO } from '@sushiswap/graph-client'
import { getBuiltGraphSDK } from '@sushiswap/graph-client'

const SUPPORTED_CHAINS = [ChainId.KOVAN, ChainId.ARBITRUM]

const isNetworkSupported = (chainId: number) => SUPPORTED_CHAINS.includes(chainId)

export const getFarms = async (chainId: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return undefined
  const sdk = getBuiltGraphSDK()
  const now = (new Date().getTime() / 1000).toFixed()
  if (network === ChainId.KOVAN) {
    return (await sdk.KovanStakingFarms({ where: { endTime_gte: now } })).KOVAN_STAKING_farms as FarmDTO[]
  } else if (network === ChainId.ARBITRUM) {
    return (await sdk.ArbitrumStakingFarms({ where: { endTime_gte: now } })).ARBITRUM_STAKING_farms as FarmDTO[]
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
  } else if (network === ChainId.ARBITRUM) {
    const subscribedIncentiveIds = (
      await sdk.ArbitrumStakingSubscriptions({ id: address.toLowerCase() })
    ).ARBITRUM_STAKING_user?.subscriptions?.map((sub) => sub.incentive.id)
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
  } else if (network === ChainId.ARBITRUM) {
    const subscribedIncentiveIds = (
      await sdk.ArbitrumStakingUserSubscriptions({ id: address.toLowerCase() })
    ).ARBITRUM_STAKING_user?.subscriptions?.map((sub) => sub.incentive.farm.id)
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
  } else if (network === ChainId.ARBITRUM) {
    const subscribedFarmIds = await getSubscribedFarms(chainId, address)
    if (!subscribedFarmIds) return {}
    return (await sdk.ArbitrumStakingUserFarms({ farmIds: subscribedFarmIds })).ARBITRUM_STAKING_farms
  }
}
