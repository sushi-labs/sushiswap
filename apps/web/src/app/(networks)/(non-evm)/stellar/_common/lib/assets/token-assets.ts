import { IS_FUTURENET } from '../constants'
import { baseTokens as futurenetTokens } from './tokens/futurenet/baseTokens'
import { baseTokens as mainnetTokens } from './tokens/mainnet/baseTokens'

// See useCommonTokens hook for fetching dynamic popular token lists from StellarExpert API
export const staticTokens = (
  IS_FUTURENET ? futurenetTokens : mainnetTokens
) as typeof mainnetTokens
