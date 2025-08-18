import type { Token } from '../types/token.type'
import { baseTokens as mainnetTokens } from './tokens/mainnet/baseTokens'
import { baseTokens as testnetTokens } from './tokens/testnet/baseTokens'

// Potentially fetch these lists directly from the API, albeit another HTTP request, they would stay up to date.
// Consider the tradeoffs for this, as the asset list may want to be maintained for what is allowed on the interface. (token risk parameters)
export const tokens: Record<'testnet' | 'mainnet', Token[]> = {
  testnet: testnetTokens,
  mainnet: mainnetTokens,
}
