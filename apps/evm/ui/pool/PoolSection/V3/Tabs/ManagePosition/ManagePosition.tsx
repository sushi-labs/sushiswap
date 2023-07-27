import React, { FC } from 'react'
import { PoolsFiltersProvider } from 'ui/pool/PoolsFiltersProvider'
import { ConcentratedPositionsTable } from 'ui/pool/PoolsSection/Tables/PositionsTable/ConcentratedPositionsTable'

interface ManagePositionProps {
  address: string
}

export const ManagePosition: FC<ManagePositionProps> = ({ address }) => {
  return (
    <PoolsFiltersProvider>
      <ConcentratedPositionsTable variant="minimal" poolAddress={address} />
    </PoolsFiltersProvider>
  )
}
