'use client'

import { Tab } from '@headlessui/react'
import Container from '@sushiswap/ui/future/components/Container'
import React from 'react'

import { Hero } from './components'

export default function GovernanceDashboard() {
  return (
    <Tab.Group>
      <Hero />
      <Container maxWidth="6xl" className="pt-14 mx-auto px-4">
        <Tab.Panels>
          <Tab.Panel>
            <section className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-2xl">Latest @ Sushi</h2>
                <div className="flex gap-2">
                  <button className="rounded-full h-10 px-4 bg-slate-700/40 border border-slate-700/40">
                    Last Month
                  </button>
                  <button className="rounded-full h-10 px-4 border border-slate-700/40">Last Month</button>
                  <button className="rounded-full h-10 px-4 border border-slate-700/40">Last Month</button>
                </div>
              </div>
              <div className="flex gap-6">
                <div>bookmarks</div>
                <div>cards</div>
              </div>
            </section>
          </Tab.Panel>
          <Tab.Panel>2</Tab.Panel>
          <Tab.Panel>3</Tab.Panel>
          <Tab.Panel>4</Tab.Panel>
        </Tab.Panels>
      </Container>
    </Tab.Group>
  )
}
