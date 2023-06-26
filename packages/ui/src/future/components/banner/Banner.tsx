import { Transition } from '@headlessui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { FC } from 'react'
import { useActiveBanners } from '@sushiswap/react-query'

import classNames from 'classnames'

function getStrapiMedia(url: string) {
  return url.startsWith('/') ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}${url}` : url
}

export const Banner: FC = () => {
  const { data: banners } = useActiveBanners()
  const bannerLength = banners?.length || 0

  const [slideIndex, setSlideIndex] = useState<number>(Math.floor(Math.random() * bannerLength))

  const nextSlide = useCallback(() => {
    setSlideIndex((prevState) => (prevState + 1) % bannerLength)
  }, [bannerLength])

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [nextSlide])

  if (bannerLength === 0) return <></>

  const slides = banners?.map(({ link, image: { url } }, index) => {
    return (
      <div
        key={url}
        className={classNames(
          index === slideIndex ? 'block' : 'hidden',
          'h-[96px] absolute inset-0 flex items-center justify-center text-5xl transition-all ease-in-out duration-1000 transform slide'
        )}
      >
        <Transition
          as={React.Fragment}
          show={index === slideIndex}
          enter="transform transition duration-[500ms]"
          enterFrom="opacity-0 scale-90"
          enterTo="opacity-100 scale-100"
          leave="transform duration-200 transition ease-in-out"
          leaveFrom="opacity-100 rotate-0 scale-100 "
          leaveTo="opacity-0 scale-95 "
        >
          <a
            rel="noreferrer"
            href={link}
            target="_blank"
            className={classNames(
              'block w-full py-12 rounded-xl',
              link ? 'cursor-pointer' : 'cursor-default pointer-events-none'
            )}
            style={{
              backgroundImage: `url(${getStrapiMedia(url)})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="flex items-center justify-between gap-6 pl-5 pr-8" />
          </a>
        </Transition>
      </div>
    )
  })

  return (
    <div className="flex flex-col justify-center">
      <div className="relative h-[96px] mt-4">{slides}</div>
    </div>
  )
}

export default Banner
