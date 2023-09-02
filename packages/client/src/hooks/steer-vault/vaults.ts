import useSWR from 'swr'

import { GetSteerVaultsArgs, getSteerVaultsUrl, SteerVaults } from '../../pure/steer-vault/vaults.js'
import { SWRHookConfig } from '../../types.js'

export const useSteerVaults = ({ args, shouldFetch }: SWRHookConfig<GetSteerVaultsArgs>) => {
  return useSWR<SteerVaults>(shouldFetch !== false ? getSteerVaultsUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
