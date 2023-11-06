import React, { FC } from 'react'
import { PoolsFiltersProvider } from 'src/ui/pool/PoolsFiltersProvider'

import { ConcentratedPositionsTable } from './ConcentratedPositionsTable'

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
