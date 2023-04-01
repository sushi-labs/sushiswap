'use client'

import 'swiper/swiper.css'
import 'swiper/css/navigation'

import React, { ReactNode } from 'react'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import { ChevronRightIcon } from '@heroicons/react/outline'

interface CardNavigationProps {
  items: ReactNode[]
}

function SlidePreviousButton() {
  const swiper = useSwiper()

  return (
    <button className="text-black" onClick={() => swiper.slidePrev()}>
      Slide to the next slide
    </button>
  )
}
function SlideNextButton() {
  const swiper = useSwiper()

  return (
    <IconButton
      icon={ChevronRightIcon}
      iconProps={{
        width: 20,
        height: 20,
        className: 'text-gray-500 dark:text-slate-500',
      }}
      onClick={() => swiper.slideNext()}
    />
  )
}

export function CardNavigation({ items }: CardNavigationProps) {
  return (
    <div className="relative flex overflow-hidden">
      <Swiper className="p-1" slidesPerView={2} spaceBetween={12}>
        <div className="absolute left-0 top-1/2 z-20">
          <SlidePreviousButton />
        </div>
        <div className="absolute right-0 top-1/2 z-20">
          <SlideNextButton />
        </div>
        {items.map((item, index) => (
          <SwiperSlide key={index} className="ring rounded-lg h-full min-w-[50%] bg-white">
            {item}
          </SwiperSlide>
        ))}
        <SwiperSlide className="ring rounded-lg h-full min-w-[50%] bg-white"></SwiperSlide>
        <div className="bg-gradient-to-r to-[#101728] w-1/2 from-transparent h-full top-0 absolute right-0 z-10" />
      </Swiper>
    </div>
  )
}
