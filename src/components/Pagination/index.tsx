import { ArrowNarrowLeftIcon, ArrowNarrowRightIcon, DotsHorizontalIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { classNames } from 'app/functions'
import { FC, ReactNode, useCallback } from 'react'

interface PaginationProps {
  currentPage: number
  onChange: (page: number) => void
  totalPages: number
  pageNeighbours: number
  canNextPage: boolean
  canPreviousPage: boolean
}

const LEFT_PAGE = 'LEFT'
const RIGHT_PAGE = 'RIGHT'

/**
 * Helper method for creating a range of numbers
 * range(1, 5) => [1, 2, 3, 4, 5]
 */
// @ts-ignore TYPE NEEDS FIXING
const range = (from, to, step = 1): (string | number)[] => {
  let i = from
  const range: (string | number)[] = []

  while (i <= to) {
    range.push(i)
    i += step
  }

  return range
}

const Pagination: FC<PaginationProps> = ({
  totalPages,
  onChange,
  currentPage,
  pageNeighbours,
  canNextPage,
  canPreviousPage,
}) => {
  const { i18n } = useLingui()

  const getPageNumbers = useCallback(() => {
    /**
     * totalNumbers: the total page numbers to show on the control
     * totalBlocks: totalNumbers + 2 to cover for the left(<) and right(>) controls
     */
    const totalNumbers = pageNeighbours * 2 + 3
    const totalBlocks = totalNumbers + 2

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - pageNeighbours)
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours)
      let pages = range(startPage, endPage)

      /**
       * hasLeftSpill: has hidden pages to the left
       * hasRightSpill: has hidden pages to the right
       * spillOffset: number of hidden pages either to the left or to the right
       */
      const hasLeftSpill = startPage > 2
      const hasRightSpill = totalPages - endPage > 1
      const spillOffset = totalNumbers - (pages.length + 1)

      switch (true) {
        // handle: (1) < {5 6} [7] {8 9} (10)
        case hasLeftSpill && !hasRightSpill: {
          const extraPages = range(startPage - spillOffset, startPage - 1)
          pages = [LEFT_PAGE, ...extraPages, ...pages]
          break
        }

        // handle: (1) {2 3} [4] {5 6} > (10)
        case !hasLeftSpill && hasRightSpill: {
          const extraPages = range(endPage + 1, endPage + spillOffset)
          pages = [...pages, ...extraPages, RIGHT_PAGE]
          break
        }

        // handle: (1) < {4 5} [6] {7 8} > (10)
        case hasLeftSpill && hasRightSpill:
        default: {
          pages = [LEFT_PAGE, ...pages, RIGHT_PAGE]
          break
        }
      }

      return [1, ...pages, totalPages]
    }

    return range(1, totalPages)
  }, [currentPage, pageNeighbours, totalPages])

  const pages = getPageNumbers().reduce<ReactNode[]>((acc, page, index) => {
    if (page === LEFT_PAGE)
      acc.push(
        <div className="flex justify-center items-center w-10 h-10" key={index}>
          <DotsHorizontalIcon width={12} className="text-low-emphesis w" />
        </div>
      )
    else if (page === RIGHT_PAGE)
      acc.push(
        <div className="flex justify-center items-center w-10 h-10" key={index}>
          <DotsHorizontalIcon width={12} className="text-low-emphesis" />
        </div>
      )
    else
      acc.push(
        <button
          key={index}
          onClick={() => onChange((page as number) - 1)}
          className={classNames(
            page === currentPage + 1
              ? 'text-transparent bg-gradient-to-r from-pink to-pink-red bg-clip-text border-pink'
              : 'text-secondary border-transparent',
            'border-t-2 w-10 h-10 cursor-pointer border-transparent px-4 inline-flex items-center text-sm font-bold hover:text-opacity-100 text-opacity-80'
          )}
        >
          {page}
        </button>
      )

    return acc
  }, [])

  return totalPages > 1 ? (
    <nav className="flex items-center justify-between sm:px-0">
      <div className="-mt-px w-0 flex-1 flex border-t-2 border-transparent">
        {canPreviousPage && (
          <button
            onClick={() => onChange(currentPage - 1)}
            className={classNames(
              'text-transparent bg-gradient-to-r from-pink to-pink-red bg-clip-text cursor-pointer inline-flex items-center text-sm font-bold'
            )}
          >
            <span className="text-pink">
              <ArrowNarrowLeftIcon className="mr-3 h-5 w-5" aria-hidden="true" />
            </span>
            {i18n._(t`Previous`)}
          </button>
        )}
      </div>
      <div className="md:-mt-px md:flex">{pages}</div>
      <div className="-mt-px w-0 flex-1 flex justify-end items-center border-t-2 border-transparent">
        {canNextPage && (
          <button
            onClick={() => onChange(currentPage + 1)}
            className={classNames(
              'text-transparent bg-gradient-to-r from-pink to-pink-red bg-clip-text cursor-pointer inline-flex items-center text-sm font-bold'
            )}
          >
            {i18n._(t`Next`)}
            <span className="text-pink-red">
              <ArrowNarrowRightIcon className="ml-3 h-5 w-5" aria-hidden="true" />
            </span>
          </button>
        )}
      </div>
    </nav>
  ) : (
    <></>
  )
}

export default Pagination
