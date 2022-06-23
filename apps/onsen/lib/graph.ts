import { ChainId } from '@sushiswap/chain'
import type { Farm as FarmDTO } from '@sushiswap/graph-client'
import { getBuiltGraphSDK } from '@sushiswap/graph-client'

const SUPPORTED_CHAINS = [ChainId.ARBITRUM]

const isNetworkSupported = (chainId: number) => SUPPORTED_CHAINS.includes(chainId)

export const getFarms = async (chainId: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return undefined
  const sdk = getBuiltGraphSDK()
  const now = (new Date().getTime() / 1000).toFixed()
  if (network === ChainId.ARBITRUM) {
    return (await sdk.ArbitrumStakingFarms({ where: { endTime_gte: now } })).ARBITRUM_STAKING_farms as FarmDTO[]
  }
}

export const getSubscribedIncentives = async (chainId: string, address: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return undefined
  const sdk = getBuiltGraphSDK()
  if (network === ChainId.ARBITRUM) {
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
  if (network === ChainId.ARBITRUM) {
    const subscribedIncentiveIds = (
      await sdk.ArbitrumStakingUserSubscriptions({ id: address.toLowerCase() })
    ).ARBITRUM_STAKING_user?.subscriptions?.map((sub) => sub.incentive.farm.id)
    return Array.from(new Set(subscribedIncentiveIds))
  }
}

export const getUserStakes = async (chainId: string, address: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return undefined
  const sdk = getBuiltGraphSDK()
  if (network === ChainId.ARBITRUM) {
    return (await sdk.ArbitrumStakingUserFarms({ id: address.toLocaleLowerCase() })).ARBITRUM_STAKING_user?.stakes
  }
}

export const getPrice = async (chainId: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return undefined
  const sdk = getBuiltGraphSDK()
  if (network === ChainId.ARBITRUM) {
    const response = await sdk.ArbitrumTokenPrices()
    const ethPrice = response.ARBITRUM_EXCHANGE_bundle?.ethPrice
    return response.ARBITRUM_EXCHANGE_tokens.filter((token) => token.derivedETH > 0).map((token) => {
      const id = token.id
      const usdPrice = token.derivedETH * ethPrice
      return { [id]: usdPrice }
    })
  }
}

export const getLegacyPairs = async (chainId: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return undefined
  const sdk = getBuiltGraphSDK()
  if (network === ChainId.ARBITRUM) {
    return await (
      await sdk.ArbitrumPairs()
    ).ARBITRUM_EXCHANGE_pairs
  }
}
