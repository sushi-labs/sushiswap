import useSWR from 'swr'

import {
  type Bond,
  type GetBondArgs,
  getBondUrl,
} from '../../pure/bonds/bond/bond'
import { type SWRHookConfig } from '../../types'

export const useBond = ({ args, shouldFetch }: SWRHookConfig<GetBondArgs>) => {
  return useSWR<Bond>(
    shouldFetch !== false ? getBondUrl(args) : null,
    async (url) => fetch(url).then((data) => data.json()),
  )
}
