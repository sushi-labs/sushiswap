'use client'

import { useLocalStorage } from '@sushiswap/hooks'
import React, { type FC } from 'react'
import { ChainId } from 'sushi/chain'

import { NetworkIcon } from '../../icons/NetworkIcon'
import { Label } from '../label'
import { Switch } from '../switch'
import { typographyVariants } from '../typography'

export const CarbonOffset: FC = () => {
  const [carbonOffset, setCarbonOffset] = useLocalStorage('carbonOffset', false)

  return (
    <div className="p-4 rounded-lg">
      <div className="flex justify-between items-center gap-4">
        <div className="flex flex-col gap-2">
          <Label>Carbon Offset</Label>
          <span
            className={typographyVariants({
              variant: 'muted',
              className: 'text-sm',
            })}
          >
            Make transactions climate positive by offsetting them with Klima
            Infinity. The average cost to offset a transaction on Polygon is
            less than $0.01.
          </span>
        </div>
        <Switch
          checked={carbonOffset}
          onCheckedChange={(checked) => setCarbonOffset(checked)}
        />
      </div>
      <span className="mt-3 text-xs text-gray-500 dark:text-slate-400 items-center flex font-medium gap-0.5">
        Only available on{' '}
        <NetworkIcon
          type="naked"
          chainId={ChainId.POLYGON}
          width={16}
          height={16}
        />{' '}
        Polygon
      </span>
    </div>
  )
}
