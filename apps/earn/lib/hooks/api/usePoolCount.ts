import { GetPoolCountArgs, parseArgs } from '@sushiswap/client'
import useSWR from 'swr'

export function getPoolCountUrl(args: GetPoolCountArgs) {
  return `/earn/api/pools/count${parseArgs(args)}`
}

export async function getPoolCount(args: GetPoolCountArgs = {}): Promise<number> {
  return fetch(getPoolCountUrl(args)).then((data) => data.json())
}

export function usePoolCount(args: GetPoolCountArgs = {}, shouldFetch = true) {
  return useSWR<number>(shouldFetch ? getPoolCountUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
