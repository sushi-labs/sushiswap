import { ChainId } from '@sushiswap/chain'

import { DAI, LUSD, USDC, USDT } from './tokens'

export const STABLES = {
  [ChainId.ETHEREUM]: [
    USDC[ChainId.ETHEREUM],
    USDT[ChainId.ETHEREUM],
    DAI[ChainId.ETHEREUM],
    LUSD[ChainId.ETHEREUM],
  ],
  [ChainId.ARBITRUM]: [
    USDC[ChainId.ARBITRUM],
    USDT[ChainId.ARBITRUM],
    DAI[ChainId.ARBITRUM],
  ],
} as const
