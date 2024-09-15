import type { Address } from 'viem'
import { encodeAbiParameters, keccak256, parseAbiParameters } from 'viem/utils'
import { getCreate2Address } from '../../../address/getCreate2Address.js'
import type { ChainId } from '../../../chain/constants.js'
import {
  SUSHISWAP_V3_INIT_CODE_HASH,
  type SushiSwapV3ChainId,
  SushiSwapV3FeeAmount,
} from '../../../config/index.js'
import { Token } from '../../../currency/index.js'

type ComputeSushiSwapV3PoolAddressParams = {
  factoryAddress: Address
  fee: SushiSwapV3FeeAmount
  initCodeHashManualOverride?: Address | undefined
} & (
  | {
      tokenA: Token
      tokenB: Token
    }
  | {
      tokenA: Address
      tokenB: Address
      chainId: ChainId
    }
)

/**
 * Computes a pool address
 * @param factoryAddress The Uniswap V3 factory address
 * @param tokenA The first token of the pair, irrespective of sort order
 * @param tokenB The second token of the pair, irrespective of sort order
 * @param fee The fee tier of the pool
 * @param initCodeHashManualOverride Override the init code hash used to compute the pool address if necessary
 * @returns The pool address
 */
export function computeSushiSwapV3PoolAddress(
  params: ComputeSushiSwapV3PoolAddressParams,
): Address {
  if (typeof params.tokenA === 'string' && typeof params.tokenB === 'string') {
    // FIXME: We shouldn't even allow sending strings into here
    const {
      factoryAddress,
      tokenA,
      tokenB,
      fee,
      initCodeHashManualOverride,
      chainId,
    } = params

    return getCreate2Address({
      from: factoryAddress,
      salt: keccak256(
        encodeAbiParameters(parseAbiParameters('address, address, uint24'), [
          tokenA,
          tokenB,
          fee,
        ]),
      ),
      bytecodeHash:
        initCodeHashManualOverride ??
        SUSHISWAP_V3_INIT_CODE_HASH[chainId as SushiSwapV3ChainId],
      chainId,
    })
  }

  const { factoryAddress, tokenA, tokenB, fee, initCodeHashManualOverride } =
    params
  const [token0, token1] = tokenA.sortsBefore(tokenB)
    ? [tokenA, tokenB]
    : [tokenB, tokenA] // does safety checks

  return getCreate2Address({
    from: factoryAddress,
    salt: keccak256(
      encodeAbiParameters(parseAbiParameters('address, address, uint24'), [
        token0.address,
        token1.address,
        fee,
      ]),
    ),
    bytecodeHash:
      initCodeHashManualOverride ??
      SUSHISWAP_V3_INIT_CODE_HASH[token0.chainId as SushiSwapV3ChainId],
    chainId: token0.chainId,
  })
}
