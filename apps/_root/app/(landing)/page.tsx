'use client'

import { MotionConfig } from 'framer-motion'
import React from 'react'

import { useIsSmScreen } from '@sushiswap/hooks'

import { BuildFuture, BuildWealth, Ecosystem, Hero, NeedHelp, Story, Partners, Stats } from './components'

export default async function LandingPage() {
  const isSmallScreen = useIsSmScreen()
  return (
    <MotionConfig reducedMotion={isSmallScreen ? 'always' : 'user'}>
      <article className="w-full my-20">
        <Hero />
        <Stats />
        <div className="overflow-x-hidden bg-black">
          <Partners />
          <Story />
          <div className="flex flex-col gap-2 border-t border-neutral-200/10">
            <BuildWealth />
            <Ecosystem />
            <BuildFuture />
            <NeedHelp />
          </div>
        </div>
      </article>
    </MotionConfig>
  )
}
