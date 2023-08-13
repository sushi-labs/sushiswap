import { TradeType } from '@sushiswap/amm'
import { Amount as CurrencyAmount, Token, WETH9 } from '@sushiswap/currency'

import { FeeAmount, TICK_SPACINGS } from '../constants'
import { encodeSqrtRatioX96, nearestUsableTick, TickMath } from '../utils'
import { Route, SushiSwapV3Pool, Trade } from '.'
import { SwapQuoter } from './Quoter'

describe('SwapQuoter', () => {
  const token0 = new Token({
    chainId: 1,
    address: '0x0000000000000000000000000000000000000001',
    decimals: 18,
    symbol: 't0',
    name: 'token0',
  })
  const token1 = new Token({
    chainId: 1,
    address: '0x0000000000000000000000000000000000000002',
    decimals: 18,
    symbol: 't1',
    name: 'token1',
  })

  const feeAmount = FeeAmount.MEDIUM
  const sqrtRatioX96 = encodeSqrtRatioX96(1, 1)
  const liquidity = 1_000_000
  const WETH = WETH9[1]

  const makePool = (token0: Token, token1: Token) => {
    return new SushiSwapV3Pool(
      token0,
      token1,
      feeAmount,
      sqrtRatioX96,
      liquidity,
      TickMath.getTickAtSqrtRatio(sqrtRatioX96),
      [
        {
          index: nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[feeAmount]),
          liquidityNet: liquidity,
          liquidityGross: liquidity,
        },
        {
          index: nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[feeAmount]),
          liquidityNet: -liquidity,
          liquidityGross: liquidity,
        },
      ]
    )
  }

  const pool_0_1 = makePool(token0, token1)
  const pool_1_weth = makePool(token1, WETH)

  describe('#swapCallParameters', () => {
    describe('single trade input', () => {
      it('single-hop exact input', async () => {
        const trade = await Trade.fromRoute(
          new Route([pool_0_1], token0, token1),
          CurrencyAmount.fromRawAmount(token0, 100),
          TradeType.EXACT_INPUT
        )
        const { calldata, value } = SwapQuoter.quoteCallParameters(
          trade.swaps[0].route,
          trade.inputAmount,
          trade.tradeType
        )

        expect(calldata).toBe(
          '0xf7729d43000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000bb800000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000000'
        )
        expect(value).toBe('0x00')
      })

      it('single-hop exact output', async () => {
        const trade = await Trade.fromRoute(
          new Route([pool_0_1], token0, token1),
          CurrencyAmount.fromRawAmount(token1, 100),
          TradeType.EXACT_OUTPUT
        )
        const { calldata, value } = SwapQuoter.quoteCallParameters(
          trade.swaps[0].route,
          trade.outputAmount,
          trade.tradeType
        )

        expect(calldata).toBe(
          '0x30d07f21000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000bb800000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000000'
        )
        expect(value).toBe('0x00')
      })

      it('multi-hop exact input', async () => {
        const trade = await Trade.fromRoute(
          new Route([pool_0_1, pool_1_weth], token0, WETH),
          CurrencyAmount.fromRawAmount(token0, 100),
          TradeType.EXACT_INPUT
        )
        const { calldata, value } = SwapQuoter.quoteCallParameters(trade.route, trade.inputAmount, trade.tradeType)

        expect(calldata).toBe(
          '0xcdca17530000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000000420000000000000000000000000000000000000001000bb80000000000000000000000000000000000000002000bb8c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000000000000000'
        )
        expect(value).toBe('0x00')
      })

      it('multi-hop exact output', async () => {
        const trade = await Trade.fromRoute(
          new Route([pool_0_1, pool_1_weth], token0, WETH),
          CurrencyAmount.fromRawAmount(WETH, 100),
          TradeType.EXACT_OUTPUT
        )
        const { calldata, value } = SwapQuoter.quoteCallParameters(trade.route, trade.outputAmount, trade.tradeType)

        expect(calldata).toBe(
          '0x2f80bb1d000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000042c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000bb80000000000000000000000000000000000000002000bb80000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000'
        )
        expect(value).toBe('0x00')
      })
      it('sqrtPriceLimitX96', async () => {
        const trade = await Trade.fromRoute(
          new Route([pool_0_1], token0, token1),
          CurrencyAmount.fromRawAmount(token0, 100),
          TradeType.EXACT_INPUT
        )
        const { calldata, value } = SwapQuoter.quoteCallParameters(trade.route, trade.inputAmount, trade.tradeType, {
          sqrtPriceLimitX96: 2n ** 128n,
        })

        expect(calldata).toBe(
          '0xf7729d43000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000bb800000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000100000000000000000000000000000000'
        )
        expect(value).toBe('0x00')
      })
    })
    describe('single trade input using Quoter V2', () => {
      it('single-hop exact output', async () => {
        const trade = await Trade.fromRoute(
          new Route([pool_0_1], token0, token1),
          CurrencyAmount.fromRawAmount(token1, 100),
          TradeType.EXACT_OUTPUT
        )

        const { calldata, value } = SwapQuoter.quoteCallParameters(
          trade.swaps[0].route,
          trade.outputAmount,
          trade.tradeType,
          {
            useQuoterV2: true,
          }
        )

        expect(calldata).toBe(
          '0xbd21704a0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000bb80000000000000000000000000000000000000000000000000000000000000000'
        )
        expect(value).toBe('0x00')
      })
      it('single-hop exact input', async () => {
        const trade = await Trade.fromRoute(
          new Route([pool_0_1], token0, token1),
          CurrencyAmount.fromRawAmount(token0, 100),
          TradeType.EXACT_INPUT
        )
        const { calldata, value } = SwapQuoter.quoteCallParameters(
          trade.swaps[0].route,
          trade.inputAmount,
          trade.tradeType,
          { useQuoterV2: true }
        )

        expect(calldata).toBe(
          '0xc6a5026a0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000bb80000000000000000000000000000000000000000000000000000000000000000'
        )
        expect(value).toBe('0x00')
      })
    })
  })
})
