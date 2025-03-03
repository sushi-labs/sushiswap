'use client'

import type { FC, ReactNode } from 'react'
import { animated, useSpring } from 'react-spring'
import useResizeObserver from 'use-resize-observer'

interface Collapsible {
  open: boolean
  children: ReactNode
  className?: string
  afterChange?: () => void
}

const AnimatedDiv = animated.div as any

export const Collapsible: FC<Collapsible> = ({
  className,
  open,
  children,
  afterChange,
}) => {
  const { ref, height } = useResizeObserver()

  const props = useSpring({
    height: open ? (height ?? 0) : 0,
    config: {
      mass: 1.2,
      tension: 300,
      friction: 20,
      clamp: true,
      velocity: 0.01,
    },
    onRest: afterChange,
  })

  return (
    <AnimatedDiv
      style={{
        ...props,
        overflow: 'hidden',
        width: '100%',
        willChange: 'height',
      }}
    >
      <div ref={ref} className={className}>
        {children}
      </div>
    </AnimatedDiv>
  )
}
