import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { FC } from 'react'
import { Typography } from '../../../typography'
import { IconButton } from '../IconButton'
import classNames from 'classnames'

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
    <div className="flex justify-between items-center px-2 h-14">
      <Typography variant="sm">
        Showing <b>{page * pageSize + 1}</b> to <b>{(page + 1) * pageSize}</b>{' '}
        {pages ? (
          <>
            of <b>{pages * pageSize}</b>
          </>
        ) : (
          ''
        )}
      </Typography>
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <IconButton
            icon={ChevronLeftIcon}
            iconProps={{ className: 'text-slate-200', width: 20, height: 20 }}
            className={classNames(hasPrev ? '' : 'pointer-events-none opacity-40', 'p-1')}
            onClick={onPrev}
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
            iconProps={{ className: 'text-slate-200', width: 20, height: 20 }}
            icon={ChevronRightIcon}
            className={classNames(!hasNext || (!pages && nextDisabled) ? 'pointer-events-none opacity-40' : '', 'p-1')}
            onClick={onNext}
          />
        </div>
      </div>
    </div>
  )
}
