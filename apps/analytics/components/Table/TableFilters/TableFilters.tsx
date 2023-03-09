import { FC } from 'react'

import { TableFiltersSearchToken } from './TableFiltersSearchToken'

export const TableFilters: FC = () => {
  return (
    <>
      <div className="flex justify-between gap-3">
        <TableFiltersSearchToken />
      </div>
    </>
  )
}
