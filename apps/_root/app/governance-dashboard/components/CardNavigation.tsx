'use client'

import 'swiper/swiper.css'
import 'swiper/css/navigation'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import { classNames } from '@sushiswap/ui'
import React, { ReactNode, useReducer } from 'react'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'

interface CardNavigationProps {
  children: ReactNode
  slidesPerView: number
  spaceBetween: number
  containerStyle?: string
  itemCount: number
}

function SlideButtons({ show }: { show: { left: boolean; right: boolean } }) {
  const swiper = useSwiper()

  const BASE =
    'rounded-full h-10 w-10 flex items-center justify-center border border-slate-600 transition-colors ease-in'
  const ACTIVE = 'bg-gray-50 text-slate-800 hover:bg-slate-200'
  const STALE = 'bg-slate-700 text-slate-400 hover:bg-slate-800'

  return (
    <>
      <div className="absolute inset-y-0 left-1 z-20 flex h-full items-center">
        <button onClick={() => swiper.slidePrev()} className={classNames(BASE, ACTIVE, !show.left && 'invisible')}>
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
      </div>
      <div className="absolute inset-y-0 right-1 z-20 flex h-full items-center">
        <button
          onClick={() => swiper.slideNext()}
          className={classNames(BASE, show.left ? ACTIVE : STALE, !show.right && 'invisible')}
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>
    </>
  )
}

interface ButtonState {
  left: boolean
  right: boolean
}

const INITIAL_BUTTON_STATE = { left: false, right: true }

function reducer(_: ButtonState, position: 'start' | 'between' | 'end') {
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

export function CardNavigation({
  containerStyle,
  children,
  slidesPerView,
  spaceBetween,
  itemCount,
}: CardNavigationProps) {
  const [buttonState, setButtonState] = useReducer(reducer, INITIAL_BUTTON_STATE)

  return (
    <div className={classNames('relative flex overflow-hidden', containerStyle)}>
      <Swiper
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        watchSlidesProgress
        onReachBeginning={() => setButtonState('start')}
        onFromEdge={() => itemCount - slidesPerView > 0 && setButtonState('between')}
        onReachEnd={() => itemCount - slidesPerView >= 0 && setButtonState('end')}
      >
        {itemCount - slidesPerView >= 0 && <SlideButtons show={buttonState} />}
        {children}
        {/** empty slot */}
        <SwiperSlide />
        <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-1/2 bg-gradient-to-r from-transparent to-[#101728]" />
      </Swiper>
    </div>
  )
}
