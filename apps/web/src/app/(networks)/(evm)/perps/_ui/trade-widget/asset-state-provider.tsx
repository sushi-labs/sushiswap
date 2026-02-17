'use client'
import { useLocalStorage } from '@sushiswap/hooks'
import { type FC, createContext, useContext, useMemo, useState } from 'react'
import { useActiveAssetData } from 'src/lib/perps/subscription/use-active-asset-data'
import { useAccount } from 'src/lib/wallet'
interface State {
  mutate: {
    setActiveAsset: (asset: string) => void
    setTradeType: (tradeType: TradeType) => void
    setTradeSide: (tradeSide: TradeSideType) => void
  }
  state: {
    activeAsset: string
    activeAssetDataQuery: ReturnType<typeof useActiveAssetData>
    tradeType: TradeType
    tradeSide: TradeSideType
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

export type TradeType = (typeof TRADE_TYPES)[number]

export type TradeSideType = 'long' | 'short'

const AssetStateProvider: FC<AssetStateProviderProps> = ({ children }) => {
  const address = useAccount('evm')
  const [activeAsset, setActiveAsset] = useLocalStorage<string>(
    'sushi.perps.active-asset',
    'BTC',
  )
  const [tradeType, setTradeType] = useState<TradeType>('market')
  const [tradeSide, setTradeSide] = useState<TradeSideType>('long')
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
          },
          state: {
            activeAsset,
            activeAssetDataQuery,
            tradeType,
            tradeSide,
          },
        }
      }, [
        activeAsset,
        setActiveAsset,
        activeAssetDataQuery,
        tradeType,
        tradeSide,
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
