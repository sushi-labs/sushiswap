import { List } from '@sushiswap/ui/future/components/list/List'
import { Icon } from 'components/Icon'
import { FC } from 'react'
import { Pool, usePools } from 'utils/usePools'
import { useTokensFromPools } from 'utils/useTokensFromPool'
import { formatNumber } from 'utils/utilFunctions'

interface PoolCompositionProps {
  row: Pool
}

export const PoolComposition: FC<PoolCompositionProps> = ({ row }) => {
  const { token0, token1 } = useTokensFromPools(row)
  const balanceX = formatNumber(Number(row?.data?.balance_x?.value), token0.decimals)
  const balanceY = formatNumber(Number(row?.data?.balance_y?.value), token1.decimals)
  return (
    <List>
      <div className="flex items-center justify-between">
        <List.Label>Pool Liquidity</List.Label>
        <List.Label>{'$00.00m'}</List.Label>
      </div>
      <List.Control>
        {
          <List.KeyValue flex title={`${token0.symbol}`}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Icon currency={token0} width={18} height={18} />
                {balanceX.toFixed(4)} {' ' + token0.symbol}
                <span className="text-gray-600 dark:text-slate-400">({'$00.00m'})</span>
              </div>
            </div>
          </List.KeyValue>
        }
        {
          <List.KeyValue flex title={`${token1.symbol}`}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Icon currency={token1} width={18} height={18} />
                {balanceY.toFixed(4)} {' ' + token1.symbol}
                <span className="text-gray-600 dark:text-slate-400">({'$00.00m'})</span>
              </div>
            </div>
          </List.KeyValue>
        }
      </List.Control>
    </List>
  )
}
