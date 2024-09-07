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

  function sendChainStateMessage(chainState: WorkerChainState) {
    sendMessage({
      type: PriceWorkerReceiveMessageType.ChainState,
      chainState: {
        chainId: chainState.chainId,
        listenerCount: chainState.listenerCount,
        lastModified: chainState.lastModified,
        isLoading: chainState.isLoading,
        isUpdating: chainState.isUpdating,
        isError: chainState.isError,
      },
    })
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
          if (decrementChainid(chainId)) {
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

  function incrementChainId(chainId: ChainId) {
    const chainState = state.chains.get(chainId)
    if (chainState) {
      chainState.listenerCount++
      sendChainStateMessage(chainState)
      return chainState.listenerCount === 1
    }

    state.chains.set(chainId, {
      chainId,
      listenerCount: 1,
      priceData: new PriceBufferWrapper({
        useSharedMemory: state.canUseSharedArrayBuffer,
      }),
      lastModified: 0,
      isLoading: true,
      isUpdating: false,
      isError: false,
    })

    sendChainStateMessage(state.chains.get(chainId)!)

    return true
  }

  function decrementChainid(chainId: ChainId) {
    const chainState = state.chains.get(chainId)
    if (chainState && chainState.listenerCount > 0) {
      chainState.listenerCount--
      sendChainStateMessage(chainState)
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

  async function updateChainId(chainId: ChainId) {
    const chainState = state.chains.get(chainId)
    if (!chainState) {
      return
    }

    chainState.isUpdating = true

    sendChainStateMessage(chainState)

    try {
      const { data: newPriceMap, lastModified } =
        await fetchPriceData(chainState)
      updatePriceData(chainState.priceData, newPriceMap)
      chainState.lastModified = lastModified

      chainState.isError = false
    } catch (error: unknown) {
      console.error('Failed to fetch priceMap', chainId, error)
      chainState.isError = true
    } finally {
      chainState.isUpdating = false
      chainState.isLoading = false
    }

    sendChainStateMessage(chainState)

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

  function isActive(chain: WorkerChainState) {
    return chain.listenerCount > 0
  }
}
