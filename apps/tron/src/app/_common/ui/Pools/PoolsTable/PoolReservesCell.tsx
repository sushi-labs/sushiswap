import { SkeletonText } from '@sushiswap/ui'
import { formatNumber } from 'sushi/format'
import { useTokenInfo } from '~tron/_common/lib/hooks/useTokenInfo'
import { formatUnits } from '~tron/_common/lib/utils/formatters'
import { getBase58Address } from '~tron/_common/lib/utils/helpers'
import { IRowData } from './PoolsTable'

export const PoolReservesCell = ({ data }: { data: IRowData }) => {
  const { token0Address, token1Address, reserve0, reserve1 } = data
  const { data: token0Data, isLoading: isLoadingToken0 } = useTokenInfo({
    tokenAddress: getBase58Address(token0Address),
  })

  const { data: token1Data, isLoading: isLoadingToken1 } = useTokenInfo({
    tokenAddress: getBase58Address(token1Address),
  })

  if (isLoadingToken0 || isLoadingToken1) {
    return <SkeletonText fontSize="lg" />
  }

  return (
    <div className="flex items-center gap-1">
      {formatNumber(formatUnits(reserve0, token0Data?.decimals ?? 18, 4))}{' '}
      {token0Data?.symbol} /{' '}
      {formatNumber(formatUnits(reserve1, token1Data?.decimals ?? 18, 4))}{' '}
      {token1Data?.symbol}
    </div>
  )
}
