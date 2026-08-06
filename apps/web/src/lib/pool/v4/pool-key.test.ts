import {
  EvmChainId,
  EvmNative,
  EvmToken,
  SUSHISWAP_V3_SUPPORTED_CHAIN_IDS,
  SushiSwapV3FeeAmount,
} from 'sushi/evm'
import { getAddress, zeroAddress } from 'viem'
import { describe, expect, it } from 'vitest'
import {
  SUSHISWAP_V4_SUPPORTED_CHAIN_IDS,
  getSushiSwapV4Deployment,
} from './config'
import {
  createSushiSwapV4PoolKey,
  decodeSushiSwapV4PoolKey,
  encodeSushiSwapV4PoolKey,
  encodeSushiSwapV4PoolParameters,
  getHooksRegistration,
  getSushiSwapV4PoolId,
} from './pool-key'

const TOKEN = new EvmToken({
  chainId: EvmChainId.ETHEREUM,
  address: getAddress('0x0000000000000000000000000000000000000002'),
  decimals: 18,
  symbol: 'TOKEN',
  name: 'Token',
})
const POOL_MANAGER = getAddress('0x0000000000000000000000000000000000000003')

describe('SushiSwap V4 compatibility config', () => {
  it('supports exactly the SushiSwap V3 chain set', () => {
    expect(SUSHISWAP_V4_SUPPORTED_CHAIN_IDS).toEqual(
      SUSHISWAP_V3_SUPPORTED_CHAIN_IDS,
    )
  })

  it('does not guess undeployed contract addresses', () => {
    expect(getSushiSwapV4Deployment(EvmChainId.ETHEREUM)).toBeUndefined()
  })
})

describe('createSushiSwapV4PoolKey', () => {
  it('uses the official Infinity CL PoolKey fields and native zero address', () => {
    const poolKey = createSushiSwapV4PoolKey({
      currencyA: TOKEN,
      currencyB: EvmNative.fromChainId(EvmChainId.ETHEREUM),
      poolManager: POOL_MANAGER,
      fee: SushiSwapV3FeeAmount.MEDIUM,
    })

    expect(poolKey).toEqual({
      currency0: zeroAddress,
      currency1: TOKEN.address,
      hooks: zeroAddress,
      poolManager: POOL_MANAGER,
      fee: SushiSwapV3FeeAmount.MEDIUM,
      parameters: {
        tickSpacing: 60,
        hooksRegistration: undefined,
      },
    })
    expect(encodeSushiSwapV4PoolKey(poolKey).parameters).toBe(
      '0x00000000000000000000000000000000000000000000000000000000003c0000',
    )
    expect(getSushiSwapV4PoolId(poolKey)).toBe(
      '0xc7fbf3094d8b8542d750bf9a68ba8e80cbfc0f0d9ee1ac4e590e3ddaae8dd4c1',
    )
  })

  it('packs and decodes the official hook bitmap and signed int24 spacing', () => {
    const parameters = encodeSushiSwapV4PoolParameters({
      tickSpacing: -60,
      hooksRegistration: {
        beforeInitialize: true,
        afterBurnReturnsDelta: true,
      },
    })

    expect(parameters).toBe(
      '0x000000000000000000000000000000000000000000000000000000ffffc42001',
    )
    expect(
      decodeSushiSwapV4PoolKey({
        currency0: zeroAddress,
        currency1: TOKEN.address,
        hooks: zeroAddress,
        poolManager: POOL_MANAGER,
        fee: SushiSwapV3FeeAmount.MEDIUM,
        parameters,
      }).parameters,
    ).toEqual({
      tickSpacing: -60,
      hooksRegistration: {
        beforeInitialize: true,
        afterBurnReturnsDelta: true,
      },
    })
    expect(getHooksRegistration(0x2001)).toEqual({
      beforeInitialize: true,
      afterBurnReturnsDelta: true,
    })
  })
})
