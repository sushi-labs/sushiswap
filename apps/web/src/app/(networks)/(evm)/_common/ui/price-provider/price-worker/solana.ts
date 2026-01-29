import { isSvmChainId, type SvmAddress, type SvmChainId } from 'sushi/svm'
import {
  type EvmOrSvmChainId,
  type PriceWorkerReceiveMessage,
  PriceWorkerReceiveMessageType,
  type WorkerChainState,
} from './types'

type SolanaWorkerDeps = {
  dataApiHost: string
  sendMessage: (message: PriceWorkerReceiveMessage<EvmOrSvmChainId>) => void
  updatePriceData: <TKey extends bigint | SvmAddress>(
    oldPriceData: Map<TKey, number>,
    newPriceMap: Map<TKey, number>,
  ) => void
}

const SOLANA_REQUEST_IP_LIMIT = 10
const SOLANA_REQUEST_WINDOW_MS = 60_000
const SOLANA_REQUEST_MAX_ADDRESSES = 60

export function isSvmChainState(
  chainState: WorkerChainState<EvmOrSvmChainId>,
): chainState is WorkerChainState<SvmChainId> {
  return isSvmChainId(chainState.chainId)
}

export function createSolanaRequestHandlers(deps: SolanaWorkerDeps) {
  function queueSolanaRequests(
    chainState: WorkerChainState<SvmChainId>,
    addresses: SvmAddress[],
  ) {
    chainState.svmRequest ??= {
      pending: new Set<SvmAddress>(),
      processing: false,
      timestamps: [],
    }

    // Filter out addresses we already have prices for
    const missing = addresses.filter(
      (address) => !chainState.priceMap.has(address),
    )
    if (missing.length === 0) return

    const pending = chainState.svmRequest.pending
    missing.forEach((addr) => pending.add(addr))

    if (!chainState.svmRequest.processing) {
      void processPendingSolanaRequests(chainState)
    }
  }

  async function processPendingSolanaRequests(
    chainState: WorkerChainState<SvmChainId>,
  ) {
    chainState.svmRequest ??= {
      pending: new Set<SvmAddress>(),
      processing: false,
      timestamps: [],
    }

    chainState.svmRequest.processing = true
    chainState.isUpdating = true
    deps.sendMessage({
      type: PriceWorkerReceiveMessageType.ChainState,
      payload: {
        chainId: chainState.chainId,
        isUpdating: chainState.isUpdating,
      },
    })

    try {
      while (true) {
        const pending = chainState.svmRequest.pending
        if (pending.size === 0) break

        const batch = Array.from(pending).slice(0, SOLANA_REQUEST_MAX_ADDRESSES)
        batch.forEach((addr) => pending.delete(addr))

        await respectSolanaRateLimit(chainState)

        await requestAndApplySolanaPrices(chainState, batch)
      }
    } finally {
      chainState.isUpdating = false
      deps.sendMessage({
        type: PriceWorkerReceiveMessageType.ChainState,
        payload: {
          chainId: chainState.chainId,
          isUpdating: chainState.isUpdating,
          priceMap: chainState.priceMap,
          isError: chainState.isError,
          lastModified: chainState.lastModified,
          isLoading: chainState.isLoading,
        },
      })
      chainState.svmRequest.processing = false
    }
  }

  async function requestAndApplySolanaPrices(
    chainState: WorkerChainState<SvmChainId>,
    addresses: SvmAddress[],
  ) {
    try {
      const response = await fetch(
        `${deps.dataApiHost}/price/v1/solana/request?referer=sushi`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ addresses }),
          cache: 'no-store',
        },
      )

      if (!response.ok) {
        throw new Error('Solana request endpoint response was not ok')
      }

      const newPriceMap = await parseSolanaResponse(response)

      deps.updatePriceData(chainState.priceMap, newPriceMap)
      chainState.isError = false

      deps.sendMessage({
        type: PriceWorkerReceiveMessageType.ChainState,
        payload: {
          chainId: chainState.chainId,
          priceMap: chainState.priceMap,
          lastModified: chainState.lastModified,
          isError: chainState.isError,
        },
      })
    } catch (error) {
      console.error('Failed to request Solana prices', chainState.chainId, error)
      chainState.isError = true
    }
  }

  async function respectSolanaRateLimit(
    chainState: WorkerChainState<SvmChainId>,
  ) {
    chainState.svmRequest ??= {
      pending: new Set<SvmAddress>(),
      processing: false,
      timestamps: [],
    }

    const timestamps = chainState.svmRequest.timestamps
    const now = Date.now()
    const windowStart = now - SOLANA_REQUEST_WINDOW_MS
    const recent = timestamps.filter((t) => t >= windowStart)

    if (recent.length >= SOLANA_REQUEST_IP_LIMIT) {
      const earliest = recent[0]
      const waitMs = SOLANA_REQUEST_WINDOW_MS - (now - earliest)
      await new Promise((resolve) => setTimeout(resolve, waitMs))
    }

    chainState.svmRequest.timestamps = [...recent, Date.now()]
  }

  return { queueSolanaRequests }
}

async function parseSolanaResponse(response: Response) {
  const data = (await response.json()) as Record<SvmAddress, number>
  const solPriceMap = new Map<SvmAddress, number>()
  for (const [address, price] of Object.entries(data)) {
    solPriceMap.set(address as SvmAddress, price)
  }

  return solPriceMap
}
