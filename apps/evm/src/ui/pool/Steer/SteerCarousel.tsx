'use client'

import { Pool } from '@sushiswap/client'
import { Carousel, SkeletonBox } from '@sushiswap/ui'
import { FC, useCallback, useMemo } from 'react'

import { SteerPoolCard } from './SteerPoolCard'

interface SteerCarousel {
  pool?: Pool
  isLoading?: boolean
}

export const SteerCarousel: FC<SteerCarousel> = ({
  pool,
  isLoading = false,
}) => {
  if (isLoading || !pool) {
    return <_SteerCarouselLoading />
  }

  return <_SteerCarousel pool={pool} />
}

interface _SteerCarousel {
  pool: Pool
}

const _SteerCarousel: FC<_SteerCarousel> = ({ pool }) => {
  const enabledVaults = useMemo(
    () => pool.steerVaults.filter((vault) => vault.isEnabled),
    [pool],
  )

  const render = useCallback(
    (vault: Pool['steerVaults'][0]) => {
      return (
        <div className="w-[400px]">
          <SteerPoolCard key={vault.id} pool={pool} vault={vault} />
        </div>
      )
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

const _SteerCarouselLoading: FC = () => {
  const slides = useMemo(() => [1, 2, 3], [])
  const render = useCallback(() => {
    return (
      <div className="w-[400px]">
        <SkeletonBox className="h-[651px] w-[400px]" />
      </div>
    )
  }, [])

  return (
    <div className="pl-4">
      <Carousel
        containerWidth={1090}
        slides={slides}
        render={render}
        className="px-2 mt-0 pt-0"
      />
    </div>
  )
}
