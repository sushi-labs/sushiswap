import { ChainId } from '@sushiswap/chain'

import { getBuiltGraphSDK } from '.graphclient'

const SUPPORTED_CHAINS = [ChainId.KOVAN, ChainId.GÖRLI, ChainId.ETHEREUM]

const isNetworkSupported = (chainId: number) => SUPPORTED_CHAINS.includes(chainId)

export const getStreams = async (chainId: string, id: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return {}
  const sdk = await getBuiltGraphSDK()
  if (network === ChainId.ETHEREUM) {
    return (await sdk.EthereumUserStreams({ id })).ETHEREUM_STREAM_user ?? []
  } else if (network === ChainId.KOVAN) {
    return (await sdk.KovanUserStreams({ id })).KOVAN_STREAM_user ?? []
  } else if (network === ChainId.GÖRLI) {
    return (await sdk.GoerliUserStreams({ id })).GOERLI_STREAM_user ?? []
  }
}

export const getVestings = async (chainId: string, id: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return {}
  const sdk = await getBuiltGraphSDK()
  if (network === ChainId.ETHEREUM) {
    return (await sdk.EthereumUserVestings({ id })).ETHEREUM_VESTING_user ?? []
  } else if (network === ChainId.KOVAN) {
    return (await sdk.KovanUserVestings({ id })).KOVAN_VESTING_user ?? []
  } else if (network === ChainId.GÖRLI) {
    return (await sdk.GoerliUserVestings({ id })).GOERLI_VESTING_user ?? []
  }
}

export const getStream = async (chainId: string, id: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return {}
  const sdk = await getBuiltGraphSDK()
  if (network === ChainId.ETHEREUM) {
    return (await sdk.EthereumStream({ id })).ETHEREUM_STREAM_stream ?? []
  } else if (network === ChainId.KOVAN) {
    return (await sdk.KovanStream({ id })).KOVAN_STREAM_stream ?? []
  } else if (network === ChainId.GÖRLI) {
    return (await sdk.GoerliStream({ id })).GOERLI_STREAM_stream ?? []
  }
}

export const getStreamTransactions = async (chainId: string, id: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return {}
  const sdk = await getBuiltGraphSDK()
  if (network === ChainId.ETHEREUM) {
    return (await sdk.EthereumStreamTransactions({ id })).ETHEREUM_STREAM_transactions ?? []
  } else if (network === ChainId.KOVAN) {
    return (await sdk.KovanStreamTransactions({ id })).KOVAN_STREAM_transactions ?? []
  } else if (network === ChainId.GÖRLI) {
    return (await sdk.GoerliStreamTransactions({ id })).GOERLI_STREAM_transactions ?? []
  }
}

export const getVesting = async (chainId: string, id: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return {}
  const sdk = await getBuiltGraphSDK()
  if (network === ChainId.ETHEREUM) {
    return (await sdk.EthereumVesting({ id })).ETHEREUM_VESTING_vesting ?? []
  } else if (network === ChainId.KOVAN) {
    return (await sdk.KovanVesting({ id })).KOVAN_VESTING_vesting ?? []
  } else if (network === ChainId.GÖRLI) {
    return (await sdk.GoerliVesting({ id })).GOERLI_VESTING_vesting ?? []
  }
}

export const getVestingTransactions = async (chainId: string, id: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return {}
  const sdk = await getBuiltGraphSDK()
  if (network === ChainId.ETHEREUM) {
    return (await sdk.EthereumVestingTransactions({ id })).ETHEREUM_VESTING_transactions ?? []
  } else if (network === ChainId.KOVAN) {
    return (await sdk.KovanVestingTransactions({ id })).KOVAN_VESTING_transactions ?? []
  } else if (network === ChainId.GÖRLI) {
    return (await sdk.GoerliVestingTransactions({ id })).GOERLI_VESTING_transactions ?? []
  }
}
