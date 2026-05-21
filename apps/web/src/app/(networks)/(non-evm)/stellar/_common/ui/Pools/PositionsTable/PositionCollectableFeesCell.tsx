import type { IPositionRowData } from './PositionsTable'

export const PositionCollectableFeesCell = ({
  data,
}: { data: IPositionRowData }) => {
  const { feesToken0, feesToken1, token0, token1 } = data

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center whitespace-nowrap text-sm text-gray-900 dark:text-slate-50">{`${feesToken0.toString()} ${token0.symbol}`}</div>
      <div className="flex items-center whitespace-nowrap text-sm text-gray-900 dark:text-slate-50">{`${feesToken1.toString()} ${token1.symbol}`}</div>
    </div>
  )
}
