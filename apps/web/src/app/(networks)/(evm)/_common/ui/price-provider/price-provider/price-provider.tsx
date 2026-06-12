'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'

import {
  type PriceWorker,
  type PriceWorkerChainId,
  PriceWorkerPostMessageType,
  type PriceWorkerReceiveMessage,
  PriceWorkerReceiveMessageType,
  type PriceWorkerRequestAddress,
  type PriceWorkerRequestChainId,
} from '../price-worker/types'
import type { Provider, ProviderActions, ProviderState } from './types'

function reducer(
  state: ProviderState<PriceWorkerChainId>,
  action: ProviderActions<PriceWorkerChainId>,
): ProviderState<PriceWorkerChainId> {
  switch (action.type) {
    case 'UPDATE_CHAIN_STATE': {
      const currentChain = state.chains.get(action.payload.chainId)

      if (currentChain) {
        state.chains.set(action.payload.chainId, {
          ...currentChain,
          ...action.payload,
          priceMap: action.payload.priceMap || currentChain.priceMap,
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
          priceMap: action.payload.priceMap || undefined,
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

const PriceProviderContext = createContext<Provider<PriceWorkerChainId>>(
  {} as Provider<PriceWorkerChainId>,
)

interface PriceProviderContextProps {
  children: React.ReactNode
}

export function PriceProvider({ children }: PriceProviderContextProps) {
  const [worker, setWorker] = useState<PriceWorker<PriceWorkerChainId>>()
  const [state, dispatch] = useReducer(reducer, {
    chains: new Map(),
    ready: false,
  } satisfies ProviderState<PriceWorkerChainId>)

  useEffect(() => {
    const worker = new Worker(
      new URL('../price-worker/price-worker.ts', import.meta.url),
    )

    worker.postMessage({
      type: PriceWorkerPostMessageType.Initialize,
      canUseSharedArrayBuffer: false,
    })

    worker.onmessage = (
      event: MessageEvent<PriceWorkerReceiveMessage<PriceWorkerChainId>>,
    ) => {
      switch (event.data.type) {
        case PriceWorkerReceiveMessageType.ChainState:
          dispatch({
            type: 'UPDATE_CHAIN_STATE',
            payload: event.data.payload,
          })
          break
      }
    }

    setWorker(worker as unknown as PriceWorker<PriceWorkerChainId>)

    return () => {
      worker.terminate()
    }
  }, [])

  const incrementChainId = useCallback(
    (chainId: PriceWorkerChainId) => {
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
    (chainId: PriceWorkerChainId) => {
      if (worker) {
        worker.postMessage({
          type: PriceWorkerPostMessageType.DecrementChainId,
          chainId,
        })
      }
    },
    [worker],
  )

  const requestPrices = useCallback(
    (
      chainId: PriceWorkerRequestChainId,
      addresses: ContractAddressFor<PriceWorkerChainId>[],
    ) => {
      if (worker) {
        worker.postMessage({
          type: PriceWorkerPostMessageType.RequestPrices,
          chainId,
          addresses,
        })
      }
    },
    [worker],
  )

  useEffect(() => {
    function setEnabled(_event: Event) {
      if (worker) {
        worker.postMessage({
          type: PriceWorkerPostMessageType.SetEnabled,
          enabled: document.visibilityState === 'visible',
        })
      }
    }

    if (document) {
      document.addEventListener('visibilitychange', setEnabled)
    }

    return () => {
      document.removeEventListener('visibilitychange', setEnabled)
    }
  }, [worker])

  return (
    <PriceProviderContext.Provider
      value={{
        state: useMemo(() => ({ ...state, ready: !!worker }), [state, worker]),
        mutate: useMemo(
          () => ({
            incrementChainId,
            decrementChainId,
            requestPrices,
          }),
          [incrementChainId, decrementChainId, requestPrices],
        ),
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
