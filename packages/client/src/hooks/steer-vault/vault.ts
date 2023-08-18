import { GetSteerVaultArgs, getSteerVaultUrl, SteerVault } from 'src/pure/steer-vault/vault.js'
import { SWRHookConfig } from 'src/types.js'
import useSWR from 'swr'

export const useSteerVault = ({ args, shouldFetch }: SWRHookConfig<GetSteerVaultArgs>) => {
  return useSWR<SteerVault>(shouldFetch !== false ? getSteerVaultUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
