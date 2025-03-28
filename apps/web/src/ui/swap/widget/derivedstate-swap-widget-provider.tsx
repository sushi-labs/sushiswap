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
import { useTradeQuote } from 'src/lib/hooks/react-query'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { useCarbonOffset } from 'src/lib/swap/useCarbonOffset'
import { EvmChainId } from 'sushi/chain'
import { type Amount, type Type, tryParseAmount } from 'sushi/currency'
import { ZERO } from 'sushi/math'
import { useGasPrice } from 'wagmi'

interface State {
  mutate: {
    setToken0(token0: Type | string): void
    setToken1(token1: Type | string): void
    setSwapAmount(swapAmount: string): void
    switchTokens(): void
  }
  state: {
    token0: Type | undefined
    token1: Type | undefined
    chainId: EvmChainId
    swapAmountString: string
    swapAmount: Amount<Type> | undefined
  }
}

const DerivedStateSwapWidgetContext = createContext<State>({} as State)

interface DerivedStateSwapWidgetProviderProps {
  children: React.ReactNode
  chainId: EvmChainId
  token0?: Type
  token1?: Type
}

const DerivedstateSwapWidgetProvider: FC<
  DerivedStateSwapWidgetProviderProps
> = ({ children, chainId: _chainId, token0: _token0, token1: _token1 }) => {
  const [token0, _setToken0] = useState<Type | undefined>(_token0)
  const [token1, _setToken1] = useState<Type | undefined>(_token1)
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

  const setToken0 = useCallback<(_token0: Type) => void>(
    (_token0) => {
      if (token1?.equals(_token0)) {
        switchTokens()
      }

      _setToken0(_token0)
    },
    [token1, switchTokens],
  )

  const setToken1 = useCallback<(_token1: Type) => void>(
    (_token1) => {
      if (token0?.equals(_token1)) {
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
            swapAmount: tryParseAmount(swapAmountString, token0),
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

const useDerivedStateSwapWidget = () => {
  const context = useContext(DerivedStateSwapWidgetContext)
  if (!context) {
    throw new Error(
      'Hook can only be used inside Swap Widget Derived State Context',
    )
  }

  return context
}

const useSwapWidgetTradeQuote = () => {
  const {
    state: { token0, chainId, swapAmount, token1 },
  } = useDerivedStateSwapWidget()

  const [slippagePercent] = useSlippageTolerance()
  const [carbonOffset] = useCarbonOffset()
  const { data: gasPrice } = useGasPrice({ chainId })

  const quote = useTradeQuote({
    chainId,
    fromToken: token0,
    toToken: token1,
    amount: swapAmount,
    slippagePercentage: slippagePercent.toFixed(2),
    gasPrice,
    recipient: undefined,
    enabled: Boolean(swapAmount?.greaterThan(ZERO)),
    carbonOffset,
  })

  return quote
}

export {
  DerivedstateSwapWidgetProvider,
  useDerivedStateSwapWidget,
  useSwapWidgetTradeQuote,
}
