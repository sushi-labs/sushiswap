import { Stats } from '../components/Stats/Stats'
import React from 'react'

import { BuildFuture } from '../components/BuildFuture/BuildFuture'
import { BuildWealth } from '../components/BuildWealth/BuildWealth'
import { Ecosystem } from '../components/Ecosystem/Ecosystem'
import { Hero } from '../components/Hero/Hero'
import { NeedHelp } from '../components/NeedHelp/NeedHelp'
import { Partners } from '../components/Partners/Partners'
import { Story } from '../components/Story/Story'

const Index = () => {
  return (
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
  )
}

export default Index
