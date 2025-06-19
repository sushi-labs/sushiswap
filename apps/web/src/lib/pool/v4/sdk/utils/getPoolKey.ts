import type { Type } from 'sushi/currency'
import { type Address, zeroAddress } from 'viem'
import {
  SUSHISWAP_V4_CL_POOL_MANAGER,
  type SushiSwapV4ChainId,
} from '../../config'
import type { HookData, PoolKey } from '../types'

export function getPoolKey({
  chainId,
  currency0,
  currency1,
  feeAmount,
  tickSpacing,
  hookData,
}: {
  chainId: SushiSwapV4ChainId
  currency0: Type | Address
  currency1: Type | Address
  feeAmount: number
  tickSpacing: number
  hookData?: HookData
}) {
  return {
    currency0:
      typeof currency0 === 'string'
        ? currency0
        : currency0.isNative
          ? zeroAddress
          : currency0.wrapped.address,
    currency1:
      typeof currency1 === 'string'
        ? currency1
        : currency1.isNative
          ? zeroAddress
          : currency1.wrapped.address,
    hooks: hookData?.address ?? zeroAddress,
    poolManager: SUSHISWAP_V4_CL_POOL_MANAGER[chainId],
    fee: feeAmount,
    parameters: {
      tickSpacing,
      hooksRegistration: hookData?.hooksRegistration,
    },
  } satisfies PoolKey
}
