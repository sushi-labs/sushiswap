import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import { FC } from 'react'

import { IconButton } from '../iconbutton'
import { classNames } from '../index'
import { Typography } from '../typography'

export interface PaginatorProps {
  hasPrev: boolean
  hasNext: boolean
  page: number
  onPrev(): void
  onNext(): void
  onPage(page: number): void
  pages: number
  pageSize: number
}

export const Paginator: FC<PaginatorProps> = ({ onPrev, onNext, hasPrev, hasNext, page, onPage, pages, pageSize }) => {
  return (
    <div className="flex justify-between items-center px-2 h-14">
      <Typography variant="sm">
        Showing <b>{page * pageSize + 1}</b> to <b>{(page + 1) * pageSize}</b> of <b>{pages * pageSize}</b>
      </Typography>
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <IconButton
            className={classNames(hasPrev ? '' : 'pointer-events-none opacity-40 hidden', 'p-1')}
            onClick={onPrev}
          >
            <ChevronLeftIcon className="text-slate-200" width={20} height={20} />
          </IconButton>
        </div>
        <div className="text-base text-slate-200">
          <b>{page + 1}</b> of <b>{pages}</b>
        </div>
        <div className="flex items-center">
          <IconButton
            className={classNames(hasNext ? '' : 'pointer-events-none opacity-40 hidden', 'p-1')}
            onClick={onNext}
          >
            <ChevronRightIcon className="text-slate-200" width={20} height={20} />
          </IconButton>
        </div>
      </div>
    </div>
  )
}
