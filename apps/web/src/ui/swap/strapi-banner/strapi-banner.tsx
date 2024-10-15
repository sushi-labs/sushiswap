import { getBanners } from '@sushiswap/graph-client/strapi'
import ms from 'ms'
import { unstable_cache } from 'next/cache'
import { cookies } from 'next/headers'
import { StrapiBannerContent } from './strapi-banner-content'

export const revalidate = 3600

export const fetchCache = 'default-no-store'

export async function StrapiBanner() {
  let banners

  try {
    banners = await unstable_cache(() => getBanners(), ['banners'], {
      revalidate: ms('1h'),
    })()
  } catch {}

  if (!banners) return <></>

  // Only supporting one active banner at a time for now
  const activeBanner = banners.find((banner) => banner.isActive)

  if (!activeBanner) return <></>

  return (
    <StrapiBannerContent
      banner={activeBanner}
      cookie={cookies().get('hidden-banner-ids')}
    />
  )
}
