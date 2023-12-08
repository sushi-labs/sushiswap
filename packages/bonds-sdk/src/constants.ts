import { ChainId } from 'sushi/chain'

export const BONDS_ENABLED_NETWORKS = [
  ChainId.ETHEREUM,
  ChainId.ARBITRUM,
] as const satisfies Readonly<ChainId[]>

export type BondChainId = typeof BONDS_ENABLED_NETWORKS[number]

export const BONDS_SUBGRAPH_URL: Record<BondChainId, string> = {
  [ChainId.ETHEREUM]:
    'api.thegraph.com/subgraphs/name/bond-protocol/bond-protocol-mainnet',
  [ChainId.ARBITRUM]:
    'api.thegraph.com/subgraphs/name/bond-protocol/bond-protocol-arbitrum-mainnet',
}

export const isBondChainId = (chainId: ChainId): chainId is BondChainId =>
  BONDS_ENABLED_NETWORKS.includes(chainId as BondChainId)
