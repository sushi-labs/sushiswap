import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { FC } from 'react'

import { IconButton } from '../iconbutton'

export interface PaginatorProps {
  hasPrev: boolean
  hasNext: boolean
  page: number
  onPrev(): void
  onNext(): void
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
  pages,
  nextDisabled,
  pageSize,
}) => {
  return (
    <div className="flex items-center justify-between px-2 h-14">
      <p className="text-sm">
        Showing <b>{page * pageSize + 1}</b> to <b>{(page + 1) * pageSize}</b>{' '}
        {pages ? (
          <>
            of <b>{pages * pageSize}</b>
          </>
        ) : (
          ''
        )}
      </p>
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <IconButton
            icon={ChevronLeftIcon}
            className={classNames(hasPrev ? '' : 'pointer-events-none opacity-40', 'p-1')}
            onClick={onPrev}
            name="Previous"
          />
        </div>
        {pages ? (
          <div className="text-base text-slate-200">
            <b>{page + 1}</b> of <b>{pages}</b>
          </div>
        ) : (
          ''
        )}
        <div className="flex items-center">
          <IconButton
            icon={ChevronRightIcon}
            className={classNames(!hasNext || (!pages && nextDisabled) ? 'pointer-events-none opacity-40' : '', 'p-1')}
            onClick={onNext}
            name="Next"
          />
        </div>
      </div>
    </div>
  )
}
