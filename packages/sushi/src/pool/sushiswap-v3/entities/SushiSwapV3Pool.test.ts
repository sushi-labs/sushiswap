import { beforeEach, describe, expect, it } from 'vitest'
import { SushiSwapV3FeeAmount, TICK_SPACINGS } from '../../../config/index.js'
import {
  Amount as CurrencyAmount,
  Token,
  WETH9,
} from '../../../currency/index.js'
import { encodeSqrtRatioX96 } from '../utils/encodeSqrtRatioX96.js'
import { nearestUsableTick } from '../utils/nearestUsableTick.js'
import { TickMath } from '../utils/tickMath.js'
import { SushiSwapV3Pool } from './SushiSwapV3Pool.js'

const ONE_ETHER = 10n ** 18n

describe('SushiSwapV3Pool', () => {
  const USDC = new Token({
    chainId: 1,
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  })
  const DAI = new Token({
    chainId: 1,
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    decimals: 18,
    symbol: 'DAI',
    name: 'Dai Stablecoin',
  })

  describe('constructor', () => {
    it('cannot be used for tokens on different chains', () => {
      expect(() => {
        new SushiSwapV3Pool(
          USDC,
          WETH9[137],
          SushiSwapV3FeeAmount.MEDIUM,
          encodeSqrtRatioX96(1, 1),
          0,
          0,
          [],
        )
      }).toThrow('CHAIN_IDS')
    })

    it('fee must be integer', () => {
      expect(() => {
        new SushiSwapV3Pool(
          USDC,
          WETH9[1],
          SushiSwapV3FeeAmount.MEDIUM + 0.5,
          encodeSqrtRatioX96(1, 1),
          0,
          0,
          [],
        )
      }).toThrow('FEE')
    })

    it('fee cannot be more than 1e6', () => {
      expect(() => {
        new SushiSwapV3Pool(
          USDC,
          WETH9[1],
          1e6 as SushiSwapV3FeeAmount,
          encodeSqrtRatioX96(1, 1),
          0,
          0,
          [],
        )
      }).toThrow('FEE')
    })

    it('cannot be given two of the same token', () => {
      expect(() => {
        new SushiSwapV3Pool(
          USDC,
          USDC,
          SushiSwapV3FeeAmount.MEDIUM,
          encodeSqrtRatioX96(1, 1),
          0,
          0,
          [],
        )
      }).toThrow('ADDRESSES')
    })

    it('price must be within tick price bounds', () => {
      expect(() => {
        new SushiSwapV3Pool(
          USDC,
          WETH9[1],
          SushiSwapV3FeeAmount.MEDIUM,
          encodeSqrtRatioX96(1, 1),
          0,
          1,
          [],
        )
      }).toThrow('PRICE_BOUNDS')
      expect(() => {
        new SushiSwapV3Pool(
          USDC,
          WETH9[1],
          SushiSwapV3FeeAmount.MEDIUM,
          encodeSqrtRatioX96(1, 1) + 1n,
          0,
          -1,
          [],
        )
      }).toThrow('PRICE_BOUNDS')
    })

    it('works with valid arguments for empty pool medium fee', () => {
      new SushiSwapV3Pool(
        USDC,
        WETH9[1],
        SushiSwapV3FeeAmount.MEDIUM,
        encodeSqrtRatioX96(1, 1),
        0,
        0,
        [],
      )
    })

    it('works with valid arguments for empty pool low fee', () => {
      new SushiSwapV3Pool(
        USDC,
        WETH9[1],
        SushiSwapV3FeeAmount.LOW,
        encodeSqrtRatioX96(1, 1),
        0,
        0,
        [],
      )
    })

    it('works with valid arguments for empty pool lowest fee', () => {
      new SushiSwapV3Pool(
        USDC,
        WETH9[1],
        SushiSwapV3FeeAmount.LOWEST,
        encodeSqrtRatioX96(1, 1),
        0,
        0,
        [],
      )
    })

    it('works with valid arguments for empty pool high fee', () => {
      new SushiSwapV3Pool(
        USDC,
        WETH9[1],
        SushiSwapV3FeeAmount.HIGH,
        encodeSqrtRatioX96(1, 1),
        0,
        0,
        [],
      )
    })
  })

  describe('#getAddress', () => {
    it('matches an example', () => {
      const result = SushiSwapV3Pool.getAddress(
        USDC,
        DAI,
        SushiSwapV3FeeAmount.LOW,
      )
      expect(result).toEqual('0x3cb60c075797f2C4f158c066F54B144A5c3F60AA')
    })
  })

  describe('#token0', () => {
    it('always is the token that sorts before', () => {
      let pool = new SushiSwapV3Pool(
        USDC,
        DAI,
        SushiSwapV3FeeAmount.LOW,
        encodeSqrtRatioX96(1, 1),
        0,
        0,
        [],
      )
      expect(pool.token0).toEqual(DAI)
      pool = new SushiSwapV3Pool(
        DAI,
        USDC,
        SushiSwapV3FeeAmount.LOW,
        encodeSqrtRatioX96(1, 1),
        0,
        0,
        [],
      )
      expect(pool.token0).toEqual(DAI)
    })
  })
  describe('#token1', () => {
    it('always is the token that sorts after', () => {
      let pool = new SushiSwapV3Pool(
        USDC,
        DAI,
        SushiSwapV3FeeAmount.LOW,
        encodeSqrtRatioX96(1, 1),
        0,
        0,
        [],
      )
      expect(pool.token1).toEqual(USDC)
      pool = new SushiSwapV3Pool(
        DAI,
        USDC,
        SushiSwapV3FeeAmount.LOW,
        encodeSqrtRatioX96(1, 1),
        0,
        0,
        [],
      )
      expect(pool.token1).toEqual(USDC)
    })
  })

  describe('#token0Price', () => {
    it('returns price of token0 in terms of token1', () => {
      expect(
        new SushiSwapV3Pool(
          USDC,
          DAI,
          SushiSwapV3FeeAmount.LOW,
          encodeSqrtRatioX96(101e6, 100e18),
          0,
          TickMath.getTickAtSqrtRatio(encodeSqrtRatioX96(101e6, 100e18)),
          [],
        ).token0Price.toSignificant(5),
      ).toEqual('1.01')
      expect(
        new SushiSwapV3Pool(
          DAI,
          USDC,
          SushiSwapV3FeeAmount.LOW,
          encodeSqrtRatioX96(101e6, 100e18),
          0,
          TickMath.getTickAtSqrtRatio(encodeSqrtRatioX96(101e6, 100e18)),
          [],
        ).token0Price.toSignificant(5),
      ).toEqual('1.01')
    })
  })

  describe('#token1Price', () => {
    it('returns price of token1 in terms of token0', () => {
      expect(
        new SushiSwapV3Pool(
          USDC,
          DAI,
          SushiSwapV3FeeAmount.LOW,
          encodeSqrtRatioX96(101e6, 100e18),
          0,
          TickMath.getTickAtSqrtRatio(encodeSqrtRatioX96(101e6, 100e18)),
          [],
        ).token1Price.toSignificant(5),
      ).toEqual('0.9901')
      expect(
        new SushiSwapV3Pool(
          DAI,
          USDC,
          SushiSwapV3FeeAmount.LOW,
          encodeSqrtRatioX96(101e6, 100e18),
          0,
          TickMath.getTickAtSqrtRatio(encodeSqrtRatioX96(101e6, 100e18)),
          [],
        ).token1Price.toSignificant(5),
      ).toEqual('0.9901')
    })
  })

  describe('#priceOf', () => {
    const pool = new SushiSwapV3Pool(
      USDC,
      DAI,
      SushiSwapV3FeeAmount.LOW,
      encodeSqrtRatioX96(1, 1),
      0,
      0,
      [],
    )
    it('returns price of token in terms of other token', () => {
      expect(pool.priceOf(DAI)).toEqual(pool.token0Price)
      expect(pool.priceOf(USDC)).toEqual(pool.token1Price)
    })

    it('throws if invalid token', () => {
      expect(() => pool.priceOf(WETH9[1])).toThrow('TOKEN')
    })
  })

  describe('#chainId', () => {
    it('returns the token0 chainId', () => {
      let pool = new SushiSwapV3Pool(
        USDC,
        DAI,
        SushiSwapV3FeeAmount.LOW,
        encodeSqrtRatioX96(1, 1),
        0,
        0,
        [],
      )
      expect(pool.chainId).toEqual(1)
      pool = new SushiSwapV3Pool(
        DAI,
        USDC,
        SushiSwapV3FeeAmount.LOW,
        encodeSqrtRatioX96(1, 1),
        0,
        0,
        [],
      )
      expect(pool.chainId).toEqual(1)
    })
  })

  describe('#involvesToken', () => {
    it('involves token', () => {
      const pool = new SushiSwapV3Pool(
        USDC,
        DAI,
        SushiSwapV3FeeAmount.LOW,
        encodeSqrtRatioX96(1, 1),
        0,
        0,
        [],
      )
      expect(pool.involvesToken(USDC)).toEqual(true)
      expect(pool.involvesToken(DAI)).toEqual(true)
      expect(pool.involvesToken(WETH9[1])).toEqual(false)
    })
  })

  describe('swaps', () => {
    let pool: SushiSwapV3Pool

    beforeEach(() => {
      pool = new SushiSwapV3Pool(
        USDC,
        DAI,
        SushiSwapV3FeeAmount.LOW,
        encodeSqrtRatioX96(1, 1),
        ONE_ETHER,
        0,
        [
          {
            index: nearestUsableTick(
              TickMath.MIN_TICK,
              TICK_SPACINGS[SushiSwapV3FeeAmount.LOW],
            ),
            liquidityNet: ONE_ETHER,
            liquidityGross: ONE_ETHER,
          },
          {
            index: nearestUsableTick(
              TickMath.MAX_TICK,
              TICK_SPACINGS[SushiSwapV3FeeAmount.LOW],
            ),
            liquidityNet: ONE_ETHER * -1n,
            liquidityGross: ONE_ETHER,
          },
        ],
      )
    })

    describe('#getOutputAmount', () => {
      it('USDC -> DAI', async () => {
        const inputAmount = CurrencyAmount.fromRawAmount(USDC, 100)
        const [outputAmount] = await pool.getOutputAmount(inputAmount)
        expect(outputAmount.currency.equals(DAI)).toBe(true)
        expect(outputAmount.quotient).toEqual(98n)
      })

      it('DAI -> USDC', async () => {
        const inputAmount = CurrencyAmount.fromRawAmount(DAI, 100)
        const [outputAmount] = await pool.getOutputAmount(inputAmount)
        expect(outputAmount.currency.equals(USDC)).toBe(true)
        expect(outputAmount.quotient).toEqual(98n)
      })
    })

    describe('#getInputAmount', () => {
      it('USDC -> DAI', async () => {
        const outputAmount = CurrencyAmount.fromRawAmount(DAI, 98)
        const [inputAmount] = await pool.getInputAmount(outputAmount)
        expect(inputAmount.currency.equals(USDC)).toBe(true)
        expect(inputAmount.quotient).toEqual(100n)
      })

      it('DAI -> USDC', async () => {
        const outputAmount = CurrencyAmount.fromRawAmount(USDC, 98)
        const [inputAmount] = await pool.getInputAmount(outputAmount)
        expect(inputAmount.currency.equals(DAI)).toBe(true)
        expect(inputAmount.quotient).toEqual(100n)
      })
    })
  })

  describe('#bigNums', () => {
    let pool: SushiSwapV3Pool
    const bigNum1 = BigInt(Number.MAX_SAFE_INTEGER) + 1n
    const bigNum2 = BigInt(Number.MAX_SAFE_INTEGER) + 1n
    beforeEach(() => {
      pool = new SushiSwapV3Pool(
        USDC,
        DAI,
        SushiSwapV3FeeAmount.LOW,
        encodeSqrtRatioX96(bigNum1, bigNum2),
        ONE_ETHER,
        0,
        [
          {
            index: nearestUsableTick(
              TickMath.MIN_TICK,
              TICK_SPACINGS[SushiSwapV3FeeAmount.LOW],
            ),
            liquidityNet: ONE_ETHER,
            liquidityGross: ONE_ETHER,
          },
          {
            index: nearestUsableTick(
              TickMath.MAX_TICK,
              TICK_SPACINGS[SushiSwapV3FeeAmount.LOW],
            ),
            liquidityNet: ONE_ETHER * -1n,
            liquidityGross: ONE_ETHER,
          },
        ],
      )
    })

    describe('#priceLimit', () => {
      it('correctly compares two BigIntegers', async () => {
        expect(bigNum1).toEqual(bigNum2)
      })
      it('correctly handles two BigIntegers', async () => {
        const inputAmount = CurrencyAmount.fromRawAmount(USDC, 100)
        const [outputAmount] = await pool.getOutputAmount(inputAmount)
        pool.getInputAmount(outputAmount)
        expect(outputAmount.currency.equals(DAI)).toBe(true)
        // if output is correct, function has succeeded
      })
    })
  })
})
