import { ChainId } from '@sushiswap/chain'
import { FarmRepresentation, TridentPoolRepresentation } from 'features/onsen/context/representations'
import { FarmType } from 'features/onsen/context/types'

import { getBuiltGraphSDK } from '.graphclient'

const SUPPORTED_CHAINS = [ChainId.KOVAN]

const isNetworkSupported = (chainId: number) => SUPPORTED_CHAINS.includes(chainId)

export const getFarm = async (chainId: string, id: string): Promise<FarmRepresentation | undefined> => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return undefined
  const sdk = getBuiltGraphSDK()
  if (network === ChainId.KOVAN) {
    return (await sdk.KovanOnsenFarm({ id })).KOVAN_ONSEN_incentive as FarmRepresentation
  }
}

export const getFarms = async (chainId: string): Promise<FarmRepresentation[] | undefined> => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return undefined
  const sdk = getBuiltGraphSDK()
  if (network === ChainId.KOVAN) {
    return (await sdk.KovanOnsenFarms()).KOVAN_ONSEN_incentives as FarmRepresentation[]
  }
}

export const getFarmToken = async (chainId: string, id: string, type: FarmType): Promise<TridentPoolRepresentation | undefined> => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return undefined
  const sdk = getBuiltGraphSDK()
  if (network === ChainId.KOVAN) {
    if (type === FarmType.TRIDENT) return (await sdk.KovanTridentPool({ id })).KOVAN_TRIDENT_pool as TridentPoolRepresentation
    // if (type === FarmType.LEGACY) return (await sdk.KovanTridentPool({ id })).KOVAN_TRIDENT_pool as TridentPoolRepresentation
    else return undefined
  }
}


export const getTridentPool = async (chainId: string, id: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return {}
  const sdk = await getBuiltGraphSDK()
  if (network === ChainId.KOVAN) {
    return (await sdk.KovanTridentPool({ id })).KOVAN_TRIDENT_pool ?? {}
  }
}
