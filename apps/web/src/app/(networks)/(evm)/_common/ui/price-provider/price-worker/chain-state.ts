import { isStellarChainId } from 'sushi/stellar'
import { isSvmChainId } from 'sushi/svm'
import type {
  PriceWorkerAddress,
  PriceWorkerChainId,
  PriceWorkerRequestAddress,
  WorkerChainState,
} from './types'

export function createChainState(
  chainId: PriceWorkerChainId,
): WorkerChainState<PriceWorkerChainId> {
  if (isStellarChainId(chainId)) {
    return {
      chainId,
      listenerCount: 1,
      priceMap: new Map<PriceWorkerAddress, number>(),
      lastModified: 0,
      isLoading: true,
      isUpdating: false,
      isError: false,
    }
  }

  if (isSvmChainId(chainId)) {
    return {
      chainId,
      listenerCount: 1,
      priceMap: new Map<PriceWorkerRequestAddress, number>(),
      lastModified: 0,
      isLoading: true,
      isUpdating: false,
      isError: false,
      request: {
        pending: new Set<PriceWorkerRequestAddress>(),
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
