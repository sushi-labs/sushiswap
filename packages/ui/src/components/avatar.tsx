'use client'

import * as AvatarPrimitive from '@radix-ui/react-avatar'
import Image from 'next/image'
import * as React from 'react'

import classNames from 'classnames'
import { cloudinaryLogoImageLoader } from '../cloudinary'

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
>(({ className, width, src }, ref) => {
  const _width = Number(width) || 40

  const useCloudinary =
    src.startsWith('native-currency') || src.startsWith('tokens')

  return (
    <AvatarPrimitive.Image
      src={
        useCloudinary ? cloudinaryLogoImageLoader({ src, width: _width }) : src
      }
      asChild
      ref={ref}
      className={classNames('aspect-square h-full w-full', className)}
    >
      <Image
        loader={useCloudinary ? cloudinaryLogoImageLoader : undefined}
        alt="avatar"
        src={src}
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
