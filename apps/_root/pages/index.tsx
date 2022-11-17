import { Stats } from 'components/Stats/Stats'
import dynamic from 'next/dynamic'
import React from 'react'

import { Hero } from '../components/Hero/Hero'
import { InViewportComponent } from '../components/InViewportComponent/InViewportComponent'
import { Partners } from '../components/Partners/Partners'

const Story = dynamic(() => import('../components/Story/Story').then((res) => res.Story))
const LoadBuildWealth = dynamic(() => import('../components/BuildWealth/BuildWealth').then((res) => res.BuildWealth))
const Ecosystem = dynamic(() => import('../components/Ecosystem/Ecosystem').then((res) => res.Ecosystem))
const BuildFuture = dynamic(() => import('../components/BuildFuture/BuildFuture').then((res) => res.BuildFuture))
const NeedHelp = dynamic(() => import('../components/NeedHelp/NeedHelp').then((res) => res.NeedHelp))

const Index = () => {
  return (
    <article className="my-20 w-full">
      <Hero />
      <Stats />

      <div className="bg-black overflow-x-hidden">
        <Partners />
        <InViewportComponent>
          <Story />
        </InViewportComponent>
        <div className="flex flex-col gap-2 border-t border-neutral-200/10">
          <InViewportComponent>
            <LoadBuildWealth />
          </InViewportComponent>
          <InViewportComponent>
            <Ecosystem />
          </InViewportComponent>
          <InViewportComponent>
            <BuildFuture />
          </InViewportComponent>
          <InViewportComponent>
            <NeedHelp />
          </InViewportComponent>
        </div>
      </div>
    </article>
  )
}

export default Index
