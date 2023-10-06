import { ChainId } from 'sushi/chain'
import { expect } from 'chai'
import seedrandom from 'seedrandom'
import { Address, createPublicClient, custom, PublicClient, walletActions, WalletClient } from 'viem'
import { hardhat } from 'viem/chains'

import {
  AlgebraIntegralPeriphery,
  AlgebraPoolInfo,
  algebraPoolSwap,
  approveTestTokensToAlgebraPerifery,
  balanceOf,
  createAlgebraIntegralPeriphery,
  createAlgebraPool as createAlgebraPoolBase,
  createHardhatProviderEmptyBlockchain,
  createRandomAlgebraPool as createRandomAlgebraPoolBase,
  createTestTokens,
  expectCloseValues,
  getRndExpInt,
  Range,
  TestTokens,
  tryCallAsync,
  updateTinesAlgebraPool,
} from '../src'

interface TestContext {
  chainId: ChainId
  client: PublicClient & WalletClient
  env: AlgebraIntegralPeriphery
  testTokens: TestTokens
  user: Address
}
//

async function createAlgebraPool(
  cntx: TestContext,
  fee: number,
  price: number,
  positions: Range[]
): Promise<AlgebraPoolInfo> {
  return createAlgebraPoolBase(cntx.client, cntx.env, cntx.testTokens, cntx.user, fee, price, positions)
}

function getPrecisionExpectation(amount: number): number {
  if (amount < 1e10) return 1e-5
  return 1e-8
}

async function checkAlgebraPoolSwap(
  cntx: TestContext,
  pool: AlgebraPoolInfo,
  amountIn: number | bigint,
  direction: boolean,
  printTick = false
) {
  const { tick } = await updateTinesAlgebraPool(cntx.client, pool.pool)
  const expectedAmountOut = pool.pool.calcOutByIn(Number(amountIn), direction, false).out
  if (printTick) console.log('Tick:', tick, 'Amount: ', amountIn)

  const [t0, t1] = direction ? [pool.token0, pool.token1] : [pool.token1, pool.token0]
  const actialAmountOut = await tryCallAsync(() =>
    algebraPoolSwap(cntx.client, cntx.env, t0, t1, cntx.user, BigInt(amountIn))
  )

  if (actialAmountOut === undefined) expect(expectedAmountOut).equal(0)
  else expectCloseValues(actialAmountOut, expectedAmountOut, getPrecisionExpectation(expectedAmountOut))
}

const E18 = 10n ** 18n

async function getAlgebraRandomSwapParams(
  rnd: () => number,
  client: PublicClient,
  pool: AlgebraPoolInfo
): Promise<[number, boolean]> {
  const res0 = Number(await balanceOf(client, pool.token0, pool.poolAddress))
  const res1 = Number(await balanceOf(client, pool.token1, pool.poolAddress))

  let direction = rnd() > 0.5
  let maxRes = direction ? pool.res0Max - res0 : pool.res1Max - res1
  if (maxRes < 0) {
    direction = !direction
    maxRes = direction ? pool.res0Max - res0 : pool.res1Max - res1
  }
  maxRes = Math.min(maxRes, 1e35)
  const amount = getRndExpInt(rnd, Math.pow(maxRes, 1 / 4), maxRes) + 1000
  //console.log('current price:', price, 'amount:', amount, 'direction:', direction)

  return [amount, direction]
}

export async function createRandomAlgebraPool(
  cntx: TestContext,
  seed: string,
  positionNumber: number,
  fee?: number,
  price?: number
): Promise<AlgebraPoolInfo> {
  return createRandomAlgebraPoolBase(
    cntx.client,
    cntx.env,
    cntx.testTokens,
    cntx.user,
    seed,
    positionNumber,
    fee,
    price
  )
}

async function algebraPoolMonkeyTest(
  cntx: TestContext,
  pool: AlgebraPoolInfo,
  seed: string,
  iterations: number,
  printTick = false
) {
  const rnd: () => number = seedrandom(seed) // random [0, 1)
  for (let i = 0; i < iterations; ++i) {
    const [amount, direction] = await getAlgebraRandomSwapParams(rnd, cntx.client, pool)
    await checkAlgebraPoolSwap(cntx, pool, amount, direction, printTick)
  }
}

describe('AlgebraIntegral test', () => {
  let cntx: TestContext

  before(async () => {
    const { provider, chainId } = await createHardhatProviderEmptyBlockchain()
    const client = createPublicClient({
      chain: {
        ...hardhat,
        contracts: {
          multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 25770160,
          },
        },
        id: chainId,
      },
      transport: custom(provider),
    }).extend(walletActions)
    const env = await createAlgebraIntegralPeriphery(client)
    const testTokens = await createTestTokens(client, 10)
    await approveTestTokensToAlgebraPerifery(client, env, testTokens)
    cntx = {
      chainId,
      client,
      env,
      testTokens,
      user: testTokens.owner,
    }
  })

  it('Empty pool', async () => {
    const pool = await createAlgebraPool(cntx, 3000, 1, [])
    await checkAlgebraPoolSwap(cntx, pool, E18, true)
    await checkAlgebraPoolSwap(cntx, pool, E18, false)
  })

  describe('One position', () => {
    it('No tick crossing', async () => {
      const pool = await createAlgebraPool(cntx, 3000, 5, [{ from: -1200, to: 18000, val: E18 }])
      await checkAlgebraPoolSwap(cntx, pool, 1e16, true)
      await checkAlgebraPoolSwap(cntx, pool, 1e16, false)
    })

    it('Tick crossing', async () => {
      const pool = await createAlgebraPool(cntx, 3000, 5, [{ from: -1200, to: 18000, val: E18 }])
      await checkAlgebraPoolSwap(cntx, pool, 1e18, true)
      const pool2 = await createAlgebraPool(cntx, 3000, 4, [{ from: -1200, to: 18000, val: E18 }])
      await checkAlgebraPoolSwap(cntx, pool2, 1e20, false)
    })

    it('Swap exact to tick', async () => {
      const pool = await createAlgebraPool(cntx, 3000, 5, [{ from: -1200, to: 18000, val: E18 }])
      await checkAlgebraPoolSwap(cntx, pool, 616469173272709204n, true) // before tick
      const pool2 = await createAlgebraPool(cntx, 3000, 5, [{ from: -1200, to: 18000, val: E18 }])
      await checkAlgebraPoolSwap(cntx, pool2, 616469173272709205n, true) // after tick
      const pool3 = await createAlgebraPool(cntx, 3000, 4, [{ from: -1200, to: 18000, val: E18 }])
      await checkAlgebraPoolSwap(cntx, pool3, 460875064077414607n, false) // before tick
      const pool4 = await createAlgebraPool(cntx, 3000, 4, [{ from: -1200, to: 18000, val: E18 }])
      await checkAlgebraPoolSwap(cntx, pool4, 460875064077414607n, false) // after tick
    })

    it('From 0 zone to not 0 zone', async () => {
      const pool = await createAlgebraPool(cntx, 3000, 50, [{ from: -1200, to: 18000, val: E18 }])
      await checkAlgebraPoolSwap(cntx, pool, 1e17, true)
    })

    it('From 0 zone through ticks to 0 zone', async () => {
      const pool = await createAlgebraPool(cntx, 3000, 50, [{ from: -1200, to: 18000, val: E18 }])
      await checkAlgebraPoolSwap(cntx, pool, 1e18, true)
      const pool2 = await createAlgebraPool(cntx, 3000, 0.1, [{ from: -1200, to: 18000, val: E18 }])
      await checkAlgebraPoolSwap(cntx, pool2, 1e19, false)
    })

    it.skip('Monkey test', async () => {
      const pool = await createAlgebraPool(cntx, 3000, 5, [{ from: -1200, to: 18000, val: E18 }])
      await algebraPoolMonkeyTest(cntx, pool, 'test1', 1000, true)
    })
  })

  describe('Two positions', () => {
    it('Special 1', async () => {
      const pool = await createAlgebraPool(cntx, 3000, 12.310868067131443, [
        { from: -1200, to: 18000, val: E18 },
        { from: 24000, to: 48000, val: 5n * E18 },
      ])
      await checkAlgebraPoolSwap(cntx, pool, 85433172055732540, true)
    })
    it('Special 2', async () => {
      const pool = await createAlgebraPool(cntx, 3000, 121.48126046130433, [
        { from: -1200, to: 18000, val: E18 },
        { from: 24000, to: 48000, val: 5n * E18 },
      ])
      await checkAlgebraPoolSwap(cntx, pool, BigInt('154350003013680480'), true)
    })
    it('Special 3', async () => {
      const pool = await createAlgebraPool(cntx, 3000, 6.857889404362659, [
        { from: -1200, to: 18000, val: 2n * E18 },
        { from: 12000, to: 24000, val: 6n * E18 },
      ])
      await checkAlgebraPoolSwap(cntx, pool, BigInt('994664157591385500'), true)
    })
    it('No overlapping small monkey test', async () => {
      const pool = await createAlgebraPool(cntx, 3000, 3, [
        { from: -1200, to: 18000, val: E18 },
        { from: 24000, to: 48000, val: 5n * E18 },
      ])
      await algebraPoolMonkeyTest(cntx, pool, 'small', 10)
    })
    it.skip('No overlapping big monkey test', async () => {
      const pool = await createAlgebraPool(cntx, 3000, 3, [
        { from: -1200, to: 18000, val: E18 },
        { from: 24000, to: 48000, val: 5n * E18 },
      ])
      await algebraPoolMonkeyTest(cntx, pool, 'big', 1000, true)
    })
    it('Touching positions small monkey test', async () => {
      const pool = await createAlgebraPool(cntx, 3000, 4, [
        { from: -1200, to: 18000, val: E18 },
        { from: 18000, to: 42000, val: 5n * E18 },
      ])
      await algebraPoolMonkeyTest(cntx, pool, '_small', 10)
    })
    it.skip('Touching positions big monkey test', async () => {
      const pool = await createAlgebraPool(cntx, 3000, 4, [
        { from: -1200, to: 18000, val: E18 },
        { from: 18000, to: 42000, val: 5n * E18 },
      ])
      await algebraPoolMonkeyTest(cntx, pool, '_big', 1000, true)
    })
    it('Overlapped positions small monkey test', async () => {
      const pool = await createAlgebraPool(cntx, 3000, 8, [
        { from: -1200, to: 18000, val: 2n * E18 },
        { from: 12000, to: 24000, val: 6n * E18 },
      ])
      await algebraPoolMonkeyTest(cntx, pool, 'Small', 10)
    })
    it.skip('Overlapped positions big monkey test', async () => {
      const pool = await createAlgebraPool(cntx, 3000, 8, [
        { from: -1200, to: 18000, val: 2n * E18 },
        { from: 12000, to: 24000, val: 6n * E18 },
      ])
      await algebraPoolMonkeyTest(cntx, pool, 'Big', 1000, true)
    })
    it('Nested positions small monkey test', async () => {
      const pool = await createAlgebraPool(cntx, 3000, 8, [
        { from: -1200, to: 24000, val: 2n * E18 },
        { from: 6000, to: 12000, val: 6n * E18 },
      ])
      await algebraPoolMonkeyTest(cntx, pool, '_small_', 10)
    })
    it.skip('Nested positions big monkey test', async () => {
      const pool = await createAlgebraPool(cntx, 3000, 8, [
        { from: -1200, to: 24000, val: 2n * E18 },
        { from: 6000, to: 12000, val: 6n * E18 },
      ])
      await algebraPoolMonkeyTest(cntx, pool, '_big_', 1000, true)
    })
  })
  it.skip('Random pool monkey test', async () => {
    for (let i = 0; i < 10; ++i) {
      console.log(`Pool #${i} generation ...`)
      const pool = await createRandomAlgebraPool(cntx, `pool${i}`, 100)
      await algebraPoolMonkeyTest(cntx, pool, `monkey${i}`, 100, true)
    }
  })
})
