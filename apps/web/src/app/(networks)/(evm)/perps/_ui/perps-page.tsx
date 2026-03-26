'use client'
import { useIsMounted } from '@sushiswap/hooks'
import { Splash, useBreakpoint } from '@sushiswap/ui'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'
import { DesktopLayout } from './desktop'
import { MobileLayout } from './mobile'

export const PerpsPage = () => {
  const { isLg } = useBreakpoint('lg')
  const isMounted = useIsMounted()
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    if (resolvedTheme !== 'dark') {
      setTheme('dark')
    }
  }, [resolvedTheme, setTheme])

  if (!isMounted) return <Splash />

  return (
    <main className="bg-[#0D1421]">
      {isLg ? <DesktopLayout /> : <MobileLayout />}
    </main>
  )
}
