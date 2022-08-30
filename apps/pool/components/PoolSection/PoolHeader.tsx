import { ExternalLinkIcon } from '@heroicons/react/solid'
import chains from '@sushiswap/chain'
import { Price } from '@sushiswap/currency'
import { formatPercent } from '@sushiswap/format'
import { AppearOnMount, Currency, Link, NetworkIcon, Typography } from '@sushiswap/ui'
import { useFarmRewards, usePrices } from '@sushiswap/wagmi'
import { FC } from 'react'

import { useTokensFromPair } from '../../lib/hooks'
import { PairWithAlias } from '../../types'
import { FarmRewardsAvailableTooltip } from '../FarmRewardsAvailableTooltip'

interface PoolHeader {
  pair: PairWithAlias
}

export const PoolHeader: FC<PoolHeader> = ({ pair }) => {
  const { data: prices } = usePrices({ chainId: pair.chainId })
  const { token0, token1, reserve1, reserve0, liquidityToken } = useTokensFromPair(pair)
  const price = new Price({ baseAmount: reserve0, quoteAmount: reserve1 })
  const { data: rewards } = useFarmRewards()

  const farm = rewards?.[pair.chainId]?.farms?.[pair.id.toLowerCase()]
  const rewardAPR = (farm?.incentives.reduce((acc, cur) => acc + (cur.apr || 0), 0) || 0) / 100
  const totalAPR = rewardAPR + pair.apr / 100

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="flex gap-1">
          <NetworkIcon type="naked" chainId={pair.chainId} width={16} height={16} />
          <Typography variant="xs" className="text-slate-500">
            {chains[pair.chainId].name}
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
              href={chains[pair.chainId].getTokenUrl(liquidityToken.wrapped.address)}
            >
              <div className="flex gap-2 items-center">
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
                Fee: {pair.swapFee / 100}%
              </Typography>
            </Link.External>
          </div>
          <AppearOnMount>
            <div className="flex flex-col gap-1">
              <Typography weight={400} as="span" className="text-slate-400 sm:text-right">
                APR: <span className="font-semibold text-slate-50">{formatPercent(totalAPR)}</span>
                {rewardAPR > 0 ? <FarmRewardsAvailableTooltip /> : ''}
              </Typography>
              <div className="flex gap-2">
                <Typography variant="sm" weight={400} as="span" className="text-slate-400">
                  Rewards: {formatPercent(rewardAPR)}
                </Typography>
                <Typography variant="sm" weight={400} as="span" className="text-slate-400">
                  Fees: {formatPercent(pair.apr / 100)}
                </Typography>
              </div>
            </div>
          </AppearOnMount>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex gap-3 rounded-lg bg-slate-800 p-3">
          <Currency.Icon currency={token0} width={20} height={20} />
          <AppearOnMount>
            <Typography variant="sm" weight={600} className="text-slate-300">
              {token0.symbol} = $
              {(prices?.[token1.wrapped.address]
                ? Number(price.toFixed(6)) * Number(prices[token1.wrapped.address].toSignificant(6))
                : 0
              ).toFixed(2)}
            </Typography>
          </AppearOnMount>
        </div>
        <div className="flex gap-3 rounded-lg bg-slate-800 p-3">
          <Currency.Icon currency={token1} width={20} height={20} />
          <AppearOnMount>
            <Typography variant="sm" weight={600} className="text-slate-300">
              {token1.symbol} = $
              {(prices?.[token0.wrapped.address]
                ? Number(prices[token0.wrapped.address].toSignificant(6)) / Number(price.toSignificant(6))
                : 0
              ).toFixed(10)}{' '}
            </Typography>
          </AppearOnMount>
        </div>
      </div>
    </div>
  )
}
