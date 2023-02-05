import { ExternalLinkIcon } from '@heroicons/react/solid'
import chains from '@sushiswap/chain'
import { Price } from '@sushiswap/currency'
import { formatPercent, formatUSD } from '@sushiswap/format'
import { Pool } from '@sushiswap/client'
import { AppearOnMount, Currency, Link, NetworkIcon, Typography } from '@sushiswap/ui'
import { usePrices } from '@sushiswap/wagmi'
import { FC, useMemo } from 'react'

import { useGraphPool } from '../../lib/hooks'
import { FarmRewardsAvailableTooltip } from '../FarmRewardsAvailableTooltip'

interface PoolHeader {
  pool: Pool
}

export const PoolHeader: FC<PoolHeader> = ({ pool }) => {
  const { data: prices } = usePrices({ chainId: pool.chainId })

  const { token0, token1, reserve0, reserve1, liquidityToken } = useGraphPool(pool)

  const price = useMemo(
    () => (reserve0 && reserve1 ? new Price({ baseAmount: reserve0, quoteAmount: reserve1 }) : null),
    [reserve0, reserve1]
  )

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="flex gap-1">
          <NetworkIcon type="naked" chainId={pool.chainId} width={16} height={16} />
          <Typography variant="xs" className="text-slate-500">
            {chains[pool.chainId].name}
          </Typography>
        </div>
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex">
            <Currency.IconList iconWidth={44} iconHeight={44}>
              <Currency.Icon currency={token0} />
              <Currency.Icon currency={token1} />
            </Currency.IconList>
            <Link.External
              className="flex flex-col !no-underline group"
              href={chains[pool.chainId].getTokenUrl(liquidityToken.wrapped.address)}
            >
              <div className="flex items-center gap-2">
                <Typography
                  variant="lg"
                  className="flex items-center gap-1 text-slate-50 group-hover:text-blue-400"
                  weight={600}
                >
                  {token0.symbol}/{token1.symbol}
                  <ExternalLinkIcon width={20} height={20} className="text-slate-400 group-hover:text-blue-400" />
                </Typography>
              </div>
              <Typography variant="xs" className="text-slate-300">
                Fee: {pool.swapFee * 100}%
              </Typography>
            </Link.External>
          </div>
          <div className="flex flex-col gap-1">
            <Typography weight={400} as="span" className="text-slate-400 sm:text-right">
              APR: <span className="font-semibold text-slate-50">{formatPercent(pool.totalApr)}</span>
              {pool.incentiveApr > 0 ? <FarmRewardsAvailableTooltip /> : ''}
            </Typography>
            <div className="flex gap-2">
              {pool.incentiveApr > 0 && (
                <Typography variant="sm" weight={400} as="span" className="text-slate-400">
                  Rewards: {formatPercent(pool.incentiveApr)}
                </Typography>
              )}
              <Typography variant="sm" weight={400} as="span" className="text-slate-400">
                Fees: {formatPercent(pool.feeApr)}
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex gap-3 p-3 rounded-lg shadow-md bg-slate-800 shadow-black/10">
          <Currency.Icon currency={token0} width={20} height={20} />
          <Typography variant="sm" weight={600} className="text-slate-300">
            <AppearOnMount>
              {token0.symbol} ={' '}
              {prices?.[token1.wrapped.address] && price
                ? formatUSD(Number(price.toFixed(6)) * Number(prices[token1.wrapped.address].toSignificant(6)))
                : `$0.00`}
            </AppearOnMount>
          </Typography>
        </div>
        <div className="flex gap-3 p-3 rounded-lg shadow-md bg-slate-800 shadow-black/10">
          <Currency.Icon currency={token1} width={20} height={20} />
          <Typography variant="sm" weight={600} className="text-slate-300">
            <AppearOnMount>
              {token1.symbol} ={' '}
              {prices?.[token0.wrapped.address] && price
                ? formatUSD(Number(prices[token0.wrapped.address].toSignificant(6)) / Number(price.toSignificant(6)))
                : '$0.00'}{' '}
            </AppearOnMount>
          </Typography>
        </div>
      </div>
    </div>
  )
}
