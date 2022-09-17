import { useContractRead } from 'wagmi'

import { getMulticallContractConfig } from './useMulticallContract'

export const useCurrentBlockTimestamp = (chainId: number, enabled: boolean) => {
  return useContractRead({
    ...getMulticallContractConfig(chainId),
    functionName: 'getCurrentBlockTimestamp',
    watch: enabled,
  })
}
