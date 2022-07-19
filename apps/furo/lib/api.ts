import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { WNATIVE_ADDRESS } from '@sushiswap/currency'
import { FURO_SUBGRAPH_NAME, SUPPORTED_CHAINS } from 'config'

import { getBuiltGraphSDK } from '.graphclient'

const GRAPH_HOST = 'api.thegraph.com'

export const getRebase = async (chainId: string, id: string) => {
  if (!SUPPORTED_CHAINS.includes(Number(chainId))) {
    throw Error(`Unsupported Chain ${chainId}`)
  }
  const sdk = await getBuiltGraphSDK({ chainId, host: GRAPH_HOST, name: FURO_SUBGRAPH_NAME[chainId] })
  return (
    (await sdk.bentoBoxRebase({ id: id === AddressZero ? WNATIVE_ADDRESS[chainId].toLowerCase() : id })).rebase ?? []
  )
}

export const getRebases = async (chainId: string | number, tokens: string[]) => {
  if (!SUPPORTED_CHAINS.includes(Number(chainId))) {
    throw Error(`Unsupported Chain ${chainId}`)
  }
  const sdk = await getBuiltGraphSDK({ chainId, host: GRAPH_HOST, name: FURO_SUBGRAPH_NAME[chainId] })
  return (
    (
      await sdk.bentoBoxRebases({
        where: {
          token_in: tokens.map((token) => (token === AddressZero ? WNATIVE_ADDRESS[chainId].toLowerCase() : token)),
        },
      })
    ).rebases ?? []
  )
}

export const getUserStreams = async (chainId: string | number, id: string) => {
  if (!SUPPORTED_CHAINS.includes(Number(chainId))) {
    throw Error(`Unsupported Chain ${chainId}`)
  }
  const sdk = await getBuiltGraphSDK({ chainId, host: GRAPH_HOST, name: FURO_SUBGRAPH_NAME[chainId] })

  return (await sdk.userStreams({ id })) ?? {}
}

export const getUserVestings = async (chainId: string, id: string) => {
  if (!SUPPORTED_CHAINS.includes(Number(chainId))) {
    throw Error(`Unsupported Chain ${chainId}`)
  }
  const sdk = await getBuiltGraphSDK({ chainId, host: GRAPH_HOST, name: FURO_SUBGRAPH_NAME[chainId] })
  return (await sdk.userVestings({ id })) ?? {}
}

export const getStream = async (chainId: string, id: string) => {
  if (!SUPPORTED_CHAINS.includes(Number(chainId))) {
    throw Error(`Unsupported Chain ${chainId}`)
  }
  const sdk = await getBuiltGraphSDK({ chainId, host: GRAPH_HOST, name: FURO_SUBGRAPH_NAME[chainId] })
  return (await sdk.stream({ id })).stream ?? {}
}

export const getStreamTransactions = async (chainId: string, id: string) => {
  if (!SUPPORTED_CHAINS.includes(Number(chainId))) {
    throw Error(`Unsupported Chain ${chainId}`)
  }
  const sdk = await getBuiltGraphSDK({ chainId, host: GRAPH_HOST, name: FURO_SUBGRAPH_NAME[chainId] })
  return (await sdk.streamTransactions({ where: { stream: id } })).transactions ?? []
}

export const getVesting = async (chainId: string, id: string) => {
  if (!SUPPORTED_CHAINS.includes(Number(chainId))) {
    throw Error(`Unsupported Chain ${chainId}`)
  }
  const sdk = await getBuiltGraphSDK({ chainId, host: GRAPH_HOST, name: FURO_SUBGRAPH_NAME[chainId] })
  return (await sdk.vesting({ id })).vesting ?? {}
}

export const getVestingTransactions = async (chainId: string, id: string) => {
  if (!SUPPORTED_CHAINS.includes(Number(chainId))) {
    throw Error(`Unsupported Chain ${chainId}`)
  }
  const sdk = await getBuiltGraphSDK({ chainId, host: GRAPH_HOST, name: FURO_SUBGRAPH_NAME[chainId] })
  return (await sdk.vestingTransactions({ where: { vesting: id } })).transactions ?? []
}
