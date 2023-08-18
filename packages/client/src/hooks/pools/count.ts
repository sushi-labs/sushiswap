import { GetPoolCountArgs, getPoolCountUrl, PoolCount } from 'src/pure/pools/count.js'
import { SWRHookConfig } from 'src/types.js'
import { default as useSWR } from 'swr'

export const usePoolCount = ({ args, shouldFetch }: SWRHookConfig<GetPoolCountArgs>) => {
  return useSWR<PoolCount>(shouldFetch !== false ? getPoolCountUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
