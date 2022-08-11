import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import { FC } from 'react'

import { IconButton } from '../iconbutton'
import { classNames } from '../index'
import { Typography } from '../typography'

export interface PaginatorProps {
  hasPrev: boolean
  hasNext: boolean
  page: number
  onPage(page: number): void
  pages: number
  pageSize: number
  count: number
}

export const Paginator: FC<PaginatorProps> = ({ hasPrev, hasNext, page, onPage, pages, pageSize, count }) => {
  return (
    <div className="flex justify-between items-center px-2 h-14">
      <Typography variant="sm">
        Showing <b>{(page - 1) * pageSize + 1}</b> to <b>{(page - 1) * pageSize + 10}</b> of <b>{count}</b>
      </Typography>
      <div className="flex items-center gap-5">
        <div className="flex items-center">
          <IconButton
            className={classNames(hasPrev ? '' : 'pointer-events-none opacity-40', 'p-1.5')}
            onClick={() => onPage(page - 1)}
          >
            <ChevronLeftIcon className="text-slate-200" width={20} height={20} />
          </IconButton>
        </div>
        <div className="text-base text-slate-200">
          <b>{page}</b> of <b>{pages}</b>
        </div>
        <div className="flex items-center">
          <IconButton
            className={classNames(hasNext ? '' : 'pointer-events-none opacity-40', 'p-1.5')}
            onClick={() => onPage(page + 1)}
          >
            <ChevronRightIcon className="text-slate-200" width={20} height={20} />
          </IconButton>
        </div>
      </div>
    </div>
  )
}
