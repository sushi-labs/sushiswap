import {
  ConstantProductPoolCode,
  CurvePoolCode,
  LiquidityProviders,
  NativeWrapBridgePoolCode,
  PoolCode,
  UniV3PoolCode,
} from '.'
import { ChainId } from '..'
import { Token } from '../currency'
import {
  BinReadStream,
  BinWriteStream,
} from '../serializer/BinarySerialization'
import {
  BridgeUnlimited,
  ConstantProductRPool,
  CurveMultitokenPool,
  RToken,
  UniV3Pool,
  createCurvePoolsForMultipool,
} from '../tines'

enum PoolTypeIndex {
  Bridge = 0,
  Classic = 1,
  Concentrated = 2,
  Curve = 3,
}

const FEE_FRACTIONS = 10_000_000

// Serialization of constructor params
export function serializePoolsBinary(pools: PoolCode[]): Uint8Array {
  const stream = new BinWriteStream()
  stream.uint24(
    pools.length > 0 ? (pools[0]?.pool.token0.chainId as number) : 0,
  )
  const CurveCoreSerialized = new Set<string>()

  const tokenMap = new Map<string, RToken>()
  pools.forEach(({ pool: p }) => {
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
  pools.forEach((pc) => {
    stream.str16(pc.liquidityProvider)
    if (pc instanceof ConstantProductPoolCode) {
      const p = pc.pool as ConstantProductRPool
      stream.uint8(PoolTypeIndex.Classic)
      stream.address(p.address)
      stream.uint24(tokenIndex.get(p.token0.address) as number)
      stream.uint24(tokenIndex.get(p.token1.address) as number)
      stream.uint24(p.fee * FEE_FRACTIONS) // can be optimized - usually 0.003
      stream.bigUInt(p.reserve0)
      stream.bigUInt(p.reserve1)
    } else if (pc instanceof UniV3PoolCode) {
      const p = pc.pool as UniV3Pool
      stream.uint8(PoolTypeIndex.Concentrated)
      stream.address(p.address)
      stream.uint24(tokenIndex.get(p.token0.address) as number)
      stream.uint24(tokenIndex.get(p.token1.address) as number)
      stream.uint24(p.fee * FEE_FRACTIONS) // can be optimized - usually [0.003, 0.001, 0.0005]
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
    } else if (pc instanceof NativeWrapBridgePoolCode) {
      const p = pc.pool as BridgeUnlimited
      // Native wrappers for example
      stream.uint8(PoolTypeIndex.Bridge)
      stream.address(p.address)
      stream.uint24(tokenIndex.get(p.token0.address) as number)
      stream.uint24(tokenIndex.get(p.token1.address) as number)
      stream.uint24(p.fee * FEE_FRACTIONS) // can be optimized - usually 0.003
    } else if (pc instanceof CurvePoolCode) {
      const p = pc.pool as CurveMultitokenPool
      const core = p.core
      if (CurveCoreSerialized.has(core.address)) return
      CurveCoreSerialized.add(core.address)

      stream.uint8(PoolTypeIndex.Curve)
      stream.address(core.address)
      stream.uint8(core.tokens.length)
      core.tokens.forEach((t, i) => {
        stream.uint24(tokenIndex.get(t.address) as number)
        stream.bigUInt(core.reserves[i] as bigint)
        stream.float64(core.rates[i] as number)
      })
      stream.uint24(p.fee * FEE_FRACTIONS) // can be optimized - usually [0.003, 0.001, 0.0005]
      stream.float64(core.A)
    } else {
      console.error(`Serialization: unsupported pool type ${pc.pool.address}`)
    }
  })

  return stream.getSerializedData()
}

// Deserialization - launching constructors
export function deserializePoolsBinary(data: Uint8Array): PoolCode[] {
  const stream = new BinReadStream(data)
  const chainId = stream.uint24() as ChainId
  const tokensNum = stream.uint24()
  const tokensArray: RToken[] = new Array(tokensNum)
  for (let i = 0; i < tokensNum; ++i) {
    const address = stream.address()
    const name = stream.str16()
    const symbol = stream.str16()
    const decimals = stream.uint8()
    tokensArray[i] = new Token({
      chainId,
      address,
      name,
      symbol,
      decimals,
    }) as RToken
  }

  const poolsNum = stream.uint24()
  const pools: PoolCode[] = new Array(poolsNum)
  for (let i = 0; i < poolsNum; ) {
    const liquidityProvider = stream.str16()
    const poolType = stream.uint8() as PoolTypeIndex
    switch (poolType) {
      case PoolTypeIndex.Classic:
        pools[i++] = new ConstantProductPoolCode(
          readCPRPool(stream, tokensArray),
          liquidityProvider as LiquidityProviders,
          liquidityProvider,
        )
        break
      case PoolTypeIndex.Concentrated:
        pools[i++] = new UniV3PoolCode(
          readUniV3Pool(stream, tokensArray),
          liquidityProvider as LiquidityProviders,
          liquidityProvider,
        )
        break
      case PoolTypeIndex.Bridge:
        pools[i++] = new NativeWrapBridgePoolCode(
          readNativeWrapRPool(stream, tokensArray),
          liquidityProvider as LiquidityProviders,
        )
        break
      case PoolTypeIndex.Curve:
        readCurveRPools(stream, tokensArray).forEach((p) => {
          pools[i++] = new CurvePoolCode(
            p,
            liquidityProvider as LiquidityProviders,
            liquidityProvider,
          )
        })
        break
      default:
        console.error(`Deserealization: unknown pool type ${poolType}`)
    }
  }
  return pools
}

function readCPRPool(
  stream: BinReadStream,
  tokensArray: RToken[],
): ConstantProductRPool {
  const address = stream.address()
  const token0 = tokensArray[stream.uint24()] as RToken
  const token1 = tokensArray[stream.uint24()] as RToken
  const fee = stream.uint24() / FEE_FRACTIONS
  const reserve0 = stream.bigUInt()
  const reserve1 = stream.bigUInt()
  return new ConstantProductRPool(
    address,
    token0,
    token1,
    fee,
    reserve0,
    reserve1,
  )
}

function readUniV3Pool(
  stream: BinReadStream,
  tokensArray: RToken[],
): UniV3Pool {
  const address = stream.address()
  const token0 = tokensArray[stream.uint24()] as RToken
  const token1 = tokensArray[stream.uint24()] as RToken
  const fee = stream.uint24() / FEE_FRACTIONS
  const reserve0 = stream.bigUInt()
  const reserve1 = stream.bigUInt()
  const nearestTick = stream.uint24()
  const liquidity = stream.bigUInt()
  const sqrtPriceX96 = stream.bigUInt()
  const ticksLen = stream.uint24()
  const ticks = new Array(ticksLen)
  for (let i = 0; i < ticksLen; ++i) {
    const index = stream.int24()
    const DLiquidity = stream.bigInt()
    ticks[i] = { index, DLiquidity }
  }
  return new UniV3Pool(
    address,
    token0,
    token1,
    fee,
    reserve0,
    reserve1,
    0, // tick is not needed if we already have nearestTick
    liquidity,
    sqrtPriceX96,
    ticks,
    nearestTick,
  )
}

function readNativeWrapRPool(
  stream: BinReadStream,
  tokensArray: RToken[],
): BridgeUnlimited {
  const address = stream.address()
  const token0 = tokensArray[stream.uint24()] as RToken
  const token1 = tokensArray[stream.uint24()] as RToken
  const fee = stream.uint24() / FEE_FRACTIONS
  return new BridgeUnlimited(address, token0, token1, fee)
}

function readCurveRPools(
  stream: BinReadStream,
  tokensArray: RToken[],
): CurveMultitokenPool[] {
  const address = stream.address()
  const tokensLen = stream.uint8()
  const tokens: RToken[] = new Array(tokensLen)
  const reserves: bigint[] = new Array(tokensLen)
  const rates: number[] = new Array(tokensLen)
  for (let i = 0; i < tokensLen; ++i) {
    tokens[i] = tokensArray[stream.uint24()] as RToken
    reserves[i] = stream.bigUInt()
    rates[i] = stream.float64()
  }
  const fee = stream.uint24() / FEE_FRACTIONS
  const A = stream.float64()
  return createCurvePoolsForMultipool(address, tokens, fee, A, reserves, rates)
}
