import { useContractRead } from 'wagmi'

import { getMulticall3ContractConfig } from './useMulticall3Contract'

export const useCurrentBlockTimestamp = (chainId: number | undefined, enabled = true) => {
  return useContractRead({
    ...getMulticall3ContractConfig(chainId),
    functionName: 'getCurrentBlockTimestamp',
    enabled: true,
    watch: true,
    keepPreviousData: true,
  })
}
