import { ChainId } from 'sushi'
import { SUSHI_DATA_API_HOST } from 'sushi/config/subgraph'
import { UPDATE_INTERVAL } from '../config'
import { PriceBufferWrapper } from '../price-data-wrapper/price-buffer-wrapper'
import {
  PriceWorkerPostMessage,
  PriceWorkerPostMessageType,
  PriceWorkerReceiveMessage,
  PriceWorkerReceiveMessageType,
  WorkerChainState,
} from './types'

{
  const state = {
    chains: new Map<ChainId, WorkerChainState>(),
    intervals: new Map<ChainId, NodeJS.Timeout>(),
    canUseSharedArrayBuffer: false,
  }

  function sendMessage(message: PriceWorkerReceiveMessage) {
    self.postMessage(message)
  }

  self.onmessage = async ({
    data: _data,
  }: MessageEvent<PriceWorkerPostMessage | PriceWorkerPostMessage[]>) => {
    const data = Array.isArray(_data) ? _data : [_data]

    let shouldUpdateIntervals = false

    for (const message of data) {
      switch (message.type) {
        case PriceWorkerPostMessageType.Initialize: {
          const { canUseSharedArrayBuffer } = message
          state.canUseSharedArrayBuffer = canUseSharedArrayBuffer
          break
        }
        case PriceWorkerPostMessageType.EnableChainId: {
          const { chainId } = message
          if (enableChainId(chainId)) {
            shouldUpdateIntervals = true
          }
          break
        }
        case PriceWorkerPostMessageType.DisableChainId: {
          const { chainId } = message
          if (disableChainid(chainId)) {
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
      }
    }

    if (shouldUpdateIntervals) {
      updateIntervals()
    }
  }

  function enableChainId(chainId: ChainId) {
    const chainState = state.chains.get(chainId)
    if (chainState) {
      if (chainState.active) {
        return false
      }
      chainState.active = true
      return true
    }

    state.chains.set(chainId, {
      chainId,
      active: true,
      priceData: new PriceBufferWrapper({
        useSharedMemory: state.canUseSharedArrayBuffer,
      }),
      wasFetched: false,
      lastModified: 0,
      isLoading: false,
      isUpdating: false,
      isError: false,
    })

    updateChainId(chainId)

    return true
  }

  function disableChainid(chainId: ChainId) {
    const chainState = state.chains.get(chainId)
    if (chainState) {
      chainState.active = false
      return true
    }

    return false
  }

  function updateIntervals() {
    state.chains.forEach((chainState) => {
      const currentInterval = state.intervals.get(chainState.chainId)

      if (chainState.active && !currentInterval) {
        state.intervals.set(
          chainState.chainId,
          setInterval(() => {
            updateChainId(chainState.chainId)
          }, UPDATE_INTERVAL),
        )
      } else if (!chainState.active && currentInterval) {
        clearInterval(currentInterval)
        state.intervals.delete(chainState.chainId)
      }
    })
  }

  async function updateChainId(chainId: ChainId) {
    const chainState = state.chains.get(chainId)
    if (!chainState) {
      return
    }

    chainState.isUpdating = true
    if (!chainState.wasFetched) {
      chainState.isLoading = true
    }

    sendMessage({
      type: PriceWorkerReceiveMessageType.ChainState,
      chainState: {
        chainId,
        active: chainState.active,
        lastModified: chainState.lastModified,
        isLoading: chainState.isLoading,
        isUpdating: chainState.isUpdating,
        isError: chainState.isError,
      },
    })

    try {
      const { data: newPriceMap, lastModified } =
        await fetchPriceData(chainState)
      updatePriceData(chainState.priceData, newPriceMap)
      chainState.lastModified = lastModified

      chainState.isError = false
      chainState.wasFetched = true
    } catch (error: unknown) {
      console.error('Failed to fetch priceMap', chainId, error)
      chainState.isError = true
    } finally {
      chainState.isUpdating = false
      chainState.isLoading = false
    }

    sendMessage({
      type: PriceWorkerReceiveMessageType.ChainState,
      chainState: {
        chainId,
        active: chainState.active,
        lastModified: chainState.lastModified,
        isLoading: chainState.isLoading,
        isUpdating: chainState.isUpdating,
        isError: chainState.isError,
      },
    })

    sendMessage({
      type: PriceWorkerReceiveMessageType.ChainPriceData,
      chainId,
      priceBuffer:
        chainState.priceData!.arrayBuffer instanceof ArrayBuffer
          ? Buffer.from(chainState.priceData!.arrayBuffer)
          : chainState.priceData!.arrayBuffer,
      priceCount: chainState.priceData!.size,
    })
  }

  async function fetchPriceData({ chainId, lastModified }: WorkerChainState) {
    let url = `https://${SUSHI_DATA_API_HOST}/price/v1/${chainId}`
    if (lastModified) {
      url += `?onlyPricesUpdateSince=${lastModified}`
    }

    const response = await fetch(url, {
      headers: {
        Accept: 'application/octet-stream',
      },
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

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

    return {
      data: priceMap,
      lastModified: Number(response.headers.get('Last-Modified')!),
    }
  }

  function updatePriceData(
    oldPriceData: PriceBufferWrapper,
    newPriceMap: Map<bigint, number>,
  ) {
    for (const [address, price] of newPriceMap) {
      oldPriceData.set(address, price)
    }
  }
}
