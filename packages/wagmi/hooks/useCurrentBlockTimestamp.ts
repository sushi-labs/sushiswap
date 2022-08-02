import { useContractRead } from 'wagmi'

import { getMulticallContractConfig } from './useMulticallContract'

export const useCurrentBlockTimestamp = (chainId: number) => {
  return useContractRead({
    ...getMulticallContractConfig(chainId),
    functionName: 'getCurrentBlockTimestamp',
  })
}
