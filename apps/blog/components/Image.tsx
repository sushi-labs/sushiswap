import { classNames } from '@sushiswap/ui'
import NextImage from 'next/legacy/image'
import type { FC } from 'react'
import type { Image as ImageType } from 'types'
import { getOptimizedMedia, isMediaVideo } from '../lib/media'

interface ImageProps {
  quality?: number
  height?: number
  width?: number
  layout?: 'fill' | 'responsive'
  objectFit?: 'cover' | 'contain'
  className?: string
  image: {
    attributes: Pick<
      ImageType['attributes'],
      'provider_metadata' | 'url' | 'width' | 'height' | 'alternativeText'
    >
  }
}

export const Image: FC<ImageProps> = ({
  quality = 100,
  width,
  height,
  image,
  className,
  layout = 'fill',
  objectFit = 'cover',
}) => {
  if (!image.attributes.url) {
    return <></>
  }

  if (isMediaVideo(image.attributes.provider_metadata)) {
    return (
      <video
        autoPlay
        className={classNames(className, '!my-0')}
        loop
        {...(width && { width })}
        {...(height && { height })}
        style={{ objectFit: 'cover', height }}
      >
        <source
          src={getOptimizedMedia({
            metadata: image.attributes.provider_metadata,
          })}
        />
      </video>
    )
  }

  const { width: _width, height: _height, alternativeText } = image.attributes

  return (
    <NextImage
      alt={alternativeText || ''}
      className={className}
      height={layout !== 'fill' ? height || _height || 400 : undefined}
      layout={layout}
      objectFit={objectFit}
      quality={quality}
      src={getOptimizedMedia({
        metadata: image.attributes.provider_metadata,
        width,
        height,
      })}
      width={layout !== 'fill' ? width || _width || 640 : undefined}
    />
  )
}
