import { GetPoolsArgs, parseArgs, Pools } from '@sushiswap/client'
import useSWR from 'swr'

export function getPoolsUrl(args: GetPoolsArgs) {
  return `/analytics/api/pools${parseArgs(args)}`
}

export async function getPools(args: GetPoolsArgs = {}): Promise<Pools> {
  return fetch(getPoolsUrl(args)).then((data) => data.json())
}

export function usePools(args: GetPoolsArgs = {}, shouldFetch = true) {
  return useSWR<Pools>(shouldFetch ? getPoolsUrl(args) : null, async (url) => fetch(url).then((data) => data.json()))
}
