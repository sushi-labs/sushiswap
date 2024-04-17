import { ChainId } from '../chain/index.js'

export const PANCAKESWAP_V2_FACTORY_ADDRESS = {
  [ChainId.ETHEREUM]: '0x1097053Fd2ea711dad45caCcc45EfF7548fCB362',
  [ChainId.BSC]: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
} as const

export const PANCAKESWAP_V2_INIT_CODE_HASH = {
  [ChainId.ETHEREUM]:
    '0x57224589c67f3f30a6b0d7a1b54cf3153ab84563bc609ef41dfb34f8b2974d2d',
  [ChainId.BSC]:
    '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5',
} as const
