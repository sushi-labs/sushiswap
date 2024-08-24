import { ChainId } from '../../chain/index.js'

export const MERKL_SUPPORTED_CHAIN_IDS = [
  ChainId.ETHEREUM,
  ChainId.OPTIMISM,
  ChainId.BASE,
  ChainId.BSC,
  ChainId.GNOSIS,
  ChainId.POLYGON,
  ChainId.ARBITRUM,
  // ChainId.CELO,
  ChainId.AVALANCHE,
  ChainId.POLYGON_ZKEVM,
  ChainId.THUNDERCORE,
  ChainId.CORE,
  ChainId.BLAST,
  ChainId.SCROLL,
  ChainId.LINEA,
  ChainId.SKALE_EUROPA,
  ChainId.ROOTSTOCK,
]

export const MerklChainIds = MERKL_SUPPORTED_CHAIN_IDS

export type MerklChainId = (typeof MERKL_SUPPORTED_CHAIN_IDS)[number]

export const isMerklChainId = (chainId: ChainId): chainId is MerklChainId =>
  MERKL_SUPPORTED_CHAIN_IDS.includes(chainId as MerklChainId)
