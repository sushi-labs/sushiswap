import { useContractRead } from 'wagmi'

import { getMulticallContractConfig } from './useMulticallContract'

export const useCurrentBlockTimestamp = (chainId: number, enabled = true) => {
  return useContractRead({
    ...getMulticallContractConfig(chainId),
    functionName: 'getCurrentBlockTimestamp',
    watch: enabled,
  })
}
