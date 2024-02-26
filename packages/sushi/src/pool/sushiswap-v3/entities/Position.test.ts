import { describe, expect, it } from 'vitest'
import { SushiSwapV3FeeAmount, TICK_SPACINGS } from '../../../config/index.js'
import { Token } from '../../../currency/index.js'
import { Percent } from '../../../math/index.js'
import { encodeSqrtRatioX96 } from '../utils/encodeSqrtRatioX96.js'
import { nearestUsableTick } from '../utils/nearestUsableTick.js'
import { TickMath } from '../utils/tickMath.js'
import { Position } from './Position.js'
import { SushiSwapV3Pool } from './SushiSwapV3Pool.js'

describe('Position', () => {
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
  const POOL_SQRT_RATIO_START = encodeSqrtRatioX96(100e6, 100e18)
  const POOL_TICK_CURRENT = TickMath.getTickAtSqrtRatio(POOL_SQRT_RATIO_START)
  const TICK_SPACING = TICK_SPACINGS[SushiSwapV3FeeAmount.LOW]
  const DAI_USDC_POOL = new SushiSwapV3Pool(
    DAI,
    USDC,
    SushiSwapV3FeeAmount.LOW,
    POOL_SQRT_RATIO_START,
    0,
    POOL_TICK_CURRENT,
    [],
  )

  it('can be constructed around 0 tick', () => {
    const position = new Position({
      pool: DAI_USDC_POOL,
      liquidity: 1,
      tickLower: -10,
      tickUpper: 10,
    })
    expect(position.liquidity).toEqual(1n)
  })

  it('can use min and max ticks', () => {
    const position = new Position({
      pool: DAI_USDC_POOL,
      liquidity: 1,
      tickLower: nearestUsableTick(TickMath.MIN_TICK, TICK_SPACING),
      tickUpper: nearestUsableTick(TickMath.MAX_TICK, TICK_SPACING),
    })
    expect(position.liquidity).toEqual(1n)
  })

  it('tick lower must be less than tick upper', () => {
    expect(
      () =>
        new Position({
          pool: DAI_USDC_POOL,
          liquidity: 1,
          tickLower: 10,
          tickUpper: -10,
        }),
    ).toThrow('TICK_ORDER')
  })

  it('tick lower cannot equal tick upper', () => {
    expect(
      () =>
        new Position({
          pool: DAI_USDC_POOL,
          liquidity: 1,
          tickLower: -10,
          tickUpper: -10,
        }),
    ).toThrow('TICK_ORDER')
  })

  it('tick lower must be multiple of tick spacing', () => {
    expect(
      () =>
        new Position({
          pool: DAI_USDC_POOL,
          liquidity: 1,
          tickLower: -5,
          tickUpper: 10,
        }),
    ).toThrow('TICK_LOWER')
  })

  it('tick lower must be greater than MIN_TICK', () => {
    expect(
      () =>
        new Position({
          pool: DAI_USDC_POOL,
          liquidity: 1,
          tickLower:
            nearestUsableTick(TickMath.MIN_TICK, TICK_SPACING) - TICK_SPACING,
          tickUpper: 10,
        }),
    ).toThrow('TICK_LOWER')
  })

  it('tick upper must be multiple of tick spacing', () => {
    expect(
      () =>
        new Position({
          pool: DAI_USDC_POOL,
          liquidity: 1,
          tickLower: -10,
          tickUpper: 15,
        }),
    ).toThrow('TICK_UPPER')
  })

  it('tick upper must be less than MAX_TICK', () => {
    expect(
      () =>
        new Position({
          pool: DAI_USDC_POOL,
          liquidity: 1,
          tickLower: -10,
          tickUpper:
            nearestUsableTick(TickMath.MAX_TICK, TICK_SPACING) + TICK_SPACING,
        }),
    ).toThrow('TICK_UPPER')
  })

  describe('#amount0', () => {
    it('is correct for price above', () => {
      expect(
        new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e12,
          tickLower:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING,
          tickUpper:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) +
            TICK_SPACING * 2,
        }).amount0.quotient.toString(),
      ).toEqual('49949961958869841')
    })
    it('is correct for price below', () => {
      expect(
        new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) -
            TICK_SPACING * 2,
          tickUpper:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING,
        }).amount0.quotient.toString(),
      ).toEqual('0')
    })
    it('is correct for in-range position', () => {
      expect(
        new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) -
            TICK_SPACING * 2,
          tickUpper:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) +
            TICK_SPACING * 2,
        }).amount0.quotient.toString(),
      ).toEqual('120054069145287995769396')
    })
  })

  describe('#amount1', () => {
    it('is correct for price above', () => {
      expect(
        new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING,
          tickUpper:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) +
            TICK_SPACING * 2,
        }).amount1.quotient.toString(),
      ).toEqual('0')
    })
    it('is correct for price below', () => {
      expect(
        new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) -
            TICK_SPACING * 2,
          tickUpper:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING,
        }).amount1.quotient.toString(),
      ).toEqual('49970077052')
    })
    it('is correct for in-range position', () => {
      expect(
        new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) -
            TICK_SPACING * 2,
          tickUpper:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) +
            TICK_SPACING * 2,
        }).amount1.quotient.toString(),
      ).toEqual('79831926242')
    })
  })

  describe('#mintAmountsWithSlippage', () => {
    describe('0 slippage', () => {
      const slippageTolerance = new Percent(0)

      it('is correct for positions below', () => {
        const position = new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING,
          tickUpper:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) +
            TICK_SPACING * 2,
        })

        const { amount0, amount1 } =
          position.mintAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('49949961958869841738198')
        expect(amount1.toString()).toEqual('0')
      })

      it('is correct for positions above', () => {
        const position = new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) -
            TICK_SPACING * 2,
          tickUpper:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING,
        })

        const { amount0, amount1 } =
          position.mintAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('0')
        expect(amount1.toString()).toEqual('49970077053')
      })

      it('is correct for positions within', () => {
        const position = new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) -
            TICK_SPACING * 2,
          tickUpper:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) +
            TICK_SPACING * 2,
        })

        const { amount0, amount1 } =
          position.mintAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('120054069145287995740584')
        expect(amount1.toString()).toEqual('79831926243')
      })
    })

    describe('.05% slippage', () => {
      const slippageTolerance = new Percent(5, 10000)

      it('is correct for positions below', () => {
        const position = new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING,
          tickUpper:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) +
            TICK_SPACING * 2,
        })

        const { amount0, amount1 } =
          position.mintAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('49949961958869841738198')
        expect(amount1.toString()).toEqual('0')
      })

      it('is correct for positions above', () => {
        const position = new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) -
            TICK_SPACING * 2,
          tickUpper:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING,
        })

        const { amount0, amount1 } =
          position.mintAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('0')
        expect(amount1.toString()).toEqual('49970077053')
      })

      it('is correct for positions within', () => {
        const position = new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) -
            TICK_SPACING * 2,
          tickUpper:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) +
            TICK_SPACING * 2,
        })

        const { amount0, amount1 } =
          position.mintAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('95063440240746211432007')
        expect(amount1.toString()).toEqual('54828800461')
      })
    })

    describe('5% slippage tolerance', () => {
      const slippageTolerance = new Percent(5, 100)

      it('is correct for pool at min price', () => {
        const position = new Position({
          pool: new SushiSwapV3Pool(
            DAI,
            USDC,
            SushiSwapV3FeeAmount.LOW,
            TickMath.MIN_SQRT_RATIO,
            0,
            TickMath.MIN_TICK,
            [],
          ),
          liquidity: 100e18,
          tickLower:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING,
          tickUpper:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) +
            TICK_SPACING * 2,
        })

        const { amount0, amount1 } =
          position.burnAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('49949961958869841754181')
        expect(amount1.toString()).toEqual('0')
      })

      it('is correct for pool at max price', () => {
        const position = new Position({
          pool: new SushiSwapV3Pool(
            DAI,
            USDC,
            SushiSwapV3FeeAmount.LOW,
            TickMath.MAX_SQRT_RATIO - 1n,
            0,
            TickMath.MAX_TICK - 1,
            [],
          ),
          liquidity: 100e18,
          tickLower:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING,
          tickUpper:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) +
            TICK_SPACING * 2,
        })

        const { amount0, amount1 } =
          position.burnAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('0')
        expect(amount1.toString()).toEqual('50045084659')
      })
    })
  })

  describe('#burnAmountsWithSlippage', () => {
    describe('0 slippage', () => {
      const slippageTolerance = new Percent(0)

      it('is correct for positions below', () => {
        const position = new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING,
          tickUpper:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) +
            TICK_SPACING * 2,
        })

        const { amount0, amount1 } =
          position.burnAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('49949961958869841754181')
        expect(amount1.toString()).toEqual('0')
      })

      it('is correct for positions above', () => {
        const position = new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) -
            TICK_SPACING * 2,
          tickUpper:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING,
        })

        const { amount0, amount1 } =
          position.burnAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('0')
        expect(amount1.toString()).toEqual('49970077052')
      })

      it('is correct for positions within', () => {
        const position = new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) -
            TICK_SPACING * 2,
          tickUpper:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) +
            TICK_SPACING * 2,
        })

        const { amount0, amount1 } =
          position.burnAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('120054069145287995769396')
        expect(amount1.toString()).toEqual('79831926242')
      })
    })

    describe('.05% slippage', () => {
      const slippageTolerance = new Percent(5, 10000)

      it('is correct for positions below', () => {
        const position = new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING,
          tickUpper:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) +
            TICK_SPACING * 2,
        })
        const { amount0, amount1 } =
          position.burnAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('49949961958869841754181')
        expect(amount1.toString()).toEqual('0')
      })

      it('is correct for positions above', () => {
        const position = new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) -
            TICK_SPACING * 2,
          tickUpper:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING,
        })
        const { amount0, amount1 } =
          position.burnAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('0')
        expect(amount1.toString()).toEqual('49970077052')
      })

      it('is correct for positions within', () => {
        const position = new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) -
            TICK_SPACING * 2,
          tickUpper:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) +
            TICK_SPACING * 2,
        })
        const { amount0, amount1 } =
          position.burnAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('95063440240746211454822')
        expect(amount1.toString()).toEqual('54828800460')
      })
    })

    describe('5% slippage tolerance', () => {
      const slippageTolerance = new Percent(5, 100)

      it('is correct for pool at min price', () => {
        const position = new Position({
          pool: new SushiSwapV3Pool(
            DAI,
            USDC,
            SushiSwapV3FeeAmount.LOW,
            TickMath.MIN_SQRT_RATIO,
            0,
            TickMath.MIN_TICK,
            [],
          ),
          liquidity: 100e18,
          tickLower:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING,
          tickUpper:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) +
            TICK_SPACING * 2,
        })

        const { amount0, amount1 } =
          position.mintAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('49949961958869841738198')
        expect(amount1.toString()).toEqual('0')
      })

      it('is correct for pool at max price', () => {
        const position = new Position({
          pool: new SushiSwapV3Pool(
            DAI,
            USDC,
            SushiSwapV3FeeAmount.LOW,
            TickMath.MAX_SQRT_RATIO - 1n,
            0,
            TickMath.MAX_TICK - 1,
            [],
          ),
          liquidity: 100e18,
          tickLower:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING,
          tickUpper:
            nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) +
            TICK_SPACING * 2,
        })

        const { amount0, amount1 } =
          position.mintAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('0')
        expect(amount1.toString()).toEqual('50045084660')
      })
    })
  })

  describe('#mintAmounts', () => {
    it('is correct for price above', () => {
      const { amount0, amount1 } = new Position({
        pool: DAI_USDC_POOL,
        liquidity: 100e18,
        tickLower:
          nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING,
        tickUpper:
          nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING * 2,
      }).mintAmounts
      expect(amount0.toString()).toEqual('49949961958869841754182')
      expect(amount1.toString()).toEqual('0')
    })
    it('is correct for price below', () => {
      const { amount0, amount1 } = new Position({
        pool: DAI_USDC_POOL,
        liquidity: 100e18,
        tickLower:
          nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING * 2,
        tickUpper:
          nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING,
      }).mintAmounts
      expect(amount0.toString()).toEqual('0')
      expect(amount1.toString()).toEqual('49970077053')
    })
    it('is correct for in-range position', () => {
      const { amount0, amount1 } = new Position({
        pool: DAI_USDC_POOL,
        liquidity: 100e18,
        tickLower:
          nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING * 2,
        tickUpper:
          nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING * 2,
      }).mintAmounts
      // note these are rounded up
      expect(amount0.toString()).toEqual('120054069145287995769397')
      expect(amount1.toString()).toEqual('79831926243')
    })
  })
})
