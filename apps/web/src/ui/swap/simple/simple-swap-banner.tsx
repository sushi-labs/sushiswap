import { StrapiBanner } from '../strapi-banner/strapi-banner'
import { SimpleSwapBridgeBanner } from './simple-swap-bridge-banner'
import { FC } from 'react';
import { classNames } from '@sushiswap/ui';

export const SimpleSwapBanner: FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={classNames('flex flex-col gap-4 xl:fixed xl:right-8 xl:bottom-8 z-[1] relative', className)}>
      <StrapiBanner className="h-24 min-w-[360px]" />
      <SimpleSwapBridgeBanner className="h-24 min-w-[360px]" />
    </div>
  )
}
