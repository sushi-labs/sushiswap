'use client'

import { useCarbonOffset } from '@sushiswap/react-query/src/hooks/settings/useCarbonOffset'
import { useSetCarbonOffset } from '@sushiswap/react-query/src/hooks/settings/useSetCarbonOffset'
import { CarbonIcon } from '@sushiswap/ui13/components/icons'
import { List } from '@sushiswap/ui13/components/list/List'
import Switch from '@sushiswap/ui13/components/Switch'
import React, { FC } from 'react'

interface CarbonOffsetProps {
  account?: string
}

export const CarbonOffset: FC<CarbonOffsetProps> = ({ account }) => {
  const { data: carbonOffset } = useCarbonOffset({ account })
  const { mutate: updateCarbonOffset } = useSetCarbonOffset({ account })

  return (
    <List.Item
      className="!bg-transparent cursor-default"
      as="div"
      icon={CarbonIcon}
      iconProps={{ width: 20, height: 20 }}
      title="Carbon Offset"
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
