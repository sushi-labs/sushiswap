import { useMemo } from 'react'
import { useUserSettingsState } from '~evm/perps/_ui/account-management'
import { useAssetListState } from '~evm/perps/_ui/asset-selector'
import { useUserState } from '~evm/perps/user-provider'
import { useAccount } from '../../wallet'

export const useSendableAssets = (filter?: 'perp' | 'spot') => {
  const address = useAccount('evm')
  const {
    state: {
      webData2Query: {
        data: webData2Data,
        isLoading: isWebData2Loading,
        isError: isWebData2Error,
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
  const {
    state: { isUnifiedAccountModeEnabled },
  } = useUserSettingsState()

  const isLoading = isAssetListLoading || isWebData2Loading
  const isError = isAssetListError || isWebData2Error

  const sendableAssets = useMemo(() => {
    const assets = []
    const usdcPerp = {
      token: 'USDC',
      balance: webData2Data?.clearinghouseState.withdrawable || '0',
      decimals: 2,
      marketType: 'perp' as const,
      usdcValue: webData2Data?.clearinghouseState.withdrawable || '0',
      symbol: 'USDC',
      tokenId: null,
    }
    if (!isUnifiedAccountModeEnabled) {
      assets.push(usdcPerp)
    }
    for (const spotBalance of webData2Data?.spotState?.balances || []) {
      if (spotBalance.total === '0.0') continue
      const tokenIndex = spotBalance.token
      const spotAsset = assetList
        ?.entries()
        .find(([, v]) => v.tokens?.find((t) => t.index === tokenIndex))?.[1]

      if (!spotAsset) continue
      const spotToken = spotAsset?.tokens?.[tokenIndex === 0 ? 1 : 0]
      if (!spotToken) continue
      const price =
        spotBalance.coin === 'USDC' ? 1 : (Number(spotAsset?.markPrice) ?? 0)
      const usdcValue = Number(spotBalance.total || 0) * price
      assets.push({
        token: `${spotToken?.name}:${spotToken?.tokenId}`,
        symbol: spotToken?.name || '',
        balance: spotBalance.total,
        decimals: spotToken?.weiDecimals,
        marketType: 'spot' as const,
        usdcValue: usdcValue.toString(),
        tokenId: spotToken?.tokenId,
      })
    }
    if (filter) {
      return assets.filter((a) => a.marketType === filter)
    }
    return assets
  }, [webData2Data, assetList, isUnifiedAccountModeEnabled, filter])

  return useMemo(() => {
    if (!address) {
      return {
        data: [],
        isLoading: false,
        isError: false,
      }
    }
    return {
      data: sendableAssets,
      isLoading,
      isError,
    }
  }, [isLoading, isError, sendableAssets, address])
}

export type SendableAssetType = ReturnType<
  typeof useSendableAssets
>['data'][number]
