import Image from 'next/image'
import { FC } from 'react'

interface ProductCard {
  imgUrl: string
  title: string
  description: string
  cta: string
  ctaLink: string
}

const ProductCard: FC<ProductCard> = ({ imgUrl, title, description, cta, ctaLink }) => {
  return (
    <div className="flex flex-row h-full pt-16 space-x-6">
      <div className="flow-root px-8 pb-4 rounded-lg bg-neutral-800 w-[281px]">
        <div className="mx-auto -mt-16 text-center">
          <div
            className="relative inline-flex items-center justify-center overflow-hidden rounded-full shadow-lg"
            style={{
              backgroundImage: `linear-gradient(224.43deg, #0D0415 -16.69%, #1B2152 86.36%)`,
              backgroundPosition: 'center bottom',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              width: '123px',
              height: '123px',
            }}
          >
            <Image alt={title} src={imgUrl} width={64} height={64} objectFit="scale-down" />
          </div>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-white">{title}</h3>
          <p className="mt-2 text-sm text-gray-500">{description}</p>
          <div
            className="mt-4 rounded-md shadow"
            style={{ backgroundImage: 'linear-gradient(to right, #016eda, #d900c0)' }}
          >
            <a
              href={ctaLink}
              className="flex items-center justify-center w-full px-6 py-2 text-base font-medium text-white border border-transparent rounded-md"
            >
              {cta}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
