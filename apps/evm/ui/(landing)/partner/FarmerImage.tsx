'use client'

import { cloudinaryImageLoader } from '@sushiswap/ui/cloudinary'
import Image from 'next/image'

export const FarmerImage = () => {
  return (
    <div className="flex justify-center">
      <div className="rounded-lg overflow-hidden md:not-prose">
        <Image loader={cloudinaryImageLoader} alt="farmer" src="/image_142.jpg" width={360} height={293} />
      </div>
    </div>
  )
}
