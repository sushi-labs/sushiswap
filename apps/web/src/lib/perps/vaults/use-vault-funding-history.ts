import { useMemo } from 'react'
import type { EvmAddress } from 'sushi/evm'
import { useAssetListState } from '~evm/perps/_ui/asset-selector'
import { useUserFundings } from '../subscription'

export const useVaultFundingHistory = (vaultAddress: EvmAddress) => {
  const {
    data,
    isLoading: isUserFundingsLoading,
    isError: isUserFundingsError,
  } = useUserFundings({
    address: vaultAddress,
  })
  const {
    state: {
      assetListQuery: {
        data: assetList,
        isLoading: isAssetListLoading,
        isError: isAssetListError,
      },
    },
  } = useAssetListState()

  const isLoading = isUserFundingsLoading || isAssetListLoading
  const isError = isUserFundingsError || isAssetListError
  const formattedData = useMemo(() => {
    if (!data) return []
    return data?.fundings?.map((i) => {
      const side =
        Number.parseFloat(i.szi) > 0 ? ('long' as const) : ('short' as const)
      const asset = assetList?.get(i.coin)
      return {
        timestamp: i.time,
        coin: i.coin,
        assetSymbol: asset?.marketType === 'perp' ? i.coin : asset?.symbol,
        marketType: asset?.marketType,
        size: Math.abs(Number.parseFloat(i.szi)),
        side,
        payment: i.usdc,
        rate: i.fundingRate,
        nSamples: i.nSamples,
        isSnapshot: data?.isSnapshot || false,
      }
    })
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
