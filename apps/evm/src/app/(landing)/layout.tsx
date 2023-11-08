import { classNames } from '@sushiswap/ui'
import { HotJar } from '@sushiswap/ui/components/scripts'
import React from 'react'

import { Header } from './header'
import { Providers } from './providers'

export default function LandingLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <Providers>
        <div className={classNames('flex flex-col flex-1')}>
          <Header />
          <div className="flex flex-col flex-1">{children}</div>
        </div>
      </Providers>
      <HotJar />
    </>
  )
}
