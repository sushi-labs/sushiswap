import { SUSHI_DATA_API_HOST } from 'src/lib/constants'
import { isEvmChainId } from 'sushi/evm'
import { UPDATE_INTERVAL } from '../config'
import {
  type EvmOrSvmChainId,
  type PriceWorkerPostMessage,
  PriceWorkerPostMessageType,
  type PriceWorkerReceiveMessage,
  PriceWorkerReceiveMessageType,
  type WorkerChainState,
} from './types'

{
  const state = {
    chains: new Map<EvmOrSvmChainId, WorkerChainState<EvmOrSvmChainId>>(),
    intervals: new Map<EvmOrSvmChainId, NodeJS.Timeout>(),
    enabled: true,
    canUseSharedArrayBuffer: false,
  }

  function sendMessage(message: PriceWorkerReceiveMessage<EvmOrSvmChainId>) {
    self.postMessage(message)
  }

  self.onmessage = async ({
    data: _data,
  }: MessageEvent<
    | PriceWorkerPostMessage<EvmOrSvmChainId>
    | PriceWorkerPostMessage<EvmOrSvmChainId>[]
  >) => {
    const data = Array.isArray(_data) ? _data : [_data]

    let shouldUpdateIntervals = false

    for (const message of data) {
      switch (message.type) {
        case PriceWorkerPostMessageType.Initialize: {
          const { canUseSharedArrayBuffer } = message
          state.canUseSharedArrayBuffer = canUseSharedArrayBuffer
          break
        }
        case PriceWorkerPostMessageType.IncrementChainId: {
          const { chainId } = message
          if (incrementChainId(chainId)) {
            shouldUpdateIntervals = true
            updateChainId(chainId)
          }
          break
        }
        case PriceWorkerPostMessageType.DecrementChainId: {
          const { chainId } = message
          if (decrementChainId(chainId)) {
            shouldUpdateIntervals = true
          }
          break
        }
        case PriceWorkerPostMessageType.RefetchChainId: {
          const { chainId } = message
          const chainState = state.chains.get(chainId)
          if (chainState) {
            updateChainId(chainId)
          }
          break
        }
        case PriceWorkerPostMessageType.SetEnabled: {
          const { enabled } = message
          if (state.enabled !== enabled) {
            shouldUpdateIntervals = true
          }
          state.enabled = enabled
          if (enabled && shouldUpdateIntervals) {
            updateEnabledChainIds()
          }
          break
        }
      }
    }

    if (shouldUpdateIntervals) {
      updateIntervals()
    }
  }

  function incrementChainId(chainId: EvmOrSvmChainId) {
    const chainState = state.chains.get(chainId)
    if (chainState) {
      chainState.listenerCount++
      return chainState.listenerCount === 1
    }

    state.chains.set(chainId, {
      chainId,
      listenerCount: 1,
      priceMap: new Map() as WorkerChainState<EvmOrSvmChainId>['priceMap'],
      lastModified: 0,
      isLoading: true,
      isUpdating: false,
      isError: false,
    })

    sendMessage({
      type: PriceWorkerReceiveMessageType.ChainState,
      payload: {
        chainId,
        lastModified: 0,
        isLoading: true,
        isUpdating: false,
        isError: false,
      },
    })

    return true
  }

  function decrementChainId(chainId: EvmOrSvmChainId) {
    const chainState = state.chains.get(chainId)
    if (chainState && chainState.listenerCount > 0) {
      chainState.listenerCount--
      return chainState.listenerCount === 0
    }

    return false
  }

  function updateIntervals() {
    state.chains.forEach((chainState) => {
      const currentInterval = state.intervals.get(chainState.chainId)

      if (isActive(chainState) && !currentInterval) {
        state.intervals.set(
          chainState.chainId,
          setInterval(() => {
            updateChainId(chainState.chainId)
          }, UPDATE_INTERVAL),
        )
      } else if (!isActive(chainState) && currentInterval) {
        clearInterval(currentInterval)
        state.intervals.delete(chainState.chainId)
      }
    })
  }

  async function updateEnabledChainIds() {
    for (const chainState of state.chains.values()) {
      if (isActive(chainState)) {
        updateChainId(chainState.chainId)
      }
    }
  }

  async function updateChainId(chainId: EvmOrSvmChainId) {
    const chainState = state.chains.get(chainId)
    if (!chainState) return

    chainState.isUpdating = true

    sendMessage({
      type: PriceWorkerReceiveMessageType.ChainState,
      payload: {
        chainId,
        isUpdating: chainState.isUpdating,
      },
    })

    let sendPrices = false

    try {
      const { data: newPriceMap, lastModified } =
        await fetchPriceData(chainState)
      updatePriceData(chainState.priceMap, newPriceMap)
      chainState.lastModified = lastModified
      chainState.isError = false

      sendPrices = true
    } catch (error: unknown) {
      console.error('Failed to fetch priceMap', chainId, error)
      chainState.isError = true
    } finally {
      chainState.isUpdating = false
      chainState.isLoading = false
    }

    sendMessage({
      type: PriceWorkerReceiveMessageType.ChainState,
      payload: {
        chainId,
        lastModified: chainState.lastModified,
        isLoading: chainState.isLoading,
        isUpdating: chainState.isUpdating,
        isError: chainState.isError,
        priceMap: sendPrices ? (chainState.priceMap as any) : undefined,
      },
    })
  }

  const normalizeResponse = async (
    response: Response,
    chainId: EvmOrSvmChainId,
  ) => {
    if (isEvmChainId(chainId)) {
      const buffer = Buffer.from(await response.arrayBuffer())
      const priceMap = new Map<bigint, number>()
      for (let i = 0; i < buffer.byteLength; i += 24) {
        const address = BigInt(
          `0x${buffer
            .subarray(i, i + 20)
            .toString('hex')
            .padStart(40, '0')}`,
        )
        const price = buffer.readFloatLE(i + 20)

        priceMap.set(address, price)
      }
      return priceMap
    }

    const data = (await response.json()) as Record<string, number>
    const solPriceMap = new Map<string, number>()
    for (const [address, price] of Object.entries(data)) {
      solPriceMap.set(address, price)
    }

    return solPriceMap
  }

  async function fetchPriceData({
    chainId,
    lastModified,
  }: WorkerChainState<EvmOrSvmChainId>) {
    let url = `${SUSHI_DATA_API_HOST}/price/v1/${chainId}?referer=sushi`
    if (lastModified) {
      url += `&onlyPricesUpdateSince=${lastModified}`
    }

    const response = await fetch(url, {
      headers: {
        // EVM supports buffer format, Solana does not.
        Accept: isEvmChainId(chainId)
          ? 'application/octet-stream'
          : 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const priceMap = await normalizeResponse(response, chainId)

    return {
      data: priceMap,
      lastModified: Number(response.headers.get('Last-Updated')!),
    }
  }

  function updatePriceData<TKey extends bigint | string>(
    oldPriceData: Map<TKey, number>,
    newPriceMap: Map<TKey, number>,
  ) {
    for (const [address, price] of newPriceMap) {
      if (price === 0 || !Number.isFinite(price)) {
        oldPriceData.delete(address)
      } else {
        oldPriceData.set(address, price)
      }
    }
  }

  function isActive(chain: WorkerChainState<EvmOrSvmChainId>) {
    return chain.listenerCount > 0 && state.enabled
  }
}
