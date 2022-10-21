import chains from '@sushiswap/chain'
import { formatUSD } from '@sushiswap/format'
import { Badge, Currency, Link, NetworkIcon, Skeleton, Typography } from '@sushiswap/ui'
import { KashiMediumRiskLendingPairV1 } from 'lib/KashiPair'
import React, { FC, useMemo } from 'react'
import useSWR from 'swr'

import { KashiPair } from '../../../.graphclient'

interface BorrowTableHoverElementProps {
  row: KashiMediumRiskLendingPairV1
}

export const BorrowTableHoverElement: FC<BorrowTableHoverElementProps> = ({ row }) => {
  const symbol = row.asset.symbol as string
  const { data } = useSWR<KashiPair[]>(`/kashi/api/borrow/${symbol.toLowerCase()}`, (url) =>
    fetch(url).then((response) => response.json())
  )
  const pairs = useMemo(
    () => (Array.isArray(data) ? data.map((pair) => new KashiMediumRiskLendingPairV1(pair)) : []),
    [data]
  )
  return (
    <div className="overflow-hidden rounded-md bg-slate-900 w-[320px]">
      <div className="p-3 flex items-center gap-3">
        <div className="w-8 h-8">
          <Currency.Icon currency={row.collateral} width={32} height={32} />
        </div>
        <Typography weight={600} variant="xl">
          Borrow {row.asset.symbol}
        </Typography>
      </div>
      <div className="pl-3 pr-5 pt-3 grid grid-cols-3 gap-3 mb-2">
        <Typography variant="sm" weight={500} className="text-slate-400">
          Collateral
        </Typography>
        <Typography variant="sm" weight={500} className="text-right text-slate-400">
          Available
        </Typography>
        <Typography variant="sm" weight={500} className="text-right text-slate-400">
          APR
        </Typography>
      </div>
      <div className="px-3">
        <div className="w-full h-px bg-slate-200/5" />
      </div>
      <div className="py-1.5 pl-1.5 pr-3.5 flex flex-col h-[200px] max-h-[200px] scroll">
        {pairs.length
          ? pairs
              .sort((a, b) => {
                if (b.totalAssetUSD === a.totalAssetUSD) return 0
                return b.totalAssetUSD < a.totalAssetUSD ? -1 : 1
              })
              .map((pair) => (
                <Link.Internal
                  passHref={true}
                  key={pair.id}
                  href={`/borrow/${chains[pair.chainId].shortName}:${pair.id}`}
                >
                  <a className="grid grid-cols-3 gap-3 cursor-pointer items-center hover:bg-slate-800 rounded-xl px-1.5 py-2 min-h-[42px]">
                    <div className="flex items-center gap-4">
                      <Badge badgeContent={<NetworkIcon chainId={pair.chainId} width={14} height={14} />}>
                        <Currency.Icon currency={pair.collateral} width={26} height={26} />
                      </Badge>
                      <Typography variant="sm" weight={600} className="text-right text-slate-100">
                        {pair.collateral.symbol}
                      </Typography>
                    </div>
                    <Typography variant="sm" weight={500} className="text-slate-100">
                      {formatUSD(pair.totalAssetUSD)}
                    </Typography>
                    <Typography variant="sm" weight={500} className="text-right text-slate-100">
                      {pair.borrowAPR.toSignificant(4)}%
                    </Typography>
                  </a>
                </Link.Internal>
              ))
          : Array.from(Array(5)).map((el, idx) => (
              <div
                key={idx}
                className="grid grid-cols-3 items-center gap-3 cursor-pointer hover:opacity-80 px-1.5 py-2 min-h-[42px]"
              >
                <div className="flex gap-3 items-center">
                  <Skeleton.Circle radius={26} className="bg-slate-800" />
                  <Skeleton.Box className="w-full h-5 bg-slate-800" />
                </div>
                <Skeleton.Box className="w-full h-5 bg-slate-800" />
                <Skeleton.Box className="w-full h-5 bg-slate-800" />
              </div>
            ))}
      </div>
    </div>
  )
}
