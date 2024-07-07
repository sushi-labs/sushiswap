import type { Image } from '@sushiswap/graph-client/strapi'
import { classNames } from '@sushiswap/ui'
import NextImage from 'next/legacy/image'
import type { FC } from 'react'
import { getOptimizedMedia, isMediaVideo } from '../lib/media'

interface MediaProps {
  quality?: number
  height?: number
  width?: number
  layout?: 'fill' | 'responsive'
  objectFit?: 'cover' | 'contain'
  className?: string
  image: Image
}

export const Media: FC<MediaProps> = ({
  quality = 100,
  width,
  height,
  image,
  className,
  layout = 'fill',
  objectFit = 'cover',
}) => {
  if (!image.url) {
    return <></>
  }

  if (isMediaVideo(image.provider_metadata)) {
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
            metadata: image.provider_metadata,
          })}
        />
      </video>
    )
  }

  const { width: _width, height: _height, alternativeText } = image

  return (
    <NextImage
      quality={quality}
      className={className}
      layout={layout}
      height={layout !== 'fill' ? height || _height || 400 : undefined}
      width={layout !== 'fill' ? width || _width || 640 : undefined}
      objectFit={objectFit}
      src={getOptimizedMedia({
        metadata: image.provider_metadata,
        width,
        height,
      })}
      alt={alternativeText || ''}
    />
  )
}
