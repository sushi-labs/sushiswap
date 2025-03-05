'use client'

import { XMarkIcon } from '@heroicons/react/20/solid'
import type { Banner } from '@sushiswap/graph-client/strapi'
import { classNames } from '@sushiswap/ui'
import type { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import Image from 'next/legacy/image'
import { type MouseEventHandler, useCallback, useMemo, useState } from 'react'
import { getOptimizedMedia } from 'src/app/(cms)/lib/media'

export function StrapiBannerContent({
  banner,
  cookie: _cookie,
  className,
}: { banner: Banner; cookie: RequestCookie | undefined; className?: string }) {
  const [cookie, setCookie] = useState<RequestCookie | undefined>(_cookie)
  const [isImageLoading, setImageLoading] = useState(true)

  const hiddenBannerIds = useMemo(() => {
    return cookie ? cookie.value.split(',') : []
  }, [cookie])

  const onHide = useCallback(
    (event: Parameters<MouseEventHandler<SVGSVGElement>>[0]) => {
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
    <a
      href={banner.link}
      target="_blank"
      rel="noopener noreferrer"
      className="text-white"
    >
      <div
        className={classNames(
          'rounded-xl relative p-6 bg-secondary min-w-[360px] overflow-hidden',
          className,
        )}
      >
        <XMarkIcon
          width={20}
          height={20}
          className={'absolute top-[10px] right-[10px] cursor-pointer'}
          onClick={onHide}
        />
        <Image
          src={getOptimizedMedia({
            metadata: image.provider_metadata,
            width: image.width,
            height: image.height,
          })}
          alt={image.alternativeText || ''}
          layout="fill"
          onLoad={() => setImageLoading(false)}
          className={classNames('-z-10', isImageLoading && 'animate-pulse')}
        />
      </div>
    </a>
  )
}
