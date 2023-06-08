'use client'

import '../../variables.css'

import { MotionConfig } from 'framer-motion'
import React from 'react'

import { App, ThemeProvider } from '@sushiswap/ui'
import { useIsSmScreen } from '@sushiswap/hooks'

import { BuildFuture, BuildWealth, Header, Ecosystem, Hero, NeedHelp, Story, Partners, Stats } from './components'

const Index = () => {
  const isSmallScreen = useIsSmScreen()

  return (
    <>
      <ThemeProvider forcedTheme="dark">
        <Header />
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
        <App.Footer />
      </ThemeProvider>
      <style global jsx>{`
        html {
          background-color: black !important;
          /* color: white; */
        }

        button:focus {
          outline: none !important;
        }

        input:focus {
          box-shadow: none !important;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </>
  )
}

export default Index
