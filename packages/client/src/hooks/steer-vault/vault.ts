import { SWRHookConfig } from 'src/types.js'
import useSWR from 'swr'

import { GetSteerVaultArgs, getSteerVaultUrl, SteerVault } from '../../pure/steer-vault/vault.js'

export const useSteerVault = ({ args, shouldFetch }: SWRHookConfig<GetSteerVaultArgs>) => {
  return useSWR<SteerVault>(shouldFetch !== false ? getSteerVaultUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
