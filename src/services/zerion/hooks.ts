import { useActiveWeb3React } from 'app/services/web3'
import useSWR, { SWRConfiguration } from 'swr'

import { getAssets } from './fetchers'

// @ts-ignore TYPE NEEDS FIXING
export function useAssets(swrConfig: SWRConfiguration = undefined) {
  const { account } = useActiveWeb3React()
  // @ts-ignore TYPE NEEDS FIXING
  const { data } = useSWR(account ? ['userAssets', account] : null, () => getAssets(account), swrConfig)
  return data
}
