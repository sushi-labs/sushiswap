import { IS_TESTNET } from '../constants'
import type { Token } from '../types/token.type'
import { baseTokens as mainnetTokens } from './tokens/mainnet/baseTokens'
import { baseTokens as testnetTokens } from './tokens/testnet/baseTokens'

// See useCommonTokens hook for fetching dynamic popular token lists from StellarExpert API
export const staticTokens: Token[] = IS_TESTNET ? testnetTokens : mainnetTokens
