'use client'

import { XMarkIcon } from '@heroicons/react/20/solid'
import { Banner } from '@sushiswap/graph-client/strapi'
import { LinkExternal, classNames } from '@sushiswap/ui'
import type { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import Image from 'next/legacy/image'
import { MouseEventHandler, useCallback, useMemo, useState } from 'react'
import { getOptimizedMedia } from 'src/app/(cms)/lib/media'

export function StrapiBannerContent({
  banner,
  cookie: _cookie,
}: { banner: Banner; cookie: RequestCookie | undefined }) {
  const [cookie, setCookie] = useState<RequestCookie | undefined>(_cookie)
  const [isImageLoading, setImageLoading] = useState(true)

  const hiddenBannerIds = useMemo(() => {
    return cookie ? cookie.value.split(',') : []
  }, [cookie])

  const onHide = useCallback(
    (event: Parameters<MouseEventHandler<HTMLDivElement>>[0]) => {
      event.preventDefault()

      const newHiddenBannerIds = [...hiddenBannerIds, banner.id]

      document.cookie = `hidden-banner-ids=${newHiddenBannerIds.join(
        ',',
      )}; path=/; max-age=31536000`

      setCookie({
        name: 'hidden-banner-ids',
        value: newHiddenBannerIds.join(','),
      })
    },
    [banner, hiddenBannerIds],
  )

  if (hiddenBannerIds.includes(banner.id)) {
    return <></>
  }

  const image = banner.image.attributes

  return (
    <div className="rounded-xl w-full relative">
      <LinkExternal href={banner.link}>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: stupid */}
        <div className="absolute z-10 right-0 top-0 p-2" onClick={onHide}>
          <XMarkIcon width={32} height={32} className="text-white" />
        </div>
        <Image
          src={getOptimizedMedia({
            metadata: image.provider_metadata,
            width: image.width,
            height: image.height,
          })}
          alt={image.alternativeText || ''}
          width={image.width}
          height={image.height}
          onLoad={() => setImageLoading(false)}
          className={classNames(
            'rounded-xl absolute bg-secondary',
            isImageLoading && 'animate-pulse',
          )}
        />
      </LinkExternal>
    </div>
  )
}
