import { useWallet } from '@aptos-labs/wallet-adapter-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@sushiswap/ui'
import { FC, useMemo } from 'react'
import { formatUSD } from 'sushi/format'
import { useNetwork } from 'utils/hooks/useNetwork'
import { Pool } from 'utils/hooks/usePools'
import { useStablePrice } from 'utils/hooks/useStablePrice'
import { useTokenBalance } from 'utils/hooks/useTokenBalance'
import { useTokensFromPools } from 'utils/hooks/useTokensFromPool'
import { useTotalSupply } from 'utils/hooks/useTotalSupply'
import { useUnderlyingTokenBalanceFromPool } from 'utils/hooks/useUnderlyingTokenBalanceFromPool'
import { PoolPositionDesktop } from './PoolPositionDesktop'
import { PoolPositionStakedDesktop } from './PoolPositionStakedDesktop'

interface PoolPositionProps {
  row: Pool
  isLoading: boolean
  stakeAmount: number
}

export const PoolPosition: FC<PoolPositionProps> = ({
  row,
  isLoading,
  stakeAmount,
}) => {
  const { token0, token1 } = useTokensFromPools(row)
  const { account } = useWallet()
  const tokenAddress = row?.id
  const [reserve0, reserve1] = useMemo(() => {
    return [row?.data?.balance_x?.value, row?.data?.balance_y?.value]
  }, [row])

  const {
    contracts: { swap: swapContract },
  } = useNetwork()

  const { data: LPBalance, isLoading: isBalanceLoading } = useTokenBalance({
    account: account?.address as string,
    currency: `${swapContract}::swap::LPToken<${tokenAddress}>`,
    enabled: Boolean(swapContract && account?.address && tokenAddress),
    refetchInterval: 2000,
  })
  const { data: coinInfo, isLoading: isLoadingSupply } =
    useTotalSupply(tokenAddress)
  const totalSupply = coinInfo?.data?.supply?.vec?.[0]?.integer?.vec?.[0]?.value
  const [underlying0, underlying1] = useUnderlyingTokenBalanceFromPool({
    balance: LPBalance,
    reserve0: Number(reserve0),
    reserve1: Number(reserve1),
    token0,
    token1,
    totalSupply: Number(totalSupply),
  })
  const [stakedUnderlying0, stakedUnderlying1] =
    useUnderlyingTokenBalanceFromPool({
      balance: stakeAmount,
      reserve0: Number(reserve0),
      reserve1: Number(reserve1),
      token0,
      token1,
      totalSupply: Number(totalSupply),
    })
  const token0Price = useStablePrice({ currency: token0 })
  const token1Price = useStablePrice({ currency: token1 })
  const token0UnstakedInUsd = token0Price
    ? token0Price * Number(underlying0)
    : 0
  const token1UnstakedInUsd = token1Price
    ? token1Price * Number(underlying1)
    : 0
  const token0StakedInUsd = token0Price
    ? token0Price * Number(stakedUnderlying0)
    : 0
  const token1StakedInUsd = token1Price
    ? token1Price * Number(stakedUnderlying1)
    : 0
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Position</CardTitle>
        <CardDescription>
          <span className="text-sm text-right dark:text-slate-50 text-gray-900">
            {formatUSD(
              token0StakedInUsd +
                token1StakedInUsd +
                token0UnstakedInUsd +
                token1UnstakedInUsd,
            )}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PoolPositionDesktop
          row={row}
          isLoading={isLoading || isBalanceLoading || isLoadingSupply}
          underlying0={underlying0}
          underlying1={underlying1}
          value0={token0UnstakedInUsd}
          value1={token1UnstakedInUsd}
        />
        <PoolPositionStakedDesktop
          row={row}
          isLoading={isLoading || isBalanceLoading || isLoadingSupply}
          underlying0={stakedUnderlying0}
          underlying1={stakedUnderlying1}
          value0={token0StakedInUsd}
          value1={token1StakedInUsd}
        />
      </CardContent>
    </Card>
  )
}
