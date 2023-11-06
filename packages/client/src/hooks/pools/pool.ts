import useSWR from 'swr'

import {
  type GetPoolArgs,
  type Pool,
  getPoolUrl,
} from '../../pure/pools/pool/pool'
import { type SWRHookConfig } from '../../types'

export const usePool = ({ args, shouldFetch }: SWRHookConfig<GetPoolArgs>) => {
  return useSWR<Pool>(
    shouldFetch !== false ? getPoolUrl(args) : null,
    async (url) => fetch(url).then((data) => data.json()),
  )
}
