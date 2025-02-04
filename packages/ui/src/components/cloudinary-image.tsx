'use client'

import Image, { type ImageProps } from 'next/image'
import type { FC } from 'react'
import { cloudinaryImageLoader } from '../cloudinary'

type CloudinaryImage = Omit<ImageProps, 'loader'>

const CloudinaryImage: FC<CloudinaryImage> = (props) => {
  return <Image loader={cloudinaryImageLoader} {...props} />
}

export { CloudinaryImage }
