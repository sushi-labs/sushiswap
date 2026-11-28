import { getBanners } from '@sushiswap/graph-client/strapi'
import { unstable_cache } from 'next/cache'
import { cookies } from 'next/headers'
import type { FC, ReactNode } from 'react'
import { getOptimizedMedia } from 'src/app/(cms)/lib/media'
import { logger } from 'src/lib/logger'
import { getSafeExternalUrl } from 'src/lib/safe-external-url'
import {
  StrapiBannerContextProvider,
  type StrapiBannerData,
} from './strapi-banner-context-provider'

export const StrapiBannerProvider: FC<{ children: ReactNode }> = async ({
  children,
}) => {
  let banners

  try {
    banners = await unstable_cache(() => getBanners(), ['banners'], {
      revalidate: 3600,
    })()
  } catch (error) {
    logger.error(error, {
      location: 'StrapiBannerProvider',
      action: 'fetchBanners',
    })
  }

  let activeBanner: StrapiBannerData | undefined
  for (const { id, isActive, image, link } of banners ?? []) {
    if (!isActive || !image) continue

    const { alternativeText, provider_metadata, width, height, url } =
      image.attributes
    const src =
      getOptimizedMedia({ metadata: provider_metadata, width, height }) || url
    if (!src) continue

    activeBanner = {
      id,
      href: getSafeExternalUrl(link),
      src,
      alt: alternativeText ?? '',
    }
    break
  }

  const cookie = (await cookies()).get('hidden-banner-ids')

  return (
    <StrapiBannerContextProvider banner={activeBanner} cookie={cookie}>
      {children}
    </StrapiBannerContextProvider>
  )
}
