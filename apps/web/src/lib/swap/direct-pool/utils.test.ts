import type { UseEvmTradeReturn } from 'src/lib/hooks/react-query'
import { Amount, Fraction, Percent, Price } from 'sushi'
import {
  EvmChainId,
  type EvmCurrency,
  EvmNative,
  EvmToken,
  USDC,
} from 'sushi/evm'
import {
  type Address,
  type Hex,
  decodeFunctionData,
  getAddress,
  parseAbi,
} from 'viem'
import { describe, expect, it } from 'vitest'
import type { DirectPool } from './types'
import {
  applyOutputFee,
  encodeDirectPoolSwap,
  getBetterTrade,
  getDirectPoolGasCost,
  getDirectPoolQuoteContractParameters,
  isDirectPoolPair,
} from './utils'

const launchToken = new EvmToken({
  chainId: EvmChainId.ROBINHOOD,
  address: '0x66175075f60c893456ee6a0237ed0f548a9023a2',
  decimals: 18,
  symbol: 'SUSHICAT',
  name: 'Sushi Cat',
})
const weth = EvmNative.fromChainId(EvmChainId.ROBINHOOD).wrap()
const native = EvmNative.fromChainId(EvmChainId.ROBINHOOD)
const recipient = '0x56d1670070C8f015c5c5ADF717b8B04012d353C2'
const directPool: DirectPool = {
  address: '0x0da374E5fEFb5cCBCaBd2113Bd7700232fC5B84F',
  quoteTokenAddress: weth.address,
  launchTokenAddress: launchToken.address,
  feeTier: 10_000,
}

const redSnwapperAbi = parseAbi([
  'function snwap(address tokenIn, uint256 amountIn, address recipient, address tokenOut, uint256 amountOutMin, address executor, bytes executorData) payable returns (uint256 amountOut)',
])
const routeProcessorAbi = parseAbi([
  'function processRouteWithTransferValueOutput(address transferValueTo, uint256 amountValueTransfer, address tokenIn, uint256 amountIn, address tokenOut, uint256 amountOutQuote, address to, bytes route, bool takeSurplus, uint32 referralCode) payable returns (uint256 amountOut)',
])

function makeTrade(
  amountOut: bigint,
  routingSource?: string,
): UseEvmTradeReturn {
  const amountIn = new Amount<EvmCurrency>(weth, 1n)
  const output = new Amount<EvmCurrency>(launchToken, amountOut)

  return {
    swapPrice: new Price({ baseAmount: amountIn, quoteAmount: output }),
    priceImpact: new Percent(0),
    amountIn,
    amountOut: output,
    minAmountOut: output,
    gasSpent: undefined,
    gasSpentUsd: undefined,
    route: undefined,
    status: 'Success',
    tx: undefined,
    tokenTax: undefined,
    fee: undefined,
    routingSource,
  }
}

function decodeCommands(data: Hex): {
  executor: Address
  feeAmount: bigint
  route: Hex
  tokenIn: Address
  tokenOut: Address
} {
  const outer = decodeFunctionData({ abi: redSnwapperAbi, data })
  if (outer.functionName !== 'snwap') throw new Error('Unexpected outer call')

  const inner = decodeFunctionData({
    abi: routeProcessorAbi,
    data: outer.args[6],
  })
  if (inner.functionName !== 'processRouteWithTransferValueOutput') {
    throw new Error('Unexpected executor')
  }

  return {
    executor: outer.args[5],
    feeAmount: inner.args[1],
    route: inner.args[7],
    tokenIn: outer.args[0],
    tokenOut: outer.args[3],
  }
}

describe('direct pool route', () => {
  it('treats native ETH and WETH as the same quote asset', () => {
    expect(
      isDirectPoolPair({
        chainId: EvmChainId.ROBINHOOD,
        fromToken: native,
        toToken: launchToken,
        directPool,
      }),
    ).toBe(true)
    expect(
      isDirectPoolPair({
        chainId: EvmChainId.ROBINHOOD,
        fromToken: launchToken,
        toToken: native,
        directPool,
      }),
    ).toBe(true)
  })

  it('rejects pairs that do not use the configured quote asset', () => {
    const otherToken = new EvmToken({
      chainId: EvmChainId.ROBINHOOD,
      address: '0x4444444444444444444444444444444444444444',
      decimals: 18,
      symbol: 'OTHER',
      name: 'Other',
    })

    expect(
      isDirectPoolPair({
        chainId: EvmChainId.ROBINHOOD,
        fromToken: otherToken,
        toToken: launchToken,
        directPool,
      }),
    ).toBe(false)
    expect(
      isDirectPoolPair({
        chainId: EvmChainId.ROBINHOOD,
        fromToken: native,
        toToken: launchToken,
        directPool: undefined,
      }),
    ).toBe(false)
  })

  it('selects the better complete swap, including its transaction source', () => {
    const aggregator = makeTrade(100n, 'Aggregator')
    const direct = makeTrade(101n, 'Direct pool')

    expect(getBetterTrade(aggregator, direct)).toBe(direct)
    expect(getBetterTrade(aggregator, makeTrade(99n, 'Direct pool'))).toBe(
      aggregator,
    )
    expect(getBetterTrade(undefined, direct)).toBe(direct)
  })

  it('falls back to the direct swap when the aggregator cannot quote', () => {
    const aggregator = {
      ...makeTrade(101n, 'Aggregator'),
      status: 'NoWay',
    }
    const direct = makeTrade(100n, 'Direct pool')

    expect(getBetterTrade(aggregator, direct)).toBe(direct)
  })

  it('preserves a no-route result when no executable alternative exists', () => {
    const aggregator = {
      ...makeTrade(0n, 'Aggregator'),
      status: 'NoWay',
    }

    expect(getBetterTrade(aggregator, undefined)).toBe(aggregator)
  })

  it('keeps the aggregator swap when the direct simulation fails', () => {
    const aggregator = makeTrade(100n, 'Aggregator')

    expect(getBetterTrade(aggregator, undefined)).toBe(aggregator)
  })

  it('retains the configured frontend fee in net output', () => {
    expect(applyOutputFee(10_000n, 0.0035)).toBe(9_965n)
    expect(applyOutputFee(10_000n, 0.01)).toBe(9_900n)
  })

  it('reports estimated gas in native and USD terms', () => {
    expect(
      getDirectPoolGasCost({
        chainId: EvmChainId.ROBINHOOD,
        estimatedGas: 100_000n,
        gasPrice: 1_000_000_000n,
        nativePrice: new Fraction(2_000),
      }),
    ).toEqual({
      gasSpent: '0.00018',
      gasSpentUsd: '0.36',
    })
    expect(
      getDirectPoolGasCost({
        chainId: EvmChainId.ROBINHOOD,
        estimatedGas: 100_000n,
        gasPrice: undefined,
        nativePrice: new Fraction(2_000),
      }),
    ).toEqual({
      gasSpent: undefined,
      gasSpentUsd: undefined,
    })
  })

  it('wraps native input before a single-hop buy', () => {
    const { data, value } = encodeDirectPoolSwap({
      amountIn: 1_000n,
      amountOut: 10_000n,
      amountOutMin: 900n,
      chainId: EvmChainId.ROBINHOOD,
      fee: 0.0035,
      fromToken: native,
      poolAddress: directPool.address,
      recipient,
      toToken: launchToken,
    })

    expect(value).toBe(1_000n)
    expect(decodeCommands(data)).toMatchObject({
      executor: '0x0e867974275Cd31C25015C2753C9d75F9f355379',
      feeAmount: 35n,
      route: expect.stringContaining(directPool.address.slice(2).toLowerCase()),
      tokenIn: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      tokenOut: getAddress(launchToken.address),
    })
  })

  it('uses the same launch pool directly for WETH input', () => {
    const { data, value } = encodeDirectPoolSwap({
      amountIn: 1_000n,
      amountOut: 10_000n,
      amountOutMin: 900n,
      chainId: EvmChainId.ROBINHOOD,
      fee: 0.0035,
      fromToken: weth,
      poolAddress: directPool.address,
      recipient,
      toToken: launchToken,
    })
    const decoded = decodeCommands(data)

    expect(value).toBe(0n)
    expect(decoded.route).toMatch(
      new RegExp(
        `^0x010000000000000201${weth.address.slice(2)}01ffff01${directPool.address.slice(2)}`,
        'i',
      ),
    )
  })

  it('unwraps WETH output after a single-hop sell', () => {
    const { data, value } = encodeDirectPoolSwap({
      amountIn: 1_000n,
      amountOut: 10_000n,
      amountOutMin: 900n,
      chainId: EvmChainId.ROBINHOOD,
      fee: 0.01,
      fromToken: launchToken,
      poolAddress: directPool.address,
      recipient,
      toToken: native,
    })

    expect(value).toBe(0n)
    const decoded = decodeCommands(data)
    expect(decoded).toMatchObject({
      feeAmount: 100n,
      tokenIn: getAddress(launchToken.address),
      tokenOut: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    })
    expect(decoded.route.toLowerCase()).toContain(
      `01${weth.address.slice(2).toLowerCase()}01ffff0200`,
    )
  })
})

describe('Arc direct pool swaps', () => {
  const chainId = EvmChainId.ARC
  const usdc = USDC[chainId]
  const token = new EvmToken({
    chainId,
    address: '0xb96022bdfe1aa1d12e8925e57111204b2c711b60',
    decimals: 18,
    symbol: 'USDCAT',
    name: 'USDCAT',
  })
  const pool = {
    address: '0xcfff2b70c3c6159521440ff1d8d5d794d18c8975',
    quoteTokenAddress: usdc.address,
    launchTokenAddress: token.address,
    feeTier: 10_000,
  } as const

  it.each(['buy', 'sell'])('encodes a direct ERC-20 %s on Arc', (side) => {
    const fromToken = side === 'buy' ? usdc : token
    const toToken = side === 'buy' ? token : usdc
    expect(
      isDirectPoolPair({ chainId, fromToken, toToken, directPool: pool }),
    ).toBe(true)
    const { data, value } = encodeDirectPoolSwap({
      chainId,
      fromToken,
      toToken,
      poolAddress: pool.address,
      recipient,
      amountIn: 100_000n,
      amountOut: 10_000n,
      amountOutMin: 9_000n,
      fee: 0.01,
    })
    expect(value).toBe(0n)
    const decoded = decodeCommands(data)
    expect(decoded).toMatchObject({
      executor: getAddress('0x7906320f8247E36dD9b7B005C8DC740ED4EcC29D'),
      tokenIn: getAddress(fromToken.address),
      tokenOut: getAddress(toToken.address),
      feeAmount: 100n,
    })
    expect(decoded.route.toLowerCase()).toContain(pool.address.slice(2))
    expect(
      getDirectPoolQuoteContractParameters({
        chainId,
        amount: 100_000n,
        feeTier: pool.feeTier,
        tokenIn: fromToken.address,
        tokenOut: toToken.address,
      }).address.toLowerCase(),
    ).toBe('0x475d8dab6decbbf89db860d2673f2472fa58e5f4')
  })

  it('rejects native USDC instead of treating 18-decimal units as ERC-20 units', () => {
    const fromToken = EvmNative.fromChainId(chainId)
    expect(
      isDirectPoolPair({
        chainId,
        fromToken,
        toToken: token,
        directPool: pool,
      }),
    ).toBe(false)
    expect(() =>
      encodeDirectPoolSwap({
        chainId,
        fromToken,
        toToken: token,
        poolAddress: pool.address,
        recipient,
        amountIn: 100_000n,
        amountOut: 10_000n,
        amountOutMin: 9_000n,
        fee: 0.01,
      }),
    ).toThrow('Native wrapping is not supported')
  })
})
