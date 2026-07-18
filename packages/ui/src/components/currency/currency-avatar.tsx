'use client'

import type { ImageProps } from 'next/image'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '../avatar'

type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error'

interface CurrencyAvatarProps {
  fallback: string
  fallbackColor: string
  height: ImageProps['height']
  src: string
  width: ImageProps['width']
}

interface ImageState {
  src: string
  status: ImageLoadingStatus
}

export function CurrencyAvatar({
  fallback,
  fallbackColor,
  height,
  src,
  width,
}: CurrencyAvatarProps) {
  const [imageState, setImageState] = useState<ImageState>({
    src,
    status: 'loading',
  })
  const status = imageState.src === src ? imageState.status : 'loading'

  return (
    <Avatar key={src} style={{ width, height }}>
      <AvatarImage
        width={Number(width) || 20}
        src={src}
        onLoadingStatusChange={(status) => setImageState({ src, status })}
      />
      {status === 'error' ? (
        <AvatarFallback
          style={{ backgroundColor: fallbackColor }}
          className="font-bold text-white"
        >
          {fallback}
        </AvatarFallback>
      ) : null}
      {status === 'idle' || status === 'loading' ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse rounded-full bg-black/[0.10] dark:bg-white/[0.10] black:bg-white/[0.25]"
        />
      ) : null}
    </Avatar>
  )
}
