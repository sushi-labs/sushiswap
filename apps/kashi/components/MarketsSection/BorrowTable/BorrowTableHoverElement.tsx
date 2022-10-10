import { formatPercent } from '@sushiswap/format'
import { Currency, Link, NetworkIcon, Typography } from '@sushiswap/ui'
import React, { FC } from 'react'
import useSWR from 'swr'

import { KashiPair } from '../../../.graphclient'
import { useTokensFromKashiPair } from '../../../lib/hooks'

interface BorrowTableHoverElementProps {
  row: KashiPair
}

export const BorrowTableHoverElement: FC<BorrowTableHoverElementProps> = ({ row }) => {
  const { collateral } = useTokensFromKashiPair(row)
  const { data: pairs } = useSWR<KashiPair[]>(
    `/kashi/api/pairs?symbol=${(row.collateral.symbol as string).toLowerCase()}&asset=false`,
    (url) => fetch(url).then((response) => response.json())
  )

  return (
    <div className="p-3 overflow-hidden rounded-md">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6">
          <Currency.Icon currency={collateral} width={24} height={24} />
        </div>
        <Typography weight={600} variant="xl">
          Borrow {row.collateral.symbol}
        </Typography>
      </div>
      <div className="w-full h-px my-3 bg-slate-200/5" />
      <div className="grid grid-cols-3 gap-2 mb-2">
        <Typography variant="sm" weight={500} className="text-slate-100">
          Network
        </Typography>
        <Typography variant="sm" weight={500} className="text-slate-100">
          Market Asset
        </Typography>
        <Typography variant="sm" weight={500} className="text-right text-slate-100">
          APR
        </Typography>
      </div>
      <div className="flex flex-col gap-2">
        {pairs
          ? pairs.map((pair) => (
              <Link.Internal passHref={true} key={pair.id} href={`/${pair.id}`}>
                <a className="grid grid-cols-3 gap-2 cursor-pointer hover:opacity-80">
                  <NetworkIcon chainId={pair.chainId} width={20} height={20} />
                  <Typography variant="sm" weight={400} className="text-slate-300">
                    {pair.asset.symbol}
                  </Typography>
                  <Typography variant="sm" weight={400} className="text-right text-slate-100">
                    {formatPercent(row.borrowAPR / 1e18)}
                  </Typography>
                </a>
              </Link.Internal>
            ))
          : Array.from(Array(3)).map((el, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-2 cursor-pointer hover:opacity-80">
                <div className="w-5 h-5 rounded-full animate-pulse bg-slate-700" />
                <div className="w-full h-4 rounded-full animate-pulse bg-slate-700" />
                <div className="w-full h-4 rounded-full animate-pulse bg-slate-700" />
              </div>
            ))}
      </div>
    </div>
  )
}
