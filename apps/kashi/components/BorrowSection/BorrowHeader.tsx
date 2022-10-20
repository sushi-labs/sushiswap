import { chainName } from '@sushiswap/chain'
import { Chip, Currency, NetworkIcon, Typography } from '@sushiswap/ui'
import { KashiMediumRiskLendingPairV1 } from 'lib/KashiPair'
import { FC } from 'react'

import { useTokensFromKashiPair } from '../../lib/hooks'
import { IconListVariableSizes } from '../IconListVariableSizes'

interface BorrowHeader {
  pair: KashiMediumRiskLendingPairV1
}

export const BorrowHeader: FC<BorrowHeader> = ({ pair }) => {
  const { asset, collateral } = useTokensFromKashiPair(pair)
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="flex gap-1">
          <NetworkIcon type="naked" chainId={pair.chainId} width={16} height={16} />
          <Typography variant="xs" className="text-slate-500">
            {chainName[pair.chainId]}
          </Typography>
        </div>
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex items-center">
            <IconListVariableSizes token0={asset} token1={collateral} />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Typography variant="lg" className="text-slate-50" weight={700}>
                  Borrow: {asset.symbol}
                </Typography>
                <Chip color="gray" label={`${pair.borrowAPR.toFixed(2)}%`} className="font-medium text-slate-50" />
              </div>
              <Typography variant="xs" weight={500} className="flex items-center gap-1 text-slate-400">
                <div className="w-1 h-1 rounded-full bg-green" />
                Collateral: {collateral.symbol}
              </Typography>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Typography weight={400} as="span" variant="xs" className="text-slate-400 sm:text-right">
              Oracle: ChainLink
            </Typography>
            <div className="flex gap-3 rounded-lg bg-slate-800 px-3 py-1.5">
              <Currency.Icon currency={asset} width={20} height={20} />
              <Typography variant="sm" weight={600} className="text-slate-300">
                1 {asset.symbol} = {pair.collateralPrice.toSignificant(6)} {collateral.symbol}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
