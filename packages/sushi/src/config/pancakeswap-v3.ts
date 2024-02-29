import { ChainId } from '../chain/index.js'

const POOL_INIT_CODE_HASH =
  '0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2'

/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */

export enum PancakeSwapV3FeeAmount {
  /** 0.01% */
  LOWEST = 100,
  /** 0.1% */
  LOW = 500,
  /** 0.25% */
  MEDIUM = 2500,
  /** 1% */
  HIGH = 10000,
}

export const PANCAKESWAP_V3_FEE_SPACING_MAP: Record<
  PancakeSwapV3FeeAmount,
  number
> = {
  100: 1,
  500: 10,
  2500: 50,
  10_000: 200,
}

export const PANCAKESWAP_V3_SUPPORTED_CHAIN_IDS = [
  ChainId.ARBITRUM,
  ChainId.BASE,
  ChainId.BSC,
  ChainId.ETHEREUM,
  ChainId.LINEA,
  ChainId.POLYGON_ZKEVM,
] as const

export const PancakeSwapV3ChainIds = PANCAKESWAP_V3_SUPPORTED_CHAIN_IDS

export type PancakeSwapV3ChainId =
  (typeof PANCAKESWAP_V3_SUPPORTED_CHAIN_IDS)[number]

export const isPancakeSwapV3ChainId = (
  chainId: ChainId,
): chainId is PancakeSwapV3ChainId =>
  PANCAKESWAP_V3_SUPPORTED_CHAIN_IDS.includes(chainId as PancakeSwapV3ChainId)

export const PANCAKESWAP_V3_INIT_CODE_HASH: Record<
  PancakeSwapV3ChainId,
  `0x${string}`
> = {
  [ChainId.ARBITRUM]: POOL_INIT_CODE_HASH,
  [ChainId.BASE]: POOL_INIT_CODE_HASH,
  [ChainId.BSC]: POOL_INIT_CODE_HASH,
  [ChainId.ETHEREUM]: POOL_INIT_CODE_HASH,
  [ChainId.LINEA]: POOL_INIT_CODE_HASH,
  [ChainId.POLYGON_ZKEVM]: POOL_INIT_CODE_HASH,
} as const

export const PANCAKESWAP_V3_FACTORY_ADDRESS: Record<
  PancakeSwapV3ChainId,
  `0x${string}`
> = {
  [ChainId.ARBITRUM]: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
  [ChainId.BASE]: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
  [ChainId.BSC]: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
  [ChainId.ETHEREUM]: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
  [ChainId.LINEA]: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
  [ChainId.POLYGON_ZKEVM]: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
} as const

export const PANCAKESWAP_V3_DEPLOYER_ADDRESS: Record<
  PancakeSwapV3ChainId,
  `0x${string}`
> = {
  [ChainId.ARBITRUM]: '0x41ff9AA7e16B8B1a8a8dc4f0eFacd93D02d071c9',
  [ChainId.BASE]: '0x41ff9AA7e16B8B1a8a8dc4f0eFacd93D02d071c9',
  [ChainId.BSC]: '0x41ff9AA7e16B8B1a8a8dc4f0eFacd93D02d071c9',
  [ChainId.ETHEREUM]: '0x41ff9AA7e16B8B1a8a8dc4f0eFacd93D02d071c9',
  [ChainId.LINEA]: '0x41ff9AA7e16B8B1a8a8dc4f0eFacd93D02d071c9',
  [ChainId.POLYGON_ZKEVM]: '0x41ff9AA7e16B8B1a8a8dc4f0eFacd93D02d071c9',
} as const
