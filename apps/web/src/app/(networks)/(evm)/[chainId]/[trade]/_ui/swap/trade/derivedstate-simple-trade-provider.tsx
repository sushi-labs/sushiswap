'use client'

import { useParams, usePathname, useSearchParams } from 'next/navigation'
import {
  type FC,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { SupportedChainId } from 'src/config'
import { useCreateQuery } from 'src/lib/hooks/useCreateQuery'
import { useTradeMode } from 'src/lib/hooks/useTradeMode'
import { EvmChainId } from 'sushi/evm'
import {
  TRADE_MODES,
  TRADE_VIEWS,
  type TradeMode,
  type TradeView,
  isSupportedTradeModeOnChainId,
} from './config'
import { TradeModeContext } from './trade-mode-buttons'

interface State {
  mutate: {
    setTradeMode(tradeMode: TradeMode): void
    setTradeView(tradeView: TradeView): void
  }
  state: {
    tradeView: TradeView
    tradeMode: TradeMode
    tradeModeChanged: boolean
    chainId: EvmChainId
  }
}

const DerivedStateSimpleTradeContext = createContext<State>({} as State)

interface DerivedStateSimpleTradeProviderProps {
  children: React.ReactNode
}

const resolveViewModeFromPathname = (pathname: string): TradeView => {
  const view = pathname.split('/')?.[3]
  return TRADE_VIEWS.includes(view as TradeView)
    ? (view as TradeView)
    : 'simple'
}

/* Parses the URL and provides the tradeMode and chainId globally.
 * URL example:
 * /swap || /limit || /dca ...
 */
const DerivedstateSimpleTradeProvider: FC<
  DerivedStateSimpleTradeProviderProps
> = ({ children }) => {
  const pathname = usePathname()
  const { chainId: _chainId } = useParams()
  const searchParams = useSearchParams()
  const chainId0 = searchParams.get('chainId0')
  const chainId = chainId0
    ? (Number(chainId0) as EvmChainId)
    : _chainId
      ? (+_chainId as SupportedChainId)
      : EvmChainId.ETHEREUM
  const { tradeMode } = useTradeMode()
  const [tradeView, _setTradeView] = useState<TradeView>(
    resolveViewModeFromPathname(pathname),
  )
  const [tradeModeChanged, _setTradeModeChanged] = useState<boolean>(false)

  const { createQuery } = useCreateQuery()

  const setTradeView = useCallback(
    (view: TradeView) => {
      if (view === tradeView) {
        return
      }

      _setTradeView(view)
      _setTradeModeChanged(false)
      createQuery(
        [],
        `/${pathname?.split('/')[1]}/${tradeMode || 'swap'}${view !== 'simple' ? `/${view}` : ''}`,
      )
    },
    [tradeView, tradeMode, pathname, createQuery],
  )

  const setTradeMode = useCallback(
    (trade: TradeMode) => {
      // _setTradeMode(trade)
      _setTradeModeChanged(true)

      const params = []
      if (trade === 'limit' || trade === 'dca') {
        params.push({ name: 'token1', value: null })
        params.push({ name: 'chainId1', value: null })
      }

      const segments = pathname?.split('/').filter(Boolean) ?? []

      const updatedSegments = [...segments]
      const modeIndex = updatedSegments.findIndex((seg) =>
        TRADE_MODES.includes(seg as TradeMode),
      )

      if (modeIndex !== -1) {
        updatedSegments[modeIndex] = trade
      } else {
        updatedSegments.push(trade)
      }

      const newPath = `/${updatedSegments.join('/')}${
        tradeView !== 'simple' ? `/${tradeView}` : ''
      }`

      createQuery(params, newPath)
    },
    [tradeView, pathname, createQuery],
  )

  return (
    <DerivedStateSimpleTradeContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setTradeMode,
            setTradeView,
          },
          state: {
            tradeView,
            tradeMode,
            tradeModeChanged,
            chainId,
          },
        }
      }, [
        tradeMode,
        tradeView,
        chainId,
        setTradeMode,
        setTradeView,
        tradeModeChanged,
      ])}
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
          [tradeMode, setTradeMode, chainId],
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
