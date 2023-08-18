import { GetSteerVaultsArgs, getSteerVaultsUrl, SteerVaults } from 'src/pure/steer-vault/vaults.js'
import { SWRHookConfig } from 'src/types.js'
import useSWR from 'swr'

export const useSteerVaults = ({ args, shouldFetch }: SWRHookConfig<GetSteerVaultsArgs>) => {
  return useSWR<SteerVaults>(shouldFetch !== false ? getSteerVaultsUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
