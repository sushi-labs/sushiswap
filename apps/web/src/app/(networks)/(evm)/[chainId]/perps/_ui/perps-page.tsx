'use client'
import { useBreakpoint } from '@sushiswap/ui'
import { Activity } from 'react'
import { DesktopLayout } from './desktop-layout'
import { MobileLayout } from './mobile-layout'

export const PerpsPage = () => {
  const { isLg } = useBreakpoint('lg')
  return (
    <>
      <Activity mode={isLg ? 'hidden' : 'visible'}>
        <MobileLayout />
      </Activity>
      <Activity mode={isLg ? 'visible' : 'hidden'}>
        <DesktopLayout />
      </Activity>
    </>
  )
}
