import { getBanners } from '@sushiswap/graph-client/strapi'
import { unstable_cache } from 'next/cache'
import { cookies } from 'next/headers'
import type { FC, ReactNode } from 'react'
import { StrapiBannerContextProvider } from './strapi-banner-context-provider'

export const StrapiBannerProvider: FC<{ children: ReactNode }> = async ({
  children,
}) => {
  let banners

  try {
    banners = await unstable_cache(() => getBanners(), ['banners'], {
      revalidate: 3600,
    })()
  } catch {}

  // Only supporting one active banner at a time for now
  const activeBanner = banners?.find(
    (banner) => banner.isActive && banner.image,
  )
  const cookie = (await cookies()).get('hidden-banner-ids')

  return (
    <StrapiBannerContextProvider banner={activeBanner} cookie={cookie}>
      {children}
    </StrapiBannerContextProvider>
  )
}
