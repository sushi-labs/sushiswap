import { ChainId } from '../chain'
import { LDO } from '../currency'

export const GOVERNANCE = {
  [ChainId.ETHEREUM]: [LDO[ChainId.ETHEREUM]],
} as const
