import {
  type PriceWorkerChainId,
  type PriceWorkerReceiveMessage,
  PriceWorkerReceiveMessageType,
  type PriceWorkerRequestAddress,
  type PriceWorkerRequestChainId,
  type WorkerChainState,
} from './types'

type SolanaWorkerDeps = {
  dataApiHost: string
  sendMessage: (message: PriceWorkerReceiveMessage<PriceWorkerChainId>) => void
  updatePriceData: <TKey extends PriceWorkerRequestAddress>(
    oldPriceData: Map<TKey, number>,
    newPriceMap: Map<TKey, number>,
  ) => void
}

const SOLANA_REQUEST_IP_LIMIT = 10
const SOLANA_REQUEST_WINDOW_MS = 60_000
const SOLANA_REQUEST_MAX_ADDRESSES = 60

export function isPriceRequestChainState(
  chainState: WorkerChainState<PriceWorkerChainId>,
): chainState is WorkerChainState<PriceWorkerRequestChainId> {
  return 'request' in chainState
}

export function createSolanaRequestHandlers(deps: SolanaWorkerDeps) {
  function queueSolanaRequests(
    chainState: WorkerChainState<PriceWorkerRequestChainId>,
    addresses: PriceWorkerRequestAddress[],
  ) {
    const request = getRequestState(chainState)

    // Filter out addresses we already have prices for
    const missing = addresses.filter(
      (address) => !chainState.priceMap.has(address),
    )
    if (missing.length === 0) return

    const pending = request.pending
    missing.forEach((addr) => pending.add(addr))

    if (!request.processing) {
      void processPendingSolanaRequests(chainState)
    }
  }

  async function processPendingSolanaRequests(
    chainState: WorkerChainState<PriceWorkerRequestChainId>,
  ) {
    const request = getRequestState(chainState)

    request.processing = true
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
        const pending = request.pending
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
      request.processing = false
    }
  }

  async function requestAndApplySolanaPrices(
    chainState: WorkerChainState<PriceWorkerRequestChainId>,
    addresses: PriceWorkerRequestAddress[],
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
      console.error('Failed to request prices', chainState.chainId, error)
      chainState.isError = true
    }
  }

  async function respectSolanaRateLimit(
    chainState: WorkerChainState<PriceWorkerRequestChainId>,
  ) {
    const request = getRequestState(chainState)

    const timestamps = request.timestamps
    const now = Date.now()
    const windowStart = now - SOLANA_REQUEST_WINDOW_MS
    const recent = timestamps.filter((t) => t >= windowStart)

    if (recent.length >= SOLANA_REQUEST_IP_LIMIT) {
      const earliest = recent[0]
      const waitMs = SOLANA_REQUEST_WINDOW_MS - (now - earliest)
      await new Promise((resolve) => setTimeout(resolve, waitMs))
    }

    request.timestamps = [...recent, Date.now()]
  }

  return { queueSolanaRequests }
}

function getRequestState(
  chainState: WorkerChainState<PriceWorkerRequestChainId>,
) {
  if (!chainState.request) {
    chainState.request = {
      pending: new Set<PriceWorkerRequestAddress>(),
      processing: false,
      timestamps: [],
    }
  }

  return chainState.request
}

async function parseSolanaResponse(response: Response) {
  const data = (await response.json()) as Record<
    PriceWorkerRequestAddress,
    number
  >
  const solPriceMap = new Map<PriceWorkerRequestAddress, number>()
  for (const [address, price] of Object.entries(data)) {
    solPriceMap.set(address as PriceWorkerRequestAddress, price)
  }

  return solPriceMap
}
