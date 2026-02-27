import { useLocalStorage } from '@sushiswap/hooks'
import { useMemo } from 'react'
import { formatUnits } from 'viem'
import type { PositionSummary } from '~stellar/_common/lib/hooks/position/use-my-position'
import type { IPositionRowData } from '~stellar/_common/ui/Pools/PositionsTable/PositionsTable'
import type { PendingMigration } from '../types'

export const LegacyPositionPrincipalCell = ({
  data,
}: { data: IPositionRowData }) => {
  const {
    tokenId,
    token0,
    token1,
    principalToken0,
    principalToken1,
    feesToken0,
    feesToken1,
  } = data
  const [pendingMigrations] = useLocalStorage<
    Record<PositionSummary['tokenId'], PendingMigration>
  >('stellar-pending-migrations', {})

  const pendingMigration = pendingMigrations[tokenId]

  const originalPrincipal0 = pendingMigration
    ? BigInt(pendingMigration.principal0)
    : principalToken0
  const originalPrincipal1 = pendingMigration
    ? BigInt(pendingMigration.principal1)
    : principalToken1

  const statusText = useMemo(() => {
    if (principalToken0 === 0n && principalToken1 === 0n) {
      if (feesToken0 === 0n && feesToken1 === 0n) {
        return 'Collected'
      } else {
        return 'Pending Collection'
      }
    }
    return null
  }, [principalToken0, principalToken1, feesToken0, feesToken1])

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center whitespace-nowrap text-sm text-gray-900 dark:text-slate-50">{`${formatUnits(originalPrincipal0, token0.decimals)} ${token0.code}`}</div>
      <div className="flex items-center whitespace-nowrap text-sm text-gray-900 dark:text-slate-50">{`${formatUnits(originalPrincipal1, token1.decimals)} ${token1.code}`}</div>
      {statusText && (
        <span className="text-xs flex items-center gap-1 text-gray-900 dark:text-slate-500">
          Status: {statusText}
        </span>
      )}
    </div>
  )
}
