import useSWR from 'swr'

import { GetPoolArgs, getPoolUrl, Pool } from '../../pure/pools/pool.js'
import { SWRHookConfig } from '../../types.js'

export const usePool = ({ args, shouldFetch }: SWRHookConfig<GetPoolArgs>) => {
  return useSWR<Pool>(shouldFetch !== false ? getPoolUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
