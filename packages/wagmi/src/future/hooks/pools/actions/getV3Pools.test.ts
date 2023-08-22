import { getV3Pools } from './getV3Pools'
import { USDC, WETH9 } from '@sushiswap/currency'
import { ChainId } from '@sushiswap/chain'
import { expect, it } from 'vitest'

it('test', async () => {
  const pools = await getV3Pools(ChainId.ETHEREUM, [[WETH9[ChainId.ETHEREUM], USDC[ChainId.ETHEREUM]]])
  expect(pools.length).toBeGreaterThan(0)
})
