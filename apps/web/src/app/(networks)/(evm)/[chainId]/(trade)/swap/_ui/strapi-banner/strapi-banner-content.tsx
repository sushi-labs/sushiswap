'use client'

import { XMarkIcon } from '@heroicons/react/20/solid'
import type { Banner } from '@sushiswap/graph-client/strapi'
import { classNames } from '@sushiswap/ui'
import type { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import Image from 'next/legacy/image'
import { type MouseEventHandler, useCallback, useMemo, useState } from 'react'
import { getOptimizedMedia } from 'src/app/(cms)/lib/media'
import { getSafeExternalUrl } from 'src/lib/safe-external-url'

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

  if (hiddenBannerIds.includes(banner.id) || !banner.image) return null

  const image = banner.image.attributes

  // CMS-controlled link: only allow http(s) targets.
  const href = getSafeExternalUrl(banner.link)

  return (
    <a
      href={href}
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
          className={'absolute top-[10px] right-[10px] cursor-pointer z-[1]'}
          onClick={onHide}
        />
        <Image
          src={getOptimizedMedia({
            metadata: image.provider_metadata,
            width: image.width ?? undefined,
            height: image.height ?? undefined,
          })}
          alt={image.alternativeText || ''}
          layout="fill"
          onLoad={() => setImageLoading(false)}
          className={classNames(
            '-z-10 object-cover object-left',
            isImageLoading && 'animate-pulse',
          )}
        />
      </div>
    </a>
  )
}
