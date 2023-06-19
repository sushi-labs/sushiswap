import { getCreate2Address } from '@ethersproject/address'
import { keccak256, pack } from '@ethersproject/solidity'
import { Token } from '@sushiswap/currency'
import invariant from 'tiny-invariant'

import { isSushiSwapV2ChainId, SUSHISWAP_V2_INIT_CODE_HASH } from './constants'

/**
 * Computes a pair address
 * @param factoryAddress The Uniswap V3 factory address
 * @param tokenA The first token of the pair, irrespective of sort order
 * @param tokenB The second token of the pair, irrespective of sort order
 * @param initCodeHashManualOverride Override the init code hash used to compute the pool address if necessary
 * @returns The pair address
 */
export const computePairAddress = ({
  factoryAddress,
  tokenA,
  tokenB,
  initCodeHashManualOverride,
}: {
  factoryAddress: string
  tokenA: Token
  tokenB: Token
  initCodeHashManualOverride?: string
}): string => {
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks
  invariant(isSushiSwapV2ChainId(token0.chainId), 'CHAIN_ID')
  invariant(isSushiSwapV2ChainId(token1.chainId), 'CHAIN_ID')
  return getCreate2Address(
    factoryAddress,
    keccak256(['bytes'], [pack(['address', 'address'], [token0.address, token1.address])]),
    initCodeHashManualOverride ?? SUSHISWAP_V2_INIT_CODE_HASH[token0.chainId]
  )
}
