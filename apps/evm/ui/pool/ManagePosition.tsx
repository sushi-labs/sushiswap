import React, { FC } from 'react'
import { PoolsFiltersProvider } from 'ui/pool/PoolsFiltersProvider'

import { ConcentratedPositionsTable } from './ConcentratedPositionsTable/ConcentratedPositionsTable'

interface ManagePositionProps {
  address: string
}

export const ManagePosition: FC<ManagePositionProps> = () => {
  return (
    <PoolsFiltersProvider>
      <ConcentratedPositionsTable />
    </PoolsFiltersProvider>
  )
}
