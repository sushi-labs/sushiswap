'use client'

import { LightBulbIcon } from '@heroicons/react/24/outline'
import { useExpertMode, useSetExpertMode } from '@sushiswap/react-query'
import { List } from '@sushiswap/ui13/components/list/List'
import Switch from '@sushiswap/ui13/components/Switch'
import React, { FC } from 'react'

export const ExpertMode: FC = () => {
  const { data: expertMode } = useExpertMode()
  const { mutate: updateExpertMode } = useSetExpertMode()

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
          <Switch
            className={(checked) => (checked ? 'bg-red' : '')}
            checked={expertMode ?? false}
            onChange={(checked) => updateExpertMode({ value: checked })}
          />
        </div>
      }
    />
  )
}
