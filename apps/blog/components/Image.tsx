import NextImage from 'next/image'
import { FC } from 'react'

import { getStrapiMedia } from '../lib/media'
import { Image as ImageType } from '../types'

interface ImageProps {
  className?: string
  image: {
    data: ImageType
  }
}

export const Image: FC<ImageProps> = ({ image, className }) => {
  const { alternativeText, width, height } = image.data.attributes

  return (
    <NextImage
      className={className}
      layout="responsive"
      width={width}
      height={height}
      objectFit="contain"
      src={getStrapiMedia(image.data.attributes.url)}
      alt={alternativeText || ''}
    />
  )
}
