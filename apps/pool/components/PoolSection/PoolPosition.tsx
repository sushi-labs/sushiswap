import { FundSource } from '@sushiswap/hooks'
import { Currency, Typography } from '@sushiswap/ui'
import { useBalance } from '@sushiswap/wagmi'
import { FC } from 'react'
import { useAccount } from 'wagmi'

import { useTokensFromPair } from '../../lib/hooks'
import { PairWithAlias } from '../../types'

interface PoolPositionProps {
  pair: PairWithAlias
}

export const PoolPosition: FC<PoolPositionProps> = ({ pair }) => {
  const { address } = useAccount()
  const [token0, token1, slpToken] = useTokensFromPair(pair)
  const { data: balance } = useBalance({ chainId: pair.chainId, currency: slpToken, account: address })

  return (
    <div className="bg-slate-800 flex flex-col rounded-2xl shadow-md shadow-black/30">
      <div className="flex justify-between items-center px-6 py-4">
        <Typography weight={600} className="text-slate-50">
          My Position
        </Typography>
        <div className="flex flex-col">
          <Typography variant="sm" weight={600} className="text-slate-400">
            $0.00
          </Typography>
          <Typography variant="xxs" weight={600} className="text-slate-400 text-right">
            {balance?.[FundSource.WALLET] ? balance[FundSource.WALLET].toSignificant(6) : '0.00'} SLP
          </Typography>
        </div>
      </div>
      <div className="flex justify-between py-3 bg-white bg-opacity-[0.04] px-6 mb-0.5">
        <div className="flex gap-2 items-center">
          <Currency.Icon currency={token0} width={20} height={20} />
          <Typography variant="sm" weight={600} className="text-slate-50">
            0.00 {token0.symbol}
          </Typography>
        </div>
        <Typography variant="xs" weight={600} className="text-slate-400">
          $0.00
        </Typography>
      </div>
      <div className="flex justify-between py-3 bg-white bg-opacity-[0.04] px-6">
        <div className="flex gap-2 items-center">
          <Currency.Icon currency={token1} width={20} height={20} />
          <Typography variant="sm" weight={700} className="text-slate-50">
            0.00 {token1.symbol}
          </Typography>
        </div>
        <Typography variant="xs" weight={500} className="text-slate-400">
          $0.00
        </Typography>
      </div>
      <div className="flex justify-between items-center px-6 py-4">
        <Typography variant="xs" className="text-slate-200">
          LP Fees Earned
        </Typography>
        <div className="flex flex-col">
          <Typography variant="xs" weight={600} className="text-slate-400">
            $0.00
          </Typography>
        </div>
      </div>
    </div>
  )
}
