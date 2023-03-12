'use client'

import { Tab } from '@headlessui/react'
import { GlobeAltIcon } from '@heroicons/react/outline'
import { classNames, DiscordIcon, GithubIcon, TwitterIcon } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/future/components/button'
import { Container } from '@sushiswap/ui/future/components/Container'
import React from 'react'

import { Stats } from './Stats'

const LINKS = [
  {
    icon: DiscordIcon,
    title: 'Discord',
    link: 'https://discord.gg/NVPXN4e',
  },
  {
    icon: TwitterIcon,
    title: 'Twitter',
    link: 'https://twitter.com/sushiswap',
  },
  {
    icon: GithubIcon,
    title: 'Github',
    link: 'https://github.com/sushiswap',
  },
  {
    icon: GlobeAltIcon,
    title: 'Website',
    link: 'https://sushi.com',
  },
]

const TABS = ['Overview', 'Finance', 'Governance', 'Token Holders']

export function Hero() {
  return (
    <>
      <div className="bg-gradient-to-r from-[#0993EC]/20 to-[#F338C3]/20 h-px" />
      <div className="pt-14 bg-gradient-to-r from-[#0993EC]/10 to-[#F338C3]/[5%]">
        <Container maxWidth="6xl" className="mx-auto flex justify-between px-4 gap-4">
          <div>
            <p className="text-slate-400 font-medium text-sm">Last Update: Jan 11, 2023</p> {/** TODO: */}
            <h1 className="mt-3 text-5xl font-bold">
              <p>Welcome to Sushi</p>
              <p className="bg-clip-text text-transparent bg-gradient-to-r from-[#0993EC] to-[#F338C3]">
                <span>Governance</span> <span className="bg-white bg-clip-text">& Treasury</span>
              </p>
            </h1>
            <div className="mt-5 flex gap-6">
              {LINKS.map(({ icon: Icon, link, title }, index) => (
                <a href={link} className="cursor-pointer" key={index} title={title}>
                  <Icon width={24} height={24} className="text-slate-500 hover:text-slate-300 transition ease-in-out" />
                </a>
              ))}
            </div>
            <Button size="xl" className="mt-14">
              {/** TODO: */}
              Q1 2023 KPIs Report
            </Button>
            <Tab.List className="mt-14 flex gap-8">
              {TABS.map((tab) => (
                <Tab
                  key={tab}
                  className={({ selected }) =>
                    classNames(
                      'pb-4 !border-b-2',
                      selected ? 'font-semibold text-blue border-b-blue' : 'hover:text-slate-50 border-b-transparent'
                    )
                  }
                >
                  {tab}
                </Tab>
              ))}
            </Tab.List>
          </div>

          <Stats />
        </Container>
      </div>
    </>
  )
}
