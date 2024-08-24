import { ChainId } from '../../chain/constants.js'

export const DEXSCREENER_SLUGS = {
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.POLYGON]: 'polygon',
  [ChainId.POLYGON_TESTNET]: 'polygon',
  [ChainId.FANTOM]: 'fantom',
  [ChainId.FANTOM_TESTNET]: 'fantom',
  [ChainId.GNOSIS]: 'gnosischain',
  [ChainId.BSC]: 'bsc',
  [ChainId.BSC_TESTNET]: 'bsc',
  [ChainId.ARBITRUM]: 'arbitrum',
  [ChainId.ARBITRUM_NOVA]: 'arbitrumnova',
  [ChainId.ARBITRUM_TESTNET]: 'arbitrum',
  [ChainId.AVALANCHE]: 'avalanche',
  [ChainId.AVALANCHE_TESTNET]: 'avalanche',
  [ChainId.HARMONY]: 'harmony',
  [ChainId.CELO]: 'celo',
  [ChainId.MOONRIVER]: 'moonriver',
  [ChainId.FUSE]: 'fuse',
  [ChainId.TELOS]: 'telos',
  [ChainId.MOONBEAM]: 'moonbeam',
  [ChainId.OPTIMISM]: 'optimism',
  [ChainId.KAVA]: 'kava',
  [ChainId.METIS]: 'metis',
  [ChainId.BOBA]: 'boba',
  [ChainId.POLYGON_ZKEVM]: 'polygonzkevm',
  [ChainId.THUNDERCORE]: 'thundercore',
  [ChainId.FILECOIN]: 'filecoin',
  [ChainId.CORE]: 'core',
  [ChainId.ZKSYNC_ERA]: 'zksync',
  [ChainId.LINEA]: 'linea',
  [ChainId.BASE]: 'base',
  [ChainId.SCROLL]: 'scroll',
  [ChainId.ZETACHAIN]: 'zetachain',
  [ChainId.CRONOS]: 'cronos',
  [ChainId.BLAST]: 'blast',
}

export const DEXSCREENER_SUPPORTED_CHAIN_IDS = Object.keys(
  DEXSCREENER_SLUGS,
).map(Number) as DexscreenerChainId[]

export const DexscreenerChainId = DEXSCREENER_SUPPORTED_CHAIN_IDS

export type DexscreenerChainId = keyof typeof DEXSCREENER_SLUGS

export const isDexscreenerChainId = (
  chainId: ChainId,
): chainId is DexscreenerChainId => {
  return DEXSCREENER_SUPPORTED_CHAIN_IDS.includes(chainId as DexscreenerChainId)
}
