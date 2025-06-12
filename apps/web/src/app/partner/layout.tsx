import { Navigation } from '@sushiswap/ui'
import type { Metadata } from 'next'
import { headerElements } from '../_common/header-elements'

export const metadata: Metadata = {
  title: 'Partner',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="w-full h-[56px] z-20">
        <div className="fixed w-full flex z-20">
          <Navigation leftElements={headerElements()} />
        </div>
      </div>
      <div className="flex flex-col flex-1">{children}</div>
    </>
  )
}
