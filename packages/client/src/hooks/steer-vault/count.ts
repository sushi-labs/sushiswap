import { GetSteerVaultCountArgs, getSteerVaultCountUrl, SteerVaultCount } from 'src/pure/steer-vault/count.js'
import { SWRHookConfig } from 'src/types.js'
import useSWR from 'swr'

export const useSteerVaultCount = ({ args, shouldFetch }: SWRHookConfig<GetSteerVaultCountArgs>) => {
  return useSWR<SteerVaultCount>(shouldFetch !== false ? getSteerVaultCountUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
