import { defaultAbiCoder } from '@ethersproject/abi'
import type { Address, Hex } from 'viem'
import { getCreate2Address, keccak256 } from 'viem/utils'
import {
  SUSHISWAP_V3_INIT_CODE_HASH,
  SushiSwapV3ChainId,
  SushiSwapV3FeeAmount,
} from '../../../config/index.js'
import { Token } from '../../../currency/index.js'

/**
 * Computes a pool address
 * @param factoryAddress The Uniswap V3 factory address
 * @param tokenA The first token of the pair, irrespective of sort order
 * @param tokenB The second token of the pair, irrespective of sort order
 * @param fee The fee tier of the pool
 * @param initCodeHashManualOverride Override the init code hash used to compute the pool address if necessary
 * @returns The pool address
 */
export function computeSushiSwapV3PoolAddress({
  factoryAddress,
  tokenA,
  tokenB,
  fee,
  initCodeHashManualOverride,
}: {
  factoryAddress: Address
  tokenA: Token | string
  tokenB: Token | string
  fee: SushiSwapV3FeeAmount
  initCodeHashManualOverride?: Address | undefined
}): Address {
  if (typeof tokenA !== 'string' && typeof tokenB !== 'string') {
    const [token0, token1] = tokenA.sortsBefore(tokenB)
      ? [tokenA, tokenB]
      : [tokenB, tokenA] // does safety checks

    return getCreate2Address({
      from: factoryAddress,
      salt: keccak256(
        defaultAbiCoder.encode(
          ['address', 'address', 'uint24'],
          [token0.address, token1.address, fee],
        ) as Hex,
      ),
      bytecodeHash:
        initCodeHashManualOverride ??
        SUSHISWAP_V3_INIT_CODE_HASH[token0.chainId as SushiSwapV3ChainId],
    })
  }

  // FIXME: We shouldn't even allow sending strings into here, this means we have to assume init code hash is always the same for every chain
  return getCreate2Address({
    from: factoryAddress,
    salt: keccak256(
      defaultAbiCoder.encode(
        ['address', 'address', 'uint24'],
        [tokenA, tokenB, fee],
      ) as Hex,
    ),
    bytecodeHash:
      initCodeHashManualOverride ??
      '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
  })
}
