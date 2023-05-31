import { Stats } from '../components/Stats/Stats'
import React from 'react'

import { BuildFuture } from '../components/BuildFuture/BuildFuture'
import { BuildWealth } from '../components/BuildWealth/BuildWealth'
import { Ecosystem } from '../components/Ecosystem/Ecosystem'
import { Hero } from '../components/Hero/Hero'
import { NeedHelp } from '../components/NeedHelp/NeedHelp'
import { Partners } from '../components/Partners/Partners'
import { Story } from '../components/Story/Story'
import { Header } from '../components'
import { MotionConfig } from 'framer-motion'
import { App, ThemeProvider } from '@sushiswap/ui'
import { useIsSmScreen } from '@sushiswap/hooks'

const Index = () => {
  const isSmallScreen = useIsSmScreen()

  return (
    <>
      <ThemeProvider forcedTheme="dark">
        <Header />
        <MotionConfig reducedMotion={isSmallScreen ? 'always' : 'user'}>
          <article className="my-20 w-full">
            <Hero />
            <Stats />

            <div className="bg-black overflow-x-hidden">
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
