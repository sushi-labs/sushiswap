import chains from '@sushiswap/chain'
import { formatPercent, formatUSD } from '@sushiswap/format'
import { JSBI } from '@sushiswap/math'
import { Currency, Link, NetworkIcon, Skeleton, Typography } from '@sushiswap/ui'
import React, { FC } from 'react'

import { KashiMediumRiskLendingPairV1 } from '../lib/KashiPair'

interface PairCard {
  pair?: KashiMediumRiskLendingPairV1
  loading?: boolean
}

export const PairCard: FC<PairCard> = ({ pair, loading = false }) => {
  if (!pair || loading)
    return (
      <div className="flex flex-col p-4 bg-slate-800 rounded-lg">
        <div className="flex gap-1.5 items-center w-full h-[20px]">
          <Skeleton.Circle radius={14} className="bg-slate-700" />
          <Skeleton.Box className="bg-slate-700 h-3 w-[100px]" />
        </div>
        <div className="flex items-center gap-2.5 mt-4">
          <Skeleton.Circle radius={36} className="bg-slate-700" />
          <div className="flex flex-col">
            <div className="h-5 flex items-center">
              <Skeleton.Box className="bg-slate-700 h-4 w-[60px]" />
            </div>
            <div className="h-5 flex items-center">
              <Skeleton.Box className="bg-slate-700 h-3 w-[120px]" />
            </div>
          </div>
        </div>
        <div className="my-4 w-full h-px border-b border-slate-200/5" />
        <div className="grid grid-cols-2 gap-1">
          <div className="h-5 flex items-center">
            <Skeleton.Box className="bg-slate-700 h-4 w-[40px]" />
          </div>
          <div className="h-5 flex items-center justify-end">
            <Skeleton.Box className="bg-slate-700 h-4 w-[60px]" />
          </div>
          <div className="h-5 flex items-center">
            <Skeleton.Box className="bg-slate-700 h-4 w-[60px]" />
          </div>
          <div className="h-5 flex items-center justify-end">
            <Skeleton.Box className="bg-slate-700 h-4 w-[70px]" />
          </div>
          <div className="h-5 flex items-center">
            <Skeleton.Box className="bg-slate-700 h-4 w-[50px]" />
          </div>
          <div className="h-5 flex items-center justify-end">
            <Skeleton.Box className="bg-slate-700 h-4 w-[50px]" />
          </div>
        </div>
      </div>
    )

  return (
    <Link.Internal passHref={true} href={`/lend/${chains[pair.chainId].shortName}:${pair.id}`}>
      <a>
        <div className="transition-all flex flex-col p-4 bg-slate-800 rounded-lg hover:translate-y-[-2px] hover:ring-2 ring-blue ring-offset-2 ring-offset-slate-900 cursor-pointer">
          <div className="flex gap-1.5 items-center">
            <NetworkIcon chainId={pair.chainId} width={14} height={14} />
            <Typography variant="xs" weight={500} className="text-slate-50">
              {chains[pair.chainId].name}
            </Typography>
          </div>
          <div className="flex items-center gap-2.5 mt-4">
            <div>
              <Currency.Icon currency={pair.asset} width={36} height={36} />
            </div>
            <div className="flex flex-col">
              <Typography weight={600} className="text-slate-100">
                {pair.asset.symbol}
              </Typography>
              <div className="flex items-center gap-1">
                <Typography variant="xs" weight={500} className="text-slate-500">
                  Collateral:{' '}
                </Typography>
                <Typography variant="xs" weight={500} className="text-slate-100">
                  {pair.collateral.symbol}
                </Typography>
                <div className="ml-0.5">
                  <Currency.Icon currency={pair.collateral} width={14} height={14} />
                </div>
              </div>
            </div>
          </div>
          <div className="my-4 w-full h-px border-b border-slate-200/5" />
          <div className="grid grid-cols-2 gap-1">
            <Typography weight={500} variant="xs" className="text-slate-500">
              Borrowed:
            </Typography>
            <Typography weight={600} variant="sm" className="text-right text-slate-200">
              {formatUSD(pair.totalBorrowUSD)}
            </Typography>
            <Typography weight={500} variant="xs" className="text-slate-500">
              Lend APR:
            </Typography>
            <Typography weight={600} variant="sm" className="text-right text-slate-200">
              {pair.supplyAPR.toSignificant(2)}%
            </Typography>
            <Typography weight={500} variant="xs" className="text-slate-500">
              Utilization Rate:
            </Typography>
            <Typography weight={600} variant="sm" className="text-right text-slate-200">
              {formatPercent(JSBI.toNumber(pair.utilization) / 1e18)}
            </Typography>
          </div>
        </div>
      </a>
    </Link.Internal>
  )
}
