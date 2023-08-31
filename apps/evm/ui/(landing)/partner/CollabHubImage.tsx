'use client'

import { cloudinaryImageLoader } from '@sushiswap/ui/cloudinary'
import Image from 'next/image'

export const CollabHubImage = () => {
  return (
    <div className="flex justify-center">
      <div className="rounded-lg overflow-hidden md:not-prose">
        <Image loader={cloudinaryImageLoader} alt="farmer" src="/image_143.jpg" width={410} height={520} />
      </div>
    </div>
  )
}
