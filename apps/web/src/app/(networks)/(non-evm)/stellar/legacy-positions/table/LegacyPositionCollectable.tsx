import type { IPositionRowData } from '~stellar/_common/ui/Pools/PositionsTable/PositionsTable'

export const LegacyPositionCollectableCell = ({
  data,
}: { data: IPositionRowData }) => {
  const { token0, token1, feesToken0, feesToken1 } = data

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center whitespace-nowrap text-sm text-gray-900 dark:text-slate-50">{`${feesToken0.toString()} ${token0.symbol}`}</div>
      <div className="flex items-center whitespace-nowrap text-sm text-gray-900 dark:text-slate-50">{`${feesToken1.toString()} ${token1.symbol}`}</div>
    </div>
  )
}
