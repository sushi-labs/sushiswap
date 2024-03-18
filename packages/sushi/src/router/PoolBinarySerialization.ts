import { ChainId } from '../chain/index.js'
import { Token } from '../currency/index.js'
import {
  BinReadStream,
  BinWriteStream,
} from '../serializer/BinarySerialization.js'
import {
  BridgeUnlimited,
  ConstantProductRPool,
  CurveMultitokenCore,
  CurveMultitokenPool,
  RToken,
  UniV3Pool,
  createCurvePoolsForMultipool,
} from '../tines/index.js'
import { LiquidityProviders } from './liquidity-providers/index.js'
import {
  ConstantProductPoolCode,
  CurvePoolCode,
  NativeWrapBridgePoolCode,
  PoolCode,
  UniV3PoolCode,
} from './pool-codes/index.js'

enum PoolTypeIndex {
  Bridge = 0,
  Classic = 1,
  Concentrated = 2,
  Curve = 3,
}

const FEE_FRACTIONS = 10_000_000

// Serialization of constructor params
export function serializePoolsBinary(
  pools: PoolCode[],
  extraData?: any,
): Uint8Array {
  const stream = new BinWriteStream()
  stream.str16(JSON.stringify(extraData ?? {}))
  stream.float64(Number(pools[0]?.pool.token0.chainId ?? 0))
  const CurveCoreSerialized = new Set<string>()

  const tokenMap = new Map<string, RToken>()
  pools.forEach(({ pool: p }) => {
    tokenMap.set(p.token0.address, p.token0)
    tokenMap.set(p.token1.address, p.token1)
  })
  stream.uint24(tokenMap.size)
  Array.from(tokenMap.values()).forEach((t) => {
    stream.address(t.address)
    const pos = stream.reserveUint16()
    stream.str16(t.name)
    stream.str16(t.symbol)
    stream.uint8(t.decimals)
    stream.setLengthUint16(pos)
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
      stream.bigUInt(p.reserve0, p.address, 'res0')
      stream.bigUInt(p.reserve1, p.address, 'res1')
    } else if (pc instanceof UniV3PoolCode) {
      const p = pc.pool as UniV3Pool
      stream.uint8(PoolTypeIndex.Concentrated)
      stream.address(p.address)
      stream.uint24(tokenIndex.get(p.token0.address) as number)
      stream.uint24(tokenIndex.get(p.token1.address) as number)
      stream.uint24(p.fee * FEE_FRACTIONS) // can be optimized - usually [0.003, 0.001, 0.0005]
      stream.bigUInt(p.reserve0, p.address, 'res0')
      stream.bigUInt(p.reserve1, p.address, 'res1')
      //stream.uint32(p.tick) nearestTick instead of it
      stream.uint24(p.nearestTick)
      stream.bigUInt(p.liquidity, p.address, 'liquidity')
      stream.bigUInt(p.sqrtPriceX96, p.address, 'price')
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
        stream.bigUInt(core.reserves[i] as bigint, core.address)
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
export function deserializePoolsBinary(
  data: Uint8Array,
  start = 0,
  existedTokens?: (a: string) => Token | undefined,
): {
  pools: PoolCode[]
  // newTokens: Token[]
  // existedTokensNumber: number
  extraData: any
  finish: number
} {
  const stream = new BinReadStream(data)
  stream.skip(start)
  const extraData = JSON.parse(stream.str16())
  const chainId = stream.float64() as ChainId
  const tokensNum = stream.uint24()
  const tokensArray: RToken[] = new Array(tokensNum)
  // const newTokens: Token[] = []
  // let existedTokensNumber = 0
  for (let i = 0; i < tokensNum; ++i) {
    const address = stream.address()
    const tokenRestDataLength = stream.uint16()
    const token = existedTokens?.(address)
    if (token) {
      tokensArray[i] = token as RToken
      stream.skip(tokenRestDataLength)
    } else {
      const name = stream.str16()
      const symbol = stream.str16()
      const decimals = stream.uint8()
      const token = new Token({
        chainId,
        address,
        name,
        symbol,
        decimals,
      })
      tokensArray[i] = token as RToken
    }
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
  return { pools, extraData, finish: stream.position }
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

export function comparePoolArrays(
  poolsA: PoolCode[],
  poolsB: PoolCode[],
): boolean {
  let res = true
  const poolsAMap = new Map<string, PoolCode>()
  poolsA.forEach((p) => poolsAMap.set(p.pool.uniqueID(), p))
  const poolsBMap = new Map<string, PoolCode>()
  poolsB.forEach((p) => poolsBMap.set(p.pool.uniqueID(), p))

  Array.from(poolsAMap.values()).forEach((pA) => {
    const pB = poolsBMap.get(pA.pool.uniqueID())
    if (pB === undefined) {
      console.log(`Set 2 has no pool ${pA.pool.uniqueID()}`)
      res = false
    } else res = comparePools(pA, pB) && res
  })

  Array.from(poolsBMap.values()).forEach((pB) => {
    const pA = poolsAMap.get(pB.pool.uniqueID())
    if (pA === undefined) {
      console.log(`Set 1 has no pool ${pB.pool.uniqueID()}`)
      res = false
    }
  })
  return res
}

function comparePools(poolsA: PoolCode, poolsB: PoolCode): boolean {
  let res = cmpObj(
    poolsA,
    poolsB,
    ['liquidityProvider', 'poolName'],
    `Pool ${poolsA.pool.uniqueID()} mismatch`,
  )
  if (poolsA instanceof ConstantProductPoolCode) {
    if (!(poolsB instanceof ConstantProductPoolCode)) {
      console.log(`PoolCode ${poolsA.pool.uniqueID()} poolType mismatch`)
      res = false
    } else {
      if (!(poolsA.pool instanceof ConstantProductRPool)) {
        console.log(`Set 1 pool ${poolsA.pool.uniqueID()} poolType mismatch`)
        res = false
      } else {
        if (!(poolsB.pool instanceof ConstantProductRPool)) {
          console.log(`Set 2 pool ${poolsB.pool.uniqueID()} poolType mismatch`)
          res = false
        } else {
          if (!compareConstantProductRPool(poolsA.pool, poolsB.pool))
            res = false
        }
      }
    }
  } else if (poolsA instanceof UniV3PoolCode) {
    if (!(poolsB instanceof UniV3PoolCode)) {
      console.log(`PoolCode ${poolsA.pool.uniqueID()} poolType mismatch`)
      res = false
    } else {
      if (!(poolsA.pool instanceof UniV3Pool)) {
        console.log(`Set 1 pool ${poolsA.pool.uniqueID()} poolType mismatch`)
        res = false
      } else {
        if (!(poolsB.pool instanceof UniV3Pool)) {
          console.log(`Set 2 pool ${poolsB.pool.uniqueID()} poolType mismatch`)
          res = false
        } else {
          if (!compareUniV3Pool(poolsA.pool, poolsB.pool)) res = false
        }
      }
    }
  } else if (poolsA instanceof NativeWrapBridgePoolCode) {
    if (!(poolsB instanceof NativeWrapBridgePoolCode)) {
      console.log(`PoolCode ${poolsA.pool.uniqueID()} poolType mismatch`)
      res = false
    } else {
      if (!(poolsA.pool instanceof BridgeUnlimited)) {
        console.log(`Set 1 pool ${poolsA.pool.uniqueID()} poolType mismatch`)
        res = false
      } else {
        if (!(poolsB.pool instanceof BridgeUnlimited)) {
          console.log(`Set 2 pool ${poolsB.pool.uniqueID()} poolType mismatch`)
          res = false
        } else {
          if (!compareBridgeUnlimited(poolsA.pool, poolsB.pool)) res = false
        }
      }
    }
  } else if (poolsA instanceof CurvePoolCode) {
    if (!(poolsB instanceof CurvePoolCode)) {
      console.log(`PoolCode ${poolsA.pool.uniqueID()} poolType mismatch`)
      res = false
    } else {
      if (!(poolsA.pool instanceof CurveMultitokenPool)) {
        console.log(`Set 1 pool ${poolsA.pool.uniqueID()} poolType mismatch`)
        res = false
      } else {
        if (!(poolsB.pool instanceof CurveMultitokenPool)) {
          console.log(`Set 2 pool ${poolsB.pool.uniqueID()} poolType mismatch`)
          res = false
        } else {
          if (!compareCurveMultitokenPool(poolsA.pool, poolsB.pool)) res = false
        }
      }
    }
  } else {
    console.log('Unknown pool type')
  }
  return res
}

function compareConstantProductRPool(
  poolA: ConstantProductRPool,
  poolB: ConstantProductRPool,
): boolean {
  let res = cmpObj(
    poolA,
    poolB,
    ['address', 'fee', 'reserve0', 'reserve1'],
    `ConstantProductRPool ${poolA.address} mismatch`,
  )
  res = compareTokens(poolA.token0, poolB.token0, poolA.uniqueID()) && res
  res = compareTokens(poolA.token1, poolB.token1, poolA.uniqueID()) && res
  return res
}

function compareUniV3Pool(poolA: UniV3Pool, poolB: UniV3Pool): boolean {
  let res = cmpObj(
    poolA,
    poolB,
    [
      'address',
      'fee',
      'reserve0',
      'reserve1',
      'nearestTick',
      'liquidity',
      'sqrtPriceX96',
    ],
    `UniV3Pool ${poolA.address} mismatch`,
  )
  res = compareTokens(poolA.token0, poolB.token0, poolA.uniqueID()) && res
  res = compareTokens(poolA.token1, poolB.token1, poolA.uniqueID()) && res
  res =
    cmpArrObj(
      poolA.ticks,
      poolB.ticks,
      ['index', 'DLiquidity'],
      `UniV3Pool ${poolA.address} mismatch ticks`,
    ) && res
  return res
}

function compareBridgeUnlimited(
  poolA: BridgeUnlimited,
  poolB: BridgeUnlimited,
): boolean {
  let res = cmpObj(
    poolA,
    poolB,
    ['address', 'fee'],
    `BridgeUnlimited ${poolA.address} mismatch`,
  )
  res = compareTokens(poolA.token0, poolB.token0, poolA.uniqueID()) && res
  res = compareTokens(poolA.token1, poolB.token1, poolA.uniqueID()) && res
  return res
}

function compareCurveMultitokenPool(
  poolA: CurveMultitokenPool,
  poolB: CurveMultitokenPool,
): boolean {
  let res = cmpObj(
    poolA,
    poolB,
    ['index0', 'index1'],
    `CurveMultitokenPool ${poolA.address} mismatch`,
  )
  res = compareCurveMultitokenCore(poolA.core, poolB.core) && res
  return res
}

function compareCurveMultitokenCore(
  poolA: CurveMultitokenCore,
  poolB: CurveMultitokenCore,
): boolean {
  let res = cmpObj(
    poolA,
    poolB,
    ['address', 'fee', 'A'],
    `CurveMultitokenCore ${poolA.address} mismatch`,
  )
  res =
    cmpArrObj(
      poolA.tokens,
      poolB.tokens,
      ['address', 'name', 'symbol', 'decimals'],
      `CurveMultitokenCore ${poolA.address} mismatch tokens`,
    ) && res
  res =
    cmpArrVal(
      poolA.reserves,
      poolB.reserves,
      `CurveMultitokenCore ${poolA.address} mismatch reserves`,
    ) && res
  res =
    cmpArrVal(
      poolA.rates,
      poolB.rates,
      `CurveMultitokenCore ${poolA.address} mismatch rates`,
    ) && res
  return res
}

function compareTokens(
  tokenA: RToken,
  tokenB: RToken,
  poolID: string,
): boolean {
  return cmpObj(
    tokenA,
    tokenB,
    ['address', 'decimals'],
    `Pool ${poolID} tokens mismatch`,
  )
}

function cmpVal<T>(valA: T, valB: T, err: string): boolean {
  if (valA !== valB) {
    console.log(`<!!> ${err} ${valA} != ${valB}`)
    return false
  }
  return true
}

function cmpObj(
  A: Record<string, any>,
  B: Record<string, any>,
  fields: string[],
  err: string,
): boolean {
  let res = true
  fields.forEach((f) => {
    res = cmpVal(A[f], B[f], `${err} ${f}`) && res
  })
  return res
}

function cmpArrVal<T>(A: T[], B: T[], err: string): boolean {
  let res = cmpVal(A.length, B.length, `${err} length`)
  A.forEach((m, i) => {
    res = cmpVal(m, B[i] as T, `${err} ${i}`) && res
  })
  return res
}

function cmpArrObj<T extends Record<string, any>>(
  A: T[],
  B: T[],
  fields: string[],
  err: string,
): boolean {
  let res = cmpVal(A.length, B.length, `${err} length`)
  if (!res) return res
  A.forEach((m, i) => {
    res = cmpObj(m, B[i] as T, fields, `${err} ${i}`) && res
  })
  return res
}

export function testPoolSerialization(
  poolsA: PoolCode[],
  existedTokens?: (a: string) => Token | undefined,
): boolean {
  const t0 = performance.now()
  const data = serializePoolsBinary(poolsA)
  const t1 = performance.now()
  const { pools: poolsB } = deserializePoolsBinary(data, 0, existedTokens)
  const t2 = performance.now()
  console.log('Bin Pool (de)serialilization', poolsA.length, t1 - t0, t2 - t1)
  return comparePoolArrays(poolsA, poolsB)
}
