import { useContractRead } from 'wagmi'

import { getMulticall3ContractConfig } from './useMulticall3Contract'

// TODO: Readd direct export, not sure why it's not working
export const useCurrentBlockTimestamp = (chainId: number | undefined, enabled = true) => {
  const { data } = useContractRead({
    ...getMulticall3ContractConfig(chainId),
    functionName: 'getCurrentBlockTimestamp',
    enabled,
    watch: true,
    keepPreviousData: true,
  })

  return { data }
}
