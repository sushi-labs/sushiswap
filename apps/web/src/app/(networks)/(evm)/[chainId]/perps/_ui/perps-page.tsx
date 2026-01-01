'use client'
import { useBreakpoint } from '@sushiswap/ui'
import { DesktopLayout } from './desktop/desktop-layout'
import { MobileLayout } from './mobile/mobile-layout'

export const PerpsPage = () => {
  const { isLg } = useBreakpoint('lg')

  return <>{isLg ? <DesktopLayout /> : <MobileLayout />}</>
}
