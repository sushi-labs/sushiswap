import { AddressZero } from '@ethersproject/constants'
import { WNATIVE_ADDRESS } from '@sushiswap/currency'
import { FURO_SUBGRAPH_NAME } from '@sushiswap/graph-config'

import { SUPPORTED_CHAINS, SupportedChainId } from '../config'
import { getBuiltGraphSDK } from './../.graphclient'

const GRAPH_HOST = 'api.thegraph.com'

export const getRebase = async (chainId: string, id: string) => {
  if (!SUPPORTED_CHAINS.includes(Number(chainId) as SupportedChainId)) {
    throw Error(`Unsupported Chain ${chainId}`)
  }
  const sdk = await getBuiltGraphSDK({
    chainId,
    host: GRAPH_HOST,
    name: FURO_SUBGRAPH_NAME[chainId],
  })
  return (
    (
      await sdk.bentoBoxRebase({
        id: id === AddressZero ? WNATIVE_ADDRESS[Number(chainId) as keyof typeof WNATIVE_ADDRESS].toLowerCase() : id,
      })
    ).rebase ?? []
  )
}

export const getRebases = async (chainId: string, tokens: string[]) => {
  if (!SUPPORTED_CHAINS.includes(Number(chainId) as SupportedChainId)) {
    throw Error(`Unsupported Chain ${chainId}`)
  }
  const sdk = await getBuiltGraphSDK({
    chainId,
    host: GRAPH_HOST,
    name: FURO_SUBGRAPH_NAME[chainId],
  })
  return (
    (
      await sdk.bentoBoxRebases({
        where: {
          token_in: tokens.map((token) =>
            token === AddressZero
              ? WNATIVE_ADDRESS[Number(chainId) as keyof typeof WNATIVE_ADDRESS].toLowerCase()
              : token
          ),
        },
      })
    ).rebases ?? []
  )
}

export const getUserStreams = async (chainId: string, id: string) => {
  if (!SUPPORTED_CHAINS.includes(Number(chainId) as SupportedChainId)) {
    throw Error(`Unsupported Chain ${chainId}`)
  }
  const sdk = await getBuiltGraphSDK({
    chainId,
    host: GRAPH_HOST,
    name: FURO_SUBGRAPH_NAME[chainId],
  })

  return (await sdk.userStreams({ id })) ?? {}
}

export const getUserVestings = async (chainId: string, id: string) => {
  if (!SUPPORTED_CHAINS.includes(Number(chainId) as SupportedChainId)) {
    throw Error(`Unsupported Chain ${chainId}`)
  }
  const sdk = await getBuiltGraphSDK({
    chainId,
    host: GRAPH_HOST,
    name: FURO_SUBGRAPH_NAME[chainId],
  })
  return (await sdk.userVestings({ id })) ?? {}
}

export const getStreamIds = async (chainId: string) => {
  if (!SUPPORTED_CHAINS.includes(Number(chainId) as SupportedChainId)) {
    throw Error(`Unsupported Chain ${chainId}`)
  }
  const sdk = await getBuiltGraphSDK({
    chainId,
    host: GRAPH_HOST,
    name: FURO_SUBGRAPH_NAME[chainId],
  })
  return (await sdk.streamIds()).streams ?? []
}

export const getStream = async (chainId: string, id: string) => {
  if (!SUPPORTED_CHAINS.includes(Number(chainId) as SupportedChainId)) {
    throw Error(`Unsupported Chain ${chainId}`)
  }
  const sdk = await getBuiltGraphSDK({
    chainId,
    host: GRAPH_HOST,
    name: FURO_SUBGRAPH_NAME[chainId],
  })
  return (await sdk.stream({ id })).stream ?? {}
}

export const getStreamTransactions = async (chainId: string, id: string) => {
  if (!SUPPORTED_CHAINS.includes(Number(chainId) as SupportedChainId)) {
    throw Error(`Unsupported Chain ${chainId}`)
  }
  const sdk = await getBuiltGraphSDK({
    chainId,
    host: GRAPH_HOST,
    name: FURO_SUBGRAPH_NAME[chainId],
  })
  return (await sdk.streamTransactions({ where: { stream: id } })).transactions ?? []
}

export const getVestingIds = async (chainId: string) => {
  if (!SUPPORTED_CHAINS.includes(Number(chainId) as SupportedChainId)) {
    throw Error(`Unsupported Chain ${chainId}`)
  }
  const sdk = getBuiltGraphSDK({
    chainId,
    host: GRAPH_HOST,
    name: FURO_SUBGRAPH_NAME[chainId],
  })
  return (await sdk.vestingIds()).vestings ?? []
}

export const getVesting = async (chainId: string, id: string) => {
  if (!SUPPORTED_CHAINS.includes(Number(chainId) as SupportedChainId)) {
    throw Error(`Unsupported Chain ${chainId}`)
  }
  const sdk = await getBuiltGraphSDK({
    chainId,
    host: GRAPH_HOST,
    name: FURO_SUBGRAPH_NAME[chainId],
  })
  return (await sdk.vesting({ id })).vesting ?? {}
}

export const getVestingTransactions = async (chainId: string, id: string) => {
  if (!SUPPORTED_CHAINS.includes(Number(chainId) as SupportedChainId)) {
    throw Error(`Unsupported Chain ${chainId}`)
  }
  const sdk = await getBuiltGraphSDK({
    chainId,
    host: GRAPH_HOST,
    name: FURO_SUBGRAPH_NAME[chainId],
  })
  return (await sdk.vestingTransactions({ where: { vesting: id } })).transactions ?? []
}
