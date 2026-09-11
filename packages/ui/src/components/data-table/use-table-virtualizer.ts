'use client'

import { useIsomorphicLayoutEffect } from '@sushiswap/hooks'
import {
  type Virtualizer,
  useVirtualizer,
  useWindowVirtualizer,
} from '@tanstack/react-virtual'
import { type RefObject, useState } from 'react'

interface TableVirtualizerOptions {
  containerRef: RefObject<HTMLDivElement | null>
  listRef: RefObject<HTMLElement | null>
  count: number
  estimateSize: number
  overscan: number
  getItemKey: (index: number) => string
  scrollMode: 'element' | 'window'
  loading: boolean
}

/** Keeps page-scrolling tables aligned when content above them changes height. */
export function useTableVirtualizer({
  containerRef,
  listRef,
  count,
  estimateSize,
  overscan,
  getItemKey,
  scrollMode,
  loading,
}: TableVirtualizerOptions): {
  virtualizer:
    | Virtualizer<HTMLDivElement, HTMLElement>
    | Virtualizer<Window, HTMLElement>
  scrollMargin: number
} {
  const [layout, setLayout] = useState({ visible: false, scrollMargin: 0 })

  useIsomorphicLayoutEffect(() => {
    if (scrollMode === 'element') return
    function measureLayout() {
      const container = containerRef.current
      const list = listRef.current
      const next = {
        visible: Boolean(
          container && container.getBoundingClientRect().width > 0,
        ),
        scrollMargin:
          scrollMode === 'window' && list
            ? list.getBoundingClientRect().top + window.scrollY
            : 0,
      }
      setLayout((previous) =>
        previous.visible === next.visible &&
        previous.scrollMargin === next.scrollMargin
          ? previous
          : next,
      )
    }

    measureLayout()
    const observer = new ResizeObserver(measureLayout)
    if (containerRef.current) observer.observe(containerRef.current)
    observer.observe(document.body)
    window.addEventListener('resize', measureLayout)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measureLayout)
    }
  }, [containerRef, listRef, scrollMode, count, loading])

  const elementVirtualizer = useVirtualizer<HTMLDivElement, HTMLElement>({
    count,
    getScrollElement: () => containerRef.current,
    estimateSize: () => estimateSize,
    overscan,
    getItemKey,
    enabled: scrollMode === 'element',
  })
  const windowVirtualizer = useWindowVirtualizer<HTMLElement>({
    count,
    estimateSize: () => estimateSize,
    overscan,
    getItemKey,
    scrollMargin: scrollMode === 'window' ? layout.scrollMargin : 0,
    enabled: scrollMode === 'window' && layout.visible,
  })

  return {
    virtualizer:
      scrollMode === 'window' ? windowVirtualizer : elementVirtualizer,
    scrollMargin: scrollMode === 'window' ? layout.scrollMargin : 0,
  }
}
