import { defaultAbiCoder } from '@ethersproject/abi'
import { getCreate2Address, getAddress } from '@ethersproject/address'
import { keccak256 } from '@ethersproject/keccak256'
import { zeroPad, concat, BytesLike } from '@ethersproject/bytes'
import { Token } from '@sushiswap/currency'
import { ChainId } from '@sushiswap/chain'

import { FeeAmount, POOL_INIT_CODE_HASH, SushiSwapV3ChainId } from '../constants'

function getCreate2AddressZKSync(from: BytesLike, salt: BytesLike, bytecodeHash: BytesLike) {
  const prefix = '0x2020dba91b30cc0006188af794c2fb30dd8520db7e2c088b7fc7c103c00ca494' // keccak256(toUtf8Bytes('zksyncCreate2'))
  const inputHash = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470' // keccack('0x')
  const addressBytes = keccak256(concat([prefix, zeroPad(from, 32), salt, bytecodeHash, inputHash])).slice(26)
  return getAddress(addressBytes)
}

/**
 * Computes a pool address
 * @param factoryAddress The Uniswap V3 factory address
 * @param tokenA The first token of the pair, irrespective of sort order
 * @param tokenB The second token of the pair, irrespective of sort order
 * @param fee The fee tier of the pool
 * @param initCodeHashManualOverride Override the init code hash used to compute the pool address if necessary
 * @returns The pool address
 */
export function computePoolAddress({
  factoryAddress,
  tokenA,
  tokenB,
  fee,
  chainId,
  initCodeHashManualOverride,
}: {
  factoryAddress: string
  tokenA: Token | string
  tokenB: Token | string
  fee: FeeAmount
  chainId?: ChainId
  initCodeHashManualOverride?: string
}): string {
  if (typeof tokenA !== 'string' && typeof tokenB !== 'string') {
    const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks

    if (token0.chainId === ChainId.ZKSYNC_ERA)
      return getCreate2AddressZKSync(
        factoryAddress,
        keccak256(defaultAbiCoder.encode(['address', 'address', 'uint24'], [token0.address, token1.address, fee])),
        initCodeHashManualOverride ?? POOL_INIT_CODE_HASH[token0.chainId]
      )

    return getCreate2Address(
      factoryAddress,
      keccak256(defaultAbiCoder.encode(['address', 'address', 'uint24'], [token0.address, token1.address, fee])),
      initCodeHashManualOverride ?? POOL_INIT_CODE_HASH[token0.chainId as SushiSwapV3ChainId]
    )
  }

  if (chainId === ChainId.ZKSYNC_ERA)
    return getCreate2AddressZKSync(
      factoryAddress,
      keccak256(defaultAbiCoder.encode(['address', 'address', 'uint24'], [tokenA, tokenB, fee])),
      initCodeHashManualOverride ?? POOL_INIT_CODE_HASH[chainId]
    )

  return getCreate2Address(
    factoryAddress,
    keccak256(defaultAbiCoder.encode(['address', 'address', 'uint24'], [tokenA, tokenB, fee])),
    initCodeHashManualOverride ?? POOL_INIT_CODE_HASH[chainId as SushiSwapV3ChainId]
  )
}
