import { classNames } from '@sushiswap/ui'
import type { LaunchpadIndexingStatus } from '../types'

export function StatusPill({ status }: { status: LaunchpadIndexingStatus }) {
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold',
        status === 'CONFIRMED' &&
          'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
        status === 'PROVISIONAL' &&
          'bg-amber-500/10 text-amber-700 dark:text-amber-300',
        status === 'ORPHANED' && 'bg-red/10 text-red',
      )}
    >
      <span
        className={classNames(
          'h-1.5 w-1.5 rounded-full',
          status === 'CONFIRMED' && 'bg-emerald-500',
          status === 'PROVISIONAL' && 'bg-amber-500',
          status === 'ORPHANED' && 'bg-red',
        )}
      />
      {status === 'CONFIRMED'
        ? 'Live'
        : status === 'PROVISIONAL'
          ? 'Confirming'
          : 'Orphaned'}
    </span>
  )
}
