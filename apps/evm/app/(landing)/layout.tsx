import { classNames } from '@sushiswap/ui'
import { HotJar } from '@sushiswap/ui/components/scripts'
import { headers } from 'next/headers'
import React from 'react'

import { Header } from './header'
import { Providers } from './providers'

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers()
  const pathName = headersList.get('x-invoke-path')

  return (
    <>
      <Providers forcedTheme={pathName === '/' ? 'dark' : undefined}>
        <div className={classNames('flex flex-col flex-1', pathName === '/' ? 'bg-black' : '')}>
          <Header />
          <div className="flex flex-col flex-1">{children}</div>
        </div>
      </Providers>
      <HotJar />
    </>
  )
}
