import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { SkeletonText } from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { formatPercent } from 'sushi'
import { formatNumberWithDecimals } from '~aptos/_common/lib/common/format-number-with-decimals'
import { useNetwork } from '~aptos/_common/lib/common/use-network'
import { useTokenBalance } from '~aptos/_common/lib/common/use-token-balances'
import type { PoolExtendedWithAprVolume } from '~aptos/pool/lib/use-user-position-pools'
import type { Row } from '../../types'

export const PoolMyPositionAprCell: FC<Row<PoolExtendedWithAprVolume>> = ({
  row,
}) => {
  const dailyVolumeUsd = row?.volumeUSD1d
  const tokenAddress = row?.id
  const totalPoolLiquidity = row?.reserveUSD

  const {
    contracts: { swap: swapContract },
  } = useNetwork()
  const { account } = useWallet()
  const { data: liquidityBalance, isLoading } = useTokenBalance({
    account: account?.address as string,
    currency: `${swapContract}::swap::LPToken<${tokenAddress}>`,
    enabled: Boolean(swapContract && account?.address && tokenAddress),
    refetchInterval: 20000,
  })
  const liquidityBalanceFormatted = Number(
    formatNumberWithDecimals(liquidityBalance ?? 0, 8),
  )

  const apr = useMemo(() => {
    const totalDailyFees = 0.0025 * Number(dailyVolumeUsd ?? 0)
    const annualizedFees = totalDailyFees * 365
    const userAnnualEarnings = annualizedFees * liquidityBalanceFormatted
    const apr = userAnnualEarnings / totalPoolLiquidity
    return apr
  }, [dailyVolumeUsd, liquidityBalanceFormatted, totalPoolLiquidity])

  const _apr = Number.isNaN(apr) ? 0 : apr

  if (isLoading) {
    return (
      <div className="flex items-center w-full gap-2">
        <div className="flex flex-col w-full">
          <SkeletonText fontSize="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
          {formatPercent(_apr ?? '0')}
        </div>
      </div>
    </div>
  )
}
