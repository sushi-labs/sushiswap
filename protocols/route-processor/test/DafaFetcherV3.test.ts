import { ChainId } from '@sushiswap/chain'
import { DataFetcher, LiquidityProviders, UniV3PoolCode } from '@sushiswap/router'
import { UniV3Pool } from '@sushiswap/tines'
import { createUniV3EnvReal, createUniV3Pool, UniV3Environment, UniV3PoolInfo } from '@sushiswap/tines-sandbox'
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

function checkPoolsHaveTheSameState(pool1: UniV3Pool, pool2: UniV3Pool) {
  expect(pool1.address).equal(pool2.address)
  expect(pool1.token0.address).equal(pool2.token0.address)
  expect(pool1.token1.address).equal(pool2.token1.address)
  expect(pool1.fee).equal(pool2.fee)
  expect(pool1.reserve0.eq(pool2.reserve0)).equal(true)
  expect(pool1.reserve1.eq(pool2.reserve1)).equal(true)
  expect(pool1.liquidity.eq(pool2.liquidity)).equal(true)
  expect(pool1.sqrtPriceX96.eq(pool2.sqrtPriceX96)).equal(true)
  expect(pool1.nearestTick).equal(pool2.nearestTick)
  expect(pool1.ticks.length).equal(pool2.ticks.length)
  pool1.ticks.forEach((t1, i) => {
    const t2 = pool2.ticks[i]
    expect(t1.index).equal(t2.index)
    expect(t1.DLiquidity.eq(t2.DLiquidity)).equal(true)
  })
}

describe('DataFetcher Uni V3', () => {
  let env: UniV3Environment

  before(async () => {
    env = await createUniV3EnvReal(ethers)
  })

  it('test 1', async () => {
    // 5 is tick# 16090. So, only ticks from 6090 to 26090 are fetched
    const poolInfo = await createUniV3Pool(env, 500, 5, [{ from: 12000, to: +24000, val: 1e18 }])
    const poolTines2 = await getDataFetcherData(poolInfo)
    checkPoolsHaveTheSameState(poolInfo.tinesPool, poolTines2)
  })
})
