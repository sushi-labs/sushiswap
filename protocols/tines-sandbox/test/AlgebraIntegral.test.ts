import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { CLTick, RPool, RToken, UniV3Pool } from '@sushiswap/tines'
import { expect } from 'chai'
import { Address, createPublicClient, custom, PublicClient, walletActions, WalletClient } from 'viem'
import { hardhat } from 'viem/chains'

import {
  AlgebraIntegralPeriphery,
  approveTestTokensToPerifery,
  balanceOf,
  createAlgebraIntegralPeriphery,
  createHardhatProviderEmptyBlockchain,
  createTestTokens,
  deployPoolAndMint,
  expectCloseValues,
  mint,
  Range,
  swap,
  TestTokens,
  tickAndLiquidity,
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
  pool: RPool
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

  const token0Balance = await balanceOf(cntx.client, token0, poolAddress)
  const token1Balance = await balanceOf(cntx.client, token1, poolAddress)

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

  const { tick, liquidity } = await tickAndLiquidity(cntx.client, poolAddress)
  const ticks: CLTick[] = Array.from(tickMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([index, DLiquidity]) => ({ index, DLiquidity }))

  const pool = new UniV3Pool(
    poolAddress,
    token0 as RToken,
    token1 as RToken,
    fee / 1e6,
    token0Balance,
    token1Balance,
    Number(tick),
    liquidity,
    BigInt(Math.sqrt(price) * 2 ** 96),
    ticks
  )

  return { poolAddress, pool, token0, token1 }
}

async function checkSwap(cntx: TestContext, pool: PoolInfo, amountIn: number | bigint, direction: boolean) {
  const [t0, t1] = direction ? [pool.token0, pool.token1] : [pool.token1, pool.token0]
  const actialAmountOut = await swap(cntx.client, cntx.env, t0, t1, cntx.user, BigInt(amountIn))
  const expectedAmountOut = pool.pool.calcOutByIn(Number(amountIn), direction).out
  expectCloseValues(actialAmountOut, expectedAmountOut, 1e-10)
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

  it('create', async () => {
    const poolInfo = await createPool(cntx, 3000, 1, [{ from: -540, to: 540, val: 10n * E18 }])
    await checkSwap(cntx, poolInfo, E18, true)
  })
})
