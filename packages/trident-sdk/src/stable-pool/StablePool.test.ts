import { ChainId } from '@sushiswap/chain'
import { Amount, Price, Token, USDC_ADDRESS, WETH9, WETH9_ADDRESS } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'
import { stablePoolFactoryAddress } from '@sushiswap/trident-core'

import { InsufficientInputAmountError } from '../errors'
import { computeStablePoolAddress } from './computeStablePoolAddress'
import { StablePool } from './StablePool'

describe('computePoolAddress', () => {
  it('should correctly compute the pool address', () => {
    const tokenA = new Token({
      chainId: ChainId.OPTIMISM,
      address: USDC_ADDRESS[ChainId.OPTIMISM],
      decimals: 6,
      symbol: 'USDC',
      name: 'USD Coin',
    })
    const tokenB = new Token({
      chainId: ChainId.OPTIMISM,
      address: WETH9_ADDRESS[ChainId.OPTIMISM],
      decimals: 18,
      symbol: 'WETH',
      name: 'Wrapped Ether',
    })

    expect(tokenA.address).toEqual(USDC_ADDRESS[ChainId.OPTIMISM])
    expect(tokenB.address).toEqual(WETH9_ADDRESS[ChainId.OPTIMISM])

    const fee = 30

    const address = computeStablePoolAddress({
      factoryAddress: stablePoolFactoryAddress[ChainId.OPTIMISM],
      tokenA,
      tokenB,
      fee,
    })

    expect(address).toEqual('0x1A9b7d0609d369C3A8dc204A52e2971593689957')
  })
})

const total0 = { base: JSBI.BigInt(1000), elastic: JSBI.BigInt(1000) }
const total1 = { base: JSBI.BigInt(1000), elastic: JSBI.BigInt(1000) }

describe('StablePool', () => {
  const USDC = new Token({
    chainId: ChainId.OPTIMISM,
    address: USDC_ADDRESS[ChainId.OPTIMISM],
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  })
  const DAI = new Token({
    chainId: ChainId.OPTIMISM,
    address: WETH9_ADDRESS[ChainId.OPTIMISM],
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
  })

  describe('constructor', () => {
    it('cannot be used for tokens on different chains', () => {
      expect(
        () =>
          new StablePool(Amount.fromRawAmount(USDC, '100'), Amount.fromRawAmount(WETH9[3], '100'), 30, total0, total1)
      ).toThrow('CHAIN_IDS')
    })
  })

  describe('#getAddress', () => {
    it('returns the correct address', () => {
      expect(StablePool.getAddress(USDC, DAI, 30)).toEqual('0x1A9b7d0609d369C3A8dc204A52e2971593689957')
    })
  })

  describe('#token0', () => {
    it('always is the token that sorts before', () => {
      expect(
        new StablePool(Amount.fromRawAmount(USDC, '100'), Amount.fromRawAmount(DAI, '100'), 30, total0, total1).token0
      ).toEqual(DAI)
      expect(
        new StablePool(Amount.fromRawAmount(DAI, '100'), Amount.fromRawAmount(USDC, '100'), 30, total0, total1).token0
      ).toEqual(DAI)
    })
  })
  describe('#token1', () => {
    it('always is the token that sorts after', () => {
      expect(
        new StablePool(Amount.fromRawAmount(USDC, '100'), Amount.fromRawAmount(DAI, '100'), 30, total0, total1).token1
      ).toEqual(USDC)
      expect(
        new StablePool(Amount.fromRawAmount(DAI, '100'), Amount.fromRawAmount(USDC, '100'), 30, total0, total1).token1
      ).toEqual(USDC)
    })
  })
  describe('#reserve0', () => {
    it('always comes from the token that sorts before', () => {
      expect(
        new StablePool(Amount.fromRawAmount(USDC, '100'), Amount.fromRawAmount(DAI, '101'), 30, total0, total1).reserve0
      ).toEqual(Amount.fromRawAmount(DAI, '101'))
      expect(
        new StablePool(Amount.fromRawAmount(DAI, '101'), Amount.fromRawAmount(USDC, '100'), 30, total0, total1).reserve0
      ).toEqual(Amount.fromRawAmount(DAI, '101'))
    })
  })
  describe('#reserve1', () => {
    it('always comes from the token that sorts after', () => {
      expect(
        new StablePool(Amount.fromRawAmount(USDC, '100'), Amount.fromRawAmount(DAI, '101'), 30, total0, total1).reserve1
      ).toEqual(Amount.fromRawAmount(USDC, '100'))
      expect(
        new StablePool(Amount.fromRawAmount(DAI, '101'), Amount.fromRawAmount(USDC, '100'), 30, total0, total1).reserve1
      ).toEqual(Amount.fromRawAmount(USDC, '100'))
    })
  })

  describe('#token0Price', () => {
    it('returns price of token0 in terms of token1', () => {
      expect(
        new StablePool(Amount.fromRawAmount(USDC, '101'), Amount.fromRawAmount(DAI, '100'), 30, total0, total1)
          .token0Price
      ).toEqual(new Price(DAI, USDC, '100', '101'))
      expect(
        new StablePool(Amount.fromRawAmount(DAI, '100'), Amount.fromRawAmount(USDC, '101'), 30, total0, total1)
          .token0Price
      ).toEqual(new Price(DAI, USDC, '100', '101'))
    })
  })

  describe('#token1Price', () => {
    it('returns price of token1 in terms of token0', () => {
      expect(
        new StablePool(Amount.fromRawAmount(USDC, '101'), Amount.fromRawAmount(DAI, '100'), 30, total0, total1)
          .token1Price
      ).toEqual(new Price(USDC, DAI, '101', '100'))
      expect(
        new StablePool(Amount.fromRawAmount(DAI, '100'), Amount.fromRawAmount(USDC, '101'), 30, total0, total1)
          .token1Price
      ).toEqual(new Price(USDC, DAI, '101', '100'))
    })
  })

  describe('#priceOf', () => {
    const pair = new StablePool(Amount.fromRawAmount(USDC, '101'), Amount.fromRawAmount(DAI, '100'), 30, total0, total1)
    it('returns price of token in terms of other token', () => {
      expect(pair.priceOf(DAI)).toEqual(pair.token0Price)
      expect(pair.priceOf(USDC)).toEqual(pair.token1Price)
    })

    it('throws if invalid token', () => {
      expect(() => pair.priceOf(WETH9[1])).toThrow('TOKEN')
    })
  })

  describe('#reserveOf', () => {
    it('returns reserves of the given token', () => {
      expect(
        new StablePool(
          Amount.fromRawAmount(USDC, '100'),
          Amount.fromRawAmount(DAI, '101'),
          30,
          total0,
          total1
        ).reserveOf(USDC)
      ).toEqual(Amount.fromRawAmount(USDC, '100'))
      expect(
        new StablePool(
          Amount.fromRawAmount(DAI, '101'),
          Amount.fromRawAmount(USDC, '100'),
          30,
          total0,
          total1
        ).reserveOf(USDC)
      ).toEqual(Amount.fromRawAmount(USDC, '100'))
    })

    it('throws if not in the pair', () => {
      expect(() =>
        new StablePool(
          Amount.fromRawAmount(DAI, '101'),
          Amount.fromRawAmount(USDC, '100'),
          30,
          total0,
          total1
        ).reserveOf(WETH9[1])
      ).toThrow('TOKEN')
    })
  })

  describe('#chainId', () => {
    it('returns the token0 chainId', () => {
      expect(
        new StablePool(Amount.fromRawAmount(USDC, '100'), Amount.fromRawAmount(DAI, '100'), 30, total0, total1).chainId
      ).toEqual(10)
      expect(
        new StablePool(Amount.fromRawAmount(DAI, '100'), Amount.fromRawAmount(USDC, '100'), 30, total0, total1).chainId
      ).toEqual(10)
    })
  })
  describe('#involvesToken', () => {
    expect(
      new StablePool(
        Amount.fromRawAmount(USDC, '100'),
        Amount.fromRawAmount(DAI, '100'),
        30,
        total0,
        total1
      ).involvesToken(USDC)
    ).toEqual(true)
    expect(
      new StablePool(
        Amount.fromRawAmount(USDC, '100'),
        Amount.fromRawAmount(DAI, '100'),
        30,
        total0,
        total1
      ).involvesToken(DAI)
    ).toEqual(true)
    expect(
      new StablePool(
        Amount.fromRawAmount(USDC, '100'),
        Amount.fromRawAmount(DAI, '100'),
        30,
        total0,
        total1
      ).involvesToken(WETH9[1])
    ).toEqual(false)
  })
  describe('miscellaneous', () => {
    it.skip('getLiquidityMinted:0', async () => {
      const tokenA = new Token({
        chainId: ChainId.OPTIMISM,
        address: '0x0000000000000000000000000000000000000001',
        decimals: 18,
      })
      const tokenB = new Token({
        chainId: ChainId.OPTIMISM,
        address: '0x0000000000000000000000000000000000000002',
        decimals: 18,
      })
      const pool = new StablePool(
        Amount.fromRawAmount(tokenA, '0'),
        Amount.fromRawAmount(tokenB, '0'),
        30,
        total0,
        total1
      )

      expect(() => {
        pool.getLiquidityMinted(
          Amount.fromRawAmount(pool.liquidityToken, '0'),
          Amount.fromRawAmount(tokenA, '1000'),
          Amount.fromRawAmount(tokenB, '1000')
        )
      }).toThrow(InsufficientInputAmountError)

      expect(() => {
        pool.getLiquidityMinted(
          Amount.fromRawAmount(pool.liquidityToken, '0'),
          Amount.fromRawAmount(tokenA, '1000000'),
          Amount.fromRawAmount(tokenB, '1')
        )
      }).toThrow(InsufficientInputAmountError)

      const liquidity = pool.getLiquidityMinted(
        Amount.fromRawAmount(pool.liquidityToken, '0'),
        Amount.fromRawAmount(tokenA, '1001'),
        Amount.fromRawAmount(tokenB, '1001')
      )

      expect(liquidity.quotient.toString()).toEqual('1')
    })

    it('getLiquidityMinted:!0', async () => {
      const tokenA = new Token({
        chainId: ChainId.OPTIMISM,
        address: '0x0000000000000000000000000000000000000001',
        decimals: 18,
      })
      const tokenB = new Token({
        chainId: ChainId.OPTIMISM,
        address: '0x0000000000000000000000000000000000000002',
        decimals: 18,
      })
      const pool = new StablePool(
        Amount.fromRawAmount(tokenA, '0'),
        Amount.fromRawAmount(tokenB, '0'),
        100,
        {
          base: JSBI.BigInt('1116095462673148936623'),
          elastic: JSBI.BigInt('1116117259112172411695'),
        },
        {
          base: JSBI.BigInt('18648542897027618454566'),
          elastic: JSBI.BigInt('18933448931872662869596'),
        }
        // total0,
        // total1
      )

      expect(
        pool
          .getLiquidityMinted(
            Amount.fromRawAmount(pool.liquidityToken, '0'),
            Amount.fromRawAmount(tokenA, 1e18),
            Amount.fromRawAmount(tokenB, 1e18)
          )
          .quotient.toString()
      ).toEqual('189')

      // const tokenC = new Token(3, '0x0000000000000000000000000000000000000001', 6)
      // const tokenD = new Token(3, '0x0000000000000000000000000000000000000002', 18)
      // const pool2 = new ConstantProductPool(
      //   CurrencyAmount.fromRawAmount(tokenC, '18877425'),
      //   CurrencyAmount.fromRawAmount(tokenD, '1553748331383265154')
      // )
      //
      // expect(
      //   pool2
      //     .getLiquidityMinted(
      //       CurrencyAmount.fromRawAmount(pool2.liquidityToken, '5295740579331'),
      //       CurrencyAmount.fromRawAmount(tokenA, '5000000'),
      //       CurrencyAmount.fromRawAmount(tokenB, '90909073894706722')
      //     )
      //     .quotient.toString()
      // ).toEqual('830997285723')
    })

    it.skip('getLiquidityValue', async () => {
      const tokenA = new Token({
        chainId: ChainId.OPTIMISM,
        address: '0x0000000000000000000000000000000000000001',
        decimals: 18,
      })
      const tokenB = new Token({
        chainId: ChainId.OPTIMISM,
        address: '0x0000000000000000000000000000000000000002',
        decimals: 18,
      })
      const pair = new StablePool(
        Amount.fromRawAmount(tokenA, '1000'),
        Amount.fromRawAmount(tokenB, '1000'),
        30,
        total0,
        total1
      )

      {
        const liquidityValue = pair.getLiquidityValue(
          tokenA,
          Amount.fromRawAmount(pair.liquidityToken, '1000'),
          Amount.fromRawAmount(pair.liquidityToken, '1000')
        )
        expect(liquidityValue.currency.equals(tokenA)).toBe(true)
        expect(liquidityValue.quotient.toString()).toBe('1000')
      }

      // 500
      {
        const liquidityValue = pair.getLiquidityValue(
          tokenA,
          Amount.fromRawAmount(pair.liquidityToken, '1000'),
          Amount.fromRawAmount(pair.liquidityToken, '500')
        )
        expect(liquidityValue.currency.equals(tokenA)).toBe(true)
        expect(liquidityValue.quotient.toString()).toBe('500')
      }

      // tokenB
      {
        const liquidityValue = pair.getLiquidityValue(
          tokenB,
          Amount.fromRawAmount(pair.liquidityToken, '1000'),
          Amount.fromRawAmount(pair.liquidityToken, '1000')
        )
        expect(liquidityValue.currency.equals(tokenB)).toBe(true)
        expect(liquidityValue.quotient.toString()).toBe('1000')
      }
    })

    it.skip('getLiquidityValueSingleToken', () => {
      const tokenA = new Token({
        chainId: ChainId.OPTIMISM,
        address: '0x0000000000000000000000000000000000000001',
        decimals: 6,
      })
      const tokenB = new Token({
        chainId: ChainId.OPTIMISM,
        address: '0x0000000000000000000000000000000000000002',
        decimals: 18,
      })
      const pair = new StablePool(
        Amount.fromRawAmount(tokenA, '1000'),
        Amount.fromRawAmount(tokenB, '1000'),
        30,
        total0,
        total1
      )

      {
        const liquidityValue = pair.getLiquidityValueSingleToken(
          tokenB,
          Amount.fromRawAmount(pair.liquidityToken, '1000'),
          Amount.fromRawAmount(pair.liquidityToken, '500')
        )
        expect(liquidityValue.currency.equals(tokenB)).toBe(true)
        expect(liquidityValue.quotient.toString()).toBe('749')
      }

      // const pair = new ConstantProductPool(
      //   CurrencyAmount.fromRawAmount(tokenA, '18877425'),
      //   CurrencyAmount.fromRawAmount(tokenB, '1553748331383265154')
      // )

      // {
      //   const liquidityValue = pair.getLiquidityValueSingleToken(
      //     tokenA,
      //     CurrencyAmount.fromRawAmount(pair.liquidityToken, '5295740579331'),
      //     CurrencyAmount.fromRawAmount(pair.liquidityToken, '1003705801313')
      //   )
      //   expect(liquidityValue.currency.equals(tokenA)).toBe(true)
      //   expect(liquidityValue.quotient.toString()).toBe('6470535')
      // }
    })
  })
})
