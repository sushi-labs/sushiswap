import { ChainId } from '../chain/index.js'
import { LDO } from '../currency/index.js'

export const GOVERNANCE = {
  [ChainId.ETHEREUM]: [LDO[ChainId.ETHEREUM]],
} as const
