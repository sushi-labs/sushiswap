import { classNames } from '@sushiswap/ui'
import { HotJar } from '@sushiswap/ui'
import React from 'react'

import { Header } from './header'

export default function LandingLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <div className={classNames('flex flex-col flex-1')}>
        <Header />
        <div className="flex flex-col flex-1">{children}</div>
      </div>
      <HotJar />
    </>
  )
}
