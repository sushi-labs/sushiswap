import { useContractRead } from 'wagmi'

import { getMulticallContractConfig } from './useMulticallContract'

export const useCurrentBlockTimestamp = (chainId: number | undefined, enabled = true) => {
  return useContractRead({
    ...getMulticallContractConfig(chainId),
    functionName: 'getCurrentBlockTimestamp',
    enabled: Boolean(chainId) && enabled,
    watch: enabled,
  })
}
