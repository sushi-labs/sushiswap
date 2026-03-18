import { type SvmAddress, isSvmChainId } from 'sushi/svm'
import type { EvmOrSvmChainId, WorkerChainState } from './types'

export function createChainState(
  chainId: EvmOrSvmChainId,
): WorkerChainState<EvmOrSvmChainId> {
  if (isSvmChainId(chainId)) {
    return {
      chainId,
      listenerCount: 1,
      priceMap: new Map<SvmAddress, number>(),
      lastModified: 0,
      isLoading: true,
      isUpdating: false,
      isError: false,
      svmRequest: {
        pending: new Set<SvmAddress>(),
        processing: false,
        timestamps: [],
      },
    }
  }

  return {
    chainId,
    listenerCount: 1,
    priceMap: new Map<bigint, number>(),
    lastModified: 0,
    isLoading: true,
    isUpdating: false,
    isError: false,
  }
}
