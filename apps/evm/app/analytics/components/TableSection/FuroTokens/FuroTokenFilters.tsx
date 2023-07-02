import { SUPPORTED_CHAIN_IDS } from 'config'
import React, { FC } from 'react'

import { ChainFilter, SearchFilter } from '../../Filters'

export const FuroTokenFilters: FC = () => {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex gap-4">
        <SearchFilter />
        <ChainFilter availableChainIds={SUPPORTED_CHAIN_IDS} />
      </div>
    </div>
  )
}
