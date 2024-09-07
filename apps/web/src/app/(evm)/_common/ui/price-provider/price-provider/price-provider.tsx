import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { ChainId } from 'sushi'
import { useChainId } from 'wagmi'
import { ReadOnlyPriceBufferWrapper } from '../price-data-wrapper/price-buffer-wrapper'
import {
  PriceWorker,
  PriceWorkerPostMessageType,
  PriceWorkerReceiveMessage,
  PriceWorkerReceiveMessageType,
} from '../price-worker/types'
import { Provider, ProviderActions, ProviderState } from './types'

function reducer(state: ProviderState, action: ProviderActions): ProviderState {
  switch (action.type) {
    case 'UPDATE_CHAIN_STATE': {
      const currentChain = state.chains.get(action.payload.chainId)

      let priceData
      if (action.payload.prices) {
        let priceBuffer
        if (action.payload.prices.priceData instanceof Buffer) {
          priceBuffer = action.payload.prices.priceData
        } else {
          priceBuffer = Buffer.from(action.payload.prices.priceData)
        }

        priceData = new ReadOnlyPriceBufferWrapper({
          priceBuffer,
          priceCount: action.payload.prices.priceCount,
        })
      }

      if (currentChain) {
        state.chains.set(action.payload.chainId, {
          ...currentChain,
          ...action.payload,
          priceData,
        })
      } else {
        const { isError, isLoading, isUpdating, lastModified } = action.payload

        if (
          isError === undefined ||
          isLoading === undefined ||
          isUpdating === undefined ||
          lastModified === undefined
        ) {
          throw new Error('Invalid initial chain state')
        }

        state.chains.set(action.payload.chainId, {
          chainId: action.payload.chainId,
          isError,
          isLoading,
          isUpdating,
          lastModified,
          priceData,
        })
      }

      return {
        ...state,
      }
    }
    case 'SET_READY':
      return {
        ...state,
        ready: action.payload.ready,
      }
    default:
      return state
  }
}

const PriceProviderContext = createContext<Provider>({} as Provider)

interface PriceProviderContextProps {
  children: React.ReactNode
}

export function PriceProvider({ children }: PriceProviderContextProps) {
  const [worker, setWorker] = useState<PriceWorker>()
  const [state, dispatch] = useReducer(reducer, {
    chains: new Map(),
    ready: false,
  })

  const chainId = useChainId()

  useEffect(() => {
    const worker = new Worker(
      new URL('../price-worker/price-worker.ts', import.meta.url),
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
            payload: event.data.payload,
          })
          break
      }
    }

    setWorker(worker as unknown as PriceWorker)

    return () => {
      worker.terminate()
    }
  }, [])

  const incrementChainId = useCallback(
    (chainId: ChainId) => {
      if (worker) {
        worker.postMessage({
          type: PriceWorkerPostMessageType.IncrementChainId,
          chainId,
        })
      }
    },
    [worker],
  )

  const decrementChainId = useCallback(
    (chainId: ChainId) => {
      if (worker) {
        worker.postMessage({
          type: PriceWorkerPostMessageType.DecrementChainId,
          chainId,
        })
      }
    },
    [worker],
  )

  useEffect(() => {
    incrementChainId(chainId)

    return () => {
      decrementChainId(chainId)
    }
  }, [chainId, decrementChainId, incrementChainId])

  return (
    <PriceProviderContext.Provider
      value={{
        state,
        mutate: {
          incrementChainId,
          decrementChainId,
        },
      }}
    >
      {children}
    </PriceProviderContext.Provider>
  )
}

export function usePriceProvider() {
  const context = useContext(PriceProviderContext)

  if (!context) {
    throw new Error('usePriceProvider must be used within a PriceProvider')
  }

  return context
}
