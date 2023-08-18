import { SWRHookConfig } from 'src/types.js'
import useSWR from 'swr'

import { GetPoolArgs, getPoolUrl, Pool } from '../../pure/pools/pool.js'

export const usePool = ({ args, shouldFetch }: SWRHookConfig<GetPoolArgs>) => {
  return useSWR<Pool>(shouldFetch !== false ? getPoolUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
