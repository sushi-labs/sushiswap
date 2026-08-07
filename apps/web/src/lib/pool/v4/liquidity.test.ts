import {
  decodeAbiParameters,
  decodeFunctionData,
  getAddress,
  zeroAddress,
} from 'viem'
import { describe, expect, it } from 'vitest'
import { INFINITY_CL_POSITION_MANAGER_ABI } from './contract-abi'
import {
  addCLLiquidityMulticall,
  encodeCLPositionManagerDecreaseLiquidityCalldata,
  encodeCLPositionManagerMulticall,
} from './liquidity'
import type { SushiSwapV4PoolKey } from './types'

const TOKEN = getAddress('0x0000000000000000000000000000000000000002')
const POOL_MANAGER = getAddress('0x0000000000000000000000000000000000000003')
const RECIPIENT = getAddress('0x0000000000000000000000000000000000000004')
const WRAPPED_NATIVE = getAddress('0x0000000000000000000000000000000000000005')
const POOL_KEY = {
  currency0: zeroAddress,
  currency1: TOKEN,
  hooks: zeroAddress,
  poolManager: POOL_MANAGER,
  fee: 3000,
  parameters: { tickSpacing: 60 },
} satisfies SushiSwapV4PoolKey

function getModifyPlan(data: `0x${string}`) {
  const decoded = decodeFunctionData({
    abi: INFINITY_CL_POSITION_MANAGER_ABI,
    data,
  })
  if (decoded.functionName !== 'modifyLiquidities') {
    throw new Error('Expected modifyLiquidities calldata')
  }

  const [payload, deadline] = decoded.args
  const [actions, parameters] = decodeAbiParameters(
    [
      { name: 'actions', type: 'bytes' },
      { name: 'params', type: 'bytes[]' },
    ],
    payload,
  )

  return { actions, parameters, deadline }
}

function getAddCall({
  isInitialized = true,
  tokenId,
}: {
  isInitialized?: boolean
  tokenId?: bigint
}) {
  return addCLLiquidityMulticall({
    isInitialized,
    sqrtPriceX96: 79228162514264337593543950336n,
    tokenId,
    positionConfig: {
      poolKey: POOL_KEY,
      tickLower: -120,
      tickUpper: 120,
    },
    liquidity: 123n,
    recipient: RECIPIENT,
    amount0Max: 456n,
    amount1Max: 789n,
    deadline: 1000n,
    modifyPositionHookData: '0x1234',
  })
}

describe('Infinity CL liquidity calldata', () => {
  it('encodes mint, settle, and native refund actions', () => {
    const plan = getModifyPlan(getAddCall({}))

    expect(plan.actions).toBe('0x020d14')
    expect(plan.parameters).toHaveLength(3)
    expect(plan.deadline).toBe(1000n)
  })

  it('prepends pool initialization through multicall', () => {
    const decoded = decodeFunctionData({
      abi: INFINITY_CL_POSITION_MANAGER_ABI,
      data: getAddCall({ isInitialized: false }),
    })
    if (decoded.functionName !== 'multicall') {
      throw new Error('Expected multicall calldata')
    }

    const [calls] = decoded.args
    expect(calls).toHaveLength(2)
    expect(
      decodeFunctionData({
        abi: INFINITY_CL_POSITION_MANAGER_ABI,
        data: calls[0],
      }).functionName,
    ).toBe('initializePool')
    expect(getModifyPlan(calls[1]).actions).toBe('0x020d14')
  })

  it('batches position-manager calls for claiming multiple positions', () => {
    const calls = [getAddCall({}), getAddCall({ tokenId: 7n })]
    const decoded = decodeFunctionData({
      abi: INFINITY_CL_POSITION_MANAGER_ABI,
      data: encodeCLPositionManagerMulticall(calls),
    })

    expect(decoded.functionName).toBe('multicall')
    expect(decoded.args?.[0]).toEqual(calls)
  })

  it('encodes increase liquidity with the same settlement actions', () => {
    expect(getModifyPlan(getAddCall({ tokenId: 7n })).actions).toBe('0x000d14')
  })

  it('encodes decrease and fee collection using close actions', () => {
    const data = encodeCLPositionManagerDecreaseLiquidityCalldata({
      tokenId: 7n,
      poolKey: POOL_KEY,
      liquidity: 50n,
      amount0Min: 10n,
      amount1Min: 20n,
      recipient: RECIPIENT,
      hookData: '0x1234',
      deadline: 1000n,
    })

    expect(getModifyPlan(data).actions).toBe('0x011212')
  })

  it('encodes take, wrap, and sweep actions for wrapped-native output', () => {
    const data = encodeCLPositionManagerDecreaseLiquidityCalldata({
      tokenId: 7n,
      poolKey: POOL_KEY,
      liquidity: 50n,
      amount0Min: 10n,
      amount1Min: 20n,
      wrapAddress: WRAPPED_NATIVE,
      recipient: RECIPIENT,
      hookData: '0x1234',
      deadline: 1000n,
    })

    expect(getModifyPlan(data).actions).toBe('0x010e121514')
  })

  it('requires a recipient when wrapping native output', () => {
    expect(() =>
      encodeCLPositionManagerDecreaseLiquidityCalldata({
        tokenId: 7n,
        poolKey: POOL_KEY,
        liquidity: 50n,
        amount0Min: 10n,
        amount1Min: 20n,
        wrapAddress: WRAPPED_NATIVE,
        hookData: '0x',
        deadline: 1000n,
      }),
    ).toThrow('A recipient is required when wrapping native currency')
  })
})
