'use client'

import { useParams, useRouter } from 'next/navigation'
import {
  type FC,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { type SupportedChainId, isSupportedChainId } from 'src/config'
import { EvmChainId } from 'sushi/chain'
import { EvmChainKey } from 'sushi/chain'
import {
  TRADE_MODES,
  type TradeMode,
  isSupportedTradeModeOnChainId,
} from './config'
import { TradeModeContext } from './trade-mode-buttons'

interface State {
  mutate: {
    setTrade(trade: string): void
  }
  state: {
    tradeMode: TradeMode
    tradeModeChanged: boolean
    chainId: EvmChainId
  }
}

const DerivedStateSimpleTradeContext = createContext<State>({} as State)

interface DerivedStateSimpleTradeProviderProps {
  children: React.ReactNode
}

/* Parses the URL and provides the tradeMode and chainId globally.
 * URL example:
 * /swap || /limit || /dca ...
 */
const DerivedstateSimpleTradeProvider: FC<
  DerivedStateSimpleTradeProviderProps
> = ({ children }) => {
  const { chainId: _chainId, trade } = useParams()
  const chainId =
    _chainId && isSupportedChainId(+_chainId)
      ? (+_chainId as SupportedChainId)
      : EvmChainId.ETHEREUM
  const [tradeMode, _setTradeMode] = useState<TradeMode>(trade as TradeMode)
  const [tradeModeChanged, _setTradeModeChanged] = useState<boolean>(false)

  const setTradeMode = useCallback(
    (trade: TradeMode) => {
      if (trade === tradeMode) {
        return
      }

      _setTradeMode(trade)
      _setTradeModeChanged(true)
      const newUrl = new URL(
        `${window.location.origin}/${EvmChainKey[chainId]}/${trade}`,
      ).toString()
      window.history.pushState({}, '', newUrl)
    },
    [chainId, tradeMode],
  )

  return (
    <DerivedStateSimpleTradeContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setTrade: setTradeMode,
          },
          state: {
            tradeMode,
            tradeModeChanged,
            chainId,
          },
        }
      }, [tradeMode, chainId, setTradeMode, tradeModeChanged])}
    >
      <TradeModeContext.Provider
        value={useMemo(
          () => ({
            tradeMode,
            supportedTradeModes: TRADE_MODES.filter((item) =>
              isSupportedTradeModeOnChainId(item, chainId),
            ),
            switchTradeMode: setTradeMode,
          }),
<<<<<<< HEAD
          [tradeMode, setTradeMode],
=======
          [tradeMode, setTradeMode, chainId],
>>>>>>> 1d8c958171 (fix: lint)
        )}
      >
        {children}
      </TradeModeContext.Provider>
    </DerivedStateSimpleTradeContext.Provider>
  )
}

const useDerivedStateSimpleTrade = () => {
  const context = useContext(DerivedStateSimpleTradeContext)
  if (!context) {
    throw new Error(
      'Hook can only be used inside Simple Trade Derived State Context',
    )
  }

  return context
}

export { DerivedstateSimpleTradeProvider, useDerivedStateSimpleTrade }
