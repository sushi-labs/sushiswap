import { ChainId } from '@sushiswap/chain'
import { DataFetcher, LiquidityProviders, UniV3PoolCode } from '@sushiswap/router'
import { CL_MAX_TICK } from '@sushiswap/tines'
import { CL_MIN_TICK } from '@sushiswap/tines'
import { UniV3Pool } from '@sushiswap/tines'
import {
  createRandomUniV3Pool,
  createUniV3EnvReal,
  createUniV3Pool,
  feeAmountTickSpacing,
  UniV3Environment,
  UniV3PoolInfo,
} from '@sushiswap/tines-sandbox'
import { expect } from 'chai'
import { ethers, network } from 'hardhat'
import { createPublicClient } from 'viem'
import { custom } from 'viem'
import { hardhat } from 'viem/chains'

const POLLING_INTERVAL = process.env.ALCHEMY_ID ? 1_000 : 10_000
async function getDataFetcherData(pool: UniV3PoolInfo): Promise<UniV3Pool> {
  const client = createPublicClient({
    chain: {
      ...hardhat,
      contracts: {
        multicall3: {
          address: '0xca11bde05977b3631167028862be2a173976ca11',
          blockCreated: 25770160,
        },
      },
      pollingInterval: POLLING_INTERVAL,
    },
    transport: custom(network.provider),
  })
  const chainId = network.config.chainId as ChainId

  const dataFetcher = new DataFetcher(chainId, client)
  dataFetcher.startDataFetching([LiquidityProviders.UniswapV3])
  await dataFetcher.fetchPoolsForToken(pool.token0, pool.token1)
  const pcMap = dataFetcher.getCurrentPoolCodeMap(pool.token0, pool.token1)
  const uniPoolCodes = Array.from(pcMap.values()).filter((p) => p instanceof UniV3PoolCode)
  expect(uniPoolCodes.length).equal(1)
  const tinesPool = uniPoolCodes[0].pool as UniV3Pool
  return tinesPool
}

// maxTickDiff - how much is min and max ticks from current price index
// pool1 - reference pool
// pool2 - should be the same, maybe lesser quantity of ticks
function checkPoolsHaveTheSameState(pool1: UniV3Pool, pool2: UniV3Pool, maxTickDiff = 0) {
  expect(pool1.address).equal(pool2.address)
  expect(pool1.token0.address).equal(pool2.token0.address)
  expect(pool1.token1.address).equal(pool2.token1.address)
  expect(pool1.fee).equal(pool2.fee)
  expect(pool1.reserve0.eq(pool2.reserve0)).equal(true)
  expect(pool1.reserve1.eq(pool2.reserve1)).equal(true)
  expect(pool1.liquidity.eq(pool2.liquidity)).equal(true)
  expect(pool1.sqrtPriceX96.eq(pool2.sqrtPriceX96)).equal(true)
  if (pool2.ticks[pool2.nearestTick].index !== CL_MIN_TICK)
    expect(pool1.ticks[pool1.nearestTick].index).equal(pool2.ticks[pool2.nearestTick].index)
  expect(pool1.ticks.length).greaterThanOrEqual(pool2.ticks.length)

  if (maxTickDiff !== 0) {
    // Check ticks, taking into account that pool2 ticks can be a subset of pool1 ticks
    const priceTickIndex = Math.round(Math.log(pool1.calcCurrentPriceWithoutFee(true)) / Math.log(1.0001))
    const minTickIndexCommon = priceTickIndex - maxTickDiff
    const maxTickIndexCommon = priceTickIndex + maxTickDiff
    for (let i1 = 0, i2 = 0, state = 0; i1 < pool1.ticks.length; ) {
      const t1 = pool1.ticks[i1]
      const t2 = pool2.ticks[i2]
      if (i1 == 0) {
        expect(t1.index).equal(CL_MIN_TICK)
        expect(t2.index).equal(CL_MIN_TICK)
        ++i1
        ++i2
      } else if (i1 == pool1.ticks.length - 1) {
        expect(t1.index).equal(CL_MAX_TICK)
        expect(t2.index).equal(CL_MAX_TICK)
        ++i1
      } else if (state == 0) {
        if (t1.index >= minTickIndexCommon || t1.index == t2.index) state = 1 // start to check equal
        else ++i1
      } else if (state == 1) {
        if (t1.index == t2.index) {
          expect(t1.DLiquidity.eq(t2.DLiquidity)).equal(
            true,
            `${t1.index} ${t1.DLiquidity.toString()} != ${t2.DLiquidity.toString()}`
          )
          ++i1
          ++i2
        } else if (t1.index > maxTickIndexCommon) {
          expect(t2.index).equal(CL_MAX_TICK)
          break
        } else expect(t1.index).equal(t2.index, `${t1.index} ${t2.index} ${maxTickIndexCommon}`)
      }
    }
  } else {
    pool1.ticks.forEach((t1, i) => {
      const t2 = pool2.ticks[i]
      expect(t1.index).equal(t2.index)
      expect(t1.DLiquidity.eq(t2.DLiquidity)).equal(
        true,
        `${i}, ${t1.index} ${t1.DLiquidity.toString()} != ${t2.DLiquidity.toString()}`
      )
    })
  }
}

function getPoolInfoTicksForCurrentDataFetcher(poolInfo: UniV3PoolInfo): number {
  const spacing = feeAmountTickSpacing[poolInfo.fee]
  expect(spacing).not.undefined
  return 1000 * spacing
}

describe('DataFetcher Uni V3', () => {
  let env: UniV3Environment

  before(async () => {
    env = await createUniV3EnvReal(ethers)
  })

  it('test simple', async () => {
    // 5 is tick# 16090. So, only ticks from 6090 to 26090 are fetched
    const poolInfo = await createUniV3Pool(env, 500, 5, [
      { from: 0, to: +24000, val: 1e18 },
      { from: 12000, to: +24000, val: 1e18 },
    ])
    const poolTines2 = await getDataFetcherData(poolInfo)
    checkPoolsHaveTheSameState(poolInfo.tinesPool, poolTines2, getPoolInfoTicksForCurrentDataFetcher(poolInfo))
  })

  const randomPools = 5
  for (let i = 0; i < randomPools; ++i) {
    it(`random pool #${i + 1}/${randomPools}`, async () => {
      const poolInfo = await createRandomUniV3Pool(env, 'pool' + i, 10)
      const poolTines2 = await getDataFetcherData(poolInfo)
      //console.log(poolInfo.tinesPool.ticks.length, poolTines2.ticks.length)
      checkPoolsHaveTheSameState(poolInfo.tinesPool, poolTines2, getPoolInfoTicksForCurrentDataFetcher(poolInfo))
    })
  }
})
