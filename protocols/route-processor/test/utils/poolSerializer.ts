import { ChainId } from '@sushiswap/chain'
import {
  BentoBridgePoolCode,
  BentoPoolCode,
  ConstantProductPoolCode,
  CurvePoolCode,
  NativeWrapBridgePoolCode,
  PoolCode,
  UniV3PoolCode,
} from '@sushiswap/router'
import {
  BridgeBento,
  BridgeUnlimited,
  ConstantProductRPool,
  CurvePool,
  RebaseInternal,
  RToken,
  StableSwapRPool,
  UniV3Pool,
} from '@sushiswap/tines'
import { BigNumber } from 'ethers'
import * as fs from 'fs'
import path from 'path'
import * as serializer from 'serialijse'

// All classes registration - for deserialization
serializer.declarePersistable(NativeWrapBridgePoolCode)
serializer.declarePersistable(BridgeUnlimited)
serializer.declarePersistable(ConstantProductPoolCode)
serializer.declarePersistable(ConstantProductRPool)
serializer.declarePersistable(BentoPoolCode)
serializer.declarePersistable(StableSwapRPool)
serializer.declarePersistable(RebaseInternal)
serializer.declarePersistable(BentoBridgePoolCode)
serializer.declarePersistable(BridgeBento)
serializer.declarePersistable(UniV3PoolCode)
serializer.declarePersistable(UniV3Pool)
serializer.declarePersistable(CurvePoolCode)
serializer.declarePersistable(CurvePool)

// default dir for pools snapshots
const snapshotDirDefault = path.resolve(__dirname, '../pool-snapshots/')

function makeSerializable(poolCodes: PoolCode[]) {
  poolCodes.forEach(({ pool }) => {
    pool.reserve0 = pool.reserve0.toString() as unknown as BigNumber
    pool.reserve1 = pool.reserve1.toString() as unknown as BigNumber
    pool.token0 = { ...pool.token0 } as RToken
    pool.token1 = { ...pool.token1 } as RToken
    if (pool instanceof StableSwapRPool) {
      pool.k = pool.k.toString() as unknown as BigNumber
      pool.total0.rebaseBN.base = pool.total0.rebaseBN.base.toString() as unknown as BigNumber
      pool.total0.rebaseBN.elastic = pool.total0.rebaseBN.elastic.toString() as unknown as BigNumber
      pool.total1.rebaseBN.base = pool.total1.rebaseBN.base.toString() as unknown as BigNumber
      pool.total1.rebaseBN.elastic = pool.total1.rebaseBN.elastic.toString() as unknown as BigNumber
    } else if (pool instanceof UniV3Pool) {
      pool.liquidity = pool.liquidity.toString() as unknown as BigNumber
      pool.sqrtPriceX96 = pool.sqrtPriceX96.toString() as unknown as BigNumber
      pool.ticks.forEach((t) => (t.DLiquidity = t.DLiquidity.toString() as unknown as BigNumber))
    } else if (pool instanceof CurvePool) {
      pool.D = pool.D.toString() as unknown as BigNumber
      pool.rate0BN = pool.rate0BN.toString() as unknown as BigNumber
      pool.rate1BN18 = pool.rate1BN18.toString() as unknown as BigNumber
      pool.reserve0Rated = pool.reserve0Rated.toString() as unknown as BigNumber
      pool.reserve1Rated = pool.reserve1Rated.toString() as unknown as BigNumber
    }
  })
}

function restoreAfterSerialization(poolCodes: PoolCode[]) {
  poolCodes.forEach(({ pool }) => {
    pool.reserve0 = BigNumber.from(pool.reserve0)
    pool.reserve1 = BigNumber.from(pool.reserve1)
    if (pool instanceof StableSwapRPool) {
      pool.k = BigNumber.from(pool.k)
      pool.total0.rebaseBN.base = BigNumber.from(pool.total0.rebaseBN.base)
      pool.total0.rebaseBN.elastic = BigNumber.from(pool.total0.rebaseBN.elastic)
      pool.total1.rebaseBN.base = BigNumber.from(pool.total1.rebaseBN.base)
      pool.total1.rebaseBN.elastic = BigNumber.from(pool.total1.rebaseBN.elastic)
    } else if (pool instanceof UniV3Pool) {
      pool.liquidity = BigNumber.from(pool.liquidity)
      pool.sqrtPriceX96 = BigNumber.from(pool.sqrtPriceX96)
      pool.ticks.forEach((t) => (t.DLiquidity = BigNumber.from(t.DLiquidity)))
    } else if (pool instanceof CurvePool) {
      pool.D = BigNumber.from(pool.D)
      pool.rate0BN = BigNumber.from(pool.rate0BN)
      pool.rate1BN18 = BigNumber.from(pool.rate1BN18)
      pool.reserve0Rated = BigNumber.from(pool.reserve0Rated)
      pool.reserve1Rated = BigNumber.from(pool.reserve1Rated)
    }
  })
}

export function savePoolSnapshot(
  poolCodes: PoolCode[],
  chainId: ChainId,
  blockNumber: number | undefined,
  directory?: string
) {
  // pools preparation for serialization
  makeSerializable(poolCodes)
  const data = serializer.serialize(poolCodes)
  const obj = JSON.parse(data)
  const humanReadableStr = JSON.stringify(obj, undefined, '  ')
  restoreAfterSerialization(poolCodes)

  directory = directory || snapshotDirDefault
  if (!fs.existsSync(directory)) fs.mkdirSync(directory)
  fs.writeFileSync(path.resolve(directory, `${chainId}-${blockNumber}`), humanReadableStr)
}

export function loadPoolSnapshot(
  chainId: ChainId,
  blockNumber: number | undefined,
  directory?: string
): PoolCode[] | undefined {
  directory = directory || snapshotDirDefault
  const fileName = path.resolve(directory, `${chainId}-${blockNumber}`)
  if (!fs.existsSync(fileName)) return
  const str = fs.readFileSync(fileName, 'utf8')
  const poolCodes = serializer.deserialize(str) as PoolCode[]
  restoreAfterSerialization(poolCodes)
  return poolCodes
}
