import { classNames } from '@sushiswap/ui'
import type { FC } from 'react'
import { SimpleSwapBridgeBanner } from './simple-swap-bridge-banner'
import { StrapiBanner } from './strapi-banner/strapi-banner'

export const SimpleSwapBanner: FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={classNames(
        'flex flex-col gap-4 xl:fixed xl:right-8 xl:bottom-12',
        className ?? '',
      )}
    >
      <StrapiBanner className="h-24 min-w-[360px]" />
      <SimpleSwapBridgeBanner className="h-24 min-w-[360px]" />
    </div>
  )
}
