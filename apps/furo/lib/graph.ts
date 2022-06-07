import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { WNATIVE_ADDRESS } from '@sushiswap/currency'
// import { getBuiltGraphSDK } from '@sushiswap/graph-client'

import { getBuiltGraphSDK } from '.graphclient'

const GRAPH_HOST = 'api.thegraph.com'

const BENTOBOX_SUBGRAPH_NAME: Record<string | number, string> = {
  [ChainId.ETHEREUM]: 'matthewlilley/bentobox-ethereum',
  [ChainId.GÖRLI]: 'matthewlilley/bentobox-goerli',
  [ChainId.ARBITRUM]: 'matthewlilley/bentobox-arbitrum',
  [ChainId.AVALANCHE]: 'matthewlilley/bentobox-avalanche',
  [ChainId.BSC]: 'matthewlilley/bentobox-bsc',
  [ChainId.FANTOM]: 'matthewlilley/bentobox-fantom',
  [ChainId.GNOSIS]: 'matthewlilley/bentobox-gnosis',
  [ChainId.HARMONY]: 'matthewlilley/bentobox-harmony',
  [ChainId.MOONBEAM]: 'matthewlilley/bentobox-moonbase',
  [ChainId.MOONRIVER]: 'matthewlilley/bentobox-moonriver',
  [ChainId.OPTIMISM]: 'matthewlilley/bentobox-optimism',
  [ChainId.POLYGON]: 'matthewlilley/bentobox-polygon',
}

const FURO_STREAM_SUBGRAPH_NAME: Record<string | number, string> = {
  [ChainId.ETHEREUM]: 'sushiswap/furo-stream-ethereum',
  [ChainId.GÖRLI]: 'sushiswap/furo-stream-goerli',
  [ChainId.ARBITRUM]: 'sushiswap/furo-stream-arbitrum',
  [ChainId.AVALANCHE]: 'sushiswap/furo-stream-avalanche',
  [ChainId.BSC]: 'sushiswap/furo-stream-bsc',
  [ChainId.FANTOM]: 'sushiswap/furo-stream-fantom',
  [ChainId.GNOSIS]: 'sushiswap/furo-stream-gnosis',
  [ChainId.HARMONY]: 'sushiswap/furo-stream-harmony',
  [ChainId.MOONBEAM]: 'sushiswap/furo-stream-moonbeam',
  [ChainId.MOONRIVER]: 'sushiswap/furo-stream-moonriver',
  [ChainId.OPTIMISM]: 'sushiswap/furo-stream-optimism',
  [ChainId.POLYGON]: 'sushiswap/furo-stream-polygon',
}

const FURO_VESTING_SUBGRAPH_NAME: Record<string | number, string> = {
  [ChainId.ETHEREUM]: 'sushiswap/furo-vesting-ethereum',
  [ChainId.GÖRLI]: 'sushiswap/furo-vesting-goerli',
  [ChainId.ARBITRUM]: 'sushiswap/furo-vesting-arbitrum',
  [ChainId.AVALANCHE]: 'sushiswap/furo-vesting-avalanche',
  [ChainId.BSC]: 'sushiswap/furo-vesting-bsc',
  [ChainId.FANTOM]: 'sushiswap/furo-vesting-fantom',
  [ChainId.GNOSIS]: 'sushiswap/furo-vesting-gnosis',
  [ChainId.HARMONY]: 'sushiswap/furo-vesting-harmony',
  [ChainId.MOONBEAM]: 'sushiswap/furo-vesting-moonbeam',
  [ChainId.MOONRIVER]: 'sushiswap/furo-vesting-moonriver',
  [ChainId.OPTIMISM]: 'sushiswap/furo-vesting-optimism',
  [ChainId.POLYGON]: 'sushiswap/furo-vesting-polygon',
}

const SUPPORTED_CHAINS = [
  ChainId.ETHEREUM,
  ChainId.GÖRLI,
  ChainId.ARBITRUM,
  ChainId.AVALANCHE,
  ChainId.BSC,
  ChainId.FANTOM,
  ChainId.GNOSIS,
  ChainId.HARMONY,
  ChainId.MOONBEAM,
  ChainId.MOONRIVER,
  ChainId.OPTIMISM,
  ChainId.POLYGON,
]

const isNetworkSupported = (chainId: number) => SUPPORTED_CHAINS.includes(chainId)

export const getRebase = async (chainId: string, id: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return []
  const sdk = await getBuiltGraphSDK({ chainId, host: GRAPH_HOST, name: BENTOBOX_SUBGRAPH_NAME[chainId] })
  return (
    (await sdk.bentoBoxRebase({ id: id === AddressZero ? WNATIVE_ADDRESS[network].toLowerCase() : id }))
      .bentobox_rebase ?? []
  )
}

export const getRebases = async (chainId: string | number, tokens: string[]) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return []
  const sdk = await getBuiltGraphSDK({ chainId, host: GRAPH_HOST, name: BENTOBOX_SUBGRAPH_NAME[chainId] })
  return (
    (
      await sdk.bentoBoxRebases({
        where: {
          token_in: tokens.map((token) => (token === AddressZero ? WNATIVE_ADDRESS[network].toLowerCase() : token)),
        },
      })
    ).bentobox_rebases ?? []
  )
}

export const getStreams = async (chainId: string | number, id: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return {}
  const sdk = await getBuiltGraphSDK({ chainId, host: GRAPH_HOST, name: FURO_STREAM_SUBGRAPH_NAME[chainId] })

  return (await sdk.userStreams({ id })).furo_stream_user ?? {}
}

export const getVestings = async (chainId: string, id: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return {}
  const sdk = await getBuiltGraphSDK({ chainId, host: GRAPH_HOST, name: FURO_VESTING_SUBGRAPH_NAME[chainId] })
  return (await sdk.userVestings({ id })).furo_vesting_user ?? {}
}

export const getStream = async (chainId: string, id: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return {}
  const sdk = await getBuiltGraphSDK({ chainId, host: GRAPH_HOST, name: FURO_STREAM_SUBGRAPH_NAME[chainId] })
  return (await sdk.stream({ id })).furo_stream_stream ?? {}
}

export const getStreamTransactions = async (chainId: string, id: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return []
  const sdk = await getBuiltGraphSDK({ chainId, host: GRAPH_HOST, name: FURO_STREAM_SUBGRAPH_NAME[chainId] })
  return (await sdk.streamTransactions({ id })).furo_stream_transactions ?? {}
}

export const getVesting = async (chainId: string, id: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return {}
  const sdk = await getBuiltGraphSDK({ chainId, host: GRAPH_HOST, name: FURO_VESTING_SUBGRAPH_NAME[chainId] })
  return (await sdk.vesting({ id })).furo_vesting_vesting ?? {}
}

export const getVestingTransactions = async (chainId: string, id: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return []
  const sdk = await getBuiltGraphSDK({ chainId, host: GRAPH_HOST, name: FURO_VESTING_SUBGRAPH_NAME[chainId] })
  return (await sdk.vestingTransactions({ id })).furo_vesting_transactions ?? {}
}
