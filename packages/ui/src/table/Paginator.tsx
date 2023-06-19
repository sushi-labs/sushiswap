import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { FC } from 'react'

import { classNames } from '../index'
import { IconButton } from '../future/components/IconButton'

export interface PaginatorProps {
  hasPrev: boolean
  hasNext: boolean
  page: number
  onPrev(): void
  onNext(): void
  onPage(page: number): void
  pages?: number
  pageSize: number
  nextDisabled?: boolean
}

export const Paginator: FC<PaginatorProps> = ({
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  page,
  onPage,
  pages,
  nextDisabled,
  pageSize,
}) => {
  return (
    <div className="flex justify-between items-center px-4 h-14 border-t border-gray-200 dark:!border-slate-200/5">
      <span className="text-sm text-gray-600 dark:text-slate-400">
        Showing <b>{page * pageSize + 1}</b> to <b>{(page + 1) * pageSize}</b>{' '}
        {pages ? (
          <>
            of <b>{pages * pageSize}</b>
          </>
        ) : (
          ''
        )}
      </span>
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <IconButton
            icon={ChevronLeftIcon}
            iconProps={{ width: 20, height: 20 }}
            className={classNames(hasPrev ? '' : 'pointer-events-none opacity-40', 'p-1')}
            onClick={onPrev}
          />
        </div>
        {pages ? (
          <span className="text-sm text-gray-600 dark:text-slate-400">
            <b>{page + 1}</b> of <b>{pages}</b>
          </span>
        ) : (
          ''
        )}
        <div className="flex items-center">
          <IconButton
            icon={ChevronRightIcon}
            iconProps={{ width: 20, height: 20 }}
            className={classNames(!hasNext || (!pages && nextDisabled) ? 'pointer-events-none opacity-40' : '', 'p-1')}
            onClick={onNext}
          />
        </div>
      </div>
    </div>
  )
}
