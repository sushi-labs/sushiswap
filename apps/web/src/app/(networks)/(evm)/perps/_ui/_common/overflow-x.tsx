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
            className="z-10 flex items-center justify-center absolute top-0 left-0 h-full min-w-[30px] w-[30px] bg-gradient-to-r to-transparent from-white dark:from-background"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
        ) : null}
        {children}
        {!hideScrollBtns && hasOverflowRight ? (
          <button
            onClick={() => handleButtonClickScroll('right')}
            type="button"
            className="flex items-center z-10 justify-center absolute top-0 right-0 h-full min-w-[30px] w-[30px] bg-gradient-to-r from-transparent to-white dark:to-background"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        ) : null}
      </div>
    </div>
  )
}

const useIsOverflow = (ref: React.RefObject<HTMLElement | null>) => {
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
