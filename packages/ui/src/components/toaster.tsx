'use client'

import { ToasterToast, useToast } from './use-toast'
import {
  ToastClose,
  ToastDescription,
  Toastnew,
  ToastProvider,
  ToastViewport,
  ToastVisual,
} from './toastnew'
import { classNames } from '../index'

const calculateMaxHeights = (toasts: ToasterToast[]) => {
  const heights = toasts.map((toast, i) => {
    let maxHeight = 70
    if (toast.visual) {
      maxHeight += 124
    }

    return maxHeight
  })

  const firstElement = heights[0]
  let hoverTranslateY = 0
  let translateY = 0
  let paddingBetweenToasts = 20
  return heights.map((height, i) => {
    const data = {
      hoverTranslateY,
      hoverHeight: height,
      translateY: i === 0 ? 0 : firstElement,
      stackedHeight: height > firstElement ? firstElement : height,
      isReduced: height > firstElement,
      scale: 1 - i * 0.05,
    }

    hoverTranslateY += height + paddingBetweenToasts
    return data
  })
}

export function Toaster() {
  const { toasts } = useToast()
  const heights = calculateMaxHeights(toasts)

  console.log(heights)
  return (
    <ToastProvider>
      {toasts
        .filter((el) => el.open)
        .map(function ({ id, description, visual, action, ...props }, i) {
          const {
            hoverTranslateY,
            translateY,
            stackedHeight,
            hoverHeight,
            isReduced,
            scale,
          } = heights[i]

          return (
            <Toastnew
              duration={100000000}
              key={id}
              {...props}
              className={classNames(
                isReduced ? 'overflow-hidden group-hover:overflow-visible' : '',
                'group-hover:!translate-3d-0 group-hover:!max-h-[var(--maxHeight)]',
              )}
              style={
                {
                  maxHeight: `${stackedHeight}px`,
                  '--maxHeight': `${hoverHeight}px`,
                  '--tw-translate-x': 0,
                  '--tw-translate-y': `${-hoverTranslateY}px`,
                  '--tw-translate-z': `${-1 * i}px`,
                  transform: `translate3d(0px, calc(${-translateY}px + ${
                    100 * (i > 0 ? 1 : 0)
                  }% + ${-20 * i}px), ${-1 * i}px) scale(${scale})`,
                } as React.CSSProperties
              }
            >
              <div className="flex flex-col gap-4 max-w-full">
                {visual && <ToastVisual>{visual}</ToastVisual>}
                {description && (
                  <ToastDescription>
                    {description}
                    <ToastClose />
                  </ToastDescription>
                )}
                {action}
              </div>
            </Toastnew>
          )
        })}
      <ToastViewport />
    </ToastProvider>
  )
}
