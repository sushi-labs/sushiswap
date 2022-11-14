import { BookOpenIcon } from '@heroicons/react/solid'
import { DiscordIcon } from '@sushiswap/ui'
import React from 'react'

import { SwitchSVG } from './SVG'
import { BentoBoxSVG } from './SVG/BentoBoxSVG'

export interface CardInterface {
  id: string
  category: string
  title: string
  pointOfInterest: number
  icon: (props: React.ComponentProps<'svg'>) => JSX.Element
  backgroundColor: string
  textColor: string
}

export const PRODUCT_CARDS: CardInterface[] = [
  {
    id: 'c',
    category: 'BentoBox',
    title: 'The interest-bearing DeFi base layer',
    pointOfInterest: 80,
    backgroundColor: 'bg-neutral-900',
    textColor: 'text-white',
    icon: BentoBoxSVG,
  },
  {
    id: 'f',
    category: 'Trident AMM',
    title: 'A future-proof framework for building AMMs',
    pointOfInterest: 120,
    backgroundColor: 'bg-neutral-900',
    textColor: 'text-white',
    icon: SwitchSVG,
  },
]

export const SUPPORT_CARDS: CardInterface[] = [
  {
    id: 'a',
    category: 'Sushi Academy',
    title: 'The interest-bearing DeFi base layer',
    pointOfInterest: 260,
    backgroundColor: 'bg-slate-800',
    textColor: 'text-white',
    icon: BookOpenIcon,
  },
  {
    id: 'g',
    category: 'Talk To Us',
    title: 'Join our Sushi Discord community and ask away!',
    pointOfInterest: 200,
    backgroundColor: 'bg-blue/[0.8]',
    textColor: 'text-white',
    icon: DiscordIcon,
  },
]
