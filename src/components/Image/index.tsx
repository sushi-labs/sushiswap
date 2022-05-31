import { cloudinaryLoader } from 'app/functions'
import NextImage, { ImageProps } from 'next/image'
import { FC } from 'react'

import { shimmer } from './shimmer'

// @ts-ignore TYPE NEEDS FIXING
const toBase64 = (str) => (typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str))

const Image: FC<ImageProps> = ({ src, width, height, layout, ...rest }) => {
  const useBlur = parseInt(String(height), 10) >= 40 && parseInt(String(width), 10) >= 40

  /* Only remote images get routed to Cloudinary */
  const loader = typeof src === 'string' && src.includes('http') ? cloudinaryLoader : undefined

  return (
    <div style={{ width, height }} className="overflow-hidden rounded">
      {useBlur ? (
        <NextImage
          loader={loader}
          src={src}
          width={width}
          height={height}
          layout={layout}
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`}
          {...rest}
        />
      ) : (
        <NextImage
          loader={loader}
          src={src}
          width={width}
          height={height}
          layout={layout}
          placeholder="empty"
          {...rest}
        />
      )}
    </div>
  )
}

export default Image
