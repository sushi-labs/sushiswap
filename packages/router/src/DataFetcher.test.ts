import { ChainId } from '@sushiswap/chain'
import { Native, USDC } from '@sushiswap/currency'
import { providers } from 'ethers'

import { DataFetcher } from './DataFetcher'
import { LiquidityProviders } from './liquidity-providers/LiquidityProvider'
import { NativeWrapProvider } from './liquidity-providers/NativeWrapProvider'
import { SushiProvider } from './liquidity-providers/Sushi'

const chainDataProvider = new providers.JsonRpcProvider('https://api.securerpc.com/v1', 'homestead')
const DATA_FETCHER = new DataFetcher(chainDataProvider, ChainId.ETHEREUM)
const DEFAULT_PROVIDERS = [LiquidityProviders.Sushiswap]
beforeAll(() => {
  expect(DATA_FETCHER).toBeInstanceOf(DataFetcher)
  DATA_FETCHER.startDataFetching(DEFAULT_PROVIDERS)
})

afterAll(() => {
  DATA_FETCHER.stopDataFetching()
})

describe('DataFetcher', () => {
  it('should have providers', async () => {
    const providers = DATA_FETCHER.providers
    expect(providers.length).toBe(2)
    expect(providers[0]).toBeInstanceOf(NativeWrapProvider)
    expect(providers[1]).toBeInstanceOf(SushiProvider)
  })

  it('should have the default state', async () => {
    expect(DATA_FETCHER.getCurrentPoolStateId(DEFAULT_PROVIDERS)).toBe(0)
  })

  const token0 = Native.onChain(ChainId.ETHEREUM)
  const token1 = USDC[ChainId.ETHEREUM]
  it.skip(`should fetch pools for ${token0.symbol} and ${token1.symbol}`, async () => {
    DATA_FETCHER.fetchPoolsForToken(token0, token1)
    await new Promise((r) => setTimeout(r, 1500))
    const pools = DATA_FETCHER.getCurrentPoolCodeMap()
    expect(pools.size).toBeGreaterThan(5)
  })

  it.skip('should have a block', async () => {
    const blockNumber = DATA_FETCHER.getLastUpdateBlock()
    await new Promise((r) => setTimeout(r, 500))
    expect(blockNumber).toBeGreaterThan(0)
    expect(blockNumber).not.toBeUndefined
  })
})
