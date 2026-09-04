'use client'

import * as AvatarPrimitive from '@radix-ui/react-avatar'
import Image from 'next/image'
import * as React from 'react'

import classNames from 'classnames'
import {
  cloudinaryLogoFetchLoader,
  cloudinaryLogoImageLoader,
} from '../cloudinary'

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={classNames(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
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

  const isAbsoluteUrl = /^https?:\/\//.test(src)
  const isCloudinaryUploadPath =
    src.startsWith('native-currency') || src.startsWith('tokens')
  const isUsingDirectCdnFallback = directCdnFallbackSrc === src
  const imageSrc = isUsingDirectCdnFallback
    ? `https://cdn.sushi.com/${src}`
    : src
  const loader = isUsingDirectCdnFallback
    ? undefined
    : isAbsoluteUrl
      ? cloudinaryLogoFetchLoader
      : isCloudinaryUploadPath
        ? cloudinaryLogoImageLoader
        : undefined

  function handleLoadingStatusChange(
    status: 'idle' | 'loading' | 'loaded' | 'error',
  ) {
    if (
      status === 'error' &&
      isCloudinaryUploadPath &&
      !isUsingDirectCdnFallback
    ) {
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
        unoptimized={isUsingDirectCdnFallback}
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
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      className,
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarFallback, AvatarImage }
