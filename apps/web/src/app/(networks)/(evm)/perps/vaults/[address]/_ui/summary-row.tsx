import { classNames } from '@sushiswap/ui'
import { useMemo } from 'react'
import {
  currencyFormatter,
  formatPerpsPercent,
  getTextColorClass,
  useUserVaultEquities,
} from 'src/lib/perps'
import { useVaultDetails } from 'src/lib/perps/info/use-vault-details'
import { useAccount } from 'src/lib/wallet'
import type { EvmAddress } from 'sushi/evm'
import { SummaryCard } from '~evm/perps/_ui/_common'

export const SummaryRow = ({ vaultAddress }: { vaultAddress: EvmAddress }) => {
  const { data, isLoading: isLoadingVaultDetails } = useVaultDetails({
    vaultAddress,
  })
  const address = useAccount('evm')
  const { data: userVaultEquities, isLoading: isLoadingUserVaultEquities } =
    useUserVaultEquities({ address })
  const isLoading = isLoadingVaultDetails || isLoadingUserVaultEquities
  const depositAmount = useMemo(() => {
    return (
      userVaultEquities?.find(
        (equity) =>
          equity.vaultAddress.toLowerCase() === vaultAddress.toLowerCase(),
      )?.equity || '0'
    )
  }, [userVaultEquities, vaultAddress])
  const tvl = useMemo(() => {
    return (
      data?.portfolio?.[7]?.[1]?.accountValueHistory?.[
        data?.portfolio?.[7]?.[1]?.accountValueHistory?.length - 1
      ]?.[1] || '0'
    )
  }, [data])

  const earned = useMemo(() => {
    if (!data) return 0
    return Number(data?.followerState?.allTimePnl || 0)
  }, [data])

  return (
    <div className="grid items-center gap-1 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        label="TVL"
        value={currencyFormatter
          .format(Number(tvl))
          .replaceAll(/\.[0-9]+/g, '')}
        isLoading={isLoading}
        fullWidth
      />
      <SummaryCard
        label="Past Month Return"
        value={
          <div
            className={classNames(
              'flex items-end gap-1',
              getTextColorClass(data?.apr || 0),
            )}
          >
            <div>{formatPerpsPercent(data?.apr || 0, 0)}</div>
            <div className="text-sm mb-0.5">APR</div>
          </div>
        }
        isLoading={isLoading}
        fullWidth
      />
      <SummaryCard
        label="Your Deposits"
        value={
          Number(depositAmount) > 0 && address
            ? currencyFormatter.format(Number(depositAmount))
            : '-'
        }
        isLoading={isLoading}
        fullWidth
      />
      <SummaryCard
        label="All-time Earned"
        value={
          <div className={classNames(getTextColorClass(earned))}>
            {currencyFormatter.format(earned)}
          </div>
        }
        isLoading={isLoading}
        fullWidth
      />
    </div>
  )
}
