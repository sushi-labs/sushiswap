'use client'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react-v1/solid'
import { classNames } from '@sushiswap/ui'
import { useEffect, useRef, useState } from 'react'

export const OverflowX = ({
  children,
  className,
  hideScrollBtns,
}: {
  children: React.ReactNode
  className?: string
  hideScrollBtns?: boolean
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { hasOverflowRight, hasOverflowLeft } = useIsOverflow(containerRef)

  useEffect(() => {
    const element = containerRef.current

    if (!element) return
    const scrollElement = element

    function handleWheelScroll(event: WheelEvent) {
      if (scrollElement.scrollWidth <= scrollElement.clientWidth) return
      if (event.ctrlKey) return

      const horizontalDelta = normalizeWheelDelta(
        event,
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY,
        scrollElement,
      )

      if (horizontalDelta === 0) return

      const maxScrollLeft =
        scrollElement.scrollWidth - scrollElement.clientWidth
      const nextScrollLeft = scrollElement.scrollLeft + horizontalDelta
      const canScrollLeft = horizontalDelta < 0 && scrollElement.scrollLeft > 0
      const canScrollRight =
        horizontalDelta > 0 && scrollElement.scrollLeft < maxScrollLeft

      if (!canScrollLeft && !canScrollRight) return

      event.preventDefault()
      event.stopPropagation()
      scrollElement.scrollLeft = Math.max(
        0,
        Math.min(nextScrollLeft, maxScrollLeft),
      )
    }

    scrollElement.addEventListener('wheel', handleWheelScroll, {
      passive: false,
    })

    return () => {
      scrollElement.removeEventListener('wheel', handleWheelScroll)
    }
  }, [])

  const handleButtonClickScroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth / 1.75
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }
  return (
    <div className="relative overflow-hidden">
      <div
        className={classNames(
          'snap-x overflow-x-auto hide-scrollbar',
          className,
        )}
        ref={containerRef}
      >
        {!hideScrollBtns && hasOverflowLeft ? (
          <button
            onClick={() => handleButtonClickScroll('left')}
            type="button"
            className="z-10 flex items-center justify-center absolute top-0 left-0 h-full min-w-[30px] w-[30px] bg-gradient-to-r to-transparent from-perps-background dark:from-[#161b1f]"
            aria-label="Scroll Left Horizontally"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
        ) : null}
        {children}
        {!hideScrollBtns && hasOverflowRight ? (
          <button
            onClick={() => handleButtonClickScroll('right')}
            type="button"
            className="flex items-center z-10 justify-center absolute top-0 right-0 h-full min-w-[30px] w-[30px] bg-gradient-to-r from-transparent to-perps-background dark:to-[#161b1f]"
            aria-label="Scroll Right Horizontally"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        ) : null}
      </div>
    </div>
  )
}

export const useIsOverflow = (ref: React.RefObject<HTMLElement | null>) => {
  const [hasOverflowRight, setHasOverflowRight] = useState(false)
  const [hasOverflowLeft, setHasOverflowLeft] = useState(false)

  useEffect(() => {
    const element = ref.current

    const update = () => {
      if (element) {
        const tolerance = 2
        const reachedEnd =
          element.scrollLeft + element.clientWidth >=
          element.scrollWidth - tolerance
        if (reachedEnd) {
          setHasOverflowRight(false)
        } else {
          setHasOverflowRight(element.scrollWidth > element.clientWidth)
        }
        setHasOverflowLeft(element.scrollLeft > 0)
      }
    }
    update()
    const ob = new ResizeObserver(update)
    if (element) ob.observe(element)
    window.addEventListener('resize', update)
    element?.addEventListener('scroll', update)
    return () => {
      window.removeEventListener('resize', update)
      element?.removeEventListener('scroll', update)
      ob.disconnect()
    }
  }, [ref])

  return { hasOverflowRight, hasOverflowLeft }
}

function normalizeWheelDelta(
  event: WheelEvent,
  delta: number,
  element: HTMLElement,
): number {
  switch (event.deltaMode) {
    case WheelEvent.DOM_DELTA_LINE:
      return delta * 16
    case WheelEvent.DOM_DELTA_PAGE:
      return delta * element.clientWidth
    default:
      return delta
  }
}
