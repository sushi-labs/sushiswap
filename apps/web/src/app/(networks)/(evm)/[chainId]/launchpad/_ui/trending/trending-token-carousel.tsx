'use client'

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import {
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

export interface TrendingTokenSlide {
  id: string
  name: string
  content: ReactNode
}

function getSlideStride(viewport: HTMLDivElement): number {
  const gap =
    Number.parseFloat(window.getComputedStyle(viewport).columnGap) || 0
  return viewport.clientWidth + gap
}

export function TrendingTokenCarousel({
  slides,
}: {
  slides: readonly TrendingTokenSlide[]
}): ReactElement | null {
  const viewportRef = useRef<HTMLDivElement>(null)
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [selection, setSelection] = useState({ index: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const slideCount = slides.length
  const activeIndex = Math.max(0, Math.min(selection.index, slideCount - 1))
  const activeIndexRef = useRef(activeIndex)

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  const selectSlide = useCallback((index: number) => {
    const viewport = viewportRef.current
    if (!viewport) return

    setSelection({ index })
    viewport.scrollTo({
      left: getSlideStride(viewport) * index,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    })
  }, [])

  useEffect(() => {
    if (
      slideCount < 2 ||
      isHovered ||
      isFocused ||
      isScrolling ||
      isHidden ||
      isPaused
    ) {
      return
    }

    const timer = setTimeout(() => {
      const index = Math.max(0, Math.min(selection.index, slideCount - 1))
      selectSlide((index + 1) % slideCount)
    }, 5_000)
    return () => clearTimeout(timer)
  }, [
    selection,
    slideCount,
    isHovered,
    isFocused,
    isScrolling,
    isHidden,
    isPaused,
    selectSlide,
  ])

  useEffect(() => {
    function handleVisibilityChange() {
      setIsHidden(document.hidden)
    }

    handleVisibilityChange()
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearTimeout(scrollTimerRef.current)
    }
  }, [])

  // Keep the selected slide aligned when the viewport or item count changes.
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport || slideCount === 0) return

    const observer = new ResizeObserver(() => {
      viewport.scrollTo({
        left: getSlideStride(viewport) * activeIndexRef.current,
        behavior: 'instant',
      })
    })
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [slideCount])

  if (slideCount === 0) return null

  return (
    <section
      aria-label="Trending tokens"
      aria-roledescription="carousel"
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setIsHovered(true)
      }}
      onPointerLeave={() => setIsHovered(false)}
      onFocusCapture={(event) =>
        setIsFocused(event.target.matches(':focus-visible'))
      }
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsFocused(false)
        }
      }}
    >
      {slideCount > 1 && (
        <button
          type="button"
          className="sr-only focus:not-sr-only focus:mb-2 focus:rounded focus:p-2 focus:ring-2 focus:ring-white"
          onClick={() => setIsPaused((paused) => !paused)}
        >
          {isPaused ? 'Resume' : 'Pause'} automatic rotation
        </button>
      )}
      <div
        ref={viewportRef}
        className="flex gap-4 w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={() => {
          setIsScrolling(true)
          clearTimeout(scrollTimerRef.current)
          scrollTimerRef.current = setTimeout(() => {
            const viewport = viewportRef.current
            if (viewport && viewport.clientWidth > 0) {
              setSelection({
                index: Math.max(
                  0,
                  Math.min(
                    slideCount - 1,
                    Math.round(viewport.scrollLeft / getSlideStride(viewport)),
                  ),
                ),
              })
            }
            setIsScrolling(false)
          }, 150)
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slideCount}: ${slide.name}`}
            inert={index !== activeIndex}
            className="w-full min-w-0 shrink-0 snap-start snap-always"
          >
            {slide.content}
          </div>
        ))}
      </div>
      {slideCount > 1 && (
        <div className="mt-3 hidden items-center justify-center gap-1 lg:flex">
          <button
            type="button"
            aria-label="Previous trending token"
            onClick={() =>
              selectSlide((activeIndex - 1 + slideCount) % slideCount)
            }
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Show ${slide.name}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => selectSlide(index)}
              className="group flex h-9 w-5 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span
                className={`h-3 w-3 rounded-full transition-colors motion-reduce:transition-none ${
                  index === activeIndex
                    ? 'bg-white/80'
                    : 'bg-white/25 group-hover:bg-white/50'
                }`}
              />
            </button>
          ))}
          <button
            type="button"
            aria-label="Next trending token"
            onClick={() => selectSlide((activeIndex + 1) % slideCount)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ArrowRightIcon className="h-6 w-6" />
          </button>
        </div>
      )}
    </section>
  )
}
