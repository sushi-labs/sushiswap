import { ChainFilter, SearchFilter, SettingFilter } from 'components/Filters'
import { SUPPORTED_CHAIN_IDS } from 'config'
import React, { FC } from 'react'

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
