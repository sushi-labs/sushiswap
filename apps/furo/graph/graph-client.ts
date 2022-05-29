import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { WNATIVE_ADDRESS } from '@sushiswap/currency'

import { getBuiltGraphSDK } from '.graphclient'

const SUPPORTED_CHAINS = [ChainId.ETHEREUM, ChainId.GÖRLI]

const isNetworkSupported = (chainId: number) => SUPPORTED_CHAINS.includes(chainId)

export const getRebase = async (chainId: string, id: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return {}
  const sdk = await getBuiltGraphSDK()

  if (network === ChainId.ETHEREUM) {
    return (
      (await sdk.EthereumBentoBoxRebase({ id: id === AddressZero ? WNATIVE_ADDRESS[network].toLowerCase() : id }))
        .ETHEREUM_BENTOBOX_rebase ?? []
    )
  } else if (network === ChainId.GÖRLI) {
    return (
      (await sdk.GoerliBentoBoxRebase({ id: id === AddressZero ? WNATIVE_ADDRESS[network].toLowerCase() : id }))
        .GOERLI_BENTOBOX_rebase ?? []
    )
  }
}

export const getRebases = async (chainId: string | number, tokens: string[]) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return {}
  const sdk = await getBuiltGraphSDK()
  if (network === ChainId.ETHEREUM) {
    return (await sdk.EthereumBentoBoxRebases({ where: { token_in: tokens } })).ETHEREUM_BENTOBOX_rebases ?? []
  } else if (network === ChainId.GÖRLI) {
    return (await sdk.GoerliBentoBoxRebases({ where: { token_in: tokens } })).GOERLI_BENTOBOX_rebases ?? []
  }
}

export const getStreams = async (chainId: string | number, id: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return {}
  const sdk = await getBuiltGraphSDK()
  if (network === ChainId.ETHEREUM) {
    return (await sdk.EthereumUserStreams({ id })).ETHEREUM_STREAM_user ?? []
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
  } else if (network === ChainId.GÖRLI) {
    return (await sdk.GoerliVestingTransactions({ id })).GOERLI_VESTING_transactions ?? []
  }
}
