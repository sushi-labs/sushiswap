'use client'

import {
  type FC,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { type SupportedChainId, isSupportedChainId } from 'src/config'
import { useEvmTradeQuote, useSvmTradeQuote } from 'src/lib/hooks/react-query'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { useCarbonOffset } from 'src/lib/swap/useCarbonOffset'
import { Amount, ZERO } from 'sushi'
import { EvmChainId, isEvmChainId } from 'sushi/evm'
import { type SvmChainId, isSvmChainId } from 'sushi/svm'
import { useGasPrice } from 'wagmi'

interface State<TChainId extends SupportedChainId = SupportedChainId> {
  mutate: {
    setToken0(token0: CurrencyFor<TChainId> | string): void
    setToken1(token1: CurrencyFor<TChainId> | string): void
    setSwapAmount(swapAmount: string): void
    switchTokens(): void
  }
  state: {
    token0: CurrencyFor<TChainId> | undefined
    token1: CurrencyFor<TChainId> | undefined
    chainId: TChainId
    swapAmountString: string
    swapAmount: Amount<CurrencyFor<TChainId>> | undefined
  }
}

const DerivedStateSwapWidgetContext = createContext<State>({} as State)

interface DerivedStateSwapWidgetProviderProps<
  TChainId extends SupportedChainId = SupportedChainId,
> {
  children: React.ReactNode
  chainId: TChainId
  token0?: CurrencyFor<TChainId>
  token1?: CurrencyFor<TChainId>
}

function DerivedStateSwapWidgetProvider<
  TChainId extends SupportedChainId = SupportedChainId,
>({
  children,
  chainId: _chainId,
  token0: _token0,
  token1: _token1,
}: DerivedStateSwapWidgetProviderProps<TChainId>) {
  const [token0, _setToken0] = useState<CurrencyFor<TChainId> | undefined>(
    _token0,
  )
  const [token1, _setToken1] = useState<CurrencyFor<TChainId> | undefined>(
    _token1,
  )
  const [swapAmountString, setSwapAmount] = useState<string>('')

  const chainId =
    _chainId && isSupportedChainId(+_chainId)
      ? (+_chainId as SupportedChainId)
      : EvmChainId.ETHEREUM

  // Switch token0 and token1
  const switchTokens = useCallback(() => {
    _setToken0(token1)
    _setToken1(token0)
  }, [token0, token1])

  const setToken0 = useCallback<(_token0: CurrencyFor<TChainId>) => void>(
    (_token0) => {
      if (token1?.isSame(_token0)) {
        switchTokens()
      }

      _setToken0(_token0)
    },
    [token1, switchTokens],
  )

  const setToken1 = useCallback<(_token1: CurrencyFor<TChainId>) => void>(
    (_token1) => {
      if (token0?.isSame(_token1)) {
        switchTokens()
      }

      _setToken1(_token1)
    },
    [token0, switchTokens],
  )

  return (
    <DerivedStateSwapWidgetContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setToken0,
            setToken1,
            switchTokens,
            setSwapAmount,
          },
          state: {
            chainId,
            swapAmountString,
            swapAmount: token0
              ? Amount.tryFromHuman(token0, swapAmountString)
              : undefined,
            token0,
            token1,
          },
        }
      }, [
        chainId,
        swapAmountString,
        setToken0,
        setToken1,
        switchTokens,
        token0,
        token1,
      ])}
    >
      {children}
    </DerivedStateSwapWidgetContext.Provider>
  )
}

function useDerivedStateSwapWidget() {
  const context = useContext(DerivedStateSwapWidgetContext)
  if (!context) {
    throw new Error(
      'Hook can only be used inside Swap Widget Derived State Context',
    )
  }

  return context
}

function useEvmSimpleSwapTradeQuote() {
  const { state } = useDerivedStateSwapWidget()

  const [slippagePercent] = useSlippageTolerance()
  const [carbonOffset] = useCarbonOffset()

  const evmChainId = isEvmChainId(state.chainId) ? state.chainId : undefined
  const { data: gasPrice } = useGasPrice({ chainId: evmChainId })

  const params = useMemo(() => {
    if (isEvmChainId(state.chainId)) {
      const _state = state as State<typeof state.chainId>['state']

      return {
        chainId: _state.chainId,
        fromToken: _state.token0,
        toToken: _state.token1,
        amount: _state.swapAmount,
        slippagePercentage: slippagePercent.toString({ fixed: 2 }),
        gasPrice,
        recipient: undefined,
        enabled: Boolean(_state.swapAmount?.gt(ZERO)),
        carbonOffset,
      }
    }

    return undefined
  }, [state, slippagePercent, gasPrice, carbonOffset])

  return useEvmTradeQuote(params)
}

function useSvmSimpleSwapTradeQuote() {
  const { state } = useDerivedStateSwapWidget()

  const [slippagePercent] = useSlippageTolerance()

  const params = useMemo(() => {
    if (isSvmChainId(state.chainId)) {
      const _state = state as State<SvmChainId>['state']

      return {
        chainId: _state.chainId,
        fromToken: _state.token0,
        toToken: _state.token1,
        amount: _state.swapAmount,
        slippagePercentage: slippagePercent.toString({ fixed: 2 }),
        recipient: undefined,
        enabled: Boolean(_state.swapAmount?.gt(ZERO)),
      }
    }

    return undefined
  }, [state, slippagePercent])

  return useSvmTradeQuote(params)
}

function useSwapWidgetTradeQuote() {
  const { state } = useDerivedStateSwapWidget()

  const evmQuote = useEvmSimpleSwapTradeQuote()
  const svmQuote = useSvmSimpleSwapTradeQuote()

  if (isEvmChainId(state.chainId)) {
    return evmQuote
  } else if (isSvmChainId(state.chainId)) {
    return svmQuote
  }

  throw new Error('useSwapWidgetTradeQuote: Unsupported chainId')
}

export {
  DerivedStateSwapWidgetProvider,
  useDerivedStateSwapWidget,
  useSwapWidgetTradeQuote,
}
