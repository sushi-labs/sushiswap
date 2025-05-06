'use client'

import { LightBulbIcon } from '@heroicons/react/24/outline'
import { useLocalStorage } from '@sushiswap/hooks'
import React, { type FC } from 'react'

import { List } from '../list/List'
import { Switch } from '../switch'

export const ExpertMode: FC = () => {
  const [expertMode, setExpertMode] = useLocalStorage('expertMode', false)

  return (
    <List.Item
      className="!bg-transparent cursor-default"
      as="div"
      icon={LightBulbIcon}
      iconProps={{ className: '!text-red' }}
      title="Expert mode"
      subtitle="Enabling Expert Mode will allow for high slippage trades. Only use if you are an advanced user and know what you are doing. Use at your own risk."
      value={
        <div className="flex items-center flex-col">
          <Switch checked={expertMode} onCheckedChange={setExpertMode} />
        </div>
      }
    />
  )
}
