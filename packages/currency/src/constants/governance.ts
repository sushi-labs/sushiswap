import { ChainId } from '@sushiswap/chain'

import { LDO } from './tokens.js'

export const GOVERNANCE = {
  [ChainId.ETHEREUM]: [LDO[ChainId.ETHEREUM]],
} as const
