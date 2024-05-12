import { describe, expect, it } from 'vitest'
import { ChainId } from '../../chain/index.js'
import { TRIDENT_CONSTANT_POOL_FACTORY_ADDRESS } from '../../config/index.js'
import {
  Amount,
  Price,
  Token,
  USDC_ADDRESS,
  WETH9,
  WETH9_ADDRESS,
} from '../../currency/index.js'
import { InsufficientInputAmountError } from '../../dex/index.js'
import { computeTridentConstantPoolAddress } from './compute-trident-constant-pool-address.js'
import { TridentConstantPool } from './trident-constant-pool.js'

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

    const twap = true

    const address = computeTridentConstantPoolAddress({
      factoryAddress: TRIDENT_CONSTANT_POOL_FACTORY_ADDRESS[ChainId.OPTIMISM],
      tokenA,
      tokenB,
      fee,
      twap,
    })

    expect(address).toEqual('0x3a55461275dc8F4a60B0d7fe32E96341c96ebEce')
  })
})

describe('TridentConstantPool', () => {
  const USDC = new Token({
    chainId: ChainId.OPTIMISM,
    address: USDC_ADDRESS[ChainId.OPTIMISM],
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  })
  const WETH = new Token({
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
          new TridentConstantPool(
            Amount.fromRawAmount(USDC, '100'),
            Amount.fromRawAmount(WETH9[137], '100'),
            30,
            true,
          ),
      ).toThrow('CHAIN_IDS')
    })
  })

  describe('#getAddress', () => {
    it.skip('returns the correct address', () => {
      expect(TridentConstantPool.getAddress(USDC, WETH, 30, true)).toEqual(
        '0x3a55461275dc8F4a60B0d7fe32E96341c96ebEce',
      )
    })
  })

  describe('#token0', () => {
    it('always is the token that sorts before', () => {
      expect(
        new TridentConstantPool(
          Amount.fromRawAmount(USDC, '100'),
          Amount.fromRawAmount(WETH, '100'),
          30,
          true,
        ).token0,
      ).toEqual(USDC)
      expect(
        new TridentConstantPool(
          Amount.fromRawAmount(WETH, '100'),
          Amount.fromRawAmount(USDC, '100'),
          30,
          true,
        ).token0,
      ).toEqual(USDC)
    })
  })
  describe('#token1', () => {
    it('always is the token that sorts after', () => {
      expect(
        new TridentConstantPool(
          Amount.fromRawAmount(USDC, '100'),
          Amount.fromRawAmount(WETH, '100'),
          30,
          true,
        ).token1,
      ).toEqual(WETH)
      expect(
        new TridentConstantPool(
          Amount.fromRawAmount(WETH, '100'),
          Amount.fromRawAmount(USDC, '100'),
          30,
          true,
        ).token1,
      ).toEqual(WETH)
    })
  })
  describe('#reserve0', () => {
    it('always comes from the token that sorts before', () => {
      expect(
        new TridentConstantPool(
          Amount.fromRawAmount(USDC, '100'),
          Amount.fromRawAmount(WETH, '101'),
          30,
          true,
        ).reserve0,
      ).toEqual(Amount.fromRawAmount(USDC, '100'))
      expect(
        new TridentConstantPool(
          Amount.fromRawAmount(WETH, '101'),
          Amount.fromRawAmount(USDC, '100'),
          30,
          true,
        ).reserve0,
      ).toEqual(Amount.fromRawAmount(USDC, '100'))
    })
  })
  describe('#reserve1', () => {
    it('always comes from the token that sorts after', () => {
      expect(
        new TridentConstantPool(
          Amount.fromRawAmount(USDC, '100'),
          Amount.fromRawAmount(WETH, '101'),
          30,
          true,
        ).reserve1,
      ).toEqual(Amount.fromRawAmount(WETH, '101'))
      expect(
        new TridentConstantPool(
          Amount.fromRawAmount(WETH, '101'),
          Amount.fromRawAmount(USDC, '100'),
          30,
          true,
        ).reserve1,
      ).toEqual(Amount.fromRawAmount(WETH, '101'))
    })
  })

  describe('#token0Price', () => {
    it('returns price of token0 in terms of token1', () => {
      expect(
        new TridentConstantPool(
          Amount.fromRawAmount(USDC, '101'),
          Amount.fromRawAmount(WETH, '100'),
          30,
          true,
        ).token0Price,
      ).toEqual(new Price(USDC, WETH, '101', '100'))
      expect(
        new TridentConstantPool(
          Amount.fromRawAmount(WETH, '100'),
          Amount.fromRawAmount(USDC, '101'),
          30,
          true,
        ).token0Price,
      ).toEqual(new Price(USDC, WETH, '101', '100'))
    })
  })

  describe('#token1Price', () => {
    it('returns price of token1 in terms of token0', () => {
      expect(
        new TridentConstantPool(
          Amount.fromRawAmount(USDC, '101'),
          Amount.fromRawAmount(WETH, '100'),
          30,
          true,
        ).token1Price,
      ).toEqual(new Price(WETH, USDC, '100', '101'))
      expect(
        new TridentConstantPool(
          Amount.fromRawAmount(WETH, '100'),
          Amount.fromRawAmount(USDC, '101'),
          30,
          true,
        ).token1Price,
      ).toEqual(new Price(WETH, USDC, '100', '101'))
    })
  })

  describe('#priceOf', () => {
    const pair = new TridentConstantPool(
      Amount.fromRawAmount(USDC, '101'),
      Amount.fromRawAmount(WETH, '100'),
      30,
      true,
    )
    it('returns price of token in terms of other token', () => {
      expect(pair.priceOf(USDC)).toEqual(pair.token0Price)
      expect(pair.priceOf(WETH)).toEqual(pair.token1Price)
    })

    it('throws if invalid token', () => {
      expect(() => pair.priceOf(WETH9[1])).toThrow('TOKEN')
    })
  })

  describe('#reserveOf', () => {
    it('returns reserves of the given token', () => {
      expect(
        new TridentConstantPool(
          Amount.fromRawAmount(USDC, '100'),
          Amount.fromRawAmount(WETH, '101'),
          30,
          true,
        ).reserveOf(USDC),
      ).toEqual(Amount.fromRawAmount(USDC, '100'))
      expect(
        new TridentConstantPool(
          Amount.fromRawAmount(WETH, '101'),
          Amount.fromRawAmount(USDC, '100'),
          30,
          true,
        ).reserveOf(USDC),
      ).toEqual(Amount.fromRawAmount(USDC, '100'))
    })

    it('throws if not in the pair', () => {
      expect(() =>
        new TridentConstantPool(
          Amount.fromRawAmount(WETH, '101'),
          Amount.fromRawAmount(USDC, '100'),
          30,
          true,
        ).reserveOf(WETH9[1]),
      ).toThrow('TOKEN')
    })
  })

  describe('#chainId', () => {
    it('returns the token0 chainId', () => {
      expect(
        new TridentConstantPool(
          Amount.fromRawAmount(USDC, '100'),
          Amount.fromRawAmount(WETH, '100'),
          30,
          true,
        ).chainId,
      ).toEqual(10)
      expect(
        new TridentConstantPool(
          Amount.fromRawAmount(WETH, '100'),
          Amount.fromRawAmount(USDC, '100'),
          30,
          true,
        ).chainId,
      ).toEqual(10)
    })
  })
  describe('#involvesToken', () => {
    it('involves token', () => {
      expect(
        new TridentConstantPool(
          Amount.fromRawAmount(USDC, '100'),
          Amount.fromRawAmount(WETH, '100'),
          30,
          true,
        ).involvesToken(USDC),
      ).toEqual(true)
      expect(
        new TridentConstantPool(
          Amount.fromRawAmount(USDC, '100'),
          Amount.fromRawAmount(WETH, '100'),
          30,
          true,
        ).involvesToken(WETH),
      ).toEqual(true)
      expect(
        new TridentConstantPool(
          Amount.fromRawAmount(USDC, '100'),
          Amount.fromRawAmount(WETH, '100'),
          30,
          true,
        ).involvesToken(WETH9[1]),
      ).toEqual(false)
    })
  })
  describe('miscellaneous', () => {
    it('getLiquidityMinted:0', async () => {
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
      const pool = new TridentConstantPool(
        Amount.fromRawAmount(tokenA, '0'),
        Amount.fromRawAmount(tokenB, '0'),
        30,
        true,
      )

      expect(() => {
        pool.getLiquidityMinted(
          Amount.fromRawAmount(pool.liquidityToken, '0'),
          Amount.fromRawAmount(tokenA, '1000'),
          Amount.fromRawAmount(tokenB, '1000'),
        )
      }).toThrow(InsufficientInputAmountError)

      expect(() => {
        pool.getLiquidityMinted(
          Amount.fromRawAmount(pool.liquidityToken, '0'),
          Amount.fromRawAmount(tokenA, '1000000'),
          Amount.fromRawAmount(tokenB, '1'),
        )
      }).toThrow(InsufficientInputAmountError)

      const liquidity = pool.getLiquidityMinted(
        Amount.fromRawAmount(pool.liquidityToken, '0'),
        Amount.fromRawAmount(tokenA, '1001'),
        Amount.fromRawAmount(tokenB, '1001'),
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
      const pool = new TridentConstantPool(
        Amount.fromRawAmount(tokenA, '10000'),
        Amount.fromRawAmount(tokenB, '10000'),
        30,
        true,
      )

      expect(
        pool
          .getLiquidityMinted(
            Amount.fromRawAmount(pool.liquidityToken, '10000'),
            Amount.fromRawAmount(tokenA, '2000'),
            Amount.fromRawAmount(tokenB, '2000'),
          )
          .quotient.toString(),
      ).toEqual('2000')

      // const tokenC = new Token(3, '0x0000000000000000000000000000000000000001', 6)
      // const tokenD = new Token(3, '0x0000000000000000000000000000000000000002', 18)
      // const pool2 = new TridentConstantPool(
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

    it('getLiquidityValue', async () => {
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
      const pair = new TridentConstantPool(
        Amount.fromRawAmount(tokenA, '1000'),
        Amount.fromRawAmount(tokenB, '1000'),
        30,
        true,
      )

      {
        const liquidityValue = pair.getLiquidityValue(
          tokenA,
          Amount.fromRawAmount(pair.liquidityToken, '1000'),
          Amount.fromRawAmount(pair.liquidityToken, '1000'),
        )
        expect(liquidityValue.currency.equals(tokenA)).toBe(true)
        expect(liquidityValue.quotient.toString()).toBe('1000')
      }

      // 500
      {
        const liquidityValue = pair.getLiquidityValue(
          tokenA,
          Amount.fromRawAmount(pair.liquidityToken, '1000'),
          Amount.fromRawAmount(pair.liquidityToken, '500'),
        )
        expect(liquidityValue.currency.equals(tokenA)).toBe(true)
        expect(liquidityValue.quotient.toString()).toBe('500')
      }

      // tokenB
      {
        const liquidityValue = pair.getLiquidityValue(
          tokenB,
          Amount.fromRawAmount(pair.liquidityToken, '1000'),
          Amount.fromRawAmount(pair.liquidityToken, '1000'),
        )
        expect(liquidityValue.currency.equals(tokenB)).toBe(true)
        expect(liquidityValue.quotient.toString()).toBe('1000')
      }
    })

    it('getLiquidityValueSingleToken', () => {
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
      const pair = new TridentConstantPool(
        Amount.fromRawAmount(tokenA, '1000'),
        Amount.fromRawAmount(tokenB, '1000'),
        30,
        true,
      )

      {
        const liquidityValue = pair.getLiquidityValueSingleToken(
          tokenB,
          Amount.fromRawAmount(pair.liquidityToken, '1000'),
          Amount.fromRawAmount(pair.liquidityToken, '500'),
        )
        expect(liquidityValue.currency.equals(tokenB)).toBe(true)
        expect(liquidityValue.quotient.toString()).toBe('749')
      }

      // const pair = new TridentConstantPool(
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
