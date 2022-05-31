import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React, { FC, useMemo } from 'react'

import { generateSummaryString } from './table-utils'

interface PageTogglerProps {
  pageIndex: number
  pageSize: number
  totalItems: number
  gotoPage: (arg0: number) => any
  canPreviousPage: boolean
  canNextPage: boolean
  loading: boolean
}

export const TablePageToggler: FC<PageTogglerProps> = ({
  pageIndex,
  pageSize,
  totalItems,
  gotoPage,
  canNextPage,
  canPreviousPage,
  loading,
}) => {
  const { i18n } = useLingui()

  const summaryString = useMemo(
    () => generateSummaryString(pageIndex, pageSize, totalItems, i18n._(t`None`), loading, i18n._(t`Loading...`)),
    [pageIndex, pageSize, totalItems, i18n, loading]
  )

  return (
    <>
      {/* Desktop */}
      <div className="text-right -mt-2 py-3 select-none hidden lg:block">
        {summaryString}{' '}
        <ChevronLeftIcon
          onClick={() => gotoPage(pageIndex - 1)}
          width={24}
          height={24}
          className={`inline-block -mt-1 ${canPreviousPage ? 'text-high-emphesis cursor-pointer' : 'text-gray-500'}`}
        />
        <ChevronRightIcon
          onClick={() => gotoPage(pageIndex + 1)}
          width={24}
          height={24}
          className={`inline-block -mt-1 ${canNextPage ? 'text-high-emphesis cursor-pointer' : 'text-gray-500'}`}
        />
      </div>

      {/* Mobile */}
      <div className="select-none mb-16 lg:hidden">
        <div className="rounded-t overflow-hidden border border-dark-700 bg-dark-800 flex justify-between p-3">
          <span>{i18n._(t`Showing Results`)}</span>
          <span className="text-high-emphesis"> {summaryString}</span>{' '}
        </div>
        <div className="border-b rounded-b border-l border-r border-dark-700 bg-dark-900 overflow-hidden flex justify-between">
          <div
            onClick={() => gotoPage(pageIndex - 1)}
            className={`flex-grow border-r p-3 border-dark-700 ${
              canPreviousPage ? 'text-high-emphesis cursor-pointer' : 'text-gray-500'
            }`}
          >
            {i18n._(t`Previous`)}
          </div>
          <div
            onClick={() => gotoPage(pageIndex + 1)}
            className={`flex-grow p-3 text-right ${
              canNextPage ? 'text-high-emphesis cursor-pointer' : 'text-gray-500'
            }`}
          >
            {i18n._(t`Next`)}
          </div>
        </div>
      </div>
    </>
  )
}
