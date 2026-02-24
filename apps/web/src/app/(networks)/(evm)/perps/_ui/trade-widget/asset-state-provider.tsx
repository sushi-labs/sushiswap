'use client'
import { useLocalStorage } from '@sushiswap/hooks'
import {
  type FC,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { TimeInForceType } from 'src/lib/perps/exchange/use-execute-orders'
import { useActiveAssetData } from 'src/lib/perps/subscription/use-active-asset-data'
import type { PerpOrSpotAsset } from 'src/lib/perps/subscription/use-asset-list'
import { useUserPositions } from 'src/lib/perps/use-user-positions'
import { useAccount } from 'src/lib/wallet'
import { useAssetListState } from '../asset-selector/asset-list-provider'
interface State {
  mutate: {
    setActiveAsset: (asset: string) => void
    setTradeType: (tradeType: TradeType) => void
    setTradeSide: (tradeSide: TradeSideType) => void
    setReduceOnly: (reduceOnly: boolean) => void
    setSize: (size: { base: string; quote: string }) => void
    setLimitPrice: (limitPrice: string) => void
    setTimeInForce: (timeInForce: TimeInForceType) => void
    setSizeSide: (sizeSide: 'base' | 'quote') => void
    setPercentage: (percentage: number) => void
    setTpPrice: (tpPrice: string) => void
    setSlPrice: (slPrice: string) => void
    setHasTpSl: (hasTpSl: boolean) => void
    setTriggerPrice: (triggerPrice: string) => void
  }
  state: {
    activeAsset: string
    tradeType: TradeType
    tradeSide: TradeSideType
    reduceOnly: boolean
    size: { base: string; quote: string }
    limitPrice: string
    timeInForce: TimeInForceType
    sizeSide: 'base' | 'quote'
    asset: PerpOrSpotAsset | undefined
    percentage: number
    maxTradeSize: string
    availableToLong: string
    availableToShort: string
    markPrice: string
    //come back and move this
    activeAssetDataQuery: ReturnType<typeof useActiveAssetData>
    currentLeverageForAsset: number
    tpPrice: string
    slPrice: string
    hasTpSl: boolean
    currentLeverageTypeForAsset: 'cross' | 'isolated'
    triggerPrice: string
    isTpSlOrder: boolean
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
  const [tradeType, _setTradeType] = useState<TradeType>('market')
  const [tradeSide, _setTradeSide] = useState<TradeSideType>('long')
  const [reduceOnly, _setReduceOnly] = useState(false)
  const [size, setSize] = useState({ base: '', quote: '' })
  const [sizeSide, setSizeSide] = useState<'base' | 'quote'>('base')
  const [limitPrice, setLimitPrice] = useState('')
  const [timeInForce, setTimeInForce] = useState<TimeInForceType>('Gtc')
  const [percentage, setPercentage] = useState(0)
  const [hasTpSl, _setHasTpSl] = useState(false)
  const [tpPrice, setTpPrice] = useState<string>('')
  const [slPrice, setSlPrice] = useState<string>('')
  const [triggerPrice, setTriggerPrice] = useState<string>('')

  const address = useAccount('evm')

  const {
    state: {
      assetListQuery: { data: assetList },
    },
  } = useAssetListState()
  const activeAssetDataQuery = useActiveAssetData({
    address,
    assetString: activeAsset,
  })
  const { data: openPosition } = useUserPositions(activeAsset)

  const isTpSlOrder = useMemo(() => {
    return (
      tradeType === 'take market' ||
      tradeType === 'take limit' ||
      tradeType === 'stop limit' ||
      tradeType === 'stop market'
    )
  }, [tradeType])

  const asset = useMemo(() => {
    if (!assetList || !activeAsset) return undefined
    return assetList.get(activeAsset)
  }, [assetList, activeAsset])

  const [availableToLong, availableToShort] = useMemo(
    () => activeAssetDataQuery?.data?.availableToTrade || ['0', '0'],
    [activeAssetDataQuery?.data?.availableToTrade],
  )
  const [maxTradeSizeLong, maxTradeSizeShort] = useMemo(
    () => activeAssetDataQuery?.data?.maxTradeSzs || ['0', '0'],
    [activeAssetDataQuery?.data?.maxTradeSzs],
  )

  const maxTradeSize = useMemo(() => {
    if (
      reduceOnly &&
      (!openPosition || openPosition.length === 0) &&
      !isTpSlOrder
    ) {
      return '0'
    }
    if (reduceOnly && openPosition && openPosition.length > 0 && !isTpSlOrder) {
      const pos = openPosition?.[0]
      const side = pos.side
      const positionSize = Math.abs(Number.parseFloat(pos.position.szi))
      return tradeSide === 'short' && side === 'B'
        ? positionSize.toString()
        : tradeSide === 'long' && side === 'A'
          ? positionSize.toString()
          : '0'
    }
    return tradeSide === 'long' ? maxTradeSizeLong : maxTradeSizeShort
  }, [
    tradeSide,
    maxTradeSizeLong,
    maxTradeSizeShort,
    reduceOnly,
    openPosition,
    isTpSlOrder,
  ])

  const markPrice = useMemo(
    () => activeAssetDataQuery?.data?.markPx || '0',
    [activeAssetDataQuery?.data?.markPx],
  )

  const currentLeverageForAsset = useMemo(
    () => activeAssetDataQuery?.data?.leverage?.value ?? 1,
    [activeAssetDataQuery?.data?.leverage?.value],
  )

  const currentLeverageTypeForAsset = useMemo(
    () => activeAssetDataQuery?.data?.leverage?.type ?? 'cross',
    [activeAssetDataQuery?.data?.leverage?.type],
  )

  const setReduceOnly = useCallback(
    (_reduceOnly: boolean) => {
      _setReduceOnly(_reduceOnly)
      if (_reduceOnly && hasTpSl) {
        setHasTpSl(false)
        setTpPrice('')
        setSlPrice('')
        setPercentage(0)
        setSize({ base: '', quote: '' })
      }
    },
    [hasTpSl],
  )

  const setHasTpSl = useCallback(
    (_hasTpSl: boolean) => {
      _setHasTpSl(_hasTpSl)
      if (_hasTpSl && reduceOnly) {
        setReduceOnly(false)
        setTpPrice('')
        setSlPrice('')
        setPercentage(0)
        setSize({ base: '', quote: '' })
      }
    },
    [setReduceOnly, reduceOnly],
  )

  // const resetValues = useCallback(() => {
  //   setSize({ base: '', quote: '' })
  //   setPercentage(0)
  //   setReduceOnly(false)
  //   setTpPrice('')
  //   setSlPrice('')
  //   setHasTpSl(false)
  // }, [setHasTpSl, setReduceOnly])

  const setTradeType = useCallback((tradeType: TradeType) => {
    _setTradeType(tradeType)
    // resetValues()
  }, [])

  const setTradeSide = useCallback((tradeSide: TradeSideType) => {
    _setTradeSide(tradeSide)
    // resetValues()
  }, [])

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
            setPercentage,
            setTpPrice,
            setSlPrice,
            setHasTpSl,
            setTriggerPrice,
          },
          state: {
            activeAsset,
            tradeType,
            tradeSide,
            reduceOnly,
            size,
            limitPrice,
            timeInForce,
            sizeSide,
            asset,
            percentage,
            maxTradeSize,
            availableToLong,
            availableToShort,
            markPrice,
            activeAssetDataQuery,
            currentLeverageForAsset,
            tpPrice,
            slPrice,
            hasTpSl,
            currentLeverageTypeForAsset,
            triggerPrice,
            isTpSlOrder,
          },
        }
      }, [
        activeAsset,
        setActiveAsset,
        setTradeSide,
        setTradeType,
        tradeType,
        tradeSide,
        reduceOnly,
        size,
        limitPrice,
        timeInForce,
        sizeSide,
        asset,
        percentage,
        maxTradeSize,
        availableToLong,
        availableToShort,
        markPrice,
        activeAssetDataQuery,
        currentLeverageForAsset,
        tpPrice,
        slPrice,
        hasTpSl,
        setHasTpSl,
        setReduceOnly,
        currentLeverageTypeForAsset,
        triggerPrice,
        isTpSlOrder,
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
