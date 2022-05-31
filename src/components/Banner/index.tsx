import { Transition } from '@headlessui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import Button from 'app/components/Button'
import { classNames } from 'app/functions'
import { Banner as BannerType } from 'app/lib/api'
import React, { useCallback, useState } from 'react'
import { FC } from 'react'

import { getStrapiMedia } from '../../lib/media'

export interface BannerProps {
  banners: BannerType[]
}

const Banner: FC<BannerProps> = ({ banners }) => {
  const filteredSlides = banners.filter(({ attributes: { startDate, endDate } }) => {
    const now = new Date().getTime()
    const startEpoch = new Date(startDate).getTime()
    const endEpoch = new Date(endDate).getTime()
    return now > startEpoch && now < endEpoch
  })

  const [slideIndex, setSlideIndex] = useState<number>(Math.floor(Math.random() * filteredSlides.length))

  const nextSlide = useCallback(() => {
    setSlideIndex((prevState) => (prevState + 1) % banners.length)
  }, [banners.length])

  const prevSlide = useCallback(() => {
    setSlideIndex((prevState) => (prevState - 1 + banners.length) % banners.length)
  }, [banners.length])

  if (banners.length === 0) return <></>

  const slides = filteredSlides.map(({ attributes: { image, url } }, index) => {
    return (
      <div
        key={index}
        className={classNames(
          index === slideIndex ? 'block' : 'hidden',
          'h-[96px] absolute inset-0 flex items-center justify-center text-5xl transition-all ease-in-out duration-1000 transform slide'
        )}
      >
        <Transition
          as={React.Fragment}
          show={index === slideIndex}
          enter="transform transition duration-[200ms]"
          enterFrom="opacity-0 scale-90"
          enterTo="opacity-100 scale-100"
          leave="transform duration-200 transition ease-in-out"
          leaveFrom="opacity-100 rotate-0 scale-100 "
          leaveTo="opacity-0 scale-95 "
        >
          <a
            rel="noreferrer"
            href={url}
            target="_blank"
            className="block w-full py-12 rounded cursor-pointer"
            style={{
              backgroundImage: `url(${getStrapiMedia(image.data.attributes.url)})`,
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
      <div className="relative h-[96px] mt-4">
        {slides}
        {slides.length > 1 && (
          <div className="flex items-center justify-between w-full h-full">
            <Button onClick={prevSlide} className="flex items-center -ml-12">
              <ChevronLeftIcon width={24} className="hover:text-white text-low-emphesis" />
            </Button>
            <Button onClick={nextSlide} className="flex items-center -mr-12">
              <ChevronRightIcon width={24} className="hover:text-white text-low-emphesis" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Banner
