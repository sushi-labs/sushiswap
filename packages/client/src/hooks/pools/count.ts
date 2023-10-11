import { default as useSWR } from 'swr'

import {
  type GetPoolCountArgs,
  type PoolCount,
  getPoolCountUrl,
} from '../../pure/pools/count.js'
import { type SWRHookConfig } from '../../types.js'

export const usePoolCount = ({
  args,
  shouldFetch,
}: SWRHookConfig<GetPoolCountArgs>) => {
  return useSWR<PoolCount>(
    shouldFetch !== false ? getPoolCountUrl(args) : null,
    async (url) => fetch(url).then((data) => data.json()),
  )
}
