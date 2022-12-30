'use client'

import { useCarbonOffset, useSetCarbonOffset } from '@sushiswap/react-query'
import { CarbonIcon } from '@sushiswap/ui13/components/icons'
import { List } from '@sushiswap/ui13/components/list/List'
import Switch from '@sushiswap/ui13/components/Switch'
import React, { FC } from 'react'

export const CarbonOffset: FC = () => {
  const { data: carbonOffset } = useCarbonOffset()
  const { mutate: updateCarbonOffset } = useSetCarbonOffset()

  return (
    <List.Item
      className="!bg-transparent cursor-default"
      as="div"
      icon={CarbonIcon}
      iconProps={{ width: 20, height: 20 }}
      title="Carbon offset (Polygon)"
      subtitle={
        <>
          Make transactions climate positive by offsetting them with{' '}
          <a
            className="text-blue font-medium"
            target="_blank"
            href="https://www.klimadao.finance/blog/klimadao-sushi-fully-automated-carbon-offsetting-green-fee"
            rel="noreferrer"
          >
            Klima Infinity
          </a>
          . The average cost to offset a transaction on Polygon is less than $0.01.
        </>
      }
      value={
        <div className="flex items-center flex-col">
          <Switch checked={carbonOffset ?? false} onChange={(checked) => updateCarbonOffset({ value: checked })} />
        </div>
      }
    />
  )
}
