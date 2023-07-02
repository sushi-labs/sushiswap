import { SUPPORTED_CHAIN_IDS } from 'config'
import React, { FC } from 'react'

import { ChainFilter, SearchFilter, SettingFilter } from '../../Filters'

export const TokenFilters: FC = () => {
  return (
    <div className="flex justify-between">
      <div className="flex space-x-4">
        <SearchFilter />
        <ChainFilter availableChainIds={SUPPORTED_CHAIN_IDS} />
      </div>
      <div>
        <SettingFilter />
      </div>
    </div>
  )
}
