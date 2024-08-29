import { ChainId } from '../chain/index.js'

export const PANCAKESWAP_V2_SUPPORTED_CHAIN_IDS = [
  ChainId.BSC,
  ChainId.ETHEREUM,
  ChainId.POLYGON_ZKEVM,
  ChainId.ZKSYNC_ERA,
  ChainId.ARBITRUM,
  ChainId.LINEA,
  ChainId.BASE,
] as const

export const PancakeSwapV2ChainIds = PANCAKESWAP_V2_SUPPORTED_CHAIN_IDS

export type PancakeSwapV2ChainId =
  (typeof PANCAKESWAP_V2_SUPPORTED_CHAIN_IDS)[number]

export const isPancakeSwapV2ChainId = (
  chainId: ChainId,
): chainId is PancakeSwapV2ChainId =>
  PANCAKESWAP_V2_SUPPORTED_CHAIN_IDS.includes(chainId as PancakeSwapV2ChainId)

export const PANCAKESWAP_V2_FACTORY_ADDRESS: Record<
  PancakeSwapV2ChainId,
  `0x${string}`
> = {
  [ChainId.BSC]: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
  [ChainId.ETHEREUM]: '0x1097053Fd2ea711dad45caCcc45EfF7548fCB362',
  [ChainId.POLYGON_ZKEVM]: '0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E',
  [ChainId.ZKSYNC_ERA]: '0xd03D8D566183F0086d8D09A84E1e30b58Dd5619d',
  [ChainId.ARBITRUM]: '0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E',
  [ChainId.LINEA]: '0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E',
  [ChainId.BASE]: '0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E',
  // [ChainId.OP_BNB]: '0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E',
} as const

export const PANCAKESWAP_V2_INIT_CODE_HASH: Record<
  PancakeSwapV2ChainId,
  `0x${string}`
> = {
  [ChainId.BSC]:
    '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5',
  [ChainId.ETHEREUM]:
    '0x57224589c67f3f30a6b0d7a1b54cf3153ab84563bc609ef41dfb34f8b2974d2d',
  [ChainId.POLYGON_ZKEVM]:
    '0x57224589c67f3f30a6b0d7a1b54cf3153ab84563bc609ef41dfb34f8b2974d2d',
  [ChainId.ZKSYNC_ERA]:
    '0x0100045707a42494392b3558029b9869f865ff9df8f375dc1bf20b0555093f43',
  [ChainId.ARBITRUM]:
    '0x57224589c67f3f30a6b0d7a1b54cf3153ab84563bc609ef41dfb34f8b2974d2d',
  [ChainId.LINEA]:
    '0x57224589c67f3f30a6b0d7a1b54cf3153ab84563bc609ef41dfb34f8b2974d2d',
  [ChainId.BASE]:
    '0x57224589c67f3f30a6b0d7a1b54cf3153ab84563bc609ef41dfb34f8b2974d2d ',
  // [ChainId.OP_BNB]:
  //   '0x57224589c67f3f30a6b0d7a1b54cf3153ab84563bc609ef41dfb34f8b2974d2d ',
} as const
