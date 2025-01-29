'use client'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import React, {
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import classNames from 'classnames'

interface CarouselProps<T> {
  defaultSlide?: number
  slideWidth?: number
  slides: T[]
  render(slide: T, i: number): ReactNode
  containerWidth?: number
  className?: string
}

export const Carousel = <T,>({
  defaultSlide = 0,
  containerWidth = 1280,
  slideWidth = 400,
  slides,
  render,
  className,
}: CarouselProps<T>) => {
  const [buttons, setButtons] = useState({
    hasNext: slides.length > 1,
    hasPrev: false,
  })

  const container = useRef<HTMLDivElement | null>(null)
  const ref = useRef<HTMLDivElement | null>(null)

  const prev = useCallback(() => {
    requestAnimationFrame(() => {
      if (ref.current) {
        const scrollLeft = ref.current.scrollLeft
        ref.current.scrollLeft = scrollLeft - slideWidth
      }
    })

    if (ref.current) {
      setButtons({
        hasNext: true,
        hasPrev: ref.current?.scrollLeft - slideWidth > 20,
      })
    }
  }, [slideWidth])

  const next = useCallback(() => {
    requestAnimationFrame(() => {
      if (ref.current) {
        const scrollLeft = ref.current.scrollLeft
        ref.current.scrollLeft = scrollLeft + slideWidth
      }
    })

    if (ref.current && container.current) {
      setButtons({
        hasNext:
          ref.current?.scrollWidth - ref.current?.scrollLeft - slideWidth >
          container.current?.clientWidth,
        hasPrev: true,
      })
    }
  }, [slideWidth])

  useLayoutEffect(() => {
    if (defaultSlide > 0) {
      requestAnimationFrame(() => {
        if (ref.current) {
          const scrollLeft = ref.current.scrollLeft
          ref.current.scrollLeft = scrollLeft + slideWidth * (defaultSlide - 1)
        }
      })

      if (ref.current && container.current) {
        setButtons({
          hasNext:
            ref.current?.scrollWidth -
              ref.current?.scrollLeft -
              slideWidth * (defaultSlide - 1) >
            container.current?.clientWidth,
          hasPrev: true,
        })
      }
    }
  }, [defaultSlide, slideWidth])

  return (
    <div className="relative group">
      <div ref={container} className="overflow-hidden">
        <div
          ref={ref}
          className="relative overflow-x-scroll overflow-x-contain whitespace-nowrap snap-x hide-scrollbar scroll-smooth pt-4 pb-10"
        >
          <div
            className={classNames(className, 'w-full align-top inline-flex')}
          >
            {slides.map((el, i) => (
              <div key={i} className="inline-block snap-start">
                <div
                  className={classNames(
                    i === 0 ? 'ml-0' : i === slides.length - 1 ? 'pr-4' : '',
                    'flex mr-5 h-full',
                  )}
                  style={{
                    transform: `translateX(calc(max(${containerWidth}px, 100vw)/2 - ${
                      containerWidth / 2
                    }px))`,
                  }}
                >
                  <span />
                  {render(el, i)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {buttons.hasPrev && (
        <div className="scale-[0.8] group-hover:scale-[1] opacity-0 group-hover:opacity-100 flex absolute top-0 left-4 bottom-0 items-center transition-all">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            className="shadow-md hover:border-accent border border-transparent p-3 rounded-full cursor-pointer bg-gray-200 dark:bg-slate-700"
          >
            <ChevronLeftIcon width={32} height={32} />
          </button>
        </div>
      )}
      {buttons.hasNext && (
        <div className="scale-[0.8] group-hover:scale-[1] opacity-0 group-hover:opacity-100 flex absolute top-0 right-4 bottom-0 items-center transition-all">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            className="shadow-md hover:border-accent border border-transparent p-3 rounded-full cursor-pointer bg-gray-200 dark:bg-slate-700"
          >
            <ChevronRightIcon width={32} height={32} />
          </button>
        </div>
      )}
    </div>
  )
}
