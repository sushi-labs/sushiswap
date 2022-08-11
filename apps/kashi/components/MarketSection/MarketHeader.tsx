import chains from '@sushiswap/chain'
import { Chip, Currency, NetworkIcon, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { KashiPair } from '../../.graphclient'
import { useTokensFromKashiPair } from '../../lib/hooks'
import { IconListVariableSizes } from '../IconListVariableSizes'

interface MarketHeader {
  pair: KashiPair
  side: 'borrow' | 'lend'
}

export const MarketHeader: FC<MarketHeader> = ({ pair, side }) => {
  const { asset, collateral } = useTokensFromKashiPair(pair)

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
          <div className="flex items-center">
            <IconListVariableSizes token0={asset} token1={collateral} />
            <div className="flex flex-col">
              <div className="flex gap-2 items-center">
                <Typography variant="lg" className="text-slate-50" weight={700}>
                  {side === 'lend' ? 'Lend' : 'Borrow'}: {side === 'lend' ? asset.symbol : collateral.symbol}
                </Typography>
                <Chip color="gray" label="0.05%" className="text-slate-50 font-medium" />
              </div>
              <Typography variant="xs" weight={500} className="flex gap-1 items-center text-slate-400">
                <div className="bg-green h-1 w-1 rounded-full" />
                Collateral: {side === 'lend' ? collateral.symbol : asset.symbol}
              </Typography>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Typography weight={400} as="span" className="text-slate-400 sm:text-right">
              APY: <span className="font-bold text-slate-50">22.27%</span>
            </Typography>
            <div className="flex gap-2">
              <Typography variant="sm" weight={400} as="span" className="text-slate-400">
                Rewards: 12%
              </Typography>
              <Typography variant="sm" weight={400} as="span" className="text-slate-400">
                Fees: 10.27%
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex gap-3 rounded-lg bg-slate-800 p-3">
          <Currency.Icon currency={asset} width={20} height={20} />
          <Typography variant="sm" weight={600} className="text-slate-300">
            {/*1 {asset.symbol} = {formatNumber(pair.reserve1 / pair.reserve0)} {token1.symbol}*/}
          </Typography>
        </div>
        <div className="flex gap-3 rounded-lg bg-slate-800 p-3">
          <Currency.Icon currency={collateral} width={20} height={20} />
          <Typography variant="sm" weight={600} className="text-slate-300">
            {/*1 {collateral.symbol} = {formatNumber(pair.reserve0 / pair.reserve1)} {token0.symbol}*/}
          </Typography>
        </div>
      </div>
    </div>
  )
}
