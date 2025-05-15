'use client'

import { SimpleSwapBanner } from 'src/ui/swap/simple/simple-swap-banner';
import dynamic from 'next/dynamic';
import { SkeletonBox, classNames } from '@sushiswap/ui';
import React, { FC } from 'react';

const SkeletonLimitPanel = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <SkeletonBox className="w-full h-[150px] rounded-xl"/>
        <SkeletonBox className="w-full h-[136px] rounded-xl"/>
        <SkeletonBox className="w-full h-[136px] rounded-xl"/>
      </div>
      <SkeletonBox className="w-full mt-11 h-[52px] rounded-xl"/>
      <SkeletonBox className="w-full h-[84px] rounded-xl"/>

      <SkeletonBox className="w-full h-[48px] rounded-xl"/>
      <SkeletonBox className="w-full h-[54px] rounded-xl"/>
    </div>
  )
}

const SkeletonDCAPanel = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <SkeletonBox className="w-full h-[136px] rounded-xl"/>
        <SkeletonBox className="w-full h-[136px] rounded-xl"/>
      </div>
      <SkeletonBox className="w-full h-[84px] rounded-xl"/>
      <SkeletonBox className="w-full h-[114px] rounded-xl"/>
      <SkeletonBox className="w-full h-[52px] rounded-xl"/>

      <SkeletonBox className="w-full h-[48px] rounded-xl"/>
      <SkeletonBox className="w-full h-[54px] rounded-xl"/>
    </div>
  )
}

const LimitContainerPanel = dynamic(
  () => import('src/ui/swap/twap/twap').then((it) => it.LimitContainerPanel),
  {ssr: false, loading: () => <SkeletonLimitPanel/> },
)
const TWAPContainerPanel = dynamic(
  () => import('src/ui/swap/twap/twap').then((it) => it.TWAPContainerPanel),
  {ssr: false, loading: () => <SkeletonDCAPanel/> },
)

export const LimitWidget: FC<{ animated: boolean }> = ({ animated }) => {
  return (
    <div className={classNames("flex flex-col gap-4", { "animate-slide-secondary": animated })}>
      <LimitContainerPanel/>
      <SimpleSwapBanner className="xl:hidden" />
    </div>
  )
}

export const DCAWidget: FC<{ animated: boolean }> = ({ animated }) => {
  return (
    <div className={classNames("flex flex-col gap-4", { "animate-slide-secondary": animated })}>
      <TWAPContainerPanel/>
      <SimpleSwapBanner className="xl:hidden" />
    </div>
  )
}
