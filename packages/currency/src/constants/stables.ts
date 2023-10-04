import { ChainId } from '@sushiswap/chain'

import { DAI, LUSD, USDC, USDT } from './tokens.js'

export const STABLES = {
  [ChainId.ETHEREUM]: [
    USDC[ChainId.ETHEREUM],
    USDT[ChainId.ETHEREUM],
    DAI[ChainId.ETHEREUM],
    LUSD[ChainId.ETHEREUM],
  ],
} as const
