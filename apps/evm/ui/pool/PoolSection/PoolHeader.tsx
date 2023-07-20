import { ExternalLinkIcon } from '@heroicons/react-v1/solid'
import chains, { ChainId } from '@sushiswap/chain'
import { Pool } from '@sushiswap/client'
import { formatPercent, formatUSD } from '@sushiswap/format'
import { usePrices } from '@sushiswap/react-query'
import { Link } from '@sushiswap/ui'
import { AppearOnMount } from '@sushiswap/ui/components/animation'
import { Currency } from '@sushiswap/ui/components/currency'
import { NetworkIcon } from '@sushiswap/ui/components/icons'
import { useGraphPool } from 'lib/hooks'
import { FC } from 'react'

import { FarmRewardsAvailableTooltip } from '../FarmRewardsAvailableTooltip'

interface PoolHeader {
  pool: Pool
}

export const PoolHeader: FC<PoolHeader> = ({ pool }) => {
  const { data: prices } = usePrices({ chainId: pool.chainId })

  const {
    data: { token0, token1, liquidityToken },
  } = useGraphPool(pool)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="flex gap-1">
          <NetworkIcon type="naked" chainId={pool.chainId as ChainId} width={16} height={16} />
          <p className="text-xs text-gray-600 dark:text-slate-500">{chains[pool.chainId].name}</p>
        </div>
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex gap-2">
            <Currency.IconList iconWidth={44} iconHeight={44}>
              <Currency.Icon currency={token0} />
              <Currency.Icon currency={token1} />
            </Currency.IconList>
            <Link.External
              className="flex flex-col !no-underline group"
              href={chains[pool.chainId].getTokenUrl(liquidityToken.wrapped.address)}
            >
              <div className="flex items-center gap-2">
                <p className="flex items-center gap-1 text-lg font-semibold text-gray-900 dark:text-slate-50 group-hover:text-blue-400">
                  {token0.symbol}/{token1.symbol}
                  <ExternalLinkIcon
                    width={20}
                    height={20}
                    className="dark:text-slate-400 text-slate-600 group-hover:text-blue-400"
                  />
                </p>
              </div>
              <p className="text-xs text-gray-600 dark:text-slate-300">Fee: {formatPercent(pool.swapFee)}</p>
            </Link.External>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 dark:text-slate-400 text-slate-600 sm:text-right">
              APR:{' '}
              <span className="font-semibold text-gray-900 dark:text-slate-50">{formatPercent(pool.totalApr1d)}</span>
              {pool.incentiveApr > 0 ? <FarmRewardsAvailableTooltip /> : ''}
            </span>
            <div className="flex gap-2">
              {pool.incentiveApr > 0 && (
                <span className="text-sm text-gray-600 dark:text-slate-400 text-slate-600">
                  Rewards: {formatPercent(pool.incentiveApr)}
                </span>
              )}
              <span className="text-sm text-gray-600 dark:text-slate-400 text-slate-600">
                Fees: {formatPercent(pool.feeApr1d)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex gap-3 p-3 bg-white rounded-lg dark:bg-slate-800">
          <Currency.Icon currency={token0} width={20} height={20} />
          <p className="text-sm font-semibold text-gray-600 dark:text-slate-300">
            <AppearOnMount>
              {token0.symbol} ={' '}
              {prices?.[token0.wrapped.address]
                ? formatUSD(Number(prices[token0.wrapped.address].toSignificant(6)))
                : '$0.00'}
            </AppearOnMount>
          </p>
        </div>
        <div className="flex gap-3 p-3 bg-white rounded-lg dark:bg-slate-800">
          <Currency.Icon currency={token1} width={20} height={20} />
          <p className="text-sm font-semibold text-gray-600 dark:text-slate-300">
            <AppearOnMount>
              {token1.symbol} ={' '}
              {prices?.[token1.wrapped.address]
                ? formatUSD(Number(prices[token1.wrapped.address].toSignificant(6)))
                : '$0.00'}{' '}
            </AppearOnMount>
          </p>
        </div>
      </div>
    </div>
  )
}
