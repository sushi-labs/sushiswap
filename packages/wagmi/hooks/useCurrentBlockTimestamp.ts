import { otherChains } from '@sushiswap/wagmi-config'
import { useContractRead } from 'wagmi'
import { allChains } from 'wagmi'

import { getMulticallContractConfig } from './useMulticallContract'

const chains = [...allChains, ...otherChains]

export const useCurrentBlockTimestamp = (chainId: number | undefined, enabled = true) => {
  return useContractRead({
    ...getMulticallContractConfig(chainId),
    functionName: 'getCurrentBlockTimestamp',
    enabled: true,
    watch: true,
    keepPreviousData: true,
  })
}
