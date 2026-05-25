import { useMemo } from 'react'
import type { EvmAddress } from 'sushi/evm'
import { useAssetListState } from '~evm/perps/_ui/asset-selector'
import { useAllDexClearinghouseState } from '../subscription'

export const useVaultPositions = (vaultAddress: EvmAddress) => {
  const {
    data,
    isLoading: isLoadingDexClearinghouse,
    isError: isErrorDexClearinghouse,
  } = useAllDexClearinghouseState({ address: vaultAddress })

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
          decimals: asset?.decimals,
          fullAsset: asset,
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
    return allData
  }, [data, assetList])

  return useMemo(() => {
    if (!vaultAddress) {
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
  }, [isLoading, isError, formattedData, vaultAddress])
}
