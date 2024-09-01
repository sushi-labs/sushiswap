import { createContext, useEffect, useReducer, useState } from 'react'
import { useChainId } from 'wagmi'
import { ReadOnlyPriceBufferWrapper } from './price-data-wrapper'
import {
  PriceWorker,
  PriceWorkerPostMessageType,
  PriceWorkerReceiveMessage,
  PriceWorkerReceiveMessageType,
} from './price-worker/types'
import { ProviderActions, ProviderState } from './types'

function reducer(state: ProviderState, action: ProviderActions): ProviderState {
  switch (action.type) {
    case 'UPDATE_CHAIN_STATE': {
      const currentChain = state.chains.get(action.payload.chainId)

      if (currentChain) {
        state.chains.set(action.payload.chainId, {
          ...action.payload,
          priceData: currentChain.priceData,
        })
      } else {
        state.chains.set(action.payload.chainId, action.payload)
      }

      return {
        ...state,
      }
    }
    case 'UPDATE_CHAIN_PRICE_DATA': {
      const currentChain = state.chains.get(action.payload.chainId)

      if (currentChain) {
        const buffer =
          action.payload.priceBuffer instanceof Buffer
            ? action.payload.priceBuffer
            : Buffer.from(action.payload.priceBuffer)

        const priceData = new ReadOnlyPriceBufferWrapper({
          priceBuffer: buffer,
          priceCount: action.payload.priceCount,
        })

        state.chains.set(action.payload.chainId, {
          ...currentChain,
          priceData,
        })
      }

      return {
        ...state,
      }
    }
    default:
      return state
  }
}

const PriceProviderContext = createContext<ProviderState>({} as ProviderState)

interface PriceProviderContextProps {
  children: React.ReactNode
}

export function PriceProvider({ children }: PriceProviderContextProps) {
  const [worker, setWorker] = useState<PriceWorker>()
  const [state, dispatch] = useReducer(reducer, { chains: new Map() })

  const chainId = useChainId()

  useEffect(() => {
    const worker = new Worker(
      new URL('./price-worker/price-worker.ts', import.meta.url),
    )

    worker.postMessage({
      type: PriceWorkerPostMessageType.Initialize,
      canUseSharedArrayBuffer: false,
    })

    worker.onmessage = (event: MessageEvent<PriceWorkerReceiveMessage>) => {
      switch (event.data.type) {
        case PriceWorkerReceiveMessageType.ChainState:
          dispatch({
            type: 'UPDATE_CHAIN_STATE',
            payload: event.data.chainState,
          })
          break
        case PriceWorkerReceiveMessageType.ChainPriceData:
          dispatch({
            type: 'UPDATE_CHAIN_PRICE_DATA',
            payload: event.data,
          })
          break
      }
    }

    setWorker(worker as unknown as PriceWorker)

    return () => {
      worker.terminate()
    }
  }, [])

  useEffect(() => {
    if (worker) {
      worker.postMessage({
        type: PriceWorkerPostMessageType.EnableChainId,
        chainId,
      })
    }
  }, [chainId, worker])

  return (
    <PriceProviderContext.Provider value={state}>
      {children}
    </PriceProviderContext.Provider>
  )
}
