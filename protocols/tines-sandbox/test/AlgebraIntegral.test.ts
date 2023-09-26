import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { CLTick, RToken, UniV3Pool } from '@sushiswap/tines'
import { expect } from 'chai'
import { Address, createPublicClient, custom, PublicClient, walletActions, WalletClient } from 'viem'
import { hardhat } from 'viem/chains'

import {
  AlgebraIntegralPeriphery,
  approveTestTokensToPerifery,
  createAlgebraIntegralPeriphery,
  createHardhatProviderEmptyBlockchain,
  createTestTokens,
  deployPoolAndMint,
  expectCloseValues,
  mint,
  Range,
  swap,
  TestTokens,
  tryCallAsync,
  updateTinesPool,
} from '../src'

interface TestContext {
  chainId: ChainId
  client: PublicClient & WalletClient
  env: AlgebraIntegralPeriphery
  testTokens: TestTokens
  user: Address
}

interface PoolInfo {
  poolAddress: Address
  pool: UniV3Pool
  token0: Token
  token1: Token
}

let token0Index = 0,
  token1Index = 1 // each new pool needs a new pair of tokens
async function createPool(cntx: TestContext, fee: number, price: number, positions: Range[]): Promise<PoolInfo> {
  if (token1Index >= cntx.testTokens.tokens.length) throw new Error('Unsufficient tokens number')
  const t0 = cntx.testTokens.tokens[token0Index]
  const t1 = cntx.testTokens.tokens[token1Index]
  if (++token1Index >= cntx.testTokens.tokens.length) token1Index = ++token0Index + 1

  const [token0, token1] = t0.sortsBefore(t1) ? [t0, t1] : [t1, t0]
  const poolAddress = await deployPoolAndMint(cntx.client, cntx.env, token0, token1, fee, price)
  expect(poolAddress).not.equal('0x0000000000000000000000000000000000000000')

  const tickMap = new Map<number, bigint>()
  for (let i = 0; i < positions.length; ++i) {
    const position = positions[i]
    const liquidity = await mint(cntx.client, cntx.env, token0, token1, cntx.user, position)

    let tickLiquidity = tickMap.get(position.from) ?? 0n
    tickLiquidity = tickLiquidity === undefined ? liquidity : tickLiquidity + liquidity
    tickMap.set(position.from, tickLiquidity)

    tickLiquidity = tickMap.get(position.to) ?? 0n
    tickLiquidity = tickLiquidity - liquidity
    tickMap.set(position.to, tickLiquidity)
  }

  const ticks: CLTick[] = Array.from(tickMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([index, DLiquidity]) => ({ index, DLiquidity }))

  const pool = new UniV3Pool(poolAddress, token0 as RToken, token1 as RToken, fee / 1e6, 0n, 0n, 0, 0n, 1n, ticks)
  await updateTinesPool(cntx.client, pool)

  return { poolAddress, pool, token0, token1 }
}

async function checkSwap(cntx: TestContext, pool: PoolInfo, amountIn: number | bigint, direction: boolean) {
  await updateTinesPool(cntx.client, pool.pool)
  const expectedAmountOut = pool.pool.calcOutByIn(Number(amountIn), direction, false).out

  const [t0, t1] = direction ? [pool.token0, pool.token1] : [pool.token1, pool.token0]
  const actialAmountOut = await tryCallAsync(() => swap(cntx.client, cntx.env, t0, t1, cntx.user, BigInt(amountIn)))

  if (actialAmountOut === undefined) expect(expectedAmountOut).equal(0)
  else expectCloseValues(actialAmountOut, expectedAmountOut, 1e-10)
}

const E18 = 10n ** 18n

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
    await approveTestTokensToPerifery(client, env, testTokens)
    cntx = {
      chainId,
      client,
      env,
      testTokens,
      user: testTokens.owner,
    }
  })

  it('Empty pool', async () => {
    const pool = await createPool(cntx, 3000, 1, [])
    await checkSwap(cntx, pool, E18, true)
    await checkSwap(cntx, pool, E18, false)
  })

  describe('One position', () => {
    it('No tick crossing', async () => {
      const pool = await createPool(cntx, 3000, 5, [{ from: -1200, to: 18000, val: E18 }])
      await checkSwap(cntx, pool, 1e16, true)
      await checkSwap(cntx, pool, 1e16, false)
    })

    it('Tick crossing', async () => {
      const pool = await createPool(cntx, 3000, 5, [{ from: -1200, to: 18000, val: E18 }])
      await checkSwap(cntx, pool, 1e18, true)
      const pool2 = await createPool(cntx, 3000, 4, [{ from: -1200, to: 18000, val: E18 }])
      await checkSwap(cntx, pool2, 1e20, false)
    })

    it('Swap exact to tick', async () => {
      const pool = await createPool(cntx, 3000, 5, [{ from: -1200, to: 18000, val: E18 }])
      await checkSwap(cntx, pool, 616469173272709204n, true) // before tick
      const pool2 = await createPool(cntx, 3000, 5, [{ from: -1200, to: 18000, val: E18 }])
      await checkSwap(cntx, pool2, 616469173272709205n, true) // after tick
      const pool3 = await createPool(cntx, 3000, 4, [{ from: -1200, to: 18000, val: E18 }])
      await checkSwap(cntx, pool3, 460875064077414607n, false) // before tick
      const pool4 = await createPool(cntx, 3000, 4, [{ from: -1200, to: 18000, val: E18 }])
      await checkSwap(cntx, pool4, 460875064077414607n, false) // after tick
    })

    it('From 0 zone to not 0 zone', async () => {
      const pool = await createPool(cntx, 3000, 50, [{ from: -1200, to: 18000, val: E18 }])
      await checkSwap(cntx, pool, 1e17, true)
    })

    it('From 0 zone through ticks to 0 zone', async () => {
      const pool = await createPool(cntx, 3000, 50, [{ from: -1200, to: 18000, val: E18 }])
      await checkSwap(cntx, pool, 1e18, true)
      const pool2 = await createPool(cntx, 3000, 0.1, [{ from: -1200, to: 18000, val: E18 }])
      await checkSwap(cntx, pool2, 1e19, false)
    })

    // it.skip('Monkey test', async () => {
    //   const pool = await createPool(cntx, 3000, 5, [{ from: -1200, to: 18000, val: E18 }])
    //   await monkeyTest(env, pool, 'test1', 1000, true)
    // })
  })
})
