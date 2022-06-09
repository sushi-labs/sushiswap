import NextImage from 'next/image'
import { FC } from 'react'

import { getStrapiMedia } from '../lib/media'
import { Image as ImageType } from '../types'
import { classNames } from '@sushiswap/ui'

interface ImageProps {
  quality?: number
  height?: number
  width?: number
  layout?: 'fill' | 'responsive'
  objectFit?: 'cover' | 'contain'
  className?: string
  image: {
    data: ImageType
  }
}

export const Image: FC<ImageProps> = ({
  quality = '100',
  width,
  height,
  image,
  className,
  layout = 'fill',
  objectFit = 'cover',
}) => {
  const { alternativeText, width: _width, height: _height } = image.data.attributes

  if (image.data.attributes.url.includes('.mp4') || image.data.attributes.url.includes('.webm')) {
    return (
      <video
        autoPlay={true}
        loop
        className={classNames(className, '!my-0')}
        {...(width && { width })}
        {...(height && { height })}
        style={{ objectFit: 'cover', height }}
      >
        <source src={getStrapiMedia(image.data.attributes.url)} />
      </video>
    )
  }

  return (
    <NextImage
      quality={quality}
      className={className}
      layout={layout}
      width={width || _width || '640'}
      height={height || _height || '400'}
      objectFit={objectFit}
      src={getStrapiMedia(image.data.attributes.url)}
      alt={alternativeText || ''}
    />
  )
}
