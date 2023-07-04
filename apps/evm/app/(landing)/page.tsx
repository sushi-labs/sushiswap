'use client'

import { useIsSmScreen } from '@sushiswap/hooks'
import { MotionConfig } from 'framer-motion'
import React from 'react'

import { BuildFuture, BuildWealth, Ecosystem, Hero, NeedHelp, Partners, Stats, Story } from './components'

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
