import { ChainId } from '../../chain/index.js'

import { DAI, LUSD, USDC, USDT } from './tokens.js'

export const STABLES = {
  [ChainId.ETHEREUM]: [
    USDC[ChainId.ETHEREUM],
    USDT[ChainId.ETHEREUM],
    DAI[ChainId.ETHEREUM],
    LUSD[ChainId.ETHEREUM],
  ],
} as const
