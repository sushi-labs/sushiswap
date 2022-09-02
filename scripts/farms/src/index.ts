import 'dotenv/config'

import { ChainId } from '@sushiswap/core-sdk'
import { client } from '@sushiswap/wagmi/client'
import { createClient } from '@wagmi/core'
import { getUnixTime } from 'date-fns'

import { MINICHEF_SUBGRAPH_NAME } from './config'
import { getMasterChefV1, getMasterChefV2, getMinichef } from './lib'
import redis from './redis'

createClient(client.config as any)

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
      combined.map(({ chainId, farms }) => [chainId, JSON.stringify({ chainId, farms, updatedAtTimestamp: timestamp })])
    )
  )
  console.log(`Finished updating farms`)
  process.exit()
}
