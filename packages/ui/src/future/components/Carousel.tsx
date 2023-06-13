import { classNames } from '../../index'
import React, { ReactNode, useCallback, useMemo, useRef, useState } from 'react'
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/20/solid'

interface Carousel<T> {
  slideWidth?: number
  slides: T[]
  render(slide: T): ReactNode
  containerWidth?: number
  className?: string
}

export const Carousel = <T extends object>({
  containerWidth = 1280,
  slideWidth = 400,
  slides,
  render,
  className,
}: Carousel<T>) => {
  const [buttons, setButtons] = useState({
    hasNext: true,
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
        hasNext: ref.current?.scrollWidth - ref.current?.scrollLeft - slideWidth > container.current?.clientWidth,
        hasPrev: true,
      })
    }
  }, [slideWidth])

  return (
    <div className="relative group">
      <div ref={container} className="overflow-hidden">
        <div
          ref={ref}
          className="overflow-x-scroll overflow-x-contain whitespace-nowrap snap-x relative hide-scrollbar scroll-smooth"
        >
          <div className={classNames(className, 'w-full align-top inline-flex pt-2.5 pb-10')}>
            {slides.map((el, i) => (
              <div key={i} className="inline-block snap-start">
                <div
                  className={classNames(i === 0 ? 'ml-0' : i === slides.length - 1 ? 'pr-4' : '', 'flex mr-5 h-full')}
                  style={{ transform: `translateX(calc(max(${containerWidth}px, 100vw)/2 - ${containerWidth / 2}px))` }}
                >
                  {render(el)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {buttons.hasPrev && (
        <div className="scale-[0.8] group-hover:scale-[1] opacity-0 group-hover:opacity-100 flex absolute top-0 left-4 bottom-0 items-center transition-all">
          <div
            role="button"
            onClick={() => prev()}
            className="rounded-full bg-gray-200/80 dark:bg-slate-700/80 p-3 cursor-pointer"
          >
            <ChevronLeftIcon width={32} height={32} />
          </div>
        </div>
      )}
      {buttons.hasNext && (
        <div className="scale-[0.8] group-hover:scale-[1] opacity-0 group-hover:opacity-100 flex absolute top-0 right-4 bottom-0 items-center transition-all">
          <div
            role="button"
            onClick={() => next()}
            className="rounded-full bg-gray-200/80 dark:bg-slate-700/80 p-3 cursor-pointer"
          >
            <ChevronRightIcon width={32} height={32} />
          </div>
        </div>
      )}
    </div>
  )
}
