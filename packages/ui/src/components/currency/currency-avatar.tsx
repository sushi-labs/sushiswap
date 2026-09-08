'use client'

import type { ImageProps } from 'next/image'
import { type ComponentProps, useState } from 'react'

import { getTokenFallbackIconStyle } from '../../lib/token-fallback-icon'
import { Avatar, AvatarFallback, AvatarImage } from '../avatar'

type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error'

/** `Avatar` falls back to its own `h-10 w-10` when given no explicit width. */
const DEFAULT_SIZE_IN_PIXELS = 40

interface CurrencyAvatarProps {
  shape?: ComponentProps<typeof Avatar>['shape']
  style?: ImageProps['style']
  address: string
  chainId: number | string
  fallback: string
  height: ImageProps['height']
  src: string
  width: ImageProps['width']
}

interface ImageState {
  src: string
  status: ImageLoadingStatus
}

export function CurrencyAvatar({
  address,
  chainId,
  fallback,
  height,
  src,
  width,
  shape,
  style,
}: CurrencyAvatarProps) {
  const [imageState, setImageState] = useState<ImageState>({
    src,
    status: 'loading',
  })
  const status = imageState.src === src ? imageState.status : 'loading'
  const fallbackSizeInPixels = Number(width) || DEFAULT_SIZE_IN_PIXELS

  return (
    <Avatar
      key={src}
      shape={shape}
      style={{
        width,
        height,
        ...(shape === 'square' ? { containerType: 'inline-size' } : {}),
        ...style,
      }}
    >
      <AvatarImage
        width={Number(width) || 20}
        src={src}
        onLoadingStatusChange={(status) => setImageState({ src, status })}
      />
      {status === 'error' ? (
        <AvatarFallback
          style={{
            ...getTokenFallbackIconStyle(
              { address, chainId },
              fallbackSizeInPixels,
            ),
            ...(shape === 'square' ? { fontSize: '38cqw' } : {}),
          }}
        >
          {fallback}
        </AvatarFallback>
      ) : null}
      {status === 'idle' || status === 'loading' ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse rounded-[inherit] bg-black/[0.10] dark:bg-white/[0.10] black:bg-white/[0.25]"
        />
      ) : null}
    </Avatar>
  )
}
