import useSWR from 'swr'

import {
  type GetSteerVaultsArgs,
  type SteerVaults,
  getSteerVaultsUrl,
} from '../../pure/steer-vault/vaults/vaults'
import { type SWRHookConfig } from '../../types'

export const useSteerVaults = ({
  args,
  shouldFetch,
}: SWRHookConfig<GetSteerVaultsArgs>) => {
  return useSWR<SteerVaults>(
    shouldFetch !== false ? getSteerVaultsUrl(args) : null,
    async (url) => fetch(url).then((data) => data.json()),
  )
}
