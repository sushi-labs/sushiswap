import { formatUnits } from 'viem'
import type { IPositionRowData } from '~stellar/_common/ui/Pools/PositionsTable/PositionsTable'

export const LegacyPositionPrincipalCell = ({
  data,
}: { data: IPositionRowData }) => {
  const { token0, token1, principalToken0, principalToken1 } = data

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center whitespace-nowrap text-sm text-gray-900 dark:text-slate-50">{`${formatUnits(principalToken0, token0.decimals)} ${token0.code}`}</div>
      <div className="flex items-center whitespace-nowrap text-sm text-gray-900 dark:text-slate-50">{`${formatUnits(principalToken1, token1.decimals)} ${token1.code}`}</div>
    </div>
  )
}
