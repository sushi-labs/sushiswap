'use client'

import { SkeletonBox, classNames } from '@sushiswap/ui'
import dynamic from 'next/dynamic'
import React, { type FC } from 'react'
import { SimpleSwapBanner } from '../../simple-swap-banner'

const SkeletonLimitPanel = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <SkeletonBox className="w-full h-[150px] rounded-xl" />
        <SkeletonBox className="w-full h-[136px] rounded-xl" />
        <SkeletonBox className="w-full h-[136px] rounded-xl" />
      </div>
      <SkeletonBox className="w-full mt-11 h-[52px] rounded-xl" />
      <SkeletonBox className="w-full h-[84px] rounded-xl" />

      <SkeletonBox className="w-full h-[48px] rounded-xl" />
      <SkeletonBox className="w-full h-[54px] rounded-xl" />
    </div>
  )
}

const SkeletonDCAPanel = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <SkeletonBox className="w-full h-[136px] rounded-xl" />
        <SkeletonBox className="w-full h-[136px] rounded-xl" />
      </div>
      <SkeletonBox className="w-full h-[84px] rounded-xl" />
      <SkeletonBox className="w-full h-[114px] rounded-xl" />
      <SkeletonBox className="w-full h-[52px] rounded-xl" />

      <SkeletonBox className="w-full h-[48px] rounded-xl" />
      <SkeletonBox className="w-full h-[54px] rounded-xl" />
    </div>
  )
}

const LimitContainerPanel = dynamic(
  () => import('../../../twap/limit-widget').then((it) => it.LimitWidget),
  { ssr: false, loading: () => <SkeletonLimitPanel /> },
)
const TWAPContainerPanel = dynamic(
  () => import('../../../twap/dca-widget').then((it) => it.DCAWidget),
  {
    ssr: false,
    loading: () => <SkeletonDCAPanel />,
  },
)

export const LimitWidget: FC<{ animated: boolean }> = ({ animated }) => {
  return (
    <div
      className={classNames('flex flex-col gap-4', {
        'animate-slide-secondary': animated,
      })}
    >
      <LimitContainerPanel />
      <SimpleSwapBanner className="xl:hidden" />
    </div>
  )
}

export const DCAWidget: FC<{ animated: boolean }> = ({ animated }) => {
  return (
    <div
      className={classNames('flex flex-col gap-4', {
        'animate-slide-secondary': animated,
      })}
    >
      <TWAPContainerPanel />
      <SimpleSwapBanner className="xl:hidden" />
    </div>
  )
}
