import useSWR from 'swr'

import { GetSteerVaultArgs, getSteerVaultUrl, SteerVault } from '../../pure/steer-vault/vault.js'
import { SWRHookConfig } from '../../types.js'

export const useSteerVault = ({ args, shouldFetch }: SWRHookConfig<GetSteerVaultArgs>) => {
  return useSWR<SteerVault>(shouldFetch !== false ? getSteerVaultUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
