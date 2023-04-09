'use client'

import 'swiper/swiper.css'
import 'swiper/css/navigation'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import { classNames } from '@sushiswap/ui'
import React, { ReactNode, useReducer } from 'react'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'

interface CardNavigationProps {
  items: ReactNode[]
}

function SlideButtons({ show }: { show: { left: boolean; right: boolean } }) {
  const swiper = useSwiper()

  const BASE =
    'rounded-full h-10 w-10 flex items-center justify-center border border-slate-600 transition-colors ease-in'
  const ACTIVE = 'bg-gray-50 text-slate-800 hover:bg-slate-200'
  const STALE = 'bg-slate-700 text-slate-400 hover:bg-slate-800'

  return (
    <div className="absolute w-[calc(100%-16px)] flex justify-between items-center z-20 inset-y-0">
      <button onClick={() => swiper.slidePrev()} className={classNames(BASE, ACTIVE, !show.left && 'invisible')}>
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <button
        onClick={() => swiper.slideNext()}
        className={classNames(BASE, show.left ? ACTIVE : STALE, !show.right && 'invisible')}
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>
    </div>
  )
}

interface ButtonState {
  left: boolean
  right: boolean
}

const INITIAL_BUTTON_STATE = { left: false, right: true }

function reducer(state: ButtonState, position: 'start' | 'between' | 'end') {
  switch (position) {
    case 'between':
      return { left: true, right: true }
    case 'end':
      return { left: true, right: false }
    default:
    case 'start':
      return INITIAL_BUTTON_STATE
  }
}

export function CardNavigation({ items }: CardNavigationProps) {
  const [show, dispatch] = useReducer(reducer, INITIAL_BUTTON_STATE)

  return (
    <div className="relative flex overflow-hidden">
      <Swiper
        className="p-1"
        slidesPerView={2}
        spaceBetween={12}
        watchSlidesProgress
        onReachBeginning={() => dispatch('start')}
        onReachEnd={() => dispatch('end')}
        onFromEdge={() => dispatch('between')}
      >
        <SlideButtons show={show} />
        {items.map((item, index) => (
          <SwiperSlide key={index} className="ring rounded-lg h-full min-w-[50%] bg-white">
            {item}
          </SwiperSlide>
        ))}
        {/** empty slot */}
        <SwiperSlide />
        <div className="bg-gradient-to-r to-[#101728] w-1/2 from-transparent h-full top-0 absolute right-0 z-10" />
      </Swiper>
    </div>
  )
}
