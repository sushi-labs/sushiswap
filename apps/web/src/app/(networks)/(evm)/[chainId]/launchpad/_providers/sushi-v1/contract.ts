import type { EvmAddress } from 'sushi/evm'
import { parseAbi } from 'viem'

export const SUSHI_V1_LAUNCHPAD_ADDRESS =
  '0x104F1Ab42674565EC3DF0BFEbCcC4186f72fA7ED' satisfies EvmAddress

export const SUSHI_V1_LAUNCHPAD_ABI = parseAbi([
  'function distributeFees(address token) returns (uint256 quoteCollected, uint256 tokenCollected, uint256 quoteToSushi, uint256 tokenToSushi)',
  'error NothingToWithdraw()',
  'error UnknownToken(address token)',
])
