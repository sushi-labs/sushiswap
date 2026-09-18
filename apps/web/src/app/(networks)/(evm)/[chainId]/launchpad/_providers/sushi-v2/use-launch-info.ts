'use client'

import ms from 'ms'
import type { EvmAddress, LaunchpadV2ChainId } from 'sushi/evm'
import { useReadContract } from 'wagmi'
import {
  SUSHI_V2_FEE_DISPOSITION_ORDER,
  SUSHI_V2_LAUNCHPAD_ABI,
} from './contract'

export function useSushiV2LaunchInfo({
  chainId,
  factoryAddress,
  address,
  enabled,
}: {
  chainId: LaunchpadV2ChainId
  factoryAddress: EvmAddress
  address: EvmAddress
  enabled: boolean
}) {
  return useReadContract({
    chainId,
    address: factoryAddress,
    abi: SUSHI_V2_LAUNCHPAD_ABI,
    functionName: 'launchInfo',
    args: [address],
    query: {
      enabled,
      staleTime: 0,
      refetchOnMount: 'always',
      refetchInterval: ms('15s'),
      select(info) {
        const feeDisposition =
          SUSHI_V2_FEE_DISPOSITION_ORDER[info.feeDisposition]
        if (!feeDisposition) throw new Error('Unknown launch fee mode')
        return { ...info, feeDisposition }
      },
    },
  })
}
