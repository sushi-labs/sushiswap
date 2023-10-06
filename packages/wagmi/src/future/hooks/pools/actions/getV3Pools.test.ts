import { getV3Pools } from './getV3Pools'
import { USDC, WETH9 } from 'sushi/currency'
import { ChainId } from 'sushi/chain'
import { expect, it } from 'vitest'

it('test', async () => {
  const pools = await getV3Pools(ChainId.ETHEREUM, [
    [WETH9[ChainId.ETHEREUM], USDC[ChainId.ETHEREUM]],
  ])
  expect(pools.length).toBeGreaterThan(0)
})
