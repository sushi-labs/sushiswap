import { getV3Pools } from '../future/hooks/pools/actions/getV3Pools'
import { USDC, WETH9 } from '@sushiswap/currency'
import { ChainId } from '@sushiswap/chain'
import { describe, expect, it } from 'vitest'

import { Chain, CreateClientConfig, configureChains, createClient } from 'wagmi'
import { allChains, allProviders } from '@sushiswap/wagmi-config'

const { provider }: CreateClientConfig & { chains: Chain[] } = configureChains(allChains, allProviders, {
  pollingInterval: 8_000,
})

createClient({
  provider,
  autoConnect: true,
  connectors: [],
})

it('test', async () => {
  const pools = await getV3Pools(ChainId.ETHEREUM, [[WETH9[ChainId.ETHEREUM], USDC[ChainId.ETHEREUM]]])
  console.log({ pools })
  expect(true).toBe(true)
})
