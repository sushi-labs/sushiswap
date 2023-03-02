import 'dotenv/config'
import './lib/wagmi.js'

import { ChainId } from '@sushiswap/chain'
import { MINICHEF_SUBGRAPH_NAME } from '@sushiswap/graph-config'
import { getUnixTime } from 'date-fns'
import stringify from 'fast-json-stable-stringify'

import { getMasterChefV1 } from './lib/chefs/masterChefV1/index.js'
import { getMasterChefV2 } from './lib/chefs/masterChefV2/index.js'
import { getMinichef } from './lib/chefs/minichef/index.js'

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

  const totalFarms = combined.reduce((acc, { farms }) => acc + (farms ? Object.keys(farms).length : 0), 0)
  for (const combination of combined) {
    if (combination.farms) {
      console.log(`Chain ID: ${combination.chainId}. Farms: ${Object.keys(combination.farms).length}`)
    } else {
      console.log(`Chain ID: ${combination.chainId}. Error.`)
    }
  }
  console.log(`Total farms: ${totalFarms}`)

  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (process.env.DRY_RUN) return
  ;(await import('./lib/redis.js')).redis.hset(
    'farms',
    Object.fromEntries(
      combined
        .filter(({ farms }) => farms !== null)
        .map(({ chainId, farms }) => [chainId, stringify({ chainId, farms, updatedAtTimestamp: timestamp })])
    )
  )
  console.log(`Finished updating farms`)
}
