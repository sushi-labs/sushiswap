import { ChainId } from '../chain/index.js'

const POOL_INIT_CODE_HASH =
  '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54'

/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */

export enum UniswapV3FeeAmount {
  /** 0.01% */
  LOWEST = 100,
  /** 0.1% */
  LOW = 500,
  /** 0.3% */
  MEDIUM = 3000,
  /** 1% */
  HIGH = 10000,
}

/**
 * The default factory tick spacings by fee amount.
 */
export const UNISWAP_V3_TICK_SPACINGS: {
  [_amount in UniswapV3FeeAmount]: number
} = {
  [UniswapV3FeeAmount.LOWEST]: 1,
  [UniswapV3FeeAmount.LOW]: 10,
  [UniswapV3FeeAmount.MEDIUM]: 60,
  [UniswapV3FeeAmount.HIGH]: 200,
}

export const UNISWAP_V3_SUPPORTED_CHAIN_IDS = [
  ChainId.ARBITRUM,
  ChainId.BSC,
  ChainId.CELO,
  ChainId.ETHEREUM,
  ChainId.OPTIMISM,
  ChainId.POLYGON,
  ChainId.BASE,
  ChainId.MOONBEAM,
  ChainId.AVALANCHE,
] as const

export const UniswapV3ChainIds = UNISWAP_V3_SUPPORTED_CHAIN_IDS

export type UniswapV3ChainId = (typeof UNISWAP_V3_SUPPORTED_CHAIN_IDS)[number]

export const isUniswapV3ChainId = (
  chainId: ChainId,
): chainId is UniswapV3ChainId =>
  UNISWAP_V3_SUPPORTED_CHAIN_IDS.includes(chainId as UniswapV3ChainId)

export const UNISWAP_V3_INIT_CODE_HASH: Record<
  UniswapV3ChainId,
  `0x${string}`
> = {
  [ChainId.ETHEREUM]: POOL_INIT_CODE_HASH,
  [ChainId.POLYGON]: POOL_INIT_CODE_HASH,
  [ChainId.ARBITRUM]: POOL_INIT_CODE_HASH,
  [ChainId.OPTIMISM]: POOL_INIT_CODE_HASH,
  [ChainId.BSC]: POOL_INIT_CODE_HASH,
  [ChainId.CELO]: POOL_INIT_CODE_HASH,
  [ChainId.BASE]: POOL_INIT_CODE_HASH,
  [ChainId.MOONBEAM]: POOL_INIT_CODE_HASH,
  [ChainId.AVALANCHE]: POOL_INIT_CODE_HASH,
} as const

export const UNISWAP_V3_FACTORY_ADDRESS: Record<
  UniswapV3ChainId,
  `0x${string}`
> = {
  [ChainId.ETHEREUM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.POLYGON]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.ARBITRUM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.OPTIMISM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.BSC]: '0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7',
  [ChainId.CELO]: '0xAfE208a311B21f13EF87E33A90049fC17A7acDEc',
  [ChainId.BASE]: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD',
  [ChainId.MOONBEAM]: '0x28f1158795A3585CaAA3cD6469CD65382b89BB70',
  [ChainId.AVALANCHE]: '0x740b1c1de25031C31FF4fC9A62f554A55cdC1baD',
} as const
