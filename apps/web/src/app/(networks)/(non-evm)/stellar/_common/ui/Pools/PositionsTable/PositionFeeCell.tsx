import { formatFee } from '~stellar/_common/lib/utils/format'
import type { IPositionRowData } from './PositionsTable'

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
