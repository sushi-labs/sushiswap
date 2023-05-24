'use client'

import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { useBreakpoint } from '@sushiswap/hooks'
import { DiscordIcon, GithubIcon, TwitterIcon } from '@sushiswap/ui'
import React from 'react'

const LINKS = [
  { icon: DiscordIcon, title: 'Discord', link: 'https://discord.gg/NVPXN4e' },
  { icon: TwitterIcon, title: 'Twitter', link: 'https://twitter.com/sushiswap' },
  { icon: GithubIcon, title: 'Github', link: 'https://github.com/sushiswap' },
  { icon: GlobeAltIcon, title: 'Website', link: 'https://sushi.com' },
]
export function Socials() {
  const { isMd } = useBreakpoint('md')

  return (
    <div className="mt-5 flex gap-4 md:gap-6">
      {LINKS.map(({ icon: Icon, link, title }, index) => (
        <a href={link} className="cursor-pointer" key={index} title={title}>
          <Icon
            width={isMd ? 24 : 20}
            height={isMd ? 24 : 20}
            className="text-slate-500 transition ease-in-out hover:text-slate-300"
          />
        </a>
      ))}
    </div>
  )
}
