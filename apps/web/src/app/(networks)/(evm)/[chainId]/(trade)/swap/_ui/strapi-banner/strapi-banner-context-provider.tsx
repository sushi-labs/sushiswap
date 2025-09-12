'use client'

import type { Banner } from '@sushiswap/graph-client/strapi'
import type { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import type React from 'react'
import { createContext, useContext } from 'react'

interface StrapiBannerContext {
  banner?: Banner
  cookie?: RequestCookie
}

const StrapiBannerContext = createContext<StrapiBannerContext>({})

export function useStrapiBanner() {
  const context = useContext(StrapiBannerContext)
  if (!context) {
    throw new Error(
      'useStrapiBanner must be used within StrapiBannerContextProvider',
    )
  }
  return context
}

export function StrapiBannerContextProvider({
  banner,
  cookie,
  children,
}: {
  banner?: Banner
  cookie?: RequestCookie
  children: React.ReactNode
}) {
  return (
    <StrapiBannerContext.Provider value={{ banner, cookie }}>
      {children}
    </StrapiBannerContext.Provider>
  )
}
