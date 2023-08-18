import { SWRHookConfig } from 'src/types.js'
import useSWR from 'swr'

import { GetSteerVaultCountArgs, getSteerVaultCountUrl, SteerVaultCount } from '../../pure/steer-vault/count.js'

export const useSteerVaultCount = ({ args, shouldFetch }: SWRHookConfig<GetSteerVaultCountArgs>) => {
  return useSWR<SteerVaultCount>(shouldFetch !== false ? getSteerVaultCountUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
