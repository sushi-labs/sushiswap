import { Typography } from '@sushiswap/ui'
import { Icon } from 'components/Icon'
import { FC, useMemo } from 'react'
import { Pool } from 'utils/usePools'
import { useTokensFromPools } from 'utils/useTokensFromPool'
import { useTotalSupply } from 'utils/useTotalSupply'
import { useUnderlyingTokenBalanceFromPool } from 'utils/useUnderlyingTokenBalanceFromPool'

interface PoolPositionStakedDesktopProps {
  row: Pool
  isLoading: boolean
  stakeAmount: number
}

export const PoolPositionStakedDesktop: FC<PoolPositionStakedDesktopProps> = ({ row, isLoading, stakeAmount }) => {
  const { token0, token1 } = useTokensFromPools(row)
  const tokenAddress = row?.id
  const { data: coinInfo } = useTotalSupply(tokenAddress)

  const [reserve0, reserve1] = useMemo(() => {
    return [row?.data?.balance_x?.value, row?.data?.balance_y?.value]
  }, [row])

  const totalSupply = coinInfo?.data?.supply?.vec?.[0]?.integer?.vec?.[0]?.value
  const [underlying0, underlying1] = useUnderlyingTokenBalanceFromPool({
    balance: stakeAmount,
    reserve0: Number(reserve0),
    reserve1: Number(reserve1),
    totalSupply: Number(totalSupply),
    decimals: coinInfo?.data?.decimals,
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 px-5 py-4">
        <div className="flex justify-between mb-1 py-0.5">
          <div className="h-[16px] bg-slate-600 animate-pulse w-[100px] rounded-full" />
          <div className="h-[16px] bg-slate-600 animate-pulse w-[60px] rounded-full" />
        </div>
        <div className="flex justify-between py-0.5">
          <div className="h-[16px] bg-slate-700 animate-pulse w-[160px] rounded-full" />
          <div className="h-[16px] bg-slate-700 animate-pulse w-[60px] rounded-full" />
        </div>
        <div className="flex justify-between py-0.5">
          <div className="h-[16px] bg-slate-700 animate-pulse w-[160px] rounded-full" />
          <div className="h-[16px] bg-slate-700 animate-pulse w-[60px] rounded-full" />
        </div>
      </div>
    )
  }
  if (!isLoading)
    return (
      <div className="flex flex-col gap-3 px-5 py-4">
        <div className="flex items-center justify-between mb-1">
          <Typography variant="sm" weight={600} className="dark:text-slate-100 text-gray-900">
            Staked Position
          </Typography>
          <Typography variant="xs" weight={500} className="dark:text-slate-100 text-gray-900">
            {`$0.00`}
          </Typography>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon currency={token0} width={20} height={20} />
            <Typography variant="sm" weight={600} className="dark:text-slate-300 text-gray-700">
              {underlying0 ? underlying0.toFixed(6) : 0} {token0.symbol}
            </Typography>
          </div>
          <Typography variant="xs" weight={500} className="dark:text-slate-400 text-slate-600">
            {`$0.00`}
          </Typography>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon currency={token1} width={20} height={20} />
            <Typography variant="sm" weight={600} className="dark:text-slate-300 text-gray-700">
              {underlying1 ? underlying1.toFixed(6) : 0} {token1.symbol}
            </Typography>
          </div>
          <Typography variant="xs" weight={500} className="dark:text-slate-400 text-slate-600">
            {`$0.00`}
          </Typography>
        </div>
      </div>
    )
  return <></>
}
