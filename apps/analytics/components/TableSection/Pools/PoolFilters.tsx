import { ChainFilter, SearchFilter, SettingFilter } from 'components/Filters'
import { SUPPORTED_CHAIN_IDS } from 'config'
import React, { FC } from 'react'

export const PoolFilters: FC = () => {
  return (
    <div className="flex justify-between">
      <div className="flex space-x-4">
        <SearchFilter />
        <ChainFilter availableChainIds={SUPPORTED_CHAIN_IDS} />
      </div>
      <div>{process.env.NODE_ENV === 'development' && <SettingFilter />}</div>
    </div>
  )
}
