import { ConstantProductRPool, RPool, RToken, UniV3Pool } from '.'
import { BinWriteStream } from '../serializer/BinarySerialization'

// Serialization of constructor params
export function serializePoolsBinary(pools: RPool[]): Uint8Array {
  const stream = new BinWriteStream()
  const tokenMap = new Map<string, RToken>()
  pools.forEach((p) => {
    tokenMap.set(p.token0.address, p.token0)
    tokenMap.set(p.token1.address, p.token1)
  })
  stream.uint24(tokenMap.size)
  Array.from(tokenMap.values()).forEach((t) => {
    stream.address(t.address)
    stream.str16(t.name)
    stream.str16(t.symbol)
    stream.uint8(t.decimals)
  })
  const tokenIndex = new Map<string, number>(
    Array.from(tokenMap.entries()).map((a, i) => [a[0], i]),
  )

  stream.uint24(pools.length)
  pools.forEach((p) => {
    if (p instanceof ConstantProductRPool) {
      stream.address(p.address)
      stream.uint24(tokenIndex.get(p.token0.address) as number)
      stream.uint24(tokenIndex.get(p.token1.address) as number)
      stream.uint24(p.fee * 10_000_000) // can be optimized - usually 0.003
      stream.bigUInt(p.reserve0)
      stream.bigUInt(p.reserve1)
    } else if (p instanceof UniV3Pool) {
      stream.address(p.address)
      stream.uint24(tokenIndex.get(p.token0.address) as number)
      stream.uint24(tokenIndex.get(p.token1.address) as number)
      stream.uint24(p.fee * 10_000_000) // can be optimized - usually [0.003, 0.001, 0.0005]
      stream.bigUInt(p.reserve0)
      stream.bigUInt(p.reserve1)
      //stream.uint32(p.tick) nearestTick instead of it
      stream.uint24(p.nearestTick)
      stream.bigUInt(p.liquidity)
      stream.bigUInt(p.sqrtPriceX96)
      stream.uint24(p.ticks.length)
      p.ticks.forEach((t) => {
        stream.int24(t.index)
        stream.bigInt(t.DLiquidity)
      })
    }
  })

  return stream.getSerializedData()
}
