'use client'

import * as AvatarPrimitive from '@radix-ui/react-avatar'
import Image from 'next/image'
import * as React from 'react'

import classNames from 'classnames'
import { getAvatarImageSource } from '../cloudinary'

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
    shape?: 'circle' | 'square'
  }
>(({ className, shape = 'circle', ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={classNames(
      'relative flex h-10 w-10 shrink-0 overflow-hidden',
      shape === 'circle' ? 'rounded-full' : 'rounded-none',
      className,
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

interface AvatarImageProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> {
  src: string
}

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(({ className, width, src, onLoadingStatusChange }, ref) => {
  const _width = Number(width) || 40
  const [directCdnFallbackSrc, setDirectCdnFallbackSrc] = React.useState<
    string | null
  >(null)

  const source = getAvatarImageSource(src)
  const fallbackSrc =
    directCdnFallbackSrc === src ? source.fallbackSrc : undefined
  const imageSrc = fallbackSrc ?? src
  const loader = fallbackSrc ? undefined : source.loader

  function handleLoadingStatusChange(
    status: 'idle' | 'loading' | 'loaded' | 'error',
  ) {
    if (status === 'error' && source.fallbackSrc && !fallbackSrc) {
      setDirectCdnFallbackSrc(src)
      return
    }

    onLoadingStatusChange?.(status)
  }

  return (
    <AvatarPrimitive.Image
      src={loader ? loader({ src: imageSrc, width: _width }) : imageSrc}
      asChild
      ref={ref}
      className={classNames('aspect-square h-full w-full', className)}
      onLoadingStatusChange={handleLoadingStatusChange}
    >
      <Image
        loader={loader}
        unoptimized={Boolean(fallbackSrc)}
        alt="avatar"
        src={imageSrc}
        width={_width}
        height={_width}
      />
    </AvatarPrimitive.Image>
  )
})
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={classNames(
      'flex h-full w-full items-center justify-center rounded-[inherit] bg-muted',
      className,
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarFallback, AvatarImage }
