import { ChainId } from '../../chain'
import { LDO } from './tokens'

export const GOVERNANCE = {
  [ChainId.ETHEREUM]: [LDO[ChainId.ETHEREUM]],
} as const
