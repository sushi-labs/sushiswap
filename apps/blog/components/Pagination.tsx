import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import { classNames } from '@sushiswap/ui'
import type { FC } from 'react'

interface Pagination {
  page: number
  onPage: (page: number) => void
  pages: number
}

export const Pagination: FC<Pagination> = ({ page, onPage, pages }) => {
  return (
    <div className="flex items-center gap-10">
      <div
        className={classNames(
          page > 1 ? '' : 'pointer-events-none opacity-40',
          'cursor-pointer p-1 bg-blue hover:bg-blue-600 rounded-full cursor-pointer',
        )}
      >
        <ChevronLeftIcon
          className="text-slate-200"
          height={28}
          onClick={() => { onPage(page - 1); }}
          width={28}
        />
      </div>
      <div className="text-base text-slate-200">
        {page} of {pages}
      </div>
      <div
        className={classNames(
          page < pages ? '' : 'pointer-events-none opacity-40',
          'cursor-pointer p-1 bg-blue hover:bg-blue-600 rounded-full cursor-pointer',
        )}
      >
        <ChevronRightIcon
          className="text-slate-200"
          height={28}
          onClick={() => { onPage(page + 1); }}
          width={28}
        />
      </div>
    </div>
  )
}
