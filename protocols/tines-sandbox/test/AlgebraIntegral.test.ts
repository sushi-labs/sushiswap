import { ChainId } from '@sushiswap/chain'
import { expect } from 'chai'
import { createPublicClient, custom, walletActions } from 'viem'
import { hardhat } from 'viem/chains'

import {
  AlgebraIntegralPeriphery,
  createAlgebraIntegralPeriphery,
  createHardhatProviderEmptyBlockchain,
  createTestTokens,
  deployPool,
  TestTokens,
} from '../src'

describe('AlgebraIntegral test', () => {
  const chainId = ChainId.ETHEREUM
  let client
  let env: AlgebraIntegralPeriphery
  let testTokens: TestTokens

  before(async () => {
    const provider = await createHardhatProviderEmptyBlockchain()
    client = createPublicClient({
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
    env = await createAlgebraIntegralPeriphery(client)
    testTokens = await createTestTokens(client)
  })

  it('Create a pool', async () => {
    const tokens = testTokens.tokens
    const [t0, t1] = tokens[0].sortsBefore(tokens[1]) ? [tokens[0], tokens[1]] : [tokens[1], tokens[0]]
    const poolAddress = await deployPool(client, env, t0, t1)
    expect(poolAddress).not.equal('0x0000000000000000000000000000000000000000')
  })
})
