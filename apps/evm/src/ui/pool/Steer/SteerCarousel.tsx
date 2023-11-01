'use client'

import { Pool } from '@sushiswap/client'
import { Carousel } from '@sushiswap/ui'
import { FC, useCallback, useMemo } from 'react'

import { SteerPoolCard } from './SteerPoolCard'

export const SteerCarousel: FC<{ pool: Pool }> = ({ pool }) => {
  const enabledVaults = useMemo(
    () => pool.steerVaults.filter((vault) => vault.isEnabled),
    [pool.steerVaults],
  )
  const render = useCallback(
    (vault: Pool['steerVaults'][0]) => {
      return <SteerPoolCard key={vault.id} pool={pool} vault={vault} />
    },
    [pool],
  )

  return (
    <div className="pl-4">
      {enabledVaults?.length > 0 ? (
        <Carousel
          containerWidth={1090}
          slides={enabledVaults}
          render={render}
          className="px-2 mt-0 pt-0"
        />
      ) : (
        <>No smart pools found.</>
      )}
    </div>
  )
}
