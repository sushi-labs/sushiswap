import { Pool } from '@sushiswap/client'
import { formatUSD } from '@sushiswap/format'
import { List } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui/components/currency'
import { useTokensFromPool } from 'lib/hooks'
import { FC } from 'react'

import { usePoolPositionStaked } from './PoolPositionStakedProvider'

interface PoolPositionStakedDesktopProps {
  pool: Pool
}

export const PoolPositionStakedDesktop: FC<PoolPositionStakedDesktopProps> = ({ pool }) => {
  const { token0, token1 } = useTokensFromPool(pool)
  const { value1, value0, underlying1, underlying0, isLoading, isError } = usePoolPositionStaked()

  if (!pool.incentives) return <></>

  if (isLoading && !isError) {
    return (
      <>
        <List.KeyValue skeleton />
        <List.KeyValue skeleton />
        <List.KeyValue skeleton />
      </>
    )
  }

  if (!isLoading && !isError)
    return (
      <>
        <List.KeyValue title={<span className="tracking-tighter font-bold text-xs text-muted-foreground">Staked</span>}>
          {''}
        </List.KeyValue>
        <List.KeyValue flex title={`${token0.symbol}`}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Currency.Icon currency={token0} width={18} height={18} />
              {underlying0?.toSignificant(6)} {token0.symbol}{' '}
              <span className="text-muted-foreground">{formatUSD(value0)}</span>
            </div>
          </div>
        </List.KeyValue>
        <List.KeyValue flex title={`${token1.symbol}`}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Currency.Icon currency={token1} width={18} height={18} />
              {underlying1?.toSignificant(6)} {token1.symbol}{' '}
              <span className="text-muted-foreground">{formatUSD(value1)}</span>
            </div>
          </div>
        </List.KeyValue>
      </>
    )

  return <></>
}
