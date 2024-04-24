import { expect, it } from 'vitest'
import {
  ConstantProductRPool,
  RouteStatus,
  findMultiRouteExactIn,
} from '../../src/tines/index.js'

// Tests that Tines doesn't fail if input token == output token
it('token0 = token1', () => {
  const token0 = {
    name: 'Token0',
    address: '0xb7a4F3E9097C08dA09517b5aB877F7a917224ede',
    symbol: 'TOKEN0',
    decimals: 18,
  }
  const token1 = {
    name: 'Token1',
    address: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
    symbol: 'TOKEN1',
    decimals: 18,
  }
  const pool1 = new ConstantProductRPool(
    '0x253029F0D3593Afd4187500F1CB243F1EceaABAB',
    token0,
    token1,
    0.003,
    BigInt(1e6),
    BigInt(1e12),
  )
  const pool2 = new ConstantProductRPool(
    '0x253029F0D3593Afd4187500F1CB243F1EceaABAB',
    token0,
    token1,
    0.003,
    BigInt(1e6),
    BigInt(1e12),
  )
  const res = findMultiRouteExactIn(
    token0,
    token0,
    1000000,
    [pool1, pool2],
    token1,
    750000000000, // 750 GWei
  )

  expect(res).toBeDefined()
  expect(res?.status).toEqual(RouteStatus.NoWay)
  //expect(res.priceImpact).toBeGreaterThan(0)   price impact could be arbitrary. If pools are not balanced
})
