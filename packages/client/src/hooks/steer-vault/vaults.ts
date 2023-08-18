import { SWRHookConfig } from 'src/types.js'
import useSWR from 'swr'

import { GetSteerVaultsArgs, getSteerVaultsUrl, SteerVaults } from '../../pure/steer-vault/vaults.js'

export const useSteerVaults = ({ args, shouldFetch }: SWRHookConfig<GetSteerVaultsArgs>) => {
  return useSWR<SteerVaults>(shouldFetch !== false ? getSteerVaultsUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
