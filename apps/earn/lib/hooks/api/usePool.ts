import { GetPoolArgs, parseArgs, Pool } from '@sushiswap/client'
import useSWR from 'swr'

export function getPoolUrl(args: GetPoolArgs) {
  return `/earn/api/pool/${parseArgs(args)}`
}

export function usePool(args: GetPoolArgs, shouldFetch = true) {
  return useSWR<Pool>(shouldFetch ? getPoolUrl(args) : null, async (url) => fetch(url).then((data) => data.json()))
}
