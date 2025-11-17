import type { IPositionRowData } from './PositionsTable'

/**
 * Format fee from basis points to percentage
 * e.g., 500 -> 0.05%, 3000 -> 0.3%, 10000 -> 1%
 */
function formatFee(fee: number): string {
  const percentage = fee / 10000
  return `${percentage}%`
}

export const PositionFeeCell = ({ data }: { data: IPositionRowData }) => {
  const { fee } = data

  return (
    <div className="flex items-center">
      <span className="text-sm font-medium text-gray-900 dark:text-slate-50">
        {formatFee(fee)}
      </span>
    </div>
  )
}
