'use client'

import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { DiscordIcon, GithubIcon, TwitterIcon } from '@sushiswap/ui'
import React from 'react'

const LINKS = [
  { icon: DiscordIcon, title: 'Discord', link: 'https://discord.gg/NVPXN4e' },
  { icon: TwitterIcon, title: 'Twitter', link: 'https://twitter.com/sushiswap' },
  { icon: GithubIcon, title: 'Github', link: 'https://github.com/sushiswap' },
  { icon: GlobeAltIcon, title: 'Website', link: 'https://sushi.com' },
]
export function Socials() {
  return (
    <>
      {LINKS.map(({ icon: Icon, link, title }, index) => (
        <a href={link} className="cursor-pointer" key={index} title={title}>
          <Icon width={24} height={24} className="text-slate-500 transition ease-in-out hover:text-slate-300" />
        </a>
      ))}
    </>
  )
}
