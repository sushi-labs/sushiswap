'use client'
import { useLocalStorage } from '@sushiswap/hooks'
import { type FC, createContext, useContext, useMemo, useState } from 'react'
import type { TimeInForceType } from 'src/lib/perps/exchange/use-execute-orders'
import { useActiveAssetData } from 'src/lib/perps/subscription/use-active-asset-data'
import { useAccount } from 'src/lib/wallet'
interface State {
  mutate: {
    setActiveAsset: (asset: string) => void
    setTradeType: (tradeType: TradeType) => void
    setTradeSide: (tradeSide: TradeSideType) => void
    setReduceOnly: (reduceOnly: boolean) => void
    setSize: (size: { baseSize: string; quoteSize: string }) => void
    setLimitPrice: (limitPrice: string) => void
    setTimeInForce: (timeInForce: TimeInForceType) => void
    setSizeSide: (sizeSide: 'base' | 'quote') => void
  }
  state: {
    activeAsset: string
    activeAssetDataQuery: ReturnType<typeof useActiveAssetData>
    tradeType: TradeType
    tradeSide: TradeSideType
    reduceOnly: boolean
    size: { baseSize: string; quoteSize: string }
    limitPrice: string
    timeInForce: TimeInForceType
    sizeSide: 'base' | 'quote'
  }
}

const AssetStateContext = createContext<State>({} as State)

interface AssetStateProviderProps {
  children: React.ReactNode
}

export const TRADE_TYPES = [
  'market',
  'limit',
  'scale',
  'stop limit',
  'stop market',
  'take limit',
  'take market',
  'TWAP',
] as const

export const TIME_IN_FORCE = ['Gtc', 'Ioc', 'Alo'] as const

export type TradeType = (typeof TRADE_TYPES)[number]

export type TradeSideType = 'long' | 'short'

const AssetStateProvider: FC<AssetStateProviderProps> = ({ children }) => {
  const [activeAsset, setActiveAsset] = useLocalStorage<string>(
    'sushi.perps.active-asset',
    'BTC',
  )
  const [tradeType, setTradeType] = useState<TradeType>('market')
  const [tradeSide, setTradeSide] = useState<TradeSideType>('long')
  const [reduceOnly, setReduceOnly] = useState(false)
  const [size, setSize] = useState({ baseSize: '', quoteSize: '' })
  const [sizeSide, setSizeSide] = useState<'base' | 'quote'>('base')
  const [limitPrice, setLimitPrice] = useState('')
  const [timeInForce, setTimeInForce] = useState<TimeInForceType>('Gtc')

  const address = useAccount('evm')
  const activeAssetDataQuery = useActiveAssetData({
    address,
    assetString: activeAsset,
  })

  return (
    <AssetStateContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setActiveAsset,
            setTradeType,
            setTradeSide,
            setReduceOnly,
            setSize,
            setLimitPrice,
            setTimeInForce,
            setSizeSide,
          },
          state: {
            activeAsset,
            activeAssetDataQuery,
            tradeType,
            tradeSide,
            reduceOnly,
            size,
            limitPrice,
            timeInForce,
            sizeSide,
          },
        }
      }, [
        activeAsset,
        setActiveAsset,
        activeAssetDataQuery,
        tradeType,
        tradeSide,
        reduceOnly,
        size,
        limitPrice,
        timeInForce,
        sizeSide,
      ])}
    >
      {children}
    </AssetStateContext.Provider>
  )
}

const useAssetState = () => {
  const context = useContext(AssetStateContext)
  if (!context) {
    throw new Error('Hook can only be used inside AssetState State Context')
  }

  return context
}

export { AssetStateProvider, useAssetState }
