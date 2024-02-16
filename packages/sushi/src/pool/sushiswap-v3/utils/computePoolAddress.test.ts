import { describe, expect, it } from 'vitest'
import { SushiSwapV3FeeAmount } from '../../../config'
import { Token } from '../../../currency'
import { computeSushiSwapV3PoolAddress } from './computePoolAddress'

describe('#computePoolAddress', () => {
  const factoryAddress = '0x1111111111111111111111111111111111111111'
  it('should correctly compute the pool address', () => {
    const tokenA = new Token({
      chainId: 1,
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      decimals: 18,
      symbol: 'USDC',
      name: 'USD Coin',
    })
    const tokenB = new Token({
      chainId: 1,
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      decimals: 18,
      symbol: 'DAI',
      name: 'Dai Stablecoin',
    })
    const result = computeSushiSwapV3PoolAddress({
      factoryAddress,
      fee: SushiSwapV3FeeAmount.LOW,
      tokenA,
      tokenB,
    })

    expect(result).toEqual('0x90B1b09A9715CaDbFD9331b3A7652B24BfBEfD32')
  })

  it('should correctly compute the pool address', () => {
    const USDC = new Token({
      chainId: 1,
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      decimals: 18,
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
    let tokenA = USDC
    let tokenB = DAI
    const resultA = computeSushiSwapV3PoolAddress({
      factoryAddress,
      fee: SushiSwapV3FeeAmount.LOW,
      tokenA,
      tokenB,
    })

    tokenA = DAI

    tokenB = USDC
    const resultB = computeSushiSwapV3PoolAddress({
      factoryAddress,
      fee: SushiSwapV3FeeAmount.LOW,
      tokenA,
      tokenB,
    })

    expect(resultA).toEqual(resultB)
  })
})
