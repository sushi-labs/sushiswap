import NextImage from 'next/image'
import { FC } from 'react'

import { getStrapiMedia } from '../lib/media'
import { Image as ImageType } from '../types'

interface ImageProps {
  quality?: number
  layout?: 'fill' | 'responsive'
  objectFit?: 'cover' | 'contain'
  className?: string
  image: {
    data: ImageType
  }
}

export const Image: FC<ImageProps> = ({ quality = '100', image, className, layout = 'fill', objectFit = 'cover' }) => {
  const { alternativeText, width, height } = image.data.attributes

  return (
    <NextImage
      quality={quality}
      className={className}
      layout={layout}
      width={width}
      height={height}
      objectFit={objectFit}
      src={getStrapiMedia(image.data.attributes.url)}
      alt={alternativeText || ''}
    />
  )
}
