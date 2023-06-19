'use client'

import { LightBulbIcon } from '@heroicons/react/24/outline'
import React, { FC } from 'react'
import { useLocalStorage } from '@sushiswap/hooks'
import Switch from '../Switch'
import { List } from '../list/List'

export const ExpertMode: FC = () => {
  const [expertMode, setExpertMode] = useLocalStorage('expertMode', false)

  return (
    <List.Item
      className="!bg-transparent cursor-default"
      as="div"
      icon={LightBulbIcon}
      iconProps={{ width: 20, height: 20, className: '!text-red' }}
      title="Expert mode"
      subtitle="Enabling Expert Mode will allow for high slippage trades. Only use if you are an advanced user and know what you are doing. Use at your own risk."
      value={
        <div className="flex items-center flex-col">
          <Switch className={(checked) => (checked ? 'bg-red' : '')} checked={expertMode} onChange={setExpertMode} />
        </div>
      }
    />
  )
}
