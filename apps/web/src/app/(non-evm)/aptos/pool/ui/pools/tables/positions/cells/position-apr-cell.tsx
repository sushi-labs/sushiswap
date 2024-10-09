import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { FC, useMemo } from 'react'
import { formatPercent } from 'sushi/format'
import { formatNumberWithDecimals } from '~aptos/(common)/lib/common/format-number-with-decimals'
import { useNetwork } from '~aptos/(common)/lib/common/use-network'
import { useTokenBalance } from '~aptos/(common)/lib/common/use-token-balances'
import { PoolExtendedWithAprVolume } from '~aptos/pool/lib/use-user-position-pools'
import { Row } from '../../types'

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
  const { data: liquidityBalance } = useTokenBalance({
    account: account?.address as string,
    currency: `${swapContract}::swap::LPToken<${tokenAddress}>`,
    enabled: Boolean(swapContract && account?.address && tokenAddress),
    refetchInterval: 20000,
  })
  const liquidityBalanceFormatted = Number(
    formatNumberWithDecimals(liquidityBalance, 8),
  )

  const apr = useMemo(() => {
    const totalDailyFees = 0.0025 * Number(dailyVolumeUsd ?? 0)
    const annualizedFees = totalDailyFees * 365
    const userAnnualEarnings = annualizedFees * liquidityBalanceFormatted
    const apr = userAnnualEarnings / totalPoolLiquidity
    return apr
  }, [dailyVolumeUsd, liquidityBalanceFormatted, totalPoolLiquidity])

  return (
    <div className="flex items-center gap-1">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
          {formatPercent(apr ?? '0')}
        </div>
      </div>
    </div>
  )
}