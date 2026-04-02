import { useMemo } from 'react'
import { useAssetListState } from '~evm/perps/_ui/asset-selector'
import { useUserState } from '~evm/perps/user-provider'
import { useAccount } from '../../wallet'

export const useUserPositions = (coin?: string) => {
  const address = useAccount('evm')
  const {
    state: {
      allDexClearinghouseStateQuery: {
        data,
        isLoading: isLoadingDexClearinghouse,
        isError: isErrorDexClearinghouse,
      },
    },
  } = useUserState()
  const {
    state: {
      assetListQuery: {
        data: assetList,
        isLoading: isAssetListLoading,
        isError: isAssetListError,
      },
    },
  } = useAssetListState()
  const isLoading = isLoadingDexClearinghouse || isAssetListLoading
  const isError = isErrorDexClearinghouse || isAssetListError

  const formattedData = useMemo(() => {
    if (!data) return []
    const allData = data.clearinghouseStates.flatMap(([dexName, i]) => {
      return i.assetPositions.map((pos) => {
        const asset = assetList?.get(pos.position.coin)
        const side =
          Number.parseFloat(pos.position.szi) >= 0
            ? ('B' as const)
            : ('A' as const)
        const markPrice = asset?.markPrice ?? '0'
        return {
          ...pos,
          assetSymbol:
            asset?.marketType === 'perp' ? pos.position.coin : asset?.symbol,
          marketType: asset?.marketType,
          perpsDex: dexName,
          side,
          markPrice,
          clearingHouseDataForDex: {
            withdrawable: i.withdrawable,
            marginSummary: i.marginSummary,
            crossMaintenanceMarginUsed: i.crossMaintenanceMarginUsed,
            crossMarginSummary: i.crossMarginSummary,
            time: i.time,
          },
        }
      })
    })
    if (!coin) return allData
    return allData?.filter((pos) => pos.position.coin === coin)
  }, [data, assetList, coin])

  return useMemo(() => {
    if (!address) {
      return {
        data: [],
        isLoading: false,
        isError: false,
      }
    }
    return {
      data: formattedData,
      isLoading,
      isError,
    }
  }, [isLoading, isError, formattedData, address])
}

export type UserPositionsItemType = ReturnType<
  typeof useUserPositions
>['data'][number]
