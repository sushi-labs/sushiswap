'use client'

import { Navigation } from '@sushiswap/ui'
import type { Metadata } from 'next'
import { headerElements } from '../_common/header-elements'

export const metadata: Metadata = {
  title: 'Partner',
}

export function Header() {
  return (
    <div className="w-full h-[56px] z-20">
      <div className="fixed w-full flex z-20">
        <Navigation leftElements={headerElements({ includeOnramper: false })} />
      </div>
    </div>
  )
}
