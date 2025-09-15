import type { WalletPosition } from '@sushiswap/graph-client/kadena'
import { Currency, classNames } from '@sushiswap/ui'
import { useMemo } from 'react'
import { KvmChainId, KvmToken, type KvmTokenAddress } from 'sushi/kvm'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'
import { useBaseTokens } from '~kadena/_common/lib/hooks/use-base-tokens'
import { useTokenPrecision } from '~kadena/_common/lib/hooks/use-token-precision'
import { Icon } from '../../General/Icon'

export const PositionNameCell = ({ data }: { data: WalletPosition }) => {
  const { data: baseTokens } = useBaseTokens()

  const { data: decimals0 } = useTokenPrecision({
    tokenContract:
      (data?.pair?.token0?.address as KvmTokenAddress) ?? undefined,
  })
  const { data: decimals1 } = useTokenPrecision({
    tokenContract:
      (data?.pair?.token1?.address as KvmTokenAddress) ?? undefined,
  })

  const token0 = useMemo(() => {
    const _token0 = baseTokens?.find(
      (token) =>
        token?.address?.toLowerCase() ===
        data?.pair?.token0?.address?.toLowerCase(),
    )
    if (_token0) {
      return _token0
    }

    return new KvmToken({
      chainId: KvmChainId.KADENA,
      address: data?.pair?.token0?.address as KvmTokenAddress,
      symbol: data?.pair?.token0?.name.slice(0, 4)?.toUpperCase(),
      decimals: decimals0 || 12,
      name: data?.pair?.token0?.name,
      metadata: {
        imageUrl: undefined,
        validated: false,
        kadenaChainId: KADENA_CHAIN_ID,
        kadenaNetworkId: KADENA_NETWORK_ID,
      },
    })
  }, [data?.pair?.token0, baseTokens, decimals0])

  const token1 = useMemo(() => {
    const _token1 = baseTokens?.find(
      (token) =>
        token?.address?.toLowerCase() ===
        data?.pair?.token1?.address?.toLowerCase(),
    )
    if (_token1) {
      return _token1
    }

    return new KvmToken({
      chainId: KvmChainId.KADENA,
      address: data?.pair?.token1?.address as KvmTokenAddress,
      symbol: data?.pair?.token1?.name.slice(0, 4)?.toUpperCase(),
      decimals: decimals1 || 12,
      name: data?.pair?.token1?.name,
      metadata: {
        imageUrl: undefined,
        validated: false,
        kadenaChainId: KADENA_CHAIN_ID,
        kadenaNetworkId: KADENA_NETWORK_ID,
      },
    })
  }, [data.pair?.token1, baseTokens, decimals1])

  return (
    <div className="flex items-center gap-1">
      <div className="flex min-w-[54px]">
        {token0 && token1 && (
          <Currency.IconList iconWidth={26} iconHeight={26}>
            <Icon currency={token0} />
            <Icon currency={token1} />
          </Currency.IconList>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
          {token0?.symbol}
          <span className="font-normal text-gray-900 dark:text-slate-500">
            /
          </span>
          {token1?.symbol}
          <div
            className={classNames(
              'text-[10px] bg-gray-200 dark:bg-slate-700 rounded-lg px-1 ml-1',
            )}
          />
        </span>
      </div>
    </div>
  )
}
