import 'dotenv/config'
import './lib/wagmi.js'

import { ChainId } from '@sushiswap/chain'
import { MINICHEF_SUBGRAPH_NAME } from '@sushiswap/graph-config'
import { getUnixTime } from 'date-fns'
import stringify from 'fast-json-stable-stringify'

import { getMasterChefV1 } from './lib/chefs/masterChefV1/index.js'
import { getMasterChefV2 } from './lib/chefs/masterChefV2/index.js'
import { getMinichef } from './lib/chefs/minichef/index.js'
import { redis } from './lib/redis.js'

export async function execute() {
  console.log(`Updating farms`)

  const timestamp = getUnixTime(Date.now())

  const minichefsP = Object.keys(MINICHEF_SUBGRAPH_NAME).map((chainId) => getMinichef(Number(chainId)))
  const masterChefV1P = getMasterChefV1()
  const masterChefV2P = getMasterChefV2()

  const [masterChefV1, masterChefV2, ...minichefs] = await Promise.all([masterChefV1P, masterChefV2P, ...minichefsP])
  const combined = [
    {
      chainId: ChainId.ETHEREUM,
      farms: { ...masterChefV1.farms, ...masterChefV2.farms },
    },
    ...minichefs,
  ]

  await redis.hset(
    'farms',
    Object.fromEntries(
      combined.map(({ chainId, farms }) => [chainId, stringify({ chainId, farms, updatedAtTimestamp: timestamp })])
    )
  )
  console.log(`Finished updating farms`)
}
