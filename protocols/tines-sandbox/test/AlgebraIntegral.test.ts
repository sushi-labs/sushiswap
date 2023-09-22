import { ChainId } from '@sushiswap/chain'
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
  swap,
  TestTokens,
} from '../src'

interface TestContext {
  chainId: ChainId
  client: PublicClient & WalletClient
  env: AlgebraIntegralPeriphery
  testTokens: TestTokens
  user: Address
}

// interface PoolInfo {
//   addr: Address
//   pool: RPool
//   token0: Token
//   token1: Token
// }

// async function createPool(
//   client: PublicClient & WalletClient,
//   env: AlgebraIntegralPeriphery,
//   fee: number,
//   price: number,
//   ranges: Range[]
// ): Promise<PoolInfo> {}

// async function checkSwap(env: AlgebraIntegralPeriphery, pool: Address, amount: number | bigint, direction: boolean) {}

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

  it('A pool: create, mint, swap', async () => {
    const tokens = cntx.testTokens.tokens
    const [t0, t1] = tokens[0].sortsBefore(tokens[1]) ? [tokens[0], tokens[1]] : [tokens[1], tokens[0]]

    const poolAddress = await deployPoolAndMint(
      cntx.client,
      cntx.env,
      t0,
      t1,
      3000,
      1,
      [{ from: -540, to: 540, val: 10n * 10n ** 18n }],
      cntx.user
    )
    expect(poolAddress).not.equal('0x0000000000000000000000000000000000000000')

    const amountOut = await swap(cntx.client, cntx.env, t0, t1, cntx.user, 10n ** 18n)
    expect(Number(amountOut)).greaterThan(0)
  })
})
