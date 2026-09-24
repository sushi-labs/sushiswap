import { Percent } from 'sushi'
import {
  EvmChainId,
  EvmToken,
  NonfungiblePositionManager,
  Position,
  SushiSwapV3FeeAmount,
  SushiSwapV3Pool,
  USDC,
  encodeSqrtRatioX96,
  nonfungiblePositionManagerAbi_createAndInitializePoolIfNecessary,
  nonfungiblePositionManagerAbi_increaseLiquidity,
  nonfungiblePositionManagerAbi_mint,
  nonfungiblePositionManagerAbi_multicall,
  nonfungiblePositionManagerAbi_refundETH,
} from 'sushi/evm'
import { type Hex, decodeFunctionData } from 'viem'
import { describe, expect, it } from 'vitest'
import { withArcPositionManagerRefund } from './arc-position-manager-refund'

const manager = '0xf27f32580a399bDb55b6E1F025B8985c97e2A9D5' as const
const recipient = '0x0000000000000000000000000000000000000001'
const pool = new SushiSwapV3Pool(
  USDC[EvmChainId.ARC],
  new EvmToken({
    chainId: EvmChainId.ARC,
    address: '0x5000000000000000000000000000000000000000',
    decimals: 6,
    symbol: 'TEST',
    name: 'Test',
  }),
  SushiSwapV3FeeAmount.MEDIUM,
  encodeSqrtRatioX96(1, 1),
  0,
  0,
  [],
)
const position = new Position({
  pool,
  tickLower: -60,
  tickUpper: 60,
  liquidity: 1_000_000n,
})
const options = {
  slippageTolerance: new Percent({ numerator: 1, denominator: 1000 }),
  deadline: '2000000000',
}

function protect(calldata: Hex, value = 0n) {
  return withArcPositionManagerRefund({
    chainId: EvmChainId.ARC,
    positionManager: manager,
    calldata,
    value,
  })
}

function unwrapProtected(calldata: Hex) {
  const { args } = decodeFunctionData({
    abi: nonfungiblePositionManagerAbi_multicall,
    data: calldata,
  })
  expect(args[0]).toHaveLength(2)
  expect(
    decodeFunctionData({
      abi: nonfungiblePositionManagerAbi_refundETH,
      data: args[0][0],
    }).functionName,
  ).toBe('refundETH')
  return args[0][1]
}

describe('legacy Arc NPM atomic refund', () => {
  it('prepends refund to an ERC20 mint without changing recipient, slippage, or deadline', () => {
    const original = NonfungiblePositionManager.addCallParameters(position, {
      ...options,
      recipient,
    })
    const result = protect(original.calldata as Hex, BigInt(original.value))
    expect(result.value).toBe(0n)
    const mintData = unwrapProtected(result.calldata)
    expect(mintData).toBe(original.calldata)
    const { args } = decodeFunctionData({
      abi: nonfungiblePositionManagerAbi_mint,
      data: mintData,
    })
    expect(args[0].recipient).toBe(recipient)
    expect(args[0].deadline).toBe(2_000_000_000n)
    expect(args[0].amount0Min).toBeGreaterThan(0n)
    expect(args[0].amount1Min).toBeGreaterThan(0n)
  })

  it('prepends refund to an increase while retaining the existing NFT ID', () => {
    const original = NonfungiblePositionManager.addCallParameters(position, {
      ...options,
      tokenId: '42',
    })
    const result = protect(original.calldata as Hex, BigInt(original.value))
    const increaseData = unwrapProtected(result.calldata)
    expect(increaseData).toBe(original.calldata)
    expect(
      decodeFunctionData({
        abi: nonfungiblePositionManagerAbi_increaseLiquidity,
        data: increaseData,
      }).args[0].tokenId,
    ).toBe(42n)
    expect(result.value).toBe(0n)
  })

  it('keeps the SDK create-pool/mint multicall nested after cleanup in its original order', () => {
    const original = NonfungiblePositionManager.addCallParameters(position, {
      ...options,
      recipient,
      createPool: true,
    })
    const result = protect(original.calldata as Hex, BigInt(original.value))
    const nestedData = unwrapProtected(result.calldata)
    expect(nestedData).toBe(original.calldata)
    const { args } = decodeFunctionData({
      abi: nonfungiblePositionManagerAbi_multicall,
      data: nestedData,
    })
    expect(args[0]).toHaveLength(2)
    expect(
      decodeFunctionData({
        abi: nonfungiblePositionManagerAbi_createAndInitializePoolIfNecessary,
        data: args[0][0],
      }).functionName,
    ).toBe('createAndInitializePoolIfNecessary')
    expect(
      decodeFunctionData({
        abi: nonfungiblePositionManagerAbi_mint,
        data: args[0][1],
      }).functionName,
    ).toBe('mint')
    expect(result.value).toBe(0n)
  })

  it('recognizes the legacy manager regardless of address casing', () => {
    const original = NonfungiblePositionManager.addCallParameters(position, {
      ...options,
      recipient,
    })
    const result = withArcPositionManagerRefund({
      chainId: EvmChainId.ARC,
      positionManager: '0xf27f32580a399bdb55b6e1f025b8985c97e2a9d5',
      calldata: original.calldata as Hex,
      value: 0n,
    })
    expect(unwrapProtected(result.calldata)).toBe(original.calldata)
  })

  it('preserves calldata and native value on other chains even at the same address', () => {
    const calldata = '0x1234' as const
    expect(
      withArcPositionManagerRefund({
        chainId: EvmChainId.ETHEREUM,
        positionManager: manager,
        calldata,
        value: 10n ** 18n,
      }),
    ).toEqual({ calldata, value: 10n ** 18n })
  })

  it('does not apply the legacy workaround to a different Arc manager', () => {
    const calldata = '0x1234' as const
    expect(
      withArcPositionManagerRefund({
        chainId: EvmChainId.ARC,
        positionManager: '0x0000000000000000000000000000000000000002',
        calldata,
        value: 0n,
      }),
    ).toEqual({ calldata, value: 0n })
  })

  it('rejects accidental native funding instead of returning it and silently spending ERC20 tokens', () => {
    expect(() => protect('0x1234', 1n)).toThrow('zero native transaction value')
  })
})
