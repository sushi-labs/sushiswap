import type { KadenaPool } from '@sushiswap/graph-client/kadena'
import { Badge, Currency, TooltipContent } from '@sushiswap/ui'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@sushiswap/ui'
import React, { useMemo } from 'react'
import { formatNumber } from 'sushi'
import { KvmChainId, KvmToken, type KvmTokenAddress } from 'sushi/kvm'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'
import { KADENA } from '~kadena/_common/constants/token-list'
import { useBaseTokens } from '~kadena/_common/lib/hooks/use-base-tokens'
import { useTokenPrecision } from '~kadena/_common/lib/hooks/use-token-precision'
import { Icon } from '../../General/Icon'

export const PoolNameCell = ({ data }: { data: KadenaPool }) => {
  const { data: baseTokens } = useBaseTokens()
  const { data: decimals0 } = useTokenPrecision({
    tokenContract: (data?.token0?.address as KvmTokenAddress) ?? undefined,
  })
  const { data: decimals1 } = useTokenPrecision({
    tokenContract: (data?.token1?.address as KvmTokenAddress) ?? undefined,
  })

  const token0 = useMemo(() => {
    const _token0 = baseTokens?.find(
      (token) =>
        token?.address?.toLowerCase() === data?.token0?.address?.toLowerCase(),
    )
    if (_token0) {
      return _token0
    }

    return new KvmToken({
      chainId: KvmChainId.KADENA,
      address: data?.token0?.address as KvmTokenAddress,
      symbol: data?.token0?.name.slice(0, 4)?.toUpperCase(),
      decimals: decimals0 || 12,
      name: data?.token0?.name,
      metadata: {
        imageUrl: undefined,
        validated: false,
        kadenaChainId: KADENA_CHAIN_ID,
        kadenaNetworkId: KADENA_NETWORK_ID,
      },
    })
  }, [data.token0, baseTokens, decimals0])

  const token1 = useMemo(() => {
    const _token1 = baseTokens?.find(
      (token) =>
        token?.address?.toLowerCase() === data?.token1?.address?.toLowerCase(),
    )
    if (_token1) {
      return _token1
    }

    return new KvmToken({
      chainId: KvmChainId.KADENA,
      address: data?.token1?.address as KvmTokenAddress,
      symbol: data?.token1?.name.slice(0, 4)?.toUpperCase(),
      decimals: decimals1 || 12,
      name: data?.token1?.name,
      metadata: {
        imageUrl: undefined,
        validated: false,
        kadenaChainId: KADENA_CHAIN_ID,
        kadenaNetworkId: KADENA_NETWORK_ID,
      },
    })
  }, [data.token1, baseTokens, decimals1])

  return (
    <div className="flex items-center gap-5">
      <div className="flex min-w-[54px]">
        <Badge
          className="border-2 border-slate-900 rounded-full z-[11]"
          position="bottom-right"
          badgeContent={<Icon currency={KADENA} width={14} height={14} />}
        >
          <Currency.IconList iconWidth={26} iconHeight={26}>
            <Icon currency={token0} />
            <Icon currency={token1} />
          </Currency.IconList>
        </Badge>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1 pr-2 text-sm font-medium text-gray-900 dark:text-slate-50 whitespace-nowrap">
          {token0.symbol}/{token1.symbol}
        </span>
        <div className="flex gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] px-2 rounded-full">
                  {formatNumber(0.003 * 100)}%
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Swap fee</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
