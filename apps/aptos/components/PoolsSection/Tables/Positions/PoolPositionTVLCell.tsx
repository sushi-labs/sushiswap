import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { FC, useMemo } from 'react'
import { formatUSD } from 'sushi/format'
import { formatNumber } from 'utils/format-number'
import { useNetwork } from 'utils/useNetwork'
import { Pool } from 'utils/usePools'
import { useStablePrice } from 'utils/useStablePrice'
import { useTokenBalance } from 'utils/useTokenBalance'
import { useTokensFromPools } from 'utils/useTokensFromPool'
import { useTotalSupply } from 'utils/useTotalSupply'
import { Row } from '../SharedCells/types'

export const PoolMyPositionTVLCell: FC<Row<Pool>> = ({ row }) => {
  const {
    contracts: { swap: swapContract },
  } = useNetwork()

  const { token0, token1 } = useTokensFromPools(row)
  const tokenAddress = row?.id
  const { account } = useWallet()

  const { data: liquidityBalance } = useTokenBalance({
    account: account?.address as string,
    currency: `${swapContract}::swap::LPToken<${tokenAddress}>`,
    enabled: Boolean(swapContract && account?.address && tokenAddress),
    refetchInterval: 2000,
  })

  const { data: coinInfo } = useTotalSupply(
    `${row?.data?.token_x_details.token_address},${row?.data?.token_y_details.token_address}`,
  )

  const totalSupply = coinInfo?.data?.supply?.vec?.[0]?.integer?.vec?.[0]?.value

  const [reserve0, reserve1] = useMemo(() => {
    return [row?.data?.balance_x?.value, row?.data?.balance_y?.value]
  }, [row])

  const currencyABalance = useMemo(() => {
    return token0
      ? liquidityBalance
        ? Math.floor(
            (Number(reserve0) * Math.floor(liquidityBalance)) /
              Number(totalSupply),
          )
        : 0
      : undefined
  }, [liquidityBalance, reserve0, token0, totalSupply])

  const currencyBBalance = useMemo(() => {
    return token1
      ? liquidityBalance
        ? Math.floor(
            (Number(reserve1) * Math.floor(liquidityBalance)) /
              Number(totalSupply),
          )
        : 0
      : undefined
  }, [liquidityBalance, reserve1, token1, totalSupply])

  const token0Price = useStablePrice({ currency: token0 }) ?? 0
  const token1Price = useStablePrice({ currency: token1 }) ?? 0

  const userPositionTvl =
    token0Price *
      Number(formatNumber(Number(currencyABalance), token0.decimals)) +
    token1Price *
      Number(formatNumber(Number(currencyBBalance), token1.decimals))

  return (
    <div className="flex items-center gap-1">
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
          {currencyABalance && currencyBBalance
            ? formatUSD(userPositionTvl)
            : formatUSD(0)}
        </span>
      </div>
    </div>
  )
}
