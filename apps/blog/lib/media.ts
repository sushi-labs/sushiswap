import { Transformation } from '@cloudinary/url-gen'
import { edit } from '@cloudinary/url-gen/actions/animated'
import { ifCondition } from '@cloudinary/url-gen/actions/conditional'
import { quality } from '@cloudinary/url-gen/actions/delivery'
import { fill, scale } from '@cloudinary/url-gen/actions/resize'
import { toAnimated } from '@cloudinary/url-gen/actions/transcode'
import { auto } from '@cloudinary/url-gen/qualifiers/quality'
import { cld } from './cld'

type Metadata =
  | {
      public_id?: string
      resource_type?: string
    }
  | undefined

export function isMediaVideo(metadata: Metadata) {
  return metadata?.resource_type === 'video'
}

export function getOptimizedMedia({
  metadata,
  width,
  height,
  asImage = false,
}: {
  metadata: Metadata
  width?: number
  height?: number
  asImage?: boolean
}) {
  if (!metadata?.public_id) return ''

  if (isMediaVideo(metadata) && asImage) {
    return cld
      .video(metadata.public_id)
      .resize(scale().height(240))
      .animated(edit().loop())
      .transcode(toAnimated().sampling(40))
      .animated(edit().delay(200))
      .format('gif')
      .delivery(quality(auto()))
      .toURL()
  }

  if (isMediaVideo(metadata)) {
    return cld
      .video(metadata.public_id)
      .format('webm')
      .conditional(
        ifCondition(
          'height > 1280',
          new Transformation().resize(fill().height('1280')),
        ),
      )
      .delivery(quality(auto()))
      .toURL()
  }
  if (height && width) {
    return cld
      .image(metadata.public_id)
      .format('webp')
      .resize(fill().width(width).height(height))
      .delivery(quality(auto()))
      .toURL()
  }

  if (height) {
    return cld
      .image(metadata.public_id)
      .format('webp')
      .resize(fill().height(height))
      .delivery(quality(auto()))
      .toURL()
  }

  if (width) {
    return cld
      .image(metadata.public_id)
      .format('webp')
      .resize(fill().width(width))
      .delivery(quality(auto()))
      .toURL()
  }

  return cld
    .image(metadata.public_id)
    .format('webp')
    .conditional(
      ifCondition(
        'height > 1280',
        new Transformation().resize(fill().height('1280')),
      ),
    )
    .delivery(quality(auto()))
    .toURL()
}
