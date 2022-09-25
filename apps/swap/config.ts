import { ChainId } from '@sushiswap/chain'

export const TRIDENT_ENABLED_NETWORKS = [ChainId.OPTIMISM, ChainId.POLYGON]

export const AMM_ENABLED_NETWORKS = [
  ChainId.ETHEREUM,
  ChainId.ARBITRUM,
  ChainId.AVALANCHE,
  ChainId.POLYGON,
  ChainId.FANTOM,
  ChainId.BSC,
  ChainId.GNOSIS,
  ChainId.MOONRIVER,
  ChainId.ARBITRUM_NOVA,
  ChainId.FUSE,
  ChainId.CELO,
  ChainId.MOONBEAM,
  ChainId.HECO,
  ChainId.PALM,
  ChainId.OKEX,
  ChainId.BOBA,
]

export const SUPPORTED_CHAIN_IDS = [...AMM_ENABLED_NETWORKS, ...TRIDENT_ENABLED_NETWORKS]
export const CONSTANT_PRODUCT_POOL_FACTORY_ADDRESS: Record<number, string> = {
  [ChainId.OPTIMISM]: '0x93395129bd3fcf49d95730D3C2737c17990fF328',
  [ChainId.POLYGON]: '0x05689fCfeE31FCe4a67FbC7Cab13E74F80A4E288',
}
