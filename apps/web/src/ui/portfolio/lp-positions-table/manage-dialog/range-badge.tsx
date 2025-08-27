import type { PortfolioV3Position } from '@sushiswap/graph-client/data-api'
import { classNames } from '@sushiswap/ui'

export const RangeBadge = ({
  range,
}: { range: PortfolioV3Position['range'] }) => {
  return (
    <div
      className={classNames(
        range === 'OUT_OF_RANGE'
          ? 'bg-red-100/10'
          : range === 'IN_RANGE'
            ? 'bg-[#22C55E]/10'
            : 'bg-slate-500/10',
        'px-2 py-1 flex items-center gap-1 rounded-full',
      )}
    >
      <div
        className={classNames(
          range === 'OUT_OF_RANGE'
            ? 'bg-red-100'
            : range === 'IN_RANGE'
              ? 'bg-[#22C55E]'
              : 'bg-slate-500/50',
          'w-3 h-3 rounded-full',
        )}
      />
      <span
        className={classNames(
          range === 'OUT_OF_RANGE'
            ? 'text-red-100'
            : range === 'IN_RANGE'
              ? 'text-[#22C55E]'
              : 'text-muted-foreground',
          'text-xs font-medium',
        )}
      >
        {range === 'OUT_OF_RANGE'
          ? 'Out of Range'
          : range === 'IN_RANGE'
            ? 'In Range'
            : 'Unknown'}
      </span>
    </div>
  )
}
