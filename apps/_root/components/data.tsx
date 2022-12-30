import React, { ReactNode } from 'react'

import { SwitchSVG } from './SVG'
import { BentoBoxSVG } from './SVG/BentoBoxSVG'

export interface CardInterface {
  id: string
  category: string
  audience: string
  title: string
  pointOfInterest: number
  icon: (props: React.ComponentProps<'svg'>) => JSX.Element
  backgroundColor: string
  textColor: string
  content: ReactNode
  link: string
}

export const PRODUCT_CARDS: CardInterface[] = [
  {
    id: 'c',
    audience: 'Developers',
    category: 'Sushi Token Vault',
    title: 'The interest-bearing DeFi base layer',
    pointOfInterest: 80,
    backgroundColor: 'bg-neutral-900',
    textColor: 'text-white',
    icon: BentoBoxSVG,
    content: (
      <>
        <h3>What’s Sushi Token Vault? What’s In The Box For You?</h3>
        <p>
          Sushi Token Vault is an underlying token vault that provides a range of benefits for anything built on top of
          it. The main idea is to provide extra yield on top of a large pool of tokens via simple, safe strategies per
          token in the vault. It keeps an artificial balance internally of each account, allowing for the funds to be
          used in multiple ways at once, including flash loans (0.05% fee in the users’ pocket).
        </p>
        <p>
          Sushi Token Vault allows for a simplified token approval process (each approval is inherited by the system), a
          minimal proxy factory contract for convenience, optimized deposit, withdraw and skim functions that auto
          convert ETH to WETH, the batching of multiple Sushi Token Vault functions into a single transaction, and so
          much more, all while improving capital efficiency with increased use.
        </p>
      </>
    ),
    link: 'https://dev.sushi.com/docs/Products/Bentobox',
  },
  {
    id: 'f',
    audience: 'Developers',
    category: 'Trident AMM',
    title: 'A future-proof framework for building AMMs',
    pointOfInterest: 120,
    backgroundColor: 'bg-neutral-900',
    textColor: 'text-white',
    icon: SwitchSVG,
    content: (
      <>
        <h3>Benefits Of Learning Trident?</h3>
        <p>
          Trident is an AMM production framework that can be used to quickly iterate over and develop custom AMMs on top
          of. As most AMMs currently hardcode their environments, they all have the same underlying methods; we have
          abstracted these methods into a single interface, called IPool. Using the IPool interface and simply extending
          it to any number of pools, developers can quickly and efficiently engineer high volume pools of different
          types, earning on the fees.
        </p>
        <p>
          Currently, Classic Pools (traditional pool model) and Stable Pools (for trading like-kind assets) are
          supported pool types, with more on the way. Any pool type that passes an audit and an internal review are
          eligible to be whitelisted on Trident, allowing external developers to create custom types if they wish.
        </p>
      </>
    ),
    link: 'https://dev.sushi.com/docs/Products/Trident%20AMM%20Framework',
  },
]
