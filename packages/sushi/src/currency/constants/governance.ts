import { ChainId } from '../../chain/index.js'

import { LDO } from './tokens.js'

export const GOVERNANCE = {
  [ChainId.ETHEREUM]: [LDO[ChainId.ETHEREUM]],
} as const
