import React, { FC, useMemo } from 'react'
import { Badge } from '@sushiswap/ui/future/components/Badge'
import { NetworkIcon } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { ChainId } from '@sushiswap/chain'
import { Pool } from '@sushiswap/v3-sdk'
import { unwrapToken } from '../../lib/functions'

type PoolHeader = {
  isLoading: boolean
  pool: Pool | null | undefined
  chainId: ChainId
}

export const PoolHeader: FC<PoolHeader> = ({ isLoading, pool, chainId }) => {
  const unwrappedTokens = useMemo(() => {
    if (!pool) return [undefined, undefined]
    return [unwrapToken(pool.token0), unwrapToken(pool.token1)]
  }, [pool])

  if (isLoading) {
    return (
      <div className="flex gap-6 h-[52px] mt-3">
        <div className="inline-flex">
          <Skeleton.Circle radius={48} />
          <Skeleton.Circle radius={48} style={{ marginLeft: -48 / 3 }} />
        </div>
        <div className="flex flex-col flex-grow">
          <Skeleton.Text fontSize="text-xl" className="w-full" />
          <Skeleton.Text fontSize="text-base" className="w-full" />
        </div>
      </div>
    )
  }

  if (pool && unwrappedTokens[0] && unwrappedTokens[1])
    return (
      <div className="flex gap-6 h-[52px] mt-3">
        <div className="flex min-w-[44px]">
          <Badge
            className="border-2 border-slate-900 rounded-full z-[11] !bottom-0 right-[-15%]"
            position="bottom-right"
            badgeContent={<NetworkIcon chainId={chainId} width={24} height={24} />}
          >
            <Currency.IconList iconWidth={48} iconHeight={48}>
              <Currency.Icon currency={unwrappedTokens[0]} />
              <Currency.Icon currency={unwrappedTokens[1]} />
            </Currency.IconList>
          </Badge>
        </div>
        <div className="flex flex-col flex-grow">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-50">
            {unwrapToken(pool.token0).symbol}/{unwrapToken(pool.token1).symbol}
          </h1>
          <p className="font-medium text-gray-700 dark:dark:text-slate-400 text-slate-600">
            Concentrated • {pool.fee / 10000}%
          </p>
        </div>
      </div>
    )

  return <></>
}
