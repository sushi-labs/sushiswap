import { classNames } from '@sushiswap/ui'
import NextImage from 'next/image'
import { FC } from 'react'

import { UploadFileEntity } from '../.graphclient'
import { getStrapiMedia } from '../lib/media'

interface ImageProps {
  quality?: number
  height?: number
  width?: number
  layout?: 'fill' | 'responsive'
  objectFit?: 'cover' | 'contain'
  className?: string
  image: UploadFileEntity
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
  if (!image.attributes || !image.attributes.url) {
    return <></>
  }

  const { alternativeText, width: _width, height: _height } = image.attributes

  if (image.attributes.url.includes('.mp4') || image.attributes.url.includes('.webm')) {
    return (
      <video
        autoPlay={true}
        loop
        className={classNames(className, '!my-0')}
        {...(width && { width })}
        {...(height && { height })}
        style={{ objectFit: 'cover', height }}
      >
        <source src={getStrapiMedia(image.attributes.url)} />
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
      src={getStrapiMedia(image.attributes.url)}
      alt={alternativeText || ''}
    />
  )
}
