import { BigNumber } from "@ethersproject/bignumber"
import { ConstantProductRPool, findMultiRouteExactIn, RouteStatus } from "../src"

// Reason of fail: too big Gas price
it('real fail from production 1', () => {
  const token0 = {
    name: "Token0",
    "address": "0xb7a4F3E9097C08dA09517b5aB877F7a917224ede"
  }
  const token1 = {
    name: "Token1",
    "address": "0xd0A1E359811322d97991E03f863a0C30C2cF029C"
  }
  const pool1 = new ConstantProductRPool(
    "0x253029F0D3593Afd4187500F1CB243F1EceaABAB",
    token0,
    token1,
    0.003,
    BigNumber.from("0x0f4240"),     // 1e6
    BigNumber.from("0xe8d4a51000")  // 1e12
  )
  const pool2 = new ConstantProductRPool(
    "0x253029F0D3593Afd4187500F1CB243F1EceaABAB",
    token0,
    token1,
    0.003,
    BigNumber.from("0x0f4240"),     // 1e6
    BigNumber.from("0xe8d4a51000")  // 1e12
  )
  const res = findMultiRouteExactIn(
    token0,
    token1,
    1000000,
    [pool1, pool2],
    token1,
    750000000000  // 750 GWei
  )

  expect(res).toBeDefined()
  expect(res?.status).toEqual(RouteStatus.Success)
  expect(res.priceImpact).toBeGreaterThan(0)
})