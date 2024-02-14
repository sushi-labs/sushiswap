import useSWR from 'swr'

import {
  type Bonds,
  type GetBondsArgs,
  getBondsUrl,
} from '../../pure/bonds/bonds/bonds'
import { type SWRHookConfig } from '../../types'

export const useBonds = ({
  args,
  shouldFetch,
}: SWRHookConfig<GetBondsArgs>) => {
  return useSWR<Bonds>(
    shouldFetch !== false ? getBondsUrl(args) : null,
    async (url) => fetch(url).then((data) => data.json()),
  )
}
