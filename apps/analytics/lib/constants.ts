import { GetPoolsArgs } from '@sushiswap/client'
import { SUPPORTED_CHAIN_IDS } from 'config'

export const defaultVerifiedPoolsArgs: GetPoolsArgs = {
  chainIds: SUPPORTED_CHAIN_IDS,
  orderBy: 'liquidityUSD',
  orderDir: 'desc',
  isWhitelisted: true,
}

export const defaultUnverifiedPoolsArgs: GetPoolsArgs = {
  chainIds: SUPPORTED_CHAIN_IDS,
  orderBy: 'liquidityUSD',
  orderDir: 'desc',
  isWhitelisted: false,
}
