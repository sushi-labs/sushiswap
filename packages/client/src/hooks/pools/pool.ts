import { GetPoolArgs, getPoolUrl, Pool } from 'src/pure/pools/pool.js'
import { SWRHookConfig } from 'src/types.js'
import useSWR from 'swr'

export const usePool = ({ args, shouldFetch }: SWRHookConfig<GetPoolArgs>) => {
  return useSWR<Pool>(shouldFetch !== false ? getPoolUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
