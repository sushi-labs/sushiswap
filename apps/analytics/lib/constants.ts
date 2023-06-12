import { GetPoolsArgs } from '@sushiswap/client'
import { SUPPORTED_CHAIN_IDS } from 'config'

export const defaultPoolsArgs: GetPoolsArgs = {
  chainIds: SUPPORTED_CHAIN_IDS,
  orderBy: 'liquidityUSD',
  orderDir: 'desc',
  isWhitelisted: true,
}
