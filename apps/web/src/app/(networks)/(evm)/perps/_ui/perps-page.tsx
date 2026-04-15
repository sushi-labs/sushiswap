'use client'
import { useIsMounted } from '@sushiswap/hooks'
import { Splash, useBreakpoint } from '@sushiswap/ui'
import { DesktopLayout } from './desktop'
import { MobileLayout } from './mobile'

export const PerpsPage = () => {
  const { isLg } = useBreakpoint('lg')
  const isMounted = useIsMounted()

  if (!isMounted) return <Splash />

  return (
    <main className="bg-[#0D1421]">
      {isLg ? <DesktopLayout /> : <MobileLayout />}
    </main>
  )
}
