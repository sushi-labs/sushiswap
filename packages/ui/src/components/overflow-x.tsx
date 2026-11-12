'use client'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { type VariantProps, cva } from 'class-variance-authority'
import classNames from 'classnames'
import {
  type ReactElement,
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from 'react'

const scrollButtonVariants = cva(
  'z-10 flex items-center justify-center absolute top-0 h-full min-w-[30px] w-[30px] to-transparent',
  {
    variants: {
      variant: {
        default: 'from-background',
        perps: 'from-perps-background dark:from-[#161b1f]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface OverflowXProps
  extends VariantProps<typeof scrollButtonVariants> {
  children: ReactNode
  className?: string
  wrapperClassName?: string
  hideScrollBtns?: boolean
}

export function OverflowX({
  children,
  className,
  wrapperClassName,
  hideScrollBtns,
  variant,
}: OverflowXProps): ReactElement {
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

  function handleButtonClickScroll(direction: 'left' | 'right') {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth / 1.75
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }
  return (
    <div className={classNames('relative overflow-hidden', wrapperClassName)}>
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
            className={scrollButtonVariants({
              variant,
              className: 'left-0 bg-gradient-to-r',
            })}
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
            className={scrollButtonVariants({
              variant,
              className: 'right-0 bg-gradient-to-l',
            })}
            aria-label="Scroll Right Horizontally"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        ) : null}
      </div>
    </div>
  )
}

export function useIsOverflow(ref: RefObject<HTMLElement | null>): {
  hasOverflowRight: boolean
  hasOverflowLeft: boolean
} {
  const [hasOverflowRight, setHasOverflowRight] = useState(false)
  const [hasOverflowLeft, setHasOverflowLeft] = useState(false)

  useEffect(() => {
    const element = ref.current

    function update() {
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
