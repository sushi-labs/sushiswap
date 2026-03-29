import { useMemo } from 'react'
import { NativeAddress } from 'src/lib/constants'
import type { EvmAddress } from 'sushi/evm'
import { useUserSettingsState } from '~evm/perps/_ui/account-management'
import { useAssetListState } from '~evm/perps/_ui/asset-selector'
import { useUserState } from '~evm/perps/user-provider'
import { useAccount } from '../../wallet'
import { getEvmDestinationAddress } from '../utils'

const STABLE_OPTIONS = ['USDC', 'USDT0', 'USDH', 'USDE']

const STABLES = [
  { coin: 'USDC', token: 0, total: '0.0', hold: '0.0', entryNtl: '0.0' },
  { coin: 'USDT0', token: 268, total: '0.0', hold: '0.0', entryNtl: '0.0' },
  { coin: 'USDH', token: 360, total: '0.0', hold: '0.0', entryNtl: '0.0' },
  { coin: 'USDE', token: 235, total: '0.0', hold: '0.0', entryNtl: '0.0' },
] //usdc, usdt, usdh, usde

export const useSendableAssets = (filter?: 'perp' | 'spot' | 'stable') => {
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
      destinationAddress: null,
      evmAddressData: null,
      markPrice: '1',
      spender: undefined,
      assetName: null,
    }
    if (!isUnifiedAccountModeEnabled) {
      assets.push(usdcPerp)
    }
    const balanceArr = webData2Data?.spotState?.balances || []
    const missingStables = STABLES.filter(
      (stable) =>
        !balanceArr.find((b) => b.coin === stable.coin) &&
        STABLE_OPTIONS.includes(stable.coin),
    )
    if (missingStables.length > 0) {
      balanceArr.push(...missingStables)
    }
    for (const spotBalance of balanceArr) {
      const tokenIndex = spotBalance.token
      if (!assetList) continue
      const spotAsset = Array.from(assetList?.entries() ?? []).find(([, v]) =>
        v?.tokens?.find((t) => t?.index === tokenIndex),
      )?.[1]

      if (!spotAsset) continue
      const spotToken = spotAsset?.tokens?.[tokenIndex === 0 ? 1 : 0]
      if (!spotToken) continue
      const price =
        spotBalance.coin === 'USDC' ? 1 : (Number(spotAsset?.markPrice) ?? 0)
      const usdcValue = Number(spotBalance.total || 0) * price
      assets.push({
        token: `${spotToken?.name}:${spotToken?.tokenId}`,
        symbol: spotToken?.name || '',
        assetName: spotAsset?.name || '',
        balance: spotBalance.total,
        decimals: spotToken?.weiDecimals,
        marketType: 'spot' as const,
        usdcValue: usdcValue.toString(),
        tokenId: spotToken?.tokenId,
        markPrice: price,
        destinationAddress: getEvmDestinationAddress(tokenIndex),
        evmAddressData: (spotToken?.evmContract?.address === undefined
          ? {
              address: NativeAddress,
              evm_extra_wei_decimals: 0,
            }
          : {
              address:
                spotToken?.evmContract?.address.toLowerCase() === //usdc rewrite
                '0x6b9e773128f453f5c2c60935ee2de2cbc5390a24'
                  ? '0xb88339CB7199b77E23DB6E890353E22632Ba630f'
                  : spotToken?.evmContract?.address.toLowerCase(),
              evm_extra_wei_decimals:
                spotToken?.evmContract?.evm_extra_wei_decimals,
            }) as {
          address: EvmAddress
          evm_extra_wei_decimals: number
        },
        spender: spotToken?.evmContract?.address,
      })
    }

    if (filter) {
      if (filter === 'stable') {
        return assets
          ?.filter(
            (a) => a.marketType === 'spot' && STABLE_OPTIONS.includes(a.symbol),
          )
          .map((i) => {
            if (i.symbol === 'USDC') {
              const balance = Number(usdcPerp.balance) + Number(i.balance)
              const value = balance * Number(i.markPrice ?? 1)
              return {
                ...i,
                usdcValue: value.toString(),
                balance: balance.toString(),
                spotBalance: i.balance,
                perpBalance: usdcPerp.balance,
              }
            }
            return i
          })
      }
      return assets?.filter((a) => a.marketType === filter)
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
>['data'][number] & {
  spotBalance?: string
  perpBalance?: string
}
