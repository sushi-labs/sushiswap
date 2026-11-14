'use client'

import { type RefObject, useLayoutEffect } from 'react'

// Where the last trade widget sat (document coordinates) and when it left.
// Module state persists across client-side navigations, not page loads.
let previous: { left: number; top: number; leftAt: number } | undefined
let lastMoveAt = 0

// Only a widget that replaces another this recently is the same "move".
const HANDOFF_MS = 1_500
const DURATION_MS = 350
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getPosition(element: HTMLElement): { left: number; top: number } {
  const rect = element.getBoundingClientRect()
  return { left: rect.left + window.scrollX, top: rect.top + window.scrollY }
}

/**
 * Slides a trade widget from where the previous page's widget was, e.g. from
 * the centred swap form to the limit form's column, instead of jumping.
 */
export function useTradeWidgetTransition(
  ref: RefObject<HTMLElement | null>,
): void {
  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    // Measure the laid-out position, not one shifted by a running slide (e.g.
    // from StrictMode's second mount in development).
    for (const animation of element.getAnimations()) animation.cancel()
    const from = previous
    const to = getPosition(element)
    const dx = from ? from.left - to.left : 0
    const dy = from ? from.top - to.top : 0
    if (
      from &&
      Date.now() - from.leftAt < HANDOFF_MS &&
      (Math.abs(dx) > 1 || Math.abs(dy) > 1) &&
      !prefersReducedMotion()
    ) {
      lastMoveAt = Date.now()
      element.animate(
        [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
        { duration: DURATION_MS, easing: EASING },
      )
    }

    // The element may already be hidden when this unmounts, so keep a
    // fallback position up to date while mounted.
    let position = to
    const observer = new ResizeObserver(() => {
      if (!element.getAnimations().length) position = getPosition(element)
    })
    observer.observe(document.body)
    return () => {
      observer.disconnect()
      // Prefer where it visibly is, so an interrupted slide hands off smoothly.
      const visible =
        element.isConnected && element.getBoundingClientRect().width > 0
      previous = {
        ...(visible ? getPosition(element) : position),
        leftAt: Date.now(),
      }
    }
  }, [ref])
}

/**
 * Fades in content that appears beside a widget that just moved. Its layout
 * effect must run after the widget's: call it from a parent or later sibling.
 */
export function useTradeWidgetCompanionTransition(
  ref: RefObject<HTMLElement | null>,
): void {
  useLayoutEffect(() => {
    const element = ref.current
    if (!element || Date.now() - lastMoveAt > 100) return
    for (const animation of element.getAnimations()) animation.cancel()
    element.animate(
      [
        { opacity: 0, transform: 'translateX(24px)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: DURATION_MS, delay: 120, easing: EASING, fill: 'backwards' },
    )
  }, [ref])
}
